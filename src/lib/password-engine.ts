import { ByteSource, randomInt, webCryptoByteSource } from './secure-random';

export const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
export const DIGIT_CHARS = '0123456789';
export const DEFAULT_SYMBOL_CHARS = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
export const HEX_CHARS = '0123456789abcdef';
export const LOOK_ALIKE_CHARS = new Set(['O', '0', 'I', 'l', '1']);

export const MIN_PASSWORD_LENGTH = 4;
export const MAX_PASSWORD_LENGTH = 128;
export const MIN_PIN_LENGTH = 4;
export const MAX_PIN_LENGTH = 12;
export const MIN_WIFI_LENGTH = 8;
export const MAX_WIFI_LENGTH = 63;
export const MIN_BULK_COUNT = 1;
export const MAX_BULK_COUNT = 50;
export const MAX_REJECTION_TRIES = 100_000;

export interface PasswordOptions {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  customSymbols?: string;
  excludeLookAlikes: boolean;
  requireEach: boolean;
  hexOnly?: boolean;
}

export interface ResolvedPool {
  sets: string[]; // non-overlapping character sets
  pool: string; // union of all sets
}

export interface PasswordResult {
  password: string;
  poolSize: number;
  entropyBits: number;
  combinations: bigint;
}

export type PasswordPresetId = 'strong' | 'nist' | 'pin' | 'wifi' | 'hex' | 'alphanumeric';

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 16,
  upper: true,
  lower: true,
  digits: true,
  symbols: true,
  customSymbols: DEFAULT_SYMBOL_CHARS,
  excludeLookAlikes: false,
  requireEach: true,
};

/**
 * Resolves non-overlapping character sets and combined pool for the given options.
 * Throws a descriptive Error on invalid configuration (empty set, pool < 2, length < sets).
 */
export function resolvePasswordPool(opts: PasswordOptions): ResolvedPool {
  if (!Number.isInteger(opts.length) || opts.length < MIN_PASSWORD_LENGTH || opts.length > MAX_PASSWORD_LENGTH) {
    throw new RangeError(`Length must be an integer between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}`);
  }

  if (opts.hexOnly) {
    return {
      sets: [HEX_CHARS],
      pool: HEX_CHARS,
    };
  }

  const filterLookAlikes = (chars: string): string => {
    if (!opts.excludeLookAlikes) return chars;
    return Array.from(chars)
      .filter((c) => !LOOK_ALIKE_CHARS.has(c))
      .join('');
  };

  const sets: string[] = [];
  const used = new Set<string>();

  const addSet = (raw: string) => {
    const filtered = Array.from(filterLookAlikes(raw)).filter((ch) => {
      if (used.has(ch)) return false;
      used.add(ch);
      return true;
    });
    sets.push(filtered.join(''));
  };

  if (opts.upper) addSet(UPPERCASE_CHARS);
  if (opts.lower) addSet(LOWERCASE_CHARS);
  if (opts.digits) addSet(DIGIT_CHARS);

  if (opts.symbols) {
    const rawSym = opts.customSymbols !== undefined ? opts.customSymbols : DEFAULT_SYMBOL_CHARS;
    // Printable non-space ASCII only: anything else (emoji, accents) could be split or rejected by sites
    const filteredSym = Array.from(filterLookAlikes(rawSym)).filter((ch) => {
      if (ch < '!' || ch > '~' || ch.length !== 1 || used.has(ch)) return false;
      used.add(ch);
      return true;
    });
    if (filteredSym.length === 0) {
      throw new Error(
        'Selected symbol set is empty after removing duplicates, look-alikes, and characters already in other active sets.'
      );
    }
    sets.push(filteredSym.join(''));
  }

  if (sets.length === 0) {
    throw new Error('Select at least one character set.');
  }

  const pool = sets.join('');
  if (pool.length < 2) {
    throw new Error('Character pool must contain at least 2 distinct characters.');
  }

  if (opts.requireEach && opts.length < sets.length) {
    throw new Error(
      `Password length (${opts.length}) must be at least the number of required character sets (${sets.length}).`
    );
  }

  return { sets, pool };
}

function bigIntPow(base: bigint, exp: number): bigint {
  let result = BigInt('1');
  let b = base;
  let e = exp;
  while (e > 0) {
    if (e % 2 === 1) result *= b;
    b *= b;
    e = Math.floor(e / 2);
  }
  return result;
}

/**
 * Computes exact log2(n) for arbitrarily large positive BigInt without Infinity overflow.
 */
export function bigIntLog2(n: bigint): number {
  if (n <= BigInt('0')) return 0;
  const bin = n.toString(2);
  const bitLen = bin.length;
  if (bitLen <= 53) {
    return Math.log2(Number(n));
  }
  const top53 = parseInt(bin.slice(0, 53), 2);
  return bitLen - 53 + Math.log2(top53);
}

/**
 * Exact combination count using inclusion-exclusion when requireEach is true.
 * Sets are guaranteed non-overlapping by `resolvePasswordPool`.
 */
export function countCombinations(opts: PasswordOptions): bigint {
  const { sets, pool } = resolvePasswordPool(opts);
  const L = opts.length;
  const N = pool.length;

  if (!opts.requireEach || sets.length <= 1) {
    return bigIntPow(BigInt(N), L);
  }

  const k = sets.length;
  const totalMasks = 1 << k;
  let total = BigInt('0');

  for (let mask = 0; mask < totalMasks; mask++) {
    let excludedSize = 0;
    let bitsSet = 0;
    for (let i = 0; i < k; i++) {
      if ((mask & (1 << i)) !== 0) {
        excludedSize += sets[i].length;
        bitsSet++;
      }
    }
    const remaining = N - excludedSize;
    if (remaining <= 0) continue;
    const term = bigIntPow(BigInt(remaining), L);
    if (bitsSet % 2 === 0) {
      total += term;
    } else {
      total -= term;
    }
  }

  return total;
}

