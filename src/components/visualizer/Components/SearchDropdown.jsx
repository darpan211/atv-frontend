import { Grid3x3, LayoutGrid, List, Ungroup } from 'lucide-react';
import { Input } from '../../ui/input';
import { Icon } from '../../common/icons';
import React, { useEffect, useRef, useState } from 'react';

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
            <LayoutGrid className="font-bold" />
          </span>
          <span className="font-bold">Floors</span>
        </button>
        <button className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[103px] sm:min-w-[103px] lg:min-w-[103px]">
          <span className="mr-2 flex-shrink-0">
            <Ungroup className="font-bold" />
          </span>
          <span className="font-bold">Walls</span>
        </button>
        <button className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[103px] sm:min-w-[103px] lg:min-w-[103px]">
          <span className="mr-2 flex-shrink-0">
            <Grid3x3 className="font-bold" />
          </span>
          <span className="font-bold">Paint</span>
        </button>
      </div>
      <div className="flex gap-2.5">
        <div
          className={`relative flex-1 rounded-lg transition-all duration-300 shadow-lg ${
            isFocused ? 'shadow-blue-300/30' : ''
          }`}
        >
          <div className="flex gap-1">
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

export default SearchDropdown;
