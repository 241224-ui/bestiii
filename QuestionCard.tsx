import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { MagneticNoButton } from './MagneticNoButton';
import { sound } from '../utils/audio';
import { Sparkles, Heart, CheckCircle2, ChevronRight, Volume2, VolumeX } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswerYes: (e: React.MouseEvent<HTMLButtonElement>) => void;
  bestieName: string;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onAnswerYes,
  bestieName,
  isMuted,
  onToggleMute,
}) => {
  const [stageReveal, setStageReveal] = useState<boolean>(false);
  const [reactionOverlay, setReactionOverlay] = useState<{
    text: string;
    emoji: string;
  } | null>(null);
  const [dodgeCount, setDodgeCount] = useState<number>(0);

  // If question has delayPrompt (Question 9), handle the dramatic pause reveal
  useEffect(() => {
    setReactionOverlay(null);
    setDodgeCount(0);

    if (question.delayPrompt) {
      setStageReveal(false);
      const timer = setTimeout(() => {
        setStageReveal(true);
        sound.playSparkle();
      }, 1600);
      return () => clearTimeout(timer);
    } else {
      setStageReveal(true);
    }
  }, [question]);

  const handleYesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sound.playSuccess();
    setReactionOverlay({
      text: question.yesReaction,
      emoji: question.yesEmoji,
    });

    // Fire answer after short celebratory celebration
    setTimeout(() => {
      onAnswerYes(e);
      setReactionOverlay(null);
    }, 1100);
  };

  const progressPercent = Math.round(((questionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[85vh]">
      {/* Top Bar: Progress & Sound Control */}
      <div className="w-full max-w-lg mb-2 flex items-center justify-end px-2">
        <button
          type="button"
          onClick={onToggleMute}
          className="p-1.5 px-2.5 rounded-full bg-white/70 hover:bg-white text-purple-600 shadow-xs transition-all hover:scale-105 active:scale-95 border border-pink-100 flex items-center gap-1 text-xs font-semibold"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
          <span className="hidden xs:inline">{isMuted ? 'Muted' : 'Sound'}</span>
        </button>
      </div>

      {/* Main Glass Question Card */}
      <div className="w-full glass-card rounded-[40px] p-8 sm:p-10 text-center relative overflow-hidden transition-all duration-300 border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(255,182,197,0.3)]">
        {/* Step text header & Progress Bar matching Artistic Flair theme */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-2">
            <span id="step-text" className="text-xs font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span>Question {questionIndex + 1} / {totalQuestions}</span>
            </span>
            <span className="text-xs font-bold text-pink-300 italic">
              {dodgeCount > 3 ? `${dodgeCount} dodges 😂` : 'Bestie.exe is running...'}
            </span>
          </div>
          <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
            <div
              id="progress-bar"
              className="h-full bg-gradient-to-r from-pink-300 to-purple-300 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Reaction Overlay when YES is clicked */}
        {reactionOverlay && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 animate-popIn rounded-[40px]">
            <span className="text-6xl mb-3 animate-bounce">{reactionOverlay.emoji}</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-pink-600 mb-2 font-fun">
              {reactionOverlay.text}
            </h3>
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm italic">
              <span>Next question coming right up...</span>
              <ChevronRight className="w-4 h-4 animate-ping text-pink-400" />
            </div>
          </div>
        )}

        {/* Question Text Area */}
        <div id="content-area" className="flex-grow flex flex-col items-center justify-center min-h-[160px] mb-6">
          {/* Main Question */}
          <h2
            id="question-text"
            className={`text-2xl sm:text-3xl font-extrabold text-pink-600 leading-tight mb-2 transition-all duration-500 ${
              question.delayPrompt && stageReveal ? 'text-xl sm:text-2xl text-purple-400 mb-2' : ''
            }`}
          >
            {question.prompt}
          </h2>

          {/* Delayed Second Part for Dramatic Reveal (Question 9) */}
          {question.delayPrompt && (
            <div
              className={`mt-2 transition-all duration-500 transform ${
                stageReveal
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
              }`}
            >
              <span className="text-3xl sm:text-4xl font-extrabold text-pink-600 font-fun">
                {question.delayPrompt}
              </span>
            </div>
          )}

          {/* Typing dots while awaiting delay prompt */}
          {question.delayPrompt && !stageReveal && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-pink-300">
              <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}

          <p id="sub-text" className="text-purple-400 text-sm italic mt-2">
            I expect completely honest answers 😌
          </p>
        </div>

        {/* Action Buttons Section (YES and Magnetic NO) */}
        <div id="button-container" className="relative w-full flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 min-h-[70px]">
          {/* YES Button */}
          <button
            type="button"
            id="yes-btn"
            onClick={handleYesClick}
            className="px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-pink-300/60 active:scale-95 transition-all duration-200 cursor-pointer min-w-[130px] flex items-center justify-center gap-2"
          >
            <span>{question.yesText}</span>
            <Heart className="w-4 h-4 text-white fill-white" />
          </button>

          {/* NO Button: Magically evades cursor / touch */}
          <MagneticNoButton
            initialText={question.noText}
            resetTrigger={question.id}
            onDodgeCountChange={(count) => setDodgeCount(count)}
          />
        </div>

        {/* Cute micro-tip */}
        <div className="mt-8 text-xs font-semibold text-pink-400/80 flex items-center justify-center gap-1 italic">
          <span>Bestie note: Only 100% genuine honest answers accepted</span>
          <span className="inline-block animate-wiggle">💖</span>
        </div>
      </div>
    </div>
  );
};
