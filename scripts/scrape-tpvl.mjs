#!/usr/bin/env node
/**
 * TPVL Scraper – Taipei East Power (臺北伊斯特) match list and per-match player stats.
 * Fetches schedule from https://www.tpvl.tw/schedule/schedule?tab=result
 * and each match record from https://www.tpvl.tw/schedule/{matchId}.
 * Outputs src/app/data/tpvlMatches.json for the fan page.
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TAIPEI_SQUAD_ID = 11383;
const SCHEDULE_URL = 'https://www.tpvl.tw/schedule/schedule?tab=result';
const MATCH_BASE = 'https://www.tpvl.tw/schedule';
const OUTPUT_PATH = join(__dirname, '..', 'src', 'app', 'data', 'tpvlMatches.json');

const POSITION_MAP = {
  OppositeHitter: 'OP',
  OutsideHitter: 'OH',
  MiddleBlocker: 'MB',
  Setter: 'S',
  Libero: 'L',
};

function positionToCode(pos) {
  return POSITION_MAP[pos] || pos?.replace(/([A-Z])/g, ' $1').trim().slice(0, 2).toUpperCase() || '?';
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

function extractNextData(html) {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]+?)<\/script>/);
  if (!m) throw new Error('__NEXT_DATA__ not found');
  return JSON.parse(m[1]);
}

function parseDate(matchedAt) {
  if (!matchedAt) return null;
  const d = new Date(matchedAt);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

function monthKey(dateStr) {
  if (!dateStr) return '';
  return dateStr.slice(0, 7);
}

const MONTH_LABELS = {
  '01': '1月 January', '02': '2月 February', '03': '3月 March', '04': '4月 April',
  '05': '5月 May', '06': '6月 June', '07': '7月 July', '08': '8月 August',
  '09': '9月 September', '10': '10月 October', '11': '11月 November', '12': '12月 December',
};

function monthLabel(key) {
  if (!key) return '';
  const [, m] = key.split('-');
  return MONTH_LABELS[m] || key;
}

const OPPONENT_SHORT = {
  '臺中連莊': '臺中連莊',
  '台鋼天鷹': '台鋼天鷹',
  '桃園雲豹飛將': '桃園',
};

function opponentShort(name) {
  return OPPONENT_SHORT[name] || (name?.slice(0, 2) ?? '');
}

async function getScheduleMatches() {
  const html = await fetchText(SCHEDULE_URL);
  const next = extractNextData(html);
  const data = next?.props?.pageProps?.resultMatchData?.data;
  if (!Array.isArray(data)) throw new Error('resultMatchData.data not found');
  const taipeiMatches = data.filter(
    (m) => m.homeSquadId === TAIPEI_SQUAD_ID || m.awaySquadId === TAIPEI_SQUAD_ID
  );
  return taipeiMatches;
}

async function getMatchRecord(matchId) {
  const url = `${MATCH_BASE}/${matchId}`;
  const html = await fetchText(url);
  const next = extractNextData(html);
  return next?.props?.pageProps?.matchRecord ?? null;
}

function toGame(match, record) {
  const date = parseDate(match.matchedAt);
  const isHome = match.homeSquadId === TAIPEI_SQUAD_ID;
  const opponentSquad = isHome ? match.awaySquad : match.homeSquad;
  const opponent = opponentSquad?.name ?? '未知';
  const venue = match.venue ?? '';

  let result = 'loss';
  let score = '0-0';
  let totalSets = 0;

  if (record?.squadMatchResults) {
    const taipeiResult = record.squadMatchResults.find((r) => r.squadId === TAIPEI_SQUAD_ID);
    if (taipeiResult) {
      const won = taipeiResult.wonRounds ?? 0;
      const lost = taipeiResult.lostRounds ?? 0;
      totalSets = won + lost;
      score = `${won}-${lost}`;
      result = won > lost ? 'win' : 'loss';
    }
  }

  const rosterStats = record
    ? record.homeSquadId === TAIPEI_SQUAD_ID
      ? record.homeRosterStats?.rows
      : record.awayRosterStats?.rows
    : [];

  const playerStats = (rosterStats || [])
    .filter((row) => row && row.name && String(row.name).trim() !== '全隊合計')
    .map((row) => {
      const num = parseInt(row.jerseyNumber, 10) || 0;
      const attacks = Number(row.attackPoints) || 0;
      const blocks = Number(row.blockPoints) || 0;
      const serves = Number(row.servePoints) || 0;
      const points = Number(row.totalPoints) || attacks + blocks + serves;
      return {
        playerId: `p-${row.id ?? num}`,
        name: String(row.name ?? '').trim(),
        nameEn: '',
        number: num,
        position: positionToCode(row.position),
        attacks,
        blocks,
        serves,
        points,
        setsPlayed: totalSets,
      };
    });

  const monthK = monthKey(date);
  return {
    id: `g${match.id}`,
    date: date ?? '',
    monthKey: monthK,
    monthLabel: monthLabel(monthK),
    opponent,
    opponentShort: opponentShort(opponent),
    isHome,
    venue,
    result,
    score,
    totalSets,
    playerStats,
  };
}

function buildPlayers(games) {
  const byKey = new Map();
  for (const g of games) {
    for (const ps of g.playerStats) {
      const key = `${ps.number}-${ps.name}`;
      if (byKey.has(key)) continue;
      byKey.set(key, {
        id: ps.playerId,
        name: ps.name,
        nameEn: ps.nameEn || '',
        number: ps.number,
        position: ps.position,
      });
    }
  }
  return Array.from(byKey.values());
}

async function main() {
  console.log('Fetching schedule...');
  const matches = await getScheduleMatches();
  console.log(`Found ${matches.length} Taipei East Power matches.`);

  const games = [];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    await delay(400);
    try {
      const record = await getMatchRecord(m.id);
      const game = toGame(m, record);
      games.push(game);
      console.log(`  [${i + 1}/${matches.length}] ${game.date} vs ${game.opponent} ${game.score}`);
    } catch (err) {
      console.error(`  [${i + 1}/${matches.length}] Match ${m.id} failed:`, err.message);
    }
  }

  games.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  const players = buildPlayers(games);

  const out = {
    scrapedAt: new Date().toISOString(),
    games,
    players,
  };

  const dir = dirname(OUTPUT_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2), 'utf8');
  console.log(`\nWrote ${OUTPUT_PATH} (${games.length} games, ${players.length} players).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
