import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Logo from '../../components/common/Logo';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 px-6 bg-white border-b border-gray-100 flex items-center md:justify-between relative">
      <div className="flex items-center justify-between md:w-fit w-full  gap-4">
        <Logo />
        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:block justify-center">
        <NavigationMenuList className="flex gap-5">
          {['Home', 'About Us', 'Projects', 'Contact Us'].map(item => (
            <NavigationMenuItem key={item}>
              <NavigationMenuLink className="font-bold text-gray-800 text-nowrap">
                {item}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="font-bold text-gray-800 bg-transparent hover:bg-transparent focus:bg-transparent">
              Services
            </NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[200px] bg-white p-2 rounded-md shadow-md">
              <div className="grid gap-2 p-2">
                {['Service 1', 'Service 2', 'Service 3'].map(service => (
                  <NavigationMenuLink
                    key={service}
                    className="block px-2 py-1 hover:bg-gray-50 rounded-md"
                  >
                    {service}
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Buttons */}
      <div className="hidden md:flex gap-2">
        <Button variant="outline" className="bg-sky-200 hover:bg-sky-300 border-0 text-gray-800">
          <span className="flex items-center">
            <UserIcon />
            Login
          </span>
        </Button>
        <Button variant="outline" className="bg-sky-200 hover:bg-sky-300 border-0 text-gray-800">
          <span className="flex items-center">
            <UserPlusIcon />
            Register
          </span>
        </Button>
      </div>

      {/* Mobile Menu - always rendered, animate visibility */}
      <div
        className={`absolute top-16 left-0 w-full bg-white border-t border-gray-100 px-4 pt-4 pb-2 shadow-md md:hidden z-50 overflow-hidden transition-all duration-1000 ease-in-out ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 hidden'
        }`}
      >
        <div className="flex justify-between flex-col gap-3">
          {['Home', 'About Us', 'Services', 'Projects', 'Contact Us'].map(item => (
            <span key={item} className="text-gray-800 font-medium hover:underline">
              {item}
            </span>
          ))}
          <div className="flex gap-2 mt-4 justify-between flex-wrap">
            <Button
              variant="outline"
              className="bg-sky-200 hover:bg-sky-300 border-0 text-gray-800 w-full"
            >
              <span className="flex items-center justify-center">
                <UserIcon />
                Login
              </span>
            </Button>
            <Button
              variant="outline"
              className="bg-sky-200 hover:bg-sky-300 border-0 text-gray-800 w-full"
            >
              <span className="flex items-center justify-center">
                <UserPlusIcon />
                Register
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// SVG Icons as components
const UserIcon = () => (
  <svg
    className="mr-2"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UserPlusIcon = () => (
  <svg
    className="mr-2"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

export default Header;
