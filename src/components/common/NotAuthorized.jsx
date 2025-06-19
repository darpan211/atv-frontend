// src/pages/NotAuthorized.jsx
import React from 'react';

const NotAuthorized = () => {
  return (
    <div className="text-center py-10 h-[88vh] flex flex-col justify-center overflow-hidden">
      <h1 className="text-2xl font-bold text-red-600">403 - Not Authorized</h1>
      <p className="text-gray-700 mt-2">You do not have permission to access this page.</p>
    </div>
  );
};

export default NotAuthorized;
