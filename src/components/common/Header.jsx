import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Minus, ChevronDown } from 'lucide-react';
import { Icon } from './icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const AddTilesDropdown = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger className="font-bold text-gray-800 flex items-center gap-1 text-sm xl:text-base cursor-pointer hover:text-[#6F4E37] outline-none hover:underline">
      Add Tiles <ChevronDown size={14} /> {/* No rotation here */}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content
      className="bg-white shadow-lg rounded-xl p-2 mt-2 hover:text-[#6F4E37] cursor-pointer min-w-[230px]"
      sideOffset={5}
    >
      {[
        { label: 'Single Upload', href: '' },
        { label: 'PDF Upload', href: '' },
        { label: 'Bulk Upload', href: '' },
      ].map((item, index, array) => (
        <DropdownMenu.Item
          key={item.label}
          asChild
          className={` px-4 py-2 text-sm   text-black outline-none font-medium flex items-center gap-2 
      ${index !== array.length - 1 ? 'border-b border-gray-300' : ''}`}
        >
          <div className="w-full flex items-center gap-2">
            <span className="text-gray-500">–</span>
            <span>{item.label}</span>
          </div>
        </DropdownMenu.Item>
      ))}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAddTilesOpen, setMobileAddTilesOpen] = useState(false);

  const handleLogin = () => (window.location.href = '/');
  const handleRegister = () => (window.location.href = '/register');
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileAddTilesOpen(false);
  };
  const toggleAddTilesDropdown = () => setMobileAddTilesOpen(!mobileAddTilesOpen);

  return (
    <header className="bg-white border-b border-gray-100 shadow-xl relative z-40 flex items-center">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-[80px]">
          {/* Logo */}
          <div className="flex items-center">
            <Icon
              name="Logo"
              height="45px"
              width="46px"
              className="sm:h-[55px] sm:w-[56px] lg:h-[69px] lg:w-[70px]"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 gap-6 xl:gap-8">
            {['Home', 'About Us'].map(item => (
              <span
                key={item}
                className="font-bold text-gray-800 text-sm xl:text-base cursor-pointer hover:text-[#6F4E37] hover:underline"
              >
                {item}
              </span>
            ))}

            {/* Updated AddTilesDropdown */}
            <AddTilesDropdown />

            {['Projects', 'Contact Us'].map(item => (
              <span
                key={item}
                className="font-bold text-gray-800 text-sm xl:text-base cursor-pointer hover:underline hover:text-[#6F4E37]"
              >
                {item}
              </span>
            ))}

            {/* Services with rotating arrow on hover */}
            <span className="group font-bold text-gray-800 text-sm xl:text-base flex items-center gap-1 cursor-pointer hover:underline">
              Services
              <ChevronDown
                size={14}
                className="transition-transform duration-300 group-hover:rotate-180"
              />
            </span>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex gap-2 xl:gap-3">
            <Button
              onClick={handleLogin}
              variant="outline"
              className="bg-[#6F4E37]  border-0 cursor-pointer text-white px-3 xl:px-4 py-2 text-sm xl:text-base"
            >
              <span className="flex items-center">
                <Icon name="UserIcon" height="50px" width="50px" />
                Login
              </span>
            </Button>
            <Button
              onClick={handleRegister}
              variant="outline"
              className="bg-[#6F4E37] cursor-pointer border-0 text-white px-3 xl:px-4 py-2 text-sm xl:text-base"
            >
              <span className="flex items-center">
                <Icon name="Userplus" height="50px" width="50px" />
                Register
              </span>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-gray-800 cursor-pointer focus:outline-none p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg z-50 transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-2'
        }`}
      >
        <div className="px-4 py-6 sm:px-6">
          <div className="space-y-4 mb-6 text-center">
            {['Home', 'About Us'].map(item => (
              <div key={item}>
                <span
                  className="block text-gray-800 font-medium hover:text-[#6F4E37] transition-colors cursor-pointer py-2 text-base sm:text-lg"
                  onClick={closeMobileMenu}
                >
                  {item}
                </span>
              </div>
            ))}

            {/* Mobile Add Tiles Dropdown */}
            <div>
              <span
                className="block text-gray-800 font-medium hover:text-[#6F4E37] transition-colors cursor-pointer py-2 text-base sm:text-lg"
                onClick={toggleAddTilesDropdown}
              >
                Add Tiles
              </span>
              {mobileAddTilesOpen && (
                <div className="relative inline-block mt-2 py-5 w-[200px] text-center space-y-2 shadow-md rounded-2xl bg-gray-100">
                  {[
                    { label: ' Singel Upload', href: '' },
                    { label: ' Pdf Upload', href: '' },
                    { label: ' Bulk Upload', href: '' },
                  ].map(subItem => (
                    <a
                      key={subItem.label}
                      href={subItem.href}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 text-sm font-medium hover:text-[#6F4E37] cursor-pointer border-b border-gray-400 px-2 py-1"
                    >
                      <Minus size={14} />
                      {subItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {['Projects', 'Contact Us'].map(item => (
              <div key={item}>
                <span
                  className="block text-gray-800 font-medium hover:text-[#6F4E37] transition-colors cursor-pointer py-2 text-base sm:text-lg"
                  onClick={closeMobileMenu}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile Buttons */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-3 grid">
            <Button
              onClick={() => {
                handleLogin();
                closeMobileMenu();
              }}
              variant="outline"
              className="bg-[#6F4E37] cursor-pointer hover:bg-[#5d3e2a] border-0 text-white w-full sm:flex-1 py-3"
            >
              <span className="flex items-center justify-center">
                <Icon name="UserIcon" height="50px" width="50px" />
                Login
              </span>
            </Button>
            <Button
              onClick={() => {
                handleRegister();
                closeMobileMenu();
              }}
              variant="outline"
              className="bg-[#6F4E37] cursor-pointer border-0 text-white w-full sm:flex-1 py-3"
            >
              <span className="flex items-center justify-center">
                <Icon name="Userplus" height="50px" width="50px" />
                Register
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-opacity-25 z-40" onClick={closeMobileMenu} />
      )}
    </header>
  );
};

export default Header;
