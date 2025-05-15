import React, { useState, useEffect } from 'react';
import Loader from './common/Loader';
import { CATEGORIES, TILES_DATA } from '@/utils/constants';

const Room = () => {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [displayedCategory, setDisplayedCategory] = useState(0);

  // Use defensive programming to ensure we always have valid data
  const getCategoryName = index => {
    if (index >= 0 && index < CATEGORIES.length) {
      return CATEGORIES[index].name;
    }
    return 'Living Room'; // Default fallback
  };

  // Handle tab change with loading state
  const handleTabChange = index => {
    setSelected(index);
    setLoading(true);

    // After 2 seconds, update the displayed category and hide loader
    setTimeout(() => {
      setDisplayedCategory(index);
      setLoading(false);
    }, 2000);
  };

  // On initial load, set displayed category
  useEffect(() => {
    setDisplayedCategory(selected);
  }, []);

  const selectedCategory = getCategoryName(displayedCategory);

  // Ensure we have images for the selected category
  const currentImages = TILES_DATA[selectedCategory] || [];

  return (
    <div className="w-full px-4 md:px-10 py-10 text-center">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-2">Tiles that Adorn Your Spaces</h2>

      {/* Underline bar */}
      <div className="w-16 h-1 bg-sky-400 mx-auto rounded-full mb-6"></div>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {CATEGORIES.map((category, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`px-4 py-2 rounded-md border font-semibold transition-all cursor-pointer flex items-center
              ${
                selected === index
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'
              }`}
          >
            <span className="mr-2">{category.icon}</span>
            <span>{category.name}</span>
            <span className="ml-2 text-xs opacity-70">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Content Area with Loader */}
      <div className="relative min-h-[500px]">
        {/* Loader Component */}
        {loading && <Loader categoryName={getCategoryName(selected)} />}

        {/* Image Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center transition-opacity duration-300"
          style={{ opacity: loading ? '0.3' : '1' }}
        >
          {currentImages.map((img, idx) => (
            <div
              key={idx}
              className="overflow-hidden shadow hover:shadow-lg transition mx-auto"
              style={{ width: '347px', height: '245px', borderRadius: '10px' }}
            >
              <img
                src={img}
                alt={`${selectedCategory} Tile ${idx + 1}`}
                className="w-full h-full object-cover"
                style={{ borderRadius: '10px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Room;
