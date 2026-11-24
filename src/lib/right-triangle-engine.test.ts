import { describe, it, expect } from 'vitest';
import {
  solveRightTriangleSides,
  solveRightTriangleAngle,
  simplifyRadical,
  classifyTriangle,
  calculateSquareCorner,
  formatFeetInches,
  parseFeetInches,
} from './right-triangle-engine';

describe('right-triangle-engine', () => {
  it('solves classic 3-4-5 triangle with exact angles, area, and altitude', () => {
    const res = solveRightTriangleSides(3, 4, null);
    expect(res.c).toBe(5);
    expect(res.area).toBe(6);
    expect(res.altitude).toBe(2.4);
    expect(res.alphaDeg).toBeCloseTo(36.87, 2);
    expect(res.betaDeg).toBeCloseTo(53.13, 2);
    expect(res.perimeter).toBe(12);
  });

  it('solves missing leg given hypotenuse and leg', () => {
    const resB = solveRightTriangleSides(3, null, 5);
    expect(resB.b).toBe(4);

    const resA = solveRightTriangleSides(null, 4, 5);
    expect(resA.a).toBe(3);
  });

  it('throws when leg is greater than or equal to hypotenuse', () => {
    expect(() => solveRightTriangleSides(6, null, 5)).toThrow(/strictly less than/);
    expect(() => solveRightTriangleSides(null, 5, 5)).toThrow(/strictly less than/);
  });

  it('simplifies exact radicals (legs 3 and 6 -> sqrt(45) = 3*sqrt(5))', () => {
    const res = solveRightTriangleSides(3, 6, null);
    expect(res.c).toBeCloseTo(6.7082, 4);

    const rad = simplifyRadical(45);
    expect(rad.coefficient).toBe(3);
    expect(rad.radicand).toBe(5);
    expect(rad.formatted).toBe('3√5');

    const rad25 = simplifyRadical(25);
    expect(rad25.formatted).toBe('5');

    const rad12 = simplifyRadical(12);
    expect(rad12.formatted).toBe('2√3');

    const rad7 = simplifyRadical(7);
    expect(rad7.formatted).toBe('√7');
  });

  it('solves side and angle mode (c = 10, alpha = 30°)', () => {
    const res = solveRightTriangleAngle('c', 10, 'alpha', 30);
    expect(res.a).toBeCloseTo(5, 4);
    expect(res.b).toBeCloseTo(8.6603, 4);
    expect(res.betaDeg).toBeCloseTo(60, 2);
    expect(res.area).toBeCloseTo(21.6506, 3);
  });

  it('classifies right, acute, obtuse, and invalid triangles', () => {
    const right = classifyTriangle(5, 12, 13);
    expect(right.type).toBe('right');
    expect(right.difference).toBe(0);

    const acute = classifyTriangle(4, 5, 6);
    expect(acute.type).toBe('acute');
    expect(acute.difference).toBeGreaterThan(0);

    const obtuse = classifyTriangle(3, 4, 6);
    expect(obtuse.type).toBe('obtuse');
    expect(obtuse.difference).toBeLessThan(0);

    const invalid = classifyTriangle(1, 2, 5);
    expect(invalid.type).toBe('invalid');
  });

  it('calculates square corners for builders with ft-in formatting', () => {
    // 12 ft x 16 ft slab: diagonal 20 ft (3-4-5 x 4)
    const square1 = calculateSquareCorner(12, 16);
    expect(square1.diagonal).toBe(20);
    expect(square1.suggestedTriple.multiplier).toBe(4);
    expect(square1.suggestedTriple.hypotenuse).toBe(20);

    // 10 ft x 14 ft deck: diagonal 17.2047 ft = 17' 2-7/16"
    const square2 = calculateSquareCorner(10, 14);
    expect(square2.diagonal).toBeCloseTo(17.2047, 4);
    expect(formatFeetInches(square2.diagonal)).toBe('17′ 2-7/16″');
  });

  it('parses feet and inches correctly', () => {
    expect(parseFeetInches('17.2047')).toBeCloseTo(17.2047, 4);
    expect(parseFeetInches("10' 6 1/2\"")).toBeCloseTo(10.54167, 4);
    expect(parseFeetInches('12 ft 6 in')).toBe(12.5);
    expect(parseFeetInches('8')).toBe(8);
  });
});

describe('square-corner layout (review 2026-11-24)', () => {
  it('picks a 3-4-5 multiple whose legs fit both sides', () => {
    expect(calculateSquareCorner(10, 10).suggestedTriple.hypotenuse).toBe(10); // 6-8-10, not 9-12-15
    expect(calculateSquareCorner(12, 16).suggestedTriple.multiplier).toBe(4);
  });
  it('calls equal diagonals square and unequal ones out of square, with no invented tolerance', () => {
    expect(calculateSquareCorner(10, 14, 17.2047, 17.2047).isSquare).toBe(true);
    expect(calculateSquareCorner(10, 14, 17.2, 17.3).isSquare).toBe(false);
  });
});
