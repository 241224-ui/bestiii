import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Sparkles, Heart, HelpCircle, Volume2, VolumeX } from 'lucide-react';

interface OpeningScreenProps {
  onStart: () => void;
  bestieName: string;
  onUpdateBestieName: (name: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({
  onStart,
  bestieName,
  onUpdateBestieName,
  isMuted,
  onToggleMute,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(bestieName);

  const handleStartClick = () => {
    sound.playPop();
    sound.playSparkle();
    onStart();
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateBestieName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[85vh]">
      {/* Top sound toggle */}
      <div className="absolute top-2 right-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMute}
          className="p-2.5 rounded-full bg-white/70 hover:bg-white text-purple-700 shadow-sm transition-all hover:scale-105 active:scale-95 border border-pink-100 flex items-center gap-1.5 text-xs font-bold"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
        </button>
      </div>

      {/* Main Glass Card */}
      <div className="w-full glass-card rounded-[40px] p-8 sm:p-10 text-center relative overflow-hidden transition-all duration-300 transform hover:shadow-2xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(255,182,197,0.3)]">
        {/* Subtle top header bar */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-pink-100/60">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Official Questionnaire</span>
          </span>
          <span className="text-xs font-bold text-pink-300 italic flex items-center gap-1">
            <span>Bestie.exe is running...</span>
            <Heart className="w-3 h-3 text-pink-400 fill-pink-400 inline" />
          </span>
        </div>

        {/* Big Greeting */}
        <div className="mb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-pink-600 tracking-tight leading-tight flex flex-wrap items-center justify-center gap-2">
            <span>Heyyy</span>
            <span className="underline decoration-pink-300 decoration-wavy decoration-2">
              {bestieName}
            </span>
            <span className="text-3xl sm:text-4xl animate-bounce">👀</span>
          </h1>

          {/* Quick Nickname Edit Link */}
          {!isEditingName ? (
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="mt-1 text-xs text-pink-400/80 hover:text-pink-600 underline font-medium cursor-pointer transition-colors italic"
            >
              (change name?)
            </button>
          ) : (
            <form onSubmit={handleSaveName} className="mt-2 flex items-center justify-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Bestie's name..."
                maxLength={20}
                className="px-3 py-1 text-xs rounded-lg border border-pink-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-pink-400 text-purple-900"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-lg text-xs font-bold hover:from-pink-500 hover:to-pink-600 transition-colors shadow-xs"
              >
                Save
              </button>
            </form>
          )}
        </div>

        {/* Intro Subheadings */}
        <div className="space-y-2 my-6">
          <p className="text-purple-500 text-base sm:text-lg font-semibold flex items-center justify-center gap-2">
            <span>I have a few extremely important questions for you...</span>
            <HelpCircle className="w-4 h-4 text-purple-300 inline" />
          </p>
          <p className="text-purple-400 text-sm italic">
            I expect completely honest answers 😌
          </p>
        </div>

        {/* Animated Action Button */}
        <div className="mt-8 flex flex-col items-center">
          <button
            type="button"
            id="start-button"
            onClick={handleStartClick}
            className="group relative px-10 py-4 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-pink-300/60 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-3 min-w-[140px]"
          >
            <span className="text-lg">Okay, let's go</span>
            <span className="group-hover:scale-125 transition-transform duration-200">💕</span>
            <Sparkles className="w-5 h-5 text-yellow-200 group-hover:rotate-45 transition-transform" />
          </button>

          <p className="mt-4 text-xs font-medium text-pink-400/80 italic">
            * 100% scientifically accurate friendship measurement inside ✨
          </p>
        </div>
      </div>
    </div>
  );
};
