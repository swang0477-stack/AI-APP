
import React from 'react';
import { UI_STRINGS } from '../constants';
import { Language } from '../types';

interface CrystalBallProps {
  isLoading: boolean;
  lang: Language;
  onSampleClick: (q: string) => void;
}

export const CrystalBall: React.FC<CrystalBallProps> = ({ isLoading, lang, onSampleClick }) => {
  const t = UI_STRINGS[lang];
  // Ensure we have exactly 7 unique questions
  const questions = t.sampleQuestions.slice(0, 7);

  const bubblePositions = [
    { top: '-15%', left: '0%' },
    { top: '-5%', left: '70%' },
    { top: '30%', left: '90%' },
    { top: '70%', left: '80%' },
    { top: '85%', left: '20%' },
    { top: '65%', left: '-15%' },
    { top: '25%', left: '-20%' },
  ];

  return (
    <div className="relative w-80 h-80 mx-auto mb-20 flex items-center justify-center perspective-1000">
      {/* Floating Bubbles */}
      {!isLoading && questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSampleClick(q)}
          className={`
            absolute z-30 w-24 h-24 rounded-full flex items-center justify-center p-3
            bg-purple-500/10 backdrop-blur-md border border-purple-400/20
            text-[10px] text-purple-100 font-medium text-center leading-tight
            hover:bg-purple-600/30 hover:scale-110 hover:border-purple-300/40 
            transition-all duration-500 shadow-xl shadow-purple-900/20
            animate-float
          `}
          style={{
            top: bubblePositions[i].top,
            left: bubblePositions[i].left,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${4 + i % 3}s`
          }}
        >
          {q}
        </button>
      ))}

      {/* 3D Crystal Ball Container */}
      <div className="relative w-72 h-72">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-8 bg-purple-950/40 rounded-[50%] blur-2xl"></div>
        
        <div className={`
          relative w-full h-full rounded-full 
          bg-gradient-to-tr from-purple-900/60 via-indigo-600/20 to-blue-200/30
          backdrop-blur-[8px] border border-white/20 overflow-hidden
          shadow-[inset_-15px_-15px_60px_rgba(0,0,0,0.6),inset_15px_15px_40px_rgba(255,255,255,0.1),0_0_80px_rgba(168,85,247,0.3)]
          ${isLoading ? 'scale-110' : 'animate-glow'}
          transition-all duration-1000 flex items-center justify-center
        `}>
          
          {/* Rotating Diamond Crystals inside during loading */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center animate-spin" style={{ animationDuration: '6s' }}>
              {[0, 72, 144, 216, 288].map((deg, i) => (
                <div 
                  key={i}
                  className="absolute"
                  style={{ transform: `rotate(${deg}deg) translateY(-40px)` }}
                >
                  <div 
                    className="w-4 h-8 bg-purple-400/60 border border-white/40 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                    style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                  ></div>
                </div>
              ))}
              <div 
                className="w-6 h-12 bg-white/40 border border-white/60 shadow-[0_0_20px_white]"
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              ></div>
            </div>
          )}

          <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-30"></div>
          
          <div className={`absolute inset-0 transition-transform duration-[10s] ease-linear ${isLoading ? 'opacity-40' : ''}`}>
            {[...Array(15)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full blur-[2px] opacity-40 animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              ></div>
            ))}
          </div>

          <div className="absolute top-[10%] left-[20%] w-24 h-12 bg-white/20 rounded-full rotate-[35deg] blur-lg"></div>
          <div className="absolute top-[5%] left-[15%] w-8 h-4 bg-white/40 rounded-full rotate-[35deg] blur-sm"></div>
        </div>

        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-12">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-lg shadow-2xl border-t border-white/10"></div>
        </div>
      </div>
    </div>
  );
};
