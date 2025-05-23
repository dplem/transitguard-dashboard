
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LineData {
  name: string;
  incidents: number;
  color: string;
  riskFlag: string;
}

const LineStatus = () => {
  const [trainLines, setTrainLines] = useState<LineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/line_counts_last_7_days.csv');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const csvText = await response.text();
        console.log('Fetched CSV data:', csvText);
        
        // Parse CSV
        const rows = csvText.split('\n');
        
        const lineColors = {
          'Red Line': '#DC0A28',
          'Blue Line': '#0078AE', 
          'Brown Line': '#62361B',
          'Green Line': '#009B3A',
          'Orange Line': '#F9461C',
          'Purple Line': '#522398',
          'Purple Line Express': '#522398',
          'Yellow Line': '#FFC72C',
          'Pink Line': '#E27EA6',
        };

        const parsedData: LineData[] = [];
        
        // Skip header row
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const cells = rows[i].split(',');
          const lineName = cells[0];
          const incidents = parseInt(cells[1]);
          const riskFlag = cells[2];
          
          if (!lineName || isNaN(incidents)) continue;
          
          parsedData.push({
            name: lineName,
            incidents,
            color: lineColors[lineName] || '#888888',
            riskFlag: riskFlag || 'Low'
          });
        }
        
        setTrainLines(parsedData);
        setHasError(false);
      } catch (error) {
        console.error('Error fetching line counts data:', error);
        setHasError(true);
        
        // Show mock data for development when an error occurs
        const mockData: LineData[] = [
          { name: 'Red Line', incidents: 31, color: '#DC0A28', riskFlag: 'Medium' },
          { name: 'Blue Line', incidents: 11, color: '#0078AE', riskFlag: 'Medium' },
          { name: 'Green Line', incidents: 9, color: '#009B3A', riskFlag: 'Low' },
          { name: 'Brown Line', incidents: 7, color: '#62361B', riskFlag: 'Low' },
          { name: 'Purple Line', incidents: 1, color: '#522398', riskFlag: 'Low' },
          { name: 'Orange Line', incidents: 9, color: '#F9461C', riskFlag: 'Low' },
          { name: 'Pink Line', incidents: 4, color: '#E27EA6', riskFlag: 'Low' },
        ];
        setTrainLines(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get custom styling for badges based on risk flag
  const getRiskBadgeStyle = (riskFlag: string): string => {
    switch (riskFlag.toLowerCase()) {
      case 'high':
        return 'bg-red-600 text-white border-transparent';
      case 'medium':
        return 'bg-orange-500 text-white border-transparent';
      case 'low':
      default:
        return 'bg-green-500 text-white border-transparent';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 bg-white rounded-t-lg border-b">
        <CardTitle className="text-xl text-transit-blue">Line Status</CardTitle>
        <CardDescription>Current safety status by transit line (Last 7 Days)</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-2">
                <div className="flex items-center">
                  <Skeleton className="w-3 h-8 rounded-sm mr-3" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
            <p>Could not load line status data</p>
            <p className="text-sm mt-1">Showing fallback data</p>
          </div>
        ) : (
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
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRiskBadgeStyle(line.riskFlag)}`}>
                    {line.riskFlag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 pt-3 border-t flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Low Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-1"></div>
            <span>High Risk</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineStatus;
