'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'AccessDenied':
        return {
          title: 'Zugriff verweigert',
          message: 'Ihr Account ist nicht als Administrator autorisiert. Nur bestimmte GitHub-Accounts können auf den Admin-Bereich zugreifen.',
          icon: '🚫'
        };
      case 'Configuration':
        return {
          title: 'Konfigurationsfehler',
          message: 'Die Authentifizierung ist nicht korrekt konfiguriert. Bitte kontaktieren Sie den Administrator.',
          icon: '⚙️'
        };
      default:
        return {
          title: 'Anmeldung fehlgeschlagen',
          message: 'Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
          icon: '❌'
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="text-6xl mb-4">{errorInfo.icon}</div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            {errorInfo.title}
          </h1>
          <p className="text-gray-600 mb-8">
            {errorInfo.message}
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <Link
              href="/admin/signin"
              className="w-full flex justify-center py-2 px-4 border border-blue-300 rounded-md shadow-sm bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Erneut anmelden
            </Link>
            
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Zur Hauptseite
            </Link>
          </div>

          {error === 'AccessDenied' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Kontakt erforderlich
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Falls Sie Administrator werden möchten, wenden Sie sich an:
                      <br />
                      <strong>E-Mail:</strong> daniel@devstay.de
                      <br />
                      <strong>WhatsApp:</strong> +49 176 41847930
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Fehlerseite...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
} 