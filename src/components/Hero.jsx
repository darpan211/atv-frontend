import React from 'react';
import { ImageSlider } from './common/ImageSlider';
const Hero = () => {
  return (
    <div className="relative w-full h-[512px]">
      {/* Background Image */}
      <ImageSlider />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black flex items-center justify-end pr-16">
        <div className="text-right max-w-md">
          <h2 className="text-white text-3xl font-semibold">MAJESTIC SIZE,</h2>
          <h2 className="text-cyan-400 text-3xl font-semibold">MODERN AESTHETICS</h2>
        </div>
      </div>
    </div>
  );
};

export default Hero;
