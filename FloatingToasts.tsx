import React, { useState, useEffect } from 'react';
import { BESTIE_STATUS_MESSAGES } from '../data/questions';

export const FloatingToasts: React.FC = () => {
  const [currentToast, setCurrentToast] = useState<{ text: string; icon: string } | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Initial toast after 2.5s
    const firstTimeout = setTimeout(() => {
      showRandomToast();
    }, 2500);

    // Regular interval
    const interval = setInterval(() => {
      showRandomToast();
    }, 7000);

    function showRandomToast() {
      const msg = BESTIE_STATUS_MESSAGES[Math.floor(Math.random() * BESTIE_STATUS_MESSAGES.length)];
      setCurrentToast(msg);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 3500);
    }

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!currentToast) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-40 max-w-xs transition-all duration-500 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2.5 border border-pink-100 text-xs font-bold text-pink-500">
        <span className="text-base animate-bounce">{currentToast.icon}</span>
        <span className="leading-tight text-purple-600 font-semibold">{currentToast.text}</span>
      </div>
    </div>
  );
};
