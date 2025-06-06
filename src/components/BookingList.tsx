'use client';

import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useState } from 'react';

interface Booking {
  id: string;
  customerId: string | null;
  customerName: string | null;
  customerLastName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  checkIn: Date;
  checkOut: Date;
  totalNights: number | null;
  totalPrice: string | null;
  status: string | null;
  paymentStatus: string | null;
  specialRequests: string | null;
  stripeSessionId: string | null;
  createdAt: Date | null;
}

interface BookingListProps {
  bookings: Booking[];
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function BookingList({ bookings }: BookingListProps) {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelBooking = async (bookingId: string) => {
    // TODO: Neue Stornierungsfunktion implementieren
    alert('Stornierungsfunktion wird bald implementiert im neuen Admin-System!');
    console.log('Buchung ID für Stornierung:', bookingId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kunde
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aufenthalt
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preis
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Zahlung
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Buchung
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {booking.customerName} {booking.customerLastName}
                </div>
                <div className="text-sm text-gray-500">
                  {booking.customerEmail}
                </div>
                <div className="text-sm text-gray-500">
                  {booking.customerPhone}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {format(new Date(booking.checkIn), 'dd.MM.yyyy', { locale: de })} - {format(new Date(booking.checkOut), 'dd.MM.yyyy', { locale: de })}
                </div>
                <div className="text-sm text-gray-500">
                  {booking.totalNights} Nacht{booking.totalNights !== 1 ? 'e' : ''}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking.totalPrice}€
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColors[booking.paymentStatus as keyof typeof paymentStatusColors] || 'bg-gray-100 text-gray-800'}`}>
                  {booking.paymentStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {booking.id.substring(0, 8)}...
                </div>
                <div className="text-sm text-gray-500">
                  {booking.createdAt && format(new Date(booking.createdAt), 'dd.MM.yyyy HH:mm', { locale: de })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Stornieren
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {bookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Keine Buchungen gefunden</p>
        </div>
      )}
    </div>
  );
} 