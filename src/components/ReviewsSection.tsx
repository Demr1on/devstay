'use client';

import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
  location: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Michael K.",
    rating: 5,
    comment: "Perfekte IT-Ausstattung! Die 400 Mbit Glasfaser sind ein Traum für Remote Work.",
    avatar: "👨‍💻",
    date: "vor 2 Wochen",
    location: "Hamburg"
  },
  {
    id: 2,
    name: "Sarah L.",
    rating: 5,
    comment: "Absolut saubere Wohnung und die Lage zur Schwarz IT ist unschlagbar. Gerne wieder!",
    avatar: "👩‍💼",
    date: "vor 1 Monat",
    location: "Berlin"
  },
  {
    id: 3,
    name: "Thomas B.",
    rating: 4,
    comment: "Dual-Monitor Setup war genau das was ich brauchte. Einziger Punkt: WLAN könnte stabiler sein.",
    avatar: "👨‍🔧",
    date: "vor 3 Wochen",
    location: "München"
  },
  {
    id: 4,
    name: "Lisa M.",
    rating: 5,
    comment: "Ruhige Lage am Neckar, trotzdem nur 5 Min zur Arbeit. Perfekt für Business-Aufenthalte!",
    avatar: "👩‍🎓",
    date: "vor 1 Woche",
    location: "Stuttgart"
  },
  {
    id: 5,
    name: "Daniel R.",
    rating: 3,
    comment: "Solide Unterkunft, aber die Küche könnte besser ausgestattet sein. Lage ist top.",
    avatar: "👨‍💼",
    date: "vor 2 Monaten",
    location: "Frankfurt"
  },
  {
    id: 6,
    name: "Anna F.",
    rating: 5,
    comment: "Als Entwicklerin war ich begeistert! Alles da was man braucht, sogar ein Switch für meine Geräte.",
    avatar: "👩‍💻",
    date: "vor 5 Tagen",
    location: "Köln"
  },
  {
    id: 7,
    name: "Markus W.",
    rating: 4,
    comment: "Tiefgarage ist Gold wert! Apartment könnte etwas größer sein, aber für 1-2 Personen völlig ok.",
    avatar: "👨‍🚗",
    date: "vor 3 Wochen",
    location: "Düsseldorf"
  },
  {
    id: 8,
    name: "Julia S.",
    rating: 5,
    comment: "Check-in war super unkompliziert und die Wohnung übertraf alle Erwartungen. Sehr empfehlenswert!",
    avatar: "👩‍🏫",
    date: "vor 1 Woche",
    location: "Leipzig"
  },
  {
    id: 9,
    name: "Stefan H.",
    rating: 2,
    comment: "Internet war leider oft instabil, für Video-Calls problematisch. Apartment sonst in Ordnung.",
    avatar: "👨‍📊",
    date: "vor 6 Wochen",
    location: "Nürnberg"
  },
  {
    id: 10,
    name: "Christina P.",
    rating: 5,
    comment: "Liebevolle Details und alles blitzsauber! Fühlt sich wie ein zweites Zuhause an.",
    avatar: "👩‍🎨",
    date: "vor 2 Wochen",
    location: "Dresden"
  },
  {
    id: 11,
    name: "Patrick E.",
    rating: 1,
    comment: "Leider war die Heizung defekt und es dauerte ewig bis jemand kam. Nicht akzeptabel.",
    avatar: "👨‍🛠️",
    date: "vor 2 Monaten",
    location: "Dortmund"
  },
  {
    id: 12,
    name: "Jennifer Z.",
    rating: 5,
    comment: "Als Beraterin oft unterwegs - das ist mit Abstand die beste Business-Unterkunft die ich kenne!",
    avatar: "👩‍💼",
    date: "vor 1 Woche",
    location: "Freiburg"
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star} className="relative">
          {star <= rating ? (
            <StarIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="w-5 h-5 text-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
};

const FloatingReviewCard = ({ review, index }: { review: Review; index: number }) => {
  // Optimierte Positionen für 12 Cards - Footer-sicher
  const positions = [
    { x: '8%', y: '10%' }, { x: '75%', y: '5%' }, { x: '25%', y: '20%' }, 
    { x: '65%', y: '30%' }, { x: '15%', y: '40%' }, { x: '80%', y: '35%' },
    { x: '35%', y: '50%' }, { x: '55%', y: '60%' }, { x: '20%', y: '55%' },
    { x: '70%', y: '15%' }, { x: '45%', y: '35%' }, { x: '85%', y: '50%' }
  ];

  const position = positions[index];
  
  // Optimierte Floating-Animation
  const floatingVariants = {
    floating: {
      y: [0, -15, 0],
      x: [0, Math.sin(index) * 10, 0],
      rotate: [0, Math.cos(index) * 2, 0],
      transition: {
        duration: 3 + (index % 2),
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.3
      }
    }
  };

  return (
    <motion.div
      className="absolute bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200/50 w-[240px] hover:shadow-2xl transition-all duration-300 cursor-pointer"
      style={{
        left: position.x,
        top: position.y,
        zIndex: 20 + (index % 3)
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      variants={floatingVariants}
      whileInView="floating"
      viewport={{ once: false }}
      whileHover={{ 
        scale: 1.08, 
        y: -15,
        zIndex: 100,
        transition: { duration: 0.2 }
      }}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">{review.avatar}</div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
            <p className="text-xs text-gray-500">{review.location}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex space-x-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star}>
                {star <= review.rating ? (
                  <StarIcon className="w-3 h-3 text-yellow-400" />
                ) : (
                  <StarOutlineIcon className="w-3 h-3 text-gray-300" />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">{review.date}</p>
        </div>
      </div>

      {/* Compact Comment */}
      <div className="relative">
        <p className="text-gray-700 text-sm leading-relaxed italic line-clamp-3">
          "{review.comment}"
        </p>
        
        {/* Small Quote decoration */}
        <div className="absolute -top-1 -left-1 text-2xl text-primary-200 font-serif opacity-50">
          "
        </div>
      </div>

      {/* Compact Bottom */}
      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
          <span className="text-xs text-gray-500">Verifiziert</span>
        </div>
        <div className="text-xs">
          {review.rating >= 4 ? '👍' : review.rating >= 3 ? '👌' : '👎'}
        </div>
      </div>
    </motion.div>
  );
};

export default function ReviewsSection() {
  return (
    <section id="bewertungen" className="py-16 bg-white overflow-hidden min-h-[700px] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-12 relative z-30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Das sagen unsere Gäste
          </h2>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto mb-6">
            Über 200+ zufriedene Business-Gäste haben bereits bei uns übernachtet. 
            Lesen Sie echte Erfahrungen von IT-Profis und Geschäftsreisenden.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-6 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold text-stone">4.6</div>
              <div className="flex justify-center mb-1">
                <StarRating rating={5} />
              </div>
              <div className="text-xs text-gray-500">Durchschnitt</div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-xl font-bold text-stone">200+</div>
              <div className="text-xs text-gray-500">Bewertungen</div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-xl font-bold text-stone">95%</div>
              <div className="text-xs text-gray-500">Empfehlen uns</div>
            </div>
          </div>
        </motion.div>

        {/* Floating Reviews Container */}
        <div className="relative min-h-[400px] w-full mb-8">
          {/* Floating Review Bubbles */}
          {reviews.map((review, index) => (
            <FloatingReviewCard 
              key={review.id}
              review={review} 
              index={index}
            />
          ))}
          
          {/* Optimierte Decorative floating elements */}
          <div className="absolute top-8 left-8 w-3 h-3 bg-primary-200 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-32 right-16 w-4 h-4 bg-mist/30 rounded-full opacity-50 animate-bounce"></div>
          <div className="absolute bottom-16 left-1/4 w-2 h-2 bg-stone/20 rounded-full opacity-30 animate-ping"></div>
        </div>
      </div>
    </section>
  );
} 