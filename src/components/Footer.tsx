import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-shadow text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">DevStay</h3>
            <p className="text-secondary-300 mb-4 max-w-md">
              Ihr perfektes Tech-Apartment in Bad Friedrichshall. Vollmöbliert, 
              schnelles Internet und alles was ITler für einen produktiven Aufenthalt brauchen.
            </p>
            <div className="space-y-2 text-secondary-300">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Wacholderweg 2, 74177 Bad Friedrichshall
              </p>
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@devstay.de
              </p>
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +49 123 456 789
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-secondary-300 hover:text-white transition-colors">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/apartment" className="text-secondary-300 hover:text-white transition-colors">
                  Apartment
                </Link>
              </li>
              <li>
                <Link href="/location" className="text-secondary-300 hover:text-white transition-colors">
                  Lage
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-secondary-300 hover:text-white transition-colors">
                  Preise
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-secondary-300 hover:text-white transition-colors">
                  Buchen
                </Link>
              </li>
              <li>
                <Link href="/cancel-booking" className="text-secondary-300 hover:text-white transition-colors">
                  Stornierung
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/house-rules" className="text-secondary-300 hover:text-white transition-colors">
                  Hausordnung
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-secondary-300 hover:text-white transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-secondary-300 hover:text-white transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="text-secondary-300 hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Banner */}
        <div className="mt-8 pt-8 border-t border-secondary-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 mb-2 text-primary-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <span className="text-sm text-secondary-300">400 Mbit FTTH</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 mb-2 text-primary-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm text-secondary-300">Dual Monitor</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 mb-2 text-primary-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                </svg>
              </div>
              <span className="text-sm text-secondary-300">Tiefgarage</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 mb-2 text-primary-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-sm text-secondary-300">Vollmöbliert</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-secondary-700 text-center text-secondary-400">
          <p>&copy; 2024 DevStay. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
} 