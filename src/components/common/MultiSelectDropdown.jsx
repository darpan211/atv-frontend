import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const MultiSelectDropdown = ({
  label,
  options,
  selectedValues,
  onChange,
  heightClass = 'h-11 w-full rounded-md',
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const handleCheckboxChange = (option) => {
    const isSelected = selectedValues.some(item => item.value === option.value);
    const updatedValues = isSelected
      ? selectedValues.filter(item => item.value !== option.value)
      : [...selectedValues, option];
    onChange(updatedValues);
  };

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return `Select ${label}`;
    if (selectedValues.length === 1) return selectedValues[0].label;
    return `${selectedValues.length} ${label} selected`;
  };

  return (
    <div className="relative" ref={ref}>
      <div
        role="button"
        tabIndex={0}
        onClick={toggleDropdown}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleDropdown()}
        className={`px-4 border border-gray-300 bg-white cursor-pointer flex justify-between items-center focus:outline-none ${heightClass}`}
      >
        {getDisplayValue()}

        {showDropdown ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>
      {showDropdown && (
        <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {options?.length > 0 ? (
            options.map(option => (
              <label
                key={option.value}
                className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={selectedValues.some(item => item.value === option.value)}
                  onChange={() => handleCheckboxChange(option)}
                />
                <span className="text-gray-800">{option.label}</span>
              </label>
            ))
          ) : (
            <label className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100">
              No Option
            </label>
          )}
        </div>
      )}
    </div>
  );
};
