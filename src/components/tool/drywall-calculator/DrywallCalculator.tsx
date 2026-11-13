'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './DrywallCalculator.module.css';
import { SheetLayoutDiagram, SurfaceDiagram } from './DrywallDiagram';
import {
  BEAD_PIECES,
  BOARDS,
  M2_PER_FT2,
  M_PER_IN,
  ROOM_PRESETS,
  SHEETS,
  SURFACE_KINDS,
  TAPE_ROLLS,
  boardKgPerM2,
  calculateDrywall,
  defaultScrewSpacingM,
  defaultSurface,
  equivalentSheet,
  estimateCost,
  framingSpacingM,
  kgToLb,
  m2ToFt2,
  mToFt,
  sheetAreaM2,
  sheetById,
  type FramingKey,
  type SurfaceItem,
  type SurfaceKind,
  type UnitSystem,
} from '@/lib/drywall-engine';

// ---------- formatting ----------
const fmt = (n: number, max = 2, min = 0) =>
  (isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });

type DimKind = 'long' | 'short' | 'area' | 'count';

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

function formatDim(value: number, kind: DimKind, unit: UnitSystem): string {
  if (kind === 'count') return `${Math.floor(value)}`;
  if (kind === 'area') return unit === 'metric' ? `${fmt(value, 2)} m²` : `${fmt(m2ToFt2(value), 1)} sq ft`;
  if (unit === 'metric') return kind === 'long' ? `${fmt(value, 2)} m` : `${fmt(value * 100, 1)} cm`;
  if (kind === 'long') {
    const [f, i] = splitFeetInches(value);
    return i > 0 ? `${f} ft ${fmt(i, 2)} in` : `${f} ft`;
  }
  return `${fmt(value / M_PER_IN, 2)} in`;
}

const areaText = (m2: number, unit: UnitSystem) => (unit === 'metric' ? `${fmt(m2, 1)} m²` : `${fmt(m2ToFt2(m2), 0)} sq ft`);
const lengthText = (m: number, unit: UnitSystem) => (unit === 'metric' ? `${fmt(m, 1)} m` : `${fmt(mToFt(m), 0)} ft`);

// ---------- field specs ----------
type ValueKey = 'length' | 'width' | 'height' | 'area';
interface FieldSpec {
  key: ValueKey;
  label: string;
  symbol: string;
  kind: DimKind;
}

const FIELDS: Record<SurfaceKind, FieldSpec[]> = {
  room: [
    { key: 'length', label: 'Room length', symbol: 'L', kind: 'long' },
    { key: 'width', label: 'Room width', symbol: 'W', kind: 'long' },
    { key: 'height', label: 'Wall height', symbol: 'H', kind: 'long' },
  ],
  wall: [
    { key: 'length', label: 'Wall length', symbol: 'L', kind: 'long' },
    { key: 'height', label: 'Wall height', symbol: 'H', kind: 'long' },
  ],
  ceiling: [
    { key: 'length', label: 'Ceiling length', symbol: 'L', kind: 'long' },
    { key: 'width', label: 'Ceiling width', symbol: 'W', kind: 'long' },
  ],
  gable: [
    { key: 'length', label: 'Base (wall width)', symbol: 'B', kind: 'long' },
    { key: 'height', label: 'Rise (peak above wall top)', symbol: 'R', kind: 'long' },
  ],
  area: [{ key: 'area', label: 'Area to cover', symbol: 'A', kind: 'area' }],
};

