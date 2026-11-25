import { describe, it, expect } from 'vitest';
import {
  applyLeet,
  deLeet,
  generateHackerNames,
  isHackerNameUnsafe,
  DEFAULT_HACKER_OPTIONS,
} from './hacker-name-engine';

describe('hacker-name-engine', () => {
  it('applies light, heavy, and none leet mappings preserving uppercase G', () => {
    expect(applyLeet('ghost', 'heavy')).toBe('gh057');
    expect(applyLeet('ghost', 'light')).toBe('gh0st');
    expect(applyLeet('Ghost', 'heavy')).toBe('Gh057');
    expect(applyLeet('phantom', 'heavy')).toBe('ph4n70m');
    expect(applyLeet('cipher', 'none')).toBe('cipher');
  });

  it('catches de-leeted and symbol-obfuscated profanity as well as real aliases/brands (§3.14)', () => {
    expect(isHackerNameUnsafe('sh1t')).toBe(true);
    expect(isHackerNameUnsafe('5h!t')).toBe(true);
    expect(isHackerNameUnsafe('sh!t')).toBe(true);
    expect(isHackerNameUnsafe('mitnick')).toBe(true);
    expect(isHackerNameUnsafe('0xSnowden')).toBe(true);
    expect(isHackerNameUnsafe('gh057_vector')).toBe(false);
  });

  it('ignores offensive seed word with warning', () => {
    const res = generateHackerNames({
      ...DEFAULT_HACKER_OPTIONS,
      seedWord: 'shit99',
      rngSeed: 12345,
    });
    expect(res.seedWarning).toBeTruthy();
    expect(res.names.length).toBeGreaterThan(0);
  });

  it('produces identical deterministic output for fixed RNG seed 12345', () => {
    const r1 = generateHackerNames({
      ...DEFAULT_HACKER_OPTIONS,
      style: 'gamerTag',
      seedWord: 'ghost',
      count: 5,
      rngSeed: 12345,
    });
    const r2 = generateHackerNames({
      ...DEFAULT_HACKER_OPTIONS,
      style: 'gamerTag',
      seedWord: 'ghost',
      count: 5,
      rngSeed: 12345,
    });
    expect(r1.names).toEqual(r2.names);
    expect(r1.names).toHaveLength(5);
    expect(deLeet(r1.names[0].name.toLowerCase())).toContain('ghost');
  });

  it('enforces length, underscore, and space rules and emits zero offensive hits across 1,000 generated batches (10,000 names)', () => {
    for (let i = 0; i < 1000; i++) {
      const batch = generateHackerNames({
        ...DEFAULT_HACKER_OPTIONS,
        count: 10,
        minLength: 4,
        maxLength: 16,
        allowSpaces: false,
        allowUnderscore: false,
        rngSeed: 1000 + i,
      });
      for (const item of batch.names) {
        expect(item.name.length).toBeGreaterThanOrEqual(4);
        expect(item.name.length).toBeLessThanOrEqual(16);
        expect(item.name).not.toMatch(/[\s_]/);
        expect(isHackerNameUnsafe(item.name)).toBe(false);
      }
    }
  });
});
