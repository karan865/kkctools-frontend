import { describe, it, expect } from 'vitest';
import { estimatePasswordStrength, DictionaryLookup } from './strength-engine';
import { getCommonPasswordRank } from '@/data/common-passwords';
import { PASSPHRASE_WORDLIST } from '@/data/wordlist-passphrase';

const effWordSet = new Set(PASSPHRASE_WORDLIST);

const fullDict: DictionaryLookup = {
  getCommonRank: getCommonPasswordRank,
  hasWord: (w) => effWordSet.has(w),
  wordListSize: PASSPHRASE_WORDLIST.length,
};

describe('strength-engine', () => {
  it('matches §3.4 real ranks in common-passwords.ts', () => {
    expect(getCommonPasswordRank('password')).toBe(1);
    expect(getCommonPasswordRank('123456')).toBe(2);
    expect(getCommonPasswordRank('qwerty')).toBe(5);
    expect(getCommonPasswordRank('summer')).toBe(78);
    expect(getCommonPasswordRank('abcd1234')).toBe(747);
    expect(getCommonPasswordRank('aaaaaaaa')).toBe(807);
  });

  it('matches all worked examples in spec & §3.4', () => {
    // 123456: rank 2 in common list -> 2 guesses, 1 bit (<= 24)
    const r123 = estimatePasswordStrength('123456', fullDict);
    expect(r123.commonPasswordRank).toBe(2);
    expect(Math.pow(2, r123.guessesLog2)).toBeCloseTo(2, 5);
    expect(r123.naiveEntropyBits).toBeCloseTo(19.93, 2);

    // aaaaaaaa: repeat of 'a' (26 * 8 = 208 guesses, 7.70 bits), lower than rank 807
    const rAaa = estimatePasswordStrength('aaaaaaaa', fullDict);
    expect(Math.pow(2, rAaa.guessesLog2)).toBeCloseTo(208, 4);
    expect(rAaa.guessesLog2).toBeCloseTo(7.7, 2);
    expect(rAaa.naiveEntropyBits).toBeCloseTo(37.6, 2);

    // abcd1234: 'abcd' (seq 16) + '1234' (common rank #4 in SecLists; 16 as seq)
    // With SecLists rank #4 for '1234': 2! * 16 * 4 = 128 guesses (7.00 bits), lower than rank 747
    const rAbcd = estimatePasswordStrength('abcd1234', fullDict);
    expect(Math.pow(2, rAbcd.guessesLog2)).toBeCloseTo(128, 4);
    expect(rAbcd.guessesLog2).toBeCloseTo(7.0, 2);
    expect(rAbcd.naiveEntropyBits).toBeCloseTo(41.36, 2);

    // P@ssw0rd: rank 1 ('password') * 2 (capital) * 2^2 (two swap kinds @ and 0) = 8 guesses, 3.00 bits
    const rPass = estimatePasswordStrength('P@ssw0rd', fullDict);
    expect(Math.pow(2, rPass.guessesLog2)).toBeCloseTo(8, 4);
    expect(rPass.guessesLog2).toBeCloseTo(3.0, 4);
    expect(rPass.naiveEntropyBits).toBeCloseTo(52.44, 2);

    // Summer2026!: 'Summer' (rank 78 * 2 = 156) + '2026' (200) + '!' (bruteforce 32)
    // m = 3 -> 3! * 156 * 200 * 32 = 5,990,400 guesses (~22.51 bits)
    const rSummer = estimatePasswordStrength('Summer2026!', fullDict);
    expect(rSummer.matches.length).toBe(3);
    expect(rSummer.guessesLog2).toBeCloseTo(Math.log2(6 * 156 * 200 * 32), 2);
  });

  it('handles keyboard runs, repeated multi-char patterns, and Unicode NFC', () => {
    const rKbd = estimatePasswordStrength('qwertyui', fullDict);
    expect(rKbd.matches.some((m) => m.pattern === 'keyboard')).toBe(true);

    const rRep = estimatePasswordStrength('abcabcabc', fullDict);
    expect(rRep.matches.some((m) => m.pattern === 'repeat')).toBe(true);

    // Unicode NFC normalization and truncation over 128 code points
    const longPw = 'aB9!'.repeat(40); // 160 chars
    const rLong = estimatePasswordStrength(longPw, fullDict);
    expect(rLong.originalLength).toBe(160);
    expect(rLong.analyzedLength).toBe(128);
    expect(rLong.truncatedTo128).toBe(true);
  });

  it('runs 64-character estimation in under 16ms (typing latency requirement)', () => {
    const pw64 = 'Tr0ub4dor&3CorrectHorseBatteryStaple99!@#XyZ1234567890AbCdEfGhIj';
    const start = performance.now();
    const res = estimatePasswordStrength(pw64, fullDict);
    const elapsed = performance.now() - start;
    expect(res.analyzedLength).toBe(64);
    expect(elapsed).toBeLessThan(16);
  });
});
