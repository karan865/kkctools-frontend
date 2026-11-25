/**
 * Offline Pattern-Based Password Strength Estimator.
 * Analyses up to the first 128 NFC-normalized Unicode code points.
 * Uses log2 dynamic programming grouped by segment count `m` so `m! * Π guesses_i`
 * is minimized accurately without floating-point or safe-integer overflow.
 * Zero network calls, zero storage, zero Math.random.
 */

export type PatternType =
  | 'dictionary'
  | 'l33t'
  | 'sequence'
  | 'repeat'
  | 'keyboard'
  | 'date'
  | 'bruteforce';

export interface StrengthMatch {
  i: number; // inclusive start code-point index
  j: number; // exclusive end code-point index
  token: string;
  pattern: PatternType;
  log2Guesses: number;
  guessesDisplay: string;
  reason: string;
  dictionaryRank?: number;
}

export type StrengthBandId = 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';

export interface StrengthResult {
  analyzedLength: number;
  originalLength: number;
  truncatedTo128: boolean;
  guessesLog2: number;
  guessesLog10: number;
  naiveEntropyBits: number;
  naivePoolSize: number;
  score: 0 | 1 | 2 | 3 | 4;
  bandId: StrengthBandId;
  bandLabel: string;
  matches: StrengthMatch[];
  commonPasswordRank: number | null;
}

export interface DictionaryLookup {
  getCommonRank: (lower: string) => number | null;
  hasWord?: (lower: string) => boolean;
  wordListSize?: number;
}

const MAX_ANALYZED_CODEPOINTS = 128;

const LEET_MAP: Record<string, string[]> = {
  '4': ['a'],
  '@': ['a'],
  '3': ['e'],
  '1': ['i', 'l'],
  '!': ['i'],
  '0': ['o'],
  '5': ['s'],
  '$': ['s'],
  '7': ['t'],
};

const KEYBOARD_ROWS = [
  '1234567890-=',
  'qwertyuiop[]\\',
  "asdfghjkl;'",
  'zxcvbnm,./',
];

function log2Factorial(m: number): number {
  let sum = 0;
  for (let i = 2; i <= m; i++) {
    sum += Math.log2(i);
  }
  return sum;
}

function formatGuesses(log2Val: number): string {
  if (log2Val < 50) {
    const val = Math.round(Math.pow(2, log2Val));
    return val.toLocaleString('en-US');
  }
  const log10Val = log2Val * Math.LOG10E * Math.LN2;
  const exp = Math.floor(log10Val);
  const mant = Math.pow(10, log10Val - exp);
  return `${mant.toFixed(2)} × 10^${exp}`;
}

export function computeNaiveEntropy(chars: string[]): { bits: number; poolSize: number } {
  if (chars.length === 0) return { bits: 0, poolSize: 0 };
  let hasLower = false;
  let hasUpper = false;
  let hasDigit = false;
  let hasSymbol = false;
  let hasUnicode = false;

  for (const ch of chars) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 97 && code <= 122) hasLower = true;
    else if (code >= 65 && code <= 90) hasUpper = true;
    else if (code >= 48 && code <= 57) hasDigit = true;
    else if (code >= 32 && code <= 126) hasSymbol = true;
    else hasUnicode = true;
  }

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigit) poolSize += 10;
  if (hasSymbol) poolSize += 32;
  if (hasUnicode) poolSize += 100;
  if (poolSize === 0) poolSize = 10;

  return {
    bits: chars.length * Math.log2(poolSize),
    poolSize,
  };
}

function countUppercasePenalty(tokenChars: string[]): number {
  const letters = tokenChars.filter((c) => /[a-zA-Z]/.test(c));
  if (letters.length === 0) return 1;
  const upperCount = letters.filter((c) => /[A-Z]/.test(c)).length;
  if (upperCount === 0) return 1;
  // First letter capitalized only or all uppercase -> x2
  if ((upperCount === 1 && /[A-Z]/.test(letters[0])) || upperCount === letters.length) {
    return 2;
  }
  // k other capitals -> 2^k (capped reasonably)
  return Math.min(Math.pow(2, upperCount), 1 << 16);
}

