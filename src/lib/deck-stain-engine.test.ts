import { describe, expect, it } from 'vitest';
import {
  CONDITION_FACTOR,
  DEFAULT_BOARDS,
  DEFAULT_COST,
  DEFAULT_RAILING,
  DEFAULT_STAIN,
  DEFAULT_STAIRS,
  L_PER_GAL,
  OPACITIES,
  calculateDeckStain,
  defaultInput,
  edgeArea,
  floorArea,
  floorGallons,
  opacityById,
  planCans,
  planLitres,
  railingArea,
  skirtingArea,
  stairsArea,
} from './deck-stain-engine';

describe('areas', () => {
  it('floor sections add up', () => {
    expect(floorArea([{ lengthFt: 16, widthFt: 20 }, { lengthFt: 10, widthFt: 8 }])).toBe(400);
  });
  it('board edges = 2 × thickness per board pitch', () => {
    expect(edgeArea(320, { ...DEFAULT_BOARDS, edges: true })).toBeCloseTo(320 * (2 / 5.625), 6);
    expect(edgeArea(320, DEFAULT_BOARDS)).toBe(0);
  });
  it('detailed railing: posts, rails, balusters', () => {
    const r = railingArea(DEFAULT_RAILING); // 40 ft, 36 in
    expect(r.postCount).toBe(8);
    expect(r.posts).toBeCloseTo(28, 6);
    expect(r.rails).toBeCloseTo(66.667, 3);
    expect(r.balusterCount).toBe(96);
    expect(r.balusters).toBeCloseTo(132, 6);
    expect(r.total).toBeCloseTo(226.667, 3);
  });
  it('round balusters use π × d', () => {
    const r = railingArea({ ...DEFAULT_RAILING, baluster: 'round' });
    expect(r.balusters).toBeCloseTo(96 * Math.PI * 0.125 * 2.75, 6);
  });
  it('simple railing = L × H × 2 sides; none = 0', () => {
    expect(railingArea({ ...DEFAULT_RAILING, mode: 'simple' }).total).toBe(240);
    expect(railingArea({ ...DEFAULT_RAILING, mode: 'none' }).total).toBe(0);
  });
  it('stairs: treads, risers and stringer faces', () => {
    const s = stairsArea({ ...DEFAULT_STAIRS, steps: 4 });
    expect(s.treads).toBeCloseTo(14, 6);
    expect(s.risers).toBeCloseTo(10, 6);
    expect(s.stringers).toBeCloseTo(2 * 2 * (Math.hypot(42, 30) / 12) * (11.25 / 12), 6);
    expect(stairsArea({ ...DEFAULT_STAIRS, steps: 4, risers: false }).risers).toBe(0);
    expect(stairsArea(DEFAULT_STAIRS).total).toBe(0);
  });
  it('skirting one or both sides', () => {
    expect(skirtingArea({ lengthFt: 40, heightFt: 2, sides: 1 })).toBe(80);
    expect(skirtingArea({ lengthFt: 40, heightFt: 2, sides: 2 })).toBe(160);
  });
});

describe('default deck: 16 × 20 ft + 40 ft railing, semi-transparent, 2 coats', () => {
  const r = calculateDeckStain(defaultInput());
  it('area and coverage', () => {
    expect(r.areas.total).toBeCloseTo(546.667, 3);
    expect(r.coverage1).toBe(250);
    expect(r.coverage2).toBe(375);
  });
  it('gallons', () => {
    expect(r.coat1Gal).toBeCloseTo(2.18667, 4);
    expect(r.coat2Gal).toBeCloseTo(1.45778, 4);
    expect(r.needGal).toBeCloseTo(4.00889, 4);
    expect(r.needL).toBeCloseTo(4.00889 * L_PER_GAL, 3);
  });
  it('cans and cost', () => {
    expect(r.cans).toEqual({ pails: 0, gallons: 5, boughtGal: 5, cost: 225 });
    expect(r.litres.boughtL).toBe(16);
    expect(r.cleanerGal).toBe(3);
    expect(r.diyTotal).toBe(276);
    expect(r.prepCost).toBeCloseTo(191.33, 2);
    expect(r.labourCost).toBe(820);
    expect(r.proTotal).toBeCloseTo(1236.33, 2);
    expect(r.proPerSqFt).toBeCloseTo(1236.33 / 320, 2);
  });
});

