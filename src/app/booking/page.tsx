'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { pricingConfig, siteConfig } from '@/lib/config';
import { addDays, differenceInDays, format } from 'date-fns';
import { calculatePriceForNights } from '@/lib/stripe-products';
import { de } from 'date-fns/locale';
import { 
  CalendarDaysIcon, 
  UserIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import getStripe, { fetchPostJSON } from '@/lib/stripe';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  specialRequests?: string;
  checkIn: string;
  checkOut: string;
}

export default function BookingPage() {
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    specialRequests: '',
    checkIn: '',
    checkOut: ''
  });
  const [errors, setErrors] = useState<Partial<BookingFormData>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Hilfsfunktion: Datum zu lokalem String (ohne UTC-Konvertierung)
  const dateToLocalString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Berechne minimale Daten
  const tomorrow = addDays(new Date(), 1);
  const minCheckIn = format(tomorrow, 'yyyy-MM-dd');
  const maxDate = format(addDays(new Date(), 365), 'yyyy-MM-dd');

  // Formular-Validierung
  useEffect(() => {
    const newErrors: Partial<BookingFormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Gültige E-Mail-Adresse erforderlich';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefonnummer ist erforderlich';
    }
    if (!formData.checkIn) {
      newErrors.checkIn = 'Anreisedatum ist erforderlich';
    }
    if (!formData.checkOut) {
      newErrors.checkOut = 'Abreisedatum ist erforderlich';
    } else if (formData.checkIn && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      newErrors.checkOut = 'Abreise muss nach Anreise sein';
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  // Berechne Preise mit Stripe Product-basierter Logik
  const calculateBookingPrice = () => {
    if (!formData.checkIn || !formData.checkOut) {
      return null;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    
    if (checkOutDate <= checkInDate) {
      return null;
    }

    const nights = differenceInDays(checkOutDate, checkInDate);
    
    // Verwende die neue Stripe Product-basierte Preisberechnung
    const pricing = calculatePriceForNights(nights);
    const basePrice = pricingConfig.basePrice * nights; // Grundpreis ohne Rabatt
    const discount = basePrice - pricing.totalPrice;

    return {
      nights,
      basePrice,
      discount,
      discountPercent: pricing.discountPercent,
      finalPrice: pricing.totalPrice,
      pricePerNight: pricing.pricePerNight,
      stripeProduct: pricing.product
    };
  };

  const bookingPrice = calculateBookingPrice();

  const handleFormChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !bookingPrice) return;

    try {
      // Stripe Checkout Session erstellen
      const response = await fetch('/api/checkout-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: bookingPrice.finalPrice,
          currency: 'eur',
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          customerDetails: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            specialRequests: formData.specialRequests,
          },
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        data = { error: 'Server-Antwort konnte nicht verarbeitet werden' };
      }

      if (!response.ok) {
        console.error('Checkout Session Error:', { 
          status: response.status, 
          statusText: response.statusText, 
          data 
        });
        
        if (response.status === 409) {
          const message = `Das Apartment ist für die gewählten Termine nicht verfügbar.\n\n${data?.details || 'Bitte wählen Sie andere Termine.'}`;
          alert(message);
        } else if (response.status === 500) {
          alert('Server-Fehler: ' + (data?.error || 'Bitte versuchen Sie es später erneut.'));
        } else if (response.status === 400) {
          alert('Eingabefehler: ' + (data?.error || 'Bitte überprüfen Sie Ihre Eingaben.'));
        } else {
          alert(data?.error || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
        return;
      }

      // Überprüfen ob Session-ID vorhanden ist
      if (!data.id) {
        console.error('Keine Session-ID erhalten:', data);
        alert('Fehler beim Erstellen der Checkout Session. Bitte versuchen Sie es erneut.');
        return;
      }

      // Zu Stripe Checkout weiterleiten
      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
        sessionId: data.id,
      });

      if (error) {
        console.error('Stripe Checkout Error:', error.message);
        alert('Fehler beim Weiterleiten zur Zahlung: ' + error.message);
      }
    } catch (error) {
      console.error('Booking Error:', error);
      alert('Netzwerk-Fehler: Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-mist/5">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Apartment buchen
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Wählen Sie Ihre Daten und buchen Sie direkt online
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Verfügbarkeitskalender */}
        <div className="mb-12 max-w-6xl mx-auto">
          <AvailabilityCalendar 
            selectionMode={true}
            selectedStartDate={formData.checkIn ? new Date(formData.checkIn) : null}
            selectedEndDate={formData.checkOut ? new Date(formData.checkOut) : null}
            onDateSelect={(startDate, endDate) => {
              if (startDate) {
                setFormData(prev => ({
                  ...prev,
                  checkIn: dateToLocalString(startDate)
                }));
              }
              if (endDate) {
                setFormData(prev => ({
                  ...prev,
                  checkOut: dateToLocalString(endDate)
                }));
              }
            }}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Buchungsformular */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <CalendarDaysIcon className="w-6 h-6 mr-2 text-primary-600" />
              Buchungsdetails
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Aufenthaltsdaten */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anreise *
                  </label>
                  <input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => handleFormChange('checkIn', e.target.value)}
                    min={minCheckIn}
                    max={maxDate}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.checkIn ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.checkIn && (
                    <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Abreise *
                  </label>
                  <input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => handleFormChange('checkOut', e.target.value)}
                    min={formData.checkIn ? addDays(new Date(formData.checkIn), 1).toISOString().split('T')[0] : minCheckIn}
                    max={maxDate}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.checkOut ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.checkOut && (
                    <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>
                  )}
                </div>
              </div>

              {bookingPrice && (
                <div className="p-4 bg-primary-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Gewählte Daten</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Anreise:</strong> {format(new Date(formData.checkIn), 'dd.MM.yyyy', { locale: de })}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Abreise:</strong> {format(new Date(formData.checkOut), 'dd.MM.yyyy', { locale: de })}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Aufenthalt:</strong> {bookingPrice.nights} Nacht{bookingPrice.nights !== 1 ? 'e' : ''}
                  </p>
                </div>
              )}

              {/* Persönliche Daten */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Ihre Daten
                </h3>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vorname *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleFormChange('firstName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Max"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nachname *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleFormChange('lastName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Mustermann"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail-Adresse *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="max@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefonnummer *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+49 123 456 789"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unternehmen (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleFormChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tech AG"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Besondere Wünsche (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.specialRequests}
                    onChange={(e) => handleFormChange('specialRequests', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Früher Check-in, zusätzliche Monitore, etc."
                  />
                </div>
              </div>

              {/* Stornierungsbedingungen */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                  Stornierungsbedingungen
                </h4>
                <p className="text-sm text-green-600 font-medium">
                  ✅ 100% kostenlose Stornierung jederzeit
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Volle Rückerstattung ohne Bearbeitungsgebühren
                </p>
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  isFormValid
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {bookingPrice 
                  ? `Jetzt buchen für ${bookingPrice.finalPrice}€`
                  : 'Daten auswählen'
                }
              </button>

              <p className="text-xs text-gray-500 text-center">
                Durch Klicken auf "Jetzt buchen" stimmen Sie unseren{' '}
                <a href="/terms" className="text-primary-600 hover:underline">AGB</a> und{' '}
                <a href="/privacy" className="text-primary-600 hover:underline">Datenschutzbestimmungen</a> zu.
              </p>
            </form>
          </div>

          {/* Preisübersicht */}
          <div className="space-y-6">
            {bookingPrice && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CurrencyEuroIcon className="w-6 h-6 mr-2 text-primary-600" />
                  Preisübersicht
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Grundpreis ({bookingPrice.nights} Nächte à {pricingConfig.basePrice}€)</span>
                    <span>{bookingPrice.basePrice}€</span>
                  </div>
                  
                  {bookingPrice.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Rabatt ({bookingPrice.discountPercent}%)</span>
                      <span>-{bookingPrice.discount}€</span>
                    </div>
                  )}
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Gesamtpreis</span>
                    <span>{bookingPrice.finalPrice}€</span>
                  </div>
                  
                  <p className="text-sm text-gray-500 text-center">
                    Entspricht {bookingPrice.pricePerNight}€ pro Nacht
                  </p>
                </div>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                    Vollzahlung bei Buchung - keine weiteren Kosten vor Ort
                  </p>
                </div>
              </div>
            )}

            {/* Vorteile */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ihre Vorteile</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Buchbar bis 1 Tag im Voraus</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">24/7 Self-Check-in mit Code</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Sichere Zahlung über Stripe</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Kostenloser Tiefgaragenstellplatz</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">400 Mbit FTTH Glasfaser Internet</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Dual-Monitor Arbeitsplatz</span>
                </li>
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nach der Buchung</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs mr-3">1</span>
                  Sofortige Buchungsbestätigung per E-Mail
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs mr-3">2</span>
                  Check-in Instruktionen 24h vor Anreise
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs mr-3">3</span>
                  Self-Check-in mit persönlichem Code
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 