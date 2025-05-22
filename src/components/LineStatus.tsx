
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

const LineStatus = () => {
  const trainLines = [
    { name: 'Red Line', status: 'caution', incidents: 5, color: '#DC0A28' }, // CTA Red
    { name: 'Blue Line', status: 'normal', incidents: 2, color: '#0078AE' }, // CTA Blue
    { name: 'Brown Line', status: 'normal', incidents: 1, color: '#62361B' }, // CTA Brown
    { name: 'Green Line', status: 'alert', incidents: 7, color: '#009B3A' }, // CTA Green
    { name: 'Orange Line', status: 'normal', incidents: 0, color: '#F9461C' }, // CTA Orange
    { name: 'Purple Line', status: 'normal', incidents: 1, color: '#522398' }, // CTA Purple
    { name: 'Pink Line', status: 'caution', incidents: 4, color: '#E27EA6' }, // CTA Pink
    { name: 'Yellow Line', status: 'normal', incidents: 0, color: '#FFC72C' }, // CTA Yellow
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'alert':
        return 'bg-transit-red text-white';
      case 'caution':
        return 'bg-transit-amber text-black';
      default:
        return 'bg-transit-green text-white';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 bg-white rounded-t-lg border-b">
        <CardTitle className="text-xl text-transit-blue">Line Status</CardTitle>
        <CardDescription>Current safety status by transit line</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {trainLines.map((line) => (
            <div key={line.name} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <div 
                  className="w-3 h-8 rounded-sm mr-3" 
                  style={{ backgroundColor: line.color }}
                ></div>
                <span className="font-medium">{line.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                {line.incidents > 0 && (
                  <div className="text-xs text-gray-500 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    <span>{line.incidents} incident{line.incidents !== 1 ? 's' : ''}</span>
                  </div>
                )}
                <Badge className={`${getStatusColor(line.status)}`}>
                  {line.status === 'normal' ? 'Normal' : 
                   line.status === 'caution' ? 'Caution' : 'Alert'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-transit-green mr-1"></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-transit-amber mr-1"></div>
            <span>Caution</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-transit-red mr-1"></div>
            <span>Alert</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineStatus;
