import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Minus, ChevronDown } from 'lucide-react';
import { Icon } from './icons';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [mobileAddTilesOpen, setMobileAddTilesOpen] = useState(false);

  const handleLogin = () => (window.location.href = '/');
  const handleRegister = () => (window.location.href = '/register');
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    // setMobileAddTilesOpen(false);
  };
  // const toggleAddTilesDropdown = () => setMobileAddTilesOpen(!mobileAddTilesOpen);

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
