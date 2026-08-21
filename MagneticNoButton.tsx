import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FUNNY_NO_MESSAGES } from '../data/questions';
import { sound } from '../utils/audio';

interface MagneticNoButtonProps {
  initialText: string;
  onDodgeCountChange?: (count: number) => void;
  resetTrigger?: number; // whenever question changes, reset button position
}

export const MagneticNoButton: React.FC<MagneticNoButtonProps> = ({
  initialText,
  onDodgeCountChange,
  resetTrigger,
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState<number>(0);
  const [buttonText, setButtonText] = useState<string>(initialText);
  const [isHoveredClose, setIsHoveredClose] = useState<boolean>(false);
  const [sweatEmoji, setSweatEmoji] = useState<string | null>(null);
  const lastDodgeTime = useRef<number>(0);

  // Reset position when question changes
  useEffect(() => {
    setOffset({ x: 0, y: 0 });
    setDodgeCount(0);
    setButtonText(initialText);
    setSweatEmoji(null);
  }, [resetTrigger, initialText]);

  // Update text based on dodge count
  const getDodgeText = useCallback(
    (count: number) => {
      if (count === 1) return 'NO 🙄';
      if (count === 2) return 'Nice try 😂';
      if (count === 3) return 'Too slow 😭';
      if (count === 4) return 'Why are you like this? 💀';
      if (count === 5) return 'JUST SAY YES 😭❤️';
      if (count > 5 && count < 9) {
        const pool = [
          'Nope 😂',
          'Catch me!',
          'Almost!',
          'Not today 😌',
          'You missed!',
          'Why are you chasing me? 💀',
          'I\'m shy 👉👈',
          'Absolutely not 😂',
        ];
        return pool[(count - 6) % pool.length];
      }
      return 'Okay you REALLY want to say no huh 😭';
    },
    []
  );

  // Trigger a dodge
  const triggerDodge = useCallback(
    (cursorX: number, cursorY: number, isDirectTouch: boolean = false) => {
      if (!buttonRef.current) return;

      const now = Date.now();
      const rect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      // Distance calculation
      const dx = btnCenterX - cursorX;
      const dy = btnCenterY - cursorY;
      const dist = Math.hypot(dx, dy) || 1;

      // Magnetic repulsion threshold
      const repulsionRadius = isDirectTouch ? 200 : 150;

      if (dist < repulsionRadius || isDirectTouch) {
        // Only trigger count increment & sound if some time has passed to prevent 60fps spam
        if (now - lastDodgeTime.current > 300) {
          lastDodgeTime.current = now;
          setDodgeCount((prev) => {
            const next = prev + 1;
            setButtonText(getDodgeText(next));
            if (onDodgeCountChange) onDodgeCountChange(next);
            return next;
          });

          sound.playWhoosh();

          // Show sweat/question emoji
          const emojis = ['💦', '🏃‍♂️', '💨', '🫣', '👀', '🤣'];
          setSweatEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
          setTimeout(() => setSweatEmoji(null), 800);
        }

        // Calculate push vector
        let angle = Math.atan2(dy, dx);
        if (isDirectTouch || dist < 10) {
          // If tapped directly on button, pick a random evasive angle
          angle = Math.random() * Math.PI * 2;
        }

        // Distance to move (100px - 180px push)
        const moveDist = Math.max(90, Math.min(200, (repulsionRadius - dist) * 2.2 + 90));

        let nextX = offset.x + Math.cos(angle) * moveDist;
        let nextY = offset.y + Math.sin(angle) * moveDist;

        // Viewport bounds constraint: keep button at least 25px from edges
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonWidth = rect.width;
        const buttonHeight = rect.height;

        // Base resting position of button in window
        const baseLeft = rect.left - offset.x;
        const baseTop = rect.top - offset.y;

        const minX = 25 - baseLeft;
        const maxX = viewportWidth - buttonWidth - 25 - baseLeft;
        const minY = 25 - baseTop;
        const maxY = viewportHeight - buttonHeight - 25 - baseTop;

        // Clamp to screen bounds
        if (nextX < minX || nextX > maxX) {
          // Bounce back to center/opposite
          nextX = Math.max(minX, Math.min(maxX, -offset.x * 0.7 + (Math.random() - 0.5) * 80));
        }
        if (nextY < minY || nextY > maxY) {
          nextY = Math.max(minY, Math.min(maxY, -offset.y * 0.7 + (Math.random() - 0.5) * 80));
        }

        setOffset({ x: nextX, y: nextY });
        setIsHoveredClose(true);
      } else {
        setIsHoveredClose(false);
      }
    },
    [offset, getDodgeText, onDodgeCountChange]
  );

  // Global mouse move listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      triggerDodge(e.clientX, e.clientY, false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [triggerDodge]);

  // Touch move & touch start for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      triggerDodge(touch.clientX, touch.clientY, true);
    }
  };

  // Shrink scale slightly after multiple failed attempts
  const scale = dodgeCount >= 8 ? 0.85 : dodgeCount >= 5 ? 0.92 : 1;

  return (
    <div className="relative inline-block">
      {/* Floating sweat/panic emoji */}
      {sweatEmoji && (
        <span
          className="absolute -top-7 -right-3 text-2xl animate-bounce pointer-events-none z-30"
          role="img"
          aria-label="sweat"
        >
          {sweatEmoji}
        </span>
      )}

      <button
        ref={buttonRef}
        type="button"
        id="no-repel-button"
        onTouchStart={handleTouchStart}
        onMouseEnter={(e) => triggerDodge(e.clientX, e.clientY, true)}
        onClick={(e) => {
          e.preventDefault();
          triggerDodge(e.clientX, e.clientY, true);
        }}
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0px) scale(${scale})`,
          transition: 'transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.2), background-color 0.2s',
          willChange: 'transform',
        }}
        className={`px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg select-none whitespace-nowrap cursor-pointer shadow-md active:scale-95 transition-all duration-200 min-w-[130px] border-2 ${
          dodgeCount > 4
            ? 'bg-rose-50 text-rose-600 border-rose-200'
            : 'bg-white text-pink-400 border-pink-100 hover:border-pink-200 hover:bg-pink-50/50'
        } ${isHoveredClose ? 'ring-2 ring-pink-200' : ''}`}
      >
        {buttonText}
      </button>
    </div>
  );
};
