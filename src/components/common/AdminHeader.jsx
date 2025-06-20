import React, { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
// import { Icon } from './icons';
import { useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slice/auth/authSlice';
import { Icon } from './icons/index';
import LogOutConfirmationModal from './LogOutConfirmationModal';
const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogOut, setIslogOut] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    setIslogOut(true);
  };

  const confirmLogOut = () => {
    dispatch(logout());
    setIslogOut(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Dashboard', withDropdown: false, onClick: () => navigate('/') },
    {
      label: 'Manage Users',
      withDropdown: true,
      dropdownItems: [
        { label: 'Manage Admin', path: '/admin/dashboard/list' },
        { label: 'Add Admin', path: '/admin/dashboard/create' },
      ],
    },
    {
      label: 'Manage Sellers',
      withDropdown: true,
      dropdownItems: [
        { label: 'Seller List', path: '/admin/seller/list' },
        { label: 'Add Seller', path: '/admin/seller/create' },
      ],
    },
    {
      label: 'Manage Rooms',
      withDropdown: true,
      dropdownItems: [
        { label: 'View All Room', path: '/admin/room/list' },
        { label: 'Add Room', path: '/admin/room/add' },
      ],
    },
    {
      label: 'Manage Attributes',
      withDropdown: true,
      dropdownItems: [
        { label: 'Manage Categories', path: '/admin/categories' },
        { label: 'Manage Series', path: '/admin/series' },
        { label: 'Manage Materials', path: '/admin/materials' },
        { label: 'Manage Sizes', path: '/admin/sizes' },
        { label: 'Manage Colors', path: '/admin/colors' },
        { label: 'Manage Suitable Places', path: '/admin/places' },
        { label: 'Manage Finish', path: '/admin/finish' },
      ],
    },
    {
      label: 'Admin Profile',
      withDropdown: false,
      onClick: () => navigate('/admin/profile'),
    },
  ];

  return (
    <header className="bg-[#6C4A34] text-white px-4 md:px-6 py-3 flex justify-between items-center shadow sticky top-0 z-50">
      <Icon name="Logo" height="50px" width="55px" className="shrink-0" />

      <nav className="hidden lg:flex items-center space-x-5 text-[16px] xl:text-base font-normal">
        {navLinks.map((item, idx) => (
          <React.Fragment key={item.label}>
            <NavItem
              label={item.label}
              onClick={item.onClick}
              withDropdown={item.withDropdown}
              dropdownItems={item.dropdownItems}
            />
            {idx < navLinks.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </nav>

      <button
        className="lg:hidden focus:outline-none ml-auto"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <Menu className="w-6 h-6" />
      </button>

      <button
        onClick={handleLogout}
        className="hidden cursor-pointer lg:flex items-center space-x-2 gap-3 bg-white text-black px-3 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
      >
        <Icon name="Logout" className="w-5 h-5 text-[#6C4A34]" /> Logout
      </button>

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
              dropdownItems={item.dropdownItems}
            />
          ))}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="w-[150px] cursor-pointer flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 "
          >
            <LogOut className="w-4 h-4 " />
            <span>Logout</span>
          </button>
        </div>
      )}
      {isLogOut && (
        <LogOutConfirmationModal onCancel={() => setIslogOut(false)} onConfirm={confirmLogOut} />
      )}
    </header>
  );
};

const Divider = () => <span className="text-white/50 select-none hidden xl:inline">|</span>;

export default AdminHeader;
