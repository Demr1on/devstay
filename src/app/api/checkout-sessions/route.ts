import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { formatAmountForStripe } from '@/lib/stripe';

// Überprüfung der Stripe-Konfiguration
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY ist nicht gesetzt in den Umgebungsvariablen');
}

// Stripe-Instanz erstellen (mit Fallback für Build-Zeit)
const stripe = new Stripe(stripeSecretKey || 'sk_test_dummy_key_for_build', {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  try {
    // Runtime-Überprüfung der Stripe-Konfiguration
    if (!stripeSecretKey || stripeSecretKey === 'sk_test_dummy_key_for_build') {
      return NextResponse.json(
        { 
          error: 'Service temporär nicht verfügbar',
          details: 'Stripe-Konfiguration fehlt. Bitte kontaktieren Sie den Support.'
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { 
      amount, 
      currency = 'eur',
      checkIn,
      checkOut,
      customerDetails 
    } = body;

    // Validierung
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Ungültiger Betrag' },
        { status: 400 }
      );
    }

    if (!customerDetails?.email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich' },
        { status: 400 }
      );
    }

    // Checkout Session Parameter
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card', 'sepa_debit'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'DevStay - Apartment Buchung',
              description: `Aufenthalt vom ${checkIn} bis ${checkOut}`,
                              images: ['https://devstay.de/images/apartment-hero.jpg'],
            },
            unit_amount: formatAmountForStripe(amount, currency),
          },
          quantity: 1,
        },
      ],
      customer_creation: 'always',
      customer_email: customerDetails.email,
      metadata: {
        checkIn,
        checkOut,
        customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
        customerPhone: customerDetails.phone,
        company: customerDetails.company || '',
        specialRequests: customerDetails.specialRequests || '',
      },
      success_url: `${req.headers.get('origin')}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/booking/cancelled?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: {
        enabled: false,
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      locale: 'de',
    };

    // Checkout Session erstellen
    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json({
      id: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (error) {
    console.error('Stripe Checkout Session Error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten',
        details: 'Fehler beim Erstellen der Checkout Session'
      },
      { status: 500 }
    );
  }
} 