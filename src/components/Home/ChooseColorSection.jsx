import img1 from "../../assets/image 4.svg";

const ChooseColorSection = () => {
     const handleImageClick = () => {
          window.location.href = "/colors";
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10 sm:py-16">
               <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 max-w-7xl w-full">
                    
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                         <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-snug">
                              Choose Your Color What You <br className="hidden lg:block" /> Want For Your Home
                         </h2>

                         <p className="text-sm sm:text-base text-gray-600 mt-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
                              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. Choose what you want for your home.
                         </p>

                         <hr className="my-6 border-gray-200" />

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm text-gray-800 justify-items-center lg:justify-items-start">
                              {["More Expensive", "Elegant Vein Patterns", "Red Alicante Marble", "Heat-Resistant", "Less Maintenance", "Stargate Gold Marble"].map((feature, index) => (
                                   <div key={index} className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#5f4339] rounded-full"></span>
                                        {feature}
                                   </div>
                              ))}
                         </div>
                    </div>

                    
                    <div className="w-full lg:w-1/2 flex justify-center">
                         <img
                              src={img1}
                              alt="Marble color options"
                              onClick={handleImageClick}
                              className="w-full max-w-[400px] h-auto object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                         />
                    </div>
               </div>
          </div>
     );
};

export default ChooseColorSection;
