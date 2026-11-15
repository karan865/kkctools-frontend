import { describe, expect, it } from 'vitest';
import {
  CC_PER_IN3,
  PRESETS,
  VOLUME_UNITS,
  boreFor,
  cidChart,
  displacementIn3,
  engine,
  fromCubicInches,
  presetEngine,
  shapeVolume,
  strokeFor,
  toCubicInches,
  toInches,
  whatIf,
} from './cubic-inch-engine';

const base = { length: 0, width: 0, height: 0, diameter: 0, inner: 0, quantity: 1 };

describe('conversions', () => {
  it('exact constants', () => {
    expect(CC_PER_IN3).toBeCloseTo(2.54 ** 3, 12);
    const v = fromCubicInches(1728);
    expect(v.ft3).toBe(1);
    expect(v.usGal).toBeCloseTo(1728 / 231, 12);
    expect(fromCubicInches(231).usGal).toBe(1);
    expect(fromCubicInches(46656).yd3).toBe(1);
  });
  it('litres and cubic metres', () => {
    expect(fromCubicInches(61.0237440947).litres).toBeCloseTo(1, 9);
    expect(fromCubicInches(61023.7440947).m3).toBeCloseTo(1, 9);
    expect(fromCubicInches(1).cc).toBe(CC_PER_IN3);
    expect(fromCubicInches(toCubicInches(1, 'impGal')).litres).toBeCloseTo(4.54609, 9);
  });
  it('round trip through every unit', () => {
    for (const u of Object.keys(VOLUME_UNITS) as (keyof typeof VOLUME_UNITS)[]) {
      expect(fromCubicInches(toCubicInches(3.5, u))[u]).toBeCloseTo(3.5, 9);
    }
  });
  it('lengths to inches', () => {
    expect(toInches(25.4, 'mm')).toBeCloseTo(1, 12);
    expect(toInches(2, 'ft')).toBe(24);
    expect(toInches(1, 'm')).toBeCloseTo(39.3700787, 6);
  });
});

describe('shapes', () => {
  it('box', () => {
    expect(shapeVolume({ ...base, shape: 'box', length: 12, width: 10, height: 8 }).total).toBe(960);
    expect(shapeVolume({ ...base, shape: 'box', length: 12, width: 12, height: 12, quantity: 3 }).total).toBe(5184);
  });
  it('cylinder', () => {
    const r = shapeVolume({ ...base, shape: 'cylinder', diameter: 4, length: 10 });
    expect(r.total).toBeCloseTo(Math.PI * 4 * 10, 9);
  });
  it('tube wall and capacity', () => {
    const r = shapeVolume({ ...base, shape: 'tube', diameter: 2, inner: 1.5, length: 12 });
    expect(r.each).toBeCloseTo((Math.PI / 4) * (4 - 2.25) * 12, 9);
    expect(r.capacityEach).toBeCloseTo((Math.PI / 4) * 2.25 * 12, 9);
    expect(shapeVolume({ ...base, shape: 'tube', diameter: 2, inner: 2, length: 12 }).error).not.toBe('');
  });
  it('sphere', () => {
    expect(shapeVolume({ ...base, shape: 'sphere', diameter: 6 }).total).toBeCloseTo(36 * Math.PI, 9);
  });
  it('quantity is a whole number of at least 1', () => {
    expect(shapeVolume({ ...base, shape: 'box', length: 1, width: 1, height: 1, quantity: 0 }).total).toBe(1);
    expect(shapeVolume({ ...base, shape: 'box', length: 1, width: 1, height: 1, quantity: 2.7 }).total).toBe(2);
  });
});

describe('engine displacement', () => {
  it('formula', () => {
    expect(displacementIn3(4, 3.48, 8)).toBeCloseTo(349.85, 2);
    expect(displacementIn3(4, 3.48, 8)).toBeCloseTo(0.7854 * 16 * 3.48 * 8, 1);
  });
  it('presets reproduce the published sizes', () => {
    const by = (id: string) => presetEngine(PRESETS.find((p) => p.id === id)!);
    expect(Math.round(by('sbc350').ci)).toBe(350);
    expect(Math.round(by('ls3').ci)).toBe(376);
    expect(by('ls3').litres).toBeCloseTo(6.16, 2);
    expect(Math.round(by('bbc502').ci)).toBe(502);
    expect(Math.round(by('hemi392').ci)).toBe(391); // nominal "392"
    expect(by('hemi392').litres).toBeCloseTo(6.41, 2);
    expect(by('coyote').litres).toBeCloseTo(5.04, 2);
    expect(Math.round(by('k20c1').cc)).toBe(1996);
  });
  it('per cylinder and bore/stroke ratio', () => {
    const e = engine(4, 3.48, 8);
    expect(e.perCylinderCc).toBeCloseTo(e.cc / 8, 9);
    expect(e.layout).toBe('oversquare');
    expect(engine(3.5, 3.5, 4).layout).toBe('square');
    expect(engine(3, 3.5, 4).layout).toBe('undersquare');
    expect(engine(4, 0, 8).layout).toBe('');
  });
  it('bad input gives zero', () => {
    expect(displacementIn3(-4, 3, 8)).toBe(0);
    expect(engine(4, 3, 0).perCylinderCc).toBe(0);
  });
});

describe('reverse solve and what-if', () => {
  it('bore and stroke from a target', () => {
    expect(boreFor(displacementIn3(4.03, 3.75, 8), 3.75, 8)).toBeCloseTo(4.03, 9);
    expect(strokeFor(displacementIn3(4.03, 3.75, 8), 4.03, 8)).toBeCloseTo(3.75, 9);
    expect(boreFor(0, 3.75, 8)).toBe(0);
    expect(strokeFor(400, 4, 0)).toBe(0);
  });
  it('a 350 bored .030 over', () => {
    const w = whatIf(4, 3.48, 8, 0.03);
    expect(w.after.ci).toBeCloseTo(355.1, 1);
    expect(w.addedCi).toBeCloseTo(5.27, 2);
  });
  it('a 383 stroker: .030 over with a 3.75 in crank', () => {
    const w = whatIf(4, 3.48, 8, 0.03, 3.75);
    expect(Math.round(w.after.ci)).toBe(383);
    expect(w.pct).toBeCloseTo(9.4, 1);
  });
});

describe('CID chart', () => {
  it('matches the formula', () => {
    const c = cidChart([4, 4.03], [3.48, 3.75]);
    expect(c[0][0]).toBeCloseTo(349.85, 2);
    expect(c[1][1]).toBeCloseTo(displacementIn3(4.03, 3.75, 8), 9);
  });
});
