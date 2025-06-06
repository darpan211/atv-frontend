import React from 'react';
import { PiSpinnerGapThin } from 'react-icons/pi';

const Spinner = ({ size = 40, color = 'text-blue-500' }) => {
  return (
    <div className="flex justify-center items-center py-4">
      <PiSpinnerGapThin className={`animate-spin ${color}`} size={size} />
    </div>
  );
};

export default Spinner;
