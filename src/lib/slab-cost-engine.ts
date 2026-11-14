/**
 * Concrete Slab Cost Calculator engine (Batch 2, Tier 1 #9).
 *
 * Builds an itemised estimate the way contractors quote flatwork:
 *   concrete ordered = slab volume × (1 + waste), rounded up to the next ¼ yd³
 *   + short-load fee (orders under a truckload) + delivery + pump
 *   + gravel base, vapour barrier, reinforcement, forms
 *   + placing & finishing labour, decorative finish, sealer, removal of an old slab
 *   × region factor, + overhead & profit, + permit
 * and compares three ways to do the job: DIY with bags, DIY with ready-mix, or a contractor.
 *
 * Every rate is an editable starting value taken from dated 2026 cost guides (see SOURCES and
 * src/content/calculation-methods.ts). Canonical units are imperial (ft, in, yd³, ft², US tons);
 * the UI converts metric inputs and prices. Pure functions, no network, no browser APIs.
 */

export const FT3_PER_YD3 = 27;
export const M_PER_FT = 0.3048;
export const SQFT_PER_M2 = 1 / (M_PER_FT * M_PER_FT); // 10.7639…
export const YD3_PER_M3 = 1 / (FT3_PER_YD3 * M_PER_FT * M_PER_FT * M_PER_FT); // 1.30795…
export const TONNE_PER_TON = 0.90718474; // US short ton
export const ORDER_STEP_YD3 = 0.25;

/** Date the default prices were checked against the sources below. */
export const PRICE_BASIS = '2026-11-15';

// ---------- published prices (sources: see SOURCES) ----------
export interface PsiPrice {
  psi: number;
  low: number;
  high: number;
  /** midpoint of the published range, rounded to the dollar */
  typical: number;
}
/** Ready-mix price per yd³ by strength — LawnStarter, Sep 2026 (before short-load fee). */
export const PSI_PRICES: PsiPrice[] = [
  { psi: 3000, low: 143, high: 158, typical: 151 },
  { psi: 3500, low: 153, high: 166, typical: 160 },
  { psi: 4000, low: 161, high: 173, typical: 167 },
  { psi: 4500, low: 171, high: 181, typical: 176 },
  { psi: 5000, low: 178, high: 193, typical: 186 },
];
export const psiPrice = (psi: number): PsiPrice => PSI_PRICES.find((p) => p.psi === psi) || PSI_PRICES[2];

/** Installed plain-slab cost per ft² (materials + labour) published in 2026. */
export const PUBLISHED_INSTALLED = {
  lawnStarter: { low: 4.34, avg: 6.6, high: 7.73 }, // Nov 2026
  concreteNetwork: { low: 6.5, high: 10.5 }, // Jul 2026
  /** the widest span of the two, used for the "how does my estimate compare" check */
  low: 4.34,
  high: 10.5,
};
/** NRMCA national average ready-mix price for 2025, as reported by Concrete Network (Jul 2026). */
export const NRMCA_AVG_2025 = 179.95;

/** ft³ of mixed concrete per kg of dry mix, from 80 lb → 0.60 ft³ (QUIKRETE Concrete Mix data sheet). */
const FT3_PER_KG = 0.6 / (80 * 0.45359237);
/** Bag yields of mixed concrete, ft³. Pound sizes from the QUIKRETE data sheet; kilogram sizes scaled by weight. */
export const BAG_YIELD_FT3 = {
  lb40: 0.3,
  lb60: 0.45,
  lb80: 0.6,
  kg20: 20 * FT3_PER_KG,
  kg25: 25 * FT3_PER_KG,
  kg30: 30 * FT3_PER_KG,
  kg40: 40 * FT3_PER_KG,
} as const;
export type BagSize = keyof typeof BAG_YIELD_FT3;
export const BAG_LABEL: Record<BagSize, string> = { lb40: '40 lb', lb60: '60 lb', lb80: '80 lb', kg20: '20 kg', kg25: '25 kg', kg30: '30 kg', kg40: '40 kg' };
export const IMPERIAL_BAGS: BagSize[] = ['lb40', 'lb60', 'lb80'];
export const METRIC_BAGS: BagSize[] = ['kg20', 'kg25', 'kg30', 'kg40'];

