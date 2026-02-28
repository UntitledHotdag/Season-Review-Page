import React, { useState } from 'react';
import { Shuriken, HalftoneBackground, SpeedLines } from './NinjaDecorations';

const base = ((import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/').replace(/\/$/, '') || '';
const VOLLEYBALL_IMAGE = `${base}/team-huddle.png`;

interface Props {
  onNext: (name: string) => void;
}

export function NameInputPage({ onNext }: Props) {
  const [name, setName] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    onNext(name.trim());
  };

  return (
    <div className="min-h-screen flex flex-col min-w-0" style={{ background: '#0f0f0f' }}>
      {/* Key Visual - top section (mobile-first: 55vw, then fixed heights on larger) */}
      <div className="relative overflow-hidden min-h-[55vw] sm:min-h-[280px] md:min-h-[320px] lg:max-h-[340px]">
        <img
          src={VOLLEYBALL_IMAGE}
          alt="Team huddle"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.35) saturate(1.5)' }}
        />
        {/* Orange halftone overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #F45207 1.5px, transparent 1.5px)',
          backgroundSize: '10px 10px',
          opacity: 0.15,
        }} />
        {/* Speed lines */}
        <div className="absolute inset-0 opacity-30">
          <SpeedLines className="w-full h-full text-orange-500" />
        </div>

        {/* Team name badge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Shuriken className="w-8 h-8 sm:w-10 sm:h-10 text-[#F45207]" />
            <Shuriken className="w-8 h-8 sm:w-10 sm:h-10 text-[#F45207]" />
          </div>
          <div
            className="text-center px-4 py-3 sm:px-6 sm:py-4 border-4 border-[#F45207] relative w-full max-w-[95vw] sm:max-w-md"
            style={{ background: 'rgba(0,0,0,0.75)', boxShadow: '6px 6px 0px #F45207' }}
          >
            <HalftoneBackground />
            <p className="font-['Bangers'] text-[#F45207] tracking-widest relative z-10 text-[0.65rem] sm:text-[0.75rem] md:text-xs"
              style={{ letterSpacing: '0.25em' }}>
              TAIWAN PROFESSIONAL VOLLEYBALL LEAGUE 2025-26
            </p>
            <h1 className="font-['Bangers'] text-white relative z-10 text-2xl sm:text-[2.5rem] md:text-[3rem] leading-none"
              style={{ textShadow: '4px 4px 0px #F45207, -2px -2px 0px #F45207' }}>
              臺北伊斯特
            </h1>
            <h2 className="font-['Bangers'] text-[#F45207] relative z-10 text-sm sm:text-base md:text-lg"
              style={{ textShadow: '2px 2px 0px #000' }}>
              TAIPEI EAST POWER
            </h2>
            <p className="font-['Bangers'] text-yellow-400 relative z-10 mt-1 text-sm sm:text-base"
              style={{ letterSpacing: '0.1em' }}>
              SEASON REVIEW ⚡
            </p>
          </div>
        </div>

        {/* Comic border bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#F45207] border-y-4 border-black" />
      </div>

      {/* Input section */}
      <div className="flex-1 flex flex-col items-center px-4 py-6 sm:px-6 sm:py-8 md:py-10 relative" style={{ background: '#0f0f0f' }}>
        {/* Decorative shurikens - hide on very small to avoid clutter */}
        <Shuriken className="absolute top-4 left-2 sm:top-6 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 text-[#F45207] opacity-20 rotate-45" />
        <Shuriken className="absolute top-10 right-4 sm:top-12 sm:right-6 w-6 h-6 sm:w-8 sm:h-8 text-[#F45207] opacity-15 -rotate-30 hidden sm:block" />
        <Shuriken className="absolute bottom-20 left-4 sm:left-8 w-8 h-8 sm:w-10 sm:h-10 text-[#F45207] opacity-20 rotate-12 hidden sm:block" />
        <Shuriken className="absolute bottom-32 right-2 sm:right-4 w-10 h-10 sm:w-14 sm:h-14 text-[#F45207] opacity-10 rotate-60 hidden md:block" />

        {/* Comic speech bubble / intro */}
        <div className="relative mb-6 sm:mb-8 w-full max-w-xs">
          <div
            className="border-4 border-black p-4 relative"
            style={{ background: '#1a1a1a', boxShadow: '5px 5px 0px #F45207' }}
          >
            {/* Speech bubble tail */}
            <div className="absolute -bottom-5 left-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-black" />
            <div className="absolute -bottom-3 left-9 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px]" style={{ borderTopColor: '#1a1a1a' }} />
            <p className="font-['Bangers'] text-white text-center text-sm sm:text-base md:text-lg">
              忍者球迷！你今年看了幾場比賽？
            </p>
            <p className="font-['Bangers'] text-[#F45207] text-center mt-1 text-xs sm:text-sm md:text-base">
              NINJA FAN! HOW MANY GAMES DID YOU ATTEND?
            </p>
          </div>
        </div>

        {/* Name input */}
        <div className="w-full max-w-xs sm:max-w-sm mt-4">
          <label className="font-['Bangers'] text-[#F45207] block mb-2 text-sm sm:text-base md:text-lg"
            style={{ letterSpacing: '0.1em' }}>
            ▶ 輸入你的名字 ENTER YOUR NAME
          </label>
          <div
            className={`border-4 border-black transition-all ${shake ? 'animate-bounce' : ''}`}
            style={{ background: '#1a1a1a', boxShadow: '5px 5px 0px #F45207' }}
          >
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="你的名字 / Your Name"
              className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-transparent outline-none font-['Noto_Sans_TC'] text-white placeholder:text-white/40 text-base min-h-[44px]"
              maxLength={20}
            />
          </div>
        </div>

        {/* Submit button - min 44px touch target */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full max-w-xs sm:max-w-sm relative overflow-hidden border-4 border-black text-black transition-all active:translate-x-1 active:translate-y-1 min-h-[48px] sm:min-h-[52px] py-3 sm:py-4 px-4 font-['Bangers'] text-lg sm:text-xl md:text-2xl"
          style={{
            background: '#F45207',
            boxShadow: '5px 5px 0px #000',
            letterSpacing: '0.1em',
          }}
          onMouseDown={e => (e.currentTarget.style.boxShadow = '2px 2px 0px #000')}
          onMouseUp={e => (e.currentTarget.style.boxShadow = '5px 5px 0px #000')}
          onTouchStart={e => (e.currentTarget.style.boxShadow = '2px 2px 0px #000')}
          onTouchEnd={e => (e.currentTarget.style.boxShadow = '5px 5px 0px #000')}
        >
          <HalftoneBackground />
          <span className="relative z-10">⚡ 出擊！LET'S GO! ⚡</span>
        </button>

        {/* Season label */}
        <p className="mt-6 font-['Bangers'] text-white/30 text-center text-xs sm:text-sm" style={{ letterSpacing: '0.1em' }}>
          2025-26 SEASON · 48 GAMES · CHAMPION ????
        </p>
      </div>
    </div>
  );
}
