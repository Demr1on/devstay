'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircleIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

function SuccessContent() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    setSessionId(session_id);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-mist/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Buchung erfolgreich!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Vielen Dank für Ihre Buchung. Ihre Zahlung wurde erfolgreich verarbeitet.
          </p>

          {/* Session ID */}
          {sessionId && (
            <div className="bg-primary-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600">
                <strong>Buchungsreferenz:</strong> {sessionId}
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-left">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Was passiert als nächstes?
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center">
                    <EnvelopeIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Buchungsbestätigung per E-Mail
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Sie erhalten in wenigen Minuten eine detaillierte Buchungsbestätigung 
                    mit allen wichtigen Informationen an Ihre E-Mail-Adresse.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center">
                    <CalendarDaysIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Check-in Instruktionen
                  </h3>
                  <p className="text-gray-600 text-sm">
                    24 Stunden vor Ihrer Anreise erhalten Sie detaillierte Check-in 
                    Instruktionen mit Ihrem persönlichen Zugangscode.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center">
                    <HomeIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Self-Check-in
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Nutzen Sie Ihren persönlichen Code für einen kontaktlosen 
                    Check-in rund um die Uhr - wann immer Sie ankommen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">
              Fragen zur Buchung?
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Falls Sie Fragen haben oder Änderungen an Ihrer Buchung vornehmen möchten, 
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
              href="/"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Zurück zur Startseite
            </Link>
            <Link
              href="/apartment"
              className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Apartment Details
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-8">
            Diese Buchung wurde sicher über Stripe verarbeitet. 
            Ihre Zahlungsdaten sind verschlüsselt und sicher.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-white to-mist/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}