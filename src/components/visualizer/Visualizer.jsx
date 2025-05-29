import React, { useState, useEffect, useRef } from 'react';
// import Logo from '../common/Logo';
import { ChevronLeft, Heart } from 'lucide-react';
import { TIELS } from '@/utils/constants';
import downloadIcon from '../../assets/download-icon.svg';
import addCatelogIcon from '../../assets/addCatelog-icon.svg';
import roomIcon from '../../assets/room-icon.svg';
import squear from '../../assets/squear.svg';

// Enhanced SearchDropdown Component
const SearchDropdown = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Sample suggestions with icon options
  const suggestions = [
    { text: 'Tiles One', icon: '🏠' },
    { text: 'Tiles Two', icon: '🛁' },
    { text: 'Tiles Three', icon: '🏢' },
    { text: 'Ceramic Tiles', icon: '🧱' },
    { text: 'Marble Tiles', icon: '✨' },
    { text: 'Porcelain Tiles', icon: '🌟' },
  ];

  // Filter suggestions based on search term
  const filteredSuggestions = searchTerm
    ? suggestions.filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
    : suggestions;

  const handleFocus = () => {
    setIsDropdownOpen(true);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // We'll handle closing the dropdown in the click outside handler
  };

  const handleSearch = e => {
    setSearchTerm(e.target.value);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const handleSuggestionClick = suggestion => {
    setSearchTerm(suggestion.text);
    setIsDropdownOpen(false);

    // Create a ripple effect when clicking a suggestion
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    dropdownRef.current.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Search input */}
      <div
        className={`relative bg-white rounded-lg transition-all duration-300 shadow-lg ${
          isFocused ? 'border-2 border-blue-500 shadow-blue-300/30' : 'border border-gray-300'
        }`}
      >
        <div className="flex items-center">
          <span
            className={`pl-3 font-medium transition-colors duration-300 ${
              isFocused ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            Tiles
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full py-3 px-3 text-gray-800 bg-transparent focus:outline-none transition-all"
            placeholder=""
          />
          <div className={`pr-3 transition-transform duration-300 ${isFocused ? 'scale-110' : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`h-6 w-6 transition-colors duration-300 ${
                isFocused ? 'text-blue-500' : 'text-amber-800 opacity-70'
              }`}
              fill="currentColor"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Dropdown suggestions with animation */}
      <div
        ref={dropdownRef}
        className={`absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden transition-all duration-300 origin-top ${
          isDropdownOpen && filteredSuggestions.length > 0
            ? 'opacity-100 scale-y-100 max-h-[300px]'
            : 'opacity-0 scale-y-0 max-h-0'
        }`}
      >
        {filteredSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="relative px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 text-gray-800 transition-all duration-200 flex items-center group"
            onMouseDown={() => handleSuggestionClick(suggestion)}
          >
            <span className="mr-2 transform group-hover:scale-110 transition-transform duration-200">
              {suggestion.icon}
            </span>
            <span className="group-hover:text-blue-600 transition-colors duration-200">
              {suggestion.text}
            </span>
            <span className="absolute right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200 text-blue-500">
              →
            </span>
          </div>
        ))}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .ripple {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          transform: scale(0);
          animation: ripple 0.6s linear;
          z-index: -1;
        }

        @keyframes ripple {
          to {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const TileVisualizer = () => {
  // State for selected tile
  // Assuming tiles is passed in as props or defined above
  const [selectedTileIndex, setSelectedTileIndex] = useState(null);
  const [likedTiles, setLikedTiles] = useState(TIELS.length >= 2 ? [TIELS[0].id, TIELS[1].id] : []);

  // Room visualization image
  const roomImage =
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1974&auto=format&fit=crop';

  return (
    <div className="flex flex-col w-full h-screen bg-gray-900 text-white">
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-72 bg-gray-100 text-gray-800 flex flex-col">
          {/* Logo */}
          <div className="flex justify-center items-center py-4 px-2 bg-white">
            {/* <Logo /> */}
          </div>

          {/* Enhanced Search Dropdown - REPLACED HERE */}
          <div className="p-2 bg-gray-200">
            <SearchDropdown />
          </div>

          {/* Tile list */}
          <div className="flex-1 overflow-y-auto">
            {TIELS.map((tile, index) => (
              <div
                key={tile.id}
                className={`m-3 bg-white rounded shadow-sm overflow-hidden ${
                  selectedTileIndex === index ? 'ring-2 ring-[#6F4E37]' : ''
                }`}
                onClick={() => setSelectedTileIndex(index)}
              >
                <div className="flex p-2">
                  <div className="w-16 h-16 flex-shrink-0 relative">
                    <img
                      src={tile.thumbnail}
                      alt={tile.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Centered Heart Icon */}
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        setLikedTiles(prev =>
                          prev.includes(tile.id)
                            ? prev.filter(id => id !== tile.id)
                            : [...prev, tile.id]
                        );
                      }}
                    >
                      <Heart
                        height={20}
                        width={20}
                        color={likedTiles.includes(tile.id) ? 'red' : 'gray'}
                      />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xs font-bold text-gray-800">{tile.name}</h3>
                    <p className="text-xs text-gray-600">Size: {tile.size}</p>
                    <p className="text-xs text-gray-600">{tile.finish}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main visualization area */}
        <div className="flex-1 flex flex-col">
          {/* Top toolbar */}
          <div className="bg-white text-gray-800 p-[15px] flex items-center justify-between border-b">
            {/* Back button */}
            <div className="flex items-center cursor-pointer">
              <button className="flex items-center justify-center w-8 h-8 bg-[#6F4E37] hover:bg-[#6F4E37] rounded">
                <ChevronLeft className="text-white cursor-pointer" />
              </button>
              <span className="ml-2 text-sm font-medium">Back</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 cursor-pointer">
              <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded text-sm">
                <span className="mr-2">
                  <img src={downloadIcon} alt="download" />
                </span>
                <span>Download</span>
              </button>
              <button className="flex items-center px-3 py-2 bg-[#6F4E37] text-white rounded text-sm">
                <span className="mr-2">
                  <img src={addCatelogIcon} alt="addCatelogIcon" />
                </span>
                Add Catalog
              </button>
              <button className="flex items-center px-3 py-2 bg-[#6F4E37] text-white rounded text-sm">
                <span className="mr-2">
                  <img src={roomIcon} alt="roomIcon" />
                </span>
                Change Room
              </button>
              <button className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded">
                <img src={squear} alt="squear" />
              </button>
            </div>
          </div>

          {/* Room visualization */}
          <div className="flex-1 p-2 bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-gray-100 relative rounded-lg overflow-hidden">
              <img
                src={roomImage}
                alt="Living room visualization"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TileVisualizer;
