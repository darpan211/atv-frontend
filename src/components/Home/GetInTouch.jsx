import React from 'react';

const GetInTouch = () => {
  return (
    <div className="w-full px-4 md:px-10 py-8 text-center">
      <div className="mx-auto" style={{ width: '302px', height: '72px' }}>
        <h2 className="text-3xl font-bold mb-5">Get in touch </h2>
        <div className="flex justify-center mb-10">
          <div className="h-[2px] w-[150px] bg-gray-300 relative">
            <div className="absolute -top-1 left-1/2 w-5 h-5 bg-[#6F4E37] -translate-1/4 "></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-stretch max-w-5xl mx-auto rounded-lg overflow-hidden border border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-gray-50">
        {[1, 2, 3].map((_, idx) => (
          <div key={idx} className="flex-1 px-6 py-8">
            <h3 className="text-lg font-semibold mb-2">Visit a CERA Style Studio</h3>
            <p className="text-gray-600 text-sm">
              Explore elegant product displays that bring ideas to life.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetInTouch;
