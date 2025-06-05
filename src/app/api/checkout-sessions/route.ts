import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { formatAmountForStripe } from '@/lib/stripe';
import { checkAvailability, findOrCreateCustomer, createBooking } from '@/lib/db/queries';

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
  console.log('🚀 Checkout Session aufgerufen:', new Date().toISOString());
  
  try {
    // Runtime-Überprüfung der Stripe-Konfiguration
    if (!stripeSecretKey || stripeSecretKey === 'sk_test_dummy_key_for_build') {
      console.error('❌ Stripe Secret Key nicht verfügbar');
      return NextResponse.json(
        { 
          error: 'Service temporär nicht verfügbar',
          details: 'Stripe-Konfiguration fehlt. Bitte kontaktieren Sie den Support.'
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    console.log('📝 Request Body:', { 
      amount: body.amount, 
      checkIn: body.checkIn, 
      checkOut: body.checkOut,
      email: body.customerDetails?.email 
    });
    
    const { 
      amount, 
      currency = 'eur',
      checkIn,
      checkOut,
      customerDetails 
    } = body;

    // Validierung
    if (!amount || amount < 1) {
      console.error('❌ Ungültiger Betrag:', amount);
      return NextResponse.json(
        { error: 'Ungültiger Betrag' },
        { status: 400 }
      );
    }

    if (!customerDetails?.email) {
      console.error('❌ E-Mail fehlt');
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich' },
        { status: 400 }
      );
    }

    if (!checkIn || !checkOut) {
      console.error('❌ Datum fehlt:', { checkIn, checkOut });
      return NextResponse.json(
        { error: 'Anreise- und Abreisedatum sind erforderlich' },
        { status: 400 }
      );
    }

    // Verfügbarkeit prüfen
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    console.log('📅 Termine prüfen:', { checkInDate, checkOutDate });
    
    try {
      console.log('🔍 Verfügbarkeitsprüfung starten...');
      const availability = await checkAvailability(checkInDate, checkOutDate);
      console.log('📊 Verfügbarkeit:', availability);
      
      if (!availability.available) {
        console.error('❌ Nicht verfügbar:', availability);
        return NextResponse.json(
          { 
            error: 'Das Apartment ist für die gewählten Termine nicht verfügbar',
            details: 'Bitte wählen Sie andere Termine',
            conflicts: availability.conflicts || []
          },
          { status: 409 }
        );
      }
    } catch (error) {
      console.error('❌ Verfügbarkeitsprüfung Fehler:', error);
      return NextResponse.json(
        { error: 'Verfügbarkeitsprüfung fehlgeschlagen. Bitte versuchen Sie es erneut.' },
        { status: 500 }
      );
    }

    // Kunde erstellen/finden und Buchung vorbereiten
    try {
      const customer = await findOrCreateCustomer({
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        email: customerDetails.email,
        phone: customerDetails.phone,
        company: customerDetails.company || null,
      });

      // Nächte berechnen
      const totalNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Checkout Session erstellen
      const checkoutSession = await stripe.checkout.sessions.create({
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
      });

      // Buchung erstellen mit Stripe Session ID
      const newBooking = await createBooking({
        customerId: customer.id,
        stripeSessionId: checkoutSession.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalNights,
        basePrice: (amount * 1.1).toString(), // Basis ohne Rabatt
        totalPrice: amount.toString(),
        specialRequests: customerDetails.specialRequests || null,
        status: 'pending',
        paymentStatus: 'pending',
      });

      return NextResponse.json({
        id: checkoutSession.id,
        url: checkoutSession.url,
      });
      
    } catch (error) {
      console.error('Buchungsvorbereitung fehlgeschlagen:', error);
      return NextResponse.json(
        { error: 'Buchung konnte nicht vorbereitet werden. Bitte versuchen Sie es erneut.' },
        { status: 500 }
      );
    }

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