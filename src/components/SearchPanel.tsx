import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Pencil } from 'lucide-react';

interface SearchPanelProps {
  onLocationSearch: (location: any) => void;
  onDrawModeToggle: () => void;
  isDrawMode: boolean;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ 
  onLocationSearch, 
  onDrawModeToggle, 
  isDrawMode 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions] = useState([
    { name: 'Chennai', coords: [13.0827, 80.2707] },
    { name: 'Coimbatore', coords: [11.0168, 76.9558] },
    { name: 'Madurai', coords: [9.9252, 78.1198] },
    { name: 'Salem', coords: [11.6643, 78.1460] },
    { name: 'Tiruchirapalli', coords: [10.7905, 78.7047] },
  ]);

  const handleSearch = (location: any) => {
    onLocationSearch(location);
    setSearchQuery(location.name);
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Location Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Search locations in Tamil Nadu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>

        {searchQuery && filteredSuggestions.length > 0 && (
          <div className="bg-muted/50 rounded-md p-2 space-y-1">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearch(suggestion)}
                className="w-full text-left px-3 py-2 rounded-sm hover:bg-primary/10 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-primary" />
                {suggestion.name}
              </button>
            ))}
          </div>
        )}

        <div className="pt-2 border-t">
          <Button
            onClick={onDrawModeToggle}
            variant={isDrawMode ? "default" : "outline"}
            className="w-full"
          >
            <Pencil className="w-4 h-4 mr-2" />
            {isDrawMode ? 'Exit Draw Mode' : 'Draw Polygon'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchPanel;