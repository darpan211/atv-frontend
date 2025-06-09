import React, { useState } from 'react';
import img from '../../assets/Filter1.png';
import { VscChromeClose } from 'react-icons/vsc';
import { Input } from '../ui/input';

const FilterPopup = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  const categoriesData = {
    'PRODUCT FAMILY': [
      'Tiles',
      'Terazzo',
      'Pool Tiles',
      'Marble Stone',
      'Quartz',
      'Paints',
      'Granite',
      'Vinyl',
    ],
    SIZES: [
      'Small (12x12)',
      'Medium (18x18)',
      'Large (24x24)',
      'Extra Large (36x36)',
      '12x24',
      '6x24',
      '8x48',
      'Mosaic',
    ],
    COLLECTIONS: [
      'Modern Classic',
      'Heritage',
      'Contemporary',
      'Rustic',
      'Luxury',
      'Vintage',
      'Minimalist',
      'Traditional',
    ],
    'COLOUR GROUP': [
      'White',
      'Black',
      'Grey',
      'Brown',
      'Beige',
      'Blue',
      'Green',
      'Red',
      'Yellow',
      'Multi-color',
    ],
    SURFACE: [
      'Glossy',
      'Matte',
      'Textured',
      'Polished',
      'Honed',
      'Brushed',
      'Sandblasted',
      'Natural',
    ],
    'COLOUR SHADES': [
      'Light',
      'Medium',
      'Dark',
      'Very Light',
      'Very Dark',
      'Neutral',
      'Warm',
      'Cool',
    ],
    MATERIALS: [
      'Ceramic',
      'Porcelain',
      'Natural Stone',
      'Glass',
      'Metal',
      'Wood',
      'Concrete',
      'Composite',
    ],
  };

  const categories = Object.keys(categoriesData);

  const handleOptionChange = (categoryName, option) => {
    setSelectedOptions(prev => {
      const categoryOptions = prev[categoryName] || [];
      const isSelected = categoryOptions.includes(option);
      if (isSelected) {
        return {
          ...prev,
          [categoryName]: categoryOptions.filter(item => item !== option),
        };
      } else {
        return {
          ...prev,
          [categoryName]: [...categoryOptions, option],
        };
      }
    });
  };

  const getCategoryCount = categoryName => selectedOptions[categoryName]?.length || 0;
  const getTotalCount = () =>
    Object.values(selectedOptions).reduce((total, options) => total + options.length, 0);

  const currentCategoryName = categories[selectedCategory];
  const currentOptions = categoriesData[currentCategoryName] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-lg w-full max-w-[900px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#6f4e37] text-white px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={img} alt="Filter Icon" className="w-6 h-6" />
            <h2 className="text-base md:text-lg font-semibold">Filter ({getTotalCount()})</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#6f4e37] bg-white rounded p-2 transition-colors"
          >
            <VscChromeClose className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 bg-gray-100 border-r border-gray-200 overflow-y-auto">
            <div className="p-3">
              {categories.map((cat, i) => {
                const count = getCategoryCount(cat);
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedCategory(i)}
                    className={`py-3 px-4 cursor-pointer mb-1 text-sm font-medium transition-colors ${
                      i === selectedCategory
                        ? 'bg-white text-gray-900 border-r-4 border-[#6F4E37] shadow-sm'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{cat}</span>
                      {count > 0 && <span className="text-[#6F4E37] font-semibold">({count})</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Options */}
          <div className="w-full md:w-2/3 p-4 overflow-y-auto bg-[#FFF5EE]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentOptions.map((opt, i) => {
                const isChecked = selectedOptions[currentCategoryName]?.includes(opt) || false;
                return (
                  <label
                    key={i}
                    className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:border-[#6F4E37] transition-all"
                  >
                    <div className="relative">
                      <Input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleOptionChange(currentCategoryName, opt)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-[#6F4E37] border-[#6F4E37]' : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-800 text-sm">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white p-4 flex flex-col md:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // console.log('Applied filters:', selectedOptions);
              onClose();
            }}
            className="px-4 py-2 bg-[#6F4E37] text-white rounded-lg hover:bg-[#6f4e37cc] transition-colors"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
