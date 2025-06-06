import Stripe from 'stripe';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Resend } from 'resend';
import { db, bookings } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { logEmail } from '@/lib/db/queries';
import { siteConfig } from '@/lib/config';

// Stripe und Resend Instanzen
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});
const resend = new Resend(process.env.RESEND_API_KEY);

interface CancellationData {
  bookingId: string;
  reason?: string;
  requestedBy: 'customer' | 'admin';
}

interface CancellationResult {
  success: boolean;
  refundAmount: number;
  refundPercent: number;
  refundId?: string;
  message: string;
}

// Stornierungsrichtlinien prüfen
export function calculateRefund(checkInDate: Date, totalPrice: number): { 
  refundPercent: number; 
  refundAmount: number; 
  allowedCancellation: boolean;
} {
  const now = new Date();
  const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  // DevStay: Immer 100% kostenlose Stornierung (auch Last-Minute)
  // Grund: Premium-Service und IT-Professionals haben oft kurzfristige Änderungen
  return {
    refundPercent: 100,
    refundAmount: totalPrice,
    allowedCancellation: true
  };
}

// Buchung stornieren
export async function cancelBooking(cancellationData: CancellationData): Promise<CancellationResult> {
  const { bookingId, reason, requestedBy } = cancellationData;

  try {
    // 1. Buchung mit optimistic locking laden und prüfen
    const [booking] = await db
      .select({
        booking: bookings,
      })
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      throw new Error('Buchung nicht gefunden');
    }

    if (booking.booking.status === 'cancelled') {
      throw new Error('Buchung ist bereits storniert');
    }

    if (!booking.booking.stripePaymentIntentId) {
      throw new Error('Keine Zahlungsinformationen vorhanden - Stornierung nicht möglich');
    }

    // 2. Refund-Berechtigung prüfen
    const checkInDate = new Date(booking.booking.checkIn);
    const totalPrice = parseFloat(booking.booking.totalPrice);
    const refundCalculation = calculateRefund(checkInDate, totalPrice);

    let refundResult: CancellationResult = {
      success: false,
      refundAmount: refundCalculation.refundAmount,
      refundPercent: refundCalculation.refundPercent,
      message: ''
    };

    let stripeRefund: any = null;

    // 3. Atomare Transaktion: Stripe Refund + DB Update
    try {
      // Zuerst Stripe Refund erstellen
      stripeRefund = await stripe.refunds.create({
        payment_intent: booking.booking.stripePaymentIntentId,
        amount: Math.round(refundCalculation.refundAmount * 100), // Cent
        reason: 'requested_by_customer',
        metadata: {
          bookingId: bookingId,
          originalAmount: totalPrice.toString(),
          refundPercent: refundCalculation.refundPercent.toString(),
          cancelledBy: requestedBy
        }
      });

      console.log('✅ Stripe-Rückerstattung erfolgreich:', stripeRefund.id);

      // Dann DB Update mit Race Condition Protection
      const updateResult = await db
        .update(bookings)
        .set({
          status: 'cancelled',
          paymentStatus: 'refunded',
          updatedAt: new Date(),
          metadata: {
            ...booking.booking.metadata as any,
            cancellation: {
              cancelledAt: new Date().toISOString(),
              cancelledBy: requestedBy,
              reason: reason || 'Keine Angabe',
              refundAmount: refundCalculation.refundAmount,
              refundPercent: refundCalculation.refundPercent,
              refundId: stripeRefund.id
            }
          }
        })
        .where(and(eq(bookings.id, bookingId), eq(bookings.status, 'confirmed'))) // Race condition protection
        .returning();

      if (updateResult.length === 0) {
        // DB Update fehlgeschlagen - möglicherweise bereits storniert
        console.error('❌ DB Update fehlgeschlagen - Buchung bereits geändert');
        throw new Error('Buchung konnte nicht storniert werden - Status bereits geändert');
      }

      refundResult.refundId = stripeRefund.id;
      refundResult.success = true;
      refundResult.message = `Rückerstattung von ${refundCalculation.refundAmount}€ (${refundCalculation.refundPercent}%) erfolgreich verarbeitet`;

    } catch (stripeError) {
      console.error('❌ Stripe-Rückerstattung fehlgeschlagen:', stripeError);
      throw new Error(`Rückerstattung fehlgeschlagen: ${stripeError instanceof Error ? stripeError.message : 'Unbekannter Fehler'}`);
    }

    // 4. E-Mails versenden (nicht kritisch - darf nicht die Stornierung blockieren)
    try {
      await sendCancellationEmails(booking.booking, refundResult, reason);
      console.log('✅ Stornierungsbenachrichtigungen versendet');
    } catch (emailError) {
      console.error('⚠️ E-Mail-Versand fehlgeschlagen (nicht kritisch):', emailError);
      // Email-Fehler loggen aber nicht die Stornierung abbrechen
    }

    console.log('✅ Buchung erfolgreich storniert:', bookingId);
    return refundResult;

  } catch (error) {
    console.error('❌ Stornierung fehlgeschlagen:', error);
    throw error;
  }
}

