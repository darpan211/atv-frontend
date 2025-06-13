import { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { Input } from '../ui/input';
import { Icon } from '../common/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const FilterDropdowns = () => {
  const [selectedValues] = useState({});

  const filterOptions = [
    { label: 'Sort by', options: ['Name', 'Priority', 'Size'], width: 'w-[160px]' },
    { label: 'Order', options: ['Ascending', 'Descending'], width: 'w-[160px]' },
    { label: 'Status', options: ['Active', 'Inactive'], width: 'w-[135px]' },
    { label: 'Priority', options: ['Low', 'Medium', 'High'], width: 'w-[148px]' },
    { label: 'Favorites', options: ['Favorited', 'Not Favorited'], width: 'w-[131px]' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Mobile layout: 2 columns */}
      <div className="grid grid-cols-2 gap-2 w-[95vw] sm:hidden">
        {filterOptions.map((filter, index) => (
          <div
            key={index}
            className="relative transition-transform duration-300 ease-in-out transform hover:scale-[1.02] text-lg font-medium"
          >
            <Select>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder={selectedValues[filter.label] || filter.options[0]} />
              </SelectTrigger>
              <SelectContent>
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

      {/* Desktop layout: horizontal flex */}
      <div className="hidden sm:flex flex-wrap gap-4">
        {filterOptions.map((filter, index) => (
          <div
            key={index}
            className={`
              relative
              w-full
              sm:w-auto
              flex-shrink-0
              ${filter.width}
              transition-transform
              duration-300
              ease-in-out
              transform
              hover:scale-[1.02]
              text-lg
              font-medium
            `}
          >
            <Select>
              <SelectTrigger className="w-full h-10 mr-5">
                <SelectValue placeholder={selectedValues[filter.label] || filter.options[0]} />
              </SelectTrigger>
              <SelectContent>
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
  );
};

const Header = ({ setSidebarOpen, viewMode, setViewMode, searchTerm, setSearchTerm }) => {
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
                onChange={e => setSearchTerm(e.target.value)}
                aria-label="Search tiles"
                className="peer pe-9 bg-white h-10 w-full focus:outline-none focus:ring-2 focus:ring-[#6f4e37]"
                placeholder="Search tiles..."
                type="text"
              />
              <div className="absolute inset-y-0 end-0 pe-3 flex items-center pointer-events-none">
                <Search size={16} color="#6f4e37" />
              </div>
            </div>

            {/* Filters */}
            <FilterDropdowns />
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