'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './ShingleCalculator.module.css';
import { PitchDiagram, RoofPlanDiagram } from './ShingleDiagram';
import {
  FT_PER_M,
  M2_PER_SQUARE,
  SHINGLE_TYPES,
  UNDERLAYMENTS,
  WASTE_PRESETS,
  calculateShingles,
  estimateShingleCost,
  pitchFactor,
  pitchToDegrees,
  shingleById,
  underlaymentById,
  type RoofSection,
  type SectionShape,
  type ShingleInput,
} from '@/lib/shingle-engine';

type Units = 'imperial' | 'metric';
type EdgeKey = 'eaves' | 'rakes' | 'ridge' | 'hips';

const SHAPES: { id: SectionShape; label: string; hint: string }[] = [
  { id: 'gable', label: 'Gable', hint: 'Two slopes meeting at a ridge, triangle ends.' },
  { id: 'hip', label: 'Hip', hint: 'Four slopes, eaves on every side, hips to the corners.' },
  { id: 'shed', label: 'Shed', hint: 'One single slope (lean-to, porch).' },
  { id: 'area', label: 'Measured area', hint: 'You already know the sloped area of this part.' },
];
const PITCHES = [3, 4, 5, 6, 7, 8, 9, 10, 12];

const fmt = (n: number, max = 0, min = 0) => (isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });
const num = (s: string) => {
  const n = parseFloat(s);
  return isFinite(n) && n >= 0 ? n : 0;
};

interface UiSection {
  id: string;
  shape: SectionShape;
  length: string;
  width: string;
  overhang: string;
  pitch: string;
  area: string;
}

// ---------- share link ----------
interface Shared {
  u: Units;
  s: { h: SectionShape; l: number; w: number; o: number; p: number; a: number }[];
  t: string;
  bps: number;
  sps: number;
  nps: number;
  wp: number;
  st: number;
  sr: boolean;
  rl: number;
  ul: string;
  ic: number;
  vl: number;
}
const encode = (s: Shared) => btoa(unescape(encodeURIComponent(JSON.stringify(s)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function decode(raw: string): Shared | null {
  try {
    const s = JSON.parse(decodeURIComponent(escape(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))))) as Shared;
    if (!s || !Array.isArray(s.s) || s.s.length === 0 || s.s.length > 20) return null;
    return s;
  } catch {
    return null;
  }
}

function NumField({ id, label, value, onChange, suffix, step = 'any', help }: { id: string; label: string; value: string; onChange: (v: string) => void; suffix?: string; step?: string; help?: string }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input id={id} className={styles.input} type="number" inputMode="decimal" min="0" step={step} value={value} onChange={(e) => onChange(e.target.value)} />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {help && <p className={styles.help}>{help}</p>}
    </div>
  );
}

