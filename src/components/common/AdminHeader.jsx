import React, { use, useState } from 'react';
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
    console.log('DashBoard Route Click');
  };
  return (
    <header className="bg-[#6C4A34] text-white px-6 py-3 flex justify-between items-center shadow relative">
      <Icon name="Logo" height={'60px'} width={'65px'} />

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <NavItem label="Dashboard" onClick={handleDashRoute} />
        <Divider />
        <NavItem label="Manage Users" withDropdown />
        <Divider />
        <NavItem label="Manage Sellers" withDropdown />
        <Divider />
        <NavItem label="Manage Rooms" withDropdown />
        <Divider />
        <NavItem label="Manage Attributes" withDropdown />
      </nav>

      {/* Hamburger menu for mobile */}
      <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop logout */}
      <button
        onClick={handleLogout}
        className="hidden md:flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 cursor-pointer"
      >
        {/* <LogOut className="w-4 h-4" /> */}
        {/* <span>Logout</span> */}
        <svg
          width="24"
          height="20"
          viewBox="0 0 34 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="34" height="33" rx="5" fill="white" />
          <path
            d="M16.6016 6.0061C13.8714 6.0061 11.6582 8.21933 11.6582 10.9495C11.6582 11.4955 12.1008 11.9381 12.6469 11.9381C13.1929 11.9381 13.6356 11.4955 13.6356 10.9495C13.6356 9.31139 14.9635 7.98345 16.6016 7.98345H20.5563C22.1944 7.98345 23.5223 9.31139 23.5223 10.9495V20.8362C23.5223 22.4743 22.1944 23.8022 20.5563 23.8022H16.6016C14.9635 23.8022 13.6356 22.4743 13.6356 20.8362C13.6356 20.2902 13.1929 19.8475 12.6469 19.8475C12.1008 19.8475 11.6582 20.2902 11.6582 20.8362C11.6582 23.5663 13.8714 25.7796 16.6016 25.7796H20.5563C23.2864 25.7796 25.4996 23.5663 25.4996 20.8362V10.9495C25.4996 8.21933 23.2864 6.0061 20.5563 6.0061H16.6016Z"
            fill="#6F4E37"
          />
          <path
            d="M17.5905 14.9042C18.1366 14.9042 18.5792 15.3468 18.5792 15.8928C18.5792 16.4389 18.1366 16.8815 17.5905 16.8815V14.9042Z"
            fill="#6F4E37"
          />
          <path
            d="M9.40216 14.9042C9.49017 14.7956 9.57449 14.6904 9.65426 14.5898C9.89697 14.2836 10.1025 14.0148 10.2476 13.8221C10.3202 13.7257 10.3778 13.6481 10.4176 13.5941L10.4637 13.5315L10.476 13.5147L10.4804 13.5087C10.4804 13.5086 10.4809 13.508 9.68104 12.9269L10.4804 13.5087C10.8013 13.0669 10.7039 12.448 10.2622 12.127C9.82045 11.8061 9.2022 11.904 8.88124 12.3457L8.87845 12.3495L8.86832 12.3633L8.82704 12.4195C8.79052 12.4689 8.73651 12.5416 8.6679 12.6327C8.53054 12.8152 8.33529 13.0706 8.10486 13.3612C7.63896 13.9488 7.04888 14.6552 6.51026 15.1938L5.81116 15.8929L6.51026 16.592C7.04888 17.1306 7.63896 17.8369 8.10486 18.4245C8.33529 18.7151 8.53054 18.9706 8.6679 19.153C8.73651 19.2442 8.79052 19.3169 8.82704 19.3663L8.86832 19.4224L8.87845 19.4363L8.88075 19.4394C9.20171 19.8811 9.82045 19.9797 10.2622 19.6587C10.7039 19.3378 10.8018 18.7195 10.4809 18.2778L9.68104 18.8589C10.4809 18.2778 10.4809 18.2779 10.4809 18.2778L10.476 18.2711L10.4637 18.2542L10.4176 18.1916C10.3778 18.1377 10.3202 18.0601 10.2476 17.9637C10.1025 17.771 9.89697 17.5021 9.65426 17.1959C9.57449 17.0954 9.49017 16.9901 9.40216 16.8816H17.5904V14.9042H9.40216Z"
            fill="#6F4E37"
          />
        </svg>
      </button>

      {/* Mobile dropdown menu */}
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

const Divider = () => <div className="text-white/50 select-none">|</div>;

export default AdminHeader;
