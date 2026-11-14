'use client';

import React, { useEffect, useId, useState } from 'react';
import styles from './WireGaugeCalculator.module.css';
import { CircuitDiagram, TwoChecksDiagram } from './WireDiagram';
import {
  AWG_SIZES,
  MM2_SIZES,
  M_PER_FT,
  allowableAmpacity,
  conductorById,
  currentFromPower,
  gaugeLookup,
  maxBreaker,
  maxRunM,
  nearestMetricUp,
  resistancePerM,
  sizeWire,
  voltageDrop,
  type Metal,
  type System,
  type TempCol,
} from '@/lib/wire-gauge-engine';

type Mode = 'size' | 'check' | 'lookup';
type LenUnit = 'ft' | 'm';
type LoadBy = 'amps' | 'watts';

const VOLTS: Record<System, number[]> = { dc: [12, 24, 48], ac1: [120, 230, 240, 277], ac3: [208, 400, 480] };
const SYSTEMS: { id: System; label: string }[] = [
  { id: 'ac1', label: 'AC single-phase' },
  { id: 'ac3', label: 'AC three-phase' },
  { id: 'dc', label: 'DC (12/24/48 V)' },
];
const GAUGES = [-3, -2, -1, 0, 1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];

const fmt = (n: number, max = 2, min = 0) => (isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });
const num = (s: string) => {
  const n = parseFloat(s);
  return isFinite(n) && n >= 0 ? n : 0;
};
const gName = (n: number) => (n > 0 ? `${n} AWG` : n === 0 ? '1/0 AWG' : `${1 - n}/0 AWG`);

interface Shared {
  m: Mode;
  s: System;
  v: number;
  lb: LoadBy;
  a: number;
  w: number;
  pf: number;
  l: number;
  lu: LenUnit;
  d: number;
  z: 'awg' | 'mm2';
  mt: Metal;
  c: boolean;
  ins: TempCol;
  t: 60 | 75;
  amb: number;
  n: number;
  ck: string;
  g: number;
}
const encode = (s: Shared) => btoa(JSON.stringify(s)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function decode(raw: string): Shared | null {
  try {
    const s = JSON.parse(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))) as Shared;
    return s && typeof s.v === 'number' ? s : null;
  } catch {
    return null;
  }
}

