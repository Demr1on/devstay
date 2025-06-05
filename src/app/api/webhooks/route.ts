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

    // 2. Bestätigungs-E-Mail senden
    try {
      const emailResult = await sendConfirmationEmail(updatedBooking, session);
      
      // 3. E-Mail-Log erstellen (erfolgreich)
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