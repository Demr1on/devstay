// Stripe Product IDs aus Environment Variables laden
const getStripeProductIds = () => {
  const singleNightProductId = process.env.STRIPE_PRODUCT_SINGLE_NIGHT || 'prod_SRhTv1O1egB0MR';
  const singleNightPriceId = process.env.STRIPE_PRICE_SINGLE_NIGHT || 'price_1RWo4YRaOvz8283gsXWDnkHh';
  const weeklyProductId = process.env.STRIPE_PRODUCT_WEEKLY || 'prod_SRhb3fUUBCKTA0';
  const weeklyPriceId = process.env.STRIPE_PRICE_WEEKLY || 'price_1RWoCWRaOvz8283ghw0Z2jMX';
  const monthlyProductId = process.env.STRIPE_PRODUCT_MONTHLY || 'prod_SRhchf9yTaji7l';
  const monthlyPriceId = process.env.STRIPE_PRICE_MONTHLY || 'price_1RWoD3RaOvz8283galsPmsd5';

  return {
    singleNightProductId,
    singleNightPriceId,
    weeklyProductId,
    weeklyPriceId,
    monthlyProductId,
    monthlyPriceId
  };
};

// Stripe Product IDs für DevStay Apartment
export const STRIPE_PRODUCTS = {
  // Einzelnächte (ohne Rabatt)
  SINGLE_NIGHT: {
    get productId() { return getStripeProductIds().singleNightProductId; },
    get priceId() { return getStripeProductIds().singleNightPriceId; },
    unitAmount: 8900, // 89€ in Cent
    currency: 'eur',
    name: 'DevStay Apartment - Einzelnacht',
    description: 'Premium IT-Apartment pro Nacht',
    minNights: 1,
    maxNights: 6,
    discountPercent: 0
  },
  
  // Wochenbuchung (10% Rabatt)
  WEEKLY: {
    get productId() { return getStripeProductIds().weeklyProductId; },
    get priceId() { return getStripeProductIds().weeklyPriceId; },
    unitAmount: 56000, // 560€ in Cent (89×7×0.9)
    currency: 'eur',
    name: 'DevStay Apartment - Woche',
    description: 'Premium IT-Apartment Woche (10% Rabatt)',
    minNights: 7,
    maxNights: 29,
    discountPercent: 10
  },
  
  // Monatsbuchung (20% Rabatt)
  MONTHLY: {
    get productId() { return getStripeProductIds().monthlyProductId; },
    get priceId() { return getStripeProductIds().monthlyPriceId; },
    unitAmount: 213600, // 2136€ in Cent (89×30×0.8)
    currency: 'eur',
    name: 'DevStay Apartment - Monat',
    description: 'Premium IT-Apartment Monat (20% Rabatt)',
    minNights: 30,
    maxNights: 365,
    discountPercent: 20
  }
} as const;

// Produkt basierend auf Aufenthaltsdauer auswählen
export function getStripeProductForNights(nights: number) {
  if (nights >= 30) {
    return STRIPE_PRODUCTS.MONTHLY;
  } else if (nights >= 7) {
    return STRIPE_PRODUCTS.WEEKLY;
  } else {
    return STRIPE_PRODUCTS.SINGLE_NIGHT;
  }
}

// Preis für beliebige Nächte berechnen (mit korrekten Rabatten)
export function calculatePriceForNights(nights: number, basePrice = 89) {
  const product = getStripeProductForNights(nights);
  
  if (nights >= 30) {
    // Monatspreis: 30 Tage Basis × Monatsfaktor
    const monthlyBasePrice = basePrice * 30;
    const monthlyDiscount = monthlyBasePrice * (product.discountPercent / 100);
    const monthlyPrice = monthlyBasePrice - monthlyDiscount;
    const pricePerNight = monthlyPrice / 30;
    return {
      totalPrice: Math.round(pricePerNight * nights),
      pricePerNight: Math.round(pricePerNight),
      discountPercent: product.discountPercent,
      product
    };
  } else if (nights >= 7) {
    // Wochenpreis: 7 Tage Basis × Wochenfaktor  
    const weeklyBasePrice = basePrice * 7;
    const weeklyDiscount = weeklyBasePrice * (product.discountPercent / 100);
    const weeklyPrice = weeklyBasePrice - weeklyDiscount;
    const pricePerNight = weeklyPrice / 7;
    return {
      totalPrice: Math.round(pricePerNight * nights),
      pricePerNight: Math.round(pricePerNight),
      discountPercent: product.discountPercent,
      product
    };
  } else {
    // Einzelnächte: Kein Rabatt
    return {
      totalPrice: basePrice * nights,
      pricePerNight: basePrice,
      discountPercent: 0,
      product
    };
  }
}

// Stripe Line Item für Checkout Session erstellen
export function createStripeLineItem(nights: number, checkIn: string, checkOut: string) {
  const pricing = calculatePriceForNights(nights);
  const product = pricing.product;
  
  return {
    price: product.priceId,
    quantity: 1,
    // Für custom amounts (falls nights nicht exakt passen)
    ...(pricing.totalPrice !== (product.unitAmount / 100) && {
      price_data: {
        currency: product.currency,
        product: product.productId,
        unit_amount: pricing.totalPrice * 100, // Euro zu Cent
      }
    })
  };
}

export type StripeProduct = typeof STRIPE_PRODUCTS[keyof typeof STRIPE_PRODUCTS]; 