import { describe, expect, it } from 'vitest';
import {
  DIY_DEFAULTS,
  EXTRAS,
  METHODS,
  REPLACE,
  SPECIES,
  STAIN,
  calculateDiy,
  calculateRefinish,
  checkQuote,
  defaultDiyInput,
  defaultRefinishInput,
  gallons,
  quickRefinish,
  replaceCost,
  speciesFactor,
} from './floor-refinish-engine';

describe('published ranges → defaults', () => {
  it('method rates are This Old House midpoints', () => {
    expect(METHODS.recoat.rate).toBe(1.5);
    expect(METHODS.sand.rate).toBe(4.25);
    expect(METHODS.dustless.rate).toBe(6.5);
    expect(STAIN.rate).toBe(2);
    expect(REPLACE.rate).toBe(12);
  });
  it('extras', () => {
    expect(EXTRAS.repair.rate).toBe(9);
    expect(EXTRAS.boards.rate).toBe(23);
    expect(EXTRAS.subfloor.rate).toBe(6.5);
    expect(EXTRAS.carpet.rate).toBe(3);
    expect(EXTRAS.stairs.rate).toBe(35);
    expect(EXTRAS.furniture.rate).toBe(35);
    expect(EXTRAS.baseboard.rate).toBe(140);
  });
  it('species factors relative to oak', () => {
    expect(SPECIES.oak.factor).toBe(1);
    expect(SPECIES.engineered.factor).toBe(1);
    expect(SPECIES.maple.factor).toBe(1.625);
    expect(SPECIES.pine.factor).toBe(1.375);
    expect(SPECIES.mahogany.factor).toBe(1.75);
    expect(SPECIES.parquet.factor).toBe(1.063);
    expect(SPECIES.bamboo.factor).toBe(1.125);
  });
  it('species factor only applies to sanding methods', () => {
    expect(speciesFactor('recoat', 'maple')).toBe(1);
    expect(speciesFactor('sand', 'maple')).toBe(1.625);
    expect(speciesFactor('dustless', 'maple')).toBe(1.625);
  });
});

describe('professional estimate', () => {
  it('full sand on 444 sq ft of oak', () => {
    const r = calculateRefinish(defaultRefinishInput());
    expect(r.lines).toHaveLength(1);
    expect(r.total).toBeCloseTo(444 * 4.25, 6);
    expect(r.low).toBeCloseTo(444 * 3, 6);
    expect(r.high).toBeCloseTo(444 * 5.5, 6);
    expect(r.perSqFt).toBeCloseTo(4.25, 6);
    expect(r.labourHours).toBeCloseTo(22.2, 6);
  });
  it('stain only with sanding methods', () => {
    const sand = calculateRefinish(defaultRefinishInput({ stain: true }));
    expect(sand.total).toBeCloseTo(444 * 6.25, 6);
    expect(sand.low).toBeCloseTo(444 * 4, 6);
    expect(sand.high).toBeCloseTo(444 * 8.5, 6);
    const recoat = calculateRefinish(defaultRefinishInput({ method: 'recoat', stain: true }));
    expect(recoat.lines.some((l) => l.id === 'stain')).toBe(false);
    expect(recoat.total).toBeCloseTo(444 * 1.5, 6);
  });
  it('species multiplies the sanding rate', () => {
    const r = calculateRefinish(defaultRefinishInput({ species: 'maple' }));
    expect(r.effectiveRate).toBeCloseTo(6.91, 6); // 4.25 × 1.625 = 6.906 → cents
    expect(r.total).toBeCloseTo(444 * 6.91, 6);
  });
  it('extras, quantities and units', () => {
    const r = calculateRefinish(
      defaultRefinishInput({ qty: { repair: 20, boards: 10, subfloor: 5, carpet: 100, stairs: 13.7, furniture: 2, baseboard: 1 } }),
    );
    const by = (id: string) => r.lines.find((l) => l.id === id)!;
    expect(by('repair').amount).toBe(180);
    expect(by('boards').amount).toBe(230);
    expect(by('subfloor').amount).toBe(32.5);
    expect(by('carpet').amount).toBe(300);
    expect(by('stairs').qty).toBe(13); // whole steps
    expect(by('stairs').amount).toBe(455);
    expect(by('furniture').amount).toBe(70);
    expect(by('baseboard').amount).toBe(140);
    expect(by('baseboard').low).toBe(140);
    expect(by('stairs').low).toBe(13 * 25);
    expect(by('stairs').high).toBe(13 * 45);
  });
  it('repair area cannot exceed the floor area', () => {
    const r = calculateRefinish(defaultRefinishInput({ areaSqFt: 100, qty: { repair: 500 } }));
    expect(r.lines.find((l) => l.id === 'repair')!.qty).toBe(100);
  });
  it('edited rates keep the published spread', () => {
    const r = calculateRefinish(defaultRefinishInput({ methodRate: 5 }));
    expect(r.total).toBeCloseTo(2220, 6);
    expect(r.low).toBeCloseTo(2220 * (3 / 4.25), 1);
    expect(r.high).toBeCloseTo(2220 * (5.5 / 4.25), 1);
  });
  it('region factor and minimum charge', () => {
    const r = calculateRefinish(defaultRefinishInput({ regionFactor: 1.2 }));
    expect(r.regionAdj).toBeCloseTo(444 * 4.25 * 0.2, 6);
    expect(r.total).toBeCloseTo(444 * 4.25 * 1.2, 6);
    expect(r.low).toBeCloseTo(444 * 3 * 1.2, 6);
    const small = calculateRefinish(defaultRefinishInput({ areaSqFt: 50, method: 'recoat', minimumCharge: 500 }));
    expect(small.total).toBe(500);
    expect(small.minimumTopUp).toBe(425);
    expect(small.low).toBe(500);
    expect(small.high).toBe(500);
  });
  it('empty floor', () => {
    const r = calculateRefinish(defaultRefinishInput({ areaSqFt: 0, minimumCharge: 300 }));
    expect(r.total).toBe(0);
    expect(r.perSqFt).toBe(0);
  });
  it('stays inside This Old House’s $3–$8 per sq ft band for a sand (+ stain) job', () => {
    for (const a of [100, 250, 500, 1000, 2000]) {
      expect(quickRefinish(a).perSqFt).toBeGreaterThanOrEqual(3);
      expect(quickRefinish(a, 'sand', true).perSqFt).toBeLessThanOrEqual(8);
    }
  });
});

