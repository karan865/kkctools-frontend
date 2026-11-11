import { describe, it, expect } from 'vitest';
import { calculatePaverSand } from './paver-sand-engine';

describe('Paver Sand Engine', () => {
  it('calculates 300 sq ft patio with 10% buffer accurately', () => {
    // 300 sq ft * (1 / 12) = 25 cu ft * 1.10 = 27.5 cu ft.
    // 27.5 / 27 = 1.02 cu yds.
    // 1.02 * 1.35 = 1.38 tons.
    // Joint sand: 300 / 85 * 1.10 = 3.88 -> 4 bags.
    const result = calculatePaverSand({
      areaSqFt: 300,
      beddingDepthInches: 1.0,
      includeJointSand: true,
      paverStyle: 'standard-brick',
      jointWidth: '1/8',
      bufferPercent: 10,
      beddingCostPerTon: 40,
      jointCostPerBag: 28,
    });

    expect(result.areaSqFt).toBe(300);
    expect(result.beddingCuFt).toBe(27.5);
    expect(result.beddingCubicYards).toBe(1.02);
    expect(result.beddingTons).toBe(1.38);
    expect(result.jointSandBags50Lb).toBe(4);
    expect(result.beddingCost).toBe(55.2);
    expect(result.jointCost).toBe(112);
    expect(result.totalCost).toBe(167.2);
  });

  it('matches worked example for 450 sq ft patio', () => {
    // 450 * (1/12) = 37.5 * 1.10 = 41.25 cu ft.
    // 41.25 / 27 = 1.53 cu yds.
    // 1.53 * 1.35 = 2.07 tons.
    // Joint sand: (450 / 85) * 1.10 = 5.82 -> 6 bags.
    const result = calculatePaverSand({
      areaSqFt: 450,
      beddingDepthInches: 1.0,
      includeJointSand: true,
      paverStyle: 'standard-brick',
      jointWidth: '1/8',
      bufferPercent: 10,
    });

    expect(result.beddingCuFt).toBe(41.25);
    expect(result.beddingCubicYards).toBe(1.53);
    expect(result.beddingTons).toBe(2.07);
    expect(result.jointSandBags50Lb).toBe(6);
  });

  it('handles bedding sand only without joint sand', () => {
    const result = calculatePaverSand({
      areaSqFt: 200,
      beddingDepthInches: 1.0,
      includeJointSand: false,
      paverStyle: 'standard-brick',
      jointWidth: '1/8',
      bufferPercent: 0,
    });

    expect(result.jointSandBags50Lb).toBe(0);
    expect(result.jointCost).toBeUndefined();
  });
});

