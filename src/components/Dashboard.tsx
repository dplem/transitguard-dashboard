
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
    <div className="flex flex-col min-h-screen bg-[#F7FBFD]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-transit-blue">Safety Overview</h2>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        
        <div className="space-y-6">
          <SafetyMetrics />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SafetyMap />
            <LineStatus />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PredictionChart />
            <TimeAnalysis />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 px-6 shadow-inner">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/lovable-uploads/d59640d7-3328-4836-9b81-01e8bd08d51f.png" alt="CTA Logo" className="h-8 mr-2" />
            <img src="/logo/transitguard_logo.png" alt="TransitGuard Logo" className="h-8" />
          </div>
          <p className="text-sm text-gray-500">© 2025 TransitGuard | Real-Time Safety for Chicago Transit</p>
          <div className="text-sm text-gray-500 mt-2 md:mt-0">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </footer>
      
      <ChatbotPopup />
    </div>
  );
};

export default Dashboard;
