/**
 * Drywall (sheetrock / plasterboard) quantity engine.
 *
 * Storage units: metres for lengths, m² for areas, litres for compound. The UI
 * converts to feet/inches or metres/centimetres for display only, so switching
 * unit systems never changes the physical size of a room.
 *
 * Rates and their sources (see the page's "Sources" section):
 * - Joint compound: ≈ 10 gal per 1,000 sq ft of panels for a three-coat finish
 *   (USG Sheetrock Brand All Purpose Joint Compound submittal sheet J1969, rev. 10-16).
 * - Paper joint tape: ≈ 350 linear ft per 1,000 sq ft of board
 *   (Georgia-Pacific DensArmor Plus "WallWorks Guide", 2011).
 * - Screw spacing (defaults): ceilings 12 in o.c.; walls 16 in o.c. on 16 in framing,
 *   12 in o.c. on 24 in framing (IRC Table R702.3.5 as summarised by local building
 *   departments). Users can override spacing for other codes (e.g. UK/EU systems).
 * - Board weights (nominal): regular 1/2 in ≈ 1.6 lb/sq ft, lightweight 1/2 in ≈ 1.25 lb/sq ft,
 *   Type X 5/8 in ≈ 2.2 lb/sq ft (USG product literature).
 */

// ---------- unit constants ----------
export const M_PER_FT = 0.3048;
export const M_PER_IN = 0.0254;
export const M2_PER_FT2 = M_PER_FT * M_PER_FT; // 0.09290304
export const L_PER_GAL = 3.785411784;
export const KG_PER_LB = 0.45359237;

export type UnitSystem = 'imperial' | 'metric';

const ft = (v: number) => v * M_PER_FT;
const inch = (v: number) => v * M_PER_IN;
const pos = (v: number | undefined) => (typeof v === 'number' && isFinite(v) && v > 0 ? v : 0);

// ---------- sourced rates ----------
/** Paper tape: 350 linear ft per 1,000 sq ft of board (Georgia-Pacific). */
export const TAPE_FT_PER_SQFT = 350 / 1000;
export const TAPE_M_PER_M2 = (TAPE_FT_PER_SQFT * M_PER_FT) / M2_PER_FT2; // ≈ 1.148 m per m²

/** Ready-mix all-purpose compound: 10 gal per 1,000 sq ft, three coats (USG). */
export const COMPOUND_GAL_PER_SQFT = 10 / 1000;
export const COMPOUND_L_PER_M2 = (COMPOUND_GAL_PER_SQFT * L_PER_GAL) / M2_PER_FT2; // ≈ 0.407 L per m²

export const PAIL_GAL = 4.5; // USG packaging: 4.5 gal pail
export const CARTON_GAL = 3.5; // USG packaging: 3.5 gal carton

// ---------- sheets ----------
export interface SheetSpec {
  id: string;
  label: string;
  system: UnitSystem;
  widthM: number;
  lengthM: number;
}

export const SHEETS: SheetSpec[] = [
  { id: 'ft4x8', label: '4×8 ft', system: 'imperial', widthM: ft(4), lengthM: ft(8) },
  { id: 'ft4x9', label: '4×9 ft', system: 'imperial', widthM: ft(4), lengthM: ft(9) },
  { id: 'ft4x10', label: '4×10 ft', system: 'imperial', widthM: ft(4), lengthM: ft(10) },
  { id: 'ft4x12', label: '4×12 ft', system: 'imperial', widthM: ft(4), lengthM: ft(12) },
  { id: 'ft4x14', label: '4×14 ft', system: 'imperial', widthM: ft(4), lengthM: ft(14) },
  { id: 'ft4x16', label: '4×16 ft', system: 'imperial', widthM: ft(4), lengthM: ft(16) },
  { id: 'mm1200x2400', label: '1200×2400 mm', system: 'metric', widthM: 1.2, lengthM: 2.4 },
  { id: 'mm1200x2700', label: '1200×2700 mm', system: 'metric', widthM: 1.2, lengthM: 2.7 },
  { id: 'mm1200x3000', label: '1200×3000 mm', system: 'metric', widthM: 1.2, lengthM: 3.0 },
];

export const sheetById = (id: string): SheetSpec => SHEETS.find((s) => s.id === id) || SHEETS[0];
export const sheetAreaM2 = (s: SheetSpec) => s.widthM * s.lengthM;

/** Closest sheet in the other unit system (used when the user switches units). */
export function equivalentSheet(id: string, system: UnitSystem): SheetSpec {
  const current = sheetById(id);
  if (current.system === system) return current;
  const candidates = SHEETS.filter((s) => s.system === system);
  return candidates.reduce((best, s) =>
    Math.abs(s.lengthM - current.lengthM) < Math.abs(best.lengthM - current.lengthM) ? s : best,
  );
}

