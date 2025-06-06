import { Resend } from 'resend';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Resend-Instanz erstellen
const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  checkIn: Date;
  checkOut: Date;
  totalNights: number;
  totalPrice: number;
  stripeSessionId: string;
  specialRequests?: string;
}

// Buchungsbestätigungs-E-Mail
export async function sendBookingConfirmation(bookingData: BookingEmailData) {
  const {
    customerName,
    customerEmail,
    bookingId,
    checkIn,
    checkOut,
    totalNights,
    totalPrice,
    stripeSessionId,
    specialRequests
  } = bookingData;

  const checkInDate = format(checkIn, 'EEEE, dd. MMMM yyyy', { locale: de });
  const checkOutDate = format(checkOut, 'EEEE, dd. MMMM yyyy', { locale: de });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Buchungsbestätigung - DevStay</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Buchungsbestätigung</h1>
        <p>Vielen Dank für Ihre Buchung bei DevStay!</p>
      </div>
      
      <div class="content">
        <p>Liebe/r ${customerName},</p>
        
        <p>Ihre Buchung wurde erfolgreich bestätigt und bezahlt. Hier sind Ihre Buchungsdetails:</p>
        
        <div class="booking-details">
          <h3>📋 Buchungsdetails</h3>
          <div class="detail-row">
            <span><strong>Buchungsnummer:</strong></span>
            <span>${bookingId.substring(0, 8).toUpperCase()}</span>
          </div>
          <div class="detail-row">
            <span><strong>Check-in:</strong></span>
            <span>${checkInDate} ab 15:00 Uhr</span>
          </div>
          <div class="detail-row">
            <span><strong>Check-out:</strong></span>
            <span>${checkOutDate} bis 11:00 Uhr</span>
          </div>
          <div class="detail-row">
            <span><strong>Aufenthaltsdauer:</strong></span>
            <span>${totalNights} Nacht${totalNights !== 1 ? 'e' : ''}</span>
          </div>
          <div class="detail-row">
            <span><strong>Gesamtpreis:</strong></span>
            <span><strong>${totalPrice}€</strong></span>
          </div>
          <div class="detail-row">
            <span><strong>Zahlungsstatus:</strong></span>
            <span style="color: #059669;">✅ Bezahlt</span>
          </div>
          ${specialRequests ? `
          <div class="detail-row">
            <span><strong>Besondere Wünsche:</strong></span>
            <span>${specialRequests}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="highlight">
          <h3>🏠 Apartment-Adresse</h3>
          <p><strong>DevStay Premium IT-Apartment</strong><br>
          Wacholderweg 2<br>
          74177 Bad Friedrichshall<br>
          Deutschland</p>
        </div>
        
        <div class="highlight">
          <h3>🔑 Check-in Informationen</h3>
          <p>Sie erhalten 48 Stunden vor Ihrer Anreise eine separate E-Mail mit:</p>
          <ul>
            <li>📱 Digitaler Zugangscode</li>
            <li>📍 Genaue Anfahrtsbeschreibung</li>
            <li>📋 Apartment-Anleitung</li>
            <li>💻 WLAN-Zugangsdaten (1000 Mbit/s)</li>
          </ul>
        </div>
        
        <div class="highlight">
          <h3>💻 IT-Ausstattung</h3>
          <ul>
            <li>🌐 Glasfaser-Internet 1000 Mbit/s up/down</li>
            <li>🖥️ Professioneller Arbeitsplatz</li>
            <li>🔌 Mehrere USB-C und USB-A Anschlüsse</li>
            <li>📺 4K Monitor verfügbar</li>
            <li>☕ Premium-Kaffee für Entwickler</li>
          </ul>
        </div>
        
        <div class="highlight" style="background: #fef3c7; border-left: 4px solid #f59e0b;">
          <h3>🔄 Kostenlose Stornierung</h3>
          <p><strong>100% Rückerstattung bis kurz vor Check-in möglich!</strong></p>
          <p>Pläne geändert? Kein Problem - stornieren Sie einfach online:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="https://devstay.de/cancel-booking" 
               style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              📋 Online stornieren
            </a>
          </p>
          <p><small>Sie benötigen Ihre Buchungsnummer (${bookingId.substring(0, 8).toUpperCase()}) und Postleitzahl.</small></p>
        </div>
        
        <h3>📞 Kontakt</h3>
        <p>Bei Fragen erreichen Sie uns:</p>
        <p>📧 E-Mail: <a href="mailto:info@devstay.de">info@devstay.de</a><br>
        📱 WhatsApp: <a href="https://wa.me/4917641847930">+49 176 41847930</a></p>
        
        <p>Wir freuen uns auf Ihren Aufenthalt!</p>
        
        <p>Beste Grüße<br>
        <strong>Das DevStay Team</strong></p>
        
        <div class="footer">
          <p>DevStay - Premium IT-Apartments für Entwickler<br>
          Daniel Dewald | Wacholderweg 2 | 74177 Bad Friedrichshall<br>
          <a href="https://devstay.de">devstay.de</a></p>
          
          <p><small>Ihre Zahlungsinformationen sind sicher bei Stripe gespeichert.<br>
          Transaktions-ID: ${stripeSessionId}</small></p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'DevStay <noreply@devstay.de>',
      to: [customerEmail],
      // Kundenantworten gehen an echte E-Mail-Adresse
      replyTo: 'info@devstay.de',
      subject: `✅ Buchungsbestätigung - ${checkInDate} bis ${checkOutDate}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend E-Mail-Fehler:', error);
      throw new Error(`E-Mail-Versand fehlgeschlagen: ${error.message}`);
    }

    console.log('✅ Buchungsbestätigungs-E-Mail gesendet:', data?.id);
    return { success: true, messageId: data?.id };

  } catch (error) {
    console.error('E-Mail-Versand-Fehler:', error);
    throw error;
  }
}

