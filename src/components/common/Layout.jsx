import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Layout = ({ title, buttonLabel, onButtonClick, isEdit = false, children }) => {
  let heading = '';

  if (buttonLabel && onButtonClick) {
    heading = `List of ${title}`;
  } else if (isEdit) {
    heading = `Update ${title}`;
  } else {
    heading = `Add ${title}`;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{heading}</h1>
        {buttonLabel && onButtonClick && (
          <button
            onClick={onButtonClick}
            className="bg-[#6F4E37] cursor-pointer hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded"
          >
            {buttonLabel}
          </button>
        )}
      </div>
      <div>{children}</div>
      <ToastContainer />
    </div>
  );
};

export default Layout;
