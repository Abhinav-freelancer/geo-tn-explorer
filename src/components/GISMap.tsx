import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, FeatureGroup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
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
  const map = useMapEvents({
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
      const geoJsonLayer = L.geoJSON(tamilNaduBoundary as any);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [map]);

  return null;
}

// Component for drawing controls
function DrawingControls({ onGeometrySelect }: { onGeometrySelect: (geometry: any) => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;

    // Add drawing controls
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {},
        rectangle: {},
        circle: false,
        circlemarker: false,
        marker: {},
        polyline: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: false,
      },
    });

    map.addControl(drawControl);

    // Handle drawing events
    map.on(L.Draw.Event.CREATED, (event: any) => {
      const { layer } = event;
      const geometry = layer.toGeoJSON();
      
      drawnItems.addLayer(layer);
      
      const mockGeometry = {
        type: 'Feature',
        geometry: geometry.geometry,
        properties: {
          name: `Drawn Area (${geometry.geometry.type})`
        }
      };
      
      onGeometrySelect(mockGeometry);
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onGeometrySelect]);

  return null;
}

const GISMap: React.FC<GISMapProps> = ({ selectedGeometry, onGeometrySelect }) => {
  const boundaryStyle = {
    color: 'hsl(140 60% 35%)', // Using design system primary color
    weight: 2,
    opacity: 0.8,
    fillColor: 'hsl(140 60% 35%)',
    fillOpacity: 0.1
  };

  return (
    <div className="relative w-full h-full rounded-lg shadow-lg overflow-hidden">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        zoom={7}
        center={[11.1271, 78.6569]} // Tamil Nadu center
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        
        {/* Tamil Nadu Boundary */}
        {tamilNaduBoundary && (
          <GeoJSON 
            data={tamilNaduBoundary as any} 
            style={boundaryStyle}
          />
        )}
        
        {/* Map Event Handlers */}
        <MapEvents onGeometrySelect={onGeometrySelect} />
        
        {/* Fit map to boundary */}
        <FitBounds />
        
        {/* Drawing Controls */}
        <DrawingControls onGeometrySelect={onGeometrySelect} />
      </MapContainer>
      
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
              <span className="text-muted-foreground">Selected Area</span>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-4 h-2 bg-blue-500/30 border border-blue-500"></div>
            <span className="text-muted-foreground">Draw Tools (Top Right)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GISMap;