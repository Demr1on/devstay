'use client';

import { Metadata } from 'next';
import { useState, useEffect } from 'react';
import { siteConfig } from '@/lib/config';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

// Table of Contents Struktur
const tableOfContents = [
  { id: 'ueberblick', title: '1. Überblick' },
  { id: 'datenerfassung', title: '2. Datenerfassung' },
  { id: 'hosting', title: '3. Hosting (Vercel)' },
  { id: 'buchungsdaten', title: '4. Buchungsdaten' },
  { id: 'stripe', title: '5. Stripe Zahlungen' },
  { id: 'cookies', title: '6. Cookies' },
  { id: 'kontaktformular', title: '7. Kontaktformular' },
  { id: 'rechte', title: '8. Ihre Rechte' },
  { id: 'ssl', title: '9. SSL-Verschlüsselung' },
  { id: 'kontakt', title: '10. Kontakt' },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('');

  // Scroll-to-Section Function mit Smooth Scrolling
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Active Section Detection für Inhaltsverzeichnis
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0.1
      }
    );

    tableOfContents.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-mist/5">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Datenschutzerklärung
          </h1>
          <p className="text-xl opacity-90">
            DSGVO-konforme Datenverarbeitung bei DevStay
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto flex gap-8">
          
          {/* 📋 Sticky Table of Contents Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  📋 Inhaltsverzeichnis
                </h2>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                        activeSection === item.id
                          ? 'bg-primary-100 text-primary-700 font-medium border-l-4 border-primary-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-sm">{item.title}</span>
                      <ChevronRightIcon 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeSection === item.id ? 'transform rotate-90 text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`} 
                      />
                    </button>
                  ))}
                </nav>
                
                {/* Quick Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-xs">
                    💡 <strong>Tipp:</strong> Klicken Sie auf einen Abschnitt um direkt dorthin zu springen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            
            {/* 1. Überblick */}
            <section id="ueberblick" className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                1. Überblick und verantwortliche Stelle
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der 
                  Verarbeitung personenbezogener Daten bei der Nutzung unserer Website devstay.de auf.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    🏢 Verantwortliche Stelle
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
              </div>
            </section>

            {/* 2. Datenerfassung */}
            <section id="datenerfassung" className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                2. Datenerfassung auf unserer Website
              </h2>
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🔍 Automatisch erfasste Daten
                  </h3>
                  <p>
                    Beim Besuch der Website werden automatisch folgende Informationen erfasst:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>IP-Adresse (anonymisiert)</li>
                    <li>Datum und Uhrzeit des Zugriffs</li>
                    <li>Browser-Typ und Version</li>
                    <li>Betriebssystem</li>
                    <li>Aufgerufene Seiten</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    📝 Von Ihnen bereitgestellte Daten
                  </h3>
                  <p>
                    Bei Buchungen oder Kontaktaufnahme erfassen wir nur die notwendigen Daten:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Name und Kontaktdaten</li>
                    <li>Buchungsdetails (Zeitraum, etc.)</li>
                    <li>Zahlungsinformationen (über Stripe)</li>
                    <li>Kommunikationsinhalte</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">
                    ✅ Datenminimierung
                  </h4>
                  <p className="text-green-800 text-sm">
                    Wir erfassen nur Daten, die für die Buchungsabwicklung erforderlich sind.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Hosting */}
            <section id="hosting" className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                3. Hosting und Infrastruktur
              </h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-900">
                  🌐 Vercel Inc.
                </h3>
                <p>
                  Unsere Website wird bei Vercel Inc. (USA) gehostet. Vercel verarbeitet 
                  dabei technische Daten zur Bereitstellung der Website.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                  </p>
                </div>
                <p>
                  Weitere Informationen: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener" className="text-primary-600 hover:underline">Vercel Privacy Policy</a>
                </p>
              </div>
            </section>

            {/* 4. Buchungsdaten */}
            <section id="buchungsdaten" className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                4. Buchungsdaten und Vertragsdaten
              </h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-900">
                  📋 Erfasste Buchungsdaten:
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Persönliche Daten:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Vor- und Nachname</li>
                      <li>• E-Mail-Adresse</li>
                      <li>• Telefonnummer</li>
                      <li>• Unternehmen (optional)</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Buchungsdetails:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Aufenthaltszeitraum</li>
                      <li>• Besondere Wünsche (optional)</li>
                      <li>• Rechnungsadresse</li>
                      <li>• Buchungsstatus</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-green-800 text-sm">
                    <strong>⚖️ Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) 
                    und Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung)
                  </p>
                </div>
                
                <p>
                  Diese Daten werden ausschließlich zur Buchungsabwicklung verwendet und nach 
                  den gesetzlichen Aufbewahrungsfristen (i.d.R. 10 Jahre) gelöscht.
                </p>
              </div>
            </section>

            {/* 5. Stripe */}
            <section id="stripe" className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                5. Zahlungsabwicklung mit Stripe
              </h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-900">
                  💳 Stripe Payments Europe Ltd.
                </h3>
                <p>
                  Für Zahlungen nutzen wir Stripe (Dublin, Irland). Stripe verarbeitet 
                  Zahlungsdaten nach höchsten Sicherheitsstandards (PCI DSS Level 1).
                </p>
                
                <h4 className="font-semibold text-gray-900 mt-4">
                  📤 An Stripe übertragene Daten:
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Zahlungsinformationen (Kreditkarte, IBAN)</li>
                    <li>Rechnungsadresse</li>
                    <li>E-Mail-Adresse</li>
                    <li>Buchungsdetails und Betrag</li>
                  </ul>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Transaktions-ID</li>
                    <li>Zeitstempel der Zahlung</li>
                    <li>Browser- und Geräteinformationen</li>
                    <li>IP-Adresse (für Betrugsschutz)</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    🔒 Höchste Sicherheit
                  </h4>
                  <p className="text-blue-800 text-sm">
                    Stripe ist PCI DSS Level 1 zertifiziert - der höchste Sicherheitsstandard 
                    für Zahlungsabwicklung. Alle Zahlungsdaten werden verschlüsselt übertragen 
                    und wir haben keinen Zugriff auf Ihre Kreditkartendaten.
                  </p>
                </div>

                <p>
                  Stripe Datenschutz: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener" className="text-primary-600 hover:underline">https://stripe.com/de/privacy</a>
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>⚖️ Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). 
                    Die Übertragung erfolgt ausschließlich zur Abwicklung Ihrer Zahlung.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Cookies */}
            <section id="cookies" className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                6. Cookies und lokale Speicherung
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">
                    ✅ Minimaler Cookie-Einsatz
                  </h3>
                  <p className="text-green-800 text-sm">
                    Wir verwenden nur technisch notwendige Cookies - keine Tracking-Cookies!
                  </p>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">
                  🍪 Verwendete Cookies:
                </h3>
                
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Session-Cookies</h4>
                    <p className="text-sm text-gray-600">Für Buchungsprozess und Navigation</p>
                    <p className="text-xs text-gray-500 mt-1">Verfallen: Nach Schließen des Browsers</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Sicherheits-Cookies</h4>
                    <p className="text-sm text-gray-600">Schutz vor CSRF-Angriffen</p>
                    <p className="text-xs text-gray-500 mt-1">Verfallen: Nach 24 Stunden</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Stripe-Cookies</h4>
                    <p className="text-sm text-gray-600">Für sichere Zahlungsabwicklung</p>
                    <p className="text-xs text-gray-500 mt-1">Verfallen: Nach Zahlung</p>
                  </div>
                </div>
                
                <p>
                  Sie können Cookies in Ihren Browser-Einstellungen verwalten. 
                  Ohne technisch notwendige Cookies funktioniert die Website möglicherweise nicht ordnungsgemäß.
                </p>
              </div>
            </section>

            {/* 7. Kontaktformular */}
            <section id="kontaktformular" className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                7. Kontaktformular und E-Mail-Verkehr
              </h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-900">
                  📧 Kontaktaufnahme
                </h3>
                <p>
                  Wenn Sie uns per Kontaktformular oder E-Mail Anfragen zukommen lassen, 
                  werden Ihre Angaben zur Bearbeitung der Anfrage bei uns gespeichert.
                </p>
                
                <h4 className="font-semibold text-gray-900">
                  Gespeicherte Daten:
                </h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>E-Mail-Adresse</li>
                  <li>Name (falls angegeben)</li>
                  <li>Nachrichteninhalt</li>
                  <li>Zeitstempel</li>
                </ul>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>⚖️ Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse 
                    an der Bearbeitung Ihrer Anfrage).
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    🗂️ Aufbewahrung
                  </h4>
                  <p className="text-blue-800 text-sm">
                    Kontaktdaten werden nach Bearbeitung Ihrer Anfrage gelöscht, 
                    es sei denn, Sie werden unser Gast - dann gelten die Aufbewahrungsfristen für Vertragsdaten.
                  </p>
                </div>
              </div>
            </section>

            {/* 8. Ihre Rechte */}
            <section id="rechte" className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                8. Ihre Rechte nach DSGVO
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>Sie haben umfassende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">📄 Auskunftsrecht (Art. 15)</h4>
                    <p className="text-sm">Information über gespeicherte Daten und deren Verwendung</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">✏️ Berichtigungsrecht (Art. 16)</h4>
                    <p className="text-sm">Korrektur falscher oder unvollständiger Daten</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">🗑️ Löschungsrecht (Art. 17)</h4>
                    <p className="text-sm">Entfernung Ihrer Daten unter bestimmten Voraussetzungen</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">⛔ Widerspruchsrecht (Art. 21)</h4>
                    <p className="text-sm">Widerspruch gegen Verarbeitung bei berechtigtem Interesse</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">📋 Datenübertragbarkeit (Art. 20)</h4>
                    <p className="text-sm">Übertragung Ihrer Daten an anderen Anbieter</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">⚖️ Beschwerderecht (Art. 77)</h4>
                    <p className="text-sm">Beschwerde bei Datenschutz-Aufsichtsbehörde</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    ⚡ Schnelle Bearbeitung
                  </h4>
                  <p className="text-yellow-800 text-sm">
                    Wir bearbeiten Ihre Datenschutz-Anfragen innerhalb von 30 Tagen gemäß DSGVO. 
                    Bei komplexen Anfragen informieren wir Sie über Verzögerungen.
                  </p>
                </div>
              </div>
            </section>

            {/* 9. SSL */}
            <section id="ssl" className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                9. SSL-Verschlüsselung und Sicherheit
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">
                    🔒 Vollständige Verschlüsselung
                  </h3>
                  <p className="text-green-800 text-sm">
                    Diese Website nutzt SSL/TLS-Verschlüsselung für alle Datenübertragungen. 
                    Erkennbar am "https://" und Schloss-Symbol in der Adressleiste.
                  </p>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">
                  🛡️ Sicherheitsmaßnahmen:
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>TLS 1.3 Verschlüsselung für alle Verbindungen</li>
                  <li>Sichere Server-Infrastruktur bei Vercel</li>
                  <li>Regelmäßige Sicherheitsupdates</li>
                  <li>Schutz vor CSRF und XSS-Angriffen</li>
                  <li>Stripe-Integration für sichere Zahlungen</li>
                </ul>
                
                <p>
                  Wenn die SSL-Verschlüsselung aktiviert ist, können die Daten, die 
                  Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
                </p>
              </div>
            </section>

            {/* 10. Kontakt */}
            <section id="kontakt" className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                10. Datenschutz-Kontakt
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Für alle Fragen zum Datenschutz, Auskunftsersuchen oder Löschungsanträge 
                  wenden Sie sich an:
                </p>
                
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                  <h3 className="font-semibold text-primary-900 mb-4">
                    📞 Datenschutz-Ansprechpartner
                  </h3>
                  <div className="text-primary-800">
                    <p className="font-medium">Daniel Dewald</p>
                    <p>Wacholderweg 2</p>
                    <p>74177 Bad Friedrichshall</p>
                    <p className="mt-3">
                      <strong>📧 E-Mail:</strong>{' '}
                      <a href={`mailto:${siteConfig.contact.email}`} className="underline">
                        {siteConfig.contact.email}
                      </a>
                    </p>
                    <p>
                      <strong>📞 Telefon:</strong>{' '}
                      <a href={`tel:${siteConfig.contact.phone}`} className="underline">
                        {siteConfig.contact.phone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    🏛️ Zuständige Aufsichtsbehörde
                  </h4>
                  <div className="text-gray-700 text-sm">
                    <p><strong>Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg</strong></p>
                    <p>Lautenschlagerstraße 20</p>
                    <p>70173 Stuttgart</p>
                    <p className="mt-1">
                      Website: <a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noopener" className="text-primary-600 hover:underline">www.baden-wuerttemberg.datenschutz.de</a>
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    ⚡ Bearbeitungszeit
                  </h4>
                  <p className="text-yellow-800 text-sm">
                    Wir bearbeiten Ihre Datenschutz-Anfragen innerhalb von 30 Tagen. 
                    Bei dringenden Anliegen rufen Sie uns bitte direkt an.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6 text-center">
              <p className="text-gray-600 text-sm">
                <strong>📅 Stand dieser Datenschutzerklärung:</strong> {new Date().toLocaleDateString('de-DE')}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Diese Datenschutzerklärung wurde mit größter Sorgfalt erstellt und entspricht 
                den Anforderungen der DSGVO. Wir überprüfen sie regelmäßig und aktualisieren sie bei Bedarf.
              </p>
              <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-500">
                <span>🔒 SSL-verschlüsselt</span>
                <span>•</span>
                <span>🍪 Keine Tracking-Cookies</span>
                <span>•</span>
                <span>🇪🇺 DSGVO-konform</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} 