import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Info, Car, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const [showOtherModal, setShowOtherModal] = useState(false);
  
  // Set targetDate to match the CSV format
  const targetDate = "7/13/2024";

  // Helper to normalize date to YYYY-MM-DD
  function normalizeDate(dateStr: string) {
    // If already in YYYY-MM-DD, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // If in M/D/YYYY or MM/DD/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [m, d, y] = parts;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    return dateStr;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add a delay to ensure files are loaded
        setTimeout(async () => {
          try {
            await Promise.all([
              fetchSafetyIndexData(),
              fetchCrimeData(),
              fetchTrafficData()
            ]);
          } catch (error) {
            console.error('Error fetching data:', error);
            setHasError(true);
            toast.error('Failed to load safety data. Using fallback data.');
            // Set mock data for development
            setMockData();
          } finally {
            setIsLoading(false);
          }
        }, 1000); // 1 second delay
      } catch (error) {
        console.error('Error in timeout:', error);
        setHasError(true);
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
        const response = await fetch('/data/safety_index.csv');
        console.log('Fetch response:', response.ok);
        if (!response.ok) {
          throw new Error(`Failed to fetch safety index data: ${response.status}`);
        }
        const csvText = await response.text();
        console.log('CSV Text:', csvText);
        const rows = csvText.split('\n').filter(r => r.trim() !== '');
        console.log('Rows:', rows);
        const headers = rows[0].split(',').map(h => h.trim());
        console.log('Headers:', headers);
        const dateIndex = headers.indexOf('Date');
        const safetyIndexIndex = headers.indexOf('safety_index');
        const parsedData = [];
        let currentIndex = null;
        for (let i = 1; i < rows.length; i++) {
          const cells = rows[i].split(',').map(cell => cell.trim());
          const rowDate = normalizeDate(cells[dateIndex]);
          const safetyValue = parseFloat(cells[safetyIndexIndex]);
          console.log(`Row ${i}:`, cells, 'Normalized date:', rowDate, 'Value:', safetyValue);
          if (isNaN(safetyValue) || !rowDate) continue;
          parsedData.push({
            date: rowDate,
            value: safetyValue
          });
          if (rowDate === normalizeDate(targetDate)) {
            currentIndex = safetyValue;
            setSafetyIndex(safetyValue);
            console.log('Found target date:', rowDate, 'Value:', safetyValue);
          }
        }
        console.log('Parsed data:', parsedData);
        if (currentIndex !== null) {
          const targetIndex = parsedData.findIndex(item => item.date === normalizeDate(targetDate));
          if (targetIndex >= 0) {
            let sum = 0;
            let count = 0;
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
              console.log('7-day average:', weekAverage, 'Percent change:', change);
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchSafetyIndexData:', error);
        throw error;
      }
    };

    const fetchCrimeData = async () => {
      try {
        console.log('Fetching /data/july_2024_crime_summary.csv ...');
        const response = await fetch('/data/july_2024_crime_summary.csv');
        console.log('Crime fetch response:', response.ok, response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch crime data: ${response.status}`);
        }
        const csvText = await response.text();
        console.log('Crime CSV data loaded:', csvText.length > 0, csvText.slice(0, 200));
        
        // Parse CSV
        const rows = csvText.split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        
        // Find the right index for each column
        const dateIndex = headers.indexOf('date');
        const typeIndex = headers.indexOf('primary_type');
        const countIndex = headers.indexOf('count');
        
        const parsedData: CrimeData[] = [];
        let totalCount = 0;
        const crimesOnTargetDate: CrimeData[] = [];
        const previousDayCrimes: CrimeData[] = [];
        
        // Convert target date to format in CSV (YYYY-MM-DD)
        const formattedTargetDate = normalizeDate(targetDate);
        
        // Calculate previous date
        const targetDateObj = new Date(formattedTargetDate);
        const previousDateObj = new Date(targetDateObj);
        previousDateObj.setDate(previousDateObj.getDate() - 1);
        const previousDate = previousDateObj.toISOString().split('T')[0];
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue; // Skip empty rows
          
          const cells = rows[i].split(',').map(cell => cell.trim());
          const rowDate = normalizeDate(cells[dateIndex]);
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
          if (rowDate === formattedTargetDate) {
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
        
        // Calculate total for previous day
        const previousDayTotal = previousDayCrimes.reduce((sum, crime) => sum + crime.count, 0);
        
        // Calculate percentage change if both days have data
        if (previousDayTotal > 0) {
          const change = ((totalCount - previousDayTotal) / previousDayTotal) * 100;
          setPreviousDayChange(Number(change.toFixed(0)));
        }
        
        // Group crimes by type for the target date
        console.log('crimesOnTargetDate:', crimesOnTargetDate);
        const typeCounts: { [type: string]: number } = {};
        crimesOnTargetDate.forEach(crime => {
          const type = crime.primary_type.charAt(0).toUpperCase() + crime.primary_type.slice(1).toLowerCase();
          typeCounts[type] = (typeCounts[type] || 0) + crime.count;
        });
        // Sort by count descending
        const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
        setCrimeData(parsedData);
        setTotalCrimes(totalCount);
        setCrimeBreakdown(sortedTypes.map(([type, count]) => ({ type, count })));
      } catch (error) {
        console.error('Error in fetchCrimeData:', error);
        throw error;
      }
    };

    const fetchTrafficData = async () => {
      try {
        const response = await fetch('/data/traffic_crash_daily_totals_july_2024.csv');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch traffic data: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('Traffic CSV data loaded:', csvText.length > 0);
        
        // Parse CSV
        const rows = csvText.split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        
        // Find the entry for July 13, 2024
        for (let i = 1; i < rows.length; i++) {
          const cells = rows[i].split(',').map(cell => cell.trim());
          if (cells[0] === normalizeDate(targetDate)) {
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
                {/* Show top 2 types, group the rest as 'Other' */}
                {crimeBreakdown.slice(0, 2).map((crime, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded text-center">
                    <span className="block font-medium">{crime.count}</span>
                    <span className="text-gray-500">{crime.type}</span>
                  </div>
                ))}
                {crimeBreakdown.length > 2 && (
                  <button
                    className="bg-gray-100 p-2 rounded text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => setShowOtherModal(true)}
                  >
                    <span className="block font-medium">
                      {crimeBreakdown.slice(2).reduce((sum, crime) => sum + crime.count, 0)}
                    </span>
                    <span className="text-gray-500">Other</span>
                  </button>
                )}
              </div>
              {/* Modal for Other crimes */}
              <Dialog open={showOtherModal} onOpenChange={setShowOtherModal}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Other Crime Types</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {crimeBreakdown.slice(2).map((crime, index) => (
                      <div key={index} className="bg-gray-100 p-2 rounded text-center">
                        <span className="block font-medium">{crime.count}</span>
                        <span className="text-gray-500">{crime.type}</span>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md overflow-hidden border-t-4 border-t-transit-yellow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Traffic Crashes</CardTitle>
          </div>
          <Car className="h-5 w-5 text-transit-yellow" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            renderSkeleton()
          ) : (
            <>
              <div className="text-2xl font-bold">{trafficData?.TOTAL_CRASHES}</div>
              <div className="text-sm text-gray-500">
                Fatalities: {trafficData?.TOTAL_FATALITIES}
              </div>
              <div className="text-sm text-gray-500">
                Incapacitating Injuries: {trafficData?.TOTAL_INCAPACITATING_INJURIES}
              </div>
              <div className="text-sm text-gray-500">
                Non-Incapacitating Injuries: {trafficData?.TOTAL_NON_INCAPACITATING_INJURIES}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyMetrics;