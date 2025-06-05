'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  XCircleIcon,
  ArrowLeftIcon,
  PhoneIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

function CancelledContent() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    setSessionId(session_id);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Cancel Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XCircleIcon className="w-12 h-12 text-red-600" />
            </div>
          </div>

          {/* Cancel Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Buchung abgebrochen
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Ihre Buchung wurde abgebrochen. Es wurden keine Kosten erhoben.
          </p>

          {/* Session ID */}
          {sessionId && (
            <div className="bg-gray-100 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600">
                <strong>Session-ID:</strong> {sessionId}
              </p>
            </div>
          )}

          {/* Information */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Was ist passiert?
            </h2>
            
            <div className="text-left space-y-4">
              <p className="text-gray-600">
                Sie haben den Zahlungsvorgang abgebrochen oder es gab ein Problem 
                bei der Verarbeitung Ihrer Zahlung.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
                  Keine Sorge!
                </h3>
                <p className="text-blue-800 text-sm">
                  Es wurden keine Kosten erhoben und Ihre Daten sind sicher. 
                  Sie können jederzeit eine neue Buchung versuchen.
                </p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center justify-center">
              <PhoneIcon className="w-5 h-5 mr-2 text-yellow-600" />
              Benötigen Sie Hilfe?
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Falls Sie technische Probleme hatten oder Fragen zur Buchung haben, 
              kontaktieren Sie uns gerne:
            </p>
            <p className="text-sm text-primary-600 font-medium">
              E-Mail: info@devstay.de<br/>
              Telefon: +49 123 456 789
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Zurück zur Buchung
            </Link>
            <Link
              href="/"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Zur Startseite
            </Link>
          </div>

          {/* Common Reasons */}
          <div className="mt-12 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Häufige Gründe für abgebrochene Buchungen:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-1">
                  Zahlungsprobleme
                </h4>
                <p className="text-sm text-gray-600">
                  Prüfen Sie Ihre Kreditkartendaten oder versuchen Sie eine andere Zahlungsmethode.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-1">
                  Technische Probleme
                </h4>
                <p className="text-sm text-gray-600">
                  Versuchen Sie es mit einem anderen Browser oder deaktivieren Sie Ihren Adblocker.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-1">
                  Versehentlicher Abbruch
                </h4>
                <p className="text-sm text-gray-600">
                  Kein Problem! Starten Sie einfach eine neue Buchung.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-1">
                  Datenschutz-Einstellungen
                </h4>
                <p className="text-sm text-gray-600">
                  Überprüfen Sie Ihre Browser-Einstellungen für Cookies und JavaScript.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-8">
            Ihre Daten sind sicher und verschlüsselt. 
            Alle Zahlungen werden über Stripe verarbeitet.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BookingCancelledPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircleIcon className="w-12 h-12 text-red-600" />
          </div>
          <p className="text-lg text-gray-600">Seite wird geladen...</p>
        </div>
      </div>
    }>
      <CancelledContent />
    </Suspense>
  );
} 