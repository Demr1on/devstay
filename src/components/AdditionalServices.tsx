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
    id: 'cleaning-service',
    icon: SparklesIcon,
    name: 'Extra Reinigung',
    description: 'Zwischenreinigung bei längerem Aufenthalt',
    price: 45,
    unit: 'pro Service'
  },
  {
    id: 'extra-guest',
    icon: UserGroupIcon,
    name: 'Zusätzlicher Gast',
    description: 'Luftmatratze + Bettwäsche',
    price: 10,
    unit: 'pro Nacht'
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
        <div className="grid grid-cols-1 gap-2">
          {additionalServices.map((service, index) => (
            <div key={service.id} className="flex items-center space-x-2">
              <service.icon className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs text-gray-700 truncate">
                {service.name}
              </span>
            </div>
          ))}
        </div>
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
    </div>
  );
}

// Export der Services für Stripe-Integration
export { additionalServices };
export type { AdditionalService }; 