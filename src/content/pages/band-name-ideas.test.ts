import { describe, expect, it } from 'vitest';
import { BAND_NAME_IDEAS } from './band-name-ideas';
import { isBlocklisted } from '@/lib/generator/blocklist';
import { isOffensive } from '@/lib/generator/offensive';

describe('band name ideas on the generator page', () => {
  it('has 10 names for each of the 8 genres, no duplicates', () => {
    expect(BAND_NAME_IDEAS).toHaveLength(8);
    const all = BAND_NAME_IDEAS.flatMap((g) => g.names.map((n) => n.toLowerCase()));
    for (const g of BAND_NAME_IDEAS) expect(g.names).toHaveLength(10);
    expect(new Set(all).size).toBe(all.length);
  });
  it('contains no famous band names and nothing offensive', () => {
    for (const g of BAND_NAME_IDEAS)
      for (const n of g.names) {
        expect(isBlocklisted(n)).toBe(false);
        expect(isOffensive(n)).toBe(false);
        expect(n).not.toMatch(/[{}]/);
      }
  });
});
