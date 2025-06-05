import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getBookingByStripeSession, updateBookingStatus, logEmail } from '@/lib/db/queries';
import { db, bookings } from '@/lib/db/index';
import { eq } from 'drizzle-orm';

// Stripe-Konfiguration überprüfen
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY ist nicht gesetzt in den Umgebungsvariablen');
}

// Stripe-Instanz
const stripe = new Stripe(stripeSecretKey || 'sk_test_dummy_key_for_build', {
  apiVersion: '2025-05-28.basil',
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  console.log('🔔 Webhook aufgerufen:', new Date().toISOString());
  
  // Runtime-Überprüfung der Stripe-Konfiguration
  if (!stripeSecretKey || stripeSecretKey === 'sk_test_dummy_key_for_build') {
    console.error('❌ Stripe Secret Key nicht verfügbar');
    return NextResponse.json(
      { error: 'Webhook service nicht verfügbar' },
      { status: 503 }
    );
  }

  if (!webhookSecret) {
    console.error('❌ Webhook Secret nicht verfügbar');
    return NextResponse.json(
      { error: 'Webhook Secret nicht konfiguriert' },
      { status: 503 }
    );
  }

  const sig = req.headers.get('stripe-signature');
  console.log('🔐 Stripe Signature vorhanden:', !!sig);
  
  if (!sig) {
    console.error('❌ Keine Stripe-Signatur gefunden');
    return NextResponse.json(
      { error: 'Keine Stripe-Signatur' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Den rohen Body für Stripe lesen
    const body = await req.text();
    console.log('📦 Body Länge:', body.length);
    
    // Event konstruieren und Signatur verifizieren
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log('✅ Webhook-Event erfolgreich verifiziert:', event.type, event.id);
  } catch (err) {
    console.error(`❌ Webhook-Signatur-Fehler: ${err instanceof Error ? err.message : err}`);
    console.error('🔧 Webhook Secret (erste 10 Zeichen):', webhookSecret?.substring(0, 10));
    return NextResponse.json(
      { error: 'Webhook-Signatur-Verification fehlgeschlagen' },
      { status: 400 }
    );
  }

  // Event erfolgreich verifiziert
  console.log('✅ Webhook-Event erfolgreich empfangen:', event.id, event.type);

  // Event-Handler basierend auf Event-Typ
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('💰 Zahlung erfolgreich für Session:', session.id);
        
        // Hier würdest du normalerweise:
        // 1. Buchung in Datenbank speichern
        // 2. Bestätigungs-E-Mail senden
        // 3. Kalender aktualisieren
        await handleSuccessfulPayment(session);
        break;

      case 'checkout.session.async_payment_succeeded':
        const asyncSession = event.data.object as Stripe.Checkout.Session;
        console.log('💰 Asynchrone Zahlung erfolgreich für Session:', asyncSession.id);
        await handleSuccessfulPayment(asyncSession);
        break;

      case 'checkout.session.async_payment_failed':
        const failedSession = event.data.object as Stripe.Checkout.Session;
        console.log('❌ Asynchrone Zahlung fehlgeschlagen für Session:', failedSession.id);
        await handleFailedPayment(failedSession);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💳 PaymentIntent erfolgreich:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('❌ PaymentIntent fehlgeschlagen:', failedPayment.id);
        break;

      case 'charge.refunded':
        const refundedCharge = event.data.object as Stripe.Charge;
        console.log('💰 Refund verarbeitet für Charge:', refundedCharge.id);
        await handleRefundProcessed(refundedCharge);
        break;

      case 'charge.dispute.created':
        const dispute = event.data.object as Stripe.Dispute;
        console.log('⚠️ Streitfall erstellt für Charge:', dispute.charge);
        await handleDispute(dispute);
        break;

      default:
        console.log(`🔔 Unbehandelter Event-Typ: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Fehler beim Verarbeiten des Webhook-Events:', error);
    return NextResponse.json(
      { error: 'Event-Verarbeitung fehlgeschlagen' },
      { status: 500 }
    );
  }
}

// Handler für erfolgreiche Zahlungen
async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  console.log('🎉 Verarbeite erfolgreiche Zahlung für Session:', session.id);
  
  try {
    // 1. Buchung in Datenbank finden und aktualisieren
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        stripePaymentIntentId: session.payment_intent as string,
        status: 'confirmed',
        paymentStatus: 'paid',
        updatedAt: new Date(),
      })
      .where(eq(bookings.stripeSessionId, session.id))
      .returning();

    if (!updatedBooking) {
      console.error('❌ Buchung für Session nicht gefunden:', session.id);
      return;
    }

    console.log('✅ Buchung bestätigt:', {
      bookingId: updatedBooking.id,
      customerEmail: session.customer_email,
      amount: session.amount_total ? session.amount_total / 100 : 0,
    });

    // 2. Bestätigungs-E-Mail an Kunde senden
    try {
      const emailResult = await sendConfirmationEmail(updatedBooking, session);
      
      // 3. Admin-Benachrichtigung senden
      try {
        await sendAdminNotification(updatedBooking, session);
        console.log('📧 Admin-Benachrichtigung erfolgreich versendet');
      } catch (adminEmailError) {
        console.error('❌ Admin-E-Mail fehlgeschlagen:', adminEmailError);
        // Admin-E-Mail-Fehler nicht kritisch - Kunde wurde bereits benachrichtigt
      }

      // 4. E-Mail-Log erstellen (erfolgreich)
      await logEmail({
        bookingId: updatedBooking.id,
        customerId: updatedBooking.customerId,
        emailType: 'confirmation',
        recipient: session.customer_email || '',
        subject: `✅ Buchungsbestätigung - ${session.metadata?.checkIn} bis ${session.metadata?.checkOut}`,
        status: 'sent',
        sentAt: new Date(),
        metadata: {
          messageId: emailResult.messageId,
          stripeSessionId: session.id
        }
      });

      console.log('📧 Bestätigungs-E-Mail erfolgreich versendet und geloggt');
      
    } catch (emailError) {
      console.error('❌ E-Mail-Versand fehlgeschlagen:', emailError);
      
      // E-Mail-Fehler loggen
      await logEmail({
        bookingId: updatedBooking.id,
        customerId: updatedBooking.customerId,
        emailType: 'confirmation',
        recipient: session.customer_email || '',
        subject: `✅ Buchungsbestätigung - ${session.metadata?.checkIn} bis ${session.metadata?.checkOut}`,
        status: 'failed',
        failureReason: emailError instanceof Error ? emailError.message : 'Unbekannter E-Mail-Fehler',
        metadata: {
          stripeSessionId: session.id,
          error: emailError instanceof Error ? emailError.stack : String(emailError)
        }
      });
      
      // Buchung trotzdem als bestätigt markieren (Zahlung ist ja erfolgt)
      console.log('⚠️ Buchung bestätigt trotz E-Mail-Fehler');
    }

  } catch (error) {
    console.error('❌ Fehler bei Zahlungsverarbeitung:', error);
    
    // Fehler-Log erstellen
    if (session.customer_email) {
      try {
        await logEmail({
          bookingId: null,
          customerId: null,
          emailType: 'confirmation',
          recipient: session.customer_email,
          subject: 'Buchungsbestätigung - DevStay Apartment',
          status: 'failed',
          failureReason: error instanceof Error ? error.message : 'Unbekannter Fehler',
        });
      } catch (logError) {
        console.error('❌ E-Mail-Log Fehler:', logError);
      }
    }
  }
}

// E-Mail-Versand für Buchungsbestätigung
async function sendConfirmationEmail(booking: any, session: Stripe.Checkout.Session) {
  console.log('📧 Sende Bestätigungs-E-Mail an:', session.customer_email);
  
  try {
    const { sendBookingConfirmation } = await import('@/lib/email');
    
    const emailData = {
      customerName: session.metadata?.customerName || 'Geschätzte/r Gast/Gastin',
      customerEmail: session.customer_email || '',
      bookingId: booking.id,
      checkIn: new Date(booking.checkIn),
      checkOut: new Date(booking.checkOut),
      totalNights: booking.totalNights,
      totalPrice: parseFloat(booking.totalPrice),
      stripeSessionId: session.id,
      specialRequests: session.metadata?.specialRequests || undefined,
    };

    const result = await sendBookingConfirmation(emailData);
    console.log('✅ Bestätigungs-E-Mail erfolgreich gesendet:', result.messageId);
    
    return result;
    
  } catch (error) {
    console.error('❌ E-Mail-Versand fehlgeschlagen:', error);
    throw error;
  }
}

// Handler für fehlgeschlagene Zahlungen
async function handleFailedPayment(session: Stripe.Checkout.Session) {
  console.log('❌ Verarbeite fehlgeschlagene Zahlung für Session:', session.id);
  
  // Hier würdest du:
  // 1. Fehler-E-Mail an Kunden senden
  // 2. Admin benachrichtigen
  // 3. Buchungsversuch protokollieren
}

// Handler für Refund-Verarbeitung
async function handleRefundProcessed(charge: Stripe.Charge) {
  console.log('💰 Verarbeite Refund für Charge:', charge.id);
  
  try {
    // Finde die Buchung anhand der Payment Intent ID
    const paymentIntentId = typeof charge.payment_intent === 'string' 
      ? charge.payment_intent 
      : charge.payment_intent?.id;
    
    if (!paymentIntentId) {
      console.error('❌ Keine Payment Intent ID gefunden für Charge:', charge.id);
      return;
    }

    // Buchung in Datenbank aktualisieren
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        paymentStatus: 'refunded',
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(bookings.stripePaymentIntentId, paymentIntentId))
      .returning();

    if (updatedBooking) {
      console.log('✅ Buchung als erstattet markiert:', updatedBooking.id);
      
      // Log für Refund-Bestätigung (wir nutzen customerId da customerEmail nicht im Schema ist)
      await logEmail({
        bookingId: updatedBooking.id,
        customerId: updatedBooking.customerId,
        emailType: 'cancellation',
        recipient: 'customer@example.com', // Wird später aus Customer-Tabelle geholt
        subject: 'Rückerstattung bestätigt',
        status: 'sent',
        sentAt: new Date(),
        metadata: {
          chargeId: charge.id,
          refundAmount: charge.amount_refunded,
          webhookSource: true
        }
      });
    } else {
      console.error('❌ Buchung für Payment Intent nicht gefunden:', paymentIntentId);
    }

  } catch (error) {
    console.error('❌ Fehler bei Refund-Verarbeitung:', error);
  }
}

// Handler für Streitfälle
async function handleDispute(dispute: Stripe.Dispute) {
  console.log('⚠️ Verarbeite Streitfall für Charge:', dispute.charge);
  
  try {
    // Finde die Buchung anhand der Charge ID
    const chargeId = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge.id;
    
    // Log für Admin-Benachrichtigung
    await logEmail({
      bookingId: 'DISPUTE_' + dispute.id,
      customerId: 'ADMIN',
      emailType: 'admin',
      recipient: 'info@devstay.de',
      subject: `⚠️ Streitfall: ${dispute.reason}`,
      status: 'sent',
      sentAt: new Date(),
      metadata: {
        disputeId: dispute.id,
        chargeId: chargeId,
        amount: dispute.amount,
        reason: dispute.reason,
        evidence: dispute.evidence
      }
    });

    console.log('✅ Streitfall-Benachrichtigung geloggt:', dispute.id);

  } catch (error) {
    console.error('❌ Fehler bei Streitfall-Verarbeitung:', error);
  }
}

// Admin-Benachrichtigung bei neuer Buchung
async function sendAdminNotification(booking: any, session: Stripe.Checkout.Session) {
  console.log('📧 Sende Admin-Benachrichtigung für Buchung:', booking.id);
  
  try {
    const { notifyAdminCustomerInquiry } = await import('@/lib/email');
    
    const checkIn = new Date(booking.checkIn).toLocaleDateString('de-DE');
    const checkOut = new Date(booking.checkOut).toLocaleDateString('de-DE');
    
    await notifyAdminCustomerInquiry({
      customerName: session.metadata?.customerName || 'Unbekannt',
      customerEmail: session.customer_email || '',
      bookingId: booking.id,
      subject: `🎉 Neue Buchung: ${checkIn} - ${checkOut}`,
      message: `
Neue Buchung eingegangen!

Kunde: ${session.metadata?.customerName}
E-Mail: ${session.customer_email}
Buchungs-ID: ${booking.id}
Check-in: ${checkIn}
Check-out: ${checkOut}
Nächte: ${booking.totalNights}
Preis: ${booking.totalPrice}€
Stripe Session: ${session.id}

${session.metadata?.specialRequests ? `Besondere Wünsche: ${session.metadata.specialRequests}` : ''}

Status: Bezahlt und bestätigt ✅
      `.trim(),
      urgency: 'medium'
    });

    console.log('✅ Admin-Benachrichtigung erfolgreich versendet');
    
  } catch (error) {
    console.error('❌ Admin-Benachrichtigung fehlgeschlagen:', error);
    throw error;
  }
} 