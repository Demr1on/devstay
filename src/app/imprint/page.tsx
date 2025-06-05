import { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Impressum - DevStay',
  description: 'Impressum und Anbieterkennzeichnung für DevStay - IT-Apartment Bad Friedrichshall',
  robots: 'noindex, nofollow',
};

export default function ImprintPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-mist/5">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Impressum
          </h1>
          <p className="text-xl opacity-90">
            Anbieterkennzeichnung nach § 5 TMG
          </p>
        </div>
      </section>

      {/* Impressum Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Anbieter Information */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Anbieter und Betreiber
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Verantwortlich für den Inhalt:
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="font-medium">Daniel Dewald</p>
                    <p>Wacholderweg 2</p>
                    <p>74177 Bad Friedrichshall</p>
                    <p>Deutschland</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Kontakt:
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <span className="font-medium">E-Mail:</span>{' '}
                      <a href={`mailto:${siteConfig.contact.email}`} className="text-primary-600 hover:underline">
                        {siteConfig.contact.email}
                      </a>
                    </p>
                    <p>
                      <span className="font-medium">Telefon:</span>{' '}
                      <a href={`tel:${siteConfig.contact.phone}`} className="text-primary-600 hover:underline">
                        {siteConfig.contact.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rechtliche Hinweise */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Rechtliche Hinweise
              </h2>
              
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Umsatzsteuer-Identifikationsnummer:
                  </h3>
                  <p>
                    Gemäß § 27a Umsatzsteuergesetz: 
                    <span className="font-medium ml-2">[Wird bei Bedarf nachgetragen]</span>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Berufsbezeichnung und berufsrechtliche Regelungen:
                  </h3>
                  <p>
                    Kurzzeitvermietung von möbliertem Wohnraum in Deutschland.
                    Es gelten die Bestimmungen der örtlichen Bauordnung sowie mietrechtliche Vorschriften.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Online-Streitbeilegung (OS):
                  </h3>
                  <p>
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                    <a 
                      href="https://ec.europa.eu/consumers/odr/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      https://ec.europa.eu/consumers/odr/
                    </a>
                  </p>
                  <p className="mt-2">
                    Unsere E-Mail-Adresse finden Sie oben im Impressum.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Verbraucherstreitbeilegung:
                  </h3>
                  <p>
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren 
                    vor einer Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>
              </div>
            </div>

            {/* Haftungsausschluss */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Haftungsausschluss
              </h2>
              
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Haftung für Inhalte:
                  </h3>
                  <p>
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                    nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                    Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte 
                    fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine 
                    rechtswidrige Tätigkeit hinweisen.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Haftung für Links:
                  </h3>
                  <p>
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                    Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                    Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                    Seiten verantwortlich.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Urheberrecht:
                  </h3>
                  <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                    dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                    der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                    Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                </div>
              </div>
            </div>

            {/* Technische Umsetzung */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Technische Umsetzung
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Website-Entwicklung:
                  </h3>
                  <p>Diese Website wurde entwickelt mit Next.js, TypeScript und Tailwind CSS.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Hosting:
                  </h3>
                  <p>
                    Vercel Inc.<br/>
                    440 N Baywood Dr<br/>
                    San Mateo, CA 94402<br/>
                    USA
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Zahlungsabwicklung:
                  </h3>
                  <p>
                    Stripe, Inc.<br/>
                    510 Townsend Street<br/>
                    San Francisco, CA 94103<br/>
                    USA
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Stand: {new Date().toLocaleDateString('de-DE')}</p>
              <p className="mt-2">
                Bei Fragen zum Impressum wenden Sie sich bitte an:{' '}
                <a href={`mailto:${siteConfig.contact.email}`} className="text-primary-600 hover:underline">
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