export interface ChatResponse {
  success: boolean;
  message: string;
}

const hardcodedResponses = new Map<string, string>([
  // Real-Time Risk Awareness
  ["is this stop considered high-risk right now", "Based on recent patterns, stops are considered high-risk if they show high incident density during peak hours (3–6 PM). If your stop is a busy CTA train platform or downtown transfer station, the current risk is likely elevated."],
  ["current safety status", "For example, at Lake/State: This station had 5+ incidents in the past month and ranks among the highest-risk stations. Most incidents occur between 3 PM and 6 PM, mainly thefts and batteries."],
  ["incidents reported near me", "Yes. There were 14 CTA-related incidents citywide in the past 24 hours, including thefts and assaults—primarily at downtown stations and on rail platforms."],
  ["safety alerts today", "Based on incident distribution, Red Line and Blue Line stations had the most frequent activity recently, particularly in the Loop and at major transfer points."],
  ["safest route", "Currently, routes that avoid the downtown Loop and use major bus lines like 96 Lunt or 31st tend to report fewer per-rider incidents. Avoid transfers at high-crime platforms during evening hours."],
  
  // Historical Crime & Pattern Queries
  ["most crimes last month", "Top stations by incidents last month: Lake/State, Clark/Lake, O'Hare Airport. These locations are high-traffic transfer points with frequent reports of theft and battery."],
  ["most dangerous stations 2024", "In 2024, top crime-heavy L locations include: CTA TRAIN: 1,757 incidents, CTA PLATFORM: 775, CTA STATION: 525. Others such as Grand/State and Chicago/State also rank high."],
  ["when do crimes peak", "Crimes peak on weekdays, especially Tuesday to Thursday, and during 3–6 PM. July, September, and October are peak months."],
  ["weekdays vs weekends", "Weekday crimes: ~7,400–7,500 per day, Weekend crimes: ~6,400 per day. Weekdays show consistently higher incident volumes due to more ridership and crowding."],
  ["highest crime months red line", "Based on station-level data, months January, March, and May have shown the highest Red Line crime volumes, correlating with peak winter-spring ridership."],
  
  // Location-Specific Information
  ["crimes reported recently", "At CTA BUS: 130 assaults, At CTA PLATFORM: 46 assaults. Most recent incidents involve theft, battery, and criminal damage, especially at train platforms."],
  ["ward 42 dangerous", "Yes. Ward 42 leads with 7,753 incidents, followed by Wards 2 (3,012) and 6 (2,636). This includes areas like the Loop and River North."],
  ["assaults past year", "CTA BUS: 130, CTA TRAIN: 74, CTA STATION: 58. These represent the top three incident locations for assaults between May 2024–May 2025."],
  ["crime rate bus route", "The crime rate for the 79th route is elevated due to high ridership. While specific rate values require precise alignment with crimes per route, hotspot analysis flags it as high-risk."],
  ["recent incidents community", "Yes. Community Area 32 (The Loop) had 9,272 incidents, making it the most active zone. ZIP-based alerts are being tested for rollout."],
  
  // Environmental & Traffic Context
  ["traffic accidents affecting routes", "Streets like Western Avenue and Michigan Avenue are high-incident corridors for traffic crashes and likely to impact bus reliability today."],
  ["streets most crashes", "Western Avenue – 23,314 crashes, Michigan Avenue, State Street. These streets also overlap with busy CTA corridors."],
  ["graffiti reports", "Yes, data shows high correlation between 311 graffiti/light-outage reports and elevated crime reports at stations like Roosevelt and Chicago/State."],
  ["streetlight outage impact", "Streetlight outages are associated with a 15–25% rise in evening incidents, especially battery and criminal damage reports."],
  ["graffiti higher crime", "Yes. A cluster analysis shows graffiti-heavy areas often overlap with high-risk zones, particularly on under-monitored routes."],
  
  // Predictive & Forecast-Based Questions
  ["predicted crime tomorrow", "Using XGBoost and SARIMA, stations like Clark/Lake and Roosevelt are predicted to face moderate to high risk tomorrow from 3–6 PM."],
  ["crime increase weekend", "No major spikes predicted. Weekends typically show 15% lower incidents than weekdays, but night hours remain moderately risky."],
  ["violent crimes spike month", "Forecasts indicate stable violent crime levels in May. No significant spike beyond normal weekday trends is expected."],
  ["next high-risk day", "Model forecasts flag next Friday (May 17) as a high-risk day, especially between 3–6 PM in downtown stations."],
  ["safest time fridays", "The safest windows are before 8 AM and after 9 PM, when both ridership and crime probability drop."],
  
  // Alerts and Safety Protocols
  ["report incident", "You can report incidents via TransitGuard's app, through the built-in chat, or by calling the CTA safety hotline at 1-888-YOUR-CTA."],
  ["witness crime train", "Immediately move to a safer area, press the emergency intercom, and use the app to alert TransitGuard. Stay aware and avoid confrontation."],
  ["get alerts near me", "Yes. If you've enabled location sharing in the app, TransitGuard sends alerts within a quarter-mile radius for any reported CTA incident."],
  ["cta staff respond", "Alerts are relayed to CTA's command center, which dispatches transit police or security teams. Average response time is 5–8 minutes."],
  ["text api alerts", "Yes. SMS and API-based alerts are available via the mobile app or city's open safety API, depending on your settings."],
  
  // Equity and Accessibility
  ["community areas incidents", "Top areas include: Loop (Community Area 32): 9,272, Near North Side (Area 8): 3,086, Rogers Park (Area 1): 1,998"],
  ["underserved neighborhoods", "Yes. Areas with fewer security staff or surveillance (e.g., West Side, South Side) show higher per-capita crime rates despite lower ridership."],
  ["high crime low ridership", "Stations like Ashland/63rd and Garfield show high per-rider crime rates, making them priorities for targeted interventions."],
  ["equity safety planning", "TransitGuard recommends equity-based patrol deployment and infrastructure upgrades in high-risk but underserved areas, backed by DBSCAN clustering."],
  
  // Additional fallback responses
  ["stations near me", "The stations nearest to your current location are: Noyes, Foster, Central, and Davis"],
  ["total crimes today", "The total number of crimes today on Chicago Transit are 13."],
  ["total traffic accidents today", "The total number of traffic accidents in Chicago today is 365."],
  ["safest line last 7 days", "The safest line in the last 7 days is Purple and Yellow with 1 incidents."],
]);

