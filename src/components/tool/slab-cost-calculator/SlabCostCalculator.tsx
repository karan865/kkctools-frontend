'use client';

import React, { useEffect, useId, useState } from 'react';
import styles from './SlabCostCalculator.module.css';
import { CostBar, SlabSectionDiagram, TruckDiagram, type Segment } from './SlabCostDiagram';
import {
  BAG_LABEL,
  DEFAULT_RATES,
  IMPERIAL_BAGS,
  METRIC_BAGS,
  M_PER_FT,
  PRICE_BASIS,
  PROJECTS,
  PSI_PRICES,
  PUBLISHED_INSTALLED,
  SQFT_PER_M2,
  TONNE_PER_TON,
  YD3_PER_M3,
  estimateSlabCost,
  perM2ToPerSqFt,
  perM3ToPerYd3,
  perTonneToPerTon,
  projectById,
  psiPrice,
  type BagSize,
  type Finish,
  type Pump,
  type Reinforcement,
  type ShortLoadMode,
} from '@/lib/slab-cost-engine';

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
  t: string;
  q: string;
}

const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const fmt = (n: number, max = 2, min = 0) => (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });
const r2 = (n: number) => `${Math.round(n * 100) / 100}`;
const r1 = (n: number) => `${Math.round(n * 10) / 10}`;

