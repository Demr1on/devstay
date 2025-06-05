import { PricingConfig } from '@/types';

// Zentrale Preiskonfiguration - hier können Sie alle Preise einfach anpassen
export const pricingConfig: PricingConfig = {
  basePrice: 89,                    // Grundpreis pro Nacht in €
  weeklyDiscountPercent: 10,        // Rabatt für Wochenbuchungen in %
  monthlyDiscountPercent: 20,       // Rabatt für Monatsbuchungen in %
  currency: 'EUR'
};

// Apartment-Details - hier können Sie die Ausstattung anpassen
export const apartmentConfig = {
  location: {
    address: 'Wacholderweg 2',
    city: 'Bad Friedrichshall',
    zipCode: '74177',
    coordinates: {
      lat: 49.2335,
      lng: 9.2101
    }
  },
  features: {
    internetSpeed: '400 Mbit',
    internetType: 'FTTH Glasfaser',
    monitors: 2,
    hasDesk: true,
    hasErgonomicChair: true,
    hasGarage: true,
    hasBikeStorage: true,
    maxGuests: 2,
    rooms: '1,5 Zimmer',
    fullyFurnished: true
  },
  amenities: [
    'Vollmöbliert inkl. Bettwäsche',
    '400 Mbit FTTH Internet',
    'Dual-Monitor Arbeitsplatz',
    'Ergonomischer Bürostuhl',
    'Tiefgaragenstellplatz',
    'Fahrradanker',
    'Kameraüberwachte Tiefgarage',
    'Gemütliche Couch',
    'Fernseher',
    'Vollausgestattete Küche',
    'Steckdosenleiste am Arbeitsplatz',
    'Switch für zusätzliche Geräte',
    'Ruhige Lage am Fluss',
    'Radweg vor der Tür'
  ]
};

// Website-Einstellungen
export const siteConfig = {
  name: 'DevStay',
  description: 'Vollmöbliertes Tech-Apartment in Bad Friedrichshall mit 400 Mbit Glasfaser, Dual-Monitor Setup und allem was ITler brauchen.',
  url: 'https://devstay.de',
  contact: {
    email: 'info@devstay.de',
    phone: '+49 123 456 789'
  },
  booking: {
    maxAdvanceBookingDays: 1,       // Bis zu 1 Tag im Voraus buchbar
    minStayNights: 1,               // Mindestaufenthalt
    maxStayNights: 90               // Maximaler Aufenthalt
  }
}; 