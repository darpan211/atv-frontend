import React from 'react';
import { Icon } from '../common/icons';

const TileDetailsModal = ({ tile, onClose, onDelete, onEdit }) => {
  if (!tile) return null;

  return (
    <div className="fixed inset-0 backdrop-brightness-40 flex items-center justify-center z-50">
      <div className="bg-[#FFF5EE] w-full max-w-2xl rounded-xl p-6 relative shadow-lg border border-gray-300">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-0 right-0 mt-2 mr-2 bg-[#6F4E37] text-white rounded-bl-lg rounded-tr-lg w-8 h-8 flex items-center justify-center hover:bg-[#4a3224]"
        >
          <Icon name="Close" width="12px" height="12px" />
        </button>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-1/3">
            <img
              src={tile.image}
              alt={tile.title}
              className="w-full h-auto rounded-md border border-gray-300 p-2.5"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{tile.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{tile.description}</p>
            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <p>
                <strong>Series:</strong> {tile.series}
              </p>
              <p>
                <strong>Category:</strong> {tile.category}
              </p>
              <p>
                <strong>Suitable Place:</strong> {tile.suitablePlace}
              </p>
              <p>
                <strong>Size:</strong> {tile.size}
              </p>
              <p>
                <strong>Status:</strong> {tile.status}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button
            className="bg-white border cursor-pointer border-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-100 transition"
            onClick={onDelete}
          >
            Delete
          </button>
          <button
            className="bg-[#6F4E37] cursor-pointer text-white px-6 py-2 rounded hover:bg-[#4a3224] transition"
            onClick={onEdit}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TileDetailsModal;
