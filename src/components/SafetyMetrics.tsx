
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Shield } from 'lucide-react';

const SafetyMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Safety Index</CardTitle>
            <CardDescription>Overall system status</CardDescription>
          </div>
          <Shield className="h-4 w-4 text-transit-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-transit-amber">76/100</div>
          <div className="flex items-center mt-1 space-x-1">
            <TrendingDown className="h-4 w-4 text-transit-green" />
            <span className="text-xs text-transit-green">4% improvement from last week</span>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full">
            <div className="h-full bg-transit-amber rounded-full" style={{ width: '76%' }}></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </div>
          <div className="h-4 w-4 rounded-full bg-transit-red"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">27</div>
          <div className="flex items-center mt-1 space-x-1">
            <TrendingUp className="h-4 w-4 text-transit-red" />
            <span className="text-xs text-transit-red">12% increase from yesterday</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1 text-xs">
            <div className="bg-gray-100 p-1 rounded text-center">
              <span className="block font-medium">14</span>
              <span className="text-gray-500">Theft</span>
            </div>
            <div className="bg-gray-100 p-1 rounded text-center">
              <span className="block font-medium">8</span>
              <span className="text-gray-500">Battery</span>
            </div>
            <div className="bg-gray-100 p-1 rounded text-center">
              <span className="block font-medium">5</span>
              <span className="text-gray-500">Other</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <CardDescription>Average dispatch</CardDescription>
          </div>
          <div className="h-4 w-4 rotate-45 border-2 border-transit-blue"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5.2 min</div>
          <div className="flex items-center mt-1 space-x-1">
            <TrendingDown className="h-4 w-4 text-transit-green" />
            <span className="text-xs text-transit-green">0.5 min faster than last month</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>CTA Train</span>
              <span>4.1 min</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>CTA Bus</span>
              <span>6.3 min</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyMetrics;
