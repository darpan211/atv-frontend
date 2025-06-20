import { useState, useCallback, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Sidebar from './TilesSidebar';
import Header from './TilesHeader';
import { fetchTiles, updateTile, deleteTile } from '@/redux/slice/tiles/tileThunks';
import { toast } from 'react-toastify';
import { fetchColors } from '@/redux/slice/colors/colorThunks';
import { fetchFinishes } from '@/redux/slice/finish/finishThunks';
import { fetchSeries } from '@/redux/slice/series/seriesThunks';
import { fetchMaterials } from '@/redux/slice/material/materialThunks';
import { fetchCategories } from '@/redux/slice/categories/categoryThunks';
import { fetchSuitablePlaces } from '@/redux/slice/suitablePlace/suitablePlaceThunks';
import { fetchSizes } from '@/redux/slice/sizes/sizeThunks';
import Loader from '../common/Loader';
import ViewTilePopup from './ViewTilePopup';
import EditTilePopup from './EditTilePopup';
import TileCard from './TilesCard';
import TableView from './TableView';

const TileManagement = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTile, setSelectedTile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [favoriteFilter, setFavoriteFilter] = useState('');
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
  const totalItems = useSelector(state => state.tiles.tiles?.totalItems ?? 0);
  const sizes = useSelector(state => state.sizes.list?.data ?? []);
  const materials = useSelector(state => state.materials.list?.data ?? []);
  const finish = useSelector(state => state.finish.list?.data ?? []);
  const series = useSelector(state => state.series.list?.data ?? []);
  const colors = useSelector(state => state.colors.list?.data ?? []);

  // fetch filter option data on page load
  useEffect(() => {
    dispatch(fetchSizes());
    dispatch(fetchColors());
    dispatch(fetchFinishes());
    dispatch(fetchSeries());
    dispatch(fetchMaterials());
    dispatch(fetchCategories());
    dispatch(fetchSuitablePlaces());
  }, [dispatch]);

  const filterOptions = {
    categories: filteredTilesOptions.categories || [],
    series: filteredTilesOptions.series || [],
    finishes: filteredTilesOptions.finish || [],
    sizes: filteredTilesOptions.size || [],
    materials: filteredTilesOptions.material || [],
    colors: filteredTilesOptions.color || [],
  };

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
          console.log(error);
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
          console.log(error);
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
          console.log(error);
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
          setTiles(prev => prev.filter(t => t.id !== id && t._id !== id));
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

  const handleCancel = () => {
    setIsPopupOpen(false);
    setSelectedTile(null);
    setIsEditMode(false);
    setEditFormData({});
  };

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
      console.log(err);
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

  // Fetch tiles with page and append option
  const fetchWithAllFilters = useCallback(
    (pageToFetch = 1) => {
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
        setTiles(data || []);
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
    ]
  );

  // Reset tiles and page on filter/sort/search change
  useEffect(() => {
    setTiles([]); // Only reset here
    fetchWithAllFilters();
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

  const toggleSection = useCallback(section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  return (
    <div className="h-screen w-full flex overflow-hidden">
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

        <div className="flex flex-col flex-1 h-full">
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
          <div className="flex-1 overflow-y-auto bg-white p-3 sm:p-4 lg:p-6">
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
            <div className="w-full relative">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {tiles.map(tile => (
                    <TileCard
                      key={tile.id || tile._id}
                      tile={tile}
                      onOpen={openTilePopup}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleActive={handleToggleActive}
                      onPriorityChange={handlePriorityChange}
                      onDelete={handleDelete}
                      getPriorityColor={getPriorityColor}
                    />
                  ))}
                </div>
              ) : (
                <div className="opacity-100 transition-opacity duration-500 ease-in-out w-full absolute inset-0">
                  <TableView
                    tiles={tiles}
                    onEdit={openEditMode}
                    onOpen={openTilePopup}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleActive={handleToggleActive}
                    onPriorityChange={handlePriorityChange}
                    getPriorityColor={getPriorityColor}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      {!isEditMode && (
        <ViewTilePopup
          tile={selectedTile}
          isOpen={isPopupOpen}
          onClose={closeTilePopup}
          onEdit={openEditMode}
          onDelete={handleDelete}
        />
      )}

      <EditTilePopup
        key={selectedTile?.id || 'edit-popup'}
        tile={selectedTile}
        isOpen={isEditMode}
        onClose={closeTilePopup}
        formData={editFormData}
        onChange={handleEditFormChange}
        onSave={handleSaveEdit}
        onDelete={handleCancel}
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
