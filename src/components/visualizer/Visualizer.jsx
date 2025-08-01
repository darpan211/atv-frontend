import { useState, useEffect, useRef, use } from 'react';
import { ChevronLeft, Heart, Menu, X, EllipsisVertical, Layers, RefreshCcw, LayoutGrid, PanelsTopLeft, FlipHorizontal, Settings, List, Ungroup, Grid3x3,BrickWall,Trash2 } from 'lucide-react';
import { TIELS } from '@/utils/constants';
import downloadIcon from '../../assets/download-icon.svg';
import addCatelogIcon from '../../assets/addCatelog-icon.svg';
import roomIcon from '../../assets/room-icon.svg';
import squear from '../../assets/squear.svg';
import filterIcon from '../../assets/Filter.png';
import { Icon } from '../common/icons';
import FilterPopup from './FilterPopup';
import { Input } from '../ui/input';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SearchDropdown = ({ onFilterClick, viewMode, setViewMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const suggestions = [
    { text: 'Tiles One', icon: '🏠' },
    { text: 'Tiles Two', icon: '🛁' },
    { text: 'Tiles Three', icon: '🏢' },
    { text: 'Ceramic Tiles', icon: '🧱' },
    { text: 'Marble Tiles', icon: '✨' },
    { text: 'Porcelain Tiles', icon: '🌟' },
  ];

  const filteredSuggestions = searchTerm
    ? suggestions.filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
    : suggestions;

  const handleFocus = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      setIsFocused(false);
    } else {
      setIsDropdownOpen(true);
      setIsFocused(true);
    }
  };

  const handleBlur = () => setIsFocused(false);

  const handleSearch = e => {
    setSearchTerm(e.target.value);
    if (!isDropdownOpen) setIsDropdownOpen(true);
  };

  const handleSuggestionClick = suggestion => {
    setSearchTerm(suggestion.text);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchContainerClick = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      setIsFocused(false);
    } else {
      setIsDropdownOpen(true);
      setIsFocused(true);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="flex h-[50px] w-auto text-white p-1 rounded-lg items-center justify-center mb-2 gap-2">
        <button className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[103px] sm:min-w-[103px] lg:min-w-[103px]">
          <span className="mr-2 flex-shrink-0">
            <LayoutGrid className='font-bold'/>
          </span>
          <span className='font-bold'>Floors</span>
        </button>
        <button className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[103px] sm:min-w-[103px] lg:min-w-[103px]">
          <span className="mr-2 flex-shrink-0">
            <Ungroup className='font-bold'/>
          </span>
          <span className='font-bold'>Walls</span>
        </button>
        <button className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[103px] sm:min-w-[103px] lg:min-w-[103px]">
          <span className="mr-2 flex-shrink-0">
            <Grid3x3 className='font-bold'/>
          </span>
          <span className='font-bold'>Paint</span>
        </button>
      </div>
      <div className="flex gap-2.5"> 
        <div
          className={`relative flex-1 rounded-lg transition-all duration-300 shadow-lg ${
            isFocused ? 'shadow-blue-300/30' : ''
          }`}
        >
          <div className='flex gap-1'>
            <div
              className="bg-[#6F4E37] h-[50px] w-[50px] p-3 rounded-lg cursor-pointer hover:bg-[#5a3e2a] flex items-center justify-center"
              onClick={onFilterClick}
            >
              <Icon name="Filter" width="20px" height="20px" />
            </div>
            <div
              className="flex items-center bg-[#D9D9D9] rounded-lg cursor-pointer"
              onClick={handleSearchContainerClick}
            >
              <span
                className={`pl-3 font-medium transition-colors duration-300 text-sm ${
                  isFocused ? 'text-[#6F4E37]' : 'text-gray-700'
                }`}
              >
                Search...
              </span>
              <Input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full h-[50px] py-2 px-3 text-gray-800 bg-transparent focus:outline-none focus:ring-0 text-sm"
              />
              <div className="pr-3">
                <svg
                  className={`h-9 w-9 ${isFocused ? 'text-[#6F4E37]' : 'text-[#6F4E37] opacity-70'}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[50px] w-auto text-white p-1 rounded-lg items-center justify-center">
          <span
            className={`flex items-center justify-center h-[50px] w-[50px] rounded-l-md cursor-pointer ${
              viewMode === 'grid' ? 'bg-[#6F4E37] text-white' : 'bg-white text-black'
            }`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="font-bold" />
          </span>
          <span
            className={`flex items-center justify-center h-[50px] w-[50px] rounded-r-md cursor-pointer ${
              viewMode === 'list' ? 'bg-[#6F4E37] text-white' : 'bg-white text-black'
            }`}
            onClick={() => setViewMode('list')}
          >
            <List className="font-bold w-5 h-5" strokeWidth={2} />
          </span>
        </div>
      </div>

      <div
        ref={dropdownRef}
        className={`absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${
          isDropdownOpen && filteredSuggestions.length > 0
            ? 'opacity-100 scale-y-100 max-h-[300px]'
            : 'opacity-0 scale-y-0 max-h-0'
        }`}
      >
        {filteredSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="relative px-3 py-2 hover:bg-[#6f4e3717] cursor-pointer border-b border-gray-100 flex items-center group"
            onMouseDown={() => handleSuggestionClick(suggestion)}
          >
            <span className="mr-2 group-hover:scale-110 transition-transform">
              {suggestion.icon}
            </span>
            <span className="group-hover:text-[#6F4E37]">{suggestion.text}</span>
            <span className="absolute right-3 opacity-0 group-hover:opacity-100 text-[#6F4E37]">
              →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TileCard = ({ tile, index, isSelected, onTileClick, onToggleLike, isLiked }) => {
  const [image, setImage] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const id = '686fb0c04f0fff9e6db151d8';
    const fetchtile = async () => {
      const res = await fetch(`http://localhost:3010/api/v1/tiles/gettiles/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const parsed = await res.json();
      const imageUrl = parsed?.data?.tiles_image;
      setImage(imageUrl);
    };
    fetchtile();
  }, []);

  return (
    <div
      className="relative cursor-pointer rounded border-4 border-white overflow-hidden shadow hover:shadow-md transition-all"
      onClick={() => onTileClick(tile, index)}
    >
      <img
        src={image || tile.thumbnail}
        alt={tile.name}
        className="w-full h-18 object-cover"
      />

      <button
        className="absolute top-2 right-2 z-10 flex items-center bg-white/90 backdrop-blur-sm rounded-full w-6 h-6 justify-center shadow hover:bg-white"
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike(tile.id);
        }}
      >
        <Heart
          size={16}
          color={isLiked ? 'red' : 'gray'}
          fill={isLiked ? 'red' : 'none'}
        />
      </button>
    </div>
  );
};

