/**
 * Board and Batten Calculator engine (Batch 2, Tier 1 #6).
 *
 * Two jobs share the keyword:
 *  1. Interior accent wall — equal batten spacing, rails/grid, mark positions, cut list and supplies.
 *  2. Exterior board-and-batten siding — boards + battens + furring, openings deducted.
 *
 * All lengths are INCHES internally. Pure functions, no network.
 *
 * Lumber: nominal 1× boards are ¾ in thick; dry dressed widths are nominal − ½ in for 2–7 in boards
 * and nominal − ¾ in for 8 in and wider (American Softwood Lumber Standard, NIST PS 20).
 */

export const MM_PER_IN = 25.4;

export const NOMINAL_BOARDS: { id: string; label: string; actualWidthIn: number }[] = [
  { id: '1x2', label: '1×2', actualWidthIn: 1.5 },
  { id: '1x3', label: '1×3', actualWidthIn: 2.5 },
  { id: '1x4', label: '1×4', actualWidthIn: 3.5 },
  { id: '1x6', label: '1×6', actualWidthIn: 5.5 },
  { id: '1x8', label: '1×8', actualWidthIn: 7.25 },
  { id: '1x10', label: '1×10', actualWidthIn: 9.25 },
  { id: '1x12', label: '1×12', actualWidthIn: 11.25 },
];
export const BOARD_THICKNESS_IN = 0.75;

