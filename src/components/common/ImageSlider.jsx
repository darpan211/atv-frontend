import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ImageSlider({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  buttonShow = false,
  height = '500px',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = slideIndex => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (!autoPlay) return;

    const slideInterval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(slideInterval);
  }, [currentIndex, autoPlay, autoPlayInterval]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full h-[730px]`}>
      <div
        className="h-full w-full bg-cover bg-center duration-500   bg-no-repeat  flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
      >
        <div className="absolute inset-0" />

        <div className="z-10 text-center space-y-4 px-8"></div>

        {buttonShow && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-l-full cursor-pointer rounded-sm h-20 w-12 bg-white text-[#5c4033] hover:bg-gray-100 shadow-md text-4xl"
              onClick={goToPrevious}
            >
              {'<'}
            </Button>
          </div>
        )}

        {buttonShow && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-r-full cursor-pointer rounded-sm h-20 w-12  bg-white text-[#5c4033] hover:bg-gray-100 shadow-md text-4xl"
              onClick={goToNext}
            >
              {'>'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