// ---------- inputs ----------
export type Reinforcement = 'none' | 'mesh' | 'rebar';
export type Finish = 'broom' | 'colored' | 'stamped';
export type Pump = 'none' | 'line' | 'boom';
export type ShortLoadMode = 'perYard' | 'flat';

export interface Rates {
  concretePerYd3: number;
  shortLoadThresholdYd3: number;
  shortLoadMode: ShortLoadMode;
  shortLoadAmount: number;
  truckCapacityYd3: number;
  deliveryPerYd3: number;
  pumpLine: number;
  pumpBoom: number;
  basePerTon: number;
  baseTonsPerYd3: number;
  baseCompactionPct: number;
  vaporPerSqFt: number;
  meshPerSqFt: number;
  rebarPerSqFt: number;
  laborPerSqFt: number;
  coloredPerSqFt: number;
  stampedPerSqFt: number;
  sealerPerSqFt: number;
  formsPerSlab: number;
  demoPerSqFt: number;
  bagPrice: number;
  bagSize: BagSize;
}

/** Starting values — every one sits inside a dated 2026 published range (see SOURCES). */
export const DEFAULT_RATES: Rates = {
  concretePerYd3: psiPrice(4000).typical, // 167
  shortLoadThresholdYd3: 10,
  shortLoadMode: 'perYard',
  shortLoadAmount: 43,
  truckCapacityYd3: 10,
  deliveryPerYd3: 0,
  pumpLine: 500,
  pumpBoom: 900,
  basePerTon: 40,
  baseTonsPerYd3: 1.4,
  baseCompactionPct: 15,
  vaporPerSqFt: 0.5,
  meshPerSqFt: 0.35,
  rebarPerSqFt: 2.5,
  laborPerSqFt: 3.5,
  coloredPerSqFt: 5.5,
  stampedPerSqFt: 12,
  sealerPerSqFt: 1.5,
  formsPerSlab: 75,
  demoPerSqFt: 4,
  bagPrice: 6.65,
  bagSize: 'lb80',
};

export interface Slab {
  lengthFt: number;
  widthFt: number;
  thicknessIn: number;
  qty: number;
}

export interface Options {
  wastePct: number;
  baseDepthIn: number; // 0 = no gravel base
  vaporBarrier: boolean;
  reinforcement: Reinforcement;
  finish: Finish;
  sealer: boolean;
  pump: Pump;
  demolition: boolean;
  permit: number;
  regionFactor: number; // 1 = the default (US national) prices
  overheadPct: number;
}

export const DEFAULT_OPTIONS: Options = {
  wastePct: 10,
  baseDepthIn: 4,
  vaporBarrier: false,
  reinforcement: 'mesh',
  finish: 'broom',
  sealer: false,
  pump: 'none',
  demolition: false,
  permit: 0,
  regionFactor: 1,
  overheadPct: 0,
};