// Check-in Anweisungen (48h vor Anreise)
export async function sendCheckinInstructions(bookingData: BookingEmailData & { accessCode: string }) {
  const {
    customerName,
    customerEmail,
    checkIn,
    checkOut,
    accessCode
  } = bookingData;

  const checkInDate = format(checkIn, 'EEEE, dd. MMMM yyyy', { locale: de });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Check-in Anweisungen - DevStay</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .access-code { background: #dbeafe; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .code { font-size: 24px; font-weight: bold; color: #1e40af; letter-spacing: 2px; }
        .highlight { background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔑 Check-in Anweisungen</h1>
        <p>Ihr Apartment wartet auf Sie!</p>
      </div>
      
      <div class="content">
        <p>Liebe/r ${customerName},</p>
        
        <p>Ihr Check-in ist in weniger als 48 Stunden! Hier sind alle wichtigen Informationen:</p>
        
        <div class="access-code">
          <h3>🔐 Ihr Zugangscode</h3>
          <div class="code">${accessCode}</div>
          <p><small>Geben Sie diesen Code am Keypad neben der Eingangstür ein</small></p>
        </div>
        
        <div class="highlight">
          <h3>📍 Anfahrt & Parken</h3>
          <p><strong>Adresse:</strong> Wacholderweg 2, 74177 Bad Friedrichshall</p>
          <p><strong>Parken:</strong> Kostenloser Parkplatz direkt vor dem Gebäude</p>
          <p><strong>Ankunftszeit:</strong> ${checkInDate} ab 15:00 Uhr</p>
        </div>
        
        <div class="highlight">
          <h3>💻 WLAN-Zugangsdaten</h3>
          <p><strong>Netzwerk:</strong> DevStay-Giga</p>
          <p><strong>Passwort:</strong> Developer2024!</p>
          <p><strong>Geschwindigkeit:</strong> 1000 Mbit/s up/down</p>
        </div>
        
        <div class="highlight">
          <h3>🏠 Apartment-Ausstattung</h3>
          <ul>
            <li>💻 Ergonomischer Arbeitsplatz mit 4K Monitor</li>
            <li>☕ Nespresso-Maschine mit Premium-Kapseln</li>
            <li>🍽️ Voll ausgestattete Küche</li>
            <li>🛏️ Komfortables Bett mit hochwertiger Bettwäsche</li>
            <li>🚿 Modernes Badezimmer mit Handtüchern</li>
          </ul>
        </div>
        
        <p><strong>Wichtige Notfallnummer:</strong> +49 176 41847930 (WhatsApp)</p>
        
        <p>Wir wünschen Ihnen einen angenehmen Aufenthalt!</p>
        
        <p>Das DevStay Team</p>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'DevStay <noreply@devstay.de>',
      to: [customerEmail],
      subject: `🔑 Check-in Anweisungen - ${checkInDate}`,
      html: emailHtml,
    });

    if (error) {
      throw new Error(`Check-in E-Mail fehlgeschlagen: ${error.message}`);
    }

    return { success: true, messageId: data?.id };

  } catch (error) {
    console.error('Check-in E-Mail-Fehler:', error);
    throw error;
  }
}

