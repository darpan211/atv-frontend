import Hero from '@/components/Home/Hero';
import NatureTilesShowcase from '@/components/Home/NatureTilesShowcase';
import Room from '@/components/common/Room';
import GetInTouch from '@/components/Home/GetInTouch';
import Footer from '@/components/Home/Footer';
import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <Hero />
      <Room />
      <NatureTilesShowcase />
      <GetInTouch />
      <Footer/>

    </div>
  );
};

export default Dashboard;
