
import React from 'react';
import { Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-7 w-7 text-transit-blue" />
          <div>
            <h1 className="font-bold text-xl text-gray-900">TransitGuard</h1>
            <p className="text-sm text-gray-500">Real-Time Safety Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <div className="text-sm text-right">
              <p className="font-medium text-gray-900">Chicago, IL</p>
              <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-transit-red rounded-full w-4 h-4 text-[10px] flex items-center justify-center text-white">3</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
