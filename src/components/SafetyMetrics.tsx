
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Info, Car, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface SafetyIndexData {
  Date: string;
  safety_index: number;
}

interface CrimeData {
  date: string;
  primary_type: string;
  count: number;
}

interface TrafficCrashData {
  DATE: string;
  TOTAL_CRASHES: number;
  TOTAL_FATALITIES: number;
  TOTAL_INCAPACITATING_INJURIES: number;
  TOTAL_NON_INCAPACITATING_INJURIES: number;
}

const SafetyMetrics = () => {
  const [safetyIndex, setSafetyIndex] = useState<number | null>(null);
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const [crimeData, setCrimeData] = useState<CrimeData[]>([]);
  const [totalCrimes, setTotalCrimes] = useState<number>(0);
  const [crimeBreakdown, setCrimeBreakdown] = useState<{type: string, count: number}[]>([]);
  const [previousDayChange, setPreviousDayChange] = useState<number | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficCrashData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const targetDate = "2024-07-13"; // Format in the CSV file

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        await Promise.all([
          fetchSafetyIndexData(),
          fetchCrimeData(),
          fetchTrafficData()
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasError(true);
        toast.error('Failed to load safety data. Using fallback data.');
        setMockData();
        setIsLoading(false);
      }
    };

    const setMockData = () => {
      // Safety Index mock data
      setSafetyIndex(78);
      setPercentChange(-3.5);
      
      // Crime mock data
      setTotalCrimes(125);
      setPreviousDayChange(15);
      setCrimeBreakdown([
        { type: 'Theft', count: 45 },
        { type: 'Battery', count: 30 },
        { type: 'Other', count: 50 }
      ]);
      
      // Traffic mock data
      setTrafficData({
        DATE: targetDate,
        TOTAL_CRASHES: 42,
        TOTAL_FATALITIES: 1,
        TOTAL_INCAPACITATING_INJURIES: 3,
        TOTAL_NON_INCAPACITATING_INJURIES: 12
      });
    };

    const fetchSafetyIndexData = async () => {
      try {
        // Make sure we use the correct path
        const response = await fetch('data/safety_index.csv');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch safety index data: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('Safety Index CSV data loaded:', csvText.length > 0);
        
        if (!csvText || csvText.length === 0) {
          throw new Error('Safety index CSV file is empty');
        }
        
        // Parse CSV
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        
        // Find the right index for each column
        const dateIndex = headers.indexOf('Date');
        const safetyIndexIndex = headers.indexOf('safety_index');
        
        if (dateIndex === -1 || safetyIndexIndex === -1) {
          throw new Error('Invalid CSV headers in safety index file');
        }
        
        // Find the entry for our target date
        const parsedData = [];
        let currentIndex = null;
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue; // Skip empty rows
          
          const cells = rows[i].split(',');
          if (cells.length <= Math.max(dateIndex, safetyIndexIndex)) continue;
          
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
            console.log('Found safety index for target date:', safetyValue);
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
        } else {
          console.warn('Target date not found in safety index data');
          // Use the most recent data point if target date not found
          if (parsedData.length > 0) {
            const mostRecent = parsedData[parsedData.length - 1];
            setSafetyIndex(mostRecent.value);
            console.log('Using most recent safety index:', mostRecent.value);
          } else {
            throw new Error('No valid safety index data found');
          }
        }
      } catch (error) {
        console.error('Error in fetchSafetyIndexData:', error);
        throw error;
      }
    };

    const fetchCrimeData = async () => {
      try {
        const response = await fetch('data/july_2024_crime_summary.csv');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch crime data: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('Crime CSV data loaded:', csvText.length > 0);
        
        if (!csvText || csvText.length === 0) {
          throw new Error('Crime CSV file is empty');
        }
        
        // Parse CSV
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        
        // Find the right index for each column
        const dateIndex = headers.indexOf('date');
        const typeIndex = headers.indexOf('primary_type');
        const countIndex = headers.indexOf('count');
        
        if (dateIndex === -1 || typeIndex === -1 || countIndex === -1) {
          throw new Error('Invalid CSV headers in crime file');
        }
        
        const parsedData: CrimeData[] = [];
        let totalCount = 0;
        const crimesOnTargetDate: CrimeData[] = [];
        const previousDayCrimes: CrimeData[] = [];
        
        // Calculate previous date
        const targetDateObj = new Date(targetDate);
        const previousDateObj = new Date(targetDateObj);
        previousDateObj.setDate(previousDateObj.getDate() - 1);
        const previousDate = previousDateObj.toISOString().split('T')[0];
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue; // Skip empty rows
          
          const cells = rows[i].split(',');
          if (cells.length <= Math.max(dateIndex, typeIndex, countIndex)) continue;
          
          const rowDate = cells[dateIndex];
          const crimeType = cells[typeIndex];
          const crimeCount = parseInt(cells[countIndex], 10);
          
          // Skip any invalid data rows
          if (isNaN(crimeCount) || !rowDate || !crimeType) continue;
          
          parsedData.push({
            date: rowDate,
            primary_type: crimeType,
            count: crimeCount
          });
          
          // Collect crimes on target date
          if (rowDate === targetDate) {
            crimesOnTargetDate.push({
              date: rowDate,
              primary_type: crimeType,
              count: crimeCount
            });
            totalCount += crimeCount;
          }
          
          // Collect crimes on previous date
          if (rowDate === previousDate) {
            previousDayCrimes.push({
              date: rowDate,
              primary_type: crimeType,
              count: crimeCount
            });
          }
        }
        
        console.log(`Found ${crimesOnTargetDate.length} crime types for target date, total: ${totalCount}`);
        
        // Calculate total for previous day
        const previousDayTotal = previousDayCrimes.reduce((sum, crime) => sum + crime.count, 0);
        
        // Calculate percentage change if both days have data
        if (previousDayTotal > 0) {
          const change = ((totalCount - previousDayTotal) / previousDayTotal) * 100;
          setPreviousDayChange(Number(change.toFixed(0)));
        }
        
        // Sort crimes by count and get top 3
        const sortedCrimes = [...crimesOnTargetDate].sort((a, b) => b.count - a.count);
        const topCrimes = sortedCrimes.slice(0, 2); // Get top 2
        
        // Calculate "Other" category
        const othersCount = totalCount - topCrimes.reduce((sum, crime) => sum + crime.count, 0);
        
        const breakdown = [
          ...topCrimes.map(crime => ({
            type: crime.primary_type.charAt(0).toUpperCase() + crime.primary_type.slice(1).toLowerCase(),
            count: crime.count
          })),
          { type: 'Other', count: othersCount }
        ];
        
        setCrimeData(parsedData);
        setTotalCrimes(totalCount);
        setCrimeBreakdown(breakdown);
      } catch (error) {
        console.error('Error in fetchCrimeData:', error);
        throw error;
      }
    };

    const fetchTrafficData = async () => {
      try {
        const response = await fetch('data/traffic_crash_daily_totals_july_2024.csv');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch traffic data: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('Traffic CSV data loaded:', csvText.length > 0);
        
        if (!csvText || csvText.length === 0) {
          throw new Error('Traffic CSV file is empty');
        }
        
        // Parse CSV
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        
        // Find the entry for our target date
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue; // Skip empty rows
          
          const cells = rows[i].split(',');
          if (cells[0] === targetDate) {
            setTrafficData({
              DATE: cells[0],
              TOTAL_CRASHES: parseInt(cells[1], 10),
              TOTAL_FATALITIES: parseFloat(cells[2]),
              TOTAL_INCAPACITATING_INJURIES: parseFloat(cells[3]),
              TOTAL_NON_INCAPACITATING_INJURIES: parseFloat(cells[4])
            });
            break;
          }
        }
      } catch (error) {
        console.error('Error in fetchTrafficData:', error);
        throw error;
      }
    };

    fetchData();
  }, []);

  // Helper for rendering loading skeletons
  const renderSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/3 mb-2" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-2 w-full mt-4" />
    </div>
  );

  // Helper for rendering error states
  const renderError = () => (
    <div className="flex flex-col items-center justify-center py-4 text-gray-500">
      <AlertTriangle className="h-6 w-6 text-yellow-500 mb-2" />
      <p className="text-sm">Using fallback data</p>
    </div>
  );

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
          {isLoading ? (
            renderSkeleton()
          ) : (
            <>
              <div className="text-2xl font-bold text-transit-amber">
                {safetyIndex !== null ? `${safetyIndex}/100` : "N/A"}
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
              {hasError && renderError()}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md overflow-hidden border-t-4 border-t-transit-red">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Total Crime Incidents</CardTitle>
          </div>
          <Info className="h-5 w-5 text-transit-red" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            renderSkeleton()
          ) : (
            <>
              <div className="text-2xl font-bold">{totalCrimes}</div>
              {previousDayChange !== null && (
                <div className="flex items-center mt-1 space-x-1">
                  <span className={`text-xs ${previousDayChange <= 0 ? "text-transit-green" : "text-transit-red"}`}>
                    {`${Math.abs(previousDayChange)}% ${previousDayChange <= 0 ? "decrease" : "increase"} from yesterday`}
                  </span>
                </div>
              )}
              <div className="mt-3 grid grid-cols-3 gap-1 text-xs">
                {crimeBreakdown.map((crime, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded text-center">
                    <span className="block font-medium">{crime.count}</span>
                    <span className="text-gray-500">{crime.type}</span>
                  </div>
                ))}
              </div>
              {hasError && renderError()}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md overflow-hidden border-t-4 border-t-transit-green">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Total Traffic Incidents</CardTitle>
          </div>
          <Car className="h-5 w-5 text-transit-green" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            renderSkeleton()
          ) : (
            <>
              <div className="text-2xl font-bold">{trafficData ? trafficData.TOTAL_CRASHES : "N/A"}</div>
              <div className="mt-3">
                <div className="flex justify-between items-center text-xs p-1 rounded hover:bg-gray-50">
                  <span>Fatalities</span>
                  <span className="font-medium">{trafficData ? trafficData.TOTAL_FATALITIES : "-"}</span>
                </div>
                <div className="flex justify-between items-center text-xs p-1 rounded hover:bg-gray-50">
                  <span>Incapacitating Injuries</span>
                  <span className="font-medium">{trafficData ? trafficData.TOTAL_INCAPACITATING_INJURIES : "-"}</span>
                </div>
                <div className="flex justify-between items-center text-xs p-1 rounded hover:bg-gray-50">
                  <span>Non-incap. Injuries</span>
                  <span className="font-medium">{trafficData ? trafficData.TOTAL_NON_INCAPACITATING_INJURIES : "-"}</span>
                </div>
              </div>
              {hasError && renderError()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyMetrics;
