# DevStay - Vercel Postgres Setup

## 🚀 Schnellstart

### 1. Vercel Postgres Datenbank erstellen
```bash
# In Vercel Dashboard:
# 1. Projekt öffnen
# 2. Storage Tab → Create Database
# 3. Postgres auswählen
# 4. Name: devstay-db
# 5. Region: Frankfurt (eu-central-1)
```

### 2. Umgebungsvariablen abrufen
```bash
# Automatisch in Vercel gesetzt:
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

### 3. Lokale Entwicklung
```bash
# Umgebungsvariablen herunterladen
vercel env pull .env.local

# Datenbank-Schema generieren
npm run db:generate

# Schema in Datenbank pushen
npm run db:push
```

### 4. Produktions-Deployment
```bash
# Automatisch bei Vercel Deploy
vercel --prod
```

## 📊 Datenbank-Schema

### Tabellen:
- **customers** - Kundendaten
- **bookings** - Buchungsinformationen
- **blocked_dates** - Blockierte Termine
- **email_log** - E-Mail-Versand-Protokoll

### Wichtige Features:
- ✅ Verfügbarkeitsprüfung
- ✅ Automatische Check-in Code Generierung
- ✅ E-Mail-Status-Tracking
- ✅ Stripe-Integration
- ✅ Vollständige TypeScript-Typen

## 🛠 Verfügbare Scripts

```bash
# Datenbank-Schema generieren
npm run db:generate

# Migrationen anwenden
npm run db:migrate

# Schema direkt pushen (Development)
npm run db:push

# Drizzle Studio öffnen
npm run db:studio
```

## 🔧 API-Endpoints

### Verfügbarkeitsprüfung
```javascript
GET /api/availability?checkIn=2024-03-15&checkOut=2024-03-18
```

### Buchung erstellen
```javascript
POST /api/checkout-sessions
{
  "checkIn": "2024-03-15",
  "checkOut": "2024-03-18",
  "amount": 267,
  "customerDetails": { ... }
}
```

## 📧 E-Mail-Integration (TODO)

```bash
# Resend Integration hinzufügen
npm install resend

# Template-System erstellen
# Automatische Check-in Codes versenden
```

## 🚨 Wichtige Hinweise

1. **Vercel Postgres Free Tier**: 60h Compute/Monat
2. **Backup**: Automatisch durch Vercel
3. **Scaling**: Automatisch bei höherem Traffic
4. **Monitoring**: Über Vercel Dashboard

## 🎯 Nächste Schritte

1. ✅ Datenbank setup abgeschlossen
2. 📧 E-Mail-Service integrieren (Resend)
3. 📅 Check-in Code Automation
4. 📊 Admin-Dashboard erstellen 