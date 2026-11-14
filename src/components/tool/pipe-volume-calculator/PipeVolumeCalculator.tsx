'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './PipeVolumeCalculator.module.css';
import { CrossSectionDiagram } from './PipeDiagram';
import {
  IN3_PER_US_GAL,
  KG_PER_LB,
  LIQUIDS,
  L_PER_IN3,
  MATERIALS,
  MM_PER_IN,
  PIPE_PRESETS,
  PRESET_GROUPS,
  calculatePipes,
  perLength,
  presetById,
  type PipeRun,
  type RunShape,
} from '@/lib/pipe-volume-engine';

type Units = 'us' | 'metric';
type Source = 'preset' | 'custom';
type CustomMode = 'id' | 'odWall' | 'odId';

interface UiRun {
  id: string;
  shape: RunShape;
  source: Source;
  presetId: string;
  customMode: CustomMode;
  od: string;
  idv: string;
  wall: string;
  w: string;
  h: string;
  length: string;
  qty: string;
}

const fmt = (n: number, max = 2, min = 0) => (isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });
const num = (s: string) => {
  const n = parseFloat(s);
  return isFinite(n) && n >= 0 ? n : 0;
};
const sig = (n: number) => (n >= 100 ? fmt(n, 0) : n >= 10 ? fmt(n, 1) : n >= 1 ? fmt(n, 2) : fmt(n, 4));

// ---------- share ----------
interface Shared {
  u: Units;
  r: { s: RunShape; src: Source; p: string; cm: CustomMode; od: number; id: number; wl: number; w: number; h: number; l: number; q: number }[];
  lq: string;
  ld: number;
  mt: string;
  md: number;
  fl: number;
}
const encode = (s: Shared) => btoa(JSON.stringify(s)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function decode(raw: string): Shared | null {
  try {
    const s = JSON.parse(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))) as Shared;
    return s && Array.isArray(s.r) && s.r.length > 0 && s.r.length <= 20 ? s : null;
  } catch {
    return null;
  }
}

