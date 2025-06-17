import React from 'react';

const NatureTilesShowcase = () => {
  const tileShowcases = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1974&auto=format&fit=crop',
      title: 'Floor Tiles',
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1770&auto=format&fit=crop',
      title: 'Floor Tiles',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-5">Surrender to nature</h2>
        <div className="flex justify-center mb-10">
          <div className="h-[2px] w-[170px] bg-gray-300 relative">
            <div className="absolute -top-1 left-1/2 w-5 h-5 bg-[#6F4E37] -translate-1/4 "></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tileShowcases.map(showcase => (
          <div
            key={showcase.id}
            className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <img src={showcase.image} alt={showcase.title} className="w-full h-95 object-cover" />
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
              <h3 className="text-white text-xl font-bold">{showcase.title}</h3>
              <div className="mt-2 flex items-center">
                <div className="h-px w-12 bg-white opacity-70 mr-3"></div>
                <a
                  href="#"
                  className="text-white text-sm tracking-wider uppercase font-medium hover:text-blue-300 transition-colors"
                >
                  Explore
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NatureTilesShowcase;
