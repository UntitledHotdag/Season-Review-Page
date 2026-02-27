import tpvlMatches from './tpvlMatches.json';

export interface PlayerStat {
  playerId: string;
  name: string;
  nameEn: string;
  number: number;
  position: string;
  attacks: number;
  blocks: number;
  serves: number;
  points: number;
  setsPlayed: number;
}

export interface Game {
  id: string;
  date: string;
  monthKey: string;
  monthLabel: string;
  opponent: string;
  opponentShort: string;
  isHome: boolean;
  venue: string;
  result: 'win' | 'loss';
  score: string;
  totalSets: number;
  playerStats: PlayerStat[];
}

/** Fallback roster when TPVL JSON is not used */
const STATIC_PLAYERS = [
  { id: 'p1', name: '陳俊宏', nameEn: 'Chen Jun-Hong', number: 1, position: 'OH' },
  { id: 'p2', name: '林大偉', nameEn: 'Lin Da-Wei', number: 7, position: 'OP' },
  { id: 'p3', name: '張明哲', nameEn: 'Zhang Ming-Zhe', number: 11, position: 'MB' },
  { id: 'p4', name: '王建志', nameEn: 'Wang Jian-Zhi', number: 14, position: 'MB' },
  { id: 'p5', name: '吳志明', nameEn: 'Wu Zhi-Ming', number: 4, position: 'S' },
  { id: 'p6', name: '黃昊天', nameEn: 'Huang Hao-Tian', number: 9, position: 'OH' },
  { id: 'p7', name: '李宗翰', nameEn: 'Li Zong-Han', number: 17, position: 'L' },
];

function makeStats(
  atk1: number, blk1: number, srv1: number,
  atk2: number, blk2: number, srv2: number,
  atk3: number, blk3: number, srv3: number,
  atk4: number, blk4: number, srv4: number,
  atk5: number, blk5: number, srv5: number,
  atk6: number, blk6: number, srv6: number,
  sets: number
): PlayerStat[] {
  const raw = [
    [atk1, blk1, srv1],
    [atk2, blk2, srv2],
    [atk3, blk3, srv3],
    [atk4, blk4, srv4],
    [atk5, blk5, srv5],
    [atk6, blk6, srv6],
    [0, 0, 0],
  ];
  return STATIC_PLAYERS.map((p, i) => ({
    playerId: p.id,
    name: p.name,
    nameEn: p.nameEn,
    number: p.number,
    position: p.position,
    attacks: raw[i][0],
    blocks: raw[i][1],
    serves: raw[i][2],
    points: raw[i][0] + raw[i][1] + raw[i][2],
    setsPlayed: sets,
  }));
}

