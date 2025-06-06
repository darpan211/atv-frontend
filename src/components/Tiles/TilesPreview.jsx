import React, { useState, useEffect } from 'react';
import { Icon } from '../common/icons';
import { Input } from '../ui/input';

const TilePreview = ({ visible, onClose, tiles }) => {
  const [tileData, setTileData] = useState([]);

  useEffect(() => {
    if (tiles && tiles.length > 0) {
      const previewData = tiles.map((file, index) => ({
        id: index,
        file,
        preview: URL.createObjectURL(file),
        title: '',
        thickness: '',
      }));
      setTileData(previewData);
    }
  }, [tiles]);

  const handleInputChange = (id, field, value) => {
    setTileData(prev => prev.map(tile => (tile.id === id ? { ...tile, [field]: value } : tile)));
  };

  const removeTile = id => {
    setTileData(prev => prev.filter(tile => tile.id !== id));
  };

  const handleBackdropClick = e => {
    if (e.target.id === 'modal-backdrop') {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 px-4 sm:px-6"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#FFF5EE] w-full max-w-7xl rounded-xl p-6 sm:p-10 md:p-12 relative border shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">
          Tiles Preview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tileData.map(tile => (
            <div key={tile.id} className="relative bg-white rounded-xl shadow-md p-4 sm:p-6">
              <button
                onClick={() => removeTile(tile.id)}
                className="absolute cursor-pointer -top-1 -right-1 bg-[#6F4E37] text-white w-7 h-7 rounded flex items-center justify-center hover:bg-[#4A3224]"
              >
                <Icon name="Close" width="14px" height="14px" />
              </button>

              <div className="flex flex-col gap-4 items-center">
                <img
                  src={tile.preview}
                  alt="Tile Preview"
                  className="w-full sm:w-[150px] h-[150px] object-cover rounded border"
                />
                <Input
                  type="text"
                  placeholder="Tile Name"
                  value={tile.title}
                  onChange={e => handleInputChange(tile.id, 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <Input
                  type="text"
                  placeholder="Thickness (e.g., 10mm)"
                  value={tile.thickness}
                  onChange={e => handleInputChange(tile.id, 'thickness', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center sm:gap-6 gap-4">
          <button
            onClick={onClose}
            className="bg-white border cursor-pointer border-gray-400 text-gray-800 px-6 py-3 rounded hover:bg-gray-100 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button className="bg-[#6F4E37] cursor-pointer text-white px-6 py-3 rounded hover:bg-[#4A3224] w-full sm:w-auto">
            Add Tiles
          </button>
        </div>
      </div>
    </div>
  );
};

export default TilePreview;
