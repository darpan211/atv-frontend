import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toCapitalize } from '../../helpers';

const NavItem = ({ label, withDropdown, dropdownItems = [], onClick, enableDynamicNested = false }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const nestedCacheRef = useRef(new Map());

  const [isOpen, setIsOpen] = useState(false);
  const [activeMainKey, setActiveMainKey] = useState(null);
  const [nestedItems, setNestedItems] = useState([]);

  const filters = useSelector((state) => state.filters.list ?? {});
  const { categories, size, color, finish, material, series } = filters;

  const sourceMap = useMemo(
    () => ({
      categories,
      sizes: size,
      colors: color,
      materials: material,
      series,
      finish,
      addtiles: categories,
    }),
    [categories, size, color, finish, material, series]
  );

  const getLabelValue = (entry) => {
    if (typeof entry === 'string') return entry;
    const possibleKeys = ['name', 'category', 'material', 'size', 'color', 'series', 'finish'];
    for (const key of possibleKeys) {
      if (entry?.[key]) return entry[key];
    }
    return Object.values(entry).find((v) => typeof v === 'string') || 'Unknown';
  };

  const buildNestedItems = useCallback((matchedKey) => {
    const list = sourceMap[matchedKey];
    return list.map((entry) => {
      const labelValue = getLabelValue(entry);
      const paramValue = encodeURIComponent(labelValue);
      const isAdd = matchedKey === 'addtiles';
      return {
        label: toCapitalize(labelValue),
        path: `/tiles/${isAdd ? 'add' : 'list'}?${isAdd ? 'category' : matchedKey}=${paramValue}`,
      };
    });
  }, [sourceMap]);

  const handleMainHover = useCallback((item) => {
    if (!enableDynamicNested) return;

    const normalizedLabel = item.label?.toLowerCase().replace(/\s+/g, '');
    const matchedKey = Object.keys(sourceMap).find((key) => normalizedLabel.includes(key));
    if (!matchedKey || !sourceMap[matchedKey]?.length) {
      setNestedItems([]);
      setActiveMainKey(null);
      return;
    }

    const cacheKey = `${item.label.toLowerCase()}-${matchedKey}`;
    if (nestedCacheRef.current.has(cacheKey)) {
      const cached = nestedCacheRef.current.get(cacheKey);
      setNestedItems(cached);
      setActiveMainKey(matchedKey);
    } else {
      const formatted = buildNestedItems(matchedKey);
      nestedCacheRef.current.set(cacheKey, formatted);
      setNestedItems(formatted);
      setActiveMainKey(matchedKey);
    }
  }, [buildNestedItems, sourceMap, enableDynamicNested]);

  const handleClick = () => {
    if (withDropdown) setIsOpen((prev) => !prev);
  };

  const handleItemClick = (path) => {
    if (path) {
      navigate(path);
      setIsOpen(false);
      setActiveMainKey(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveMainKey(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={handleClick}
        className={`flex items-center space-x-1 cursor-pointer px-3 py-2 rounded-md transition duration-150 
          ${isOpen ? 'bg-white text-[#6C4A34]' : 'hover:bg-white hover:text-[#6C4A34] text-white'}`}
      >
      <span onClick={!withDropdown ? onClick : undefined}>
        {label}
      </span>
        {withDropdown && <ChevronDown className="w-4 h-4" />}
      </div>

      {withDropdown && isOpen && (
        <div className="absolute left-0 top-12 mt-1 w-56 bg-white text-black shadow-lg rounded-lg z-50">
          <ul className="py-2 text-sm">
            {dropdownItems.map((item, idx) => {
              const normalizedLabel = item.label.toLowerCase().replace(/\s+/g, '');
              const matchedKey = Object.keys(sourceMap).find((key) =>
                normalizedLabel.includes(key)
              );
              const showNested = matchedKey === activeMainKey && nestedItems.length > 0;

              return (
                <li
                  key={idx}
                  onMouseEnter={() => {
                    clearTimeout(hoverTimeoutRef.current);
                    hoverTimeoutRef.current = setTimeout(() => handleMainHover(item), 100); // Debounce hover
                  }}
                  onMouseLeave={() => {
                    hoverTimeoutRef.current = setTimeout(() => {
                      setActiveMainKey(null);
                      setNestedItems([]);
                    }, 300);
                  }}
                  className="group px-4 py-2 hover:bg-gray-100 border-b last:border-none hover:text-[#6C4A34] transition cursor-pointer relative"
                  onClick={() =>
                    item.path && !item.hasDynamicChildren && handleItemClick(item.path)
                  }
                >
                  <div className="flex justify-between items-center">
                    {item.label}
                    {(item.hasDynamicChildren || !item.path) && (
                      <ChevronRight
                        className={`w-4 h-4 ml-2 transition-transform duration-200 ease-in-out ${
                          showNested ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </div>

                  {showNested && (
                    <ul
                      className="absolute top-0 left-full ml-1 w-56 bg-white text-black shadow-lg rounded-lg py-2 text-sm z-50"
                      onMouseEnter={() => clearTimeout(hoverTimeoutRef.current)}
                      onMouseLeave={() => {
                        hoverTimeoutRef.current = setTimeout(() => {
                          setActiveMainKey(null);
                          setNestedItems([]);
                        }, 300);
                      }}
                    >
                      {nestedItems.map((subItem, subIdx) => (
                        <li
                          key={subIdx}
                          className="px-4 py-2 hover:bg-gray-100 border-b last:border-none hover:text-[#6C4A34] transition cursor-pointer"
                          onClick={() => handleItemClick(subItem.path)}
                        >
                          {subItem.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavItem;
