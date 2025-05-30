import React from 'react';
import img from "../../assets/Tiles6.png";
import img1 from "../../assets/Tiles1.png";
import img2 from "../../assets/Tiles2.png";
import img3 from "../../assets/Tiles3.png";
import img4 from "../../assets/Tiles4.png";
import img5 from "../../assets/Tiles5.png";

const MainTilesCart = ({ image, title, description, series, category, suitablePlace, size }) => {
     return (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
               <div className="flex flex-col xl:flex-row gap-5 items-start">
                    
                    <div className="w-full xl:w-[164px] h-[200px] xl:h-[164px] rounded-md overflow-hidden border border-gray-300 bg-gray-100 flex-shrink-0">
                         <img
                              src={image || "/placeholder.svg"}
                              alt={title}
                              className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                         />
                    </div>

                    
                    <div className="flex-1 min-w-0">
                         <h3 className="font-semibold text-gray-900 text-base mb-1">{title}</h3>
                         <p className="text-sm text-gray-600 mb-2 leading-snug">{description}</p>
                         <div className="space-y-1 text-sm text-gray-800">
                              <div><span className="font-semibold">Series:</span> {series}</div>
                              <div><span className="font-semibold">Category:</span> {category}</div>
                              <div><span className="font-semibold">Suitable Place:</span> {suitablePlace}</div>
                              <div><span className="font-semibold">Size:</span> {size}</div>
                         </div>
                    </div>
               </div>
          </div>
     );
};


const TileCard = () => {
     const tilesData = [
          { id: 1, image: img, title: "Tiles Name", description: "Lorem Ipsum is simply dummy text of the printing and...", series: "Series A", category: "Wall", suitablePlace: "Kitchen", size: "300x300" },
          { id: 2, image: img1, title: "Tiles Name", description: "Lorem Ipsum is simply dummy text of the printing and...", series: "Series B", category: "Floor", suitablePlace: "Living Room", size: "600x600" },
          { id: 3, image: img2, title: "Tiles Name", description: "Lorem Ipsum is simply dummy text of the printing and...", series: "Series C", category: "Bathroom", suitablePlace: "Bathroom", size: "300x600" },
          { id: 4, image: img3, title: "Tiles Name", description: "Lorem Ipsum is simply dummy text of the printing and...", series: "Series D", category: "Outdoor", suitablePlace: "Balcony", size: "400x400" },
          { id: 5, image: img4, title: "Tiles Name", description: "Lorem Ipsum is simply dummy text of the printing and...", series: "Series E", category: "Kitchen", suitablePlace: "Backsplash", size: "200x200" },
          { id: 6, image: img5, title: "Tiles Name", description: "Lorem Ipsum is simply dummy text of the printing and...", series: "Series F", category: "Living Room", suitablePlace: "Accent Wall", size: "450x450" },
     ];

     return (
          <div className="min-h-screen py-10 bg-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                         {tilesData.map((tile) => (
                              <MainTilesCart
                                   key={tile.id}
                                   image={tile.image}
                                   title={tile.title}
                                   description={tile.description}
                                   series={tile.series}
                                   category={tile.category}
                                   suitablePlace={tile.suitablePlace}
                                   size={tile.size}
                              />
                         ))}
                    </div>

                    <div className="text-center mt-10">
                         <button className="bg-[#6F4E37] hover:bg-amber-900 text-white px-6 py-2 rounded text-sm font-medium transition duration-200">
                              Add New Tiles
                         </button>
                    </div>
               </div>
          </div>
     );
};

export default TileCard;






