import { Metadata } from 'next';
import { apartmentConfig } from '@/lib/config';
import Image from 'next/image';
import BookingButton from '@/components/BookingButton';
import { 
  WifiIcon, 
  ComputerDesktopIcon, 
  HomeIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Apartment Details - DevStay',
  description: 'Vollmöbliertes Tech-Apartment mit 400 Mbit Glasfaser, Dual-Monitor Setup und allem was ITler brauchen.',
};

const techFeatures = [
  {
    icon: WifiIcon,
    title: '400 Mbit FTTH Glasfaser',
    description: 'Ultraschnelles Internet für Remote Work und Video Calls'
  },
  {
    icon: ComputerDesktopIcon,
    title: 'Dual-Monitor Arbeitsplatz',
    description: 'Ergonomischer Bürostuhl + großer Schreibtisch mit Kabelmanagement'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Sichere Tiefgarage',
    description: 'Kameraüberwacht mit Fahrradanker und direkter Wohnungszugang'
  },
  {
    icon: HomeIcon,
    title: 'Vollmöbliert',
    description: 'Hochwertige Einrichtung inkl. Bettwäsche und Küchenausstattung'
  }
];

const galleryImages = [
  {
    id: 1,
    src: '/images/apartment/living-room.jpg',
    alt: 'Wohnbereich mit Couch und Fernseher',
    title: 'Gemütlicher Wohnbereich'
  },
  {
    id: 2,
    src: '/images/apartment/office-setup.jpg',
    alt: 'Dual-Monitor Arbeitsplatz',
    title: 'Tech-Arbeitsplatz'
  },
  {
    id: 3,
    src: '/images/apartment/kitchen.jpg',
    alt: 'Vollausgestattete Küche',
    title: 'Moderne Küche'
  },
  {
    id: 4,
    src: '/images/apartment/bedroom.jpg',
    alt: 'Schlafbereich',
    title: 'Schlafbereich'
  },
  {
    id: 5,
    src: '/images/apartment/bathroom.jpg',
    alt: 'Badezimmer',
    title: 'Badezimmer'
  },
  {
    id: 6,
    src: '/images/apartment/garage.jpg',
    alt: 'Tiefgaragenstellplatz',
    title: 'Tiefgarage'
  }
];

export default function ApartmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-mist/5">
      {/* Hero Section mit Hauptbild */}
      <section className="relative">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-700/60 z-10" />
          <div className="absolute inset-0 bg-[url('/images/apartment-hero.jpg')] bg-cover bg-center" />
          <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Ihr Tech-Apartment in Bad Friedrichshall
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                {apartmentConfig.features.rooms} • {apartmentConfig.features.maxGuests} Personen • {apartmentConfig.features.internetSpeed} Internet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-primary-700">{apartmentConfig.features.rooms}</div>
              <div className="text-sm text-gray-600">Zimmer</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-primary-700">{apartmentConfig.features.internetSpeed}</div>
              <div className="text-sm text-gray-600">Internet</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-primary-700">{apartmentConfig.features.monitors}</div>
              <div className="text-sm text-gray-600">Monitore</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-primary-700">24/7</div>
              <div className="text-sm text-gray-600">Check-in</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfekt für IT-Professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Alles was Sie für produktives Remote Work brauchen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techFeatures.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bildergalerie */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apartment Eindrücke
            </h2>
            <p className="text-lg text-gray-600">
              Verschaffen Sie sich einen Überblick über Ihr Tech-Apartment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                  <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-accent-50 flex items-center justify-center">
                    <ClockIcon className="w-12 h-12 text-primary-400" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{image.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              📸 Professionelle Fotos folgen in Kürze
            </p>
          </div>
        </div>
      </section>

      {/* Ausstattung Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Vollständige Ausstattung
              </h2>
              <p className="text-lg text-gray-600">
                Alles da - Sie bringen nur den Laptop mit
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ComputerDesktopIcon className="w-6 h-6 mr-2 text-accent-600" />
                  Tech-Ausstattung
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                    {apartmentConfig.features.internetSpeed} {apartmentConfig.features.internetType}
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                    {apartmentConfig.features.monitors} externe Monitore
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                    Ergonomischer Bürostuhl
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                    Großer Schreibtisch mit Kabelmanagement
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                    Steckdosenleiste & Network Switch
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <HomeIcon className="w-6 h-6 mr-2 text-accent-600" />
                  Wohnen & Komfort
                </h3>
                <ul className="space-y-3">
                  {apartmentConfig.amenities.slice(0, 8).map((amenity, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 360° Tour Placeholder */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              360° Virtual Tour
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Erkunden Sie das Apartment virtuell - coming soon!
            </p>
            <div className="bg-white rounded-xl p-12 shadow-lg">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                <ComputerDesktopIcon className="w-12 h-12 text-primary-600" />
              </div>
              <p className="text-gray-600">
                Die interaktive 360°-Tour wird in Kürze verfügbar sein
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bereit für Ihren Tech-Aufenthalt?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Buchen Sie jetzt Ihr vollausgestattetes IT-Apartment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BookingButton size="lg">
              Jetzt buchen
            </BookingButton>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-900 transition-colors">
              Verfügbarkeit prüfen
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 