describe('quote checker and replacement', () => {
  const r = calculateRefinish(defaultRefinishInput());
  it('classifies quotes', () => {
    expect(checkQuote(1000, r)).toBe('low');
    expect(checkQuote(2000, r)).toBe('within');
    expect(checkQuote(3000, r)).toBe('high');
    expect(checkQuote(0, r)).toBe('n/a');
  });
  it('replacement cost', () => {
    expect(replaceCost(444)).toEqual({ total: 5328, low: 2664, high: 7992 });
  });
});

describe('DIY', () => {
  it('gallons round up', () => {
    expect(gallons(444, 3, 500)).toBe(3); // 2.66
    expect(gallons(500, 2, 500)).toBe(2);
    expect(gallons(0, 3, 500)).toBe(0);
  });
  it('full sand DIY, no stain', () => {
    const d = calculateDiy(defaultDiyInput());
    const ids = d.lines.map((l) => l.id);
    expect(ids).toEqual(['sander', 'edger', 'sandpaper', 'finish', 'sheeting', 'tape', 'rollers', 'safety']);
    expect(d.finishGallons).toBe(3);
    const expected =
      DIY_DEFAULTS.sanderPerDay + DIY_DEFAULTS.edgerPerDay + DIY_DEFAULTS.sandpaper + 3 * DIY_DEFAULTS.finishPerGallon + DIY_DEFAULTS.sheeting + DIY_DEFAULTS.tape + DIY_DEFAULTS.rollers + DIY_DEFAULTS.safety;
    expect(d.total).toBeCloseTo(expected, 6);
    expect(d.total).toBeGreaterThan(400);
    expect(d.total).toBeLessThan(1000); // This Old House: DIY $500–$1,000
  });
  it('stain, two days, vacuum', () => {
    const d = calculateDiy(defaultDiyInput({ stain: true, days: 2, buyVacuum: true }));
    expect(d.stainGallons).toBe(1);
    expect(d.lines.find((l) => l.id === 'sander')!.amount).toBe(130);
    expect(d.lines.some((l) => l.id === 'vacuum')).toBe(true);
  });
  it('recoat uses a buffer and no stain', () => {
    const d = calculateDiy(defaultDiyInput({ method: 'recoat', stain: true, coats: 1 }));
    const ids = d.lines.map((l) => l.id);
    expect(ids).toContain('buffer');
    expect(ids).not.toContain('sander');
    expect(ids).not.toContain('stain');
    expect(d.finishGallons).toBe(1);
  });
});
