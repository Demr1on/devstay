'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

interface Virtual360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  room360Url: string;
  roomDescription?: string;
}

export default function Virtual360Modal({ 
  isOpen, 
  onClose, 
  roomName, 
  room360Url, 
  roomDescription 
}: Virtual360ModalProps) {
  
  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {roomName}
                </h2>
                {roomDescription && (
                  <p className="text-gray-600 mt-1">
                    {roomDescription}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Modal schließen"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            {/* 360 Viewer Content */}
            <div className="flex-1 p-4 md:p-6 h-full">
              <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-xl overflow-hidden relative">
                {/* Placeholder for 360 viewer - you can replace this with actual 360 viewer */}
                <iframe
                  src={room360Url}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  title={`360° Ansicht - ${roomName}`}
                />
                
                {/* Fallback if no URL provided */}
                {!room360Url && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏠</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        360° Ansicht - {roomName}
                      </h3>
                      <p className="text-gray-500">
                        360-Grad-Foto wird hier geladen...
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Controls/Info */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <span>💡 Tipp:</span>
                  <span>Ziehen Sie mit der Maus, um sich im Raum umzusehen</span>
                </div>
                <button
                  onClick={onClose}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Schließen
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 