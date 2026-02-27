import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { GAMES, PLAYERS, PlayerStat } from '../data/seasonData';
import { TeamBanner, Shuriken, HalftoneBackground } from './NinjaDecorations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, RotateCcw, Trophy, Zap, Shield, Target } from 'lucide-react';

interface Props {
  userName: string;
  selectedGames: string[];
  onBack: () => void;
}

interface AggregatedPlayerStat {
  playerId: string;
  name: string;
  nameEn: string;
  number: number;
  position: string;
  totalAttacks: number;
  totalBlocks: number;
  totalServes: number;
  totalPoints: number;
  totalSets: number;
  avgPointsPerSet: number;
}

const POSITION_LABELS: Record<string, string> = {
  OH: '主攻 OH',
  OP: '副攻 OP',
  MB: '中間 MB',
  S: '舉球 S',
  L: '自由 L',
};

const POSITION_COLORS: Record<string, string> = {
  OH: '#F45207',
  OP: '#ff8c42',
  MB: '#ffd166',
  S: '#06d6a0',
  L: '#118ab2',
};

function downloadResultAsText(
  userName: string,
  selectedGames: string[],
  games: typeof GAMES,
  aggregated: AggregatedPlayerStat[],
  winRate: number
) {
  const attended = games.filter(g => selectedGames.includes(g.id));
  const wins = attended.filter(g => g.result === 'win').length;
  let text = `🏐 台北東電力 2024-25 球季回顧\n`;
  text += `球迷：${userName}\n`;
  text += `觀賽場次：${attended.length} 場\n`;
  text += `勝場：${wins} 勝 ${attended.length - wins} 敗\n`;
  text += `勝率：${winRate.toFixed(1)}%\n\n`;
  text += `=== 球員數據 ===\n`;
  aggregated.forEach(p => {
    text += `\n#${p.number} ${p.name} (${p.position})\n`;
    text += `  總得分: ${p.totalPoints}  攻擊: ${p.totalAttacks}  攔網: ${p.totalBlocks}  發球: ${p.totalServes}\n`;
    text += `  出場局數: ${p.totalSets}  平均每局: ${p.avgPointsPerSet.toFixed(1)} 分\n`;
  });
  text += `\n=== 觀賽比賽 ===\n`;
  attended.forEach(g => {
    text += `${g.date} vs ${g.opponentShort} ${g.score} (${g.result === 'win' ? '勝' : '敗'})\n`;
  });

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${userName}_東電力_球季回顧.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function StatCard({ label, value, sublabel, color = '#F45207', icon }: {
  label: string; value: string | number; sublabel?: string; color?: string; icon?: ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden border-4 border-black p-2.5 sm:p-3 flex flex-col items-center justify-center min-h-[80px] sm:min-h-0"
      style={{ background: '#1a1a1a', boxShadow: `4px 4px 0px ${color}` }}
    >
      <HalftoneBackground />
      {icon && <div className="relative z-10 mb-0.5 sm:mb-1 w-4 h-4 sm:w-5 sm:h-5" style={{ color }}>{icon}</div>}
      <div className="font-['Bangers'] relative z-10 text-xl sm:text-2xl leading-none" style={{ color }}>{value}</div>
      <div className="font-['Bangers'] text-white relative z-10 text-center mt-0.5 sm:mt-1 text-[0.65rem] sm:text-xs" style={{ letterSpacing: '0.08em' }}>{label}</div>
      {sublabel && <div className="font-['Noto_Sans_TC'] text-white/40 relative z-10 text-center text-[0.6rem] sm:text-[0.65rem]">{sublabel}</div>}
    </div>
  );
}

function PlayerCard({ p, rank }: { p: AggregatedPlayerStat; rank: number }) {
  const posColor = POSITION_COLORS[p.position] || '#F45207';
  const isMVP = rank === 1;

  return (
    <div
      className="relative border-4 border-black overflow-hidden"
      style={{
        background: isMVP ? '#1a0f00' : '#141414',
        boxShadow: isMVP ? `5px 5px 0px #F45207` : `3px 3px 0px #333`,
      }}
    >
      {isMVP && <HalftoneBackground />}

      <div className="relative z-10 p-2.5 sm:p-3">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-2">
          {/* Rank + number */}
          <div
            className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 border-[3px] border-black flex items-center justify-center font-['Bangers'] text-base sm:text-lg"
            style={{ background: posColor, color: '#000' }}
          >
            #{p.number}
          </div>
          {/* Name */}
          <div className="flex-1">
            <div className="flex items-center gap-1">
              {isMVP && <Trophy className="w-4 h-4 text-yellow-400" />}
              <span className="font-['Noto_Sans_TC'] text-white" style={{ fontWeight: 700, fontSize: '1rem' }}>{p.name}</span>
              {isMVP && <span className="font-['Bangers'] text-yellow-400 ml-1" style={{ fontSize: '0.75rem' }}>MVP!</span>}
            </div>
            <div className="flex items-center gap-2">
              <span
                className="font-['Bangers'] px-1.5 py-0 border-2 border-black"
                style={{ fontSize: '0.7rem', background: posColor, color: '#000' }}
              >
                {POSITION_LABELS[p.position]}
              </span>
              <span className="font-['Noto_Sans_TC'] text-white/40" style={{ fontSize: '0.7rem' }}>
                {p.totalSets} 局
              </span>
            </div>
          </div>
          {/* Total points */}
          <div className="text-right">
            <div className="font-['Bangers']" style={{ fontSize: '2rem', color: posColor, lineHeight: 1 }}>{p.totalPoints}</div>
            <div className="font-['Bangers'] text-white/50" style={{ fontSize: '0.65rem' }}>總得分 PTS</div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 border-t-2 border-white/10 pt-2">
          {[
            { label: '攻擊 ATK', value: p.totalAttacks, icon: <Zap className="w-3 h-3" /> },
            { label: '攔網 BLK', value: p.totalBlocks, icon: <Shield className="w-3 h-3" /> },
            { label: '發球 SRV', value: p.totalServes, icon: <Target className="w-3 h-3" /> },
          ].map(stat => (
            <div key={stat.label}
              className="border-2 border-black px-2 py-1.5 text-center"
              style={{ background: '#0f0f0f' }}
            >
              <div className="flex items-center justify-center gap-1 text-white/50 mb-0.5">{stat.icon}</div>
              <div className="font-['Bangers'] text-white" style={{ fontSize: '1.1rem' }}>{stat.value}</div>
              <div className="font-['Noto_Sans_TC'] text-white/40" style={{ fontSize: '0.6rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Avg per set bar */}
        <div className="mt-2 flex items-center gap-2">
          <span className="font-['Bangers'] text-white/50" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>每局 / SET</span>
          <div className="flex-1 h-3 border-2 border-black" style={{ background: '#0f0f0f' }}>
            <div
              className="h-full transition-all"
              style={{
                width: `${Math.min((p.avgPointsPerSet / 5) * 100, 100)}%`,
                background: posColor,
              }}
            />
          </div>
          <span className="font-['Bangers']" style={{ fontSize: '0.85rem', color: posColor, whiteSpace: 'nowrap' }}>
            {p.avgPointsPerSet.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ResultsPage({ userName, selectedGames, onBack }: Props) {
  const attended = GAMES.filter(g => selectedGames.includes(g.id));
  const wins = attended.filter(g => g.result === 'win').length;
  const losses = attended.length - wins;
  const winRate = attended.length > 0 ? (wins / attended.length) * 100 : 0;
  const totalSets = attended.reduce((s, g) => s + g.totalSets, 0);

  const aggregated: AggregatedPlayerStat[] = useMemo(() => {
    return PLAYERS.map(player => {
      const stats: PlayerStat[] = attended.flatMap(g =>
        g.playerStats.filter(ps => ps.playerId === player.id)
      );
      const totalAttacks = stats.reduce((s, p) => s + p.attacks, 0);
      const totalBlocks = stats.reduce((s, p) => s + p.blocks, 0);
      const totalServes = stats.reduce((s, p) => s + p.serves, 0);
      const totalPoints = totalAttacks + totalBlocks + totalServes;
      const totalSetsPlayed = stats.reduce((s, p) => s + p.setsPlayed, 0);
      return {
        playerId: player.id,
        name: player.name,
        nameEn: player.nameEn,
        number: player.number,
        position: player.position,
        totalAttacks,
        totalBlocks,
        totalServes,
        totalPoints,
        totalSets: totalSetsPlayed,
        avgPointsPerSet: totalSetsPlayed > 0 ? totalPoints / totalSetsPlayed : 0,
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [selectedGames]);

  const chartData = aggregated.map(p => ({
    name: `#${p.number} ${p.name}`,
    攻擊: p.totalAttacks,
    攔網: p.totalBlocks,
    發球: p.totalServes,
    total: p.totalPoints,
  }));

  const topScorer = aggregated[0];
  const topBlocker = [...aggregated].sort((a, b) => b.totalBlocks - a.totalBlocks)[0];
  const topServer = [...aggregated].sort((a, b) => b.totalServes - a.totalServes)[0];

  return (
    <div className="min-h-screen flex flex-col min-w-0" style={{ background: '#0f0f0f' }}>
      <TeamBanner subtitle={`${userName} 的球季回顧 · ${attended.length} 場觀賽`} />

      <div className="flex-1 overflow-auto pb-28 sm:pb-32 min-h-0 px-3 sm:px-4 md:px-6 space-y-4 pt-4">

        {/* Fan greeting comic bubble */}
        <div
          className="relative border-4 border-black p-3 sm:p-4"
          style={{ background: '#1a1a1a', boxShadow: '5px 5px 0px #F45207' }}
        >
          <Shuriken className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 text-[#F45207]" />
          <p className="font-['Bangers'] text-white text-center text-lg sm:text-xl md:text-2xl">
            忍者球迷 {userName}！
          </p>
          <p className="font-['Bangers'] text-[#F45207] text-center text-sm sm:text-base">
            你今季陪東電力打了 {attended.length} 場！
          </p>
          {winRate >= 60 && (
            <p className="font-['Bangers'] text-white/60 text-center mt-1 text-sm sm:text-base">
              你的出現帶來了勝利之力！⚡
            </p>
          )}
        </div>

        {/* Overview stats - 2 cols mobile, 4 cols from md */}
        <div>
          <SectionTitle>📊 總覽 OVERVIEW</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            <StatCard
              label="勝率 WIN RATE"
              value={`${winRate.toFixed(0)}%`}
              sublabel={`${wins}勝${losses}敗`}
              color="#F45207"
              icon={<Trophy className="w-5 h-5" />}
            />
            <StatCard
              label="觀賽場數 GAMES"
              value={attended.length}
              sublabel={`全季 18 場`}
              color="#ffd166"
              icon={<Zap className="w-5 h-5" />}
            />
            <StatCard
              label="觀賽總局數 SETS"
              value={totalSets}
              sublabel="total sets watched"
              color="#06d6a0"
            />
            <StatCard
              label="最高分球員 MVP"
              value={topScorer?.name || '-'}
              sublabel={`${topScorer?.totalPoints} 分`}
              color="#ef4444"
              icon={<Trophy className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Awards strip - 3 cols, stack on very small if needed we keep 3 */}
        <div>
          <SectionTitle>🏅 單項之最 TOP AWARDS</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <AwardCard title="攻擊王" subtitle="TOP ATK" name={topScorer?.name || '-'} value={topScorer?.totalAttacks || 0} color="#F45207" />
            <AwardCard title="攔網王" subtitle="TOP BLK" name={topBlocker?.name || '-'} value={topBlocker?.totalBlocks || 0} color="#ffd166" />
            <AwardCard title="發球王" subtitle="TOP SRV" name={topServer?.name || '-'} value={topServer?.totalServes || 0} color="#06d6a0" />
          </div>
        </div>

        {/* Match log */}
        <div>
          <SectionTitle>📅 觀賽記錄 GAMES ATTENDED</SectionTitle>
          <div
            className="border-4 border-black overflow-hidden"
            style={{ boxShadow: '4px 4px 0px #F45207' }}
          >
            {attended.map((g, i) => (
              <div
                key={g.id}
                className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 border-b-2 border-black/30 last:border-0 min-w-0"
                style={{ background: i % 2 === 0 ? '#151515' : '#111' }}
              >
                <span
                  className="font-['Bangers'] px-1.5 py-0.5 sm:px-2 border-2 border-black flex-shrink-0 text-xs sm:text-sm"
                  style={{ background: g.result === 'win' ? '#F45207' : '#444', color: '#fff' }}
                >
                  {g.result === 'win' ? '勝 W' : '敗 L'}
                </span>
                <span className="font-['Bangers'] text-white flex-shrink-0 text-sm sm:text-base">{g.score}</span>
                <span className="font-['Noto_Sans_TC'] text-white/70 truncate text-xs sm:text-sm min-w-0">
                  vs {g.opponentShort}
                </span>
                <span className="font-['Noto_Sans_TC'] text-white/30 ml-auto flex-shrink-0 text-[0.65rem] sm:text-xs">
                  {g.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Points bar chart - responsive height */}
        <div>
          <SectionTitle>📈 球員得分 PLAYER POINTS</SectionTitle>
          <div
            className="border-4 border-black p-2 sm:p-3 min-h-0"
            style={{ background: '#141414', boxShadow: '4px 4px 0px #F45207' }}
          >
            <div className="w-full h-[200px] sm:h-[240px] md:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#999', fontFamily: 'Noto Sans TC', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: '#999', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '3px solid #F45207', borderRadius: 0, fontFamily: 'Bangers' }}
                  labelStyle={{ color: '#F45207' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="攻擊" stackId="a" fill="#F45207" />
                <Bar dataKey="攔網" stackId="a" fill="#ffd166" />
                <Bar dataKey="發球" stackId="a" fill="#06d6a0" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-1">
              {[['攻擊 ATK', '#F45207'], ['攔網 BLK', '#ffd166'], ['發球 SRV', '#06d6a0']].map(([l, c]) => (
                <div key={l} className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-black" style={{ background: c }} />
                  <span className="font-['Bangers'] text-white/60" style={{ fontSize: '0.7rem' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Player cards */}
        <div>
          <SectionTitle>👤 球員詳情 PLAYER DETAILS</SectionTitle>
          <div className="space-y-3">
            {aggregated.map((p, i) => (
              <PlayerCard key={p.playerId} p={p} rank={i + 1} />
            ))}
          </div>
        </div>

      </div>

      {/* Sticky bottom bar - safe area, touch targets */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t-4 border-black px-3 py-3 sm:px-4 flex flex-row gap-2 sm:gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        style={{ background: '#0f0f0f', zIndex: 50 }}
      >
        <button
          onClick={onBack}
          className="flex-1 min-h-[48px] border-4 border-[#F45207] font-['Bangers'] text-[#F45207] py-3 flex items-center justify-center gap-2 active:opacity-70 text-sm sm:text-base rounded-none"
          style={{ background: 'transparent' }}
        >
          <RotateCcw className="w-4 h-4 flex-shrink-0" />
          重新選擇 BACK
        </button>
        <button
          onClick={() => downloadResultAsText(userName, selectedGames, GAMES, aggregated, winRate)}
          className="min-h-[48px] border-4 border-black font-['Bangers'] text-black py-3 px-4 flex items-center justify-center gap-2 relative overflow-hidden active:translate-x-0.5 active:translate-y-0.5 text-sm sm:text-base flex-[2] rounded-none"
          style={{ background: '#F45207', boxShadow: '4px 4px 0px #000' }}
          onMouseDown={e => (e.currentTarget.style.boxShadow = '1px 1px 0px #000')}
          onMouseUp={e => (e.currentTarget.style.boxShadow = '4px 4px 0px #000')}
          onTouchStart={e => (e.currentTarget.style.boxShadow = '1px 1px 0px #000')}
          onTouchEnd={e => (e.currentTarget.style.boxShadow = '4px 4px 0px #000')}
        >
          <HalftoneBackground />
          <Download className="w-4 h-4 relative z-10" />
          <span className="relative z-10">下載成績 DOWNLOAD</span>
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div
      className="font-['Bangers'] text-black px-2.5 py-1.5 sm:px-3 sm:py-2 mb-2 border-4 border-black text-sm sm:text-base"
      style={{ background: '#F45207', letterSpacing: '0.05em', boxShadow: '3px 3px 0px #000' }}
    >
      {children}
    </div>
  );
}

function AwardCard({ title, subtitle, name, value, color }: {
  title: string; subtitle: string; name: string; value: number; color: string;
}) {
  return (
    <div
      className="border-4 border-black p-2 text-center relative overflow-hidden"
      style={{ background: '#1a1a1a', boxShadow: `3px 3px 0px ${color}` }}
    >
      <HalftoneBackground />
      <div className="relative z-10">
        <div className="font-['Bangers']" style={{ color, fontSize: '0.8rem' }}>{subtitle}</div>
        <div className="font-['Bangers'] text-white" style={{ fontSize: '0.75rem' }}>{title}</div>
        <div className="flex justify-center my-1" style={{ color }}>
          <Shuriken className="w-5 h-5" />
        </div>
        <div className="font-['Noto_Sans_TC'] text-white" style={{ fontWeight: 700, fontSize: '0.8rem' }}>{name}</div>
        <div className="font-['Bangers']" style={{ color, fontSize: '1.4rem', lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );
}