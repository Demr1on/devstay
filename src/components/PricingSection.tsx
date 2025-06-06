'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckIcon, StarIcon } from '@heroicons/react/24/solid';
import { Carousel } from '@mantine/carousel';
import ApartmentFeatures from './ApartmentFeatures';
import AdditionalServices from './AdditionalServices';
import { pricingConfig } from '@/lib/config';
import { 
  fadeInUp, 
  staggerContainer, 
  staggerItem 
} from '@/lib/animations';

interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  duration: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  savings: string;
  popular?: boolean;
  badge?: string;
  badgeColor?: 'green' | 'blue' | 'orange' | 'purple';
  features: string[];
  ctaText: string;
  ctaVariant: 'primary' | 'secondary' | 'accent';
}

const pricingTiers: PricingTier[] = [
  {
    id: 'short-stay',
    name: 'Kurz-Aufenthalt',
    subtitle: 'Perfekt für Geschäftsreisen',
    duration: '1-6 Nächte',
    originalPrice: 89,
    discountedPrice: 89,
    discount: 0,
    savings: '',
    badge: 'Sofort verfügbar',
    badgeColor: 'green',
    features: [
      'Flexible Buchung',
      'Sofort verfügbar',
      'Ideal für Business Trips'
    ],
    ctaText: 'Jetzt buchen',
    ctaVariant: 'secondary'
  },
  {
    id: 'weekly-stay',
    name: 'Wochen-Aufenthalt',
    subtitle: 'Für Remote Work & Projekte',
    duration: '7-29 Nächte',
    originalPrice: pricingConfig.basePrice,
    discountedPrice: Math.round(pricingConfig.basePrice * (1 - pricingConfig.weeklyDiscountPercent / 100)),
    discount: pricingConfig.weeklyDiscountPercent,
    savings: `${Math.round(pricingConfig.basePrice * pricingConfig.weeklyDiscountPercent / 100)}€ pro Nacht sparen`,
    popular: true,
    features: [
      'Wöchentliche Reinigung',
      'Flexible Arbeitszeiten',
      'Optimaler Work-Life-Balance'
    ],
    ctaText: 'Beliebteste Wahl',
    ctaVariant: 'primary'
  },
  {
    id: 'monthly-stay',
    name: 'Monats-Aufenthalt',
    subtitle: 'Für längere Projekte',
    duration: '30+ Nächte',
    originalPrice: pricingConfig.basePrice,
    discountedPrice: Math.round(pricingConfig.basePrice * (1 - pricingConfig.monthlyDiscountPercent / 100)),
    discount: pricingConfig.monthlyDiscountPercent,
    savings: `${Math.round(pricingConfig.basePrice * pricingConfig.monthlyDiscountPercent / 100)}€ pro Nacht sparen`,
    badge: 'Beste Ersparnis',
    badgeColor: 'orange',
    features: [
      'Maximaler Rabatt',
      'Bi-wöchentliche Reinigung',
      'Langzeit-Komfort'
    ],
    ctaText: 'Beste Ersparnis',
    ctaVariant: 'accent'
  }
];

