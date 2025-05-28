import { useState, useEffect } from "react"
import Loader from "./Loader"
import { CATEGORIES, TILES_DATA } from "@/utils/constants"

const Room = () => {
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(false)
  const [displayedCategory, setDisplayedCategory] = useState(0)

  const getCategoryName = (index) => {
    if (index >= 0 && index < CATEGORIES.length) {
      return CATEGORIES[index].name
    }
    return "Living Room" 
  }

  const handleTabChange = (index) => {
    setSelected(index)
    setLoading(true)

    setTimeout(() => {
      setDisplayedCategory(index)
      setLoading(false)
    }, 2000)
  }

  useEffect(() => {
    setDisplayedCategory(selected)
  }, [])

  const selectedCategory = getCategoryName(displayedCategory)

  const currentImages = TILES_DATA[selectedCategory] || []

  return (
    <div className="w-full px-4 md:px-10 py-10 text-center">

      <h2 className="text-3xl font-bold mb-5">Tiles that Adorn Your Spaces</h2>

      <div className="flex justify-center mb-10">
        <div className="h-[2px] w-[170px] bg-gray-300 relative">
          <div className="absolute -top-1 left-1/2 w-5 h-5 bg-[#6F4E37] -translate-1/4 "></div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {CATEGORIES.map((category, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`px-4 py-2 rounded-md border font-semibold transition-all cursor-pointer flex items-center
              ${
                selected === index
                  ? "bg-[#6F4E37] text-white border-gray-800"
                  : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
              }`}
          >
            <span>{category.name}</span>
            <span className="ml-2 text-xs opacity-70">({category.count})</span>
          </button>
        ))}
      </div>

      <div className="relative min-h-[500px]">
        {loading && <Loader categoryName={getCategoryName(selected)} />}

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 justify-center transition-opacity duration-300"
          style={{ opacity: loading ? "0.3" : "1" }}
        >
          {currentImages.map((img, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden shadow hover:shadow-xl transition-all duration-500 mx-auto group cursor-pointer
                         h-[220px] sm:h-[240px] md:h-[180px] lg:h-[245px]
                         w-full rounded-lg"
            >
             
              <img
                src={img || "/placeholder.svg"}
                alt={`${selectedCategory} Tile ${idx + 1}`}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 rounded-lg"
              />

              
              <div className="absolute inset-0 bg-[#000d33]/60 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center rounded-lg">
               
                <div className="absolute w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 border-2 border-white rounded-md opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-700 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.5)]" />

               
                <div className="absolute text-white text-lg sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold tracking-wide opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-in-out">
                  Try with visualizer
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Room
