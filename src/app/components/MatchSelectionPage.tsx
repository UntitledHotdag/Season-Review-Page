import { useState } from 'react';
import { GAMES, MONTHS } from '../data/seasonData';
import { TeamBanner, Shuriken, HalftoneBackground } from './NinjaDecorations';
import { ChevronDown, ChevronRight, Check, Trophy } from 'lucide-react';

interface Props {
  userName: string;
  onSubmit: (selectedGameIds: string[]) => void;
}

export function MatchSelectionPage({ userName, onSubmit }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openMonths, setOpenMonths] = useState<Set<string>>(
    new Set(MONTHS.map(m => m.key))
  );

  const toggleGame = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleMonth = (key: string) => {
    const monthGames = GAMES.filter(g => g.monthKey === key).map(g => g.id);
    const allSelected = monthGames.every(id => selected.has(id));
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelected) {
        monthGames.forEach(id => next.delete(id));
      } else {
        monthGames.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const toggleMonthOpen = (key: string) => {
    setOpenMonths(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(GAMES.map(g => g.id)));
  const clearAll = () => setSelected(new Set());

  const handleSubmit = () => {
    if (selected.size === 0) return;
    onSubmit(Array.from(selected));
  };

  const monthSelected = (key: string) => {
    const games = GAMES.filter(g => g.monthKey === key);
    const count = games.filter(g => selected.has(g.id)).length;
    if (count === 0) return 'none';
    if (count === games.length) return 'all';
    return 'partial';
  };

  return (
    <div className="min-h-screen flex flex-col min-w-0" style={{ background: '#0f0f0f' }}>
      <TeamBanner subtitle={`歡迎，${userName}！選擇你親臨現場的比賽 ▼`} />

      {/* Select all / clear bar */}
      <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 border-b-4 border-black"
        style={{ background: '#1a1a1a' }}>
        <span className="font-['Bangers'] text-white text-sm sm:text-base">
          已選 {selected.size} / {GAMES.length} 場
        </span>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="px-2.5 py-2 sm:px-3 sm:py-2 min-h-[44px] border-2 border-[#F45207] font-['Bangers'] text-[#F45207] active:opacity-70 text-xs sm:text-sm rounded-none"
            style={{ background: 'transparent' }}
          >全選 ALL</button>
          <button
            onClick={clearAll}
            className="px-2.5 py-2 sm:px-3 sm:py-2 min-h-[44px] border-2 border-white/30 font-['Bangers'] text-white/50 active:opacity-70 text-xs sm:text-sm rounded-none"
            style={{ background: 'transparent' }}
          >清除 CLEAR</button>
        </div>
      </div>

      {/* Month sections */}
      <div className="flex-1 overflow-auto pb-28 sm:pb-32 min-h-0">
        {MONTHS.map(month => {
          const status = monthSelected(month.key);
          const isOpen = openMonths.has(month.key);
          const isPlayoffs = month.key === '2025-03';

          return (
            <div key={month.key} className="border-b-4 border-black">
              {/* Month header row */}
              <div className="flex items-center gap-2 px-2 sm:px-3 py-0">
                {/* Month toggle button - min touch target on mobile */}
                <button
                  onClick={() => toggleMonth(month.key)}
                  className="flex items-center justify-center border-4 border-black relative overflow-hidden min-w-[56px] w-14 h-14 sm:min-w-[68px] sm:w-[68px] sm:h-16"
                  style={{
                    background: status === 'all' ? '#F45207' : status === 'partial' ? '#7a2800' : '#222',
                    boxShadow: status === 'all' ? '3px 3px 0px #000' : '3px 3px 0px #F45207',
                    flexShrink: 0,
                  }}
                >
                  {status === 'all' && <HalftoneBackground />}
                  <div className="relative z-10 flex flex-col items-center">
                    <Shuriken className={`w-5 h-5 sm:w-6 sm:h-6 ${status === 'all' ? 'text-black' : 'text-[#F45207]'}`} />
                    <span className="font-['Bangers'] text-white mt-0.5 sm:mt-1 text-center leading-none text-[0.6rem] sm:text-[0.7rem]">
                      {status === 'all' ? '✓ ALL' : status === 'partial' ? 'SOME' : 'NONE'}
                    </span>
                  </div>
                </button>

                {/* Month label + expand - min touch target */}
                <button
                  className="flex-1 flex items-center justify-between py-3 sm:py-4 px-2 min-h-[52px] sm:min-h-[64px]"
                  onClick={() => toggleMonthOpen(month.key)}
                >
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-2">
                      {isPlayoffs && <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
                      <span className="font-['Bangers'] text-white text-base sm:text-lg md:text-xl truncate">
                        {month.label}
                      </span>
                    </div>
                    <span className="font-['Noto_Sans_TC'] text-white/40 text-xs sm:text-sm">
                      {month.games.length} 場比賽 · {month.games.filter(g => selected.has(g.id)).length} 已選
                    </span>
                  </div>
                  {isOpen
                    ? <ChevronDown className="w-5 h-5 text-[#F45207]" />
                    : <ChevronRight className="w-5 h-5 text-[#F45207]" />
                  }
                </button>
              </div>

              {/* Game list */}
              {isOpen && (
                <div className="pl-2 pr-2 sm:pl-4 sm:pr-3 pb-3 space-y-2" style={{ background: '#111' }}>
                  {month.games.map(game => {
                    const sel = selected.has(game.id);
                    const isWin = game.result === 'win';

                    return (
                      <button
                        key={game.id}
                        onClick={() => toggleGame(game.id)}
                        className="w-full flex items-center gap-2 sm:gap-3 text-left border-[3px] border-black relative overflow-hidden transition-all active:scale-[0.98] min-h-[72px] sm:min-h-0 py-2.5 sm:py-3 px-2.5 sm:px-3"
                        style={{
                          background: sel ? (isWin ? '#1a3a00' : '#3a0000') : '#1e1e1e',
                          borderColor: sel ? (isWin ? '#4ade80' : '#f87171') : '#333',
                          boxShadow: sel ? `3px 3px 0px ${isWin ? '#4ade80' : '#f87171'}` : '2px 2px 0px #000',
                        }}
                      >
                        {/* Check / toggle box - touch friendly */}
                        <div
                          className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 border-[3px] flex items-center justify-center"
                          style={{
                            borderColor: sel ? (isWin ? '#4ade80' : '#f87171') : '#444',
                            background: sel ? (isWin ? '#4ade80' : '#f87171') : 'transparent',
                          }}
                        >
                          {sel && <Check className="w-4 h-4 sm:w-5 sm:h-5 text-black" strokeWidth={3} />}
                        </div>

                        {/* Game info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <span
                              className="font-['Bangers'] px-1.5 py-0.5 sm:px-2 border-2 border-black text-[0.7rem] sm:text-xs"
                              style={{
                                background: isWin ? '#F45207' : '#555',
                                color: isWin ? '#fff' : '#aaa',
                                boxShadow: isWin ? '2px 2px 0px #000' : 'none',
                              }}
                            >
                              {isWin ? '⚡ WIN' : '✗ LOSS'}
                            </span>
                            <span className="font-['Bangers'] text-white text-sm sm:text-base">
                              {game.score}
                            </span>
                          </div>
                          <div className="font-['Noto_Sans_TC'] text-white/80 truncate mt-0.5 text-xs sm:text-sm">
                            {game.isHome ? '主場 🏠 vs' : '客場 ✈ vs'} {game.opponent}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="font-['Noto_Sans_TC'] text-white/40 text-[0.65rem] sm:text-xs">
                              📅 {game.date}
                            </span>
                            <span className="font-['Noto_Sans_TC'] text-white/40 text-[0.65rem] sm:text-xs truncate max-w-[120px] sm:max-w-none">
                              📍 {game.venue}
                            </span>
                          </div>
                        </div>

                        {/* Sets pill */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <span className="font-['Bangers'] text-white/50 text-[0.6rem] sm:text-[0.7rem]">SETS</span>
                          <span className="font-['Bangers'] text-[#F45207] text-lg sm:text-xl">{game.totalSets}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky submit bar - safe area aware, min touch target */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t-4 border-black px-3 py-3 sm:px-4 sm:py-4 pb-[env(safe-area-inset-bottom,0)]"
        style={{ background: '#0f0f0f', zIndex: 50 }}
      >
        <button
          onClick={handleSubmit}
          disabled={selected.size === 0}
          className="w-full max-w-full sm:max-w-lg md:max-w-xl mx-auto block border-4 border-black font-['Bangers'] relative overflow-hidden transition-all active:translate-x-1 active:translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px] sm:min-h-[52px] py-3 sm:py-4 px-4 text-lg sm:text-xl md:text-2xl"
          style={{
            background: selected.size > 0 ? '#F45207' : '#444',
            color: '#fff',
            letterSpacing: '0.05em',
            boxShadow: selected.size > 0 ? '5px 5px 0px #000' : 'none',
          }}
          onMouseDown={e => { if (selected.size > 0) e.currentTarget.style.boxShadow = '2px 2px 0px #000'; }}
          onMouseUp={e => { if (selected.size > 0) e.currentTarget.style.boxShadow = '5px 5px 0px #000'; }}
          onTouchStart={e => { if (selected.size > 0) e.currentTarget.style.boxShadow = '2px 2px 0px #000'; }}
          onTouchEnd={e => { if (selected.size > 0) e.currentTarget.style.boxShadow = '5px 5px 0px #000'; }}
        >
          {selected.size > 0 && <HalftoneBackground />}
          <span className="relative z-10">
            {selected.size === 0
              ? '選擇比賽後提交 SELECT GAMES'
              : `⚡ 查看 ${selected.size} 場數據 SHOW STATS ⚡`}
          </span>
        </button>
      </div>
    </div>
  );
}
