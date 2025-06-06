import { Metadata } from 'next';
import { apartmentConfig } from '@/lib/config';
import BookingButton from '@/components/BookingButton';
import { 
  MapPinIcon, 
  ClockIcon, 
  BuildingOfficeIcon,
  ShoppingBagIcon,
  TruckIcon,
  GlobeAltIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Lage & Umgebung - DevStay',
  description: 'Bad Friedrichshall - Perfekte Lage für IT-Professionals zwischen Stuttgart und Heilbronn mit exzellenter Verkehrsanbindung.',
};

const locationHighlights = [
  {
    icon: MapPinIcon,
    title: 'Zentrale Lage',
    description: 'Zwischen Stuttgart (45 min) und Heilbronn (15 min)',
    details: 'Perfekt für Business-Trips und regionale Termine'
  },
  {
    icon: TruckIcon,
    title: 'ÖPNV-Anbindung',
    description: 'S-Bahn S4 Richtung Stuttgart',
    details: '10 Min zu Fuß zum Bahnhof Bad Friedrichshall-Jagstfeld'
  },
  {
    icon: TruckIcon,
    title: 'Autobahn-Nähe',
    description: 'A6 und A81 in 5 Minuten',
    details: 'Tiefgaragenstellplatz inklusive'
  },
  {
    icon: ShoppingBagIcon,
    title: 'Nahversorgung',
    description: 'Alle wichtigen Geschäfte zu Fuß erreichbar',
    details: 'Supermarkt, Apotheke, Restaurants in der Nähe'
  }
];

const techHubs = [
  {
    name: 'Heilbronn',
    distance: '15 km',
    time: '15 min',
    description: 'TU Campus, Startup-Szene, Tech-Companies',
    companies: ['SAP', 'Schwarz IT', 'STACKIT']
  },
  {
    name: 'Stuttgart',
    distance: '45 km',
    time: '45 min',
    description: 'IT-Metropole Baden-Württemberg',
    companies: ['Mercedes-Benz', 'Porsche Digital', 'Bosch']
  },
  {
    name: 'Karlsruhe',
    distance: '85 km',
    time: '60 min',
    description: 'Tech-Hub mit KIT und Startups',
    companies: ['KIT', 'Cinovo', '1&1']
  },
  {
    name: 'Mannheim',
    distance: '55 km',
    time: '40 min',
    description: 'Wirtschaftszentrum Rhein-Neckar',
    companies: ['SAP', 'Roche', 'ABB']
  }
];