/** Parse inches typed as "3 1/2", "3-1/2", "3.5", "7/8" or "2' 6"" (feet + inches). Returns NaN if unreadable. */
export function parseInches(raw: string): number {
  const s = raw.trim().replace(/[″"]/g, '').replace(/in(ches)?\.?$/i, '').trim();
  if (!s) return NaN;
  const ft = s.match(/^(\d+(?:\.\d+)?)\s*(?:'|′|ft)\s*(.*)$/i);
  if (ft) {
    const rest = ft[2].trim();
    const inches = rest ? parseInches(rest) : 0;
    return isNaN(inches) ? NaN : parseFloat(ft[1]) * 12 + inches;
  }
  const mixed = s.match(/^(\d+(?:\.\d+)?)[\s-]+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) return parseFloat(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const frac = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (frac) return Number(frac[2]) === 0 ? NaN : Number(frac[1]) / Number(frac[2]);
  const n = Number(s);
  return isFinite(n) ? n : NaN;
}

/** Inches → nearest 1/16 as "15 3/8"". */
export function formatFraction(inches: number, denom = 16): string {
  if (!isFinite(inches)) return '—';
  const neg = inches < 0;
  let v = Math.round(Math.abs(inches) * denom);
  const whole = Math.floor(v / denom);
  v -= whole * denom;
  let num = v;
  let den = denom;
  while (num > 0 && num % 2 === 0) {
    num /= 2;
    den /= 2;
  }
  const body = num === 0 ? `${whole}` : whole === 0 ? `${num}/${den}` : `${whole} ${num}/${den}`;
  return `${neg ? '−' : ''}${body}"`;
}

// ---------- spacing ----------
export type EdgeMode = 'both' | 'none' | 'inset';

export interface SpacingInput {
  wallWidth: number;
  battenWidth: number;
  edge: EdgeMode;
  inset: number; // margin from each wall edge to the first/last batten (edge 'inset')
}

const usable = (i: SpacingInput) => Math.max(0, i.wallWidth - (i.edge === 'inset' ? 2 * Math.max(0, i.inset) : 0));
const gapsFor = (n: number, edge: EdgeMode) => (edge === 'none' ? n + 1 : n - 1);

/** Exact equal gap for a given number of battens (NaN when impossible). */
export function gapForCount(i: SpacingInput, count: number): number {
  const n = Math.floor(count);
  const gaps = gapsFor(n, i.edge);
  if (n < 1 || gaps < 1 || i.battenWidth <= 0) return NaN;
  const g = (usable(i) - n * i.battenWidth) / gaps;
  return g > 0 ? g : NaN;
}

/** Battens closest to a target gap (at least the minimum that makes sense for the edge mode). */
export function countForGap(i: SpacingInput, targetGap: number): number {
  const b = i.battenWidth;
  const W = usable(i);
  if (b <= 0 || targetGap <= 0 || W <= 0) return 0;
  const raw = i.edge === 'none' ? (W - targetGap) / (b + targetGap) : (W - b) / (b + targetGap) + 1;
  const min = i.edge === 'none' ? 1 : 2;
  let n = Math.max(min, Math.round(raw));
  while (n > min && !(gapForCount(i, n) > 0)) n--;
  return gapForCount(i, n) > 0 ? n : 0;
}

/** Left edge of every batten, measured from the left wall edge. */
export function battenPositions(i: SpacingInput, count: number): number[] {
  const g = gapForCount(i, count);
  if (!(g > 0)) return [];
  const start = i.edge === 'inset' ? Math.max(0, i.inset) : i.edge === 'none' ? g : 0;
  return Array.from({ length: Math.floor(count) }, (_, k) => start + k * (i.battenWidth + g));
}

// ---------- obstacles ----------
export interface Obstacle {
  id: string;
  label: string;
  left: number; // from the left wall edge
  width: number;
}
/** Indexes (0-based) of battens that overlap an obstacle horizontally. */
export function clashes(positions: number[], battenWidth: number, obstacles: Obstacle[]): { battenIndex: number; obstacle: string }[] {
  const out: { battenIndex: number; obstacle: string }[] = [];
  positions.forEach((x, k) => {
    for (const o of obstacles) {
      if (o.width <= 0) continue;
      if (x < o.left + o.width && x + battenWidth > o.left) out.push({ battenIndex: k, obstacle: o.label });
    }
  });
  return out;
}

// ---------- cut list ----------
/** Boards of `stock` length needed for these pieces (first-fit decreasing; pieces longer than stock are joined). */
export function boardsForPieces(pieces: number[], stock: number, kerf = 0.125): number {
  if (stock <= 0) return 0;
  const parts: number[] = [];
  for (const p of pieces) {
    if (!(p > 0)) continue;
    let rest = p;
    while (rest > stock + 1e-9) {
      parts.push(stock);
      rest -= stock;
    }
    if (rest > 1e-9) parts.push(rest);
  }
  parts.sort((a, b) => b - a);
  const bins: number[] = [];
  for (const p of parts) {
    const k = bins.findIndex((free) => free + 1e-9 >= p);
    if (k >= 0) bins[k] -= p + kerf;
    else bins.push(stock - p - kerf);
  }
  return bins.length;
}

// ---------- accent wall ----------
export interface AccentInput extends SpacingInput {
  wallHeight: number;
  mode: 'count' | 'gap';
  count: number;
  targetGap: number;
  topRail: number; // height of top rail board (0 = none)
  baseboard: number; // height of baseboard (0 = none)
  baseExisting: boolean; // keep the existing baseboard (not bought)
  railRows: number; // horizontal rails between battens (grid rows)
  railWidth: number; // width of the horizontal grid rails
  stockLength: number; // board length bought
  wastePercent: number;
  coats: number;
  paintCoverage: number; // sq ft per gallon
  adhesiveFtPerTube: number;
  caulkFtPerTube: number;
  nailSpacing: number; // inches between nail points along each piece
  nailsPerPoint: number;
  obstacles?: Obstacle[];
}

export interface AccentResult {
  count: number;
  gap: number;
  onCenter: number;
  positions: number[];
  battenLength: number; // each vertical batten
  rowGap: number; // vertical gap between grid rails (NaN if no rails)
  pieces: { label: string; qty: number; length: number }[];
  linearFeet: number;
  boards: number;
  nails: number;
  adhesiveTubes: number;
  caulkTubes: number;
  paintSqFt: number;
  paintGallons: number;
  options: { count: number; gap: number }[];
  clashes: { battenIndex: number; obstacle: string }[];
}

export function calculateAccent(input: AccentInput): AccentResult {
  const count = input.mode === 'count' ? Math.floor(Math.max(0, input.count)) : countForGap(input, input.targetGap);
  const gap = gapForCount(input, count);
  const valid = gap > 0;
  const b = input.battenWidth;
  const positions = valid ? battenPositions(input, count) : [];
  const battenLength = Math.max(0, input.wallHeight - Math.max(0, input.topRail) - Math.max(0, input.baseboard));
  const rows = Math.max(0, Math.floor(input.railRows));
  const rowGap = rows > 0 ? (battenLength - rows * Math.max(0, input.railWidth)) / (rows + 1) : NaN;

  const pieces: { label: string; qty: number; length: number }[] = [];
  if (valid) {
    pieces.push({ label: 'Vertical battens', qty: count, length: battenLength });
    if (input.topRail > 0) pieces.push({ label: 'Top rail', qty: 1, length: input.wallWidth });
    if (input.baseboard > 0 && !input.baseExisting) pieces.push({ label: 'Baseboard', qty: 1, length: input.wallWidth });
    if (rows > 0) {
      // short rails fill every gap in each row
      const gapsPerRow = gapsFor(count, input.edge) + (input.edge === 'inset' ? 2 : 0);
      if (input.edge === 'inset') {
        pieces.push({ label: 'Grid rails (end gaps)', qty: rows * 2, length: Math.max(0, input.inset) });
        pieces.push({ label: 'Grid rails', qty: rows * (gapsPerRow - 2), length: gap });
      } else {
        pieces.push({ label: 'Grid rails', qty: rows * gapsPerRow, length: gap });
      }
    }
  }
  const realPieces = pieces.filter((p) => p.qty > 0 && p.length > 0);
  const totalIn = realPieces.reduce((s, p) => s + p.qty * p.length, 0);
  const waste = 1 + Math.max(0, input.wastePercent) / 100;
  const linearFeet = (totalIn / 12) * waste;
  const allPieces = realPieces.flatMap((p) => Array.from({ length: p.qty }, () => p.length));
  const boards = Math.ceil(boardsForPieces(allPieces, input.stockLength) * waste - 1e-9);

  const nailPoints = realPieces.reduce((s, p) => s + p.qty * (Math.ceil(p.length / Math.max(1, input.nailSpacing)) + 1), 0);
  const nails = nailPoints * Math.max(0, Math.floor(input.nailsPerPoint));
  const totalFt = totalIn / 12;
  const adhesiveTubes = input.adhesiveFtPerTube > 0 ? Math.ceil(totalFt / input.adhesiveFtPerTube - 1e-9) : 0;
  const caulkTubes = input.caulkFtPerTube > 0 ? Math.ceil((2 * totalFt) / input.caulkFtPerTube - 1e-9) : 0;
  // paint: the wall plus the exposed edges of every piece (¾ in each side)
  const paintSqFt = valid ? (input.wallWidth * input.wallHeight) / 144 + (totalIn * BOARD_THICKNESS_IN * 2) / 144 : 0;
  const paintGallons = input.paintCoverage > 0 ? (paintSqFt * Math.max(1, input.coats)) / input.paintCoverage : 0;

  const options: { count: number; gap: number }[] = [];
  if (count > 0) {
    for (let k = count - 2; k <= count + 2; k++) {
      const g = gapForCount(input, k);
      if (g > 0) options.push({ count: k, gap: g });
    }
  }

  return {
    count: valid ? count : 0,
    gap: valid ? gap : NaN,
    onCenter: valid ? gap + b : NaN,
    positions,
    battenLength,
    rowGap,
    pieces: realPieces,
    linearFeet,
    boards,
    nails,
    adhesiveTubes,
    caulkTubes,
    paintSqFt,
    paintGallons,
    options,
    clashes: clashes(positions, b, input.obstacles || []),
  };
}

// ---------- exterior siding ----------
export interface SidingInput {
  wallWidth: number;
  wallHeight: number;
  boardWidth: number;
  boardGap: number; // gap between boards, covered by a batten
  battenWidth: number;
  battensAtEnds: boolean; // trim battens at both wall ends
  openingsArea: number; // sq in of doors and windows
  furringSpacing: number; // vertical spacing of horizontal furring strips (0 = none)
  stockLength: number;
  wastePercent: number;
}

export interface SidingResult {
  boards: number; // board count across the wall
  battens: number;
  netAreaSqFt: number;
  boardLinearFt: number;
  battenLinearFt: number;
  furringRows: number;
  furringLinearFt: number;
  boardPieces: number; // stock-length boards to buy
  battenPieces: number;
}

export function calculateSiding(i: SidingInput): SidingResult {
  const W = Math.max(0, i.wallWidth);
  const H = Math.max(0, i.wallHeight);
  const cover = i.boardWidth + Math.max(0, i.boardGap);
  if (W === 0 || H === 0 || i.boardWidth <= 0) {
    return { boards: 0, battens: 0, netAreaSqFt: 0, boardLinearFt: 0, battenLinearFt: 0, furringRows: 0, furringLinearFt: 0, boardPieces: 0, battenPieces: 0 };
  }
  // boards: n × board + (n − 1) × gap ≥ W
  const boards = Math.max(1, Math.ceil((W + Math.max(0, i.boardGap)) / cover - 1e-9));
  const battens = boards - 1 + (i.battensAtEnds ? 2 : 0);
  const gross = W * H;
  const net = Math.max(0, gross - Math.max(0, i.openingsArea));
  const share = gross > 0 ? net / gross : 0;
  const waste = 1 + Math.max(0, i.wastePercent) / 100;
  const boardLinearFt = ((boards * H) / 12) * share * waste;
  const battenLinearFt = ((battens * H) / 12) * share * waste;
  const furringRows = i.furringSpacing > 0 ? Math.ceil(H / i.furringSpacing - 1e-9) + 1 : 0;
  const furringLinearFt = ((furringRows * W) / 12) * waste;
  const pieces = (lf: number, len: number) => (len > 0 ? Math.ceil((lf * 12) / len - 1e-9) : 0);
  // boards run full height: count pieces by height when the wall is no taller than the stock
  const boardPieces = H <= i.stockLength ? Math.ceil(boards * share * waste - 1e-9) : pieces(boardLinearFt, i.stockLength);
  const battenPieces = H <= i.stockLength ? Math.ceil(battens * share * waste - 1e-9) : pieces(battenLinearFt, i.stockLength);
  return { boards, battens, netAreaSqFt: net / 144, boardLinearFt, battenLinearFt, furringRows, furringLinearFt, boardPieces, battenPieces };
}

export function defaultAccent(over: Partial<AccentInput> = {}): AccentInput {
  return {
    wallWidth: 144,
    wallHeight: 96,
    battenWidth: 3.5,
    edge: 'both',
    inset: 0,
    mode: 'gap',
    count: 7,
    targetGap: 16,
    topRail: 3.5,
    baseboard: 0,
    baseExisting: true,
    railRows: 0,
    railWidth: 3.5,
    stockLength: 96,
    wastePercent: 10,
    coats: 2,
    paintCoverage: 350,
    adhesiveFtPerTube: 30,
    caulkFtPerTube: 120,
    nailSpacing: 16,
    nailsPerPoint: 2,
    obstacles: [],
    ...over,
  };
}