export default function WireGaugeCalculator() {
  const [mode, setMode] = useState<Mode>('size');
  const [system, setSystem] = useState<System>('ac1');
  const [voltsStr, setVoltsStr] = useState('120');
  const [loadBy, setLoadBy] = useState<LoadBy>('amps');
  const [ampsStr, setAmpsStr] = useState('20');
  const [wattsStr, setWattsStr] = useState('1800');
  const [pfStr, setPfStr] = useState('1');
  const [lenStr, setLenStr] = useState('100');
  const [lenUnit, setLenUnit] = useState<LenUnit>('ft');
  const [dropStr, setDropStr] = useState('3');
  const [sizeSystem, setSizeSystem] = useState<'awg' | 'mm2'>('awg');
  const [metal, setMetal] = useState<Metal>('cu');
  const [continuous, setContinuous] = useState(false);
  const [insulation, setInsulation] = useState<TempCol>(75);
  const [terminal, setTerminal] = useState<60 | 75>(60);
  const [ambientStr, setAmbientStr] = useState('30');
  const [condStr, setCondStr] = useState('3');
  const [checkId, setCheckId] = useState('awg12');
  const [gauge, setGauge] = useState(12);
  const [notice, setNotice] = useState('');
  const ids = { v: useId(), a: useId(), w: useId(), pf: useId(), l: useId(), d: useId(), amb: useId(), n: useId(), ck: useId(), g: useId(), cont: useId(), ins: useId(), term: useId() };

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('w');
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    if (['size', 'check', 'lookup'].includes(s.m)) setMode(s.m);
    if (['dc', 'ac1', 'ac3'].includes(s.s)) setSystem(s.s);
    setVoltsStr(`${s.v}`);
    setLoadBy(s.lb === 'watts' ? 'watts' : 'amps');
    setAmpsStr(`${s.a}`);
    setWattsStr(`${s.w}`);
    setPfStr(`${Math.min(1, Math.max(0.1, s.pf || 1))}`);
    setLenStr(`${s.l}`);
    setLenUnit(s.lu === 'm' ? 'm' : 'ft');
    setDropStr(`${s.d}`);
    setSizeSystem(s.z === 'mm2' ? 'mm2' : 'awg');
    setMetal(s.mt === 'al' ? 'al' : 'cu');
    setContinuous(Boolean(s.c));
    if ([60, 75, 90].includes(s.ins)) setInsulation(s.ins);
    setTerminal(s.t === 75 ? 75 : 60);
    setAmbientStr(`${s.amb}`);
    setCondStr(`${Math.max(1, Math.floor(s.n) || 3)}`);
    if (conductorById(s.ck)) setCheckId(s.ck);
    if (GAUGES.includes(s.g)) setGauge(s.g);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // ---------- derived ----------
  const volts = num(voltsStr);
  const pf = system === 'dc' ? 1 : Math.min(1, Math.max(0.1, num(pfStr) || 1));
  const amps = loadBy === 'amps' ? num(ampsStr) : currentFromPower(num(wattsStr), volts, system, pf);
  const oneWayM = lenUnit === 'ft' ? num(lenStr) * M_PER_FT : num(lenStr);
  const maxDrop = num(dropStr);
  const ampIn = { metal, insulation, terminal, ambientC: num(ambientStr), conductors: Math.max(1, Math.floor(num(condStr))) };
  const sized = sizeWire({ sizeSystem, system, volts, amps, oneWayM, maxDropPct: maxDrop, continuous, ...ampIn });
  const list = sizeSystem === 'awg' ? AWG_SIZES : MM2_SIZES;
  const usable = list.filter((c) => resistancePerM(c, metal) !== null);
  const checkC = conductorById(checkId);
  const checkValid = checkC && checkC.system === sizeSystem && resistancePerM(checkC, metal) !== null ? checkC : usable[0];
  const checkR = checkValid ? resistancePerM(checkValid, metal)! : 0;
  const checkDrop = voltageDrop(amps, checkR, oneWayM, system);
  const checkPct = volts > 0 ? (checkDrop / volts) * 100 : 0;
  const checkAmp = checkValid && sizeSystem === 'awg' ? allowableAmpacity(checkValid, ampIn) : null;
  const checkMaxBreaker = checkValid && checkAmp !== null ? maxBreaker(checkValid, metal, checkAmp) : null;
  const look = gaugeLookup(gauge);
  const lenOut = (m: number) => (lenUnit === 'ft' ? `${fmt(m / M_PER_FT, 0)} ft` : `${fmt(m, 1)} m`);
  const metalName = metal === 'cu' ? 'copper' : 'aluminium';
  const sysName = SYSTEMS.find((x) => x.id === system)!.label;

  // ---------- actions ----------
  const pickSystem = (s: System) => {
    setSystem(s);
    setVoltsStr(`${VOLTS[s][s === 'dc' ? 0 : 0]}`);
    if (s === 'dc') setTerminal(75);
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
  const summary = () => {
    if (mode === 'lookup')
      return `${look.name}: ${fmt(look.dIn, 4)} in (${fmt(look.dMm, 3)} mm), ${fmt(look.areaMm2, 3)} mm², copper ${fmt(look.cuOhmPerKft, 3)} Ω/1000 ft at 20 °C, ${fmt(look.cuLbPerKft, 1)} lb/1000 ft`;
    const head = `${sysName} ${fmt(volts)} V · ${fmt(amps, 1)} A · ${lenOut(oneWayM)} one way · ${metalName}`;
    if (mode === 'check')
      return `Wire check (KKC Tools): ${head}\n${checkValid?.label}: drop ${fmt(checkDrop, 2)} V (${fmt(checkPct, 2)}%), ${fmt(volts - checkDrop, 1)} V at the load${checkAmp !== null ? `, ampacity ${fmt(checkAmp, 1)} A` : ''}\nEstimate only — confirm with your local electrical code and a licensed electrician.`;
    return `Wire size (KKC Tools): ${head}\nUse ${sized.chosen ? sized.chosen.label : 'no listed size'}${sized.chosenRow ? ` — drop ${fmt(sized.chosenRow.dropV, 2)} V (${fmt(sized.chosenRow.dropPct, 2)}%)` : ''}${sized.breaker ? `, breaker ${sized.breaker} A` : ''}\nEstimate only — confirm with your local electrical code and a licensed electrician.`;
  };
  const share = () => {
    const s: Shared = {
      m: mode, s: system, v: volts, lb: loadBy, a: num(ampsStr), w: num(wattsStr), pf, l: num(lenStr), lu: lenUnit, d: maxDrop, z: sizeSystem, mt: metal, c: continuous,
      ins: insulation, t: terminal, amb: num(ambientStr), n: Math.max(1, Math.floor(num(condStr))), ck: checkId, g: gauge,
    };
    const url = `${window.location.origin}${window.location.pathname}?w=${encode(s)}`;
    window.history.replaceState(null, '', url);
    copyText(url, 'Share link copied.');
  };

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
  const field = (id: string, label: string, value: string, onChange: (v: string) => void, suffix?: string, help?: string) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input id={id} className={styles.input} type="number" inputMode="decimal" min="0" step="any" value={value} onChange={(e) => onChange(e.target.value)} />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {help && <p className={styles.help}>{help}</p>}
    </div>
  );

  const chosenIdx = sized.chosen ? sized.rows.findIndex((r) => r.c.id === sized.chosen!.id) : -1;
  const dropIdx = sized.byDrop ? sized.rows.findIndex((r) => r.c.id === sized.byDrop!.id) : -1;
  const ampIdx = sized.byAmpacity ? sized.rows.findIndex((r) => r.c.id === sized.byAmpacity!.id) : -1;
  const ladderStart = Math.max(0, Math.min(...[dropIdx, ampIdx, chosenIdx].filter((x) => x >= 0), 99) - 1);
  const ladder = sized.rows.slice(ladderStart, ladderStart + 9).map((r) => r.c.label);
  const tableRows = sized.rows.slice(Math.max(0, chosenIdx - 2), Math.max(0, chosenIdx - 2) + 6);

  return (
    <div className={styles.wrap}>
      <p className={styles.notice} role="note" style={{ marginTop: 0 }}>
        <strong>Safety:</strong> results are planning estimates. Electrical work must follow your local code (NEC in the US, BS 7671 in the UK, IEC 60364 or
        AS/NZS 3000 elsewhere) and should be checked by a licensed electrician.
      </p>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          <div className={styles.card}>
            {head('What do you need?')}
            <div className={styles.kindGrid} style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }} role="group" aria-label="Calculator mode">
              {(
                [
                  ['size', 'Size a wire'],
                  ['check', 'Check my wire'],
                  ['lookup', 'Gauge lookup'],
                ] as [Mode, string][]
              ).map(([m, label]) => (
                <button key={m} type="button" aria-pressed={mode === m} className={`${styles.kindBtn} ${mode === m ? styles.kindActive : ''}`} onClick={() => setMode(m)}>
                  {label}
                </button>
              ))}
            </div>
            <p className={styles.help}>
              {mode === 'size'
                ? 'Finds the smallest wire that meets both the voltage-drop limit and the current rating.'
                : mode === 'check'
                  ? 'Checks voltage drop and current rating for a wire you already have.'
                  : 'Diameter, area, resistance and weight of any AWG gauge.'}
            </p>
          </div>

          {mode === 'lookup' ? (
            <div className={styles.card}>
              {head('Pick a gauge')}
              <div className={styles.field}>
                <label className={styles.label} htmlFor={ids.g}>
                  AWG gauge
                </label>
                <select id={ids.g} className={styles.input} value={gauge} onChange={(e) => setGauge(Number(e.target.value))}>
                  {GAUGES.map((g) => (
                    <option key={g} value={g}>
                      {gName(g)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.card}>
                {head('Circuit', `${sysName}, ${fmt(volts)} V`)}
                <div className={styles.pills} role="group" aria-label="System type">
                  {SYSTEMS.map((s) => pill(system === s.id, s.label, () => pickSystem(s.id), s.id))}
                </div>
                <p className={styles.label} style={{ marginTop: 10 }}>
                  Voltage
                </p>
                <div className={styles.pills} role="group" aria-label="Voltage">
                  {VOLTS[system].map((v) => pill(volts === v, `${v} V`, () => setVoltsStr(`${v}`), v))}
                  <div className={styles.inputWrap} style={{ maxWidth: 110 }}>
                    <input id={ids.v} aria-label="Custom voltage" className={styles.input} type="number" min="1" step="any" value={voltsStr} onChange={(e) => setVoltsStr(e.target.value)} />
                    <span className={styles.suffix}>V</span>
                  </div>
                </div>
                <p className={styles.help}>{system === 'ac3' ? 'Three-phase: use the line-to-line voltage (e.g. 400 V, 208 V, 480 V).' : system === 'dc' ? 'Battery or DC supply voltage.' : 'Line-to-neutral (120, 230) or line-to-line (240) voltage of the circuit.'}</p>
              </div>

              <div className={styles.card}>
                {head('Load & distance', `${fmt(amps, 1)} A`)}
                <div className={styles.kindGrid} style={{ gridTemplateColumns: '1fr 1fr' }} role="group" aria-label="Load given as">
                  <button type="button" aria-pressed={loadBy === 'amps'} className={`${styles.kindBtn} ${loadBy === 'amps' ? styles.kindActive : ''}`} onClick={() => setLoadBy('amps')}>
                    I know the amps
                  </button>
                  <button type="button" aria-pressed={loadBy === 'watts'} className={`${styles.kindBtn} ${loadBy === 'watts' ? styles.kindActive : ''}`} onClick={() => setLoadBy('watts')}>
                    I know the watts
                  </button>
                </div>
                <div className={styles.fields} style={{ marginTop: 10 }}>
                  {loadBy === 'amps' ? field(ids.a, 'Current', ampsStr, setAmpsStr, 'A') : field(ids.w, 'Power', wattsStr, setWattsStr, 'W', `= ${fmt(amps, 2)} A at ${fmt(volts)} V`)}
                  {loadBy === 'watts' && system !== 'dc' && field(ids.pf, 'Power factor', pfStr, setPfStr, '', '1 for heaters and lights; motors are often 0.8–0.9.')}
                  {field(ids.l, 'One-way length', lenStr, setLenStr, lenUnit, 'Distance from the source to the load — the return path is added for you.')}
                </div>
                <div className={styles.pills} role="group" aria-label="Length unit" style={{ marginTop: 8 }}>
                  {pill(lenUnit === 'ft', 'feet', () => { if (lenUnit === 'm') setLenStr(`${Math.round((num(lenStr) / M_PER_FT) * 10) / 10}`); setLenUnit('ft'); })}
                  {pill(lenUnit === 'm', 'metres', () => { if (lenUnit === 'ft') setLenStr(`${Math.round(num(lenStr) * M_PER_FT * 10) / 10}`); setLenUnit('m'); })}
                </div>
                <p className={styles.label} style={{ marginTop: 10 }}>
                  Allowed voltage drop
                </p>
                <div className={styles.pills} role="group" aria-label="Allowed voltage drop">
                  {[2, 3, 5].map((d) => pill(maxDrop === d, `${d}%`, () => setDropStr(`${d}`), d))}
                  <div className={styles.inputWrap} style={{ maxWidth: 100 }}>
                    <input id={ids.d} aria-label="Custom voltage drop percent" className={styles.input} type="number" min="0.1" step="0.1" value={dropStr} onChange={(e) => setDropStr(e.target.value)} />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
                <p className={styles.help}>3% is a common target for a branch circuit (NEC informational note); low-voltage DC often aims for 2–3%.</p>
              </div>

              <div className={styles.card}>
                {head('Wire')}
                <div className={styles.segment} role="group" aria-label="Wire size system">
                  <button type="button" aria-pressed={sizeSystem === 'awg'} className={`${styles.segBtn} ${sizeSystem === 'awg' ? styles.segActive : ''}`} onClick={() => setSizeSystem('awg')}>
                    AWG / kcmil (US)
                  </button>
                  <button type="button" aria-pressed={sizeSystem === 'mm2'} className={`${styles.segBtn} ${sizeSystem === 'mm2' ? styles.segActive : ''}`} onClick={() => setSizeSystem('mm2')}>
                    mm² (metric)
                  </button>
                </div>
                <div className={styles.pills} role="group" aria-label="Conductor metal" style={{ marginTop: 10 }}>
                  {pill(metal === 'cu', 'Copper', () => setMetal('cu'))}
                  {pill(metal === 'al', 'Aluminium', () => setMetal('al'))}
                </div>
                {mode === 'check' && (
                  <div className={styles.fields} style={{ marginTop: 10 }}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor={ids.ck}>
                        My wire size
                      </label>
                      <select id={ids.ck} className={styles.input} value={checkValid?.id} onChange={(e) => setCheckId(e.target.value)}>
                        {usable.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {sizeSystem === 'awg' ? (
                  <>
                    <label className={styles.help} htmlFor={ids.cont} style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', marginTop: 10 }}>
                      <input id={ids.cont} type="checkbox" checked={continuous} onChange={(e) => setContinuous(e.target.checked)} />
                      Continuous load (on for 3 hours or more) — size for 125%
                    </label>
                    <div className={styles.fields} style={{ marginTop: 10 }}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor={ids.ins}>
                          Insulation rating
                        </label>
                        <select id={ids.ins} className={styles.input} value={insulation} onChange={(e) => setInsulation(Number(e.target.value) as TempCol)}>
                          <option value={60}>60 °C (TW, UF)</option>
                          <option value={75}>75 °C (THW, THWN, XHHW)</option>
                          <option value={90}>90 °C (THHN, XHHW-2, NM-B conductors)</option>
                        </select>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor={ids.term}>
                          Terminal rating
                        </label>
                        <select id={ids.term} className={styles.input} value={terminal} onChange={(e) => setTerminal(Number(e.target.value) as 60 | 75)}>
                          <option value={60}>60 °C (most ≤ 100 A gear, NM-B cable)</option>
                          <option value={75}>75 °C (gear marked 75 °C; circuits over 100 A)</option>
                        </select>
                        {terminal === 60 && amps * (continuous ? 1.25 : 1) > 100 && <p className={styles.help}>Over 100 A, terminations are normally rated 75 °C (NEC 110.14(C)(1)(b)).</p>}
                      </div>
                      {field(ids.amb, 'Ambient temperature', ambientStr, setAmbientStr, '°C', '30 °C = 86 °F is the table basis.')}
                      {field(ids.n, 'Current-carrying conductors together', condStr, setCondStr, '', 'More than 3 in one conduit or cable reduces the rating.')}
                    </div>
                  </>
                ) : (
                  <p className={styles.help} style={{ marginTop: 10 }}>
                    Metric mode sizes by voltage drop only. Current-carrying capacity depends on how the cable is installed — check BS 7671 Appendix 4 or IEC 60364-5-52 for your method.
                  </p>
                )}
              </div>
            </>
          )}

          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              {mode === 'lookup' ? (
                <>
                  <strong>{look.name}</strong> · {fmt(look.areaMm2, 2)} mm²
                </>
              ) : mode === 'check' ? (
                <>
                  <strong>{checkValid?.label}</strong> · drop {fmt(checkPct, 1)}%
                </>
              ) : (
                <>
                  <strong>{sized.chosen ? sized.chosen.label : '—'}</strong> {metalName}
                </>
              )}
            </span>
            <a href="#wire-results" className={styles.mobileBarLink} tabIndex={-1}>
              Results ↓
            </a>
          </div>
        </div>

        <div className={styles.results} id="wire-results" aria-live="polite">
          {mode === 'lookup' && (
            <>
              <div className={styles.hero}>
                <div className={styles.heroLabel}>{look.name}</div>
                <div className={styles.heroValue}>
                  {fmt(look.dIn, 4)} <span className={styles.heroUnit}>in</span>
                </div>
                <div className={styles.heroSub}>
                  {fmt(look.dMm, 3)} mm diameter · {fmt(look.areaMm2, 3)} mm² · {fmt(look.kcmil, 2)} kcmil
                </div>
              </div>
              <div className={styles.panel}>
                <h3 className={styles.panelTitle}>Solid conductor at 20 °C</h3>
                {(
                  [
                    ['Copper resistance', `${fmt(look.cuOhmPerKft, 4)} Ω/1000 ft · ${fmt(look.cuOhmPerKm, 3)} Ω/km`],
                    ['Aluminium resistance', `${fmt(look.alOhmPerKft, 4)} Ω/1000 ft · ${fmt(look.alOhmPerKm, 3)} Ω/km`],
                    ['Copper weight', `${fmt(look.cuLbPerKft, 2)} lb/1000 ft · ${fmt(look.cuKgPerKm, 2)} kg/km`],
                    ['Nearest metric size up', nearestMetricUp(look.areaMm2)?.label ?? 'larger than 300 mm²'],
                  ] as [string, string][]
                ).map(([k, val]) => (
                  <div className={styles.row} key={k}>
                    <span>{k}</span>
                    <strong>{val}</strong>
                  </div>
                ))}
                <p className={styles.note}>Diameter from the AWG formula (ASTM B258); resistance from 100% IACS copper and 61% IACS aluminium; stranded wire is about 2% higher.</p>
              </div>
            </>
          )}

          {mode === 'check' && checkValid && (
            <>
              <div className={styles.hero}>
                <div className={styles.heroLabel}>Voltage drop on {checkValid.label} {metalName}</div>
                <div className={styles.heroValue}>
                  {fmt(checkPct, 2)} <span className={styles.heroUnit}>%</span>
                </div>
                <div className={styles.heroSub}>
                  {fmt(checkDrop, 2)} V lost · {fmt(volts - checkDrop, 1)} V at the load · {checkPct <= maxDrop ? `within your ${fmt(maxDrop)}% limit` : `over your ${fmt(maxDrop)}% limit`}
                </div>
              </div>
              <div className={styles.panel}>
                <h3 className={styles.panelTitle}>Checks</h3>
                <div className={styles.row}>
                  <span>Voltage drop ({fmt(maxDrop)}% limit)</span>
                  <strong>{checkPct <= maxDrop ? '✓ OK' : '✗ Too high'}</strong>
                </div>
                {checkAmp !== null && (
                  <>
                    <div className={styles.row}>
                      <span>Allowable current (after corrections)</span>
                      <strong>{fmt(checkAmp, 1)} A</strong>
                    </div>
                    <div className={styles.row}>
                      <span>Load{continuous ? ' × 125% (continuous)' : ''}</span>
                      <strong>
                        {fmt(amps * (continuous ? 1.25 : 1), 1)} A {checkAmp >= amps * (continuous ? 1.25 : 1) ? '✓' : '✗ too much'}
                      </strong>
                    </div>
                    <div className={styles.row}>
                      <span>Largest breaker for this wire</span>
                      <strong>{checkMaxBreaker !== null ? `${fmt(checkMaxBreaker, 0)} A` : '—'}</strong>
                    </div>
                  </>
                )}
                <div className={styles.row}>
                  <span>Longest run at {fmt(maxDrop)}%</span>
                  <strong>{lenOut(maxRunM(checkValid, metal, amps, volts, system, maxDrop))}</strong>
                </div>
              </div>
            </>
          )}

          {mode === 'size' && (
            <>
              <div className={styles.hero}>
                <div className={styles.heroLabel}>Suggested wire size</div>
                <div className={styles.heroValue}>{sized.chosen ? sized.chosen.label : 'No listed size'}</div>
                <div className={styles.heroSub}>
                  {sized.chosen && sized.chosenRow ? (
                    <>
                      {metalName} · drop {fmt(sized.chosenRow.dropV, 2)} V ({fmt(sized.chosenRow.dropPct, 2)}%) · {fmt(volts - sized.chosenRow.dropV, 1)} V at the load
                      {sizeSystem === 'awg' && sized.chosen && ` · metric ≈ ${nearestMetricUp(sized.chosen.areaMm2)?.label ?? '> 300 mm²'}`}
                    </>
                  ) : (
                    'Nothing in the list meets both checks — use parallel runs, a higher voltage or ask an engineer.'
                  )}
                </div>
              </div>

              {sized.chosen && (
                <div className={styles.panel}>
                  <h3 className={styles.panelTitle}>Why this size</h3>
                  <figure style={{ margin: 0 }}>
                    <TwoChecksDiagram sizes={ladder} dropIndex={dropIdx - ladderStart} ampIndex={ampIdx >= 0 ? ampIdx - ladderStart : -1} chosenIndex={chosenIdx - ladderStart} />
                  </figure>
                  <div className={styles.row}>
                    <span>Voltage drop needs</span>
                    <strong>{sized.byDrop?.label ?? '—'}</strong>
                  </div>
                  {sizeSystem === 'awg' && (
                    <div className={styles.row}>
                      <span>Current rating needs ({fmt(sized.requiredAmps, 1)} A)</span>
                      <strong>{sized.byAmpacity?.label ?? '—'}</strong>
                    </div>
                  )}
                  <p className={styles.note}>
                    {sized.controls === 'drop'
                      ? 'Distance controls: the wire is bigger than the current alone needs, to keep the voltage drop down.'
                      : sized.controls === 'ampacity'
                        ? 'Current controls: the run is short enough that the current rating sets the size.'
                        : sized.controls === 'both'
                          ? 'Both checks land on the same size.'
                          : 'Metric sizing uses voltage drop only — check the current-carrying capacity for your installation method.'}
                  </p>
                  {sizeSystem === 'awg' && sized.breaker !== null && (
                    <div className={`${styles.row} ${styles.rowTotal}`}>
                      <span>Suggested breaker / fuse</span>
                      <strong>{sized.breaker} A</strong>
                    </div>
                  )}
                </div>
              )}

              {tableRows.length > 0 && (
                <div className={styles.panel}>
                  <h3 className={styles.panelTitle}>Nearby sizes</h3>
                  <div className={styles.tableScroll}>
                    <table className={styles.sizeTable}>
                      <thead>
                        <tr>
                          <th scope="col">Size</th>
                          <th scope="col">Drop</th>
                          {sizeSystem === 'awg' && <th scope="col">Rating</th>}
                          <th scope="col">OK?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.map((r) => (
                          <tr key={r.c.id}>
                            <td>
                              <strong>{r.c.label}</strong>
                            </td>
                            <td>
                              {fmt(r.dropPct, 2)}% ({fmt(r.dropV, 2)} V)
                            </td>
                            {sizeSystem === 'awg' && <td>{r.allowable !== null ? `${fmt(r.allowable, 1)} A` : '—'}</td>}
                            <td>{r.okDrop && r.okAmp ? '✓' : r.okDrop ? 'current ✗' : 'drop ✗'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {mode !== 'lookup' && (
            <figure className={styles.panel} style={{ margin: 0 }}>
              <CircuitDiagram
                three={system === 'ac3'}
                lengthLabel={`${lenOut(oneWayM)} one way`}
                ampsLabel={`${fmt(amps, 1)} A`}
                sourceLabel={`${fmt(volts)} V`}
                dropLabel={mode === 'check' ? `${fmt(checkPct, 1)}%` : sized.chosenRow ? `${fmt(sized.chosenRow.dropPct, 1)}%` : undefined}
                loadLabel={mode === 'check' ? `${fmt(volts - checkDrop, 1)} V` : sized.chosenRow ? `${fmt(volts - sized.chosenRow.dropV, 1)} V` : undefined}
              />
            </figure>
          )}

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
          <p className={styles.note}>
            Ampacity: NEC Table 310.16 with Tables 310.15(B)(1) and (C)(1). Resistance at 75 °C (AWG) or 70 °C (mm², IEC 60228). Reactance, motor starting and special cases are not included.
          </p>
        </div>
      </div>
    </div>
  );
}
