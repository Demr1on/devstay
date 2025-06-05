import { Metadata } from 'next';
import { pricingConfig } from '@/lib/config';
import PricingCard from '@/components/PricingCard';
import { 
  CurrencyEuroIcon, 
  CalendarDaysIcon, 
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Preise & Verfügbarkeit - DevStay',
  description: 'Transparente Preise für Ihr Tech-Apartment in Bad Friedrichshall. Attraktive Rabatte für längere Aufenthalte.',
};

const pricingBenefits = [
  {
    icon: CurrencyEuroIcon,
    title: 'Transparente Preise',
    description: 'Keine versteckten Kosten - alles inklusive'
  },
  {
    icon: ClockIcon,
    title: 'Flexible Aufenthaltsdauer',
    description: 'Von 1 Nacht bis mehrere Monate'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Vollzahlung bei Buchung',
    description: 'Sichere Bezahlung, kein Aufwand vor Ort'
  },
  {
    icon: CalendarDaysIcon,
    title: 'Kurzfristige Buchungen',
    description: 'Bis zu 1 Tag im Voraus buchbar'
  }
];

const additionalServices = [
  {
    service: 'Extra Reinigung',
    price: '25€',
    description: 'Zwischenreinigung bei längeren Aufenthalten',
    optional: true
  },
  {
    service: 'Late Check-in',
    price: '0€',
    description: '24/7 Self-Check-in mit Code',
    optional: false
  },
  {
    service: 'Bettwäsche-Wechsel',
    price: '15€',
    description: 'Wöchentlicher Wechsel bei längeren Aufenthalten',
    optional: true
  },
  {
    service: 'Parkplatz',
    price: '0€',
    description: 'Tiefgaragenstellplatz inklusive',
    optional: false
  }
];

const pricingExamples = [
  {
    duration: '3 Nächte',
    basePrice: pricingConfig.basePrice * 3,
    discount: 0,
    finalPrice: pricingConfig.basePrice * 3,
    perNight: pricingConfig.basePrice,
    label: 'Geschäftsreise'
  },
  {
    duration: '1 Woche',
    basePrice: pricingConfig.basePrice * 7,
    discount: Math.round(pricingConfig.basePrice * 7 * pricingConfig.weeklyDiscountPercent / 100),
    finalPrice: Math.round(pricingConfig.basePrice * 7 * (1 - pricingConfig.weeklyDiscountPercent / 100)),
    perNight: Math.round(pricingConfig.basePrice * (1 - pricingConfig.weeklyDiscountPercent / 100)),
    label: 'Projekteinsatz'
  },
  {
    duration: '1 Monat',
    basePrice: pricingConfig.basePrice * 30,
    discount: Math.round(pricingConfig.basePrice * 30 * pricingConfig.monthlyDiscountPercent / 100),
    finalPrice: Math.round(pricingConfig.basePrice * 30 * (1 - pricingConfig.monthlyDiscountPercent / 100)),
    perNight: Math.round(pricingConfig.basePrice * (1 - pricingConfig.monthlyDiscountPercent / 100)),
    label: 'Remote Work'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-mist/5">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Preise & Verfügbarkeit
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Transparente Preise mit attraktiven Rabatten für längere Aufenthalte
          </p>
        </div>
      </section>

      {/* Pricing Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unsere Preisvorteile
            </h2>
            <p className="text-lg text-gray-600">
              Faire und transparente Preisgestaltung
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingBenefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent-100 rounded-full flex items-center justify-center">
                  <benefit.icon className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Pricing Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unsere Preispakete
            </h2>
            <p className="text-lg text-gray-600">
              Je länger Sie bleiben, desto mehr sparen Sie
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <PricingCard className="mx-auto" />
          </div>
        </div>
      </section>

      {/* Pricing Examples */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Preisbeispiele
            </h2>
            <p className="text-lg text-gray-600">
              Realistische Szenarien für verschiedene Aufenthaltsdauern
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <div className="inline-block px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-2">
                    {example.label}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{example.duration}</h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Grundpreis:</span>
                    <span>{example.basePrice}€</span>
                  </div>
                  {example.discount > 0 && (
                    <div className="flex justify-between text-accent-600">
                      <span>Rabatt:</span>
                      <span>-{example.discount}€</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Gesamt:</span>
                    <span>{example.finalPrice}€</span>
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    {example.perNight}€ pro Nacht
                  </div>
                </div>

                <button className="w-full bg-accent-500 text-white py-2 rounded-lg hover:bg-accent-600 transition-colors">
                  Buchen
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Zusatzleistungen
            </h2>
            <p className="text-lg text-gray-600">
              Optional buchbare Services für noch mehr Komfort
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{service.service}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-accent-600">{service.price}</div>
                    {!service.optional && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto mt-1" />
                    )}
                  </div>
                </div>
                {service.optional && (
                  <button className="text-accent-600 text-sm hover:text-accent-700 transition-colors">
                    Optional hinzufügen →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Policy */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Buchungsbedingungen
              </h2>
              <p className="text-lg text-gray-600">
                Einfach und flexibel buchen
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CalendarDaysIcon className="w-6 h-6 mr-2 text-accent-600" />
                  Buchungszeiten
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Buchbar bis 1 Tag im Voraus</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Mindestaufenthalt: 1 Nacht</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Maximaler Aufenthalt: 90 Tage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">24/7 Self-Check-in möglich</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CurrencyEuroIcon className="w-6 h-6 mr-2 text-accent-600" />
                  Zahlungsbedingungen
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Vollzahlung bei Buchung</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Sichere Zahlung via Stripe</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Kreditkarte, SEPA, PayPal</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Automatische Rechnung per E-Mail</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-green-50 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stornierungsbedingungen
              </h3>
              <p className="text-green-600 font-medium">
                ✅ 100% kostenlose Stornierung jederzeit
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Volle Rückerstattung ohne Bearbeitungsgebühren
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bereit für Ihre Buchung?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Transparente Preise, keine versteckten Kosten
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors">
              Verfügbarkeit prüfen
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-900 transition-colors">
              Apartment ansehen
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 