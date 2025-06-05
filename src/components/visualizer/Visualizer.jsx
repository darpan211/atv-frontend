import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Heart, Menu, X } from 'lucide-react';
import { TIELS } from '@/utils/constants'; 
import downloadIcon from '../../assets/download-icon.svg';
import addCatelogIcon from '../../assets/addCatelog-icon.svg';
import roomIcon from '../../assets/room-icon.svg';
import squear from '../../assets/squear.svg';
import filterIcon from '../../assets/Filter.png';
import { Icon } from '../common/icons'; 
import FilterPopup from './FilterPopup'; 

const SearchDropdown = ({ onFilterClick }) => {
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
    setIsDropdownOpen(true);
    setIsFocused(true);
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

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="flex gap-2.5">
        <div
          className={`relative rounded-lg transition-all duration-300 shadow-lg ${
            isFocused ? 'border-2 border-[#6F4E37] shadow-blue-300/30' : 'border border-gray-300'
          }`}
        >
          <div className="flex items-center bg-[#D9D9D9] rounded-lg">
            <span
              className={`pl-3 font-medium transition-colors duration-300 text-sm ${
                isFocused ? 'text-[#6F4E37]' : 'text-gray-700'
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
              className="w-full h-[50px] py-2 px-3 text-gray-800 bg-transparent focus:outline-none text-sm"
            />
            <div className="pr-3">
              <svg
                className={`h-5 w-5 ${isFocused ? 'text-[#6F4E37]' : 'text-[#6F4E37] opacity-70'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
          </div>
        </div>
        <div
          className="bg-[#6F4E37] h-[50px] w-[50px] p-3 rounded-lg cursor-pointer hover:bg-[#5a3e2a]"
          onClick={onFilterClick}
        >
          <img src={filterIcon} alt="filter" className="h-7 w-7" />
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

const TileVisualizer = () => {
  const [selectedTileIndex, setSelectedTileIndex] = useState(null);
  const [likedTiles, setLikedTiles] = useState(TIELS.length >= 2 ? [TIELS[0].id, TIELS[1].id] : []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  const roomImage =
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1974&auto=format&fit=crop';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterClick = () => setIsFilterPopupOpen(true);
  const handleCloseFilterPopup = () => setIsFilterPopupOpen(false);

  return (
    <div className="flex flex-col w-full min-h-screen text-black">
      <div className="flex flex-1 overflow-hidden relative">
        <button
          className="fixed top-3 left-3 z-50 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#6F4E37] hover:bg-[#5a3e2a] text-white rounded-lg shadow-lg transition-colors duration-200 lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div
          className={`w-full max-w-sm sm:max-w-md sm:w-80 md:max-w-lg md:w-96 lg:w-80 xl:w-96
          bg-[#EFEFEF] text-gray-800 flex flex-col
          fixed lg:relative inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          h-full lg:h-auto`}
        >
          <div className="flex justify-center items-center py-3 sm:py-4 lg:py-5 px-2 bg-[#EFEFEF] border-gray-300">
            <Icon name="Logo" height="50px" width="50px" />
          </div>

          <div className="p-2 sm:p-3 lg:p-4 bg-[#EFEFEF] border-gray-300">
            <SearchDropdown onFilterClick={handleFilterClick} />
          </div>

          <div className="flex-1 overflow-y-auto bg-[#EFEFEF]">
            <div className="space-y-2 sm:space-y-3 p-2 sm:p-3 lg:p-4">
              {TIELS.map((tile, index) => (
                <div
                  key={tile.id}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedTileIndex === index ? 'ring-2 ring-[#6F4E37] shadow-md' : ''
                  }`}
                  onClick={() => {
                    setSelectedTileIndex(index);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex p-2 sm:p-3 lg:p-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 relative">
                      <img
                        src={tile.thumbnail || '/placeholder.svg?height=80&width=80'}
                        alt={tile.name}
                        className="w-full h-full object-cover rounded"
                      />
                      <div
                        className="absolute -top-1 -right-1 flex items-center bg-white/90 backdrop-blur-sm rounded-full w-5 h-5 justify-center cursor-pointer shadow-sm hover:bg-white"
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
                          height={12}
                          width={12}
                          color={likedTiles.includes(tile.id) ? 'red' : 'gray'}
                          fill={likedTiles.includes(tile.id) ? 'red' : 'none'}
                        />
                      </div>
                    </div>
                    <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-800 truncate">
                        {tile.name}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-sm text-gray-600 truncate">
                        Size: {tile.size}
                      </p>
                      <p className="text-xs sm:text-sm lg:text-sm text-gray-600 truncate">
                        {tile.finish}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white min-h-screen lg:min-h-0">
          <div className="bg-[#EFEFEF] text-gray-800 p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-300 mx-2 sm:mx-3 lg:mx-4 mt-14 sm:mt-16 lg:mt-0 shadow-lg gap-3 sm:gap-4">
            <div className="items-center gap-2 sm:gap-3 cursor-pointer">
              <button className="flex items-center justify-center w-8 h-8 bg-[#6F4E37] rounded hover:bg-[#5a3e2a]">
                <ChevronLeft className="text-white w-4 h-4" />
              </button>
              <span className="text-sm font-medium">Back</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="flex items-center px-3 py-2 bg-white border rounded hover:bg-gray-50 text-sm">
                <img src={downloadIcon} alt="download" className="w-4 h-4 mr-2" /> Download
              </button>
              <button className="flex items-center px-3 py-2 bg-[#6F4E37] text-white rounded hover:bg-[#5a3e2a] text-sm">
                <img src={addCatelogIcon} alt="add catalog" className="w-4 h-4 mr-2" /> Add Catalog
              </button>
              <button className="flex items-center px-3 py-2 bg-[#6F4E37] text-white rounded hover:bg-[#5a3e2a] text-sm">
                <img src={roomIcon} alt="room" className="w-4 h-4 mr-2" /> Change Room
              </button>
              <button className="w-10 h-10 bg-white border rounded hover:bg-gray-50">
                <img src={squear} alt="square" className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 sm:p-4 md:p-5 overflow-hidden bg-white">
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={roomImage}
                alt="Room visualization"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {isFilterPopupOpen && <FilterPopup onClose={handleCloseFilterPopup} />}
    </div>
  );
};

export default TileVisualizer;