/**
 * Fence Cost Calculator engine (Batch 2, Tier 2 #11).
 *
 * Layout → posts and materials → installed cost:
 *   each run: fence length = run − gate openings; the gates split it into pieces,
 *   every piece needs ceil(piece ÷ post spacing) sections and sections + 1 posts;
 *   connected runs share a corner post, a closed loop shares one more.
 *   Materials: pickets + rails (wood), panels (vinyl / aluminium), fabric + top rail (chain link).
 *   Concrete per post = (π r² × depth − post cross-section × depth) ÷ bag yield.
 *   Cost: fence ft × installed price × (1 + terrain %) + gates + removal + permit;
 *   materials vs labour split by a share (about half, per This Old House).
 *
 * Default prices are midpoints of dated 2026 published ranges (see calculation-methods.ts),
 * all editable. Canonical units: feet and inches. Pure functions, no network.
 */

export const M_PER_FT = 0.3048;
export const BAG_80LB_FT3 = 0.6; // QUIKRETE Concrete Mix data sheet

export type MaterialId = 'chainLink' | 'woodPrivacy' | 'woodPicket' | 'vinylPrivacy' | 'vinylPicket' | 'aluminum';
export type Family = 'chain' | 'wood' | 'vinyl' | 'metal';
export type Kind = 'fabric' | 'pickets' | 'panels';

export interface Material {
  id: MaterialId;
  label: string;
  family: Family;
  kind: Kind;
  heightFt: number;
  /** default installed price per linear foot at heightFt (midpoint of the published range) */
  pricePerFt: number;
  /** published installed range per linear foot */
  range: [number, number];
  spacingFt: number;
  postIn: number; // post face width
  picketIn?: number;
  gapIn?: number;
  railsPerSection?: number;
  source: string;
}

export const MATERIALS: Material[] = [
  { id: 'chainLink', label: 'Chain link (cyclone)', family: 'chain', kind: 'fabric', heightFt: 4, pricePerFt: 20, range: [13, 27], spacingFt: 10, postIn: 2.375, source: 'This Old House, Jun 2026: $13–$27/ft' },
  { id: 'woodPrivacy', label: 'Wood privacy', family: 'wood', kind: 'pickets', heightFt: 6, pricePerFt: 37.5, range: [25, 50], spacingFt: 8, postIn: 3.5, picketIn: 5.5, gapIn: 0, railsPerSection: 3, source: 'This Old House, Jun 2026: wood privacy $25–$50/ft' },
  { id: 'woodPicket', label: 'Wood picket', family: 'wood', kind: 'pickets', heightFt: 4, pricePerFt: 25, range: [15, 35], spacingFt: 8, postIn: 3.5, picketIn: 3.5, gapIn: 2.5, railsPerSection: 2, source: 'This Old House, Jun 2026: wood $15–$35/ft' },
  { id: 'vinylPrivacy', label: 'Vinyl (PVC) privacy', family: 'vinyl', kind: 'panels', heightFt: 6, pricePerFt: 50, range: [40, 60], spacingFt: 8, postIn: 5, source: 'This Old House, Jun 2026: vinyl privacy $40–$60/ft' },
  { id: 'vinylPicket', label: 'Vinyl (PVC) picket', family: 'vinyl', kind: 'panels', heightFt: 4, pricePerFt: 27.5, range: [15, 40], spacingFt: 8, postIn: 4, source: 'This Old House, Jun 2026: vinyl $15–$40/ft' },
  { id: 'aluminum', label: 'Aluminium / ornamental', family: 'metal', kind: 'panels', heightFt: 4, pricePerFt: 50, range: [25, 75], spacingFt: 6, postIn: 2, source: 'HomeGuide, 2026: aluminium $25–$75/ft' },
];
export const materialById = (id: string): Material => MATERIALS.find((m) => m.id === id) || MATERIALS[1];

/** Installed gate prices: midpoints of Angi 2026 (chain link) and HomeGuide 2026 (wood, vinyl, metal) ranges. */
export const GATE_PRICES: Record<Family, { walk: number; double: number; walkRange: [number, number]; doubleRange: [number, number] }> = {
  chain: { walk: 262.5, double: 480, walkRange: [110, 415], doubleRange: [185, 775] },
  wood: { walk: 450, double: 750, walkRange: [300, 600], doubleRange: [300, 1200] },
  vinyl: { walk: 450, double: 750, walkRange: [300, 600], doubleRange: [300, 1200] },
  metal: { walk: 450, double: 750, walkRange: [300, 600], doubleRange: [300, 1200] },
};

/** Angi 2026: removing an existing fence $3–$5 per linear foot. */
export const REMOVAL_PER_FT = 4;
/** This Old House: professional installation is about half the cost. */
export const MATERIALS_SHARE_PCT = 50;
export const FABRIC_ROLL_FT = 50;
export const TOP_RAIL_FT = 10.5;

