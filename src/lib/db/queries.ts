import { db, customers, bookings, blockedDates, emailLog } from './index';
import { eq, and, gte, lte, or, sql } from 'drizzle-orm';
import type { NewCustomer, NewBooking, NewEmailLog } from './schema';

// Check-in Code Generator
function generateCheckInCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Verfügbarkeit prüfen
export async function checkAvailability(checkIn: Date, checkOut: Date, excludeBookingId?: string) {
  try {
    // Prüfe Buchungen
    const existingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          excludeBookingId ? sql`id != ${excludeBookingId}` : undefined,
          or(
            eq(bookings.status, 'confirmed'),
            eq(bookings.status, 'pending')
          ),
          or(
            // Neue Buchung startet während bestehender Buchung
            and(gte(bookings.checkIn, checkIn), lte(bookings.checkIn, checkOut)),
            // Neue Buchung endet während bestehender Buchung
            and(gte(bookings.checkOut, checkIn), lte(bookings.checkOut, checkOut)),
            // Neue Buchung umschließt bestehende Buchung
            and(lte(bookings.checkIn, checkIn), gte(bookings.checkOut, checkOut))
          )
        )
      );

    // Prüfe blockierte Termine
    const blockedPeriods = await db
      .select()
      .from(blockedDates)
      .where(
        or(
          and(gte(blockedDates.startDate, checkIn), lte(blockedDates.startDate, checkOut)),
          and(gte(blockedDates.endDate, checkIn), lte(blockedDates.endDate, checkOut)),
          and(lte(blockedDates.startDate, checkIn), gte(blockedDates.endDate, checkOut))
        )
      );

    return {
      available: existingBookings.length === 0 && blockedPeriods.length === 0,
      conflicts: {
        bookings: existingBookings,
        blockedDates: blockedPeriods,
      },
    };
  } catch (error) {
    console.error('Fehler bei Verfügbarkeitsprüfung:', error);
    throw new Error('Verfügbarkeitsprüfung fehlgeschlagen');
  }
}

// Kunde erstellen oder finden
export async function findOrCreateCustomer(customerData: Omit<NewCustomer, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    // Zuerst versuchen, existierenden Kunden zu finden
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, customerData.email))
      .limit(1);

    if (existingCustomer.length > 0) {
      // Kundendaten aktualisieren
      const [updatedCustomer] = await db
        .update(customers)
        .set({
          ...customerData,
          updatedAt: new Date(),
        })
        .where(eq(customers.id, existingCustomer[0].id))
        .returning();

      return updatedCustomer;
    }

    // Neuen Kunden erstellen
    const [newCustomer] = await db
      .insert(customers)
      .values(customerData)
      .returning();

    return newCustomer;
  } catch (error) {
    console.error('Fehler beim Erstellen/Finden des Kunden:', error);
    throw new Error('Kunde konnte nicht erstellt werden');
  }
}

// Buchung erstellen
export async function createBooking(bookingData: Omit<NewBooking, 'id' | 'createdAt' | 'updatedAt' | 'checkInCode'>) {
  try {
    // Check-in Code generieren
    const checkInCode = generateCheckInCode();

    const [newBooking] = await db
      .insert(bookings)
      .values({
        ...bookingData,
        checkInCode,
      })
      .returning();

    return newBooking;
  } catch (error) {
    console.error('Fehler beim Erstellen der Buchung:', error);
    throw new Error('Buchung konnte nicht erstellt werden');
  }
}

// Buchung nach Stripe Session ID finden
export async function getBookingByStripeSession(sessionId: string) {
  try {
    const booking = await db
      .select({
        booking: bookings,
        customer: customers,
      })
      .from(bookings)
      .leftJoin(customers, eq(bookings.customerId, customers.id))
      .where(eq(bookings.stripeSessionId, sessionId))
      .limit(1);

    return booking[0] || null;
  } catch (error) {
    console.error('Fehler beim Abrufen der Buchung:', error);
    throw new Error('Buchung konnte nicht gefunden werden');
  }
}

// Buchung-Status aktualisieren
export async function updateBookingStatus(
  bookingId: string, 
  updates: {
    status?: string;
    paymentStatus?: string;
    stripePaymentIntentId?: string;
    confirmationEmailSent?: boolean;
    checkInEmailSent?: boolean;
  }
) {
  try {
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    return updatedBooking;
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Buchung:', error);
    throw new Error('Buchung konnte nicht aktualisiert werden');
  }
}

// E-Mail Log erstellen
export async function logEmail(emailData: Omit<NewEmailLog, 'id' | 'createdAt'>) {
  try {
    const [emailLogEntry] = await db
      .insert(emailLog)
      .values(emailData)
      .returning();

    return emailLogEntry;
  } catch (error) {
    console.error('Fehler beim Logging der E-Mail:', error);
    throw new Error('E-Mail-Log konnte nicht erstellt werden');
  }
}

// Anstehende Check-in Instruktionen abrufen
export async function getPendingCheckInInstructions() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const pendingBookings = await db
      .select({
        booking: bookings,
        customer: customers,
      })
      .from(bookings)
      .leftJoin(customers, eq(bookings.customerId, customers.id))
      .where(
        and(
          eq(bookings.status, 'confirmed'),
          eq(bookings.paymentStatus, 'paid'),
          eq(bookings.checkInEmailSent, false),
          gte(bookings.checkIn, tomorrow),
          lte(bookings.checkIn, dayAfterTomorrow)
        )
      );

    return pendingBookings;
  } catch (error) {
    console.error('Fehler beim Abrufen anstehender Check-in Instruktionen:', error);
    throw new Error('Anstehende Check-in Instruktionen konnten nicht abgerufen werden');
  }
} 