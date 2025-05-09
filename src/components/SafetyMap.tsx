
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SafetyMap = () => {
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Safety Incident Map</CardTitle>
          <CardDescription>Real-time incident locations</CardDescription>
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
          {/* Map placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-full h-full">
                <svg 
                  className="mx-auto mb-4" 
                  width="80" 
                  height="80" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" 
                    stroke="#0EA5E9" 
                    strokeWidth="2"
                  />
                  <circle cx="9" cy="10" r="1" fill="#EA384C" />
                  <circle cx="15" cy="8" r="1" fill="#EA384C" />
                  <circle cx="14" cy="14" r="1" fill="#EA384C" />
                  <circle cx="7" cy="14" r="1" fill="#EA384C" />
                  <circle cx="12" cy="12" r="1" fill="#EA384C" />
                </svg>
                <p className="text-gray-500">Interactive map with safety incident hotspots</p>
                <p className="text-gray-400 text-sm mt-2">Showing {timeRange === '24h' ? 'last 24 hours' : timeRange === '7d' ? 'last 7 days' : 'last 30 days'} data</p>
              </div>
            </div>
          </div>
          
          {/* Hotspot indicators */}
          <div className="absolute left-[30%] top-[40%] w-6 h-6 rounded-full bg-transit-red bg-opacity-25 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-transit-red animate-pulse-slow"></div>
          </div>
          
          <div className="absolute left-[60%] top-[25%] w-8 h-8 rounded-full bg-transit-red bg-opacity-25 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-transit-red animate-pulse-slow"></div>
          </div>
          
          <div className="absolute left-[45%] top-[70%] w-10 h-10 rounded-full bg-transit-red bg-opacity-25 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-transit-red animate-pulse-slow"></div>
          </div>
          
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
