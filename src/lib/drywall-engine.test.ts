import { describe, it, expect } from 'vitest';
import {
  BOARDS,
  COMPOUND_L_PER_M2,
  M2_PER_FT2,
  M_PER_FT,
  M_PER_IN,
  SHEETS,
  TAPE_M_PER_M2,
  calculateDrywall,
  defaultScrewSpacingM,
  defaultSurface,
  equivalentSheet,
  estimateCost,
  framingSpacingM,
  m2ToFt2,
  mToFt,
  screwsPerSheet,
  sheetById,
  sheetsFor,
  surfaceAreas,
  type DrywallInput,
  type SurfaceItem,
} from './drywall-engine';

const ft = (v: number) => v * M_PER_FT;
const inch = (v: number) => v * M_PER_IN;
const sqft = (v: number) => v * M2_PER_FT2;

function room(l: number, w: number, h: number, doors = 0, windows = 0, extra: Partial<SurfaceItem> = {}): SurfaceItem {
  const base = defaultSurface('room', 'r1');
  return {
    ...base,
    length: ft(l),
    width: ft(w),
    height: ft(h),
    doors: { ...base.doors, count: doors },
    windows: { ...base.windows, count: windows },
    ...extra,
  };
}

function input(items: SurfaceItem[], over: Partial<DrywallInput> = {}): DrywallInput {
  return {
    items,
    sheetId: 'ft4x8',
    wastePercent: 10,
    framingM: framingSpacingM('narrow', 'imperial'),
    wallScrewSpacingM: defaultScrewSpacingM('wall', 'narrow', 'imperial'),
    ceilingScrewSpacingM: defaultScrewSpacingM('ceiling', 'narrow', 'imperial'),
    tapeRollM: ft(250),
    cornerBeadM: 0,
    beadPieceM: ft(8),
    boardLbPerSqFt: 1.6,
    ...over,
  };
}

describe('drywall engine — sourced rates', () => {
  it('tape: 350 ft per 1,000 sq ft ≈ 1.148 m per m²', () => {
    expect(TAPE_M_PER_M2).toBeCloseTo(1.1483, 3);
  });

  it('compound: 10 gal per 1,000 sq ft ≈ 0.407 L per m²', () => {
    expect(COMPOUND_L_PER_M2).toBeCloseTo(0.40746, 4);
  });

  it('board weights match USG nominal values', () => {
    expect(BOARDS.find((b) => b.id === 'regular12')!.lbPerSqFt).toBe(1.6);
    expect(BOARDS.find((b) => b.id === 'light12')!.lbPerSqFt).toBe(1.25);
    expect(BOARDS.find((b) => b.id === 'typeX58')!.lbPerSqFt).toBe(2.2);
  });
});

describe('drywall engine — sheets and conversions', () => {
  it('sheet areas are 32/36/40/48/56/64 sq ft for 4-ft-wide panels', () => {
    const areas = SHEETS.filter((s) => s.system === 'imperial').map((s) => Math.round(m2ToFt2(s.widthM * s.lengthM)));
    expect(areas).toEqual([32, 36, 40, 48, 56, 64]);
  });

  it('maps sheets between unit systems by closest length', () => {
    expect(equivalentSheet('ft4x8', 'metric').id).toBe('mm1200x2400');
    expect(equivalentSheet('ft4x10', 'metric').id).toBe('mm1200x3000');
    expect(equivalentSheet('mm1200x2700', 'imperial').id).toBe('ft4x9');
    expect(equivalentSheet('ft4x12', 'imperial').id).toBe('ft4x12');
  });

  it('unknown sheet id falls back to 4×8', () => {
    expect(sheetById('nope').id).toBe('ft4x8');
  });

  it('rounds sheets up and ignores float noise', () => {
    expect(sheetsFor(sqft(320), 0, sheetById('ft4x8'))).toBe(10);
    expect(sheetsFor(sqft(321), 0, sheetById('ft4x8'))).toBe(11);
    expect(sheetsFor(0, 0.1, sheetById('ft4x8'))).toBe(0);
  });
});

