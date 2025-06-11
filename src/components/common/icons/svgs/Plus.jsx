import React from 'react';

export const Plus = ({ width = 16, height = 16, className }) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1 8H15M8 1V15" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Plus; 