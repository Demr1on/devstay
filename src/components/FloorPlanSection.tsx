'use client';

import { motion } from 'framer-motion';
import FloorPlan from './FloorPlan';
import { 
  fadeInUp, 
  slideInLeft, 
  slideInRight,
  staggerContainer,
  staggerItem
} from '@/lib/animations';

export default function FloorPlanSection() {
  return (
    <motion.section 
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Entdecken Sie Ihr Apartment
          </h2>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Verschaffen Sie sich einen detaillierten Überblick über alle Räume. 
            Klicken Sie auf die Icons im Grundriss für eine interaktive 360°-Tour durch Ihr zukünftiges Zuhause auf Zeit.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Interactive Floor Plan */}
          <motion.div
            variants={slideInLeft}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <FloorPlan className="w-full" />
          </motion.div>

          {/* Right: Description & Features */}
          <motion.div
            variants={slideInRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div 
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={staggerItem}>
                <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                  Optimaler Grundriss für Business-Aufenthalte
                </h3>
                <p className="text-secondary-600 mb-6">
                  Unser durchdacht gestaltetes Apartment bietet alle Bereiche, die Sie für einen 
                  produktiven und komfortablen Aufenthalt benötigen - von der vollausgestatteten 
                  Küche bis zum professionellen Arbeitsplatz.
                </p>
              </motion.div>

              {/* Room Highlights */}
              <motion.div 
                className="space-y-4"
                variants={staggerContainer}
              >
                {[
                  {
                    icon: '💻',
                    title: 'Dedizierter Arbeitsplatz',
                    description: 'Dual-Monitor Setup mit ergonomischem Stuhl und 400 Mbit Glasfaser'
                  },
                  {
                    icon: '🛋️',
                    title: 'Gemütlicher Wohnbereich',
                    description: '55" Smart-TV, bequeme Couch und Entspannungszone nach der Arbeit'
                  },
                  {
                    icon: '🍳',
                    title: 'Vollausgestattete Küche',
                    description: 'Induktionsherd, Backofen, Geschirrspüler und alles für Ihre Mahlzeiten'
                  },
                  {
                    icon: '🛏️',
                    title: 'Ruhiges Schlafzimmer',
                    description: 'Hochwertiges Boxspringbett und Verdunklungsvorhänge für erholsamen Schlaf'
                  }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                    variants={staggerItem}
                  >
                    <div className="text-2xl mt-1 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-secondary-600">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Call to Action */}
              <motion.div 
                className="mt-8"
                variants={staggerItem}
              >
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-xl border border-primary-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">🏠</span>
                    <h4 className="font-semibold text-secondary-900">
                      Interaktive 360°-Tour
                    </h4>
                  </div>
                  <p className="text-sm text-secondary-600 mb-4">
                    Klicken Sie auf die Icons im Grundriss, um jeden Raum in einer 
                    immersiven 360°-Ansicht zu erkunden. So bekommen Sie das beste 
                    Gefühl für Ihr temporäres Zuhause.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-primary-700">
                    <span>✨</span>
                    <span>Verfügbar für alle Räume</span>
                    <span>•</span>
                    <span>HD-Qualität</span>
                    <span>•</span>
                    <span>Vollbildmodus</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>

        {/* Bottom Statistics */}
        <motion.div 
          className="mt-16 pt-12 border-t border-gray-200"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '65m²', label: 'Wohnfläche' },
              { number: '5', label: 'Räume' },
              { number: '2', label: 'Monitore' },
              { number: '360°', label: 'Rundumblick' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-primary-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
} 