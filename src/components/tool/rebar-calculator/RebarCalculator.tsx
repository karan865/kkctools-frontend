'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './RebarCalculator.module.css';
import { ItemDiagram, LapDiagram } from './RebarDiagram';
import {
  BARS,
  ITEM_KINDS,
  KG_PER_LB,
  M_PER_IN,
  STOCK_LENGTHS,
  barById,
  calculateRebar,
  defaultItem,
  defaultStockId,
  equivalentBar,
  estimateRebarCost,
  kgToLb,
  mToFt,
  stockById,
  type ItemKind,
  type RebarItem,
  type UnitSystem,
} from '@/lib/rebar-engine';

// ---------- formatting ----------
const fmt = (n: number, max = 2, min = 0) =>
  (isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });

type DimKind = 'long' | 'short' | 'count';

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
  if (unit === 'metric') return kind === 'long' ? `${fmt(value, 2)} m` : `${fmt(value * 1000, 0)} mm`;
  if (kind === 'long') {
    const [f, i] = splitFeetInches(value);
    return i > 0 ? `${f} ft ${fmt(i, 2)} in` : `${f} ft`;
  }
  return `${fmt(value / M_PER_IN, 2)} in`;
}

const lengthText = (m: number, unit: UnitSystem) => (unit === 'metric' ? `${fmt(m, 1)} m` : `${fmt(mToFt(m), 0)} ft`);
const weightText = (kg: number, unit: UnitSystem) => (unit === 'metric' ? `${fmt(kg, 0)} kg` : `${fmt(kgToLb(kg), 0)} lb`);

// ---------- field specs ----------
type ValueKey = 'length' | 'width' | 'height' | 'spacing' | 'spacing2' | 'cover' | 'count' | 'layers';
interface FieldSpec {
  key: ValueKey;
  label: string;
  symbol?: string;
  kind: DimKind;
}

const FIELDS: Record<ItemKind, FieldSpec[]> = {
  slab: [
    { key: 'length', label: 'Slab length', symbol: 'L', kind: 'long' },
    { key: 'width', label: 'Slab width', symbol: 'W', kind: 'long' },
    { key: 'spacing', label: 'Bar spacing (both ways)', symbol: 'S', kind: 'short' },
    { key: 'cover', label: 'Edge cover', symbol: 'c', kind: 'short' },
    { key: 'layers', label: 'Mats (1 = single layer)', kind: 'count' },
  ],
  footing: [
    { key: 'length', label: 'Footing length', symbol: 'L', kind: 'long' },
    { key: 'count', label: 'Long bars', symbol: 'N', kind: 'count' },
    { key: 'width', label: 'Footing width', symbol: 'W', kind: 'short' },
    { key: 'spacing', label: 'Cross-bar spacing (0 = none)', symbol: 'S', kind: 'short' },
    { key: 'cover', label: 'End cover', symbol: 'c', kind: 'short' },
  ],
  wall: [
    { key: 'length', label: 'Wall length', symbol: 'L', kind: 'long' },
    { key: 'height', label: 'Wall height', symbol: 'H', kind: 'long' },
    { key: 'spacing', label: 'Vertical bar spacing', symbol: 'Sv', kind: 'short' },
    { key: 'spacing2', label: 'Horizontal bar spacing', symbol: 'Sh', kind: 'short' },
    { key: 'cover', label: 'Edge cover', symbol: 'c', kind: 'short' },
    { key: 'layers', label: 'Curtains (1 or 2 layers)', kind: 'count' },
  ],
  bars: [
    { key: 'count', label: 'Number of bars', symbol: 'N', kind: 'count' },
    { key: 'length', label: 'Length of each bar', symbol: 'L', kind: 'long' },
  ],
};

