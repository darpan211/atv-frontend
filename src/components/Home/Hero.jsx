import React from 'react';
import { ImageSlider } from '../common/ImageSlider';
// import { ImageSlider } from '../common/ImageSlider';
// import { SLIDES } from '@/utils/constants';
const Hero = () => {
  const slides = [
    {
      url: 'https://img.freepik.com/free-photo/close-up-marble-textured-tiles_53876-88522.jpg?t=st=1747388113~exp=1747391713~hmac=31198fab486e924fc6e93f2976c292b093948e541cb3d9a2a10428df41d4d08b&w=1380',
      title: 'Discover Our Services',
      description: 'We provide high-quality solutions tailored to your business.',
    },
    {
      url: 'https://img.freepik.com/premium-photo/modern-ceramic-tiles-display-luxury-shopping-mall-shopping-mall-sell-ceramic-materials-tile_255667-81169.jpg?w=1380',
      title: 'Innovative Ideas',
      description: 'Turning your vision into reality with smart design and tech.',
    },
    {
      url: 'https://img.freepik.com/free-photo/close-up-marble-textured-tiles_53876-88522.jpg?t=st=1747388113~exp=1747391713~hmac=31198fab486e924fc6e93f2976c292b093948e541cb3d9a2a10428df41d4d08b&w=1380',
      title: 'Reliable Support',
      description: 'We’re with you every step of the way, 24/7.',
    },
  ];
  return (
    <div className="relative w-full ">
      {/* Background Image */}
      {/* <ImageSlider /> */}

      <ImageSlider
        slides={slides}
        autoPlay={true}
        autoPlayInterval={4000}
        buttonShow={true}
        height={'70vh'}
      />

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-end pr-16">
        <div className="text-right max-w-md">
          <h2 className="text-white text-3xl font-semibold">MAJESTIC SIZE,</h2>
          <h2 className="text-[#E05C00] text-3xl font-semibold">MODERN AESTHETICS</h2>
        </div>
      </div>
    </div>
  );
};

export default Hero;
