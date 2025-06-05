'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Verhindere Hydration-Fehler
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Schließe Menü bei Escape-Taste
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  const navigation = [
    { name: 'Startseite', href: '/' },
    { name: 'Apartment', href: '/apartment' },
    { name: 'Lage', href: '/location' },
    { name: 'Preise', href: '/pricing' },
    { name: 'Bewertungen', href: '/reviews' },
    { name: 'Kontakt', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-primary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary-800 hover:text-primary-900 transition-colors">
              DevStay
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-secondary-600 hover:text-primary-700 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-primary-50"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/booking"
              className="bg-accent-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-accent-800 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Jetzt buchen
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-secondary-600 hover:text-secondary-900 focus:outline-none focus:text-secondary-900 transition-colors"
              aria-label="Menü öffnen"
              aria-expanded={isMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - nur rendern wenn Client bereit ist */}
        {isClient && isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-primary-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-secondary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-2">
                <Link
                  href="/booking"
                  className="block w-full text-center bg-accent-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Jetzt buchen
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 