/**
 * Exact entropy in bits for the given password options.
 */
export function entropyBits(opts: PasswordOptions): number {
  const combos = countCombinations(opts);
  return bigIntLog2(combos);
}

/**
 * Generates one cryptographically random password satisfying `opts`.
 * When `requireEach` is true, draws the entire password uniformly from `pool`
 * and redraws until every active set is represented (unbiased acceptance-rejection).
 */
export function generatePassword(
  opts: PasswordOptions,
  source: ByteSource = webCryptoByteSource
): PasswordResult {
  const { sets, pool } = resolvePasswordPool(opts);
  const L = opts.length;
  const N = pool.length;

  const setLookups = sets.map((s) => new Set(Array.from(s)));

  let password = '';
  if (!opts.requireEach || sets.length <= 1) {
    const chars: string[] = new Array(L);
    for (let i = 0; i < L; i++) {
      chars[i] = pool[randomInt(N, source)];
    }
    password = chars.join('');
  } else {
    let accepted = false;
    for (let attempt = 0; attempt < MAX_REJECTION_TRIES; attempt++) {
      const chars: string[] = new Array(L);
      const seenSets = new Array(sets.length).fill(false);
      let seenCount = 0;

      for (let i = 0; i < L; i++) {
        const ch = pool[randomInt(N, source)];
        chars[i] = ch;
        for (let sIdx = 0; sIdx < sets.length; sIdx++) {
          if (!seenSets[sIdx] && setLookups[sIdx].has(ch)) {
            seenSets[sIdx] = true;
            seenCount++;
          }
        }
      }

      if (seenCount === sets.length) {
        password = chars.join('');
        accepted = true;
        break;
      }
    }

    if (!accepted) {
      throw new Error(
        `Could not satisfy all ${sets.length} required character sets at length ${L} within ${MAX_REJECTION_TRIES.toLocaleString('en-US')} attempts.`
      );
    }
  }

  const combos = countCombinations(opts);
  return {
    password,
    poolSize: N,
    entropyBits: bigIntLog2(combos),
    combinations: combos,
  };
}

/**
 * Generates a bulk list of `count` (1..50) passwords with the given options.
 */
export function generateBulkPasswords(
  opts: PasswordOptions,
  count: number,
  source: ByteSource = webCryptoByteSource
): PasswordResult[] {
  if (!Number.isInteger(count) || count < MIN_BULK_COUNT || count > MAX_BULK_COUNT) {
    throw new RangeError(`Bulk count must be an integer between ${MIN_BULK_COUNT} and ${MAX_BULK_COUNT}`);
  }
  const results: PasswordResult[] = [];
  for (let i = 0; i < count; i++) {
    results.push(generatePassword(opts, source));
  }
  return results;
}

/**
 * Generates a numeric PIN of length 4..12.
 */
export function generatePin(length: number, source: ByteSource = webCryptoByteSource): PasswordResult {
  if (!Number.isInteger(length) || length < MIN_PIN_LENGTH || length > MAX_PIN_LENGTH) {
    throw new RangeError(`PIN length must be between ${MIN_PIN_LENGTH} and ${MAX_PIN_LENGTH}`);
  }
  return generatePassword(
    {
      length,
      upper: false,
      lower: false,
      digits: true,
      symbols: false,
      excludeLookAlikes: false,
      requireEach: false,
    },
    source
  );
}

/**
 * Generates a Wi-Fi (WPA2) password of length 8..63.
 */
export function generateWifiPassword(
  length = 20,
  includeSymbols = false,
  excludeLookAlikes = true,
  source: ByteSource = webCryptoByteSource
): PasswordResult {
  if (!Number.isInteger(length) || length < MIN_WIFI_LENGTH || length > MAX_WIFI_LENGTH) {
    throw new RangeError(`Wi-Fi password length must be between ${MIN_WIFI_LENGTH} and ${MAX_WIFI_LENGTH}`);
  }
  return generatePassword(
    {
      length,
      upper: true,
      lower: true,
      digits: true,
      symbols: includeSymbols,
      excludeLookAlikes,
      requireEach: true,
    },
    source
  );
}

export function getPresetOptions(preset: PasswordPresetId): PasswordOptions {
  switch (preset) {
    case 'strong':
      return { ...DEFAULT_PASSWORD_OPTIONS };
    case 'nist':
      return { ...DEFAULT_PASSWORD_OPTIONS, length: 15 };
    case 'pin':
      return {
        length: 6,
        upper: false,
        lower: false,
        digits: true,
        symbols: false,
        excludeLookAlikes: false,
        requireEach: false,
      };
    case 'wifi':
      return {
        length: 20,
        upper: true,
        lower: true,
        digits: true,
        symbols: false,
        excludeLookAlikes: true,
        requireEach: true,
      };
    case 'hex':
      return {
        length: 32,
        upper: false,
        lower: false,
        digits: false,
        symbols: false,
        excludeLookAlikes: false,
        requireEach: false,
        hexOnly: true,
      };
    case 'alphanumeric':
      return {
        length: 16,
        upper: true,
        lower: true,
        digits: true,
        symbols: false,
        excludeLookAlikes: false,
        requireEach: true,
      };
  }
}
