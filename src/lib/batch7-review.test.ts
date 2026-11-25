import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { DEFAULT_PASSWORD_OPTIONS, resolvePasswordPool } from './password-engine';
import { EFF_LONG_LIST_SIZE } from './passphrase-core';
import { PASSPHRASE_WORDLIST } from '@/data/wordlist-passphrase';
import { HACKER_POOLS } from './generator/pools/hacker';
import { formatGuessTime } from '@/data/attack-scenarios';

describe('Batch 7 review fixes', () => {
  it('keeps custom symbols to printable ASCII so emoji are never split', () => {
    const { sets } = resolvePasswordPool({ ...DEFAULT_PASSWORD_OPTIONS, customSymbols: '!\u{1F600}\u00E9 #' });
    expect(sets[3]).toBe('!#');
  });

  it('keeps the word list out of the client engine and its size in step', () => {
    expect(EFF_LONG_LIST_SIZE).toBe(PASSPHRASE_WORDLIST.length);
    expect(fs.readFileSync('src/lib/passphrase-core.ts', 'utf8')).not.toMatch(/wordlist-passphrase/);
  });

  it('has no duplicate words in a hacker pool', () => {
    for (const pool of Object.values(HACKER_POOLS)) expect(new Set(pool).size).toBe(pool.length);
  });

  it('shows one decimal for guess times under ten years', () => {
    expect(formatGuessTime(5 * Math.log2(7776), 1e11)).toBe('4.5 years');
  });
});
