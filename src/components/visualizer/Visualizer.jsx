import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Heart, Menu, X } from 'lucide-react';
import { TIELS } from '@/utils/constants';
import downloadIcon from '../../assets/download-icon.svg';
import addCatelogIcon from '../../assets/addCatelog-icon.svg';
import roomIcon from '../../assets/room-icon.svg';
import squear from '../../assets/squear.svg';
import filterIcon from '../../assets/Filter.png';
import { Icon } from '../common/icons';
import FilterPopup from './FilterPopup';
import { Input } from '../ui/input';

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
    // Toggle dropdown if it's already open
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
    // Toggle dropdown when clicking on the search container
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
      <div className="flex gap-2.5">
        <div
          className={`relative flex-1 rounded-lg transition-all duration-300 shadow-lg ${isFocused ? 'border-2 border-[#6F4E37] shadow-blue-300/30' : 'border border-gray-300'
            }`}
        >
          <div
            className="flex items-center bg-[#D9D9D9] rounded-lg cursor-pointer"
            onClick={handleSearchContainerClick}
          >
            <span
              className={`pl-3 font-medium transition-colors duration-300 text-sm ${isFocused ? 'text-[#6F4E37]' : 'text-gray-700'
                }`}
            >
              Tiles
            </span>
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full h-[50px] py-2 px-3 text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 text-sm"
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
        <div
          className="bg-[#6F4E37] h-[50px] w-[50px] p-3 rounded-lg cursor-pointer hover:bg-[#5a3e2a] flex items-center justify-center"
          onClick={onFilterClick}
        >
         <Icon name="Filter" width="20px" height="20px" />
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

const TileCard = ({ tile, index, isSelected, onTileClick, onToggleLike, isLiked, showDetails }) => {
  const [selectedFinish, setSelectedFinish] = useState(tile.finish);
  const [selectedSize, setSelectedSize] = useState(tile.size);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const finishOptions = ['Glossy', 'Matt'];
  const sizeOptions = ['60 x 120 CM', '800 x 1600 CM'];

  const handleFinishChange = finish => {
    setSelectedFinish(finish);
    console.log(`Finish changed to: ${finish}`);
  };

  const handleSizeChange = size => {
    setSelectedSize(size);
    console.log(`Size changed to: ${size}`);
  };

  const toggleMoreDetails = e => {
    e.stopPropagation();
    setShowMoreDetails(!showMoreDetails);
    console.log(`More details ${showMoreDetails ? 'hidden' : 'shown'}`);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-[#6F4E37] shadow-md' : ''
        }`}
      onClick={() => onTileClick(tile, index)}
    >
      <div className="flex sm:p-3 lg:p-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 relative flex-shrink-0">
          <img
            src={tile.thumbnail || '/placeholder.svg?height=80&width=80'}
            alt={tile.name}
            className="w-full h-full object-cover rounded"
          />
          <button
            className="absolute top-1 right-1 flex items-center bg-white/90 backdrop-blur-sm rounded-full w-5 h-5 justify-center cursor-pointer shadow-sm hover:bg-white"
            onClick={e => {
              e.stopPropagation();
              onToggleLike(tile.id);
            }}
          >
            <Heart
              height={12}
              width={12}
              color={isLiked ? 'red' : 'gray'}
              fill={isLiked ? 'red' : 'none'}
            />
          </button>
        </div>
        <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-800 truncate mb-0.5">
            {tile.name}
          </h3>
          <p className="text-xs sm:text-sm lg:text-sm text-gray-600 truncate mb-0.5">
            Size: {tile.size}
          </p>
          <p className="text-xs sm:text-sm lg:text-sm text-gray-600 truncate">{tile.finish}</p>
        </div>
      </div>
      <div
  className={`mt-3 space-y-3 overflow-hidden transition-all duration-500 ease-in-out
    ${showDetails ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
  `}
>
  {/* Only render children if showDetails or keep them always rendered */}
  {/* If performance is a concern, you can conditionally render content based on showDetails */}
  {(showDetails) && (
    <>
      {/* Finish Options */}
      <div className="flex gap-2 flex-wrap pl-2">
        {finishOptions.map(finish => (
          <button
            key={finish}
            onClick={e => {
              e.stopPropagation();
              handleFinishChange(finish);
            }}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              selectedFinish === finish
                ? 'bg-[#6F4E37] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {finish}
          </button>
        ))}
      </div>

      <div className="pl-2 flex gap-2 flex-wrap">
        {sizeOptions.map(size => (
          <button
            key={size}
            onClick={e => {
              e.stopPropagation();
              handleSizeChange(size);
            }}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              selectedSize === size
                ? 'bg-[#6F4E37] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <button
        className="w-full bg-[#FFF5EE] underline text-[#6F4E37] py-2.5 rounded font-medium text-sm hover:bg-[#FFE8D1] transition-colors mt-4"
        onClick={toggleMoreDetails}
      >
        {showMoreDetails ? 'Hide Details' : 'More Product Detail'}
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showMoreDetails ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
        } text-xs space-y-2 px-2 pb-1`}
      >
        {showMoreDetails && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Full Name:</span>
              <span className="font-medium text-right">{tile.fullName || tile.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">{tile.price || '$89.99'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Material:</span>
              <span className="font-medium">{tile.material || 'Ceramic'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Availability:</span>
              <span
                className={`font-medium ${
                  tile.inStock !== false ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {tile.inStock !== false ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <p className="text-gray-600 mt-2">
              {tile.description || 'Premium quality ceramic tile with elegant pattern.'}
            </p>
          </>
        )}
      </div>
    </>
  )}
</div>

    </div>
  );
};

const TileVisualizer = () => {
  const [selectedTileIndex, setSelectedTileIndex] = useState(0); // First tile selected by default
  const [likedTiles, setLikedTiles] = useState(TIELS.length >= 2 ? [TIELS[0].id, TIELS[1].id] : []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const sidebarRef = useRef(null);

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

  // Handle clicking outside sidebar to close it
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 1024
      ) {
        // Check if the click is on the menu button
        const menuButton = document.querySelector('[data-menu-button]');
        if (menuButton && menuButton.contains(event.target)) {
          return; // Don't close if clicking the menu button
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
    // Removed the automatic sidebar closing - now it only closes when clicking outside
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

          <div className="p-2 sm:p-3 lg:p-4 bg-[#EFEFEF] ">
            <SearchDropdown onFilterClick={handleFilterClick} />
          </div>

          <div className="flex-1 overflow-y-auto bg-[#EFEFEF] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div className="space-y-2 sm:space-y-3 p-2 sm:p-3 lg:p-4">
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
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white min-h-screen lg:min-h-0">
          <div className="bg-[#EFEFEF] text-gray-800 p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-300 mx-2 sm:mx-3 lg:mx-4 mt-14 sm:mt-16 lg:mt-0 rounded-lg shadow-lg gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
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
              <button className="flex cursor-pointer items-center justify-center w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200">
                <img
                  src={squear || '/placeholder.svg?height=16&width=16'}
                  alt="square"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  crossOrigin="anonymous"
                />
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 sm:p-4 md:p-5 overflow-hidden bg-white">
            <div className="items-center justify-center">
              <img
                src={roomImage || '/placeholder.svg'}
                alt="Room visualization"
                className="w-full h-full object-cover max-h-[80vh]"
                crossOrigin="anonymous"
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
