import { NextResponse } from 'next/server';

export async function GET() {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  
  const headers: Record<string, string> = {
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
  
  if (isMaintenanceMode) {
    headers['Retry-After'] = '86400';
  }
  
  return NextResponse.json({
    status: isMaintenanceMode ? 'maintenance' : 'ok',
    timestamp: new Date().toISOString(),
    message: isMaintenanceMode 
      ? 'DevStay is currently under maintenance for renovations' 
      : 'DevStay is operational',
    maintenance: {
      active: isMaintenanceMode,
      reason: 'Apartment renovation and upgrades',
      estimatedEnd: '2024-03-31T00:00:00Z'
    }
  }, {
    status: isMaintenanceMode ? 503 : 200,
    headers
  });
} 