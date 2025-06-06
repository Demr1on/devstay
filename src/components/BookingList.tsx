'use client';

import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  CalendarDaysIcon,
  CurrencyEuroIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  EyeIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

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

interface FilterState {
  search: string;
  status: string;
  paymentStatus: string;
  dateRange: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    paymentStatus: '',
    dateRange: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Gefilterte und sortierte Buchungen
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Text-Suche (Name, E-Mail, Telefon, Buchungs-ID)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(booking => 
        `${booking.customerName} ${booking.customerLastName}`.toLowerCase().includes(searchLower) ||
        booking.customerEmail?.toLowerCase().includes(searchLower) ||
        booking.customerPhone?.toLowerCase().includes(searchLower) ||
        booking.id.toLowerCase().includes(searchLower) ||
        booking.specialRequests?.toLowerCase().includes(searchLower)
      );
    }

    // Status-Filter
    if (filters.status) {
      result = result.filter(booking => booking.status === filters.status);
    }

    // Zahlungs-Status-Filter
    if (filters.paymentStatus) {
      result = result.filter(booking => booking.paymentStatus === filters.paymentStatus);
    }

    // Datums-Filter
    if (filters.dateRange) {
      const now = new Date();
      switch (filters.dateRange) {
        case 'today':
          result = result.filter(booking => {
            const checkIn = new Date(booking.checkIn);
            return checkIn.toDateString() === now.toDateString();
          });
          break;
        case 'thisWeek':
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
          result = result.filter(booking => {
            const checkIn = new Date(booking.checkIn);
            return checkIn >= weekStart && checkIn <= weekEnd;
          });
          break;
        case 'thisMonth':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          result = result.filter(booking => {
            const checkIn = new Date(booking.checkIn);
            return checkIn >= monthStart && checkIn <= monthEnd;
          });
          break;
        case 'upcoming':
          result = result.filter(booking => {
            const checkIn = new Date(booking.checkIn);
            return checkIn >= new Date();
          });
          break;
        case 'past':
          result = result.filter(booking => {
            const checkOut = new Date(booking.checkOut);
            return checkOut < new Date();
          });
          break;
      }
    }

    // Preis-Filter
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      result = result.filter(booking => {
        const price = parseFloat(booking.totalPrice || '0');
        return price >= minPrice;
      });
    }

    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      result = result.filter(booking => {
        const price = parseFloat(booking.totalPrice || '0');
        return price <= maxPrice;
      });
    }

    // Sortierung
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'customerName':
          aValue = `${a.customerName} ${a.customerLastName}`.toLowerCase();
          bValue = `${b.customerName} ${b.customerLastName}`.toLowerCase();
          break;
        case 'checkIn':
          aValue = new Date(a.checkIn);
          bValue = new Date(b.checkIn);
          break;
        case 'totalPrice':
          aValue = parseFloat(a.totalPrice || '0');
          bValue = parseFloat(b.totalPrice || '0');
          break;
        case 'totalNights':
          aValue = a.totalNights || 0;
          bValue = b.totalNights || 0;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return result;
  }, [bookings, filters]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Buchung wirklich stornieren? Dies kann nicht rückgängig gemacht werden.')) {
      return;
    }

    try {
      console.log('🔥 Storniere Buchung:', bookingId);

      const response = await fetch('/api/admin/cancel-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          reason: 'Admin-Stornierung über Dashboard',
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Buchung erfolgreich storniert!\n\n💰 Rückerstattung: ${result.refundAmount}€\n📋 Grund: ${result.message}`);
        window.location.reload();
      } else {
        alert(`❌ Fehler: ${result.error}\n\nDetails: ${result.details || 'Keine weiteren Informationen'}`);
      }
    } catch (error) {
      console.error('❌ Stornierung fehlgeschlagen:', error);
      alert('❌ Fehler beim Stornieren der Buchung. Prüfe die Konsole für Details.');
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      paymentStatus: '',
      dateRange: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== 'createdAt' && value !== 'desc'
  ).length;

  return (
    <div>
      {/* Filter-Header */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Suche */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Suche nach Name, E-Mail, Telefon, Buchungs-ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="h-4 w-4" />
            Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {/* Reset Filter */}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
              Reset
            </button>
          )}
        </div>

        {/* Erweiterte Filter */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">Alle Status</option>
                <option value="pending">Ausstehend</option>
                <option value="confirmed">Bestätigt</option>
                <option value="cancelled">Storniert</option>
                <option value="completed">Abgeschlossen</option>
              </select>
            </div>

            {/* Zahlungs-Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zahlung</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filters.paymentStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
              >
                <option value="">Alle Zahlungen</option>
                <option value="pending">Ausstehend</option>
                <option value="paid">Bezahlt</option>
                <option value="failed">Fehlgeschlagen</option>
                <option value="refunded">Erstattet</option>
              </select>
            </div>

            {/* Datums-Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zeitraum</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              >
                <option value="">Alle Termine</option>
                <option value="today">Heute</option>
                <option value="thisWeek">Diese Woche</option>
                <option value="thisMonth">Dieser Monat</option>
                <option value="upcoming">Zukünftig</option>
                <option value="past">Vergangen</option>
              </select>
            </div>

            {/* Sortierung */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sortierung</label>
              <div className="flex gap-2">
                <select
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                >
                  <option value="createdAt">Erstellt</option>
                  <option value="checkIn">Anreise</option>
                  <option value="customerName">Name</option>
                  <option value="totalPrice">Preis</option>
                  <option value="totalNights">Nächte</option>
                </select>
                <button
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  title={filters.sortOrder === 'asc' ? 'Aufsteigend' : 'Absteigend'}
                >
                  {filters.sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>

            {/* Preis-Filter */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Preisspanne (€)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                />
                <span className="self-center text-gray-500">bis</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Ergebnis-Anzeige */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredBookings.length} von {bookings.length} Buchungen
          {activeFiltersCount > 0 && ` (${activeFiltersCount} Filter aktiv)`}
        </div>
      </div>

      {/* Buchungstabelle */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
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
            {filteredBookings.map((booking) => (
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
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Stornieren
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {bookings.length === 0 ? 'Keine Buchungen gefunden' : 'Keine Buchungen entsprechen den Filterkriterien'}
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detail-Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Buchungsdetails
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Kundendaten */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
                      Kundendaten
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Name:</span>
                        <span className="ml-2">{selectedBooking.customerName} {selectedBooking.customerLastName}</span>
                      </div>
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">E-Mail:</span>
                        <a href={`mailto:${selectedBooking.customerEmail}`} className="ml-2 text-blue-600 hover:text-blue-800">
                          {selectedBooking.customerEmail}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Telefon:</span>
                        <a href={`tel:${selectedBooking.customerPhone}`} className="ml-2 text-blue-600 hover:text-blue-800">
                          {selectedBooking.customerPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Aufenthaltsdaten */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <CalendarDaysIcon className="h-5 w-5 mr-2 text-green-500" />
                      Aufenthalt
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Anreise:</span>
                        <span className="ml-2">{format(new Date(selectedBooking.checkIn), 'dd.MM.yyyy (EEEE)', { locale: de })}</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Abreise:</span>
                        <span className="ml-2">{format(new Date(selectedBooking.checkOut), 'dd.MM.yyyy (EEEE)', { locale: de })}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Dauer:</span>
                        <span className="ml-2">{selectedBooking.totalNights} Nacht{selectedBooking.totalNights !== 1 ? 'e' : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Besondere Wünsche */}
                  {selectedBooking.specialRequests && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-purple-500" />
                        Besondere Wünsche
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Buchungs- & Zahlungsdaten */}
                <div className="space-y-6">
                  {/* Preis & Zahlung */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <CurrencyEuroIcon className="h-5 w-5 mr-2 text-yellow-500" />
                      Preis & Zahlung
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Gesamtpreis:</span>
                        <span className="text-lg font-bold text-green-600">{selectedBooking.totalPrice}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Pro Nacht:</span>
                        <span>{Math.round(parseFloat(selectedBooking.totalPrice || '0') / (selectedBooking.totalNights || 1))}€</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Zahlungsstatus:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColors[selectedBooking.paymentStatus as keyof typeof paymentStatusColors] || 'bg-gray-100 text-gray-800'}`}>
                          {selectedBooking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buchungsstatus */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <CreditCardIcon className="h-5 w-5 mr-2 text-indigo-500" />
                      Buchungsstatus
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[selectedBooking.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                          {selectedBooking.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Buchungs-ID:</span>
                        <span className="font-mono text-sm">{selectedBooking.id}</span>
                      </div>
                      {selectedBooking.stripeSessionId && (
                        <div className="flex justify-between">
                          <span className="font-medium">Stripe Session:</span>
                          <span className="font-mono text-sm">{selectedBooking.stripeSessionId.substring(0, 20)}...</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="font-medium">Erstellt:</span>
                        <span>{selectedBooking.createdAt && format(new Date(selectedBooking.createdAt), 'dd.MM.yyyy HH:mm', { locale: de })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Aktionen */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Aktionen</h4>
                    <div className="space-y-3">
                      {selectedBooking.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            setSelectedBooking(null);
                            handleCancelBooking(selectedBooking.id);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircleIcon className="h-4 w-4" />
                          Buchung stornieren
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          const mailtoLink = `mailto:${selectedBooking.customerEmail}?subject=Ihre Buchung ${selectedBooking.id.substring(0, 8)}&body=Hallo ${selectedBooking.customerName},\n\nbetreffend Ihre Buchung vom ${format(new Date(selectedBooking.checkIn), 'dd.MM.yyyy', { locale: de })} bis ${format(new Date(selectedBooking.checkOut), 'dd.MM.yyyy', { locale: de })}...\n\nMit freundlichen Grüßen\nIhr DevStay Team`;
                          window.open(mailtoLink);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                        E-Mail senden
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 