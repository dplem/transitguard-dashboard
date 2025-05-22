
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock, Info } from 'lucide-react';

interface SafetyIndexData {
  Date: string;
  safety_index: number;
}

const SafetyMetrics = () => {
  const [safetyIndex, setSafetyIndex] = useState<number | null>(null);
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const targetDate = "2024-07-13"; // Format in the CSV file

  useEffect(() => {
    const fetchSafetyIndexData = async () => {
      try {
        const response = await fetch('/data/safety_index.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        
        // Find the right index for each column
        const dateIndex = headers.indexOf('Date');
        const safetyIndexIndex = headers.indexOf('safety_index');
        
        // Find the entry for our target date
        const parsedData = [];
        let currentIndex = null;
        
        for (let i = 1; i < rows.length; i++) {
          const cells = rows[i].split(',');
          const rowDate = cells[dateIndex];
          const safetyValue = parseFloat(cells[safetyIndexIndex]);
          
          // Skip any invalid data rows
          if (isNaN(safetyValue) || !rowDate) continue;
          
          parsedData.push({
            date: rowDate,
            value: safetyValue
          });
          
          if (rowDate === targetDate) {
            currentIndex = safetyValue;
            setSafetyIndex(safetyValue);
          }
        }
        
        // Calculate the 7-day average before the target date
        if (currentIndex !== null) {
          // Find the index of our target date in the parsed data
          const targetIndex = parsedData.findIndex(item => item.date === targetDate);
          
          if (targetIndex >= 0) {
            // Calculate average of 7 days before (if available)
            let sum = 0;
            let count = 0;
            
            // Get up to 7 days before the target date
            for (let i = 1; i <= 7; i++) {
              if (targetIndex - i >= 0) {
                sum += parsedData[targetIndex - i].value;
                count++;
              }
            }
            
            if (count > 0) {
              const weekAverage = sum / count;
              const change = ((currentIndex - weekAverage) / weekAverage) * 100;
              setPercentChange(Number(change.toFixed(1)));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching safety index data:', error);
      }
    };

    fetchSafetyIndexData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-md overflow-hidden border-t-4 border-t-transit-blue">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Safety Index</CardTitle>
            <CardDescription>Overall system status</CardDescription>
          </div>
          <Shield className="h-5 w-5 text-transit-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-transit-amber">
            {safetyIndex !== null ? `${safetyIndex}/100` : "Loading..."}
          </div>
          {percentChange !== null && (
            <div className="flex items-center mt-1">
              <span className={`text-xs ${percentChange <= 0 ? "text-transit-green" : "text-transit-red"}`}>
                {`${Math.abs(percentChange)}% ${percentChange <= 0 ? "improvement" : "decrease"} from previous 7-day average`}
              </span>
            </div>
          )}
          <div className="mt-3 h-2 bg-gray-100 rounded-full">
            <div 
              className="h-full bg-transit-amber rounded-full transition-all duration-500" 
              style={{ width: safetyIndex !== null ? `${safetyIndex}%` : '0%' }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md overflow-hidden border-t-4 border-t-transit-red">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </div>
          <Info className="h-5 w-5 text-transit-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">27</div>
          <div className="flex items-center mt-1 space-x-1">
            <span className="text-xs text-transit-red">12% increase from yesterday</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1 text-xs">
            <div className="bg-gray-100 p-2 rounded text-center">
              <span className="block font-medium">14</span>
              <span className="text-gray-500">Theft</span>
            </div>
            <div className="bg-gray-100 p-2 rounded text-center">
              <span className="block font-medium">8</span>
              <span className="text-gray-500">Battery</span>
            </div>
            <div className="bg-gray-100 p-2 rounded text-center">
              <span className="block font-medium">5</span>
              <span className="text-gray-500">Other</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md overflow-hidden border-t-4 border-t-transit-green">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <CardDescription>Average dispatch</CardDescription>
          </div>
          <Clock className="h-5 w-5 text-transit-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5.2 min</div>
          <div className="flex items-center mt-1">
            <span className="text-xs text-transit-green">0.5 min faster than last month</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between items-center text-xs p-1 rounded hover:bg-gray-50">
              <span>CTA Train</span>
              <span className="font-medium">4.1 min</span>
            </div>
            <div className="flex justify-between items-center text-xs p-1 rounded hover:bg-gray-50">
              <span>CTA Bus</span>
              <span className="font-medium">6.3 min</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyMetrics;
