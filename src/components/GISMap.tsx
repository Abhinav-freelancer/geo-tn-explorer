import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { tamilNaduBoundary } from '../data/tamilNaduBoundary';

// Fix for default markers
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

function MapController({ selectedGeometry }: { selectedGeometry: any }) {
  const map = useMap();

  useEffect(() => {
    if (selectedGeometry) {
      const bounds = L.geoJSON(selectedGeometry).getBounds();
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [selectedGeometry, map]);

  return null;
}

const GISMap: React.FC<GISMapProps> = ({ selectedGeometry, onGeometrySelect }) => {
  const mapRef = useRef<L.Map | null>(null);

  const boundaryStyle = {
    color: '#2d7d32',
    weight: 3,
    opacity: 0.8,
    fillColor: '#4caf50',
    fillOpacity: 0.1
  };

  const selectedStyle = {
    color: '#ff9800',
    weight: 2,
    opacity: 0.9,
    fillColor: '#ffeb3b',
    fillOpacity: 0.3
  };

  useEffect(() => {
    // Simple click handler for basic interaction
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const clickedGeometry = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
          name: 'Clicked Location'
        }
      };
      onGeometrySelect(clickedGeometry);
    };

    if (mapRef.current) {
      mapRef.current.on('click', handleMapClick);
      
      return () => {
        if (mapRef.current) {
          mapRef.current.off('click', handleMapClick);
        }
      };
    }
  }, [onGeometrySelect]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[11.1271, 78.6569]} // Tamil Nadu center
        zoom={7}
        className="w-full h-full rounded-lg shadow-lg"
        ref={mapRef}
      >
        <>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <GeoJSON 
            data={tamilNaduBoundary as any} 
            style={boundaryStyle}
          />
          
          {selectedGeometry && (
            <GeoJSON 
              key="selected-geometry"
              data={selectedGeometry} 
              style={selectedStyle}
            />
          )}
          
          <MapController selectedGeometry={selectedGeometry} />
        </>
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md z-[1000]">
        <h4 className="font-semibold text-sm mb-2 text-foreground">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-primary/20 border border-primary"></div>
            <span className="text-muted-foreground">Tamil Nadu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-map-selected/30 border border-map-selected"></div>
            <span className="text-muted-foreground">Selected Area</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GISMap;