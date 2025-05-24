import React, { useState, useEffect } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';

interface PredictionData {
  month: string;
  actual_crime_count: number | null;
  predicted_crime_count: number;
}

const PredictionChart = () => {
  const [data, setData] = useState<PredictionData[]>([]);
  const [timeRange, setTimeRange] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching prediction data from /data/sarima_results.csv...');
        const response = await fetch('/data/sarima_results.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const csvText = await response.text();
        console.log('CSV data received:', csvText.substring(0, 200) + '...');
        
        // Parse CSV data
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        
        const parsedData: PredictionData[] = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            month: formatMonth(values[0]), // Format the month
            actual_crime_count: values[1] !== '' ? Math.ceil(Number(values[1])) : null, // Round up
            predicted_crime_count: Math.ceil(Number(values[2])) // Round up
          };
        });
        
        console.log('Parsed prediction data:', parsedData);
        setData(parsedData);
        setError(null);
      } catch (err) {
        console.error('Error loading prediction data:', err);
        setError('Failed to load prediction data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on selected time range
  const filteredData = React.useMemo(() => {
    if (timeRange === "all") return data;
    
    const now = new Date();
    let monthsToShow = 0;
    
    switch (timeRange) {
      case "3m":
        monthsToShow = 3;
        break;
      case "6m":
        monthsToShow = 6;
        break;
      case "12m":
        monthsToShow = 12;
        break;
      default:
        return data;
    }
    
    return data.slice(-monthsToShow);
  }, [data, timeRange]);

  // Helper function to format month from YYYY-MM to MMM YYYY
  const formatMonth = (dateStr: string): string => {
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Predictive Analysis</CardTitle>
          <CardDescription>Loading crime data...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Predictive Analysis</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full flex items-center justify-center border border-dashed border-gray-300 rounded-md">
            <p className="text-gray-500">Unable to load crime prediction data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Predictive Analysis</CardTitle>
          <CardDescription>Actual vs. Predicted Crime Incidents</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Data</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="12m">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
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
                dataKey="month" 
                tick={{ fontSize: 10 }} 
                tickLine={false}
                axisLine={{ stroke: '#f0f0f0' }}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                domain={[0, 'dataMax + 50']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                formatter={(value) => [Number(value).toLocaleString(), null]}
              />
              <Area 
                type="monotone" 
                dataKey="actual_crime_count" 
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
                dataKey="predicted_crime_count" 
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
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Actual Crime Incidents</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <span>Predicted Crime Incidents</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionChart;
