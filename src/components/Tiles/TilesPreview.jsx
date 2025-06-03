import React from 'react';
import img from '../../assets/Tiles6.png';
import img1 from '../../assets/Tiles1.png';
import img2 from '../../assets/Tiles2.png';
import img3 from '../../assets/Tiles3.png';
import img4 from '../../assets/Tiles4.png';
import img5 from '../../assets/Tiles5.png';
import { Icon } from '../common/icons';

const TilePreview = ({ visible, onClose }) => {
  if (!visible) return null;

  const [tiles, setTiles] = React.useState([
    { id: 1, image: img, title: 'Tiles Name', description: 'Lorem Ipsum...', series: 'test', category: 'test', suitablePlace: 'test', size: 'test' },
    { id: 2, image: img1, title: 'Tiles Name', description: 'Lorem Ipsum...', series: 'test', category: 'test', suitablePlace: 'test', size: 'test' },
    { id: 3, image: img2, title: 'Tiles Name', description: 'Lorem Ipsum...', series: 'test', category: 'test', suitablePlace: 'test', size: 'test' },
    { id: 4, image: img3, title: 'Tiles Name', description: 'Lorem Ipsum...', series: 'test', category: 'test', suitablePlace: 'test', size: 'test' },
    { id: 5, image: img4, title: 'Tiles Name', description: 'Lorem Ipsum...', series: 'test', category: 'test', suitablePlace: 'test', size: 'test' },
    { id: 6, image: img5, title: 'Tiles Name', description: 'Lorem Ipsum...', series: 'test', category: 'test', suitablePlace: 'test', size: 'test' },
  ]);

  const removeTile = id => {
    setTiles(prev => prev.filter(tile => tile.id !== id));
  };

  const handleBackdropClick = e => {
    if (e.target.id === 'modal-backdrop') {
      onClose(); // Close on outside click
    }
  };

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 px-4 sm:px-6"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#FFF5EE] w-full max-w-7xl rounded-xl p-6 sm:p-10 md:p-12 relative border shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">Tiles Preview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tiles.map(tile => (
            <div key={tile.id} className="relative bg-white rounded-xl shadow-md p-4 sm:p-6">
              <button
                onClick={() => removeTile(tile.id)}
                className="absolute -top-1 -right-1 bg-[#6F4E37] text-white w-7 h-7 rounded flex items-center justify-center hover:bg-[#4A3224]"
              >
                <Icon name="Close" width="14px" height="14px" />
              </button>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="w-full sm:w-[120px] h-auto sm:h-[120px] object-cover rounded border"
                />
                <div className="text-sm text-gray-700 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg mb-2">{tile.title}</h3>
                  <p className="text-gray-600 mb-2">{tile.description}</p>
                  <p><strong>Series:</strong> {tile.series}</p>
                  <p><strong>Category:</strong> {tile.category}</p>
                  <p><strong>Suitable Place:</strong> {tile.suitablePlace}</p>
                  <p><strong>Size:</strong> {tile.size}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center sm:gap-6 gap-4">
          <button
            onClick={onClose}
            className="bg-white border border-gray-400 text-gray-800 px-6 py-3 rounded hover:bg-gray-100 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button className="bg-[#6F4E37] text-white px-6 py-3 rounded hover:bg-[#4A3224] w-full sm:w-auto">
            Add Tiles
          </button>
        </div>
      </div>
    </div>
  );
};

export default TilePreview;
