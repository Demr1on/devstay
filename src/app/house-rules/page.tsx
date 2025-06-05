import { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Hausordnung - DevStay',
  description: 'Hausordnung für DevStay IT-Apartment Bad Friedrichshall',
};

export default function HouseRulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-mist/5">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hausordnung
          </h1>
          <p className="text-xl opacity-90">
            Guidelines für einen angenehmen Aufenthalt
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Welcome */}
            <div className="bg-blue-50 rounded-xl shadow-lg p-8 mb-8 border border-blue-200">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🏠 Willkommen im DevStay!
                </h2>
                <p className="text-gray-700">
                  Diese Hausordnung hilft uns dabei, dass sich alle Gäste wohl fühlen 
                  und produktiv arbeiten können.
                </p>
              </div>
            </div>

            {/* Check-in/Check-out */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🔑 Check-in & Check-out
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-4">
                    🏠 Check-in (15:00 - 22:00)
                  </h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Code 2h vor Ankunft per SMS</li>
                    <li>• Schlüsselbox neben Eingangstür</li>
                    <li>• Bei Problemen: {siteConfig.contact.phone}</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">
                    🚪 Check-out (bis 11:00)
                  </h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• Apartment besenrein hinterlassen</li>
                    <li>• Müll entsorgen</li>
                    <li>• Schlüssel in Box zurücklegen</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Arbeitsbereich */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                💻 Arbeitsbereich & Technik
              </h2>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    📡 Internet & WLAN
                  </h4>
                  <div className="text-yellow-800 text-sm">
                    <p><strong>WLAN:</strong> DevStay_Guest</p>
                    <p><strong>Geschwindigkeit:</strong> 1000 Mbit/s</p>
                    <p><strong>Ethernet:</strong> Am Arbeitsplatz verfügbar</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">
                    ⚠️ Technik-Hinweise
                  </h4>
                  <ul className="text-red-800 text-sm space-y-1">
                    <li>• Sorgsam mit Technik umgehen</li>
                    <li>• Bei Problemen sofort melden</li>
                    <li>• Schäden werden berechnet</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Ruhezeiten */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🌙 Ruhezeiten
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">🌃 Nachtruhe</h4>
                  <p className="text-2xl font-bold text-primary-600">22:00 - 06:00</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">☀️ Mittagsruhe</h4>
                  <p className="text-2xl font-bold text-primary-600">13:00 - 15:00</p>
                  <p className="text-sm text-gray-600">Sonntags</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">📞 Videokonferenzen</h4>
                  <p className="text-xl font-bold text-green-600">06:00 - 22:00</p>
                </div>
              </div>
            </div>

            {/* Rauchen */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🚭 Rauchen
              </h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-3">
                  🚭 Rauchverbot in der Wohnung
                </h3>
                <ul className="text-red-800 text-sm space-y-1">
                  <li>• Absolutes Rauchverbot in allen Innenräumen</li>
                  <li>• Rauchen nur auf dem Balkon erlaubt</li>
                  <li>• E-Zigaretten eingeschlossen</li>
                </ul>
                <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-900">
                  <strong>⚠️ Verstoß:</strong> €150 Reinigungsgebühr
                </div>
              </div>
            </div>

            {/* Besucher */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                👥 Besucher
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-3">
                    ✅ Erlaubt
                  </h3>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Bis zu 2 Besucher (08:00 - 22:00)</li>
                    <li>• Geschäftstermine</li>
                    <li>• Arbeitskollegen</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-3">
                    ❌ Nicht erlaubt
                  </h3>
                  <ul className="text-red-800 text-sm space-y-1">
                    <li>• Übernachtung ohne Anmeldung</li>
                    <li>• Feiern oder Partys</li>
                    <li>• Code-Weitergabe</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Müll */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🗑️ Mülltrennung
              </h2>
              
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🟡</div>
                  <h4 className="font-semibold text-yellow-900">Gelber Sack</h4>
                  <p className="text-xs text-yellow-800">Dienstags</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🔵</div>
                  <h4 className="font-semibold text-blue-900">Papier</h4>
                  <p className="text-xs text-blue-800">1.+3. Mittwoch</p>
                </div>
                
                <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🟢</div>
                  <h4 className="font-semibold text-green-900">Bio</h4>
                  <p className="text-xs text-green-800">Freitags</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">⚫</div>
                  <h4 className="font-semibold text-gray-900">Restmüll</h4>
                  <p className="text-xs text-gray-800">Freitags</p>
                </div>
              </div>
            </div>

            {/* Kontakt */}
            <div className="bg-primary-50 rounded-xl shadow-lg p-8 mb-8 border border-primary-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📞 Kontakt & Support
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    🕒 Verfügbarkeit
                  </h3>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li><strong>Check-in:</strong> 14:00 - 23:00</li>
                    <li><strong>Support:</strong> 08:00 - 20:00</li>
                    <li><strong>Notfälle:</strong> 24/7</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    📱 Kontakt
                  </h3>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>📞 {siteConfig.contact.phone}</li>
                    <li>📧 {siteConfig.contact.email}</li>
                    <li>💬 WhatsApp verfügbar</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 rounded-xl p-6 text-center">
              <p className="text-gray-600 text-sm">
                <strong>📅 Stand:</strong> {new Date().toLocaleDateString('de-DE')}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Vielen Dank für Ihr Verständnis und einen angenehmen Aufenthalt!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 