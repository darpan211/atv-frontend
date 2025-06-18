import { useState } from 'react';
import { Search, Menu, ChevronDown, ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Icon } from '../common/icons';

const Header = ({ setSidebarOpen, viewMode, setViewMode, searchTerm, handleSearchChange, sortBy, setSortBy, sortOrder, setSortOrder, statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, favoriteFilter, setFavoriteFilter }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedValues] = useState({});

  const filterOptions = [
    { label: 'Sort by', options: ['Name', 'Priority', 'Size'], width: 'w-[160px]' },
    { label: 'Order', options: ['Ascending', 'Descending'], width: 'w-[160px]' },
    { label: 'Status', options: ['All', 'Active', 'Inactive'], width: 'w-[135px]' },
    { label: 'Priority', options: ['All', 'Low', 'Medium', 'High'], width: 'w-[148px]' },
    { label: 'Favorites', options: ['All', 'Favorited', 'Not Favorited'], width: 'w-[131px]' },
  ];

  // Handler for dropdown changes
  const handleDropdownChange = (label, value) => {
    switch (label) {
      case 'Sort by':
        setSortBy(value);
        break;
      case 'Order':
        setSortOrder(value);
        break;
      case 'Status':
        setStatusFilter(value);
        break;
      case 'Priority':
        setPriorityFilter(value);
        break;
      case 'Favorites':
        setFavoriteFilter(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-[#E9D8CB] p-2.5 border-b border-gray-200 w-full h-auto">
      <div className="flex flex-col space-y-4 sm:space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between w-full">
        <div className="flex flex-wrap items-center justify-between w-full gap-2">
          {/* Sidebar toggle for mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-white/50"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Search + Filter Section */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64 md:w-72">
              <Input
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                aria-label="Search tiles"
                className="peer pe-9 bg-white h-10 w-full focus:outline-none focus:ring-2 focus:ring-[#6f4e37]"
                placeholder="Search tiles..."
                type="text"
              />
              <div className="absolute inset-y-0 end-0 pe-3 flex items-center pointer-events-none">
                <Search size={16} color="#6f4e37" />
              </div>
            </div>

            {/* Filters (Mobile) */}
            <div className="grid grid-cols-2 gap-2 w-[95vw] sm:hidden animate-fade-in">
              {filterOptions.map((filter, index) => (
                <div
                  key={index}
                  className="relative text-lg font-medium transition-transform duration-300 transform hover:scale-[1.02]"
                >
                  <Select
                    value={(() => {
                      switch (filter.label) {
                        case 'Sort by': return sortBy;
                        case 'Order': return sortOrder;
                        case 'Status': return statusFilter;
                        case 'Priority': return priorityFilter;
                        case 'Favorites': return favoriteFilter;
                        default: return '';
                      }
                    })()}
                    onValueChange={value => handleDropdownChange(filter.label, value)}
                    onOpenChange={open => setExpandedIndex(open ? index : null)}
                  >
                    <SelectTrigger className="w-full h-10 flex justify-between items-center px-3 bg-white appearance-none [&>svg]:hidden">
                      <div className="flex justify-between items-center w-full">
                        <SelectValue
                          placeholder={selectedValues[filter.label] || filter.options[0]}
                        />
                        {expandedIndex === index ? (
                          <ChevronUp className="w-5 h-5 ml-2 shrink-0 text-black" />
                        ) : (
                          <ChevronDown className="w-5 h-5 ml-2 shrink-0 text-black" />
                        )}
                      </div>
                    </SelectTrigger>
                    <SelectContent
                      className={`transition-transform transition-opacity duration-300 ease-in-out transform origin-top-left ${
                        expandedIndex === index
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    >
                      {filter.options.map(opt => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Filters (Desktop) */}
            <div className="hidden sm:flex flex-wrap gap-4 animate-fade-in">
              {filterOptions.map((filter, index) => (
                <div
                  key={index}
                  className={`relative ${filter.width} text-lg font-medium transition-transform duration-300 transform hover:scale-[1.02]`}
                >
                  <Select
                    value={(() => {
                      switch (filter.label) {
                        case 'Sort by': return sortBy;
                        case 'Order': return sortOrder;
                        case 'Status': return statusFilter;
                        case 'Priority': return priorityFilter;
                        case 'Favorites': return favoriteFilter;
                        default: return '';
                      }
                    })()}
                    onValueChange={value => handleDropdownChange(filter.label, value)}
                    onOpenChange={open => setExpandedIndex(open ? index : null)}
                  >
                    <SelectTrigger className="w-full h-10 flex justify-between items-center px-3 bg-white appearance-none [&>svg]:hidden cursor-pointer">
                      <div className="flex justify-between items-center w-full">
                        <SelectValue
                          placeholder={selectedValues[filter.label] || filter.options[0]}
                        />
                        {expandedIndex === index ? (
                          <ChevronUp className="w-5 h-5 ml-2 shrink-0 text-black cursor-pointer" />
                        ) : (
                          <ChevronDown className="w-5 h-5 ml-2 shrink-0 text-black cursor-pointer" />
                        )}
                      </div>
                    </SelectTrigger>
                    <SelectContent
                      className={`transition-transform transition-opacity duration-300 ease-in-out transform origin-top-left ${
                        expandedIndex === index
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    >
                      {filter.options.map(opt => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex justify-center sm:justify-center w-full md:w-auto gap-2 mt-2 sm:mt-0">
            {/* Grid view */}
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-all rounded ${viewMode === 'grid' ? 'bg-[#6f4e37]' : 'bg-white'} cursor-pointer`}
              title="Grid View"
              aria-label="Switch to grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Icon
                name={viewMode === 'grid' ? 'Grid' : 'Grid1'}
                height="24"
                width="24"
                color={viewMode === 'grid' ? 'white' : '#6f4e37'}
              />
            </button>

            {/* Table view */}
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition-all rounded ${viewMode === 'table' ? 'bg-[#6f4e37]' : 'bg-white'} cursor-pointer`}
              title="Table View"
              aria-label="Switch to table view"
              aria-pressed={viewMode === 'table'}
            >
              <Icon
                name={viewMode === 'table' ? 'Main1' : 'Main'}
                height="18"
                width="24"
                color={viewMode === 'table' ? 'white' : '#6f4e37'}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
