import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, bookings, customers } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import AdminHeader from '@/components/AdminHeader';
import BookingList from '@/components/BookingList';
import BookingStats from '@/components/BookingStats';

export default async function AdminPage() {
  // Authentifizierung prüfen
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/admin/signin');
  }

  // Jeder authentifizierte Benutzer ist Admin
  console.log('✅ Admin Dashboard für:', session.user.email);

  // Buchungen mit Kundendaten laden
  const allBookings = await db
    .select({
      id: bookings.id,
      customerId: bookings.customerId,
      customerName: customers.firstName,
      customerLastName: customers.lastName,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      totalNights: bookings.totalNights,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      paymentStatus: bookings.paymentStatus,
      specialRequests: bookings.specialRequests,
      stripeSessionId: bookings.stripeSessionId,
      createdAt: bookings.createdAt,
    })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .orderBy(desc(bookings.createdAt))
    .limit(50);

  // Statistiken berechnen
  const stats = {
    total: allBookings.length,
    confirmed: allBookings.filter(b => b.status === 'confirmed').length,
    pending: allBookings.filter(b => b.status === 'pending').length,
    cancelled: allBookings.filter(b => b.status === 'cancelled').length,
    revenue: allBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + parseFloat(b.totalPrice || '0'), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={session.user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Buchungen verwalten und Statistiken einsehen
          </p>
        </div>

        {/* Statistiken */}
        <BookingStats stats={stats} />

        {/* Buchungsliste */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Aktuelle Buchungen
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Die letzten 50 Buchungen
            </p>
          </div>
          
          <BookingList bookings={allBookings} />
        </div>
      </div>
    </div>
  );
} 