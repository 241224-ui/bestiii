import React, { useState } from 'react';
import { QUESTIONS_DATA } from './data/questions';
import { OpeningScreen } from './components/OpeningScreen';
import { QuestionCard } from './components/QuestionCard';
import { FinalScreen } from './components/FinalScreen';
import { ParticleBackground } from './components/ParticleBackground';
import { FloatingToasts } from './components/FloatingToasts';
import { sound } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'intro' | 'questions' | 'final'>('intro');
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [bestieName, setBestieName] = useState<string>('Bestie');
  const [burstTrigger, setBurstTrigger] = useState<number>(0);
  const [burstPos, setBurstPos] = useState<{ x: number; y: number } | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const triggerBurst = (pos?: { x: number; y: number }) => {
    setBurstPos(pos || null);
    setBurstTrigger((prev) => prev + 1);
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleStartQuestions = () => {
    setQuestionIndex(0);
    setCurrentScreen('questions');
    triggerBurst();
  };

  const handleAnswerYes = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerBurst({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    if (questionIndex < QUESTIONS_DATA.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentScreen('final');
      sound.playVictory();
    }
  };

  const handleRestart = () => {
    sound.playPop();
    setQuestionIndex(0);
    setCurrentScreen('intro');
    triggerBurst();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden select-none">
      {/* Dynamic Animated Particle & Floating Shapes Layer */}
      <ParticleBackground burstTrigger={burstTrigger} burstPos={burstPos} />

      {/* Occasional Funny Status Toasts */}
      <FloatingToasts />

      {/* Main Interactive Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 w-full">
        {currentScreen === 'intro' && (
          <OpeningScreen
            onStart={handleStartQuestions}
            bestieName={bestieName}
            onUpdateBestieName={(name) => setBestieName(name)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {currentScreen === 'questions' && (
          <QuestionCard
            key={QUESTIONS_DATA[questionIndex].id}
            question={QUESTIONS_DATA[questionIndex]}
            questionIndex={questionIndex}
            totalQuestions={QUESTIONS_DATA.length}
            onAnswerYes={handleAnswerYes}
            bestieName={bestieName}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {currentScreen === 'final' && (
          <FinalScreen
            onRestart={handleRestart}
            bestieName={bestieName}
            triggerBurst={triggerBurst}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}
      </main>

      {/* Artistic Flair Bottom Status / Telemetry Bar */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs gap-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="font-bold text-pink-400 uppercase tracking-wider">SYSTEM STATUS:</span>
          <span className="font-semibold text-purple-500 flex items-center gap-1">
            <span>Certified Bestie Detected</span>
            <span>✅</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-pink-400 uppercase tracking-wider">FRIENDSHIP LEVEL:</span>
          <span className="font-semibold text-purple-500">100% ❤️</span>
        </div>
      </footer>
    </div>
  );
}
