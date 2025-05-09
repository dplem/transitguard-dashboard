
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TimeAnalysis = () => {
  const weekdayData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 58 },
    { day: 'Wed', value: 60 },
    { day: 'Thu', value: 70 },
    { day: 'Fri', value: 85 },
    { day: 'Sat', value: 90 },
    { day: 'Sun', value: 75 },
  ];
  
  const hourlyData = [
    { hour: '12am', value: 25 },
    { hour: '3am', value: 15 },
    { hour: '6am', value: 20 },
    { hour: '9am', value: 45 },
    { hour: '12pm', value: 50 },
    { hour: '3pm', value: 65 },
    { hour: '6pm', value: 90 },
    { hour: '9pm', value: 80 },
  ];
  
  const getBarColor = (value: number) => {
    if (value >= 80) return 'bg-transit-red';
    if (value >= 60) return 'bg-transit-amber';
    return 'bg-transit-green';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Time Analysis</CardTitle>
        <CardDescription>Incident patterns by time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekday">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="weekday">By Day</TabsTrigger>
            <TabsTrigger value="hourly">By Hour</TabsTrigger>
          </TabsList>
          <TabsContent value="weekday">
            <div className="space-y-2">
              {weekdayData.map((item) => (
                <div key={item.day} className="flex items-center">
                  <div className="w-10 text-sm text-gray-500">{item.day}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getBarColor(item.value)} transition-all duration-500`} 
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-sm text-right text-gray-500">{item.value}</div>
                </div>
              ))}
              <div className="pt-2 text-xs text-gray-500">
                Scale: Number of incidents per day
              </div>
            </div>
          </TabsContent>
          <TabsContent value="hourly">
            <div className="space-y-2">
              {hourlyData.map((item) => (
                <div key={item.hour} className="flex items-center">
                  <div className="w-10 text-sm text-gray-500">{item.hour}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getBarColor(item.value)} transition-all duration-500`} 
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-sm text-right text-gray-500">{item.value}</div>
                </div>
              ))}
              <div className="pt-2 text-xs text-gray-500">
                Scale: Relative risk level by hour
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-4 pt-3 border-t flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-transit-green mr-1"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-transit-amber mr-1"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-transit-red mr-1"></div>
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeAnalysis;