// ---------- framing & screws ----------
export type FramingKey = 'narrow' | 'wide'; // 16 in / 400 mm  vs  24 in / 600 mm

export function framingSpacingM(key: FramingKey, system: UnitSystem): number {
  if (system === 'metric') return key === 'narrow' ? 0.4 : 0.6;
  return key === 'narrow' ? inch(16) : inch(24);
}

/** Default screw spacing per IRC Table R702.3.5 (metric uses the nearest round mm). */
export function defaultScrewSpacingM(surface: 'wall' | 'ceiling', framing: FramingKey, system: UnitSystem) {
  const twelve = system === 'metric' ? 0.3 : inch(12);
  const sixteen = system === 'metric' ? 0.4 : inch(16);
  if (surface === 'ceiling') return twelve;
  return framing === 'narrow' ? sixteen : twelve;
}

/**
 * Screws for one sheet hung across the framing (long edge perpendicular to studs/joists):
 * framing lines crossed × screws along each line (edge to edge).
 */
export function screwsPerSheet(sheet: SheetSpec, framingM: number, screwSpacingM: number): number {
  if (!(framingM > 0) || !(screwSpacingM > 0)) return 0;
  const lines = Math.floor(sheet.lengthM / framingM + 1e-9) + 1;
  const perLine = Math.ceil(sheet.widthM / screwSpacingM - 1e-9) + 1;
  return lines * perLine;
}

// ---------- board weights ----------
export interface BoardSpec {
  id: string;
  label: string;
  lbPerSqFt: number;
}

export const BOARDS: BoardSpec[] = [
  { id: 'regular12', label: 'Regular ½″ (12.7 mm)', lbPerSqFt: 1.6 },
  { id: 'light12', label: 'Lightweight ½″ (12.7 mm)', lbPerSqFt: 1.25 },
  { id: 'typeX58', label: 'Fire-rated Type X ⅝″ (15.9 mm)', lbPerSqFt: 2.2 },
];

export const boardKgPerM2 = (lbPerSqFt: number) => (lbPerSqFt * KG_PER_LB) / M2_PER_FT2;

// ---------- tape rolls & corner bead ----------
export const TAPE_ROLLS = [
  { id: 'r75', ft: 75, label: '75 ft (23 m)' },
  { id: 'r250', ft: 250, label: '250 ft (76 m)' },
  { id: 'r500', ft: 500, label: '500 ft (152 m)' },
].map((r) => ({ ...r, lengthM: ft(r.ft) }));

export const BEAD_PIECES = [
  { id: 'b8', label: '8 ft (2.44 m)', lengthM: ft(8) },
  { id: 'b10', label: '10 ft (3.05 m)', lengthM: ft(10) },
];

// ---------- surfaces ----------
export type SurfaceKind = 'room' | 'wall' | 'ceiling' | 'gable' | 'area';

export interface Opening {
  count: number;
  width: number; // m
  height: number; // m
}

export interface SurfaceItem {
  id: string;
  kind: SurfaceKind;
  /** room: length · wall: length · ceiling: length · gable: base */
  length: number;
  /** room & ceiling: width */
  width: number;
  /** room & wall: height · gable: rise (peak height above the wall plate) */
  height: number;
  /** area kind: area in m² */
  area: number;
  includeWalls: boolean;
  includeCeiling: boolean;
  /** area kind: true = ceiling surface (screws at ceiling spacing) */
  areaOnCeiling: boolean;
  doors: Opening;
  windows: Opening;
  qty: number;
}

export interface SurfaceKindSpec {
  kind: SurfaceKind;
  label: string;
  short: string;
  hint: string;
}

export const SURFACE_KINDS: SurfaceKindSpec[] = [
  { kind: 'room', label: 'Whole room', short: 'Room', hint: 'Four walls, plus the ceiling if you want it.' },
  { kind: 'wall', label: 'Single wall', short: 'Wall', hint: 'One wall, e.g. a partition or accent wall.' },
  { kind: 'ceiling', label: 'Ceiling only', short: 'Ceiling', hint: 'A flat ceiling, measured from wall to wall.' },
  { kind: 'gable', label: 'Gable end (triangle)', short: 'Gable', hint: 'The triangle above a wall under a pitched roof.' },
  { kind: 'area', label: 'Known area', short: 'Area', hint: 'Type a square footage from plans or another tool.' },
];

