
import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface CardCarouselProps {
  onPick: (cardIndex: number) => void;
  maxPick: number;
  pickedIndices: number[];
}

export const CardCarousel: React.FC<CardCarouselProps> = ({ onPick, maxPick, pickedIndices }) => {
  const [activeIndex, setActiveIndex] = useState(10);
  const totalCardsCount = 78; // A full tarot deck is 78 cards, using 22 for visual logic but displaying true count

  const handleNext = useCallback(() => setActiveIndex((prev) => Math.min(prev + 1, 21)), []);
  const handlePrev = useCallback(() => setActiveIndex((prev) => Math.max(prev - 1, 0)), []);

  const onWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) handleNext();
    else handlePrev();
  };

  const cards = Array.from({ length: 22 });

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto h-[400px] flex flex-col items-center justify-center select-none"
      onWheel={onWheel}
    >
      <div className="absolute top-0 right-0 text-purple-500/50 text-[10px] tracking-widest font-bold uppercase">
        Deck Size: {totalCardsCount}
      </div>

      {/* Arched Card Container */}
      <div className="relative w-full h-[300px] flex items-center justify-center perspective-1000 overflow-visible">
        {cards.map((_, i) => {
          const distance = i - activeIndex;
          const absDistance = Math.abs(distance);
          
          if (absDistance > 6) return null;

          const isPicked = pickedIndices.includes(i);
          const xOffset = distance * 75; 
          const yOffset = absDistance * absDistance * 8; 
          const scale = 1 - absDistance * 0.12; 
          const rotation = distance * 12; 
          const zIndex = 50 - absDistance;
          const opacity = isPicked ? 0.3 : 1 - absDistance * 0.15;

          return (
            <div
              key={i}
              onClick={() => {
                if (distance === 0 && !isPicked && pickedIndices.length < maxPick) {
                  onPick(i);
                } else {
                  setActiveIndex(i);
                }
              }}
              className={`
                absolute transition-all duration-500 ease-out cursor-pointer
                ${distance === 0 && !isPicked && pickedIndices.length < maxPick ? 'hover:scale-110 active:scale-95' : ''}
              `}
              style={{
                transform: `translateX(${xOffset}px) translateY(${yOffset}px) scale(${scale}) rotateY(${rotation}deg)`,
                zIndex,
                opacity,
              }}
            >
              <div className={`
                w-36 h-56 rounded-2xl border-2 transition-all duration-300
                ${distance === 0 ? 'border-purple-400 bg-indigo-900 shadow-[0_0_30px_rgba(168,85,247,0.4)]' : 'border-indigo-400/20 bg-indigo-950'}
                flex flex-col items-center justify-center p-2 relative overflow-hidden group
              `}>
                <div className="absolute inset-1 border border-indigo-400/10 rounded-xl flex items-center justify-center">
                  <Sparkles 
                    className={`transition-colors duration-500 ${distance === 0 ? 'text-purple-400/40' : 'text-indigo-400/10'}`} 
                    size={40} 
                  />
                </div>
                {distance === 0 && !isPicked && (
                   <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none"></div>
                )}
                {isPicked && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-purple-400 font-bold text-xl">✓</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-8 mt-4">
        <button 
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="p-3 rounded-full bg-slate-900/60 border border-purple-500/20 hover:bg-purple-900/40 disabled:opacity-10 transition-all text-purple-200"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="font-cinzel text-[10px] tracking-[0.3em] text-purple-500 uppercase">
           Scroll or Tap to Choose
        </div>

        <button 
          onClick={handleNext}
          disabled={activeIndex === 21}
          className="p-3 rounded-full bg-slate-900/60 border border-purple-500/20 hover:bg-purple-900/40 disabled:opacity-10 transition-all text-purple-200"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
