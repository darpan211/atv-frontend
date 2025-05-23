import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Menu, X } from 'lucide-react';
import { Icon } from './icons';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-100 flex items-center shadow-xl md:justify-around relative">
      <div className="flex items-center justify-between md:w-fit w-full  h-[80px] gap-4">
        <Icon name="Logo" height={'69px'} width={'70px'} />

        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <NavigationMenu className="hidden md:block justify-center decoration-[#6C4A34]">
        <NavigationMenuList className="flex gap-5">
          {['Home', 'About Us', 'Projects', 'Contact Us'].map(item => (
            <NavigationMenuItem key={item}>
              <NavigationMenuLink className="font-bold text-gray-800 text-nowrap hover:underline transition-all">
                {item}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="font-bold text-gray-800 bg-transparent hover:bg-transparent focus:bg-transparent">
              Services
            </NavigationMenuTrigger>
            {/* <NavigationMenuContent className="min-w-[200px] bg-white p-2 rounded-md shadow-md">
              <div className="grid gap-2 p-2">
                {['Service 1', 'Service 2', 'Service 3'].map(service => (
                     <NavigationMenuLink
                     key={service}
                     className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                   >
                     {service}
                   </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent> */}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden md:flex gap-2 ">
        <Button
          onClick={handleLogin}
          variant="outline"
          className="bg-[#6F4E37] hover:bg-[#6F4E37] border-0 text-gray-800"
        >
          <span className="flex items-center text-white">
            <UserIcon className="text-white" />
            Login
          </span>
        </Button>
        <Button
          variant="outline"
          className="bg-[#6F4E37] hover:bg-[#6F4E37] border-0 text-gray-800"
        >
          <span className="flex items-center text-white">
            <UserPlusIcon className="text-white" />
            Register
          </span>
        </Button>
      </div>

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
