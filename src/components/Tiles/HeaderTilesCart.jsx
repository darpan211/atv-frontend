import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';
import TilesCard from './TilesCard';
import Footer from '../Home/Footer';

const HeaderTilesCart = () => {
  const DropdownIndicator = props => {
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
    control: provided => ({
      ...provided,
      backgroundColor: '#D9D9D9',
      border: 'none',
      borderRadius: '0.5rem',
      boxShadow: 'none',
      minHeight: '40px',
      fontSize: '1rem',
    }),
    placeholder: provided => ({
      ...provided,
      color: '#111',
      fontWeight: '500',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  const [series, setSeries] = useState(null);
  const [category, setCategory] = useState(null);
  const [place, setPlace] = useState(null);
  const [size, setSize] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(null);

  const seriesOptions = [];
  const categoryOptions = [];
  const placeOptions = [];
  const sizeOptions = [];

  const filters = [
    {
      label: 'Series',
      width: 'w-full sm:w-32',
      value: series,
      onChange: setSeries,
      options: seriesOptions,
    },
    {
      label: 'Category',
      width: 'w-full sm:w-32',
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
      width: 'w-full sm:w-32',
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
        {/* Title and Filter Row */}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row justify-between items-center lg:items-start mb-8 gap-4">
          <div className="w-full lg:w-auto text-center lg:text-left flex justify-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-0 text-center w-[208px]">
              Tiles List
            </h1>
          </div>

          {/* Filters & Buttons Row */}
          <div className="w-full flex flex-wrap justify-center lg:justify-end items-center gap-2">
            {filters.map((filter, idx) => (
              <div key={idx} className={`${filter.width}`}>
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
            <button
              className="w-full sm:w-auto cursor-pointer bg-gray-700 text-white px-4 py-2 rounded text-sm"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className="w-full cursor-pointer sm:w-auto bg-[#6F4E37] hover:bg-[#5c3f2e] text-white px-4 py-2 rounded text-sm"
              onClick={handleApply}
            >
              Apply
            </button>
            <button
              className="w-full cursor-pointer sm:w-auto bg-[#6F4E37] hover:bg-[#5c3f2e] text-white px-4 py-2 rounded text-sm"
            >
              + Add New Tiles
            </button>
          </div>
        </div>

        {/* Tiles List */}
        <TilesCard filters={appliedFilters} />
      </div>

      <Footer />
    </div>
  );
};

export default HeaderTilesCart;
