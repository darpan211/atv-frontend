import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';

import img from '../../assets/image (2).png';
import { Icon } from '../common/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './TilesSidebar';
import Header from './TilesHeader';
import { EditFormPopup, TilePopup } from './TilesPopups';
import { Checkbox } from '../ui/checkbox';
import {
  fetchTiles,
  updateTile,
  getfilteredtiles,
  deleteTile,
} from '@/redux/slice/tiles/tileThunks';
import { toast } from 'react-toastify';
import { fetchColors } from '@/redux/slice/colors/colorThunks';
import { fetchFinishes } from '@/redux/slice/finish/finishThunks';
import { fetchSeries } from '@/redux/slice/series/seriesThunks';
import { fetchMaterials } from '@/redux/slice/material/materialThunks';
import { fetchCategories } from '@/redux/slice/categories/categoryThunks';
import { fetchSuitablePlaces } from '@/redux/slice/suitablePlace/suitablePlaceThunks';
import { MultiSelectDropdown } from '../common/MultiSelectDropdown';
import { fetchSizes } from '@/redux/slice/sizes/sizeThunks';
import Loader from '../common/Loader';

const TileManagement = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTile, setSelectedTile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    collections: true,
    categories: true,
    series: true,
    finishes: false,
    sizes: false,
    materials: false,
    colors: false,
  });
  const { loading } = useSelector(state => state.tiles);
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

  const filteredTilesOptions = useSelector(state => state.tiles.filteredtiles ?? []);
  const [tiles, setTiles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const totalItems = useSelector(state => state.tiles.tiles?.totalItems ?? 0);
  const categories = useSelector(state => state.categories.list?.data ?? null);
  const sizes = useSelector(state => state.sizes.list?.data ?? []);
  const materials = useSelector(state => state.materials.list?.data ?? []);
  const finish = useSelector(state => state.finish.list?.data ?? []);
  const series = useSelector(state => state.series.list?.data ?? []);
  const colors = useSelector(state => state.colors.list?.data ?? []);

  // fetch filter option data on page load
  useEffect(() => {
    dispatch(fetchSizes());
    dispatch(fetchTiles());
    dispatch(fetchColors());
    dispatch(fetchFinishes());
    dispatch(fetchSeries());
    dispatch(fetchMaterials());
    dispatch(fetchCategories());
    dispatch(fetchSuitablePlaces());
    dispatch(getfilteredtiles());
  }, [dispatch]);

  const filterOptions = {
    categories: filteredTilesOptions.categories || [],
    series: filteredTilesOptions.series || [],
    finishes: filteredTilesOptions.finish || [],
    sizes: filteredTilesOptions.size || [],
    materials: filteredTilesOptions.material || [],
    colors: filteredTilesOptions.color || [],
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = { ...activeFilters };
    Object.keys(newFilters).forEach(key => {
      const values = params.getAll(key);
      if (values.length > 0) {
        newFilters[key] = values;
      }
    });
    setActiveFilters(newFilters);
    const search = params.get('tiles_name') || '';
    setSearchTerm(search);

    // Fetch tiles based on URL filters and search term
    const queryParams = { ...newFilters };
    if (search) {
      queryParams.tiles_name = search;
    }
    // });
  }, [viewMode, page, dispatch, location.search, navigate]);

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
        values.forEach(value => params.append(key, value));
      }
    });
    if (searchTerm) {
      params.set('tiles_name', searchTerm);
    }
    if (params.toString() !== location.search.replace(/^3F/, '')) {
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [activeFilters, searchTerm, navigate]);

  useEffect(() => {
    const hasFilters = Object.values(activeFilters).some(arr => arr.length > 0) || !!searchTerm;
    if (!hasFilters) {
      dispatch(fetchTiles({}));
    }
  }, [activeFilters, searchTerm, dispatch]);

  const getPriorityColor = useCallback(priority => {
    const lowerPriority = priority?.toLowerCase() || '';

    switch (true) {
      case lowerPriority.includes('low'):
        return 'bg-[#2CC29A]';
      case lowerPriority.includes('medium'):
        return 'bg-[#EA9A3E]';
      case lowerPriority.includes('high'):
        return 'bg-[#EA3E3E]';
      default:
        return 'bg-gray-500';
    }
  }, []);

  const handlePriorityChange = useCallback(
    (id, newPriority) => {
      if (!id) return;
      dispatch(updateTile({ id, data: { priority: newPriority } }))
        .then(() => {
          // Update local tiles state immediately
          setTiles(prev =>
            prev.map(tile =>
              tile.id === id || tile._id === id ? { ...tile, priority: newPriority } : tile || []
            )
          );
          // Optionally refresh from backend
          dispatch(fetchTiles());
          if (selectedTile && (selectedTile.id === id || selectedTile._id === id)) {
            setSelectedTile(prev => ({ ...prev, priority: newPriority }));
          }
        })
        .catch(error => {
          toast.error('Failed to update priority');
        });
    },
    [selectedTile, dispatch]
  );

  const handleToggleFavorite = useCallback(
    id => {
      if (!id) return;
      const tile = tiles.find(t => t.id === id || t._id === id);
      if (!tile) return;
      dispatch(updateTile({ id, data: { favorite: !tile.favorite } }))
        .then(() => {
          // Update local tiles state immediately
          setTiles(
            prev =>
              prev.map(t => (t.id === id || t._id === id ? { ...t, favorite: !t.favorite } : t)) ||
              []
          );
          // Optionally refresh from backend
          dispatch(fetchTiles());
          if (selectedTile && (selectedTile.id === id || selectedTile._id === id)) {
            setSelectedTile(prev => ({ ...prev, favorite: !prev.favorite }));
          }
        })
        .catch(error => {
          toast.error('Failed to update favorite status');
        });
    },
    [selectedTile, tiles, dispatch]
  );

  const handleToggleActive = useCallback(
    id => {
      if (!id) return;
      const tile = tiles.find(t => t.id === id || t._id === id);
      if (!tile) return;
      const newStatus = tile.status === 'active' ? 'inactive' : 'active';
      dispatch(updateTile({ id, data: { status: newStatus } }))
        .then(() => {
          // Update local tiles state immediately
          setTiles(
            prev =>
              prev.map(t => (t.id === id || t._id === id ? { ...t, status: newStatus } : t)) || []
          );
          // Optionally refresh from backend
          dispatch(fetchTiles());
          if (selectedTile && (selectedTile.id === id || selectedTile._id === id)) {
            setSelectedTile(prev => ({ ...prev, status: newStatus }));
          }
        })
        .catch(error => {
          toast.error('Failed to update active status');
        });
    },
    [selectedTile, tiles, dispatch]
  );

  const handleDelete = useCallback(
    id => {
      if (!id) return;
      dispatch(deleteTile(id))
        .then(() => {
          dispatch(fetchTiles());
          if (selectedTile && (selectedTile.id === id || selectedTile._id === id)) {
            setIsPopupOpen(false);
            setSelectedTile(null);
            setIsEditMode(false);
          }
          toast.success('Tile deleted successfully!');
        })
        .catch(error => {
          alert(error);
          toast.error('Failed to delete tile');
        });
    },
    [selectedTile, dispatch]
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

  // Map redux data to MultiSelectDropdown options
  const materialOptions = (materials?.data || materials || []).map(mat => ({
    label: mat.material,
    value: mat.material,
  }));
  const sizeOptions = (sizes?.data || sizes || []).map(sz => ({
    label: sz.sizes,
    value: sz.sizes,
  }));
  const finishOptions = (finish?.data || finish || []).map(f => ({
    label: f.finish,
    value: f.finish,
  }));
  const seriesOptions = (series?.data || series || []).map(s => ({
    label: s.series,
    value: s.series,
  }));
  const colorOptions = (colors?.data || colors || []).map(c => ({
    label: c.colors,
    value: c.colors,
  }));

  const openEditMode = useCallback(tile => {
    setSelectedTile(tile);
    setEditFormData({
      name: tile.name || tile.tiles_name || '',
      priority: (tile.priority || '').replace(' Priority', ''),
      size: (Array.isArray(tile.size) ? tile.size : tile.size ? [tile.size] : []).map(val => ({
        label: val,
        value: val,
      })),
      material: (Array.isArray(tile.material)
        ? tile.material
        : tile.material
          ? [tile.material]
          : []
      ).map(val => ({ label: val, value: val })),
      finish: (Array.isArray(tile.finish) ? tile.finish : tile.finish ? [tile.finish] : []).map(
        val => ({ label: val, value: val })
      ),
      series: (Array.isArray(tile.series) ? tile.series : tile.series ? [tile.series] : []).map(
        val => ({ label: val, value: val })
      ),
      color:
        tile.color ||
        (tile.tiles_color && tile.tiles_color.length > 0 ? tile.tiles_color[0].color_name : ''),
    });
    setIsEditMode(true);
    setIsPopupOpen(false); // Close the view popup when opening edit mode
  }, []);

  const handleEditFormChange = useCallback((field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveEdit = useCallback(() => {
    // Prepare arrays for backend (map to string values)
    try {
      const updatedTile = {
        ...selectedTile,
        tiles_name: editFormData.name,
        priority: `${editFormData.priority}`,
        size: (editFormData.size || []).map(opt => opt.value),
        material: (editFormData.material || []).map(opt => opt.value),
        finish: (editFormData.finish || []).map(opt => opt.value),
        series: (editFormData.series || []).map(opt => opt.value),
        tiles_color: editFormData.color ? [{ color_name: editFormData.color }] : [],
      };
      // Dispatch updateTile thunk
      dispatch(updateTile({ id: selectedTile._id || selectedTile.id, data: updatedTile })).then(
        () => {
          // Update local tiles state immediately
          setTiles(prev =>
            prev.map(tile => {
              const tileId = tile._id || tile.id;
              const selectedId = selectedTile._id || selectedTile.id;
              return tileId === selectedId ? { ...updatedTile } : tile;
            })
          );
        }
      );
      setSelectedTile(updatedTile);
      setIsEditMode(false);
      toast.success('Tile updated successfully!');
    } catch (err) {
      toast.error('Failed to update tile.');
    }
  }, [selectedTile, editFormData, dispatch]);

  const handleFilterChange = useCallback(
    (category, value) => {
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
    },
    [dispatch, searchTerm]
  );

  const removeFilter = useCallback(
    (category, value) => {
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
    },
    [dispatch, searchTerm]
  );

  const clearAllFilters = useCallback(() => {
    const cleared = {};
    Object.keys(activeFilters).forEach(key => (cleared[key] = []));
    setActiveFilters(cleared);
    setSearchTerm('');
    dispatch(fetchTiles({})); // Fetch all tiles when filters are cleared
  }, [activeFilters, dispatch]);

  const handleSearchChange = useCallback(
    newSearchTerm => {
      setSearchTerm(newSearchTerm);
      const queryParams = { ...activeFilters };
      if (newSearchTerm) {
        queryParams.search = newSearchTerm;
      }
      dispatch(fetchTiles(queryParams));
    },
    [activeFilters, dispatch]
  );

  const getTotalFilters = useCallback(
    () => Object.values(activeFilters).flat().length,
    [activeFilters]
  );

  const totalDesigns = totalItems;

  // Add state for filter bar dropdowns
  const [sortBy, setSortBy] = useState('Priority');
  const [sortOrder, setSortOrder] = useState('Descending');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [favoriteFilter, setFavoriteFilter] = useState('');

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch tiles with page and append option
  const fetchWithAllFilters = useCallback(
    (pageToFetch = 1, append = false) => {
      if (!append) setIsLoadingMore(false);
      const queryParams = {
        ...activeFilters,
        tiles_name: searchTerm,
        sort_by: sortBy === 'Name' ? 'name' : sortBy.toLowerCase(),
        order: sortOrder === 'Descending' ? 'desc' : 'asc',
        status:
          statusFilter === 'Active'
            ? 'active'
            : statusFilter === 'Inactive'
              ? 'inactive'
              : undefined,
        priority:
          priorityFilter && priorityFilter !== 'All' ? priorityFilter.toLowerCase() : undefined,
        favorite:
          favoriteFilter === 'Favorited'
            ? 'true'
            : favoriteFilter === 'Not Favorited'
              ? 'false'
              : undefined,
        page: pageToFetch,
      };
      Object.keys(queryParams).forEach(
        key => queryParams[key] === undefined && delete queryParams[key]
      );
      dispatch(fetchTiles(queryParams)).then(res => {
        const data = res.payload?.data || res.payload || [];
        if (append) {
          setTiles(prev => [...prev, ...data]);
          setIsLoadingMore(false);
        } else {
          setTiles(data || []);
        }
        const perPage = res.payload?.perPage || 12;
        setHasMore(pageToFetch * perPage < (res.payload?.totalItems || totalItems));
      });
    },
    [
      activeFilters,
      searchTerm,
      sortBy,
      sortOrder,
      statusFilter,
      priorityFilter,
      favoriteFilter,
      dispatch,
      totalItems,
    ]
  );

  // Reset tiles and page on filter/sort/search change
  useEffect(() => {
    setPage(1);
    setTiles([]); // Only reset here
    fetchWithAllFilters(1, false);
  }, [
    activeFilters,
    searchTerm,
    sortBy,
    sortOrder,
    statusFilter,
    priorityFilter,
    favoriteFilter,
    fetchWithAllFilters,
  ]);

  // Load more handler
  const fetchMoreData = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWithAllFilters(nextPage, true);
  };

  const TileCard = ({ tile }) => {
    const tileId = tile.id || tile._id;
    const priorities = ['Low', 'Medium', 'High'];
    const currentPriority = tile.priority || '';
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
              handleToggleFavorite(tileId);
            }}
            className={`absolute top-3 right-3 p-1.5 rounded-md shadow-md transition-all duration-200 cursor-pointer ${tile.favorite ? 'bg-white' : 'bg-[#6F4E37] bg-opacity-90 hover:bg-opacity-100'}`}
          >
            <Icon
              name="Heart"
              size={16}
              className={`transition-all duration-300 ${tile.favorite ? 'text-[#6F4E37] fill-[#6F4E37]' : 'text-white fill-white'}`}
              colour={tile.favorite ? '#6F4E37' : '#fff'}
              // filled={tile.favorite}
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
                    {(Array.isArray(tile.size) ? tile.size : tile.size ? [tile.size] : []).map(
                      (sz, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700"
                        >
                          {sz}
                        </span>
                      )
                    )}
                  </div>
                ),
              },
              {
                label: 'Series',
                value: (
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(tile.series)
                      ? tile.series
                      : tile.series
                        ? [tile.series]
                        : []
                    ).map((s, i) => (
                      <span
                        key={i}
                        className="px-2  text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700"
                      >
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
                const isSelected = currentPriority.toLowerCase() === p.toLowerCase();
                return (
                  <button
                    key={p}
                    onClick={e => {
                      e.stopPropagation();
                      handlePriorityChange(tileId, full.toLowerCase());
                    }}
                    className={`cursor-pointer px-0.5 py-0.5 text-xs rounded-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${isSelected ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
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
              checked={tile.status === 'active'}
              onClick={e => {
                e.stopPropagation();
                handleToggleActive(tileId);
              }}
              className="w-4 h-4 cursor-pointer accent-[#6F4E37] transition-transform duration-300 hover:scale-125 bg-white border-[#6F4E37]"
            />
            <span className={`transition-all duration-300 text-[#6F4E37]`}>Active</span>
          </label>

          <button
            onClick={() => handleDelete(tileId)}
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
                  onClick={() => handlePriorityChange(tile.id || tile._id, full)}
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
              {tiles.map((tile, index) => (
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

                  <td className="px-2 sm:px-4 py-4 text-[16px] sm:text-sm text-gray-900 border-r border-gray-200 w-max-[105px] whitespace-normal">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(tile.size) ? tile.size : tile.size ? [tile.size] : []).map(
                        (sz, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700 mr-1 break-words"
                          >
                            {sz}
                          </span>
                        )
                      )}
                    </div>
                  </td>

                  <td className="px-2 sm:px-4 py-4 text-[16px] sm:text-sm text-gray-900 border-r border-gray-200 whitespace-normal">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(tile.material)
                        ? tile.material
                        : tile.material
                          ? [tile.material]
                          : []
                      ).map((mat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700 mr-1 break-words"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-2 sm:px-4 py-4 text-[16px] sm:text-sm text-gray-900 border-r border-gray-200 whitespace-normal">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(tile.finish)
                        ? tile.finish
                        : tile.finish
                          ? [tile.finish]
                          : []
                      ).map((fin, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700 mr-1 break-words"
                        >
                          {fin}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-4 text-[16px] sm:text-sm text-gray-900 border-r border-gray-200 whitespace-normal">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(tile.series)
                        ? tile.series
                        : tile.series
                          ? [tile.series]
                          : []
                      ).map((ser, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700 mr-1 break-words"
                        >
                          {ser}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-2 sm:px-4 py-4 border-r border-gray-200">
                    <button
                      onClick={() => handleToggleActive(tile.id || tile._id)}
                      className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                        tile.status === 'active'
                          ? 'bg-[#005E06] text-white hover:bg-[#004d05]'
                          : 'bg-[#DADADA] text-[#6E6E6E] hover:bg-[#cfcfcf]'
                      }`}
                    >
                      {tile.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  <td className="px-2 sm:px-4 py-4 border-r border-gray-200">
                    <button
                      onClick={() => handleToggleFavorite(tile.id || tile._id)}
                      className={`p-2 rounded transition cursor-pointer ${
                        tile.favorite
                          ? 'bg-white text-[#6F4E37] border border-[#6f4e37]'
                          : 'bg-[#6F4E37] text-white'
                      }`}
                    >
                      <Icon
                        name="Heart"
                        size={16}
                        className={`transition-all duration-300  ${
                          tile.favorite ? 'text-[#6F4E37] fill-[#6F4E37]' : 'text-white fill-white'
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
                      onClick={() => handleDelete(tile.id || tile._id)}
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

  const toggleSection = useCallback(section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  return (
    <div className="min-h-screen bg-white w-full">
      {loading && <Loader />}

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
          filteredTiles={tiles}
          totalDesigns={totalDesigns}
        />

        <div className="flex-1 min-h-[100%] bg-gray-50 flex flex-col w-full lg:ml-0">
          {/* Header */}
          <Header
            setSidebarOpen={setSidebarOpen}
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            favoriteFilter={favoriteFilter}
            setFavoriteFilter={setFavoriteFilter}
          />

          {/* Main Content */}
          <div className="flex-1 bg-white p-3 sm:p-4 lg:p-6 w-full relative">
            {/* Empty state */}
            {tiles?.length === 0 && (
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
                className={`${viewMode === 'grid' ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                  transition-opacity duration-500 ease-in-out
                  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full h-fit absolute inset-0`}
              >
                <InfiniteScroll
                  dataLength={tiles?.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={
                    <div className="w-full flex justify-center py-4">
                      {/* <h4>Loading...</h4> */}
                    </div>
                  }
                  scrollThreshold={0.95}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full h-fit min-h-[400px] absolute inset-0">
                    {tiles?.map(tile => (
                      <TileCard key={tile.id} tile={tile} />
                    ))}
                  </div>
                </InfiniteScroll>
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
        materialOptions={materialOptions}
        sizeOptions={sizeOptions}
        finishOptions={finishOptions}
        seriesOptions={seriesOptions}
        colorOptions={colorOptions}
      />
    </div>
  );
};

export default TileManagement;
