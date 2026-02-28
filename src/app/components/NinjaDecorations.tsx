import React from 'react';

export function Shuriken({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L60 40 L95 50 L60 60 L50 95 L40 60 L5 50 L40 40 Z" />
      <circle cx="50" cy="50" r="8" fill="black" opacity="0.4" />
    </svg>
  );
}

export function SpeedLines({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const cx = 200, cy = 100;
        const x1 = cx + Math.cos(angle) * 30;
        const y1 = cy + Math.sin(angle) * 15;
        const x2 = cx + Math.cos(angle) * 400;
        const y2 = cy + Math.sin(angle) * 400;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="currentColor" strokeWidth="1" opacity="0.2" />
        );
      })}
    </svg>
  );
}

export function ActionBurst({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full" fill="currentColor">
        <polygon points="60,2 72,35 105,20 85,50 118,60 85,70 105,80 72,65 60,98 48,65 15,80 35,70 2,60 35,50 15,20 48,35" />
      </svg>
      <span className="relative z-10 font-['Bangers'] text-black" style={{ fontSize: '0.75em' }}>{text}</span>
    </div>
  );
}

export function ComicPanel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${className}`}>
      {children}
    </div>
  );
}

export function HalftoneBackground({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 opacity-10 pointer-events-none ${className}`}
      style={{
        backgroundImage: 'radial-gradient(circle, #F45207 1.5px, transparent 1.5px)',
        backgroundSize: '12px 12px',
      }}
    />
  );
}

export function TeamBanner({ subtitle }: { subtitle?: string }) {
  return (
    <div className="relative overflow-hidden min-w-0" style={{ background: 'linear-gradient(135deg, #F45207 0%, #c43d03 100%)' }}>
      <HalftoneBackground />
      {/* Speed lines */}
      <div className="absolute inset-0 opacity-20">
        <SpeedLines className="w-full h-full text-white" />
      </div>
      {/* Shurikens - scale down on small screens */}
      <Shuriken className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white opacity-20 rotate-12" />
      <Shuriken className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white opacity-15 -rotate-12" />

      <div className="relative z-10 px-3 py-4 sm:px-4 sm:py-5 md:py-6 text-center">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
          <Shuriken className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 flex-shrink-0" />
          <span className="font-['Bangers'] text-yellow-300 tracking-widest text-xs sm:text-sm md:text-base" style={{ letterSpacing: '0.2em' }}>
            TAIWAN PROFESSIONAL VOLLEYBALL LEAGUE
          </span>
          <Shuriken className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 flex-shrink-0" />
        </div>
        <h1 className="font-['Bangers'] text-white tracking-wide text-xl sm:text-2xl md:text-3xl lg:text-[2.4rem] leading-none" style={{ textShadow: '3px 3px 0px #000, -1px -1px 0px #000' }}>
          臺北伊斯特
        </h1>
        <h2 className="font-['Bangers'] text-yellow-300 tracking-widest text-sm sm:text-base md:text-lg" style={{ textShadow: '2px 2px 0px #000' }}>
          TAIPEI EAST POWER
        </h2>
        {subtitle && (
          <p className="mt-2 font-['Noto_Sans_TC'] text-white/90 text-xs sm:text-sm border-t border-white/30 pt-2 px-2">{subtitle}</p>
        )}
      </div>

      {/* Comic border bottom */}
      <div className="h-1.5 sm:h-2 border-t-4 border-black bg-black" />
    </div>
  );
}