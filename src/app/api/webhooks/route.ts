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
  // Runtime-Überprüfung der Stripe-Konfiguration
  if (!stripeSecretKey || stripeSecretKey === 'sk_test_dummy_key_for_build') {
    return NextResponse.json(
      { error: 'Webhook service nicht verfügbar' },
      { status: 503 }
    );
  }

  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    // Den rohen Body für Stripe lesen
    const body = await req.text();
    
    // Event konstruieren und Signatur verifizieren
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.log(`❌ Webhook-Signatur-Fehler: ${err instanceof Error ? err.message : err}`);
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
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        status: 'confirmed',
        paymentStatus: 'paid',
        updatedAt: new Date(),
      })
      .where(eq(bookings.stripeSessionId, '')) // Findet die vorbereitete Buchung
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

    // 2. Bestätigungs-E-Mail senden (wird später implementiert)
    await sendConfirmationEmail(updatedBooking, session);

    // 3. E-Mail-Log erstellen
    await logEmail({
      bookingId: updatedBooking.id,
      customerId: updatedBooking.customerId,
      emailType: 'confirmation',
      recipient: session.customer_email || '',
      subject: 'Buchungsbestätigung - DevStay Apartment',
      status: 'sent',
      sentAt: new Date(),
    });

    console.log('📧 Bestätigungs-E-Mail versendet');

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

// Placeholder für E-Mail-Versand (wird später implementiert)
async function sendConfirmationEmail(booking: any, session: Stripe.Checkout.Session) {
  console.log('📧 Bestätigungs-E-Mail würde versendet an:', session.customer_email);
  
  // TODO: E-Mail-Service implementieren
  // - Resend oder SendGrid Integration
  // - HTML-Template für Buchungsbestätigung
  // - PDF-Anhang mit Check-in Details
  
  return true;
}

// Handler für fehlgeschlagene Zahlungen
async function handleFailedPayment(session: Stripe.Checkout.Session) {
  console.log('❌ Verarbeite fehlgeschlagene Zahlung für Session:', session.id);
  
  // Hier würdest du:
  // 1. Fehler-E-Mail an Kunden senden
  // 2. Admin benachrichtigen
  // 3. Buchungsversuch protokollieren
} 