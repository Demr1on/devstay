import { NextRequest, NextResponse } from 'next/server';
import { cancelBooking, calculateRefund } from '@/lib/cancellation';
import { db, bookings } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, reason, adminPassword } = body;

    // Einfache Admin-Authentifizierung (in Production sollte das JWT/Session sein)
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Buchungs-ID erforderlich' },
        { status: 400 }
      );
    }

    // Stornierung durchführen
    const result = await cancelBooking({
      bookingId,
      reason,
      requestedBy: 'admin'
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      refundAmount: result.refundAmount,
      refundPercent: result.refundPercent,
      refundId: result.refundId
    });

  } catch (error) {
    console.error('❌ Admin-Stornierung fehlgeschlagen:', error);
    return NextResponse.json(
      { 
        error: 'Stornierung fehlgeschlagen',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      },
      { status: 500 }
    );
  }
}

// Stornierungsvorschau (ohne tatsächliche Stornierung)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const bookingId = url.searchParams.get('bookingId');
    const adminPassword = url.searchParams.get('adminPassword');

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Buchungs-ID erforderlich' },
        { status: 400 }
      );
    }

    // Buchung laden
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      return NextResponse.json(
        { error: 'Buchung nicht gefunden' },
        { status: 404 }
      );
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Buchung ist bereits storniert' },
        { status: 400 }
      );
    }

    // Refund-Berechnung
    const checkInDate = new Date(booking.checkIn);
    const totalPrice = parseFloat(booking.totalPrice);
    const refundCalculation = calculateRefund(checkInDate, totalPrice);

    return NextResponse.json({
      booking: {
        id: booking.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalPrice: booking.totalPrice,
        status: booking.status
      },
      refundCalculation,
      canCancel: true
    });

  } catch (error) {
    console.error('❌ Stornierungsvorschau fehlgeschlagen:', error);
    return NextResponse.json(
      { 
        error: 'Fehler beim Laden der Buchung',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      },
      { status: 500 }
    );
  }
} 