export const DEFAULT_DOOR = { width: inch(36), height: inch(80) };
export const DEFAULT_WINDOW = { width: inch(36), height: inch(48) };

export function defaultSurface(kind: SurfaceKind, id: string): SurfaceItem {
  const base: SurfaceItem = {
    id,
    kind,
    length: ft(12),
    width: ft(12),
    height: ft(8),
    area: 100 * M2_PER_FT2,
    includeWalls: true,
    includeCeiling: true,
    areaOnCeiling: false,
    doors: { count: 0, ...DEFAULT_DOOR },
    windows: { count: 0, ...DEFAULT_WINDOW },
    qty: 1,
  };
  if (kind === 'room') return { ...base, doors: { count: 1, ...DEFAULT_DOOR }, windows: { count: 1, ...DEFAULT_WINDOW } };
  if (kind === 'gable') return { ...base, length: ft(24), height: ft(6) };
  return base;
}

/** Example room sizes for quick fill (length × width × wall height, feet). */
export const ROOM_PRESETS = [
  { id: 'p10', label: 'Small bedroom 10×10, 8 ft walls', l: 10, w: 10, h: 8 },
  { id: 'p12', label: 'Bedroom 12×12, 8 ft walls', l: 12, w: 12, h: 8 },
  { id: 'p14', label: 'Main bedroom 14×16, 9 ft walls', l: 14, w: 16, h: 9 },
  { id: 'p8', label: 'Bathroom 8×10, 8 ft walls', l: 8, w: 10, h: 8 },
  { id: 'p16', label: 'Living room 16×20, 9 ft walls', l: 16, w: 20, h: 9 },
  { id: 'p22', label: 'One-car garage 12×22, 10 ft walls', l: 12, w: 22, h: 10 },
].map((p) => ({ ...p, lengthM: ft(p.l), widthM: ft(p.w), heightM: ft(p.h) }));

export interface SurfaceAreas {
  wallGrossM2: number;
  openingsM2: number;
  wallNetM2: number;
  ceilingM2: number;
}

const openingArea = (o: Opening) => Math.floor(pos(o.count)) * pos(o.width) * pos(o.height);

/** Areas for ONE unit of a surface (before quantity). */
export function surfaceAreas(s: SurfaceItem): SurfaceAreas {
  let wallGross = 0;
  let ceiling = 0;
  let canHaveOpenings = false;
  switch (s.kind) {
    case 'room':
      if (s.includeWalls) {
        wallGross = 2 * (pos(s.length) + pos(s.width)) * pos(s.height);
        canHaveOpenings = true;
      }
      if (s.includeCeiling) ceiling = pos(s.length) * pos(s.width);
      break;
    case 'wall':
      wallGross = pos(s.length) * pos(s.height);
      canHaveOpenings = true;
      break;
    case 'ceiling':
      ceiling = pos(s.length) * pos(s.width);
      break;
    case 'gable':
      wallGross = 0.5 * pos(s.length) * pos(s.height);
      break;
    case 'area':
      if (s.areaOnCeiling) ceiling = pos(s.area);
      else wallGross = pos(s.area);
      break;
  }
  const openings = canHaveOpenings ? Math.min(wallGross, openingArea(s.doors) + openingArea(s.windows)) : 0;
  return { wallGrossM2: wallGross, openingsM2: openings, wallNetM2: wallGross - openings, ceilingM2: ceiling };
}

// ---------- job ----------
export interface DrywallInput {
  items: SurfaceItem[];
  sheetId: string;
  wastePercent: number;
  framingM: number;
  wallScrewSpacingM: number;
  ceilingScrewSpacingM: number;
  tapeRollM: number;
  cornerBeadM: number;
  beadPieceM: number;
  boardLbPerSqFt: number;
}

export interface DrywallResult {
  items: { id: string; wallNetM2: number; ceilingM2: number; openingsM2: number; totalM2: number }[];
  wallGrossM2: number;
  openingsM2: number;
  wallNetM2: number;
  ceilingM2: number;
  netM2: number;
  orderM2: number;
  sheet: SheetSpec;
  sheets: number;
  sheetsBySize: { id: string; label: string; system: UnitSystem; sheets: number }[];
  screwsPerWallSheet: number;
  screwsPerCeilingSheet: number;
  screwsWall: number;
  screwsCeiling: number;
  screws: number;
  tapeM: number;
  tapeRolls: number;
  compoundL: number;
  compoundGal: number;
  pails: number;
  cartons: number;
  beadPieces: number;
  weightKg: number;
}

const ceilUp = (v: number) => (v > 0 ? Math.ceil(v - 1e-9) : 0);

