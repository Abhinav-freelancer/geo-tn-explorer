import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, useMapEvents } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
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

const GISMap: React.FC<GISMapProps> = ({ selectedGeometry, onGeometrySelect }) => {
  const [selectedLocation, setSelectedLocation] = useState<L.LatLng | null>(null);
  const [polygonCoords, setPolygonCoords] = useState<any>(null);

  // Click handler component
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setSelectedLocation(e.latlng);
        
        const mockGeometry = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
          },
          properties: {
            name: `Location (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`
          }
        };
        
        onGeometrySelect(mockGeometry);
      },
    });
    return selectedLocation ? <Marker position={selectedLocation} /> : null;
  }

  // Polygon creation handler
  const onCreated = (e: any) => {
    if (e.layerType === "polygon" || e.layerType === "rectangle") {
      const coords = e.layer.getLatLngs();
      setPolygonCoords(coords);
      
      const mockGeometry = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: coords
        },
        properties: {
          name: `${e.layerType} Area`,
          type: e.layerType
        }
      };
      
      onGeometrySelect(mockGeometry);
    }
  };

  const boundaryStyle = {
    color: '#228B22',
    weight: 2,
    opacity: 0.8,
    fillColor: '#228B22',
    fillOpacity: 0.1
  };

  return (
    <div className="relative w-full h-full rounded-lg shadow-lg overflow-hidden">
      <MapContainer
        style={{ height: "100%", width: "100%", minHeight: "400px" }}
        zoom={7}
        center={[11.1271, 78.6569]}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        
        <GeoJSON 
          data={tamilNaduBoundary as any} 
          style={boundaryStyle}
        />
        
        <LocationMarker />
        
        <EditControl
          position="topright"
          onCreated={onCreated}
          draw={{
            rectangle: true,
            polygon: true,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
          }}
        />
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
              <span className="text-muted-foreground">Selected: {selectedGeometry.properties?.name}</span>
            </div>
          )}
          <div className="mt-2 text-muted-foreground">
            Click anywhere on the map to select a location or use drawing tools to create polygons
          </div>
        </div>
      </div>
    </div>
  );
};

export default GISMap;