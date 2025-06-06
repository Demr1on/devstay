'use client';

import { useState, useEffect } from 'react';
import { 
  WrenchScrewdriverIcon,
  HomeIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function MaintenancePage() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Beispiel: Renovierung bis Ende März 2024
  const renovationEndDate = new Date('2024-03-31T00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = renovationEndDate.getTime() - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-800 mb-4">
              DevStay
            </h1>
            <p className="text-xl text-primary-600">
              Premium IT-Apartment • Bad Friedrichshall
            </p>
          </div>

          {/* Maintenance Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <WrenchScrewdriverIcon className="w-16 h-16 text-orange-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🏗️ Renovierung im Gange
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Wir machen unser Tech-Apartment noch besser für Sie! 
              Aktuell wird renoviert und modernisiert.
            </p>
          </div>

          {/* Countdown */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              🎯 Voraussichtliche Wiedereröffnung
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: 'Tage', value: countdown.days },
                { label: 'Stunden', value: countdown.hours },
                { label: 'Minuten', value: countdown.minutes },
                { label: 'Sekunden', value: countdown.seconds }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
                  <div className="text-3xl font-bold text-primary-800">{item.value}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* What's Being Improved */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center justify-center">
              <HomeIcon className="w-8 h-8 mr-3 text-primary-600" />
              Was wird verbessert?
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {[
                {
                  title: "🌐 Internet Upgrade",
                  description: "Auf 1000 Mbit Glasfaser (bisher 400 Mbit)"
                },
                {
                  title: "💻 Arbeitsplatz 2.0",
                  description: "Neuer ergonomischer Schreibtisch & Monitor"
                },
                {
                  title: "🛏️ Schlafkomfort",
                  description: "Premium Matratze & Bettwäsche"
                },
                {
                  title: "🍳 Küche Plus",
                  description: "Moderne Geräte & Vollausstattung"
                },
                {
                  title: "🚿 Badezimmer",
                  description: "Komplette Modernisierung"
                },
                {
                  title: "🎨 Design Refresh",
                  description: "Neue Farben & moderne Möbel"
                }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Early Access */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-12 border-2 border-green-200">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">
              🎉 Früher informiert werden?
            </h3>
            <p className="text-green-800 mb-6">
              Seien Sie der Erste, der erfährt, wenn das renovierte Apartment verfügbar ist!
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="ihre.email@beispiel.de"
                  className="flex-1 px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Benachrichtigen
                </button>
              </div>
              <p className="text-green-700 text-sm mt-2">
                + 10% Rabatt für Early Birds! 🎯
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-primary-800 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-6 flex items-center justify-center">
              <EnvelopeIcon className="w-8 h-8 mr-3" />
              Fragen? Wir sind da!
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">📧 E-Mail</h4>
                <a href="mailto:info@devstay.de" className="text-primary-200 hover:text-white">
                  info@devstay.de
                </a>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📱 WhatsApp</h4>
                <a href="https://wa.me/4917641847930" className="text-primary-200 hover:text-white">
                  +49 176 41847930
                </a>
              </div>
            </div>
            
            <p className="text-primary-200 text-sm mt-6">
              Alternativ können Sie auch andere Unterkünfte in der Region empfehlen bekommen.
            </p>
          </div>

          {/* Social Proof */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
              💝 Bereits <strong>47 Entwickler</strong> warten auf die Wiedereröffnung
            </p>
          </div>

        </div>
      </div>
    </div>
  );
} 