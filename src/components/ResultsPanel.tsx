import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Droplets, 
  Layers, 
  CheckCircle, 
  XCircle, 
  BarChart3, 
  MapPin 
} from 'lucide-react';

interface ResultsData {
  isValid: boolean;
  location?: string;
  soilData?: {
    type: string;
    ph: number;
    nutrients: string;
    fertility: string;
  };
  rainfallData?: {
    annual: number;
    seasonal: string;
    reliability: string;
  };
  ndviData?: {
    current: number;
    trend: string;
    season: string;
  };
}

interface ResultsPanelProps {
  results: ResultsData | null;
  isLoading: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary animate-pulse" />
            Analyzing...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
            <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Select a location or draw a polygon to view agricultural data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validation Status */}
        <div className="flex items-center gap-2">
          {results.isValid ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <XCircle className="w-5 h-5 text-destructive" />
          )}
          <span className="font-medium">
            {results.isValid ? 'Location Valid' : 'Location Outside Tamil Nadu'}
          </span>
        </div>

        {results.location && (
          <div>
            <Badge variant="outline" className="mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              {results.location}
            </Badge>
          </div>
        )}

        {results.isValid && (
          <>
            <Separator />

            {/* Soil Data */}
            {results.soilData && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold">Soil Information</h4>
                </div>
                <div className="bg-muted/30 p-3 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="text-sm font-medium">{results.soilData.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">pH Level:</span>
                    <span className="text-sm font-medium">{results.soilData.ph}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fertility:</span>
                    <Badge variant={results.soilData.fertility === 'High' ? 'default' : 'secondary'}>
                      {results.soilData.fertility}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Rainfall Data */}
            {results.rainfallData && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold">Rainfall Data</h4>
                </div>
                <div className="bg-muted/30 p-3 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Annual:</span>
                    <span className="text-sm font-medium">{results.rainfallData.annual}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pattern:</span>
                    <span className="text-sm font-medium">{results.rainfallData.seasonal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reliability:</span>
                    <Badge variant="outline">{results.rainfallData.reliability}</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* NDVI Data */}
            {results.ndviData && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold">Vegetation Index (NDVI)</h4>
                </div>
                <div className="bg-gradient-to-r from-success/10 to-primary/10 p-3 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current NDVI:</span>
                    <span className="text-sm font-bold text-primary">{results.ndviData.current}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Trend:</span>
                    <Badge variant={results.ndviData.trend === 'Improving' ? 'default' : 'secondary'}>
                      {results.ndviData.trend}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Season:</span>
                    <span className="text-sm font-medium">{results.ndviData.season}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsPanel;