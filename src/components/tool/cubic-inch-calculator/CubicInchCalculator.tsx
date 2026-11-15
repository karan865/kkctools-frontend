'use client';

import React, { useEffect, useId, useState } from 'react';
import styles from './CubicInchCalculator.module.css';
import { CompareBars, CylinderDiagram, ShapeDiagram } from './CubicInchDiagram';
import {
  LENGTH_UNITS,
  MM_PER_IN,
  PRESETS,
  VOLUME_UNITS,
  boreFor,
  engine,
  fromCubicInches,
  shapeVolume,
  strokeFor,
  toCubicInches,
  toInches,
  whatIf,
  type LengthUnit,
  type Shape,
  type VolumeUnit,
} from '@/lib/cubic-inch-engine';

type Mode = 'volume' | 'engine';
type EUnit = 'in' | 'mm';
type TargetUnit = 'ci' | 'cc' | 'L';

const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const signed = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};
/** Readable number: more decimals for small values, none for big ones. */
const smart = (n: number) => {
  if (!Number.isFinite(n) || n === 0) return '0';
  const a = Math.abs(n);
  const dp = a >= 10000 ? 0 : a >= 100 ? 1 : a >= 1 ? 3 : a >= 0.01 ? 4 : 6;
  return n.toLocaleString('en-US', { maximumFractionDigits: dp });
};
const fix = (n: number, dp: number) => (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const r4 = (n: number) => `${Math.round(n * 10000) / 10000}`;

const SHAPES: { id: Shape; label: string }[] = [
  { id: 'box', label: 'Box' },
  { id: 'cylinder', label: 'Cylinder' },
  { id: 'tube', label: 'Tube / pipe' },
  { id: 'sphere', label: 'Sphere' },
];
const OUT_UNITS: VolumeUnit[] = ['in3', 'ft3', 'usGal', 'litres', 'cc', 'yd3', 'impGal', 'm3'];

interface Shared {
  m: Mode;
  sh: Shape;
  lu: LengthUnit;
  l: string;
  w: string;
  h: string;
  d: string;
  id: string;
  q: string;
  cv: string;
  cu: VolumeUnit;
  p: string;
  eu: EUnit;
  b: string;
  s: string;
  n: string;
  ob: string;
  ns: string;
  t: string;
  tu: TargetUnit;
  sf: 'bore' | 'stroke';
}
const encode = (s: Shared) => btoa(unescape(encodeURIComponent(JSON.stringify(s)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function decode(raw: string): Shared | null {
  try {
    const s = JSON.parse(decodeURIComponent(escape(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))))) as Shared;
    return s && (s.m === 'volume' || s.m === 'engine') && s.lu in LENGTH_UNITS ? s : null;
  } catch {
    return null;
  }
}

export default function CubicInchCalculator() {
  const [mode, setMode] = useState<Mode>('volume');
  // volume
  const [shape, setShape] = useState<Shape>('box');
  const [lenUnit, setLenUnit] = useState<LengthUnit>('in');
  const [l, setL] = useState('12');
  const [w, setW] = useState('10');
  const [h, setH] = useState('8');
  const [dia, setDia] = useState('4');
  const [inner, setInner] = useState('3.5');
  const [qty, setQty] = useState('1');
  const [cv, setCv] = useState('1');
  const [cu, setCu] = useState<VolumeUnit>('litres');
  // engine
  const [preset, setPreset] = useState('sbc350');
  const [eUnit, setEUnit] = useState<EUnit>('in');
  const [bore, setBore] = useState('4');
  const [stroke, setStroke] = useState('3.48');
  const [cyl, setCyl] = useState('8');
  const [overbore, setOverbore] = useState('0.030');
  const [newStroke, setNewStroke] = useState('');
  const [target, setTarget] = useState('383');
  const [targetUnit, setTargetUnit] = useState<TargetUnit>('ci');
  const [solveFor, setSolveFor] = useState<'bore' | 'stroke'>('stroke');
  const [notice, setNotice] = useState('');
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('c');
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    setMode(s.m);
    if (SHAPES.some((x) => x.id === s.sh)) setShape(s.sh);
    setLenUnit(s.lu);
    setL(s.l);
    setW(s.w);
    setH(s.h);
    setDia(s.d);
    setInner(s.id);
    setQty(s.q);
    setCv(s.cv);
    if (s.cu in VOLUME_UNITS) setCu(s.cu);
    setPreset(s.p);
    setEUnit(s.eu === 'mm' ? 'mm' : 'in');
    setBore(s.b);
    setStroke(s.s);
    setCyl(s.n);
    setOverbore(s.ob);
    setNewStroke(s.ns);
    setTarget(s.t);
    if (s.tu === 'ci' || s.tu === 'cc' || s.tu === 'L') setTargetUnit(s.tu);
    setSolveFor(s.sf === 'bore' ? 'bore' : 'stroke');
  }, []);

  // ---------- volume ----------
  const U = lenUnit;
  const inch = (v: string) => toInches(num(v), U);
  const vol = shapeVolume({ shape, length: inch(l), width: inch(w), height: inch(h), diameter: inch(dia), inner: inch(inner), quantity: num(qty) });
  const volSet = fromCubicInches(vol.total);
  const capSet = fromCubicInches(vol.capacityTotal);
  const convSet = fromCubicInches(toCubicInches(num(cv), cu));
  const q = Math.max(1, Math.floor(num(qty) || 1));
  const dimLabel = (v: string) => `${smart(num(v))} ${U}`;
  const volFormula = (() => {
    const tail = q > 1 ? ` × ${q}` : '';
    const inchNote = U === 'in' ? '' : '\n(dimensions converted to inches first)';
    switch (shape) {
      case 'box':
        return `V = L × W × H${tail}\n  = ${smart(inch(l))} × ${smart(inch(w))} × ${smart(inch(h))}${tail} = ${smart(vol.total)} in³${inchNote}`;
      case 'cylinder':
        return `V = π/4 × D² × L${tail}\n  = 0.7854 × ${smart(inch(dia))}² × ${smart(inch(l))}${tail} = ${smart(vol.total)} in³${inchNote}`;
      case 'tube':
        return `Wall = π/4 × (OD² − ID²) × L${tail} = ${smart(vol.total)} in³\nInside = π/4 × ID² × L${tail} = ${smart(vol.capacityTotal)} in³${inchNote}`;
      case 'sphere':
        return `V = π/6 × D³${tail}\n  = 0.5236 × ${smart(inch(dia))}³${tail} = ${smart(vol.total)} in³${inchNote}`;
    }
  })();

  // ---------- engine ----------
  const toIn = (v: number) => (eUnit === 'mm' ? v / MM_PER_IN : v);
  const E = eUnit;
  const bIn = toIn(num(bore));
  const sIn = toIn(num(stroke));
  const n = Math.floor(num(cyl));
  const eng = engine(bIn, sIn, n);
  const wi = whatIf(bIn, sIn, n, toIn(signed(overbore)), newStroke.trim() ? toIn(num(newStroke)) : undefined);
  const targetIn3 = targetUnit === 'ci' ? num(target) : targetUnit === 'cc' ? num(target) / 16.387064 : (num(target) * 1000) / 16.387064;
  const solved = solveFor === 'bore' ? boreFor(targetIn3, sIn, n) : strokeFor(targetIn3, bIn, n);
  const lenFmt = (vIn: number) => (E === 'mm' ? `${fix(vIn * MM_PER_IN, 2)} mm` : `${fix(vIn, 3)} in`);
  const lenBoth = (vIn: number) => (E === 'mm' ? `${fix(vIn * MM_PER_IN, 2)} mm (${fix(vIn, 3)} in)` : `${fix(vIn, 3)} in (${fix(vIn * MM_PER_IN, 2)} mm)`);

  // ---------- actions ----------
  const pickPreset = (pid: string) => {
    setPreset(pid);
    const p = PRESETS.find((x) => x.id === pid);
    if (!p) return;
    setEUnit(p.unit);
    setBore(`${p.bore}`);
    setStroke(`${p.stroke}`);
    setCyl(`${p.cylinders}`);
    setOverbore(p.unit === 'mm' ? '0.5' : '0.030');
    setNewStroke('');
  };
  const edit = (set: (v: string) => void, v: string) => {
    set(v);
    setPreset('custom');
  };
  const switchEUnit = (next: EUnit) => {
    if (next === eUnit) return;
    const f = next === 'mm' ? MM_PER_IN : 1 / MM_PER_IN;
    const conv = (v: string) => (v.trim() === '' ? '' : r4(signed(v) * f));
    setBore(conv(bore));
    setStroke(conv(stroke));
    setOverbore(conv(overbore));
    setNewStroke(conv(newStroke));
    setEUnit(next);
  };
  const switchLenUnit = (next: LengthUnit) => {
    if (next === lenUnit) return;
    const f = LENGTH_UNITS[next].perInch / LENGTH_UNITS[lenUnit].perInch;
    const conv = (v: string) => r4(num(v) * f);
    setL(conv(l));
    setW(conv(w));
    setH(conv(h));
    setDia(conv(dia));
    setInner(conv(inner));
    setLenUnit(next);
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
    mode === 'volume'
      ? [`Cubic inch calculator (KKC Tools) — ${SHAPES.find((x) => x.id === shape)?.label}`, volFormula, ...OUT_UNITS.map((u) => `${VOLUME_UNITS[u].label}: ${smart(volSet[u])}`)].join('\n')
      : [
          `Engine displacement (KKC Tools) — bore ${lenBoth(bIn)}, stroke ${lenBoth(sIn)}, ${n} cylinders`,
          `${fix(eng.ci, 1)} ci · ${fix(eng.cc, 0)} cc · ${fix(eng.litres, 2)} L`,
          `What-if: bore ${lenFmt(wi.bore)}, stroke ${lenFmt(wi.stroke)} → ${fix(wi.after.ci, 1)} ci (${wi.addedCi >= 0 ? '+' : ''}${fix(wi.addedCi, 1)} ci)`,
        ].join('\n');
  const share = () => {
    const s: Shared = { m: mode, sh: shape, lu: lenUnit, l, w, h, d: dia, id: inner, q: qty, cv, cu, p: preset, eu: eUnit, b: bore, s: stroke, n: cyl, ob: overbore, ns: newStroke, t: target, tu: targetUnit, sf: solveFor };
    const url = `${window.location.origin}${window.location.pathname}?c=${encode(s)}`;
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
  const field = (k: string, label: string, value: string, set: (s: string) => void, suffix?: string, help?: string, allowNegative = false) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id(k)}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input id={id(k)} className={styles.input} type="number" inputMode="decimal" min={allowNegative ? undefined : '0'} step="any" value={value} onChange={(e) => set(e.target.value)} />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {help && <p className={styles.help}>{help}</p>}
    </div>
  );
  const seg = (active: boolean, label: string, onClick: () => void) => (
    <button type="button" aria-pressed={active} className={`${styles.segBtn} ${active ? styles.segActive : ''}`} onClick={onClick}>
      {label}
    </button>
  );
  const select = <T extends string>(k: string, label: string, value: T, set: (v: T) => void, options: [T, string][]) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id(k)}>
        {label}
      </label>
      <select id={id(k)} className={styles.input} value={value} onChange={(e) => set(e.target.value as T)}>
        {options.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );

  const actions = (
    <>
      <div className={styles.actions}>
        <button type="button" className={styles.actionBtn} onClick={() => copyText(summary(), 'Result copied.')}>
          Copy result
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
    </>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.modeTabs} role="group" aria-label="Calculator mode">
        <button type="button" aria-pressed={mode === 'volume'} className={`${styles.modeTab} ${mode === 'volume' ? styles.modeActive : ''}`} onClick={() => setMode('volume')}>
          Volume in cubic inches
          <span>box · cylinder · tube · sphere</span>
        </button>
        <button type="button" aria-pressed={mode === 'engine'} className={`${styles.modeTab} ${mode === 'engine' ? styles.modeActive : ''}`} onClick={() => setMode('engine')}>
          Engine displacement
          <span>bore × stroke × cylinders</span>
        </button>
      </div>

      {mode === 'volume' ? (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              {head('Shape', SHAPES.find((x) => x.id === shape)?.label.toLowerCase())}
              <div className={styles.kindGrid} style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }} role="group" aria-label="Shape">
                {SHAPES.map((x) => (
                  <button key={x.id} type="button" aria-pressed={shape === x.id} className={`${styles.kindBtn} ${shape === x.id ? styles.kindActive : ''}`} onClick={() => setShape(x.id)}>
                    {x.label}
                  </button>
                ))}
              </div>
              <div className={styles.fields} style={{ marginTop: 12 }}>
                {select('lu', 'Measured in', lenUnit, switchLenUnit, (Object.keys(LENGTH_UNITS) as LengthUnit[]).map((u) => [u, LENGTH_UNITS[u].label]))}
                {field('qty', 'How many', qty, setQty, 'pcs')}
              </div>
            </div>

            <div className={styles.card}>
              {head('Dimensions', `in ${LENGTH_UNITS[U].label}`)}
              <div className={styles.fields}>
                {shape === 'box' && (
                  <>
                    {field('l', 'Length', l, setL, U)}
                    {field('w', 'Width', w, setW, U)}
                    {field('h', 'Height', h, setH, U)}
                  </>
                )}
                {(shape === 'cylinder' || shape === 'tube') && (
                  <>
                    {field('d', shape === 'tube' ? 'Outside diameter' : 'Diameter', dia, setDia, U)}
                    {shape === 'tube' && field('id', 'Inside diameter', inner, setInner, U)}
                    {field('len', shape === 'tube' ? 'Length' : 'Height / length', l, setL, U)}
                  </>
                )}
                {shape === 'sphere' && field('d', 'Diameter', dia, setDia, U, 'Twice the radius.')}
              </div>
              {vol.error && <p className={styles.warn}>{vol.error}</p>}
            </div>

            <div className={styles.card}>
              {head('Convert a volume (optional)')}
              <div className={styles.fields}>
                {field('cv', 'Amount', cv, setCv)}
                {select('cu', 'Unit', cu, setCu, (Object.keys(VOLUME_UNITS) as VolumeUnit[]).map((u) => [u, VOLUME_UNITS[u].label]))}
              </div>
              <div className={styles.panel} style={{ marginTop: 12 }}>
                {OUT_UNITS.filter((u) => u !== cu).map((u) => (
                  <div className={styles.row} key={u}>
                    <span>{VOLUME_UNITS[u].label}</span>
                    <strong>{smart(convSet[u])}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.mobileBar} aria-hidden="true">
              <span>
                <strong>{smart(volSet.in3)} in³</strong> · {smart(volSet.litres)} L
              </span>
              <a href="#cubic-results" className={styles.mobileBarLink} tabIndex={-1}>
                Results ↓
              </a>
            </div>
          </div>

          <div className={styles.results} id="cubic-results" aria-live="polite">
            <div className={styles.hero}>
              <div className={styles.heroLabel}>{shape === 'tube' ? 'Volume of the tube wall' : 'Volume'}</div>
              <div className={styles.heroValue}>{smart(volSet.in3)} in³</div>
              <div className={styles.heroSub}>
                {smart(volSet.ft3)} ft³ · {smart(volSet.usGal)} US gal · {smart(volSet.litres)} L{q > 1 ? ` · ${q} pieces` : ''}
              </div>
            </div>
            {shape === 'tube' && !vol.error && (
              <div className={styles.panel}>
                <h3 className={styles.panelTitle}>Inside capacity</h3>
                <div className={styles.row}>
                  <span>Hollow space</span>
                  <strong>
                    {smart(capSet.in3)} in³ · {smart(capSet.usGal)} US gal · {smart(capSet.litres)} L
                  </strong>
                </div>
              </div>
            )}
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>In every unit</h3>
              {OUT_UNITS.map((u) => (
                <div className={styles.row} key={u}>
                  <span>{VOLUME_UNITS[u].label}</span>
                  <strong>{smart(volSet[u])}</strong>
                </div>
              ))}
            </div>
            <figure className={styles.panel} style={{ margin: 0 }}>
              <ShapeDiagram shape={shape} a={shape === 'box' ? dimLabel(l) : dimLabel(dia)} b={shape === 'box' ? dimLabel(w) : dimLabel(l)} c={dimLabel(h)} d={dimLabel(inner)} />
              <figcaption className={styles.note}>Your shape with the dimensions entered.</figcaption>
            </figure>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Working</h3>
              <p className={styles.formulaBox}>{volFormula}</p>
            </div>
            {actions}
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              {head('Engine', PRESETS.find((p) => p.id === preset)?.name ?? 'custom')}
              {select('preset', 'Start from', preset, pickPreset, [['custom', 'Custom — enter your own'], ...PRESETS.map((p) => [p.id, `${p.name} (${p.nominal})`] as [string, string])])}
              <div className={styles.segment} role="group" aria-label="Bore and stroke units" style={{ marginTop: 12 }}>
                {seg(E === 'in', 'Inches', () => switchEUnit('in'))}
                {seg(E === 'mm', 'Millimetres', () => switchEUnit('mm'))}
              </div>
              <div className={styles.fields} style={{ marginTop: 12, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                {field('bore', 'Bore', bore, (v) => edit(setBore, v), E)}
                {field('stroke', 'Stroke', stroke, (v) => edit(setStroke, v), E)}
                {field('cyl', 'Cylinders', cyl, (v) => edit(setCyl, v))}
              </div>
              {preset !== 'custom' && (
                <p className={styles.help}>
                  Bore and stroke from{' '}
                  <a href={PRESETS.find((p) => p.id === preset)?.url} target="_blank" rel="noopener noreferrer">
                    {PRESETS.find((p) => p.id === preset)?.source}
                  </a>
                  .
                </p>
              )}
            </div>

            <div className={styles.card}>
              {head('What if I bore or stroke it?')}
              <div className={styles.fields}>
                {field('ob', 'Overbore', overbore, setOverbore, E, E === 'in' ? 'Added to the bore, e.g. 0.030 or 0.060.' : 'Added to the bore, e.g. 0.5 or 1.0.', true)}
                {field('ns', 'New stroke (optional)', newStroke, setNewStroke, E, 'Leave empty to keep the stock stroke.')}
              </div>
            </div>

            <div className={styles.card}>
              {head('Find bore or stroke for a size')}
              <div className={styles.segment} role="group" aria-label="Solve for">
                {seg(solveFor === 'stroke', 'Solve stroke (keep bore)', () => setSolveFor('stroke'))}
                {seg(solveFor === 'bore', 'Solve bore (keep stroke)', () => setSolveFor('bore'))}
              </div>
              <div className={styles.fields} style={{ marginTop: 12 }}>
                {field('t', 'Target size', target, setTarget)}
                {select('tu', 'Unit', targetUnit, setTargetUnit, [
                  ['ci', 'cubic inches'],
                  ['cc', 'cc'],
                  ['L', 'litres'],
                ])}
              </div>
              <p className={styles.help} role="status">
                {solved > 0
                  ? `${solveFor === 'stroke' ? 'Stroke' : 'Bore'} needed: ${lenBoth(solved)} with a ${lenFmt(solveFor === 'stroke' ? bIn : sIn)} ${solveFor === 'stroke' ? 'bore' : 'stroke'} and ${n} cylinders.`
                  : 'Enter a target size, a bore or stroke and the number of cylinders.'}
              </p>
            </div>

            <div className={styles.mobileBar} aria-hidden="true">
              <span>
                <strong>{fix(eng.ci, 1)} ci</strong> · {fix(eng.litres, 2)} L
              </span>
              <a href="#cubic-results" className={styles.mobileBarLink} tabIndex={-1}>
                Results ↓
              </a>
            </div>
          </div>

          <div className={styles.results} id="cubic-results" aria-live="polite">
            <div className={styles.hero}>
              <div className={styles.heroLabel}>Engine displacement</div>
              <div className={styles.heroValue}>{fix(eng.ci, 1)} ci</div>
              <div className={styles.heroSub}>
                {fix(eng.cc, 0)} cc · {fix(eng.litres, 2)} L · {fix(eng.perCylinderCc, 0)} cc per cylinder
              </div>
            </div>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Details</h3>
              <div className={styles.row}>
                <span>Bore × stroke</span>
                <strong>
                  {lenFmt(bIn)} × {lenFmt(sIn)}
                </strong>
              </div>
              <div className={styles.row}>
                <span>Bore ÷ stroke</span>
                <strong>
                  {fix(eng.boreStrokeRatio, 3)}
                  {eng.layout ? ` · ${eng.layout}` : ''}
                </strong>
              </div>
              <div className={styles.row}>
                <span>Per cylinder</span>
                <strong>
                  {fix(eng.ci / Math.max(n, 1), 2)} ci · {fix(eng.perCylinderCc, 1)} cc
                </strong>
              </div>
            </div>
            <figure className={styles.panel} style={{ margin: 0 }}>
              <CylinderDiagram bore={lenFmt(bIn)} stroke={lenFmt(sIn)} cylinders={n} ratio={eng.boreStrokeRatio} />
              <figcaption className={styles.note}>One cylinder: the piston sweeps the shaded volume between top and bottom dead centre.</figcaption>
            </figure>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Working</h3>
              <p className={styles.formulaBox}>
                {`ci = π/4 × bore² × stroke × cylinders\n   = 0.7854 × ${fix(bIn, 4)}² × ${fix(sIn, 4)} × ${n}\n   = ${fix(eng.ci, 2)} in³\ncc = ci × 16.387064 = ${fix(eng.cc, 1)} cc = ${fix(eng.litres, 3)} L`}
              </p>
            </div>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Stock vs modified</h3>
              <CompareBars
                rows={[
                  { label: 'Stock', value: wi.before.ci, tone: 'a' },
                  { label: 'Modified', value: wi.after.ci, tone: 'b' },
                ]}
                format={(v) => `${fix(v, 1)} ci`}
              />
              <p className={styles.note}>
                Bore {lenFmt(wi.bore)}, stroke {lenFmt(wi.stroke)}: {wi.addedCi >= 0 ? '+' : ''}
                {fix(wi.addedCi, 1)} ci ({wi.addedCc >= 0 ? '+' : ''}
                {fix(wi.addedCc, 0)} cc, {wi.pct >= 0 ? '+' : ''}
                {fix(wi.pct, 1)}%) → {fix(wi.after.litres, 2)} L.
              </p>
            </div>
            {actions}
          </div>
        </div>
      )}
    </div>
  );
}