// ---------- dimension input ----------
function DimField({
  label,
  symbol,
  kind,
  value,
  unit,
  onChange,
  compact = false,
}: {
  label: string;
  symbol?: string;
  kind: DimKind;
  value: number;
  unit: UnitSystem;
  onChange: (v: number) => void;
  compact?: boolean;
}) {
  const id = useId();
  const imperialLong = kind === 'long' && unit === 'imperial';
  const [ftStr, setFtStr] = useState(() => (imperialLong ? `${splitFeetInches(value)[0]}` : ''));
  const [inStr, setInStr] = useState(() => (imperialLong ? `${splitFeetInches(value)[1]}` : ''));
  const [str, setStr] = useState(() => {
    if (kind === 'count') return `${Math.floor(value)}`;
    if (kind === 'area') return unit === 'metric' ? `${Math.round(value * 100) / 100}` : `${Math.round(m2ToFt2(value) * 10) / 10}`;
    if (unit === 'metric') return kind === 'long' ? `${Math.round(value * 1000) / 1000}` : `${Math.round(value * 1000) / 10}`;
    return `${Math.round((value / M_PER_IN) * 100) / 100}`;
  });
  const num = (s: string) => {
    const n = parseFloat(s);
    return isFinite(n) && n > 0 ? n : 0;
  };
  const suffix =
    kind === 'count' ? '' : kind === 'area' ? (unit === 'metric' ? 'm²' : 'sq ft') : unit === 'metric' ? (kind === 'long' ? 'm' : 'cm') : 'in';

  const labelEl = (
    <label className={styles.label} htmlFor={imperialLong ? `${id}-ft` : id}>
      {label} {symbol && <span className={styles.sym}>({symbol})</span>}
    </label>
  );

  if (imperialLong) {
    return (
      <div className={`${styles.field} ${compact ? styles.fieldCompact : ''}`}>
        {labelEl}
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
              aria-label={`${label} inches`}
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
      </div>
    );
  }

  return (
    <div className={`${styles.field} ${compact ? styles.fieldCompact : ''}`}>
      {labelEl}
      <div className={styles.inputWrap}>
        <input
          id={id}
          className={styles.input}
          type="number"
          inputMode={kind === 'count' ? 'numeric' : 'decimal'}
          min="0"
          step={kind === 'count' ? '1' : 'any'}
          value={str}
          onChange={(e) => {
            setStr(e.target.value);
            const n = num(e.target.value);
            if (kind === 'count') onChange(Math.floor(n));
            else if (kind === 'area') onChange(unit === 'metric' ? n : n * M2_PER_FT2);
            else if (unit === 'metric') onChange(kind === 'long' ? n : n / 100);
            else onChange(n * M_PER_IN);
          }}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
    </div>
  );
}

// ---------- share-link encoding ----------
interface SharedItem {
  k: SurfaceKind;
  l: number;
  wi: number;
  h: number;
  a: number;
  iw: 0 | 1;
  ic: 0 | 1;
  ac: 0 | 1;
  dc: number;
  dw: number;
  dh: number;
  wc: number;
  ww: number;
  wh: number;
  q: number;
}
interface SharedState {
  u: UnitSystem;
  w: number;
  s: string;
  f: FramingKey;
  i: SharedItem[];
}

const r5 = (n: number) => Math.round(n * 100000) / 100000;

function encodeState(state: SharedState): string {
  const bytes = new TextEncoder().encode(JSON.stringify(state));
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeState(raw: string): SharedState | null {
  try {
    const binary = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
    const s = JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)))) as SharedState;
    const kinds = SURFACE_KINDS.map((k) => k.kind);
    if (!s || !Array.isArray(s.i) || s.i.length === 0 || s.i.length > 30) return null;
    if (!s.i.every((it) => kinds.includes(it.k))) return null;
    return s;
  } catch {
    return null;
  }
}

const num0 = (n: unknown, fallback: number) => (typeof n === 'number' && isFinite(n) && n >= 0 ? n : fallback);

const WASTE_PRESETS = [0, 5, 10, 15, 20];

