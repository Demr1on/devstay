import Stripe from 'stripe';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Resend } from 'resend';
import { db, bookings } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { logEmail } from '@/lib/db/queries';

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

  if (hoursUntilCheckIn >= 48) {
    // 48+ Stunden: 100% Rückerstattung
    return {
      refundPercent: 100,
      refundAmount: totalPrice,
      allowedCancellation: true
    };
  } else if (hoursUntilCheckIn >= 24) {
    // 24-48 Stunden: 50% Rückerstattung
    return {
      refundPercent: 50,
      refundAmount: Math.round(totalPrice * 0.5),
      allowedCancellation: true
    };
  } else {
    // Weniger als 24 Stunden: Keine Rückerstattung
    return {
      refundPercent: 0,
      refundAmount: 0,
      allowedCancellation: false
    };
  }
}

// Buchung stornieren
export async function cancelBooking(cancellationData: CancellationData): Promise<CancellationResult> {
  const { bookingId, reason, requestedBy } = cancellationData;

  try {
    // 1. Buchung aus Datenbank laden
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

    // 3. Stripe-Rückerstattung verarbeiten
    if (refundCalculation.refundAmount > 0 && booking.booking.stripePaymentIntentId) {
      try {
        const refund = await stripe.refunds.create({
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

        refundResult.refundId = refund.id;
        refundResult.success = true;
        refundResult.message = `Rückerstattung von ${refundCalculation.refundAmount}€ (${refundCalculation.refundPercent}%) erfolgreich verarbeitet`;
        
        console.log('✅ Stripe-Rückerstattung erfolgreich:', refund.id);

      } catch (stripeError) {
        console.error('❌ Stripe-Rückerstattung fehlgeschlagen:', stripeError);
        throw new Error(`Rückerstattung fehlgeschlagen: ${stripeError instanceof Error ? stripeError.message : 'Unbekannter Fehler'}`);
      }
    } else if (refundCalculation.refundAmount === 0) {
      refundResult.success = true;
      refundResult.message = 'Stornierung ohne Rückerstattung (weniger als 24h vor Check-in)';
    }

    // 4. Buchungsstatus in Datenbank aktualisieren
    await db
      .update(bookings)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
        metadata: {
          ...booking.booking.metadata as any,
          cancellation: {
            cancelledAt: new Date().toISOString(),
            cancelledBy: requestedBy,
            reason: reason || 'Keine Angabe',
            refundAmount: refundCalculation.refundAmount,
            refundPercent: refundCalculation.refundPercent,
            refundId: refundResult.refundId
          }
        }
      })
      .where(eq(bookings.id, bookingId));

    // 5. E-Mails versenden
    await sendCancellationEmails(booking.booking, refundResult, reason);

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
        
        ${refundResult.refundAmount > 0 ? `
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
        ` : `
        <div class="refund-info">
          <h3>ℹ️ Keine Rückerstattung</h3>
          <p>Aufgrund unserer Stornierungsbedingungen (weniger als 24 Stunden vor Check-in) erfolgt keine Rückerstattung.</p>
        </div>
        `}
        
        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung:</p>
        <p>📧 E-Mail: <a href="mailto:info@devstay.de">info@devstay.de</a><br>
        📱 WhatsApp: <a href="https://wa.me/4917641847930">+49 176 41847930</a></p>
        
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