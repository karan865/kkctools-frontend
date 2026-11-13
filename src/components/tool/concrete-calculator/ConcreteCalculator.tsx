'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './ConcreteCalculator.module.css';
import ShapeDiagram from './ShapeDiagram';
import {
  BAGS,
  M_PER_IN,
  MIX_RATIOS,
  SHAPES,
  SHAPE_ORDER,
  LB_FT3_PER_KG_M3,
  calculateJob,
  defaultValues,
  kgToLb,
  m3ToFt3,
  m3ToYd3,
  roundUpTo,
  siteMix,
  yd3ToM3,
  type FieldSpec,
  type JobItem,
  type ShapeId,
  type UnitSystem,
} from '@/lib/concrete-engine';

// ---------- formatting ----------
const fmt = (n: number, max = 2, min = 0) =>
  (isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });

function splitFeetInches(m: number): [number, number] {
  const totalIn = Math.max(0, m) / M_PER_IN;
  let feet = Math.floor(totalIn / 12 + 1e-9);
  let inches = Math.round((totalIn - feet * 12) * 100) / 100;
  if (inches >= 12) {
    feet += 1;
    inches = 0;
  }
  return [feet, inches];
}

function formatDim(value: number, kind: FieldSpec['kind'], unit: UnitSystem): string {
  if (kind === 'count') return `${Math.floor(value)}`;
  if (unit === 'metric') return kind === 'long' ? `${fmt(value, 2)} m` : `${fmt(value * 100, 1)} cm`;
  if (kind === 'long') {
    const [f, i] = splitFeetInches(value);
    return i > 0 ? `${f} ft ${fmt(i, 2)} in` : `${f} ft`;
  }
  return `${fmt(value / M_PER_IN, 2)} in`;
}

