import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

const TilesSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  expandedSections,
  toggleSection,
  activeFilters,
  handleFilterChange,
  removeFilter,
  clearAllFilters,
  getTotalFilters,
  filterOptions,
  filteredTiles,
  totalDesigns,
}) => {
  const FilterSection = ({ title, filterKey, options }) => {
    const isExpanded = expandedSections[filterKey];
    const activeItems = activeFilters[filterKey] || [];

    return (
      <div className="border-b border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection(filterKey)}
          className="w-full flex items-center justify-between py-3 px-1 text-left font-medium text-gray-900 hover:text-gray-700"
          aria-expanded={isExpanded}
          aria-controls={`filter-section-${filterKey}`}
        >
          <span className="text-sm sm:text-base">{title}</span>
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 cursor-pointer" />
          ) : (
            <ChevronDown className="w-6 h-6 cursor-pointer" />
          )}
        </button>

        <div
          id={`filter-section-${filterKey}`}
          className={`${
            isExpanded ? 'block opacity-100 scale-y-100' : 'hidden opacity-0 scale-y-0'
          } transform origin-top transition-all duration-300 ease-in-out`}
        >
          <div className="pb-4 space-y-2 pt-1">
            {options.length === 0 ? (
              <p className="text-xs text-gray-500 italic pl-2">No options available</p>
            ) : (
              options.map(option => (
                <div key={option} className="flex items-center gap-3">
                  <Checkbox
                    id={`${filterKey}-${option}`}
                    checked={activeItems.includes(option)}
                    onCheckedChange={() => handleFilterChange(filterKey, option)}
                    className="border-[#6F4E37] cursor-pointer"
                  />
                  <Label htmlFor={`${filterKey}-${option}`} className="capitalize">
                    {option}
                  </Label>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // Determine if filters are applied
  const filtersApplied = Object.values(activeFilters).some(arr => arr.length > 0);

  return (
    <div
      className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed lg:static top-0 left-0 z-40 w-[250px] bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:transition-none flex flex-col`}
    >
      {/* Mobile Close Button */}
      <div className="lg:hidden flex justify-end p-4 border-b border-gray-200">
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-md text-white bg-[#6F4E37] hover:bg-[#5c3f2f]"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Header */}
      <div className="p-1 border-b border-gray-200 flex-shrink-0 bg-white h-[100px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
          <button
            onClick={clearAllFilters}
            className="cursor-pointer text-[#CA0000] hover:text-[#CA0000] text-sm font-medium underline"
          >
            Clear
          </button>
        </div>
        <p className="text-sm text-gray-800 font-medium">
          {/* Total Designs: <span className="text-amber-800 font-bold">{filtersApplied ? filteredTiles.length : totalDesigns}</span> */}
          Total Designs: <span className="text-amber-800 font-bold">{totalDesigns}</span>
        </p>
        {getTotalFilters() > 0 && (
          <p className="text-xs text-gray-600 mt-1">
            Active Filters:{' '}
            <span className="text-amber-800 font-semibold">{getTotalFilters()}</span>
          </p>
        )}
      </div>

      {/* Active Filters Display */}
      {getTotalFilters() > 0 && (
        <div className="bg-[#E0E0E0] px-2.5 pt-3">
          <div className="flex flex-wrap gap-1 max-h-full">
            {Object.entries(activeFilters).map(([category, items]) =>
              items.map(item => (
                <span
                  key={`${category}-${item}`}
                  className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded-sm bg-white text-[#005E06] border border-[#005e06] shadow-sm"
                >
                  <span className="mr-1 capitalize">{category}:</span>
                  {item}
                  <button
                    onClick={() => removeFilter(category, item)}
                    className="ml-1 hover:bg-green-200 rounded-full p-0.5 cursor-pointer"
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

      {/* Filter Sections */}
      <div className="flex-1 bg-[#E0E0E0] px-2.5 py-3 space-y-4 overflow-y-auto">
        <div className="space-y-1">
          {[
            // { title: 'Collections', key: 'collections' },
            { title: 'Categories', key: 'categories' },
            { title: 'Series', key: 'series' },
            { title: 'Finishes', key: 'finishes' },
            { title: 'Sizes', key: 'sizes' },
            { title: 'Materials', key: 'materials' },
            { title: 'Colors', key: 'colors' },
          ].map(({ title, key }) => (
            <div key={key} className="rounded-lg pl-1 w-[230px] bg-white">
              <FilterSection title={title} filterKey={key} options={filterOptions[key] || []} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TilesSidebar;