// ---------- dimension input ----------
function DimField({ label, symbol, kind, value, unit, onChange }: { label: string; symbol?: string; kind: DimKind; value: number; unit: UnitSystem; onChange: (v: number) => void }) {
  const id = useId();
  const imperialLong = kind === 'long' && unit === 'imperial';
  const [ftStr, setFtStr] = useState(() => (imperialLong ? `${splitFeetInches(value)[0]}` : ''));
  const [inStr, setInStr] = useState(() => (imperialLong ? `${splitFeetInches(value)[1]}` : ''));
  const [str, setStr] = useState(() => {
    if (kind === 'count') return `${Math.floor(value)}`;
    if (unit === 'metric') return kind === 'long' ? `${Math.round(value * 1000) / 1000}` : `${Math.round(value * 1000)}`;
    return `${Math.round((value / M_PER_IN) * 100) / 100}`;
  });
  const num = (s: string) => {
    const n = parseFloat(s);
    return isFinite(n) && n > 0 ? n : 0;
  };
  const suffix = kind === 'count' ? '' : unit === 'metric' ? (kind === 'long' ? 'm' : 'mm') : 'in';
  const labelEl = (
    <label className={styles.label} htmlFor={imperialLong ? `${id}-ft` : id}>
      {label} {symbol && <span className={styles.sym}>({symbol})</span>}
    </label>
  );

  if (imperialLong) {
    return (
      <div className={styles.field}>
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
    <div className={styles.field}>
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
            else if (unit === 'metric') onChange(kind === 'long' ? n : n / 1000);
            else onChange(n * M_PER_IN);
          }}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
    </div>
  );
}

// ---------- share link ----------
interface SharedItem {
  k: ItemKind;
  b: string;
  l: number;
  wi: number;
  h: number;
  sp: number;
  s2: number;
  c: number;
  n: number;
  ly: number;
  q: number;
}
interface SharedState {
  u: UnitSystem;
  s: string;
  lp: number;
  w: number;
  i: SharedItem[];
}

const r5 = (n: number) => Math.round(n * 100000) / 100000;
const num0 = (n: unknown, fb: number) => (typeof n === 'number' && isFinite(n) && n >= 0 ? n : fb);

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
    const kinds = ITEM_KINDS.map((k) => k.kind);
    if (!s || !Array.isArray(s.i) || s.i.length === 0 || s.i.length > 30) return null;
    if (!s.i.every((it) => kinds.includes(it.k))) return null;
    return s;
  } catch {
    return null;
  }
}

const WASTE_PRESETS = [0, 5, 10, 15];

