import { Grid3x3, LayoutGrid, Trash2, Ungroup, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SettingPopup = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem('authToken');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const id = '686fb0c04f0fff9e6db151d8';

    const fetchtile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/tiles/gettiles/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const parsed = await res.json();
        const tile = parsed?.data;

        setData([tile]);
        setSelectedCategory(tile?.category || '');
      } catch (err) {
        console.error('Error fetching tile:', err);
      }
    };

    fetchtile();
  }, [isOpen]);
  if (!isOpen) return null;

  const getButtonClasses = category =>
    `flex items-center cursor-pointer justify-center px-1 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 border border-gray-300 rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[103px] ${
      selectedCategory === category ? 'bg-[#6F4E37] text-white' : 'bg-white text-black'
    }`;

  return (
    <div className="fixed bottom-25 right-10 z-50 bg-white h-100 rounded-lg shadow-lg border border-gray-200 overflow-hidden w-[95%] max-w-[400px]">
      {/* Header */}
      <div className="bg-[#f1e5dc] flex items-center justify-between px-4 pt-4 pb-2 text-black">
        <h3 className="text-3xl text-semibold">Selected Product</h3>
        <button onClick={onClose} className="hover:cursor-pointer">
          <X size={20} />
        </button>
      </div>

      {/* Category Buttons */}
      <div className="flex mt-3 p-1 rounded-lg items-center justify-center mb-2 gap-2">
        <button className={getButtonClasses('floor')}>
          <span className="mr-2 flex-shrink-0">
            <LayoutGrid />
          </span>
          <span className="font-semibold">Floors</span>
        </button>
        <button className={getButtonClasses('wall')}>
          <span className="mr-2 flex-shrink-0">
            <Ungroup />
          </span>
          <span className="font-semibold">Walls</span>
        </button>
        <button className={getButtonClasses('paint')}>
          <span className="mr-2 flex-shrink-0">
            <Grid3x3 />
          </span>
          <span className="font-semibold">Paint</span>
        </button>
      </div>

      {/* Tile Info */}
      {data.map((item, index) => (
        <div
          key={index}
          className="relative w-97 flex items-start justify-between px-3 py-2 rounded border border-shadow border-gray-200"
        >
          {/* Tile Image */}
          <img
            src={item.tiles_image}
            alt={`Tile ${index}`}
            className="w-20 h-20 object-cover rounded-md border"
          />

          {/* Tile Info */}
          <div className="flex-1 mx-4 pr-10">
            <h4 className="text-base font-semibold text-gray-800">{item.tiles_name}</h4>
            <p className="text-sm text-gray-500">Size: {item.size?.[0]}</p>
            <p className="text-sm text-gray-500 truncate max-w-[200px]">{item.description}</p>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => item._id}
            className="absolute bottom-2 right-2 bg-white border border-gray-300 p-1 hover:bg-gray-100 transition-colors"
          >
            <Trash2 />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SettingPopup;
