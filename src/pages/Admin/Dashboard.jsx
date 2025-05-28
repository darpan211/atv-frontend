import Hero from '@/components/Home/Hero';
import NatureTilesShowcase from '@/components/Home/NatureTilesShowcase';
import Room from '@/components/common/Room';
import GetInTouch from '@/components/Home/GetInTouch';
import Footer from '@/components/Home/Footer';
import React from 'react';
import BlockDesign from '@/components/Home/BlockDesign';
import ChooseColorSection from '@/components/Home/ChooseColorSection';

const Dashboard = () => {
  return (
    <div>
      <Hero />
      <Room />
      <NatureTilesShowcase />
      <BlockDesign />
      <ChooseColorSection />
      <GetInTouch />
      <Footer />

    </div>
  );
};

export default Dashboard;