function generateLeetCandidates(lowerToken: string): { word: string; kinds: number }[] {
  if (lowerToken.length > 20 || !/[4@31!05$7]/.test(lowerToken) || !/^[a-z4@31!05$7]+$/.test(lowerToken)) {
    return [];
  }
  const chars = Array.from(lowerToken);
  const swapPositions: { idx: number; subs: string[]; rawChar: string }[] = [];
  for (let i = 0; i < chars.length; i++) {
    const subs = LEET_MAP[chars[i]];
    if (subs) {
      swapPositions.push({ idx: i, subs, rawChar: chars[i] });
    }
  }
  if (swapPositions.length === 0 || swapPositions.length > 6) return [];

  const results: { word: string; kinds: number }[] = [];
  const usedKinds = new Set(swapPositions.map((p) => p.rawChar));

  const dfs = (posIdx: number, buf: string[]) => {
    if (posIdx === swapPositions.length) {
      results.push({ word: buf.join(''), kinds: usedKinds.size });
      return;
    }
    const pos = swapPositions[posIdx];
    for (const sub of pos.subs) {
      buf[pos.idx] = sub;
      dfs(posIdx + 1, buf);
    }
  };
  dfs(0, chars.slice());
  return results;
}

function findPatternMatches(
  chars: string[],
  dict?: DictionaryLookup,
  allowMultiRepeat = true
): StrengthMatch[] {
  const n = chars.length;
  const matches: StrengthMatch[] = [];

  // 1. Dictionary & l33t matches
  if (dict) {
    const maxDictLen = Math.min(n, 32);
    for (let i = 0; i < n; i++) {
      for (let j = i + 3; j <= Math.min(n, i + maxDictLen); j++) {
        const subChars = chars.slice(i, j);
        const token = subChars.join('');
        const lower = token.toLowerCase();

        const rank = dict.getCommonRank(lower);
        if (rank !== null) {
          const capMult = countUppercasePenalty(subChars);
          const guesses = rank * capMult;
          const log2G = Math.log2(Math.max(1, guesses));
          matches.push({
            i,
            j,
            token,
            pattern: 'dictionary',
            log2Guesses: log2G,
            guessesDisplay: formatGuesses(log2G),
            reason: `'${token}' matches #${rank.toLocaleString('en-US')} on the common-password list`,
            dictionaryRank: rank,
          });
        } else if (dict.hasWord && dict.hasWord(lower)) {
          const capMult = countUppercasePenalty(subChars);
          const base = dict.wordListSize ?? 7776;
          const guesses = base * capMult;
          const log2G = Math.log2(guesses);
          matches.push({
            i,
            j,
            token,
            pattern: 'dictionary',
            log2Guesses: log2G,
            guessesDisplay: formatGuesses(log2G),
            reason: `'${token}' is a common dictionary word`,
          });
        }

        // L33t check
        const leetCandidates = generateLeetCandidates(lower);
        if (leetCandidates.length > 0) {
          const capMult = countUppercasePenalty(subChars);
          for (const cand of leetCandidates) {
            const lRank = dict.getCommonRank(cand.word);
            if (lRank !== null) {
              const mult = capMult * Math.pow(2, cand.kinds);
              const guesses = lRank * mult;
              const log2G = Math.log2(Math.max(1, guesses));
              matches.push({
                i,
                j,
                token,
                pattern: 'l33t',
                log2Guesses: log2G,
                guessesDisplay: formatGuesses(log2G),
                reason: `'${token}' is a common word ('${cand.word}') with predictable l33t substitutions`,
                dictionaryRank: lRank,
              });
              break;
            } else if (dict.hasWord && dict.hasWord(cand.word)) {
              const base = dict.wordListSize ?? 7776;
              const guesses = base * capMult * Math.pow(2, cand.kinds);
              const log2G = Math.log2(guesses);
              matches.push({
                i,
                j,
                token,
                pattern: 'l33t',
                log2Guesses: log2G,
                guessesDisplay: formatGuesses(log2G),
                reason: `'${token}' is a dictionary word ('${cand.word}') with l33t substitutions`,
              });
              break;
            }
          }
        }
      }
    }
  }

  // 2. Sequences (abcd, 1234, dcba)
  for (let i = 0; i < n; i++) {
    const c0 = chars[i].codePointAt(0) ?? 0;
    if (i + 2 >= n) continue;
    const c1 = chars[i + 1].codePointAt(0) ?? 0;
    const delta = c1 - c0;
    if (delta !== 1 && delta !== -1) continue;
    const isDigit0 = c0 >= 48 && c0 <= 57;
    const isLower0 = c0 >= 97 && c0 <= 122;
    const isUpper0 = c0 >= 65 && c0 <= 90;
    if (!isDigit0 && !isLower0 && !isUpper0) continue;

    let j = i + 2;
    while (j < n) {
      const prev = chars[j - 1].codePointAt(0) ?? 0;
      const cur = chars[j].codePointAt(0) ?? 0;
      if (cur - prev !== delta) break;
      const sameClass =
        (isDigit0 && cur >= 48 && cur <= 57) ||
        (isLower0 && cur >= 97 && cur <= 122) ||
        (isUpper0 && cur >= 65 && cur <= 90);
      if (!sameClass) break;
      j++;
    }

    const len = j - i;
    if (len >= 3) {
      const token = chars.slice(i, j).join('');
      const firstLower = chars[i].toLowerCase();
      const startSpace =
        firstLower === 'a' || firstLower === 'z' || firstLower === '0' || firstLower === '1' || firstLower === '9'
          ? 4
          : isDigit0
            ? 10
            : 26;
      const dirMult = delta === -1 ? 2 : 1;
      const guesses = startSpace * len * dirMult;
      const log2G = Math.log2(guesses);
      matches.push({
        i,
        j,
        token,
        pattern: 'sequence',
        log2Guesses: log2G,
        guessesDisplay: formatGuesses(log2G),
        reason: `${len} sequential characters ('${token}')`,
      });
    }
  }

  // 3. Repeats ('aaaaaaaa', 'abcabc')
  for (let i = 0; i < n; i++) {
    // Single char repeat
    let j = i + 1;
    while (j < n && chars[j] === chars[i]) j++;
    const len = j - i;
    if (len >= 3) {
      const token = chars.slice(i, j).join('');
      const { poolSize } = computeNaiveEntropy([chars[i]]);
      const guesses = Math.max(10, poolSize) * len;
      const log2G = Math.log2(guesses);
      matches.push({
        i,
        j,
        token,
        pattern: 'repeat',
        log2Guesses: log2G,
        guessesDisplay: formatGuesses(log2G),
        reason: `Repeated character '${chars[i]}' (${len} times)`,
      });
    }
  }
  // Multi-char repeat (e.g. abcabc)
  if (allowMultiRepeat) {
    const repeatUnitCache = new Map<string, number>();
    for (let i = 0; i < n; i++) {
      const maxUnitLen = Math.min(16, Math.floor((n - i) / 2));
      for (let unitLen = 2; unitLen <= maxUnitLen; unitLen++) {
        const unit = chars.slice(i, i + unitLen).join('');
        let reps = 1;
        while (i + (reps + 1) * unitLen <= n) {
          const nextSlice = chars.slice(i + reps * unitLen, i + (reps + 1) * unitLen).join('');
          if (nextSlice !== unit) break;
          reps++;
        }
        if (reps >= 2) {
          const j = i + reps * unitLen;
          const token = chars.slice(i, j).join('');
          let baseLog2 = repeatUnitCache.get(unit);
          if (baseLog2 === undefined) {
            baseLog2 = estimatePasswordStrengthInternal(chars.slice(i, i + unitLen), dict, false).guessesLog2;
            repeatUnitCache.set(unit, baseLog2);
          }
          const log2G = baseLog2 + Math.log2(reps);
          matches.push({
            i,
            j,
            token,
            pattern: 'repeat',
            log2Guesses: log2G,
            guessesDisplay: formatGuesses(log2G),
            reason: `Repeated pattern '${unit}' (${reps} times)`,
          });
        }
      }
    }
  }

  // 4. Keyboard rows (QWERTY & keypad runs >= 4)
  for (const row of KEYBOARD_ROWS) {
    for (let i = 0; i <= n - 4; i++) {
      const lowerSub = chars.slice(i, i + 4).join('').toLowerCase();
      const revRow = row.split('').reverse().join('');
      if (row.includes(lowerSub) || revRow.includes(lowerSub)) {
        let j = i + 4;
        while (j < n) {
          const ext = chars.slice(i, j + 1).join('').toLowerCase();
          if (row.includes(ext) || revRow.includes(ext)) j++;
          else break;
        }
        const token = chars.slice(i, j).join('');
        const guesses = 40 * (j - i);
        const log2G = Math.log2(guesses);
        matches.push({
          i,
          j,
          token,
          pattern: 'keyboard',
          log2Guesses: log2G,
          guessesDisplay: formatGuesses(log2G),
          reason: `Keyboard row pattern ('${token}')`,
        });
      }
    }
  }

  // 5. Years (1900-2099) and Dates
  const joined = chars.join('');
  const yearRegex = /(?:19|20)\d{2}/g;
  let ym: RegExpExecArray | null;
  while ((ym = yearRegex.exec(joined)) !== null) {
    const i = Array.from(joined.slice(0, ym.index)).length;
    const j = i + 4;
    matches.push({
      i,
      j,
      token: ym[0],
      pattern: 'date',
      log2Guesses: Math.log2(200),
      guessesDisplay: '200',
      reason: `'${ym[0]}' looks like a recent year`,
    });
  }

  const dateRegex = /\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}/g;
  let dm: RegExpExecArray | null;
  while ((dm = dateRegex.exec(joined)) !== null) {
    const i = Array.from(joined.slice(0, dm.index)).length;
    const tokenChars = Array.from(dm[0]);
    const j = i + tokenChars.length;
    matches.push({
      i,
      j,
      token: dm[0],
      pattern: 'date',
      log2Guesses: Math.log2(365 * 200),
      guessesDisplay: '73,000',
      reason: `'${dm[0]}' matches a calendar date format`,
    });
  }

  return matches;
}

