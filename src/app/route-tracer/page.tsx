'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

interface LineSegment {
  id: string;
  start: Point;
  end: Point;
  selected: boolean;
}

export default function RouteTracerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [lines, setLines] = useState<LineSegment[]>([]);
  const [draggedLine, setDraggedLine] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<'move' | 'rotate' | 'resize-start' | 'resize-end' | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [snapDistance] = useState(15); // Pixel-Distanz für magnetisches Docken
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setLines([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight
      });
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Finde nächsten Snap-Punkt
  const findSnapPoint = (point: Point, excludeLineId?: string): Point | null => {
    for (const line of lines) {
      if (line.id === excludeLineId) continue;
      
      const distToStart = Math.sqrt(
        Math.pow(point.x - line.start.x, 2) + Math.pow(point.y - line.start.y, 2)
      );
      const distToEnd = Math.sqrt(
        Math.pow(point.x - line.end.x, 2) + Math.pow(point.y - line.end.y, 2)
      );
      
      if (distToStart < snapDistance) return line.start;
      if (distToEnd < snapDistance) return line.end;
    }
    return null;
  };

  // Füge neue Linie hinzu
  const addNewLine = () => {
    const newLine: LineSegment = {
      id: Date.now().toString(),
      start: { x: imageSize.width * 0.2, y: imageSize.height * 0.5 },
      end: { x: imageSize.width * 0.4, y: imageSize.height * 0.5 },
      selected: false
    };
    setLines(prev => [...prev, newLine]);
  };

  // Berechne Distanz zu Linie für Auswahl
  const distanceToLine = (point: Point, line: LineSegment): number => {
    const A = point.x - line.start.x;
    const B = point.y - line.start.y;
    const C = line.end.x - line.start.x;
    const D = line.end.y - line.start.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;
    if (param < 0) {
      xx = line.start.x;
      yy = line.start.y;
    } else if (param > 1) {
      xx = line.end.x;
      yy = line.end.y;
    } else {
      xx = line.start.x + param * C;
      yy = line.start.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Erkenne was geklickt wurde
  const getClickTarget = (point: Point, line: LineSegment) => {
    const startDist = Math.sqrt(
      Math.pow(point.x - line.start.x, 2) + Math.pow(point.y - line.start.y, 2)
    );
    const endDist = Math.sqrt(
      Math.pow(point.x - line.end.x, 2) + Math.pow(point.y - line.end.y, 2)
    );

    if (startDist < 10) return 'resize-start';
    if (endDist < 10) return 'resize-end';
    
    // Rotation Handle (Mitte der Linie, etwas versetzt)
    const midX = (line.start.x + line.end.x) / 2;
    const midY = (line.start.y + line.end.y) / 2;
    const rotateHandleDist = Math.sqrt(
      Math.pow(point.x - midX, 2) + Math.pow(point.y - (midY - 15), 2)
    );
    if (rotateHandleDist < 8) return 'rotate';
    
    if (distanceToLine(point, line) < 8) return 'move';
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const mousePos = getMousePos(e);
    
    // Finde geklickte Linie
    for (const line of lines) {
      const target = getClickTarget(mousePos, line);
      if (target) {
        setDraggedLine(line.id);
        setDragMode(target as any);
        setLines(prev => prev.map(l => ({
          ...l,
          selected: l.id === line.id
        })));
        return;
      }
    }
    
    // Deselektiere alle
    setLines(prev => prev.map(l => ({ ...l, selected: false })));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedLine || !dragMode) return;
    
    const mousePos = getMousePos(e);
    
    setLines(prev => prev.map(line => {
      if (line.id !== draggedLine) return line;
      
      switch (dragMode) {
        case 'move': {
          const deltaX = mousePos.x - (line.start.x + line.end.x) / 2;
          const deltaY = mousePos.y - (line.start.y + line.end.y) / 2;
          return {
            ...line,
            start: { x: line.start.x + deltaX, y: line.start.y + deltaY },
            end: { x: line.end.x + deltaX, y: line.end.y + deltaY }
          };
        }
        
        case 'resize-start': {
          const snapPoint = findSnapPoint(mousePos, line.id);
          return {
            ...line,
            start: snapPoint || mousePos
          };
        }
        
        case 'resize-end': {
          const snapPoint = findSnapPoint(mousePos, line.id);
          return {
            ...line,
            end: snapPoint || mousePos
          };
        }
        
        case 'rotate': {
          const centerX = (line.start.x + line.end.x) / 2;
          const centerY = (line.start.y + line.end.y) / 2;
          const length = Math.sqrt(
            Math.pow(line.end.x - line.start.x, 2) + Math.pow(line.end.y - line.start.y, 2)
          );
          
          const angle = Math.atan2(mousePos.y - centerY, mousePos.x - centerX);
          const halfLength = length / 2;
          
          return {
            ...line,
            start: {
              x: centerX - Math.cos(angle) * halfLength,
              y: centerY - Math.sin(angle) * halfLength
            },
            end: {
              x: centerX + Math.cos(angle) * halfLength,
              y: centerY + Math.sin(angle) * halfLength
            }
          };
        }
        
        default:
          return line;
      }
    }));
  };

  const handleMouseUp = () => {
    setDraggedLine(null);
    setDragMode(null);
  };

  // Zeichne Linien auf Canvas
  const drawLines = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    lines.forEach(line => {
      // Haupt-Linie
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.strokeStyle = line.selected ? '#EF4444' : '#3B82F6';
      ctx.lineWidth = line.selected ? 4 : 3;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      if (line.selected) {
        // Start-Punkt Handle
        ctx.beginPath();
        ctx.arc(line.start.x, line.start.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#22C55E';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // End-Punkt Handle
        ctx.beginPath();
        ctx.arc(line.end.x, line.end.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#EF4444';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Rotation Handle
        const midX = (line.start.x + line.end.x) / 2;
        const midY = (line.start.y + line.end.y) / 2;
        ctx.beginPath();
        ctx.arc(midX, midY - 15, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#8B5CF6';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Verbindungslinie zum Rotation Handle
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(midX, midY - 15);
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  };

  const deleteLine = () => {
    setLines(prev => prev.filter(line => !line.selected));
  };

  const generateSVGPath = () => {
    if (lines.length === 0) return '';
    
    // Sortiere Linien in Reihenfolge (connected)
    const sortedLines = [...lines];
    let path = '';
    
    if (sortedLines.length > 0) {
      // Normalisiere erste Linie
      const firstLine = sortedLines[0];
      const normalizedStart = {
        x: (firstLine.start.x / imageSize.width) * 550,
        y: (firstLine.start.y / imageSize.height) * 300
      };
      const normalizedEnd = {
        x: (firstLine.end.x / imageSize.width) * 550,
        y: (firstLine.end.y / imageSize.height) * 300
      };
      
      path = `M${normalizedStart.x},${normalizedStart.y} L${normalizedEnd.x},${normalizedEnd.y}`;
      
      // Füge weitere Linien hinzu
      for (let i = 1; i < sortedLines.length; i++) {
        const line = sortedLines[i];
        const normStart = {
          x: (line.start.x / imageSize.width) * 550,
          y: (line.start.y / imageSize.height) * 300
        };
        const normEnd = {
          x: (line.end.x / imageSize.width) * 550,
          y: (line.end.y / imageSize.height) * 300
        };
        path += ` L${normStart.x},${normStart.y} L${normEnd.x},${normEnd.y}`;
      }
    }
    
    return path;
  };

  const exportRoute = () => {
    const svgPath = generateSVGPath();
    console.log('Route Data:', { svgPath, lines, imageSize });
    
    navigator.clipboard.writeText(svgPath).then(() => {
      alert('SVG Path wurde in die Zwischenablage kopiert!\n\n' + svgPath);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && imageSize.width && imageSize.height) {
      canvas.width = imageSize.width;
      canvas.height = imageSize.height;
      drawLines();
    }
  }, [imageSize, lines]);

  useEffect(() => {
    drawLines();
  }, [lines]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🗺️ Präziser Route Editor
          </h1>
          <p className="text-gray-600">
            Erstellen Sie präzise Routen mit Drag & Drop Linien-Elementen
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              📁 Bild hochladen
            </button>
          </div>
        </div>

        {/* Tools */}
        {image && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={addNewLine}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                ➕ Neue Linie
              </button>
              <button
                onClick={deleteLine}
                disabled={!lines.some(l => l.selected)}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                🗑️ Löschen
              </button>
              <button
                onClick={exportRoute}
                disabled={lines.length === 0}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                📋 Route exportieren
              </button>
            </div>
          </div>
        )}

        {/* Drawing Area */}
        {image && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="relative inline-block border-2 border-gray-200 rounded-lg overflow-hidden">
              <img
                ref={imageRef}
                src={image}
                alt="Route Bild"
                className="max-w-full h-auto"
                onLoad={handleImageLoad}
                style={{ maxHeight: '600px' }}
              />
              
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 cursor-pointer"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Bedienung:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li><span className="font-medium">Neue Linie:</span> Klicken Sie "Neue Linie" um ein Linienelement hinzuzufügen</li>
                <li><span className="font-medium">Bewegen:</span> Klicken & ziehen Sie die Linie</li>
                <li><span className="font-medium">Größe ändern:</span> Ziehen Sie die 🟢 (Start) oder 🔴 (End) Punkte</li>
                <li><span className="font-medium">Drehen:</span> Ziehen Sie den 🟣 Rotation-Handle</li>
                <li><span className="font-medium">Magnetisches Docken:</span> Linienenden docken automatisch aneinander</li>
                <li><span className="font-medium">Löschen:</span> Wählen Sie eine Linie aus und klicken "Löschen"</li>
              </ul>
            </div>
          </div>
        )}

        {/* Route Info */}
        {lines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mt-6"
          >
            <h3 className="text-lg font-semibold mb-3">Route Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Linien-Segmente:</strong> {lines.length}
              </div>
              <div>
                <strong>Bildgröße:</strong> {imageSize.width} x {imageSize.height}px
              </div>
              <div>
                <strong>Status:</strong> 
                <span className="text-green-600"> Bereit zum Export</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 