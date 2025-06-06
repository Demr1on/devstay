'use client';

import { useState } from 'react';
import { PricingConfig } from '@/types';
import { calculatePriceForNights } from '@/lib/stripe-products';

interface PricingCardProps {
  config?: PricingConfig;
  className?: string;
}

const defaultConfig: PricingConfig = {
  basePrice: 89,
  weeklyDiscountPercent: 10,
  monthlyDiscountPercent: 20,
  currency: 'EUR'
};

export default function PricingCard({ config = defaultConfig, className = '' }: PricingCardProps) {
  const [selectedDuration, setSelectedDuration] = useState<'night' | 'week' | 'month'>('night');

  const calculatePrice = (duration: 'night' | 'week' | 'month') => {
    // Verwende die neue Stripe Product-basierte Preisberechnung
    switch (duration) {
      case 'night':
        return calculatePriceForNights(1).totalPrice;
      case 'week':
        return calculatePriceForNights(7).totalPrice;
      case 'month':
        return calculatePriceForNights(30).totalPrice;
      default:
        return calculatePriceForNights(1).totalPrice;
    }
  };

  const getPricePerNight = (duration: 'night' | 'week' | 'month') => {
    // Verwende die neue Stripe Product-basierte Preisberechnung pro Nacht
    switch (duration) {
      case 'night':
        return calculatePriceForNights(1).pricePerNight;
      case 'week':
        return calculatePriceForNights(7).pricePerNight;
      case 'month':
        return calculatePriceForNights(30).pricePerNight;
      default:
        return calculatePriceForNights(1).pricePerNight;
    }
  };

  const getDurationLabel = (duration: 'night' | 'week' | 'month') => {
    switch (duration) {
      case 'night':
        return 'pro Nacht';
      case 'week':
        return 'pro Woche';
      case 'month':
        return 'pro Monat';
      default:
        return 'pro Nacht';
    }
  };

  const getDurationCount = (duration: 'night' | 'week' | 'month') => {
    switch (duration) {
      case 'night':
        return 1;
      case 'week':
        return 7;
      case 'month':
        return 30;
      default:
        return 1;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-primary-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-primary-800 text-white p-6 text-center">
        <h3 className="text-2xl font-bold mb-2">Preise & Verfügbarkeit</h3>
        <p className="text-primary-200">Perfekt für ITler & Remote Worker</p>
      </div>

      {/* Duration Selector */}
      <div className="p-6">
        <div className="flex space-x-2 mb-6">
          {(['night', 'week', 'month'] as const).map((duration) => (
            <button
              key={duration}
              onClick={() => setSelectedDuration(duration)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                selectedDuration === duration
                  ? 'bg-primary-700 text-white shadow-md'
                  : 'bg-primary-100 text-secondary-700 hover:bg-primary-200'
              }`}
            >
              {duration === 'night' && '1 Nacht'}
              {duration === 'week' && '1 Woche'}
              {duration === 'month' && '1 Monat'}
            </button>
          ))}
        </div>

        {/* Price Display */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-secondary-900 mb-2">
            {calculatePrice(selectedDuration)}€
          </div>
          <div className="text-secondary-600 mb-2">
            {getDurationLabel(selectedDuration)}
          </div>
          {selectedDuration !== 'night' && (
            <div className="text-sm text-secondary-500">
              Entspricht {getPricePerNight(selectedDuration)}€ pro Nacht
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {selectedDuration !== 'night' && (
          <div className="bg-accent-100 border border-accent-200 rounded-lg p-3 mb-6 text-center">
            <div className="text-accent-800 font-semibold">
              {selectedDuration === 'week' && `${calculatePriceForNights(7).discountPercent}% Rabatt`}
              {selectedDuration === 'month' && `${calculatePriceForNights(30).discountPercent}% Rabatt`}
            </div>
            <div className="text-sm text-accent-700">
              Sparen Sie bei längeren Aufenthalten!
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary-600">Grundpreis ({getDurationCount(selectedDuration)} Nächte)</span>
            <span className="font-medium text-secondary-900">
              {selectedDuration === 'night' 
                ? `${config.basePrice}€` 
                : `${config.basePrice * getDurationCount(selectedDuration)}€`
              }
            </span>
          </div>
          {selectedDuration !== 'night' && (
            <div className="flex justify-between items-center text-accent-700">
              <span>Rabatt</span>
              <span>
                -{selectedDuration === 'week' 
                  ? (config.basePrice * 7) - calculatePriceForNights(7).totalPrice
                  : (config.basePrice * 30) - calculatePriceForNights(30).totalPrice
                }€
              </span>
            </div>
          )}
          <hr className="my-2 border-primary-200" />
          <div className="flex justify-between items-center font-semibold text-lg text-secondary-900">
            <span>Gesamtpreis</span>
            <span>{calculatePrice(selectedDuration)}€</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-secondary-600">
            <svg className="w-4 h-4 mr-2 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Vollmöbliert inkl. Bettwäsche
          </div>
          <div className="flex items-center text-sm text-secondary-600">
            <svg className="w-4 h-4 mr-2 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            400 Mbit FTTH Internet
          </div>
          <div className="flex items-center text-sm text-secondary-600">
            <svg className="w-4 h-4 mr-2 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Dual-Monitor Arbeitsplatz
          </div>
          <div className="flex items-center text-sm text-secondary-600">
            <svg className="w-4 h-4 mr-2 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Tiefgaragenstellplatz
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-accent-700 text-white py-4 px-6 rounded-lg font-semibold hover:bg-accent-800 transition-colors duration-200 shadow-md hover:shadow-lg">
          Jetzt buchen - {calculatePrice(selectedDuration)}€
        </button>
        
        <div className="text-center mt-3 text-sm text-secondary-500">
          Bis 1 Tag im Voraus buchbar
        </div>
      </div>
    </div>
  );
} 