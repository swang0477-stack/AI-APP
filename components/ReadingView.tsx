
import React, { useState, useEffect } from 'react';
import { TarotReadingResponse, Language, TarotCard } from '../types';
import { UI_STRINGS } from '../constants';
import { ChevronLeft, Sparkles, Wand2, ShieldCheck, Maximize2, RotateCcw, MessageSquarePlus } from 'lucide-react';

interface ReadingViewProps {
  reading: TarotReadingResponse;
  lang: Language;
  onBack: () => void;
  onDeepen: () => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ reading, lang, onBack, onDeepen }) => {
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [zoomedCard, setZoomedCard] = useState<TarotCard | null>(null);
  const t = UI_STRINGS[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      setRevealedIndices(prev => {
        if (prev.length < reading.cards.length) {
          return [...prev, prev.length];
        }
        clearInterval(timer);
        return prev;
      });
    }, 600);
    return () => clearInterval(timer);
  }, [reading.cards.length]);

  const getLayoutStyles = (index: number, total: number) => {
    const spreadLower = reading.spread_type.toLowerCase();
    
    // Spread math for responsive absolute positioning
    // Using viewport-relative units or percentage to stay centered
    if (total === 5 && (spreadLower.includes('x-spread') || spreadLower.includes('action'))) {
      const positions = [
        { top: '50%', left: '50%' },      // Center
        { top: '20%', left: '25%' },      // Top-Left
        { top: '20%', left: '75%' },      // Top-Right
        { top: '80%', left: '25%' },      // Bottom-Left
        { top: '80%', left: '75%' },      // Bottom-Right
      ];
      return { position: 'absolute', transform: 'translate(-50%, -50%)', ...positions[index] } as React.CSSProperties;
    }

    if (total === 5 && spreadLower.includes('relationship')) {
      const positions = [
        { top: '50%', left: '20%' },      // Left: Me
        { top: '50%', left: '80%' },      // Right: You
        { top: '50%', left: '50%' },      // Center: Status
        { top: '20%', left: '50%' },      // Top: Challenges
        { top: '80%', left: '50%' },      // Bottom: Trend
      ];
      return { position: 'absolute', transform: 'translate(-50%, -50%)', ...positions[index] } as React.CSSProperties;
    }

    if (total === 3) {
      const positions = [
        { top: '50%', left: '25%' },
        { top: '50%', left: '50%' },
        { top: '50%', left: '75%' },
      ];
      return { position: 'absolute', transform: 'translate(-50%, -50%)', ...positions[index] } as React.CSSProperties;
    }

    return {};
  };

  const isCustomLayout = reading.cards.length > 1 && reading.cards.length <= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-32 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
        <button onClick={onBack} className="group flex items-center gap-2 text-purple-400 hover:text-white transition-all bg-purple-900/20 px-5 py-2.5 rounded-full border border-purple-500/20">
          <ChevronLeft size={20} />
          <span>{lang === 'cn' ? '返回' : 'Back'}</span>
        </button>
        <div className="text-center">
          <h2 className="font-cinzel text-3xl md:text-5xl text-purple-100 mb-2">{reading.spread_type}</h2>
          <p className="text-xs text-purple-500 tracking-[0.3em] uppercase">{reading.question_topic}</p>
        </div>
        <div className="hidden md:block w-32"></div>
      </div>

      {/* Responsive Spread Layout Area */}
      <div className={`relative mb-24 flex items-center justify-center ${isCustomLayout ? 'h-[500px] md:h-[650px]' : 'min-h-[300px]'}`}>
        <div className={isCustomLayout ? 'w-full h-full relative' : 'flex flex-wrap justify-center gap-8'}>
          {reading.cards.map((card, idx) => {
            const isRevealed = revealedIndices.includes(idx);
            const style = getLayoutStyles(idx, reading.cards.length);

            return (
              <div 
                key={idx} 
                style={style}
                className={`transition-all duration-1000 perspective-1000 ${isRevealed ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-20'}`}
              >
                <div 
                  onClick={() => setZoomedCard(card)}
                  className={`
                    relative w-24 h-40 md:w-36 md:h-60 cursor-pointer preserve-3d transition-transform duration-700 hover:scale-110 active:scale-95
                    ${isRevealed ? '' : 'rotate-y-180'}
                  `}
                >
                  {/* Front (Card Face) */}
                  <div className={`absolute inset-0 backface-hidden rounded-xl border-2 border-purple-400/40 bg-slate-900 overflow-hidden shadow-2xl ${card.orientation === 'Reversed' ? 'rotate-180' : ''}`}>
                    <img src={`https://picsum.photos/seed/${card.card_name_en}/300/500`} className="w-full h-full object-cover opacity-70 grayscale-[0.3]" alt={card.card_name_en} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-1 md:bottom-3 inset-x-0 text-center px-1">
                      <p className="text-[8px] md:text-[11px] font-cinzel text-white leading-tight">{lang === 'cn' ? card.card_name_cn : card.card_name_en}</p>
                      <p className="text-[6px] md:text-[9px] text-purple-400 tracking-wider mt-0.5">{card.position_meaning}</p>
                    </div>
                  </div>
                  {/* Back (Card Back) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl border-2 border-indigo-400/40 bg-indigo-950 flex items-center justify-center p-2 shadow-2xl">
                    <div className="w-full h-full border border-indigo-400/20 rounded-lg flex items-center justify-center">
                      <Sparkles className="text-indigo-400/30" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Synthesis Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           <section className="bg-slate-900/60 p-8 md:p-12 rounded-[3.5rem] border border-purple-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden group transition-all hover:border-purple-400/30">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles size={160} />
            </div>
            <h3 className="font-cinzel text-2xl md:text-3xl text-purple-100 mb-8 flex items-center gap-4">
              <Sparkles className="text-purple-400" />
              {t.summary}
            </h3>
            <p className="text-purple-200 text-lg md:text-xl leading-relaxed relative z-10">{reading.synthesis.summary}</p>
          </section>

          <section className="bg-purple-900/10 p-8 md:p-12 rounded-[3.5rem] border border-indigo-500/20 backdrop-blur-md transition-all hover:border-indigo-400/30">
            <h3 className="font-cinzel text-2xl md:text-3xl text-purple-100 mb-8 flex items-center gap-4">
              <Wand2 className="text-purple-400" />
              {t.advice}
            </h3>
            <p className="text-purple-300 leading-relaxed italic text-lg">{reading.synthesis.advice}</p>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900/80 p-10 rounded-[3rem] border border-indigo-500/20 flex flex-col items-center text-center shadow-xl">
             <ShieldCheck className="text-indigo-400 mb-4" size={40} />
             <h4 className="text-[10px] uppercase tracking-[0.4em] text-indigo-400 mb-6">{t.lucky}</h4>
             <p className="text-3xl font-cinzel text-indigo-100 leading-snug">{reading.synthesis.lucky_element}</p>
          </div>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={onDeepen}
              className="flex items-center justify-center gap-4 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 p-6 rounded-3xl text-white font-cinzel text-lg tracking-widest hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-purple-500/20"
            >
              <MessageSquarePlus size={24} />
              {t.deepen}
            </button>
            <button 
              onClick={onBack}
              className="flex items-center justify-center gap-4 w-full bg-slate-900/60 border border-purple-500/20 p-6 rounded-3xl text-purple-300 font-cinzel text-lg tracking-widest hover:bg-slate-800 transition-all"
            >
              <RotateCcw size={24} />
              {t.askNew}
            </button>
          </div>
        </div>
      </div>

      {/* Card Detailed Zoom Overlay */}
      {zoomedCard && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setZoomedCard(null)}></div>
          <div className="relative max-w-4xl w-full bg-slate-950 border border-purple-500/30 rounded-[4rem] p-8 md:p-14 flex flex-col md:flex-row gap-12 shadow-3xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className={`relative w-48 h-80 md:w-64 md:h-[400px] shrink-0 mx-auto transition-transform duration-700 ${zoomedCard.orientation === 'Reversed' ? 'rotate-180' : ''}`}>
              <img src={`https://picsum.photos/seed/${zoomedCard.card_name_en}/400/600`} className="w-full h-full object-cover rounded-[2.5rem] border-2 border-purple-400/50 shadow-2xl" alt={zoomedCard.card_name_en} />
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>
            <div className="flex-1 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-cinzel text-4xl md:text-5xl text-white mb-2">{lang === 'cn' ? zoomedCard.card_name_cn : zoomedCard.card_name_en}</h3>
                  <p className="text-purple-400 text-sm tracking-widest uppercase font-bold">{zoomedCard.position_meaning}</p>
                </div>
                <button onClick={() => setZoomedCard(null)} className="text-purple-500 hover:text-white p-2 bg-white/5 rounded-full"><Maximize2 size={24} /></button>
              </div>
              <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${zoomedCard.orientation === 'Upright' ? 'bg-green-500/10 border-green-500/40 text-green-400' : 'bg-orange-500/10 border-orange-500/40 text-orange-400'}`}>
                {lang === 'cn' ? (zoomedCard.orientation === 'Upright' ? '正位' : '逆位') : zoomedCard.orientation}
              </div>
              <p className="text-purple-100 text-xl leading-relaxed font-light">{zoomedCard.single_meaning}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