// ---------- inputs ----------
export interface Run {
  lengthFt: number;
  walkGates: number;
  doubleGates: number;
}

export interface FenceInput {
  material: MaterialId;
  heightFt: number;
  runs: Run[];
  connected: boolean; // runs meet at corners (share a post)
  closed: boolean; // last run meets the first (closed loop)
  spacingFt: number;
  pricePerFt: number;
  materialsSharePct: number;
  walkGateWidthFt: number;
  doubleGateWidthFt: number;
  walkGatePrice: number;
  doubleGatePrice: number;
  removal: boolean;
  removalPerFt: number;
  terrainPct: number;
  permit: number;
  holeDiaIn: number;
  holeDepthIn: number;
  bagFt3: number;
  bagPrice: number;
}

/** Quikrete rule of thumb: hole 3 × the post width; depth ⅓ of the height above ground (at least 24 in here). */
export const holeDiameterIn = (postIn: number) => Math.round(3 * postIn * 2) / 2;
export const holeDepthIn = (heightFt: number) => Math.max(24, Math.round((heightFt * 12) / 3));

export function defaultFenceInput(materialId: MaterialId = 'woodPrivacy', over: Partial<FenceInput> = {}): FenceInput {
  const m = materialById(materialId);
  const g = GATE_PRICES[m.family];
  return {
    material: m.id,
    heightFt: m.heightFt,
    runs: [
      { lengthFt: 50, walkGates: 1, doubleGates: 0 },
      { lengthFt: 60, walkGates: 0, doubleGates: 0 },
      { lengthFt: 50, walkGates: 0, doubleGates: 0 },
    ],
    connected: true,
    closed: false,
    spacingFt: m.spacingFt,
    pricePerFt: m.pricePerFt,
    materialsSharePct: MATERIALS_SHARE_PCT,
    walkGateWidthFt: 4,
    doubleGateWidthFt: 10,
    walkGatePrice: g.walk,
    doubleGatePrice: g.double,
    removal: false,
    removalPerFt: REMOVAL_PER_FT,
    terrainPct: 0,
    permit: 0,
    holeDiaIn: holeDiameterIn(m.postIn),
    holeDepthIn: holeDepthIn(m.heightFt),
    bagFt3: BAG_80LB_FT3,
    bagPrice: 6.65,
    ...over,
  };
}

// ---------- result ----------
export interface FenceResult {
  totalLengthFt: number;
  gateOpeningFt: number;
  fenceLengthFt: number;
  walkGates: number;
  doubleGates: number;
  sections: number;
  posts: number;
  terminalPosts: number;
  linePosts: number;
  sharedPosts: number;
  postLengthFt: number;
  materials: { label: string; qty: number; unit: string; note?: string }[];
  concretePerPostFt3: number;
  bags: number;
  concreteCost: number;
  fenceCost: number;
  gatesCost: number;
  removalCost: number;
  permit: number;
  total: number;
  perFt: number;
  materialsCost: number;
  labourCost: number;
  diyTotal: number;
  low: number;
  high: number;
}

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const int = (n: number) => Math.max(0, Math.floor(pos(n) + 1e-9));
const money = (n: number) => Math.round(n * 100) / 100;

