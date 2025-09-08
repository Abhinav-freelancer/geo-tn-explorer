import React from 'react';

interface GISMapProps {
  selectedGeometry: any;
  onGeometrySelect: (geometry: any) => void;
}

const GISMap: React.FC<GISMapProps> = ({ selectedGeometry, onGeometrySelect }) => {
  const handleClick = () => {
    const mockGeometry = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [78.6569, 11.1271]
      },
      properties: {
        name: 'Test Location'
      }
    };
    onGeometrySelect(mockGeometry);
  };

  return (
    <div className="relative w-full h-full">
      <div 
        className="w-full h-full rounded-lg shadow-lg bg-gradient-earth flex items-center justify-center cursor-pointer"
        onClick={handleClick}
      >
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Tamil Nadu AgriGIS</h2>
          <p className="text-lg opacity-90">Interactive Map Preview</p>
          <p className="text-sm mt-4 opacity-75">Click to test location selection</p>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md z-[1000]">
        <h4 className="font-semibold text-sm mb-2 text-foreground">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-primary/20 border border-primary"></div>
            <span className="text-muted-foreground">Tamil Nadu</span>
          </div>
          {selectedGeometry && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-map-selected/30 border border-map-selected"></div>
              <span className="text-muted-foreground">Location Selected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GISMap;