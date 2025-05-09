
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ResponsiveContainer,
  AreaChart, 
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const PredictionChart = () => {
  const data = [
    { time: '6 AM', actual: 4, predicted: 5 },
    { time: '8 AM', actual: 12, predicted: 11 },
    { time: '10 AM', actual: 8, predicted: 9 },
    { time: '12 PM', actual: 10, predicted: 10 },
    { time: '2 PM', actual: 9, predicted: 11 },
    { time: '4 PM', actual: 15, predicted: 16 },
    { time: '6 PM', actual: 18, predicted: 17 },
    { time: '8 PM', actual: 12, predicted: 14 },
    { time: '10 PM', actual: 8, predicted: 9 },
    { time: '12 AM', actual: 5, predicted: 6 },
    { time: '2 AM', actual: null, predicted: 3 },
    { time: '4 AM', actual: null, predicted: 2 },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Predictive Analysis</CardTitle>
          <CardDescription>Actual vs. Predicted Safety Incidents</CardDescription>
        </div>
        <Select defaultValue="today">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }} 
                tickLine={false}
                axisLine={{ stroke: '#f0f0f0' }}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                domain={[0, 'dataMax + 2']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#0EA5E9" 
                fillOpacity={0.3} 
                fill="url(#colorActual)" 
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="Actual Incidents"
                isAnimationActive={true}
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8B5CF6" 
                fillOpacity={0.3}
                fill="url(#colorPredicted)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                activeDot={{ r: 6 }}
                name="Predicted Incidents"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-4 space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-transit-blue mr-2"></div>
            <span>Actual Incidents</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-transit-purple mr-2"></div>
            <span>Predicted Incidents</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionChart;