function getScoreBand(log2Guesses: number): {
  score: 0 | 1 | 2 | 3 | 4;
  bandId: StrengthBandId;
  bandLabel: string;
} {
  if (log2Guesses < 28) return { score: 0, bandId: 'very-weak', bandLabel: 'Very Weak' };
  if (log2Guesses < 36) return { score: 1, bandId: 'weak', bandLabel: 'Weak' };
  if (log2Guesses < 60) return { score: 2, bandId: 'fair', bandLabel: 'Fair' };
  if (log2Guesses < 80) return { score: 3, bandId: 'strong', bandLabel: 'Strong' };
  return { score: 4, bandId: 'very-strong', bandLabel: 'Very Strong' };
}

/**
 * Evaluates a password's strength completely offline.
 */
function estimatePasswordStrengthInternal(
  chars: string[],
  dict?: DictionaryLookup,
  allowMultiRepeat = true
): StrengthResult {
  const n = chars.length;
  const commonPasswordRank = dict ? dict.getCommonRank(chars.join('').toLowerCase()) : null;
  const naive = computeNaiveEntropy(chars);
  const patternMatches = findPatternMatches(chars, dict, allowMultiRepeat);

  // Group pattern matches by end index j for fast DP
  const matchesEndingAt: StrengthMatch[][] = Array.from({ length: n + 1 }, () => []);
  for (const m of patternMatches) {
    matchesEndingAt[m.j].push(m);
  }

  // Precompute brute-force log2(pool^(j-i)) for all 0 <= i < j <= n using bitmasks (zero allocations)
  const bfLog2: Float64Array[] = Array.from({ length: n }, () => new Float64Array(n + 1));
  for (let i = 0; i < n; i++) {
    let hasLower = false;
    let hasUpper = false;
    let hasDigit = false;
    let hasSymbol = false;
    let hasUnicode = false;
    for (let j = i + 1; j <= n; j++) {
      const code = chars[j - 1].codePointAt(0) ?? 0;
      if (code >= 97 && code <= 122) hasLower = true;
      else if (code >= 65 && code <= 90) hasUpper = true;
      else if (code >= 48 && code <= 57) hasDigit = true;
      else if (code >= 32 && code <= 126) hasSymbol = true;
      else hasUnicode = true;

      let pool = 0;
      if (hasLower) pool += 26;
      if (hasUpper) pool += 26;
      if (hasDigit) pool += 10;
      if (hasSymbol) pool += 32;
      if (hasUnicode) pool += 100;
      if (pool === 0) pool = 10;

      bfLog2[i][j] = (j - i) * Math.log2(pool);
    }
  }

  // Flat DP arrays indexed by [pos][m] -> avoid Map/object allocation overhead
  // Keep only reachable m up to min(pos, 16) since >16 segments has huge m! penalty
  const maxM = Math.min(n, 16);
  const dpLog2: Float64Array[] = Array.from({ length: n + 1 }, () => {
    const arr = new Float64Array(maxM + 1);
    arr.fill(Infinity);
    return arr;
  });
  const dpPrevPos: Int16Array[] = Array.from({ length: n + 1 }, () => new Int16Array(maxM + 1).fill(-1));
  const dpMatch: (StrengthMatch | null)[][] = Array.from({ length: n + 1 }, () =>
    new Array<StrengthMatch | null>(maxM + 1).fill(null)
  );

  dpLog2[0][0] = 0;

  for (let j = 1; j <= n; j++) {
    // 1. Pattern matches ending at j
    for (const match of matchesEndingAt[j]) {
      const prevArr = dpLog2[match.i];
      for (let m = 0; m < maxM; m++) {
        const prevCost = prevArr[m];
        if (prevCost === Infinity) continue;
        const candLog2 = prevCost + match.log2Guesses;
        if (candLog2 < dpLog2[j][m + 1]) {
          dpLog2[j][m + 1] = candLog2;
          dpPrevPos[j][m + 1] = match.i;
          dpMatch[j][m + 1] = match;
        }
      }
    }

    // 2. Brute-force transitions ending at j (no object allocation during DP!)
    for (let i = 0; i < j; i++) {
      const prevArr = dpLog2[i];
      const bits = bfLog2[i][j];
      for (let m = 0; m < maxM; m++) {
        const prevCost = prevArr[m];
        if (prevCost === Infinity) continue;
        const candLog2 = prevCost + bits;
        if (candLog2 < dpLog2[j][m + 1]) {
          dpLog2[j][m + 1] = candLog2;
          dpPrevPos[j][m + 1] = i;
          dpMatch[j][m + 1] = null; // null indicates brute-force [i..j]
        }
      }
    }
  }

  let bestM = 1;
  let bestTotalLog2 = Infinity;
  for (let m = 1; m <= maxM; m++) {
    const prod = dpLog2[n][m];
    if (prod === Infinity) continue;
    const total = log2Factorial(m) + prod;
    if (total < bestTotalLog2) {
      bestTotalLog2 = total;
      bestM = m;
    }
  }

  // Reconstruct optimal matches (allocating brute-force StrengthMatch objects only for winning path)
  const chosen: StrengthMatch[] = [];
  let curPos = n;
  let curM = bestM;
  while (curPos > 0 && curM > 0) {
    const prevPos = dpPrevPos[curPos][curM];
    const match = dpMatch[curPos][curM];
    if (match) {
      chosen.push(match);
    } else {
      const segChars = chars.slice(prevPos, curPos);
      const bits = bfLog2[prevPos][curPos];
      chosen.push({
        i: prevPos,
        j: curPos,
        token: segChars.join(''),
        pattern: 'bruteforce',
        log2Guesses: bits,
        guessesDisplay: formatGuesses(bits),
        reason: `Unpatterned characters (${segChars.length} chars)`,
      });
    }
    curPos = prevPos;
    curM--;
  }
  chosen.reverse();

  const band = getScoreBand(bestTotalLog2);
  return {
    analyzedLength: n,
    originalLength: n,
    truncatedTo128: false,
    guessesLog2: bestTotalLog2,
    guessesLog10: bestTotalLog2 * Math.LOG10E * Math.LN2,
    naiveEntropyBits: naive.bits,
    naivePoolSize: naive.poolSize,
    score: band.score,
    bandId: band.bandId,
    bandLabel: band.bandLabel,
    matches: chosen,
    commonPasswordRank,
  };
}

/**
 * Evaluates a password's strength completely offline.
 */
export function estimatePasswordStrength(
  password: string,
  dict?: DictionaryLookup
): StrengthResult {
  if (!password) {
    return {
      analyzedLength: 0,
      originalLength: 0,
      truncatedTo128: false,
      guessesLog2: 0,
      guessesLog10: 0,
      naiveEntropyBits: 0,
      naivePoolSize: 0,
      score: 0,
      bandId: 'very-weak',
      bandLabel: 'Very Weak',
      matches: [],
      commonPasswordRank: null,
    };
  }

  const normalized = password.normalize('NFC');
  const allChars = Array.from(normalized);
  const truncatedTo128 = allChars.length > MAX_ANALYZED_CODEPOINTS;
  const chars = truncatedTo128 ? allChars.slice(0, MAX_ANALYZED_CODEPOINTS) : allChars;
  const res = estimatePasswordStrengthInternal(chars, dict, true);
  return {
    ...res,
    originalLength: allChars.length,
    truncatedTo128,
  };
}
