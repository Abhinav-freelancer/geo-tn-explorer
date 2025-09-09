import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { tamilNaduBoundary } from '../data/tamilNaduBoundary';

// Fix default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GISMapProps {
  selectedGeometry: any;
  onGeometrySelect: (geometry: any) => void;
}

// Component to handle map events
function MapEvents({ onGeometrySelect }: { onGeometrySelect: (geometry: any) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      
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
    },
  });

  return null;
}

// Component to fit map to Tamil Nadu boundary
function FitBounds() {
  const map = useMap();
  
  useEffect(() => {
    if (map && tamilNaduBoundary) {
      try {
        const geoJsonLayer = L.geoJSON(tamilNaduBoundary as any);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    }
  }, [map]);

  return null;
}

const GISMap: React.FC<GISMapProps> = ({ selectedGeometry, onGeometrySelect }) => {
  const boundaryStyle = {
    color: '#228B22', // Forest green
    weight: 2,
    opacity: 0.8,
    fillColor: '#228B22',
    fillOpacity: 0.1
  };

  return (
    <div className="relative w-full h-full rounded-lg shadow-lg overflow-hidden">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        zoom={7}
        center={[11.1271, 78.6569]}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        
        <GeoJSON 
          data={tamilNaduBoundary as any} 
          style={boundaryStyle}
        />
        
        <MapEvents onGeometrySelect={onGeometrySelect} />
        <FitBounds />
      </MapContainer>
      
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
              <span className="text-muted-foreground">Selected Location</span>
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