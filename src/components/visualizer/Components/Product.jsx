import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Product = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem('authToken');

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
      } catch (err) {
        console.error('Error fetching tile:', err);
      }
    };

    fetchtile();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 px-4">
      {/* Product Card */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#e6d1c3] text-black flex justify-between items-center px-5 py-4">
          <h3 className="text-2xl font-semibold">Product</h3>
          <button onClick={onClose} className="hover:cursor-pointer">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[75vh]">
          {data.map((item, index) => (
            <div key={index} className="p-10">
              <div className="flex gap-8 ">
                <img
                  src={item.tiles_image}
                  alt="Tile"
                  className="w-28 h-42 object-cover rounded-lg border-1 border-solid-2 p-1"
                />
                <div className="flex flex-col justify-start text-sm">
                  <h4 className="font-semibold text-black mb-1">{item.tiles_name}</h4>
                  <p className="text-gray-600 leading-snug line-clamp-4">{item.description}</p>
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-black mb-1">Specifications</h5>
                <p className="text-sm text-gray-700">
                  <strong>Application Type:</strong> {item.category}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Surface:</strong> {item.material.join(', ')}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Size:</strong> {item.size?.join(', ') || '800 x 1600 CM'} CM
                </p>
              </div>

              {/* Add to Cart */}
              <div className="mt-4 flex justify-center">
                <button className="bg-[#6F4E37] text-white text-sm px-6 py-2 rounded shadow hover:bg-[#553b2d] transition hover:cursor-pointer">
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outside Navigation Footer */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button className="bg-white text-[#6F4E37] border border-[#6F4E37] px-4 py-4 rounded-md shadow-sm hover:bg-gray-100 hover:cursor-pointer">
          <svg
            width="19"
            height="35"
            viewBox="0 0 19 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.20215 18.6445C0.59968 18.0111 0.59968 16.9889 1.20215 16.3555L15.5859 1.23047L15.5869 1.23047C16.1962 0.590172 17.1887 0.590086 17.7979 1.23047C18.4003 1.86394 18.4003 2.88605 17.7979 3.51953L4.50098 17.5L17.7979 31.4805C18.4003 32.1139 18.4003 33.1361 17.7979 33.7695C17.1886 34.41 16.1951 34.4101 15.5859 33.7695L1.20215 18.6445Z"
              fill="#6F4E37"
              stroke="#6F4E37"
              stroke-width="0.5"
            />
          </svg>
        </button>
        <button className="bg-white text-[#6F4E37] border border-[#6F4E37] px-4 py-4 rounded-md shadow-sm hover:bg-gray-100 hover:cursor-pointer">
          <svg
            width="19"
            height="35"
            viewBox="0 0 19 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.7979 16.3555C18.4003 16.9889 18.4003 18.0111 17.7979 18.6445L3.41406 33.7695L3.41308 33.7695C2.80384 34.4098 1.81131 34.4099 1.20215 33.7695C0.59968 33.1361 0.59968 32.1139 1.20215 31.4805L14.499 17.5L1.20215 3.51953C0.599681 2.88605 0.599682 1.86394 1.20215 1.23047C1.81138 0.589992 2.80487 0.589926 3.41406 1.23047L17.7979 16.3555Z"
              fill="#6F4E37"
              stroke="#6F4E37"
              stroke-width="0.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Product;
