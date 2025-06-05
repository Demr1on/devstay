import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe-Instanz
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
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
  
  // Hier würdest du in einer echten Anwendung:
  // 1. Buchungsdaten aus session.metadata extrahieren
  const customerName = session.metadata?.customerName;
  const checkIn = session.metadata?.checkIn;
  const checkOut = session.metadata?.checkOut;
  const customerEmail = session.customer_email;
  
  console.log('📋 Buchungsdetails:', {
    customerName,
    customerEmail,
    checkIn,
    checkOut,
    amount: session.amount_total ? session.amount_total / 100 : 0,
  });

  // 2. In Datenbank speichern
  // await saveBookingToDatabase({ ... });

  // 3. Bestätigungs-E-Mail senden
  // await sendConfirmationEmail({ ... });

  // 4. Kalender-System aktualisieren
  // await updateCalendar({ ... });

  // 5. Interne Benachrichtigungen senden
  // await notifyBookingTeam({ ... });
}

// Handler für fehlgeschlagene Zahlungen
async function handleFailedPayment(session: Stripe.Checkout.Session) {
  console.log('❌ Verarbeite fehlgeschlagene Zahlung für Session:', session.id);
  
  // Hier würdest du:
  // 1. Fehler-E-Mail an Kunden senden
  // 2. Admin benachrichtigen
  // 3. Buchungsversuch protokollieren
} 