import { describe, expect, it } from 'vitest';
import { ASPHALTS, METALS, METAL_LIFE, calculateMetalRoof, defaultMetalInput, metalById, roofOfArea } from './metal-roof-engine';

const F6 = Math.sqrt(1 + 0.25); // 6/12 pitch factor

describe('default gable roof: 40 × 28 ft, 1 ft overhang, 6/12', () => {
  const r = calculateMetalRoof(defaultMetalInput());
  it('area and edges (Shingle Calculator geometry)', () => {
    expect(r.roofArea).toBeCloseTo(1260 * F6, 6);
    expect(r.squares).toBeCloseTo(14.087, 3);
    expect(r.eaves).toBe(84);
    expect(r.rakes).toBeCloseTo(4 * 15 * F6, 6);
    expect(r.ridge).toBe(42);
    expect(r.hips).toBe(0);
    expect(r.underlaymentRolls).toBe(2);
  });
  it('standing seam panels', () => {
    expect(r.panels.panels).toBe(64);
    expect(r.panels.panelLengthsFt[0]).toBeCloseTo(15 * F6, 6);
    expect(r.panels.linearFt).toBeCloseTo(64 * 15 * F6, 6);
  });
  it('metal cost with tear-off', () => {
    expect(r.metal.installed).toBeCloseTo(1260 * F6 * 12.5, 1);
    expect(r.metal.tearOff).toBeCloseTo(1260 * F6 * 2, 1);
    expect(r.metal.total).toBeCloseTo(1260 * F6 * 14.5, 1);
    expect(r.metal.perSqFt).toBeCloseTo(14.5, 4);
    expect(r.metal.perSquare).toBeCloseTo(1450, 2);
    expect(r.metal.low).toBeCloseTo(1260 * F6 * 10, 1);
    expect(r.metal.high).toBeCloseTo(1260 * F6 * 19, 1);
  });
  it('asphalt comparison (tear-off-and-replace price)', () => {
    expect(r.asphalt.total).toBeCloseTo(1260 * F6 * 5, 1);
    expect(r.asphalt.low).toBeCloseTo(1260 * F6 * 4, 1);
    expect(r.asphalt.high).toBeCloseTo(1260 * F6 * 6, 1);
    expect(r.ratio).toBeCloseTo(14.5 / 5, 4);
    expect(r.difference).toBeCloseTo(1260 * F6 * 9.5, 0);
  });
  it('cost per year of life', () => {
    expect(r.metal.perYear).toBeCloseTo((1260 * F6 * 14.5) / 55, 1);
    expect(r.asphalt.perYear).toBeCloseTo((1260 * F6 * 5) / 27.5, 1);
    expect(r.asphaltOverMetalLife.roofs).toBe(2);
  });
});

describe('options', () => {
  it('no tear-off: metal drops the line, asphalt drops the tear-off share', () => {
    const r = calculateMetalRoof(defaultMetalInput({ tearOff: false }));
    expect(r.metal.tearOff).toBe(0);
    expect(r.metal.total).toBeCloseTo(1260 * F6 * 12.5, 1);
    expect(r.asphalt.total).toBeCloseTo(1260 * F6 * 3, 1);
  });
  it('corrugated panels are wider', () => {
    const m = metalById('corrugated');
    const r = calculateMetalRoof(defaultMetalInput({ metal: m.id, metalPrice: m.price, coverageIn: m.coverageIn }));
    expect(r.panels.panels).toBe(28);
    expect(r.metal.installed).toBeCloseTo(1260 * F6 * 8.5, 1);
  });
  it('metal shingles have no panel count', () => {
    const r = calculateMetalRoof(defaultMetalInput({ metal: 'metalShingle', coverageIn: 0 }));
    expect(r.panels.panels).toBe(0);
    expect(r.panels.linearFt).toBe(0);
  });
  it('hip roofs give panel length from area', () => {
    const r = calculateMetalRoof(defaultMetalInput({ sections: [{ id: 'h', shape: 'hip', length: 40, width: 28, overhang: 1, pitch: 6, area: 0 }] }));
    expect(r.panels.panels).toBe(0);
    expect(r.panels.linearFt).toBeCloseTo(r.roofArea / (16 / 12), 6);
    expect(r.hips).toBeGreaterThan(0);
  });
  it('permit is added to both', () => {
    const base = calculateMetalRoof(defaultMetalInput());
    const r = calculateMetalRoof(defaultMetalInput({ permit: 300 }));
    expect(r.metal.total - base.metal.total).toBeCloseTo(300, 6);
    expect(r.asphalt.total - base.asphalt.total).toBeCloseTo(300, 6);
  });
  it('roof of a given area', () => {
    const r = roofOfArea(2000);
    expect(r.roofArea).toBe(2000);
    expect(r.metal.total).toBe(29000);
    expect(r.asphalt.total).toBe(10000);
  });
  it('empty roof', () => {
    const r = roofOfArea(0);
    expect(r.metal.total).toBe(0);
    expect(r.metal.perSqFt).toBe(0);
    expect(r.ratio).toBe(0);
  });
});

describe('data', () => {
  it('defaults are midpoints of the published ranges', () => {
    for (const m of METALS) expect(m.price).toBeCloseTo((m.range[0] + m.range[1]) / 2, 6);
    for (const a of ASPHALTS) expect(a.price).toBeCloseTo((a.range[0] + a.range[1]) / 2, 6);
    expect(defaultMetalInput().metalLife).toBe((METAL_LIFE[0] + METAL_LIFE[1]) / 2);
  });
});
