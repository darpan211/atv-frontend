import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/redux/slice/categories/categoryThunks';
import { fetchSizes } from '@/redux/slice/sizes/sizeThunks';
import { fetchColors } from '@/redux/slice/colors/colorThunks';
import { fetchMaterials } from '@/redux/slice/material/materialThunks';
import { fetchSeries } from '@/redux/slice/series/seriesThunks';
import { fetchFinishes } from '@/redux/slice/finish/finishThunks';
import { toCapitalize } from '../../helpers';

const labelToThunkMap = {
  categories: fetchCategories,
  sizes: fetchSizes,
  colors: fetchColors,
  materials: fetchMaterials,
  series: fetchSeries,
  finish: fetchFinishes,
  addtiles : fetchCategories
};

const NavItem = ({ label, withDropdown, dropdownItems = [], enableDynamicNested = false }) => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories.list?.data ?? null);
  const sizes = useSelector(state => state.sizes.list?.data ?? null);
  const colors = useSelector(state => state.colors.list?.data ?? null);
  const materials = useSelector(state => state.materials.list?.data ?? null);
  const series = useSelector(state => state.series.list?.data ?? null);
  const finish = useSelector(state => state.finish.list?.data ?? null);

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [nestedItems, setNestedItems] = useState([]);
  const [activeMainKey, setActiveMainKey] = useState(null);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMainHover = async (item) => {
    if (!enableDynamicNested) return;
    const normalizedLabel = item.label?.toLowerCase().replace(/\s+/g, '');
    const matchedKey = Object.keys(labelToThunkMap).find(key =>
      normalizedLabel.includes(key)
    );

    if (matchedKey) {
      dispatch(labelToThunkMap[matchedKey]());
      setActiveMainKey(matchedKey);
    } else {
      setNestedItems([]);
      setActiveMainKey(null);
    }
  };

  const sourceMap = useMemo(() => ({
    categories,
    sizes,
    colors,
    materials,
    series,
    finish,
    addtiles: categories // Assuming 'addtiles' refers to categories for adding tiles
  }), [categories, sizes, colors, materials, series, finish]);

  useEffect(() => {
    if (!enableDynamicNested || !activeMainKey) return;

    const list = sourceMap[activeMainKey];
    if (list && list.length > 0) {
      const formatted = list.map((item) => {
        const labelValue =
          item.name ||
          item.category ||
          item.material ||
          item.sizes ||
          item.color ||
          item.series ||
          item.finish ||
          item.addtiles;

        const paramValue = encodeURIComponent(labelValue);
        return {
          label: toCapitalize(labelValue),
          path: `/tiles/${activeMainKey === 'addtiles' ?'add':'list'}?${activeMainKey ==='addtiles' ? 'category': activeMainKey}=${paramValue}`,
        };
      });

      setNestedItems(formatted);
    }
  }, [categories, sizes, colors, materials, series, activeMainKey, enableDynamicNested, sourceMap]);

  const handleClick = () => {
    if (withDropdown) {
      setIsOpen((prev) => !prev);
    }
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
        className={`flex items-center space-x-1 cursor-pointer 
          px-3 py-2 rounded-md transition duration-150 
          ${isOpen ? 'bg-white text-[#6C4A34]' : 'hover:bg-white hover:text-[#6C4A34] text-white'}`}
      >
        <span>{label}</span>
        {withDropdown && <ChevronDown className="w-4 h-4" />}
      </div>

      {withDropdown && isOpen && (
        <div className="absolute left-0 top-12 mt-1 w-56 bg-white text-black shadow-lg rounded-lg z-50">
          <ul className="py-2 text-sm">
            {dropdownItems.map((item, idx) => (
              <li
                key={idx}
                onMouseEnter={() => {
                  handleMainHover(item);
                  clearTimeout(timeoutRef.current); // clear any scheduled close
                }}
                onMouseLeave={() => {
                  timeoutRef.current = setTimeout(() => {
                    setActiveMainKey(null);
                    setNestedItems([]);
                  }, 300);
                }}
                className="group px-4 py-2 hover:bg-gray-100 border-b last:border-none hover:text-[#6C4A34] transition-all duration-200 ease-in-out cursor-pointer relative"
                onClick={() => item.path && handleItemClick(item.path)}
              >
                <div className="flex justify-between items-center">
                  {item.label}
                  {(item.hasDynamicChildren || !item.path) && (
                    <ChevronRight
                      className={`w-4 h-4 ml-2 transition-transform duration-200 ease-in-out ${
                        item.label.toLowerCase().replace(/\s+/g, '').includes(activeMainKey) && nestedItems.length > 0
                          ? 'rotate-90'
                          : ''
                      }`}
                    />
                  )}
                </div>

                {item.label.toLowerCase().replace(/\s+/g, '').includes(activeMainKey) && nestedItems.length > 0 && (
                  <ul
                    className="absolute top-0 left-full ml-1 w-56 bg-white text-black shadow-lg rounded-lg py-2 text-sm z-50"
                    onMouseEnter={() => clearTimeout(timeoutRef.current)}
                    onMouseLeave={() => {
                      timeoutRef.current = setTimeout(() => {
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
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavItem;
