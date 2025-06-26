import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu, X, Image, LayoutGrid, Contact } from 'lucide-react';
import SliderConfig from './configure/SliderConfig';
import TilesPlaceConfig from './configure/TilesPlaceConfig';
import FeaturedImage from './configure/FeaturedImage';
import ContactConfig from './configure/ContactConfig';
import ProductFeaturesConfig from './configure/TilesInfoConfig';

const Configure = () => {
  const [activeTab, setActiveTab] = useState('slider');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: 'slider', label: 'Slider Images', icon: Image, component: <SliderConfig /> },
    { id: 'tiles', label: 'Tiles Places ', icon: LayoutGrid, component: <TilesPlaceConfig /> },
    { id: 'featuredImage', label: 'Featured Images', icon: LayoutGrid, component: <FeaturedImage /> },
    { id: 'ProductfeaturesImage', label: 'Product Features Images', icon: LayoutGrid, component: <ProductFeaturesConfig/> },
    { id: 'contact', label: 'Contact Info', icon: Contact, component: <ContactConfig /> },
  ];

  return (
    <div className="relative  bg-[#FFF5EE] h-full">
      {/* <div className="absolute top-0 left-0 w-full h-1/3 sm:h-1/2 bg-[#6F4E37] z-0"></div> */}
      <div className="absolute top-1/3 left-0 w-full h-2/3 sm:h-1/2 #6F4E37 z-0"></div>

      {/* Mobile Header */}
      <div className="sm:hidden flex items-center justify-between p-4 relative z-10">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-[#6F4E37] focus:outline-none"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="relative flex h-full bg-white">
        {/* Sidebar */}
        <div
          className={`sidebar fixed sm:h-[calc(100vh-4rem)] sm:z-10 sm:mt-[4em] inset-y-0 left-0 w-64 bg-[#FFF5EE] border-r border-gray-200 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0 transition-transform duration-300 z-50 animate-slide-in`}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold text-black mb-6 hidden sm:block">Configuration</h2>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center w-full p-3 rounded-md text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#6F4E37] text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-white' : 'text-[#6F4E37]'}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 sm:hidden z-40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg animate-fade-in">
              {tabs.find((tab) => tab.id === activeTab)?.component}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Configure;