import { describe, it, expect } from 'vitest';
import {
  NOMINAL_BOARDS,
  battenPositions,
  boardsForPieces,
  calculateAccent,
  calculateSiding,
  clashes,
  countForGap,
  defaultAccent,
  formatFraction,
  gapForCount,
  parseInches,
} from './board-batten-engine';

describe('lumber sizes (PS 20 dry dressed)', () => {
  it('1×2–1×6 are nominal − ½ in, 1×8 and wider nominal − ¾ in', () => {
    const w = Object.fromEntries(NOMINAL_BOARDS.map((b) => [b.id, b.actualWidthIn]));
    expect(w['1x2']).toBe(1.5);
    expect(w['1x3']).toBe(2.5);
    expect(w['1x4']).toBe(3.5);
    expect(w['1x6']).toBe(5.5);
    expect(w['1x8']).toBe(7.25);
    expect(w['1x12']).toBe(11.25);
  });
});

describe('parseInches / formatFraction', () => {
  it('reads decimals, fractions, mixed numbers and feet', () => {
    expect(parseInches('3.5')).toBe(3.5);
    expect(parseInches('3 1/2')).toBe(3.5);
    expect(parseInches('3-1/2"')).toBe(3.5);
    expect(parseInches('7/8')).toBe(0.875);
    expect(parseInches("12' 6")).toBe(150);
    expect(parseInches('10ft')).toBe(120);
    expect(parseInches('abc')).toBeNaN();
    expect(parseInches('1/0')).toBeNaN();
  });
  it('rounds to the nearest 1/16 and reduces', () => {
    expect(formatFraction(15.375)).toBe('15 3/8"');
    expect(formatFraction(12)).toBe('12"');
    expect(formatFraction(0.5)).toBe('1/2"');
    expect(formatFraction(14.97)).toBe('15"');
    expect(formatFraction(2.0625)).toBe('2 1/16"');
  });
});

describe('spacing', () => {
  const both = { wallWidth: 144, battenWidth: 3.5, edge: 'both' as const, inset: 0 };

  it('battens at both edges: gap = (W − n·b) ÷ (n − 1)', () => {
    expect(gapForCount(both, 7)).toBeCloseTo((144 - 24.5) / 6, 9);
    expect(gapForCount(both, 1)).toBeNaN();
  });
  it('gaps at both edges: gap = (W − n·b) ÷ (n + 1)', () => {
    expect(gapForCount({ ...both, edge: 'none' }, 6)).toBeCloseTo((144 - 21) / 7, 9);
  });
  it('inset: same as both-edges on the narrower width', () => {
    expect(gapForCount({ ...both, edge: 'inset', inset: 6 }, 7)).toBeCloseTo((132 - 24.5) / 6, 9);
  });
  it('impossible counts give NaN', () => {
    expect(gapForCount(both, 50)).toBeNaN();
  });
  it('count from a target gap picks the closest count', () => {
    expect(countForGap(both, 16)).toBe(8); // (144 − 3.5) / 19.5 + 1 = 8.2 → 8
    const g8 = gapForCount(both, 8);
    expect(Math.abs(g8 - 16)).toBeLessThan(Math.abs(gapForCount(both, 9) - 16));
    expect(countForGap({ ...both, edge: 'none' }, 16)).toBe(Math.round((144 - 16) / 19.5));
  });
  it('positions start at the wall edge and step by batten + gap; the last batten ends at the far edge', () => {
    const p = battenPositions(both, 7);
    expect(p[0]).toBe(0);
    expect(p[1]).toBeCloseTo(3.5 + gapForCount(both, 7), 9);
    expect(p[6] + 3.5).toBeCloseTo(144, 9);
  });
  it('gaps at edges: first batten one gap in, last ends one gap short', () => {
    const s = { ...both, edge: 'none' as const };
    const g = gapForCount(s, 6);
    const p = battenPositions(s, 6);
    expect(p[0]).toBeCloseTo(g, 9);
    expect(144 - (p[5] + 3.5)).toBeCloseTo(g, 9);
  });
});

describe('cut list', () => {
  it('fits short pieces several to a board', () => {
    expect(boardsForPieces([40, 40, 40, 40], 96)).toBe(2);
    expect(boardsForPieces([90, 90, 90], 96)).toBe(3);
  });
  it('joins pieces longer than the stock', () => {
    expect(boardsForPieces([144], 96)).toBe(2);
  });
});

