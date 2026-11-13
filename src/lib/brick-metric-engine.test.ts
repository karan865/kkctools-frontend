import { describe, it, expect } from 'vitest';
import { bricksPerSquareMetre, calculateMetricBricks, resolveMetricBrickSize } from './brick-metric-engine';

const wall = (lengthM: number, heightM: number, quantity = 1) => ({ id: 'w', name: 'Wall', lengthM, heightM, quantity });

describe('brick metric engine', () => {
  it('UK standard brick with 10 mm joints gives the familiar ~60 per m²', () => {
    expect(bricksPerSquareMetre(215, 65, 10)).toBeCloseTo(1 / (0.225 * 0.075), 6);
    expect(bricksPerSquareMetre(215, 65, 10)).toBeCloseTo(59.26, 2);
  });

  it('Australian standard brick gives ~48.5 per m²', () => {
    expect(bricksPerSquareMetre(230, 76, 10)).toBeCloseTo(48.45, 2);
  });

  it('half-brick 10 m² wall, no waste', () => {
    const r = calculateMetricBricks({ walls: [wall(5, 2)], presetId: 'ukStandard', jointMm: 10, wallType: 'half', wastePercentage: 0 });
    expect(r.netAreaM2).toBe(10);
    expect(r.baseBricks).toBe(593); // ceil(592.59)
    expect(r.totalBricks).toBe(593);
  });

  it('one-brick wall doubles the bricks', () => {
    const half = calculateMetricBricks({ walls: [wall(5, 2)], presetId: 'ukStandard', jointMm: 10, wallType: 'half', wastePercentage: 0 });
    const one = calculateMetricBricks({ walls: [wall(5, 2)], presetId: 'ukStandard', jointMm: 10, wallType: 'one', wastePercentage: 0 });
    expect(one.bricksPerM2Wall).toBeCloseTo(half.bricksPerM2Wall * 2, 2);
    expect(one.baseBricks).toBe(1186);
  });

  it('subtracts openings and adds waste', () => {
    const r = calculateMetricBricks({
      walls: [wall(5, 2.4)],
      openings: [{ id: 'd', name: 'Door', widthM: 0.9, heightM: 2.1, quantity: 1 }],
      presetId: 'ukStandard',
      jointMm: 10,
      wallType: 'half',
      wastePercentage: 5,
    });
    expect(r.netAreaM2).toBeCloseTo(12 - 1.89, 2);
    expect(r.totalBricks).toBe(Math.ceil(r.baseBricks * 1.05 - 1e-9));
    expect(r.wasteBricks).toBe(r.totalBricks - r.baseBricks);
  });

  it('mortar volume is the joint geometry per brick', () => {
    const r = calculateMetricBricks({ walls: [wall(1, 1)], presetId: 'ukStandard', jointMm: 10, wallType: 'half', wastePercentage: 0 });
    // 60 bricks × 0.1025 × 0.01 × (0.225 + 0.065) m³
    expect(r.mortarM3).toBeCloseTo(60 * 0.1025 * 0.01 * 0.29, 3);
    expect(r.mortarBags).toBeNull();
  });

  it('bag count only when a bag yield is given', () => {
    const r = calculateMetricBricks({ walls: [wall(10, 2)], presetId: 'ukStandard', jointMm: 10, wallType: 'half', wastePercentage: 0, mortarBagYieldLitres: 12.5 });
    expect(r.mortarBags).toBe(Math.ceil(r.mortarLitres / 12.5 - 1e-9));
  });

  it('flags openings larger than the wall and never goes negative', () => {
    const r = calculateMetricBricks({
      walls: [wall(1, 1)],
      openings: [{ id: 'o', name: 'Big', widthM: 2, heightM: 2, quantity: 1 }],
      presetId: 'ukStandard',
      jointMm: 10,
      wallType: 'half',
      wastePercentage: 10,
    });
    expect(r.isOpeningExceeded).toBe(true);
    expect(r.netAreaM2).toBe(0);
    expect(r.totalBricks).toBe(0);
  });

  it('custom size falls back to UK standard when fields are empty', () => {
    expect(resolveMetricBrickSize({ presetId: 'custom' })).toEqual({ lengthMm: 215, heightMm: 65, widthMm: 102.5 });
    expect(resolveMetricBrickSize({ presetId: 'custom', customLengthMm: 240, customHeightMm: 71, customWidthMm: 115 })).toEqual({ lengthMm: 240, heightMm: 71, widthMm: 115 });
  });

  it('packs and cost', () => {
    const r = calculateMetricBricks({ walls: [wall(10, 2.5)], presetId: 'ukStandard', jointMm: 10, wallType: 'half', wastePercentage: 5, bricksPerPack: 400, pricePerBrick: 0.8 });
    expect(r.packsRounded).toBe(Math.ceil(r.totalBricks / 400));
    expect(r.totalBrickCost).toBeCloseTo(r.totalBricks * 0.8, 2);
  });
});
