import { Heart, ShoppingBag } from 'lucide-react';
import React, { useEffect, useState } from 'react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TileCard = ({
  tile,
  index,
  isSelected,
  onTileClick,
  onToggleLike,
  isLiked,
  isListView = false,
}) => {
  const [data, setData] = useState(null);
  const [image, setImage] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const id = '686fb0c04f0fff9e6db151d8';
    const fetchTile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/tiles/gettiles/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const parsed = await res.json();
        const tileData = parsed?.data;
        setData(tileData);
        setImage(tileData?.tiles_image || '');
      } catch (err) {
        console.error('Error fetching tile:', err);
      }
    };
    fetchTile();
  }, []);
  const tileToShow = data || tile;
  const cardBorder = !isListView && isSelected ? 'border-[#6F4E37]' : 'border-white';
  const listViewStyle =
    isListView === false
      ? 'bg-none border-none shadow-none'
      : `bg-white ${cardBorder}  shadow hover:shadow-md`;

  return (
    <div
      className={`relative flex border-1 rounded-lg overflow-hidden transition-all cursor-pointer ${listViewStyle} hover:ring-2 hover:ring-[#6F4E37] hover:scale-[1.01]`}
      onClick={() => !isListView && onTileClick(tileToShow, index)}
    >
      {/* Image Section */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <img
          src={image || tileToShow.thumbnail}
          alt={tileToShow.tiles_name}
          className="w-full h-full object-cover"
        />
        <button
          className="absolute top-1 right-1 z-10 flex items-center bg-white/90 backdrop-blur-sm rounded-full w-6 h-6 justify-center shadow hover:bg-white"
          onClick={e => {
            e.stopPropagation();
            onToggleLike(tileToShow.id);
          }}
        >
          <Heart size={16} color={isLiked ? 'red' : 'gray'} fill={isLiked ? 'red' : 'none'} />
        </button>
      </div>

      {/* Info Section */}
      {isListView === true && (
        <div className="flex flex-col justify-between p-3 flex-grow">
          <div>
            <h3 className="text-sm font-semibold truncate max-w-[12rem]">
              {tileToShow.tiles_name || 'Untitled'}
            </h3>
            <p className="text-xs text-gray-600">
              {tileToShow.material?.join(', ') || 'Material N/A'}
            </p>
            {Array.isArray(tileToShow.size) && tileToShow.size.length > 1 && (
              <p className="text-xs text-[#6F4E37]">{tileToShow.size.length} Sizes</p>
            )}
          </div>

          <div className="flex justify-end items-center mt-2">
            {tileToShow.status !== 'out-of-stock' && (
              <button
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <ShoppingBag size={18} className="text-black hover:text-[#6F4E37]" />
              </button>
            )}
          </div>

          {/* More Info - Only if not in list view and selected */}
          {!isListView && isSelected && (
            <div className="mt-2">
              <hr className="my-2 border-t border-gray-200" />
              <div className="flex items-center justify-between text-sm text-[#6F4E37] font-medium">
                <button>
                  <span>More Product Detail</span>
                </button>
                <span className="text-lg">→</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TileCard;