describe('coats, condition and opacity', () => {
  it('20 × 20 floor, semi, 2 coats = 1.6 + 1.0667 gal + 10%', () => {
    expect(floorGallons(20, 20)).toBeCloseTo(2.9333, 4);
  });
  it('one coat', () => {
    expect(floorGallons(20, 20, { coats: 1 })).toBeCloseTo(1.76, 6);
  });
  it('rough wood uses more', () => {
    expect(floorGallons(20, 20, { coats: 1, condition: 'rough' })).toBeCloseTo((400 / (250 * CONDITION_FACTOR.rough)) * 1.1, 6);
    expect(floorGallons(20, 20, { condition: 'weathered' })).toBeGreaterThan(floorGallons(20, 20));
  });
  it('opacity data matches the published ranges', () => {
    for (const o of OPACITIES) {
      expect(o.coverage).toBeGreaterThanOrEqual(o.coat1[0]);
      expect(o.coverage).toBeLessThanOrEqual(o.coat1[1]);
      expect(o.coat2[0]).toBeGreaterThan(o.coat1[0]);
    }
    expect(opacityById('x').id).toBe('semi');
  });
  it('waste allowance', () => {
    expect(floorGallons(20, 20, { coats: 1, wastePct: 0 })).toBeCloseTo(1.6, 6);
    expect(floorGallons(20, 20, { coats: 1, wastePct: 15 })).toBeCloseTo(1.84, 6);
  });
});

describe('can planning', () => {
  it('gallons only when no pail price', () => {
    expect(planCans(7.3, 45, 0)).toEqual({ pails: 0, gallons: 8, boughtGal: 8, cost: 360 });
  });
  it('picks the cheapest pail + gallon mix', () => {
    expect(planCans(7.3, 45, 200)).toEqual({ pails: 1, gallons: 3, boughtGal: 8, cost: 335 });
    expect(planCans(4.2, 45, 180)).toEqual({ pails: 1, gallons: 0, boughtGal: 5, cost: 180 });
    expect(planCans(0, 45, 180).boughtGal).toBe(0);
  });
  it('metric tins', () => {
    expect(planLitres(7.3)).toEqual({ five: 1, twoHalf: 1, one: 0, boughtL: 7.5 });
    expect(planLitres(4.8)).toEqual({ five: 1, twoHalf: 0, one: 0, boughtL: 5 });
    expect(planLitres(9.2)).toEqual({ five: 1, twoHalf: 1, one: 2, boughtL: 9.5 });
    expect(planLitres(1.2)).toEqual({ five: 0, twoHalf: 0, one: 2, boughtL: 2 });
    expect(planLitres(0).boughtL).toBe(0);
  });
});

describe('cost options', () => {
  it('no cleaner, strip prep', () => {
    const r = calculateDeckStain(defaultInput({ cost: { ...DEFAULT_COST, cleaner: false, prep: 'strip' } }));
    expect(r.cleanerCost).toBe(0);
    expect(r.prepCost).toBeCloseTo(546.667 * 2, 1);
  });
  it('stairs and skirting are included', () => {
    const r = calculateDeckStain(defaultInput({ stairs: { ...DEFAULT_STAIRS, steps: 4 }, skirting: { lengthFt: 40, heightFt: 2, sides: 1 } }));
    expect(r.areas.total).toBeCloseTo(546.667 + stairsArea({ ...DEFAULT_STAIRS, steps: 4 }).total + 80, 3);
  });
  it('metric tins are priced per litre', () => {
    const r = calculateDeckStain(defaultInput({ cost: { ...DEFAULT_COST, metricCans: true, pricePerGal: 10 * L_PER_GAL, cleanerPricePerGal: 4 * L_PER_GAL } }));
    expect(r.litres.boughtL).toBe(16);
    expect(r.stainCost).toBeCloseTo(160, 6);
    expect(r.cleanerL).toBe(Math.ceil((546.667 / 250) * L_PER_GAL));
    expect(r.cleanerCost).toBeCloseTo(r.cleanerL * 4, 6);
  });
  it('empty deck gives zero', () => {
    const r = calculateDeckStain(defaultInput({ sections: [{ lengthFt: 0, widthFt: 0 }], railing: { ...DEFAULT_RAILING, mode: 'none' } }));
    expect(r.needGal).toBe(0);
    expect(r.diyTotal).toBe(0);
    expect(r.proPerSqFt).toBe(0);
  });
  it('defaults are what the page says', () => {
    expect(DEFAULT_STAIN.coverage).toBe(opacityById('semi').coverage);
    expect(DEFAULT_COST.pricePerGal).toBe(45);
  });
});
