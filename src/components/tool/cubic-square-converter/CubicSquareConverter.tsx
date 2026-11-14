'use client';

import React, { useEffect, useId, useState } from 'react';
import styles from './CubicSquareConverter.module.css';
import { SpreadDiagram } from './CubicSquareDiagram';
import {
  L_PER_FT3,
  M_PER_FT,
  PRESETS,
  areaToFt2,
  bagsFor,
  coverageFt2,
  depthToFt,
  ft2To,
  ft3To,
  volumeNeededFt3,
  volumeToFt3,
  type AreaUnit,
  type DepthUnit,
  type VolumeUnit,
} from '@/lib/cubic-square-engine';

type Dir = 'toArea' | 'toVolume';
const VOL_UNITS: { id: VolumeUnit; label: string }[] = [
  { id: 'ft3', label: 'cubic feet (ft³ / cft)' },
  { id: 'yd3', label: 'cubic yards (yd³)' },
  { id: 'm3', label: 'cubic metres (m³)' },
  { id: 'L', label: 'litres (L)' },
];
const AREA_UNITS: { id: AreaUnit; label: string }[] = [
  { id: 'ft2', label: 'square feet (ft²)' },
  { id: 'm2', label: 'square metres (m²)' },
  { id: 'yd2', label: 'square yards (yd²)' },
];
const DEPTH_UNITS: DepthUnit[] = ['in', 'ft', 'cm', 'mm', 'm'];
const BAGS_FT3 = [0.5, 1, 1.5, 2, 3];
const BAGS_L = [25, 40, 50, 70];

const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const fmt = (n: number, max = 2) => (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max });
const sig = (n: number) => fmt(n, n >= 100 ? 1 : n >= 10 ? 2 : 3);

interface Shared {
  d: Dir;
  v: string;
  vu: VolumeUnit;
  src: 'volume' | 'bags';
  bc: string;
  bs: string;
  bu: 'ft3' | 'L';
  am: 'area' | 'lw';
  a: string;
  au: AreaUnit;
  l: string;
  w: string;
  lu: 'ft' | 'm';
  dp: string;
  du: DepthUnit;
}
const encode = (s: Shared) => btoa(JSON.stringify(s)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function decode(raw: string): Shared | null {
  try {
    const s = JSON.parse(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))) as Shared;
    return s && (s.d === 'toArea' || s.d === 'toVolume') ? s : null;
  } catch {
    return null;
  }
}

