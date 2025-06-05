'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday, isBefore, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface BookingData {
  id: string;
  checkIn: string;
  checkOut: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  type: 'booking';
}

interface BlockedData {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  description?: string;
  type: 'blocked';
}

interface CalendarData {
  month: string;
  bookings: BookingData[];
  blockedDates: BlockedData[];
  statistics: {
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    blockedPeriods: number;
    totalRevenue: number;
  };
}

interface AvailabilityCalendarProps {
  onDateSelect?: (startDate: Date | null, endDate: Date | null) => void;
  selectedStartDate?: Date | null;
  selectedEndDate?: Date | null;
  selectionMode?: boolean;
}

export default function AvailabilityCalendar({
  onDateSelect,
  selectedStartDate,
  selectedEndDate,
  selectionMode = false
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  // Kalenderdaten laden
  const loadCalendarData = async (month: Date) => {
    setLoading(true);
    try {
      const monthStr = format(month, 'yyyy-MM');
      const response = await fetch(`/api/calendar?month=${monthStr}`);
      
      if (response.ok) {
        const data = await response.json();
        setCalendarData(data);
      } else {
        console.error('Fehler beim Laden der Kalenderdaten');
        setCalendarData(null);
      }
    } catch (error) {
      console.error('Kalenderdaten-Fehler:', error);
      setCalendarData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarData(currentMonth);
  }, [currentMonth]);

  // Prüfe ob ein Datum belegt ist
  const isDateOccupied = (date: Date): { occupied: boolean; type?: string; reason?: string } => {
    if (!calendarData) return { occupied: false };

    // Prüfe Buchungen
    for (const booking of calendarData.bookings) {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      
      if (date >= checkIn && date < checkOut) {
        return {
          occupied: true,
          type: booking.status === 'confirmed' ? 'confirmed' : 'pending',
          reason: `Buchung (${booking.status})`
        };
      }
    }

    // Prüfe blockierte Termine
    for (const blocked of calendarData.blockedDates) {
      const startDate = new Date(blocked.startDate);
      const endDate = new Date(blocked.endDate);
      
      if (date >= startDate && date <= endDate) {
        return {
          occupied: true,
          type: 'blocked',
          reason: blocked.reason
        };
      }
    }

    return { occupied: false };
  };

  // Datum-Click Handler
  const handleDateClick = (date: Date) => {
    if (!selectionMode || !onDateSelect) return;

    const occupation = isDateOccupied(date);
    if (occupation.occupied || isBefore(date, startOfDay(new Date()))) return;

    if (!isSelecting || !selectedStartDate) {
      // Neue Auswahl starten
      onDateSelect(date, null);
      setIsSelecting(true);
      setTempEndDate(null);
    } else {
      // Auswahl beenden
      if (date > selectedStartDate) {
        onDateSelect(selectedStartDate, date);
      } else {
        onDateSelect(date, selectedStartDate);
      }
      setIsSelecting(false);
      setTempEndDate(null);
    }
  };

  // CSS-Klassen für Datum
  const getDateClasses = (date: Date): string => {
    const baseClasses = "h-12 w-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200";
    const occupation = isDateOccupied(date);
    const isPast = isBefore(date, startOfDay(new Date()));
    const isCurrentDay = isToday(date);

    let classes = baseClasses;

    if (isPast) {
      classes += " text-gray-300 cursor-not-allowed";
    } else if (occupation.occupied) {
      switch (occupation.type) {
        case 'confirmed':
          classes += " bg-red-500 text-white cursor-not-allowed";
          break;
        case 'pending':
          classes += " bg-orange-400 text-white cursor-not-allowed";
          break;
        case 'blocked':
          classes += " bg-gray-500 text-white cursor-not-allowed";
          break;
      }
    } else {
      classes += " bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer";
      
      if (selectionMode) {
        if (selectedStartDate && isSameDay(date, selectedStartDate)) {
          classes += " !bg-primary-600 !text-white ring-2 ring-primary-300";
        } else if (selectedEndDate && isSameDay(date, selectedEndDate)) {
          classes += " !bg-primary-600 !text-white ring-2 ring-primary-300";
        }
      }
    }

    if (isCurrentDay) {
      classes += " ring-2 ring-blue-400";
    }

    return classes;
  };

  // Monat wechseln
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Tage des Monats
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Wochentage für Header
  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="w-8 h-8 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Verfügbarkeitskalender
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <h3 className="text-xl font-semibold text-gray-800 min-w-[200px] text-center">
            {format(currentMonth, 'MMMM yyyy', { locale: de })}
          </h3>
          
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Statistiken */}
      {calendarData && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {calendarData.statistics.confirmedBookings}
            </div>
            <div className="text-sm text-green-700">Bestätigt</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              {calendarData.statistics.pendingBookings}
            </div>
            <div className="text-sm text-orange-700">Ausstehend</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-600">
              {calendarData.statistics.blockedPeriods}
            </div>
            <div className="text-sm text-gray-700">Blockiert</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {calendarData.statistics.totalRevenue.toFixed(0)}€
            </div>
            <div className="text-sm text-blue-700">Umsatz</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((calendarData.statistics.confirmedBookings / daysInMonth.length) * 100)}%
            </div>
            <div className="text-sm text-purple-700">Auslastung</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Kalender */}
          <div className="grid grid-cols-7 gap-2">
            {/* Wochentage Header */}
            {weekDays.map(day => (
              <div key={day} className="h-10 flex items-center justify-center text-sm font-semibold text-gray-600">
                {day}
              </div>
            ))}
            
            {/* Leere Zellen am Monatsanfang */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, index) => (
              <div key={`empty-${index}`} className="h-12" />
            ))}
            
            {/* Tage */}
            {daysInMonth.map(date => {
              const occupation = isDateOccupied(date);
              
              return (
                <div key={date.toISOString()} className="relative">
                  <button
                    onClick={() => handleDateClick(date)}
                    className={getDateClasses(date)}
                    title={occupation.occupied ? occupation.reason : 'Verfügbar'}
                    disabled={occupation.occupied || isBefore(date, startOfDay(new Date()))}
                  >
                    {format(date, 'd')}
                  </button>
                  
                  {/* Indikator für Buchungstyp */}
                  {occupation.occupied && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className={`w-2 h-2 rounded-full ${
                        occupation.type === 'confirmed' ? 'bg-red-600' :
                        occupation.type === 'pending' ? 'bg-orange-500' :
                        'bg-gray-600'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legende */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 rounded border"></div>
              <span className="text-sm text-gray-700">Verfügbar</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-700">Belegt (bestätigt)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span className="text-sm text-gray-700">Belegt (ausstehend)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm text-gray-700">Blockiert</span>
            </div>
            {selectionMode && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary-600 rounded"></div>
                <span className="text-sm text-gray-700">Ausgewählt</span>
              </div>
            )}
          </div>

          {/* Auswahl-Info */}
          {selectionMode && selectedStartDate && (
            <div className="mt-4 p-4 bg-primary-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-primary-800">
                  {selectedEndDate 
                    ? `Gewählt: ${format(selectedStartDate, 'dd.MM.yyyy')} - ${format(selectedEndDate, 'dd.MM.yyyy')}`
                    : `Anreise: ${format(selectedStartDate, 'dd.MM.yyyy')} (Abreise wählen)`
                  }
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 