// Admin-Benachrichtigung bei Kundenanfragen
export async function notifyAdminCustomerInquiry(customerData: {
  customerName: string;
  customerEmail: string;
  bookingId?: string;
  subject: string;
  message: string;
  urgency?: 'low' | 'medium' | 'high';
}) {
  const { customerName, customerEmail, bookingId, subject, message, urgency = 'medium' } = customerData;
  
  const urgencyColors = {
    low: '#059669',
    medium: '#d97706', 
    high: '#dc2626'
  };

  const urgencyEmojis = {
    low: '📧',
    medium: '⚠️',
    high: '🚨'
  };

  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Kundenanfrage - DevStay</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${urgencyColors[urgency]}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
        .customer-message { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid ${urgencyColors[urgency]}; }
        .customer-info { background: #e5e7eb; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .quick-actions { display: flex; gap: 10px; margin: 20px 0; }
        .action-btn { background: #2563eb; color: white; padding: 10px 15px; text-decoration: none; border-radius: 6px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${urgencyEmojis[urgency]} Neue Kundenanfrage</h1>
        <p>Priorität: ${urgency.toUpperCase()}</p>
      </div>
      
      <div class="content">
        <div class="customer-info">
          <h3>👤 Kundendaten</h3>
          <p><strong>Name:</strong> ${customerName}</p>
          <p><strong>E-Mail:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
          ${bookingId ? `<p><strong>Buchung:</strong> ${bookingId}</p>` : ''}
          <p><strong>Betreff:</strong> ${subject}</p>
        </div>
        
        <div class="customer-message">
          <h3>💬 Nachricht</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        
        <div class="quick-actions">
          <a href="mailto:${customerEmail}?subject=Re: ${subject}" class="action-btn">
            📧 Antworten
          </a>
          <a href="https://wa.me/4917641847930" class="action-btn">
            📱 WhatsApp öffnen
          </a>
        </div>
        
        <p><small>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie direkt an den Kunden.</small></p>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'DevStay System <noreply@devstay.de>',
      to: ['info@devstay.de'],
      subject: `${urgencyEmojis[urgency]} Kundenanfrage: ${subject}`,
      html: adminEmailHtml,
      replyTo: customerEmail,
    });

    if (error) {
      throw new Error(`Admin-Benachrichtigung fehlgeschlagen: ${error.message}`);
    }

    console.log('✅ Admin über Kundenanfrage benachrichtigt:', data?.id);
    return { success: true, messageId: data?.id };

  } catch (error) {
    console.error('❌ Admin-Benachrichtigung fehlgeschlagen:', error);
    throw error;
  }
} 