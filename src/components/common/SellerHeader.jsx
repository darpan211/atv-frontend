import React, { useEffect, useRef, useState } from 'react';
import { Menu, User } from 'lucide-react';
import { Icon } from './icons';
import { Link, useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slice/auth/authSlice';
import LogOutConfirmationModal from './LogOutConfirmationModal';

import axiosHandler from '@/services/axiosHandler';
import { Logout } from './icons/svgs/Logout';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SellerHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogOut, setIslogOut] = useState(false);
  const [fetchedData, setFetchedData] = useState({
   sellerName:"",
   sellerEmail:"",
   sellerimage:null
  });
 const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

   
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector(state => state.auth.user);

const [dropdownOpen, setDropdownOpen] = useState(false);
const dropdownRef = useRef(null);
const mobileDropdownRef = useRef(null);

const avatarRef = useRef(null);

  const handleLogout = () => {
    setIslogOut(true);
  };

  const confirmLogOut = () => {
    dispatch(logout());
    setIslogOut(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Dashboard', withDropdown: false, onClick: () => navigate('/seller/dashboard') },
    {
      label: 'Manage Tiles',
      withDropdown: true,
      dropdownItems: [
        // { label: 'View All Design', hasDynamicChildren: true },
        { label: 'Tiles by Categories', hasDynamicChildren: true },
        { label: 'Tiles by Sizes', hasDynamicChildren: true },
        { label: 'Tiles by Finishes', hasDynamicChildren: true },
        { label: 'Tiles by Series', hasDynamicChildren: true },
        { label: 'Tiles by Materials', hasDynamicChildren: true },
        { label: 'Add Tiles', hasDynamicChildren: true },
      ],
    },
    { label: 'All Tiles Design', withDropdown: false, onClick: () => navigate('/tiles/list') },
    {
      label: '3D Visualization',
      withDropdown: false,
      onClick: () => navigate('/tiles/visualizer'),
    },
    {
      label: 'Configure Tiles',
      withDropdown: false,
      onClick: () => navigate('/seller/configure'),
    },
   {
  label: 'Match Tiles',
  withDropdown: true,
  dropdownItems: [
    {
      label: 'Match Tiles',
      onClick: () => navigate('/seller/matchtiles'),
    },
    {
      label: 'View Match Tiles',
      onClick: () => navigate('/seller/allmatchtiles'),
    },
  ]
}
     
  ];
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      avatarRef.current &&
      !avatarRef.current.contains(event.target)
    ) {
      setDesktopDropdownOpen(false);
    }

    if (
      mobileDropdownRef.current &&
      !mobileDropdownRef.current.contains(event.target) &&
      avatarRef.current &&
      !avatarRef.current.contains(event.target)
    ) {
      setMobileDropdownOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const res = await axiosHandler.get(`${BASE_URL}/api/v1/profile/getprofile/${user.id}`);
        const data = res.data?.data;
        
    setFetchedData({
        sellerName: data.owner_name || '',
        sellerEmail: data.email || '',
        sellerimage: data.profile_image || ''
    })
       
       
      } catch (err) {
        console.error('Error fetching seller data:', err.message);
        toast.error('Failed to fetch seller data.');
     
      }
    };

    if (user?.id) {
      fetchSellerData();
    }
  }, [user]);
  
  return (
    <header className="bg-[#6C4A34] text-white px-4 md:px-6 py-3 flex justify-between items-center shadow sticky top-0 z-50">
      {/* Logo */}
      <Icon name="Logo" height="50px" width="55px" className="shrink-0" />

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-5 text-sm xl:text-base font-medium">
        {navLinks.map((item, idx) => (
          <React.Fragment key={item.label}>
            <NavItem
              label={item.label}
              onClick={item.onClick}
              withDropdown={item.withDropdown}
              dropdownItems={item.dropdownItems}
              enableDynamicNested={true}
            />

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

    
      
<img
  ref={avatarRef}
  onClick={() => setDesktopDropdownOpen(prev => !prev)}
  className="w-10 h-10  rounded-full cursor-pointer hidden lg:block"
  src={fetchedData?.sellerimage}
  alt="User dropdown"
/>

{desktopDropdownOpen && (
  <div
    ref={dropdownRef}
    className="absolute  right-4 top-14 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44"
  >
    <div className=" py-3 px-6 font-bold text-sm text-gray-900 ml-4 flex items-center ">
      
      <div>{fetchedData.sellerName||""}</div>
    </div>
    <ul className="py-2 text-sm text-gray-700">
      <li>
        <Link
          to="/seller/profile"
          onClick={() => setDropdownOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
        >
       <User/>
       <span>Profile</span> 
        </Link>
      </li>
      
    </ul>
    <div className=" p-4S flex items-center gap-[-20px]">
      
      <button
        onClick={() => {
          setDropdownOpen(false);
          handleLogout();
        }}
        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
      >
        <Logout className={"  pl-1.5"}/>Sign out
        
      </button>
      
    </div>
  </div>
)}




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
              dropdownItems={item.dropdownItems}
              enableDynamicNested={true}
            />
          ))}
         <div className="relative flex justify-start">
  <img
    ref={avatarRef}
    onClick={() => setMobileDropdownOpen(prev => !prev)}
    className="w-10 h-10 rounded-full cursor-pointer border border-white"
    src={fetchedData.sellerimage}
    alt="User dropdown"
  />

  {mobileDropdownOpen && (
    <div
      ref={mobileDropdownRef}
      className="absolute left-0 top-8 mt-2 w-44 bg-white rounded-lg shadow divide-y divide-gray-100 text-gray-700 z-50"
    >
      <div className="px-4 py-3 text-sm">
        <div className="font-medium text-gray-900">{fetchedData.sellerName || ''}</div>
      </div>
      <ul className="py-1 text-sm">
        <li>
          <Link
          to="/seller/profile"
          onClick={() => setDropdownOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
        >
       <User/>
       <span>Profile</span> 
        </Link>
        </li>
      </ul>
      <div className="py-1">
         <button
        onClick={() => {
          setDropdownOpen(false);
          handleLogout();
        }}
        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
      >
        <Logout className={"  pl-1.5"}/>Sign out
        
      </button>
      </div>
    </div>
  )}
</div>

        </div>
      )}
      {isLogOut && (
        <LogOutConfirmationModal onCancel={() => setIslogOut(false)} onConfirm={confirmLogOut} />
      )}
    </header>
  );
};

const Divider = () => <span className="text-white/50 select-none hidden xl:inline">|</span>;

export default SellerHeader;