// ---------- main component ----------
export default function RebarCalculator() {
  const nextId = useRef(2);
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [items, setItems] = useState<RebarItem[]>([defaultItem('slab', 'r1')]);
  const [stockId, setStockId] = useState('ft20');
  const [lapD, setLapD] = useState(40);
  const [waste, setWaste] = useState(10);
  const [pricePerWeight, setPricePerWeight] = useState('');
  const [pricePerPiece, setPricePerPiece] = useState('');
  const [notice, setNotice] = useState('');
  const [renderKey, setRenderKey] = useState(0);
  const ids = { lap: useId(), waste: useId(), stock: useId(), pw: useId(), pp: useId() };

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('r');
    if (!raw) return;
    const s = decodeState(raw);
    if (!s) return;
    const u: UnitSystem = s.u === 'metric' ? 'metric' : 'imperial';
    const restored: RebarItem[] = s.i.map((it, idx) => {
      const base = defaultItem(it.k, `r${idx + 1}`, u);
      return {
        ...base,
        barId: BARS.some((b) => b.id === it.b) ? equivalentBar(it.b, u).id : base.barId,
        length: num0(it.l, base.length),
        width: num0(it.wi, base.width),
        height: num0(it.h, base.height),
        spacing: num0(it.sp, base.spacing),
        spacing2: num0(it.s2, base.spacing2),
        cover: num0(it.c, base.cover),
        count: Math.floor(num0(it.n, base.count)),
        layers: Math.max(1, Math.floor(num0(it.ly, 1))),
        qty: Math.floor(num0(it.q, 1)),
      };
    });
    nextId.current = restored.length + 1;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(restored);
    setUnit(u);
    setStockId(STOCK_LENGTHS.some((x) => x.id === s.s && x.system === u) ? s.s : defaultStockId(u));
    setLapD(Math.min(200, Math.max(0, Number(s.lp) || 40)));
    setWaste(Math.min(100, Math.max(0, Number(s.w) || 0)));
    setRenderKey((k) => k + 1);
  }, []);

  const imperial = unit === 'imperial';
  const stock = stockById(stockId);
  const result = calculateRebar({ items, stockLengthM: stock.lengthM, lapDiameters: lapD, wastePercent: waste });
  const pw = parseFloat(pricePerWeight);
  const pp = parseFloat(pricePerPiece);
  // price per lb → per kg
  const pricePerKg = isFinite(pw) && pw > 0 ? (imperial ? pw / KG_PER_LB : pw) : 0;
  const cost = estimateRebarCost(result, pricePerKg, isFinite(pp) && pp > 0 ? pp : 0);
  const firstBar = barById(items[0]?.barId || 'us4');
  const systemBars = BARS.filter((b) => b.system === unit);
  const systemStocks = STOCK_LENGTHS.filter((s) => s.system === unit);
  const mainSize = result.bySize[0];

  const switchUnit = (u: UnitSystem) => {
    if (u === unit) return;
    setUnit(u);
    setItems((prev) => prev.map((it) => ({ ...it, barId: equivalentBar(it.barId, u).id })));
    setStockId(stock.lengthM > 9 ? (u === 'metric' ? 'm12' : 'ft40') : defaultStockId(u));
  };
  const updateItem = (id: string, patch: Partial<RebarItem>) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const setKind = (id: string, kind: ItemKind) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...defaultItem(kind, id, unit), barId: it.barId } : it)));
    setRenderKey((k) => k + 1);
  };
  const addItem = (kind: ItemKind) => {
    const id = `r${nextId.current++}`;
    setItems((prev) => [...prev, defaultItem(kind, id, unit)]);
  };
  const removeItem = (id: string) => setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));

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
    const kindLabel = (k: ItemKind) => ITEM_KINDS.find((x) => x.kind === k)?.label || k;
    const lines = [
      'Rebar estimate (KKC Tools Reinforcement Steel Calculator)',
      ...items.map((it, i) => {
        const dims = FIELDS[it.kind].map((f) => `${f.symbol || f.label} ${formatDim(it[f.key], f.kind, unit)}`).join(', ');
        return `${i + 1}. ${kindLabel(it.kind)} × ${it.qty}, ${barById(it.barId).label} bars (${dims})`;
      }),
      ...result.bySize.map(
        (b) => `${b.label}: ${b.bars} bars placed, ${lengthText(b.orderLengthM, unit)} incl. laps & ${waste}% extra → ${b.pieces} × ${stock.label} bars, ${weightText(b.weightKg, unit)}`,
      ),
      `Total weight: ${weightText(result.weightKg, unit)}`,
    ];
    return lines.join('\n');
  };

  const shareLink = () => {
    const state: SharedState = {
      u: unit,
      s: stockId,
      lp: lapD,
      w: waste,
      i: items.map((it) => ({
        k: it.kind,
        b: it.barId,
        l: r5(it.length),
        wi: r5(it.width),
        h: r5(it.height),
        sp: r5(it.spacing),
        s2: r5(it.spacing2),
        c: r5(it.cover),
        n: it.count,
        ly: it.layers,
        q: it.qty,
      })),
    };
    const url = `${window.location.origin}${window.location.pathname}?r=${encodeState(state)}`;
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
                <button key={u} type="button" aria-pressed={unit === u} className={`${styles.segBtn} ${unit === u ? styles.segActive : ''}`} onClick={() => switchUnit(u)}>
                  {u === 'imperial' ? 'US: feet, inches & #bars' : 'Metric: metres, mm bars'}
                </button>
              ))}
            </div>
            <p className={styles.help}>Switching converts your sizes and picks the nearest bar in the other system.</p>
          </div>

          {items.map((it, idx) => {
            const spec = ITEM_KINDS.find((k) => k.kind === it.kind)!;
            const labels: Record<string, string> = {};
            for (const f of FIELDS[it.kind]) if (f.symbol) labels[f.symbol] = formatDim(it[f.key], f.kind, unit);
            const r = result.items.find((x) => x.id === it.id);
            const barSelectId = `bar-${it.id}`;
            return (
              <div className={styles.card} key={it.id}>
                <div className={styles.cardHead}>
                  <span className={styles.step}>{idx + 2}</span>
                  <h2 className={styles.cardTitle}>
                    {idx === 0 ? 'What are you reinforcing?' : `Part ${idx + 1}`} <span className={styles.titleSub}>· {spec.label}</span>
                  </h2>
                  {items.length > 1 && (
                    <button type="button" className={styles.removeBtn} onClick={() => removeItem(it.id)} aria-label={`Remove part ${idx + 1}`}>
                      Remove
                    </button>
                  )}
                </div>

                <div className={styles.kindGrid} style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }} role="group" aria-label={`Type for part ${idx + 1}`}>
                  {ITEM_KINDS.map((k) => (
                    <button key={k.kind} type="button" aria-pressed={it.kind === k.kind} className={`${styles.kindBtn} ${it.kind === k.kind ? styles.kindActive : ''}`} onClick={() => setKind(it.id, k.kind)}>
                      {k.short}
                    </button>
                  ))}
                </div>
                <p className={styles.help}>{spec.hint}</p>

                <figure className={styles.diagram}>
                  <ItemDiagram kind={it.kind} labels={labels} />
                  <figcaption className={styles.figcap}>Diagram not to scale — labels show your numbers.</figcaption>
                </figure>

                <div className={styles.fields} key={`${unit}-${it.kind}-${renderKey}`}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={barSelectId}>
                      Bar size
                    </label>
                    <select id={barSelectId} className={`${styles.input} ${styles.barSelect}`} value={it.barId} onChange={(e) => updateItem(it.id, { barId: e.target.value })}>
                      {systemBars.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.system === 'imperial' ? `${b.label} — ${fmt(b.diameterM / M_PER_IN, 3)} in, ${b.lbPerFt} lb/ft` : `${b.label} — ${fmt(b.kgPerM, 3)} kg/m`}
                        </option>
                      ))}
                    </select>
                  </div>
                  {FIELDS[it.kind].map((f) => (
                    <DimField key={f.key} label={f.label} symbol={f.symbol} kind={f.kind} unit={unit} value={it[f.key]} onChange={(val) => updateItem(it.id, { [f.key]: val } as Partial<RebarItem>)} />
                  ))}
                  <DimField label="How many like this" kind="count" unit={unit} value={it.qty} onChange={(val) => updateItem(it.id, { qty: val })} />
                </div>

                <p className={styles.itemVol}>
                  This part: <strong>{fmt(r ? r.bars : 0, 0)} bars</strong>, {lengthText(r ? r.lengthM : 0, unit)} of {barById(it.barId).label}
                  {r && r.laps > 0 ? ` (incl. ${fmt(r.laps, 0)} laps)` : ''} · {weightText(r ? r.weightKg : 0, unit)} before extra
                </p>
              </div>
            );
          })}

          <div className={styles.addRow} style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <button type="button" className={styles.addBtn} onClick={() => addItem('footing')}>
              + Footing
            </button>
            <button type="button" className={styles.addBtnAlt} onClick={() => addItem('wall')}>
              + Wall
            </button>
            <button type="button" className={styles.addBtnAlt} onClick={() => addItem('slab')}>
              + Slab
            </button>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>{items.length + 2}</span>
              <h2 className={styles.cardTitle}>Stock bars &amp; laps</h2>
            </div>
            <p className={styles.label} id={ids.stock}>
              Length of the bars you buy
            </p>
            <div className={styles.pills} role="group" aria-labelledby={ids.stock}>
              {systemStocks.map((s) => (
                <button key={s.id} type="button" aria-pressed={stockId === s.id} className={`${styles.pill} ${stockId === s.id ? styles.pillActive : ''}`} onClick={() => setStockId(s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
            <div className={styles.fields} style={{ marginTop: 12 }}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={ids.lap}>
                  Lap length, in bar diameters
                </label>
                <div className={styles.inputWrap}>
                  <input id={ids.lap} className={styles.input} type="number" min="0" max="200" step="1" value={lapD} onChange={(e) => setLapD(Math.min(200, Math.max(0, parseFloat(e.target.value) || 0)))} />
                  <span className={styles.suffix}>× d</span>
                </div>
              </div>
            </div>
            <figure className={styles.diagram} style={{ marginTop: 12 }}>
              <LapDiagram lapLabel={`${lapD} × d = ${formatDim(lapD * firstBar.diameterM, 'short', unit)}`} />
              <figcaption className={styles.figcap}>
                Runs longer than one stock bar get a lap at each joint ({firstBar.label} shown). Your drawings&apos; lap length always wins.
              </figcaption>
            </figure>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>{items.length + 3}</span>
              <h2 className={styles.cardTitle}>Extra for cutting &amp; waste</h2>
            </div>
            <div className={styles.pills} role="group" aria-label="Waste allowance">
              {WASTE_PRESETS.map((p) => (
                <button key={p} type="button" aria-pressed={waste === p} className={`${styles.pill} ${waste === p ? styles.pillActive : ''}`} onClick={() => setWaste(p)}>
                  {p}%
                </button>
              ))}
              <div className={styles.inputWrap} style={{ maxWidth: 110 }}>
                <input id={ids.waste} aria-label="Custom waste percent" className={styles.input} type="number" min="0" max="100" step="1" value={waste} onChange={(e) => setWaste(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))} />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
            <p className={styles.help}>Covers offcuts from cutting stock bars to length. 5–10% is typical for simple grids.</p>
          </div>

          <details className={styles.card}>
            <summary className={styles.summary}>Prices (optional)</summary>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={ids.pw}>
                  Price per {imperial ? 'lb' : 'kg'} of steel
                </label>
                <input id={ids.pw} className={styles.input} type="number" min="0" step="0.01" placeholder="supplier price" value={pricePerWeight} onChange={(e) => setPricePerWeight(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={ids.pp}>
                  Price per {stock.label} bar
                </label>
                <input id={ids.pp} className={styles.input} type="number" min="0" step="0.01" placeholder="store price" value={pricePerPiece} onChange={(e) => setPricePerPiece(e.target.value)} />
              </div>
            </div>
            <p className={styles.help}>Steel yards usually price by weight; home stores price by the bar. Use whichever you have.</p>
          </details>

          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              <strong>{fmt(result.pieces, 0)}</strong> × {stock.label} bars · {weightText(result.weightKg, unit)}
            </span>
            <a href="#rebar-results" className={styles.mobileBarLink} tabIndex={-1}>
              Results ↓
            </a>
          </div>
        </div>

        {/* ---------------- RESULTS ---------------- */}
        <div className={styles.results} id="rebar-results" aria-live="polite">
          <div className={styles.hero}>
            <div className={styles.heroLabel}>Rebar to buy</div>
            <div className={styles.heroValue}>
              {fmt(result.pieces, 0)} <span className={styles.heroUnit}>bars</span>
            </div>
            <div className={styles.heroSub}>
              of {stock.label}
              {mainSize && result.bySize.length === 1 ? ` ${mainSize.label}` : ''} · {weightText(result.weightKg, unit)} of steel · includes laps &amp; {waste}% extra
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>By bar size</h3>
            <div className={styles.tableScroll}>
              <table className={styles.sizeTable}>
                <thead>
                  <tr>
                    <th scope="col">Size</th>
                    <th scope="col">Bars placed</th>
                    <th scope="col">Laps</th>
                    <th scope="col">Length</th>
                    <th scope="col">Buy</th>
                    <th scope="col">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {result.bySize.map((b) => (
                    <tr key={b.barId}>
                      <td>
                        <strong>{b.label}</strong>
                      </td>
                      <td>{fmt(b.bars, 0)}</td>
                      <td>{fmt(b.laps, 0)}</td>
                      <td>{lengthText(b.orderLengthM, unit)}</td>
                      <td>
                        <strong>{fmt(b.pieces, 0)}</strong> × {stock.label}
                      </td>
                      <td>{weightText(b.weightKg, unit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>Length and weight include laps and the {waste}% extra. Bars to buy are rounded up.</p>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Totals</h3>
            <div className={styles.row}>
              <span>Bars placed</span>
              <strong>{fmt(result.bars, 0)}</strong>
            </div>
            <div className={styles.row}>
              <span>Steel length (with laps)</span>
              <strong>{lengthText(result.netLengthM, unit)}</strong>
            </div>
            <div className={styles.row}>
              <span>With {waste}% extra</span>
              <strong>{lengthText(result.orderLengthM, unit)}</strong>
            </div>
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>Total weight</span>
              <strong>
                {imperial ? `${fmt(kgToLb(result.weightKg), 0)} lb (${fmt(kgToLb(result.weightKg) / 2000, 2)} US tons)` : `${fmt(result.weightKg, 0)} kg (${fmt(result.weightKg / 1000, 2)} t)`}
              </strong>
            </div>
            <p className={styles.note}>Tie wire, chairs and bends/hooks are not included. Weights use ASTM A615 (US) and 7,850 kg/m³ steel (metric).</p>
          </div>

          {(cost.byWeight > 0 || cost.byPiece > 0) && (
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Cost estimate</h3>
              {cost.byWeight > 0 && (
                <div className={styles.row}>
                  <span>By weight ({weightText(result.weightKg, unit)})</span>
                  <strong>{fmt(cost.byWeight, 2, 2)}</strong>
                </div>
              )}
              {cost.byPiece > 0 && (
                <div className={styles.row}>
                  <span>
                    By the bar ({fmt(result.pieces, 0)} × {stock.label})
                  </span>
                  <strong>{fmt(cost.byPiece, 2, 2)}</strong>
                </div>
              )}
              <p className={styles.note}>Uses only the prices you entered. Delivery, cutting and bending are extra.</p>
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
