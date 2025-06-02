import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';
import TilesCard from './TilesCard';
import Footer from '../Home/Footer';

const HeaderTilesCart = () => {
  const DropdownIndicator = (props) => {
    const { selectProps } = props;
    const isMenuOpen = selectProps.menuIsOpen;

    return (
      <components.DropdownIndicator {...props}>
        <svg
          style={{
            transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            width: 16,
            height: 16,
            color: '#333',
          }}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
        </svg>
      </components.DropdownIndicator>
    );
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#D9D9D9',
      border: 'none',
      borderRadius: '0.5rem',
      boxShadow: 'none',
      minHeight: '40px',
      // Make font size responsive:
      fontSize: '1rem',
      '@media (max-width: 640px)': {
        minHeight: '36px',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#111',
      fontWeight: '500',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  // Filter states
  const [series, setSeries] = useState(null);
  const [category, setCategory] = useState(null);
  const [place, setPlace] = useState(null);
  const [size, setSize] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(null);

  // Dropdown options
  const seriesOptions = [];
  const categoryOptions = [];
  const placeOptions = [];
  const sizeOptions = [];

  // Filters config
  const filters = [
    {
      label: 'Series',
      width: 'w-full sm:w-40', // full width on xs, fixed on sm+
      value: series,
      onChange: setSeries,
      options: seriesOptions,
    },
    {
      label: 'Category',
      width: 'w-full sm:w-40',
      value: category,
      onChange: setCategory,
      options: categoryOptions,
    },
    {
      label: 'Suitable Place',
      width: 'w-full sm:w-44',
      value: place,
      onChange: setPlace,
      options: placeOptions,
    },
    {
      label: 'Size',
      width: 'w-full sm:w-40',
      value: size,
      onChange: setSize,
      options: sizeOptions,
    },
  ];

  const handleReset = () => {
    setSeries(null);
    setCategory(null);
    setPlace(null);
    setSize(null);
    setAppliedFilters(null);
  };

  const handleApply = () => {
    setAppliedFilters({
      series: series?.value || null,
      category: category?.value || null,
      place: place?.value || null,
      size: size?.value || null,
    });
  };

  return (
    <div>
      <div className="min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and Filter Section */}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between mb-8 gap-6">
          <div className="text-center lg:text-left w-full lg:w-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-2">
              Tiles List
            </h1>
            <div className="relative w-40 sm:w-52 h-0.5 bg-gray-300 mx-auto lg:mx-0">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-[#6F4E37]" />
            </div>
          </div>

          {/* Filters */}
          <div className="w-full flex flex-wrap justify-center lg:justify-end gap-4">
            {filters.map((filter, idx) => (
              <div key={idx} className={`${filter.width} max-w-full`}>
                <CreatableSelect
                  placeholder={filter.label}
                  styles={customSelectStyles}
                  components={{ DropdownIndicator }}
                  value={filter.value}
                  onChange={filter.onChange}
                  options={filter.options}
                  isClearable
                  isSearchable={false}
                />
              </div>
            ))}

            {/* Buttons */}
            <div className="w-full sm:w-auto flex gap-4 justify-center sm:justify-end">
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded w-full sm:w-auto"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="bg-[#6F4E37] text-white px-4 py-2 rounded w-full sm:w-auto"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Tiles List (filtered) */}
        <TilesCard filters={appliedFilters} />
      </div>

      <Footer />
    </div>
  );
};

export default HeaderTilesCart;
