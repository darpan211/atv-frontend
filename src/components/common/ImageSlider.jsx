import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ImageSlider({ slides, autoPlay = true, autoPlayInterval = 5000, buttonShow = false }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex)
  }

  useEffect(() => {
    if (!autoPlay) return

    const slideInterval = setInterval(goToNext, autoPlayInterval)
    return () => clearInterval(slideInterval)
  }, [currentIndex, autoPlay, autoPlayInterval])

  if (!slides || slides.length === 0) {
    return null
  }

  return (
    <div className="relative h-screen w-full">
      <div
        className="h-full w-full bg-cover bg-center duration-500 flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="z-10 text-center space-y-4 px-8">
          <h2 className="text-4xl md:text-5xl font-bold satisfy-regular">{slides[currentIndex].title}</h2>
          <p className="text-xl md:text-2xl max-w-md mx-auto">{slides[currentIndex].description}</p>
        </div>

        {buttonShow && <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/30 hover:bg-black/50 text-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>}

        {buttonShow && <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/30 hover:bg-black/50 text-white"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={cn(
                "h-2 w-2 rounded-full cursor-pointer transition-all",
                currentIndex === slideIndex ? "bg-white w-4" : "bg-white/50",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