// ---------- project presets ----------
export type ProjectId = 'patio' | 'driveway' | 'garage' | 'shed' | 'sidewalk' | 'pad';
export interface Project {
  id: ProjectId;
  label: string;
  lengthFt: number;
  widthFt: number;
  thicknessIn: number;
  psi: number;
  reinforcement: Reinforcement;
  vaporBarrier: boolean;
  note: string;
}
export const PROJECTS: Project[] = [
  { id: 'patio', label: 'Patio', lengthFt: 16, widthFt: 12, thicknessIn: 4, psi: 3500, reinforcement: 'mesh', vaporBarrier: false, note: 'Patios are commonly poured 4 in thick.' },
  { id: 'driveway', label: 'Driveway', lengthFt: 40, widthFt: 12, thicknessIn: 5, psi: 4000, reinforcement: 'rebar', vaporBarrier: false, note: 'Car driveways are often 4–5 in; use 6 in where heavier vehicles park.' },
  { id: 'garage', label: 'Garage floor', lengthFt: 24, widthFt: 24, thicknessIn: 5, psi: 4000, reinforcement: 'rebar', vaporBarrier: true, note: 'Follow your plans and local code; a vapour barrier keeps ground moisture out.' },
  { id: 'shed', label: 'Shed base', lengthFt: 12, widthFt: 10, thicknessIn: 4, psi: 3500, reinforcement: 'mesh', vaporBarrier: true, note: 'Shed bases are commonly 4 in thick.' },
  { id: 'sidewalk', label: 'Walkway', lengthFt: 30, widthFt: 4, thicknessIn: 4, psi: 3000, reinforcement: 'none', vaporBarrier: false, note: 'Walkways are commonly 4 in thick with control joints every few feet.' },
  { id: 'pad', label: 'Equipment pad', lengthFt: 6, widthFt: 4, thicknessIn: 4, psi: 3000, reinforcement: 'none', vaporBarrier: false, note: 'Small pads for AC units or bins — often cheaper with bags.' },
];
export const projectById = (id: string): Project => PROJECTS.find((p) => p.id === id) || PROJECTS[0];

// ---------- helpers ----------
const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const nonNeg = (n: number) => (Number.isFinite(n) && n >= 0 ? n : 0);
/** Round up to the next multiple of step, ignoring float noise. */
export function roundUpTo(value: number, step: number): number {
  if (!(value > 0)) return 0;
  return Math.ceil(value / step - 1e-9) * step;
}

export const slabAreaSqFt = (s: Slab) => pos(s.lengthFt) * pos(s.widthFt) * Math.max(0, Math.floor(nonNeg(s.qty)));
/** Volume of one or more identical slabs, yd³ = L(ft) × W(ft) × T(in) ÷ 12 ÷ 27. */
export const slabVolumeYd3 = (s: Slab) => (slabAreaSqFt(s) * pos(s.thicknessIn)) / 12 / FT3_PER_YD3;

// ---------- result types ----------
export type Group = 'concrete' | 'prep' | 'labour' | 'extras';
export interface LineItem {
  id: string;
  label: string;
  detail: string;
  amount: number;
  group: Group;
}

export interface Comparison {
  id: 'bags' | 'readyMix' | 'contractor';
  label: string;
  total: number;
  perSqFt: number;
  detail: string;
}

export interface SlabCostResult {
  areaSqFt: number;
  slabCount: number;
  netYd3: number;
  withWasteYd3: number;
  orderYd3: number;
  trucks: number;
  shortLoad: boolean;
  baseTons: number;
  bags: number;
  lines: LineItem[];
  subtotal: number;
  regionAdj: number;
  overhead: number;
  permit: number;
  total: number;
  perSqFt: number;
  perOrderedYd3: number;
  concreteOnly: number;
  labourTotal: number;
  compare: Comparison[];
  check: 'below' | 'within' | 'above' | 'n/a';
}

// ---------- main ----------
export interface Display {
  metric?: boolean;
  symbol?: string;
}

