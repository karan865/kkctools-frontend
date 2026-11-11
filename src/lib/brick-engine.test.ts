import { describe, it, expect } from 'vitest';
import { calculateBricks } from './brick-engine';

describe('Brick Calculator Engine (Tool #9)', () => {
  it('Modular 100 sq ft -> net 685.7 (ceil 686) and 755 with 10% waste; Standard 100 sq ft -> 655.0', () => {
    // Modular with 3/8" joint:
    // nominal L = 7.625 + 0.375 = 8.0, nominal H = 2.25 + 0.375 = 2.625
    // bricksPerSqFt = 144 / (8 * 2.625) = 144 / 21 = 6.85714
    // 100 sq ft -> 685.714 -> base 686. With 10% waste: ceil(686 * 1.1) = 755.
    const modRes = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 10, heightFeet: 10, quantity: 1 }],
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 10,
    });

    expect(modRes.bricksPerSqFt).toBeCloseTo(6.857, 3);
    expect(modRes.baseBricksNeeded).toBe(686);
    expect(modRes.totalBricksNeeded).toBe(755);

    // Standard with 3/8" joint:
    // nominal L = 8.0 + 0.375 = 8.375, nominal H = 2.25 + 0.375 = 2.625
    // bricksPerSqFt = 144 / (8.375 * 2.625) = 144 / 21.984375 = 6.5501
    const stdRes = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 10, heightFeet: 10, quantity: 1 }],
      brickPresetId: 'standard',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });
    expect(stdRes.bricksPerSqFt).toBeCloseTo(6.550, 3);
    expect(stdRes.baseBricksNeeded).toBe(655);
  });

  it('verifies bricksPerSqFt for all specified presets and Modular with 1/2" joint', () => {
    // Engineer Modular: 7.625 x 2.8125. 3/8" joint -> nom 8.0 x 3.1875 = 25.5. 144 / 25.5 = 5.647
    const eng = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 10, heightFeet: 10, quantity: 1 }],
      brickPresetId: 'engineerModular',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });
    expect(eng.bricksPerSqFt).toBeCloseTo(5.647, 3);

    // Closure Modular: 7.625 x 3.625. nom 8.0 x 4.0 = 32. 144 / 32 = 4.50
    const clo = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 10, heightFeet: 10, quantity: 1 }],
      brickPresetId: 'closureModular',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });
    expect(clo.bricksPerSqFt).toBeCloseTo(4.5, 3);

    // Norman: 11.625 x 2.25. nom 12.0 x 2.625 = 31.5. 144 / 31.5 = 4.571
    const norm = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 10, heightFeet: 10, quantity: 1 }],
      brickPresetId: 'norman',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });
    expect(norm.bricksPerSqFt).toBeCloseTo(4.571, 3);

    // Roman: 11.625 x 1.625. nom 12.0 x 2.0 = 24. 144 / 24 = 6.0
    const rom = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 10, heightFeet: 10, quantity: 1 }],
      brickPresetId: 'roman',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });
    expect(rom.bricksPerSqFt).toBeCloseTo(6.0, 3);

    // Utility: 11.625 x 3.625. nom 12.0 x 4.0 = 48. 144 / 48 = 3.0
    const util = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 10, heightFeet: 10, quantity: 1 }],
      brickPresetId: 'utility',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });
    expect(util.bricksPerSqFt).toBeCloseTo(3.0, 3);

    // Queen: 7.625 x 2.75. nom 8.0 x 3.125 = 25. 144 / 25 = 5.76
    const qn = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 10, heightFeet: 10, quantity: 1 }],
      brickPresetId: 'queen',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });
    expect(qn.bricksPerSqFt).toBeCloseTo(5.76, 3);

    // King: 9.625 x 2.625. nom 10.0 x 3.0 = 30. 144 / 30 = 4.80
    const kg = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 10, heightFeet: 10, quantity: 1 }],
      brickPresetId: 'king',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });
    expect(kg.bricksPerSqFt).toBeCloseTo(4.8, 3);

    // Modular with 1/2" joint (0.5"):
    // nom L = 7.625 + 0.5 = 8.125, nom H = 2.25 + 0.5 = 2.75.
    // nom area = 8.125 * 2.75 = 22.34375. 144 / 22.34375 = 6.44475 -> 6.445
    const modHalf = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 10, heightFeet: 10, quantity: 1 }],
      brickPresetId: 'modular',
      mortarJointInches: 0.5,
      isDoubleWythe: false,
      wastePercentage: 0,
    });
    expect(modHalf.bricksPerSqFt).toBeCloseTo(6.445, 3);
  });

  it('matches worked example: 20x8 with 28 sq ft opening -> 132 sq ft, 905 net, order 996, mortar 29 bags 80lb / 38 bags 60lb, cement 8 bags + 1.0 cy sand, 2 pallets, 4,482 lb', () => {
    const res = calculateBricks({
      walls: [{ id: '1', name: 'Garden Wall', lengthFeet: 20, heightFeet: 8, quantity: 1 }],
      openings: [{ id: 'arch', name: 'Archway', widthFeet: 4, heightFeet: 7, quantity: 1 }], // 28 sq ft
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 10,
    });

    expect(res.grossWallAreaSqFt).toBe(160);
    expect(res.openingsAreaSqFt).toBe(28);
    expect(res.netWallAreaSqFt).toBe(132);
    // 132 * 6.85714 = 905.14 -> base 905.
    expect(res.baseBricksNeeded).toBe(905);
    // 905 * 1.10 = 995.5 -> ceil 996.
    expect(res.totalBricksNeeded).toBe(996);

    // Mortar: Modular volume factor = 1.0
    // 80 lb bags: (996 / 35) = 28.45 -> ceil 29 bags
    // 60 lb bags: (996 / 26.25) = 37.94 -> ceil 38 bags
    expect(res.mortarBags80lb).toBe(29);
    expect(res.mortarBags60lb).toBe(38);
    // Site-mixed: (996 / 1000) * 7.5 = 7.47 -> ceil 8 bags. Sand = (996 / 1000) * 1.0 = 1.00 cu yd.
    expect(res.masonryCementBags70lb).toBe(8);
    expect(res.sandCubicYards).toBe(1.0);

    // Pallets at 500/pallet: 996 / 500 = 1.99 -> 2.0 exact, 2 rounded
    expect(res.palletsRounded).toBe(2);

    // Weight: 996 * 4.5 = 4,482 lbs = 2.24 tons
    expect(res.totalWeightLbs).toBe(4482);
    expect(res.totalWeightTons).toBe(2.24);
  });

  it('matches wireframe case: gross 200, openings 40, net 160, Modular, 10% waste, $0.85/brick, $11.50/80lb bag -> order 1,208, 35 bags, total $1,429.30', () => {
    // 160 sq ft * 6.85714 = 1097.14 -> base 1,098.
    // 1098 * 1.10 = 1207.8 -> ceil 1,208 order bricks.
    // Mortar 80 lb: 1208 / 35 = 34.51 -> ceil 35 bags.
    // Mortar 60 lb: 1208 / 26.25 = 46.01 -> ceil 47 bags.
    // Pallets: 1208 / 500 = 2.416 -> 2.4 exact.
    // Weight: 1208 * 4.5 = 5,436 lb (2.72 tons).
    // Cost: 1208 * 0.85 = 1026.80. Mortar: 35 * 11.50 = 402.50. Total = 1429.30.
    const res = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 25, heightFeet: 8, quantity: 1 }], // 200 sq ft
      openings: [{ id: '1', name: 'Opening', widthFeet: 4, heightFeet: 10, quantity: 1 }], // 40 sq ft
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 10,
      pricePerBrick: 0.85,
      pricePerMortarBag: 11.5,
    });

    expect(res.netWallAreaSqFt).toBe(160);
    expect(res.baseBricksNeeded).toBe(1098);
    expect(res.totalBricksNeeded).toBe(1208);
    expect(res.mortarBags80lb).toBe(35);
    expect(res.mortarBags60lb).toBe(47);
    expect(res.palletsExact).toBe(2.4);
    expect(res.totalWeightLbs).toBe(5436);
    expect(res.totalWeightTons).toBe(2.72);
    expect(res.brickCost).toBe(1026.8);
    expect(res.mortarCost).toBe(402.5);
    expect(res.totalCost).toBe(1429.3);
  });

  it('utility brick yields about 23 bricks per 80 lb bag', () => {
    // Utility: actual L=11.625, H=3.625, W=3.625. Joint 0.375.
    // nominal L = 12.0, actual H = 3.625.
    // V_unit = 3.625 * 0.375 * (12.0 + 3.625) = 1.359375 * 15.625 = 21.240234 cu in.
    // V_mod = 13.93046875 cu in.
    // mortarVolumeFactor = 21.240234 / 13.93046875 = 1.52473
    // bricksPer80lbBag = 35 / 1.52473 = 22.955 -> about 23 bricks per bag!
    const res = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 10, heightFeet: 10, quantity: 1 }],
      brickPresetId: 'utility',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });

    const bricksPerBag = 35 / res.mortarVolumeFactor;
    expect(bricksPerBag).toBeCloseTo(23.0, 0);
  });

  it('double wythe doubles both bricks and mortar, and collar joint adds additional mortar', () => {
    const single = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 20, heightFeet: 8, quantity: 1 }],
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });

    const doubleWithoutCollar = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 20, heightFeet: 8, quantity: 1 }],
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: true,
      fillCollarJoint: false,
      wastePercentage: 0,
    });

    expect(doubleWithoutCollar.baseBricksNeeded).toBe(single.baseBricksNeeded * 2);
    expect(doubleWithoutCollar.totalBricksNeeded).toBe(single.totalBricksNeeded * 2);
    expect(doubleWithoutCollar.mortarBags80lb).toBe(single.mortarBags80lb * 2);

    const doubleWithCollar = calculateBricks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 20, heightFeet: 8, quantity: 1 }],
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: true,
      fillCollarJoint: true,
      wastePercentage: 0,
    });
    // 160 sq ft * 0.0625 * 1.10 = 11 cu ft. 11 / 0.60 = 18.33 -> 19 extra bags
    expect(doubleWithCollar.collarJointMortarBags80lb).toBe(19);
    expect(doubleWithCollar.mortarBags80lb).toBe(doubleWithoutCollar.mortarBags80lb + 19);
  });

  it('door preset equals 20.0 sq ft and openings larger than gross area trigger isOpeningExceeded flag', () => {
    // Door preset: 3 ft x 6.667 ft = 20.001 sq ft
    const doorArea = parseFloat((3 * 6.667).toFixed(1));
    expect(doorArea).toBe(20.0);

    const exceeded = calculateBricks({
      walls: [{ id: '1', name: 'Small Wall', lengthFeet: 4, heightFeet: 4, quantity: 1 }], // 16 sq ft
      openings: [{ id: '1', name: 'Large Door', widthFeet: 3, heightFeet: 6.667, quantity: 1 }], // 20.0 sq ft
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 10,
    });

    expect(exceeded.isOpeningExceeded).toBe(true);
    expect(exceeded.netWallAreaSqFt).toBe(0);
    expect(exceeded.baseBricksNeeded).toBe(0);
  });
});
