
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LineData {
  name: string;
  incidents: number;
  risk: string;
  color: string;
}

const LineStatus = () => {
  const [trainLines, setTrainLines] = useState<LineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [riskCategories, setRiskCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/line_counts.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        
        const lineColors = {
          'Red Line': '#DC0A28', // CTA Red
          'Blue Line': '#0078AE', // CTA Blue
          'Brown Line': '#62361B', // CTA Brown
          'Green Line': '#009B3A', // CTA Green
          'Orange Line': '#F9461C', // CTA Orange
          'Purple': '#522398', // CTA Purple
          'Purple Line Express': '#522398', // CTA Purple
          'Yellow Line': '#FFC72C', // CTA Yellow
          'Pink Line': '#E27EA6', // CTA Pink
        };

        const parsedData: LineData[] = [];
        const uniqueRiskCategories = new Set<string>();
        
        // Skip header row
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue; // Skip empty rows
          
          const cells = rows[i].split(',');
          const lineName = cells[0];
          const incidents = parseInt(cells[1]);
          const risk = cells[2];
          
          // Skip if essential data is missing
          if (!lineName || isNaN(incidents)) continue;
          
          parsedData.push({
            name: lineName,
            incidents,
            risk,
            color: lineColors[lineName] || '#888888' // Default gray if color not found
          });

          // Add risk category to set of unique categories
          if (risk) {
            uniqueRiskCategories.add(risk);
          }
        }
        
        setTrainLines(parsedData);
        setRiskCategories(Array.from(uniqueRiskCategories));
      } catch (error) {
        console.error('Error fetching line counts data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get the correct badge variant based on risk level
  const getRiskBadgeVariant = (risk: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
      default:
        return 'default';
    }
  };

  // Get custom styling for badges based on risk
  const getRiskBadgeStyle = (risk: string): string => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return 'bg-red-600 hover:bg-red-600 text-white border-transparent';
      case 'medium':
        return 'bg-orange-500 hover:bg-orange-500 text-white border-transparent';
      case 'low':
      default:
        return 'bg-green-500 hover:bg-green-500 text-white border-transparent';
    }
  };

  // Map risk_flag values to status text
  const mapRiskToStatus = (risk: string) => {
    return risk ? risk.charAt(0).toUpperCase() + risk.slice(1).toLowerCase() : 'Low';
  };

  // Function to get color for legend dots
  const getRiskLegendColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
      default:
        return 'bg-green-500';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 bg-white rounded-t-lg border-b">
        <CardTitle className="text-xl text-transit-blue">Line Status</CardTitle>
        <CardDescription>Current safety status by transit line</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-transit-blue"></div>
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
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRiskBadgeStyle(line.risk)}`}>
                    {mapRiskToStatus(line.risk)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 pt-3 border-t flex justify-between text-xs text-gray-500">
          {riskCategories.length > 0 ? (
            riskCategories.map((risk) => (
              <div key={risk} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getRiskLegendColor(risk)} mr-1`}></div>
                <span>{mapRiskToStatus(risk)}</span>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-600 mr-1"></div>
                <span>High</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LineStatus;
