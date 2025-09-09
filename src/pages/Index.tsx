import React, { useState } from 'react';
import GISMap from '../components/GISMap';
import SearchPanel from '../components/SearchPanel';
import ResultsPanel from '../components/ResultsPanel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Satellite, Menu } from 'lucide-react';
import { generateMockSoilData, generateMockRainfallData, generateMockNDVIData } from '../data/tamilNaduBoundary';

const Index = () => {
  const [selectedGeometry, setSelectedGeometry] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLocationSearch = (location: any) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        isValid: true,
        location: location.name,
        soilData: generateMockSoilData(location),
        rainfallData: generateMockRainfallData(location),
        ndviData: generateMockNDVIData(location)
      };
      
      setResults(mockResults as any);
      setIsLoading(false);
      
      // Create a mock geometry point for the searched location
      const mockGeometry = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: location.coords
        },
        properties: {
          name: location.name
        }
      };
      setSelectedGeometry(mockGeometry as any);
    }, 1500);
  };

  const handleGeometrySelect = (geometry: any) => {
    setSelectedGeometry(geometry);
    setIsLoading(true);
    
    // Simulate validation and data fetching
    setTimeout(() => {
      const isValid = Math.random() > 0.2; // 80% chance of being valid
      
      if (isValid) {
        const mockResults = {
          isValid: true,
          location: 'Custom Area',
          soilData: generateMockSoilData(geometry),
          rainfallData: generateMockRainfallData(geometry),
          ndviData: generateMockNDVIData(geometry)
        };
        setResults(mockResults as any);
      } else {
        setResults({
          isValid: false,
          location: 'Outside Tamil Nadu'
        } as any);
      }
      
      setIsLoading(false);
    }, 2000);
  };

  const handleDrawModeToggle = () => {
    setIsDrawMode(!isDrawMode);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-earth rounded-lg flex items-center justify-center">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Tamil Nadu AgriGIS</h1>
                <p className="text-sm text-muted-foreground">Agricultural Analysis Platform</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4 flex gap-6 h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative top-0 left-0 z-40 lg:z-auto
          w-80 lg:w-96 h-full lg:h-auto
          bg-white/95 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none
          border-r lg:border-r-0 border-border/50
          transition-transform duration-300 ease-in-out
          lg:transition-none
          flex flex-col gap-6 p-4 lg:p-0
          pt-20 lg:pt-0
        `}>
          <SearchPanel
            onLocationSearch={handleLocationSearch}
            onDrawModeToggle={handleDrawModeToggle}
            isDrawMode={isDrawMode}
          />
          
          <Separator className="lg:hidden" />
          
          <ResultsPanel 
            results={results}
            isLoading={isLoading}
          />
        </div>


        {/* Map Container */}
        <div className="flex-1 h-full">
          <GISMap
            selectedGeometry={selectedGeometry}
            onGeometrySelect={handleGeometrySelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;