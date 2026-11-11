/**
 * Stud / Wall Framing Calculator Engine (Tool #14)
 * Pure mathematical engine - 100% client-side, zero network dependencies.
 */

export const STUD_ENGINE_CONFIG = {
  CORNER_EXTRA: 2, // 3-stud assembly, 1 already in field studs, net +2
  T_JUNCTION_EXTRA: 2, // 2 extra studs per partition intersection
  OPENING_STUDS: 4, // 2 king + 2 jack per door or window
  HEADER_BOARDS_PER_OPENING: 2, // 2 boards per rough opening
  PLATE_BOARD_FT: 16, // standard 16-ft stock plate lumber
} as const;

export type HeightChoice = '8' | '9' | '10' | '12' | 'custom';
export type SpacingChoice = 16 | 24;
export type LumberSize = '2x4' | '2x6';
export type PlateConfig = 'double' | 'single';
export type WastePercent = 5 | 10 | 15;

export interface StudCalculationInput {
  lengthFt: number;
  lengthIn?: number;
  heightChoice: HeightChoice;
  customHeightIn?: number;
  spacing: SpacingChoice;
  lumber: LumberSize;
  corners: number;
  tJunctions: number;
  doors: number;
  windows: number;
  plateConfig: PlateConfig;
  wastePct: WastePercent;
  studPrice?: number;
  bottomPlatePrice?: number;
  topPlatePrice?: number;
  laborPerLf?: number;
}

export interface StudCalculationResult {
  totalLengthIn: number;
  totalLengthFt: number;
  heightFt: number;
  wallAreaSqFt: number;
  fieldStuds: number;
  cornerStuds: number;
  tStuds: number;
  openingStuds: number;
  headerBoards: number;
  subtotal: number;
  totalStuds: number;
  wasteStuds: number;
  plateLayers: number;
  totalPlateLf: number;
  bottomBoards: number;
  topBoards: number;
  totalPlateBoards: number;
  studLengthOutput: string;
  recommendedStockLength: string;
  // Cost outputs (only populated when respective prices are valid and > 0)
  studsCost?: number;
  bottomPlatesCost?: number;
  topPlatesCost?: number;
  laborCost?: number;
  grandTotalCost?: number;
  costPerSqFt?: number;
}

/**
 * Pure calculation function for stud wall framing.
 */
