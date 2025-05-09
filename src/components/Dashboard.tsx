
import React from 'react';
import Header from './Header';
import SafetyMetrics from './SafetyMetrics';
import SafetyMap from './SafetyMap';
import LineStatus from './LineStatus';
import PredictionChart from './PredictionChart';
import TimeAnalysis from './TimeAnalysis';
import ChatbotPopup from './ChatbotPopup';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Safety Overview</h2>
        
        <div className="space-y-6">
          <SafetyMetrics />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SafetyMap />
            <LineStatus />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <PredictionChart />
            <TimeAnalysis />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 TransitGuard | Real-Time Safety for Chicago Transit</p>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </footer>
      
      {/* Add the ChatbotPopup component */}
      <ChatbotPopup />
    </div>
  );
};

export default Dashboard;