// ---------- main component ----------
export default function DrywallCalculator() {
  const nextId = useRef(2);
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [items, setItems] = useState<SurfaceItem[]>([defaultSurface('room', 's1')]);
  const [sheetId, setSheetId] = useState('ft4x8');
  const [waste, setWaste] = useState(10);
  const [framing, setFraming] = useState<FramingKey>('narrow');
  const [wallScrewOverride, setWallScrewOverride] = useState<number | null>(null);
  const [ceilScrewOverride, setCeilScrewOverride] = useState<number | null>(null);
  const [rollId, setRollId] = useState('r250');
  const [beadM, setBeadM] = useState(0);
  const [beadId, setBeadId] = useState('b8');
  const [boardId, setBoardId] = useState('regular12');
  const [prices, setPrices] = useState({ sheet: '', pail: '', roll: '', perBox: '', box: '', labor: '' });
  const [notice, setNotice] = useState('');
  const [renderKey, setRenderKey] = useState(0);

  const ids = {
    roll: useId(),
    bead: useId(),
    board: useId(),
    waste: useId(),
    sheet: useId(),
    perBox: useId(),
    box: useId(),
    pail: useId(),
    rollPrice: useId(),
    labor: useId(),
  };

  // Restore a shared calculation from ?d= once, after mount.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('d');
    if (!raw) return;
    const s = decodeState(raw);
    if (!s) return;
    const u: UnitSystem = s.u === 'metric' ? 'metric' : 'imperial';
    const restored: SurfaceItem[] = s.i.map((it, idx) => {
      const base = defaultSurface(it.k, `s${idx + 1}`);
      return {
        ...base,
        length: num0(it.l, base.length),
        width: num0(it.wi, base.width),
        height: num0(it.h, base.height),
        area: num0(it.a, base.area),
        includeWalls: it.iw !== 0,
        includeCeiling: it.ic !== 0,
        areaOnCeiling: it.ac === 1,
        doors: { count: Math.floor(num0(it.dc, 0)), width: num0(it.dw, base.doors.width), height: num0(it.dh, base.doors.height) },
        windows: { count: Math.floor(num0(it.wc, 0)), width: num0(it.ww, base.windows.width), height: num0(it.wh, base.windows.height) },
        qty: Math.floor(num0(it.q, 1)),
      };
    });
    nextId.current = restored.length + 1;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(restored);
    setUnit(u);
    setSheetId(SHEETS.some((sh) => sh.id === s.s) ? equivalentSheet(s.s, u).id : equivalentSheet('ft4x8', u).id);
    setWaste(Math.min(100, Math.max(0, Number(s.w) || 0)));
    setFraming(s.f === 'wide' ? 'wide' : 'narrow');
    setRenderKey((k) => k + 1);
  }, []);

  const imperial = unit === 'imperial';
  const framingM = framingSpacingM(framing, unit);
  const wallScrewM = wallScrewOverride ?? defaultScrewSpacingM('wall', framing, unit);
  const ceilScrewM = ceilScrewOverride ?? defaultScrewSpacingM('ceiling', framing, unit);
  const roll = TAPE_ROLLS.find((r) => r.id === rollId) || TAPE_ROLLS[1];
  const bead = BEAD_PIECES.find((b) => b.id === beadId) || BEAD_PIECES[0];
  const board = BOARDS.find((b) => b.id === boardId) || BOARDS[0];
  const sheet = sheetById(sheetId);

  const result = calculateDrywall({
    items,
    sheetId,
    wastePercent: waste,
    framingM,
    wallScrewSpacingM: wallScrewM,
    ceilingScrewSpacingM: ceilScrewM,
    tapeRollM: roll.lengthM,
    cornerBeadM: beadM,
    beadPieceM: bead.lengthM,
    boardLbPerSqFt: board.lbPerSqFt,
  });

  const priceNum = (s: string) => {
    const n = parseFloat(s);
    return isFinite(n) && n > 0 ? n : 0;
  };
  const laborRate = priceNum(prices.labor);
  const cost = estimateCost(result, {
    sheetPrice: priceNum(prices.sheet),
    pailPrice: priceNum(prices.pail),
    rollPrice: priceNum(prices.roll),
    screwsPerBox: priceNum(prices.perBox),
    boxPrice: priceNum(prices.box),
    laborPerM2: imperial ? laborRate / M2_PER_FT2 : laborRate,
  });
  const hasCost = cost.total > 0;
  const sheetWeightKg = sheetAreaM2(sheet) * boardKgPerM2(board.lbPerSqFt);

  // ---------- handlers ----------
  const switchUnit = (u: UnitSystem) => {
    if (u === unit) return;
    setUnit(u);
    setSheetId(equivalentSheet(sheetId, u).id);
    setWallScrewOverride(null);
    setCeilScrewOverride(null);
  };
  const updateItem = (id: string, patch: Partial<SurfaceItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const setKind = (id: string, kind: SurfaceKind) => {
    setItems((prev) => prev.map((it) => (it.id === id ? defaultSurface(kind, id) : it)));
    setRenderKey((k) => k + 1);
  };
  const applyPreset = (id: string, presetId: string) => {
    const p = ROOM_PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    updateItem(id, { length: p.lengthM, width: p.widthM, height: p.heightM });
    setRenderKey((k) => k + 1);
  };
  const addItem = (kind: SurfaceKind = 'room') => {
    const id = `s${nextId.current++}`;
    setItems((prev) => [...prev, defaultSurface(kind, id)]);
  };
  const removeItem = (id: string) => setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));
  const setFramingKey = (k: FramingKey) => {
    setFraming(k);
    setWallScrewOverride(null);
    setCeilScrewOverride(null);
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

  const summaryText = () => {
    const kindLabel = (k: SurfaceKind) => SURFACE_KINDS.find((x) => x.kind === k)?.label || k;
    const lines = [
      'Drywall estimate (KKC Tools Drywall Calculator)',
      ...items.map((it, i) => {
        const dims = FIELDS[it.kind].map((f) => `${f.symbol} ${formatDim(it[f.key], f.kind, unit)}`).join(', ');
        const r = result.items.find((x) => x.id === it.id);
        return `${i + 1}. ${kindLabel(it.kind)} × ${it.qty} (${dims}) — ${areaText(r ? r.totalM2 : 0, unit)}`;
      }),
      `Area to cover: ${areaText(result.netM2, unit)} (+${waste}% extra)`,
      `Sheets: ${result.sheets} × ${sheet.label}`,
      `Joint compound: ${imperial ? `${fmt(result.compoundGal, 1)} gal` : `${fmt(result.compoundL, 1)} L`} (${result.pails} × ${imperial ? '4.5 gal' : '17 L'} pails)`,
      `Paper tape: ${lengthText(result.tapeM, unit)} (${result.tapeRolls} × ${roll.label} rolls)`,
      `Screws: ${fmt(result.screws, 0)}`,
    ];
    if (result.beadPieces > 0) lines.push(`Corner bead: ${result.beadPieces} × ${bead.label}`);
    return lines.join('\n');
  };

  const shareLink = () => {
    const state: SharedState = {
      u: unit,
      w: waste,
      s: sheetId,
      f: framing,
      i: items.map((it) => ({
        k: it.kind,
        l: r5(it.length),
        wi: r5(it.width),
        h: r5(it.height),
        a: r5(it.area),
        iw: it.includeWalls ? 1 : 0,
        ic: it.includeCeiling ? 1 : 0,
        ac: it.areaOnCeiling ? 1 : 0,
        dc: it.doors.count,
        dw: r5(it.doors.width),
        dh: r5(it.doors.height),
        wc: it.windows.count,
        ww: r5(it.windows.width),
        wh: r5(it.windows.height),
        q: it.qty,
      })),
    };
    const url = `${window.location.origin}${window.location.pathname}?d=${encodeState(state)}`;
    window.history.replaceState(null, '', url);
    copyText(url, 'Share link copied.');
  };

  const systemSheets = SHEETS.filter((s) => s.system === unit);
  const stepOffset = 2;

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {/* ---------------- INPUTS ---------------- */}
        <div className={styles.inputs}>
          {/* Units */}
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
                  onClick={() => switchUnit(u)}
                >
                  {u === 'imperial' ? 'Feet & inches (US)' : 'Metres & cm (metric)'}
                </button>
              ))}
            </div>
            <p className={styles.help}>Switching keeps your room sizes — the numbers convert automatically.</p>
          </div>

          {/* Surfaces */}
          {items.map((it, idx) => {
            const kindSpec = SURFACE_KINDS.find((k) => k.kind === it.kind)!;
            const labels: Record<string, string> = {};
            for (const f of FIELDS[it.kind]) labels[f.symbol] = formatDim(it[f.key], f.kind, unit);
            const r = result.items.find((x) => x.id === it.id);
            const hasOpenings = it.kind === 'wall' || (it.kind === 'room' && it.includeWalls);
            return (
              <div className={styles.card} key={it.id}>
                <div className={styles.cardHead}>
                  <span className={styles.step}>{idx + stepOffset}</span>
                  <h2 className={styles.cardTitle}>
                    {idx === 0 ? 'What are you covering?' : `Surface ${idx + 1}`} <span className={styles.titleSub}>· {kindSpec.label}</span>
                  </h2>
                  {items.length > 1 && (
                    <button type="button" className={styles.removeBtn} onClick={() => removeItem(it.id)} aria-label={`Remove surface ${idx + 1}`}>
                      Remove
                    </button>
                  )}
                </div>

                <div className={styles.kindGrid} role="group" aria-label={`Surface type for surface ${idx + 1}`}>
                  {SURFACE_KINDS.map((k) => (
                    <button
                      key={k.kind}
                      type="button"
                      aria-pressed={it.kind === k.kind}
                      className={`${styles.kindBtn} ${it.kind === k.kind ? styles.kindActive : ''}`}
                      onClick={() => setKind(it.id, k.kind)}
                    >
                      {k.short}
                    </button>
                  ))}
                </div>
                <p className={styles.help}>{kindSpec.hint}</p>

                <figure className={styles.diagram}>
                  <SurfaceDiagram
                    kind={it.kind}
                    labels={labels}
                    showWalls={it.includeWalls}
                    showCeiling={it.includeCeiling}
                    doors={hasOpenings ? it.doors.count : 0}
                    windows={hasOpenings ? it.windows.count : 0}
                    ceilingArea={it.areaOnCeiling}
                  />
                  <figcaption className={styles.figcap}>Diagram not to scale — labels show your numbers.</figcaption>
                </figure>

                {it.kind === 'room' && (
                  <div className={styles.toggleRow}>
                    <label className={`${styles.check} ${it.includeWalls ? styles.checkOn : ''}`}>
                      <input type="checkbox" checked={it.includeWalls} onChange={(e) => updateItem(it.id, { includeWalls: e.target.checked })} />
                      Walls
                    </label>
                    <label className={`${styles.check} ${it.includeCeiling ? styles.checkOn : ''}`}>
                      <input type="checkbox" checked={it.includeCeiling} onChange={(e) => updateItem(it.id, { includeCeiling: e.target.checked })} />
                      Ceiling
                    </label>
                    <select
                      className={`${styles.input} ${styles.presetSelect}`}
                      aria-label="Fill in an example room size"
                      value=""
                      onChange={(e) => applyPreset(it.id, e.target.value)}
                    >
                      <option value="">Quick fill: example room…</option>
                      {ROOM_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {it.kind === 'area' && (
                  <div className={styles.segment} role="group" aria-label="Area is on">
                    {[false, true].map((onCeiling) => (
                      <button
                        key={String(onCeiling)}
                        type="button"
                        aria-pressed={it.areaOnCeiling === onCeiling}
                        className={`${styles.segBtn} ${it.areaOnCeiling === onCeiling ? styles.segActive : ''}`}
                        onClick={() => updateItem(it.id, { areaOnCeiling: onCeiling })}
                      >
                        {onCeiling ? 'Ceiling area' : 'Wall area'}
                      </button>
                    ))}
                  </div>
                )}

                <div className={styles.fields} key={`${unit}-${it.kind}-${renderKey}`}>
                  {FIELDS[it.kind].map((f) => (
                    <DimField
                      key={f.key}
                      label={f.label}
                      symbol={f.symbol}
                      kind={f.kind}
                      unit={unit}
                      value={it[f.key]}
                      onChange={(val) => updateItem(it.id, { [f.key]: val } as Partial<SurfaceItem>)}
                    />
                  ))}
                  <DimField
                    label={it.kind === 'room' ? 'Identical rooms' : 'How many like this'}
                    kind="count"
                    unit={unit}
                    value={it.qty}
                    onChange={(val) => updateItem(it.id, { qty: val })}
                  />
                </div>

                {hasOpenings && (
                  <div className={styles.openings} key={`o-${unit}-${it.kind}-${renderKey}`}>
                    <p className={styles.subhead}>Doors &amp; windows to subtract</p>
                    <div className={styles.openRow}>
                      <DimField label="Doors" kind="count" unit={unit} value={it.doors.count} onChange={(c) => updateItem(it.id, { doors: { ...it.doors, count: c } })} compact />
                      <DimField label="Door width" kind="short" unit={unit} value={it.doors.width} onChange={(w) => updateItem(it.id, { doors: { ...it.doors, width: w } })} compact />
                      <DimField label="Door height" kind="short" unit={unit} value={it.doors.height} onChange={(h) => updateItem(it.id, { doors: { ...it.doors, height: h } })} compact />
                    </div>
                    <div className={styles.openRow}>
                      <DimField label="Windows" kind="count" unit={unit} value={it.windows.count} onChange={(c) => updateItem(it.id, { windows: { ...it.windows, count: c } })} compact />
                      <DimField label="Window width" kind="short" unit={unit} value={it.windows.width} onChange={(w) => updateItem(it.id, { windows: { ...it.windows, width: w } })} compact />
                      <DimField label="Window height" kind="short" unit={unit} value={it.windows.height} onChange={(h) => updateItem(it.id, { windows: { ...it.windows, height: h } })} compact />
                    </div>
                  </div>
                )}

                <p className={styles.itemVol}>
                  This surface: <strong>{areaText(r ? r.totalM2 : 0, unit)}</strong> to cover
                  {r && r.openingsM2 > 0 ? ` (after removing ${areaText(r.openingsM2, unit)} of openings)` : ''}
                </p>
              </div>
            );
          })}

          <div className={styles.addRow}>
            <button type="button" className={styles.addBtn} onClick={() => addItem('room')}>
              + Add another room
            </button>
            <button type="button" className={styles.addBtnAlt} onClick={() => addItem('wall')}>
              + Wall
            </button>
            <button type="button" className={styles.addBtnAlt} onClick={() => addItem('ceiling')}>
              + Ceiling
            </button>
          </div>

          {/* Sheets & framing */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>{items.length + stepOffset}</span>
              <h2 className={styles.cardTitle}>Sheet size &amp; framing</h2>
            </div>
            <p className={styles.label} id={ids.sheet}>
              Drywall sheet size
            </p>
            <div className={styles.pills} role="group" aria-labelledby={ids.sheet}>
              {systemSheets.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={sheetId === s.id}
                  className={`${styles.pill} ${sheetId === s.id ? styles.pillActive : ''}`}
                  onClick={() => setSheetId(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className={styles.help}>Longer sheets mean fewer joints to tape. Match the sheet length to your wall length or height where you can.</p>

            <p className={styles.label} style={{ marginTop: 14 }}>
              Stud &amp; joist spacing
            </p>
            <div className={styles.segment} role="group" aria-label="Framing spacing">
              {(['narrow', 'wide'] as FramingKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={framing === k}
                  className={`${styles.segBtn} ${framing === k ? styles.segActive : ''}`}
                  onClick={() => setFramingKey(k)}
                >
                  {imperial ? (k === 'narrow' ? '16 in on center' : '24 in on center') : k === 'narrow' ? '400 mm centres' : '600 mm centres'}
                </button>
              ))}
            </div>
            <figure className={styles.diagram} style={{ marginTop: 12 }}>
              <SheetLayoutDiagram
                wide={framing === 'wide'}
                framingLabel={imperial ? (framing === 'narrow' ? '16 in o.c.' : '24 in o.c.') : framing === 'narrow' ? '400 mm' : '600 mm'}
                screwLabel={formatDim(wallScrewM, 'short', unit)}
                sheetLengthLabel={formatDim(sheet.lengthM, 'long', unit)}
                sheetWidthLabel={formatDim(sheet.widthM, 'long', unit)}
              />
              <figcaption className={styles.figcap}>
                Hang sheets across the studs. Dots = wall screws ({result.screwsPerWallSheet} per sheet); ceilings use{' '}
                {formatDim(ceilScrewM, 'short', unit)} spacing ({result.screwsPerCeilingSheet} per sheet).
              </figcaption>
            </figure>
          </div>

          {/* Waste */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>{items.length + stepOffset + 1}</span>
              <h2 className={styles.cardTitle}>Extra for cutting &amp; waste</h2>
            </div>
            <div className={styles.pills} role="group" aria-label="Waste allowance">
              {WASTE_PRESETS.map((p) => (
                <button key={p} type="button" aria-pressed={waste === p} className={`${styles.pill} ${waste === p ? styles.pillActive : ''}`} onClick={() => setWaste(p)}>
                  {p}%
                </button>
              ))}
              <div className={styles.inputWrap} style={{ maxWidth: 110 }}>
                <input
                  id={ids.waste}
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
            <p className={styles.help}>10–15% covers cutting around openings and piecing. Use more for rooms with lots of corners, angles or small walls.</p>
          </div>

          {/* Advanced */}
          <details className={styles.card}>
            <summary className={styles.summary}>Advanced: screws, tape, corner bead, board weight &amp; prices</summary>
            <div className={styles.fields} key={`adv-${unit}-${framing}-${renderKey}`}>
              <DimField label="Screw spacing on walls" kind="short" unit={unit} value={wallScrewM} onChange={(val) => setWallScrewOverride(val)} />
              <DimField label="Screw spacing on ceilings" kind="short" unit={unit} value={ceilScrewM} onChange={(val) => setCeilScrewOverride(val)} />
            </div>
            {(wallScrewOverride !== null || ceilScrewOverride !== null) && (
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => {
                  setWallScrewOverride(null);
                  setCeilScrewOverride(null);
                  setRenderKey((k) => k + 1);
                }}
              >
                Reset screw spacing to the defaults
              </button>
            )}
            <p className={styles.help}>Defaults follow the US residential code table for screws (IRC R702.3.5). UK and EU board makers often ask for closer spacing — use their figure here.</p>

            <div className={styles.fields} style={{ marginTop: 12 }}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={ids.roll}>
                  Tape roll length
                </label>
                <select id={ids.roll} className={styles.input} value={rollId} onChange={(e) => setRollId(e.target.value)}>
                  {TAPE_ROLLS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={ids.board}>
                  Board type (for weight)
                </label>
                <select id={ids.board} className={styles.input} value={boardId} onChange={(e) => setBoardId(e.target.value)}>
                  {BOARDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
              <DimField key={`bead-${unit}-${renderKey}`} label="Outside corners, total length" kind="long" unit={unit} value={beadM} onChange={setBeadM} />
              <div className={styles.field}>
                <label className={styles.label} htmlFor={ids.bead}>
                  Corner bead piece length
                </label>
                <select id={ids.bead} className={styles.input} value={beadId} onChange={(e) => setBeadId(e.target.value)}>
                  {BEAD_PIECES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className={styles.subhead} style={{ marginTop: 16 }}>
              Your local prices (optional)
            </p>
            <div className={styles.fields}>
              {(
                [
                  ['sheet', `Price per sheet (${sheet.label})`, ids.sheet + 'p'],
                  ['pail', 'Price per 4.5 gal compound pail', ids.pail],
                  ['roll', 'Price per tape roll', ids.rollPrice],
                  ['perBox', 'Screws per box', ids.perBox],
                  ['box', 'Price per box of screws', ids.box],
                  ['labor', `Labour per ${imperial ? 'sq ft' : 'm²'} (if hiring)`, ids.labor],
                ] as const
              ).map(([key, label, id]) => (
                <div className={styles.field} key={key}>
                  <label className={styles.label} htmlFor={id}>
                    {label}
                  </label>
                  <input
                    id={id}
                    className={styles.input}
                    type="number"
                    min="0"
                    step={key === 'perBox' ? '1' : '0.01'}
                    placeholder={key === 'perBox' ? 'count on the box' : 'your price'}
                    value={prices[key]}
                    onChange={(e) => setPrices((p) => ({ ...p, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </details>

          {/* Mobile-only: keeps the answer in view while filling the form */}
          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              <strong>{fmt(result.sheets, 0)}</strong> × {sheet.label} · {result.pails} pail{result.pails === 1 ? '' : 's'} · {fmt(result.screws, 0)} screws
            </span>
            <a href="#drywall-results" className={styles.mobileBarLink} tabIndex={-1}>
              Results ↓
            </a>
          </div>
        </div>

        {/* ---------------- RESULTS ---------------- */}
        <div className={styles.results} id="drywall-results" aria-live="polite">
          <div className={styles.hero}>
            <div className={styles.heroLabel}>Drywall sheets needed</div>
            <div className={styles.heroValue}>
              {fmt(result.sheets, 0)} <span className={styles.heroUnit}>sheets</span>
            </div>
            <div className={styles.heroSub}>
              of {sheet.label} · {areaText(result.netM2, unit)} to cover · includes {waste}% extra
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Area breakdown</h3>
            <div className={styles.row}>
              <span>Walls (before openings)</span>
              <strong>{areaText(result.wallGrossM2, unit)}</strong>
            </div>
            <div className={styles.row}>
              <span>Doors &amp; windows</span>
              <strong>− {areaText(result.openingsM2, unit)}</strong>
            </div>
            <div className={styles.row}>
              <span>Ceilings</span>
              <strong>{areaText(result.ceilingM2, unit)}</strong>
            </div>
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>Area to cover</span>
              <strong>{areaText(result.netM2, unit)}</strong>
            </div>
            <div className={styles.row}>
              <span>With {waste}% extra</span>
              <strong>{areaText(result.orderM2, unit)}</strong>
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Sheets by size</h3>
            <div className={styles.sizeGrid}>
              {result.sheetsBySize.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={s.id === sheetId}
                  className={`${styles.sizeCard} ${s.id === sheetId ? styles.sizeActive : ''}`}
                  onClick={() => setSheetId(s.id)}
                  title={`Use ${s.label} sheets`}
                >
                  <span className={styles.sizeCount}>{fmt(s.sheets, 0)}</span>
                  <span className={styles.sizeLabel}>× {s.label}</span>
                </button>
              ))}
            </div>
            <p className={styles.note}>Tap a size to use it for screws, weight and cost. Sheets are always rounded up.</p>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Finishing materials</h3>
            <div className={styles.matRow}>
              <div>
                <span className={styles.matName}>Joint compound (all-purpose)</span>
                <span className={styles.matSub}>{imperial ? `${fmt(result.compoundGal, 1)} gal` : `${fmt(result.compoundL, 1)} L`} for three coats</span>
              </div>
              <strong className={styles.matValue}>
                {result.pails} × {imperial ? '4.5 gal' : '17 L (4.5 gal)'} pail{result.pails === 1 ? '' : 's'}
                <span className={styles.matAlt}>
                  or {result.cartons} × {imperial ? '3.5 gal' : '13 L (3.5 gal)'} carton{result.cartons === 1 ? '' : 's'}
                </span>
              </strong>
            </div>
            <div className={styles.matRow}>
              <div>
                <span className={styles.matName}>Paper joint tape</span>
                <span className={styles.matSub}>{lengthText(result.tapeM, unit)} of seams &amp; corners</span>
              </div>
              <strong className={styles.matValue}>
                {result.tapeRolls} × {roll.label} roll{result.tapeRolls === 1 ? '' : 's'}
              </strong>
            </div>
            <div className={styles.matRow}>
              <div>
                <span className={styles.matName}>Drywall screws</span>
                <span className={styles.matSub}>
                  walls {fmt(result.screwsWall, 0)} · ceilings {fmt(result.screwsCeiling, 0)}
                </span>
              </div>
              <strong className={styles.matValue}>
                {fmt(result.screws, 0)}
                {cost.screwBoxes > 0 && <span className={styles.matAlt}>{cost.screwBoxes} box{cost.screwBoxes === 1 ? '' : 'es'}</span>}
              </strong>
            </div>
            {result.beadPieces > 0 && (
              <div className={styles.matRow}>
                <div>
                  <span className={styles.matName}>Corner bead</span>
                  <span className={styles.matSub}>{lengthText(beadM, unit)} of outside corners</span>
                </div>
                <strong className={styles.matValue}>
                  {result.beadPieces} × {bead.label}
                </strong>
              </div>
            )}
            <p className={styles.note}>Compound: ≈ 10 gal per 1,000 sq ft (USG). Tape: ≈ 350 ft per 1,000 sq ft (Georgia-Pacific). The same {waste}% extra is added.</p>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Weight to haul</h3>
            <div className={styles.row}>
              <span>{board.label}</span>
              <strong>{imperial ? `${fmt(kgToLb(sheetWeightKg), 0)} lb per sheet` : `${fmt(sheetWeightKg, 1)} kg per sheet`}</strong>
            </div>
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>All {fmt(result.sheets, 0)} sheets</span>
              <strong>
                {imperial
                  ? `${fmt(kgToLb(result.weightKg), 0)} lb (${fmt(kgToLb(result.weightKg) / 2000, 2)} US tons)`
                  : `${fmt(result.weightKg, 0)} kg (${fmt(result.weightKg / 1000, 2)} t)`}
              </strong>
            </div>
            <p className={styles.note}>Nominal board weights from USG. Check your vehicle&apos;s payload before loading everything at once.</p>
          </div>

          {hasCost && (
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Cost estimate</h3>
              {cost.sheets > 0 && (
                <div className={styles.row}>
                  <span>Sheets</span>
                  <strong>{fmt(cost.sheets, 2, 2)}</strong>
                </div>
              )}
              {cost.compound > 0 && (
                <div className={styles.row}>
                  <span>Joint compound</span>
                  <strong>{fmt(cost.compound, 2, 2)}</strong>
                </div>
              )}
              {cost.tape > 0 && (
                <div className={styles.row}>
                  <span>Tape</span>
                  <strong>{fmt(cost.tape, 2, 2)}</strong>
                </div>
              )}
              {cost.screws > 0 && (
                <div className={styles.row}>
                  <span>Screws</span>
                  <strong>{fmt(cost.screws, 2, 2)}</strong>
                </div>
              )}
              <div className={`${styles.row} ${styles.rowTotal}`}>
                <span>Materials</span>
                <strong>{fmt(cost.materials, 2, 2)}</strong>
              </div>
              {cost.labor > 0 && (
                <div className={styles.row}>
                  <span>Labour</span>
                  <strong>{fmt(cost.labor, 2, 2)}</strong>
                </div>
              )}
              {cost.labor > 0 && (
                <div className={`${styles.row} ${styles.rowTotal}`}>
                  <span>Total</span>
                  <strong>{fmt(cost.total, 2, 2)}</strong>
                </div>
              )}
              <p className={styles.note}>Uses only the prices you entered. Delivery, corner bead, primer and tax are not included.</p>
            </div>
          )}

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
