import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { FiDownload } from 'react-icons/fi';

function TileImagesDownload() {
  const { slug } = useParams();
  const location = useLocation();

  const fullUrl = location.state?.fullUrl;
  const Title = location.state?.title;
  const canvasRef = useRef(null);

  const [size, setSize] = useState(400);

  useEffect(() => {
    if (canvasRef.current && fullUrl) {
      QRCode.toCanvas(canvasRef.current, fullUrl, { width: size }, err => {
        if (err) console.error(err);
      });
    }
  }, [fullUrl, size]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `tile-qr-${slug}-${size}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const sizes = [200, 300, 400, 500];

  return (
    <div className="min-h-screen bg-[#151515] flex flex-col">
      {/* Top Title Section */}
      <header className="w-full text-center p-6">
        <h1 className="text-3xl font-bold text-white">QR Code for {Title}</h1>
      </header>

      {/* QR Image Center Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 pb-40">
        <canvas ref={canvasRef} className="bg-white p-3 rounded shadow-sm mb-6" />
      </main>

      {/* Fixed Bottom Controls */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md p-4 flex flex-col sm:flex-row items-center justify-center gap-4 z-10">
        {/* Size Buttons */}
        <div className="flex gap-4">
          {sizes.map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-4 py-2 rounded-[12px] border text-sm font-medium cursor-pointer ${
                size === s
                  ? 'bg-[#6F4E37] text-white'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {s} × {s}
            </button>
          ))}
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="bg-[#6F4E37]  text-white px-5 py-2 rounded-[12px] hover:bg-[#5a3d2b] transition-all w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
        >
          <FiDownload className="text-lg" />
          Download QR Code
        </button>
      </footer>
    </div>
  );
}

export default TileImagesDownload;