describe('drywall engine — surface areas', () => {
  it('12×12 room, 8 ft walls: 384 sq ft walls + 144 sq ft ceiling', () => {
    const a = surfaceAreas(room(12, 12, 8));
    expect(m2ToFt2(a.wallGrossM2)).toBeCloseTo(384, 6);
    expect(m2ToFt2(a.ceilingM2)).toBeCloseTo(144, 6);
  });

  it('subtracts a 36×80 in door (20 sq ft) and a 36×48 in window (12 sq ft)', () => {
    const a = surfaceAreas(room(12, 12, 8, 1, 1));
    expect(m2ToFt2(a.openingsM2)).toBeCloseTo(32, 6);
    expect(m2ToFt2(a.wallNetM2)).toBeCloseTo(352, 6);
  });

  it('walls-only room has no ceiling; ceiling-only room ignores openings', () => {
    const wallsOnly = surfaceAreas(room(12, 12, 8, 1, 0, { includeCeiling: false }));
    expect(wallsOnly.ceilingM2).toBe(0);
    const ceilingOnly = surfaceAreas(room(12, 12, 8, 2, 2, { includeWalls: false }));
    expect(ceilingOnly.openingsM2).toBe(0);
    expect(m2ToFt2(ceilingOnly.ceilingM2)).toBeCloseTo(144, 6);
  });

  it('single wall, ceiling, gable and known-area surfaces', () => {
    const wall = { ...defaultSurface('wall', 'w'), length: ft(14), height: ft(8) };
    expect(m2ToFt2(surfaceAreas(wall).wallNetM2)).toBeCloseTo(112, 6);
    const ceiling = { ...defaultSurface('ceiling', 'c'), length: ft(10), width: ft(11) };
    expect(m2ToFt2(surfaceAreas(ceiling).ceilingM2)).toBeCloseTo(110, 6);
    const gable = { ...defaultSurface('gable', 'g'), length: ft(24), height: ft(6) };
    expect(m2ToFt2(surfaceAreas(gable).wallNetM2)).toBeCloseTo(72, 6);
    const area = { ...defaultSurface('area', 'a'), area: sqft(250), areaOnCeiling: true };
    expect(m2ToFt2(surfaceAreas(area).ceilingM2)).toBeCloseTo(250, 6);
  });

  it('openings can never make a wall negative', () => {
    const wall = { ...defaultSurface('wall', 'w'), length: ft(3), height: ft(7), doors: { count: 5, width: inch(36), height: inch(80) } };
    expect(surfaceAreas(wall).wallNetM2).toBe(0);
  });

  it('treats negative and NaN sizes as zero', () => {
    const bad = { ...room(12, 12, 8), length: -5, width: NaN };
    const a = surfaceAreas(bad);
    expect(a.wallGrossM2).toBe(0);
    expect(a.ceilingM2).toBe(0);
  });
});

describe('drywall engine — screws per sheet', () => {
  it('4×8 on 16 in framing: 28 screws on walls (16 in), 35 on ceilings (12 in)', () => {
    const s = sheetById('ft4x8');
    expect(screwsPerSheet(s, inch(16), inch(16))).toBe(28);
    expect(screwsPerSheet(s, inch(16), inch(12))).toBe(35);
  });

  it('4×8 on 24 in framing: 25 screws on walls and ceilings (12 in spacing)', () => {
    const s = sheetById('ft4x8');
    expect(defaultScrewSpacingM('wall', 'wide', 'imperial')).toBeCloseTo(inch(12), 9);
    expect(screwsPerSheet(s, inch(24), inch(12))).toBe(25);
  });

  it('metric 1200×2400 on 400 mm framing: 28 (walls 400 mm) and 35 (ceilings 300 mm)', () => {
    const s = sheetById('mm1200x2400');
    expect(screwsPerSheet(s, 0.4, 0.4)).toBe(28);
    expect(screwsPerSheet(s, 0.4, 0.3)).toBe(35);
  });

  it('returns 0 for invalid spacing', () => {
    expect(screwsPerSheet(sheetById('ft4x8'), 0, inch(16))).toBe(0);
  });
});