export function calculateStuds(input: StudCalculationInput): StudCalculationResult {
  const safeLengthFt = Math.max(0, input.lengthFt || 0);
  const safeLengthIn = Math.max(0, input.lengthIn || 0);
  const totalLengthIn = safeLengthFt * 12 + safeLengthIn;
  const totalLengthFt = totalLengthIn / 12;

  const spacing = input.spacing === 24 ? 24 : 16;
  const corners = Math.max(0, Math.floor(input.corners || 0));
  const tJunctions = Math.max(0, Math.floor(input.tJunctions || 0));
  const doors = Math.max(0, Math.floor(input.doors || 0));
  const windows = Math.max(0, Math.floor(input.windows || 0));
  const wastePct = (input.wastePct === 5 || input.wastePct === 15) ? input.wastePct : 10;
  const plateLayers = input.plateConfig === 'single' ? 2 : 3;

  // Determine wall height in feet and inches
  let heightIn = 96; // 8 ft default
  if (input.heightChoice === '9') heightIn = 108;
  else if (input.heightChoice === '10') heightIn = 120;
  else if (input.heightChoice === '12') heightIn = 144;
  else if (input.heightChoice === 'custom') {
    heightIn = Math.max(12, input.customHeightIn || 96);
  }
  const heightFt = heightIn / 12;
  const wallAreaSqFt = parseFloat((totalLengthFt * heightFt).toFixed(2));

  // 1. Field Studs: ceil(totalLengthIn / spacing) + 1 (if length > 0)
  const fieldStuds = totalLengthIn > 0 ? Math.ceil(totalLengthIn / spacing) + 1 : 0;

  // 2. Corner Studs: net +2 per corner
  const cornerStuds = corners * STUD_ENGINE_CONFIG.CORNER_EXTRA;

  // 3. T-Junction Studs: net +2 per T-wall
  const tStuds = tJunctions * STUD_ENGINE_CONFIG.T_JUNCTION_EXTRA;

  // 4. Rough Opening Studs: 4 per door/window (2 king + 2 jack)
  const openingStuds = (doors + windows) * STUD_ENGINE_CONFIG.OPENING_STUDS;

  // 5. Subtotal vertical studs
  const subtotal = fieldStuds + cornerStuds + tStuds + openingStuds;

  // 6. Total Studs with Waste: INTEGER math strictly: Math.ceil(subtotal * (100 + wastePct) / 100)
  // This avoids float bugs like ceil(50 * 1.10) === 56
  const totalStuds = Math.ceil((subtotal * (100 + wastePct)) / 100);
  const wasteStuds = Math.max(0, totalStuds - subtotal);

  // 7. Horizontal Plates (16-ft stock boards)
  const totalPlateLf = parseFloat((totalLengthFt * plateLayers).toFixed(2));
  const bottomBoards = totalLengthFt > 0 ? Math.ceil(totalLengthFt / STUD_ENGINE_CONFIG.PLATE_BOARD_FT) : 0;
  const topBoards = totalLengthFt > 0 ? Math.ceil((totalLengthFt * (plateLayers - 1)) / STUD_ENGINE_CONFIG.PLATE_BOARD_FT) : 0;
  const totalPlateBoards = bottomBoards + topBoards;

  // 8. Header boards: 2 per opening
  const headerBoards = (doors + windows) * STUD_ENGINE_CONFIG.HEADER_BOARDS_PER_OPENING;

  // 9. Stud length recommendation
  let studLengthOutput = '92-5/8" precut stud';
  let recommendedStockLength = '8-ft precut (92-5/8")';

  if (input.heightChoice === '8') {
    studLengthOutput = '92-5/8" precut stud';
    recommendedStockLength = '8-ft precut (92-5/8")';
  } else if (input.heightChoice === '9') {
    studLengthOutput = '104-5/8" precut stud';
    recommendedStockLength = '9-ft precut (104-5/8")';
  } else if (input.heightChoice === '10') {
    studLengthOutput = '116-5/8" precut stud';
    recommendedStockLength = '10-ft precut (116-5/8")';
  } else if (input.heightChoice === '12') {
    studLengthOutput = '12-ft (144") stud, trim to fit';
    recommendedStockLength = '12-ft lumber (trim to fit)';
  } else if (input.heightChoice === 'custom') {
    const plateThickness = plateLayers * 1.5;
    const cutLengthIn = Math.max(0, heightIn - plateThickness);
    // Recommend next even-foot stock length rounded up
    const stockFt = Math.max(8, Math.ceil(heightIn / 24) * 2);
    studLengthOutput = `Cut to ${cutLengthIn.toFixed(1)}" (trim from ${stockFt}-ft stock)`;
    recommendedStockLength = `${stockFt}-ft stock lumber`;
  }

  // 10. Cost Calculations (optional)
  let studsCost: number | undefined;
  let bottomPlatesCost: number | undefined;
  let topPlatesCost: number | undefined;
  let laborCost: number | undefined;
  let grandTotalCost: number | undefined;
  let costPerSqFt: number | undefined;

  const validStudPrice = typeof input.studPrice === 'number' && input.studPrice > 0 ? input.studPrice : undefined;
  const validBottomPrice = typeof input.bottomPlatePrice === 'number' && input.bottomPlatePrice > 0 ? input.bottomPlatePrice : undefined;
  const validTopPrice = typeof input.topPlatePrice === 'number' && input.topPlatePrice > 0 ? input.topPlatePrice : undefined;
  const validLaborPerLf = typeof input.laborPerLf === 'number' && input.laborPerLf > 0 ? input.laborPerLf : undefined;

  if (validStudPrice !== undefined) {
    studsCost = parseFloat((totalStuds * validStudPrice).toFixed(2));
  }
  if (validBottomPrice !== undefined) {
    bottomPlatesCost = parseFloat((bottomBoards * validBottomPrice).toFixed(2));
  }
  if (validTopPrice !== undefined) {
    topPlatesCost = parseFloat((topBoards * validTopPrice).toFixed(2));
  }
  if (validLaborPerLf !== undefined) {
    laborCost = parseFloat((totalLengthFt * validLaborPerLf).toFixed(2));
  }

  const costComponents = [studsCost, bottomPlatesCost, topPlatesCost, laborCost].filter((c): c is number => c !== undefined);
  if (costComponents.length > 0) {
    grandTotalCost = parseFloat(costComponents.reduce((sum, val) => sum + val, 0).toFixed(2));
    if (wallAreaSqFt > 0 && grandTotalCost > 0) {
      costPerSqFt = parseFloat((grandTotalCost / wallAreaSqFt).toFixed(2));
    }
  }

  return {
    totalLengthIn,
    totalLengthFt,
    heightFt,
    wallAreaSqFt,
    fieldStuds,
    cornerStuds,
    tStuds,
    openingStuds,
    headerBoards,
    subtotal,
    totalStuds,
    wasteStuds,
    plateLayers,
    totalPlateLf,
    bottomBoards,
    topBoards,
    totalPlateBoards,
    studLengthOutput,
    recommendedStockLength,
    studsCost,
    bottomPlatesCost,
    topPlatesCost,
    laborCost,
    grandTotalCost,
    costPerSqFt,
  };
}
