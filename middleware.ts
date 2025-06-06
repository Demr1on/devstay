import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🚧 MAINTENANCE MODE CONTROL
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true';

export function middleware(request: NextRequest) {
  // Wenn Maintenance-Modus deaktiviert ist, normal weiterleiten
  if (!MAINTENANCE_MODE) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Diese Pfade sind während Maintenance erlaubt
  const allowedPaths = [
    '/maintenance',
    '/api/health', // Health check für Monitoring
    '/_next', // Next.js Assets
    '/favicon.ico',
    '/images'
  ];

  // Admin-Access über Secret Key (für Testing)
  const adminSecret = request.nextUrl.searchParams.get('admin');
  if (adminSecret === process.env.ADMIN_SECRET) {
    return NextResponse.next();
  }

  // Wenn schon auf Maintenance-Seite oder erlaubter Pfad, weiterleiten
  if (allowedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Alle anderen Requests zur Maintenance-Seite umleiten
  const maintenanceUrl = new URL('/maintenance', request.url);
  
  // HTTP 503 Service Unavailable für Suchmaschinen
  const response = NextResponse.redirect(maintenanceUrl, 503);
  
  // Headers für Suchmaschinen setzen
  response.headers.set('Retry-After', '86400'); // 24 Stunden
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 