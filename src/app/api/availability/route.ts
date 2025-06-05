import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'checkIn und checkOut Parameter sind erforderlich' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Datum-Validierung
    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: 'Abreisedatum muss nach Anreisedatum liegen' },
        { status: 400 }
      );
    }

    if (checkInDate < new Date()) {
      return NextResponse.json(
        { error: 'Anreisedatum kann nicht in der Vergangenheit liegen' },
        { status: 400 }
      );
    }

    const availability = await checkAvailability(checkInDate, checkOutDate);

    return NextResponse.json({
      available: availability.available,
      checkIn: checkIn,
      checkOut: checkOut,
      conflicts: availability.available ? null : {
        existingBookings: availability.conflicts.bookings.length,
        blockedDates: availability.conflicts.blockedDates.length,
      },
    });

  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Verfügbarkeitsprüfung fehlgeschlagen' },
      { status: 500 }
    );
  }
} 