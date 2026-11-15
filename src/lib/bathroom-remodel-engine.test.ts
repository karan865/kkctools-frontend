import { describe, expect, it } from 'vitest';
import {
  BATHING,
  FINISH_FACTOR,
  ITEMS,
  REFERENCE_SQFT,
  calculateRemodel,
  checkQuote,
  defaultRemodelInput,
  itemRate,
  quickRemodel,
} from './bathroom-remodel-engine';

const FIXED = 467 + 2929 + 332 + 423 + 456 + 5545; // 10,152
const AREA_RATE = 15.91 + 18.94 + 16.36 + 33.4; // $/ft² after rounding to cents (5,923 ÷ 70)

describe('finish factors from This Old House’s finish table', () => {
  it('ratios', () => {
    expect(FINISH_FACTOR.basic).toBe(0.575);
    expect(FINISH_FACTOR.mid).toBe(1);
    expect(FINISH_FACTOR.high).toBe(1.881);
  });
  it('area items are spread over the 70 ft² reference room', () => {
    const flooring = ITEMS.find((i) => i.id === 'flooring')!;
    expect(itemRate(flooring, 'mid')).toBeCloseTo(Math.round((1114 / REFERENCE_SQFT) * 100) / 100, 9);
    expect(itemRate(ITEMS[0], 'high')).toBeCloseTo(Math.round(467 * 1.881 * 100) / 100, 9);
  });
});

describe('full bathroom, 5 × 8 ft, mid-range, tub/shower combo', () => {
  const r = calculateRemodel(defaultRemodelInput());
  it('lines and totals', () => {
    expect(r.lines).toHaveLength(11);
    expect(r.subtotal).toBeCloseTo(FIXED + 1258 + AREA_RATE * 40, 1);
    expect(r.total).toBeCloseTo(14794.4, 1);
    expect(r.contingency).toBeCloseTo(14794.4 * 0.2, 1);
    expect(r.budget).toBeCloseTo(14794.4 * 1.2, 1);
    expect(r.low).toBeCloseTo(14794.4 * 0.87, 1);
    expect(r.high).toBeCloseTo(14794.4 * 1.13, 1);
    expect(r.perSqFt).toBeCloseTo(14794.4 / 40, 1);
  });
});

describe('matches This Old House’s published tables', () => {
  it('cost by size (mid-range, full remodel)', () => {
    const small = quickRemodel(40).total;
    const large = quickRemodel(100).total;
    const primary = quickRemodel(130).total;
    expect(small).toBeGreaterThanOrEqual(12695);
    expect(small).toBeLessThanOrEqual(14845);
    expect(large).toBeGreaterThanOrEqual(19166);
    expect(large).toBeLessThanOrEqual(21295);
    expect(primary).toBeGreaterThanOrEqual(22370);
    expect(primary).toBeLessThanOrEqual(24715);
  });
  it('cost by finish level at 50 ft²', () => {
    const basic = quickRemodel(50, 'basic').total;
    const mid = quickRemodel(50, 'mid').total;
    const high = quickRemodel(50, 'high').total;
    expect(basic).toBeGreaterThanOrEqual(8478);
    expect(basic).toBeLessThanOrEqual(10883);
    expect(mid).toBeGreaterThanOrEqual(14609);
    expect(mid).toBeLessThanOrEqual(19040);
    expect(high).toBeGreaterThanOrEqual(27492);
    expect(high).toBeLessThanOrEqual(35808);
  });
});

describe('scope, type and options', () => {
  it('cosmetic refresh drops plumbing, drywall and the tub/shower', () => {
    const r = quickRemodel(40, 'mid', 'combo', 'cosmetic');
    expect(r.lines.some((l) => ['plumbing', 'drywall', 'bathing'].includes(l.id))).toBe(false);
    expect(r.total).toBeCloseTo(14794.4 - 5545 - 33.4 * 40 - 1258, 1);
  });
  it('half bath has no tub or shower', () => {
    const r = calculateRemodel(defaultRemodelInput('half'));
    expect(r.lines.some((l) => l.id === 'bathing')).toBe(false);
    expect(r.total).toBeCloseTo(FIXED + AREA_RATE * 25, 1);
  });
  it('primary bath with tub and separate shower', () => {
    const r = calculateRemodel(defaultRemodelInput('primary'));
    expect(r.lines.find((l) => l.id === 'bathing')!.amount).toBe(BATHING.both.average);
  });
  it('items can be switched off', () => {
    const base = calculateRemodel(defaultRemodelInput());
    const r = calculateRemodel(defaultRemodelInput('full', 'mid', { off: ['toilet'] }));
    expect(base.total - r.total).toBeCloseTo(467, 6);
  });
  it('water heater, permit, region and contingency', () => {
    const r = calculateRemodel(defaultRemodelInput('full', 'mid', { waterHeater: true, permit: 250, regionFactor: 1.2, contingencyPct: 10 }));
    const sub = 14794.4 + 1478;
    expect(r.subtotal).toBeCloseTo(sub, 1);
    expect(r.regionAdj).toBeCloseTo(sub * 0.2, 1);
    expect(r.total).toBeCloseTo(sub * 1.2 + 250, 1);
    expect(r.contingency).toBeCloseTo((sub * 1.2 + 250) * 0.1, 1);
  });
  it('empty room still prices fixed items', () => {
    const r = calculateRemodel(defaultRemodelInput('full', 'mid', { floorSqFt: 0 }));
    expect(r.perSqFt).toBe(0);
    expect(r.total).toBeCloseTo(FIXED + 1258, 1);
  });
});

describe('quote checker', () => {
  const r = calculateRemodel(defaultRemodelInput());
  it('classifies a quote against the range', () => {
    expect(checkQuote(10000, r)).toBe('low');
    expect(checkQuote(15000, r)).toBe('within');
    expect(checkQuote(20000, r)).toBe('high');
    expect(checkQuote(0, r)).toBe('n/a');
  });
});
