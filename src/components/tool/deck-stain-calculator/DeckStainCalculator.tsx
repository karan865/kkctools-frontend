'use client';

import React, { useEffect, useId, useState } from 'react';
import styles from './DeckStainCalculator.module.css';
import { DeckDiagram, RailingDiagram } from './DeckStainDiagram';
import {
  CONDITION_FACTOR,
  CONDITION_LABEL,
  DEFAULT_COST,
  DEFAULT_RAILING,
  DEFAULT_SECOND_COAT_FACTOR,
  DEFAULT_STAIRS,
  L_PER_GAL,
  METHOD_WASTE,
  M_PER_FT,
  OPACITIES,
  SQFT_PER_M2,
  calculateDeckStain,
  opacityById,
  type Condition,
  type CostOptions,
  type Method,
  type Opacity,
  type RailingMode,
} from '@/lib/deck-stain-engine';

type Units = 'us' | 'metric';
const CURRENCIES = [
  { id: 'USD', sym: '$', label: 'US $' },
  { id: 'CAD', sym: 'C$', label: 'C$' },
  { id: 'AUD', sym: 'A$', label: 'A$' },
  { id: 'NZD', sym: 'NZ$', label: 'NZ$' },
  { id: 'GBP', sym: '£', label: '£' },
  { id: 'EUR', sym: '€', label: '€' },
  { id: 'INR', sym: '₹', label: '₹' },
];

interface Row {
  id: number;
  l: string;
  w: string;
}

const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const fmt = (n: number, max = 2, min = 0) => (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });
const r2 = (n: number) => `${Math.round(n * 100) / 100}`;
const COV = SQFT_PER_M2 * L_PER_GAL; // ft²/gal ÷ COV = m²/L

type Kind = 'len' | 'inch' | 'cov' | 'perVol' | 'perArea' | 'plain';
const FIELDS: Record<string, Kind> = {
  railLen: 'len',
  railH: 'inch',
  postIn: 'inch',
  postSpacing: 'len',
  rails: 'plain',
  railW: 'inch',
  railT: 'inch',
  balIn: 'inch',
  gapIn: 'inch',
  steps: 'plain',
  stairW: 'len',
  tread: 'inch',
  riser: 'inch',
  stringers: 'plain',
  stringerD: 'inch',
  skirtL: 'len',
  skirtH: 'len',
  boardW: 'inch',
  boardT: 'inch',
  boardGap: 'inch',
  coverage: 'cov',
  factor: 'plain',
  waste: 'plain',
  price: 'perVol',
  pail: 'plain',
  cleanCov: 'cov',
  cleanPrice: 'perVol',
  labour: 'perArea',
  wash: 'perArea',
  strip: 'perArea',
  sand: 'perArea',
};
const DEFAULTS: Record<string, string> = {
  railLen: `${DEFAULT_RAILING.lengthFt}`,
  railH: `${DEFAULT_RAILING.heightIn}`,
  postIn: `${DEFAULT_RAILING.postIn}`,
  postSpacing: `${DEFAULT_RAILING.postSpacingFt}`,
  rails: `${DEFAULT_RAILING.rails}`,
  railW: `${DEFAULT_RAILING.railWidthIn}`,
  railT: `${DEFAULT_RAILING.railThickIn}`,
  balIn: `${DEFAULT_RAILING.balusterIn}`,
  gapIn: `${DEFAULT_RAILING.gapIn}`,
  steps: '0',
  stairW: `${DEFAULT_STAIRS.widthFt}`,
  tread: `${DEFAULT_STAIRS.treadIn}`,
  riser: `${DEFAULT_STAIRS.riserIn}`,
  stringers: `${DEFAULT_STAIRS.stringers}`,
  stringerD: `${DEFAULT_STAIRS.stringerDepthIn}`,
  skirtL: '0',
  skirtH: '2',
  boardW: '5.5',
  boardT: '1',
  boardGap: '0.125',
  coverage: '250',
  factor: `${DEFAULT_SECOND_COAT_FACTOR}`,
  waste: '10',
  price: `${DEFAULT_COST.pricePerGal}`,
  pail: '0',
  cleanCov: `${DEFAULT_COST.cleanerCoverage}`,
  cleanPrice: `${DEFAULT_COST.cleanerPricePerGal}`,
  labour: `${DEFAULT_COST.labourPerSqFt}`,
  wash: `${DEFAULT_COST.washPerSqFt}`,
  strip: `${DEFAULT_COST.stripPerSqFt}`,
  sand: `${DEFAULT_COST.sandPerSqFt}`,
};
const toMetric: Record<Kind, (n: number) => number> = {
  len: (n) => n * M_PER_FT,
  inch: (n) => n * 2.54,
  cov: (n) => n / COV,
  perVol: (n) => n / L_PER_GAL,
  perArea: (n) => n * SQFT_PER_M2,
  plain: (n) => n,
};
const toUs: Record<Kind, (n: number) => number> = {
  len: (n) => n / M_PER_FT,
  inch: (n) => n / 2.54,
  cov: (n) => n * COV,
  perVol: (n) => n * L_PER_GAL,
  perArea: (n) => n / SQFT_PER_M2,
  plain: (n) => n,
};

