import React, { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { Icon } from './icons';
import { useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/redux/slice/auth/authThunks';

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleDashRoute = () => {
    navigate('admin/dashboard');
  };

  const navLinks = [
    { label: 'Dashboard', onClick: handleDashRoute },
    { label: 'Manage Users', withDropdown: true },
    { label: 'Manage Sellers', withDropdown: true },
    { label: 'Manage Rooms', withDropdown: true },
    { label: 'Manage Attributes', withDropdown: true },
  ];

  return (
    <header className="bg-[#6C4A34] text-white px-4 md:px-6 py-3 flex justify-between items-center shadow sticky top-0 z-50">
      {/* Logo */}
      <Icon name="Logo" height="50px" width="55px" className="shrink-0" />

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-5 text-sm xl:text-base font-medium">
        {navLinks.map((item, idx) => (
          <React.Fragment key={item.label}>
            <NavItem label={item.label} onClick={item.onClick} withDropdown={item.withDropdown} />
            {idx < navLinks.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </nav>

      {/* Mobile Hamburger Menu */}
      <button
        className="lg:hidden focus:outline-none ml-auto"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Logout Button */}
      <button
        onClick={handleLogout}
        className="hidden lg:flex items-center space-x-2 bg-white text-black px-3 py-2 rounded-md font-medium hover:bg-gray-100 transition"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm">Logout</span>
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#6C4A34] text-white p-4 flex flex-col space-y-4 lg:hidden z-20 shadow-md">
          {navLinks.map(item => (
            <NavItem
              key={item.label}
              label={item.label}
              onClick={() => {
                if (item.onClick) item.onClick();
                setMenuOpen(false);
              }}
              withDropdown={item.withDropdown}
            />
          ))}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

const Divider = () => <span className="text-white/50 select-none hidden xl:inline">|</span>;

export default AdminHeader;