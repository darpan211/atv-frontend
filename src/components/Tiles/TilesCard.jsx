'use client';

import { useState } from 'react';
import tileImage from '../../assets/room_1196_thumb 3.png';
import img from '../../assets/image (2).png';
import {
  Heart,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  Grid3X3,
  List,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Icon } from '../common/icons';

const TileManagement = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [tiles, setTiles] = useState([
    {
      id: 1,
      name: 'Name one',
      size: '600 x 600',
      series: 'Wooden',
      category: 'Floor Tiles',
      priority: 'Medium Priority',
      isActive: true,
      isFavorited: true,
      material: 'Porcelain',
      finish: 'Glossy',
    },
    {
      id: 2,
      name: 'Name two',
      size: '400 x 400',
      series: 'Modern',
      category: 'Wall Tiles',
      priority: 'High Priority',
      isActive: false,
      isFavorited: false,
      material: 'Ceramic',
      finish: 'Matte',
    },
    {
      id: 3,
      name: 'Name three',
      size: '300 x 300',
      series: 'Classic',
      category: 'Bathroom Tiles',
      priority: 'Low Priority',
      isActive: true,
      isFavorited: true,
      material: 'Natural Stone',
      finish: 'Textured',
    },
    {
      id: 4,
      name: 'Tile name',
      size: '800 x 800',
      series: 'Luxury',
      category: 'Kitchen Tiles',
      priority: 'Medium Priority',
      isActive: true,
      isFavorited: false,
      material: 'Marble',
      finish: 'Polished',
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
    colors: ['White', 'Black', 'Gray', 'Beige', 'Brown', 'Blue', 'Green'],
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

  const handlePriorityChange = (id, newPriority) => {
    setTiles(tiles.map(tile => (tile.id === id ? { ...tile, priority: newPriority } : tile)));
  };

  const handleToggleFavorite = id => {
    setTiles(
      tiles.map(tile => (tile.id === id ? { ...tile, isFavorited: !tile.isFavorited } : tile))
    );
  };

  const handleToggleActive = id => {
    setTiles(tiles.map(tile => (tile.id === id ? { ...tile, isActive: !tile.isActive } : tile)));
  };

  const handleDelete = id => {
    setTiles(tiles.filter(tile => tile.id !== id));
  };

  const toggleSection = section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (category, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value],
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const removeFilter = (category, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== value),
    }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    const cleared = {};
    Object.keys(activeFilters).forEach(key => (cleared[key] = []));
    setActiveFilters(cleared);
    setCurrentPage(1);
  };

  const getTotalFilters = () => Object.values(activeFilters).flat().length;

  const getPriorityColor = priority => {
    switch (priority) {
      case 'Low Priority':
        return 'bg-green-500';
      case 'Medium Priority':
        return 'bg-orange-500';
      case 'High Priority':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
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

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = newRowsPerPage => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const TileCard = ({ tile }) => {
    const priorities = ['Low', 'Medium', 'High'];

    return (
      <div className="w-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <div className="relative bg-gray-200 p-4 rounded-t-xl flex justify-center items-center h-32 sm:h-40 lg:h-44">
          <img src={img} alt="" />
          <button
            onClick={() => handleToggleFavorite(tile.id)}
            className={`absolute top-2 right-2 p-1.5 rounded-md shadow-md transition-all duration-200
    ${tile.isFavorited ? 'bg-white' : 'bg-[#6F4E37] bg-opacity-90 hover:bg-opacity-100'}`}
          >
            <Heart
              size={14}
              className={
                tile.isFavorited ? 'text-[#6F4E37] fill-[#6F4E37]' : 'text-white fill-white'
              }
            />
          </button>
        </div>

        <div className="p-4 sm:p-4 space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{tile.name}</h3>

          <div className="space-y-1 text-xs sm:text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">Size:</span>
              <span className="text-right">{tile.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Series:</span>
              <span className="text-right truncate ml-2">{tile.series}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Category:</span>
              <span className="text-right truncate ml-2">{tile.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Material:</span>
              <span className="text-right truncate ml-2">{tile.material}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1 bg-gray-100 rounded-full px-2 py-1 h-7 items-center">
              {priorities.map(p => {
                const full = `${p} Priority`;
                const isSelected = tile.priority === full;
                return (
                  <button
                    key={p}
                    onClick={() => handlePriorityChange(tile.id, full)}
                    className={`px-1.5 py-0.5 text-xs rounded-full font-medium transition-all h-full flex-1 ${
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
              className={`text-xs font-semibold px-2 py-1 rounded-full text-center text-white ${getPriorityColor(tile.priority)}`}
            >
              {tile.priority}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={() => handleToggleActive(tile.id)}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-all flex-1 ${
                tile.isActive
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              <Check size={14} />
              {tile.isActive ? 'Active' : 'Inactive'}
            </button>

            <button
              onClick={() => handleDelete(tile.id)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-800 border border-red-200 rounded text-xs sm:text-sm font-medium hover:bg-red-200 transition-all flex-1"
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
                  className={`px-1 py-0.5 text-xs rounded font-medium transition-all ${
                    isSelected ? 'bg-white' : ' text-gray-600 hover:bg-gray-300'
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
                  <td className="px-2 sm:px-4 py-4 border-r border-gray-200">
                    <img
                      src={tileImage}
                      alt={name}
                      className="max-h-55 object-contain rounded-lg"
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
                  <td className="px-2 sm:px-4 py-4 border-r border-gray-200 ">
                    <button
                      onClick={() => handleToggleActive(tile.id)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                        tile.isActive
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
                      className={`p-2 rounded transition-all ${
                        tile.isFavorited
                          ? 'bg-white text-[#6F4E37] border-[#6f4e37] border' // background white, text #6F4E37
                          : 'bg-[#6F4E37] text-gray-600 '
                      }`}
                    >
                      <Heart
                        size={14}
                        fill={tile.isFavorited ? '#6F4E37' : 'white'} // fill color set karo
                      />
                    </button>
                  </td>
                  <td className="px-2 sm:px-4 py-4">
                    <button
                      onClick={() => handleDelete(tile.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                    >
                      <Trash2 size={14} />
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
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
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
        >
          <span className="text-sm sm:text-base">{title}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div className="pb-4 space-y-2 max-h-48 overflow-y-auto">
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
      <div className="flex w-full">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
    fixed lg:static 
    top-16 lg:top-0 
    inset-y-0 left-0 
    z-40 
    w-72 sm:w-80 
    bg-white 
    border-r border-gray-200 
    transition-transform duration-300 ease-in-out 
    lg:translate-x-0 
    lg:transition-none 
    overflow-hidden 
    flex flex-col
  `}
        >
          <div className="lg:hidden flex justify-end p-4 border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          {/* Filter Header */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
              <button
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700 text-sm font-medium underline hover:no-underline transition-all"
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
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="flex-1 min-h-screen bg-gray-50 flex flex-col w-full">
          <div className="bg-[#E9D8CB] px-4 py-3 border-b border-gray-200 flex-shrink-0 w-full">
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between w-full">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-white/50"
                >
                  <Menu size={20} />
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-shrink-0">
                    <input
                      type="text"
                      placeholder="Search tiles..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-8 pr-4 py-2 rounded-md text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-24 sm:w-32 md:w-40"
                    />
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="hidden md:flex gap-2">
                  <select className="px-3 py-2 rounded-md text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option>Sort by</option>
                    <option>Name</option>
                    <option>Priority</option>
                    <option>Size</option>
                  </select>
                  <select className="px-3 py-2 rounded-md text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option>Order</option>
                    <option>Ascending</option>
                    <option>Descending</option>
                  </select>
                  <select className="px-3 py-2 rounded-md text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option>Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                <div className="flex gap-2 border border-gray-300 rounded-md overflow-hidden bg-white p-1">
  
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-all rounded ${
                      viewMode === 'grid' ? 'bg-white ' : 'bg-[#6f4e37]'
                    }`}
                    title="Grid View"
                  >
                    <Icon
                      name={viewMode === 'grid' ? 'Grid1' : 'Grid'}
                      height="50px"
                      width="50px"
                      color={viewMode === 'grid' ? '#6f4e37' : 'white'}
                    />
                  </button>

                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 transition-all rounded ${
                      viewMode === 'table' ? 'bg-white ' : 'bg-[#6f4e37]'
                    }`}
                    title="Table View"
                  >
                    <Icon
                      name={viewMode === 'table' ? 'Main' : 'Main1'}
                      height="50px"
                      width="50px"
                      color={viewMode === 'table' ? 'white' : '#6f4e37 '}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4   gap-4 w-full">
                {filteredTiles.map(tile => (
                  <TileCard key={tile.id} tile={tile} />
                ))}
              </div>
            ) : (
              <TableView />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TileManagement;
