'use client';

import React, { useEffect, useId, useState } from 'react';
import styles from './FenceCostCalculator.module.css';
import { FenceElevation, FencePlan } from './FenceDiagram';
import {
  BAG_80LB_FT3,
  GATE_PRICES,
  MATERIALS,
  MATERIALS_SHARE_PCT,
  M_PER_FT,
  REMOVAL_PER_FT,
  calculateFence,
  holeDepthIn,
  holeDiameterIn,
  materialById,
  type MaterialId,
} from '@/lib/fence-cost-engine';

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
const KG25_FT3 = (25 * BAG_80LB_FT3) / (80 * 0.45359237); // 25 kg bag scaled from 80 lb = 0.60 ft³

interface Row {
  id: number;
  len: string;
  walk: string;
  dbl: string;
}

const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const fmt = (n: number, max = 2, min = 0) => (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });
const r2 = (n: number) => `${Math.round(n * 100) / 100}`;

type Kind = 'len' | 'inch' | 'perLen' | 'plain';
const FIELDS: Record<string, Kind> = {
  height: 'len',
  spacing: 'len',
  walkW: 'len',
  dblW: 'len',
  price: 'perLen',
  share: 'plain',
  walkPrice: 'plain',
  dblPrice: 'plain',
  removal: 'perLen',
  terrain: 'plain',
  permit: 'plain',
  holeDia: 'inch',
  holeDepth: 'inch',
  bagPrice: 'plain',
};
const toMetric: Record<Kind, (n: number) => number> = { len: (n) => n * M_PER_FT, inch: (n) => n * 2.54, perLen: (n) => n / M_PER_FT, plain: (n) => n };
const toUs: Record<Kind, (n: number) => number> = { len: (n) => n / M_PER_FT, inch: (n) => n / 2.54, perLen: (n) => n * M_PER_FT, plain: (n) => n };

/** US-unit defaults for a material (strings for the inputs). */
function materialDefaults(id: MaterialId): Record<string, string> {
  const m = materialById(id);
  const g = GATE_PRICES[m.family];
  return {
    height: `${m.heightFt}`,
    spacing: `${m.spacingFt}`,
    walkW: '4',
    dblW: '10',
    price: `${m.pricePerFt}`,
    share: `${MATERIALS_SHARE_PCT}`,
    walkPrice: `${g.walk}`,
    dblPrice: `${g.double}`,
    removal: `${REMOVAL_PER_FT}`,
    terrain: '0',
    permit: '0',
    holeDia: `${holeDiameterIn(m.postIn)}`,
    holeDepth: `${holeDepthIn(m.heightFt)}`,
    bagPrice: '6.65',
  };
}
const convertAll = (vals: Record<string, string>, to: Units) => {
  const conv = to === 'metric' ? toMetric : toUs;
  const out: Record<string, string> = { ...vals };
  for (const [k, kind] of Object.entries(FIELDS)) out[k] = kind === 'plain' ? vals[k] : r2(conv[kind](num(vals[k] ?? '0')));
  return out;
};

