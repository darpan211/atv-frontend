import { useState, useEffect, useRef, use } from 'react';
import { ChevronLeft, Heart, Menu, X, EllipsisVertical, Layers, RefreshCcw, LayoutGrid, ShoppingBag, PanelsTopLeft, FlipHorizontal, Settings, List, Ungroup, Grid3x3, BrickWall, Trash2, ChevronsLeftRight } from 'lucide-react';
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
import DemoRoom from './DemoRoom'
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
            <LayoutGrid className='font-bold' />
          </span>
          <span className='font-bold'>Floors</span>
        </button>
        <button className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[103px] sm:min-w-[103px] lg:min-w-[103px]">
          <span className="mr-2 flex-shrink-0">
            <Ungroup className='font-bold' />
          </span>
          <span className='font-bold'>Walls</span>
        </button>
        <button className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[103px] sm:min-w-[103px] lg:min-w-[103px]">
          <span className="mr-2 flex-shrink-0">
            <Grid3x3 className='font-bold' />
          </span>
          <span className='font-bold'>Paint</span>
        </button>
      </div>
      <div className="flex gap-2.5">
        <div
          className={`relative flex-1 rounded-lg transition-all duration-300 shadow-lg ${isFocused ? 'shadow-blue-300/30' : ''
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
                className={`pl-3 font-medium transition-colors duration-300 text-sm ${isFocused ? 'text-[#6F4E37]' : 'text-gray-700'
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
            className={`flex items-center justify-center h-[50px] w-[50px] rounded-l-md cursor-pointer ${viewMode === 'grid' ? 'bg-[#6F4E37] text-white' : 'bg-white text-black'
              }`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="font-bold" />
          </span>
          <span
            className={`flex items-center justify-center h-[50px] w-[50px] rounded-r-md cursor-pointer ${viewMode === 'list' ? 'bg-[#6F4E37] text-white' : 'bg-white text-black'
              }`}
            onClick={() => setViewMode('list')}
          >
            <List className="font-bold w-5 h-5" strokeWidth={2} />
          </span>
        </div>
      </div>

      <div
        ref={dropdownRef}
        className={`absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${isDropdownOpen && filteredSuggestions.length > 0
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

const TileCard = ({
  tile,
  index,
  isSelected,
  onTileClick,
  onToggleLike,
  isLiked,
  isListView = false,
}) => {
  const [data, setData] = useState(null);
  const [image, setImage] = useState('');
  const [showProduct, setShowProducts] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const id = '686fb0c04f0fff9e6db151d8';
    const fetchTile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/tiles/gettiles/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const parsed = await res.json();
        const tileData = parsed?.data;
        setData(tileData);
        setImage(tileData?.tiles_image || '');
      } catch (err) {
        console.error('Error fetching tile:', err);
      }
    };
    fetchTile();
  }, []);
  const tileToShow = data || tile;
  const cardBorder = !isListView && isSelected ? 'border-[#6F4E37]' : 'border-white';
  const listViewStyle = isListView === false ? "bg-none border-none shadow-none" : `bg-white ${cardBorder}  shadow hover:shadow-md`

  return (
    <div
      className={`relative flex border-1 rounded-lg overflow-hidden transition-all cursor-pointer ${listViewStyle} hover:ring-2 hover:ring-[#6F4E37] hover:scale-[1.01]`}
      onClick={() => !isListView && onTileClick(tileToShow, index)} // Disable click if list view
    >
      {/* Image Section */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <img
          src={image || tileToShow.thumbnail}
          alt={tileToShow.tiles_name}
          className="w-full h-full object-cover"
        />
        <button
          className="absolute top-1 right-1 z-10 flex items-center bg-white/90 backdrop-blur-sm rounded-full w-6 h-6 justify-center shadow hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(tileToShow.id);
          }}
        >
          <Heart size={16} color={isLiked ? 'red' : 'gray'} fill={isLiked ? 'red' : 'none'} />
        </button>
      </div>

      {/* Info Section */}
      {isListView === true &&
        <div className="flex flex-col justify-between p-3 flex-grow">
          <div>
            <h3 className="text-sm font-semibold truncate max-w-[12rem]">
              {tileToShow.tiles_name || 'Untitled'}
            </h3>
            <p className="text-xs text-gray-600">
              {tileToShow.material?.join(', ') || 'Material N/A'}
            </p>
            {Array.isArray(tileToShow.size) && tileToShow.size.length > 1 && (
              <p className="text-xs text-[#6F4E37]">{tileToShow.size.length} Sizes</p>
            )}
          </div>

          <div className="flex justify-end items-center mt-2">
            {tileToShow.status !== 'out-of-stock' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to cart logic (placeholder)
                }}
              >
                <ShoppingBag size={18} className="text-black hover:text-[#6F4E37]" />
              </button>
            )}
          </div>

          {/* More Info - Only if not in list view and selected */}
          {!isListView && isSelected && (
            <div className="mt-2">
              <hr className="my-2 border-t border-gray-200" />
              <div className="flex items-center justify-between text-sm text-[#6F4E37] font-medium">
                <button onClick={() => setShowProducts(true)}>
                  <span>More Product Detail</span>
                </button>
                <span className="text-lg">→</span>
              </div>
            </div>
          )}
        </div>
      }
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
      <div className="bg-[#e0dcda] flex items-center justify-between px-10 pt-6 pb-3 text-black">
        <h3 className="text-3xl font-medium">Grout Setting</h3>
        <div className="text-2xl font-medium">{groutWidth} (mm)</div>
        <button onClick={onClose} className='hover:cursor-pointer'>
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
      className="fixed bottom-18 right-4 sm:right-6 z-50 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden w-[95%] max-w-[700px]"
    >
      {/* Header */}
      <div className="bg-[#e0dcda] flex items-center justify-between px-10 pt-4 pb-2 text-black">
        <h3 className="text-3xl font-semibold">Layout & Rotation</h3>
        <button onClick={onClose} className='hover: cursor-pointer'>
          <X size={30} />
        </button>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 px-5 py-6">
        {[...Array(16)].map((_, index) => (
          <div
            key={index}
            className="aspect-square border flex items-center justify-center hover:border-[#6F4E37] transition hover:cursor-pointer"
          >
            <BrickWall
              className="w-full h-full text-gray-600"
              style={{ transform: `rotate(${rotation}deg)` }}
              strokeWidth={1.2}
            />
          </div>
        ))}
      </div>

      {/* Rotation Controls */}
      <div className="px-30 py-4 border border-gray-200 flex flex-wrap gap-4 justify-center">
        {rotationOptions.map((angle) => (
          <label
            key={angle}
            className={`flex items-center justify-between gap-4 pl-4 pr-6 py-2 border rounded-full min-w-[120px] transition cursor-pointer ${rotation === angle
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
        const res = await fetch(`${BASE_URL}/api/v1/tiles/gettiles/${id}`, {
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
    `flex items-center cursor-pointer justify-center px-1 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 border border-gray-300 rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[103px] ${selectedCategory === category ? 'bg-[#6F4E37] text-white' : 'bg-white text-black'
    }`;

  return (
    <div className='fixed bottom-25 right-10 z-50 bg-white h-100 rounded-lg shadow-lg border border-gray-200 overflow-hidden w-[95%] max-w-[400px]'>
      {/* Header */}
      <div className='bg-[#f1e5dc] flex items-center justify-between px-4 pt-4 pb-2 text-black'>
        <h3 className='text-3xl text-semibold'>Selected Product</h3>
        <button onClick={onClose} className='hover:cursor-pointer'>
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

const Product = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);
  const [image, setImage] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!isOpen) return;

    const id = '686fb0c04f0fff9e6db151d8';

    const fetchtile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/tiles/gettiles/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const parsed = await res.json();
        const tile = parsed?.data;

        setData([tile]);
        setImage(tile?.tiles_image || '');
      } catch (err) {
        console.error('Error fetching tile:', err);
      }
    };

    fetchtile();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 px-4">
      {/* Product Card */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#e6d1c3] text-black flex justify-between items-center px-5 py-4">
          <h3 className="text-2xl font-semibold">Product</h3>
          <button onClick={onClose} className='hover:cursor-pointer'>
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[75vh]">
          {data.map((item, index) => (
            <div key={index} className="p-10">
              <div className="flex gap-8 ">
                <img
                  src={item.tiles_image}
                  alt="Tile"
                  className="w-28 h-42 object-cover rounded-lg border-1 border-solid-2 p-1"
                />
                <div className="flex flex-col justify-start text-sm">
                  <h4 className="font-semibold text-black mb-1">{item.tiles_name}</h4>
                  <p className="text-gray-600 leading-snug line-clamp-4">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-black mb-1">Specifications</h5>
                <p className="text-sm text-gray-700">
                  <strong>Application Type:</strong> {item.category}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Surface:</strong> {item.material.join(", ")}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Size:</strong> {item.size?.join(", ") || '800 x 1600 CM'} CM
                </p>
              </div>

              {/* Add to Cart */}
              <div className="mt-4 flex justify-center">
                <button className="bg-[#6F4E37] text-white text-sm px-6 py-2 rounded shadow hover:bg-[#553b2d] transition hover:cursor-pointer">
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outside Navigation Footer */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button className="bg-white text-[#6F4E37] border border-[#6F4E37] px-4 py-4 rounded-md shadow-sm hover:bg-gray-100 hover:cursor-pointer">
          <svg width="19" height="35" viewBox="0 0 19 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.20215 18.6445C0.59968 18.0111 0.59968 16.9889 1.20215 16.3555L15.5859 1.23047L15.5869 1.23047C16.1962 0.590172 17.1887 0.590086 17.7979 1.23047C18.4003 1.86394 18.4003 2.88605 17.7979 3.51953L4.50098 17.5L17.7979 31.4805C18.4003 32.1139 18.4003 33.1361 17.7979 33.7695C17.1886 34.41 16.1951 34.4101 15.5859 33.7695L1.20215 18.6445Z" fill="#6F4E37" stroke="#6F4E37" stroke-width="0.5" />
          </svg>

        </button>
        <button className="bg-white text-[#6F4E37] border border-[#6F4E37] px-4 py-4 rounded-md shadow-sm hover:bg-gray-100 hover:cursor-pointer">
          <svg width="19" height="35" viewBox="0 0 19 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.7979 16.3555C18.4003 16.9889 18.4003 18.0111 17.7979 18.6445L3.41406 33.7695L3.41308 33.7695C2.80384 34.4098 1.81131 34.4099 1.20215 33.7695C0.59968 33.1361 0.59968 32.1139 1.20215 31.4805L14.499 17.5L1.20215 3.51953C0.599681 2.88605 0.599682 1.86394 1.20215 1.23047C1.81138 0.589992 2.80487 0.589926 3.41406 1.23047L17.7979 16.3555Z" fill="#6F4E37" stroke="#6F4E37" stroke-width="0.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const TileVisualizer = () => {
  const [selectedTileIndex, setSelectedTileIndex] = useState(0);
  const [likedTiles, setLikedTiles] = useState(TIELS.length >= 2 ? [TIELS[0].id, TIELS[1].id] : []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [menuData] = useState(["Store Locate", "Share & Download", "Share Link", "Share via Facebook", "Share via Whatsapp", "Full Screen", "Product calculator", "Product Calculator", "Product History", "Exit"]);
  const [viewMode, setViewMode] = useState('grid');
  const [showGroutPopup, setShowGroutPopup] = useState(false);
  const [groutWidth, setGroutWidth] = useState(0);
  const [showLayoutPopup, setShowLayoutPopup] = useState(false);
  const [showSettingPopup, setShowSettingPopup] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [compareImage, setCompareImage] = useState(null);
  const [isFramePopupOpen, setIsFramePopupOpen] = useState(false);
  const [showProduct, setShowProducts] = useState(false)
  const [showRoomPopup, setShowRoomPopup] = useState(false);
  const [sliderX, setSliderX] = useState(window.innerWidth / 2);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
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
  };

  useEffect(() => {
    const init = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setSliderX(width / 2);
      }
    };
    init();
    window.addEventListener("resize", init);
    return () => window.removeEventListener("resize", init);
  }, []);

  // Handle dragging
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handleWheel = (e) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(0.5, scale - e.deltaY * 0.001), 4);
    setScale(newScale);
  };

  // Add event listener with passive: false
  container.addEventListener('wheel', handleWheel, { passive: false });

  return () => {
    container.removeEventListener('wheel', handleWheel);
  };
}, [scale]);


  // useEffect for zoom in 
  const handleWheel = (e) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(0.5, scale - e.deltaY * 0.001), 4);
    setScale(newScale);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setTranslate({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div className="flex flex-col w-full min-h-screen text-black bg-gray-50">
      <div className="flex flex-1 overflow-hidden relative">
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" />
        )}

        {/* Remove sidebar for mobile view */}
        {window.innerWidth >= 1024 && (
          <div
            ref={sidebarRef}
            className={`w-[90vw] max-w-xs sm:max-w-md sm:w-80 md:max-w-lg md:w-96 lg:w-80 xl:w-96
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
                className={`p-2 sm:p-3 lg:p-4 ${viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'
                  : 'flex flex-col gap-4'
                  }`}
              >
                {TIELS.slice(0, 4).map((tile, index) => (
                  <TileCard
                    key={tile.id}
                    tile={tile}
                    index={index}
                    isSelected={false}
                    showDetails={false}
                    onTileClick={() => { }}
                    onToggleLike={handleToggleLike}
                    isLiked={likedTiles.includes(tile.id)}
                    isListView={viewMode === "list" ? true : false}
                    className="border border-black-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Sidebar as Bottom Sheet */}
        {isMobileSidebarOpen && window.innerWidth < 1024 && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setIsMobileSidebarOpen(false)}>
            <div
              className="relative w-full bg-[#EFEFEF] rounded-t-2xl shadow-xl z-10"
              style={{ maxHeight: '80vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
              {/* Sidebar Content */}
              <div className="flex flex-col">
                <div className="flex justify-center items-center py-3 px-2 bg-[#EFEFEF]">
                  <Icon name="Logo" height="103px" width="104px" />
                </div>
                <div className="p-2 bg-[#EFEFEF]">
                  <SearchDropdown
                    onFilterClick={handleFilterClick}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                  />
                </div>
                <div className="flex-1 overflow-y-auto bg-[#EFEFEF] max-lg:mb-25 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                  <div className={`p-2 ${viewMode === 'grid' ? 'grid grid-cols-3 gap-4' : 'flex flex-col gap-4'}`}>
                    {TIELS.slice(0, 4).map((tile, index) => (
                      <TileCard
                        key={tile.id}
                        tile={tile}
                        index={index}
                        isSelected={false}
                        showDetails={false}
                        onTileClick={() => { }}
                        onToggleLike={handleToggleLike}
                        isLiked={likedTiles.includes(tile.id)}
                        isListView={viewMode === "list" ? true : false}
                        className="border border-black-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showGroutPopup &&
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
            onClick={() => setShowGroutPopup(false)}
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

        {showLayoutPopup &&
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
            onClick={() => setShowLayoutPopup(false)}
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
          <div className="bg-[#EFEFEF] text-gray-800 p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-300 mx-2 sm:mx-3 lg:mx-4 mt-2 sm:mt-2 lg:mt-0 rounded-lg shadow-lg gap-3 sm:gap-4">
            <div
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
              <button className="flex cursor-pointer items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-[#6F4E37] hover:bg-[#5a3e2a] rounded transition-colors duration-200">
                <ChevronLeft className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>
              <span className="text-sm font-medium">Back</span>
            </div>
            <div className="flex justify-between flex-wrap xs:flex-row sm:flex-row gap-0 sm:gap-1 w-full sm:w-auto">
              <button className="sm:flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 rounded text-xs sm:text-sm lg:text-base hover:bg-gray-50 transition-colors duration-200 lg:min-w-[140px]">
                <span className="mr-2 max-sm:block max-sm:items-center max-sm:mr-0 flex-shrink-0">
                  <img
                    src={downloadIcon || '/placeholder.svg?height=16&width=16'}
                    alt="download"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    crossOrigin="anonymous"
                  />
                </span>
                <span className='hidden sm:inline'>Download</span>
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
              <button
                onClick={() => setShowRoomPopup(true)}
                className="flex cursor-pointer items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-[#6F4E37] hover:bg-[#5a3e2a] text-white rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[130px] sm:min-w-[140px] lg:min-w-[150px]"
              >
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
              {showRoomPopup && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
                  {/* Overlay click to close */}
                  <div
                    className="absolute inset-0"
                    onClick={() => setShowRoomPopup(false)}
                  />

                  {/* Popup content with animation */}
                  <div
                    className={`relative w-full bg-white  shadow-xl z-10 transform transition-transform duration-300 ${showRoomPopup ? 'translate-y-0' : 'translate-y-full'
                      }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close button */}
                    <button
                      className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                      onClick={() => setShowRoomPopup(false)}
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* DemoRoom component */}
                    <div className="p-6 max-h-[100vh] overflow-y-auto">
                      <DemoRoom onClose={() => setShowRoomPopup(false)} />
                    </div>
                  </div>
                </div>
              )}
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200 min-w-[43px] sm:min-w-[91px] h-43px cursor-pointer"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <span className="flex-shrink-0">
                    <EllipsisVertical className="w-[31px] h-[31px]" strokeWidth={2} />
                  </span>
                  <span className="hidden sm:inline text-lg font-bold">Menu</span>
                </button>
                {openMenu && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-[216px] h-[335px] z-50"
                  >
                    {menuData.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-1 hover:bg-gray-100 cursor-pointer border-b"
                        onClick={() => setOpenMenu(false)}
                      >
                        <span className="text-gray-500">-</span>
                        <span className="ml-1 font-semibold">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Image Display Area */}
          <div className="flex-1  p-1 sm:p-4 md:p-5 overflow-hidden">
            {isComparing ? (
              <div
                ref={containerRef}
                className="relative w-full max-w-[95vw] mx-auto h-full max-h-[70vh]"
              >
                <div className="absolute inset-0 flex gap-2">
                  {/* Left Image */}
                  <div
                    className="h-full overflow-hidden"
                    style={{ width: sliderX }}
                  >
                    <img
                      src={roomImage || '/placeholder.svg'}
                      alt="Current room visualization"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>

                  {/* Divider */}
                  <div
                    className="absolute top-0 bottom-0 w-0 flex items-center justify-center z-10"
                    style={{ left: sliderX, transform: "translateX(-50%)" }}
                  >
                    <button
                      onMouseDown={() => setIsDragging(true)}
                      className="bg-[#f5f3f1] text-white p-2 border-4 border-solid-2 rounded border-white shadow-lg hover:scale-105 transition-all duration-200 hover:cursor-col-resize"
                    >
                      <div className="flex">
                        <svg
                          width="10"
                          height="18"
                          viewBox="0 0 12 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.61825 0.493581L3.85057 5.46389L0.924574 8.49877C-0.308191 9.78393 -0.308191 11.8742 0.924574 13.1594L8.61825 21.18C9.62823 22.2329 11.3511 21.4742 11.3511 20.0033V11.3168V1.67035C11.3511 0.183905 9.62823 -0.55932 8.61825 0.493581Z"
                            fill="#292D32"
                          />
                        </svg>
                        <svg
                          width="10"
                          height="18"
                          viewBox="0 0 12 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.32902 0.493581L8.0967 5.46389L11.0227 8.49877C12.2555 9.78393 12.2555 11.8742 11.0227 13.1594L3.32902 21.18C2.31904 22.2329 0.596137 21.4742 0.596137 20.0033V11.3168V1.67035C0.596137 0.183905 2.31904 -0.55932 3.32902 0.493581Z"
                            fill="#292D32"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>

                  {/* Right Image */}
                  <div
                    className="h-full overflow-hidden"
                    style={{ width: `calc(100% - ${sliderX}px)` }}
                  >
                    <img
                      src={compareImage || '/placeholder.svg'}
                      alt="Comparison room visualization"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bg-white bottom-0 left-1/2 w-110 h-20 rounded-2xl justify-between transform -translate-x-1/2 flex items-center gap-6 px-6">
                  <button className="bg-[#6F4E37] text-white w-30 h-12 rounded shadow-md border border-gray-200 hover:bg-[#5a3e2d]">
                    Left
                  </button>

                  <button
                    className="flex items-center justify-center bg-white border border- shadow w-10 h-10 hover:cursor-pointer"
                    onClick={() => setIsFramePopupOpen(true)}
                  >
                    <X className="w-5 h-5 text-black" />
                  </button>

                  <button className="bg-[#6F4E37] text-white w-30 h-12 rounded shadow-md border border-gray-200 hover:bg-[#5a3e2d]">
                    Right
                  </button>
                </div>
              </div>
            ) : (
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full max-w-[95vw] mx-auto h-full max-h-[70vh] overflow-hidden relative cursor-grab active:cursor-grabbing"
                  style={{
                    touchAction: 'none',
                  }}
              >
                <img
                  src={roomImage || '/placeholder.svg'}
                  alt="Room visualization"
                  crossOrigin="anonymous"
                  className="select-none pointer-events-none absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(-50%, -50%) scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                    transformOrigin: 'center center',
                    transition: dragging ? 'none' : 'transform 0.1s ease-out',
                  }}
                />
              </div>
            )}
          </div>
          {/* Frame Selection Popup */}
          {isFramePopupOpen && !showProduct && (
            <div
              className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
              onClick={() => setIsFramePopupOpen(false)} // click outside closes modal
            >
              <div
                className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()} // click inside does NOT close modal
              >
                {/* Header */}
                <div className="bg-[#6F4E37] text-white py-4 px-6 rounded-t-xl text-start">
                  <h2 className="text-xl font-semibold">Select a Frame to Continue</h2>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-700 mb-6">
                    Choose a frame for your tile layout. Select either left or right frame option below.
                  </p>

                  <div className="flex justify-center gap-6">
                    <button
                      className="bg-[#6F4E37] text-white px-5 py-2 rounded hover:bg-[#5a3e2d] transition"
                    >
                      Left Frame
                    </button>
                    <button
                      className="bg-[#6F4E37] text-white px-5 py-2 rounded hover:bg-[#5a3e2d] transition"
                    >
                      Right Frame
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showProduct && (
            <div
              className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center"
              onClick={() => {
                setShowProducts(false);
                setIsFramePopupOpen(false);
              }}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <Product isOpen={showProduct} onClose={() => {
                  setShowProducts(false);
                  setIsFramePopupOpen(false);
                }} />
              </div>
            </div>
          )}
          <div className="sticky bottom-0 z-10 bg-white shadow-lg pb-0 sm:pb-0 md:pb-0 lg:pb-0 xl:pb-0">
            <div className="bg-[#EFEFEF] text-gray-800 p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-300 mx-2 sm:mx-3 lg:mx-4 mt-14 sm:mt-16 lg:mt-0 rounded-lg shadow-lg gap-3 sm:gap-4 max-[1024px]:mb-50 max-[1024px]:bg-[#FFFFFF] max-[1024px]:border-b-0 max-[1024px]:shadow-none">
              {window.innerWidth > 1024 &&
                <div
                  className="hidden md:flex items-center gap-2 sm:gap-3 cursor-pointer"
                  onClick={() => setShowProducts(true)}
                >
                  <button className="flex cursor-pointer items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11">
                    <Layers className="w-6 h-6 bg-white shadow-down" />
                  </button>
                  <div className='flex flex-col'>
                    <span className="text-sm">Company Name</span>
                    <span className="text-sm font-bold">Monalisa onyx AQUA GMYK</span>
                  </div>
                </div>
              }
              <div className="flex flex-wrap max-sm:flex-nowrap xs:flex-row sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto max-sm:w-[365px] max-sm:overflow-x-auto">
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    setIsSidebarOpen(false);
                    setOpenMenu(false);
                    setShowGroutPopup(false);
                    setShowLayoutPopup(false);
                    setShowSettingPopup(false);
                    setIsFramePopupOpen(false);
                    setShowProducts(false);
                    if (containerRef.current) {
                      const width = containerRef.current.offsetWidth;
                      setSliderX(width / 2);
                    }
                  }}
                  className="flex cursor-pointer items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base hover:bg-gray-50 transition-colors duration-200 min-w-[120px] sm:min-w-[130px] lg:min-w-[140px]"
                >
                  <span className="mr-2 flex-shrink-0">
                    <RefreshCcw className="font-bold" />
                  </span>
                  <span className="font-bold">Reset</span>
                </button>

                <button
                  onClick={() => setShowGroutPopup(true)}
                  className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[120px] sm:min-w-[130px] lg:min-w-[140px]"
                >
                  <span className="mr-2 flex-shrink-0">
                    <LayoutGrid className='font-bold' />
                  </span>
                  <span className='font-bold'>Grout</span>
                </button>
                <div className="flex items-center gap-1 border border-gray-300 bg-white rounded">
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
                <button
                  onClick={() => {
                    setIsComparing(!isComparing);
                    if (!isComparing) {
                      // Set the current image as the comparison image
                      setCompareImage(roomImage);
                    }
                  }}
                  className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[120px] sm:min-w-[130px] lg:min-w-[140px]"
                >
                  <span className="mr-2 flex-shrink-0">
                    <FlipHorizontal className='w-5 h-5 font-bold' />
                  </span>
                  <span className='font-bold'>Compare</span>
                </button>
              </div>
            </div>
          </div>

          {/* New mobile bottom bar - pixel perfect as screenshot */}
          <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-2xl shadow flex items-center justify-between px-4 py-3 pb-5" style={{ boxShadow: '0 -2px 16px rgba(0,0,0,0.08)' }}>
            {/* Left: Icon and text */}
            <div className="flex items-center gap-2">
              <span className="bg-white rounded p-1 border border-gray-200"><Layers className="w-6 h-6 text-[#6F4E37]" /></span>
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-gray-700">Company Name</span>
                <span className="text-sm font-bold text-black max-w-[120px] truncate">{TIELS[0]?.tiles_name || 'Monalisa onyx AQUA GMYK'}</span>
              </div>
            </div>
            {/* Center: Floating grid/list toggle */}
            <div className="absolute left-1/2 -top-6 transform -translate-x-1/2 z-10">
              <button
                className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center border-2 border-[#EFEFEF]"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsMobileSidebarOpen(true);
                  } else {
                    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
                  }
                }}
              >
                <LayoutGrid className="w-7 h-7 text-[#6F4E37]" />
              </button>
            </div>
            {/* Right: Search and Filter buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button className="w-10 h-10 flex items-center justify-center bg-[#6F4E37] rounded-lg" style={{ color: 'white' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-[#6F4E37] rounded-lg" style={{ color: 'white' }} onClick={handleFilterClick}>
                <Icon name="Filter" width="20px" height="20px" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TileVisualizer