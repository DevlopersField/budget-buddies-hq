
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const location = useLocation();
  
  const links = [
    { path: '/', label: 'Dashboard' },
    { path: '/history', label: 'History' },
    { path: '/badges', label: 'Achievements' },
    { path: '/settings', label: 'Settings' }
  ];
  
  return (
    <header className="w-full py-4 px-6 md:px-10 glass-card sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link 
          to="/" 
          className="font-semibold text-xl mb-4 md:mb-0 tracking-tight"
        >
          <span className="text-primary">Money</span>Master
        </Link>
        
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out",
                location.pathname === link.path
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-secondary hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
