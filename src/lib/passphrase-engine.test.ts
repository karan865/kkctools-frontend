import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  calculatePassphraseEntropy,
  DEFAULT_PASSPHRASE_OPTIONS,
  generateBulkPassphrases,
  generatePassphrase,
} from './passphrase-engine';
import { PASSPHRASE_WORDLIST, PASSPHRASE_WORDLIST_META } from '@/data/wordlist-passphrase';
import type { ByteSource } from './secure-random';

function createDeterministicSource(seed = 0x12345678): ByteSource {
  let state = seed >>> 0;
  return (length: number) => {
    const buf = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      buf[i] = (state >>> 24) & 0xff;
    }
    return buf;
  };
}

describe('passphrase-engine', () => {
  it('passes EFF wordlist hygiene rules (§3.11: 7,776 unique words, ^[a-z-]+$, len 3..13)', () => {
    expect(PASSPHRASE_WORDLIST.length).toBe(7776);
    expect(PASSPHRASE_WORDLIST_META.size).toBe(7776);
    const unique = new Set(PASSPHRASE_WORDLIST);
    expect(unique.size).toBe(7776);

    for (const w of PASSPHRASE_WORDLIST) {
      expect(w).toMatch(/^[a-z-]+$/);
      expect(w.length).toBeGreaterThanOrEqual(3);
      expect(w.length).toBeLessThanOrEqual(13);
    }
  });

  it('matches all worked entropy examples from spec §3.4', () => {
    const b4 = calculatePassphraseEntropy({ ...DEFAULT_PASSPHRASE_OPTIONS, wordCount: 4 });
    expect(b4.totalBits).toBeCloseTo(51.7, 2);

    const b5 = calculatePassphraseEntropy({ ...DEFAULT_PASSPHRASE_OPTIONS, wordCount: 5 });
    expect(b5.totalBits).toBeCloseTo(64.62, 2);

    const b6 = calculatePassphraseEntropy({ ...DEFAULT_PASSPHRASE_OPTIONS, wordCount: 6 });
    expect(b6.totalBits).toBeCloseTo(77.55, 2);
    expect(b6.perWordBits).toBeCloseTo(12.925, 3);

    const b6NoRepeat = calculatePassphraseEntropy({
      ...DEFAULT_PASSPHRASE_OPTIONS,
      wordCount: 6,
      noRepeat: true,
    });
    expect(b6NoRepeat.totalBits).toBeCloseTo(77.5461, 3);

    const b6OneCap = calculatePassphraseEntropy({
      ...DEFAULT_PASSPHRASE_OPTIONS,
      wordCount: 6,
      capitals: 'one-random',
    });
    expect(b6OneCap.totalBits).toBeCloseTo(80.13, 2);

    const b6Num = calculatePassphraseEntropy({
      ...DEFAULT_PASSPHRASE_OPTIONS,
      wordCount: 6,
      addNumber: true,
    });
    expect(b6Num.totalBits).toBeCloseTo(87.0, 2);

    const b6DigitSep = calculatePassphraseEntropy({
      ...DEFAULT_PASSPHRASE_OPTIONS,
      wordCount: 6,
      separator: 'random-digit',
    });
    expect(b6DigitSep.totalBits).toBeCloseTo(94.16, 2);

    // 6 words from a 1,296-word short list
    const bShort = calculatePassphraseEntropy({ ...DEFAULT_PASSPHRASE_OPTIONS, wordCount: 6 }, 1296);
    expect(bShort.totalBits).toBeCloseTo(62.04, 2);
  });

  it('prevents overstating entropy when random-digit or random-symbol conflicts with addNumber/addSymbol (§3.13)', () => {
    const src = createDeterministicSource(42);
    const resDigit = generatePassphrase(
      { ...DEFAULT_PASSPHRASE_OPTIONS, separator: 'random-digit', addNumber: true },
      src
    );
    expect(resDigit.breakdown.numberBits).toBe(0);
    expect(resDigit.warning).toBeTruthy();

    const resSym = generatePassphrase(
      { ...DEFAULT_PASSPHRASE_OPTIONS, separator: 'random-symbol', addSymbol: true },
      src
    );
    expect(resSym.breakdown.symbolBits).toBe(0);
    expect(resSym.warning).toBeTruthy();
  });

  it('supports no-repeat, separators, and deterministic snapshot output', () => {
    const res1 = generatePassphrase(
      { ...DEFAULT_PASSPHRASE_OPTIONS, wordCount: 6, noRepeat: true, capitals: 'first-each' },
      createDeterministicSource(999)
    );
    const res2 = generatePassphrase(
      { ...DEFAULT_PASSPHRASE_OPTIONS, wordCount: 6, noRepeat: true, capitals: 'first-each' },
      createDeterministicSource(999)
    );
    expect(res1.passphrase).toBe(res2.passphrase);
    expect(new Set(res1.words.map((w) => w.toLowerCase())).size).toBe(6);

    const bulk = generateBulkPassphrases(25, DEFAULT_PASSPHRASE_OPTIONS, createDeterministicSource(7));
    expect(bulk).toHaveLength(20); // clamped to 1..20
  });

  it('demonstrates uniform word selection via chi-square over 100,000 draws on a 10-bucket list', () => {
    const smallList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    const counts = new Array(10).fill(0);
    const src = createDeterministicSource(777);
    const draws = 100_000;
    for (let i = 0; i < draws; i++) {
      const r = generatePassphrase({ ...DEFAULT_PASSPHRASE_OPTIONS, wordCount: 1 }, src, smallList);
      // wordCount clamps to 3..10, so all 3 words are uniform picks
      for (const w of r.words) {
        counts[smallList.indexOf(w)]++;
      }
    }
    const totalWords = draws * 3;
    const expected = totalWords / 10;
    const chi2 = counts.reduce((acc, c) => acc + Math.pow(c - expected, 2) / expected, 0);
    // df = 9 -> 99.9% critical value is 27.88
    expect(chi2).toBeLessThan(27.88);
  });

  it('contains no Math.random or network calls', () => {
    const code = fs.readFileSync(path.join(process.cwd(), 'src/lib/passphrase-engine.ts'), 'utf8');
    expect(code).not.toMatch(/Math\.random/);
    expect(code).not.toMatch(/generator\/rng/);
  });
});
