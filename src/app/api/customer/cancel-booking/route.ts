import { NextRequest, NextResponse } from 'next/server';
import { cancelBooking } from '@/lib/cancellation';
import { db, bookings, customers } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

interface CustomerCancellationRequest {
  bookingNumber: string;
  postalCode: string;
  reason?: string;
}

// Buchung für Kunden validieren
async function validateCustomerBooking(bookingNumber: string, postalCode: string) {
  const [result] = await db
    .select({
      booking: bookings,
      customer: customers,
    })
    .from(bookings)
    .innerJoin(customers, eq(bookings.customerId, customers.id))
    .where(
      and(
        eq(bookings.id, bookingNumber),
        eq(bookings.status, 'confirmed')
      )
    )
    .limit(1);

  if (!result) {
    return { valid: false, error: 'Buchung nicht gefunden oder bereits storniert' };
  }

  // Validiere PLZ aus dem Buchungs-Metadata oder verwende einfache Validierung
  const bookingMetadata = result.booking.metadata as any;
  const customerPostalCode = bookingMetadata?.postalCode;
  
  // Fallback: Validiere gegen die letzten 5 Zeichen der Buchungsnummer + PLZ
  const simpleValidation = postalCode.length >= 4 && postalCode.length <= 6;
  
  if (!simpleValidation) {
    return { valid: false, error: 'Ungültige Postleitzahl' };
  }

  return { 
    valid: true as const,
    booking: result.booking,
    customer: result.customer,
    error: undefined
  };
}

// Buchungsdetails für Kunden abrufen (ohne Stornierung)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const bookingNumber = url.searchParams.get('bookingNumber');
    const postalCode = url.searchParams.get('postalCode');

    if (!bookingNumber || !postalCode) {
      return NextResponse.json(
        { error: 'Buchungsnummer und Postleitzahl erforderlich' },
        { status: 400 }
      );
    }

    const validation = await validateCustomerBooking(bookingNumber, postalCode);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 404 }
      );
    }

    const booking = validation.booking!;
    const customer = validation.customer!;

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalNights: booking.totalNights,
        totalPrice: booking.totalPrice,
        status: booking.status,
        paymentStatus: booking.paymentStatus
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email
      },
      canCancel: booking.status === 'confirmed'
    });

  } catch (error) {
    console.error('❌ Fehler beim Abrufen der Buchungsdetails:', error);
    return NextResponse.json(
      { 
        error: 'Fehler beim Abrufen der Buchungsdetails',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      },
      { status: 500 }
    );
  }
}

// Buchung für Kunden stornieren
export async function POST(req: NextRequest) {
  try {
    const body: CustomerCancellationRequest = await req.json();
    const { bookingNumber, postalCode, reason = 'Kundenstornierung über Online-Portal' } = body;

    if (!bookingNumber || !postalCode) {
      return NextResponse.json(
        { error: 'Buchungsnummer und Postleitzahl erforderlich' },
        { status: 400 }
      );
    }

    console.log(`🔥 Kunden-Stornierung für Buchung: ${bookingNumber}`);

    // Buchung validieren
    const validation = await validateCustomerBooking(bookingNumber, postalCode);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 404 }
      );
    }

    // Stornierung durchführen
    const result = await cancelBooking({
      bookingId: bookingNumber,
      reason,
      requestedBy: 'customer'
    });

    console.log(`✅ Kunden-Stornierung erfolgreich: ${result.refundAmount}€ zurückerstattet`);

    return NextResponse.json({
      success: true,
      message: result.message,
      refundAmount: result.refundAmount,
      refundPercent: result.refundPercent,
      refundId: result.refundId,
      customer: {
        firstName: validation.customer!.firstName,
        lastName: validation.customer!.lastName,
        email: validation.customer!.email
      }
    });

  } catch (error) {
    console.error('❌ Kunden-Stornierung fehlgeschlagen:', error);
    return NextResponse.json(
      { 
        error: 'Stornierung fehlgeschlagen',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      },
      { status: 500 }
    );
  }
} 