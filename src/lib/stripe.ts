import { Stripe, loadStripe } from '@stripe/stripe-js';

// Singleton pattern für Stripe instance
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export default getStripe;

// Utility-Funktionen für Stripe
export const formatAmountForStripe = (amount: number, currency: string): number => {
  // Stripe erwartet Beträge in Cent
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};

export const formatAmountFromStripe = (amount: number, currency: string): number => {
  // Konvertiert von Stripe-Cent zurück zu Euro
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  
  return zeroDecimalCurrency ? amount : Math.round(amount / 100);
};

// API Utility für POST-Requests
export async function fetchPostJSON(url: string, data?: {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data || {}),
    });
    
    return await response.json();
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten');
  }
} 