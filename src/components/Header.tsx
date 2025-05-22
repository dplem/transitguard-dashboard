
import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

const Header = () => {
  // Fixed date for demo purposes
  const demoDate = "07/13/2024";
  
  return (
    <header className="bg-white dark:bg-[#0A1823] shadow-md border-b border-gray-200 dark:border-gray-800 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <img src="/lovable-uploads/5de9f635-9783-4fac-a8a0-82ad46bb374a.png" alt="TransitGuard Logo" className="h-12" />
            <div className="ml-3">
              <h1 className="font-bold text-xl text-transit-blue dark:text-blue-300">TransitGuard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Real-Time Safety Dashboard</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
          </div>
          
          <div className="hidden md:block">
            <div className="text-sm text-right">
              <p className="font-medium text-gray-900 dark:text-gray-100">Chicago, IL</p>
              <p className="text-gray-500 dark:text-gray-400">{demoDate}</p>
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
