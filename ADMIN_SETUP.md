# Admin-Setup Anleitung

## ✅ Was wurde implementiert

### 1. 📧 E-Mail-Benachrichtigungen
- **Kunde**: Erhält weiterhin Buchungsbestätigung
- **Admin**: Erhält **NEU** eine Benachrichtigung bei jeder neuen Buchung mit allen Details

### 2. 🗄️ Buchungs-ID für Stornierungen
- **Tabelle**: `bookings`
- **Spalte**: `id` (UUID)
- **Format**: z.B. "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
- **Verwendung**: Diese ID wird für Admin-Stornierungen verwendet

### 3. 🔐 Admin-Dashboard mit GitHub-Authentifizierung
- **URL**: `/admin`
- **Authentifizierung**: GitHub OAuth
- **Features**: 
  - Buchungsübersicht
  - Statistiken
  - Stornierungsfunktion

## 🚀 Setup-Schritte

### 1. GitHub OAuth App erstellen

1. Gehe zu GitHub Settings → Developer settings → OAuth Apps
2. Klicke "New OAuth App"
3. Fülle aus:
   - **Application name**: "DevStay Admin"
   - **Homepage URL**: `https://yourdomain.com`
   - **Authorization callback URL**: `https://yourdomain.com/api/auth/callback/github`
4. Kopiere Client ID und Client Secret

### 2. Umgebungsvariablen hinzufügen

Füge diese Variablen zu deiner `.env.local` hinzu:

```bash
# NextAuth.js
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=dein-geheimer-schluessel-32-zeichen

# GitHub OAuth
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret

# Bestehende Variablen bleiben erhalten...
```

### 3. Admin-E-Mails konfigurieren

In `src/lib/auth.ts` sind diese E-Mail-Adressen als Admin zugelassen:
```typescript
const ADMIN_EMAILS = [
  'daniel@devstay.de',
  'info@devstay.de',
  // Weitere Admin-E-Mails hier hinzufügen
];
```

### 4. Datenbank-Migration ausführen

```bash
# NextAuth-Tabellen erstellen
npm run db:generate
npm run db:migrate
```

## 📋 Verwendung

### Admin-Zugang
1. Gehe zu `/admin`
2. Melde dich mit GitHub an (nur erlaubte E-Mails funktionieren)
3. Du siehst das Dashboard mit allen Buchungen

### Buchung stornieren
1. Im Admin-Dashboard auf "Stornieren" klicken
2. Admin-Passwort eingeben (aus ADMIN_PASSWORD)
3. Automatische Rückerstattung über Stripe

### E-Mail-Benachrichtigungen
- **Bei neuer Buchung**: Du erhältst automatisch eine E-Mail an `info@devstay.de`
- **Kunde**: Erhält weiterhin seine Buchungsbestätigung

## 🔧 Technische Details

### E-Mail-System
- **Kundenmails**: `sendBookingConfirmation()` 
- **Adminmails**: `notifyAdminCustomerInquiry()` mit Urgency "medium"
- **Webhook**: Erweitert um Admin-Benachrichtigung

### Datenbank
```sql
-- Buchungs-ID ist in der bookings-Tabelle:
SELECT id, status, total_price FROM bookings WHERE id = 'uuid-hier';

-- Neue NextAuth-Tabellen für OAuth:
accounts, sessions, users, verification_tokens
```

### Sicherheit
- **GitHub OAuth**: Nur erlaubte E-Mail-Adressen können sich anmelden
- **Admin-Passwort**: Weiterhin für Stornierungen erforderlich
- **Rate Limiting**: Schutz vor Brute Force (bereits implementiert)

## 🚨 Wichtige Hinweise

1. **GitHub-Account**: Du musst dich mit dem GitHub-Account anmelden, der die erlaubte E-Mail-Adresse hat
2. **NEXTAUTH_SECRET**: Muss ein sicherer, zufälliger String sein (32+ Zeichen)
3. **HTTPS**: NextAuth.js funktioniert nur mit HTTPS in Production
4. **Admin-E-Mails**: Werden an `info@devstay.de` gesendet

## 🧪 Testen

1. **Lokale Entwicklung**: 
   ```bash
   npm run dev
   # Gehe zu http://localhost:3000/admin
   ```

2. **Testbuchung**: Erstelle eine Testbuchung und prüfe, ob du die Admin-E-Mail erhältst

3. **Admin-Dashboard**: Teste das Ein-/Ausloggen und die Buchungsansicht

## 📞 Support

Bei Problemen:
- Prüfe die Browser-Konsole auf Fehler
- Prüfe die Server-Logs für E-Mail-Versand
- Stelle sicher, dass alle Umgebungsvariablen gesetzt sind 