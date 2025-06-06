import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavItem = ({ label, withDropdown }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAttributes = label === 'Manage Attributes';
  const isManageUsers = label === 'Manage Users';
  const isManageSellers = label === 'Manage Sellers';
  const isManageRooms = label === 'Manage Rooms';

  const attributeItems = [
    { label: 'Manage Categories', path: '/admin/categories' },
    { label: 'Manage Series', path: '/admin/series' },
    { label: 'Manage Materials', path: '/admin/materials' },
    { label: 'Manage Sizes', path: '/admin/sizes' },
    { label: 'Manage Colors', path: '/admin/colors' },
    { label: 'Manage Suitable Places', path: '/admin/places' },
  ];

  const userItems = [
    { label: 'Manage Admin', path: '/admin/manage-admin' },
    { label: 'Add Admin', path: '/admin/add-admin' },
  ];

  const sellerItems = [
    { label: 'Seller List', path: '/admin/seller/list' },
    { label: 'Add Seller', path: '/admin/seller/create' },
  ];

  const roomItems = [
    { label: 'View All Room', path: '/admin/addroom/list' },
    { label: 'Add Room', path: '/admin/roomform' },
  ];

  const dropdownItems = isAttributes
  ? attributeItems
  : isManageUsers
  ? userItems
  : isManageSellers
  ? sellerItems
  : isManageRooms
  ? roomItems
  : [];

  const handleClick = () => {
    if (withDropdown) {
      setIsOpen(prev => !prev);
    }
  };

  const handleItemClick = path => {
    navigate(path);
    setIsOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={handleClick}
        className={`flex items-center space-x-1 cursor-pointer 
        px-3 py-2 rounded-md transition duration-150 
        ${isOpen ? 'bg-white text-[#6C4A34]' : 'hover:bg-white hover:text-[#6C4A34] text-white'}`}
      >
        <span>{label}</span>
        {withDropdown && <ChevronDown className="w-4 h-4" />}
      </div>

      {withDropdown && isOpen && (
        <div
          className="absolute left-0 top-12 mt-1 w-56 
          bg-white text-black shadow-lg rounded-lg z-50"
        >
          <ul className="py-2 text-sm">
            {dropdownItems.map((item, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 border-b hover:text-[#6C4A34] transition-all duration-200 ease-in-out border-white last:border-none cursor-pointer"
                onClick={() => handleItemClick(item.path)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavItem;