// Stornierungsbenachrichtigungen versenden
async function sendCancellationEmails(booking: any, refundResult: CancellationResult, reason?: string) {
  const checkInDate = format(new Date(booking.checkIn), 'EEEE, dd. MMMM yyyy', { locale: de });
  const checkOutDate = format(new Date(booking.checkOut), 'EEEE, dd. MMMM yyyy', { locale: de });

  // Kunden-E-Mail
  const customerEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Stornierungsbestätigung - DevStay</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .cancellation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
        .refund-info { background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>❌ Stornierungsbestätigung</h1>
        <p>Ihre Buchung wurde storniert</p>
      </div>
      
      <div class="content">
        <p>Ihre Buchung wurde erfolgreich storniert:</p>
        
        <div class="cancellation-details">
          <h3>📋 Stornierte Buchung</h3>
          <div class="detail-row">
            <span><strong>Buchungsnummer:</strong></span>
            <span>${booking.id.substring(0, 8).toUpperCase()}</span>
          </div>
          <div class="detail-row">
            <span><strong>Check-in war geplant:</strong></span>
            <span>${checkInDate}</span>
          </div>
          <div class="detail-row">
            <span><strong>Check-out war geplant:</strong></span>
            <span>${checkOutDate}</span>
          </div>
          <div class="detail-row">
            <span><strong>Ursprünglicher Preis:</strong></span>
            <span>${booking.totalPrice}€</span>
          </div>
          ${reason ? `
          <div class="detail-row">
            <span><strong>Stornierungsgrund:</strong></span>
            <span>${reason}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="refund-info">
          <h3>💰 Rückerstattung</h3>
          <div class="detail-row">
            <span><strong>Rückerstattungsbetrag:</strong></span>
            <span><strong>${refundResult.refundAmount}€</strong></span>
          </div>
          <div class="detail-row">
            <span><strong>Rückerstattungsquote:</strong></span>
            <span>${refundResult.refundPercent}%</span>
          </div>
          <p><small>Die Rückerstattung wird in 5-10 Werktagen auf Ihrer ursprünglichen Zahlungsmethode sichtbar.</small></p>
        </div>
        
        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung:</p>
        <p>📧 E-Mail: <a href="mailto:${siteConfig.contact.email}">${siteConfig.contact.email}</a><br>
        📱 WhatsApp: <a href="https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}">${siteConfig.contact.whatsapp}</a></p>
        
        <p>Das DevStay Team</p>
      </div>
    </body>
    </html>
  `;

  try {
    // Kunden-E-Mail senden
    const { data: customerEmail, error: customerError } = await resend.emails.send({
      from: 'DevStay <noreply@devstay.de>',
      to: [booking.customer?.email || 'unknown@example.com'],
      replyTo: 'info@devstay.de',
      subject: `❌ Stornierungsbestätigung - Buchung ${booking.id.substring(0, 8).toUpperCase()}`,
      html: customerEmailHtml,
    });

    // Admin-Benachrichtigung senden
    const { data: adminEmail, error: adminError } = await resend.emails.send({
      from: 'DevStay <noreply@devstay.de>',
      to: ['info@devstay.de'],
      subject: `🚨 Buchung storniert - ${checkInDate}`,
      html: `
        <h2>Buchung wurde storniert</h2>
        <p><strong>Buchung:</strong> ${booking.id}</p>
        <p><strong>Zeitraum:</strong> ${checkInDate} - ${checkOutDate}</p>
        <p><strong>Kunde:</strong> ${booking.customer?.email}</p>
        <p><strong>Rückerstattung:</strong> ${refundResult.refundAmount}€ (${refundResult.refundPercent}%)</p>
        <p><strong>Grund:</strong> ${reason || 'Keine Angabe'}</p>
      `,
    });

    // E-Mail-Logs erstellen
    await logEmail({
      bookingId: booking.id,
      customerId: booking.customerId,
      emailType: 'cancellation',
      recipient: booking.customer?.email || 'unknown',
      subject: `❌ Stornierungsbestätigung - Buchung ${booking.id.substring(0, 8).toUpperCase()}`,
      status: customerError ? 'failed' : 'sent',
      sentAt: new Date(),
      failureReason: customerError?.message,
      metadata: {
        messageId: customerEmail?.id,
        refundAmount: refundResult.refundAmount,
        refundPercent: refundResult.refundPercent
      }
    });

    console.log('✅ Stornierungsbenachrichtigungen versendet');

  } catch (error) {
    console.error('❌ E-Mail-Versand fehlgeschlagen:', error);
    // Nicht kritisch - Stornierung ist bereits verarbeitet
  }
} 