import { describe, it, expect } from 'vitest';
import {
  SQFT_PER_ACRE,
  SQFT_PER_M2,
  MOWERS,
  acresPerHour,
  autoMowerId,
  calculateLawn,
  defaultInput,
  frequencyById,
  mowerById,
  patchesArea,
  priceRange,
  visitsPerSeason,
} from './lawn-mowing-engine';

describe('units', () => {
  it('uses exact acre and m² factors', () => {
    expect(SQFT_PER_ACRE).toBe(43560);
    expect(SQFT_PER_M2).toBeCloseTo(1 / 0.3048 ** 2, 6);
  });
});

describe('mower productivity', () => {
  it('acres per hour = width(ft) × mph × 5280 × efficiency ÷ 43,560', () => {
    expect(acresPerHour(mowerById('push21'))).toBeCloseTo((1.75 * 3 * 5280 * 0.75) / 43560, 6);
    expect(acresPerHour(mowerById('zt48'))).toBeCloseTo(2.327, 3);
  });
  it('is zero for an empty mower', () => {
    expect(acresPerHour({ deckIn: 0, mph: 3, efficiency: 0.8 })).toBe(0);
  });
  it('wider mowers are faster', () => {
    const rates = MOWERS.map(acresPerHour);
    for (let i = 1; i < rates.length; i++) expect(rates[i]).toBeGreaterThan(rates[i - 1]);
  });
  it('picks a mower by lawn size and forces a push mower behind a narrow gate', () => {
    expect(autoMowerId(5000)).toBe('push21');
    expect(autoMowerId(10000)).toBe('walk36');
    expect(autoMowerId(30000)).toBe('zt48');
    expect(autoMowerId(80000)).toBe('zt60');
    expect(autoMowerId(80000, true)).toBe('push21');
  });
});

describe('visits per season', () => {
  it('counts visits exactly (no off-by-one)', () => {
    expect(visitsPerSeason(frequencyById('weekly'), 30)).toBe(30);
    expect(visitsPerSeason(frequencyById('biweekly'), 30)).toBe(15);
    expect(visitsPerSeason(frequencyById('biweekly'), 26)).toBe(13);
    expect(visitsPerSeason(frequencyById('tenDays'), 30)).toBe(21);
    expect(visitsPerSeason(frequencyById('monthly'), 30)).toBe(7);
    expect(visitsPerSeason(frequencyById('weekly'), 52)).toBe(52);
    expect(visitsPerSeason(frequencyById('once'), 30)).toBe(1);
  });
});

