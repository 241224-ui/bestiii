import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  duration: number;
  delay: number;
  opacity: number;
}

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  emoji: string;
  size: number;
  opacity: number;
  rotation: number;
}

const ARTISTIC_EMOJIS = ['✨', '💖', '🌸', '☁️', '🍦', '💕', '⭐', '🎀', '💫', '🌻'];

export const ParticleBackground: React.FC<{ burstTrigger?: number; burstPos?: { x: number; y: number } | null }> = ({
  burstTrigger,
  burstPos,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bursts, setBursts] = useState<BurstParticle[]>([]);

  // Generate gentle ambient floating particles
  useEffect(() => {
    const ambient: Particle[] = Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      x: Math.random() * 95 + 2,
      y: Math.random() * 95 + 2,
      size: Math.floor(Math.random() * 16) + 18,
      emoji: ARTISTIC_EMOJIS[Math.floor(Math.random() * ARTISTIC_EMOJIS.length)],
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.35 + 0.3,
    }));
    setParticles(ambient);
  }, []);

  // Handle explosion/burst effect
  useEffect(() => {
    if (burstTrigger && burstTrigger > 0) {
      const originX = burstPos ? burstPos.x : window.innerWidth / 2;
      const originY = burstPos ? burstPos.y : window.innerHeight / 2;

      const newBursts: BurstParticle[] = Array.from({ length: 28 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 8 + 4;
        return {
          id: Date.now() + i,
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2, // Slight upward bias
          emoji: ARTISTIC_EMOJIS[Math.floor(Math.random() * ARTISTIC_EMOJIS.length)],
          size: Math.floor(Math.random() * 16) + 18,
          opacity: 1,
          rotation: Math.random() * 360,
        };
      });

      setBursts((prev) => [...prev, ...newBursts]);
    }
  }, [burstTrigger, burstPos]);

  // Animate bursts using RAF interval
  useEffect(() => {
    if (bursts.length === 0) return;

    const interval = setInterval(() => {
      setBursts((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.25, // gravity
            opacity: p.opacity - 0.025,
            rotation: p.rotation + 4,
          }))
          .filter((p) => p.opacity > 0.05)
      );
    }, 20);

    return () => clearInterval(interval);
  }, [bursts.length]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Soft pastel ambient glow orbs matching Artistic Flair */}
      <div className="absolute top-8 left-12 w-80 h-80 bg-pink-200/40 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/3 right-8 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-float-reverse" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-pink-100/50 rounded-full blur-3xl animate-float-slow" />

      {/* Floating artistic emojis (soft opacity, gentle drifting) */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute select-none transition-transform"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animation: `floatSlow ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Dynamic interactive burst particles */}
      {bursts.map((b) => (
        <div
          key={b.id}
          className="absolute select-none font-bold"
          style={{
            left: `${b.x}px`,
            top: `${b.y}px`,
            fontSize: `${b.size}px`,
            opacity: b.opacity,
            transform: `translate(-50%, -50%) rotate(${b.rotation}deg)`,
          }}
        >
          {b.emoji}
        </div>
      ))}
    </div>
  );
};
