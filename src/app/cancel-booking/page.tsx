'use client';

import { useState, useEffect } from 'react';
import { 
  XCircleIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  UserIcon,
  IdentificationIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';

interface BookingDetails {
  id: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  totalPrice: string;
  status: string;
  paymentStatus: string;
}

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
}

interface CancellationResult {
  success: boolean;
  message: string;
  refundAmount: number;
  refundPercent: number;
  refundId?: string;
  customer: CustomerDetails;
}

type Step = 'input' | 'confirm' | 'success' | 'error';

export default function CancelBookingPage() {
  const [step, setStep] = useState<Step>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form Data
  const [bookingNumber, setBookingNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [reason, setReason] = useState('');
  
  // Booking Data
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [cancellationResult, setCancellationResult] = useState<CancellationResult | null>(null);

  // Buchungsdetails laden
  const loadBookingDetails = async () => {
    if (!bookingNumber.trim() || !postalCode.trim()) {
      setError('Bitte geben Sie sowohl die Buchungsnummer als auch die Postleitzahl ein.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/customer/cancel-booking?bookingNumber=${encodeURIComponent(bookingNumber)}&postalCode=${encodeURIComponent(postalCode)}`
      );
      
      const data = await response.json();
      
      if (data.success) {
        setBookingDetails(data.booking);
        setCustomerDetails(data.customer);
        setStep('confirm');
      } else {
        setError(data.error || 'Buchung nicht gefunden oder bereits storniert.');
      }
    } catch (err) {
      setError('Fehler beim Laden der Buchungsdetails. Bitte versuchen Sie es erneut.');
      console.error('Error loading booking:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buchung stornieren
  const cancelBooking = async () => {
    if (!bookingDetails) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/customer/cancel-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingNumber: bookingDetails.id,
          postalCode,
          reason: reason || 'Kundenstornierung über Online-Portal'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCancellationResult(data);
        setStep('success');
      } else {
        setError(data.error || 'Stornierung fehlgeschlagen.');
        setStep('error');
      }
    } catch (err) {
      setError('Fehler bei der Stornierung. Bitte versuchen Sie es erneut.');
      setStep('error');
      console.error('Error cancelling booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('input');
    setBookingNumber('');
    setPostalCode('');
    setReason('');
    setBookingDetails(null);
    setCustomerDetails(null);
    setCancellationResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircleIcon className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Buchung stornieren
            </h1>
            <p className="text-xl text-gray-600">
              Kostenlose Stornierung - jederzeit bis kurz vor Check-in
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {['Eingabe', 'Bestätigung', 'Abschluss'].map((stepName, index) => {
                const stepNumber = index + 1;
                const isActive = 
                  (step === 'input' && stepNumber === 1) ||
                  (step === 'confirm' && stepNumber === 2) ||
                  (['success', 'error'].includes(step) && stepNumber === 3);
                const isCompleted = 
                  (step === 'confirm' && stepNumber === 1) ||
                  (['success', 'error'].includes(step) && stepNumber <= 2);

                return (
                  <div key={stepName} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isActive 
                        ? 'bg-red-600 text-white' 
                        : isCompleted 
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? '✓' : stepNumber}
                    </div>
                    <span className={`ml-2 text-sm ${isActive ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      {stepName}
                    </span>
                    {index < 2 && <div className="w-8 h-px bg-gray-300 mx-4" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            
            {/* Step 1: Input */}
            {step === 'input' && (
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Buchung finden
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Geben Sie Ihre Buchungsnummer und Postleitzahl ein, um Ihre Buchung zu finden.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <IdentificationIcon className="w-4 h-4 inline mr-1" />
                      Buchungsnummer
                    </label>
                    <input
                      type="text"
                      value={bookingNumber}
                      onChange={(e) => setBookingNumber(e.target.value.toUpperCase())}
                      placeholder="z.B. ABC12345-1234-5678-9ABC"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Die Buchungsnummer finden Sie in Ihrer Bestätigungs-E-Mail
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPinIcon className="w-4 h-4 inline mr-1" />
                      Postleitzahl
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="z.B. 74177"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Ihre Postleitzahl aus der Rechnungsadresse
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={loadBookingDetails}
                  disabled={loading || !bookingNumber.trim() || !postalCode.trim()}
                  className="w-full mt-6 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Buchung wird gesucht...' : 'Buchung finden'}
                </button>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 'confirm' && bookingDetails && customerDetails && (
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Stornierung bestätigen
                </h2>

                {/* Booking Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    Buchungsdetails
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Buchungsnummer:</span>
                      <p className="font-medium">{bookingDetails.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Gast:</span>
                      <p className="font-medium">{customerDetails.firstName} {customerDetails.lastName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Check-in:</span>
                      <p className="font-medium">
                        {format(new Date(bookingDetails.checkIn), 'EEEE, dd. MMMM yyyy', { locale: de })}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Check-out:</span>
                      <p className="font-medium">
                        {format(new Date(bookingDetails.checkOut), 'EEEE, dd. MMMM yyyy', { locale: de })}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Nächte:</span>
                      <p className="font-medium">{bookingDetails.totalNights}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Gesamtpreis:</span>
                      <p className="font-medium">{bookingDetails.totalPrice}€</p>
                    </div>
                  </div>
                </div>

                {/* Refund Information */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                    <CurrencyEuroIcon className="w-5 h-5 mr-2" />
                    Rückerstattung
                  </h3>
                  <p className="text-green-800">
                    <strong>100% Rückerstattung ({bookingDetails.totalPrice}€)</strong>
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Die Rückerstattung wird in 5-10 Werktagen auf Ihrer ursprünglichen Zahlungsmethode sichtbar.
                  </p>
                </div>

                {/* Optional Reason */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stornierungsgrund (optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Warum möchten Sie stornieren? (Hilft uns bei der Verbesserung)"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('input')}
                    className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Zurück
                  </button>
                  <button
                    onClick={cancelBooking}
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Stornierung wird verarbeitet...' : 'Jetzt stornieren'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 'success' && cancellationResult && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Stornierung erfolgreich!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Ihre Buchung wurde erfolgreich storniert. Sie erhalten eine Bestätigungs-E-Mail an{' '}
                  <strong>{cancellationResult.customer.email}</strong>
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-green-900 mb-4">Rückerstattungsdetails</h3>
                  <div className="text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Rückerstattungsbetrag:</span>
                      <span className="font-medium text-green-900">{cancellationResult.refundAmount}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Rückerstattungsquote:</span>
                      <span className="font-medium text-green-900">{cancellationResult.refundPercent}%</span>
                    </div>
                    {cancellationResult.refundId && (
                      <div className="flex justify-between">
                        <span className="text-green-700">Referenz-ID:</span>
                        <span className="font-medium text-green-900">{cancellationResult.refundId.substring(0, 10)}...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-6">
                  <p>Die Rückerstattung wird in 5-10 Werktagen auf Ihrer ursprünglichen Zahlungsmethode sichtbar.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/"
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center"
                  >
                    Zur Startseite
                  </Link>
                  <button
                    onClick={resetForm}
                    className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Weitere Stornierung
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Error */}
            {step === 'error' && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Stornierung fehlgeschlagen
                </h2>
                
                <p className="text-gray-600 mb-6">
                  {error || 'Bei der Stornierung ist ein Fehler aufgetreten.'}
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-yellow-900 mb-2">Benötigen Sie Hilfe?</h3>
                  <p className="text-yellow-800 text-sm">
                    Kontaktieren Sie uns direkt für eine manuelle Stornierung:
                  </p>
                  <p className="text-yellow-900 font-medium mt-2">
                    📧 info@devstay.de<br/>
                    📞 +49 123 456 789
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Erneut versuchen
                  </button>
                  <Link
                    href="/"
                    className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
                  >
                    Zur Startseite
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Bei Fragen zur Stornierung:{' '}
              <a href="mailto:info@devstay.de" className="text-primary-600 hover:underline">
                info@devstay.de
              </a>{' '}
              oder{' '}
              <a href="tel:+49123456789" className="text-primary-600 hover:underline">
                +49 123 456 789
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
} 