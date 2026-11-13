import { describe, it, expect } from 'vitest';
import {
  BARS,
  M_PER_FT,
  M_PER_IN,
  barById,
  barsAcross,
  calculateRebar,
  defaultItem,
  equivalentBar,
  estimateRebarCost,
  itemRuns,
  kgPerMToLbPerFt,
  kgToLb,
  mToFt,
  roundBarKgPerM,
  runLengthWithLaps,
  type RebarInput,
  type RebarItem,
} from './rebar-engine';

const ft = (v: number) => v * M_PER_FT;
const inch = (v: number) => v * M_PER_IN;

function job(items: RebarItem[], over: Partial<RebarInput> = {}): RebarInput {
  return { items, stockLengthM: ft(20), lapDiameters: 40, wastePercent: 0, ...over };
}

function slab(l: number, w: number, spacingIn: number, coverIn = 3, bar = 'us4'): RebarItem {
  return { ...defaultItem('slab', 's'), barId: bar, length: ft(l), width: ft(w), spacing: inch(spacingIn), cover: inch(coverIn) };
}

describe('rebar engine — bar data', () => {
  it('US weights match a round bar of the nominal diameter (ASTM basis) within 0.5%', () => {
    for (const b of BARS.filter((x) => x.system === 'imperial')) {
      const derived = kgPerMToLbPerFt(roundBarKgPerM(b.diameterM));
      expect(Math.abs(derived - b.lbPerFt!) / b.lbPerFt!).toBeLessThan(0.005);
    }
  });

  it('bar numbers are eighths of an inch: #4 = 0.5 in, #8 = 1 in', () => {
    expect(barById('us4').diameterM / M_PER_IN).toBeCloseTo(0.5, 9);
    expect(barById('us8').diameterM / M_PER_IN).toBeCloseTo(1, 9);
  });

  it('metric masses match BS 4449 nominal values (7,850 kg/m³)', () => {
    const table: [string, number][] = [['mm8', 0.395], ['mm10', 0.617], ['mm12', 0.888], ['mm16', 1.579], ['mm20', 2.466], ['mm25', 3.854]];
    for (const [id, kg] of table) expect(Math.abs(barById(id).kgPerM - kg) / kg).toBeLessThan(0.002);
  });

  it('maps bars between systems by nearest diameter', () => {
    expect(equivalentBar('us4', 'metric').id).toBe('mm12');
    expect(equivalentBar('us3', 'metric').id).toBe('mm10');
    expect(equivalentBar('mm16', 'imperial').id).toBe('us5');
    expect(equivalentBar('us6', 'imperial').id).toBe('us6');
  });
});

describe('rebar engine — counting and laps', () => {
  it('bars across a span: ceil(span / spacing) + 1', () => {
    expect(barsAcross(inch(138), inch(18))).toBe(9);
    expect(barsAcross(inch(144), inch(12))).toBe(13);
    expect(barsAcross(0, inch(12))).toBe(0);
    expect(barsAcross(inch(100), 0)).toBe(0);
  });

  it('no laps when a run fits in one stock bar', () => {
    expect(runLengthWithLaps(ft(19), ft(20), ft(1.5))).toEqual({ lengthM: ft(19), laps: 0 });
  });

  it('39.5 ft run with 20 ft bars and a 20 in lap needs 2 laps', () => {
    const r = runLengthWithLaps(ft(39.5), ft(20), inch(20));
    expect(r.laps).toBe(2);
    expect(mToFt(r.lengthM)).toBeCloseTo(39.5 + 2 * (20 / 12), 6);
  });

  it('ignores a lap that is as long as the stock bar', () => {
    expect(runLengthWithLaps(ft(50), ft(20), ft(25)).laps).toBe(0);
  });
});

