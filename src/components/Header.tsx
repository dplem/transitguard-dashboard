
import React from 'react';
import { Bell, Shield, Menu, TramFront } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

const Header = () => {
  return (
    <header className="bg-white shadow-md border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <img src="/lovable-uploads/d59640d7-3328-4836-9b81-01e8bd08d51f.png" alt="CTA Logo" className="h-10 mr-3" />
            <div className="flex items-center space-x-2">
              <Shield className="h-7 w-7 text-transit-blue" />
              <div>
                <h1 className="font-bold text-xl text-transit-blue">TransitGuard</h1>
                <p className="text-sm text-gray-500">Real-Time Safety Dashboard</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <TramFront className="h-4 w-4" />
              <span>Live Transit</span>
            </Button>
            <ModeToggle />
          </div>
          
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
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
