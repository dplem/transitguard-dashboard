
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

const LineStatus = () => {
  const trainLines = [
    { name: 'Red Line', status: 'caution', incidents: 5, color: '#ea384c' },
    { name: 'Blue Line', status: 'normal', incidents: 2, color: '#0EA5E9' },
    { name: 'Brown Line', status: 'normal', incidents: 1, color: '#92400E' },
    { name: 'Green Line', status: 'alert', incidents: 7, color: '#10B981' },
    { name: 'Orange Line', status: 'normal', incidents: 0, color: '#F97316' },
    { name: 'Purple Line', status: 'normal', incidents: 1, color: '#8B5CF6' },
    { name: 'Pink Line', status: 'caution', incidents: 4, color: '#EC4899' },
    { name: 'Yellow Line', status: 'normal', incidents: 0, color: '#FDE68A' },
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Line Status</CardTitle>
        <CardDescription>Current safety status by transit line</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trainLines.map((line) => (
            <div key={line.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-8 rounded-sm mr-3" 
                  style={{ backgroundColor: line.color }}
                ></div>
                <span>{line.name}</span>
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