export default function CubicSquareConverter() {
  const [dir, setDir] = useState<Dir>('toArea');
  const [vol, setVol] = useState('10');
  const [volUnit, setVolUnit] = useState<VolumeUnit>('ft3');
  const [src, setSrc] = useState<'volume' | 'bags'>('volume');
  const [bagCount, setBagCount] = useState('10');
  const [bagSize, setBagSize] = useState('2');
  const [bagUnit, setBagUnit] = useState<'ft3' | 'L'>('ft3');
  const [areaMode, setAreaMode] = useState<'area' | 'lw'>('area');
  const [area, setArea] = useState('100');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('ft2');
  const [len, setLen] = useState('10');
  const [wid, setWid] = useState('10');
  const [lenUnit, setLenUnit] = useState<'ft' | 'm'>('ft');
  const [depth, setDepth] = useState('3');
  const [depthUnit, setDepthUnit] = useState<DepthUnit>('in');
  const [presetId, setPresetId] = useState<string>('mulch');
  const [notice, setNotice] = useState('');
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('c');
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    setDir(s.d);
    setVol(s.v);
    if (VOL_UNITS.some((u) => u.id === s.vu)) setVolUnit(s.vu);
    setSrc(s.src === 'bags' ? 'bags' : 'volume');
    setBagCount(s.bc);
    setBagSize(s.bs);
    setBagUnit(s.bu === 'L' ? 'L' : 'ft3');
    setAreaMode(s.am === 'lw' ? 'lw' : 'area');
    setArea(s.a);
    if (AREA_UNITS.some((u) => u.id === s.au)) setAreaUnit(s.au);
    setLen(s.l);
    setWid(s.w);
    setLenUnit(s.lu === 'm' ? 'm' : 'ft');
    setDepth(s.dp);
    if (DEPTH_UNITS.includes(s.du)) setDepthUnit(s.du);
  }, []);

  // ---------- maths ----------
  const depthFt = depthToFt(num(depth), depthUnit);
  const bagFt3 = bagUnit === 'L' ? num(bagSize) / L_PER_FT3 : num(bagSize);
  const volumeFt3 = dir === 'toArea' ? (src === 'bags' ? Math.floor(num(bagCount)) * bagFt3 : volumeToFt3(num(vol), volUnit)) : 0;
  const areaFt2In = areaMode === 'area' ? areaToFt2(num(area), areaUnit) : (num(len) * num(wid)) / (lenUnit === 'm' ? M_PER_FT * M_PER_FT : 1);
  const resultArea = dir === 'toArea' ? coverageFt2(volumeFt3, depthFt) : 0;
  const resultVol = dir === 'toVolume' ? volumeNeededFt3(areaFt2In, depthFt) : 0;
  const bagsNeeded = dir === 'toVolume' ? bagsFor(resultVol, bagFt3) : 0;
  const metricPref = volUnit === 'm3' || volUnit === 'L' || areaUnit === 'm2' || lenUnit === 'm' || ['cm', 'mm', 'm'].includes(depthUnit);
  const depthLabel = `${fmt(num(depth), 3)} ${depthUnit}`;
  const chosen = PRESETS.find((p) => p.id === presetId);
  const presetMatch = chosen && depthUnit === 'in' && num(depth) === chosen.depthIn ? chosen : undefined;

  const heroValue = dir === 'toArea' ? (metricPref ? `${sig(ft2To(resultArea, 'm2'))} m²` : `${sig(resultArea)} ft²`) : metricPref ? `${sig(ft3To(resultVol, 'm3'))} m³` : `${sig(resultVol)} ft³`;
  const volLabel = dir === 'toArea' ? (metricPref ? `${sig(ft3To(volumeFt3, 'm3'))} m³` : `${sig(volumeFt3)} ft³`) : heroValue;
  const areaLabel = dir === 'toArea' ? heroValue : metricPref ? `${sig(ft2To(areaFt2In, 'm2'))} m²` : `${sig(areaFt2In)} ft²`;

  const rows: [string, string][] =
    dir === 'toArea'
      ? [
          ['Square feet', `${sig(resultArea)} ft²`],
          ['Square metres', `${sig(ft2To(resultArea, 'm2'))} m²`],
          ['Square yards', `${sig(ft2To(resultArea, 'yd2'))} yd²`],
        ]
      : [
          ['Cubic feet (cft)', `${sig(resultVol)} ft³`],
          ['Cubic yards', `${sig(ft3To(resultVol, 'yd3'))} yd³`],
          ['Cubic metres', `${sig(ft3To(resultVol, 'm3'))} m³`],
          ['Litres', `${fmt(ft3To(resultVol, 'L'), 0)} L`],
        ];

  // ---------- actions ----------
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
    dir === 'toArea'
      ? `${sig(volumeFt3)} ft³ spread ${depthLabel} deep covers ${sig(resultArea)} ft² (${sig(ft2To(resultArea, 'm2'))} m²) — KKC Tools`
      : `${sig(areaFt2In)} ft² at ${depthLabel} deep needs ${sig(resultVol)} ft³ = ${sig(ft3To(resultVol, 'yd3'))} yd³ = ${sig(ft3To(resultVol, 'm3'))} m³ — KKC Tools`;
  const share = () => {
    const s: Shared = { d: dir, v: vol, vu: volUnit, src, bc: bagCount, bs: bagSize, bu: bagUnit, am: areaMode, a: area, au: areaUnit, l: len, w: wid, lu: lenUnit, dp: depth, du: depthUnit };
    const url = `${window.location.origin}${window.location.pathname}?c=${encode(s)}`;
    window.history.replaceState(null, '', url);
    copyText(url, 'Share link copied.');
  };
  const swap = () => {
    // carry the result across so the reverse calculation starts from it
    if (dir === 'toArea') {
      setAreaMode('area');
      setArea(`${Math.round(ft2To(resultArea, metricPref ? 'm2' : 'ft2') * 100) / 100}`);
      setAreaUnit(metricPref ? 'm2' : 'ft2');
      setDir('toVolume');
    } else {
      setSrc('volume');
      setVol(`${Math.round(ft3To(resultVol, metricPref ? 'm3' : 'ft3') * 1000) / 1000}`);
      setVolUnit(metricPref ? 'm3' : 'ft3');
      setDir('toArea');
    }
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
  const numInput = (key: string, label: string, value: string, set: (s: string) => void, extra?: React.ReactNode) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id(key)}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input id={id(key)} className={styles.input} type="number" inputMode="decimal" min="0" step="any" value={value} onChange={(e) => set(e.target.value)} />
      </div>
      {extra}
    </div>
  );
  const select = <T extends string>(key: string, label: string, value: T, options: { id: T; label: string }[], set: (v: T) => void) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id(key)}>
        {label}
      </label>
      <select id={id(key)} className={styles.input} value={value} onChange={(e) => set(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          <div className={styles.card}>
            {head('What do you want to find?')}
            <div className={styles.kindGrid} style={{ gridTemplateColumns: '1fr 1fr' }} role="group" aria-label="Direction">
              <button type="button" aria-pressed={dir === 'toArea'} className={`${styles.kindBtn} ${dir === 'toArea' ? styles.kindActive : ''}`} onClick={() => setDir('toArea')}>
                Cubic → square
                <br />
                <small>area a volume covers</small>
              </button>
              <button type="button" aria-pressed={dir === 'toVolume'} className={`${styles.kindBtn} ${dir === 'toVolume' ? styles.kindActive : ''}`} onClick={() => setDir('toVolume')}>
                Square → cubic
                <br />
                <small>volume an area needs</small>
              </button>
            </div>
            <p className={styles.help}>Volume and area only convert through a thickness — that is why you also enter a depth.</p>
          </div>

          {dir === 'toArea' ? (
            <div className={styles.card}>
              {head('How much material?', `${sig(volumeFt3)} ft³`)}
              <div className={styles.pills} role="group" aria-label="Volume given as">
                {pill(src === 'volume', 'A volume', () => setSrc('volume'))}
                {pill(src === 'bags', 'A number of bags', () => setSrc('bags'))}
              </div>
              {src === 'volume' ? (
                <div className={styles.fields} style={{ marginTop: 10 }}>
                  {numInput('vol', 'Volume', vol, setVol)}
                  {select('vu', 'Unit', volUnit, VOL_UNITS, setVolUnit)}
                </div>
              ) : (
                <>
                  <div className={styles.fields} style={{ marginTop: 10 }}>
                    {numInput('bc', 'Bags', bagCount, setBagCount)}
                    {numInput('bs', `Bag size (${bagUnit === 'L' ? 'litres' : 'ft³'})`, bagSize, setBagSize)}
                  </div>
                  <div className={styles.pills} role="group" aria-label="Bag size" style={{ marginTop: 10 }}>
                    {pill(bagUnit === 'ft3', 'ft³ bags', () => setBagUnit('ft3'))}
                    {pill(bagUnit === 'L', 'litre bags', () => setBagUnit('L'))}
                    {(bagUnit === 'L' ? BAGS_L : BAGS_FT3).map((b) => pill(num(bagSize) === b, bagUnit === 'L' ? `${b} L` : `${b} ft³`, () => setBagSize(`${b}`), b))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={styles.card}>
              {head('What area?', `${sig(areaFt2In)} ft²`)}
              <div className={styles.pills} role="group" aria-label="Area given as">
                {pill(areaMode === 'area', 'I know the area', () => setAreaMode('area'))}
                {pill(areaMode === 'lw', 'Length × width', () => setAreaMode('lw'))}
              </div>
              {areaMode === 'area' ? (
                <div className={styles.fields} style={{ marginTop: 10 }}>
                  {numInput('a', 'Area', area, setArea)}
                  {select('au', 'Unit', areaUnit, AREA_UNITS, setAreaUnit)}
                </div>
              ) : (
                <>
                  <div className={styles.fields} style={{ marginTop: 10 }}>
                    {numInput('l', `Length (${lenUnit})`, len, setLen)}
                    {numInput('w', `Width (${lenUnit})`, wid, setWid)}
                  </div>
                  <div className={styles.pills} role="group" aria-label="Length unit" style={{ marginTop: 10 }}>
                    {pill(lenUnit === 'ft', 'feet', () => setLenUnit('ft'))}
                    {pill(lenUnit === 'm', 'metres', () => setLenUnit('m'))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className={styles.card}>
            {head('Depth or thickness', presetMatch ? presetMatch.label.toLowerCase() : depthLabel)}
            <div className={styles.fields}>
              {numInput('dp', 'Depth', depth, setDepth)}
              {select(
                'du',
                'Unit',
                depthUnit,
                DEPTH_UNITS.map((u) => ({ id: u, label: { in: 'inches', ft: 'feet', cm: 'centimetres', mm: 'millimetres', m: 'metres' }[u] })),
                setDepthUnit,
              )}
            </div>
            <p className={styles.label} style={{ marginTop: 12 }}>
              Typical depths
            </p>
            <div className={styles.pills} role="group" aria-label="Material presets">
              {PRESETS.map((p) =>
                pill(Boolean(presetMatch && presetMatch.id === p.id), `${p.label} · ${p.depthIn} in`, () => {
                  setDepth(`${p.depthIn}`);
                  setDepthUnit('in');
                  setPresetId(p.id);
                }, p.id),
              )}
            </div>
            <p className={styles.help}>{presetMatch ? presetMatch.note : 'Pick a material for a typical depth, or type your own.'}</p>
            {dir === 'toVolume' && (
              <>
                <p className={styles.label} style={{ marginTop: 12 }}>
                  Bag size (for a bag count)
                </p>
                <div className={styles.pills} role="group" aria-label="Bag size for count">
                  {pill(bagUnit === 'ft3', 'ft³', () => setBagUnit('ft3'))}
                  {pill(bagUnit === 'L', 'litres', () => setBagUnit('L'))}
                  {(bagUnit === 'L' ? BAGS_L : BAGS_FT3).map((b) => pill(num(bagSize) === b, bagUnit === 'L' ? `${b} L` : `${b} ft³`, () => setBagSize(`${b}`), b))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ---------- results ---------- */}
        <div className={styles.results} id="cubic-square-results" aria-live="polite">
          <div className={styles.hero}>
            <div className={styles.heroLabel}>{dir === 'toArea' ? 'Area covered' : 'Volume needed'}</div>
            <div className={styles.heroValue}>{depthFt > 0 ? heroValue : '—'}</div>
            <div className={styles.heroSub}>
              {depthFt > 0
                ? dir === 'toArea'
                  ? `${volLabel} spread ${depthLabel} deep`
                  : `${areaLabel} at ${depthLabel} deep${bagsNeeded ? ` · ${bagsNeeded} × ${fmt(num(bagSize), 2)} ${bagUnit === 'L' ? 'L' : 'ft³'} bags` : ''}`
                : 'Enter a depth — without one, volume and area cannot be converted.'}
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>In other units</h3>
            {rows.map(([k, val]) => (
              <div className={styles.row} key={k}>
                <span>{k}</span>
                <strong>{depthFt > 0 ? val : '—'}</strong>
              </div>
            ))}
            {dir === 'toVolume' && bagsNeeded > 0 && (
              <div className={styles.row}>
                <span>Bags of {fmt(num(bagSize), 2)} {bagUnit === 'L' ? 'L' : 'ft³'}</span>
                <strong>{bagsNeeded}</strong>
              </div>
            )}
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>How it was worked out</h3>
            <code className={styles.formulaBox}>
              {dir === 'toArea' ? (
                <>
                  depth = {depthLabel} = {sig(depthFt)} ft
                  <br />
                  area = volume ÷ depth = {sig(volumeFt3)} ft³ ÷ {sig(depthFt)} ft
                  <br />= <strong>{sig(resultArea)} ft²</strong>
                </>
              ) : (
                <>
                  depth = {depthLabel} = {sig(depthFt)} ft
                  <br />
                  volume = area × depth = {sig(areaFt2In)} ft² × {sig(depthFt)} ft
                  <br />= <strong>{sig(resultVol)} ft³</strong> ÷ 27 = {sig(ft3To(resultVol, 'yd3'))} yd³
                </>
              )}
            </code>
            <figure style={{ margin: '12px 0 0' }}>
              <SpreadDiagram volumeLabel={volLabel} areaLabel={areaLabel} depthLabel={depthLabel} toArea={dir === 'toArea'} />
            </figure>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.actionBtn} onClick={swap}>
              ⇄ Reverse
            </button>
            <button type="button" className={styles.actionBtn} onClick={() => copyText(summary(), 'Result copied.')}>
              Copy result
            </button>
            <button type="button" className={styles.actionBtn} onClick={share}>
              Copy share link
            </button>
          </div>
          {notice && (
            <p className={styles.notice} role="status">
              {notice}
            </p>
          )}
          <p className={styles.note}>Exact unit factors: 1 ft = 0.3048 m, 1 yd³ = 27 ft³, 1 m³ = 35.3147 ft³, 1 ft³ = 28.3168 L. “cft” means cubic feet.</p>
        </div>
      </div>
    </div>
  );
}
