import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="mb-4 md:mb-0">
          <a href="/" className="flex items-center">
            <div className="grid grid-cols-2 gap-1 w-8 h-8">
              <div className="bg-amber-700 rounded-tl-sm"></div>
              <div className="bg-blue-400 rounded-tr-sm"></div>
              <div className="bg-amber-300 rounded-bl-sm"></div>
              <div className="bg-gray-700 rounded-br-sm"></div>
            </div>
          </a>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
          <a href="/terms" className="text-gray-300 hover:text-white">
            Terms & Condition
          </a>
          <span className="hidden md:inline text-gray-500">|</span>
          <a href="/cookies" className="text-gray-300 hover:text-white">
            Cookies
          </a>
          <span className="hidden md:inline text-gray-500">|</span>
          <a href="/privacy" className="text-gray-300 hover:text-white">
            Privacy Policy
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-4 md:mt-0 text-gray-400 text-sm">
          © 2025 A3 BEES INNOVATIONS • All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
