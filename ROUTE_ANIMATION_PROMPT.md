# 🗺️ ROUTE ANIMATION KOMPONENTE - DETAILLIERTER IMPLEMENTIERUNGS-PROMPT

## 📍 PROJEKT KONTEXT
Erstelle eine React/TypeScript Komponente für eine DevStay Business-Unterkunft Website, die eine animierte Route von der Unterkunft zum Schwarz IT Campus zeigt.

## 🎯 TECHNISCHE ANFORDERUNGEN

### **Koordinaten & Route:**
- **START:** Wacholderweg 2, 74177 Bad Friedrichshall, Deutschland
  - GPS: ca. 49.2311° N, 9.2147° E
- **ZIEL:** Schwarz IT Campus, Bad Friedrichshall, Deutschland  
  - GPS: ca. 49.2280° N, 9.2050° E
- **Echte Routendaten** verwenden (Google Maps Directions API oder OpenRouteService)

### **Visuelle Anforderungen:**
- **Transparenter Hintergrund** - keine Karte sichtbar
- **Nur die Route** als leuchtende Linie auf transparentem Grund
- **Animierte Linie** die von A nach B "läuft"
- **Leucht-Effekt** - blau zu lila Gradient (wie #3B82F6 zu #8B5CF6)
- **Smooth Animation** - 3-4 Sekunden Dauer, dann Loop
- **Responsive Design** - funktioniert auf Desktop & Mobile

### **Animation Details:**
```css
/* Gewünschter Stil: */
- Linie Dicke: 4-6px
- Glow Effect: box-shadow mit blur
- Gradient: linear-gradient(90deg, #3B82F6, #8B5CF6)
- Animation: stroke-dasharray Technik für "drawing" effect
- Endlos-Loop nach 1 Sekunde Pause
```

### **React/TypeScript Setup:**
```typescript
// Komponenten-Interface:
interface RouteAnimationProps {
  className?: string;
  autoPlay?: boolean;
  showLabels?: boolean;
}

// Dependencies nutzen:
- framer-motion für Animationen
- Keine externe Karten-Library (nur SVG)
- TypeScript strict mode
```

## 🛠️ IMPLEMENTIERUNGS-ANSATZ

### **Option 1: SVG Path Animation (EMPFOHLEN)**
1. Route als SVG `<path>` definieren
2. `stroke-dasharray` für Animation
3. Framer Motion für smooth Controls
4. Responsive ViewBox

### **Option 2: Canvas Animation**
1. HTML5 Canvas für Performance
2. RequestAnimationFrame für smooth Animation
3. Responsive Canvas sizing

## 🎨 DESIGN SPEZIFIKATIONEN

### **Farben & Styling:**
```css
:root {
  --route-gradient: linear-gradient(45deg, #3B82F6, #8B5CF6);
  --glow-color: rgba(59, 130, 246, 0.5);
  --background: transparent;
}

.route-line {
  stroke-width: 5px;
  filter: drop-shadow(0 0 8px var(--glow-color));
  stroke-linecap: round;
}
```

### **Container Sizing:**
- **Desktop:** 400px x 250px
- **Mobile:** 100% width, 200px height
- **Border-radius:** 12px
- **Integriert in:** TailwindCSS Grid Layout

## 📱 RESPONSIVE VERHALTEN
```css
/* Mobile First: */
- Linie dünner auf kleinen Screens (3px)
- Labels optional ausblendbar
- Touch-friendly (falls interaktiv)
- Performance optimiert für schwächere Geräte
```

## 🔧 CODE STRUKTUR

### **Datei:** `src/components/RouteAnimation.tsx`
```typescript
'use client';
// Imports...

export default function RouteAnimation({
  className = '',
  autoPlay = true,
  showLabels = true
}: RouteAnimationProps) {
  // State Management
  // Animation Logic  
  // SVG Path Definition
  // Responsive Handling
  
  return (
    <div className={`route-animation-container ${className}`}>
      {/* SVG mit animierter Route */}
      {showLabels && (
        <div className="route-labels">
          {/* Start/End Labels */}
        </div>
      )}
    </div>
  );
}
```

## 🎭 ANIMATION TIMELINE
1. **0s:** Linie unsichtbar
2. **0-3s:** Linie "zeichnet" sich von Start zu Ziel
3. **3-4s:** Kurze Pause, komplette Linie leuchtend
4. **4s:** Fade out, restart

## 🚀 INTEGRATION DETAILS

### **Verwendung im Layout:**
```tsx
// Ersetzt diese Sektion in page.tsx:
<motion.div className="space-y-4 text-sm text-secondary-700">
  {/* Alte Business-Info hier raus */}
</motion.div>

// Neue Integration:
<RouteAnimation 
  className="mb-6" 
  showLabels={true}
  autoPlay={true} 
/>
```

## ✅ TESTING CHECKLISTE
- [ ] Animation läuft smooth auf allen Geräten
- [ ] Responsive Design funktioniert
- [ ] Transparenter Hintergrund korrekt
- [ ] Leucht-Effekt sichtbar
- [ ] Performance unter 16ms/frame
- [ ] TypeScript Errors = 0
- [ ] Accessibility (aria-labels)

## 🎨 FALLBACK OPTIONEN
Falls echte Route-Daten nicht verfügbar:
1. **Simple Linie:** Gerade Verbindung A→B
2. **Stylized Route:** Geschwungene SVG-Kurve  
3. **Dotted Animation:** Punkte statt Linie

## 💡 BONUS FEATURES (OPTIONAL)
- **Hover Effects:** Animation pausiert bei Mausover
- **Click Interaktion:** Öffnet Google Maps Route
- **Speed Controls:** Langsamere/schnellere Animation
- **Direction Indicators:** Kleine Pfeile auf der Linie

---

**🎯 ZIEL:** Eine professionelle, smooth animierte Route-Visualisierung die das Business-Positioning der Unterkunft verstärkt und Besucher beeindruckt!

**⏱️ DEADLINE:** Implementierung sollte production-ready sein mit clean code und optimaler Performance.

**📧 DELIVERABLE:** Komplette `RouteAnimation.tsx` Komponente + Integration Instructions 