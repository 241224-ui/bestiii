export interface Question {
  id: number;
  prompt: string;
  delayPrompt?: string; // For Q9 with two-stage dramatic reveal
  yesText: string;
  yesReaction: string;
  yesEmoji: string;
  noText: string;
  noReaction: string;
  noEmoji: string;
  badge: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  icon: string;
}

export interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  duration: number;
  delay: number;
}
