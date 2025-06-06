import { 
  WifiIcon,
  ComputerDesktopIcon,
  HomeIcon,
  BuildingOffice2Icon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const apartmentFeatures = [
  {
    icon: WifiIcon,
    title: "400 Mbit FTTH Glasfaser",
    description: "Ultraschnelles Internet für seamless Remote Work"
  },
  {
    icon: ComputerDesktopIcon,
    title: "Dual-Monitor Arbeitsplatz",
    description: "Professioneller ergonomischer Setup"
  },
  {
    icon: HomeIcon,
    title: "Vollmöbliert",
    description: "Gemütliche Couch, Fernseher, komplette Küche"
  },
  {
    icon: BuildingOffice2Icon,
    title: "Tiefgaragenstellplatz",
    description: "Sicherer Parkplatz mit Kameraüberwachung"
  },
  {
    icon: BoltIcon,
    title: "Tech-Ready",
    description: "Steckdosenleiste, Switch, USB-Hubs"
  },
  {
    icon: ShieldCheckIcon,
    title: "100% kostenlose Stornierung",
    description: "Jederzeit bis kurz vor Check-in"
  }
];

export default function ApartmentFeatures() {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
        ✅ Alles inklusive
      </h4>
      <div className="space-y-3">
        {apartmentFeatures.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <feature.icon className="h-5 w-5 text-green-600 mt-0.5" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {feature.title}
              </div>
              <div className="text-xs text-gray-600">
                {feature.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 