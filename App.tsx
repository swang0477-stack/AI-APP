
import React, { useState, useEffect } from 'react';
import { CrystalBall } from './components/CrystalBall';
import { ReadingView } from './components/ReadingView';
import { CardCarousel } from './components/CardCarousel';
import { tarotService } from './services/geminiService';
import { Language, TarotReadingResponse, ReadingHistoryItem } from './types';
import { UI_STRINGS } from './constants';
import { History, HelpCircle, X, Globe, Moon, Star, Send, Sparkles, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('cn');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingReading, setPendingReading] = useState<TarotReadingResponse | null>(null);
  const [isPickingPhase, setIsPickingPhase] = useState(false);
  const [pickedIndices, setPickedIndices] = useState<number[]>([]);
  const [currentReading, setCurrentReading] = useState<TarotReadingResponse | null>(null);
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = UI_STRINGS[lang];

  useEffect(() => {
    const saved = localStorage.getItem('mystic_luna_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mystic_luna_history', JSON.stringify(history));
  }, [history]);

  const handleAsk = async (q?: string) => {
    const finalQuestion = q || question;
    if (!finalQuestion.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    const result = await tarotService.getReading(finalQuestion, lang);

    if (result.status === 'refused') {
      setErrorMessage(result.refusal_reason || t.btnRefusal);
      setIsLoading(false);
    } else {
      setPendingReading(result);
      setIsPickingPhase(true);
      setPickedIndices([]);
      setIsLoading(false);
    }
  };

  const finalizeReading = () => {
    if (!pendingReading) return;
    const historyItem: ReadingHistoryItem = {
      ...pendingReading,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      question: question
    };
    setHistory(prev => [historyItem, ...prev]);
    setCurrentReading(pendingReading);
    setPendingReading(null);
    setIsPickingPhase(false);
    setQuestion('');
  };

  const handlePickCard = (index: number) => {
    if (!pendingReading || pickedIndices.length >= pendingReading.cards.length) return;
    setPickedIndices(prev => [...prev, index]);
  };

  const handleUnpickCard = (index: number) => {
    setPickedIndices(prev => prev.filter(i => i !== index));
  };

  // Spread layout for picking phase preview
  const getPreviewStyles = (index: number, total: number): React.CSSProperties => {
    const spreadLower = pendingReading?.spread_type.toLowerCase() || '';
    
    // 5-Card Layouts
    if (total === 5 && (spreadLower.includes('x-spread') || spreadLower.includes('action'))) {
      const positions = [
        { top: '50%', left: '50%' },
        { top: '20%', left: '30%' },
        { top: '20%', left: '70%' },
        { top: '80%', left: '30%' },
        { top: '80%', left: '70%' },
      ];
      return { position: 'absolute', transform: 'translate(-50%, -50%)', ...positions[index] } as React.CSSProperties;
    }
    if (total === 5 && spreadLower.includes('relationship')) {
      const positions = [
        { top: '50%', left: '15%' },
        { top: '50%', left: '85%' },
        { top: '50%', left: '50%' },
        { top: '20%', left: '50%' },
        { top: '80%', left: '50%' },
      ];
      return { position: 'absolute', transform: 'translate(-50%, -50%)', ...positions[index] } as React.CSSProperties;
    }

    // 3-Card Layout (Horizontal)
    if (total === 3) {
      const positions = [
        { top: '50%', left: '25%' },
        { top: '50%', left: '50%' },
        { top: '50%', left: '75%' },
      ];
      return { position: 'absolute', transform: 'translate(-50%, -50%)', ...positions[index] } as React.CSSProperties;
    }

    return { position: 'relative' };
  };

  const isPreviewArched = pendingReading && pendingReading.cards.length > 5;

  return (
    <div className="min-h-screen relative text-purple-100 font-sans selection:bg-purple-500/30">
      <div className="star-field"></div>
      
      {/* Header */}
      <header className="relative z-50 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => {
          setCurrentReading(null);
          setIsPickingPhase(false);
        }}>
          <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-400/30 shadow-lg group-hover:scale-110 transition-transform">
            <Moon size={24} className="text-purple-300 fill-purple-300" />
          </div>
          <div>
            <h1 className="font-cinzel text-2xl font-bold tracking-widest text-white">{t.title}</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-purple-400 font-medium">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setLang(l => l === 'en' ? 'cn' : 'en')} className="p-3 rounded-xl bg-slate-900/60 border border-purple-500/20 hover:bg-purple-900/40 transition-all text-purple-200"><Globe size={20} /></button>
          <button onClick={() => setShowHistory(true)} className="p-3 rounded-xl bg-slate-900/60 border border-purple-500/20 hover:bg-purple-900/40 transition-all text-purple-200"><History size={20} /></button>
          <button onClick={() => setShowRules(true)} className="p-3 rounded-xl bg-slate-900/60 border border-purple-500/20 hover:bg-purple-900/40 transition-all text-purple-200"><HelpCircle size={20} /></button>
        </div>
      </header>

      <main className="relative z-10 pt-4">
        {!isPickingPhase && !currentReading && (
          <div className="max-w-xl mx-auto px-6 text-center animate-in fade-in zoom-in-95 duration-700">
            <CrystalBall isLoading={isLoading} lang={lang} onSampleClick={(q) => { setQuestion(q); handleAsk(q); }} />
            
            <div className="mb-10 relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t.askPrompt}
                className="w-full h-36 bg-slate-900/60 border border-purple-500/30 rounded-[2.5rem] p-8 text-purple-100 placeholder:text-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500/30 backdrop-blur-xl transition-all resize-none shadow-2xl"
              />
              {errorMessage && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-orange-400 text-sm bg-orange-950/40 px-4 py-1 rounded-full border border-orange-500/20 animate-in fade-in zoom-in-95 duration-500">
                  {errorMessage}
                </div>
              )}
            </div>

            <button
              onClick={() => handleAsk()}
              disabled={isLoading || !question.trim()}
              className={`
                group relative px-12 py-5 rounded-full font-cinzel text-lg tracking-[0.2em] overflow-hidden transition-all duration-500
                ${isLoading || !question.trim() ? 'opacity-50 grayscale' : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_100%] hover:bg-[100%_0%] shadow-2xl shadow-purple-500/20 hover:scale-105 active:scale-95'}
              `}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? <Star size={20} className="animate-spin" /> : <Send size={20} />}
                <span>{isLoading ? t.loading : t.btnAsk}</span>
              </div>
            </button>
          </div>
        )}

        {isPickingPhase && pendingReading && (
          <div className="max-w-6xl mx-auto px-6 text-center animate-in fade-in duration-700 pb-20">
            <div className="mb-2">
              <h2 className="font-cinzel text-3xl text-purple-100">{pendingReading.spread_type}</h2>
              <p className="text-purple-400 italic tracking-wide text-sm">{t.pickCards(pendingReading.cards.length)}</p>
            </div>

            <CardCarousel 
              onPick={handlePickCard} 
              maxPick={pendingReading.cards.length} 
              pickedIndices={pickedIndices} 
            />

            {/* Selected Cards Spread Area */}
            <div className={`relative mt-4 w-full h-[400px] flex items-center justify-center border-t border-purple-500/10 pt-8`}>
               <div className={pendingReading.cards.length <= 5 ? 'w-full h-full relative' : 'flex flex-wrap justify-center gap-4'}>
                  {Array.from({ length: pendingReading.cards.length }).map((_, i) => {
                    const pickedIdx = pickedIndices[i];
                    const isOccupied = pickedIdx !== undefined;
                    const style: React.CSSProperties = (pendingReading.cards.length <= 5 ? getPreviewStyles(i, pendingReading.cards.length) : {}) as React.CSSProperties;

                    return (
                      <div 
                        key={i} 
                        style={style}
                        onClick={() => isOccupied && handleUnpickCard(pickedIdx)}
                        className={`
                          transition-all duration-500 w-20 h-32 md:w-24 md:h-40 rounded-xl border border-dashed flex flex-col items-center justify-center cursor-pointer
                          ${isOccupied ? 'border-purple-400 bg-purple-900/20 hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border-purple-500/20 bg-slate-900/20'}
                        `}
                      >
                        {isOccupied ? (
                          <div className="relative w-full h-full p-1">
                             <div className="w-full h-full bg-indigo-950 rounded-lg flex items-center justify-center shadow-lg border border-purple-500/40">
                                <Sparkles className="text-purple-400/40" size={24} />
                             </div>
                             <div className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[10px] text-white opacity-0 hover:opacity-100 transition-opacity">×</div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-purple-500/40 font-cinzel">Slot {i+1}</div>
                        )}
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* Confirm Button (Moved to bottom of phase) */}
            <div className="mt-8 flex justify-center">
              {pickedIndices.length === pendingReading.cards.length && (
                 <button 
                   onClick={finalizeReading}
                   className="bg-white text-slate-950 px-12 py-4 rounded-full font-cinzel tracking-widest hover:scale-110 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
                 >
                   <Wand2 size={20} />
                   {t.confirmSelection}
                 </button>
              )}
            </div>
          </div>
        )}

        {currentReading && (
          <ReadingView 
            reading={currentReading} 
            lang={lang} 
            onBack={() => { setCurrentReading(null); setQuestion(''); }}
            onDeepen={() => { 
              const lastQ = currentReading.question_topic;
              setQuestion(lang === 'cn' ? `针对“${lastQ}”请给我更深入的解析：` : `Please provide a deeper reading regarding "${lastQ}":`);
              setCurrentReading(null);
            }} 
          />
        )}
      </main>

      {/* Overlays */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-w-md bg-slate-950/95 p-10 flex flex-col animate-in slide-in-from-right duration-500 h-full overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-cinzel text-3xl text-white">{t.history}</h2>
              <button onClick={() => setShowHistory(false)} className="text-purple-400 p-2 hover:bg-white/5 rounded-full transition-colors"><X size={28} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {history.length === 0 ? <p className="text-center opacity-30 mt-20">{t.noHistory}</p> : 
                history.map(item => (
                  <button key={item.id} onClick={() => { setCurrentReading(item); setShowHistory(false); }} className="w-full bg-slate-900/50 border border-purple-500/20 p-5 rounded-3xl hover:border-purple-400 transition-all text-left group">
                    <p className="text-[10px] text-purple-500 mb-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                    <p className="text-white font-medium line-clamp-2">{item.question}</p>
                  </button>
                ))
              }
            </div>
            {history.length > 0 && <button onClick={() => setHistory([])} className="mt-8 py-3 text-xs text-purple-500 uppercase tracking-widest hover:text-purple-300 transition-colors">{t.clearHistory}</button>}
          </div>
        </div>
      )}

      {showRules && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowRules(false)}></div>
          <div className="relative max-w-lg w-full bg-slate-950 border border-purple-500/20 rounded-[3.5rem] p-10 animate-in zoom-in duration-300 shadow-2xl">
            <button onClick={() => setShowRules(false)} className="absolute top-8 right-8 text-purple-400 hover:text-white transition-colors"><X size={28} /></button>
            <h2 className="font-cinzel text-3xl text-white mb-10">{t.taboos}</h2>
            <ul className="space-y-4 text-purple-300 text-sm leading-relaxed">
              <li className="p-5 bg-purple-900/10 rounded-2xl border border-purple-500/10 flex items-start gap-4">
                <span className="text-purple-500 shrink-0">✨</span>
                <span>{lang === 'cn' ? '健康与死亡：灵月不回答涉及疾病治疗、医疗诊断或寿命长短的问题。' : 'Health & Death: Luna does not answer questions regarding medical treatments, diagnoses, or lifespan.'}</span>
              </li>
              <li className="p-5 bg-purple-900/10 rounded-2xl border border-purple-500/10 flex items-start gap-4">
                <span className="text-purple-500 shrink-0">✨</span>
                <span>{lang === 'cn' ? '赌博与非法：灵月拒绝任何关于赌博博彩结果或涉及非法犯罪行为的询问。' : 'Gambling/Illegal: Luna refuses any queries regarding gambling outcomes or illegal/criminal acts.'}</span>
              </li>
              <li className="p-5 bg-purple-900/10 rounded-2xl border border-purple-500/10 flex items-start gap-4">
                <span className="text-purple-500 shrink-0">✨</span>
                <span>{lang === 'cn' ? '考试具体分数：灵月会侧重于建议努力方向，而不预测具体的百分制分数或排名。' : 'Exam Scores: Focusing on guidance and preparation rather than specific numerical scores or ranks.'}</span>
              </li>
              <li className="p-5 bg-purple-900/10 rounded-2xl border border-purple-500/10 flex items-start gap-4">
                <span className="text-purple-500 shrink-0">✨</span>
                <span>{lang === 'cn' ? '他人私隐：灵月不会在未获授权的情况下，窥探第三方的个人隐私或单纯的情感窥探。' : 'Privacy: Luna will not intrude on 3rd parties without authorization or perform purely voyeuristic readings.'}</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
