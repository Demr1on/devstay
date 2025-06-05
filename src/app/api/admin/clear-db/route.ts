import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers, bookings, blockedDates, emailLog } from '@/lib/db/schema';

export async function POST(req: NextRequest) {
  // Nur in Development-Umgebung erlauben
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Nicht in Production erlaubt' },
      { status: 403 }
    );
  }

  try {
    console.log('🗑️ Datenbank wird geleert...');
    
    // Alle Daten löschen (in der richtigen Reihenfolge wegen Foreign Keys)
    await db.delete(emailLog);
    console.log('✅ E-Mail Logs gelöscht');
    
    await db.delete(bookings);
    console.log('✅ Buchungen gelöscht');
    
    await db.delete(customers);
    console.log('✅ Kunden gelöscht');
    
    await db.delete(blockedDates);
    console.log('✅ Blockierte Termine gelöscht');
    
    return NextResponse.json({
      success: true,
      message: 'Datenbank erfolgreich geleert',
      cleared: ['email_log', 'bookings', 'customers', 'blocked_dates']
    });
    
  } catch (error) {
    console.error('❌ Fehler beim Leeren der Datenbank:', error);
    return NextResponse.json(
      { 
        error: 'Fehler beim Leeren der Datenbank',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      },
      { status: 500 }
    );
  }
} 