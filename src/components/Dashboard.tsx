
import React from 'react';
import Header from './Header';
import SafetyMetrics from './SafetyMetrics';
import SafetyMap from './SafetyMap';
import LineStatus from './LineStatus';
import PredictionChart from './PredictionChart';
import ChatbotPopup from './ChatbotPopup';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7FBFD] dark:bg-[#0A1823]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-transit-blue dark:text-blue-300">Safety Overview</h2>
          {/* Removed the date display here as requested */}
        </div>
        
        <div className="space-y-6">
          <SafetyMetrics />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SafetyMap />
            <LineStatus />
          </div>
          
          {/* Predictive Analysis now spans full width */}
          <PredictionChart />
        </div>
      </main>
      
      <footer className="bg-white dark:bg-[#0A1823] border-t border-gray-200 dark:border-gray-800 py-4 px-6 shadow-inner">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/lovable-uploads/5de9f635-9783-4fac-a8a0-82ad46bb374a.png" alt="TransitGuard Logo" className="h-10" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 TransitGuard | Real-Time Safety for Chicago Transit</p>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </footer>
      
      <ChatbotPopup />
    </div>
  );
};

export default Dashboard;
