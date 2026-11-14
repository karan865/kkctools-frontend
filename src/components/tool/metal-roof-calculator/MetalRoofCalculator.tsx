'use client';

import React, { useEffect, useId, useState } from 'react';
import styles from './MetalRoofCalculator.module.css';
import { CompareBars, PanelDiagram } from './MetalRoofDiagram';
import { RoofPlanDiagram } from '@/components/tool/shingle-calculator/ShingleDiagram';
import { ASPHALTS, METALS, METAL_LIFE, TEAR_OFF_PRICE, asphaltById, calculateMetalRoof, metalById, type AsphaltId, type MetalId } from '@/lib/metal-roof-engine';
import { type SectionShape } from '@/lib/shingle-engine';

type Units = 'us' | 'metric';
const M_PER_FT = 0.3048;
const SQFT_PER_M2 = 1 / (M_PER_FT * M_PER_FT);
const CURRENCIES = [
  { id: 'USD', sym: '$', label: 'US $' },
  { id: 'CAD', sym: 'C$', label: 'C$' },
  { id: 'AUD', sym: 'A$', label: 'A$' },
  { id: 'NZD', sym: 'NZ$', label: 'NZ$' },
  { id: 'GBP', sym: '£', label: '£' },
  { id: 'EUR', sym: '€', label: '€' },
  { id: 'INR', sym: '₹', label: '₹' },
];
const SHAPES: { id: SectionShape; label: string }[] = [
  { id: 'gable', label: 'Gable' },
  { id: 'hip', label: 'Hip' },
  { id: 'shed', label: 'Shed (one slope)' },
  { id: 'area', label: 'I know the area' },
];

interface Row {
  id: number;
  shape: SectionShape;
  l: string;
  w: string;
  oh: string;
  pitch: string;
  area: string;
}

const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const fmt = (n: number, max = 2, min = 0) => (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });
const r2 = (n: number) => `${Math.round(n * 100) / 100}`;

interface Shared {
  u: Units;
  c: string;
  s: [SectionShape, string, string, string, string, string][];
  m: MetalId;
  a: AsphaltId;
  v: Record<string, string>;
  t: boolean;
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

const usDefaults = (): Record<string, string> => ({
  metalPrice: `${METALS[0].price}`,
  coverage: `${METALS[0].coverageIn}`,
  metalLife: `${(METAL_LIFE[0] + METAL_LIFE[1]) / 2}`,
  asphaltPrice: `${ASPHALTS[0].price}`,
  asphaltLife: `${(ASPHALTS[0].life[0] + ASPHALTS[0].life[1]) / 2}`,
  tear: `${TEAR_OFF_PRICE}`,
  permit: '0',
});
const AREA_KEYS = ['metalPrice', 'asphaltPrice', 'tear'];

let rowSeq = 2;

export default function MetalRoofCalculator() {
  const [units, setUnits] = useState<Units>('us');
  const [currency, setCurrency] = useState('USD');
  const [rows, setRows] = useState<Row[]>([{ id: 1, shape: 'gable', l: '40', w: '28', oh: '1', pitch: '6', area: '1500' }]);
  const [metal, setMetal] = useState<MetalId>('standingSeam');
  const [asphalt, setAsphalt] = useState<AsphaltId>('architectural');
  const [vals, setVals] = useState<Record<string, string>>(usDefaults());
  const [tearOff, setTearOff] = useState(true);
  const [notice, setNotice] = useState('');
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('m');
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setUnits(s.u === 'metric' ? 'metric' : 'us');
    if (CURRENCIES.some((c) => c.id === s.c)) setCurrency(s.c);
    setRows(s.s.slice(0, 8).map(([shape, l, w, oh, pitch, area]) => ({ id: rowSeq++, shape: SHAPES.some((x) => x.id === shape) ? shape : 'gable', l, w, oh, pitch, area })));
    if (METALS.some((m) => m.id === s.m)) setMetal(s.m);
    if (ASPHALTS.some((a) => a.id === s.a)) setAsphalt(s.a);
    setVals((prev) => ({ ...prev, ...Object.fromEntries(Object.entries(s.v).filter(([k]) => k in prev)) }));
    setTearOff(s.t !== false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const M = units === 'metric';
  const sym = CURRENCIES.find((c) => c.id === currency)?.sym ?? '$';
  const v = (k: string) => num(vals[k] ?? '0');
  const setV = (k: string) => (s: string) => setVals((prev) => ({ ...prev, [k]: s }));
  const perArea = (k: string) => (M ? v(k) / SQFT_PER_M2 : v(k)); // to $/ft²
  const money = (n: number) => `${sym}${fmt(n, Math.abs(n) >= 1000 ? 0 : 2, Math.abs(n) >= 1000 ? 0 : 2)}`;
  const L = M ? 'm' : 'ft';
  const AREA = M ? 'm²' : 'ft²';
  const m = metalById(metal);
  const a = asphaltById(asphalt);

  const sections = rows.map((r, i) => ({
    id: `s${i}`,
    shape: r.shape,
    length: M ? num(r.l) / M_PER_FT : num(r.l),
    width: M ? num(r.w) / M_PER_FT : num(r.w),
    overhang: M ? num(r.oh) / M_PER_FT : num(r.oh),
    pitch: num(r.pitch),
    area: M ? num(r.area) * SQFT_PER_M2 : num(r.area),
  }));
  const res = calculateMetalRoof({
    sections,
    metal,
    metalPrice: perArea('metalPrice'),
    coverageIn: m.coverageIn ? (M ? v('coverage') / 2.54 : v('coverage')) : 0,
    asphalt,
    asphaltPrice: perArea('asphaltPrice'),
    tearOff,
    tearOffPrice: perArea('tear'),
    permit: v('permit'),
    metalLife: v('metalLife'),
    asphaltLife: v('asphaltLife'),
  });
  const areaOut = (ft2: number) => (M ? `${fmt(ft2 / SQFT_PER_M2, 1)} m²` : `${fmt(ft2, 0)} ft²`);
  const lenOut = (ft: number) => (M ? `${fmt(ft * M_PER_FT, 1)} m` : `${fmt(ft, 0)} ft`);
  const lenOut1 = (ft: number) => (M ? `${fmt(ft * M_PER_FT, 2)} m` : `${fmt(ft, 1)} ft`);
  const perAreaOut = (pSqFt: number) => (M ? `${money(pSqFt * SQFT_PER_M2)}/m²` : `${money(pSqFt)}/ft²`);
  const rangeTxt = (r: [number, number]) => (M ? `${money(r[0] * SQFT_PER_M2)}–${money(r[1] * SQFT_PER_M2)}/m²` : `$${r[0]}–$${r[1]}/ft²`);

  // ---------- actions ----------
  const switchUnits = (next: Units) => {
    if (next === units) return;
    const f = next === 'metric' ? M_PER_FT : 1 / M_PER_FT;
    setRows((prev) => prev.map((r) => ({ ...r, l: r2(num(r.l) * f), w: r2(num(r.w) * f), oh: r2(num(r.oh) * f), area: r2(num(r.area) / (next === 'metric' ? SQFT_PER_M2 : 1 / SQFT_PER_M2)) })));
    setVals((prev) => {
      const out = { ...prev };
      for (const k of AREA_KEYS) out[k] = r2(num(prev[k]) * (next === 'metric' ? SQFT_PER_M2 : 1 / SQFT_PER_M2));
      out.coverage = r2(num(prev.coverage) * (next === 'metric' ? 2.54 : 1 / 2.54));
      return out;
    });
    setUnits(next);
  };
  const pickMetal = (mid: MetalId) => {
    const t = metalById(mid);
    setMetal(mid);
    setVals((prev) => ({ ...prev, metalPrice: M ? r2(t.price * SQFT_PER_M2) : `${t.price}`, coverage: M ? r2(t.coverageIn * 2.54) : `${t.coverageIn}` }));
  };
  const pickAsphalt = (aid: AsphaltId) => {
    const t = asphaltById(aid);
    setAsphalt(aid);
    setVals((prev) => ({ ...prev, asphaltPrice: M ? r2(t.price * SQFT_PER_M2) : `${t.price}`, asphaltLife: `${(t.life[0] + t.life[1]) / 2}` }));
  };
  const updateRow = (rid: number, key: keyof Omit<Row, 'id'>, value: string) => setRows((prev) => prev.map((r) => (r.id === rid ? { ...r, [key]: value } : r)));
  const addRow = () => setRows((prev) => [...prev, { id: rowSeq++, shape: 'gable', l: M ? '6' : '20', w: M ? '4' : '14', oh: M ? '0.3' : '1', pitch: '6', area: M ? '30' : '300' }]);
  const removeRow = (rid: number) => setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== rid) : prev));
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
      `Metal roof estimate (KKC Tools) — ${areaOut(res.roofArea)} (${fmt(res.squares, 1)} squares), ${m.label.toLowerCase()}`,
      `Metal: ${money(res.metal.total)} (${perAreaOut(res.metal.perSqFt)}), range ${money(res.metal.low)}–${money(res.metal.high)}`,
      `${a.label}: ${money(res.asphalt.total)} — metal is ${fmt(res.ratio, 1)}× the price`,
      `Per year of life: metal ${money(res.metal.perYear)}, asphalt ${money(res.asphalt.perYear)}`,
      res.panels.panels ? `Panels: ${res.panels.panels}` : '',
      'Estimate only — get local quotes.',
    ]
      .filter(Boolean)
      .join('\n');
  const share = () => {
    const s: Shared = { u: units, c: currency, s: rows.map((r) => [r.shape, r.l, r.w, r.oh, r.pitch, r.area]), m: metal, a: asphalt, v: vals, t: tearOff };
    const url = `${window.location.origin}${window.location.pathname}?m=${encode(s)}`;
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
  const rowInput = (r: Row, k: keyof Omit<Row, 'id' | 'shape'>, label: string, suffix: string) => (
    <div className={styles.field} key={k}>
      <label className={styles.label} htmlFor={id(`r${r.id}${k}`)}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input id={id(`r${r.id}${k}`)} className={styles.input} type="number" inputMode="decimal" min="0" step="any" value={r[k]} onChange={(e) => updateRow(r.id, k, e.target.value)} />
        <span className={styles.suffix}>{suffix}</span>
      </div>
    </div>
  );

  const first = rows[0];
  const firstGeo = sections[0];

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          <div className={styles.card}>
            {head('Units & currency')}
            <div className={styles.segment} role="group" aria-label="Units">
              <button type="button" aria-pressed={!M} className={`${styles.segBtn} ${!M ? styles.segActive : ''}`} onClick={() => switchUnits('us')}>
                Feet (ft²)
              </button>
              <button type="button" aria-pressed={M} className={`${styles.segBtn} ${M ? styles.segActive : ''}`} onClick={() => switchUnits('metric')}>
                Metres (m²)
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
              {currency !== 'USD' && <p className={styles.help}>Default prices are US averages — enter local prices; the currency only changes the symbol.</p>}
            </div>
          </div>

          <div className={styles.card}>
            {head('Your roof', `${areaOut(res.roofArea)} · ${fmt(res.squares, 1)} squares`)}
            {rows.map((r, i) => (
              <div key={r.id} className={styles.openings} style={{ marginTop: i ? 10 : 0 }}>
                <div className={styles.cardHead} style={{ marginBottom: 8, paddingBottom: 6 }}>
                  <p className={styles.subhead} style={{ margin: 0, flex: 1 }}>
                    {rows.length > 1 ? `Section ${i + 1}` : 'Roof shape'}
                  </p>
                  {rows.length > 1 && (
                    <button type="button" className={styles.removeBtn} onClick={() => removeRow(r.id)} aria-label={`Remove section ${i + 1}`}>
                      Remove
                    </button>
                  )}
                </div>
                <div className={styles.pills} role="group" aria-label={`Roof shape, section ${i + 1}`}>
                  {SHAPES.map((sh) => pill(r.shape === sh.id, sh.label, () => updateRow(r.id, 'shape', sh.id), sh.id))}
                </div>
                <div className={styles.fields} style={{ marginTop: 10 }}>
                  {r.shape === 'area' ? (
                    rowInput(r, 'area', 'Sloped roof area', AREA)
                  ) : (
                    <>
                      {rowInput(r, 'l', 'Building length', L)}
                      {rowInput(r, 'w', 'Building width', L)}
                      {rowInput(r, 'oh', 'Overhang each side', L)}
                    </>
                  )}
                  {rowInput(r, 'pitch', 'Pitch (rise per 12)', '/12')}
                </div>
              </div>
            ))}
            <div className={styles.toggleRow} style={{ marginTop: 10, marginBottom: 0 }}>
              <button type="button" className={styles.addBtn} onClick={addRow}>
                + Add a roof section
              </button>
            </div>
            <p className={styles.help}>Use the building’s footprint; the pitch turns it into sloped roof area. Low-slope metal roofs need panels rated for the pitch.</p>
          </div>

          <div className={styles.card}>
            {head('Metal roof', m.label)}
            <div className={styles.kindGrid} style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }} role="group" aria-label="Metal roof type">
              {METALS.map((t) => (
                <button key={t.id} type="button" aria-pressed={metal === t.id} className={`${styles.kindBtn} ${metal === t.id ? styles.kindActive : ''}`} onClick={() => pickMetal(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
            <p className={styles.help}>{m.note}</p>
            <div className={styles.fields} style={{ marginTop: 10 }}>
              {field('metalPrice', `Installed price per ${AREA}`, `${sym}/${AREA}`, `HomeGuide 2026: ${rangeTxt(m.range)}.`)}
              {m.coverageIn > 0 && field('coverage', 'Panel coverage width', M ? 'cm' : 'in')}
              {field('metalLife', 'Expected life', 'yrs', `Metal roofs: ${METAL_LIFE[0]}–${METAL_LIFE[1]} years (This Old House).`)}
            </div>
          </div>

          <div className={styles.card}>
            {head('Compare with shingles', a.label)}
            <div className={styles.pills} role="group" aria-label="Asphalt shingle type">
              {ASPHALTS.map((t) => pill(asphalt === t.id, t.label, () => pickAsphalt(t.id), t.id))}
            </div>
            <div className={styles.fields} style={{ marginTop: 10 }}>
              {field('asphaltPrice', `Tear-off & replace per ${AREA}`, `${sym}/${AREA}`, `HomeGuide 2026: ${rangeTxt(a.range)}.`)}
              {field('asphaltLife', 'Expected life', 'yrs', `${a.life[0]}–${a.life[1]} years (Fixr).`)}
            </div>
          </div>

          <div className={styles.card}>
            {head('Tear-off & permit')}
            <div className={styles.toggleRow}>
              <label className={`${styles.check} ${tearOff ? styles.checkOn : ''}`} htmlFor={id('tear-on')}>
                <input id={id('tear-on')} type="checkbox" checked={tearOff} onChange={(e) => setTearOff(e.target.checked)} />
                Remove the old roof
              </label>
            </div>
            <div className={styles.fields}>
              {field('tear', `Tear-off per ${AREA}`, `${sym}/${AREA}`, M ? 'About $11–$32/m² (HomeGuide).' : '$1–$3/ft² (HomeGuide 2026).')}
              {field('permit', 'Permit', sym)}
            </div>
            <p className={styles.help}>Untick for new construction or where metal goes over one layer of shingles (check local code and the panel maker).</p>
          </div>

          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              <strong>{money(res.metal.total)}</strong> · {perAreaOut(res.metal.perSqFt)}
            </span>
            <a href="#metal-roof-results" className={styles.mobileBarLink} tabIndex={-1}>
              Results ↓
            </a>
          </div>
        </div>

        {/* ---------- results ---------- */}
        <div className={styles.results} id="metal-roof-results" aria-live="polite">
          <div className={styles.hero}>
            <div className={styles.heroLabel}>{m.label} metal roof</div>
            <div className={styles.heroValue}>{money(res.metal.total)}</div>
            <div className={styles.heroSub}>
              {perAreaOut(res.metal.perSqFt)} · {money(res.metal.perSquare)} per square (100 ft²) · range {money(res.metal.low)}–{money(res.metal.high)}
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Metal vs {a.label.toLowerCase()}</h3>
            <CompareBars
              rows={[
                { label: 'Upfront cost', metal: res.metal.total, asphalt: res.asphalt.total },
                { label: 'Cost per year of life', metal: res.metal.perYear, asphalt: res.asphalt.perYear },
              ]}
              format={(n) => money(n)}
            />
            <p className={styles.note}>
              Metal costs {fmt(res.ratio, 1)}× as much up front ({money(res.difference)} more) and lasts about {fmt(v('metalLife'), 1)} years against {fmt(v('asphaltLife'), 1)}. Over one metal roof’s life you would need about {res.asphaltOverMetalLife.roofs} shingle roofs — roughly {money(res.asphaltOverMetalLife.cost)} at today’s prices.
            </p>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Cost breakdown</h3>
            {(
              [
                [`Metal roof (${areaOut(res.roofArea)} × ${perAreaOut(perArea('metalPrice'))})`, res.metal.installed],
                ...(res.metal.tearOff ? [[`Tear-off (${perAreaOut(perArea('tear'))})`, res.metal.tearOff] as [string, number]] : []),
                ...(v('permit') ? [['Permit', v('permit')] as [string, number]] : []),
              ] as [string, number][]
            ).map(([k, val]) => (
              <div className={styles.row} key={k}>
                <span>{k}</span>
                <strong>{money(val)}</strong>
              </div>
            ))}
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>Total</span>
              <strong>{money(res.metal.total)}</strong>
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Materials to order</h3>
            {(
              [
                ['Roof area', `${areaOut(res.roofArea)} (${fmt(res.squares, 1)} squares)`],
                ...(res.panels.panels
                  ? [['Panels (gable & shed planes)', `${res.panels.panels} × ${res.panels.panelLengthsFt.map((x) => lenOut1(x)).join(' / ')}`] as [string, string]]
                  : []),
                ...(res.panels.linearFt ? [['Panel length, total', lenOut(res.panels.linearFt)] as [string, string]] : []),
                ['Ridge & hip cap', lenOut(res.ridge + res.hips)],
                ['Eave trim', lenOut(res.eaves)],
                ['Rake / gable trim', lenOut(res.rakes)],
                ['Synthetic underlayment', `${res.underlaymentRolls} rolls (10 squares each)`],
              ] as [string, string][]
            ).map(([k, val]) => (
              <div className={styles.row} key={k}>
                <span>{k}</span>
                <strong>{val}</strong>
              </div>
            ))}
            <p className={styles.note}>Panel lengths are eave to ridge including the overhang; hips and valleys need cutting, so add waste for complex roofs.</p>
          </div>

          <figure className={styles.panel} style={{ margin: 0 }}>
            <PanelDiagram
              kind={metal}
              countLabel={res.panels.panels ? `${res.panels.panels / (first.shape === 'gable' ? 2 : 1)} panels per slope` : `${fmt(res.squares, 1)} squares`}
              lengthLabel={res.panels.panelLengthsFt[0] ? lenOut1(res.panels.panelLengthsFt[0]) : ''}
              widthLabel={M ? `${fmt(v('coverage'), 1)} cm` : `${fmt(v('coverage'), 1)} in`}
            />
          </figure>

          {first.shape !== 'area' && (
            <figure className={styles.panel} style={{ margin: 0 }}>
              <RoofPlanDiagram
                shape={first.shape}
                labels={{ L: lenOut(firstGeo.length + 2 * firstGeo.overhang), W: lenOut(firstGeo.width + 2 * firstGeo.overhang) }}
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
          <p className={styles.note}>Prices are midpoints of HomeGuide’s 2026 installed ranges; lifespans from This Old House and Fixr. Working on a roof is dangerous — hire insured pros for steep or high roofs.</p>
        </div>
      </div>
    </div>
  );
}
