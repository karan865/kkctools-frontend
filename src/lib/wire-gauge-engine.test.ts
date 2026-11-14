import { describe, it, expect } from 'vitest';
import {
  AWG_SIZES,
  MM2_SIZES,
  M_PER_FT,
  allowableAmpacity,
  ambientFactor,
  awgAreaMm2,
  awgDiameterIn,
  bundleFactor,
  conductorById,
  currentFromPower,
  gaugeLookup,
  maxBreaker,
  maxRunM,
  nearestMetricUp,
  resistancePerM,
  sizeWire,
  voltageDrop,
  type SizeInput,
} from './wire-gauge-engine';

const ohmPerKft = (id: string, metal: 'cu' | 'al' = 'cu') => resistancePerM(conductorById(id)!, metal)! * 304.8;

describe('AWG geometry (ASTM B258 formula)', () => {
  it('known diameters', () => {
    expect(awgDiameterIn(36)).toBeCloseTo(0.005, 9);
    expect(awgDiameterIn(-3)).toBeCloseTo(0.46, 3);
    expect(awgDiameterIn(12)).toBeCloseTo(0.0808, 4);
    expect(awgAreaMm2(12)).toBeCloseTo(3.31, 2);
    expect(awgAreaMm2(10)).toBeCloseTo(5.26, 2);
  });
  it('every 3 gauges ≈ doubles the area', () => {
    expect(awgAreaMm2(9) / awgAreaMm2(12)).toBeCloseTo(2, 1);
  });
});

describe('resistance matches NEC Chapter 9 Table 8 (stranded, 75 °C) within 1.5 %', () => {
  const table8: [string, number, 'cu' | 'al'][] = [
    ['awg14', 3.14, 'cu'],
    ['awg12', 1.98, 'cu'],
    ['awg10', 1.24, 'cu'],
    ['awg8', 0.778, 'cu'],
    ['awg6', 0.491, 'cu'],
    ['awg2', 0.194, 'cu'],
    ['awg-3', 0.0608, 'cu'],
    ['awg12', 3.25, 'al'],
    ['awg6', 0.808, 'al'],
  ];
  for (const [id, ref, metal] of table8) {
    it(`${id} ${metal} ≈ ${ref} Ω/1000 ft`, () => {
      expect(Math.abs(ohmPerKft(id, metal) / ref - 1)).toBeLessThan(0.015);
    });
  }
  it('no aluminium 14 AWG, no aluminium below 10 mm²', () => {
    expect(resistancePerM(conductorById('awg14')!, 'al')).toBeNull();
    expect(resistancePerM(conductorById('mm2.5')!, 'al')).toBeNull();
  });
  it('metric uses IEC 60228 at 20 °C corrected to 70 °C', () => {
    expect(resistancePerM(conductorById('mm2.5')!, 'cu')!).toBeCloseTo((7.41 / 1000) * (1 + 0.00393 * 50), 9);
  });
});

describe('load and voltage drop', () => {
  it('current from power', () => {
    expect(currentFromPower(2400, 120, 'ac1')).toBe(20);
    expect(currentFromPower(1200, 12, 'dc')).toBe(100);
    expect(currentFromPower(10000, 400, 'ac3', 0.9)).toBeCloseTo(10000 / (Math.sqrt(3) * 400 * 0.9), 9);
  });
  it('drop formulas', () => {
    expect(voltageDrop(20, 0.01, 30, 'ac1')).toBeCloseTo(12, 9);
    expect(voltageDrop(20, 0.01, 30, 'ac3')).toBeCloseTo(Math.sqrt(3) * 6, 9);
  });
});

describe('ampacity (NEC 310.16 with corrections)', () => {
  const base = { metal: 'cu' as const, insulation: 75 as const, terminal: 75 as const, ambientC: 30, conductors: 3 };
  it('table values', () => {
    expect(allowableAmpacity(conductorById('awg12')!, base)).toBe(25);
    expect(allowableAmpacity(conductorById('awg12')!, { ...base, terminal: 60 })).toBe(20);
    expect(allowableAmpacity(conductorById('awg6')!, { ...base, metal: 'al' })).toBe(50);
  });
  it('ambient and bundling factors', () => {
    expect(ambientFactor(40, 75)).toBe(0.88);
    expect(ambientFactor(42, 90)).toBe(0.87);
    expect(ambientFactor(58, 60)).toBe(0);
    expect(bundleFactor(5)).toBe(0.8);
    expect(bundleFactor(12)).toBe(0.5);
  });
  it('90 °C insulation derates from the 90 column but stays under the terminal column', () => {
    const c = conductorById('awg8')!;
    // 55 × 0.8 (6 conductors) = 44, under the 75 °C terminal limit of 50
    expect(allowableAmpacity(c, { ...base, insulation: 90, conductors: 6 })).toBeCloseTo(44, 9);
    // 55 × 1 = 55, capped at 50 by 75 °C terminals
    expect(allowableAmpacity(c, { ...base, insulation: 90 })).toBe(50);
  });
  it('240.4(D) small-conductor limits', () => {
    expect(maxBreaker(conductorById('awg14')!, 'cu', 20)).toBe(15);
    expect(maxBreaker(conductorById('awg12')!, 'cu', 25)).toBe(20);
    expect(maxBreaker(conductorById('awg10')!, 'al', 30)).toBe(25);
  });
});

