import React from 'react';
import { FaHeart, FaTrashAlt, FaEdit } from 'react-icons/fa';
import img from '../../assets/img1.png';

const dummyTiles = [
  {
    id: 1,
    imageUrl: {img},
    name: '',
    thickness: '',
    color: 'Gainsboro',
  },
  {
    id: 2,
    imageUrl: 'img1.png',
    name: '',
    thickness: '',
    color: 'Gainsboro',
  },
  {
    id: 3,
    imageUrl: 'img1.png',
    name: '',
    thickness: '',
    color: 'Gainsboro',
  },
  {
    id: 4,
    imageUrl: 'img1.png',
    name: '',
    thickness: '',
    color: 'Gainsboro',
  },
];

const TilesPreview = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {dummyTiles.map(tile => (
          <div
            key={tile.id}
            className="rounded-xl overflow-hidden border border-gray-300 shadow-md"
          >
            <img src={tile.imageUrl} alt="Tile" className="w-full h-40 object-cover" />

            <div className="p-4 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tile name"
                  className="w-full border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm"
                />
                <FaEdit className="absolute right-2 top-2.5 text-gray-500 text-sm" />
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Thickness"
                  className="w-full border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm"
                />
                <FaEdit className="absolute right-2 top-2.5 text-gray-500 text-sm" />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gray-400 border" />
                <span className="text-sm font-medium text-gray-800">{tile.color}</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#fceee3] px-4 py-2 rounded-b-xl">
              <button className="text-[#7b4f28]">
                <FaHeart size={16} />
              </button>
              <button className="flex items-center gap-1 text-white text-sm bg-[#7b4f28] px-3 py-1.5 rounded-md hover:bg-[#633e1f] transition">
                <FaTrashAlt size={12} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TilesPreview;