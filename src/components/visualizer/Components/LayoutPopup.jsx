import { BrickWall, X } from 'lucide-react';
import React, { useState } from 'react';

const LayoutPopup = ({ isOpen, onClose }) => {
  const [rotation, setRotation] = useState(0);
  const rotationOptions = [0, 90, 180, 270];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-18 right-4 sm:right-6 z-50 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden w-[95%] max-w-[700px]">
      {/* Header */}
      <div className="bg-[#e0dcda] flex items-center justify-between px-10 pt-4 pb-2 text-black">
        <h3 className="text-3xl font-semibold">Layout & Rotation</h3>
        <button onClick={onClose} className="hover: cursor-pointer">
          <X size={30} />
        </button>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 px-5 py-6">
        {[...Array(16)].map((_, index) => (
          <div
            key={index}
            className="aspect-square border flex items-center justify-center hover:border-[#6F4E37] transition hover:cursor-pointer"
          >
            <BrickWall
              className="w-full h-full text-gray-600"
              style={{ transform: `rotate(${rotation}deg)` }}
              strokeWidth={1.2}
            />
          </div>
        ))}
      </div>

      {/* Rotation Controls */}
      <div className="px-30 py-4 border border-gray-200 flex flex-wrap gap-4 justify-center">
        {rotationOptions.map(angle => (
          <label
            key={angle}
            className={`flex items-center justify-between gap-4 pl-4 pr-6 py-2 border rounded-full min-w-[120px] transition cursor-pointer ${
              rotation === angle
                ? 'bg-[#6F4E37] text-white border-[#6F4E37]'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="rotation"
              value={angle}
              checked={rotation === angle}
              onChange={() => setRotation(angle)}
              className="accent-[#6F4E37] w-4 h-4 cursor-pointer"
            />
            <span className="ml-auto font-medium">{angle}°</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default LayoutPopup;
