
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Sample incident data - in a real app this would come from an API
const sampleIncidents = [
  { id: 1, lat: 41.878, lng: -87.629, severity: 'high', type: 'Theft' },
  { id: 2, lat: 41.881, lng: -87.623, severity: 'medium', type: 'Battery' },
  { id: 3, lat: 41.885, lng: -87.632, severity: 'high', type: 'Robbery' },
  { id: 4, lat: 41.882, lng: -87.617, severity: 'low', type: 'Vandalism' },
  { id: 5, lat: 41.875, lng: -87.624, severity: 'medium', type: 'Assault' },
  { id: 6, lat: 41.888, lng: -87.636, severity: 'high', type: 'Theft' },
  { id: 7, lat: 41.879, lng: -87.642, severity: 'low', type: 'Trespassing' },
];

// Mapbox public token - in a real app, this should come from environment variables
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZXVzZXIiLCJhIjoiY2w3OGR4NnRkMDV0cDN3bWkxaWdqZDR5YiJ9.ktaI1uYVF9z4LNMnx4BN9g';

const SafetyMap = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set up the map when the component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    // Add fallback if map fails to load
    const initTimeout = setTimeout(() => {
      if (!mapLoaded) {
        console.log('Map failed to load within timeout period');
        setMapError(true);
        setIsLoading(false);
      }
    }, 3000);

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-87.623177, 41.881832], // Chicago coordinates
        zoom: 11
      });

      newMap.on('load', () => {
        setMapLoaded(true);
        setIsLoading(false);
        map.current = newMap;
        clearTimeout(initTimeout);
      });

      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError(true);
        setIsLoading(false);
        clearTimeout(initTimeout);
      });

      return () => {
        clearTimeout(initTimeout);
        newMap.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
      setIsLoading(false);
      clearTimeout(initTimeout);
      return () => {
        clearTimeout(initTimeout);
      };
    }
  }, []);

  // Add incident markers once the map is loaded
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Remove existing markers if any
    const existingMarkers = document.querySelectorAll('.incident-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add incident markers
    sampleIncidents.forEach(incident => {
      // Create a marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'incident-marker';
      
      let size;
      let color;

      switch (incident.severity) {
        case 'high':
          size = 'w-5 h-5';
          color = 'bg-transit-red';
          break;
        case 'medium':
          size = 'w-4 h-4';
          color = 'bg-transit-amber';
          break;
        case 'low':
          size = 'w-3 h-3';
          color = 'bg-transit-green';
          break;
      }

      // Create the pulse effect with tailwind classes
      markerEl.innerHTML = `
        <div class="relative">
          <div class="${size} ${color} rounded-full animate-pulse"></div>
          <div class="absolute -inset-2 ${color} bg-opacity-25 rounded-full"></div>
        </div>
      `;
      
      // Create a popup for the marker
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <strong>${incident.type}</strong><br>
          Severity: ${incident.severity}
        `);
        
      // Add the marker to the map
      new mapboxgl.Marker(markerEl)
        .setLngLat([incident.lng, incident.lat])
        .setPopup(popup)
        .addTo(map.current);
    });
    
  }, [mapLoaded, timeRange]);

  // Map fallback content
  const renderMapFallback = () => (
    <div className="flex flex-col items-center justify-center h-full py-16 text-gray-500">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
      <p className="text-lg font-medium mb-2">Map unavailable</p>
      <p className="text-sm text-center max-w-xs">
        Unable to load the map. This may be due to network issues or an invalid API key.
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
            <>
              {/* Mapbox container */}
              <div ref={mapContainer} className="absolute inset-0" />
            </>
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
