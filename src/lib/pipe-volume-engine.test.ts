import { describe, it, expect } from 'vitest';
import {
  IN3_PER_US_GAL,
  L_PER_IN3,
  MATERIALS,
  PIPE_PRESETS,
  calculatePipes,
  perLength,
  presetById,
  presetId,
  presetRun,
  runAreas,
  weightPerLength,
  type PipeRun,
} from './pipe-volume-engine';

const round = (over: Partial<PipeRun>): PipeRun => ({ id: 'r', shape: 'round', odIn: 0, idIn: 1, widthIn: 0, heightIn: 0, wallIn: 0, lengthIn: 12, qty: 1, ...over });

describe('constants', () => {
  it('exact conversion factors', () => {
    expect(IN3_PER_US_GAL).toBe(231);
    expect(L_PER_IN3).toBeCloseTo(2.54 ** 3 / 1000, 12);
  });
});

describe('presets (published dimensions)', () => {
  it('Schedule 40 IDs match ASME B36.10M', () => {
    expect(presetId(presetById('sch40-1/2')!)).toBeCloseTo(0.622, 3);
    expect(presetId(presetById('sch40-1')!)).toBeCloseTo(1.049, 3);
    expect(presetId(presetById('sch40-2')!)).toBeCloseTo(2.067, 3);
    expect(presetId(presetById('sch40-4')!)).toBeCloseTo(4.026, 3);
    expect(presetId(presetById('sch40-12')!)).toBeCloseTo(11.938, 3);
  });
  it('Schedule 80 IDs', () => {
    expect(presetId(presetById('sch80-1/2')!)).toBeCloseTo(0.546, 3);
    expect(presetId(presetById('sch80-6')!)).toBeCloseTo(5.761, 3);
  });
  it('copper OD = nominal + ⅛ in; Type L ½ in ID 0.545', () => {
    expect(presetById('cuL-1/2')!.odIn).toBe(0.625);
    expect(presetId(presetById('cuL-1/2')!)).toBeCloseTo(0.545, 3);
    expect(presetId(presetById('cuK-3/4')!)).toBeCloseTo(0.745, 3);
    expect(presetId(presetById('cuM-1')!)).toBeCloseTo(1.055, 3);
  });
  it('PEX SDR 9 wall = OD ÷ 9 (min 0.070)', () => {
    expect(presetById('pex-3/4')!.wallIn).toBeCloseTo(0.875 / 9, 9);
    expect(presetById('pex-3/8')!.wallIn).toBe(0.07);
  });
  it('PE SDR 11 metric', () => {
    expect(presetById('pe-32')!.wallIn * 25.4).toBeCloseTo(2.9, 9);
  });
  it('every preset has a positive ID and unique id', () => {
    const ids = new Set<string>();
    for (const p of PIPE_PRESETS) {
      expect(presetId(p)).toBeGreaterThan(0);
      expect(ids.has(p.id)).toBe(false);
      ids.add(p.id);
    }
  });
});

describe('areas', () => {
  it('round capacity and wall', () => {
    const a = runAreas(round({ odIn: 2, idIn: 1.5 }));
    expect(a.inner).toBeCloseTo((Math.PI / 4) * 2.25, 12);
    expect(a.wall).toBeCloseTo((Math.PI / 4) * (4 - 2.25), 12);
  });
  it('ID only gives capacity but no wall', () => {
    const a = runAreas(round({ idIn: 1 }));
    expect(a.valid).toBe(true);
    expect(a.wall).toBe(0);
  });
  it('OD not bigger than ID is invalid', () => {
    expect(runAreas(round({ odIn: 1, idIn: 1 })).valid).toBe(false);
  });
  it('rectangular tube: inner (W−2t)(H−2t), wall = W·H − inner', () => {
    const a = runAreas({ ...round({}), shape: 'rect', widthIn: 4, heightIn: 2, wallIn: 0.25 });
    expect(a.inner).toBeCloseTo(3.5 * 1.5, 12);
    expect(a.wall).toBeCloseTo(8 - 5.25, 12);
    expect(runAreas({ ...round({}), shape: 'rect', widthIn: 1, heightIn: 1, wallIn: 0.5 }).valid).toBe(false);
  });
});

describe('calculatePipes', () => {
  it('100 mm ID × 10 m holds 78.54 L', () => {
    const r = calculatePipes({ runs: [round({ idIn: 100 / 25.4, lengthIn: 10000 / 25.4 })], liquidKgPerL: 1, materialKgPerM3: 7850 });
    expect(r.litres).toBeCloseTo(78.5398, 3);
    expect(r.liquidKg).toBeCloseTo(78.5398, 3);
  });
  it('unit outputs are consistent', () => {
    const r = calculatePipes({ runs: [round({ idIn: 2, lengthIn: 120 })], liquidKgPerL: 1, materialKgPerM3: 7850 });
    expect(r.usGal).toBeCloseTo(r.capacityIn3 / 231, 12);
    expect(r.cubicFt).toBeCloseTo(r.capacityIn3 / 1728, 12);
    expect(r.cubicM).toBeCloseTo(r.litres / 1000, 12);
    expect(r.impGal).toBeCloseTo(r.litres / 4.54609, 12);
  });
  it('runs and quantities add up', () => {
    const a = presetRun('a', 'cuL-3/4', 40 * 12);
    const b = presetRun('b', 'cuL-1', 12 * 12, 2);
    const both = calculatePipes({ runs: [a, b], liquidKgPerL: 1, materialKgPerM3: 8940 });
    const sa = calculatePipes({ runs: [a], liquidKgPerL: 1, materialKgPerM3: 8940 });
    const sb = calculatePipes({ runs: [b], liquidKgPerL: 1, materialKgPerM3: 8940 });
    expect(both.usGal).toBeCloseTo(sa.usGal + sb.usGal, 12);
    expect(both.totalLengthIn).toBe(40 * 12 + 2 * 144);
  });
  it('fill time = litres ÷ flow', () => {
    const r = calculatePipes({ runs: [round({ idIn: 4, lengthIn: 1200 })], liquidKgPerL: 1, materialKgPerM3: 0, flowLPerMin: 20 });
    expect(r.fillMinutes).toBeCloseTo(r.litres / 20, 12);
    expect(calculatePipes({ runs: [round({})], liquidKgPerL: 1, materialKgPerM3: 0 }).fillMinutes).toBeNull();
  });
});

describe('per length tables', () => {
  it('1 in Sch 40 ≈ 0.0449 gal/ft', () => {
    expect(perLength(1.049).galPerFt).toBeCloseTo(0.0449, 4);
  });
  it('2 in Sch 40 ≈ 0.1743 gal/ft and 2.165 L/m', () => {
    const p = perLength(2.067);
    expect(p.galPerFt).toBeCloseTo(0.1743, 4);
    expect(p.lPerM).toBeCloseTo(2.165, 3);
  });
  it('1 in Sch 40 steel weighs ≈ 1.68 lb/ft (ASME B36.10M plain-end weight)', () => {
    const p = presetById('sch40-1')!;
    const steel = MATERIALS.find((m) => m.id === 'steel')!.kgPerM3;
    expect(weightPerLength(p.odIn, p.wallIn, steel).lbPerFt).toBeCloseTo(1.68, 2);
  });
  it('4 in Sch 40 steel ≈ 10.79 lb/ft', () => {
    const p = presetById('sch40-4')!;
    expect(weightPerLength(p.odIn, p.wallIn, 7850).lbPerFt).toBeCloseTo(10.79, 1);
  });
});
