import { describe, it, expect } from 'vitest';
import {
  isAvailable,
  randomBytes,
  randomInt,
  pick,
  shuffle,
  ByteSource,
  SECURE_RANDOM_UNAVAILABLE_MSG,
} from './secure-random';

/**
 * Deterministic xorshift128+ test-only byte source for statistical uniformity tests
 * (never used in production code).
 */
function createSeededByteSource(seed = 0x9e3779b9): ByteSource {
  let state = seed >>> 0;
  return (len: number) => {
    const out = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      out[i] = (state >>> 0) & 0xff;
    }
    return out;
  };
}

describe('secure-random', () => {
  it('detects Web Crypto availability in Node/Vitest', () => {
    expect(isAvailable()).toBe(true);
  });

  it('fails closed when Web Crypto is missing', () => {
    const originalCrypto = globalThis.crypto;
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      configurable: true,
    });
    try {
      expect(isAvailable()).toBe(false);
      expect(() => randomBytes(16)).toThrow(SECURE_RANDOM_UNAVAILABLE_MSG);
      expect(() => randomInt(94)).toThrow(SECURE_RANDOM_UNAVAILABLE_MSG);
    } finally {
      Object.defineProperty(globalThis, 'crypto', {
        value: originalCrypto,
        configurable: true,
      });
    }
  });

  it('chunks randomBytes calls over 65,536 bytes without throwing', () => {
    const bytes = randomBytes(150000);
    expect(bytes.length).toBe(150000);
    // Ensure non-zero distribution
    let nonZero = 0;
    for (let i = 0; i < 100; i++) {
      if (bytes[i] !== 0) nonZero++;
    }
    expect(nonZero).toBeGreaterThan(50);
  });

  it('exercises rejection sampling path when Uint32 >= limit', () => {
    // For maxExclusive = 94, limit = floor(2^32 / 94) * 94 = 4294967254 = 0xFFFFFFD6
    // First 4 bytes = 0xFFFFFFFF (rejected), next 4 bytes = 0x00000005 (accepted -> 5 % 94 = 5)
    let callCount = 0;
    const mockSource: ByteSource = () => {
      callCount++;
      if (callCount === 1) {
        return new Uint8Array([0xff, 0xff, 0xff, 0xff]);
      }
      return new Uint8Array([0x00, 0x00, 0x00, 0x05]);
    };

    const result = randomInt(94, mockSource);
    expect(result).toBe(5);
    expect(callCount).toBe(2);
  });

  it('passes chi-square uniformity on 10^6 draws for n = 94 and n = 10 (seeded byte source)', () => {
    const source = createSeededByteSource(123456789);
    const draws = 1_000_000;

    // Test n = 10 (df = 9, critical value p=0.001 is 27.877; allow generous margin < 35)
    const counts10 = new Array(10).fill(0);
    for (let i = 0; i < draws; i++) {
      counts10[randomInt(10, source)]++;
    }
    const expected10 = draws / 10;
    let chi2_10 = 0;
    for (let i = 0; i < 10; i++) {
      chi2_10 += ((counts10[i] - expected10) ** 2) / expected10;
    }
    expect(chi2_10).toBeLessThan(35);

    // Test n = 94 (df = 93, critical value p=0.001 is ~141; allow < 160)
    const counts94 = new Array(94).fill(0);
    for (let i = 0; i < draws; i++) {
      counts94[randomInt(94, source)]++;
    }
    const expected94 = draws / 94;
    let chi2_94 = 0;
    for (let i = 0; i < 94; i++) {
      chi2_94 += ((counts94[i] - expected94) ** 2) / expected94;
    }
    expect(chi2_94).toBeLessThan(160);
  });

  it('runs one real Web Crypto randomInt and shuffle smoke check', () => {
    const val = randomInt(94);
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThan(94);

    const arr = [1, 2, 3, 4, 5, 6];
    const shuffled = shuffle(arr);
    expect(shuffled).toHaveLength(6);
    expect(shuffled.slice().sort((a, b) => a - b)).toEqual(arr);
    expect(pick(arr)).toBeGreaterThanOrEqual(1);
  });
});
