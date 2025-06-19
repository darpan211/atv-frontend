import React from 'react';
import CloseIcon from '../../assets/Close.png';
import { Icon } from './icons';
import { LogOut } from 'lucide-react';

const LogOutConfirmationModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 transition-all duration-300">
      <div className="bg-[#FFF5EE] rounded-lg w-full max-w-sm p-6 relative shadow-lg border-gray-300 text-center">
        {/* Close Button (top-right) */}
        <button
          onClick={onCancel}
          className="absolute top-0 right-0 bg-[#6F4E37] text-white rounded-bl-lg rounded-tr-lg w-8 h-8 flex items-center justify-center hover:bg-[#4a3224] cursor-pointer"
        >
          <Icon name="Close" width="12px" height="12px" />
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <LogOut className="w-12 h-12 text-[#6F4E37]" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">Are you sure you want to log out?</h3>
        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            className="bg-white border  border-gray-300 text-gray-800 px-6 py-2 rounded shadow cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-100"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="bg-[#6F4E37] cursor-pointer text-white px-6 py-2 rounded shadow hover:bg-[#4a3224] transition"
            onClick={onConfirm}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogOutConfirmationModal;
