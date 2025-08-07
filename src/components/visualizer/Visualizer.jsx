import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  X,
  EllipsisVertical,
  Layers,
  RefreshCcw,
  LayoutGrid,
  PanelsTopLeft,
  FlipHorizontal,
  Settings,
} from 'lucide-react';
import { TIELS } from '@/utils/constants';
import downloadIcon from '../../assets/download-icon.svg';
import addCatelogIcon from '../../assets/addCatelog-icon.svg';
import roomIcon from '../../assets/room-icon.svg';
import { Icon } from '../common/icons';
import { useNavigate } from 'react-router-dom';
import DemoRoom from './DemoRoom';
import Product from './Components/Product';
import SettingPopup from './Components/SettingPopup';
import LayoutPopup from './Components/LayoutPopup';
import GroutSettingsPopup from './Components/GroutSettingsPopup';
import TileCard from './Components/TileCard';
import SearchDropdown from './Components/SearchDropdown';

const TileVisualizer = () => {
  const [likedTiles, setLikedTiles] = useState(TIELS.length >= 2 ? [TIELS[0].id, TIELS[1].id] : []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [menuData] = useState([
    'Store Locate',
    'Share & Download',
    'Share Link',
    'Share via Facebook',
    'Share via Whatsapp',
    'Full Screen',
    'Product calculator',
    'Product Calculator',
    'Product History',
    'Exit',
  ]);
  const [viewMode, setViewMode] = useState('grid');
  const [showGroutPopup, setShowGroutPopup] = useState(false);
  const [groutWidth, setGroutWidth] = useState(0);
  const [showLayoutPopup, setShowLayoutPopup] = useState(false);
  const [showSettingPopup, setShowSettingPopup] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [compareImage, setCompareImage] = useState(null);
  const [isFramePopupOpen, setIsFramePopupOpen] = useState(false);
  const [showProduct, setShowProducts] = useState(false);
  const [showRoomPopup, setShowRoomPopup] = useState(false);
  const [sliderX, setSliderX] = useState(window.innerWidth / 2);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

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
    window.addEventListener('resize', init);
    return () => window.removeEventListener('resize', init);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = e => {
      e.preventDefault();
      const newScale = Math.min(Math.max(0.5, scale - e.deltaY * 0.001), 4);
      setScale(newScale);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [scale]);

  const handleMouseDown = e => {
    e.preventDefault();
    setDragging(true);
    setStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };

  const handleMouseMove = e => {
    if (!dragging) return;
    setTranslate({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div className="flex flex-col w-full min-h-screen text-black bg-gray-50">
      <div className="flex flex-1 overflow-hidden relative">
        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" />}

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
              <SearchDropdown viewMode={viewMode} setViewMode={setViewMode} />
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
                    isSelected={false}
                    showDetails={false}
                    onTileClick={() => {}}
                    onToggleLike={handleToggleLike}
                    isLiked={likedTiles.includes(tile.id)}
                    isListView={viewMode === 'list' ? true : false}
                    className="border border-black-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {isMobileSidebarOpen && window.innerWidth < 1024 && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-end"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <div
              className="relative w-full bg-[#EFEFEF] rounded-t-2xl shadow-xl z-10"
              style={{ maxHeight: '80vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex flex-col">
                <div className="flex justify-center items-center py-3 px-2 bg-[#EFEFEF]">
                  <Icon name="Logo" height="103px" width="104px" />
                </div>
                <div className="p-2 bg-[#EFEFEF]">
                  <SearchDropdown viewMode={viewMode} setViewMode={setViewMode} />
                </div>
                <div className="flex-1 overflow-y-auto bg-[#EFEFEF] max-lg:mb-25 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                  <div
                    className={`p-2 ${viewMode === 'grid' ? 'grid grid-cols-3 gap-4' : 'flex flex-col gap-4'}`}
                  >
                    {TIELS.slice(0, 4).map((tile, index) => (
                      <TileCard
                        key={tile.id}
                        tile={tile}
                        index={index}
                        isSelected={false}
                        showDetails={false}
                        onTileClick={() => {}}
                        onToggleLike={handleToggleLike}
                        isLiked={likedTiles.includes(tile.id)}
                        isListView={viewMode === 'list' ? true : false}
                        className="border border-black-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showGroutPopup && (
          <div
            className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
            onClick={() => setShowGroutPopup(false)}
          >
            <div onClick={e => e.stopPropagation()}>
              <GroutSettingsPopup
                isOpen={showGroutPopup}
                onClose={() => setShowGroutPopup(false)}
                groutWidth={groutWidth}
                setGroutWidth={setGroutWidth}
              />
            </div>
          </div>
        )}

        {showLayoutPopup && (
          <div
            className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
            onClick={() => setShowLayoutPopup(false)}
          >
            <div onClick={e => e.stopPropagation()}>
              <LayoutPopup isOpen={showLayoutPopup} onClose={() => setShowLayoutPopup(false)} />
            </div>
          </div>
        )}

        {showSettingPopup && (
          <div
            className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center"
            onClick={() => setShowSettingPopup(false)}
          >
            <div onClick={e => e.stopPropagation()}>
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
                <span className="hidden sm:inline">Download</span>
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
                  <div className="absolute inset-0" onClick={() => setShowRoomPopup(false)} />

                  <div
                    className={`relative w-full bg-white  shadow-xl z-10 transform transition-transform duration-300 ${
                      showRoomPopup ? 'translate-y-0' : 'translate-y-full'
                    }`}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                      onClick={() => setShowRoomPopup(false)}
                    >
                      <X className="w-5 h-5" />
                    </button>

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
                  <div className="h-full overflow-hidden" style={{ width: sliderX }}>
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
                    style={{ left: sliderX, transform: 'translateX(-50%)' }}
                  >
                    <button className="bg-[#f5f3f1] text-white p-2 border-4 border-solid-2 rounded border-white shadow-lg hover:scale-105 transition-all duration-200 hover:cursor-col-resize">
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
              onClick={() => setIsFramePopupOpen(false)}
            >
              <div
                className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4"
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-[#6F4E37] text-white py-4 px-6 rounded-t-xl text-start">
                  <h2 className="text-xl font-semibold">Select a Frame to Continue</h2>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-700 mb-6">
                    Choose a frame for your tile layout. Select either left or right frame option
                    below.
                  </p>

                  <div className="flex justify-center gap-6">
                    <button className="bg-[#6F4E37] text-white px-5 py-2 rounded hover:bg-[#5a3e2d] transition">
                      Left Frame
                    </button>
                    <button className="bg-[#6F4E37] text-white px-5 py-2 rounded hover:bg-[#5a3e2d] transition">
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
              <div onClick={e => e.stopPropagation()}>
                <Product
                  isOpen={showProduct}
                  onClose={() => {
                    setShowProducts(false);
                    setIsFramePopupOpen(false);
                  }}
                />
              </div>
            </div>
          )}
          <div className="sticky bottom-0 z-10 bg-white shadow-lg pb-0 sm:pb-0 md:pb-0 lg:pb-0 xl:pb-0">
            <div className="bg-[#EFEFEF] text-gray-800 p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-300 mx-2 sm:mx-3 lg:mx-4 mt-14 sm:mt-16 lg:mt-0 rounded-lg shadow-lg gap-3 sm:gap-4 max-[1024px]:mb-50 max-[1024px]:bg-[#FFFFFF] max-[1024px]:border-b-0 max-[1024px]:shadow-none">
              {window.innerWidth > 1024 && (
                <div
                  className="hidden md:flex items-center gap-2 sm:gap-3 cursor-pointer"
                  onClick={() => setShowProducts(true)}
                >
                  <button className="flex cursor-pointer items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11">
                    <Layers className="w-6 h-6 bg-white shadow-down" />
                  </button>
                  <div className="flex flex-col">
                    <span className="text-sm">Company Name</span>
                    <span className="text-sm font-bold">Monalisa onyx AQUA GMYK</span>
                  </div>
                </div>
              )}
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
                    <LayoutGrid className="font-bold" />
                  </span>
                  <span className="font-bold">Grout</span>
                </button>
                <div className="flex items-center gap-1 border border-gray-300 bg-white rounded">
                  {/* Layout Button */}
                  <button
                    onClick={() => setShowLayoutPopup(true)}
                    className="flex items-center px-3 py-2 bg-white text-black text-sm sm:text-base font-medium cursor-pointer"
                  >
                    <PanelsTopLeft className="w-5 h-5 mr-2" />
                    <span className="font-bold">Layout</span>
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
                      setCompareImage(roomImage);
                    }
                  }}
                  className="flex items-center cursor-pointer justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 text-black rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[120px] sm:min-w-[130px] lg:min-w-[140px]"
                >
                  <span className="mr-2 flex-shrink-0">
                    <FlipHorizontal className="w-5 h-5 font-bold" />
                  </span>
                  <span className="font-bold">Compare</span>
                </button>
              </div>
            </div>
          </div>

          {/* New mobile bottom bar - pixel perfect as screenshot */}
          {showProduct && (
            <div
              className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center"
              onClick={() => {
                setShowProducts(false);
                setIsFramePopupOpen(false);
              }}
            >
              <div onClick={e => e.stopPropagation()}>
                <Product
                  isOpen={showProduct}
                  onClose={() => {
                    setShowProducts(false);
                    setIsFramePopupOpen(false);
                  }}
                />
              </div>
            </div>
          )}
          <div
            className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-2xl shadow flex items-center justify-between px-4 py-3 pb-5"
            style={{ boxShadow: '0 -2px 16px rgba(0,0,0,0.08)' }}
          >
            {/* Left: Icon and text */}
            <div className="flex items-center gap-2" onClick={() => setShowProducts(true)}>
              <span className="bg-white rounded p-1 border border-gray-200">
                <Layers className="w-6 h-6 text-[#6F4E37]" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-gray-700">Company Name</span>
                <span className="text-sm font-bold text-black max-w-[120px] truncate">
                  {TIELS[0]?.tiles_name || 'Monalisa onyx AQUA GMYK'}
                </span>
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
              <button
                className="w-10 h-10 flex items-center justify-center bg-[#6F4E37] rounded-lg"
                style={{ color: 'white' }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center bg-[#6F4E37] rounded-lg"
                style={{ color: 'white' }}
              >
                <Icon name="Filter" width="20px" height="20px" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TileVisualizer;
