'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface CardPosition {
  id: string;
  name: string;
  x: number;
  y: number;
  content: React.ReactNode;
}

export default function LabelPositionerPage() {
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [cardPositions, setCardPositions] = useState<CardPosition[]>([
    {
      id: 'start',
      name: 'START Label',
      x: 400, // bottom-2 right-2 entspricht ca.
      y: 200,
      content: (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <div>
            <div className="text-xs font-semibold text-gray-800">START</div>
            <div className="text-xs text-gray-600">Wacholderweg 2</div>
          </div>
        </div>
      )
    },
    {
      id: 'goal',
      name: 'ZIEL Label',
      x: 64, // top-4 left-16 entspricht ca.
      y: 16,
      content: (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div>
            <div className="text-xs font-semibold text-gray-800">ZIEL</div>
            <div className="text-xs text-gray-600">Schwarz Digits Campus</div>
          </div>
        </div>
      )
    },
    {
      id: 'distance',
      name: 'Entfernungs-Info',
      x: 400, // top-1/2 right-4 entspricht ca.
      y: 120,
      content: (
        <div className="text-center">
          <div className="text-sm font-bold text-gray-800">~3 km</div>
          <div className="text-xs text-gray-600 flex items-center gap-2">
            <span>🚗 4 Min</span>
            <span>•</span>
            <span>🚴 12 Min</span>
          </div>
        </div>
      )
    }
  ]);

  const getMousePos = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    
    const rect = container.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent, cardId: string) => {
    e.preventDefault();
    setDraggedCard(cardId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedCard) return;
    
    const mousePos = getMousePos(e);
    const container = containerRef.current;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    setCardPositions(prev => prev.map(card => {
      if (card.id !== draggedCard) return card;
      
      return {
        ...card,
        x: Math.max(20, Math.min(mousePos.x, containerRect.width - 20)), // Echte Container-Breite
        y: Math.max(20, Math.min(mousePos.y, containerRect.height - 20))  // Echte Container-Höhe
      };
    }));
  };

  const handleMouseUp = () => {
    setDraggedCard(null);
  };

  const exportPositions = () => {
    const positions = cardPositions.reduce((acc, card) => {
      // Konvertiere Pixel zu Tailwind-Klassen (approximiert)
      let className = 'absolute ';
      
      // Y-Position
      if (card.y < 20) className += 'top-2 ';
      else if (card.y < 40) className += 'top-4 ';
      else if (card.y < 80) className += 'top-8 ';
      else if (card.y > 200) className += 'bottom-2 ';
      else className += `top-1/2 transform -translate-y-1/2 `;
      
      // X-Position
      if (card.x < 20) className += 'left-2';
      else if (card.x < 80) className += 'left-16';
      else if (card.x > 400) className += 'right-2';
      else if (card.x > 350) className += 'right-4';
      else className += `left-1/2 transform -translate-x-1/2`;
      
      className += ' bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-md border border-white/30 z-10';
      
      acc[card.id] = {
        className,
        pixelPosition: { x: card.x, y: card.y }
      };
      return acc;
    }, {} as Record<string, any>);

    const exportCode = `
// Neue Positionen für RouteAnimation Labels:

// START Label:
className="${positions.start.className}"

// ZIEL Label:  
className="${positions.goal.className}"

// Entfernungs-Info:
className="${positions.distance.className}"

// Pixel-Koordinaten für Referenz:
// START: x:${positions.start.pixelPosition.x}, y:${positions.start.pixelPosition.y}
// ZIEL: x:${positions.goal.pixelPosition.x}, y:${positions.goal.pixelPosition.y}  
// DISTANCE: x:${positions.distance.pixelPosition.x}, y:${positions.distance.pixelPosition.y}
`;

    console.log('Export Data:', positions);
    
    navigator.clipboard.writeText(exportCode).then(() => {
      alert('Label-Positionen wurden in die Zwischenablage kopiert!\n\nIch kann diese direkt in die RouteAnimation einbauen.');
    });
  };

  const resetPositions = () => {
    setCardPositions(prev => prev.map(card => {
      switch(card.id) {
        case 'start': return { ...card, x: 400, y: 200 };
        case 'goal': return { ...card, x: 64, y: 16 };
        case 'distance': return { ...card, x: 400, y: 120 };
        default: return card;
      }
    }));
  };

  // Echte Route für Visualisierung (1:1 wie RouteAnimation)
  const routePath = "M360.03,274.83 L395.64,268.17 L395.86,266.76 L360.66,227.04 L359.71,226.54 L341.98,136 L247.61,107.05 L253.73,100.62 L253.52,100.72 L224.21,86.15 L214.62,57.25 L213.34,56.63 L142.18,23.62 L87.07,56.88 L68.40,38.25";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎯 Label Positioner Tool
          </h1>
          <p className="text-gray-600">
            Ziehen Sie die Labels mit der Maus an die gewünschte Position
          </p>
        </div>

        {/* Tools */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={resetPositions}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              🔄 Reset Positionen
            </button>
            <button
              onClick={exportPositions}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              📋 Positionen exportieren
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Label-Positionierung</h2>
          
          {/* EXAKT WIE AUF DER STARTSEITE - Container 1:1 identisch */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8">
            <div 
              ref={containerRef}
              className="relative w-full h-80 mb-4"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* SVG Container */}
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="-150 0 700 300"
                  className="absolute inset-0"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                  
                  {/* Glow Route Linie */}
                  <path
                    d={routePath}
                    stroke="url(#routeGrad)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.4"
                  />
                  
                  {/* Haupt Route Linie */}
                  <path
                    d={routePath}
                    stroke="url(#routeGrad)"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="1"
                  />
                  
                  {/* Start-Punkt */}
                  <circle cx="360" cy="275" r="8" fill="#22C55E" />
                  
                  {/* End-Punkt */}
                  <circle cx="68" cy="38" r="8" fill="#EF4444" />
                </svg>
              </div>

              {/* Draggable Labels */}
              {cardPositions.map((card) => (
                <div
                  key={card.id}
                  className={`absolute bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-md border border-white/30 z-10 cursor-move select-none ${
                    draggedCard === card.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{
                    left: card.x,
                    top: card.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, card.id)}
                >
                  {card.content}
                </div>
              ))}

              {/* Grid Hilfslinien */}
              <div className="absolute inset-0 pointer-events-none opacity-30">
                {[0, 25, 50, 75, 100].map(percent => (
                  <div key={`v-${percent}`} className="absolute bg-gray-400" style={{left: `${percent}%`, top: 0, width: '1px', height: '100%'}} />
                ))}
                {[0, 25, 50, 75, 100].map(percent => (
                  <div key={`h-${percent}`} className="absolute bg-gray-400" style={{top: `${percent}%`, left: 0, height: '1px', width: '100%'}} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Anleitung:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li><span className="font-medium">Ziehen & Platzieren:</span> Klicken Sie auf ein Label und ziehen es an die gewünschte Position</li>
              <li><span className="font-medium">Live-Preview:</span> Sehen Sie sofort, wie die Labels zur Route passen</li>
              <li><span className="font-medium">Export:</span> Klicken Sie "Positionen exportieren" um die CSS-Klassen zu erhalten</li>
              <li><span className="font-medium">Reset:</span> "Reset Positionen" setzt alle Labels auf Standard zurück</li>
            </ul>
          </div>
        </div>

        {/* Position Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Aktuelle Positionen</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {cardPositions.map(card => (
              <div key={card.id} className="p-3 bg-gray-50 rounded-lg">
                <strong>{card.name}:</strong>
                <br />
                <span className="text-gray-600">
                  x: {Math.round(card.x)}px, y: {Math.round(card.y)}px
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 