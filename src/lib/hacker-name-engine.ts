import { createRNG, getRandomSeed } from './generator/rng';
import { isOffensive } from './generator/offensive';
import { sanitizeMustInclude } from './generator/engine';
import { HACKER_POOLS } from './generator/pools/hacker';

export type HackerStyle = 'any' | 'l33t' | 'cyberpunk' | 'minimal' | 'gamerTag' | 'terminal';
export type LeetLevel = 'none' | 'light' | 'heavy';
export type CaseStyle = 'as-generated' | 'lower' | 'camel' | 'upper';

export interface HackerNameOptions {
  style: HackerStyle;
  seedWord?: string;
  count: number; // 5..30
  leetLevel: LeetLevel;
  minLength: number; // 3..24
  maxLength: number; // 4..32
  allowSpaces: boolean;
  allowUnderscore: boolean;
  caseStyle: CaseStyle;
  rngSeed?: number;
  excludeNames?: string[];
}

export interface GeneratedHackerName {
  name: string;
  readable: string;
  style: Exclude<HackerStyle, 'any'>;
}

export interface HackerNameResult {
  names: GeneratedHackerName[];
  seedUsed: number;
  seedWarning?: string;
  filterWarning?: string;
}

export const DEFAULT_HACKER_OPTIONS: HackerNameOptions = {
  style: 'any',
  seedWord: '',
  count: 10,
  leetLevel: 'light',
  minLength: 4,
  maxLength: 16,
  allowSpaces: false,
  allowUnderscore: true,
  caseStyle: 'as-generated',
};

const REAL_ALIAS_BLOCKLIST = new Set([
  'mitnick',
  'kevinmitnick',
  'snowden',
  'edwardsnowden',
  'assange',
  'anonymous',
  'lulzsec',
  'lazarus',
  'fancybear',
  'cozybear',
  'sandworm',
  'ulbricht',
  'geohot',
  'torvalds',
  'google',
  'microsoft',
  'apple',
  'amazon',
  'openai',
  'cloudflare',
  'metasploit',
  'arasaka',
]);

const LIGHT_LEET: Record<string, string> = {
  o: '0',
  O: '0',
  e: '3',
  E: '3',
};

const HEAVY_LEET: Record<string, string> = {
  a: '4',
  A: '4',
  e: '3',
  E: '3',
  i: '1',
  I: '1',
  o: '0',
  O: '0',
  s: '5',
  S: '5',
  t: '7',
  T: '7',
};

const DELEET_MAP: Record<string, string> = {
  '4': 'a',
  '@': 'a',
  '3': 'e',
  '1': 'i',
  '!': 'i',
  '0': 'o',
  '5': 's',
  '$': 's',
  '7': 't',
};

export function applyLeet(input: string, level: LeetLevel): string {
  if (level === 'none') return input;
  const map = level === 'light' ? LIGHT_LEET : HEAVY_LEET;
  return Array.from(input)
    .map((ch) => map[ch] ?? ch)
    .join('');
}

export function deLeet(input: string): string {
  return Array.from(input.toLowerCase())
    .map((ch) => DELEET_MAP[ch] ?? ch)
    .join('');
}

export function isHackerNameUnsafe(candidate: string): boolean {
  if (!candidate) return true;
  const deLeeted = deLeet(candidate);
  if (isOffensive(candidate) || isOffensive(deLeeted)) {
    return true;
  }
  const stripped = deLeeted.replace(/[^a-z0-9]/g, '');
  const rawStripped = candidate.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const alias of REAL_ALIAS_BLOCKLIST) {
    if (stripped.includes(alias) || rawStripped.includes(alias)) {
      return true;
    }
  }
  return false;
}

function toCamel(parts: string[]): string {
  return parts
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join('');
}

