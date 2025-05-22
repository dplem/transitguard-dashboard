
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const SafetyMap = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  
  // Load the HTML file in an iframe
  useEffect(() => {
    // Add a timeout to simulate loading and catch potential errors
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 3000);

    // Check if the iframe loaded successfully
    const handleIframeLoad = () => {
      setIsLoading(false);
      clearTimeout(loadingTimeout);
    };

    // Check if the iframe failed to load
    const handleIframeError = () => {
      setMapError(true);
      setIsLoading(false);
      clearTimeout(loadingTimeout);
      console.error("Error loading map HTML file");
    };

    const iframe = document.getElementById('crime-map-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.onload = handleIframeLoad;
      iframe.onerror = handleIframeError;
    }

    return () => {
      clearTimeout(loadingTimeout);
      if (iframe) {
        iframe.onload = null;
        iframe.onerror = null;
      }
    };
  }, [timeRange]);

  // Map fallback content
  const renderMapFallback = () => (
    <div className="flex flex-col items-center justify-center h-full py-16 text-gray-500">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
      <p className="text-lg font-medium mb-2">Map unavailable</p>
      <p className="text-sm text-center max-w-xs">
        Unable to load the map. This may be due to file access issues or browser restrictions.
      </p>
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm font-medium mb-2">Incident summary:</p>
        <ul className="text-sm space-y-1">
          <li>3 high-severity incidents</li>
          <li>2 medium-severity incidents</li>
          <li>2 low-severity incidents</li>
        </ul>
      </div>
    </div>
  );

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Safety Incident Map</CardTitle>
          <CardDescription>Real-time incident locations in Chicago</CardDescription>
        </div>
        <Select 
          defaultValue="24h"
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] bg-slate-100 relative overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-full w-full absolute" />
              <div className="z-10 text-gray-500">Loading map...</div>
            </div>
          ) : mapError ? (
            renderMapFallback()
          ) : (
            <iframe
              id="crime-map-iframe"
              src="/data/july_crime_map.html"
              className="absolute inset-0 w-full h-full border-0"
              title="Chicago Crime Map"
              sandbox="allow-same-origin allow-scripts"
            ></iframe>
          )}
          
          {/* Legend overlay - always show this */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/80 to-transparent h-16 flex items-end justify-center pb-2">
            <div className="flex space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-transit-red mr-1"></div>
                <span>High Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-transit-amber mr-1"></div>
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-transit-green mr-1"></div>
                <span>Low Risk</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyMap;
