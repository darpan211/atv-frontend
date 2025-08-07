import { X } from 'lucide-react';
import React from 'react';

const GroutSettingsPopup = ({ isOpen, onClose, groutWidth, setGroutWidth }) => {
  if (!isOpen) return null;

  const groutColors = [
    '#d3d3d3',
    '#fcdede',
    '#fbeacb',
    '#e6e0c5',
    '#d6e8ce',
    '#ccede6',
    '#dbf9f4',
    '#c1e7f3',
    '#b5cfe2',
    '#d0e6f8',
    '#ccd5f3',
    '#dbbcf3',
    '#c9baf3',
    '#f4d1ed',
    '#d9a9d9',
    '#e4f7bc',
    '#586457',
    '#5c8274',
    '#5f7449',
    '#8e1212',
    '#dc9595',
    '#56ffb4',
    '#b2dbd5',
    '#9f5bd7',
  ];

  return (
    <div className="fixed bottom-12 right-4 sm:right-6 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden w-[95%] max-w-[700px] h-auto">
      {/* Header */}
      <div className="bg-[#e0dcda] flex items-center justify-between px-10 pt-6 pb-3 text-black">
        <h3 className="text-3xl font-medium">Grout Setting</h3>
        <div className="text-2xl font-medium">{groutWidth} (mm)</div>
        <button onClick={onClose} className="hover:cursor-pointer">
          <X size={30} />
        </button>
      </div>

      {/* Grout Width Slider */}
      <div className="px-4 sm:px-6 mt-4 mb-3">
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={groutWidth}
          onChange={e => setGroutWidth(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none bg-transparent range-slider"
        />
        <style jsx>{`
          input[type='range'].range-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 8px;
            background: linear-gradient(
              to right,
              #6f4e37 ${groutWidth * 10}%,
              #e5e7eb ${groutWidth * 10}%
            );
            border-radius: 9999px;
            cursor: pointer;
          }
          input[type='range'].range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: white;
            border: 2px solid #6f4e37;
            margin-top: -3px;
            cursor: pointer;
          }
          input[type='range'].range-slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: white;
            border: 4px solid #6f4e37;
            cursor: pointer;
          }
        `}</style>

        {/* Gray line below slider */}
        <div className="h-[2px] bg-gray-300 mt-4" />
      </div>

      {/* Grout Colors */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 px-4 sm:px-6 py-4">
        {groutColors.map((color, index) => (
          <div
            key={index}
            className="aspect-square rounded-sm border border-gray-300 cursor-pointer"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default GroutSettingsPopup;
