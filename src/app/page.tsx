'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PricingCard from '@/components/PricingCard';
import { 
  fadeInUp, 
  fadeIn, 
  slideInLeft, 
  slideInRight, 
  scaleIn, 
  staggerContainer, 
  staggerItem,
  numberCountUp
} from '@/lib/animations';

export default function Home() {
  const features = [
    {
      title: "400 Mbit Glasfaser",
      description: "Ultraschnelles FTTH Internet für seamless Remote Work und Video-Calls",
      icon: "🌐",
      color: "text-blue-600"
    },
    {
      title: "Dual-Monitor Setup",
      description: "Professioneller Arbeitsplatz mit zwei Monitoren und ergonomischem Bürostuhl",
      icon: "🖥️",
      color: "text-purple-600"
    },
    {
      title: "Vollmöbliert",
      description: "Gemütliche Couch, Fernseher, Küche und alles was Sie brauchen",
      icon: "🏠",
      color: "text-green-600"
    },
    {
      title: "Tiefgarage",
      description: "Sicherer Stellplatz mit Fahrradanker und Kameraüberwachung",
      icon: "🚗",
      color: "text-orange-600"
    },
    {
      title: "Ruhige Lage",
      description: "Direkt am Fluss mit Radweg - perfekt zum Abschalten nach der Arbeit",
      icon: "🌊",
      color: "text-cyan-600"
    },
    {
      title: "Tech-Ready",
      description: "Steckdosenleiste, Switch und alles für Ihr Equipment bereit",
      icon: "⚡",
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Ihr perfektes
              <span className="block text-primary-200">Tech-Apartment</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Vollmöblierte 1,5-Zimmer Wohnung in Bad Friedrichshall mit allem was ITler brauchen.
              400 Mbit Glasfaser, Dual-Monitor Setup und absolute Ruhe für produktives Arbeiten.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <Link
                href="/apartment"
                className="bg-white text-primary-800 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Apartment ansehen
              </Link>
              <Link
                href="/booking"
                className="bg-accent-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-accent-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Jetzt buchen - ab 89€
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <motion.div 
          className="bg-white/10 backdrop-blur-sm border-t border-white/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {[
                { number: "400", label: "Mbit/s Internet" },
                { number: "2", label: "Monitore" },
                { number: "89€", label: "pro Nacht" },
                { number: "24h", label: "Vorab-Buchung" }
              ].map((stat, index) => (
                <motion.div key={index} variants={numberCountUp}>
                  <div className="text-3xl font-bold text-primary-200">{stat.number}</div>
                  <div className="text-primary-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Unique Selling Point Banner */}
      <motion.section 
        className="py-12 bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-4"
              variants={scaleIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-green-800 mb-3"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              🚀 Einzige IT-Unterkunft mit 100% kostenlosen Last-Minute-Stornierungen!
            </motion.h2>
            <motion.p 
              className="text-lg text-green-700 mb-6 max-w-2xl mx-auto"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Wir verstehen, dass IT-Profis oft kurzfristige Terminänderungen haben.
              Deshalb bieten wir als einzige Unterkunft maximale Flexibilität.
            </motion.p>
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                "Jederzeit stornierbar",
                "Volle Rückerstattung", 
                "Keine Gebühren",
                "Auto-Erstattung"
              ].map((text, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center justify-center text-green-600 bg-white rounded-lg p-3 shadow-sm"
                  variants={staggerItem}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">{text}</span>
                </motion.div>
              ))}
            </motion.div>
            <motion.div 
              className="text-sm text-green-600 opacity-80 italic"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              ⚡ Andere Hotels berechnen oft 50-100% bei Last-Minute-Stornierungen
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-primary-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Warum ITler unser Apartment lieben
            </h2>
            <p className="text-xl text-secondary-700 max-w-3xl mx-auto">
              Speziell für Tech-Professionals entwickelt - mit allem was Sie für produktives Remote Work brauchen
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-primary-200 hover:border-primary-400 hover:scale-105"
                variants={staggerItem}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Location Preview */}
      <motion.section 
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={slideInLeft}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Perfekte Lage in Bad Friedrichshall
              </h2>
              <div className="space-y-6 text-secondary-600">
                <motion.div 
                  className="flex items-start"
                  variants={fadeInUp}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-6 h-6 mt-1 mr-3 text-accent-700">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-secondary-900">Wacholderweg 2, 74177 Bad Friedrichshall</strong>
                    <p>Ruhige Wohngegend mit direktem Zugang zum Neckar</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-start"
                  variants={fadeInUp}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-6 h-6 mt-1 mr-3 text-accent-700">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-secondary-900">Nur 20 Minuten nach Heilbronn</strong>
                    <p>Direkter Zugang zu Tech-Unternehmen und Coworking Spaces</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-start"
                  variants={fadeInUp}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-6 h-6 mt-1 mr-3 text-accent-700">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-secondary-900">Radweg direkt vor der Tür</strong>
                    <p>Entspannung nach der Arbeit am Fluss entlang</p>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="mt-8"
                variants={fadeInUp}
                transition={{ delay: 0.8 }}
              >
                <Link
                  href="/location"
                  className="bg-accent-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-800 transition-colors duration-200 inline-block"
                >
                  Lage & Umgebung erkunden
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
              className="bg-primary-100 rounded-xl p-8"
              variants={slideInRight}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="text-center">
                <motion.div 
                  className="text-6xl mb-4"
                  variants={scaleIn}
                  transition={{ delay: 0.2 }}
                >
                  📍
                </motion.div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  Bad Friedrichshall im Herzen von Baden-Württemberg
                </h3>
                <motion.div 
                  className="space-y-4 text-sm text-secondary-700"
                  variants={staggerContainer}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    { icon: "🚗", title: "Verkehrsanbindung", desc: "A6 & A81 in 10-15 Min • Stuttgart 45 Min • Mannheim 30 Min" },
                    { icon: "🏢", title: "Tech-Hubs", desc: "Heilbronn Campus • SAP Arena Region • Auto-Industrie" },
                    { icon: "🌿", title: "Natur", desc: "Neckar-Radweg • Kraichgau • Löwensteiner Berge" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="bg-white rounded-lg p-4"
                      variants={staggerItem}
                    >
                      <div className="font-medium text-secondary-900 mb-2">{item.icon} {item.title}</div>
                      <p>{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section 
        className="py-20 bg-primary-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Transparente Preise
            </h2>
            <p className="text-xl text-secondary-700 max-w-3xl mx-auto">
              Faire Preise mit attraktiven Rabatten für längere Aufenthalte
            </p>
          </motion.div>

          <motion.div 
            className="max-w-md mx-auto"
            variants={scaleIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <PricingCard />
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-primary-800 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Bereit für Ihren produktiven Aufenthalt?
          </motion.h2>
          <motion.p 
            className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Buchen Sie jetzt Ihr Tech-Apartment und erleben Sie perfektes Remote Work in Bad Friedrichshall
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/booking"
              className="bg-accent-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-accent-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Jetzt buchen
            </Link>
            <Link
              href="/contact"
              className="border-2 border-primary-300 text-primary-200 px-8 py-4 rounded-lg font-semibold hover:bg-primary-300 hover:text-primary-900 transition-all duration-300"
            >
              Fragen stellen
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
