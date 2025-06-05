import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminPassword = searchParams.get('password');

  // Simple Admin-Schutz
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Login - DevStay</title>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui; max-width: 500px; margin: 100px auto; padding: 20px; }
          input, button { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
          button { background: #059669; color: white; cursor: pointer; }
          button:hover { background: #047857; }
        </style>
      </head>
      <body>
        <h2>🔐 Admin Login</h2>
        <form onsubmit="window.location.href='?password=' + document.getElementById('password').value; return false;">
          <input type="password" id="password" placeholder="Admin Password" required>
          <button type="submit">Login</button>
        </form>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Admin-Interface für Stornierungen
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin Stornierungen - DevStay</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: system-ui; max-width: 800px; margin: 20px auto; padding: 20px; background: #f9fafb; }
        .card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 20px 0; }
        input, textarea, button, select { width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
        .btn-preview { background: #3b82f6; color: white; cursor: pointer; }
        .btn-cancel { background: #ef4444; color: white; cursor: pointer; }
        .btn-preview:hover { background: #2563eb; }
        .btn-cancel:hover { background: #dc2626; }
        .result { margin: 20px 0; padding: 15px; border-radius: 5px; white-space: pre-wrap; }
        .success { background: #d1fae5; border: 1px solid #10b981; }
        .error { background: #fee2e2; border: 1px solid #ef4444; }
        .preview { background: #dbeafe; border: 1px solid #3b82f6; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
        .booking-list { max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius: 5px; }
        .booking-item { padding: 10px; border-bottom: 1px solid #eee; cursor: pointer; }
        .booking-item:hover { background: #f3f4f6; }
        .booking-item.selected { background: #dbeafe; }
      </style>
    </head>
    <body>
      <h1>🛠️ Admin Stornierungen - DevStay</h1>
      
      <div class="card">
        <h2>📋 1. Buchungen laden</h2>
        <button onclick="loadBookings()" class="btn-preview">Alle Buchungen laden</button>
        <div id="bookingsList"></div>
      </div>

      <div class="card">
        <h2>❌ 2. Stornierung durchführen</h2>
        <div class="grid">
          <div>
            <label>Buchungs-ID:</label>
            <input type="text" id="bookingId" placeholder="z.B. 550e8400-e29b-41d4-a716-446655440000">
            
            <label>Grund:</label>
            <select id="reasonSelect" onchange="updateReason()">
              <option value="Auf Kundenwunsch">Auf Kundenwunsch</option>
              <option value="Wartung/Reparatur">Wartung/Reparatur</option>
              <option value="Persönliche Nutzung">Persönliche Nutzung</option>
              <option value="Notfall">Notfall</option>
              <option value="custom">Eigener Grund...</option>
            </select>
            
            <textarea id="reason" placeholder="Grund der Stornierung" rows="3">Auf Kundenwunsch</textarea>
            
            <label>Bearbeitet von:</label>
            <input type="text" id="requestedBy" value="Admin Daniel" placeholder="Admin Name">
          </div>
          
          <div>
            <h3>🔍 Aktionen</h3>
            <button onclick="previewCancellation()" class="btn-preview">Vorschau anzeigen</button>
            <button onclick="executeCancellation()" class="btn-cancel">Stornierung AUSFÜHREN</button>
            
            <div style="margin-top: 20px; padding: 10px; background: #fef3c7; border-radius: 5px; font-size: 12px;">
              <strong>⚠️ Hinweis:</strong><br>
              • Vorschau zeigt was passieren würde<br>
              • Ausführung ist FINAL und nicht rückgängig<br>
              • Refund erfolgt automatisch via Stripe
            </div>
          </div>
        </div>
      </div>

      <div id="result"></div>

      <script>
        const adminPassword = new URLSearchParams(window.location.search).get('password');
        
        function updateReason() {
          const select = document.getElementById('reasonSelect');
          const textarea = document.getElementById('reason');
          if (select.value === 'custom') {
            textarea.value = '';
            textarea.focus();
          } else {
            textarea.value = select.value;
          }
        }
        
        async function loadBookings() {
          try {
            const response = await fetch(\`/api/admin/bookings?password=\${adminPassword}\`);
            const data = await response.json();
            
            if (data.error) {
              showResult('error', 'Fehler: ' + data.error);
              return;
            }
            
            const bookingsHtml = data.bookings.map(booking => \`
              <div class="booking-item" onclick="selectBooking('\${booking.id}', '\${booking.customerName}', '\${booking.checkIn}', '\${booking.totalPrice}')">
                <strong>\${booking.customerName}</strong> - \${new Date(booking.checkIn).toLocaleDateString('de-DE')} bis \${new Date(booking.checkOut).toLocaleDateString('de-DE')}<br>
                <small>ID: \${booking.id.substring(0, 8)}... • Status: \${booking.status} • \${booking.totalPrice}€</small>
              </div>
            \`).join('');
            
            document.getElementById('bookingsList').innerHTML = \`
              <div class="booking-list">
                \${bookingsHtml}
              </div>
            \`;
          } catch (error) {
            showResult('error', 'Netzwerkfehler: ' + error.message);
          }
        }
        
        function selectBooking(id, customerName, checkIn, totalPrice) {
          document.getElementById('bookingId').value = id;
          document.querySelectorAll('.booking-item').forEach(item => item.classList.remove('selected'));
          event.target.closest('.booking-item').classList.add('selected');
          showResult('success', \`Buchung ausgewählt: \${customerName} - \${new Date(checkIn).toLocaleDateString('de-DE')} (\${totalPrice}€)\`);
        }
        
        async function previewCancellation() {
          const bookingId = document.getElementById('bookingId').value.trim();
          const reason = document.getElementById('reason').value.trim();
          
          if (!bookingId || !reason) {
            showResult('error', 'Bitte Buchungs-ID und Grund angeben');
            return;
          }
          
          try {
            const response = await fetch(\`/api/admin/cancel-booking?password=\${adminPassword}\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                bookingId,
                reason,
                preview: true
              })
            });
            
            const data = await response.json();
            
            if (data.error) {
              showResult('error', 'Fehler: ' + data.error);
            } else {
              showResult('preview', \`
🔍 VORSCHAU - Was würde passieren:

📅 Buchung: \${data.booking.customerName}
💰 Erstattung: \${data.refundCalculation.refundAmount}€ (\${data.refundCalculation.refundPercent}%)
📧 E-Mails: Kunde + Admin werden benachrichtigt
🗄️ Status: Buchung wird als 'cancelled' markiert
⚡ Stripe: Refund wird automatisch verarbeitet

Das ist nur eine Vorschau - noch nichts passiert!
              \`);
            }
          } catch (error) {
            showResult('error', 'Netzwerkfehler: ' + error.message);
          }
        }
        
        async function executeCancellation() {
          const bookingId = document.getElementById('bookingId').value.trim();
          const reason = document.getElementById('reason').value.trim();
          const requestedBy = document.getElementById('requestedBy').value.trim();
          
          if (!bookingId || !reason || !requestedBy) {
            showResult('error', 'Bitte alle Felder ausfüllen');
            return;
          }
          
          if (!confirm('Stornierung WIRKLICH durchführen? Das kann nicht rückgängig gemacht werden!')) {
            return;
          }
          
          try {
            const response = await fetch(\`/api/admin/cancel-booking?password=\${adminPassword}\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                bookingId,
                reason,
                requestedBy
              })
            });
            
            const data = await response.json();
            
            if (data.error) {
              showResult('error', 'Fehler: ' + data.error);
            } else {
              showResult('success', \`
✅ STORNIERUNG ERFOLGREICH!

📋 Buchung: \${data.bookingId}
💰 Erstattung: \${data.refundAmount}€ (\${data.refundPercent}%)
🆔 Refund-ID: \${data.refundId || 'Keine Erstattung'}
📧 E-Mails: Versendet an Kunde und Admin
🗄️ Datenbank: Status aktualisiert

Die Erstattung wird von Stripe verarbeitet und erscheint in 5-10 Werktagen beim Kunden.
              \`);
              
              // Formular zurücksetzen
              document.getElementById('bookingId').value = '';
              document.getElementById('reason').value = 'Auf Kundenwunsch';
            }
          } catch (error) {
            showResult('error', 'Netzwerkfehler: ' + error.message);
          }
        }
        
        function showResult(type, message) {
          document.getElementById('result').innerHTML = \`
            <div class="result \${type}">
              \${message}
            </div>
          \`;
        }
      </script>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
} 