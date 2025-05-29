import { useState, useEffect, useRef } from "react"
import { ChevronLeft, Heart, Menu, X } from "lucide-react"
import { TIELS } from "@/utils/constants"
import downloadIcon from "../../assets/download-icon.svg"
import addCatelogIcon from "../../assets/addCatelog-icon.svg"
import roomIcon from "../../assets/room-icon.svg"
import squear from "../../assets/squear.svg"
import { Icon } from "../common/icons"

const SearchDropdown = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)

  const suggestions = [
    { text: "Tiles One", icon: "🏠" },
    { text: "Tiles Two", icon: "🛁" },
    { text: "Tiles Three", icon: "🏢" },
    { text: "Ceramic Tiles", icon: "🧱" },
    { text: "Marble Tiles", icon: "✨" },
    { text: "Porcelain Tiles", icon: "🌟" },
  ]

  const filteredSuggestions = searchTerm
    ? suggestions.filter((item) => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
    : suggestions

  const handleFocus = () => {
    setIsDropdownOpen(true)
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    if (!isDropdownOpen) {
      setIsDropdownOpen(true)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.text)
    setIsDropdownOpen(false)

    if (dropdownRef.current) {
      const ripple = document.createElement("span")
      ripple.classList.add("ripple")
      dropdownRef.current.appendChild(ripple)
      setTimeout(() => {
        ripple.remove()
      }, 600)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-full" ref={searchRef}>
      <div
        className={`relative rounded-lg transition-all duration-300 shadow-lg ${isFocused ? "border-2 border-blue-500 shadow-blue-300/30" : "border border-gray-300"
          }`}
      >
        <div className="flex items-center bg-[#D9D9D9] rounded-lg">
          <span
            className={`pl-3 font-medium transition-colors duration-300 text-sm sm:text-base lg:text-lg ${isFocused ? "text-blue-600" : "text-gray-700"
              }`}
          >
            Tiles
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full py-2 sm:py-3 lg:py-4 px-3 text-gray-800 bg-transparent focus:outline-none transition-all text-sm sm:text-base lg:text-lg"
            placeholder=""
          />
          <div className={`pr-3 transition-transform duration-300 ${isFocused ? "scale-110" : ""}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 transition-colors duration-300 ${isFocused ? "text-blue-500" : "text-amber-800 opacity-70"
                }`}
              fill="currentColor"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
        </div>
      </div>

      <div
        ref={dropdownRef}
        className={`absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden transition-all duration-300 origin-top ${isDropdownOpen && filteredSuggestions.length > 0
          ? "opacity-100 scale-y-100 max-h-[300px] sm:max-h-[350px]"
          : "opacity-0 scale-y-0 max-h-0"
          }`}
      >
        {filteredSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="relative px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 text-gray-800 transition-all duration-200 flex items-center group"
            onMouseDown={() => handleSuggestionClick(suggestion)}
          >
            <span className="mr-2 sm:mr-3 transform group-hover:scale-110 transition-transform duration-200 text-sm sm:text-base lg:text-lg">
              {suggestion.icon}
            </span>
            <span className="group-hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base lg:text-lg">
              {suggestion.text}
            </span>
            <span className="absolute right-3 sm:right-4 lg:right-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200 text-blue-500">
              →
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const TileVisualizer = () => {
  const [selectedTileIndex, setSelectedTileIndex] = useState(null)
  const [likedTiles, setLikedTiles] = useState(TIELS.length >= 2 ? [TIELS[0].id, TIELS[1].id] : [])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const roomImage = "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1974&auto=format&fit=crop"
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-900 text-white">
      <div className="flex flex-1 overflow-hidden relative">
        <button
          className="fixed top-3 left-3 z-50 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#6F4E37] hover:bg-[#5a3e2a] text-white rounded-lg shadow-lg transition-colors duration-200 lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
        </button>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div
          className={`
            w-full max-w-sm 
            sm:max-w-md sm:w-80
            md:max-w-lg md:w-96
            lg:w-80 lg:max-w-none
            xl:w-96
            bg-[#EFEFEF] text-gray-800 flex flex-col
            fixed lg:relative inset-y-0 left-0 z-40
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            h-full lg:h-auto
          `}
        >
          <div className="flex justify-center items-center py-3 sm:py-4 lg:py-5 px-2 bg-[#EFEFEF] border-gray-300">
            <div className="flex-shrink-0">
              <Icon
                name="Logo"
                height="50px"
                width="50px"
                className="sm:h-[60px] sm:w-[60px] lg:h-[70px] lg:w-[70px]"
              />
            </div>
          </div>
          <div className="p-2 sm:p-3 lg:p-4 bg-[#EFEFEF] border-gray-300">
            <SearchDropdown />
          </div>
          <div className="flex-1 overflow-y-auto bg-[#EFEFEF]">
            <div className="space-y-2 sm:space-y-3 p-2 sm:p-3 lg:p-4">
              {TIELS.map((tile, index) => (
                <div
                  key={tile.id}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${selectedTileIndex === index ? "ring-2 ring-[#6F4E37] shadow-md" : ""
                    }`}
                  onClick={() => {
                    setSelectedTileIndex(index)
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false)
                    }
                  }}
                >
                  <div className="flex p-2 sm:p-3 lg:p-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex-shrink-0 relative">
                      <img
                        src={tile.thumbnail || "/placeholder.svg?height=80&width=80"}
                        alt={tile.name}
                        className="w-full h-full object-cover rounded"
                      />
                      <div
                        className="absolute -top-1 -right-1 flex items-center bg-white/90 backdrop-blur-sm rounded-full w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 justify-center cursor-pointer shadow-sm hover:bg-white transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          setLikedTiles((prev) =>
                            prev.includes(tile.id) ? prev.filter((id) => id !== tile.id) : [...prev, tile.id],
                          )
                        }}
                      >
                        <Heart
                          height={12}
                          width={12}
                          className="sm:h-[14px] sm:w-[14px] lg:h-[16px] lg:w-[16px]"
                          color={likedTiles.includes(tile.id) ? "red" : "gray"}
                          fill={likedTiles.includes(tile.id) ? "red" : "none"}
                        />
                      </div>
                    </div>
                    <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-800 truncate">{tile.name}</h3>
                      <p className="text-xs sm:text-sm lg:text-sm text-gray-600 truncate">Size: {tile.size}</p>
                      <p className="text-xs sm:text-sm lg:text-sm text-gray-600 truncate">{tile.finish}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-white min-h-screen lg:min-h-0">
          <div className="bg-[#EFEFEF] text-gray-800 p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-300 mx-2 sm:mx-3 lg:mx-4 mt-14 sm:mt-16 lg:mt-0 lg:rounded-bl-2xl lg:rounded-br-2xl shadow-lg gap-3 sm:gap-4">
            <div className="items-center gap-2 sm:gap-3 cursor-pointer">
              <button className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-[#6F4E37] hover:bg-[#5a3e2a] rounded transition-colors duration-200">
                <ChevronLeft className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>
              <span className="text-sm sm:text-base lg:text-lg font-medium">Back</span>
            </div>
            <div className="flex flex-col xs:flex-row sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-gray-300 rounded text-xs sm:text-sm lg:text-base hover:bg-gray-50 transition-colors duration-200 min-w-[120px] sm:min-w-[130px] lg:min-w-[140px]">
                <span className="mr-2 flex-shrink-0">
                  <img
                    src={downloadIcon || "/placeholder.svg?height=16&width=16"}
                    alt="download"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </span>
                <span>Download</span>
              </button>
              <button className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-[#6F4E37] hover:bg-[#5a3e2a] text-white rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[120px] sm:min-w-[130px] lg:min-w-[140px]">
                <span className="mr-2 flex-shrink-0">
                  <img
                    src={addCatelogIcon || "/placeholder.svg?height=16&width=16"}
                    alt="add catalog"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </span>
                <span>Add Catalog</span>
              </button>
              <button className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-[#6F4E37] hover:bg-[#5a3e2a] text-white rounded text-xs sm:text-sm lg:text-base transition-colors duration-200 min-w-[130px] sm:min-w-[140px] lg:min-w-[150px]">
                <span className="mr-2 flex-shrink-0">
                  <img
                    src={roomIcon || "/placeholder.svg?height=16&width=16"}
                    alt="room"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </span>
                <span>Change Room</span>
              </button>
              <button className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200">
                <img
                  src={squear || "/placeholder.svg?height=16&width=16"}
                  alt="square"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>
            </div>
          </div>
          <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 overflow-hidden bg-white">
            <div className="w-full h-full relative rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
              <img
                src={roomImage || "/placeholder.svg?height=600&width=800"}
                alt="Living room visualization"
                className="w-full h-auto max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] lg:max-h-[75vh] xl:max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default TileVisualizer