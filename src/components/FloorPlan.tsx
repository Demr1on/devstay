'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Virtual360Modal from './Virtual360Modal';

interface Room {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  icon: string;
  color: string;
  room360Url?: string;
}

interface FloorPlanProps {
  className?: string;
}

// Sample room data - you can customize this based on your actual apartment layout
const rooms: Room[] = [
  {
    id: 'living',
    name: 'Wohnzimmer',
    description: 'Gemütlicher Wohnbereich mit Couch und TV',
    position: { x: 30, y: 40 },
    icon: '🛋️',
    color: 'text-blue-600',
    room360Url: '/360/living-room' // Replace with actual 360 URLs
  },
  {
    id: 'bedroom',
    name: 'Schlafzimmer',
    description: 'Ruhiges Schlafzimmer mit großem Bett',
    position: { x: 70, y: 25 },
    icon: '🛏️',
    color: 'text-purple-600'
  },
  {
    id: 'kitchen',
    name: 'Küche',
    description: 'Vollausgestattete Küche für Ihre Bedürfnisse',
    position: { x: 25, y: 70 },
    icon: '🍳',
    color: 'text-green-600'
  },
  {
    id: 'office',
    name: 'Arbeitsplatz',
    description: 'Dual-Monitor Setup für produktives Arbeiten',
    position: { x: 65, y: 55 },
    icon: '💻',
    color: 'text-orange-600'
  },
  {
    id: 'bathroom',
    name: 'Badezimmer',
    description: 'Modernes Bad mit Dusche',
    position: { x: 85, y: 70 },
    icon: '🚿',
    color: 'text-cyan-600'
  }
];

export default function FloorPlan({ className = '' }: FloorPlanProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  return (
    <>
      <div className={`relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
        {/* Floor Plan SVG */}
        <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-gray-50 to-gray-100">
          
          {/* SVG Floor Plan Background */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Apartment outline */}
            <rect 
              x="10" y="15" width="80" height="70" 
              fill="white" 
              stroke="#e5e7eb" 
              strokeWidth="0.5"
              rx="2"
            />
            
            {/* Room divisions */}
            {/* Living room */}
            <rect x="12" y="17" width="35" height="35" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.3" />
            
            {/* Bedroom */}
            <rect x="55" y="17" width="33" height="25" fill="#faf5ff" stroke="#e2e8f0" strokeWidth="0.3" />
            
            {/* Kitchen */}
            <rect x="12" y="60" width="25" height="23" fill="#f0fdf4" stroke="#e2e8f0" strokeWidth="0.3" />
            
            {/* Office */}
            <rect x="55" y="45" width="20" height="20" fill="#fff7ed" stroke="#e2e8f0" strokeWidth="0.3" />
            
            {/* Bathroom */}
            <rect x="78" y="60" width="10" height="23" fill="#ecfeff" stroke="#e2e8f0" strokeWidth="0.3" />
            
            {/* Hallway */}
            <rect x="40" y="60" width="35" height="12" fill="#f9fafb" stroke="#e2e8f0" strokeWidth="0.3" />
          </svg>

          {/* Room Hotspots */}
          {rooms.map((room, index) => (
            <motion.button
              key={room.id}
              className={`absolute flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                hoveredRoom === room.id ? 'scale-110 border-primary-400' : ''
              }`}
              style={{
                left: `${room.position.x}%`,
                top: `${room.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleRoomClick(room)}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl md:text-3xl">{room.icon}</span>
              
              {/* Pulse animation */}
              <div className="absolute inset-0 rounded-full border-2 border-primary-400 animate-ping opacity-75 group-hover:opacity-100" />
            </motion.button>
          ))}

          {/* Room Labels (on hover) */}
          {hoveredRoom && (
            <motion.div
              className="absolute pointer-events-none z-10"
              style={{
                left: `${rooms.find(r => r.id === hoveredRoom)?.position.x}%`,
                top: `${(rooms.find(r => r.id === hoveredRoom)?.position.y || 0) - 15}%`,
                transform: 'translate(-50%, -100%)'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                {rooms.find(r => r.id === hoveredRoom)?.name}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Legend */}
        <div className="p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center">
            {rooms.map((room) => (
              <motion.button
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{room.icon}</span>
                <span className="text-sm font-medium text-gray-700">{room.name}</span>
                <span className="text-xs text-gray-500">👁️</span>
              </motion.button>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              💡 Klicken Sie auf die Icons, um die 360°-Ansicht der Räume zu öffnen
            </p>
          </div>
        </div>
      </div>

      {/* 360 Modal */}
      {selectedRoom && (
        <Virtual360Modal
          isOpen={!!selectedRoom}
          onClose={handleCloseModal}
          roomName={selectedRoom.name}
          roomDescription={selectedRoom.description}
          room360Url={selectedRoom.room360Url || ''}
        />
      )}
    </>
  );
} 