'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import BookingButton from './BookingButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Scroll zu Bewertungen Section
  const scrollToReviews = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (pathname === '/') {
      // Auf Startseite - direkt scrollen
      const reviewsSection = document.getElementById('bewertungen');
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // Auf anderer Seite - zur Startseite navigieren und dann scrollen
      router.push('/#bewertungen');
    }
    
    setIsMenuOpen(false);
  };

  // Verhindere Hydration-Fehler
  useEffect(() => {
    setIsClient(true);
    
    // Prüfe auf Hash-Fragment beim ersten Laden
    const hash = window.location.hash;
    if (hash === '#bewertungen') {
      setTimeout(() => {
        const reviewsSection = document.getElementById('bewertungen');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100); // Kurze Verzögerung um sicherzustellen, dass die Seite geladen ist
    }
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
    <header className="bg-gradient-to-r from-stone to-primary-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white hover:text-mist transition-colors">
              DevStay
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              item.name === 'Bewertungen' ? (
                <button
                  key={item.name}
                  onClick={scrollToReviews}
                  className="text-primary-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-primary-700/30"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-primary-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-primary-700/30"
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <BookingButton size="sm">
              Jetzt buchen
            </BookingButton>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-100 hover:text-white focus:outline-none focus:text-white transition-colors"
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-r from-stone to-primary-800 border-t border-primary-600/30">
              {navigation.map((item) => (
                item.name === 'Bewertungen' ? (
                  <button
                    key={item.name}
                    onClick={scrollToReviews}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-primary-100 hover:text-white hover:bg-primary-700/30 rounded-md transition-colors"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-primary-100 hover:text-white hover:bg-primary-700/30 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="pt-4 pb-2">
                <BookingButton 
                  size="md" 
                  className="w-full block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Jetzt buchen
                </BookingButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 