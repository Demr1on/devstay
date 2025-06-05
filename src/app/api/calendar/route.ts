import { NextRequest, NextResponse } from 'next/server';
import { db, bookings, blockedDates } from '@/lib/db/index';
import { gte, lte, and, or, eq } from 'drizzle-orm';
import { startOfMonth, endOfMonth, parseISO } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const monthParam = searchParams.get('month'); // Format: 2024-03
    
    if (!monthParam) {
      return NextResponse.json(
        { error: 'month Parameter ist erforderlich (Format: YYYY-MM)' },
        { status: 400 }
      );
    }

    // Monatsbereich berechnen
    const monthDate = parseISO(`${monthParam}-01`);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    // Buchungen für den Monat abrufen
    const monthBookings = await db
      .select({
        id: bookings.id,
        checkIn: bookings.checkIn,
        checkOut: bookings.checkOut,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        totalPrice: bookings.totalPrice,
      })
      .from(bookings)
      .where(
        and(
          or(
            eq(bookings.status, 'confirmed'),
            eq(bookings.status, 'pending')
          ),
          or(
            // Buchung startet im Monat
            and(gte(bookings.checkIn, monthStart), lte(bookings.checkIn, monthEnd)),
            // Buchung endet im Monat
            and(gte(bookings.checkOut, monthStart), lte(bookings.checkOut, monthEnd)),
            // Buchung umschließt den ganzen Monat
            and(lte(bookings.checkIn, monthStart), gte(bookings.checkOut, monthEnd))
          )
        )
      );

    // Blockierte Termine für den Monat abrufen
    const monthBlockedDates = await db
      .select({
        id: blockedDates.id,
        startDate: blockedDates.startDate,
        endDate: blockedDates.endDate,
        reason: blockedDates.reason,
        description: blockedDates.description,
      })
      .from(blockedDates)
      .where(
        or(
          // Blockierung startet im Monat
          and(gte(blockedDates.startDate, monthStart), lte(blockedDates.startDate, monthEnd)),
          // Blockierung endet im Monat
          and(gte(blockedDates.endDate, monthStart), lte(blockedDates.endDate, monthEnd)),
          // Blockierung umschließt den ganzen Monat
          and(lte(blockedDates.startDate, monthStart), gte(blockedDates.endDate, monthEnd))
        )
      );

    // Daten für Frontend formatieren
    const calendarData = {
      month: monthParam,
      monthStart: monthStart.toISOString(),
      monthEnd: monthEnd.toISOString(),
      bookings: monthBookings.map(booking => ({
        id: booking.id,
        checkIn: booking.checkIn.toISOString().split('T')[0],
        checkOut: booking.checkOut.toISOString().split('T')[0],
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        totalPrice: parseFloat(booking.totalPrice),
        type: 'booking',
      })),
      blockedDates: monthBlockedDates.map(blocked => ({
        id: blocked.id,
        startDate: blocked.startDate.toISOString().split('T')[0],
        endDate: blocked.endDate.toISOString().split('T')[0],
        reason: blocked.reason,
        description: blocked.description,
        type: 'blocked',
      })),
      statistics: {
        totalBookings: monthBookings.length,
        confirmedBookings: monthBookings.filter(b => b.status === 'confirmed').length,
        pendingBookings: monthBookings.filter(b => b.status === 'pending').length,
        blockedPeriods: monthBlockedDates.length,
        totalRevenue: monthBookings
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + parseFloat(b.totalPrice), 0),
      },
    };

    return NextResponse.json(calendarData);

  } catch (error) {
    console.error('Calendar data error:', error);
    return NextResponse.json(
      { error: 'Kalenderdaten konnten nicht geladen werden' },
      { status: 500 }
    );
  }
}