export function calculateFence(input: FenceInput): FenceResult {
  const m = materialById(input.material);
  const spacing = pos(input.spacingFt) || m.spacingFt;
  const walkW = pos(input.walkGateWidthFt);
  const dblW = pos(input.doubleGateWidthFt);

  let totalLengthFt = 0;
  let gateOpeningFt = 0;
  let fenceLengthFt = 0;
  let sections = 0;
  let rawPosts = 0;
  let walkGates = 0;
  let doubleGates = 0;
  let pieces = 0;
  let runCount = 0;

  for (const r of input.runs) {
    const len = pos(r.lengthFt);
    if (len === 0) continue;
    runCount++;
    const wg = int(r.walkGates);
    const dg = int(r.doubleGates);
    const opening = Math.min(len, wg * walkW + dg * dblW);
    const fence = len - opening;
    const runPieces = wg + dg + 1; // gates split the run
    const pieceLen = fence / runPieces;
    const pieceSections = pieceLen > 0 ? Math.ceil(pieceLen / spacing - 1e-9) : 0;
    totalLengthFt += len;
    gateOpeningFt += opening;
    fenceLengthFt += fence;
    walkGates += wg;
    doubleGates += dg;
    sections += pieceSections * runPieces;
    rawPosts += (pieceSections + 1) * runPieces;
    pieces += runPieces;
  }

  const sharedPosts = runCount > 1 && input.connected ? runCount - 1 + (input.closed && runCount > 2 ? 1 : 0) : 0;
  const posts = Math.max(0, rawPosts - sharedPosts);
  const terminalPosts = Math.max(0, pieces * 2 - sharedPosts);
  const linePosts = Math.max(0, posts - terminalPosts);
  const postLengthFt = pos(input.heightFt) + pos(input.holeDepthIn) / 12;

  // materials list
  const materials: FenceResult['materials'] = [{ label: m.kind === 'fabric' ? 'Terminal posts (ends, corners, gates)' : 'Posts', qty: m.kind === 'fabric' ? terminalPosts : posts, unit: 'posts', note: `${m.postIn} in, about ${Math.ceil(postLengthFt)} ft long` }];
  if (m.kind === 'fabric') {
    materials.push({ label: 'Line posts', qty: linePosts, unit: 'posts' });
    materials.push({ label: 'Chain link fabric', qty: Math.ceil(fenceLengthFt - 1e-9), unit: 'ft', note: `${Math.ceil(fenceLengthFt / FABRIC_ROLL_FT - 1e-9)} rolls of ${FABRIC_ROLL_FT} ft` });
    materials.push({ label: 'Top rail', qty: Math.ceil(fenceLengthFt / TOP_RAIL_FT - 1e-9), unit: `${TOP_RAIL_FT}-ft lengths` });
  } else if (m.kind === 'pickets') {
    const pitch = pos(m.picketIn ?? 5.5) + pos(m.gapIn ?? 0);
    materials.push({ label: 'Rails', qty: sections * (m.railsPerSection ?? 2), unit: `${spacing}-ft boards` });
    materials.push({ label: 'Pickets', qty: pitch > 0 ? Math.ceil((fenceLengthFt * 12) / pitch - 1e-9) : 0, unit: 'pickets', note: `${m.picketIn} in wide × ${pos(input.heightFt)} ft${m.gapIn ? `, ${m.gapIn} in gaps` : ''}` });
  } else {
    materials.push({ label: 'Panels', qty: sections, unit: 'panels', note: `${spacing} ft wide × ${pos(input.heightFt)} ft high` });
  }
  if (walkGates) materials.push({ label: 'Walk gates', qty: walkGates, unit: 'gates', note: `${walkW} ft` });
  if (doubleGates) materials.push({ label: 'Double / drive gates', qty: doubleGates, unit: 'gates', note: `${dblW} ft` });

  // concrete: hole volume minus the post, per post
  const r = pos(input.holeDiaIn) / 2;
  const d = pos(input.holeDepthIn);
  const postArea = m.kind === 'fabric' ? Math.PI * (m.postIn / 2) ** 2 : m.postIn * m.postIn;
  const concretePerPostFt3 = Math.max(0, Math.PI * r * r * d - postArea * d) / 1728;
  const bags = pos(input.bagFt3) > 0 ? Math.ceil((posts * concretePerPostFt3) / input.bagFt3 - 1e-9) : 0;
  const concreteCost = money(bags * pos(input.bagPrice));

  // cost
  const fenceCost = money(fenceLengthFt * pos(input.pricePerFt) * (1 + pos(input.terrainPct) / 100));
  const gatesCost = money(walkGates * pos(input.walkGatePrice) + doubleGates * pos(input.doubleGatePrice));
  const removalCost = input.removal ? money(totalLengthFt * pos(input.removalPerFt)) : 0;
  const permit = money(pos(input.permit));
  const total = money(fenceCost + gatesCost + removalCost + permit);
  const share = Math.min(100, pos(input.materialsSharePct)) / 100;
  const materialsCost = money((fenceCost + gatesCost) * share);
  const labourCost = money(fenceCost + gatesCost - materialsCost + removalCost);
  const diyTotal = money(materialsCost + permit);
  const terrain = 1 + pos(input.terrainPct) / 100;
  const extras = gatesCost + removalCost + permit;
  return {
    totalLengthFt,
    gateOpeningFt,
    fenceLengthFt,
    walkGates,
    doubleGates,
    sections,
    posts,
    terminalPosts,
    linePosts,
    sharedPosts,
    postLengthFt,
    materials,
    concretePerPostFt3,
    bags,
    concreteCost,
    fenceCost,
    gatesCost,
    removalCost,
    permit,
    total,
    perFt: totalLengthFt > 0 ? total / totalLengthFt : 0,
    materialsCost,
    labourCost,
    diyTotal,
    low: money(fenceLengthFt * m.range[0] * terrain + extras),
    high: money(fenceLengthFt * m.range[1] * terrain + extras),
  };
}

/** One straight run with no gates, default prices (page tables). */
export function straightFence(materialId: MaterialId, lengthFt: number, over: Partial<FenceInput> = {}): FenceResult {
  return calculateFence(defaultFenceInput(materialId, { runs: [{ lengthFt, walkGates: 0, doubleGates: 0 }], ...over }));
}