describe('sizeWire', () => {
  const inp = (over: Partial<SizeInput> = {}): SizeInput => ({
    sizeSystem: 'awg',
    system: 'ac1',
    volts: 120,
    amps: 20,
    oneWayM: 100 * M_PER_FT,
    maxDropPct: 3,
    continuous: false,
    metal: 'cu',
    insulation: 75,
    terminal: 60,
    ambientC: 30,
    conductors: 3,
    ...over,
  });

  it('20 A at 120 V over 100 ft: drop controls → 8 AWG', () => {
    const r = sizeWire(inp());
    expect(r.byAmpacity?.id).toBe('awg12');
    expect(r.byDrop?.id).toBe('awg8');
    expect(r.chosen?.id).toBe('awg8');
    expect(r.controls).toBe('drop');
    expect(r.chosenRow!.dropPct).toBeLessThan(3);
  });
  it('short run: ampacity controls', () => {
    const r = sizeWire(inp({ oneWayM: 10 * M_PER_FT }));
    expect(r.byDrop?.id).toBe('awg14');
    expect(r.chosen?.id).toBe('awg12');
    expect(r.controls).toBe('ampacity');
    expect(r.breaker).toBe(20);
  });
  it('continuous 20 A needs 25 A → 10 AWG on a 25 A breaker', () => {
    const r = sizeWire(inp({ oneWayM: 10 * M_PER_FT, continuous: true }));
    expect(r.requiredAmps).toBe(25);
    expect(r.byAmpacity?.id).toBe('awg10');
    expect(r.breaker).toBe(25);
  });
  it('16 A load cannot use 14 AWG (15 A limit)', () => {
    const r = sizeWire(inp({ amps: 16, oneWayM: 5 }));
    expect(r.byAmpacity?.id).toBe('awg12');
  });
  it('aluminium picks a larger size than copper', () => {
    const cu = sizeWire(inp({ amps: 60, oneWayM: 15 }));
    const al = sizeWire(inp({ amps: 60, oneWayM: 15, metal: 'al' }));
    const order = AWG_SIZES.map((c) => c.id);
    expect(order.indexOf(al.chosen!.id)).toBeGreaterThan(order.indexOf(cu.chosen!.id));
  });
  it('metric sizing uses voltage drop only', () => {
    const r = sizeWire(inp({ sizeSystem: 'mm2', volts: 230, amps: 16, oneWayM: 30 }));
    expect(r.controls).toBe('drop');
    expect(r.byAmpacity).toBeNull();
    expect(r.chosen?.system).toBe('mm2');
    expect(r.chosenRow!.dropPct).toBeLessThanOrEqual(3);
  });
  it('12 V DC, 20 A, 15 ft one way at 3 %', () => {
    const r = sizeWire(inp({ system: 'dc', volts: 12, amps: 20, oneWayM: 15 * M_PER_FT, terminal: 75 }));
    // VD = 2 × 20 × R × 4.572 m ≤ 0.36 V → R ≤ 1.97 mΩ/m → 8 AWG (2.55) too high, 6 AWG (1.61) ok
    expect(r.byDrop?.id).toBe('awg6');
  });
  it('nothing fits returns null', () => {
    const r = sizeWire(inp({ amps: 2000 }));
    expect(r.chosen).toBeNull();
  });
});

describe('helpers', () => {
  it('max run inverts the drop formula', () => {
    const c = conductorById('awg12')!;
    const L = maxRunM(c, 'cu', 20, 120, 'ac1', 3);
    expect(voltageDrop(20, resistancePerM(c, 'cu')!, L, 'ac1')).toBeCloseTo(3.6, 9);
  });
  it('nearest metric size at or above an AWG area', () => {
    expect(nearestMetricUp(awgAreaMm2(12))?.label).toBe('4 mm²');
    expect(nearestMetricUp(awgAreaMm2(14))?.label).toBe('2.5 mm²');
  });
  it('gauge lookup: 12 AWG copper ≈ 19.8 lb/1000 ft (≈ 9 g/ft)', () => {
    const g = gaugeLookup(12);
    expect(g.cuLbPerKft).toBeCloseTo(19.8, 0);
    expect(g.cuKgPerKm / 3.28084).toBeCloseTo(8.97, 1);
    expect(g.cuOhmPerKft).toBeCloseTo(1.588, 2);
  });
  it('metric table is ordered and positive', () => {
    for (let k = 1; k < MM2_SIZES.length; k++) expect(MM2_SIZES[k].areaMm2).toBeGreaterThan(MM2_SIZES[k - 1].areaMm2);
  });
});
