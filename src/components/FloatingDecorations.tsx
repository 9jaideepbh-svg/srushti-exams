import React from 'react';

interface FloatingElementProps {
  emoji: string;
  className: string;
  style: React.CSSProperties;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ emoji, className, style }) => {
  return (
    <div
      className={`absolute select-none pointer-events-none text-2xl filter drop-shadow-sm ${className}`}
      style={style}
    >
      {emoji}
    </div>
  );
};

export const FloatingDecorations: React.FC = () => {
  // Hardcoded random positions for premium decorative items
  const decorations = [
    { emoji: '✨', className: 'animate-float opacity-40 text-xl', style: { top: '8%', left: '5%' } },
    { emoji: '☁️', className: 'animate-float-slow opacity-30 text-4xl', style: { top: '15%', right: '8%' } },
    { emoji: '💖', className: 'animate-float-reverse opacity-50 text-2xl', style: { top: '25%', left: '12%' } },
    { emoji: '⭐', className: 'animate-float opacity-40 text-lg', style: { top: '35%', right: '15%' } },
    { emoji: '☁️', className: 'animate-float opacity-20 text-5xl', style: { top: '48%', left: '6%' } },
    { emoji: '✨', className: 'animate-float-slow opacity-60 text-2xl', style: { top: '55%', right: '6%' } },
    { emoji: '💕', className: 'animate-float-reverse opacity-45 text-2xl', style: { top: '68%', left: '15%' } },
    { emoji: '⭐', className: 'animate-float opacity-35 text-xl', style: { top: '78%', right: '12%' } },
    { emoji: '☁️', className: 'animate-float-slow opacity-25 text-3xl', style: { top: '88%', left: '8%' } },
    { emoji: '👑', className: 'animate-float opacity-30 text-3xl', style: { top: '5%', right: '30%' } },
    { emoji: '👦', className: 'animate-float-slow opacity-15 text-3xl', style: { bottom: '5%', right: '25%' } },
    { emoji: '💸', className: 'animate-float-reverse opacity-25 text-2xl', style: { top: '50%', right: '22%' } },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {decorations.map((dec, idx) => (
        <FloatingElement
          key={idx}
          emoji={dec.emoji}
          className={dec.className}
          style={dec.style}
        />
      ))}
    </div>
  );
};
