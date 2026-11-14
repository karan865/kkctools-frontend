'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './LawnMowingCalculator.module.css';
import { TimeBar } from './LawnDiagram';
import {
  EXTRAS,
  FREQUENCIES,
  GRASS,
  LAWN_PRESETS,
  MOWERS,
  OBSTACLES,
  RATE_LEVELS,
  SLOPE,
  SQFT_PER_ACRE,
  SQFT_PER_M2,
  acresPerHour,
  autoMowerId,
  calculateLawn,
  frequencyById,
  mowerById,
  patchesArea,
  priceRange,
  type ExtraId,
  type FrequencyId,
  type LawnInput,
  type Mode,
} from '@/lib/lawn-mowing-engine';

type AreaUnit = 'sqft' | 'acres' | 'm2';
type AreaMethod = 'total' | 'rects';
interface Patch {
  id: string;
  name: string;
  l: string;
  w: string;
  subtract: boolean;
}

const CURRENCIES = ['$', 'A$', 'C$', '£', '€'];
const SEASONS = [26, 30, 35, 52];
const M_PER_FT = 0.3048;

const fmt = (n: number, max = 0, min = 0) => (isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });
const num = (s: string) => {
  const n = parseFloat(s);
  return isFinite(n) && n > 0 ? n : 0;
};

const toSqFt = (value: number, unit: AreaUnit) => (unit === 'acres' ? value * SQFT_PER_ACRE : unit === 'm2' ? value * SQFT_PER_M2 : value);
const fromSqFt = (sqft: number, unit: AreaUnit) => (unit === 'acres' ? sqft / SQFT_PER_ACRE : unit === 'm2' ? sqft / SQFT_PER_M2 : sqft);
const unitLabel: Record<AreaUnit, string> = { sqft: 'sq ft', acres: 'acres', m2: 'm²' };

// ---------- share link ----------
interface Shared {
  m: Mode;
  a: number;
  u: AreaUnit;
  f: FrequencyId;
  sw: number;
  g: string;
  s: string;
  o: string;
  x: ExtraId[];
  r: number;
  mc: number;
  mw: string;
  ng: boolean;
  st: number;
  tr: number;
  cc: number;
  cur: string;
}
function encode(s: Shared): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(s)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decode(raw: string): Shared | null {
  try {
    const s = JSON.parse(decodeURIComponent(escape(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))))) as Shared;
    if (!s || typeof s.a !== 'number' || s.a < 0 || s.a > 1e8) return null;
    return s;
  } catch {
    return null;
  }
}

// ---------- small inputs ----------
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