export default function PricingSection() {
  // Reorder pricing tiers for carousel: weekly-stay first (center), then short-stay (left), then monthly-stay (right)
  const carouselPricingTiers = [
    pricingTiers.find(tier => tier.id === 'weekly-stay')!, // 7-29 Nächte (center/first)
    pricingTiers.find(tier => tier.id === 'short-stay')!,  // 1-6 Nächte (left)
    pricingTiers.find(tier => tier.id === 'monthly-stay')! // 30+ Nächte (right)
  ];

  const PricingCard = ({ tier, index }: { tier: PricingTier; index: number }) => (
    <motion.div
      key={tier.id}
      variants={staggerItem}
      className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 h-full flex flex-col ${
        tier.popular 
          ? 'border-blue-500 ring-4 ring-blue-100' 
          : tier.badgeColor === 'green'
          ? 'border-green-400 ring-2 ring-green-100'
          : tier.badgeColor === 'orange'
          ? 'border-orange-400 ring-2 ring-orange-100'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {(tier.popular || tier.badge) && (
        <div className="absolute top-0 left-0 right-0">
          <div className={`text-white text-center py-2 text-sm font-medium ${
            tier.popular 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600'
              : tier.badgeColor === 'green'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : tier.badgeColor === 'orange'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600'
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}>
            {tier.popular ? (
              <>
                <StarIcon className="inline w-4 h-4 mr-1" />
                Meist gewählt
              </>
            ) : (
              <>
                {tier.badgeColor === 'green' && <span className="inline mr-1">⚡</span>}
                {tier.badgeColor === 'orange' && <span className="inline mr-1">💰</span>}
                {tier.badge}
              </>
            )}
          </div>
        </div>
      )}

      <div className={`p-8 ${(tier.popular || tier.badge) ? 'pt-12' : ''} flex flex-col h-full`}>
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {tier.name}
          </h3>
          <p className="text-gray-600 mb-4">
            {tier.subtitle}
          </p>
          <div className="text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">
            {tier.duration}
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="text-4xl font-bold text-gray-900">
              {tier.discountedPrice}€
            </div>
            {tier.discount > 0 && (
              <div className="flex flex-col items-start">
                <span className="text-sm text-gray-500 line-through leading-tight">
                  {tier.originalPrice}€
                </span>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  -{tier.discount}%
                </span>
              </div>
            )}
          </div>
          <div className="text-gray-600">
            pro Nacht
          </div>
          {tier.id === 'short-stay' && (
            <div className="text-sm text-green-600 font-medium mt-1">
              Grundpreis
            </div>
          )}
          {tier.savings && (
            <div className="text-sm text-green-600 font-medium mt-2">
              {tier.savings}
            </div>
          )}
        </div>

        {/* Tier-specific Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-3">
            🎯 Perfekt für
          </h4>
          <div className="space-y-2">
            {tier.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center space-x-2">
                <CheckIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Apartment Features (compact) */}
        <div className="mb-6">
          <ApartmentFeatures />
        </div>

        {/* Zubuchbare Services (compact) */}
        <div className="mb-8 flex-grow">
          <AdditionalServices variant="compact" showPrices={false} />
        </div>

        {/* CTA Button */}
        <Link
          href="/booking"
          className={`w-full block text-center py-4 px-6 rounded-xl font-semibold transition-all duration-300 mt-auto ${
            tier.ctaVariant === 'primary'
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              : tier.ctaVariant === 'accent'
              ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl'
              : tier.id === 'short-stay'
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {tier.ctaText}
        </Link>
      </div>
    </motion.div>
  );

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transparente Preise
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Wählen Sie die perfekte Aufenthaltsdauer für Ihre Bedürfnisse. 
            Längere Aufenthalte = größere Ersparnisse.
          </p>
        </motion.div>

        {/* Mobile Carousel */}
        <div className="lg:hidden mb-16">
          <Carousel
            slideSize="85%"
            height="auto"
            withControls={false}
            withIndicators={false}
            emblaOptions={{
              loop: true,
              dragFree: false,
              align: 'center'
            }}
            className="w-full"
            styles={{
              slide: {
                height: '100%',
                display: 'flex',
                alignItems: 'stretch'
              }
            }}
          >
            {carouselPricingTiers.map((tier, index) => (
              <Carousel.Slide key={tier.id}>
                <div className="px-2 h-full">
                  <PricingCard tier={tier} index={index} />
                </div>
              </Carousel.Slide>
            ))}
          </Carousel>
        </div>

        {/* Desktop Grid */}
        <motion.div 
          className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          {pricingTiers.map((tier, index) => (
            <PricingCard key={tier.id} tier={tier} index={index} />
          ))}
        </motion.div>



      </div>
    </section>
  );
} 