describe('drywall engine — full job', () => {
  it('12×12×8 bedroom, 1 door, 1 window, ceiling, 10% extra, 4×8 sheets', () => {
    const r = calculateDrywall(input([room(12, 12, 8, 1, 1)]));
    expect(m2ToFt2(r.netM2)).toBeCloseTo(496, 6);
    expect(r.sheets).toBe(18);
    expect(r.screwsPerWallSheet).toBe(28);
    expect(r.screwsPerCeilingSheet).toBe(35);
    expect(r.screwsWall).toBe(339);
    expect(r.screwsCeiling).toBe(174);
    expect(r.screws).toBe(513);
    expect(mToFt(r.tapeM)).toBeCloseTo(190.96, 2);
    expect(r.tapeRolls).toBe(1);
    expect(r.compoundGal).toBeCloseTo(5.456, 3);
    expect(r.pails).toBe(2);
    expect(r.cartons).toBe(2);
    expect(r.weightKg / 0.45359237).toBeCloseTo(18 * 32 * 1.6, 3);
  });

  it('sheet counts for every size of the same job', () => {
    const r = calculateDrywall(input([room(12, 12, 8, 1, 1)]));
    const by = Object.fromEntries(r.sheetsBySize.map((s) => [s.id, s.sheets]));
    expect(by).toEqual({ ft4x8: 18, ft4x9: 16, ft4x10: 14, ft4x12: 12, ft4x14: 10, ft4x16: 9 });
  });

  it('12×12 room without openings: 14 sheets walls-only, 19 with ceiling', () => {
    expect(calculateDrywall(input([room(12, 12, 8, 0, 0, { includeCeiling: false })])).sheets).toBe(14);
    expect(calculateDrywall(input([room(12, 12, 8)])).sheets).toBe(19);
  });

  it('adds different rooms and quantities into one total', () => {
    const bath = { ...room(8, 10, 8, 1, 0), id: 'r2', qty: 2 };
    const r = calculateDrywall(input([room(12, 12, 8, 1, 1), bath]));
    // bedroom 496 + 2 × (288 − 20 + 80) = 496 + 696 = 1,192 sq ft
    expect(m2ToFt2(r.netM2)).toBeCloseTo(1192, 6);
    expect(r.items).toHaveLength(2);
    expect(r.sheets).toBe(Math.ceil((1192 * 1.1) / 32));
  });

  it('metric room 4×3 m, 2.4 m walls, ceiling: 45.6 m² → 18 sheets of 1200×2400', () => {
    const item = { ...defaultSurface('room', 'm'), length: 4, width: 3, height: 2.4, doors: { count: 0, width: 0.9, height: 2.1 }, windows: { count: 0, width: 1, height: 1 } };
    const r = calculateDrywall(
      input([item], {
        sheetId: 'mm1200x2400',
        framingM: framingSpacingM('narrow', 'metric'),
        wallScrewSpacingM: defaultScrewSpacingM('wall', 'narrow', 'metric'),
        ceilingScrewSpacingM: defaultScrewSpacingM('ceiling', 'narrow', 'metric'),
      }),
    );
    expect(r.netM2).toBeCloseTo(45.6, 9);
    expect(r.sheets).toBe(18);
    expect(r.sheetsBySize.map((s) => s.id)).toEqual(['mm1200x2400', 'mm1200x2700', 'mm1200x3000']);
  });

  it('corner bead pieces, zero waste and empty jobs', () => {
    const r = calculateDrywall(input([room(12, 12, 8)], { cornerBeadM: ft(30), wastePercent: 0 }));
    expect(r.beadPieces).toBe(4);
    expect(r.orderM2).toBeCloseTo(r.netM2, 9);
    const empty = calculateDrywall(input([{ ...room(12, 12, 8), qty: 0 }]));
    expect(empty.sheets).toBe(0);
    expect(empty.screws).toBe(0);
    expect(empty.pails).toBe(0);
    expect(empty.tapeRolls).toBe(0);
  });

  it('clamps waste to 0–100%', () => {
    const r = calculateDrywall(input([room(12, 12, 8)], { wastePercent: 400 }));
    expect(r.orderM2).toBeCloseTo(r.netM2 * 2, 9);
  });
});

describe('drywall engine — cost', () => {
  it('prices sheets, pails, rolls, screw boxes and labour', () => {
    const r = calculateDrywall(input([room(12, 12, 8, 1, 1)]));
    const c = estimateCost(r, { sheetPrice: 15, pailPrice: 20, rollPrice: 5, screwsPerBox: 1000, boxPrice: 10, laborPerM2: 1 / M2_PER_FT2 });
    expect(c.sheets).toBe(270);
    expect(c.compound).toBe(40);
    expect(c.tape).toBe(5);
    expect(c.screwBoxes).toBe(1);
    expect(c.screws).toBe(10);
    expect(c.materials).toBe(325);
    expect(c.labor).toBeCloseTo(496, 6); // $1 per sq ft × 496 sq ft
    expect(c.total).toBeCloseTo(821, 6);
  });

  it('costs are zero when no prices are given', () => {
    const r = calculateDrywall(input([room(12, 12, 8, 1, 1)]));
    expect(estimateCost(r, {}).total).toBe(0);
  });
});