export default function ShingleCalculator() {
  const nextId = useRef(2);
  const [units, setUnits] = useState<Units>('imperial');
  const [sections, setSections] = useState<UiSection[]>([{ id: 's1', shape: 'gable', length: '40', width: '28', overhang: '1', pitch: '6', area: '1500' }]);
  const [typeId, setTypeId] = useState('arch');
  const [bpsStr, setBpsStr] = useState('3');
  const [spsStr, setSpsStr] = useState('64');
  const [npsStr, setNpsStr] = useState('4');
  const [wasteStr, setWasteStr] = useState('10');
  const [starterStr, setStarterStr] = useState('105');
  const [starterRakes, setStarterRakes] = useState(true);
  const [ridgeStr, setRidgeStr] = useState('33');
  const [dripStr, setDripStr] = useState('10');
  const [underId, setUnderId] = useState('synthetic');
  const [iceCourses, setIceCourses] = useState(0);
  const [valleyStr, setValleyStr] = useState('0');
  const [overrides, setOverrides] = useState<Partial<Record<EdgeKey, string>>>({});
  const [prices, setPrices] = useState({ bundle: '', starter: '', ridge: '', dripEdge: '', underlayment: '', ice: '' });
  const [notice, setNotice] = useState('');
  const ids = { bps: useId(), sps: useId(), nps: useId(), waste: useId(), starter: useId(), ridge: useId(), drip: useId(), under: useId(), valley: useId(), rakes: useId() };

  const metric = units === 'metric';
  const toFt = (s: string) => (metric ? num(s) * FT_PER_M : num(s));
  const toFt2 = (s: string) => (metric ? num(s) * FT_PER_M * FT_PER_M : num(s));
  const lenOut = (ft: number, dp = 0) => (metric ? `${fmt(ft / FT_PER_M, 1)} m` : `${fmt(ft, dp)} ft`);
  const areaOut = (sqft: number) => (metric ? `${fmt(sqft / (FT_PER_M * FT_PER_M), 1)} m²` : `${fmt(sqft)} sq ft`);
  const lenUnit = metric ? 'm' : 'ft';

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('s');
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setUnits('imperial');
    setSections(
      s.s.map((x, i) => ({
        id: `s${i + 1}`,
        shape: SHAPES.some((sh) => sh.id === x.h) ? x.h : 'gable',
        length: `${x.l}`,
        width: `${x.w}`,
        overhang: `${x.o}`,
        pitch: `${x.p}`,
        area: `${x.a}`,
      })),
    );
    nextId.current = s.s.length + 1;
    if (SHINGLE_TYPES.some((t) => t.id === s.t) || s.t === 'custom') setTypeId(s.t);
    setBpsStr(`${Number(s.bps) || 3}`);
    setSpsStr(`${Number(s.sps) || 64}`);
    setNpsStr(`${Number(s.nps) || 4}`);
    setWasteStr(`${Math.min(50, Math.max(0, Number(s.wp) || 0))}`);
    setStarterStr(`${Number(s.st) || 105}`);
    setStarterRakes(s.sr !== false);
    setRidgeStr(`${Number(s.rl) || 33}`);
    if (UNDERLAYMENTS.some((u) => u.id === s.ul)) setUnderId(s.ul);
    setIceCourses(Math.min(2, Math.max(0, Math.floor(Number(s.ic) || 0))));
    setValleyStr(`${Number(s.vl) || 0}`);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // ---------- derived ----------
  const engineSections: RoofSection[] = sections.map((s) => ({
    id: s.id,
    shape: s.shape,
    length: toFt(s.length),
    width: toFt(s.width),
    overhang: toFt(s.overhang),
    pitch: num(s.pitch),
    area: toFt2(s.area),
  }));
  const edgeOverride: ShingleInput['edgeOverride'] = {};
  (Object.keys(overrides) as EdgeKey[]).forEach((k) => {
    const raw = overrides[k];
    if (raw !== undefined && raw !== '') edgeOverride[k] = toFt(raw);
  });
  const input: ShingleInput = {
    sections: engineSections,
    wastePercent: num(wasteStr),
    bundlesPerSquare: num(bpsStr),
    shinglesPerSquare: num(spsStr),
    nailsPerShingle: num(npsStr),
    starterLfPerBundle: num(starterStr),
    starterOnRakes: starterRakes,
    ridgeLfPerBundle: num(ridgeStr),
    dripEdgePieceFt: toFt(dripStr),
    underlaymentSqftPerRoll: underlaymentById(underId).sqftPerRoll,
    iceCourses,
    iceRollWidthFt: 3,
    iceSqftPerRoll: 200,
    valleyLf: toFt(valleyStr),
    edgeOverride,
  };
  const r = calculateShingles(input);
  const cost = estimateShingleCost(r, {
    bundle: num(prices.bundle),
    starter: num(prices.starter),
    ridge: num(prices.ridge),
    dripEdge: num(prices.dripEdge),
    underlayment: num(prices.underlayment),
    ice: num(prices.ice),
  });
  const under = underlaymentById(underId);

  // ---------- actions ----------
  const switchUnits = (u: Units) => {
    if (u === units) return;
    const f = u === 'metric' ? 1 / FT_PER_M : FT_PER_M;
    const r1 = (x: string, k = f) => `${Math.round(num(x) * k * 100) / 100}`;
    setSections((prev) => prev.map((s) => ({ ...s, length: r1(s.length), width: r1(s.width), overhang: r1(s.overhang), area: r1(s.area, f * f) })));
    setDripStr((d) => r1(d));
    setValleyStr((d) => r1(d));
    setOverrides({});
    setUnits(u);
  };
  const updateSection = (id: string, patch: Partial<UiSection>) => setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const addSection = () => {
    const id = `s${nextId.current++}`;
    setSections((prev) => [...prev, { id, shape: 'gable', length: metric ? '4' : '12', width: metric ? '3' : '10', overhang: metric ? '0.3' : '1', pitch: '4', area: metric ? '20' : '200' }]);
  };
  const removeSection = (id: string) => setSections((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  const pickType = (id: string) => {
    setTypeId(id);
    const t = shingleById(id);
    setBpsStr(`${t.bundlesPerSquare}`);
    setSpsStr(`${t.shinglesPerSquare}`);
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
  const shoppingList = [
    { item: 'Shingle bundles', qty: r.bundles, unit: 'bundles', basis: `${fmt(r.squaresWithWaste, 2)} squares incl. ${fmt(num(wasteStr))}% waste × ${fmt(num(bpsStr))} per square` },
    { item: 'Starter strip', qty: r.starterBundles, unit: 'bundles', basis: `${lenOut(r.starterLf)} of eaves${starterRakes ? ' + rakes' : ''} ÷ ${fmt(num(starterStr))} ft per bundle` },
    { item: 'Hip & ridge cap', qty: r.ridgeBundles, unit: 'bundles', basis: `${lenOut(r.ridgeLf)} of ridge + hips ÷ ${fmt(num(ridgeStr))} ft per bundle` },
    { item: 'Drip edge', qty: r.dripEdgePieces, unit: `× ${fmt(num(dripStr), 1)} ${lenUnit} pieces`, basis: `${lenOut(r.dripEdgeLf)} of eaves + rakes` },
    ...(under.sqftPerRoll > 0 ? [{ item: 'Underlayment', qty: r.underlaymentRolls, unit: 'rolls', basis: `${areaOut(r.underlaymentSqft)} · ${under.label}` }] : []),
    ...(r.iceRolls > 0 ? [{ item: 'Ice & water barrier', qty: r.iceRolls, unit: 'rolls (2 squares)', basis: `${areaOut(r.iceSqft)} at eaves${num(valleyStr) > 0 ? ' and valleys' : ''}` }] : []),
    { item: 'Roofing nails', qty: r.nails, unit: 'nails', basis: `${fmt(num(npsStr))} per shingle` },
  ];
  const summary = () =>
    [
      'Shingle estimate (KKC Tools Shingle Roof Calculator)',
      `Roof area: ${areaOut(r.roofArea)} = ${fmt(r.squares, 2)} squares (${fmt(num(wasteStr))}% waste → ${fmt(r.squaresWithWaste, 2)})`,
      ...shoppingList.map((x) => `${x.item}: ${fmt(x.qty)} ${x.unit}`),
      cost.total > 0 ? `Materials: $${fmt(cost.total, 2, 2)}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  const share = () => {
    const s: Shared = {
      u: 'imperial',
      s: engineSections.map((x) => ({ h: x.shape, l: +x.length.toFixed(3), w: +x.width.toFixed(3), o: +x.overhang.toFixed(3), p: x.pitch, a: +x.area.toFixed(2) })),
      t: typeId,
      bps: num(bpsStr),
      sps: num(spsStr),
      nps: num(npsStr),
      wp: num(wasteStr),
      st: num(starterStr),
      sr: starterRakes,
      rl: num(ridgeStr),
      ul: underId,
      ic: iceCourses,
      vl: +toFt(valleyStr).toFixed(2),
    };
    const url = `${window.location.origin}${window.location.pathname}?s=${encode(s)}`;
    window.history.replaceState(null, '', url);
    copyText(url, 'Share link copied.');
  };

  let step = 0;
  const head = (title: string, sub?: string, extra?: React.ReactNode) => (
    <div className={styles.cardHead}>
      <span className={styles.step}>{++step}</span>
      <h2 className={styles.cardTitle}>
        {title} {sub && <span className={styles.titleSub}>· {sub}</span>}
      </h2>
      {extra}
    </div>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          <div className={styles.card}>
            {head('Choose your units')}
            <div className={styles.segment} role="group" aria-label="Units">
              {(['imperial', 'metric'] as Units[]).map((u) => (
                <button key={u} type="button" aria-pressed={units === u} className={`${styles.segBtn} ${units === u ? styles.segActive : ''}`} onClick={() => switchUnits(u)}>
                  {u === 'imperial' ? 'Feet & square feet' : 'Metres & m²'}
                </button>
              ))}
            </div>
          </div>

          {sections.map((s, idx) => {
            const g = r.sections.find((x) => x.id === s.id);
            const shape = SHAPES.find((x) => x.id === s.shape)!;
            const pitch = num(s.pitch);
            return (
              <div className={styles.card} key={s.id}>
                {head(
                  idx === 0 ? 'Roof shape & size' : `Roof section ${idx + 1}`,
                  g ? areaOut(g.roofArea) : undefined,
                  sections.length > 1 ? (
                    <button type="button" className={styles.removeBtn} onClick={() => removeSection(s.id)} aria-label={`Remove roof section ${idx + 1}`}>
                      Remove
                    </button>
                  ) : undefined,
                )}
                <div className={styles.kindGrid} style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }} role="group" aria-label={`Shape of roof section ${idx + 1}`}>
                  {SHAPES.map((sh) => (
                    <button key={sh.id} type="button" aria-pressed={s.shape === sh.id} className={`${styles.kindBtn} ${s.shape === sh.id ? styles.kindActive : ''}`} onClick={() => updateSection(s.id, { shape: sh.id })}>
                      {sh.label}
                    </button>
                  ))}
                </div>
                <p className={styles.help}>{shape.hint}</p>
                <figure className={styles.diagram}>
                  <RoofPlanDiagram
                    shape={s.shape}
                    labels={
                      g && s.shape !== 'area'
                        ? {
                            L: `${fmt(num(s.length), 1)} ${lenUnit}`,
                            W: `${fmt(num(s.width), 1)} ${lenUnit}`,
                            eaves: lenOut(g.eaves),
                            rakes: g.rakes ? lenOut(g.rakes) : undefined,
                            ridge: lenOut(g.ridge),
                            hips: g.hips ? lenOut(g.hips) : undefined,
                          }
                        : {}
                    }
                  />
                  <figcaption className={styles.figcap}>Seen from above, not to scale. Lengths include the overhang.</figcaption>
                </figure>
                <div className={styles.fields}>
                  {s.shape === 'area' ? (
                    <NumField id={`${s.id}-a`} label="Sloped roof area" value={s.area} onChange={(val) => updateSection(s.id, { area: val })} suffix={metric ? 'm²' : 'sq ft'} />
                  ) : (
                    <>
                      <NumField id={`${s.id}-l`} label="Building length (L)" value={s.length} onChange={(val) => updateSection(s.id, { length: val })} suffix={lenUnit} />
                      <NumField id={`${s.id}-w`} label="Building width (W)" value={s.width} onChange={(val) => updateSection(s.id, { width: val })} suffix={lenUnit} />
                      <NumField id={`${s.id}-o`} label="Overhang each side" value={s.overhang} onChange={(val) => updateSection(s.id, { overhang: val })} suffix={lenUnit} />
                    </>
                  )}
                </div>
                {s.shape !== 'area' && (
                  <>
                    <p className={styles.label} style={{ marginTop: 12 }}>
                      Roof pitch (rise per 12)
                    </p>
                    <div className={styles.pills} role="group" aria-label={`Pitch of roof section ${idx + 1}`}>
                      {PITCHES.map((p) => (
                        <button key={p} type="button" aria-pressed={pitch === p} className={`${styles.pill} ${pitch === p ? styles.pillActive : ''}`} onClick={() => updateSection(s.id, { pitch: `${p}` })}>
                          {p}/12
                        </button>
                      ))}
                      <div className={styles.inputWrap} style={{ maxWidth: 110 }}>
                        <input aria-label="Custom pitch, rise per 12" className={styles.input} type="number" min="0" max="36" step="0.5" value={s.pitch} onChange={(e) => updateSection(s.id, { pitch: e.target.value })} />
                        <span className={styles.suffix}>/12</span>
                      </div>
                    </div>
                    <p className={styles.help}>
                      {fmt(pitch, 1)}/12 = {fmt(pitchToDegrees(pitch), 1)}° · slope factor {fmt(pitchFactor(pitch), 3)} · roof is {fmt((pitchFactor(pitch) - 1) * 100, 1)}% bigger than its footprint.
                    </p>
                  </>
                )}
              </div>
            );
          })}

          <div className={styles.addRow} style={{ gridTemplateColumns: '1fr' }}>
            <button type="button" className={styles.addBtn} onClick={addSection}>
              + Add roof section (porch, garage, dormer)
            </button>
          </div>

          <div className={styles.card}>
            {head('Shingle type & waste')}
            <div className={styles.kindGrid} style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }} role="group" aria-label="Shingle type">
              {SHINGLE_TYPES.map((t) => (
                <button key={t.id} type="button" aria-pressed={typeId === t.id} className={`${styles.kindBtn} ${typeId === t.id ? styles.kindActive : ''}`} onClick={() => pickType(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
            <p className={styles.help}>{typeId === 'custom' ? 'Custom values from your shingle wrapper.' : shingleById(typeId).note}. Always check the bundle wrapper.</p>
            <div className={styles.fields} style={{ marginTop: 10 }}>
              <NumField id={ids.bps} label="Bundles per square" value={bpsStr} onChange={(v) => { setBpsStr(v); setTypeId('custom'); }} step="1" />
              <NumField id={ids.sps} label="Shingles per square" value={spsStr} onChange={(v) => { setSpsStr(v); setTypeId('custom'); }} step="1" />
              <NumField id={ids.nps} label="Nails per shingle" value={npsStr} onChange={setNpsStr} step="1" help="4 standard; 6 in high-wind areas or as the wrapper says." />
            </div>
            <p className={styles.label} style={{ marginTop: 12 }}>
              Waste allowance
            </p>
            <div className={styles.pills} role="group" aria-label="Waste allowance">
              {WASTE_PRESETS.map((w) => (
                <button key={w.id} type="button" aria-pressed={num(wasteStr) === w.percent} className={`${styles.pill} ${num(wasteStr) === w.percent ? styles.pillActive : ''}`} onClick={() => setWasteStr(`${w.percent}`)}>
                  {w.label} {w.percent}%
                </button>
              ))}
              <div className={styles.inputWrap} style={{ maxWidth: 100 }}>
                <input id={ids.waste} aria-label="Custom waste percent" className={styles.input} type="number" min="0" max="50" step="1" value={wasteStr} onChange={(e) => setWasteStr(e.target.value)} />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
            <p className={styles.help}>Covers cuts at rakes, hips and valleys. Starter and ridge cap are counted separately below.</p>
          </div>

          <div className={styles.card}>
            {head('Starter, ridge cap & underlayment')}
            <div className={styles.fields}>
              <NumField id={ids.starter} label="Starter strip per bundle" value={starterStr} onChange={setStarterStr} suffix="ft" help="105 ft (Owens Corning); 120 ft (GAF Pro-Start)." />
              <NumField id={ids.ridge} label="Hip & ridge cap per bundle" value={ridgeStr} onChange={setRidgeStr} suffix="ft" help="33 ft (OC ProEdge); 25 ft (GAF Seal-A-Ridge)." />
              <NumField id={ids.drip} label="Drip edge piece length" value={dripStr} onChange={setDripStr} suffix={lenUnit} />
              <div className={styles.field}>
                <label className={styles.label} htmlFor={ids.under}>
                  Underlayment
                </label>
                <select id={ids.under} className={styles.input} value={underId} onChange={(e) => setUnderId(e.target.value)}>
                  {UNDERLAYMENTS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className={styles.help} htmlFor={ids.rakes} style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, cursor: 'pointer' }}>
              <input id={ids.rakes} type="checkbox" checked={starterRakes} onChange={(e) => setStarterRakes(e.target.checked)} />
              Run starter strip up the rakes too (most shingle makers recommend it)
            </label>
            <p className={styles.label} style={{ marginTop: 12 }}>
              Ice &amp; water barrier along the eaves
            </p>
            <div className={styles.pills} role="group" aria-label="Rows of ice and water barrier along the eaves">
              {[0, 1, 2].map((c) => (
                <button key={c} type="button" aria-pressed={iceCourses === c} className={`${styles.pill} ${iceCourses === c ? styles.pillActive : ''}`} onClick={() => setIceCourses(c)}>
                  {c === 0 ? 'None' : `${c} row${c > 1 ? 's' : ''} (${c * 3} ft)`}
                </button>
              ))}
            </div>
            <div className={styles.fields} style={{ marginTop: 10 }}>
              <NumField id={ids.valley} label="Valley length (lined with barrier)" value={valleyStr} onChange={setValleyStr} suffix={lenUnit} />
            </div>
            <p className={styles.help}>Cold-climate codes often require an ice barrier from the eave edge to inside the wall line — check your local code.</p>
          </div>

          <details className={styles.card}>
            <summary className={styles.summary}>Edge lengths (auto: {lenOut(r.eaves)} eaves · {lenOut(r.rakes)} rakes · {lenOut(r.ridge)} ridge · {lenOut(r.hips)} hips)</summary>
            <p className={styles.help}>Leave blank to use the estimate from your roof sections. Type a number to use your own measurement — useful for measured areas and complex roofs.</p>
            <div className={styles.fields}>
              {(['eaves', 'rakes', 'ridge', 'hips'] as EdgeKey[]).map((k) => (
                <div className={styles.field} key={k}>
                  <label className={styles.label} htmlFor={`edge-${k}`}>
                    {k[0].toUpperCase() + k.slice(1)}
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`edge-${k}`}
                      className={styles.input}
                      type="number"
                      min="0"
                      step="any"
                      placeholder="auto"
                      value={overrides[k] ?? ''}
                      onChange={(e) => setOverrides((o) => ({ ...o, [k]: e.target.value }))}
                    />
                    <span className={styles.suffix}>{lenUnit}</span>
                  </div>
                </div>
              ))}
            </div>
          </details>

          <details className={styles.card}>
            <summary className={styles.summary}>Prices (optional)</summary>
            <div className={styles.fields}>
              {(
                [
                  ['bundle', 'Per shingle bundle'],
                  ['starter', 'Per starter bundle'],
                  ['ridge', 'Per ridge cap bundle'],
                  ['dripEdge', 'Per drip edge piece'],
                  ['underlayment', 'Per underlayment roll'],
                  ['ice', 'Per ice & water roll'],
                ] as [keyof typeof prices, string][]
              ).map(([k, label]) => (
                <NumField key={k} id={`price-${k}`} label={label} value={prices[k]} onChange={(val) => setPrices((p) => ({ ...p, [k]: val }))} suffix="$" />
              ))}
            </div>
            <p className={styles.help}>Materials only. Tear-off, disposal and labor are on the roof replacement estimate, not here.</p>
          </details>

          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              <strong>{fmt(r.bundles)}</strong> bundles · {fmt(r.squares, 1)} squares
            </span>
            <a href="#shingle-results" className={styles.mobileBarLink} tabIndex={-1}>
              Results ↓
            </a>
          </div>
        </div>

        <div className={styles.results} id="shingle-results" aria-live="polite">
          <div className={styles.hero}>
            <div className={styles.heroLabel}>Shingle bundles to buy</div>
            <div className={styles.heroValue}>
              {fmt(r.bundles)} <span className={styles.heroUnit}>bundles</span>
            </div>
            <div className={styles.heroSub}>
              {fmt(r.orderSquares, 2)} squares of {typeId === 'custom' ? 'shingles' : shingleById(typeId).label.toLowerCase()} · {fmt(r.shingles)} shingles · includes {fmt(num(wasteStr))}% waste
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Roof size</h3>
            <div className={styles.row}>
              <span>Footprint (with overhang)</span>
              <strong>{areaOut(r.planArea)}</strong>
            </div>
            <div className={styles.row}>
              <span>Sloped roof area</span>
              <strong>{areaOut(r.roofArea)}</strong>
            </div>
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>Roofing squares</span>
              <strong>
                {fmt(r.squares, 2)} → {fmt(r.squaresWithWaste, 2)} with waste
              </strong>
            </div>
            <p className={styles.note}>
              1 square = 100 sq ft ({fmt(M2_PER_SQUARE, 2)} m²). Bundles = squares with waste × {fmt(num(bpsStr))}, rounded up.
            </p>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Shopping list</h3>
            <div className={styles.tableScroll}>
              <table className={styles.sizeTable}>
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Buy</th>
                    <th scope="col">Based on</th>
                  </tr>
                </thead>
                <tbody>
                  {shoppingList.map((x) => (
                    <tr key={x.item}>
                      <td>
                        <strong>{x.item}</strong>
                      </td>
                      <td>
                        <strong>{fmt(x.qty)}</strong> {x.unit}
                      </td>
                      <td>{x.basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>Flashing, vents, pipe boots and sealant are not included. Coverage varies by brand — check each wrapper.</p>
          </div>

          {cost.total > 0 && (
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Material cost</h3>
              {(
                [
                  ['Shingles', cost.shingles],
                  ['Starter strip', cost.starter],
                  ['Ridge cap', cost.ridge],
                  ['Drip edge', cost.dripEdge],
                  ['Underlayment', cost.underlayment],
                  ['Ice & water', cost.ice],
                ] as [string, number][]
              )
                .filter(([, c]) => c > 0)
                .map(([label, c]) => (
                  <div className={styles.row} key={label}>
                    <span>{label}</span>
                    <strong>${fmt(c, 2, 2)}</strong>
                  </div>
                ))}
              <div className={`${styles.row} ${styles.rowTotal}`}>
                <span>Total materials</span>
                <strong>${fmt(cost.total, 2, 2)}</strong>
              </div>
              <p className={styles.note}>Uses only the prices you entered. Tax, delivery, tear-off and labor are extra.</p>
            </div>
          )}

          <figure className={styles.panel} style={{ margin: 0 }}>
            <PitchDiagram rise={num(sections[0]?.pitch || '6')} factorLabel={`factor ${fmt(pitchFactor(num(sections[0]?.pitch || '6')), 3)}`} />
            <figcaption className={styles.note}>Pitch of the first section. Steeper roofs have more area than their footprint.</figcaption>
          </figure>

          <div className={styles.actions}>
            <button type="button" className={styles.actionBtn} onClick={() => copyText(summary(), 'Results copied.')}>
              Copy results
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
        </div>
      </div>
    </div>
  );
}
