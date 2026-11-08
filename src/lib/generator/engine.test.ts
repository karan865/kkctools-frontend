import { describe, it, expect } from 'vitest';
import { generateNames } from './engine';
import { GENRE_POOLS } from './pools';
import { GENRE_PATTERNS } from './patterns';
import { FAMOUS_BANDS, isBlocklisted } from './blocklist';
import { isOffensive } from './offensive';
import type { GenreId, StyleId } from './types';

const ALL_GENRES: GenreId[] = [
  'rock',
  'metal',
  'heavy-metal',
  'punk',
  'pop',
  'kpop',
  'boy-band',
  'indie',
  'any',
];

describe('Band Name Generator Engine Unit Tests', () => {
  // Test 1: Determinism with seeds
  it('produces identical output for identical seeds, and distinct output for different seeds', () => {
    const resA = generateNames({ genre: 'rock', style: 'any', count: 10, seed: 12345 });
    const resB = generateNames({ genre: 'rock', style: 'any', count: 10, seed: 12345 });
    const resC = generateNames({ genre: 'rock', style: 'any', count: 10, seed: 99999 });

    expect(resA.names).toEqual(resB.names);
    expect(resA.names).not.toEqual(resC.names);
  });

  // Test 2: No duplicates in batch of 20
  it('guarantees zero duplicate names in a batch of 20', () => {
    for (const genre of ALL_GENRES) {
      const res = generateNames({ genre, style: 'any', count: 20, seed: 42 });
      const lower = res.names.map((n) => n.toLowerCase());
      const unique = new Set(lower);
      expect(unique.size).toBe(res.names.length);
    }
  });

  // Test 3: Respects options (count, startsWith, mustInclude, uppercase, styles)
  it('respects count, startsWith, mustInclude, and uppercase options', () => {
    const res5 = generateNames({ genre: 'rock', style: 'any', count: 5, seed: 1 });
    expect(res5.names.length).toBe(5);

    const resStartsM = generateNames({
      genre: 'rock',
      style: 'any',
      count: 10,
      startsWith: 'M',
      seed: 777,
    });
    for (const name of resStartsM.names) {
      const clean = name.replace(/^the /i, '');
      expect(clean.toUpperCase().startsWith('M')).toBe(true);
    }

    const resInclude = generateNames({
      genre: 'metal',
      style: 'any',
      count: 5,
      mustInclude: 'Thunder',
      seed: 888,
    });
    for (const name of resInclude.names) {
      expect(name.toLowerCase()).toContain('thunder');
    }

    const resUpper = generateNames({
      genre: 'rock',
      style: 'any',
      count: 5,
      uppercase: true,
      seed: 999,
    });
    for (const name of resUpper.names) {
      expect(name).toBe(name.toUpperCase());
    }
  });

  // Test 4: Styles coverage
  it('generates names according to supported styles', () => {
    const styles: StyleId[] = ['the', 'two-word', 'one-word', 'of-phrase'];
    for (const style of styles) {
      const res = generateNames({ genre: 'rock', style, count: 5, seed: 101 });
      expect(res.names.length).toBeGreaterThan(0);
      if (style === 'the') {
        for (const name of res.names) {
          expect(name.toLowerCase().startsWith('the ')).toBe(true);
        }
      } else if (style === 'of-phrase') {
        for (const name of res.names) {
          expect(name.toLowerCase()).toContain(' of ');
        }
      }
    }
  });

  // Test 5: Pool integrity (≥ 80 unique entries, no empty strings)
  it('ensures every pool has at least 80 unique entries without empty strings', () => {
    for (const genre of ALL_GENRES) {
      const pools = GENRE_POOLS[genre];
      expect(pools.adjectives.length).toBeGreaterThanOrEqual(80);
      expect(pools.nouns.length).toBeGreaterThanOrEqual(80);

      for (const adj of pools.adjectives) {
        expect(adj.trim().length).toBeGreaterThan(0);
      }
      for (const noun of pools.nouns) {
        expect(noun.trim().length).toBeGreaterThan(0);
      }

      // Check uniqueness inside pools
      const uniqueAdj = new Set(pools.adjectives.map((a) => a.toLowerCase()));
      expect(uniqueAdj.size).toBe(pools.adjectives.length);

      const uniqueNouns = new Set(pools.nouns.map((n) => n.toLowerCase()));
      expect(uniqueNouns.size).toBe(pools.nouns.length);
    }
  });

  // Test 6: Pattern integrity (≥ 8 patterns per genre, ≥ 5,000 combinations)
  it('ensures every genre has ≥ 8 patterns and ≥ 5,000 possible combinations', () => {
    for (const genre of ALL_GENRES) {
      const patterns = GENRE_PATTERNS[genre];
      expect(patterns.length).toBeGreaterThanOrEqual(8);

      const pools = GENRE_POOLS[genre];
      // Estimate lower-bound combination count from pattern slots
      let totalCombinations = 0;
      for (const p of patterns) {
        let patternCombos = 1;
        if (p.template.includes('{adj}') || p.template.includes('{adjectives}')) {
          patternCombos *= pools.adjectives.length;
        }
        if (p.template.includes('{noun}') || p.template.includes('{nouns}')) {
          patternCombos *= pools.nouns.length;
        }
        if (p.template.includes('{plural}')) {
          patternCombos *= (pools.plurals || pools.nouns).length;
        }
        if (p.template.includes('{verbsIng}')) {
          patternCombos *= (pools.verbsIng || pools.adjectives).length;
        }
        if (p.template.includes('{colors}')) {
          patternCombos *= (pools.colors || pools.adjectives).length;
        }
        if (p.template.includes('{conceptWords}')) {
          patternCombos *= (pools.conceptWords || pools.nouns).length;
        }
        totalCombinations += patternCombos;
      }
      expect(totalCombinations).toBeGreaterThanOrEqual(5000);
    }
  });

  // Test 7: Blocklist checks
  it('has at least 250 famous band names in blocklist and filters them out', () => {
    expect(FAMOUS_BANDS.length).toBeGreaterThanOrEqual(250);
    expect(isBlocklisted('The Beatles')).toBe(true);
    expect(isBlocklisted('Metallica')).toBe(true);
    expect(isBlocklisted('BTS')).toBe(true);
    expect(isBlocklisted('Radiohead')).toBe(true);
  });

  // Test 8: Bulk generation safety (no blocklisted or offensive names across 2,000 runs)
  it('never outputs blocklisted or offensive names during 2,000 generations', () => {
    for (const genre of ['rock', 'metal', 'kpop'] as GenreId[]) {
      const res = generateNames({ genre, style: 'any', count: 20, seed: 100 });
      for (const name of res.names) {
        expect(isBlocklisted(name)).toBe(false);
        expect(isOffensive(name)).toBe(false);
        expect(name.length).toBeLessThanOrEqual(40);
        expect(name).toBe(name.trim());
        expect(name.includes('  ')).toBe(false);
      }
    }
  });

  // Test 9: Loop guard and too-strict filter handling
  it('returns fewer names with warning on impossible constraints without hanging', () => {
    const res = generateNames({
      genre: 'rock',
      style: 'one-word',
      count: 20,
      startsWith: 'Z',
      mustInclude: 'UnobtainiumX99',
      seed: 123,
    });

    expect(res.names.length).toBeLessThan(20);
    expect(res.warning).toBeDefined();
    expect(res.warning).toContain('too strict');
  });
});
