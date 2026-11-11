import { describe, it, expect } from 'vitest';
import {
  convertToDecimalFeet,
  calculateRoomSqft,
  calculateSquareFootage,
  parseDimension,
  RoomItem,
} from './square-footage-engine';

describe('square-footage-engine', () => {
  it('parses dimension string with comma decimal separator', () => {
    expect(parseDimension('12,5')).toBe(12.5);
    expect(parseDimension('10.25')).toBe(10.25);
    expect(parseDimension(14.5)).toBe(14.5);
    expect(parseDimension('invalid')).toBe(0);
    expect(parseDimension('')).toBe(0);
    expect(parseDimension(null)).toBe(0);
  });

  it('converts units to decimal feet correctly', () => {
    expect(convertToDecimalFeet(10, 'feet')).toBe(10);
    expect(convertToDecimalFeet(24, 'inches')).toBe(2);
    expect(convertToDecimalFeet(10, 'feet-inches', 6)).toBe(10.5);
    expect(convertToDecimalFeet(12, 'feet-inches', 6)).toBe(12.5);
    expect(convertToDecimalFeet(2, 'yards')).toBe(6);
    expect(convertToDecimalFeet(1, 'meters')).toBeCloseTo(3.280839895, 4);
    expect(convertToDecimalFeet(30.48, 'centimeters')).toBeCloseTo(1, 4);
  });

  it('calculates 10x10 = 100 sqft, +10% waste = 110 sqft, 9.29 m2', () => {
    const room: RoomItem = {
      id: '1',
      name: 'Room 1',
      shape: 'rectangle',
      length: 10,
      width: 10,
      unit: 'feet',
    };
    const res = calculateSquareFootage([room], 10, 0);
    expect(res.sqft).toBe(100);
    expect(res.sqftWithWaste).toBe(110);
    expect(res.sqMeters).toBe(9.29); // 100 * 0.09290304 = 9.290304 -> 9.29
    expect(res.perimeterLinearFt).toBe(40);
  });

  it('calculates 20x12 = 240 sqft -> 22.30 m2, 26.67 sq yd, 34,560 sq in; $3.50 with 10% waste -> $840 base / $924 with waste', () => {
    const room: RoomItem = {
      id: '1',
      name: 'Main Room',
      shape: 'rectangle',
      length: 20,
      width: 12,
      unit: 'feet',
    };
    const res = calculateSquareFootage([room], 10, 3.5);
    expect(res.sqft).toBe(240);
    expect(res.sqMeters).toBe(22.30); // 240 * 0.09290304 = 22.2967 -> 22.30
    expect(res.sqYards).toBe(26.67); // 240 / 9 = 26.666... -> 26.67
    expect(res.sqInches).toBe(34560); // 240 * 144 = 34560
    expect(res.perimeterLinearFt).toBe(64); // 2*(20+12) = 64
    expect(res.estimatedCost).toBe(840); // 240 * 3.5 = 840
    expect(res.estimatedCostWithWaste).toBe(924); // 264 * 3.5 = 924
  });

  it('calculates L-shape: 10x12 + 8x14 = 232 sq ft and hides perimeter', () => {
    const room: RoomItem = {
      id: 'l1',
      name: 'L-Room',
      shape: 'l-shape',
      length: 10,
      width: 12,
      length2: 8,
      width2: 14,
      unit: 'feet',
    };
    const { sqft, perimeterLinearFt } = calculateRoomSqft(room);
    expect(sqft).toBe(232); // 120 + 112 = 232
    expect(perimeterLinearFt).toBeNull(); // Perimeter hidden for L-Shape
  });

  it('calculates triangle: 18x10 / 2 = 90 sq ft and hides perimeter', () => {
    const room: RoomItem = {
      id: 't1',
      name: 'Triangle',
      shape: 'triangle',
      length: 18,
      width: 10,
      unit: 'feet',
    };
    const { sqft, perimeterLinearFt } = calculateRoomSqft(room);
    expect(sqft).toBe(90);
    expect(perimeterLinearFt).toBeNull();
  });

  it('calculates circle: r = 7 -> 153.94 sq ft and circumference = 43.98 ft', () => {
    const room: RoomItem = {
      id: 'c1',
      name: 'Circle',
      shape: 'circle',
      length: 14,
      width: 14,
      radius: 7,
      unit: 'feet',
    };
    const { sqft, perimeterLinearFt } = calculateRoomSqft(room);
    expect(sqft).toBeCloseTo(Math.PI * 49, 2); // 153.938...
    expect(perimeterLinearFt).toBeCloseTo(2 * Math.PI * 7, 2); // 43.982...
  });

  it('calculates semi-circle correctly with perimeter', () => {
    const room: RoomItem = {
      id: 'sc1',
      name: 'Semi Circle',
      shape: 'semicircle',
      length: 10,
      width: 10,
      radius: 5,
      unit: 'feet',
    };
    const { sqft, perimeterLinearFt } = calculateRoomSqft(room);
    expect(sqft).toBeCloseTo((Math.PI * 25) / 2, 2);
    expect(perimeterLinearFt).toBeCloseTo(Math.PI * 5 + 10, 2);
  });

  it('calculates trapezoid correctly and hides perimeter', () => {
    const room: RoomItem = {
      id: 'tr1',
      name: 'Trapezoid',
      shape: 'trapezoid',
      length: 12,
      base2: 8,
      width: 6,
      unit: 'feet',
    };
    const { sqft, perimeterLinearFt } = calculateRoomSqft(room);
    expect(sqft).toBe(((12 + 8) / 2) * 6); // 60
    expect(perimeterLinearFt).toBeNull();
  });

  it('handles multi-room with add and subtract rows, and guards against negative total', () => {
    const rooms: RoomItem[] = [
      { id: '1', name: 'Main Hall', shape: 'rectangle', length: 20, width: 10, mode: 'add', unit: 'feet' }, // 200
      { id: '2', name: 'Closet Cutout', shape: 'rectangle', length: 5, width: 4, mode: 'subtract', unit: 'feet' }, // -20
    ];
    const res = calculateSquareFootage(rooms, 0, 5);
    expect(res.sqft).toBe(180);
    expect(res.isNegativeTotal).toBe(false);
    expect(res.estimatedCost).toBe(900); // 180 * 5
    expect(res.isPerimeterApprox).toBe(true);
  });

  it('guards negative total area by clamping to 0 and setting isNegativeTotal flag', () => {
    const rooms: RoomItem[] = [
      { id: '1', name: 'Room', shape: 'rectangle', length: 10, width: 10, mode: 'add', unit: 'feet' }, // 100
      { id: '2', name: 'Oversized Cutout', shape: 'rectangle', length: 20, width: 10, mode: 'subtract', unit: 'feet' }, // -200
    ];
    const res = calculateSquareFootage(rooms, 10, 2);
    expect(res.sqft).toBe(0);
    expect(res.sqftWithWaste).toBe(0);
    expect(res.isNegativeTotal).toBe(true);
    expect(res.estimatedCost).toBe(0);
  });
});
