import { describe, it, expect } from 'vitest';
import { calculateTiles, TILE_PRESETS } from './tile-engine';

describe('Tile Calculator Engine', () => {
  it('calculates 12x12 standard tile for 100 sq ft room with 10% waste', () => {
    // 10x10 room = 100 sq ft, 12x12 tile (1.00 sq ft each), 10% waste
    const result = calculateTiles({
      mode: 'room',
      roomLengthFeet: 10,
      roomWidthFeet: 10,
      tilePresetId: 'tile12x12',
      wastePercentage: 10,
      tilesPerBox: 10,
    });

    expect(result.netAreaSqFt).toBe(100);
    expect(result.singleTileAreaSqFt).toBe(1.0);
    expect(result.baseTilesNeeded).toBe(100);
    // 100 * 1.10 = 110 tiles
    expect(result.totalTilesNeeded).toBe(110);
    expect(result.wasteTiles).toBe(10);
    // 110 / 10 = 11 boxes
    expect(result.boxesNeeded).toBe(11);
    expect(result.totalTilesInBoxes).toBe(110);
    expect(result.surplusTiles).toBe(0);
  });

  it('calculates classic 3x6 subway tile correctly (8 tiles per sq ft)', () => {
    // 30 sq ft backsplash, 3x6 subway tile, 10% waste, 80 tiles per box
    const result = calculateTiles({
      mode: 'direct',
      directAreaSqFt: 30,
      tilePresetId: 'subway3x6',
      wastePercentage: 10,
      tilesPerBox: 80,
    });

    expect(result.singleTileAreaSqFt).toBe(0.125); // (3*6)/144 = 18/144 = 0.125
    expect(result.tilesPerSqFt).toBe(8.0);
    // Base: 30 / 0.125 = 240 tiles
    expect(result.baseTilesNeeded).toBe(240);
    // With 10% waste: 240 * 1.10 = 264 tiles
    expect(result.totalTilesNeeded).toBe(264);
    // Boxes: ceil(264 / 80) = 4 boxes (320 tiles)
    expect(result.boxesNeeded).toBe(4);
    expect(result.surplusTiles).toBe(56);
  });

  it('calculates large format 12x24 tile correctly', () => {
    // 200 sq ft floor, 12x24 tile (2 sq ft each), 12% offset pattern waste, 8 tiles per box
    const result = calculateTiles({
      mode: 'direct',
      directAreaSqFt: 200,
      tilePresetId: 'tile12x24',
      wastePercentage: 12,
      tilesPerBox: 8,
    });

    expect(result.singleTileAreaSqFt).toBe(2.0);
    expect(result.tilesPerSqFt).toBe(0.5);
    expect(result.baseTilesNeeded).toBe(100);
    // 100 * 1.12 = 112 tiles
    expect(result.totalTilesNeeded).toBe(112);
    // Boxes: 112 / 8 = 14 boxes
    expect(result.boxesNeeded).toBe(14);
  });

  it('estimates thin-set mortar and grout bags properly', () => {
    // 120 sq ft room with 10% waste = 132 gross sq ft
    const result = calculateTiles({
      mode: 'direct',
      directAreaSqFt: 120,
      tilePresetId: 'tile12x12',
      wastePercentage: 10,
      includeInstallationMaterials: true,
    });

    // 132 / 60 = ceil(2.2) = 3 bags thinset
    expect(result.thinsetBags50lb).toBe(3);
    // 132 / 150 = ceil(0.88) = 1 bag grout
    expect(result.groutBags25lb).toBe(1);
    // Mortar cost = 3*28 + 1*20 = 84 + 20 = $104
    expect(result.mortarGroutCost).toBe(104.0);
  });

  it('computes material costs and pro installation benchmark savings', () => {
    const result = calculateTiles({
      mode: 'room',
      roomLengthFeet: 10,
      roomWidthFeet: 10,
      tilePresetId: 'tile12x12',
      wastePercentage: 10,
      tilesPerBox: 10,
      pricePerBox: 35.0, // 11 boxes * 35 = 385.00
    });

    expect(result.boxesNeeded).toBe(11);
    expect(result.tileMaterialCost).toBe(385.0);
    expect(result.totalDiyCost).toBe(385.0);
    // Pro range: 100 sq ft * ($7 - $15)
    expect(result.proEstimatedCostLow).toBe(700);
    expect(result.proEstimatedCostHigh).toBe(1500);
  });
});