describe('calculateLawn', () => {
  it('returns zeros for no lawn', () => {
    const r = calculateLawn(defaultInput(0));
    expect(r.pricePerVisit).toBe(0);
    expect(r.totalMin).toBe(0);
    expect(r.minimumApplied).toBe(false);
  });

  it('price = time × rate when above the minimum', () => {
    const i = defaultInput(SQFT_PER_ACRE);
    const r = calculateLawn(i);
    expect(r.minimumApplied).toBe(false);
    expect(r.pricePerVisit).toBeCloseTo((r.totalMin / 60) * 50, 6);
    expect(r.totalMin).toBeCloseTo(r.mowMin + r.extrasMin + r.setupMin + r.travelMin, 9);
  });

  it('applies the minimum charge to small lawns', () => {
    const r = calculateLawn(defaultInput(1000));
    expect(r.minimumApplied).toBe(true);
    expect(r.pricePerVisit).toBe(35);
  });

  it('season = visit price × visits; month = season ÷ season months', () => {
    const r = calculateLawn(defaultInput(10000));
    expect(r.pricePerSeason).toBeCloseTo(r.pricePerVisit * 30, 9);
    expect(r.pricePerMonth).toBeCloseTo(r.pricePerSeason / (30 / (52 / 12)), 9);
  });

  it('weekly 5,000 sq ft season matches 30 × per-visit (the error competitors make)', () => {
    const r = calculateLawn(defaultInput(5000));
    expect(r.visits).toBe(30);
    expect(r.pricePerSeason).toBeCloseTo(30 * r.pricePerVisit, 9);
  });

  it('one-time cut has 1 visit and no monthly figure', () => {
    const r = calculateLawn(defaultInput(10000, { frequency: 'once' }));
    expect(r.visits).toBe(1);
    expect(r.pricePerSeason).toBe(r.pricePerVisit);
    expect(r.pricePerMonth).toBe(0);
  });

  it('bi-weekly costs more per visit than weekly (longer grass)', () => {
    const w = calculateLawn(defaultInput(20000));
    const b = calculateLawn(defaultInput(20000, { frequency: 'biweekly' }));
    expect(b.pricePerVisit).toBeGreaterThan(w.pricePerVisit);
    expect(b.pricePerSeason).toBeLessThan(w.pricePerSeason);
  });

  it('overgrown grass, slope and obstacles multiply mowing time', () => {
    const base = calculateLawn(defaultInput(20000, { extras: [] }));
    const hard = calculateLawn(defaultInput(20000, { extras: [], grass: 'overgrown', slope: 'steep', obstacles: 'many' }));
    expect(hard.mowMin).toBeCloseTo(base.mowMin * 1.5 * 1.35 * 1.25, 6);
  });

  it('extras add time; bagging scales with mowing time', () => {
    const none = calculateLawn(defaultInput(10000, { extras: [] }));
    const trim = calculateLawn(defaultInput(10000, { extras: ['trim'] }));
    expect(trim.extrasMin).toBeCloseTo(3 + 0.6 * 10, 9);
    const bag = calculateLawn(defaultInput(10000, { extras: ['bag'] }));
    expect(bag.extrasMin).toBeCloseTo(0.25 * none.mowMin, 9);
  });

  it('per acre gets cheaper on larger lawns', () => {
    const half = calculateLawn(defaultInput(SQFT_PER_ACRE / 2));
    const two = calculateLawn(defaultInput(SQFT_PER_ACRE * 2));
    expect(two.pricePerAcre).toBeLessThan(half.pricePerAcre);
  });

  it('pro profit = price − hours × cost per hour', () => {
    const r = calculateLawn(defaultInput(20000, { mode: 'pro', costPerHour: 30 }));
    expect(r.profitPerVisit).toBeCloseTo(r.pricePerVisit - (r.totalMin / 60) * 30, 9);
    expect(calculateLawn(defaultInput(20000)).profitPerVisit).toBeNull();
  });

  it('range is ordered low ≤ typical ≤ high', () => {
    const p = priceRange(defaultInput(SQFT_PER_ACRE));
    expect(p.low).toBeLessThanOrEqual(p.typical);
    expect(p.typical).toBeLessThanOrEqual(p.high);
  });
});

describe('default model stays inside published per-visit ranges (weekly, typical rate)', () => {
  // Housecall Pro (updated Oct 2026): ¼ ac $45–85, ½ ac $50–100, 1 ac $60–150.
  // Jobber Academy (Mar 2026): ¼ ac $25–60, ½ ac $50–75.
  it('¼ acre', () => {
    const v = calculateLawn(defaultInput(SQFT_PER_ACRE / 4)).pricePerVisit;
    expect(v).toBeGreaterThanOrEqual(45);
    expect(v).toBeLessThanOrEqual(60);
  });
  it('½ acre', () => {
    const v = calculateLawn(defaultInput(SQFT_PER_ACRE / 2)).pricePerVisit;
    expect(v).toBeGreaterThanOrEqual(50);
    expect(v).toBeLessThanOrEqual(75);
  });
  it('1 acre', () => {
    const v = calculateLawn(defaultInput(SQFT_PER_ACRE)).pricePerVisit;
    expect(v).toBeGreaterThanOrEqual(60);
    expect(v).toBeLessThanOrEqual(150);
  });
});

describe('patchesArea', () => {
  it('adds rectangles and subtracts exclusions, never negative', () => {
    expect(patchesArea([{ length: 50, width: 40 }, { length: 60, width: 30 }])).toBe(3800);
    expect(patchesArea([{ length: 50, width: 40 }, { length: 20, width: 10, subtract: true }])).toBe(1800);
    expect(patchesArea([{ length: 10, width: 10, subtract: true }])).toBe(0);
  });
});