const findBestMatch = (userQuery: string): string | null => {
  const query = userQuery.toLowerCase();
  
  // Find exact matches first
  for (const [key, response] of hardcodedResponses) {
    if (query.includes(key)) {
      return response;
    }
  }
  
  // Find partial matches
  const words = query.split(' ');
  for (const [key, response] of hardcodedResponses) {
    const keyWords = key.split(' ');
    const matchCount = keyWords.filter(word => words.includes(word)).length;
    if (matchCount >= 2) {
      return response;
    }
  }
  
  return null;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getChatbotResponse = async (userMessage: string): Promise<ChatResponse> => {
  try {
    // Add 1 second delay
    await delay(1000);
    
    // First, try to get response from local API if available
    // This is where you would add your API call when ready
    // Example: const response = await fetch('http://localhost:3000/api/chat', { ... });
    
    // For now, we'll use hardcoded responses as fallback
    const hardcodedResponse = findBestMatch(userMessage);
    
    if (hardcodedResponse) {
      return {
        success: true,
        message: hardcodedResponse
      };
    }
    
    // Default fallback response
    return {
      success: true,
      message: "Thank you for your question about Chicago Transit safety. For the most accurate and up-to-date information, I recommend checking the official CTA website or contacting their customer service. You can also ask me about specific safety topics, crime statistics, or station information."
    };
    
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    
    // Add delay for error responses too
    await delay(1000);
    
    // Return hardcoded response as fallback
    const hardcodedResponse = findBestMatch(userMessage);
    return {
      success: true,
      message: hardcodedResponse || "I'm currently experiencing connectivity issues. Please try again later or contact CTA customer service for immediate assistance."
    };
  }
};
