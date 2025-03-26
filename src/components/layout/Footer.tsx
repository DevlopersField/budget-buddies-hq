
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 px-6 md:px-10 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground mb-2 md:mb-0">
          © {currentYear} MoneyMaster. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </a>
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms
          </a>
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
