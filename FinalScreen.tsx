import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Sun, Heart, Sparkles, Smile, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface FinalScreenProps {
  onRestart: () => void;
  bestieName: string;
  triggerBurst: (pos?: { x: number; y: number }) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({
  onRestart,
  bestieName,
  triggerBurst,
  isMuted,
  onToggleMute,
}) => {
  const [stage, setStage] = useState<number>(1);
  const [dayStarted, setDayStarted] = useState<boolean>(false);

  useEffect(() => {
    // Stage 1: "Okayyy, interrogation complete"
    // Stage 2: Reveal "GOOD MORNING, BESTIE ☀️❤️"
    const timer = setTimeout(() => {
      setStage(2);
      sound.playSuccess();
      triggerBurst();
    }, 1800);

    return () => clearTimeout(timer);
  }, [triggerBurst]);

  const handleStartDay = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    sound.playVictory();
    setDayStarted(true);

    // Continuous bursts for 2 seconds
    const b1 = setTimeout(() => triggerBurst({ x: window.innerWidth * 0.3, y: window.innerHeight * 0.4 }), 400);
    const b2 = setTimeout(() => triggerBurst({ x: window.innerWidth * 0.7, y: window.innerHeight * 0.4 }), 800);
    const b3 = setTimeout(() => triggerBurst({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.3 }), 1200);

    return () => {
      clearTimeout(b1);
      clearTimeout(b2);
      clearTimeout(b3);
    };
  };

  return (
    <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[85vh]">
      {/* Sound toggle */}
      <div className="absolute top-2 right-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMute}
          className="p-2 rounded-full bg-white/70 hover:bg-white text-purple-700 shadow-sm transition-all hover:scale-105 active:scale-95 border border-pink-100 flex items-center gap-1.5 text-xs font-bold"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
        </button>
      </div>

      {/* Sunrise Warm Radial Glow Effect when day is started */}
      {dayStarted && (
        <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 bg-gradient-to-t from-amber-200/40 via-pink-200/30 to-transparent" />
      )}

      {/* Main Glass Card */}
      <div className="w-full glass-card rounded-[40px] p-8 sm:p-12 text-center relative overflow-hidden transition-all duration-500 transform border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(255,182,197,0.3)]">
        {/* Stage 1: Interrogation Complete Banner */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 font-extrabold text-xs tracking-wider uppercase mb-4 shadow-xs">
            <span>🎉 Interrogation Complete</span>
            <span>😂❤️</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-pink-600">
            Okayyy, interrogation complete 😂❤️
          </h2>
          <p className="text-purple-400 font-semibold text-sm sm:text-base mt-1 italic">
            You survived my extremely important questions.
          </p>
        </div>

        {/* Stage 2 Reveal: Good Morning Banner */}
        <div
          className={`my-6 sm:my-8 transition-all duration-700 transform ${
            stage >= 2
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-90 translate-y-6 pointer-events-none'
          }`}
        >
          {/* Animated Sun Icon */}
          <div className="relative inline-block my-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-amber-300 via-yellow-200 to-pink-300 rounded-full flex items-center justify-center shadow-lg shadow-amber-300/40 animate-bounce">
              <Sun className="w-12 h-12 text-amber-800 animate-spin" style={{ animationDuration: '18s' }} />
            </div>
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500 absolute -bottom-1 -left-1 animate-bounce" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-pink-600 mt-4 tracking-tight font-fun">
            GOOD MORNING, {bestieName.toUpperCase()}! ☀️❤️
          </h1>

          <div className="space-y-2 mt-4 text-purple-400 text-base sm:text-lg font-medium max-w-md mx-auto">
            <p className="font-bold text-pink-500">
              I hope you have an amazing day. ✨
            </p>
            <p className="italic text-sm sm:text-base flex items-center justify-center gap-1.5">
              <span>Stay happy, stay awesome, and don't forget to smile today.</span>
              <span className="text-xl not-italic">🌸</span>
            </p>
          </div>
        </div>

        {/* Final CTA / Day Started Message */}
        <div className="mt-8 flex flex-col items-center">
          {!dayStarted ? (
            <button
              type="button"
              id="start-day-button"
              onClick={handleStartDay}
              className="group relative px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-yellow-300/60 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-3"
            >
              <Sun className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-lg">Start My Day ✨</span>
              <Sparkles className="w-5 h-5 text-yellow-100 group-hover:scale-125 transition-transform" />
            </button>
          ) : (
            <div className="w-full bg-gradient-to-r from-pink-50 via-amber-50 to-purple-50 p-6 rounded-2xl border border-pink-100 shadow-inner animate-popIn">
              <div className="text-4xl mb-2 animate-wiggle">🌸✨☀️</div>
              <h3 className="text-xl sm:text-2xl font-black text-pink-600 font-fun">
                Now go be awesome.
              </h3>
              <p className="text-purple-400 font-bold text-base sm:text-lg mt-1 italic">
                I'll allow it... for today 😌
              </p>
              <p className="text-xs text-pink-300 mt-3 font-bold uppercase tracking-wider">
                Friendship score: 100% ❤️ Official Bestie status locked ✅
              </p>
            </div>
          )}

          {/* Replay Questionnaire Option */}
          <button
            type="button"
            onClick={onRestart}
            className="mt-8 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-pink-400 hover:text-pink-600 transition-colors p-2 rounded-lg hover:bg-white/60 cursor-pointer italic"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Play again from start</span>
          </button>
        </div>
      </div>
    </div>
  );
};
