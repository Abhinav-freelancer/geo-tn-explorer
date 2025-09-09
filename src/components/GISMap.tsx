import React, { useState } from 'react';
import { tamilNaduBoundary } from '../data/tamilNaduBoundary';

interface GISMapProps {
  selectedGeometry: any;
  onGeometrySelect: (geometry: any) => void;
}

const GISMap: React.FC<GISMapProps> = ({ selectedGeometry, onGeometrySelect }) => {
  const [clickedPoint, setClickedPoint] = useState<{x: number, y: number} | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click coordinates to lat/lng (mock conversion)
    const lat = 11.1271 + (y / rect.height - 0.5) * 4; // Tamil Nadu latitude range
    const lng = 78.6569 + (x / rect.width - 0.5) * 8;  // Tamil Nadu longitude range
    
    setClickedPoint({x, y});
    
    const mockGeometry = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      properties: {
        name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
      }
    };
    onGeometrySelect(mockGeometry);
  };

  return (
    <div className="relative w-full h-full rounded-lg shadow-lg overflow-hidden">
      <div 
        className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 cursor-pointer relative flex items-center justify-center"
        onClick={handleMapClick}
      >
        {/* Tamil Nadu Map Outline */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Simplified Tamil Nadu outline */}
          <path
            d="M80,50 L150,45 L200,60 L250,80 L280,120 L270,160 L240,200 L180,220 L120,210 L90,180 L70,140 L80,100 Z"
            fill="rgba(76, 175, 80, 0.2)"
            stroke="rgba(76, 175, 80, 0.8)"
            strokeWidth="2"
          />
          
          {/* Selected point indicator */}
          {clickedPoint && (
            <circle
              cx={(clickedPoint.x / window.innerWidth) * 400}
              cy={(clickedPoint.y / window.innerHeight) * 300}
              r="6"
              fill="#ff9800"
              stroke="#fff"
              strokeWidth="2"
              className="animate-pulse"
            />
          )}
        </svg>
        
        <div className="text-center z-10">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Tamil Nadu AgriGIS</h2>
          <p className="text-lg text-green-700 mb-2">Interactive Agricultural Map</p>
          <p className="text-sm text-green-600">Click anywhere to analyze location</p>
          <p className="text-xs text-green-500 mt-2">Map loading - Click to select coordinates</p>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md z-[1000]">
        <h4 className="font-semibold text-sm mb-2 text-foreground">Map Controls</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-green-500/20 border border-green-500"></div>
            <span className="text-muted-foreground">Tamil Nadu</span>
          </div>
          {selectedGeometry && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-orange-500/30 border border-orange-500"></div>
              <span className="text-muted-foreground">Selected: {selectedGeometry.properties?.name}</span>
            </div>
          )}
          <div className="mt-2 text-muted-foreground">
            Click anywhere on the map to select a location
          </div>
        </div>
      </div>
    </div>
  );
};

export default GISMap;