export function sheetsFor(areaM2: number, wasteFraction: number, sheet: SheetSpec): number {
  return ceilUp((pos(areaM2) * (1 + wasteFraction)) / sheetAreaM2(sheet));
}

export function calculateDrywall(input: DrywallInput): DrywallResult {
  const waste = Math.min(100, Math.max(0, input.wastePercent || 0)) / 100;
  const sheet = sheetById(input.sheetId);
  const sheetArea = sheetAreaM2(sheet);

  let wallGross = 0;
  let openings = 0;
  let wallNet = 0;
  let ceiling = 0;
  const items = input.items.map((it) => {
    const a = surfaceAreas(it);
    const q = Math.max(0, Math.floor(pos(it.qty)));
    wallGross += a.wallGrossM2 * q;
    openings += a.openingsM2 * q;
    wallNet += a.wallNetM2 * q;
    ceiling += a.ceilingM2 * q;
    return {
      id: it.id,
      wallNetM2: a.wallNetM2 * q,
      ceilingM2: a.ceilingM2 * q,
      openingsM2: a.openingsM2 * q,
      totalM2: (a.wallNetM2 + a.ceilingM2) * q,
    };
  });

  const netM2 = wallNet + ceiling;
  const orderM2 = netM2 * (1 + waste);
  const sheets = sheetsFor(netM2, waste, sheet);
  const sheetsBySize = SHEETS.filter((s) => s.system === sheet.system).map((s) => ({
    id: s.id,
    label: s.label,
    system: s.system,
    sheets: sheetsFor(netM2, waste, s),
  }));

  const perWall = screwsPerSheet(sheet, input.framingM, input.wallScrewSpacingM);
  const perCeiling = screwsPerSheet(sheet, input.framingM, input.ceilingScrewSpacingM);
  const screwsWall = ceilUp((wallNet / sheetArea) * perWall * (1 + waste));
  const screwsCeiling = ceilUp((ceiling / sheetArea) * perCeiling * (1 + waste));

  const tapeM = netM2 * TAPE_M_PER_M2 * (1 + waste);
  const compoundL = netM2 * COMPOUND_L_PER_M2 * (1 + waste);
  const compoundGal = compoundL / L_PER_GAL;

  return {
    items,
    wallGrossM2: wallGross,
    openingsM2: openings,
    wallNetM2: wallNet,
    ceilingM2: ceiling,
    netM2,
    orderM2,
    sheet,
    sheets,
    sheetsBySize,
    screwsPerWallSheet: perWall,
    screwsPerCeilingSheet: perCeiling,
    screwsWall,
    screwsCeiling,
    screws: screwsWall + screwsCeiling,
    tapeM,
    tapeRolls: input.tapeRollM > 0 ? ceilUp(tapeM / input.tapeRollM) : 0,
    compoundL,
    compoundGal,
    pails: ceilUp(compoundGal / PAIL_GAL),
    cartons: ceilUp(compoundGal / CARTON_GAL),
    beadPieces: input.cornerBeadM > 0 && input.beadPieceM > 0 ? ceilUp(input.cornerBeadM / input.beadPieceM) : 0,
    weightKg: sheets * sheetArea * boardKgPerM2(pos(input.boardLbPerSqFt)),
  };
}

// ---------- optional cost ----------
export interface CostInput {
  sheetPrice?: number;
  pailPrice?: number;
  rollPrice?: number;
  screwsPerBox?: number;
  boxPrice?: number;
  /** labour price per m² of net area */
  laborPerM2?: number;
}

export interface CostResult {
  sheets: number;
  compound: number;
  tape: number;
  screwBoxes: number;
  screws: number;
  materials: number;
  labor: number;
  total: number;
}

export function estimateCost(r: DrywallResult, c: CostInput): CostResult {
  const sheets = r.sheets * pos(c.sheetPrice);
  const compound = r.pails * pos(c.pailPrice);
  const tape = r.tapeRolls * pos(c.rollPrice);
  const screwBoxes = pos(c.screwsPerBox) > 0 ? ceilUp(r.screws / pos(c.screwsPerBox)) : 0;
  const screws = screwBoxes * pos(c.boxPrice);
  const materials = sheets + compound + tape + screws;
  const labor = r.netM2 * pos(c.laborPerM2);
  return { sheets, compound, tape, screwBoxes, screws, materials, labor, total: materials + labor };
}

// ---------- display helpers ----------
export const m2ToFt2 = (m2: number) => m2 / M2_PER_FT2;
export const mToFt = (m: number) => m / M_PER_FT;
export const kgToLb = (kg: number) => kg / KG_PER_LB;