function applyCaseStyle(raw: string, caseStyle: CaseStyle): string {
  if (caseStyle === 'lower') return raw.toLowerCase();
  if (caseStyle === 'upper') return raw.toUpperCase();
  if (caseStyle === 'camel') {
    return raw
      .split(/[\s_]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
  return raw;
}

function formatForRules(
  raw: string,
  opts: HackerNameOptions
): string {
  let s = raw.trim();
  if (!opts.allowSpaces) {
    s = s.replace(/\s+/g, opts.allowUnderscore ? '_' : '');
  }
  if (!opts.allowUnderscore) {
    s = s.replace(/_/g, opts.allowSpaces ? ' ' : '');
  }
  // Strip any disallowed punctuation (like parentheses in terminal style when rules disallow)
  const allowedPattern = opts.allowSpaces
    ? opts.allowUnderscore
      ? /[^a-zA-Z0-9_\s]/g
      : /[^a-zA-Z0-9\s]/g
    : opts.allowUnderscore
      ? /[^a-zA-Z0-9_]/g
      : /[^a-zA-Z0-9]/g;
  s = s.replace(allowedPattern, '');
  s = applyCaseStyle(s, opts.caseStyle);
  return s;
}

function pickFrom<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

const CONCRETE_STYLES: Exclude<HackerStyle, 'any'>[] = [
  'l33t',
  'cyberpunk',
  'minimal',
  'gamerTag',
  'terminal',
];

function buildCandidate(
  style: Exclude<HackerStyle, 'any'>,
  seedWord: string,
  leetLevel: LeetLevel,
  rng: () => number,
  allowUnderscore: boolean
): { raw: string; readable: string } {
  const cleanSeed = seedWord.replace(/\s+/g, '');
  const adj = pickFrom(HACKER_POOLS.adjectives, rng);
  const noun = pickFrom(HACKER_POOLS.techNouns, rng);
  const prefix = pickFrom(HACKER_POOLS.prefixes, rng);
  const suffix = pickFrom(HACKER_POOLS.suffixes, rng);
  const token = pickFrom(HACKER_POOLS.terminalTokens, rng);
  const shortWord = pickFrom(HACKER_POOLS.shortWords, rng);

  if (style === 'l33t') {
    const baseParts = cleanSeed
      ? rng() < 0.5
        ? [cleanSeed, noun]
        : [adj, cleanSeed]
      : rng() < 0.4
        ? [noun]
        : [adj, noun];
    const readable = baseParts.join(allowUnderscore && rng() < 0.5 ? '_' : '');
    const raw = applyLeet(readable, leetLevel);
    return { raw, readable };
  }

  if (style === 'cyberpunk') {
    const base = cleanSeed
      ? rng() < 0.5
        ? toCamel([adj, cleanSeed])
        : toCamel([cleanSeed, noun])
      : toCamel([adj, noun]);
    return { raw: base, readable: base };
  }

  if (style === 'minimal') {
    const word = cleanSeed ? cleanSeed.toLowerCase() : shortWord;
    const digits = String(Math.floor(rng() * 900) + 10); // 10..909
    const raw = `${word}${digits}`;
    return { raw, readable: raw };
  }

  if (style === 'gamerTag') {
    const core = cleanSeed || noun;
    const joiner = allowUnderscore && rng() < 0.55 ? '_' : '';
    const raw =
      joiner === '_'
        ? `${prefix}_${core}_${suffix}`
        : toCamel([prefix, core, suffix]);
    return { raw, readable: raw };
  }

  // terminal
  const roll = rng();
  if (roll < 0.4) {
    const second = cleanSeed || noun;
    const raw = `${token}_${second}`;
    return { raw, readable: raw };
  }
  if (roll < 0.75) {
    const target = cleanSeed || noun;
    const cap = target.charAt(0).toUpperCase() + target.slice(1).toLowerCase();
    const raw = `0x${cap}`;
    return { raw, readable: raw };
  }
  const core = cleanSeed || pickFrom(HACKER_POOLS.verbs, rng);
  const raw = `${core}_${token}`;
  return { raw, readable: raw };
}

export function generateHackerNames(
  opts: HackerNameOptions = DEFAULT_HACKER_OPTIONS
): HackerNameResult {
  const seedUsed = opts.rngSeed ?? getRandomSeed();
  const rng = createRNG(seedUsed);

  const sanitizedSeed = sanitizeMustInclude(opts.seedWord);
  let activeSeed = sanitizedSeed;
  let seedWarning: string | undefined;

  if (sanitizedSeed && isHackerNameUnsafe(sanitizedSeed)) {
    activeSeed = '';
    seedWarning = 'Your seed word triggered the safety filter and was ignored.';
  }

  const targetCount = Math.max(5, Math.min(30, Math.floor(opts.count || 10)));
  const minLen = Math.max(3, Math.min(24, Math.floor(opts.minLength || 4)));
  const maxLen = Math.max(minLen, Math.min(32, Math.floor(opts.maxLength || 16)));

  const excluded = new Set((opts.excludeNames ?? []).map((n) => n.toLowerCase()));
  const seen = new Set<string>();
  const names: GeneratedHackerName[] = [];

  const maxAttempts = targetCount * 40;
  for (let attempt = 0; attempt < maxAttempts && names.length < targetCount; attempt++) {
    const chosenStyle: Exclude<HackerStyle, 'any'> =
      opts.style === 'any' ? pickFrom(CONCRETE_STYLES, rng) : opts.style;

    const { raw, readable } = buildCandidate(
      chosenStyle,
      activeSeed,
      opts.leetLevel,
      rng,
      opts.allowUnderscore
    );

    const formatted = formatForRules(raw, opts);
    if (formatted.length < minLen || formatted.length > maxLen) continue;
    if (isHackerNameUnsafe(formatted) || isHackerNameUnsafe(readable)) continue;

    const key = formatted.toLowerCase();
    if (seen.has(key) || excluded.has(key)) continue;

    seen.add(key);
    names.push({
      name: formatted,
      readable: formatForRules(readable, opts),
      style: chosenStyle,
    });
  }

  const filterWarning =
    names.length < targetCount
      ? `Only ${names.length} of ${targetCount} names matched your length (${minLen}–${maxLen}) and character rules. Try widening the range.`
      : undefined;

  return {
    names,
    seedUsed,
    seedWarning,
    filterWarning,
  };
}