export function estimateSlabCost(slabs: Slab[], options: Options = DEFAULT_OPTIONS, rates: Rates = DEFAULT_RATES, display: Display = {}): SlabCostResult {
  const o = options;
  const r = rates;
  const M = Boolean(display.metric);
  const sym = display.symbol ?? '$';
  const c = (n: number) => cur(n, sym);
  // quantities and rates in the display units
  const vol = (yd3: number) => (M ? `${fmt(yd3 / YD3_PER_M3, 2)} m³` : `${fmt(yd3, 2)} yd³`);
  const area = (ft2: number) => (M ? `${fmt(ft2 / SQFT_PER_M2, 1)} m²` : `${fmt(ft2, 0)} ft²`);
  const mass = (tons: number) => (M ? `${fmt(tons * TONNE_PER_TON, 2)} t` : `${fmt(tons, 2)} tons`);
  const depth = (inch: number) => (M ? `${fmt(inch * 2.54, 0)} cm` : `${fmt(inch, 1)} in`);
  const perVol = (p: number) => (M ? `${c(perYd3ToPerM3(p))}/m³` : `${c(p)}/yd³`);
  const perArea = (p: number) => (M ? `${c(perSqFtToPerM2(p))}/m²` : `${c(p)}/ft²`);
  const perMass = (p: number) => (M ? `${c(perTonToPerTonne(p))}/t` : `${c(p)}/ton`);
  const valid = slabs.filter((s) => slabVolumeYd3(s) > 0);
  const areaSqFt = valid.reduce((a, s) => a + slabAreaSqFt(s), 0);
  const slabCount = valid.reduce((a, s) => a + Math.floor(nonNeg(s.qty)), 0);
  const netYd3 = valid.reduce((a, s) => a + slabVolumeYd3(s), 0);
  const withWasteYd3 = netYd3 * (1 + nonNeg(o.wastePct) / 100);
  const orderYd3 = roundUpTo(withWasteYd3, ORDER_STEP_YD3);
  const cap = pos(r.truckCapacityYd3) || 10;
  const trucks = orderYd3 > 0 ? Math.ceil(orderYd3 / cap - 1e-9) : 0;
  const shortLoad = orderYd3 > 0 && orderYd3 < nonNeg(r.shortLoadThresholdYd3);

  // gravel base: compacted volume × (1 + compaction) × density
  const baseYd3 = (areaSqFt * nonNeg(o.baseDepthIn)) / 12 / FT3_PER_YD3;
  const baseTons = baseYd3 * (1 + nonNeg(r.baseCompactionPct) / 100) * nonNeg(r.baseTonsPerYd3);

  const yieldFt3 = BAG_YIELD_FT3[r.bagSize] ?? BAG_YIELD_FT3.lb80;
  const bags = withWasteYd3 > 0 ? Math.ceil((withWasteYd3 * FT3_PER_YD3) / yieldFt3 - 1e-9) : 0;

  const money = (n: number) => Math.round(n * 100) / 100;
  const lines: LineItem[] = [];
  const add = (id: string, label: string, detail: string, amount: number, group: Group) => {
    if (amount > 0) lines.push({ id, label, detail, amount: money(amount), group });
  };

  // concrete & delivery
  add('concrete', 'Ready-mix concrete', `${vol(orderYd3)} × ${perVol(r.concretePerYd3)}`, orderYd3 * nonNeg(r.concretePerYd3), 'concrete');
  const shortFee = shortLoad ? (r.shortLoadMode === 'flat' ? nonNeg(r.shortLoadAmount) : nonNeg(r.shortLoadAmount) * orderYd3) : 0;
  add(
    'shortLoad',
    'Short-load fee',
    r.shortLoadMode === 'flat' ? `order under ${vol(r.shortLoadThresholdYd3)}` : `${vol(orderYd3)} × ${perVol(r.shortLoadAmount)} (under ${vol(r.shortLoadThresholdYd3)})`,
    shortFee,
    'concrete',
  );
  add('delivery', 'Delivery', `${vol(orderYd3)} × ${perVol(r.deliveryPerYd3)}`, orderYd3 * nonNeg(r.deliveryPerYd3), 'concrete');
  const pumpCost = o.pump === 'line' ? nonNeg(r.pumpLine) : o.pump === 'boom' ? nonNeg(r.pumpBoom) : 0;
  add('pump', o.pump === 'boom' ? 'Boom pump' : 'Line pump', 'minimum charge', pumpCost, 'concrete');

  // prep & reinforcement
  add('base', 'Gravel base', `${depth(o.baseDepthIn)} · ${mass(baseTons)} × ${perMass(r.basePerTon)}`, baseTons * nonNeg(r.basePerTon), 'prep');
  if (o.vaporBarrier) add('vapor', 'Vapour barrier', `${area(areaSqFt)} × ${perArea(r.vaporPerSqFt)}`, areaSqFt * nonNeg(r.vaporPerSqFt), 'prep');
  if (o.reinforcement === 'mesh') add('mesh', 'Wire mesh', `${area(areaSqFt)} × ${perArea(r.meshPerSqFt)}`, areaSqFt * nonNeg(r.meshPerSqFt), 'prep');
  if (o.reinforcement === 'rebar') add('rebar', 'Rebar grid', `${area(areaSqFt)} × ${perArea(r.rebarPerSqFt)}`, areaSqFt * nonNeg(r.rebarPerSqFt), 'prep');
  add('forms', 'Forms, stakes & joint material', `${slabCount} slab${slabCount === 1 ? '' : 's'} × ${c(r.formsPerSlab)}`, slabCount * nonNeg(r.formsPerSlab), 'prep');

  // labour & finish
  add('labour', 'Placing & finishing labour', `${area(areaSqFt)} × ${perArea(r.laborPerSqFt)}`, areaSqFt * nonNeg(r.laborPerSqFt), 'labour');
  if (o.finish === 'colored') add('finish', 'Coloured / stained finish', `${area(areaSqFt)} × ${perArea(r.coloredPerSqFt)}`, areaSqFt * nonNeg(r.coloredPerSqFt), 'labour');
  if (o.finish === 'stamped') add('finish', 'Stamped finish', `${area(areaSqFt)} × ${perArea(r.stampedPerSqFt)}`, areaSqFt * nonNeg(r.stampedPerSqFt), 'labour');
  if (o.sealer) add('sealer', 'Sealer', `${area(areaSqFt)} × ${perArea(r.sealerPerSqFt)}`, areaSqFt * nonNeg(r.sealerPerSqFt), 'labour');

  // extras
  if (o.demolition) add('demo', 'Remove & haul away old slab', `${area(areaSqFt)} × ${perArea(r.demoPerSqFt)}`, areaSqFt * nonNeg(r.demoPerSqFt), 'extras');

  const subtotal = money(lines.reduce((a, l) => a + l.amount, 0));
  const factor = pos(o.regionFactor) || 1;
  const regionAdj = money(subtotal * (factor - 1));
  const overhead = money((subtotal + regionAdj) * (nonNeg(o.overheadPct) / 100));
  const permit = money(nonNeg(o.permit));
  const total = money(subtotal + regionAdj + overhead + permit);
  const perSqFt = areaSqFt > 0 ? total / areaSqFt : 0;
  const perOrderedYd3 = orderYd3 > 0 ? total / orderYd3 : 0;

  const sumIds = (ids: string[]) => lines.filter((l) => ids.includes(l.id)).reduce((a, l) => a + l.amount, 0);
  const concreteOnly = money(sumIds(['concrete', 'shortLoad', 'delivery']));
  const labourTotal = money(sumIds(['labour', 'finish', 'sealer']));
  const prep = sumIds(['base', 'vapor', 'mesh', 'rebar', 'forms']);
  const demo = sumIds(['demo']);

  // DIY options: same prep materials, no hired labour, plain broom finish; region factor applies to hired work only
  const bagTotal = money(bags * nonNeg(r.bagPrice) + prep + demo + permit);
  const readyMixTotal = money(sumIds(['concrete', 'shortLoad', 'delivery', 'pump']) + prep + demo + permit);
  const per = (n: number) => (areaSqFt > 0 ? n / areaSqFt : 0);
  const compare: Comparison[] = [
    { id: 'bags', label: `DIY with ${BAG_LABEL[r.bagSize]} bags`, total: bagTotal, perSqFt: per(bagTotal), detail: `${bags} bags × ${c(r.bagPrice)} + base, reinforcement and forms` },
    { id: 'readyMix', label: 'DIY with ready-mix', total: readyMixTotal, perSqFt: per(readyMixTotal), detail: `${vol(orderYd3)} delivered${shortLoad ? ' (short load)' : ''} + base, reinforcement and forms` },
    { id: 'contractor', label: 'Hire a contractor', total, perSqFt, detail: 'everything above, including labour and finish' },
  ];

  const plain = o.finish === 'broom' && !o.sealer && !o.demolition && o.reinforcement !== 'rebar' && factor === 1 && nonNeg(o.overheadPct) === 0;
  const check: SlabCostResult['check'] = !plain || areaSqFt === 0 ? 'n/a' : perSqFt < PUBLISHED_INSTALLED.low ? 'below' : perSqFt > PUBLISHED_INSTALLED.high ? 'above' : 'within';

  return {
    areaSqFt,
    slabCount,
    netYd3,
    withWasteYd3,
    orderYd3,
    trucks,
    shortLoad,
    baseTons,
    bags,
    lines,
    subtotal,
    regionAdj,
    overhead,
    permit,
    total,
    perSqFt,
    perOrderedYd3,
    concreteOnly,
    labourTotal,
    compare,
    check,
  };
}

