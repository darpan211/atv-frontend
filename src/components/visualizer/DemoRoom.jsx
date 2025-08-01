import { useState, useEffect } from 'react';
import { CATEGORIES, TILES_DATA } from '@/utils/constants';
import { Upload, Camera, Box,ScanQrCode } from 'lucide-react';
import Footer from '@/components/Home/Footer';
import visualizerVideo from '@/assets/visualizerintroVideo.mp4';

const VisualizerIntro = () => {
    const [selected, setSelected] = useState(0);
    const [displayedCategory, setDisplayedCategory] = useState(0);

    useEffect(() => {
        setDisplayedCategory(selected);
    }, []);

    const currentImages = TILES_DATA[CATEGORIES[displayedCategory]?.name] || [];

    return (
        <>
        <div className="w-full px-4 md:px-10 py-2">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-3xl font-bold mb-6">See products in your room</h2>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-12">
                    <div className="flex flex-col gap-4 items-start w-full max-w-sm text-left">
                        <div className="flex items-center gap-2">
                            <span className="text-amber-900">
                                <Camera />
                            </span>
                            <span className="text-base sm:text-sm">Upload a picture of your room</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-amber-900">
                                <Box />
                            </span>
                            <span className="text-base sm:text-sm">Try our products in your room</span>
                        </div>

                        <button className="w-full bg-[#6F4E37] text-white px-6 py-3 rounded-md flex items-center justify-center mt-3 gap-2 hover:bg-[#5c3f2d] transition">
                            <Upload className="w-5 h-5" />
                            Upload
                        </button>

                        <button className="w-full bg-[#6F4E37] text-white px-6 py-3 rounded-md flex items-center justify-center mt-1 gap-2 hover:bg-[#5c3f2d] transition">
                            <ScanQrCode className="w-5 h-5" />
                            Or scan a QR code to upload pictures
                        </button>
                    </div>

                    <div className="w-full max-w-2xl">
                        <video
                            src={visualizerVideo}
                            alt="Room Visualizer Illustration"
                            className="w-full rounded-lg shadow-md"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    </div>
                </div>

                <h3 className="text-3xl md:text-3xl font-bold mb-6">
                    Don't have a picture? Try our demo rooms instead
                </h3>

                {/* Demo Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {currentImages.slice(0, 8).map((img, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <img
                                src={img}
                                alt={`Demo ${index}`}
                                className="w-75 h-30 object-cover  shadow-sm hover:shadow-md transition"
                            />
                            <span className="text-sm font-bold mt-1">
                                {CATEGORIES[displayedCategory]?.name || 'Room'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
          <div className='mt-10'>
                <Footer/>
            </div>
</>
    );
};

export default VisualizerIntro;