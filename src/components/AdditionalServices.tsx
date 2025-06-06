import { 
  ShoppingCartIcon,
  BeakerIcon,
  TruckIcon,
  WifiIcon,
  UserGroupIcon,
  SparklesIcon,
  KeyIcon,
  CameraIcon,
  ClockIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

interface AdditionalService {
  id: string;
  icon: React.ComponentType<any>;
  name: string;
  description: string;
  price: number;
  unit: string;
  popular?: boolean;
  stripeProductId?: string; // Für später
}

const additionalServices: AdditionalService[] = [
  {
    id: 'early-checkin',
    icon: ClockIcon,
    name: 'Early Check-in',
    description: 'Check-in ab 12:00 statt 15:00',
    price: 25,
    unit: 'einmalig'
  },
  {
    id: 'late-checkout',
    icon: ClockIcon,
    name: 'Late Check-out',
    description: 'Check-out bis 14:00 statt 11:00',
    price: 25,
    unit: 'einmalig'
  },
  {
    id: 'premium-coffee',
    icon: BeakerIcon,
    name: 'Premium Kaffee-Paket',
    description: 'Nespresso Kapseln + Spezialitäten',
    price: 15,
    unit: 'pro Aufenthalt',
    popular: true
  },
  {
    id: 'grocery-service',
    icon: ShoppingCartIcon,
    name: 'Grocery Service',
    description: 'Grundausstattung im Kühlschrank',
    price: 35,
    unit: 'einmalig'
  },
  {
    id: 'airport-transfer',
    icon: TruckIcon,
    name: 'Airport Transfer',
    description: 'Abholung Stuttgart Flughafen',
    price: 85,
    unit: 'pro Fahrt'
  },
  {
    id: 'fiber-upgrade',
    icon: WifiIcon,
    name: 'Gigabit Upgrade',
    description: '1000 Mbit/s statt 400 Mbit/s',
    price: 10,
    unit: 'pro Nacht'
  },
  {
    id: 'extra-guest',
    icon: UserGroupIcon,
    name: 'Zusätzlicher Gast',
    description: 'Luftmatratze + Bettwäsche',
    price: 20,
    unit: 'pro Nacht'
  },
  {
    id: 'cleaning-service',
    icon: SparklesIcon,
    name: 'Extra Reinigung',
    description: 'Zwischenreinigung bei längerem Aufenthalt',
    price: 45,
    unit: 'pro Service'
  },
  {
    id: 'key-service',
    icon: KeyIcon,
    name: '24/7 Key Service',
    description: 'Persönliche Schlüsselübergabe',
    price: 15,
    unit: 'einmalig'
  },
  {
    id: 'welcome-package',
    icon: GiftIcon,
    name: 'Welcome Package',
    description: 'Lokale Spezialitäten + Bad Friedrichshall Guide',
    price: 25,
    unit: 'einmalig',
    popular: true
  }
];

interface AdditionalServicesProps {
  variant?: 'compact' | 'detailed';
  showPrices?: boolean;
}

export default function AdditionalServices({ 
  variant = 'detailed', 
  showPrices = true 
}: AdditionalServicesProps) {
  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
          🛍️ Zubuchbar
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {additionalServices.slice(0, 6).map((service, index) => (
            <div key={service.id} className="flex items-center space-x-2">
              <service.icon className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs text-gray-700 truncate">
                {service.name}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          + 4 weitere Services verfügbar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🛍️ Zubuchbare Services
        </h3>
        <p className="text-gray-600">
          Machen Sie Ihren Aufenthalt noch komfortabler
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {additionalServices.map((service, index) => (
          <div
            key={service.id}
            className={`relative bg-white rounded-lg border-2 p-4 hover:shadow-md transition-all duration-200 ${
              service.popular 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {service.popular && (
              <div className="absolute -top-2 left-4">
                <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Beliebt
                </span>
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <service.icon className={`h-6 w-6 ${
                  service.popular ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {service.name}
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  {service.description}
                </p>
                {showPrices && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-gray-900">
                      {service.price}€
                    </span>
                    <span className="text-xs text-gray-500">
                      {service.unit}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <CameraIcon className="h-5 w-5 text-yellow-600" />
          <h4 className="font-semibold text-yellow-900">
            Services bei der Buchung hinzufügen
          </h4>
        </div>
        <p className="text-yellow-800 text-sm">
          Alle Services können direkt bei der Buchung ausgewählt oder später per E-Mail/WhatsApp nachgebucht werden. 
          Stripe verarbeitet alle Zahlungen sicher.
        </p>
      </div>
    </div>
  );
}

// Export der Services für Stripe-Integration
export { additionalServices };
export type { AdditionalService }; 