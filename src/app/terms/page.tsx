import { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'AGB - DevStay',
  description: 'Allgemeine Geschäftsbedingungen für DevStay - IT-Apartment Bad Friedrichshall',
  robots: 'noindex, nofollow',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-mist/5">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Allgemeine Geschäftsbedingungen
          </h1>
          <p className="text-xl opacity-90">
            Bedingungen für Ihre Buchung bei DevStay
          </p>
        </div>
      </section>

      {/* AGB Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* 1. Geltungsbereich */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                § 1 Geltungsbereich und Anbieter
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    🏢 Anbieter
                  </h3>
                  <div className="text-blue-800 text-sm">
                    <p><strong>Daniel Dewald</strong></p>
                    <p>Wacholderweg 2</p>
                    <p>74177 Bad Friedrichshall</p>
                    <p>Deutschland</p>
                    <p className="mt-2">
                      📧 E-Mail: <a href={`mailto:${siteConfig.contact.email}`} className="underline">{siteConfig.contact.email}</a><br/>
                      📞 Telefon: <a href={`tel:${siteConfig.contact.phone}`} className="underline">{siteConfig.contact.phone}</a>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Geltungsbereich
                  </h3>
                  <p>
                    Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Buchungen und 
                    Aufenthalte im IT-Apartment "DevStay" in Bad Friedrichshall.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Buchung */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                § 2 Buchung und Vertragsschluss
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    📅 Buchungsvorgang
                  </h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Buchung über das Online-Formular auf devstay.de</li>
                    <li>Vertragsschluss durch Buchungsbestätigung per E-Mail</li>
                    <li>Zahlung erfolgt vollständig bei Buchung über Stripe</li>
                    <li>Bei Nichtverfügbarkeit: vollständige Erstattung</li>
                  </ol>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">
                    💰 Preise und Rabatte
                  </h4>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Grundpreis: €89/Nacht (inkl. 19% MwSt.)</li>
                    <li>• Ab 7 Tagen: 10% Rabatt automatisch</li>
                    <li>• Ab 30 Tagen: 20% Rabatt automatisch</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Check-in/Check-out */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                § 3 Check-in und Check-out
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    🏠 Check-in
                  </h3>
                  <ul className="text-sm space-y-2">
                    <li><strong>Zeit:</strong> 15:00 - 22:00 Uhr</li>
                    <li><strong>Verfahren:</strong> Kontaktloser Check-in</li>
                    <li><strong>Code:</strong> 2h vor Ankunft per SMS</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    🚪 Check-out
                  </h3>
                  <ul className="text-sm space-y-2">
                    <li><strong>Zeit:</strong> Bis 11:00 Uhr</li>
                    <li><strong>Zustand:</strong> Besenrein</li>
                    <li><strong>Schlüssel:</strong> In Schlüsselbox</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Stornierung */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                § 4 Stornierungsbedingungen
              </h2>
              
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    💚 Bis 48h vor Check-in
                  </h4>
                  <p className="text-sm text-gray-600">100% Erstattung</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    💛 24-48h vor Check-in
                  </h4>
                  <p className="text-sm text-gray-600">50% Erstattung</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    ❤️ Weniger als 24h
                  </h4>
                  <p className="text-sm text-gray-600">Einzelfallprüfung</p>
                </div>
              </div>
            </div>

            {/* 5. Hausordnung */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                § 5 Nutzung und Hausordnung
              </h2>
              
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    ✅ Erlaubt
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Wohnen und Arbeiten für IT-Professionals</li>
                    <li>Nutzung aller Einrichtungen</li>
                    <li>Bis zu 2 Besucher tagsüber</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    ❌ Nicht erlaubt
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Rauchen in der Wohnung</li>
                    <li>Feiern oder laute Musik</li>
                    <li>Überbelegung</li>
                    <li>Haustiere (ohne Absprache)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 6. Haftung */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                § 6 Haftung
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Der Vermieter haftet nur bei vorsätzlichen oder grob fahrlässigen 
                  Pflichtverletzungen. Der Mieter haftet für alle durch ihn oder 
                  seine Besucher verursachten Schäden.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    💼 Versicherungsempfehlung
                  </h4>
                  <p className="text-blue-800 text-sm">
                    Wir empfehlen den Abschluss einer Reisehaftpflichtversicherung.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6 text-center">
              <p className="text-gray-600 text-sm">
                <strong>📅 Stand:</strong> {new Date().toLocaleDateString('de-DE')}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Bei Fragen zu diesen AGB wenden Sie sich an:{' '}
                <a href={`mailto:${siteConfig.contact.email}`} className="underline">
                  {siteConfig.contact.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 