/** Fallback games when TPVL JSON is not used */
const STATIC_GAMES: Game[] = [
  // OCTOBER 2024
  {
    id: 'g01', date: '2024-10-05', monthKey: '2024-10', monthLabel: '10月 October',
    opponent: '台灣電力公司', opponentShort: '台電',
    isHome: true, venue: '台北體育館',
    result: 'win', score: '3-1', totalSets: 4,
    playerStats: makeStats(14,2,2, 12,1,2, 5,3,1, 4,3,1, 1,1,1, 10,2,1, 4),
  },
  {
    id: 'g02', date: '2024-10-12', monthKey: '2024-10', monthLabel: '10月 October',
    opponent: '高雄TSC海神', opponentShort: '高雄TSC',
    isHome: false, venue: '高雄巨蛋',
    result: 'win', score: '3-2', totalSets: 5,
    playerStats: makeStats(18,2,2, 15,1,2, 6,3,1, 5,4,1, 2,1,2, 13,2,2, 5),
  },
  {
    id: 'g03', date: '2024-10-19', monthKey: '2024-10', monthLabel: '10月 October',
    opponent: '桃園浩昇', opponentShort: '桃園',
    isHome: true, venue: '台北體育館',
    result: 'loss', score: '2-3', totalSets: 5,
    playerStats: makeStats(15,1,1, 12,1,1, 4,2,1, 3,2,0, 1,0,1, 10,1,1, 5),
  },
  {
    id: 'g04', date: '2024-10-26', monthKey: '2024-10', monthLabel: '10月 October',
    opponent: '台中JKO鋼鐵人', opponentShort: '台中JKO',
    isHome: false, venue: '台中體育館',
    result: 'win', score: '3-0', totalSets: 3,
    playerStats: makeStats(10,2,2, 9,1,1, 4,2,1, 3,3,0, 1,1,1, 8,2,1, 3),
  },
  // NOVEMBER 2024
  {
    id: 'g05', date: '2024-11-02', monthKey: '2024-11', monthLabel: '11月 November',
    opponent: '台灣電力公司', opponentShort: '台電',
    isHome: false, venue: '台電體育館',
    result: 'win', score: '3-1', totalSets: 4,
    playerStats: makeStats(13,2,2, 11,1,2, 5,3,1, 4,2,1, 1,1,1, 9,2,1, 4),
  },
  {
    id: 'g06', date: '2024-11-09', monthKey: '2024-11', monthLabel: '11月 November',
    opponent: '高雄TSC海神', opponentShort: '高雄TSC',
    isHome: true, venue: '台北體育館',
    result: 'win', score: '3-0', totalSets: 3,
    playerStats: makeStats(11,2,2, 9,2,1, 4,3,1, 3,3,1, 1,1,1, 8,1,2, 3),
  },
  {
    id: 'g07', date: '2024-11-16', monthKey: '2024-11', monthLabel: '11月 November',
    opponent: '桃園浩昇', opponentShort: '桃園',
    isHome: false, venue: '桃園體育館',
    result: 'loss', score: '1-3', totalSets: 4,
    playerStats: makeStats(10,1,1, 9,0,1, 3,2,0, 2,2,0, 0,1,0, 7,1,1, 4),
  },
  {
    id: 'g08', date: '2024-11-23', monthKey: '2024-11', monthLabel: '11月 November',
    opponent: '台中JKO鋼鐵人', opponentShort: '台中JKO',
    isHome: true, venue: '台北體育館',
    result: 'win', score: '3-2', totalSets: 5,
    playerStats: makeStats(17,2,2, 14,1,2, 6,3,1, 5,3,1, 2,1,1, 12,2,2, 5),
  },
  // DECEMBER 2024
  {
    id: 'g09', date: '2024-12-07', monthKey: '2024-12', monthLabel: '12月 December',
    opponent: '台灣電力公司', opponentShort: '台電',
    isHome: true, venue: '台北體育館',
    result: 'win', score: '3-2', totalSets: 5,
    playerStats: makeStats(19,2,3, 16,2,2, 7,3,1, 5,4,1, 2,1,1, 13,2,2, 5),
  },
  {
    id: 'g10', date: '2024-12-14', monthKey: '2024-12', monthLabel: '12月 December',
    opponent: '高雄TSC海神', opponentShort: '高雄TSC',
    isHome: false, venue: '高雄巨蛋',
    result: 'win', score: '3-1', totalSets: 4,
    playerStats: makeStats(14,2,2, 12,1,2, 5,3,1, 4,2,1, 1,1,1, 10,2,1, 4),
  },
  {
    id: 'g11', date: '2024-12-21', monthKey: '2024-12', monthLabel: '12月 December',
    opponent: '桃園浩昇', opponentShort: '桃園',
    isHome: true, venue: '台北體育館',
    result: 'win', score: '3-0', totalSets: 3,
    playerStats: makeStats(10,2,1, 8,2,1, 4,3,1, 3,2,1, 1,1,1, 8,1,1, 3),
  },
  // JANUARY 2025
  {
    id: 'g12', date: '2025-01-04', monthKey: '2025-01', monthLabel: '1月 January',
    opponent: '台中JKO鋼鐵人', opponentShort: '台中JKO',
    isHome: false, venue: '台中體育館',
    result: 'loss', score: '2-3', totalSets: 5,
    playerStats: makeStats(16,1,1, 13,1,1, 5,2,1, 4,2,0, 1,1,1, 11,1,1, 5),
  },
  {
    id: 'g13', date: '2025-01-11', monthKey: '2025-01', monthLabel: '1月 January',
    opponent: '台灣電力公司', opponentShort: '台電',
    isHome: true, venue: '台北體育館',
    result: 'win', score: '3-1', totalSets: 4,
    playerStats: makeStats(15,2,2, 12,2,2, 5,3,1, 4,3,1, 2,1,1, 10,2,2, 4),
  },
  {
    id: 'g14', date: '2025-01-18', monthKey: '2025-01', monthLabel: '1月 January',
    opponent: '高雄TSC海神', opponentShort: '高雄TSC',
    isHome: false, venue: '高雄巨蛋',
    result: 'win', score: '3-0', totalSets: 3,
    playerStats: makeStats(11,2,2, 9,1,2, 4,3,1, 3,3,1, 1,1,2, 8,2,1, 3),
  },
  // FEBRUARY 2025
  {
    id: 'g15', date: '2025-02-01', monthKey: '2025-02', monthLabel: '2月 February',
    opponent: '桃園浩昇', opponentShort: '桃園',
    isHome: false, venue: '桃園體育館',
    result: 'loss', score: '1-3', totalSets: 4,
    playerStats: makeStats(11,1,1, 9,0,1, 3,2,0, 3,1,0, 0,0,1, 8,1,1, 4),
  },
  {
    id: 'g16', date: '2025-02-15', monthKey: '2025-02', monthLabel: '2月 February',
    opponent: '台中JKO鋼鐵人', opponentShort: '台中JKO',
    isHome: true, venue: '台北體育館',
    result: 'win', score: '3-2', totalSets: 5,
    playerStats: makeStats(20,2,2, 16,2,2, 7,3,2, 5,3,1, 2,1,2, 13,2,2, 5),
  },
  // PLAYOFFS - MARCH 2025
  {
    id: 'g17', date: '2025-03-01', monthKey: '2025-03', monthLabel: '3月 Playoffs 季後賽',
    opponent: '高雄TSC海神', opponentShort: '高雄TSC',
    isHome: false, venue: '新莊體育館 (準決賽)',
    result: 'win', score: '3-1', totalSets: 4,
    playerStats: makeStats(16,2,3, 14,2,2, 6,4,1, 5,3,1, 2,1,2, 12,2,2, 4),
  },
  {
    id: 'g18', date: '2025-03-08', monthKey: '2025-03', monthLabel: '3月 Playoffs 季後賽',
    opponent: '台灣電力公司', opponentShort: '台電',
    isHome: false, venue: '新莊體育館 (總決賽)',
    result: 'win', score: '3-2', totalSets: 5,
    playerStats: makeStats(21,3,3, 17,2,3, 7,4,2, 6,3,2, 2,1,2, 14,3,2, 5),
  },
];

type TpvlPayload = {
  games?: Game[];
  players?: { id: string; name: string; nameEn: string; number: number; position: string }[];
};
const tpvl = tpvlMatches as TpvlPayload;
const useTpvl =
  Array.isArray(tpvl.games) && tpvl.games.length > 0;

export const GAMES: Game[] = useTpvl ? tpvl.games! : STATIC_GAMES;
export const PLAYERS = useTpvl && Array.isArray(tpvl.players) && tpvl.players.length > 0
  ? tpvl.players
  : STATIC_PLAYERS;

export const MONTHS = Array.from(new Set(GAMES.map((g) => g.monthKey))).map((key) => ({
  key,
  label: GAMES.find((g) => g.monthKey === key)!.monthLabel,
  games: GAMES.filter((g) => g.monthKey === key),
}));
