'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PricingSection from '@/components/PricingSection';
import BookingButton from '@/components/BookingButton';
import RouteAnimation from '@/components/RouteAnimation';
import FloorPlanSection from '@/components/FloorPlanSection';
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
import { useState, useRef, useEffect, useCallback } from 'react';
import React from 'react';

export default function Home() {
  const [editMode, setEditMode] = useState(false);
  const [positions, setPositions] = useState({
    start: { x: 933, y: 287 },
    goal: { x: 610, y: 23 },
    distance: { x: 1051, y: 76 },
  });
  const [animationProgress, setAnimationProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "400 Mbit Glasfaser",
      description: "Ultraschnelles FTTH Internet für Business-Calls und Meeting-Vorbereitung",
      icon: "🌐",
      color: "text-blue-600"
    },
    {
      title: "Dual-Monitor Setup",
      description: "Professioneller Arbeitsplatz für Präsentationen und längere Business-Aufenthalte",
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
      <section className="bg-gradient-to-br from-stone via-primary-800 to-shadow text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-mist/10 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Ihr perfektes
              <span className="block text-mist">Tech-Apartment</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Premium Business-Unterkunft in Bad Friedrichshall - perfekt für Geschäftsreisende mit Terminen bei Schwarz IT und Lidl.
              FTTH Glasfaser, Dual-Monitor Setup und absolute Ruhe für produktives Arbeiten.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <Link
                href="/apartment"
                className="bg-white text-stone px-8 py-4 rounded-lg font-semibold hover:bg-mist hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Apartment ansehen
              </Link>
              <BookingButton size="lg" animate>
                Jetzt buchen - ab 89€
              </BookingButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="py-16 bg-gradient-to-b from-white to-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Warum Geschäftsreisende unser Apartment wählen
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Speziell für Business-Aufenthalte entwickelt
            </p>
          </motion.div>

          {/* Compact Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-300"
                variants={{
                  initial: { 
                    opacity: 0, 
                    x: index % 2 === 0 ? -50 : 50,
                    y: 20
                  },
                  animate: { 
                    opacity: 1, 
                    x: 0, 
                    y: 0,
                    transition: {
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }
                  }
                }}
              >
                <div className="text-3xl flex-shrink-0 mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-base">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom highlight */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg">
              <span>💼</span>
              <span>Alles für produktive Geschäftsreisen bereit</span>
              <span>✨</span>
            </div>
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
          <div 
            ref={containerRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative"
          >

            {/* Edit Mode Controls - Nur sichtbar, wenn editMode = true */}
            {editMode && (
              <div className="absolute top-[-60px] left-0 z-50 w-full flex justify-between items-center p-2 bg-blue-900/80 backdrop-blur-sm rounded-lg">
                <div className="text-white font-bold text-lg">
                  ️✅ FULL EDIT MODE
                </div>
                <button
                  onClick={() => {
                    const code = `// Neue Positionen:\n// START: x:${positions.start.x}, y:${positions.start.y}\n// GOAL: x:${positions.goal.x}, y:${positions.goal.y}\n// DISTANCE: x:${positions.distance.x}, y:${positions.distance.y}`;
                    navigator.clipboard.writeText(code).then(() => alert('Positionen kopiert!\n' + code));
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
                >
                  📋 Export Positionen
                </button>
              </div>
            )}

            <motion.div
              variants={slideInLeft}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Strategisch perfekt gelegen
              </h2>
              <div className="space-y-6 text-secondary-600">
                <motion.div 
                  className="flex items-start"
                  variants={fadeInUp}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-6 h-6 mt-1 mr-3 text-accent-700">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-secondary-900">Business-Zentrale direkt um die Ecke</strong>
                    <p>Schwarz IT Campus (5 Min) • Lidl Hauptgebäude Bad Wimpfen (10 Min)</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-start"
                  variants={fadeInUp}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-6 h-6 mt-1 mr-3 text-accent-700">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-secondary-900">Wacholderweg 2, Bad Friedrichshall</strong>
                    <p>Ruhige Lage am Neckar - arbeiten ohne Stadtlärm</p>
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
                    <strong className="text-secondary-900">Work-Life-Balance perfekt</strong>
                    <p>Neckar-Radweg direkt vor der Tür für den Feierabend</p>
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
                  Standort-Details ansehen
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
              className="relative min-h-96"
              variants={slideInRight}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {/* Die RouteAnimation hat jetzt keine Labels mehr */}
              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.4 }}
              >
                <RouteAnimation 
                  className="mb-4" 
                  autoPlay={true}
                  onProgressChange={setAnimationProgress}
                />
              </motion.div>
              
              {/* Nur für Mobile: Eine einfache Text-basierte Anzeige der Routen-Infos */}
              <div className="lg:hidden -mt-8 space-y-2 text-sm text-center text-gray-700">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-semibold text-gray-800">START:</span>
                  <span>Wacholderweg 2</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="font-semibold text-gray-800">ZIEL:</span>
                  <span>Schwarz Digits Campus</span>
                </div>
                <div className="mt-2 text-xs text-gray-600 flex items-center justify-center gap-2">
                  <span className="font-bold text-gray-800">~3 km</span>
                  <span>•</span>
                  <span>🚗 4 Min</span>
                </div>
              </div>
            </motion.div>

            {/* HIER SIND DIE LABELS - jetzt nur noch auf Desktop sichtbar */}
            <div className="hidden lg:block">
              <DraggableLabel
                id="start"
                position={positions.start}
                setPosition={setPositions}
                editMode={editMode}
                containerRef={containerRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: animationProgress > 0.01 ? 1 : 0,
                  scale: animationProgress > 0.01 ? 1 : 0.8,
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div>
                    <div className="text-xs font-semibold text-gray-800">START</div>
                    <div className="text-xs text-gray-600">Wacholderweg 2</div>
                  </div>
                </div>
              </DraggableLabel>

              <DraggableLabel
                id="goal"
                position={positions.goal}
                setPosition={setPositions}
                editMode={editMode}
                containerRef={containerRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: animationProgress > 0.95 ? 1 : 0,
                  scale: animationProgress > 0.95 ? 1 : 0.8,
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div>
                    <div className="text-xs font-semibold text-gray-800">ZIEL</div>
                    <div className="text-xs text-gray-600">Schwarz Digits Campus</div>
                  </div>
                </div>
              </DraggableLabel>

              <DraggableLabel
                id="distance"
                position={positions.distance}
                setPosition={setPositions}
                editMode={editMode}
                containerRef={containerRef}
                className="px-4 py-3 rounded-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: animationProgress > 0.4 ? 1 : 0,
                  scale: animationProgress > 0.4 ? 1 : 0.8,
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-800">~3 km</div>
                  <div className="text-xs text-gray-600 flex items-center justify-center gap-2">
                    <span>🚗 4 Min</span>
                    <span>•</span>
                    <span>🚴 12 Min</span>
                  </div>
                </div>
              </DraggableLabel>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Floor Plan Section */}
      <FloorPlanSection />

      {/* Pricing Section */}
      <PricingSection />

    </div>
  );
}

// Eine neue, wiederverwendbare Komponente für die draggablen Labels
interface DraggableLabelProps {
  id: string;
  position: { x: number; y: number };
  setPosition: React.Dispatch<React.SetStateAction<any>>;
  editMode: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  className?: string;
}

function DraggableLabel({ 
  id, 
  position, 
  setPosition, 
  editMode, 
  containerRef, 
  children, 
  className = "px-3 py-2 rounded-lg",
  initial,
  animate,
  transition
}: DraggableLabelProps & { initial?: any; animate?: any; transition?: any; }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editMode) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition((prev: any) => ({
      ...prev,
      [id]: { x: Math.round(x), y: Math.round(y) }
    }));
  }, [isDragging, id, setPosition, containerRef]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <motion.div
      className={`absolute bg-white/95 backdrop-blur-sm shadow-lg border border-white/30 z-40 ${className} ${editMode ? 'cursor-move' : ''} ${isDragging ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: editMode ? 'auto' : 'none'
      }}
      onMouseDown={handleMouseDown}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
