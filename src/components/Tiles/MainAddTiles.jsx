import Footer from "../Home/Footer";
import AddTiles from "./AddTiles";

export default function AddTilesForm() {
     return (<>
          <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-gray-900">
                    Add New Tiles
               </h1>
               <div className="relative w-40 sm:w-52 h-0.5 bg-gray-300 mb-8">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-[#6F4E37]"></div>
               </div>
               <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
               </div>
               <AddTiles />
          </div>
          <Footer />
     </>
     );
}
