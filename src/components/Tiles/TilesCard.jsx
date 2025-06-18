import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import img from '../../assets/image (2).png';
import { Icon } from '../common/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './TilesSidebar';
import Header from './TilesHeader';
import { EditFormPopup, TilePopup } from './TilesPopups';
import { Checkbox } from '../ui/checkbox';
import { fetchTiles, updateTile } from '@/redux/slice/tiles/tileThunks';
import { toast } from 'react-toastify';
import { fetchColors } from '@/redux/slice/colors/colorThunks';
import { fetchFinishes } from '@/redux/slice/finish/finishThunks';
import { fetchSeries } from '@/redux/slice/series/seriesThunks';
import { fetchMaterials } from '@/redux/slice/material/materialThunks';
import { fetchCategories } from '@/redux/slice/categories/categoryThunks';
import { fetchSuitablePlaces } from '@/redux/slice/suitablePlace/suitablePlaceThunks';

const TileManagement = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTile, setSelectedTile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Toast logic for navigation success message
  const toastShownRef = useRef(false);
  useEffect(() => {
    if (location.state?.toastMessage && !toastShownRef.current) {
      toast.success(location.state.toastMessage);
      toastShownRef.current = true;
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const [activeFilters, setActiveFilters] = useState({
    series: [],
    collections: [],
    categories: [],
    finishes: [],
    sizes: [],
    materials: [],
    colors: [],
  });

  const tilesFromRedux = useSelector(state => state.tiles?.tiles?.data ?? []);
  const categories = useSelector(state => state.categories.list?.data ?? null);
  const sizes = useSelector(state => state.sizes.list?.data ?? []);
  const materials = useSelector(state => state.materials.list?.data ?? []);
  const finish = useSelector(state => state.finish.list?.data ?? []);
  const series = useSelector(state => state.series.list?.data ?? []);
  const colors = useSelector(state => state.colors.list?.data ?? []);

const filterOptions = {
  collections: ['Modern', 'Contemporary', 'Traditional', 'Vintage', 'Minimalist'],
  categories: categories.map(item => item.category),
  series: series.map(item => item.series),
  finishes: finish.map(item => item.finish),
  sizes: sizes.map(item => item.sizes),
  materials: materials.map(item => item.material),
  colors: colors.map(item => item.colors),
};

  // fetch filter option data on page load
  useEffect(() => {
    dispatch(fetchTiles());
    dispatch(fetchColors());
    dispatch(fetchFinishes());
    dispatch(fetchSeries());
    dispatch(fetchMaterials());
    dispatch(fetchCategories());
    dispatch(fetchSuitablePlaces());
  }, [dispatch]);

  const [tiles, setTiles] = useState([]);

useEffect(() => {
  if (page === 1) {
    // Reset tiles on first page (e.g., when filters or search change)
    setTiles(tilesFromRedux);
  } else {
    // Append new tiles, avoiding duplicates
    setTiles(prev => {
      const newTiles = tilesFromRedux.filter(
        newTile => !prev.some(prevTile => prevTile.id === newTile.id)
      );
      return [...prev, ...newTiles];
    });
  }
}, [tilesFromRedux, page]);

// Add after your other useEffects
useEffect(() => {
  if (viewMode !== 'grid') return;
  setLoading(true);

  const paramsObj = {};
  Object.entries(activeFilters).forEach(([key, values]) => {
    if (values.length > 0) paramsObj[key] = values.join(',');
  });
  if (searchTerm) paramsObj.search = searchTerm;
  paramsObj.page = page;
  paramsObj.limit = 12;

  const urlParams = new URLSearchParams(paramsObj);
  if (urlParams.toString() !== location.search.replace(/^\?/, '')) {
    navigate({ search: urlParams.toString() }, { replace: true });
  }

  dispatch(fetchTiles(paramsObj)).then((action) => {
    if (action.payload?.length < 12) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
    setLoading(false);
  });
}, [viewMode, activeFilters, searchTerm, page, dispatch, location.search, navigate]);

useEffect(() => {
  if (viewMode !== 'grid') return;

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
      hasMore &&
      !loading
    ) {
      setPage(prev => prev + 1);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [viewMode, hasMore, loading]);

useEffect(() => {
  setPage(1);
  setHasMore(true);
}, [activeFilters, searchTerm, viewMode]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(activeFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      }
    });
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    if (params.toString() !== location.search.replace(/^\?/, '')) {
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [activeFilters, searchTerm, navigate]);

  const [expandedSections, setExpandedSections] = useState({
    collections: true,
    categories: true,
    series: true,
    finishes: false,
    sizes: false,
    materials: false,
    colors: false,
  });

  const getPriorityColor = useCallback(priority => {
    switch (priority) {
      case 'Low Priority':
        return 'bg-[#2CC29A]';
      case 'Medium Priority':
        return 'bg-[#EA9A3E]';
      case 'High Priority':
        return 'bg-[#EA3E3E]';
      default:
        return 'bg-gray-500';
    }
  }, []);

  // Memoized handlers to prevent unnecessary re-renders
  const handlePriorityChange = useCallback(
    (id, newPriority) => {
      setTiles(prevTiles =>
        prevTiles.map(tile => (tile.id === id ? { ...tile, priority: newPriority } : tile))
      );
      if (selectedTile && selectedTile.id === id) {
        setSelectedTile(prev => ({ ...prev, priority: newPriority }));
      }
    },
    [selectedTile]
  );

  const handleToggleFavorite = useCallback(
    id => {
      setTiles(prevTiles =>
        prevTiles.map(tile => (tile.id === id ? { ...tile, isFavorited: !tile.isFavorited } : tile))
      );
      if (selectedTile && selectedTile.id === id) {
        setSelectedTile(prev => ({ ...prev, isFavorited: !prev.isFavorited }));
      }
      // Update backend
      const tile = tiles.find(t => t.id === id);
      if (tile) {
        // eslint-disable-next-line no-undef
        dispatch(updateTile({ id, data: { favorite: !tile.isFavorited } }));
      }
    },
    [selectedTile, tiles, dispatch]
  );

  const handleToggleActive = useCallback(
    id => {
      setTiles(prevTiles =>
        prevTiles.map(tile => (tile.id === id ? { ...tile, isActive: !tile.isActive } : tile))
      );
      if (selectedTile && selectedTile.id === id) {
        setSelectedTile(prev => ({ ...prev, isActive: !prev.isActive }));
      }
    },
    [selectedTile]
  );

  const handleDelete = useCallback(
    id => {
      setTiles(prevTiles => prevTiles.filter(tile => tile.id !== id));
      if (selectedTile && selectedTile.id === id) {
        setIsPopupOpen(false);
        setSelectedTile(null);
        setIsEditMode(false);
      }
    },
    [selectedTile]
  );

  const openTilePopup = useCallback(tile => {
    setSelectedTile(tile);
    setIsPopupOpen(true);
    setIsEditMode(false);
  }, []);

  const closeTilePopup = useCallback(() => {
    setIsPopupOpen(false);
    setSelectedTile(null);
    setIsEditMode(false);
    setEditFormData({});
  }, []);

  const openEditMode = useCallback(tile => {
    setSelectedTile(tile);
    setEditFormData({
      name: tile.name,
      priority: tile.priority.replace(' Priority', ''),
      size: tile.size,
      material: tile.material,
      finish: tile.finish,
      series: tile.series,
      color: tile.color,
    });
    setIsEditMode(true);
    setIsPopupOpen(false); // Close the view popup when opening edit mode
  }, []);

  // Fixed form change handler - this was the main issue
  const handleEditFormChange = useCallback((field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveEdit = useCallback(() => {
    const updatedTile = {
      ...selectedTile,
      name: editFormData.name,
      priority: `${editFormData.priority} Priority`,
      size: editFormData.size,
      material: editFormData.material,
      finish: editFormData.finish,
      series: editFormData.series,
      color: editFormData.color,
    };

    setTiles(prevTiles =>
      prevTiles.map(tile => (tile.id === selectedTile.id ? updatedTile : tile))
    );
    setSelectedTile(updatedTile);
    setIsEditMode(false);
    alert('Tile updated successfully!');
  }, [selectedTile, editFormData]);

  const toggleSection = useCallback(section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleFilterChange = useCallback((category, value) => {
    setActiveFilters(prev => {
      const updatedFilters = {
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value],
      };

      // Construct query parameters
      const queryParams = { ...updatedFilters };
      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      // Dispatch fetchTiles with query parameters
      dispatch(fetchTiles(queryParams));

      return updatedFilters;
    });
    setCurrentPage(1);
  }, [dispatch, searchTerm]);

  const removeFilter = useCallback((category, value) => {
    setActiveFilters(prev => {
      const updatedFilters = {
        ...prev,
        [category]: prev[category].filter(item => item !== value),
      };

      // Update query parameters
      const queryParams = { ...updatedFilters };
      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      // Fetch tiles with updated filters
      dispatch(fetchTiles(queryParams));

      return updatedFilters;
    });
    setCurrentPage(1);
  }, [dispatch, searchTerm]);

  const clearAllFilters = useCallback(() => {
    const cleared = {};
    Object.keys(activeFilters).forEach(key => (cleared[key] = []));
    setActiveFilters(cleared);
    setSearchTerm('');
    dispatch(fetchTiles({})); // Fetch all tiles when filters are cleared
    setCurrentPage(1);
  }, [activeFilters, dispatch]);

  const handleSearchChange = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    const queryParams = { ...activeFilters };
    if (newSearchTerm) {
      queryParams.search = newSearchTerm;
    }
    dispatch(fetchTiles(queryParams));
    setCurrentPage(1);
  }, [activeFilters, dispatch]);

  const getTotalFilters = useCallback(
    () => Object.values(activeFilters).flat().length,
    [activeFilters]
  );

  console.log('tilesFromRedux:', tilesFromRedux);
  console.log('tiles:', tiles);

  const totalPages = Math.ceil(tiles.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTiles = tiles.slice(startIndex, endIndex);

  const handlePageChange = useCallback(page => {
    setCurrentPage(page);
  }, []);

  const handleRowsPerPageChange = useCallback(newRowsPerPage => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  }, []);

  const TileCard = ({ tile }) => {
    const priorities = ['Low', 'Medium', 'High'];

    return (
      <div className="w-full h-fit bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden">
        <div
          className="relative bg-[#E0E0E0] rounded-t-xl p-2 overflow-hidden flex justify-center items-center h-[160px] cursor-pointer w-full group"
          onClick={() => openTilePopup(tile)}
        >
          <div className="overflow-hidden rounded-xl w-full h-full">
            <img
              src={tile?.tiles_image || '/placeholder.svg'}
              alt=""
              className="object-cover h-full rounded-xl w-full max-h-[262.34px] overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              handleToggleFavorite(tile.id);
            }}
            className={`absolute top-3 right-3 p-1.5 rounded-md shadow-md transition-all duration-200 cursor-pointer ${
              tile.isFavorited ? 'bg-white' : 'bg-[#6F4E37] bg-opacity-90 hover:bg-opacity-100'
            }`}
          >
            <Icon
              name="Heart"
              size={16}
              className={`transition-all duration-300 ${
                tile.isFavorited ? 'text-[#6F4E37] fill-[#6F4E37]' : 'text-white fill-white'
              }`}
            />
          </button>
        </div>

        <div className="p-2 space-y-3">
          <h3 className="text-base font-semibold truncate">{tile.name}</h3>

          <div className="space-y-1 text-sm">
            {[
              {
                label: 'Size',
                value: (
                  <div className="flex flex-wrap gap-1">
                    {tile.size.map((sz, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                ),
              },
              {
                label: 'Series',
                value: (
                  <div className="flex flex-wrap gap-1">
                    {tile.series.map((s, i) => (

                    <span key={i} className="px-2  text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700">
                      {s}
                    </span>
                    ))}
                  </div>
                ),
              },
              {
                label: 'Category',
                value: (
                  <span className="px-2  text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700">
                    {tile.category}
                  </span>
                ),
              },
            ].map((item, index) => (
              <div key={index} className="flex justify-between gap-2">
                <span className="font-semibold text-gray-700 whitespace-nowrap">{item.label}:</span>
                <span className="truncate flex-1 text-gray-600">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Priority Buttons */}
          <div className="flex items-center gap-2 animate-fade-in justify-between">
            <div className="flex gap-1 bg-[#e9d8cb] rounded-[8px] px-1 py-1 items-center w-fit transition-opacity duration-500">
              {priorities.map(p => {
                const full = `${p}`;
                const isSelected = tile.priority === full.toLowerCase();
                return (
                  <button
                    key={p}
                    onClick={() => handlePriorityChange(tile.id, full)}
                    className={`cursor-pointer px-0.5 py-0.5 text-xs rounded-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                      isSelected
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <span
              className={`text-[11px] font-semibold px-2 py-1 rounded-lg text-white transition-all w-[113.92px] h-[24.07px] justify-center flex items-center  duration-700 ease-in-out ${getPriorityColor(tile.priority)}`}
            >
              {tile.priority}
            </span>
          </div>
        </div>

        <div className="bg-[#FFF5EE] px-4 py-2 flex flex-col  sm:flex-row sm:justify-between items-center gap-2 sm:gap-0 w-full mt-1 border-t border-gray-200">
          <label className="inline-flex items-center gap-2 text-[#5C4033] text-sm font-semibold cursor-pointer hover:scale-105 transition-all duration-300">
            <Checkbox
              onChange={() => handleToggleActive(tile.id)}
              className="w-4 h-4 cursor-pointer accent-[#6F4E37] transition-transform duration-300 hover:scale-125 bg-white border-[#6F4E37]"
            />
            <span className={`transition-all duration-300 text-[#6F4E37]`}>Active</span>
          </label>

          <button
            onClick={() => handleDelete(tile.id)}
            className="flex cursor-pointer items-center gap-2 mt-2 sm:mt-0 px-4 py-1.5 bg-[#5C4033] text-white rounded-lg text-sm font-semibold hover:bg-[#4a3529] hover:scale-105 transition-all duration-300 shadow-md transform"
          >
            <Icon
              name="DeleteIcon"
              width={18}
              height={18}
              colour="white"
              className="sm:mr-1 text-white flex-shrink-0"
            />
            Delete
          </button>
        </div>
      </div>
    );
  };

  const TableView = () => {
    const PriorityControls = ({ tile }) => {
      const priorities = ['Low', 'Medium', 'High'];

      return (
        <div className="flex flex-col items-center gap-2">
          <span
            className={`px-2 py-1 rounded text-white text-[11px] font-semibold transition-all duration-300 ease-in-out ${getPriorityColor(tile.priority)}`}
          >
            {tile.priority}
          </span>

          <div className="flex gap-1 bg-[#E9D8CB] p-1 rounded-lg">
            {priorities.map(p => {
              const full = `${p} Priority`;
              const isSelected = tile.priority === full;
              return (
                <button
                  key={p}
                  onClick={() => handlePriorityChange(tile.id, full)}
                  className={`px-2 cursor-pointer py-1 text-xs rounded font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    isSelected ? 'bg-white text-gray-800 shadow' : 'text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-max-[1176px] overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-[#6f4e37] text-white">
              <tr>
                {[
                  'Image',
                  'Tile Name',
                  'Priority',
                  'Size',
                  'Material',
                  'Finish',
                  'Series',
                  'Status',
                  'Favorite',
                  'Actions',
                ].map((title, idx) => (
                  <th
                    key={title}
                    className={`px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium ${
                      idx !== 9 ? 'border-r border-[#6f4e37]' : ''
                    }`}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedTiles.map((tile, index) => (
                <tr key={tile.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td
                    className="px-2 sm:px-4 py-4 border-r border-gray-200"
                    onClick={() => openTilePopup(tile)}
                  >
                    <img
                      src={tile.tiles_image || '/placeholder.svg'}
                      alt={tile.name}
                      className="max-h-[58px] w-[75px] object-contain rounded-lg cursor-pointer"
                    />
                  </td>

                  <td className="px-2 sm:px-4 py-4 text-[16px] sm:text-sm font-medium text-gray-900 border-r border-gray-200">
                    {tile.name}
                  </td>
                  <td className="px-2 sm:px-4 py-4 border-r border-gray-200">
                    <PriorityControls tile={tile} />
                  </td>

                  <td className="px-2 sm:px-4 py-4 text-[16px] sm:text-sm text-gray-900 border-r border-gray-200 w-max-[105px]">
                    {tile.size}
                  </td>

                  <td className="px-2 sm:px-4 py-4 text-[16px] sm:text-sm text-gray-900 border-r border-gray-200">
                    {tile.material}
                  </td>

                  <td className="px-2 sm:px-4 py-4 text-[16px] sm:text-sm text-gray-900 border-r border-gray-200">
                    {tile.finish}
                  </td>
                  <td className="px-2 sm:px-4 py-4 text-[16px] sm:text-sm text-gray-900 border-r border-gray-200">
                    {tile.series}
                  </td>

                  <td className="px-2 sm:px-4 py-4 border-r border-gray-200">
                    <button
                      onClick={() => handleToggleActive(tile.id)}
                      className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                        tile.isActive
                          ? 'bg-[#005E06] text-white hover:bg-[#004d05]'
                          : 'bg-[#DADADA] text-[#6E6E6E] hover:bg-[#cfcfcf]'
                      }`}
                    >
                      {tile.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  <td className="px-2 sm:px-4 py-4 border-r border-gray-200">
                    <button
                      onClick={() => handleToggleFavorite(tile.id)}
                      className={`p-2 rounded transition cursor-pointer ${
                        tile.isFavorited
                          ? 'bg-white text-[#6F4E37] border border-[#6f4e37]'
                          : 'bg-[#6F4E37] text-white'
                      }`}
                    >
                      <Icon
                        name="Heart"
                        size={16}
                        className={`transition-all duration-300  ${
                          tile.isFavorited
                            ? 'text-[#6F4E37] fill-[#6F4E37]'
                            : 'text-white fill-white'
                        }`}
                      />
                    </button>
                  </td>

                  <td className="px-2 sm:px-4 py-4 flex items-center gap-1">
                    <button
                      onClick={() => openTilePopup(tile)}
                      className="p-2 text-[#6F4E37] rounded cursor-pointer"
                    >
                      <Icon name="Eye" width={25} height={22} />
                    </button>
                    <button
                      onClick={() => openEditMode(tile)}
                      className="p-2 text-[#6F4E37] rounded cursor-pointer"
                    >
                      <Icon name="EditPencil" width={25} height={22} />
                    </button>
                    <button
                      onClick={() => handleDelete(tile.id)}
                      className="p-2 text-[#6F4E37] rounded cursor-pointer"
                    >
                      <Icon
                        name="DeleteIcon"
                        width={23}
                        height={25}
                        className="sm:mr-1 flex-shrink-0"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200">
          {/* Rows per page */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={e => handleRowsPerPageChange(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="absolute right-2 top-1.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Page navigation */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {startIndex + 1}-{Math.min(endIndex, tiles.length)} of {tiles.length}
            </span>
            <div className="flex space-x-1">
              <button
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FilterSection = ({ title, filterKey, options }) => {
    const isExpanded = expandedSections[filterKey];
    const activeItems = activeFilters[filterKey];

    return (
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection(filterKey)}
          className="w-full flex items-center justify-between py-3 px-1 text-left font-medium text-gray-900 hover:text-gray-700 transition-colors"
          aria-expanded={isExpanded}
          aria-controls={`filter-section-${filterKey}`}
        >
          <span className="text-sm sm:text-base">{title}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div
            id={`filter-section-${filterKey}`}
            className="pb-4 space-y-2 max-h-48 overflow-y-auto"
          >
            {options.map(option => (
              <label
                key={option}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={activeItems.includes(option)}
                  onChange={() => handleFilterChange(filterKey, option)}
                  className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                  style={{ accentColor: '#6F4E37' }}
                />
                <span className="text-xs sm:text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="flex w-full relative">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          activeFilters={activeFilters}
          handleFilterChange={handleFilterChange}
          removeFilter={removeFilter}
          clearAllFilters={clearAllFilters}
          getTotalFilters={getTotalFilters}
          filterOptions={filterOptions}
          // filteredTiles={filteredTiles}
          filteredTiles={tiles}
        />

        <div className="flex-1 min-h-[100%] bg-gray-50 flex flex-col w-full lg:ml-0">
          {/* Header */}
          <Header
            setSidebarOpen={setSidebarOpen}
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
          />

          {/* Main Content */}
          <div className="flex-1 bg-white p-3 sm:p-4 lg:p-6 w-full relative">
            {/* Empty state */}
            {tiles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <p className="text-gray-500 text-lg mb-2">No tiles found</p>
                <p className="text-gray-400 text-sm">
                  {searchTerm || getTotalFilters() > 0
                    ? 'Try adjusting your search or filters'
                    : 'Add some tiles to get started'}
                </p>
              </div>
            )}

            {/* Grid & Table View Container */}
            <div className="relative w-full min-h-[300px]">
              {/* Grid View */}
              <div
                className={`
            ${viewMode === 'grid' ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            transition-opacity duration-500 ease-in-out
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full h-fit absolute inset-0
          `}
              >
                {paginatedTiles.map(tile => (
                  <TileCard key={tile.id} tile={tile} />
                ))}
              </div>

              {/* Table View */}
              <div
                className={`
            ${viewMode !== 'grid' ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            transition-opacity duration-500 ease-in-out
            w-full absolute inset-0
          `}
              >
                <TableView />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      {!isEditMode && (
        <TilePopup
          tile={selectedTile}
          isOpen={isPopupOpen}
          onClose={closeTilePopup}
          onEdit={openEditMode}
          onDelete={handleDelete}
        />
      )}

      <EditFormPopup
        key={selectedTile?.id || 'edit-popup'}
        tile={selectedTile}
        isOpen={isEditMode}
        onClose={closeTilePopup}
        formData={editFormData}
        onChange={handleEditFormChange}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TileManagement;
