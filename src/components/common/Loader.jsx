import React from 'react';

const Loader = ({ categoryName }) => {
  return (
    <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-80">
      <div className="relative">
        {/* Elegant tile-inspired loader */}
        <div className="tile-grid">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="tile"
              style={{
                animationDelay: `${i * 0.1}s`,
                backgroundColor: i % 2 === 0 ? '#60a5fa' : '#93c5fd',
              }}
            />
          ))}
        </div>
        <p className="mt-6 text-gray-600 font-medium">Loading {categoryName} tiles...</p>

        {/* CSS for the loader */}
        <style jsx>{`
          .tile-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 8px;
            width: 120px;
            height: 120px;
          }

          .tile {
            width: 100%;
            height: 100%;
            border-radius: 6px;
            animation: pulse 1.5s infinite ease-in-out;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          @keyframes pulse {
            0%,
            100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            50% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Loader;
