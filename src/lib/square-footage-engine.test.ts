import { describe, it, expect } from 'vitest';
import {
  convertToDecimalFeet,
  calculateRoomSqft,
  calculateSquareFootage,
  RoomItem,
} from './square-footage-engine';

describe('square-footage-engine', () => {
  it('converts units to decimal feet correctly', () => {
    expect(convertToDecimalFeet(10, 'feet')).toBe(10);
    expect(convertToDecimalFeet(24, 'inches')).toBe(2);
    expect(convertToDecimalFeet(10, 'feet-inches', 6)).toBe(10.5);
    expect(convertToDecimalFeet(2, 'yards')).toBe(6);
    expect(convertToDecimalFeet(1, 'meters')).toBeCloseTo(3.28084, 4);
    expect(convertToDecimalFeet(30.48, 'centimeters')).toBeCloseTo(1, 4);
  });

  it('calculates rectangular room square footage and perimeter', () => {
    const room: RoomItem = {
      id: '1',
      name: 'Living Room',
      shape: 'rectangle',
      length: 20,
      width: 12,
      unit: 'feet',
    };
    const { sqft, perimeterLinearFt } = calculateRoomSqft(room);
    expect(sqft).toBe(240);
    expect(perimeterLinearFt).toBe(64);
  });

  it('calculates triangular shape correctly', () => {
    const room: RoomItem = {
      id: '2',
      name: 'Gable',
      shape: 'triangle',
      length: 10,
      width: 6,
      unit: 'feet',
    };
    const { sqft } = calculateRoomSqft(room);
    expect(sqft).toBe(30);
  });

  it('calculates circle shape correctly', () => {
    const room: RoomItem = {
      id: '3',
      name: 'Patio',
      shape: 'circle',
      length: 14, // diameter = 14, radius = 7
      width: 14,
      radius: 7,
      unit: 'feet',
    };
    const { sqft } = calculateRoomSqft(room);
    expect(sqft).toBeCloseTo(Math.PI * 49, 1);
  });

  it('calculates L-shaped room correctly', () => {
    const room: RoomItem = {
      id: '4',
      name: 'L Room',
      shape: 'l-shape',
      length: 10,
      width: 12,
      length2: 8,
      width2: 14,
      unit: 'feet',
    };
    const { sqft } = calculateRoomSqft(room);
    expect(sqft).toBe(10 * 12 + 8 * 14); // 120 + 112 = 232
  });

  it('calculates multi-room grand totals with waste factor and unit conversions', () => {
    const rooms: RoomItem[] = [
      { id: '1', name: 'Bed 1', shape: 'rectangle', length: 10, width: 10, unit: 'feet' }, // 100
      { id: '2', name: 'Bed 2', shape: 'rectangle', length: 10, width: 10, unit: 'feet' }, // 100
    ];
    const res = calculateSquareFootage(rooms, 10, 3.5);

    expect(res.sqft).toBe(200);
    expect(res.sqftWithWaste).toBe(220); // 200 * 1.10
    expect(res.sqYards).toBeCloseTo(200 / 9, 2);
    expect(res.sqMeters).toBeCloseTo(200 * 0.092903, 2);
    expect(res.sqInches).toBe(200 * 144);
    expect(res.estimatedCost).toBe(700); // 200 * 3.5
    expect(res.estimatedCostWithWaste).toBe(770); // 220 * 3.5
    expect(res.roomBreakdowns).toHaveLength(2);
  });
});