interface Shared {
  u: Units;
  c: string;
  s: [string, string][];
  v: Record<string, string>;
  e: { rm: RailingMode; bal: 'square' | 'round'; op: Opacity; co: 1 | 2; cd: Condition; me: Method; pr: CostOptions['prep'] };
  b: { edges: boolean; risers: boolean; sk2: boolean; clean: boolean };
}
const encode = (s: Shared) => btoa(unescape(encodeURIComponent(JSON.stringify(s)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function decode(raw: string): Shared | null {
  try {
    const s = JSON.parse(decodeURIComponent(escape(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))))) as Shared;
    return s && Array.isArray(s.s) && s.v ? s : null;
  } catch {
    return null;
  }
}

let rowSeq = 1;

export default function DeckStainCalculator() {
  const [units, setUnits] = useState<Units>('us');
  const [currency, setCurrency] = useState('USD');
  const [rows, setRows] = useState<Row[]>([{ id: 0, l: '16', w: '20' }]);
  const [vals, setVals] = useState<Record<string, string>>(DEFAULTS);
  const [railMode, setRailMode] = useState<RailingMode>('detailed');
  const [baluster, setBaluster] = useState<'square' | 'round'>('square');
  const [opacity, setOpacity] = useState<Opacity>('semi');
  const [coats, setCoats] = useState<1 | 2>(2);
  const [condition, setCondition] = useState<Condition>('smooth');
  const [method, setMethod] = useState<Method>('brush');
  const [prep, setPrep] = useState<CostOptions['prep']>('wash');
  const [edges, setEdges] = useState(false);
  const [risers, setRisers] = useState(true);
  const [skirt2, setSkirt2] = useState(false);
  const [cleaner, setCleaner] = useState(true);
  const [notice, setNotice] = useState('');
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('d');
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setUnits(s.u === 'metric' ? 'metric' : 'us');
    if (CURRENCIES.some((c) => c.id === s.c)) setCurrency(s.c);
    setRows(s.s.slice(0, 10).map(([l, w]) => ({ id: rowSeq++, l, w })));
    setVals({ ...DEFAULTS, ...Object.fromEntries(Object.entries(s.v).filter(([k]) => k in DEFAULTS)) });
    if (s.e) {
      if (['none', 'simple', 'detailed'].includes(s.e.rm)) setRailMode(s.e.rm);
      setBaluster(s.e.bal === 'round' ? 'round' : 'square');
      if (OPACITIES.some((o) => o.id === s.e.op)) setOpacity(s.e.op);
      setCoats(s.e.co === 1 ? 1 : 2);
      if (s.e.cd in CONDITION_FACTOR) setCondition(s.e.cd);
      setMethod(s.e.me === 'spray' ? 'spray' : 'brush');
      if (['none', 'wash', 'strip', 'sand'].includes(s.e.pr)) setPrep(s.e.pr);
    }
    if (s.b) {
      setEdges(Boolean(s.b.edges));
      setRisers(s.b.risers !== false);
      setSkirt2(Boolean(s.b.sk2));
      setCleaner(s.b.clean !== false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const M = units === 'metric';
  const sym = CURRENCIES.find((c) => c.id === currency)?.sym ?? '$';
  const v = (k: string) => num(vals[k] ?? '0');
  const setV = (k: string) => (s: string) => setVals((prev) => ({ ...prev, [k]: s }));
  const back = (k: string) => (M ? toUs[FIELDS[k]](v(k)) : v(k));
  const money = (n: number) => `${sym}${fmt(n, Math.abs(n) >= 1000 ? 0 : 2, Math.abs(n) >= 1000 ? 0 : 2)}`;
  const L = M ? 'm' : 'ft';
  const IN = M ? 'cm' : 'in';
  const AREA = M ? 'm²' : 'ft²';
  const VOL = M ? 'L' : 'gal';

  // ---------- engine ----------
  const sections = rows.map((r) => ({ lengthFt: M ? num(r.l) / M_PER_FT : num(r.l), widthFt: M ? num(r.w) / M_PER_FT : num(r.w) }));
  const input = {
    sections,
    boards: { edges, widthIn: back('boardW'), thickIn: back('boardT'), gapIn: back('boardGap') },
    railing: {
      mode: railMode,
      lengthFt: back('railLen'),
      heightIn: back('railH'),
      postIn: back('postIn'),
      postSpacingFt: back('postSpacing'),
      rails: Math.floor(v('rails')),
      railWidthIn: back('railW'),
      railThickIn: back('railT'),
      baluster,
      balusterIn: back('balIn'),
      gapIn: back('gapIn'),
    },
    stairs: { steps: Math.floor(v('steps')), widthFt: back('stairW'), treadIn: back('tread'), riserIn: back('riser'), risers, stringers: Math.floor(v('stringers')), stringerDepthIn: back('stringerD') },
    skirting: { lengthFt: back('skirtL'), heightFt: back('skirtH'), sides: (skirt2 ? 2 : 1) as 1 | 2 },
    stain: { opacity, coverage: back('coverage'), coats, secondCoatFactor: v('factor') || 1, condition, wastePct: v('waste') },
    cost: {
      pricePerGal: back('price'),
      pricePerPail: M ? 0 : v('pail'),
      cleaner,
      cleanerCoverage: back('cleanCov'),
      cleanerPricePerGal: back('cleanPrice'),
      labourPerSqFt: back('labour'),
      prep,
      washPerSqFt: back('wash'),
      stripPerSqFt: back('strip'),
      sandPerSqFt: back('sand'),
      metricCans: M,
    },
  };
  const res = calculateDeckStain(input);
  const a = res.areas;
  const areaOut = (ft2: number) => (M ? `${fmt(ft2 / SQFT_PER_M2, 1)} m²` : `${fmt(ft2, 0)} ft²`);
  const volOut = (gal: number) => (M ? `${fmt(gal * L_PER_GAL, 1)} L` : `${fmt(gal, 2)} gal`);
  const covOut = (ft2PerGal: number) => (M ? `${fmt(ft2PerGal / COV, 1)} m²/L` : `${fmt(ft2PerGal, 0)} ft²/gal`);
  const perArea = (pSqFt: number) => (M ? `${money(pSqFt * SQFT_PER_M2)}/m²` : `${money(pSqFt)}/ft²`);
  const op = opacityById(opacity);

  const buyText = M
    ? [res.litres.five && `${res.litres.five} × 5 L`, res.litres.twoHalf && `${res.litres.twoHalf} × 2.5 L`, res.litres.one && `${res.litres.one} × 1 L`].filter(Boolean).join(' + ') || '—'
    : [res.cans.pails && `${res.cans.pails} × 5-gal pail`, res.cans.gallons && `${res.cans.gallons} × 1-gal can`].filter(Boolean).join(' + ') || '—';
  const boughtText = M ? `${fmt(res.litres.boughtL, 1)} L` : `${fmt(res.cans.boughtGal, 0)} gal`;

  // ---------- actions ----------
  const switchUnits = (next: Units) => {
    if (next === units) return;
    const conv = next === 'metric' ? toMetric : toUs;
    setVals((prev) => {
      const out: Record<string, string> = { ...prev };
      for (const [k, kind] of Object.entries(FIELDS)) out[k] = kind === 'plain' ? prev[k] : r2(conv[kind](num(prev[k] ?? '0')));
      return out;
    });
    setRows((prev) => prev.map((r) => ({ ...r, l: r2(next === 'metric' ? num(r.l) * M_PER_FT : num(r.l) / M_PER_FT), w: r2(next === 'metric' ? num(r.w) * M_PER_FT : num(r.w) / M_PER_FT) })));
    setUnits(next);
  };
  const pickOpacity = (o: Opacity) => {
    setOpacity(o);
    const c = opacityById(o).coverage;
    setV('coverage')(M ? r2(c / COV) : `${c}`);
  };
  const pickMethod = (m: Method) => {
    setMethod(m);
    setV('waste')(`${METHOD_WASTE[m]}`);
  };
  const updateRow = (rid: number, key: 'l' | 'w', value: string) => setRows((prev) => prev.map((r) => (r.id === rid ? { ...r, [key]: value } : r)));
  const addRow = () => setRows((prev) => [...prev, { id: rowSeq++, l: M ? '3' : '10', w: M ? '3' : '10' }]);
  const removeRow = (rid: number) => setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== rid) : prev));
  const reset = () => {
    setUnits('us');
    setCurrency('USD');
    setRows([{ id: rowSeq++, l: '16', w: '20' }]);
    setVals(DEFAULTS);
    setRailMode('detailed');
    setBaluster('square');
    setOpacity('semi');
    setCoats(2);
    setCondition('smooth');
    setMethod('brush');
    setPrep('wash');
    setEdges(false);
    setRisers(true);
    setSkirt2(false);
    setCleaner(true);
  };
  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 2500);
  };
  const copyText = async (text: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(text);
      flash(ok);
    } catch {
      flash('Copy is blocked in this browser — select and copy manually.');
    }
  };
  const summary = () =>
    [
      `Deck stain estimate (KKC Tools) — ${op.label}, ${coats} coat${coats === 1 ? '' : 's'}, ${CONDITION_LABEL[condition].toLowerCase()} wood`,
      `Area: ${areaOut(a.total)} (floor ${areaOut(a.floor + a.edges)}, railing ${areaOut(a.railing.total)}, stairs ${areaOut(a.stairs.total)}, skirting ${areaOut(a.skirting)})`,
      `Stain needed: ${volOut(res.needGal)} incl. ${fmt(v('waste'), 0)}% extra — buy ${buyText}`,
      `DIY: ${money(res.diyTotal)} · Pro: ${money(res.proTotal)}`,
      'Estimate only — check the coverage on your can.',
    ].join('\n');
  const share = () => {
    const s: Shared = {
      u: units,
      c: currency,
      s: rows.map((r) => [r.l, r.w]),
      v: vals,
      e: { rm: railMode, bal: baluster, op: opacity, co: coats, cd: condition, me: method, pr: prep },
      b: { edges, risers, sk2: skirt2, clean: cleaner },
    };
    const url = `${window.location.origin}${window.location.pathname}?d=${encode(s)}`;
    window.history.replaceState(null, '', url);
    copyText(url, 'Share link copied.');
  };

  // ---------- UI helpers ----------
  let step = 0;
  const head = (title: string, sub?: string) => (
    <div className={styles.cardHead}>
      <span className={styles.step}>{++step}</span>
      <h2 className={styles.cardTitle}>
        {title} {sub && <span className={styles.titleSub}>· {sub}</span>}
      </h2>
    </div>
  );
  const pill = (active: boolean, label: React.ReactNode, onClick: () => void, key?: string | number) => (
    <button key={key} type="button" aria-pressed={active} className={`${styles.pill} ${active ? styles.pillActive : ''}`} onClick={onClick}>
      {label}
    </button>
  );
  const field = (k: string, label: string, suffix?: string, help?: string) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id(k)}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input id={id(k)} className={styles.input} type="number" inputMode="decimal" min="0" step="any" value={vals[k] ?? ''} onChange={(e) => setV(k)(e.target.value)} />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {help && <p className={styles.help}>{help}</p>}
    </div>
  );
  const check = (on: boolean, set: (b: boolean) => void, label: string, key: string) => (
    <label className={`${styles.check} ${on ? styles.checkOn : ''}`} htmlFor={id(key)}>
      <input id={id(key)} type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} />
      {label}
    </label>
  );

  const parts = [
    { label: 'Deck floor', area: a.floor + a.edges },
    { label: 'Railing', area: a.railing.total },
    { label: 'Stairs', area: a.stairs.total },
    { label: 'Skirting', area: a.skirting },
  ].filter((p) => p.area > 0);

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          {/* 1. units */}
          <div className={styles.card}>
            {head('Units & currency')}
            <div className={styles.segment} role="group" aria-label="Units">
              <button type="button" aria-pressed={!M} className={`${styles.segBtn} ${!M ? styles.segActive : ''}`} onClick={() => switchUnits('us')}>
                US (ft, in, gallons)
              </button>
              <button type="button" aria-pressed={M} className={`${styles.segBtn} ${M ? styles.segActive : ''}`} onClick={() => switchUnits('metric')}>
                Metric (m, cm, litres)
              </button>
            </div>
            <div className={styles.field} style={{ marginTop: 12 }}>
              <label className={styles.label} htmlFor={id('cur')}>
                Currency
              </label>
              <select id={id('cur')} className={styles.input} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.id})
                  </option>
                ))}
              </select>
              {currency !== 'USD' && <p className={styles.help}>Default prices are US averages. Enter local prices — the currency only changes the symbol.</p>}
            </div>
          </div>

          {/* 2. floor */}
          <div className={styles.card}>
            {head('Deck floor', areaOut(a.floor))}
            {rows.map((r, i) => (
              <div key={r.id} className={styles.openings} style={{ marginTop: i ? 10 : 0 }}>
                <div className={styles.cardHead} style={{ marginBottom: 8, paddingBottom: 6 }}>
                  <p className={styles.subhead} style={{ margin: 0, flex: 1 }}>
                    {rows.length > 1 ? `Section ${i + 1}` : 'Deck size'}
                  </p>
                  {rows.length > 1 && (
                    <button type="button" className={styles.removeBtn} onClick={() => removeRow(r.id)} aria-label={`Remove section ${i + 1}`}>
                      Remove
                    </button>
                  )}
                </div>
                <div className={styles.fields}>
                  {(
                    [
                      ['l', 'Length'],
                      ['w', 'Width'],
                    ] as ['l' | 'w', string][]
                  ).map(([k, label]) => (
                    <div className={styles.field} key={k}>
                      <label className={styles.label} htmlFor={id(`r${r.id}${k}`)}>
                        {label}
                      </label>
                      <div className={styles.inputWrap}>
                        <input id={id(`r${r.id}${k}`)} className={styles.input} type="number" inputMode="decimal" min="0" step="any" value={r[k]} onChange={(e) => updateRow(r.id, k, e.target.value)} />
                        <span className={styles.suffix}>{L}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className={styles.toggleRow} style={{ marginTop: 10 }}>
              <button type="button" className={styles.addBtn} onClick={addRow}>
                + Add a level or section
              </button>
              {check(edges, setEdges, 'Stain board edges too', 'edges')}
            </div>
            {edges && (
              <div className={styles.fields} style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                {field('boardW', 'Board width', IN)}
                {field('boardT', 'Thickness', IN)}
                {field('boardGap', 'Gap', IN)}
              </div>
            )}
            <p className={styles.help}>{edges ? `Edges add ${areaOut(a.edges)} — use it if you stain boards before laying them or spray into the gaps.` : 'Measure the outside of the deck. Board gaps are ignored — the extra allowance covers stain that runs into them.'}</p>
          </div>

          {/* 3. railing */}
          <div className={styles.card}>
            {head('Railings', railMode === 'none' ? 'none' : areaOut(a.railing.total))}
            <div className={styles.pills} role="group" aria-label="Railing detail">
              {pill(railMode === 'none', 'No railing', () => setRailMode('none'))}
              {pill(railMode === 'simple', 'Quick (length × height)', () => setRailMode('simple'))}
              {pill(railMode === 'detailed', 'Detailed (posts & balusters)', () => setRailMode('detailed'))}
            </div>
            {railMode !== 'none' && (
              <div className={styles.fields} style={{ marginTop: 10 }}>
                {field('railLen', 'Total railing length', L, 'Add every run, including stair rails.')}
                {field('railH', 'Height', IN, M ? 'Often about 91 cm (36 in).' : 'Often 36 in (IRC minimum for most decks).')}
              </div>
            )}
            {railMode === 'simple' && <p className={styles.help}>Counts both faces of the railing as solid. Good enough for a quick estimate; detailed mode is more accurate.</p>}
            {railMode === 'detailed' && (
              <>
                <div className={styles.fields} style={{ marginTop: 10 }}>
                  {field('postIn', 'Post width', IN, M ? '9 cm for a 4×4 post.' : '3.5 in for a 4×4.')}
                  {field('postSpacing', 'Post spacing', L)}
                  {field('rails', 'Horizontal rails', '×', 'Top + bottom = 2.')}
                  {field('railW', 'Rail width', IN, M ? '9 cm for a 2×4.' : '3.5 in for a 2×4.')}
                  {field('railT', 'Rail thickness', IN)}
                  {field('balIn', baluster === 'round' ? 'Baluster diameter' : 'Baluster width', IN, M ? '3.8 cm for a 2×2.' : '1.5 in for a 2×2.')}
                  {field('gapIn', 'Gap between balusters', IN, M ? 'Under 10 cm in most codes.' : 'Under 4 in (IRC).')}
                </div>
                <div className={styles.pills} role="group" aria-label="Baluster shape" style={{ marginTop: 10 }}>
                  {pill(baluster === 'square', 'Square balusters', () => setBaluster('square'))}
                  {pill(baluster === 'round', 'Round / metal-look', () => setBaluster('round'))}
                </div>
                <p className={styles.help}>
                  {a.railing.postCount} posts · {a.railing.balusterCount} balusters · posts {areaOut(a.railing.posts)}, rails {areaOut(a.railing.rails)}, balusters {areaOut(a.railing.balusters)}
                </p>
              </>
            )}
          </div>

          {/* 4. stairs & skirting */}
          <div className={styles.card}>
            {head('Stairs & skirting', `${areaOut(a.stairs.total + a.skirting)}`)}
            <div className={styles.fields}>
              {field('steps', 'Number of steps', '×', '0 = no stairs.')}
              {field('stairW', 'Stair width', L)}
              {v('steps') > 0 && field('tread', 'Tread depth', IN)}
              {v('steps') > 0 && field('riser', 'Riser height', IN)}
              {v('steps') > 0 && field('stringers', 'Visible stringers', '×', 'Usually the 2 outside ones.')}
              {v('steps') > 0 && field('stringerD', 'Stringer depth', IN, M ? '28.6 cm for a 2×12.' : '11.25 in for a 2×12.')}
            </div>
            {v('steps') > 0 && <div className={styles.toggleRow} style={{ marginTop: 10 }}>{check(risers, setRisers, 'Stain risers', 'risers')}</div>}
            <p className={styles.subhead} style={{ marginTop: 14 }}>
              Skirting / privacy screen
            </p>
            <div className={styles.fields}>
              {field('skirtL', 'Length', L, '0 = none.')}
              {field('skirtH', 'Height', L)}
            </div>
            <div className={styles.toggleRow} style={{ marginTop: 10, marginBottom: 0 }}>
              {check(skirt2, setSkirt2, 'Both sides', 'sk2')}
            </div>
          </div>

          {/* 5. stain */}
          <div className={styles.card}>
            {head('Stain & coats', `${covOut(res.coverage1)} first coat`)}
            <p className={styles.label}>Stain type</p>
            <div className={styles.pills} role="group" aria-label="Stain opacity">
              {OPACITIES.map((o) => pill(opacity === o.id, o.label, () => pickOpacity(o.id), o.id))}
            </div>
            <div className={styles.fields} style={{ marginTop: 10 }}>
              {field('coverage', 'Coverage on the label (1st coat)', M ? 'm²/L' : 'ft²/gal', `${op.product}: ${M ? `${fmt(op.coat1[0] / COV, 1)}–${fmt(op.coat1[1] / COV, 1)} m²/L` : `${op.coat1[0]}–${op.coat1[1]} ft²/gal`}.`)}
              {field('factor', 'Second coat goes further by', '×', 'Label data: about 1.3× (TWP) to 2× (BEHR).')}
            </div>
            <p className={styles.label} style={{ marginTop: 12 }}>
              Coats
            </p>
            <div className={styles.pills} role="group" aria-label="Coats">
              {pill(coats === 1, '1 coat', () => setCoats(1))}
              {pill(coats === 2, '2 coats', () => setCoats(2))}
            </div>
            <p className={styles.label} style={{ marginTop: 12 }}>
              Wood condition
            </p>
            <div className={styles.pills} role="group" aria-label="Wood condition">
              {(Object.keys(CONDITION_LABEL) as Condition[]).map((c) => pill(condition === c, `${CONDITION_LABEL[c]} ×${CONDITION_FACTOR[c]}`, () => setCondition(c), c))}
            </div>
            <p className={styles.label} style={{ marginTop: 12 }}>
              Application
            </p>
            <div className={styles.pills} role="group" aria-label="Application method">
              {pill(method === 'brush', 'Brush / roller / pad', () => pickMethod('brush'))}
              {pill(method === 'spray', 'Sprayer', () => pickMethod('spray'))}
              <div className={styles.inputWrap} style={{ maxWidth: 120 }}>
                <input id={id('waste')} aria-label="Extra allowance percent" className={styles.input} type="number" min="0" step="1" value={vals.waste} onChange={(e) => setV('waste')(e.target.value)} />
                <span className={styles.suffix}>% extra</span>
              </div>
            </div>
          </div>

          {/* 6. cost */}
          <div className={styles.card}>
            {head('Prices & prep')}
            <div className={styles.fields}>
              {field('price', `Stain price per ${M ? 'litre' : 'gallon'}`, `${sym}/${VOL}`, 'US 2025 retail: about $25–$90 per gallon.')}
              {!M && field('pail', '5-gallon pail price (optional)', sym, '0 = buy 1-gallon cans only.')}
            </div>
            <div className={styles.toggleRow} style={{ marginTop: 12 }}>
              {check(cleaner, setCleaner, 'Deck cleaner before staining', 'clean')}
            </div>
            {cleaner && (
              <div className={styles.fields}>
                {field('cleanCov', 'Cleaner coverage (ready to use)', M ? 'm²/L' : 'ft²/gal', M ? 'About 6–8.5 m²/L.' : 'About 250–350 ft²/gal.')}
                {field('cleanPrice', `Cleaner price per ${M ? 'litre' : 'gallon'}`, `${sym}/${VOL}`)}
              </div>
            )}
            <p className={styles.subhead} style={{ marginTop: 14 }}>
              If you hire a pro
            </p>
            <div className={styles.fields}>
              {field('labour', `Labour per ${AREA} stained`, `${sym}/${AREA}`, M ? 'US 2026: about $11–$27/m².' : 'US 2026: about $1–$2.50/ft².')}
            </div>
            <p className={styles.label} style={{ marginTop: 10 }}>
              Pro prep
            </p>
            <div className={styles.pills} role="group" aria-label="Professional prep">
              {pill(prep === 'none', 'None', () => setPrep('none'))}
              {pill(prep === 'wash', 'Wash', () => setPrep('wash'))}
              {pill(prep === 'strip', 'Strip old stain', () => setPrep('strip'))}
              {pill(prep === 'sand', 'Sand', () => setPrep('sand'))}
            </div>
            {prep !== 'none' && <div className={styles.fields} style={{ marginTop: 10 }}>{field(prep, `${prep === 'wash' ? 'Washing' : prep === 'strip' ? 'Stripping' : 'Sanding'} per ${AREA}`, `${sym}/${AREA}`)}</div>}
            <div className={styles.toggleRow} style={{ marginTop: 12, marginBottom: 0 }}>
              <button type="button" className={styles.linkBtn} onClick={reset}>
                Reset to defaults
              </button>
            </div>
          </div>

          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              <strong>{volOut(res.needGal)}</strong> · buy {boughtText}
            </span>
            <a href="#deck-stain-results" className={styles.mobileBarLink} tabIndex={-1}>
              Results ↓
            </a>
          </div>
        </div>

        {/* ---------- results ---------- */}
        <div className={styles.results} id="deck-stain-results" aria-live="polite">
          <div className={styles.hero}>
            <div className={styles.heroLabel}>Stain needed</div>
            <div className={styles.heroValue}>{volOut(res.needGal)}</div>
            <div className={styles.heroSub}>
              Buy {buyText} · {areaOut(a.total)} · {coats} coat{coats === 1 ? '' : 's'} of {op.label.toLowerCase()}
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Area to stain</h3>
            {parts.map((p) => (
              <div className={styles.row} key={p.label}>
                <span>{p.label}</span>
                <strong>{areaOut(p.area)}</strong>
              </div>
            ))}
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>Total</span>
              <strong>{areaOut(a.total)}</strong>
            </div>
            <figure style={{ margin: '12px 0 0' }}>
              <DeckDiagram
                railing={a.railing.total > 0}
                stairs={a.stairs.total > 0}
                skirting={a.skirting > 0}
                labels={{ floor: areaOut(a.floor + a.edges), railing: areaOut(a.railing.total), stairs: areaOut(a.stairs.total), skirting: areaOut(a.skirting) }}
              />
            </figure>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Coat by coat</h3>
            <div className={styles.row}>
              <span>1st coat at {covOut(res.coverage1)}</span>
              <strong>{volOut(res.coat1Gal)}</strong>
            </div>
            {coats === 2 && (
              <div className={styles.row}>
                <span>2nd coat at {covOut(res.coverage2)}</span>
                <strong>{volOut(res.coat2Gal)}</strong>
              </div>
            )}
            <div className={styles.row}>
              <span>+ {fmt(v('waste'), 0)}% extra</span>
              <strong>{volOut(res.needGal - res.rawGal)}</strong>
            </div>
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>To buy</span>
              <strong>
                {buyText} ({boughtText})
              </strong>
            </div>
            {cleaner && (
              <div className={styles.row}>
                <span>Deck cleaner</span>
                <strong>{M ? `${res.cleanerL} L` : `${res.cleanerGal} gal`}</strong>
              </div>
            )}
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Cost: do it yourself or hire a pro</h3>
            <div className={styles.matRow}>
              <span>
                <span className={styles.matName}>Do it yourself</span>
                <span className={styles.matSub}>
                  stain {money(res.stainCost)}
                  {cleaner ? ` + cleaner ${money(res.cleanerCost)}` : ''}
                </span>
              </span>
              <span className={styles.matValue}>
                {money(res.diyTotal)}
                <span className={styles.matAlt}>{perArea(res.diyPerSqFt)} of deck</span>
              </span>
            </div>
            <div className={styles.matRow}>
              <span>
                <span className={styles.matName}>Hire a pro</span>
                <span className={styles.matSub}>
                  stain {money(res.stainCost)} + labour {money(res.labourCost)}
                  {res.prepCost > 0 ? ` + prep ${money(res.prepCost)}` : ''}
                </span>
              </span>
              <span className={styles.matValue}>
                {money(res.proTotal)}
                <span className={styles.matAlt}>{perArea(res.proPerSqFt)} of deck</span>
              </span>
            </div>
            <p className={styles.note}>Per {AREA} figures divide by the floor and stair treads — the way deck sizes are usually quoted. Tools, brushes and tape are not included.</p>
          </div>

          {railMode === 'detailed' && (
            <figure className={styles.panel} style={{ margin: 0 }}>
              <RailingDiagram
                heightLabel={M ? `${fmt(v('railH'), 0)} cm` : `${fmt(v('railH'), 0)} in`}
                gapLabel={`gap ${fmt(v('gapIn'), 2)} ${IN}`}
                countLabel={`${a.railing.postCount} posts · ${a.railing.balusterCount} balusters over ${M ? `${fmt(v('railLen'), 1)} m` : `${fmt(v('railLen'), 0)} ft`}`}
              />
            </figure>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.actionBtn} onClick={() => copyText(summary(), 'Estimate copied.')}>
              Copy estimate
            </button>
            <button type="button" className={styles.actionBtn} onClick={share}>
              Copy share link
            </button>
            <button type="button" className={styles.actionBtn} onClick={() => window.print()}>
              Print
            </button>
          </div>
          {notice && (
            <p className={styles.notice} role="status">
              {notice}
            </p>
          )}
          <p className={styles.note}>
            Coverage defaults come from manufacturer data sheets (BEHR PREMIUM stain family). Your product&apos;s label is the final word — enter its number above. Test a
            small area first: old, grey or rough wood can drink far more stain.
          </p>
        </div>
      </div>
    </div>
  );
}