describe('calculateAccent', () => {
  it('default 12 × 8 ft wall, 1×4 battens, ~16 in gap', () => {
    const r = calculateAccent(defaultAccent());
    expect(r.count).toBe(8);
    expect(r.gap).toBeCloseTo((144 - 28) / 7, 9);
    expect(r.onCenter).toBeCloseTo(r.gap + 3.5, 9);
    expect(r.battenLength).toBe(96 - 3.5);
    expect(r.positions).toHaveLength(8);
  });
  it('count mode uses the count', () => {
    const r = calculateAccent(defaultAccent({ mode: 'count', count: 6 }));
    expect(r.count).toBe(6);
    expect(r.gap).toBeCloseTo((144 - 21) / 5, 9);
  });
  it('options table brackets the chosen count', () => {
    const r = calculateAccent(defaultAccent({ mode: 'count', count: 7 }));
    expect(r.options.map((o) => o.count)).toEqual([5, 6, 7, 8, 9]);
    for (let k = 1; k < r.options.length; k++) expect(r.options[k].gap).toBeLessThan(r.options[k - 1].gap);
  });
  it('pieces, linear feet and boards', () => {
    const r = calculateAccent(defaultAccent({ mode: 'count', count: 7, wastePercent: 0 }));
    const battens = r.pieces.find((p) => p.label === 'Vertical battens')!;
    expect(battens.qty).toBe(7);
    const totalIn = 7 * 92.5 + 144;
    expect(r.linearFeet).toBeCloseTo(totalIn / 12, 9);
    expect(r.boards).toBe(9); // 7 battens + top rail 144 in = 96 + 48 → 2 more boards
  });
  it('grid rails fill every gap in each row', () => {
    const r = calculateAccent(defaultAccent({ mode: 'count', count: 7, railRows: 2 }));
    const rails = r.pieces.find((p) => p.label === 'Grid rails')!;
    expect(rails.qty).toBe(2 * 6);
    expect(rails.length).toBeCloseTo(r.gap, 9);
    expect(r.rowGap).toBeCloseTo((92.5 - 2 * 3.5) / 3, 9);
  });
  it('existing baseboard is not bought; a new one is', () => {
    const keep = calculateAccent(defaultAccent({ baseboard: 5.5, baseExisting: true }));
    const buy = calculateAccent(defaultAccent({ baseboard: 5.5, baseExisting: false }));
    expect(keep.pieces.some((p) => p.label === 'Baseboard')).toBe(false);
    expect(buy.pieces.some((p) => p.label === 'Baseboard')).toBe(true);
    expect(keep.battenLength).toBe(96 - 3.5 - 5.5);
  });
  it('supplies scale with length', () => {
    const r = calculateAccent(defaultAccent({ mode: 'count', count: 7 }));
    const ft = (7 * 92.5 + 144) / 12;
    expect(r.adhesiveTubes).toBe(Math.ceil(ft / 30));
    expect(r.caulkTubes).toBe(Math.ceil((2 * ft) / 120));
    expect(r.paintSqFt).toBeCloseTo((144 * 96) / 144 + ((7 * 92.5 + 144) * 1.5) / 144, 9);
    expect(r.paintGallons).toBeCloseTo((r.paintSqFt * 2) / 350, 9);
  });
  it('flags battens that land on an outlet', () => {
    const r = calculateAccent(defaultAccent({ mode: 'count', count: 7, obstacles: [{ id: 'o', label: 'Outlet', left: 0, width: 2.75 }] }));
    expect(r.clashes).toEqual([{ battenIndex: 0, obstacle: 'Outlet' }]);
  });
  it('invalid layouts return zero battens', () => {
    const r = calculateAccent(defaultAccent({ mode: 'count', count: 60 }));
    expect(r.count).toBe(0);
    expect(r.pieces).toHaveLength(0);
  });
});

describe('clashes', () => {
  it('detects overlap only', () => {
    expect(clashes([10], 3.5, [{ id: 'a', label: 'Switch', left: 13.5, width: 3 }])).toHaveLength(0);
    expect(clashes([10], 3.5, [{ id: 'a', label: 'Switch', left: 13, width: 3 }])).toHaveLength(1);
  });
});

describe('calculateSiding', () => {
  const base = {
    wallWidth: 240,
    wallHeight: 96,
    boardWidth: 11.25,
    boardGap: 0.5,
    battenWidth: 2.5,
    battensAtEnds: false,
    openingsArea: 0,
    furringSpacing: 24,
    stockLength: 96,
    wastePercent: 0,
  };
  it('boards cover the width with gaps between; one batten per gap', () => {
    const r = calculateSiding(base);
    expect(r.boards).toBe(Math.ceil((240 + 0.5) / 11.75));
    expect(r.battens).toBe(r.boards - 1);
    expect(r.boardLinearFt).toBeCloseTo((r.boards * 96) / 12, 9);
  });
  it('end battens add two', () => {
    expect(calculateSiding({ ...base, battensAtEnds: true }).battens).toBe(calculateSiding(base).battens + 2);
  });
  it('openings reduce material in proportion', () => {
    const r = calculateSiding({ ...base, openingsArea: 240 * 96 * 0.25 });
    expect(r.netAreaSqFt).toBeCloseTo((240 * 96 * 0.75) / 144, 9);
    expect(r.boardLinearFt).toBeCloseTo(((calculateSiding(base).boards * 96) / 12) * 0.75, 9);
  });
  it('furring rows = height ÷ spacing + 1', () => {
    const r = calculateSiding(base);
    expect(r.furringRows).toBe(5);
    expect(r.furringLinearFt).toBeCloseTo((5 * 240) / 12, 9);
  });
  it('empty wall gives zeros', () => {
    expect(calculateSiding({ ...base, wallWidth: 0 }).boards).toBe(0);
  });
});