function Pills<T extends string | number>({ label, options, value, onChange }: { label: string; options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  const id = useId();
  return (
    <div>
      <p className={styles.label} id={id}>
        {label}
      </p>
      <div className={styles.pills} role="group" aria-labelledby={id}>
        {options.map((o) => (
          <button key={String(o.id)} type="button" aria-pressed={value === o.id} className={`${styles.pill} ${value === o.id ? styles.pillActive : ''}`} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- main ----------
export default function LawnMowingCalculator() {
  const nextId = useRef(3);
  const [mode, setMode] = useState<Mode>('homeowner');
  const [method, setMethod] = useState<AreaMethod>('total');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('sqft');
  const [areaStr, setAreaStr] = useState('5000');
  const [patches, setPatches] = useState<Patch[]>([
    { id: 'p1', name: 'Front lawn', l: '40', w: '30', subtract: false },
    { id: 'p2', name: 'Back lawn', l: '60', w: '45', subtract: false },
  ]);
  const [frequency, setFrequency] = useState<FrequencyId>('weekly');
  const [seasonStr, setSeasonStr] = useState('30');
  const [grass, setGrass] = useState('normal');
  const [slope, setSlope] = useState('flat');
  const [obstacles, setObstacles] = useState('few');
  const [narrowGate, setNarrowGate] = useState(false);
  const [extras, setExtras] = useState<ExtraId[]>(['trim', 'edge', 'blow']);
  const [rateStr, setRateStr] = useState('50');
  const [minStr, setMinStr] = useState('35');
  const [mowerId, setMowerId] = useState('auto');
  const [setupStr, setSetupStr] = useState('8');
  const [travelStr, setTravelStr] = useState('12');
  const [costStr, setCostStr] = useState('');
  const [currency, setCurrency] = useState('$');
  const [notice, setNotice] = useState('');
  const ids = {
    area: useId(),
    season: useId(),
    rate: useId(),
    min: useId(),
    setup: useId(),
    travel: useId(),
    cost: useId(),
    mower: useId(),
    cur: useId(),
    gate: useId(),
  };

  // Restore a shared link.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('l');
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setMode(s.m === 'pro' ? 'pro' : 'homeowner');
    const u: AreaUnit = ['sqft', 'acres', 'm2'].includes(s.u) ? s.u : 'sqft';
    setAreaUnit(u);
    setMethod('total');
    setAreaStr(`${Math.round(fromSqFt(s.a, u) * 1000) / 1000}`);
    if (FREQUENCIES.some((f) => f.id === s.f)) setFrequency(s.f);
    setSeasonStr(`${Math.min(52, Math.max(1, Number(s.sw) || 30))}`);
    if (GRASS.some((x) => x.id === s.g)) setGrass(s.g);
    if (SLOPE.some((x) => x.id === s.s)) setSlope(s.s);
    if (OBSTACLES.some((x) => x.id === s.o)) setObstacles(s.o);
    if (Array.isArray(s.x)) setExtras(s.x.filter((x) => EXTRAS.some((e) => e.id === x)));
    setRateStr(`${Number(s.r) || 50}`);
    setMinStr(`${Number(s.mc) >= 0 ? Number(s.mc) : 35}`);
    setMowerId(s.mw === 'auto' || MOWERS.some((m) => m.id === s.mw) ? s.mw : 'auto');
    setNarrowGate(Boolean(s.ng));
    setSetupStr(`${Number(s.st) >= 0 ? Number(s.st) : 8}`);
    setTravelStr(`${Number(s.tr) >= 0 ? Number(s.tr) : 12}`);
    setCostStr(Number(s.cc) > 0 ? `${s.cc}` : '');
    if (CURRENCIES.includes(s.cur)) setCurrency(s.cur);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // ---------- derived ----------
  const rectSqFt =
    areaUnit === 'm2'
      ? patchesArea(patches.map((p) => ({ length: num(p.l), width: num(p.w), subtract: p.subtract }))) * SQFT_PER_M2
      : patchesArea(patches.map((p) => ({ length: num(p.l), width: num(p.w), subtract: p.subtract })));
  const areaSqFt = method === 'total' ? toSqFt(num(areaStr), areaUnit) : rectSqFt;
  const autoId = autoMowerId(areaSqFt, narrowGate);
  const effectiveMowerId = narrowGate ? 'push21' : mowerId === 'auto' ? autoId : mowerId;
  const mower = mowerById(effectiveMowerId);
  const seasonWeeks = Math.min(52, num(seasonStr));
  const input: LawnInput = {
    areaSqFt,
    mode,
    frequency,
    seasonWeeks,
    grass,
    slope,
    obstacles,
    extras,
    mower,
    hourlyRate: num(rateStr),
    minimumCharge: num(minStr),
    setupMin: num(setupStr),
    travelMin: num(travelStr),
    costPerHour: num(costStr),
  };
  const r = calculateLawn(input);
  const range = priceRange(input);
  const freq = frequencyById(frequency);
  const money = (n: number, dp = 0) => `${currency}${fmt(n, dp, dp)}`;
  const recurring = freq.intervalDays > 0;
  const metricRect = areaUnit === 'm2';

  // ---------- actions ----------
  const switchAreaUnit = (u: AreaUnit) => {
    if (u === areaUnit) return;
    if (method === 'total') {
      const sq = toSqFt(num(areaStr), areaUnit);
      const next = fromSqFt(sq, u);
      setAreaStr(`${Math.round(next * (u === 'acres' ? 1000 : 1)) / (u === 'acres' ? 1000 : 1)}`);
    }
    if ((u === 'm2') !== (areaUnit === 'm2')) {
      const f = u === 'm2' ? M_PER_FT : 1 / M_PER_FT;
      setPatches((prev) => prev.map((p) => ({ ...p, l: `${Math.round(num(p.l) * f * 10) / 10}`, w: `${Math.round(num(p.w) * f * 10) / 10}` })));
    }
    setAreaUnit(u);
  };
  const setPreset = (sqft: number) => {
    setMethod('total');
    setAreaStr(`${Math.round(fromSqFt(sqft, areaUnit) * (areaUnit === 'acres' ? 1000 : 1)) / (areaUnit === 'acres' ? 1000 : 1)}`);
  };
  const setLevel = (rate: number) => setRateStr(`${rate}`);
  const toggleExtra = (id: ExtraId) => setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const updatePatch = (id: string, patch: Partial<Patch>) => setPatches((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const addPatch = (subtract: boolean) =>
    setPatches((prev) => [...prev, { id: `p${nextId.current++}`, name: subtract ? 'Bed / pool (not lawn)' : `Area ${prev.length + 1}`, l: '10', w: '10', subtract }]);
  const removePatch = (id: string) => setPatches((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));

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
      `Lawn mowing estimate (KKC Tools) — ${mode === 'pro' ? 'what to charge' : 'what you may pay'}`,
      `Lawn: ${fmt(areaSqFt)} sq ft (${fmt(r.acres, 2)} acres), ${freq.label.toLowerCase()}, ${recurring ? `${seasonWeeks}-week season, ${r.visits} visits` : 'one visit'}`,
      `Mower: ${mower.label} · time per visit ${fmt(r.totalMin)} min at ${money(num(rateStr))}/hour`,
      `Per visit: ${money(r.pricePerVisit, 2)}${r.minimumApplied ? ' (minimum charge)' : ''}`,
      recurring ? `Per month (season average): ${money(r.pricePerMonth)}` : '',
      `Per season: ${money(r.pricePerSeason)}`,
      mode === 'homeowner' ? `Range: ${money(range.low)}–${money(range.high)} per visit` : '',
    ]
      .filter(Boolean)
      .join('\n');
  const share = () => {
    const s: Shared = {
      m: mode,
      a: Math.round(areaSqFt * 100) / 100,
      u: areaUnit,
      f: frequency,
      sw: seasonWeeks,
      g: grass,
      s: slope,
      o: obstacles,
      x: extras,
      r: num(rateStr),
      mc: num(minStr),
      mw: mowerId,
      ng: narrowGate,
      st: num(setupStr),
      tr: num(travelStr),
      cc: num(costStr),
      cur: currency,
    };
    const url = `${window.location.origin}${window.location.pathname}?l=${encode(s)}`;
    window.history.replaceState(null, '', url);
    copyText(url, 'Share link copied.');
  };

  let step = 0;
  const stepHead = (title: string, sub?: string) => (
    <div className={styles.cardHead}>
      <span className={styles.step}>{++step}</span>
      <h2 className={styles.cardTitle}>
        {title} {sub && <span className={styles.titleSub}>· {sub}</span>}
      </h2>
    </div>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {/* ---------------- INPUTS ---------------- */}
        <div className={styles.inputs}>
          <div className={styles.card}>
            {stepHead("Who is this for?")}
            <div className={styles.segment} role="group" aria-label="Calculator mode">
              <button type="button" aria-pressed={mode === 'homeowner'} className={`${styles.segBtn} ${mode === 'homeowner' ? styles.segActive : ''}`} onClick={() => setMode('homeowner')}>
                What will I pay?
              </button>
              <button type="button" aria-pressed={mode === 'pro'} className={`${styles.segBtn} ${mode === 'pro' ? styles.segActive : ''}`} onClick={() => setMode('pro')}>
                What should I charge?
              </button>
            </div>
            <p className={styles.help}>
              {mode === 'homeowner'
                ? 'Homeowner view: uses typical service rates you can change.'
                : 'Lawn-care pro view: price from your mower, your hourly target and your drive time.'}
            </p>
          </div>

          <div className={styles.card}>
            {stepHead('How big is the lawn?', `${fmt(areaSqFt)} sq ft · ${fmt(r.acres, 3)} ac`)}
            <div className={styles.segment} role="group" aria-label="Area unit">
              {(['sqft', 'acres', 'm2'] as AreaUnit[]).map((u) => (
                <button key={u} type="button" aria-pressed={areaUnit === u} className={`${styles.segBtn} ${areaUnit === u ? styles.segActive : ''}`} onClick={() => switchAreaUnit(u)}>
                  {unitLabel[u]}
                </button>
              ))}
            </div>
            <div className={styles.kindGrid} style={{ gridTemplateColumns: '1fr 1fr', marginTop: 12 }} role="group" aria-label="How to enter the area">
              <button type="button" aria-pressed={method === 'total'} className={`${styles.kindBtn} ${method === 'total' ? styles.kindActive : ''}`} onClick={() => setMethod('total')}>
                I know the area
              </button>
              <button type="button" aria-pressed={method === 'rects'} className={`${styles.kindBtn} ${method === 'rects' ? styles.kindActive : ''}`} onClick={() => setMethod('rects')}>
                Measure in rectangles
              </button>
            </div>

            {method === 'total' ? (
              <>
                <div className={styles.fields} style={{ marginTop: 12 }}>
                  <NumField id={ids.area} label="Mowable lawn area" value={areaStr} onChange={setAreaStr} suffix={unitLabel[areaUnit]} />
                </div>
                <p className={styles.label} style={{ marginTop: 10 }}>
                  Or pick a common size
                </p>
                <div className={styles.pills} role="group" aria-label="Common lawn sizes">
                  {LAWN_PRESETS.map((p) => (
                    <button key={p.label} type="button" className={`${styles.pill} ${Math.abs(areaSqFt - p.sqft) < 1 ? styles.pillActive : ''}`} aria-pressed={Math.abs(areaSqFt - p.sqft) < 1} onClick={() => setPreset(p.sqft)}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <p className={styles.help}>Count only grass you mow — not the house, driveway, patio or beds. A ¼-acre lot usually has much less than ¼ acre of lawn.</p>
              </>
            ) : (
              <>
                {patches.map((p, i) => (
                  <div key={p.id} className={styles.fields} style={{ marginTop: 12, alignItems: 'end' }}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor={`${p.id}-n`}>
                        {p.subtract ? 'Take away' : 'Area'} {i + 1}
                      </label>
                      <input id={`${p.id}-n`} className={styles.input} value={p.name} onChange={(e) => updatePatch(p.id, { name: e.target.value })} />
                    </div>
                    <NumField id={`${p.id}-l`} label="Length" value={p.l} onChange={(val) => updatePatch(p.id, { l: val })} suffix={metricRect ? 'm' : 'ft'} />
                    <NumField id={`${p.id}-w`} label="Width" value={p.w} onChange={(val) => updatePatch(p.id, { w: val })} suffix={metricRect ? 'm' : 'ft'} />
                    {patches.length > 1 && (
                      <button type="button" className={styles.removeBtn} onClick={() => removePatch(p.id)} aria-label={`Remove ${p.name}`}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <div className={styles.addRow} style={{ gridTemplateColumns: '1fr 1fr', marginTop: 12 }}>
                  <button type="button" className={styles.addBtn} onClick={() => addPatch(false)}>
                    + Add lawn area
                  </button>
                  <button type="button" className={styles.addBtnAlt} onClick={() => addPatch(true)}>
                    − Take away bed / pool
                  </button>
                </div>
                <p className={styles.help}>
                  Pace or tape each part of the lawn as a rectangle. Odd shapes: use the average length and width. Total: {fmt(areaSqFt)} sq ft ({fmt(areaSqFt / SQFT_PER_M2)} m²).
                </p>
              </>
            )}
          </div>

          <div className={styles.card}>
            {stepHead("How often?", recurring ? `${r.visits} visits` : '1 visit')}
            <Pills label="Mowing frequency" options={FREQUENCIES.map((f) => ({ id: f.id, label: f.label }))} value={frequency} onChange={setFrequency} />
            {recurring && (
              <div style={{ marginTop: 12 }}>
                <Pills label="Mowing season (weeks)" options={SEASONS.map((w) => ({ id: w, label: w === 52 ? 'All year' : `${w} wk` }))} value={seasonWeeks} onChange={(w) => setSeasonStr(`${w}`)} />
                <div className={styles.fields} style={{ marginTop: 10 }}>
                  <NumField id={ids.season} label="Custom season length" value={seasonStr} onChange={setSeasonStr} suffix="weeks" step="1" />
                </div>
                <p className={styles.help}>30 weeks is roughly April–October. Warm, frost-free areas mow longer; northern areas shorter.</p>
              </div>
            )}
          </div>

          <div className={styles.card}>
            {stepHead("Lawn conditions")}
            <Pills label="Grass height" options={GRASS.map((x) => ({ id: x.id, label: x.label }))} value={grass} onChange={setGrass} />
            <div style={{ marginTop: 10 }}>
              <Pills label="Slope" options={SLOPE.map((x) => ({ id: x.id, label: x.label }))} value={slope} onChange={setSlope} />
            </div>
            <div style={{ marginTop: 10 }}>
              <Pills label="Obstacles" options={OBSTACLES.map((x) => ({ id: x.id, label: x.label }))} value={obstacles} onChange={setObstacles} />
            </div>
            <label className={styles.help} htmlFor={ids.gate} style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12, cursor: 'pointer' }}>
              <input id={ids.gate} type="checkbox" checked={narrowGate} onChange={(e) => setNarrowGate(e.target.checked)} />
              Narrow gate (under about 36 in) — only a push mower fits in the back
            </label>
          </div>

          <div className={styles.card}>
            {stepHead("Extras each visit")}
            <div className={styles.fields}>
              {EXTRAS.map((e) => (
                <label key={e.id} className={styles.help} style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', margin: 0 }}>
                  <input type="checkbox" checked={extras.includes(e.id)} onChange={() => toggleExtra(e.id)} />
                  {e.label}
                </label>
              ))}
            </div>
            <p className={styles.help}>Extras add time, not a fixed fee, so they scale with your lawn. Trimming, edging and blowing are usually part of a standard cut.</p>
          </div>

          <div className={styles.card}>
            {stepHead(mode === 'homeowner' ? 'Local price level' : 'Your pricing')}
            {mode === 'homeowner' && (
              <Pills label="Service rate in your area" options={RATE_LEVELS.map((x) => ({ id: x.rate, label: `${x.label} (${currency}${x.rate}/h)` }))} value={num(rateStr)} onChange={setLevel} />
            )}
            <div className={styles.fields} style={{ marginTop: 12 }}>
              <NumField id={ids.rate} label={mode === 'homeowner' ? 'Hourly rate services charge' : 'Your hourly target (per crew hour)'} value={rateStr} onChange={setRateStr} suffix={`${currency}/h`} />
              <NumField id={ids.min} label="Minimum charge per visit" value={minStr} onChange={setMinStr} suffix={currency} />
              <NumField id={ids.travel} label={mode === 'homeowner' ? "Service's drive time" : 'Drive time to this job'} value={travelStr} onChange={setTravelStr} suffix="min" step="1" />
              <NumField id={ids.setup} label="Unload / load / walk the lawn" value={setupStr} onChange={setSetupStr} suffix="min" step="1" />
              {mode === 'pro' && (
                <NumField id={ids.cost} label="Your cost per hour (optional)" value={costStr} onChange={setCostStr} suffix={`${currency}/h`} help="Wages, fuel, equipment and insurance — shows profit per visit." />
              )}
            </div>
            <div className={styles.fields} style={{ marginTop: 12 }}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={ids.mower}>
                  Mower
                </label>
                <select id={ids.mower} className={styles.input} value={narrowGate ? 'push21' : mowerId} disabled={narrowGate} onChange={(e) => setMowerId(e.target.value)}>
                  <option value="auto">Auto — {mowerById(autoId).label} for this size</option>
                  {MOWERS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} (~{fmt(acresPerHour(m), 2)} ac/h)
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={ids.cur}>
                  Currency
                </label>
                <select id={ids.cur} className={styles.input} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className={styles.help}>
              {mode === 'homeowner'
                ? 'Preset rates sit inside the $30–$68 per hour range published by lawn-care software makers in 2026. Get two or three local quotes to confirm.'
                : 'Your hourly target should cover wages, fuel, equipment, insurance and profit. Drive time is billed because it is part of every stop.'}
            </p>
          </div>

          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              <strong>{money(r.pricePerVisit)}</strong> per visit · {money(r.pricePerSeason)} per season
            </span>
            <a href="#lawn-results" className={styles.mobileBarLink} tabIndex={-1}>
              Results ↓
            </a>
          </div>
        </div>

        {/* ---------------- RESULTS ---------------- */}
        <div className={styles.results} id="lawn-results" aria-live="polite">
          <div className={styles.hero}>
            <div className={styles.heroLabel}>{mode === 'homeowner' ? 'Estimated price per visit' : 'Charge per visit'}</div>
            <div className={styles.heroValue}>
              {money(r.pricePerVisit)} <span className={styles.heroUnit}>/ visit</span>
            </div>
            <div className={styles.heroSub}>
              {fmt(areaSqFt)} sq ft · {freq.label.toLowerCase()} · about {fmt(r.totalMin)} min on the job
              {r.minimumApplied ? ' · minimum charge applies' : ''}
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Your costs</h3>
            <div className={styles.row}>
              <span>Per visit</span>
              <strong>{money(r.pricePerVisit, 2)}</strong>
            </div>
            {recurring && (
              <div className={styles.row}>
                <span>Per month (season average)</span>
                <strong>{money(r.pricePerMonth)}</strong>
              </div>
            )}
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>{recurring ? `Per season (${r.visits} visits)` : 'Total'}</span>
              <strong>{money(r.pricePerSeason)}</strong>
            </div>
            <div className={styles.row}>
              <span>Per acre, this visit</span>
              <strong>{money(r.pricePerAcre)}</strong>
            </div>
            <div className={styles.row}>
              <span>Per 1,000 sq ft</span>
              <strong>{money(r.pricePer1000, 2)}</strong>
            </div>
            {mode === 'homeowner' && areaSqFt > 0 && (
              <p className={styles.note}>
                Typical range for this lawn: <strong>{money(range.low)}–{money(range.high)}</strong> per visit (lower-cost to higher-cost areas).
              </p>
            )}
          </div>

          {mode === 'pro' && (
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Your numbers</h3>
              <div className={styles.row}>
                <span>Effective rate (incl. minimum)</span>
                <strong>{money(r.effectiveHourly)}/h</strong>
              </div>
              <div className={styles.row}>
                <span>Acres per hour with {mower.label}</span>
                <strong>{fmt(r.acresPerHour, 2)}</strong>
              </div>
              {r.profitPerVisit !== null && (
                <>
                  <div className={styles.row}>
                    <span>Profit per visit</span>
                    <strong>{money(r.profitPerVisit, 2)}</strong>
                  </div>
                  <div className={styles.row}>
                    <span>Profit per season</span>
                    <strong>{money(r.profitPerVisit * r.visits)}</strong>
                  </div>
                </>
              )}
            </div>
          )}

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Where the time goes</h3>
            <TimeBar mow={r.mowMin} extras={r.extrasMin} setup={r.setupMin} travel={r.travelMin} />
            <p className={styles.note}>
              {mower.label}: about {fmt(r.acresPerHour, 2)} acres per hour on open, flat grass. Price = {fmt(r.totalMin)} min ÷ 60 × {money(num(rateStr))}/h
              {r.minimumApplied ? `, raised to the ${money(num(minStr))} minimum` : ''}.
            </p>
          </div>

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
          <p className={styles.note}>Estimates for planning. Real quotes vary with your area, the crew and the lawn. Nothing you enter leaves your browser.</p>
        </div>
      </div>
    </div>
  );
}
