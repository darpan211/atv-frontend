import React, { useState } from 'react';
import { ChevronDown, LogOut, Menu } from 'lucide-react';
import { Icon } from './icons';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="bg-[#6C4A34] text-white px-6 py-3 flex justify-between items-center shadow relative">
      <Icon name="Logo" height={'60px'} width={'65px'} />

      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <NavItem label="Dashboard" />
        <Divider />
        <NavItem label="Manage Users" withDropdown />
        <Divider />
        <NavItem label="Manage Sellers" withDropdown />
        <Divider />
        <NavItem label="Manage Rooms" withDropdown />
        <Divider />
        <NavItem className="bg-white" label="Manage Attributes" withDropdown />
      </nav>

      <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu className="w-6 h-6" />
      </button>

      <button
        onClick={handleLogout}
        className="hidden md:flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#6C4A34] text-white p-4 flex flex-col space-y-3 md:hidden z-10">
          <NavItem label="Dashboard" />
          <NavItem label="Manage Users" withDropdown />
          <NavItem label="Manage Sellers" withDropdown />
          <NavItem label="Manage Rooms" withDropdown />
          <NavItem label="Manage Attributes" withDropdown />
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 mt-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

const NavItem = ({ label, withDropdown }) => {
  const showDropdown = label === 'Manage Attributes';
  const [background, setBackground] = useState(false);

  return (
    <div className="relative group">
      <div
        className={`flex items-center space-x-1 cursor-pointer 
        transition duration-150 px-3 py-2 rounded-md 
        hover:bg-white hover:text-[#6C4A34] 
        ${background ? 'bg-white text-[#6C4A34]' : ''}`}
      >
        <span>{label}</span>
        {withDropdown && <ChevronDown className="w-4 h-4" />}
      </div>

      {/* Dropdown stays open when either the trigger or dropdown is hovered */}
      {showDropdown && (
        <div
          className="absolute left-0 top-6 mt-2 w-56 
                       bg-white text-black shadow-lg rounded-lg 
                       opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                       transition-all duration-200 z-50"
        >
          <ul className="py-2 text-sm">
            {[
              'Manage Categories',
              'Manage Series',
              'Manage Materials',
              'Manage Sizes',
              'Manage Colors',
              'Manage Suitable Places',
            ].map((item, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 border-b border-white last:border-none cursor-pointer"
                onMouseEnter={() => setBackground(true)}
                onMouseOut={() => setBackground(false)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Divider = () => <div className="text-white/50 select-none">|</div>;

export default AdminHeader;
