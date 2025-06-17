import React from 'react';
import { Icon } from '../common/icons';

const Footer = () => {
  return (
    <footer className="bg-[#2D1F16] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex justify-center md:justify-start">
          <Icon name="Logo" height={'69px'} width={'70px'} />
        </div>
        <div className="flex justify-center flex-wrap items-center gap-4 text-sm text-white text-center">
          <a href="#" className="hover:underline">
            Terms & Condition
          </a>
          <span className="hidden sm:inline">|</span>
          <a href="#" className="hover:underline">
            Cookies
          </a>
          <span className="hidden sm:inline">|</span>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
        </div>

        <div className="text-sm text-white text-center md:text-right">
          © 2025 A3 BEES INNOVATIONS • All rights reserved
        </div>
      </div>
    </footer>
  );
};
export default Footer;
