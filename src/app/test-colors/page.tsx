export default function TestColors() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">🎨 Farbpalette Test</h1>
        
        {/* Grundlegende Tailwind Farben zum Testen */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Basis Tailwind Farben (Test):</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-500 h-20 rounded flex items-center justify-center text-white font-medium">
              Blue-500
            </div>
            <div className="bg-red-500 h-20 rounded flex items-center justify-center text-white font-medium">
              Red-500
            </div>
            <div className="bg-green-500 h-20 rounded flex items-center justify-center text-white font-medium">
              Green-500
            </div>
            <div className="bg-yellow-500 h-20 rounded flex items-center justify-center text-white font-medium">
              Yellow-500
            </div>
          </div>
        </div>

        {/* Unsere benutzerdefinierten Farben */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Unsere Custom Farben:</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary-300 h-20 rounded flex items-center justify-center text-white font-medium">
              Primary-300
            </div>
            <div className="bg-primary-900 h-20 rounded flex items-center justify-center text-white font-medium">
              Primary-900
            </div>
            <div className="bg-secondary-900 h-20 rounded flex items-center justify-center text-white font-medium">
              Secondary-900
            </div>
            <div className="bg-accent-900 h-20 rounded flex items-center justify-center text-white font-medium">
              Accent-900
            </div>
          </div>
        </div>

        {/* Direkte Hex-Farben */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Direkte Hex-Farben:</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div 
              className="h-20 rounded flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: '#90AFC5' }}
            >
              Mist #90AFC5
            </div>
            <div 
              className="h-20 rounded flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: '#336B87' }}
            >
              Stone #336B87
            </div>
            <div 
              className="h-20 rounded flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: '#2A3132' }}
            >
              Shadow #2A3132
            </div>
            <div 
              className="h-20 rounded flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: '#763626' }}
            >
              Autumn #763626
            </div>
          </div>
        </div>

        {/* Button Tests */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Button Tests:</h2>
          <div className="space-x-4 space-y-2">
            <button 
              className="px-6 py-3 rounded-lg font-medium text-white"
              style={{ backgroundColor: '#336B87' }}
            >
              Stone Button (Inline Style)
            </button>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
              Standard Blue Button
            </button>
            <button className="bg-primary-900 text-white px-6 py-3 rounded-lg font-medium">
              Primary-900 Button
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">🔍 Diagnose:</h3>
          <ul className="space-y-2 text-sm">
            <li>✅ Wenn Sie die blauen/roten/grünen Basis-Farben sehen → Tailwind funktioniert grundsätzlich</li>
            <li>✅ Wenn Sie die Hex-Farben (Inline Styles) sehen → Browser funktioniert korrekt</li>
            <li>🎯 Wenn Primary-300/900 etc. NICHT die erwarteten Farben haben → Tailwind-Config Problem</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 