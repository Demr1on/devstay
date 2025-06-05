export interface Apartment {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  features: ApartmentFeature[];
  images: string[];
  pricePerNight: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
}

export interface ApartmentFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'tech' | 'comfort' | 'location' | 'general';
}

export interface Booking {
  id: string;
  apartmentId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  totalNights: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
}

export interface Review {
  id: string;
  apartmentId: string;
  guestName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface BlockedDate {
  id: string;
  date: Date;
  reason: string;
}

export interface PricingConfig {
  basePrice: number;
  weeklyDiscountPercent: number;
  monthlyDiscountPercent: number;
  currency: string;
} 