describe('rebar engine — items', () => {
  it('12×12 ft slab, #4 @ 18 in, 3 in cover: 9 bars each way, 207 ft', () => {
    const runs = itemRuns(slab(12, 12, 18));
    expect(runs.map((r) => r.bars)).toEqual([9, 9]);
    const r = calculateRebar(job([slab(12, 12, 18)]));
    expect(r.bars).toBe(18);
    expect(mToFt(r.netLengthM)).toBeCloseTo(207, 6);
    expect(r.pieces).toBe(11);
    expect(kgToLb(r.weightKg)).toBeCloseTo(207 * 0.668, 2);
  });

  it('two mats double the bars', () => {
    const r = calculateRebar(job([{ ...slab(12, 12, 18), layers: 2 }]));
    expect(r.bars).toBe(36);
  });

  it('6 × 4 m slab, 40 cm spacing, 8 cm edge, 6 m bars: 125.68 m and 21 pieces', () => {
    const item: RebarItem = { ...defaultItem('slab', 'm', 'metric'), length: 6, width: 4, spacing: 0.4, cover: 0.08 };
    const r = calculateRebar(job([item], { stockLengthM: 6 }));
    expect(r.netLengthM).toBeCloseTo(125.68, 6);
    expect(r.pieces).toBe(21);
    expect(r.laps).toBe(0);
  });

  it('40 ft strip footing, 2 continuous #4 bars, laps added', () => {
    const f: RebarItem = { ...defaultItem('footing', 'f'), length: ft(40), cover: inch(3), count: 2, spacing: 0 };
    const r = calculateRebar(job([f]));
    expect(r.laps).toBe(4);
    expect(mToFt(r.netLengthM)).toBeCloseTo(2 * (39.5 + 2 * (20 / 12)), 6);
  });

  it('footing cross bars at a spacing', () => {
    const f: RebarItem = { ...defaultItem('footing', 'f'), length: ft(20), width: inch(24), cover: inch(3), count: 2, spacing: inch(24) };
    // long span 234 in → ceil(234/24)+1 = 11 cross bars of 18 in
    const runs = itemRuns(f);
    expect(runs[1].bars).toBe(11);
    expect(runs[1].lengthM / M_PER_IN).toBeCloseTo(18, 6);
  });

  it('20 × 8 ft wall, #4 @ 16 in both ways, 2 in cover: 16 vertical + 7 horizontal', () => {
    const w: RebarItem = { ...defaultItem('wall', 'w'), length: ft(20), height: ft(8), spacing: inch(16), spacing2: inch(16), cover: inch(2) };
    expect(itemRuns(w).map((r) => r.bars)).toEqual([16, 7]);
    const r = calculateRebar(job([w]));
    expect(mToFt(r.netLengthM)).toBeCloseTo(16 * (8 - 4 / 12) + 7 * (20 - 4 / 12), 6);
  });

  it('bar list: 10 × 20 ft #4 = 133.6 lb; 50 × 6 m 12 mm ≈ 266 kg', () => {
    const us: RebarItem = { ...defaultItem('bars', 'b'), barId: 'us4', length: ft(20), count: 10 };
    expect(kgToLb(calculateRebar(job([us])).weightKg)).toBeCloseTo(133.6, 2);
    const mm: RebarItem = { ...defaultItem('bars', 'b2', 'metric'), barId: 'mm12', length: 6, count: 50 };
    expect(calculateRebar(job([mm], { stockLengthM: 6 })).weightKg).toBeCloseTo(266.34, 1);
  });

  it('waste raises order length, pieces and weight', () => {
    const r = calculateRebar(job([slab(12, 12, 18)], { wastePercent: 10 }));
    expect(mToFt(r.orderLengthM)).toBeCloseTo(227.7, 6);
    expect(r.pieces).toBe(12);
  });

  it('groups different bar sizes separately', () => {
    const r = calculateRebar(job([slab(12, 12, 18), { ...slab(10, 10, 12), id: 's2', barId: 'us5' }]));
    expect(r.bySize.map((b) => b.label)).toEqual(['#4', '#5']);
    expect(r.items).toHaveLength(2);
  });

  it('empty and invalid inputs give zero', () => {
    const r = calculateRebar(job([{ ...slab(12, 12, 18), qty: 0 }]));
    expect(r.bars).toBe(0);
    expect(r.pieces).toBe(0);
    expect(itemRuns({ ...slab(12, 12, 18), length: NaN })).toEqual([]);
    expect(itemRuns({ ...slab(1, 1, 18, 12) })).toEqual([]);
  });

  it('cost by weight and by piece', () => {
    const r = calculateRebar(job([slab(12, 12, 18)]));
    const c = estimateRebarCost(r, 2, 12);
    expect(c.byWeight).toBeCloseTo(r.weightKg * 2, 9);
    expect(c.byPiece).toBe(132);
  });
});