/** Shortcut for one rectangular slab with default options/rates plus overrides (used by the page tables). */
export function quickEstimate(lengthFt: number, widthFt: number, thicknessIn: number, opt: Partial<Options> = {}, rate: Partial<Rates> = {}): SlabCostResult {
  return estimateSlabCost([{ lengthFt, widthFt, thicknessIn, qty: 1 }], { ...DEFAULT_OPTIONS, ...opt }, { ...DEFAULT_RATES, ...rate });
}

/** Concrete-only cost per ft² for a given thickness and price per yd³ (no waste, no fees). */
export const concretePerSqFt = (thicknessIn: number, pricePerYd3: number) => (pos(thicknessIn) / 12 / FT3_PER_YD3) * nonNeg(pricePerYd3);

/** ft² covered by one cubic yard at a given thickness. */
export const sqFtPerYd3 = (thicknessIn: number) => (pos(thicknessIn) > 0 ? (FT3_PER_YD3 * 12) / thicknessIn : 0);

// ---------- metric conversions for the UI ----------
export const perM3ToPerYd3 = (p: number) => p / YD3_PER_M3;
export const perYd3ToPerM3 = (p: number) => p * YD3_PER_M3;
export const perM2ToPerSqFt = (p: number) => p / SQFT_PER_M2;
export const perSqFtToPerM2 = (p: number) => p * SQFT_PER_M2;
export const perTonneToPerTon = (p: number) => p * TONNE_PER_TON;
export const perTonToPerTonne = (p: number) => p / TONNE_PER_TON;

// local formatting for line-item details
function fmt(n: number, dp: number): string {
  return (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: 0 });
}
function cur(n: number, symbol: string): string {
  const v = Number.isFinite(n) ? n : 0;
  return `${symbol}${v.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: v % 1 ? 2 : 0 })}`;
}

export const SOURCES = {
  lawnStarterYard: 'https://www.lawnstarter.com/blog/cost/concrete-price-per-yard/',
  lawnStarterSlab: 'https://www.lawnstarter.com/blog/cost/concrete-slab-price/',
  concreteNetwork: 'https://www.concretenetwork.com/concrete-prices.html',
  thisOldHouse: 'https://www.thisoldhouse.com/foundations/concrete-slab-cost',
  angiPump: 'https://www.angi.com/articles/concrete-pumping-cost.htm',
  angiRemoval: 'https://www.angi.com/articles/how-much-should-concrete-demo-cost-square-foot.htm',
  homeGuideGravel: 'https://homeguide.com/costs/gravel-prices',
  inchCalculator: 'https://www.inchcalculator.com/how-much-does-a-concrete-slab-cost/',
  quikrete: 'https://www.quikrete.com/pdfs/data_sheet-concrete%20mix%201101.pdf',
};