// ---------- dimension input ----------
function DimField({
  field,
  value,
  unit,
  onChange,
}: {
  field: FieldSpec;
  value: number;
  unit: UnitSystem;
  onChange: (meters: number) => void;
}) {
  const id = useId();
  const [ftStr, setFtStr] = useState(() => (field.kind === 'long' && unit === 'imperial' ? `${splitFeetInches(value)[0]}` : ''));
  const [inStr, setInStr] = useState(() => (field.kind === 'long' && unit === 'imperial' ? `${splitFeetInches(value)[1]}` : ''));
  const [str, setStr] = useState(() => {
    if (field.kind === 'count') return `${Math.floor(value)}`;
    if (unit === 'metric') return field.kind === 'long' ? `${Math.round(value * 1000) / 1000}` : `${Math.round(value * 1000) / 10}`;
    return `${Math.round((value / M_PER_IN) * 100) / 100}`;
  });
  const num = (s: string) => {
    const n = parseFloat(s);
    return isFinite(n) && n > 0 ? n : 0;
  };

  const unitLabel = field.kind === 'count' ? '' : unit === 'metric' ? (field.kind === 'long' ? 'm' : 'cm') : 'in';

  if (field.kind === 'long' && unit === 'imperial') {
    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${id}-ft`}>
          {field.label} <span className={styles.sym}>({field.symbol})</span>
        </label>
        <div className={styles.ftIn}>
          <div className={styles.inputWrap}>
            <input
              id={`${id}-ft`}
              className={styles.input}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={ftStr}
              onChange={(e) => {
                setFtStr(e.target.value);
                onChange((num(e.target.value) * 12 + num(inStr)) * M_PER_IN);
              }}
            />
            <span className={styles.suffix}>ft</span>
          </div>
          <div className={styles.inputWrap}>
            <input
              aria-label={`${field.label} inches`}
              className={styles.input}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={inStr}
              onChange={(e) => {
                setInStr(e.target.value);
                onChange((num(ftStr) * 12 + num(e.target.value)) * M_PER_IN);
              }}
            />
            <span className={styles.suffix}>in</span>
          </div>
        </div>
        {field.help && <span className={styles.help}>{field.help}</span>}
      </div>
    );
  }

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {field.label} <span className={styles.sym}>({field.symbol})</span>
      </label>
      <div className={styles.inputWrap}>
        <input
          id={id}
          className={styles.input}
          type="number"
          inputMode={field.kind === 'count' ? 'numeric' : 'decimal'}
          min="0"
          step={field.kind === 'count' ? '1' : 'any'}
          value={str}
          onChange={(e) => {
            setStr(e.target.value);
            const n = num(e.target.value);
            if (field.kind === 'count') onChange(Math.floor(n));
            else if (unit === 'metric') onChange(field.kind === 'long' ? n : n / 100);
            else onChange(n * M_PER_IN);
          }}
        />
        {unitLabel && <span className={styles.suffix}>{unitLabel}</span>}
      </div>
      {field.help && <span className={styles.help}>{field.help}</span>}
    </div>
  );
}

// ---------- share-link encoding ----------
interface SharedState {
  u: UnitSystem;
  w: number;
  i: { s: ShapeId; q: number; v: Record<string, number> }[];
}

function encodeState(state: SharedState): string {
  const bytes = new TextEncoder().encode(JSON.stringify(state));
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeState(raw: string): SharedState | null {
  try {
    const b64 = raw.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(b64);
    const json = new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
    const s = JSON.parse(json) as SharedState;
    if (!s || !Array.isArray(s.i) || s.i.length === 0 || s.i.length > 20) return null;
    if (!s.i.every((it) => SHAPE_ORDER.includes(it.s))) return null;
    return s;
  } catch {
    return null;
  }
}

const WASTE_PRESETS = [0, 5, 10, 15, 20];

// ---------- main component ----------
export default function ConcreteCalculator() {
  const nextId = useRef(2);
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [items, setItems] = useState<JobItem[]>([{ id: 'p1', shape: 'slab', values: defaultValues('slab'), qty: 1 }]);
  const [waste, setWaste] = useState(10);
  const [densityKgM3, setDensityKgM3] = useState(2400);
  const [truckCapM3, setTruckCapM3] = useState(yd3ToM3(10));
  const [bagPrice, setBagPrice] = useState('');
  const [volPrice, setVolPrice] = useState('');
  const [mixId, setMixId] = useState('1-2-4');
  const [notice, setNotice] = useState('');
  const [renderKey, setRenderKey] = useState(0);

  const truckId = useId();
  const densityId = useId();
  const wasteId = useId();
  const bagPriceId = useId();
  const volPriceId = useId();
  const mixSelectId = useId();

  // Restore a shared calculation from ?c= once, after mount.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('c');
    if (!raw) return;
    const s = decodeState(raw);
    if (!s) return;
    const restored = s.i.map((it, idx) => {
      const base = defaultValues(it.s);
      const values: Record<string, number> = {};
      for (const k of Object.keys(base)) values[k] = typeof it.v[k] === 'number' && isFinite(it.v[k]) ? it.v[k] : base[k];
      return { id: `p${idx + 1}`, shape: it.s, values, qty: Math.max(0, Math.floor(it.q || 0)) };
    });
    nextId.current = restored.length + 1;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(restored);
    setUnit(s.u === 'metric' ? 'metric' : 'imperial');
    setWaste(Math.min(100, Math.max(0, Number(s.w) || 0)));
    setRenderKey((k) => k + 1);
  }, []);

  const result = calculateJob({ items, wastePercent: waste, densityKgM3, truckCapacityM3: truckCapM3 });
  const imperial = unit === 'imperial';

  const totalYd3 = m3ToYd3(result.totalM3);
  const totalFt3 = m3ToFt3(result.totalM3);
  const orderMain = imperial ? roundUpTo(totalYd3, 0.25) : roundUpTo(result.totalM3, 0.25);
  const volUnit = imperial ? 'yd³' : 'm³';
  const mainBags = BAGS.filter((b) => b.system === unit);
  const otherBags = BAGS.filter((b) => b.system !== unit);
  const count = (id: string) => result.bags.find((b) => b.id === id)?.count ?? 0;
  const costBagId = imperial ? 'lb80' : 'kg25';
  const bagPriceNum = parseFloat(bagPrice);
  const volPriceNum = parseFloat(volPrice);
  const mix = siteMix(result.totalM3, (MIX_RATIOS.find((r) => r.id === mixId) || MIX_RATIOS[1]).parts);
  const bags80 = count('lb80');

  // ---------- item helpers ----------
  const updateItem = (id: string, patch: Partial<JobItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const setShape = (id: string, shape: ShapeId) =>
    updateItem(id, { shape, values: defaultValues(shape), qty: SHAPES[shape].defaultQty });
  const addItem = () => {
    const id = `p${nextId.current++}`;
    setItems((prev) => [...prev, { id, shape: 'postHoles', values: defaultValues('postHoles'), qty: SHAPES.postHoles.defaultQty }]);
  };
  const removeItem = (id: string) => setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 2500);
  };

  const summaryText = () => {
    const lines = [
      'Concrete estimate (KKC Tools Concrete Calculator)',
      ...items.map((it, i) => {
        const spec = SHAPES[it.shape];
        const dims = spec.fields.map((f) => `${f.symbol} ${formatDim(it.values[f.key] ?? 0, f.kind, unit)}`).join(', ');
        return `Pour ${i + 1}: ${spec.shortLabel} × ${it.qty} (${dims})`;
      }),
      `Extra for waste: ${waste}%`,
      `Total: ${fmt(totalYd3, 2)} yd³ = ${fmt(totalFt3, 1)} ft³ = ${fmt(result.totalM3, 2)} m³`,
      `Bags: ${mainBags.map((b) => `${count(b.id)} × ${b.label}`).join(', ')}`,
      `Ready-mix order: ${fmt(orderMain, 2)} ${volUnit}`,
    ];
    return lines.join('\n');
  };

  const copyText = async (text: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(text);
      flash(ok);
    } catch {
      flash('Copy is blocked in this browser — select and copy manually.');
    }
  };

  const shareLink = () => {
    const state: SharedState = {
      u: unit,
      w: waste,
      i: items.map((it) => ({
        s: it.shape,
        q: it.qty,
        v: Object.fromEntries(Object.entries(it.values).map(([k, v]) => [k, Math.round(v * 100000) / 100000])),
      })),
    };
    const url = `${window.location.origin}${window.location.pathname}?c=${encodeState(state)}`;
    window.history.replaceState(null, '', url);
    copyText(url, 'Share link copied.');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {/* ---------------- INPUTS ---------------- */}
        <div className={styles.inputs}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>1</span>
              <h2 className={styles.cardTitle}>Choose your units</h2>
            </div>
            <div className={styles.segment} role="group" aria-label="Unit system">
              {(['imperial', 'metric'] as UnitSystem[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  aria-pressed={unit === u}
                  className={`${styles.segBtn} ${unit === u ? styles.segActive : ''}`}
                  onClick={() => setUnit(u)}
                >
                  {u === 'imperial' ? 'Feet & inches (US)' : 'Metres & cm (metric)'}
                </button>
              ))}
            </div>
            <p className={styles.help}>Switching units keeps your sizes — the numbers convert automatically.</p>
          </div>

          {items.map((it, idx) => {
            const spec = SHAPES[it.shape];
            const labels: Record<string, string> = {};
            for (const f of spec.fields) labels[f.symbol] = formatDim(it.values[f.key] ?? 0, f.kind, unit);
            const itemRes = result.items.find((r) => r.id === it.id);
            const itemVol = itemRes ? itemRes.volumeM3 : 0;
            return (
              <div className={styles.card} key={it.id}>
                <div className={styles.cardHead}>
                  <span className={styles.step}>{idx + 2}</span>
                  <h2 className={styles.cardTitle}>
                    Pour {idx + 1}: {spec.label}
                  </h2>
                  {items.length > 1 && (
                    <button type="button" className={styles.removeBtn} onClick={() => removeItem(it.id)} aria-label={`Remove pour ${idx + 1}`}>
                      Remove
                    </button>
                  )}
                </div>

                <div className={styles.shapeGrid} role="group" aria-label={`Shape for pour ${idx + 1}`}>
                  {SHAPE_ORDER.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={it.shape === s}
                      className={`${styles.shapeBtn} ${it.shape === s ? styles.shapeActive : ''}`}
                      onClick={() => setShape(it.id, s)}
                    >
                      {SHAPES[s].shortLabel}
                    </button>
                  ))}
                </div>

                <figure className={styles.diagram}>
                  <ShapeDiagram shape={it.shape} labels={labels} />
                  <figcaption className={styles.figcap}>
                    Diagram not to scale · formula: <code>{spec.formula}</code>
                  </figcaption>
                </figure>

                <div className={styles.fields} key={`${unit}-${it.shape}-${renderKey}`}>
                  {spec.fields.map((f) => (
                    <DimField
                      key={f.key}
                      field={f}
                      unit={unit}
                      value={it.values[f.key] ?? 0}
                      onChange={(v) => updateItem(it.id, { values: { ...it.values, [f.key]: v } })}
                    />
                  ))}
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`qty-${it.id}`}>
                      {spec.qtyLabel}
                    </label>
                    <input
                      id={`qty-${it.id}`}
                      className={styles.input}
                      type="number"
                      inputMode="numeric"
                      min="0"
                      step="1"
                      value={Number.isFinite(it.qty) ? it.qty : 0}
                      onChange={(e) => updateItem(it.id, { qty: Math.max(0, Math.floor(parseFloat(e.target.value) || 0)) })}
                    />
                  </div>
                </div>

                <p className={styles.itemVol}>
                  This pour: <strong>{imperial ? `${fmt(m3ToFt3(itemVol), 2)} ft³ (${fmt(m3ToYd3(itemVol), 3)} yd³)` : `${fmt(itemVol, 3)} m³`}</strong>{' '}
                  before extra
                </p>
              </div>
            );
          })}

          <button type="button" className={styles.addBtn} onClick={addItem}>
            + Add another pour (footing, post holes, steps…)
          </button>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>{items.length + 2}</span>
              <h2 className={styles.cardTitle}>Extra for waste &amp; spillage</h2>
            </div>
            <div className={styles.pills} role="group" aria-label="Waste allowance">
              {WASTE_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={waste === p}
                  className={`${styles.pill} ${waste === p ? styles.pillActive : ''}`}
                  onClick={() => setWaste(p)}
                >
                  {p}%
                </button>
              ))}
              <div className={styles.inputWrap} style={{ maxWidth: 120 }}>
                <input
                  id={wasteId}
                  aria-label="Custom waste percent"
                  className={styles.input}
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={waste}
                  onChange={(e) => setWaste(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
            <p className={styles.help}>5% for straight forms on a flat base, 10% for most home jobs, 15–20% for uneven ground or hand-dug holes.</p>
          </div>

          <details className={styles.card}>
            <summary className={styles.summary}>Advanced: density, truck size &amp; prices</summary>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={densityId}>
                  Concrete density ({imperial ? 'lb/ft³' : 'kg/m³'})
                </label>
                <input
                  id={densityId}
                  key={`d-${unit}`}
                  className={styles.input}
                  type="number"
                  min="0"
                  step="any"
                  defaultValue={imperial ? Math.round(densityKgM3 * LB_FT3_PER_KG_M3 * 10) / 10 : Math.round(densityKgM3)}
                  onChange={(e) => {
                    const n = parseFloat(e.target.value) || 0;
                    setDensityKgM3(imperial ? n / LB_FT3_PER_KG_M3 : n);
                  }}
                />
                <span className={styles.help}>Typical normal-weight concrete: 140–150 lb/ft³ (2,240–2,400 kg/m³).</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={truckId}>
                  Ready-mix truck load ({volUnit})
                </label>
                <input
                  id={truckId}
                  key={`t-${unit}`}
                  className={styles.input}
                  type="number"
                  min="0"
                  step="any"
                  defaultValue={imperial ? Math.round(m3ToYd3(truckCapM3) * 100) / 100 : Math.round(truckCapM3 * 100) / 100}
                  onChange={(e) => {
                    const n = parseFloat(e.target.value) || 0;
                    setTruckCapM3(imperial ? yd3ToM3(n) : n);
                  }}
                />
                <span className={styles.help}>Ask your supplier — full loads differ by truck and by local weight limits.</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={bagPriceId}>
                  Price per {imperial ? '80 lb' : '25 kg'} bag (optional)
                </label>
                <input id={bagPriceId} className={styles.input} type="number" min="0" step="0.01" placeholder="your local price" value={bagPrice} onChange={(e) => setBagPrice(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={volPriceId}>
                  Ready-mix price per {volUnit} (optional)
                </label>
                <input id={volPriceId} className={styles.input} type="number" min="0" step="0.01" placeholder="your local quote" value={volPrice} onChange={(e) => setVolPrice(e.target.value)} />
              </div>
            </div>
          </details>
        </div>

        {/* ---------------- RESULTS ---------------- */}
        <div className={styles.results} aria-live="polite">
          <div className={styles.hero}>
            <div className={styles.heroLabel}>Concrete needed</div>
            <div className={styles.heroValue}>
              {imperial ? `${fmt(totalYd3, 2)} yd³` : `${fmt(result.totalM3, 2)} m³`}
            </div>
            <div className={styles.heroSub}>
              {imperial ? `${fmt(totalFt3, 1)} ft³ · ${fmt(result.totalM3, 2)} m³` : `${fmt(totalYd3, 2)} yd³ · ${fmt(totalFt3, 1)} ft³`} · includes {waste}% extra
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Volume breakdown</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">yd³</th>
                  <th scope="col">ft³</th>
                  <th scope="col">m³</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Exact volume</th>
                  <td>{fmt(m3ToYd3(result.netM3), 2)}</td>
                  <td>{fmt(m3ToFt3(result.netM3), 1)}</td>
                  <td>{fmt(result.netM3, 2)}</td>
                </tr>
                <tr>
                  <th scope="row">Extra ({waste}%)</th>
                  <td>{fmt(m3ToYd3(result.wasteM3), 2)}</td>
                  <td>{fmt(m3ToFt3(result.wasteM3), 1)}</td>
                  <td>{fmt(result.wasteM3, 2)}</td>
                </tr>
                <tr className={styles.totalRow}>
                  <th scope="row">Total</th>
                  <td>{fmt(totalYd3, 2)}</td>
                  <td>{fmt(totalFt3, 1)}</td>
                  <td>{fmt(result.totalM3, 2)}</td>
                </tr>
              </tbody>
            </table>
            <p className={styles.note}>
              Approx. weight: <strong>{imperial ? `${fmt(kgToLb(result.weightKg), 0)} lb` : `${fmt(result.weightKg, 0)} kg`}</strong>{' '}
              ({imperial ? `${fmt(kgToLb(result.weightKg) / 2000, 2)} US tons` : `${fmt(result.weightKg / 1000, 2)} tonnes`})
            </p>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Bags of premixed concrete</h3>
            <div className={styles.bagGrid}>
              {mainBags.map((b) => (
                <div key={b.id} className={`${styles.bag} ${b.id === costBagId ? styles.bagMain : ''}`}>
                  <span className={styles.bagCount}>{fmt(count(b.id), 0)}</span>
                  <span className={styles.bagLabel}>× {b.label}</span>
                </div>
              ))}
            </div>
            <p className={styles.note}>
              {imperial ? 'Other sizes' : 'US sizes'}: {otherBags.map((b) => `${fmt(count(b.id), 0)} × ${b.label}`).join(' · ')}
            </p>
            <p className={styles.note}>
              {imperial
                ? 'Yields from the QUIKRETE Concrete Mix data sheet (80 lb ≈ 0.60 ft³). Bags are rounded up.'
                : 'Metric yields estimated at ≈ 0.47 L of concrete per kg of dry mix — check your bag label. Rounded up.'}
            </p>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Ordering ready-mix</h3>
            <div className={styles.row}>
              <span>Order (rounded up to 0.25 {volUnit})</span>
              <strong>
                {fmt(orderMain, 2)} {volUnit}
              </strong>
            </div>
            <div className={styles.row}>
              <span>Truck loads at {imperial ? fmt(m3ToYd3(truckCapM3), 2) : fmt(truckCapM3, 2)} {volUnit} each</span>
              <strong>{result.truckLoads}</strong>
            </div>
            <p className={styles.tip}>
              {result.totalM3 <= 0
                ? 'Enter your sizes to get a recommendation.'
                : result.totalM3 <= yd3ToM3(1) + 1e-9
                  ? `About ${imperial ? `${bags80} × 80 lb` : `${count('kg25')} × 25 kg`} bags — a size most people mix themselves. Check whether a ready-mix supplier will deliver a short load if you would rather not mix.`
                  : `More than ${imperial ? '1 cubic yard' : 'about 0.75 m³'} (${imperial ? `${bags80} × 80 lb` : `${count('kg25')} × 25 kg`} bags). Mixing this by hand is heavy work — get a ready-mix quote and compare.`}
            </p>
          </div>

          {(bagPriceNum > 0 || volPriceNum > 0) && (
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Cost estimate</h3>
              {bagPriceNum > 0 && (
                <div className={styles.row}>
                  <span>
                    Bagged: {fmt(count(costBagId), 0)} × {imperial ? '80 lb' : '25 kg'} @ {fmt(bagPriceNum, 2, 2)}
                  </span>
                  <strong>{fmt(count(costBagId) * bagPriceNum, 2, 2)}</strong>
                </div>
              )}
              {volPriceNum > 0 && (
                <div className={styles.row}>
                  <span>
                    Ready-mix: {fmt(orderMain, 2)} {volUnit} @ {fmt(volPriceNum, 2, 2)}
                  </span>
                  <strong>{fmt(orderMain * volPriceNum, 2, 2)}</strong>
                </div>
              )}
              <p className={styles.note}>Material only — delivery, short-load fees, pump, rebar and labour are extra.</p>
            </div>
          )}

          <details className={styles.panel}>
            <summary className={styles.summary}>Mixing from scratch? Cement, sand &amp; gravel</summary>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={mixSelectId}>
                Mix ratio (cement : sand : gravel)
              </label>
              <select id={mixSelectId} className={styles.input} value={mixId} onChange={(e) => setMixId(e.target.value)}>
                {MIX_RATIOS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.row}>
              <span>Cement</span>
              <strong>
                {imperial ? `${mix.cementBags94lb} × 94 lb bags` : `${mix.cementBags50kg} × 50 kg bags`} ({fmt(imperial ? kgToLb(mix.cementKg) : mix.cementKg, 0)} {imperial ? 'lb' : 'kg'})
              </strong>
            </div>
            <div className={styles.row}>
              <span>Sand</span>
              <strong>{imperial ? `${fmt(m3ToFt3(mix.sandM3), 1)} ft³ (${fmt(m3ToYd3(mix.sandM3), 2)} yd³)` : `${fmt(mix.sandM3, 2)} m³`}</strong>
            </div>
            <div className={styles.row}>
              <span>Gravel / stone</span>
              <strong>{imperial ? `${fmt(m3ToFt3(mix.gravelM3), 1)} ft³ (${fmt(m3ToYd3(mix.gravelM3), 2)} yd³)` : `${fmt(mix.gravelM3, 2)} m³`}</strong>
            </div>
            <p className={styles.note}>
              Nominal site-mix rule of thumb (dry volume × 1.54). For structural work use the mix your engineer or local code specifies.
            </p>
          </details>

          <div className={styles.actions}>
            <button type="button" className={styles.actionBtn} onClick={() => copyText(summaryText(), 'Results copied.')}>
              Copy results
            </button>
            <button type="button" className={styles.actionBtn} onClick={shareLink}>
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