const groutColors = [
  "#d3d3d3", "#fcdede", "#fbeacb", "#e6e0c5", "#d6e8ce", "#ccede6",
  "#dbf9f4", "#c1e7f3", "#b5cfe2", "#d0e6f8", "#ccd5f3", "#dbbcf3",
  "#c9baf3", "#f4d1ed", "#d9a9d9", "#e4f7bc", "#586457", "#5c8274",
  "#5f7449", "#8e1212", "#dc9595", "#56ffb4", "#b2dbd5", "#9f5bd7"
];

const GroutSettingsPopup = ({ isOpen, onClose, groutWidth, setGroutWidth }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-12 right-4 sm:right-6 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden w-[95%] max-w-[700px] h-auto"
    >
      {/* Header */}
      <div className="bg-[#e0dcda] flex items-center justify-between px-10 pt-4 pb-2 text-black">
        <h3 className="text-3xl font-medium">Grout Setting</h3>
        <div className="text-2xl font-medium">{groutWidth} (mm)</div>
        <button onClick={onClose}>
          <X size={30} />
        </button>
      </div>

      {/* Grout Width Slider */}
      <div className="px-4 sm:px-6 mt-4 mb-3">
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={groutWidth}
          onChange={(e) => setGroutWidth(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none bg-transparent range-slider"
        />
        <style jsx>{`
          input[type='range'].range-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 8px;
            background: linear-gradient(to right, #6F4E37 ${groutWidth * 10}%, #e5e7eb ${groutWidth * 10}%);
            border-radius: 9999px;
            cursor: pointer;
          }
          input[type='range'].range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: white;
            border: 2px solid #6F4E37;
            margin-top: -3px;
            cursor: pointer;
          }
          input[type='range'].range-slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: white;
            border: 4px solid #6F4E37;
            cursor: pointer;
          }
        `}</style>

        {/* Gray line below slider */}
        <div className="h-[2px] bg-gray-300 mt-4" />
      </div>

      {/* Grout Colors */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 px-4 sm:px-6 py-4">
        {groutColors.map((color, index) => (
          <div
            key={index}
            className="aspect-square rounded-sm border border-gray-300 cursor-pointer"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

const rotationOptions = [0, 90, 180, 270];

const LayoutPopup = ({ isOpen, onClose }) => {
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-18 right-4 sm:right-6 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden w-[95%] max-w-[700px]"
    >
      {/* Header */}
      <div className="bg-[#e0dcda] flex items-center justify-between px-10 pt-4 pb-2 text-black">
        <h3 className="text-3xl font-semibold">Layout & Rotation</h3>
        <button onClick={onClose}>
          <X size={35} />
        </button>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 px-1 py-6">
        {[...Array(16)].map((_, index) => (
          <div
            key={index}
            className="aspect-square border flex items-center justify-center hover:border-[#6F4E37] transition"
          >
            <BrickWall
              className="w-full h-full text-gray-600"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </div>
        ))}
      </div>

      {/* Rotation Controls */}
      <div className="px-30 py-4 border border-gray-200 flex flex-wrap gap-4 justify-center">
  {rotationOptions.map((angle) => (
    <label
      key={angle}
      className={`flex items-center justify-between gap-4 pl-4 pr-6 py-2 border rounded-full min-w-[120px] transition cursor-pointer ${
        rotation === angle
          ? "bg-[#6F4E37] text-white border-[#6F4E37]"
          : "bg-white text-gray-700 border-gray-300"
      }`}
    >
      <input
        type="radio"
        name="rotation"
        value={angle}
        checked={rotation === angle}
        onChange={() => setRotation(angle)}
        className="accent-[#6F4E37] w-4 h-4 cursor-pointer"
      />
      <span className="ml-auto font-medium">{angle}°</span>
    </label>
  ))}
</div>
    </div>
  );
};

const SettingPopup = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);
  const [image, setImage] = useState('');
  const token = localStorage.getItem('authToken');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const id = '686fb0c04f0fff9e6db151d8';

    const fetchtile = async () => {
      try {
        const res = await fetch(`http://localhost:3010/api/v1/tiles/gettiles/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const parsed = await res.json();
        const tile = parsed?.data;

        // Set data as array for mapping
        setData([tile]);
        setImage(tile?.tiles_image || '');
        setSelectedCategory(tile?.category || '');
      } catch (err) {
        console.error('Error fetching tile:', err);
      }
    };

    fetchtile();
  }, [isOpen]);
 console.log('data', data);
  if (!isOpen) return null;
   // Helper function for button styling
  const getButtonClasses = (category) =>
    `flex items-center cursor-pointer justify-center px-1 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 border border-gray-300 rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[103px] ${
      selectedCategory === category ? 'bg-[#6F4E37] text-white' : 'bg-white text-black'
    }`;

  return (
     <div className='fixed bottom-25 right-10 z-50 bg-white h-100 rounded-lg shadow-lg border border-gray-200 overflow-hidden w-[95%] max-w-[400px]'>
      {/* Header */}
      <div className='bg-[#6F4E37] flex items-center justify-between px-4 pt-4 pb-2 text-white'>
        <h3 className='text-3xl'>Selected Product</h3>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Category Buttons */}
      <div className="flex mt-3 p-1 rounded-lg items-center justify-center mb-2 gap-2">
        <button className={getButtonClasses('floor')}>
          <span className="mr-2 flex-shrink-0"><LayoutGrid /></span>
          <span className='font-semibold'>Floors</span>
        </button>
        <button className={getButtonClasses('wall')}>
          <span className="mr-2 flex-shrink-0"><Ungroup /></span>
          <span className='font-semibold'>Walls</span>
        </button>
        <button className={getButtonClasses('paint')}>
          <span className="mr-2 flex-shrink-0"><Grid3x3 /></span>
          <span className='font-semibold'>Paint</span>
        </button>
      </div>

      {/* Tile Info */}
   {data.map((item, index) => (
  <div
    key={index}
    className="relative w-97 flex items-start justify-between px-3 py-2 rounded border border-shadow border-gray-200"
  >
    {/* Tile Image */}
    <img
      src={item.tiles_image}
      alt={`Tile ${index}`}
      className="w-20 h-20 object-cover rounded-md border"
    />

    {/* Tile Info */}
    <div className="flex-1 mx-4 pr-10">
      <h4 className="text-base font-semibold text-gray-800">{item.tiles_name}</h4>
      <p className="text-sm text-gray-500">Size: {item.size?.[0]}</p>
      <p className="text-sm text-gray-500 truncate max-w-[200px]">{item.description}</p>
    </div>

    {/* Delete Button */}
    <button
      onClick={() => item._id}
      className="absolute bottom-2 right-2 bg-white border border-gray-300 p-1 hover:bg-gray-100 transition-colors"
    >
      <Trash2 />
    </button>
  </div>
))}


    </div>
  );
};

const TileVisualizer = () => {
  const [selectedTileIndex, setSelectedTileIndex] = useState(0);
  const [likedTiles, setLikedTiles] = useState(TIELS.length >= 2 ? [TIELS[0].id, TIELS[1].id] : []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [menuData] = useState(["Store Locate", "Share & Download", "Share Link", "Share via Facebook", "Share via Whatsapp", "Full Screen", "Product calculator", "Product Calculator", "Product History", "Exit"]);
  const [viewMode, setViewMode] = useState('grid'); // Added viewMode state here
  const [showGroutPopup, setShowGroutPopup] = useState(false);
  const [groutWidth, setGroutWidth] = useState(0);
  const [showLayoutPopup, setShowLayoutPopup] = useState(false);
  const [showSettingPopup, setShowSettingPopup] = useState(false);
  const menuRef = useRef(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  
  const roomImage = 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1974&auto=format&fit=crop';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 1024
      ) {
        const menuButton = document.querySelector('[data-menu-button]');
        if (menuButton && menuButton.contains(event.target)) {
          return;
        }
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const handleFilterClick = () => setIsFilterPopupOpen(true);
  const handleCloseFilterPopup = () => setIsFilterPopupOpen(false);

  const handleTileClick = (tile, index) => {
    setSelectedTileIndex(index);
    console.log('Tile clicked:', tile);
  };

  const handleToggleLike = tileId => {
    setLikedTiles(prev =>
      prev.includes(tileId) ? prev.filter(id => id !== tileId) : [...prev, tileId]
    );
    console.log(`Product ${tileId} ${likedTiles.includes(tileId) ? 'unliked' : 'liked'}!`);
  };

  return (
    <div className="flex flex-col w-full min-h-screen text-black bg-gray-50">
      <div className="flex flex-1 overflow-hidden relative">
        <button
          data-menu-button
          className="fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#6F4E37] hover:bg-[#5a3e2a] text-white rounded-lg shadow-lg transition-colors duration-200 lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" />}

        <div
          ref={sidebarRef}
          className={`w-[425px] max-w-sm sm:max-w-md sm:w-80 md:max-w-lg md:w-96 lg:w-80 xl:w-96
          bg-[#EFEFEF] text-gray-800 flex flex-col
          fixed lg:relative inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          h-full lg:h-auto overflow-hidden`}
        >
          <div className="flex justify-center items-center py-3 sm:py-4 lg:py-5 px-2 bg-[#EFEFEF]">
            <Icon name="Logo" height="103px" width="104px" />
          </div>

          <div className="p-2 sm:p-3 lg:p-4 bg-[#EFEFEF]">
            <SearchDropdown 
              onFilterClick={handleFilterClick}
              viewMode={viewMode} 
              setViewMode={setViewMode} 
            />
          </div>

          <div className="flex-1 overflow-y-auto bg-[#EFEFEF] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div
              className={`p-2 sm:p-3 lg:p-4 ${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'
                  : 'flex flex-col gap-4'
              }`}
            >
              {TIELS.slice(0, 4).map((tile, index) => (
                <TileCard
                  key={tile.id}
                  tile={tile}
                  index={index}
                  isSelected={selectedTileIndex === index}
                  showDetails={selectedTileIndex === index}
                  onTileClick={handleTileClick}
                  onToggleLike={handleToggleLike}
                  isLiked={likedTiles.includes(tile.id)}
                  className="border border-black-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                />
              ))}
            </div>
          </div>
        </div>
        { showGroutPopup &&
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
          onClick={() => setShowGroutPopup(false)} // Close on outside click
          >
            <div onClick={(e) => e.stopPropagation()}>
              <GroutSettingsPopup
                isOpen={showGroutPopup}
                onClose={() => setShowGroutPopup(false)}
                groutWidth={groutWidth}
                setGroutWidth={setGroutWidth}
              />
            </div>
        </div>
        }
        
        { showLayoutPopup && 
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
          onClick={() => setShowLayoutPopup(false)} // Close on outside click
        >
          <div onClick={(e) => e.stopPropagation()}>
            <LayoutPopup isOpen={showLayoutPopup} onClose={() => setShowLayoutPopup(false)} />
          </div>
        </div>
        }
       
        {showSettingPopup && (
  <div
    className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center"
    onClick={() => setShowSettingPopup(false)} // Close on outside click
  >
    {/* Stop click from closing when inside popup */}
    <div onClick={(e) => e.stopPropagation()}>
      <SettingPopup isOpen={showSettingPopup} onClose={() => setShowSettingPopup(false)} />
    </div>
  </div>
)}
        <div className="flex-1 flex flex-col bg-white min-h-screen lg:min-h-0">
          <div className="bg-[#EFEFEF] text-gray-800 p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-300 mx-2 sm:mx-3 lg:mx-4 mt-14 sm:mt-16 lg:mt-0 rounded-lg shadow-lg gap-3 sm:gap-4">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
              <button className="flex cursor-pointer items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-[#6F4E37] hover:bg-[#5a3e2a] rounded transition-colors duration-200">
                <ChevronLeft className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>
              <span className="text-sm font-medium">Back</span>
            </div>
            <div className="flex flex-wrap xs:flex-row sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button className="flex cursor-pointer items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 rounded text-xs sm:text-sm lg:text-base hover:bg-gray-50 transition-colors duration-200 min-w-[120px] sm:min-w-[130px] lg:min-w-[140px]">
                <span className="mr-2 flex-shrink-0">
                  <img
                    src={downloadIcon || '/placeholder.svg?height=16&width=16'}
                    alt="download"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    crossOrigin="anonymous"
                  />
                </span>
                <span>Download</span>
              </button>
              <button className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-[#6F4E37] hover:bg-[#5a3e2a] text-white rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[120px] sm:min-w-[130px] lg:min-w-[140px]">
                <span className="mr-2 flex-shrink-0">
                  <img
                    src={addCatelogIcon || '/placeholder.svg?height=16&width=16'}
                    alt="add catalog"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    crossOrigin="anonymous"
                  />
                </span>
                <span>Add Catalog</span>
              </button>
              <button className="flex cursor-pointer items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-[#6F4E37] hover:bg-[#5a3e2a] text-white rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[130px] sm:min-w-[140px] lg:min-w-[150px]">
                <span className="mr-2 flex-shrink-0">
                  <img
                    src={roomIcon || '/placeholder.svg?height=16&width=16'}
                    alt="room"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    crossOrigin="anonymous"
                  />
                </span>
                <span>Change Room</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200 min-w-[43px] sm:min-w-[91px] h-43px cursor-pointer" onClick={() => setOpenMenu(!openMenu)}>
                <span className="flex-shrink-0">
                  <EllipsisVertical className="w-[31px] h-[31px]" strokeWidth={2} />
                </span>
                <span className="hidden sm:inline text-lg font-bold">Menu</span>
              </button>
              {openMenu && (
                <div className="relative">
                  <div
                    ref={menuRef}
                    className="absolute right-4 top-11 bg-white border border-gray-200 rounded-lg shadow-lg w-[216px] h-[335px] z-50"
                  >
                    {menuData.map((item, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 hover:bg-gray-100 cursor-pointer border-b"
                        onClick={() => {
                          setOpenMenu(false);
                        }}
                      >
                        <span className="text-gray-500">-</span>
                        <span className="ml-1 font-semibold">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 p-3 sm:p-4 md:p-5 overflow-hidden bg-">
            <div className="items-center justify-center">
              <img
                src={roomImage || '/placeholder.svg'}
                alt="Room visualization"
                className="w-full h-full object-cover max-h-[70vh]"
                crossOrigin="anonymous"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-white mt-10 sm:mt-8 md:mt-6 min-h-screen lg:min-h-0 lg:fixed lg:bottom-0 lg:w-[1500px] lg:z-10">
            <div className="bg-[#EFEFEF] text-gray-800 p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-300 mx-2 sm:mx-3 lg:mx-4 mt-14 sm:mt-16 lg:mt-0 rounded-lg shadow-lg gap-3 sm:gap-4">
              <div className="hidden md:flex items-center gap-2 sm:gap-3 cursor-pointer">
                <button className="flex cursor-pointer items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11">
                  <Layers className="w-6 h-6 bg-white shadow-down" />
                </button>
                <div className='flex flex-col'>
                  <span className="text-sm">Company Name</span>
                  <span className="text-sm font-bold">Monalisa onyx AQUA GMYK</span>
                </div>
              </div>

              <div className="flex flex-wrap xs:flex-row sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button className="flex cursor-pointer items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base hover:bg-gray-50 transition-colors duration-200 min-w-[120px] sm:min-w-[130px] lg:min-w-[140px]">
                  <span className="mr-2 flex-shrink-0 ">
                    <RefreshCcw className='font-bold'/>
                  </span>
                  <span className='font-bold'>Reset</span>
                </button>

                <button 
                    onClick={() => setShowGroutPopup(true)}
                    className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[120px] sm:min-w-[130px] lg:min-w-[140px]"
                  >
                    <span className="mr-2 flex-shrink-0">
                      <LayoutGrid className='font-bold'/>
                    </span>
                    <span className='font-bold'>Grout</span>
                  </button>
                <div className="flex items-center gap-1 border border-gray-300 bg-white rounded overflow-hidden">
                    {/* Layout Button */}
                    <button
                      onClick={() => setShowLayoutPopup(true)}
                      className="flex items-center px-3 py-2 bg-white text-black text-sm sm:text-base font-medium cursor-pointer"
                    >
                      <PanelsTopLeft className="w-5 h-5 mr-2" />
                      <span className='font-bold'>Layout</span>
                    </button>

                    {/* Vertical Divider */}
                    <div className="w-px h-6 bg-gray-300" />

                    {/* Settings Button */}
                    <button
                      onClick={() => setShowSettingPopup(true)}
                      className="flex items-center justify-center px-3 py-2 bg-white text-black text-sm sm:text-base cursor-pointer"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>



                <button className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[120px] sm:min-w-[130px] lg:min-w-[140px]">
                  <span className="mr-2 flex-shrink-0">
                    <FlipHorizontal className='w-5 h-5 font-bold'/>
                  </span>
                  <span className='font-bold'>Compare</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TileVisualizer;