export default function PipeVolumeCalculator() {
  const nextId = useRef(2);
  const [units, setUnits] = useState<Units>('us');
  const [runs, setRuns] = useState<UiRun[]>([
    { id: 'r1', shape: 'round', source: 'preset', presetId: 'sch40-2', customMode: 'odWall', od: '2.375', idv: '2.067', wall: '0.154', w: '4', h: '2', length: '100', qty: '1' },
  ]);
  const [liquidId, setLiquidId] = useState('water');
  const [liquidStr, setLiquidStr] = useState('1');
  const [materialId, setMaterialId] = useState('steel');
  const [materialStr, setMaterialStr] = useState('7850');
  const [flowStr, setFlowStr] = useState('');
  const [notice, setNotice] = useState('');
  const ids = { liquid: useId(), ld: useId(), material: useId(), md: useId(), flow: useId() };

  const us = units === 'us';
  const dUnit = us ? 'in' : 'mm';
  const lUnit = us ? 'ft' : 'm';
  const toIn = (s: string) => (us ? num(s) : num(s) / MM_PER_IN); // diameters / walls
  const lenIn = (s: string) => (us ? num(s) * 12 : (num(s) * 1000) / MM_PER_IN);
  const dOut = (inches: number) => (us ? `${fmt(inches, 3)} in` : `${fmt(inches * MM_PER_IN, 1)} mm`);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('p');
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setUnits('us');
    setRuns(
      s.r.map((x, i) => ({
        id: `r${i + 1}`,
        shape: x.s === 'rect' ? 'rect' : 'round',
        source: x.src === 'custom' ? 'custom' : 'preset',
        presetId: presetById(x.p) ? x.p : 'sch40-2',
        customMode: ['id', 'odWall', 'odId'].includes(x.cm) ? x.cm : 'odWall',
        od: `${x.od}`,
        idv: `${x.id}`,
        wall: `${x.wl}`,
        w: `${x.w}`,
        h: `${x.h}`,
        length: `${Math.round((x.l / 12) * 1000) / 1000}`,
        qty: `${Math.max(1, Math.floor(x.q) || 1)}`,
      })),
    );
    nextId.current = s.r.length + 1;
    if (LIQUIDS.some((l) => l.id === s.lq) || s.lq === 'custom') setLiquidId(s.lq);
    setLiquidStr(`${Number(s.ld) || 1}`);
    if (MATERIALS.some((m) => m.id === s.mt) || s.mt === 'custom') setMaterialId(s.mt);
    setMaterialStr(`${Number(s.md) || 7850}`);
    setFlowStr(Number(s.fl) > 0 ? `${s.fl}` : '');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // ---------- derived ----------
  const toEngine = (r: UiRun): PipeRun => {
    if (r.shape === 'rect') return { id: r.id, shape: 'rect', odIn: 0, idIn: 0, widthIn: toIn(r.w), heightIn: toIn(r.h), wallIn: toIn(r.wall), lengthIn: lenIn(r.length), qty: num(r.qty) };
    let od = 0, idIn = 0, wall = 0;
    if (r.source === 'preset') {
      const p = presetById(r.presetId);
      if (p) {
        od = p.odIn;
        wall = p.wallIn;
        idIn = p.odIn - 2 * p.wallIn;
      }
    } else if (r.customMode === 'id') {
      idIn = toIn(r.idv);
    } else if (r.customMode === 'odWall') {
      od = toIn(r.od);
      wall = toIn(r.wall);
      idIn = od - 2 * wall;
    } else {
      od = toIn(r.od);
      idIn = toIn(r.idv);
      wall = (od - idIn) / 2;
    }
    return { id: r.id, shape: 'round', odIn: od, idIn, widthIn: 0, heightIn: 0, wallIn: wall, lengthIn: lenIn(r.length), qty: num(r.qty) };
  };
  const engineRuns = runs.map(toEngine);
  const liquidKgPerL = liquidId === 'custom' ? num(liquidStr) : LIQUIDS.find((l) => l.id === liquidId)!.kgPerL;
  const materialKgPerM3 = materialId === 'custom' ? num(materialStr) : MATERIALS.find((m) => m.id === materialId)!.kgPerM3;
  const flowLPerMin = flowStr ? (us ? num(flowStr) * 3.785411784 : num(flowStr)) : 0;
  const r = calculatePipes({ runs: engineRuns, liquidKgPerL, materialKgPerM3, flowLPerMin });
  const hasMaterial = r.materialIn3 > 0;
  const first = engineRuns[0];
  const firstRes = r.runs[0];

  // ---------- actions ----------
  const switchUnits = (u: Units) => {
    if (u === units) return;
    const toM = u === 'metric';
    const d = (s: string) => `${Math.round((toM ? num(s) * MM_PER_IN : num(s) / MM_PER_IN) * 1000) / 1000}`;
    const l = (s: string) => `${Math.round((toM ? num(s) * 0.3048 : num(s) / 0.3048) * 1000) / 1000}`;
    setRuns((prev) => prev.map((x) => ({ ...x, od: d(x.od), idv: d(x.idv), wall: d(x.wall), w: d(x.w), h: d(x.h), length: l(x.length) })));
    if (flowStr) setFlowStr(`${Math.round((toM ? num(flowStr) * 3.785411784 : num(flowStr) / 3.785411784) * 100) / 100}`);
    setUnits(u);
  };
  const update = (id: string, patch: Partial<UiRun>) => setRuns((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const addRun = () => {
    const id = `r${nextId.current++}`;
    setRuns((prev) => [...prev, { id, shape: 'round', source: 'preset', presetId: 'cuL-3/4', customMode: 'odWall', od: us ? '1' : '25', idv: us ? '0.8' : '20', wall: us ? '0.1' : '2', w: us ? '4' : '100', h: us ? '2' : '50', length: us ? '40' : '12', qty: '1' }]);
  };
  const removeRun = (id: string) => setRuns((prev) => (prev.length > 1 ? prev.filter((x) => x.id !== id) : prev));
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
  const runLabel = (x: UiRun) =>
    x.shape === 'rect' ? `${x.w} × ${x.h} ${dUnit} tube, ${x.wall} ${dUnit} wall` : x.source === 'preset' ? presetById(x.presetId)?.label || '' : 'custom pipe';
  const summary = () =>
    [
      'Pipe volume (KKC Tools Pipe & Tube Volume Calculator)',
      ...runs.map((x, i) => `${i + 1}. ${runLabel(x)} × ${x.length} ${lUnit}${num(x.qty) > 1 ? ` × ${x.qty}` : ''}`),
      `Capacity: ${fmt(r.usGal)} US gal · ${fmt(r.litres)} L · ${fmt(r.impGal)} imp gal · ${fmt(r.cubicFt, 3)} ft³`,
      `Liquid weight: ${fmt(r.liquidLb, 1)} lb (${fmt(r.liquidKg, 1)} kg)`,
      hasMaterial ? `Tube material: ${fmt(r.materialIn3, 1)} in³, ${fmt(r.materialLb, 1)} lb (${fmt(r.materialKg, 1)} kg)` : '',
    ]
      .filter(Boolean)
      .join('\n');
  const share = () => {
    const s: Shared = {
      u: 'us',
      r: runs.map((x, i) => {
        const e = engineRuns[i];
        return { s: x.shape, src: x.source, p: x.presetId, cm: x.customMode, od: +e.odIn.toFixed(4), id: +e.idIn.toFixed(4), wl: +e.wallIn.toFixed(4), w: +e.widthIn.toFixed(4), h: +e.heightIn.toFixed(4), l: +e.lengthIn.toFixed(3), q: e.qty };
      }),
      lq: liquidId,
      ld: liquidKgPerL,
      mt: materialId,
      md: materialKgPerM3,
      fl: flowLPerMin / 3.785411784,
    };
    const url = `${window.location.origin}${window.location.pathname}?p=${encode(s)}`;
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
  const field = (id: string, label: string, value: string, onChange: (v: string) => void, suffix?: string, help?: string) => (
    <div className={styles.field} key={id}>
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

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          <div className={styles.card}>
            {head('Choose your units')}
            <div className={styles.segment} role="group" aria-label="Units">
              <button type="button" aria-pressed={us} className={`${styles.segBtn} ${us ? styles.segActive : ''}`} onClick={() => switchUnits('us')}>
                US: inches, feet, gallons
              </button>
              <button type="button" aria-pressed={!us} className={`${styles.segBtn} ${!us ? styles.segActive : ''}`} onClick={() => switchUnits('metric')}>
                Metric: mm, metres, litres
              </button>
            </div>
          </div>

          {runs.map((x, idx) => {
            const e = engineRuns[idx];
            const res = r.runs[idx];
            const runGal = res.capacityIn3 / IN3_PER_US_GAL;
            const runL = res.capacityIn3 * L_PER_IN3;
            return (
              <div className={styles.card} key={x.id}>
                {head(
                  idx === 0 ? 'Pipe or tube' : `Run ${idx + 1}`,
                  res.valid ? (us ? `${fmt(runGal)} gal` : `${fmt(runL)} L`) : undefined,
                  runs.length > 1 ? (
                    <button type="button" className={styles.removeBtn} onClick={() => removeRun(x.id)} aria-label={`Remove run ${idx + 1}`}>
                      Remove
                    </button>
                  ) : undefined,
                )}
                <div className={styles.kindGrid} style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }} role="group" aria-label={`Size for run ${idx + 1}`}>
                  <button type="button" aria-pressed={x.shape === 'round' && x.source === 'preset'} className={`${styles.kindBtn} ${x.shape === 'round' && x.source === 'preset' ? styles.kindActive : ''}`} onClick={() => update(x.id, { shape: 'round', source: 'preset' })}>
                    Standard pipe
                  </button>
                  <button type="button" aria-pressed={x.shape === 'round' && x.source === 'custom'} className={`${styles.kindBtn} ${x.shape === 'round' && x.source === 'custom' ? styles.kindActive : ''}`} onClick={() => update(x.id, { shape: 'round', source: 'custom' })}>
                    Custom round
                  </button>
                  <button type="button" aria-pressed={x.shape === 'rect'} className={`${styles.kindBtn} ${x.shape === 'rect' ? styles.kindActive : ''}`} onClick={() => update(x.id, { shape: 'rect' })}>
                    Square / rect
                  </button>
                </div>

                <figure className={styles.diagram}>
                  <CrossSectionDiagram
                    shape={x.shape}
                    od={e.odIn}
                    id={e.idIn}
                    width={e.widthIn}
                    height={e.heightIn}
                    wall={e.wallIn}
                    labels={
                      x.shape === 'rect'
                        ? { w: dOut(e.widthIn), h: dOut(e.heightIn), wall: dOut(e.wallIn) }
                        : { od: e.odIn > 0 ? dOut(e.odIn) : undefined, id: e.idIn > 0 ? dOut(e.idIn) : undefined, wall: e.odIn > 0 ? dOut(e.wallIn) : undefined }
                    }
                  />
                </figure>

                <div className={styles.fields}>
                  {x.shape === 'round' && x.source === 'preset' && (
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor={`${x.id}-p`}>
                        Pipe size
                      </label>
                      <select id={`${x.id}-p`} className={styles.input} value={x.presetId} onChange={(ev) => update(x.id, { presetId: ev.target.value })}>
                        {PRESET_GROUPS.map((g) => (
                          <optgroup key={g} label={g}>
                            {PIPE_PRESETS.filter((p) => p.group === g).map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.label} — ID {us ? `${fmt(p.odIn - 2 * p.wallIn, 3)} in` : `${fmt((p.odIn - 2 * p.wallIn) * MM_PER_IN, 1)} mm`}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  )}
                  {x.shape === 'round' && x.source === 'custom' && (
                    <>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor={`${x.id}-cm`}>
                          I know the…
                        </label>
                        <select id={`${x.id}-cm`} className={styles.input} value={x.customMode} onChange={(ev) => update(x.id, { customMode: ev.target.value as CustomMode })}>
                          <option value="odWall">Outside diameter + wall</option>
                          <option value="odId">Outside + inside diameter</option>
                          <option value="id">Inside diameter only</option>
                        </select>
                      </div>
                      {x.customMode !== 'id' && field(`${x.id}-od`, 'Outside diameter (OD)', x.od, (val) => update(x.id, { od: val }), dUnit)}
                      {x.customMode === 'odWall' && field(`${x.id}-wall`, 'Wall thickness', x.wall, (val) => update(x.id, { wall: val }), dUnit)}
                      {x.customMode !== 'odWall' && field(`${x.id}-id`, 'Inside diameter (ID)', x.idv, (val) => update(x.id, { idv: val }), dUnit)}
                    </>
                  )}
                  {x.shape === 'rect' && (
                    <>
                      {field(`${x.id}-w`, 'Outside width', x.w, (val) => update(x.id, { w: val }), dUnit)}
                      {field(`${x.id}-h`, 'Outside height', x.h, (val) => update(x.id, { h: val }), dUnit)}
                      {field(`${x.id}-t`, 'Wall thickness', x.wall, (val) => update(x.id, { wall: val }), dUnit)}
                    </>
                  )}
                  {field(`${x.id}-len`, 'Length', x.length, (val) => update(x.id, { length: val }), lUnit)}
                  {field(`${x.id}-q`, 'How many like this', x.qty, (val) => update(x.id, { qty: val }))}
                </div>
                {!res.valid && <p className={styles.notice}>Check the sizes — the inside must be smaller than the outside and above zero.</p>}
                {res.valid && x.shape === 'round' && (
                  <p className={styles.itemVol}>
                    ID {dOut(e.idIn)} · {us ? `${sig(perLength(e.idIn).galPerFt)} gal per ft` : `${sig(perLength(e.idIn).lPerM)} L per m`}
                  </p>
                )}
              </div>
            );
          })}

          <div className={styles.addRow} style={{ gridTemplateColumns: '1fr' }}>
            <button type="button" className={styles.addBtn} onClick={addRun}>
              + Add another run (total a whole system)
            </button>
          </div>

          <div className={styles.card}>
            {head('Liquid, material & flow')}
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={ids.liquid}>
                  Liquid inside
                </label>
                <select id={ids.liquid} className={styles.input} value={liquidId} onChange={(ev) => setLiquidId(ev.target.value)}>
                  {LIQUIDS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label} ({l.kgPerL} kg/L)
                    </option>
                  ))}
                  <option value="custom">Other (enter density)</option>
                </select>
              </div>
              {liquidId === 'custom' && field(ids.ld, 'Liquid density', liquidStr, setLiquidStr, 'kg/L')}
              <div className={styles.field}>
                <label className={styles.label} htmlFor={ids.material}>
                  Tube material (for weight)
                </label>
                <select id={ids.material} className={styles.input} value={materialId} onChange={(ev) => setMaterialId(ev.target.value)}>
                  {MATERIALS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} ({fmt(m.kgPerM3, 0)} kg/m³)
                    </option>
                  ))}
                  <option value="custom">Other (enter density)</option>
                </select>
              </div>
              {materialId === 'custom' && field(ids.md, 'Material density', materialStr, setMaterialStr, 'kg/m³')}
              {field(ids.flow, 'Flow rate to fill (optional)', flowStr, setFlowStr, us ? 'gpm' : 'L/min')}
            </div>
            <p className={styles.help}>Densities are typical values — alloys and plastics vary a few percent.</p>
          </div>

          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              <strong>{us ? `${fmt(r.usGal)} gal` : `${fmt(r.litres)} L`}</strong> · {us ? `${fmt(r.liquidLb, 0)} lb` : `${fmt(r.liquidKg, 0)} kg`} of liquid
            </span>
            <a href="#pipe-results" className={styles.mobileBarLink} tabIndex={-1}>
              Results ↓
            </a>
          </div>
        </div>

        <div className={styles.results} id="pipe-results" aria-live="polite">
          <div className={styles.hero}>
            <div className={styles.heroLabel}>Pipe holds</div>
            <div className={styles.heroValue}>
              {us ? fmt(r.usGal) : fmt(r.litres)} <span className={styles.heroUnit}>{us ? 'US gallons' : 'litres'}</span>
            </div>
            <div className={styles.heroSub}>
              {us ? `${fmt(r.litres)} L` : `${fmt(r.usGal)} US gal`} · {fmt(r.impGal)} imp gal · {us ? `${fmt(r.liquidLb, 1)} lb` : `${fmt(r.liquidKg, 1)} kg`} of{' '}
              {liquidId === 'custom' ? 'liquid' : LIQUIDS.find((l) => l.id === liquidId)!.label.toLowerCase()}
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Capacity in every unit</h3>
            {(
              [
                ['US gallons', fmt(r.usGal, 3)],
                ['Litres', fmt(r.litres, 3)],
                ['Imperial gallons', fmt(r.impGal, 3)],
                ['Cubic feet', fmt(r.cubicFt, 4)],
                ['Cubic inches', fmt(r.cubicIn, 1)],
                ['Cubic metres', fmt(r.cubicM, 5)],
              ] as [string, string][]
            ).map(([k, val]) => (
              <div className={styles.row} key={k}>
                <span>{k}</span>
                <strong>{val}</strong>
              </div>
            ))}
            {r.fillMinutes !== null && (
              <div className={`${styles.row} ${styles.rowTotal}`}>
                <span>Time to fill at {flowStr} {us ? 'gpm' : 'L/min'}</span>
                <strong>{r.fillMinutes >= 60 ? `${fmt(r.fillMinutes / 60, 2)} h` : r.fillMinutes >= 1 ? `${fmt(r.fillMinutes, 1)} min` : `${fmt(r.fillMinutes * 60, 0)} s`}</strong>
              </div>
            )}
          </div>

          {runs.length > 1 && (
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>By run</h3>
              <div className={styles.tableScroll}>
                <table className={styles.sizeTable}>
                  <thead>
                    <tr>
                      <th scope="col">Run</th>
                      <th scope="col">Length</th>
                      <th scope="col">Holds</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs.map((x, i) => (
                      <tr key={x.id}>
                        <td>{runLabel(x)}</td>
                        <td>
                          {fmt(num(x.length) * num(x.qty), 2)} {lUnit}
                        </td>
                        <td>{us ? `${fmt(r.runs[i].capacityIn3 / IN3_PER_US_GAL)} gal` : `${fmt(r.runs[i].capacityIn3 * L_PER_IN3)} L`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Tube wall (material)</h3>
            {hasMaterial ? (
              <>
                <div className={styles.row}>
                  <span>Material volume</span>
                  <strong>{us ? `${fmt(r.materialIn3, 1)} in³` : `${fmt(r.materialIn3 * L_PER_IN3 * 1000, 0)} cm³`}</strong>
                </div>
                <div className={`${styles.row} ${styles.rowTotal}`}>
                  <span>Tube weight ({materialId === 'custom' ? 'custom' : MATERIALS.find((m) => m.id === materialId)!.label.toLowerCase()})</span>
                  <strong>{us ? `${fmt(r.materialLb, 1)} lb` : `${fmt(r.materialKg, 1)} kg`}</strong>
                </div>
                <div className={styles.row}>
                  <span>Full pipe (tube + liquid)</span>
                  <strong>{us ? `${fmt(r.materialLb + r.liquidLb, 1)} lb` : `${fmt(r.materialKg + r.liquidKg, 1)} kg`}</strong>
                </div>
              </>
            ) : (
              <p className={styles.note}>Enter an outside diameter (or pick a standard pipe) to get the wall volume and weight.</p>
            )}
          </div>

          {first && firstRes?.valid && first.shape === 'round' && (
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Your numbers in the formula</h3>
              <p className={styles.note} style={{ marginTop: 0 }}>
                Capacity = π × (ID ÷ 2)² × L = π × ({dOut(first.idIn / 2)})² × {fmt(num(runs[0].length), 3)} {lUnit} = {us ? `${fmt(firstRes.capacityIn3, 1)} in³ ÷ 231 = ${fmt(firstRes.capacityIn3 / IN3_PER_US_GAL, 3)} gal` : `${fmt(firstRes.capacityIn3 * L_PER_IN3, 3)} L`}
              </p>
              {first.odIn > 0 && (
                <p className={styles.note}>
                  Wall = π ÷ 4 × (OD² − ID²) × L = π ÷ 4 × ({dOut(first.odIn)}² − {dOut(first.idIn)}²) × L
                </p>
              )}
            </div>
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
            {us ? `${fmt(KG_PER_LB, 4)} kg = 1 lb · 231 in³ = 1 US gal` : '1 L = 1,000 cm³ · water ≈ 1 kg per litre'}. Fittings, valves and tanks are not included.
          </p>
        </div>
      </div>
    </div>
  );
}
