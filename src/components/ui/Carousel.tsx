'use client';

import React from 'react';
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';
import { useCarouselButtons, PrevButton, NextButton } from './CarouselButton';
import { useCarouselIndicator, CarouselIndicator } from './CarouselIndicator';

interface CarouselProps {
  children: React.ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = useCarouselButtons(emblaApi);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useCarouselIndicator(emblaApi);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">{children}</div>
      </div>
      <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
        Prev
      </PrevButton>
      <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
        Next
      </NextButton>
      <div className="flex justify-center mt-4">
        {scrollSnaps.map((_, index) => (
          <CarouselIndicator
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={`w-3 h-3 mx-1 rounded-full ${index === selectedIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};