interface Shared {
  u: Units;
  c: string;
  m: MaterialId;
  r: [string, string, string][];
  v: Record<string, string>;
  b: { con: boolean; clo: boolean; rem: boolean };
}
const encode = (s: Shared) => btoa(unescape(encodeURIComponent(JSON.stringify(s)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function decode(raw: string): Shared | null {
  try {
    const s = JSON.parse(decodeURIComponent(escape(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))))) as Shared;
    return s && Array.isArray(s.r) && s.v ? s : null;
  } catch {
    return null;
  }
}

let rowSeq = 10;
const DEFAULT_ROWS: Row[] = [
  { id: 1, len: '50', walk: '1', dbl: '0' },
  { id: 2, len: '60', walk: '0', dbl: '0' },
  { id: 3, len: '50', walk: '0', dbl: '0' },
];

export default function FenceCostCalculator() {
  const [units, setUnits] = useState<Units>('us');
  const [currency, setCurrency] = useState('USD');
  const [material, setMaterial] = useState<MaterialId>('woodPrivacy');
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [vals, setVals] = useState<Record<string, string>>(materialDefaults('woodPrivacy'));
  const [connected, setConnected] = useState(true);
  const [closed, setClosed] = useState(false);
  const [removal, setRemoval] = useState(false);
  const [notice, setNotice] = useState('');
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('f');
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setUnits(s.u === 'metric' ? 'metric' : 'us');
    if (CURRENCIES.some((c) => c.id === s.c)) setCurrency(s.c);
    if (MATERIALS.some((m) => m.id === s.m)) setMaterial(s.m);
    setRows(s.r.slice(0, 8).map(([len, walk, dbl]) => ({ id: rowSeq++, len, walk, dbl })));
    setVals((prev) => ({ ...prev, ...Object.fromEntries(Object.entries(s.v).filter(([k]) => k in FIELDS)) }));
    if (s.b) {
      setConnected(s.b.con !== false);
      setClosed(Boolean(s.b.clo));
      setRemoval(Boolean(s.b.rem));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const M = units === 'metric';
  const mat = materialById(material);
  const sym = CURRENCIES.find((c) => c.id === currency)?.sym ?? '$';
  const v = (k: string) => num(vals[k] ?? '0');
  const setV = (k: string) => (s: string) => setVals((prev) => ({ ...prev, [k]: s }));
  const back = (k: string) => (M ? toUs[FIELDS[k]](v(k)) : v(k));
  const money = (n: number) => `${sym}${fmt(n, Math.abs(n) >= 1000 ? 0 : 2, Math.abs(n) >= 1000 ? 0 : 2)}`;
  const L = M ? 'm' : 'ft';
  const IN = M ? 'cm' : 'in';

  const input = {
    material,
    heightFt: back('height'),
    runs: rows.map((r) => ({ lengthFt: M ? num(r.len) / M_PER_FT : num(r.len), walkGates: Math.floor(num(r.walk)), doubleGates: Math.floor(num(r.dbl)) })),
    connected,
    closed,
    spacingFt: back('spacing'),
    pricePerFt: back('price'),
    materialsSharePct: v('share'),
    walkGateWidthFt: back('walkW'),
    doubleGateWidthFt: back('dblW'),
    walkGatePrice: v('walkPrice'),
    doubleGatePrice: v('dblPrice'),
    removal,
    removalPerFt: back('removal'),
    terrainPct: v('terrain'),
    permit: v('permit'),
    holeDiaIn: back('holeDia'),
    holeDepthIn: back('holeDepth'),
    bagFt3: M ? KG25_FT3 : BAG_80LB_FT3,
    bagPrice: v('bagPrice'),
  };
  const res = calculateFence(input);
  const lenOut = (ft: number) => (M ? `${fmt(ft * M_PER_FT, 1)} m` : `${fmt(ft, 0)} ft`);
  const perLenOut = (pFt: number) => (M ? `${money(pFt / M_PER_FT)}/m` : `${money(pFt)}/ft`);
  const bagLabel = M ? '25 kg' : '80 lb';
  const rangeTxt = M ? `${money(mat.range[0] / M_PER_FT)}–${money(mat.range[1] / M_PER_FT)}/m` : `$${mat.range[0]}–$${mat.range[1]}/ft`;

  // ---------- actions ----------
  const switchUnits = (next: Units) => {
    if (next === units) return;
    setVals((prev) => convertAll(prev, next));
    setRows((prev) => prev.map((r) => ({ ...r, len: r2(next === 'metric' ? num(r.len) * M_PER_FT : num(r.len) / M_PER_FT) })));
    setUnits(next);
  };
  const pickMaterial = (mid: MaterialId) => {
    setMaterial(mid);
    const d = materialDefaults(mid);
    // keep the user's extras; refresh the material-specific values
    const keep = { share: vals.share, removal: vals.removal, terrain: vals.terrain, permit: vals.permit, bagPrice: vals.bagPrice, walkW: vals.walkW, dblW: vals.dblW };
    const next = M ? { ...convertAll(d, 'metric'), ...keep } : { ...d, ...keep };
    setVals(next);
  };
  const updateRow = (rid: number, key: keyof Omit<Row, 'id'>, value: string) => setRows((prev) => prev.map((r) => (r.id === rid ? { ...r, [key]: value } : r)));
  const addRow = () => setRows((prev) => [...prev, { id: rowSeq++, len: M ? '10' : '30', walk: '0', dbl: '0' }]);
  const removeRow = (rid: number) => setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== rid) : prev));
  const reset = () => {
    setUnits('us');
    setCurrency('USD');
    setMaterial('woodPrivacy');
    setRows(DEFAULT_ROWS.map((r) => ({ ...r, id: rowSeq++ })));
    setVals(materialDefaults('woodPrivacy'));
    setConnected(true);
    setClosed(false);
    setRemoval(false);
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
      `Fence estimate (KKC Tools) — ${mat.label}, ${M ? `${fmt(v('height'), 2)} m` : `${fmt(v('height'), 1)} ft`} high, ${lenOut(res.totalLengthFt)}`,
      `Fence: ${money(res.fenceCost)} · Gates: ${money(res.gatesCost)}${res.removalCost ? ` · Removal: ${money(res.removalCost)}` : ''}${res.permit ? ` · Permit: ${money(res.permit)}` : ''}`,
      `Total: ${money(res.total)} (${perLenOut(res.perFt)}) · DIY materials: ${money(res.diyTotal)}`,
      'Materials:',
      ...res.materials.map((m) => `- ${m.label}: ${fmt(m.qty, 0)} ${m.unit}${m.note ? ` (${m.note})` : ''}`),
      `- Concrete: ${res.bags} × ${bagLabel} bags`,
      'Estimate only — get local quotes and call 811 before you dig.',
    ].join('\n');
  const share = () => {
    const s: Shared = { u: units, c: currency, m: material, r: rows.map((r) => [r.len, r.walk, r.dbl]), v: vals, b: { con: connected, clo: closed, rem: removal } };
    const url = `${window.location.origin}${window.location.pathname}?f=${encode(s)}`;
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

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          {/* 1. material */}
          <div className={styles.card}>
            {head('Fence type', mat.label)}
            <div className={styles.kindGrid} style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }} role="group" aria-label="Fence material">
              {MATERIALS.map((m) => (
                <button key={m.id} type="button" aria-pressed={material === m.id} className={`${styles.kindBtn} ${material === m.id ? styles.kindActive : ''}`} onClick={() => pickMaterial(m.id)}>
                  {m.label}
                </button>
              ))}
            </div>
            <div className={styles.fields} style={{ marginTop: 12 }}>
              {field('height', 'Fence height', L, `Default price is for a ${M ? `${fmt(mat.heightFt * M_PER_FT, 1)} m` : `${mat.heightFt} ft`} fence — taller costs more per ${L}.`)}
              <div className={styles.field}>
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
              </div>
            </div>
            <div className={styles.segment} role="group" aria-label="Units" style={{ marginTop: 12 }}>
              <button type="button" aria-pressed={!M} className={`${styles.segBtn} ${!M ? styles.segActive : ''}`} onClick={() => switchUnits('us')}>
                Feet &amp; inches
              </button>
              <button type="button" aria-pressed={M} className={`${styles.segBtn} ${M ? styles.segActive : ''}`} onClick={() => switchUnits('metric')}>
                Metres &amp; cm
              </button>
            </div>
            {currency !== 'USD' && <p className={styles.help}>Default prices are US averages — enter local prices; the currency only changes the symbol.</p>}
          </div>

          {/* 2. layout */}
          <div className={styles.card}>
            {head('Fence layout', `${lenOut(res.totalLengthFt)} · ${res.walkGates + res.doubleGates} gate${res.walkGates + res.doubleGates === 1 ? '' : 's'}`)}
            {rows.map((r, i) => (
              <div key={r.id} className={styles.openings} style={{ marginTop: i ? 10 : 0 }}>
                <div className={styles.cardHead} style={{ marginBottom: 8, paddingBottom: 6 }}>
                  <p className={styles.subhead} style={{ margin: 0, flex: 1 }}>
                    Side {i + 1}
                  </p>
                  {rows.length > 1 && (
                    <button type="button" className={styles.removeBtn} onClick={() => removeRow(r.id)} aria-label={`Remove side ${i + 1}`}>
                      Remove
                    </button>
                  )}
                </div>
                <div className={styles.fields} style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                  {(
                    [
                      ['len', 'Length', L],
                      ['walk', 'Walk gates', '×'],
                      ['dbl', 'Double gates', '×'],
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
                          step={k === 'len' ? 'any' : '1'}
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
            <div className={styles.toggleRow} style={{ marginTop: 10 }}>
              <button type="button" className={styles.addBtn} onClick={addRow}>
                + Add a side
              </button>
              {check(connected, setConnected, 'Sides meet at corners', 'con')}
              {connected && rows.length > 2 && check(closed, setClosed, 'Closed loop', 'clo')}
            </div>
            <div className={styles.fields}>
              {field('spacing', 'Post spacing', L, mat.kind === 'fabric' ? 'Chain link line posts are usually up to 10 ft apart.' : mat.kind === 'panels' ? 'Usually the panel width.' : 'Usually 6–8 ft.')}
              {field('walkW', 'Walk gate width', L)}
              {field('dblW', 'Double gate width', L, 'Drive gates are often 10–12 ft.')}
            </div>
            <p className={styles.help}>Measure along the fence line, corner to corner. Gate openings are taken out of the fence length.</p>
          </div>

          {/* 3. prices */}
          <div className={styles.card}>
            {head('Prices', perLenOut(back('price')))}
            <div className={styles.fields}>
              {field('price', `Installed price per ${L}`, `${sym}/${L}`, `${mat.label}: ${rangeTxt} (${mat.source.split(':')[0]}).`)}
              {field('share', 'Materials share of that price', '%', 'About half is materials, half labour (This Old House).')}
              {field('walkPrice', 'Walk gate, installed', sym, `Range ${mat.family === 'chain' ? '$110–$415' : '$300–$600'}.`)}
              {field('dblPrice', 'Double / drive gate, installed', sym, `Range ${mat.family === 'chain' ? '$185–$775' : '$300–$1,200'}.`)}
            </div>
          </div>

          {/* 4. extras */}
          <div className={styles.card}>
            {head('Replace, terrain & permit')}
            <div className={styles.toggleRow}>{check(removal, setRemoval, 'Remove the old fence', 'rem')}</div>
            <div className={styles.fields}>
              {removal && field('removal', `Removal & haul-away per ${L}`, `${sym}/${L}`, 'US 2026: about $3–$5 per linear foot.')}
              {field('terrain', 'Slope / rocky ground surcharge', '%', '0 on flat, easy ground.')}
              {field('permit', 'Permit', sym, 'Ask your city or county; HOAs may need approval too.')}
            </div>
          </div>

          {/* 5. concrete */}
          <div className={styles.card}>
            {head('Concrete for the posts', `${res.bags} bags`)}
            <div className={styles.fields} style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
              {field('holeDia', 'Hole diameter', IN, '3 × post width.')}
              {field('holeDepth', 'Hole depth', IN, '⅓ of the height, below frost.')}
              {field('bagPrice', `${bagLabel} bag price`, sym)}
            </div>
            <div className={styles.toggleRow} style={{ marginTop: 12, marginBottom: 0 }}>
              <button type="button" className={styles.linkBtn} onClick={reset}>
                Reset to defaults
              </button>
            </div>
          </div>

          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              <strong>{money(res.total)}</strong> · {perLenOut(res.perFt)}
            </span>
            <a href="#fence-cost-results" className={styles.mobileBarLink} tabIndex={-1}>
              Results ↓
            </a>
          </div>
        </div>

        {/* ---------- results ---------- */}
        <div className={styles.results} id="fence-cost-results" aria-live="polite">
          <div className={styles.hero}>
            <div className={styles.heroLabel}>Installed fence cost</div>
            <div className={styles.heroValue}>{money(res.total)}</div>
            <div className={styles.heroSub}>
              {perLenOut(res.perFt)} · {lenOut(res.totalLengthFt)} of {mat.label.toLowerCase()} · range {money(res.low)}–{money(res.high)}
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Cost breakdown</h3>
            {(
              [
                [`Fence (${lenOut(res.fenceLengthFt)} × ${perLenOut(input.pricePerFt)}${v('terrain') > 0 ? ` + ${fmt(v('terrain'), 0)}%` : ''})`, res.fenceCost],
                [`Gates (${res.walkGates} walk, ${res.doubleGates} double)`, res.gatesCost],
                ...(res.removalCost ? [[`Remove old fence (${lenOut(res.totalLengthFt)})`, res.removalCost] as [string, number]] : []),
                ...(res.permit ? [['Permit', res.permit] as [string, number]] : []),
              ] as [string, number][]
            ).map(([k, val]) => (
              <div className={styles.row} key={k}>
                <span>{k}</span>
                <strong>{money(val)}</strong>
              </div>
            ))}
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>Total</span>
              <strong>{money(res.total)}</strong>
            </div>
            <div className={styles.matRow} style={{ marginTop: 8 }}>
              <span>
                <span className={styles.matName}>Do it yourself</span>
                <span className={styles.matSub}>materials only{res.permit ? ' + permit' : ''} — about {fmt(v('share'), 0)}% of the installed price</span>
              </span>
              <span className={styles.matValue}>{money(res.diyTotal)}</span>
            </div>
            <div className={styles.matRow}>
              <span>
                <span className={styles.matName}>Labour (pro)</span>
                <span className={styles.matSub}>installation{res.removalCost ? ' and removal' : ''}</span>
              </span>
              <span className={styles.matValue}>{money(res.labourCost)}</span>
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Materials list</h3>
            {res.materials.map((m) => (
              <div className={styles.matRow} key={m.label}>
                <span>
                  <span className={styles.matName}>{m.label}</span>
                  {m.note && <span className={styles.matSub}>{M ? m.note.replace(/(\d+(\.\d+)?) ft/g, (_, ft) => `${fmt(Number(ft) * M_PER_FT, 2)} m`).replace(/(\d+(\.\d+)?) in/g, (_, inch) => `${fmt(Number(inch) * 2.54, 1)} cm`) : m.note}</span>}
                </span>
                <span className={styles.matValue}>
                  {fmt(m.qty, 0)} <span className={styles.matAlt}>{M ? m.unit.replace(/(\d+(\.\d+)?)-ft/, (_, ft) => `${fmt(Number(ft) * M_PER_FT, 1)}-m`).replace(/^ft$/, 'ft of fabric') : m.unit}</span>
                </span>
              </div>
            ))}
            <div className={styles.matRow}>
              <span>
                <span className={styles.matName}>Concrete</span>
                <span className={styles.matSub}>
                  {M ? `${fmt(res.concretePerPostFt3 * 28.3168, 1)} L` : `${fmt(res.concretePerPostFt3, 2)} ft³`} per post × {res.posts} posts
                </span>
              </span>
              <span className={styles.matValue}>
                {res.bags} <span className={styles.matAlt}>{bagLabel} bags · {money(res.concreteCost)}</span>
              </span>
            </div>
            <p className={styles.note}>Quantities for shopping; their cost is already inside the installed price per {L}.</p>
          </div>

          <figure className={styles.panel} style={{ margin: 0 }}>
            <FencePlan
              runs={input.runs.map((r) => ({ ...r, label: lenOut(r.lengthFt) }))}
              connected={connected}
              closed={closed}
              spacingFt={input.spacingFt || mat.spacingFt}
              walkW={input.walkGateWidthFt}
              dblW={input.doubleGateWidthFt}
            />
            <figcaption className={styles.note}>
              Plan view: {res.posts} posts ({res.terminalPosts} end, corner &amp; gate posts) · gates shown in orange.
            </figcaption>
          </figure>

          <figure className={styles.panel} style={{ margin: 0 }}>
            <FenceElevation
              kind={mat.kind}
              picketGap={Boolean(mat.gapIn)}
              heightLabel={M ? `${fmt(v('height'), 2)} m` : `${fmt(v('height'), 1)} ft`}
              spacingLabel={`${M ? `${fmt(v('spacing'), 2)} m` : `${fmt(v('spacing'), 1)} ft`} post spacing`}
              holeLabel={`${fmt(v('holeDia'), 1)} ${IN} hole`}
              depthLabel={`${fmt(v('holeDepth'), 0)} ${IN} deep`}
              patternId={`${uid}-chain`}
            />
          </figure>

          <div className={styles.actions}>
            <button type="button" className={styles.actionBtn} onClick={() => copyText(summary(), 'Estimate copied.')}>
              Copy estimate
            </button>
            <button type="button" className={styles.actionBtn} onClick={share}>
              Copy share link
            </button>
            <button type="button" className={styles.actionBtn} onClick={() => window.print()}>
              Print list
            </button>
          </div>
          {notice && (
            <p className={styles.notice} role="status">
              {notice}
            </p>
          )}
          <p className={styles.note}>
            Default prices are midpoints of 2026 US cost guides (This Old House, HomeGuide, Angi). Call 811 before you dig, and check property lines, permits and HOA rules.
          </p>
        </div>
      </div>
    </div>
  );
}
