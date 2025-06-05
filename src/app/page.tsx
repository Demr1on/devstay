import Link from 'next/link';
import PricingCard from '@/components/PricingCard';

export default function Home() {
  const features = [
    {
      title: "400 Mbit Glasfaser",
      description: "Ultraschnelles FTTH Internet für seamless Remote Work und Video-Calls",
      icon: "🌐",
      color: "text-blue-600"
    },
    {
      title: "Dual-Monitor Setup",
      description: "Professioneller Arbeitsplatz mit zwei Monitoren und ergonomischem Bürostuhl",
      icon: "🖥️",
      color: "text-purple-600"
    },
    {
      title: "Vollmöbliert",
      description: "Gemütliche Couch, Fernseher, Küche und alles was Sie brauchen",
      icon: "🏠",
      color: "text-green-600"
    },
    {
      title: "Tiefgarage",
      description: "Sicherer Stellplatz mit Fahrradanker und Kameraüberwachung",
      icon: "🚗",
      color: "text-orange-600"
    },
    {
      title: "Ruhige Lage",
      description: "Direkt am Fluss mit Radweg - perfekt zum Abschalten nach der Arbeit",
      icon: "🌊",
      color: "text-cyan-600"
    },
    {
      title: "Tech-Ready",
      description: "Steckdosenleiste, Switch und alles für Ihr Equipment bereit",
      icon: "⚡",
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Ihr perfektes
              <span className="block text-primary-200">Tech-Apartment</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto animate-slide-up">
              Vollmöblierte 1,5-Zimmer Wohnung in Bad Friedrichshall mit allem was ITler brauchen.
              400 Mbit Glasfaser, Dual-Monitor Setup und absolute Ruhe für produktives Arbeiten.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                href="/apartment"
                className="bg-white text-primary-800 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Apartment ansehen
              </Link>
              <Link
                href="/booking"
                className="bg-accent-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-accent-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Jetzt buchen - ab 89€
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-200">400</div>
                <div className="text-primary-300">Mbit/s Internet</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-200">2</div>
                <div className="text-primary-300">Monitore</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-200">89€</div>
                <div className="text-primary-300">pro Nacht</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-200">24h</div>
                <div className="text-primary-300">Vorab-Buchung</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Warum ITler unser Apartment lieben
            </h2>
            <p className="text-xl text-secondary-700 max-w-3xl mx-auto">
              Speziell für Tech-Professionals entwickelt - mit allem was Sie für produktives Remote Work brauchen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 border border-primary-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Preview - DSGVO-konform ohne interaktive Karte */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Perfekte Lage in Bad Friedrichshall
              </h2>
              <div className="space-y-6 text-secondary-600">
                <div className="flex items-start">
                  <div className="w-6 h-6 mt-1 mr-3 text-accent-700">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-secondary-900">Wacholderweg 2, 74177 Bad Friedrichshall</strong>
                    <p>Ruhige Wohngegend mit direktem Zugang zum Neckar</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 mt-1 mr-3 text-accent-700">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-secondary-900">Nur 20 Minuten nach Heilbronn</strong>
                    <p>Direkter Zugang zu Tech-Unternehmen und Coworking Spaces</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 mt-1 mr-3 text-accent-700">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-secondary-900">Radweg direkt vor der Tür</strong>
                    <p>Entspannung nach der Arbeit am Fluss entlang</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/location"
                  className="bg-accent-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-800 transition-colors duration-200 inline-block"
                >
                  Lage & Umgebung erkunden
                </Link>
              </div>
            </div>
            <div className="bg-primary-100 rounded-xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  Bad Friedrichshall im Herzen von Baden-Württemberg
                </h3>
                <div className="space-y-4 text-sm text-secondary-700">
                  <div className="bg-white rounded-lg p-4">
                    <div className="font-medium text-secondary-900 mb-2">🚗 Verkehrsanbindung</div>
                    <p>A6 & A81 in 10-15 Min • Stuttgart 45 Min • Mannheim 30 Min</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="font-medium text-secondary-900 mb-2">🏢 Tech-Hubs</div>
                    <p>Heilbronn Campus • SAP Arena Region • Auto-Industrie</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="font-medium text-secondary-900 mb-2">🌿 Natur</div>
                    <p>Neckar-Radweg • Kraichgau • Löwensteiner Berge</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Transparente Preise
            </h2>
            <p className="text-xl text-secondary-700 max-w-3xl mx-auto">
              Faire Preise mit attraktiven Rabatten für längere Aufenthalte
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <PricingCard />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bereit für Ihren produktiven Aufenthalt?
          </h2>
          <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
            Buchen Sie jetzt Ihr Tech-Apartment und erleben Sie perfektes Remote Work in Bad Friedrichshall
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-accent-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-accent-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Jetzt buchen
            </Link>
            <Link
              href="/contact"
              className="border-2 border-primary-300 text-primary-200 px-8 py-4 rounded-lg font-semibold hover:bg-primary-300 hover:text-primary-900 transition-all duration-300"
            >
              Fragen stellen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