/** Everything the share link needs (display-unit strings). */
interface Shared {
  u: Units;
  c: string;
  p: string;
  psi: number;
  s: [string, string, string, string][];
  v: Record<string, string>;
  b: { vap: boolean; seal: boolean; demo: boolean };
  e: { pump: Pump; reinf: Reinforcement; fin: Finish; sl: ShortLoadMode; bag: BagSize };
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

// keys of the numeric text fields, with how each converts between unit systems
type Kind = 'perVol' | 'vol' | 'perArea' | 'perMass' | 'depth' | 'plain';
const FIELDS: Record<string, Kind> = {
  waste: 'plain',
  price: 'perVol',
  slThresh: 'vol',
  slAmt: 'plain', // converted separately (depends on mode)
  truck: 'vol',
  delivery: 'perVol',
  pumpLine: 'plain',
  pumpBoom: 'plain',
  baseDepth: 'depth',
  basePrice: 'perMass',
  vaporRate: 'perArea',
  meshRate: 'perArea',
  rebarRate: 'perArea',
  labor: 'perArea',
  colored: 'perArea',
  stamped: 'perArea',
  sealerRate: 'perArea',
  forms: 'plain',
  demoRate: 'perArea',
  permit: 'plain',
  region: 'plain',
  overhead: 'plain',
  bagPrice: 'plain',
};
const DEFAULT_VALUES: Record<string, string> = {
  waste: '10',
  price: `${DEFAULT_RATES.concretePerYd3}`,
  slThresh: `${DEFAULT_RATES.shortLoadThresholdYd3}`,
  slAmt: `${DEFAULT_RATES.shortLoadAmount}`,
  truck: `${DEFAULT_RATES.truckCapacityYd3}`,
  delivery: `${DEFAULT_RATES.deliveryPerYd3}`,
  pumpLine: `${DEFAULT_RATES.pumpLine}`,
  pumpBoom: `${DEFAULT_RATES.pumpBoom}`,
  baseDepth: '4',
  basePrice: `${DEFAULT_RATES.basePerTon}`,
  vaporRate: `${DEFAULT_RATES.vaporPerSqFt}`,
  meshRate: `${DEFAULT_RATES.meshPerSqFt}`,
  rebarRate: `${DEFAULT_RATES.rebarPerSqFt}`,
  labor: `${DEFAULT_RATES.laborPerSqFt}`,
  colored: `${DEFAULT_RATES.coloredPerSqFt}`,
  stamped: `${DEFAULT_RATES.stampedPerSqFt}`,
  sealerRate: `${DEFAULT_RATES.sealerPerSqFt}`,
  forms: `${DEFAULT_RATES.formsPerSlab}`,
  demoRate: `${DEFAULT_RATES.demoPerSqFt}`,
  permit: '0',
  region: '1',
  overhead: '0',
  bagPrice: `${DEFAULT_RATES.bagPrice}`,
};
const toMetric: Record<Kind, (n: number) => number> = {
  perVol: (n) => n * YD3_PER_M3,
  vol: (n) => n / YD3_PER_M3,
  perArea: (n) => n * SQFT_PER_M2,
  perMass: (n) => n / TONNE_PER_TON,
  depth: (n) => n * 2.54,
  plain: (n) => n,
};
const toUs: Record<Kind, (n: number) => number> = {
  perVol: (n) => n / YD3_PER_M3,
  vol: (n) => n * YD3_PER_M3,
  perArea: (n) => n / SQFT_PER_M2,
  perMass: (n) => n * TONNE_PER_TON,
  depth: (n) => n / 2.54,
  plain: (n) => n,
};
const BAG_SWAP: Partial<Record<BagSize, BagSize>> = { lb40: 'kg20', lb60: 'kg25', lb80: 'kg40', kg20: 'lb40', kg25: 'lb60', kg30: 'lb60', kg40: 'lb80' };

let rowSeq = 1;
const presetRow = (id: string, units: Units): Row => {
  const p = projectById(id);
  return units === 'us'
    ? { id: rowSeq++, l: `${p.lengthFt}`, w: `${p.widthFt}`, t: `${p.thicknessIn}`, q: '1' }
    : { id: rowSeq++, l: r2(p.lengthFt * M_PER_FT), w: r2(p.widthFt * M_PER_FT), t: r1(p.thicknessIn * 2.54), q: '1' };
};

export default function SlabCostCalculator() {
  const [units, setUnits] = useState<Units>('us');
  const [currency, setCurrency] = useState('USD');
  const [project, setProject] = useState<string>('custom');
  const [psi, setPsi] = useState<number>(4000);
  const [rows, setRows] = useState<Row[]>([{ id: 0, l: '20', w: '20', t: '4', q: '1' }]);
  const [vals, setVals] = useState<Record<string, string>>(DEFAULT_VALUES);
  const [pump, setPump] = useState<Pump>('none');
  const [reinf, setReinf] = useState<Reinforcement>('mesh');
  const [finish, setFinish] = useState<Finish>('broom');
  const [slMode, setSlMode] = useState<ShortLoadMode>('perYard');
  const [bagSize, setBagSize] = useState<BagSize>('lb80');
  const [vapor, setVapor] = useState(false);
  const [sealer, setSealer] = useState(false);
  const [demo, setDemo] = useState(false);
  const [notice, setNotice] = useState('');
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  // restore from a share link
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('s');
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setUnits(s.u === 'metric' ? 'metric' : 'us');
    if (CURRENCIES.some((c) => c.id === s.c)) setCurrency(s.c);
    setProject(typeof s.p === 'string' ? s.p : 'custom');
    setPsi(PSI_PRICES.some((x) => x.psi === s.psi) ? s.psi : 0);
    setRows(s.s.slice(0, 12).map(([l, w, t, q]) => ({ id: rowSeq++, l, w, t, q })));
    setVals({ ...DEFAULT_VALUES, ...Object.fromEntries(Object.entries(s.v).filter(([k]) => k in DEFAULT_VALUES)) });
    setVapor(Boolean(s.b?.vap));
    setSealer(Boolean(s.b?.seal));
    setDemo(Boolean(s.b?.demo));
    if (s.e) {
      if (['none', 'line', 'boom'].includes(s.e.pump)) setPump(s.e.pump);
      if (['none', 'mesh', 'rebar'].includes(s.e.reinf)) setReinf(s.e.reinf);
      if (['broom', 'colored', 'stamped'].includes(s.e.fin)) setFinish(s.e.fin);
      setSlMode(s.e.sl === 'flat' ? 'flat' : 'perYard');
      if (s.e.bag in BAG_LABEL) setBagSize(s.e.bag);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const M = units === 'metric';
  const sym = CURRENCIES.find((c) => c.id === currency)?.sym ?? '$';
  const v = (k: string) => num(vals[k] ?? '0');
  const setV = (k: string) => (s: string) => setVals((prev) => ({ ...prev, [k]: s }));
  const money = (n: number, dp?: number) => `${sym}${fmt(n, dp ?? (Math.abs(n) >= 1000 ? 0 : 2), dp ?? (Math.abs(n) >= 1000 ? 0 : 2))}`;
  const L = M ? 'm' : 'ft';
  const T = M ? 'cm' : 'in';
  const VOL = M ? 'm³' : 'yd³';
  const AREA = M ? 'm²' : 'ft²';
  const MASS = M ? 't' : 'ton';

  // ---------- engine input (canonical imperial) ----------
  const slabs = rows.map((r) => ({
    lengthFt: M ? num(r.l) / M_PER_FT : num(r.l),
    widthFt: M ? num(r.w) / M_PER_FT : num(r.w),
    thicknessIn: M ? num(r.t) / 2.54 : num(r.t),
    qty: Math.floor(num(r.q)),
  }));
  const perVol = (k: string) => (M ? perM3ToPerYd3(v(k)) : v(k));
  const perArea = (k: string) => (M ? perM2ToPerSqFt(v(k)) : v(k));
  const rates = {
    concretePerYd3: perVol('price'),
    shortLoadThresholdYd3: M ? v('slThresh') * YD3_PER_M3 : v('slThresh'),
    shortLoadMode: slMode,
    shortLoadAmount: slMode === 'perYard' ? perVol('slAmt') : v('slAmt'),
    truckCapacityYd3: M ? v('truck') * YD3_PER_M3 : v('truck'),
    deliveryPerYd3: perVol('delivery'),
    pumpLine: v('pumpLine'),
    pumpBoom: v('pumpBoom'),
    basePerTon: M ? perTonneToPerTon(v('basePrice')) : v('basePrice'),
    baseTonsPerYd3: DEFAULT_RATES.baseTonsPerYd3,
    baseCompactionPct: DEFAULT_RATES.baseCompactionPct,
    vaporPerSqFt: perArea('vaporRate'),
    meshPerSqFt: perArea('meshRate'),
    rebarPerSqFt: perArea('rebarRate'),
    laborPerSqFt: perArea('labor'),
    coloredPerSqFt: perArea('colored'),
    stampedPerSqFt: perArea('stamped'),
    sealerPerSqFt: perArea('sealerRate'),
    formsPerSlab: v('forms'),
    demoPerSqFt: perArea('demoRate'),
    bagPrice: v('bagPrice'),
    bagSize,
  };
  const options = {
    wastePct: v('waste'),
    baseDepthIn: M ? v('baseDepth') / 2.54 : v('baseDepth'),
    vaporBarrier: vapor,
    reinforcement: reinf,
    finish,
    sealer,
    pump,
    demolition: demo,
    permit: v('permit'),
    regionFactor: v('region') || 1,
    overheadPct: v('overhead'),
  };
  const res = estimateSlabCost(slabs, options, rates, { metric: M, symbol: sym });

  // display helpers
  const volOut = (yd3: number) => (M ? `${fmt(yd3 / YD3_PER_M3, 2)} m³` : `${fmt(yd3, 2)} yd³`);
  const areaOut = (ft2: number) => (M ? `${fmt(ft2 / SQFT_PER_M2, 1)} m²` : `${fmt(ft2, 0)} ft²`);
  const perAreaOut = (pSqFt: number) => (M ? `${money(pSqFt * SQFT_PER_M2, 2)}/m²` : `${money(pSqFt, 2)}/ft²`);
  const perVolOut = (pYd3: number) => (M ? `${money(pYd3 / YD3_PER_M3, 0)}/m³` : `${money(pYd3, 0)}/yd³`);
  const massOut = (tons: number) => (M ? `${fmt(tons * TONNE_PER_TON, 2)} t` : `${fmt(tons, 2)} tons`);

  // ---------- actions ----------
  const switchUnits = (next: Units) => {
    if (next === units) return;
    const conv = next === 'metric' ? toMetric : toUs;
    setVals((prev) => {
      const out: Record<string, string> = { ...prev };
      for (const [k, kind] of Object.entries(FIELDS)) {
        const val = num(prev[k] ?? '0');
        out[k] = kind === 'plain' ? prev[k] : kind === 'depth' ? r1(conv[kind](val)) : r2(conv[kind](val));
      }
      if (slMode === 'perYard') out.slAmt = r2(conv.perVol(num(prev.slAmt)));
      return out;
    });
    setRows((prev) =>
      prev.map((r) =>
        next === 'metric'
          ? { ...r, l: r2(num(r.l) * M_PER_FT), w: r2(num(r.w) * M_PER_FT), t: r1(num(r.t) * 2.54) }
          : { ...r, l: r2(num(r.l) / M_PER_FT), w: r2(num(r.w) / M_PER_FT), t: r1(num(r.t) / 2.54) },
      ),
    );
    setBagSize((b) => BAG_SWAP[b] ?? (next === 'metric' ? 'kg25' : 'lb80'));
    setUnits(next);
  };
  const pickPsi = (p: number) => {
    setPsi(p);
    const price = psiPrice(p).typical;
    setV('price')(M ? r2(price * YD3_PER_M3) : `${price}`);
  };
  const pickProject = (pid: string) => {
    const p = projectById(pid);
    setProject(pid);
    setRows([presetRow(pid, units)]);
    setReinf(p.reinforcement);
    setVapor(p.vaporBarrier);
    pickPsi(p.psi);
  };
  const updateRow = (rid: number, key: keyof Omit<Row, 'id'>, value: string) => {
    setProject('custom');
    setRows((prev) => prev.map((r) => (r.id === rid ? { ...r, [key]: value } : r)));
  };
  const addRow = () => setRows((prev) => [...prev, { id: rowSeq++, l: M ? '3' : '10', w: M ? '3' : '10', t: prev[prev.length - 1]?.t ?? (M ? '10' : '4'), q: '1' }]);
  const removeRow = (rid: number) => setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== rid) : prev));
  const reset = () => {
    setUnits('us');
    setCurrency('USD');
    setProject('custom');
    setPsi(4000);
    setRows([{ id: rowSeq++, l: '20', w: '20', t: '4', q: '1' }]);
    setVals(DEFAULT_VALUES);
    setPump('none');
    setReinf('mesh');
    setFinish('broom');
    setSlMode('perYard');
    setBagSize('lb80');
    setVapor(false);
    setSealer(false);
    setDemo(false);
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
      `Concrete slab cost estimate (KKC Tools) — ${areaOut(res.areaSqFt)}, ${volOut(res.orderYd3)} ordered`,
      ...res.lines.map((l) => `${l.label}: ${money(l.amount)} (${l.detail})`),
      res.regionAdj ? `Region adjustment: ${money(res.regionAdj)}` : '',
      res.overhead ? `Overhead & profit: ${money(res.overhead)}` : '',
      res.permit ? `Permit: ${money(res.permit)}` : '',
      `Total: ${money(res.total)} · ${perAreaOut(res.perSqFt)} · ${perVolOut(res.perOrderedYd3)} ordered`,
      ...res.compare.map((c) => `${c.label}: ${money(c.total)}`),
      'Estimate only — get local quotes before you order.',
    ]
      .filter(Boolean)
      .join('\n');
  const share = () => {
    const s: Shared = {
      u: units,
      c: currency,
      p: project,
      psi,
      s: rows.map((r) => [r.l, r.w, r.t, r.q]),
      v: vals,
      b: { vap: vapor, seal: sealer, demo },
      e: { pump, reinf, fin: finish, sl: slMode, bag: bagSize },
    };
    const url = `${window.location.origin}${window.location.pathname}?s=${encode(s)}`;
    window.history.replaceState(null, '', url);
    copyText(url, 'Share link copied.');
  };

  // ---------- small UI helpers ----------
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
  const field = (k: string, label: string, suffix?: string, help?: string, onChange?: (s: string) => void) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id(k)}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input id={id(k)} className={styles.input} type="number" inputMode="decimal" min="0" step="any" value={vals[k] ?? ''} onChange={(e) => (onChange ?? setV(k))(e.target.value)} />
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

  const groupSum = (g: string) => res.lines.filter((l) => l.group === g).reduce((a, l) => a + l.amount, 0);
  const segments: Segment[] = [
    { label: 'Concrete & delivery', amount: groupSum('concrete'), tone: 'concrete' },
    { label: 'Base & reinforcement', amount: groupSum('prep'), tone: 'prep' },
    { label: 'Labour & finish', amount: groupSum('labour'), tone: 'labour' },
    { label: 'Removal, region, O&P, permit', amount: groupSum('extras') + res.regionAdj + res.overhead + res.permit, tone: 'extras' },
  ];
  const cheapest = res.compare.reduce((a, c) => (c.total > 0 && c.total < a.total ? c : a), res.compare[2]);
  const usd = currency === 'USD';
  const thick = rows[0] ? num(rows[0].t) : 0;
  const bagList = M ? METRIC_BAGS : IMPERIAL_BAGS;

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          {/* 1. project & units */}
          <div className={styles.card}>
            {head('Project & units', project === 'custom' ? 'custom' : projectById(project).label)}
            <div className={styles.kindGrid} style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }} role="group" aria-label="Project type">
              {PROJECTS.map((p) => (
                <button key={p.id} type="button" aria-pressed={project === p.id} className={`${styles.kindBtn} ${project === p.id ? styles.kindActive : ''}`} onClick={() => pickProject(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>
            <p className={styles.help}>{project === 'custom' ? 'Custom size — presets only fill in typical choices, everything stays editable.' : projectById(project).note}</p>
            <div className={styles.segment} role="group" aria-label="Units" style={{ marginTop: 12 }}>
              <button type="button" aria-pressed={!M} className={`${styles.segBtn} ${!M ? styles.segActive : ''}`} onClick={() => switchUnits('us')}>
                US (ft, in, yd³)
              </button>
              <button type="button" aria-pressed={M} className={`${styles.segBtn} ${M ? styles.segActive : ''}`} onClick={() => switchUnits('metric')}>
                Metric (m, cm, m³)
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
              {!usd && <p className={styles.help}>Default prices are US averages in US dollars. Replace them with local prices — changing the currency only changes the symbol.</p>}
            </div>
          </div>

          {/* 2. slabs */}
          <div className={styles.card}>
            {head('Slab size', `${areaOut(res.areaSqFt)} · ${volOut(res.netYd3)}`)}
            {rows.map((r, i) => (
              <div key={r.id} className={styles.openings} style={{ marginTop: i ? 10 : 0 }}>
                <div className={styles.cardHead} style={{ marginBottom: 8, paddingBottom: 6 }}>
                  <p className={styles.subhead} style={{ margin: 0, flex: 1 }}>
                    Slab {i + 1}
                  </p>
                  {rows.length > 1 && (
                    <button type="button" className={styles.removeBtn} onClick={() => removeRow(r.id)} aria-label={`Remove slab ${i + 1}`}>
                      Remove
                    </button>
                  )}
                </div>
                <div className={styles.fields} style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
                  {(
                    [
                      ['l', 'Length', L],
                      ['w', 'Width', L],
                      ['t', 'Thickness', T],
                      ['q', 'How many', '×'],
                    ] as [keyof Omit<Row, 'id'>, string, string][]
                  ).map(([k, label, suffix]) => (
                    <div className={styles.field} key={k}>
                      <label className={styles.label} htmlFor={id(`r${r.id}${k}`)}>
                        {label}
                      </label>
                      <div className={styles.inputWrap}>
                        <input
                          id={id(`r${r.id}${k}`)}
                          className={styles.input}
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step={k === 'q' ? '1' : 'any'}
                          value={r[k]}
                          onChange={(e) => updateRow(r.id, k, e.target.value)}
                        />
                        <span className={styles.suffix}>{suffix}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className={styles.toggleRow} style={{ marginTop: 10, marginBottom: 0 }}>
              <button type="button" className={styles.addBtn} onClick={addRow}>
                + Add another slab
              </button>
            </div>
            <p className={styles.label} style={{ marginTop: 12 }}>
              Waste &amp; spillage
            </p>
            <div className={styles.pills} role="group" aria-label="Waste allowance">
              {[5, 8, 10].map((w) => pill(v('waste') === w, `${w}%`, () => setV('waste')(`${w}`), w))}
              <div className={styles.inputWrap} style={{ maxWidth: 110 }}>
                <input id={id('waste')} aria-label="Custom waste percent" className={styles.input} type="number" min="0" step="1" value={vals.waste} onChange={(e) => setV('waste')(e.target.value)} />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
            <p className={styles.help}>Covers uneven ground, spillage and form bulge. Need only the volume? Use the concrete calculator.</p>
          </div>

          {/* 3. concrete */}
          <div className={styles.card}>
            {head('Concrete & delivery', `${perVolOut(rates.concretePerYd3)}`)}
            <p className={styles.label}>Strength (sets a typical 2026 price)</p>
            <div className={styles.pills} role="group" aria-label="Concrete strength">
              {PSI_PRICES.map((p) => pill(psi === p.psi, `${fmt(p.psi)} psi`, () => pickPsi(p.psi), p.psi))}
            </div>
            <div className={styles.fields} style={{ marginTop: 10 }}>
              {field('price', `Price per ${VOL}`, `${sym}/${VOL}`, `US 2026: ${M ? `${money(psiPrice(3000).low * YD3_PER_M3, 0)}–${money(psiPrice(5000).high * YD3_PER_M3, 0)}/m³` : '$143–$193/yd³'} by strength.`, (s) => {
                setPsi(0);
                setV('price')(s);
              })}
              {field('delivery', `Delivery per ${VOL}`, `${sym}/${VOL}`, 'Often included within ~20 miles; otherwise about $18–$20/yd³.')}
            </div>
            <p className={styles.label} style={{ marginTop: 12 }}>
              Short-load fee (orders under a full truck)
            </p>
            <div className={styles.pills} role="group" aria-label="Short-load fee type">
              {pill(slMode === 'perYard', `Per ${VOL} ordered`, () => {
                if (slMode !== 'perYard') setV('slAmt')(M ? r2(43 * YD3_PER_M3) : '43');
                setSlMode('perYard');
              })}
              {pill(slMode === 'flat', 'Flat fee', () => {
                if (slMode !== 'flat') setV('slAmt')('150');
                setSlMode('flat');
              })}
            </div>
            <div className={styles.fields} style={{ marginTop: 10 }}>
              {field('slAmt', slMode === 'flat' ? 'Fee' : `Fee per ${VOL}`, slMode === 'flat' ? sym : `${sym}/${VOL}`)}
              {field('slThresh', 'Applies under', VOL)}
              {field('truck', 'Truck holds', VOL, 'A full mixer is usually about 10 yd³ (7.6 m³).')}
            </div>
            <p className={styles.label} style={{ marginTop: 12 }}>
              Pump
            </p>
            <div className={styles.pills} role="group" aria-label="Concrete pump">
              {pill(pump === 'none', 'No pump (chute)', () => setPump('none'))}
              {pill(pump === 'line', 'Line pump', () => setPump('line'))}
              {pill(pump === 'boom', 'Boom pump', () => setPump('boom'))}
            </div>
            {pump !== 'none' && (
              <div className={styles.fields} style={{ marginTop: 10 }}>
                {pump === 'line'
                  ? field('pumpLine', 'Line pump minimum', sym, 'US 2026: about $400–$600 minimum.')
                  : field('pumpBoom', 'Boom pump minimum', sym, 'US 2026: about $800–$1,000 minimum.')}
              </div>
            )}
          </div>

          {/* 4. base & reinforcement */}
          <div className={styles.card}>
            {head('Base & reinforcement')}
            <div className={styles.fields}>
              {field('baseDepth', 'Gravel base depth', T, M ? '0 = no base; 10 cm is common.' : '0 = no base; 4 in is common.')}
              {field('basePrice', `Gravel price per ${MASS}`, `${sym}/${MASS}`, 'Delivered road base, about $28–$55/ton in the US.')}
            </div>
            <p className={styles.label} style={{ marginTop: 12 }}>
              Reinforcement
            </p>
            <div className={styles.pills} role="group" aria-label="Reinforcement">
              {pill(reinf === 'none', 'None', () => setReinf('none'))}
              {pill(reinf === 'mesh', 'Wire mesh', () => setReinf('mesh'))}
              {pill(reinf === 'rebar', 'Rebar grid', () => setReinf('rebar'))}
            </div>
            <div className={styles.fields} style={{ marginTop: 10 }}>
              {reinf === 'mesh' && field('meshRate', `Mesh per ${AREA}`, `${sym}/${AREA}`)}
              {reinf === 'rebar' && field('rebarRate', `Rebar per ${AREA}`, `${sym}/${AREA}`, 'Size the steel with the rebar calculator.')}
            </div>
            <div className={styles.toggleRow} style={{ marginTop: 12, marginBottom: 0 }}>
              {check(vapor, setVapor, 'Vapour barrier', 'vap')}
            </div>
            {vapor && <div className={styles.fields} style={{ marginTop: 10 }}>{field('vaporRate', `Barrier per ${AREA}`, `${sym}/${AREA}`)}</div>}
          </div>

          {/* 5. labour & finish */}
          <div className={styles.card}>
            {head('Labour & finish')}
            <div className={styles.fields}>
              {field('labor', `Placing & finishing per ${AREA}`, `${sym}/${AREA}`, 'Set to 0 for a DIY pour.')}
              {field('forms', 'Forms & joints per slab', sym)}
            </div>
            <p className={styles.label} style={{ marginTop: 12 }}>
              Surface finish
            </p>
            <div className={styles.pills} role="group" aria-label="Surface finish">
              {pill(finish === 'broom', 'Broom (standard)', () => setFinish('broom'))}
              {pill(finish === 'colored', 'Coloured / stained', () => setFinish('colored'))}
              {pill(finish === 'stamped', 'Stamped', () => setFinish('stamped'))}
            </div>
            <div className={styles.fields} style={{ marginTop: 10 }}>
              {finish === 'colored' && field('colored', `Colour per ${AREA}`, `${sym}/${AREA}`, 'US 2026: about $3.50–$7.50/ft² extra.')}
              {finish === 'stamped' && field('stamped', `Stamping per ${AREA}`, `${sym}/${AREA}`, 'US 2026: about $10–$14/ft² extra; elaborate patterns cost more.')}
            </div>
            <div className={styles.toggleRow} style={{ marginTop: 12, marginBottom: 0 }}>
              {check(sealer, setSealer, 'Sealer', 'seal')}
            </div>
            {sealer && <div className={styles.fields} style={{ marginTop: 10 }}>{field('sealerRate', `Sealer per ${AREA}`, `${sym}/${AREA}`)}</div>}
          </div>

          {/* 6. extras */}
          <div className={styles.card}>
            {head('Extras, region & DIY')}
            <div className={styles.toggleRow}>{check(demo, setDemo, 'Remove an old slab first', 'demo')}</div>
            <div className={styles.fields}>
              {demo && field('demoRate', `Removal & haul-away per ${AREA}`, `${sym}/${AREA}`, 'US 2026: about $2–$6/ft² including disposal.')}
              {field('permit', 'Permit', sym, 'Check with your local building department.')}
              {field('region', 'Region factor', '×', '1 = US average. Try 1.2 for high-cost cities, 0.85 for low-cost areas.')}
              {field('overhead', 'Contractor overhead & profit', '%', 'Leave at 0 if your rates already include it.')}
            </div>
            <p className={styles.label} style={{ marginTop: 12 }}>
              DIY bag size
            </p>
            <div className={styles.pills} role="group" aria-label="Bag size">
              {bagList.map((b) => pill(bagSize === b, BAG_LABEL[b], () => setBagSize(b), b))}
            </div>
            <div className={styles.fields} style={{ marginTop: 10 }}>
              {field('bagPrice', `Price per ${BAG_LABEL[bagSize]} bag`, sym)}
            </div>
            <div className={styles.toggleRow} style={{ marginTop: 12, marginBottom: 0 }}>
              <button type="button" className={styles.linkBtn} onClick={reset}>
                Reset to defaults
              </button>
            </div>
          </div>

          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              <strong>{money(res.total)}</strong> · {perAreaOut(res.perSqFt)}
            </span>
            <a href="#slab-cost-results" className={styles.mobileBarLink} tabIndex={-1}>
              Results ↓
            </a>
          </div>
        </div>

        {/* ---------- results ---------- */}
        <div className={styles.results} id="slab-cost-results" aria-live="polite">
          <div className={styles.hero}>
            <div className={styles.heroLabel}>Estimated cost {finish === 'broom' ? '' : `(${finish === 'stamped' ? 'stamped' : 'coloured'})`} with a contractor</div>
            <div className={styles.heroValue}>{money(res.total, 0)}</div>
            <div className={styles.heroSub}>
              {perAreaOut(res.perSqFt)} · {perVolOut(res.perOrderedYd3)} ordered · {areaOut(res.areaSqFt)} · {volOut(res.orderYd3)} to order
            </div>
          </div>

          {usd && res.check !== 'n/a' && (
            <p className={styles.note} style={{ marginTop: 0 }}>
              {res.check === 'within'
                ? `In line with 2026 published prices for a plain slab (${perAreaOut(PUBLISHED_INSTALLED.low)}–${perAreaOut(PUBLISHED_INSTALLED.high)} installed).`
                : res.check === 'below'
                  ? `Below 2026 published prices for a plain slab (${perAreaOut(PUBLISHED_INSTALLED.low)}–${perAreaOut(PUBLISHED_INSTALLED.high)}). Check that labour and concrete prices are filled in.`
                  : `Above 2026 published prices for a plain slab (${perAreaOut(PUBLISHED_INSTALLED.low)}–${perAreaOut(PUBLISHED_INSTALLED.high)}) — small jobs, short loads and pumps raise the price per ${AREA}.`}
            </p>
          )}

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Where the money goes</h3>
            <CostBar segments={segments} format={(n) => money(n, 0)} />
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Itemised estimate</h3>
            {res.lines.map((l) => (
              <div className={styles.matRow} key={l.id}>
                <span>
                  <span className={styles.matName}>{l.label}</span>
                  <span className={styles.matSub}>{l.detail}</span>
                </span>
                <span className={styles.matValue}>{money(l.amount)}</span>
              </div>
            ))}
            {res.regionAdj !== 0 && (
              <div className={styles.row}>
                <span>Region factor × {fmt(options.regionFactor, 2)}</span>
                <strong>{money(res.regionAdj)}</strong>
              </div>
            )}
            {res.overhead > 0 && (
              <div className={styles.row}>
                <span>Overhead &amp; profit {fmt(options.overheadPct, 1)}%</span>
                <strong>{money(res.overhead)}</strong>
              </div>
            )}
            {res.permit > 0 && (
              <div className={styles.row}>
                <span>Permit</span>
                <strong>{money(res.permit)}</strong>
              </div>
            )}
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>Total</span>
              <strong>{money(res.total)}</strong>
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Bags vs ready-mix vs contractor</h3>
            {res.compare.map((c) => (
              <div className={styles.matRow} key={c.id}>
                <span>
                  <span className={styles.matName}>
                    {c.label} {c.id === cheapest.id && res.total > 0 && <span className={styles.titleSub}>· lowest cost</span>}
                  </span>
                  <span className={styles.matSub}>{c.detail}</span>
                </span>
                <span className={styles.matValue}>
                  {money(c.total)}
                  <span className={styles.matAlt}>{perAreaOut(c.perSqFt)}</span>
                </span>
              </div>
            ))}
            <p className={styles.note}>DIY prices leave out tool hire and your own time, and assume a plain broom finish. Mixing {res.bags} bags by hand is a lot of work — check the time and help you have.</p>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>What to order</h3>
            {(
              [
                ['Slab volume', volOut(res.netYd3)],
                [`With ${fmt(options.wastePct, 1)}% waste`, volOut(res.withWasteYd3)],
                ['Order (rounded up to ¼ yd³)', volOut(res.orderYd3)],
                ['Mixer trucks', `${res.trucks}${res.shortLoad ? ' · short load' : ''}`],
                ['Or bags', `${res.bags} × ${BAG_LABEL[bagSize]}`],
                ...(res.baseTons > 0 ? [['Gravel base', massOut(res.baseTons)] as [string, string]] : []),
              ] as [string, string][]
            ).map(([k, val]) => (
              <div className={styles.row} key={k}>
                <span>{k}</span>
                <strong>{val}</strong>
              </div>
            ))}
            <figure style={{ margin: '12px 0 0' }}>
              <TruckDiagram
                order={res.orderYd3}
                capacity={rates.truckCapacityYd3}
                threshold={rates.shortLoadThresholdYd3}
                orderLabel={`${volOut(res.orderYd3)} ordered`}
                capLabel={`full truck ≈ ${volOut(rates.truckCapacityYd3)} · dashed line = short-load limit`}
                clipId={`${uid}-drum`}
              />
            </figure>
          </div>

          <figure className={styles.panel} style={{ margin: 0 }}>
            <SlabSectionDiagram
              thicknessLabel={`${fmt(thick, 1)} ${T} slab`}
              baseLabel={`${fmt(v('baseDepth'), 1)} ${T}`}
              reinforcement={reinf}
              vapor={vapor}
              hasBase={v('baseDepth') > 0}
            />
            <figcaption className={styles.note}>Section through slab 1 — layers follow your choices.</figcaption>
          </figure>

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
            Default prices are US averages checked on {new Date(PRICE_BASIS).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })} from published 2026 cost guides (sources
            below). Every price is editable — use your supplier&apos;s and contractor&apos;s quotes for a real budget.
          </p>
        </div>
      </div>
    </div>
  );
}