const nearbyPlaces = [
  {
    name: 'Bad Wimpfen',
    distance: '8 km',
    type: 'Historische Altstadt',
    description: 'Mittelalterliches Zentrum, perfekt für Spaziergänge'
  },
  {
    name: 'Neckar-Radweg',
    distance: '0 km',
    type: 'Direkt vor der Tür',
    description: 'Radweg entlang des Neckars für Sport und Erholung'
  },
  {
    name: 'Heilbronner Innenstadt',
    distance: '15 km',
    type: 'Shopping & Kultur',
    description: 'Experimenta, Theaters, Restaurants'
  },
  {
    name: 'Schwäbisch Hall',
    distance: '35 km',
    type: 'Kulturstadt',
    description: 'Historische Altstadt, Freilichtspiele'
  }
];

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-mist/5">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-96 md:h-[400px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-accent-700/60 z-10" />
          <div className="absolute inset-0 bg-[url('/images/bad-friedrichshall-hero.jpg')] bg-cover bg-center" />
          <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Bad Friedrichshall
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Perfekte Lage für IT-Professionals
              </p>
              <div className="mt-6 flex items-center text-lg">
                <MapPinIcon className="w-6 h-6 mr-2" />
                {apartmentConfig.location.address}, {apartmentConfig.location.zipCode} {apartmentConfig.location.city}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Highlights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Warum diese Lage perfekt ist
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Strategisch zwischen den IT-Zentren Stuttgart und Heilbronn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {locationHighlights.map((highlight, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent-100 rounded-full flex items-center justify-center">
                  <highlight.icon className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{highlight.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{highlight.description}</p>
                <p className="text-xs text-gray-500">{highlight.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Placeholder */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lage & Anfahrt
            </h2>
            <p className="text-lg text-gray-600">
              DSGVO-konforme Kartenansicht - ohne Tracking
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-primary-100 to-accent-50">
                <div className="w-full h-96 flex items-center justify-center">
                  <div className="text-center">
                    <GlobeAltIcon className="w-16 h-16 mx-auto mb-4 text-primary-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Interaktive Karte
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Coming soon - OpenStreetMap Integration
                    </p>
                    <div className="text-sm text-gray-500 bg-white/50 rounded-lg p-4 max-w-sm mx-auto">
                      <p className="font-medium">Aktuelle Adresse:</p>
                      <p>{apartmentConfig.location.address}</p>
                      <p>{apartmentConfig.location.zipCode} {apartmentConfig.location.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Hubs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tech-Hubs in der Nähe
            </h2>
            <p className="text-lg text-gray-600">
              Perfekte Anbindung zu den wichtigsten IT-Standorten
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {techHubs.map((hub, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{hub.name}</h3>
                    <p className="text-gray-600">{hub.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-accent-600">{hub.time}</div>
                    <div className="text-sm text-gray-500">{hub.distance}</div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Wichtige Unternehmen:</p>
                  <div className="flex flex-wrap gap-2">
                    {hub.companies.map((company, idx) => (
                      <span key={idx} className="px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-xs font-medium">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verkehrsanbindung */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Verkehrsanbindung
            </h2>
            <p className="text-lg text-gray-600">
              Flexibel mit Auto oder ÖPNV unterwegs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
                             <div className="flex items-center mb-4">
                 <TruckIcon className="w-8 h-8 text-accent-600 mr-3" />
                 <h3 className="text-xl font-semibold text-gray-900">Mit dem Auto</h3>
               </div>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                  A6 und A81 in 5 Minuten erreichbar
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                  Kostenloser Tiefgaragenstellplatz
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                  Stuttgart: 45 min, Heilbronn: 15 min
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                  Tankstellen und Services in der Nähe
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
                             <div className="flex items-center mb-4">
                 <TruckIcon className="w-8 h-8 text-accent-600 mr-3" />
                 <h3 className="text-xl font-semibold text-gray-900">Mit der Bahn</h3>
               </div>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                  S-Bahn S4 nach Stuttgart
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                  10 Min zu Fuß zum Bahnhof
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                  Direktverbindung ohne Umsteigen
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                  VVS-Verbund für Nahverkehr
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Umgebung & Freizeit */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Umgebung & Freizeit
            </h2>
            <p className="text-lg text-gray-600">
              Work-Life-Balance in schöner Umgebung
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyPlaces.map((place, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{place.name}</h3>
                  <div className="flex items-center text-sm text-accent-600 mb-2">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {place.distance}
                  </div>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    {place.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{place.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nahversorgung */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nahversorgung
            </h2>
            <p className="text-lg text-gray-600">
              Alles Wichtige in Gehentfernung
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent-100 rounded-full flex items-center justify-center">
                <ShoppingBagIcon className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Einkaufen</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>REWE (5 Min zu Fuß)</li>
                <li>DM Drogerie</li>
                <li>Bäckerei & Metzgerei</li>
                <li>Apotheke</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent-100 rounded-full flex items-center justify-center">
                <BuildingOfficeIcon className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Restaurants</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Diverse Restaurants</li>
                <li>Cafés & Bistros</li>
                <li>Lieferservice verfügbar</li>
                <li>Italiener, Griechisch, Deutsch</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent-100 rounded-full flex items-center justify-center">
                <CpuChipIcon className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Services</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Post & Paketshop</li>
                <li>Bank & Geldautomat</li>
                <li>Frisör & Kosmetik</li>
                <li>Tankstelle</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Überzeugt von der Lage?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Buchen Sie jetzt Ihr Tech-Apartment in perfekter Lage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BookingButton size="lg">
              Jetzt buchen
            </BookingButton>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-900 transition-colors">
              Zurück zum Apartment
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 