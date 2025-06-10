import { useState, useCallback, memo } from 'react';
import {
  Heart,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  Menu,
  ChevronLeft,
  ChevronRight,
  Edit,
} from 'lucide-react';
import img from '../../assets/image (2).png';
import { Icon } from '../common/icons';


// Move EditFormPopup outside and memoize it
const EditFormPopup = memo(({ tile, isOpen, onClose, formData, onChange, onSave, onDelete }) => {
  if (!isOpen || !tile) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#fdf0e6] rounded-md shadow-lg w-full max-w-2xl p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-0 right-0 text-gray-600 hover:text-black z-10 cursor-pointer"
          onClick={onClose}
          aria-label="Close edit form"
        >
          <X size={30} className="bg-[#6F4E37] text-white rounded-bl-sm p-1" />
        </button>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="aspect-square border w-full max-w-[262px] h-[300px] sm:h-[369px] rounded-lg p-2 mx-auto md:mx-0">
            <img
              src={img || '/placeholder.svg'}
              alt={tile.name}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                key={`name-${tile.id}`}
                type="text"
                placeholder="Enter name"
                value={formData.name || ''}
                onChange={e => onChange('name', e.target.value)}
                className="w-full mt-1 px-3 py-1.5 text-sm border rounded focus:outline-none bg-white focus:ring-2 focus:ring-[#7b4f28]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <div className="mt-1 flex  rounded overflow-hidden w-fit">
                {['Low', 'Medium', 'High'].map((level, idx) => (
                  <div className='flex space-x-2 bg-[#E9D8CB] p-1 '>

                    <button
                      key={level}
                      type="button"
                      className={`px-1 sm:px-4 py-0.5 text-xs rounded font-medium   transition-all cursor-pointer ${formData.priority === level
                        ? 'bg-[#7b4f28] text-white'
                        : 'bg-white text-gray-800 hover:bg-gray-50'
                        } ${idx === 0 ? 'rounded-l' : ''} ${idx === 2 ? 'rounded-r' : ''}`}
                      onClick={() => onChange('priority', level)}
                    >
                      {level}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dropdown Fields */}
            {[
              {
                label: 'Sizes',
                key: 'size',
                options: ['300 x 300', '400 x 400', '600 x 600', '800 x 800'],
              },
              {
                label: 'Materials',
                key: 'material',
                options: ['Porcelain', 'Ceramic', 'Natural Stone', 'Glass', 'Marble'],
              },
              {
                label: 'Finishes',
                key: 'finish',
                options: ['Glossy', 'Matte', 'Textured', 'Polished', 'Natural'],
              },
              {
                label: 'Series',
                key: 'series',
                options: ['Wooden', 'Modern', 'Classic', 'Luxury', 'Rustic'],
              },
              {
                label: 'Color',
                key: 'color',
                options: ['Gainsboro', 'White', 'Gray', 'Beige', 'Brown', 'Black'],
              },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <select
                  key={`${key}-${tile.id}`}
                  value={formData[key] || ''}
                  onChange={e => onChange(key, e.target.value)}
                  className="cursor-pointer w-full mt-1 px-3 py-1.5 bg-white text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#7b4f28]"
                >
                  <option value="">Select {label}</option>
                  {options.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => onDelete(tile.id)}
            className="cursor-pointer bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded hover:bg-gray-100 text-sm font-medium transition-colors"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onSave}
            className="cursor-pointer bg-[#6F4E37] text-white py-2 px-6 rounded hover:bg-[#6F4E37] text-sm font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
});

EditFormPopup.displayName = 'EditFormPopup';

const TilePopup = memo(({ tile, isOpen, onClose, onEdit, onDelete }) => {
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

  if (!isOpen || !tile) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="relative bg-[#FFF5EE] rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 z-10 cursor-pointer"
          aria-label="Close popup"
        >
          <X size={30} className="bg-[#6F4E37] text-white rounded-bl-sm p-1" />
        </button>

        {/* Content */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Section */}
            <div className="aspect-square border w-full max-w-[262px] h-[300px] sm:h-[369px] rounded-lg p-2 mx-auto md:mx-0">
              <img
                src={img || '/placeholder.svg'}
                alt={tile.name}
                className="w-full h-full object-cover rounded"
              />
            </div>

            {/* Details Section */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{tile.name}</h3>
                <p className="text-sm text-gray-600">{tile.code}</p>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Priority</label>
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getPriorityColor(tile.priority)}`}
                  >
                    {tile.priority}
                  </span>
                </div>
              </div>

              {/* Other Details */}
              {[
                { label: 'Sizes', value: tile.size },
                { label: 'Materials', value: tile.material },
                { label: 'Finishes', value: tile.finish },
                { label: 'Series', value: tile.series },
                { label: 'Color', value: tile.color },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">{label}</label>
                  <p className="text-sm text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 pt-4">
            <button
              onClick={() => onDelete(tile.id)}
              className="cursor-pointer px-4 py-2 bg-white text-black rounded-md font-medium transition-colors border border-gray-300 hover:bg-gray-50"
              style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}
            >
              Delete
            </button>

            <button
              onClick={() => onEdit(tile)}
              className="cursor-pointer px-4 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5a3d2b] transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Edit size={16} />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TilePopup.displayName = 'TilePopup';

const TileManagement = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTile, setSelectedTile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const [tiles, setTiles] = useState([
    {
      id: 1,
      name: 'MONALISA ONYX AQUA GMYK',
      code: '(S232DA83) copy',
      size: '600 x 600',
      series: 'Wooden',
      category: 'Floor Tiles',
      priority: 'High Priority',
      isActive: true,
      isFavorited: true,
      material: 'Porcelain',
      finish: 'Glossy',
      color: 'Gainsboro',
    },
    {
      id: 2,
      name: 'Name two',
      code: '(S232DA84)',
      size: '400 x 400',
      series: 'Modern',
      category: 'Wall Tiles',
      priority: 'High Priority',
      isActive: false,
      isFavorited: false,
      material: 'Ceramic',
      finish: 'Matte',
      color: 'White',
    },
    {
      id: 3,
      name: 'Name three',
      code: '(S232DA85)',
      size: '300 x 300',
      series: 'Classic',
      category: 'Bathroom Tiles',
      priority: 'Low Priority',
      isActive: true,
      isFavorited: true,
      material: 'Natural Stone',
      finish: 'Textured',
      color: 'Gray',
    },
    {
      id: 4,
      name: 'Tile name',
      code: '(S232DA86)',
      size: '800 x 800',
      series: 'Luxury',
      category: 'Kitchen Tiles',
      priority: 'Medium Priority',
      isActive: true,
      isFavorited: false,
      material: 'Marble',
      finish: 'Polished',
      color: 'Beige',
    },
  ]);

  const [activeFilters, setActiveFilters] = useState({
    series: [],
    collections: [],
    categories: [],
    finishes: [],
    sizes: [],
    materials: [],
    colors: [],
  });

  const filterOptions = {
    collections: ['Modern', 'Contemporary', 'Traditional', 'Vintage', 'Minimalist'],
    categories: ['Wall Tiles', 'Floor Tiles', 'Bathroom Tiles', 'Kitchen Tiles', 'Outdoor Tiles'],
    series: [
      'Modern',
      'Classic',
      'Mosaic',
      'Luxury',
      'Wooden',
      'Rustic',
      'Contemporary',
      'Minimalist',
    ],
    finishes: ['Glossy', 'Matte', 'Textured', 'Polished', 'Natural'],
    sizes: ['200 x 1200', '300 x 300', '400 x 400', '600 x 600', '800 x 800', '1200 x 600'],
    materials: ['Ceramic', 'Porcelain', 'Natural Stone', 'Glass', 'Marble'],
    colors: ['White', 'Black', 'Gray', 'Beige', 'Brown', 'Blue', 'Green', 'Gainsboro'],
  };

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
    },
    [selectedTile]
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
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value],
    }));
    setCurrentPage(1);
  }, []);

  const removeFilter = useCallback((category, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== value),
    }));
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    const cleared = {};
    Object.keys(activeFilters).forEach(key => (cleared[key] = []));
    setActiveFilters(cleared);
    setCurrentPage(1);
  }, [activeFilters]);

  const getTotalFilters = useCallback(
    () => Object.values(activeFilters).flat().length,
    [activeFilters]
  );

  const filteredTiles = tiles.filter(tile => {
    const matchesSearch =
      tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tile.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tile.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = Object.entries(activeFilters).every(([key, values]) => {
      if (values.length === 0) return true;

      switch (key) {
        case 'series':
          return values.includes(tile.series);
        case 'categories':
          return values.includes(tile.category);
        case 'materials':
          return values.includes(tile.material);
        case 'finishes':
          return values.includes(tile.finish);
        case 'sizes':
          return values.includes(tile.size);
        case 'colors':
          return values.includes(tile.color);
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredTiles.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTiles = filteredTiles.slice(startIndex, endIndex);

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
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <div
          className="relative bg-gray-200 p-2 sm:p-4 rounded-t-xl flex justify-center items-center h-32 sm:h-40 lg:h-44 cursor-pointer"
          onClick={() => openTilePopup(tile)}
        >
          <img
            src={img || '/placeholder.svg'}
            alt=""
            className="object-contain max-h-full max-w-full"
          />
          <button
            onClick={e => {
              e.stopPropagation();
              handleToggleFavorite(tile.id);
            }}
            className={`cursor-pointer absolute top-2 right-2 p-1.5 rounded-md shadow-md transition-all duration-200 ${tile.isFavorited ? 'bg-white' : 'bg-[#6F4E37] bg-opacity-90 hover:bg-opacity-100'
              }`}
          >
            <Heart
              size={16}
              className={`${tile.isFavorited ? 'text-[#6F4E37] fill-[#6F4E37]' : 'text-white fill-white'}`}
            />
          </button>
        </div>

        <div className="p-3 sm:p-4 space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{tile.name}</h3>
          <div className="space-y-1 text-xs sm:text-sm text-gray-600">
            {[
              { label: 'Size', value: tile.size },
              { label: 'Series', value: tile.series },
              { label: 'Category', value: tile.category },
              { label: 'Material', value: tile.material },
            ].map((item, index) => (
              <div key={index} className="flex justify-between gap-2">
                <span className="font-medium whitespace-nowrap">{item.label}:</span>
                <span className="text-right truncate flex-1">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1 bg-gray-100 rounded-full px-2 py-1 items-center">
              {priorities.map(p => {
                const full = `${p} Priority`;
                const isSelected = tile.priority === full;
                return (
                  <button
                    key={p}
                    onClick={() => handlePriorityChange(tile.id, full)}
                    className={`cursor-pointer px-2 py-0.5 text-xs rounded-full font-medium transition-all ${isSelected
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
              className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${getPriorityColor(tile.priority)}`}
            >
              {tile.priority}
            </span>
          </div>
        </div>
        <div className="mt-3 sm:mt-4">
          <div className="flex items-center justify-between bg-[#FFF5EE] rounded p-3 gap-3">
            <label className="inline-flex items-center gap-2 text-[#5C4033] text-sm font-medium">
              <input
                type="checkbox"
                checked={tile.isActive}
                onChange={() => handleToggleActive(tile.id)}
                className="accent-[#6F4E37] w-4 h-4 cursor-pointer"
              />
              Active
            </label>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(tile.id)}
              className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-[#5C4033] text-white rounded text-sm font-medium hover:opacity-90 transition-all"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TableView = () => {
    const PriorityControls = ({ tile }) => {
      const priorities = ['Low', 'Medium', 'High'];

      return (
        <div className="flex flex-col items-center space-y-2">
          <span
            className={`px-2 py-1 rounded text-white text-xs font-medium ${getPriorityColor(tile.priority)}`}
          >
            {tile.priority}
          </span>
          <div className="flex space-x-1 bg-[#E9D8CB] p-1 rounded-lg">
            {priorities.map(p => {
              const full = `${p} Priority`;
              const isSelected = tile.priority === full;
              return (
                <button
                  key={p}
                  onClick={() => handlePriorityChange(tile.id, full)}
                  className={`px-1 py-0.5 text-xs rounded font-medium transition-all cursor-pointer ${isSelected ? 'bg-white' : ' text-gray-600 hover:bg-gray-300'
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-[#6f4e37] text-white">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium border-r border-[#6f4e37]">
                  Image
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium border-r border-[#6f4e37]">
                  Tile Name
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium border-r border-[#6f4e37]">
                  Priority
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium border-r border-[#6f4e37]">
                  Size
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium border-r border-[#6f4e37]">
                  Material
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium border-r border-[#6f4e37]">
                  Finish
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium border-r border-[#6f4e37]">
                  Series
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium border-r border-[#6f4e37]">
                  Status
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium border-r border-[#6f4e37]">
                  Favorite
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
                  Actions
                </th>
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
                      src={img || '/placeholder.svg'}
                      alt={tile.name}
                      className="max-h-55 object-contain rounded-lg cursor-pointer"
                    />
                  </td>
                  <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm text-gray-900 border-r border-gray-200 font-medium">
                    {tile.name}
                  </td>
                  <td className="px-2 sm:px-4 py-4 border-r border-gray-200">
                    <PriorityControls tile={tile} />
                  </td>
                  <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm text-gray-900 border-r border-gray-200">
                    {tile.size}
                  </td>
                  <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm text-gray-900 border-r border-gray-200">
                    {tile.material}
                  </td>
                  <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm text-gray-900 border-r border-gray-200">
                    {tile.finish}
                  </td>
                  <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm text-gray-900 border-r border-gray-200">
                    {tile.series}
                  </td>
                  <td className="px-2 sm:px-4 py-4 border-r border-gray-200">
                    <button
                      onClick={() => handleToggleActive(tile.id)}
                      className={`px-2 py-1 cursor-pointer rounded text-xs font-medium transition-all ${tile.isActive
                        ? 'bg-[#005E06] text-white hover:bg-[#005e06ea]'
                        : 'bg-[#DADADA] text-[#6E6E6E] hover:bg-[#dadadaed]'
                        }`}
                    >
                      {tile.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-2 sm:px-4 py-4 border-r border-gray-200">
                    <button
                      onClick={() => handleToggleFavorite(tile.id)}
                      className={`p-2 rounded transition-all cursor-pointer ${tile.isFavorited
                        ? 'bg-white text-[#6F4E37] border-[#6f4e37] border'
                        : 'bg-[#6F4E37] text-white'
                        }`}
                    >
                      <Heart
                        size={14}
                        className={tile.isFavorited ? 'fill-[#6F4E37]' : 'fill-white'}
                      />
                    </button>
                  </td>
                  <td className="px-2 sm:px-4 py-4">
                    <button
                      onClick={() => handleDelete(tile.id)}
                      className="p-2 text-[#6F4E37] rounded transition-all cursor-pointer"
                    >
                      <Trash2 width={22.22} height={25} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={e => handleRowsPerPageChange(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="absolute right-2 top-1.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {startIndex + 1}-{Math.min(endIndex, filteredTiles.length)} of {filteredTiles.length}
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
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="flex w-full relative">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed lg:static top-0 left-0 z-40 w-72 sm:w-80 h-full bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:transition-none overflow-hidden flex flex-col`}
        >
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end p-4 border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-red-800"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
              <button
                onClick={clearAllFilters}
                className="cursor-pointer text-[#CA0000] hover:text-[#CA0000] text-sm font-medium underline hover:no-underline transition-all"
              >
                Clear All
              </button>
            </div>
            <p className="text-sm text-gray-800 font-medium">
              Total Designs:{' '}
              <span className="text-amber-800 font-bold">{filteredTiles.length}</span>
            </p>
            {getTotalFilters() > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                Active Filters:{' '}
                <span className="text-amber-800 font-semibold">{getTotalFilters()}</span>
              </p>
            )}
          </div>

          {getTotalFilters() > 0 && (
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {Object.entries(activeFilters).map(([category, items]) =>
                  items.map(item => (
                    <span
                      key={`${category}-${item}`}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200"
                    >
                      <span className="mr-1 capitalize">{category}:</span>
                      {item}
                      <button
                        onClick={() => removeFilter(category, item)}
                        className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                        aria-label={`Remove ${category} filter: ${item}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4">
            <FilterSection
              title="Collections"
              filterKey="collections"
              options={filterOptions.collections}
            />
            <FilterSection
              title="Categories"
              filterKey="categories"
              options={filterOptions.categories}
            />
            <FilterSection title="Series" filterKey="series" options={filterOptions.series} />
            <FilterSection title="Finishes" filterKey="finishes" options={filterOptions.finishes} />
            <FilterSection title="Sizes" filterKey="sizes" options={filterOptions.sizes} />
            <FilterSection
              title="Materials"
              filterKey="materials"
              options={filterOptions.materials}
            />
            <FilterSection title="Colors" filterKey="colors" options={filterOptions.colors} />
          </div>
        </div>

        <div className="flex-1 min-h-screen bg-gray-50 flex flex-col w-full lg:ml-0">
          <div className="bg-[#E9D8CB] px-4 py-3 border-b border-gray-200 flex-shrink-0 w-full">
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between ">
              <div className="flex items-start gap-2 sm:gap-4 flex-wrap justify-between w-full">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-white/50"
                  aria-label="Open sidebar"
                >
                  <Menu size={20} />
                </button>
                <div className="flex flex-col md:flex-row gap-3 md:items-start flex-1">
                  {/* Search Field - fixed width, stacked above on small screens */}
                  <div className="relative flex-shrink-0  w-52 sm:w-48 md:w-56">
                    <input
                      type="text"
                      placeholder="Search tiles..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pr-8 pl-4 py-2 rounded-md text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6f4e37]"
                      aria-label="Search tiles"
                    />
                    <Search
                      className="absolute right-2 top-2.5 h-5 w-5 text-[#6f4e37]"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Dropdown Filters */}
                  <div className="flex flex-wrap gap-2 md:ml-4">
                    {[
                      { label: 'Sort by', options: ['Name', 'Priority', 'Size'] },
                      { label: 'Order', options: ['Ascending', 'Descending'] },
                      { label: 'Status', options: ['Active', 'Inactive'] },
                      { label: 'Priority', options: ['Low', 'Medium', 'High'] },
                      { label: 'Favorites', options: ['Favorited', 'Not Favorited'] },
                    ].map((filter, index) => (
                      <div key={index} className="relative w-[135px] sm:w-auto flex-shrink-0">
                        <select className="w-full appearance-none px-3 pr-7 py-2 rounded-md text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6f4e37]">
                          <option>{filter.label}</option>
                          {filter.options.map(opt => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                          <Icon name="Arrow" width={8} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View Toggle */}
                <div className="w-full md:w-auto flex justify-center md:justify-center lg:justify-end gap-2 mt-3 sm:mt-0">
                  {/* Grid View */}
                  <div className="border border-gray-300 rounded-md ">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-all rounded ${viewMode === 'grid' ? 'bg-[#6f4e37]' : 'bg-white'} cursor-pointer`}
                      title="Grid View"
                      aria-label="Switch to grid view"
                      aria-pressed={viewMode === 'grid'}
                    >
                      <Icon
                        name={viewMode === 'grid' ? 'Grid' : 'Grid1'}
                        height="20"
                        width="20"
                        color={viewMode === 'grid' ? 'white' : '#6f4e37'}
                      />
                    </button>
                  </div>

                  {/* Table View */}
                  <div className="border border-gray-300 rounded-md ">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-2 transition-all rounded ${viewMode === 'table' ? 'bg-[#6f4e37]' : 'bg-white'} cursor-pointer`}
                      title="Table View"
                      aria-label="Switch to table view"
                      aria-pressed={viewMode === 'table'}
                    >
                      <Icon
                        name={viewMode === 'table' ? 'Main1' : 'Main'}
                        height="20"
                        width="20"
                        color={viewMode === 'table' ? 'white' : '#6f4e37'}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-2 sm:p-4 lg:p-6 overflow-auto w-full">
            {filteredTiles.length === 0 ? (
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
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
                {paginatedTiles.map(tile => (
                  <TileCard key={tile.id} tile={tile} />
                ))}
              </div>
            ) : (
              <TableView />
            )}
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
