'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SignInContent() {
  const [providers, setProviders] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  const handleSignIn = async (providerId: string) => {
    setLoading(true);
    try {
      await signIn(providerId, { callbackUrl: '/admin' });
    } catch (error) {
      console.error('Sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            DevStay Admin
          </h1>
          <h2 className="text-xl font-semibold text-gray-900">
            Admin-Bereich
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Melden Sie sich an, um das Dashboard zu verwalten
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="text-sm">
                {error === 'AccessDenied' 
                  ? 'Zugriff verweigert. Sie sind nicht als Admin autorisiert.'
                  : 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.'
                }
              </p>
            </div>
          )}

          <div className="space-y-4">
            {providers && Object.values(providers).map((provider: any) => (
              <div key={provider.name}>
                <button
                  onClick={() => handleSignIn(provider.id)}
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {provider.id === 'github' && (
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      )}
                      Mit {provider.name} anmelden
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Sicherheitshinweis</span>
              </div>
            </div>
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>
                Nur autorisierte Administratoren können sich anmelden.<br/>
                Ihr GitHub-Account muss in der Admin-Liste stehen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Anmeldeseite...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
} 