export interface StudCalculationInput {
  wallLengthFeet: number;
  wallHeightFeet: number; // 8, 9, 10, 12, or custom
  onCenterSpacingInches: 16 | 24;
  lumberSize: '2x4' | '2x6';
  cornersCount: number; // adds 3 studs per corner for California corners
  tJunctionsCount: number; // adds 2 studs per partition junction
  doorsCount: number; // adds 4 studs (2 king + 2 jack/trimmer)
  windowsCount: number; // adds 4 studs (2 king + 2 jack/cripples)
  plateType: 'double-top' | 'single-top'; // 3 plates vs 2 plates
  wastePercent: number; // 0, 5, 10, 15
  costPerStud?: number; // optional price per vertical stud
  costPerPlateBoard?: number; // optional price per 16-ft plate board
}

export interface StudCalculationResult {
  baseFieldStuds: number;
  cornerStuds: number;
  tJunctionStuds: number;
  roughOpeningStuds: number;
  subtotalStuds: number;
  wasteStuds: number;
  totalStudsToOrder: number;
  plateMultiplier: number;
  totalPlatesLinearFeet: number;
  plateBoards16Ft: number;
  studsCost?: number;
  platesCost?: number;
  totalLumberCost?: number;
}

export function calculateStudFraming(input: StudCalculationInput): StudCalculationResult {
  const wallLengthFeet = Math.max(0, input.wallLengthFeet || 0);
  const spacingInches = input.onCenterSpacingInches === 24 ? 24 : 16;
  const corners = Math.max(0, Math.floor(input.cornersCount || 0));
  const tJunctions = Math.max(0, Math.floor(input.tJunctionsCount || 0));
  const doors = Math.max(0, Math.floor(input.doorsCount || 0));
  const windows = Math.max(0, Math.floor(input.windowsCount || 0));
  const wastePct = Math.max(0, input.wastePercent || 0);

  // 1. Base Field Studs: length in inches / spacing + 1 (if length > 0)
  const lengthInches = wallLengthFeet * 12;
  const baseFieldStuds = wallLengthFeet > 0 ? Math.ceil(lengthInches / spacingInches) + 1 : 0;

  // 2. Corner studs: 3 studs per corner (California corner backing)
  const cornerStuds = corners * 3;

  // 3. T-junction studs: 2 studs per partition intersection
  const tJunctionStuds = tJunctions * 2;

  // 4. Rough opening studs: 4 studs per door or window (2 king + 2 jack)
  const roughOpeningStuds = (doors + windows) * 4;

  // 5. Subtotal vertical studs
  const subtotalStuds = baseFieldStuds + cornerStuds + tJunctionStuds + roughOpeningStuds;

  // 6. Waste calculation
  const totalWithWaste = subtotalStuds * (1 + wastePct / 100);
  const totalStudsToOrder = Math.ceil(totalWithWaste);
  const wasteStuds = Math.max(0, totalStudsToOrder - subtotalStuds);

  // 7. Horizontal Plates (Linear Feet and 16-ft stock boards)
  // Double top plate + single bottom plate = 3 plates. Single top plate + bottom = 2 plates.
  const plateMultiplier = input.plateType === 'single-top' ? 2 : 3;
  const totalPlatesLinearFeet = parseFloat((wallLengthFeet * plateMultiplier).toFixed(2));
  const plateBoards16Ft = totalPlatesLinearFeet > 0 ? Math.ceil(totalPlatesLinearFeet / 16) : 0;

  // 8. Cost calculations (optional)
  let studsCost: number | undefined;
  let platesCost: number | undefined;
  let totalLumberCost: number | undefined;

  if (input.costPerStud !== undefined && input.costPerStud > 0) {
    studsCost = parseFloat((totalStudsToOrder * input.costPerStud).toFixed(2));
  }

  if (input.costPerPlateBoard !== undefined && input.costPerPlateBoard > 0) {
    platesCost = parseFloat((plateBoards16Ft * input.costPerPlateBoard).toFixed(2));
  }

  if (studsCost !== undefined || platesCost !== undefined) {
    totalLumberCost = parseFloat(((studsCost || 0) + (platesCost || 0)).toFixed(2));
  }

  return {
    baseFieldStuds,
    cornerStuds,
    tJunctionStuds,
    roughOpeningStuds,
    subtotalStuds,
    wasteStuds,
    totalStudsToOrder,
    plateMultiplier,
    totalPlatesLinearFeet,
    plateBoards16Ft,
    studsCost,
    platesCost,
    totalLumberCost,
  };
}

