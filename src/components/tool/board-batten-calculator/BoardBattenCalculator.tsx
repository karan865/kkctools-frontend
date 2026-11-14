'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './BoardBattenCalculator.module.css';
import { WallLayoutDiagram, type LayoutObstacle } from './BattenDiagram';
import {
  MM_PER_IN,
  NOMINAL_BOARDS,
  calculateAccent,
  calculateSiding,
  formatFraction,
  parseInches,
  type AccentInput,
  type EdgeMode,
} from '@/lib/board-batten-engine';

type Project = 'accent' | 'siding';
type Units = 'imperial' | 'metric';

interface UiObstacle {
  id: string;
  label: string;
  left: string;
  width: string;
  bottom: string;
  height: string;
}

const STOCK_IMPERIAL = [96, 120, 144];
const STOCK_METRIC_MM = [2400, 3000, 3600];
const OBSTACLE_PRESETS: { label: string; w: number; h: number; b: number }[] = [
  { label: 'Outlet', w: 2.75, h: 4.5, b: 14 },
  { label: 'Switch', w: 2.75, h: 4.5, b: 46 },
  { label: 'Window', w: 36, h: 48, b: 36 },
];

const fmt = (n: number, max = 0, min = 0) => (isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });
const pnum = (s: string) => {
  const n = parseFloat(s);
  return isFinite(n) && n >= 0 ? n : 0;
};

// ---------- share link ----------
interface Shared {
  p: Project;
  u: Units;
  w: number;
  h: number;
  b: number;
  e: EdgeMode;
  i: number;
  m: 'count' | 'gap';
  c: number;
  g: number;
  t: number;
  bb: number;
  bx: boolean;
  rr: number;
  rw: number;
  sl: number;
  wp: number;
  sb: number;
  sg: number;
  sbt: number;
  se: boolean;
  fs: number;
}
const encode = (s: Shared) => btoa(JSON.stringify(s)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function decode(raw: string): Shared | null {
  try {
    const s = JSON.parse(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))) as Shared;
    return s && typeof s.w === 'number' && s.w >= 0 && s.w < 1e5 ? s : null;
  } catch {
    return null;
  }
}

function TextField({ id, label, value, onChange, suffix, help, invalid }: { id: string; label: string; value: string; onChange: (v: string) => void; suffix?: string; help?: string; invalid?: boolean }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input id={id} className={styles.input} inputMode="decimal" value={value} aria-invalid={invalid || undefined} onChange={(e) => onChange(e.target.value)} />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {help && <p className={styles.help}>{help}</p>}
    </div>
  );
}

export default function BoardBattenCalculator() {
  const nextId = useRef(1);
  const [project, setProject] = useState<Project>('accent');
  const [units, setUnits] = useState<Units>('imperial');
  const [wallW, setWallW] = useState("12'");
  const [wallH, setWallH] = useState("8'");
  const [battenStr, setBattenStr] = useState('3 1/2');
  const [edge, setEdge] = useState<EdgeMode>('both');
  const [insetStr, setInsetStr] = useState('6');
  const [mode, setMode] = useState<'count' | 'gap'>('gap');
  const [countStr, setCountStr] = useState('7');
  const [gapStr, setGapStr] = useState('16');
  const [topStr, setTopStr] = useState('3 1/2');
  const [baseStr, setBaseStr] = useState('0');
  const [baseExisting, setBaseExisting] = useState(true);
  const [rows, setRows] = useState(0);
  const [railStr, setRailStr] = useState('3 1/2');
  const [stockIn, setStockIn] = useState(96);
  const [wasteStr, setWasteStr] = useState('10');
  const [coatsStr, setCoatsStr] = useState('2');
  const [coverageStr, setCoverageStr] = useState('350');
  const [adhesiveStr, setAdhesiveStr] = useState('30');
  const [caulkStr, setCaulkStr] = useState('120');
  const [nailSpaceStr, setNailSpaceStr] = useState('16');
  const [obstacles, setObstacles] = useState<UiObstacle[]>([]);
  const [prices, setPrices] = useState({ board: '', adhesive: '', caulk: '', paint: '' });
  // siding
  const [sBoard, setSBoard] = useState(11.25);
  const [sGapStr, setSGapStr] = useState('1/2');
  const [sBatten, setSBatten] = useState(2.5);
  const [sEnds, setSEnds] = useState(false);
  const [furring, setFurring] = useState(24);
  const [windowsStr, setWindowsStr] = useState('0');
  const [doorsStr, setDoorsStr] = useState('0');
  const [notice, setNotice] = useState('');
  const ids = {
    w: useId(), h: useId(), b: useId(), inset: useId(), count: useId(), gap: useId(), top: useId(), base: useId(), rail: useId(),
    waste: useId(), coats: useId(), cov: useId(), adh: useId(), caulk: useId(), nail: useId(), sgap: useId(), win: useId(), door: useId(), bx: useId(), se: useId(),
  };

  const metric = units === 'metric';
  /** typed length → inches */
  const L = (s: string) => {
    if (metric) {
      const mm = parseFloat(s);
      return isFinite(mm) && mm >= 0 ? mm / MM_PER_IN : NaN;
    }
    return parseInches(s);
  };
  const ok = (s: string) => {
    const x = L(s);
    return isFinite(x) && x >= 0;
  };
  const Lz = (s: string) => (ok(s) ? L(s) : 0);
  const out = (inches: number, precise = false) =>
    !isFinite(inches) ? '—' : metric ? `${fmt(inches * MM_PER_IN, precise ? 1 : 0)} mm` : `${formatFraction(inches)}${precise ? ` (${fmt(inches, 3)} in)` : ''}`;
  const outFt = (inches: number) => (metric ? `${fmt((inches * MM_PER_IN) / 1000, 2)} m` : `${Math.floor(inches / 12)}′ ${formatFraction(inches % 12)}`);
  const unitSuffix = metric ? 'mm' : 'in';

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('b');
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    const str = (inches: number) => `${Math.round(inches * 10000) / 10000}`;
    setUnits('imperial');
    setProject(s.p === 'siding' ? 'siding' : 'accent');
    setWallW(str(s.w));
    setWallH(str(s.h));
    setBattenStr(str(s.b));
    if (['both', 'none', 'inset'].includes(s.e)) setEdge(s.e);
    setInsetStr(str(s.i));
    setMode(s.m === 'count' ? 'count' : 'gap');
    setCountStr(`${Math.floor(s.c) || 7}`);
    setGapStr(str(s.g));
    setTopStr(str(s.t));
    setBaseStr(str(s.bb));
    setBaseExisting(s.bx !== false);
    setRows(Math.min(4, Math.max(0, Math.floor(s.rr) || 0)));
    setRailStr(str(s.rw));
    setStockIn(STOCK_IMPERIAL.includes(s.sl) ? s.sl : 96);
    setWasteStr(`${Math.min(50, Math.max(0, s.wp || 0))}`);
    if (s.sb > 0) setSBoard(s.sb);
    setSGapStr(str(s.sg));
    if (s.sbt > 0) setSBatten(s.sbt);
    setSEnds(Boolean(s.se));
    setFurring([0, 16, 24].includes(s.fs) ? s.fs : 24);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // ---------- accent ----------
  const wallWidth = Lz(wallW);
  const wallHeight = Lz(wallH);
  const battenWidth = Lz(battenStr);
  const accentIn: AccentInput = {
    wallWidth,
    wallHeight,
    battenWidth,
    edge,
    inset: Lz(insetStr),
    mode,
    count: Math.floor(pnum(countStr)),
    targetGap: Lz(gapStr),
    topRail: Lz(topStr),
    baseboard: Lz(baseStr),
    baseExisting,
    railRows: rows,
    railWidth: Lz(railStr),
    stockLength: stockIn,
    wastePercent: pnum(wasteStr),
    coats: pnum(coatsStr) || 1,
    paintCoverage: pnum(coverageStr),
    adhesiveFtPerTube: pnum(adhesiveStr),
    caulkFtPerTube: pnum(caulkStr),
    nailSpacing: Lz(nailSpaceStr) || 16,
    nailsPerPoint: 2,
    obstacles: obstacles.map((o) => ({ id: o.id, label: o.label, left: Lz(o.left), width: Lz(o.width) })),
  };
  const a = calculateAccent(accentIn);
  const clashIdx = a.clashes.map((c) => c.battenIndex);
  const layoutObstacles: LayoutObstacle[] = obstacles.map((o) => ({ label: o.label, left: Lz(o.left), width: Lz(o.width), bottom: Lz(o.bottom), height: Lz(o.height) }));
  const cost =
    a.boards * pnum(prices.board) + a.adhesiveTubes * pnum(prices.adhesive) + a.caulkTubes * pnum(prices.caulk) + Math.ceil(a.paintGallons - 1e-9) * pnum(prices.paint);

  // ---------- siding ----------
  const sidingOpenings = pnum(windowsStr) * 36 * 48 + pnum(doorsStr) * 36 * 80;
  const sd = calculateSiding({
    wallWidth,
    wallHeight,
    boardWidth: sBoard,
    boardGap: Lz(sGapStr),
    battenWidth: sBatten,
    battensAtEnds: sEnds,
    openingsArea: sidingOpenings,
    furringSpacing: furring,
    stockLength: stockIn,
    wastePercent: pnum(wasteStr),
  });

  // ---------- actions ----------
  const switchUnits = (u: Units) => {
    if (u === units) return;
    const convIn = (s: string) => {
      // values currently in the old unit → new unit
      if (u === 'metric') {
        const inches = parseInches(s);
        return isFinite(inches) ? `${Math.round(inches * MM_PER_IN)}` : s;
      }
      const mm = parseFloat(s);
      return isFinite(mm) ? formatFraction(mm / MM_PER_IN).replace('"', '') : s;
    };
    setWallW((x) => convIn(x));
    setWallH((x) => convIn(x));
    setBattenStr((x) => convIn(x));
    setInsetStr((x) => convIn(x));
    setGapStr((x) => convIn(x));
    setTopStr((x) => convIn(x));
    setBaseStr((x) => convIn(x));
    setRailStr((x) => convIn(x));
    setNailSpaceStr((x) => convIn(x));
    setSGapStr((x) => convIn(x));
    setObstacles((prev) => prev.map((o) => ({ ...o, left: convIn(o.left), width: convIn(o.width), bottom: convIn(o.bottom), height: convIn(o.height) })));
    const idx = u === 'metric' ? STOCK_IMPERIAL.indexOf(stockIn) : STOCK_METRIC_MM.findIndex((mm) => Math.abs(mm / MM_PER_IN - stockIn) < 0.5);
    setStockIn(u === 'metric' ? STOCK_METRIC_MM[Math.max(0, idx)] / MM_PER_IN : STOCK_IMPERIAL[Math.max(0, idx)]);
    setUnits(u);
  };
  const showLen = (inches: number) => (metric ? `${Math.round(inches * MM_PER_IN)}` : formatFraction(inches).replace('"', ''));
  const pickBatten = (w: number) => setBattenStr(showLen(w));
  const addObstacle = (p: (typeof OBSTACLE_PRESETS)[number]) =>
    setObstacles((prev) => [
      ...prev,
      { id: `o${nextId.current++}`, label: p.label, left: showLen(Math.max(0, wallWidth / 2 - p.w / 2)), width: showLen(p.w), bottom: showLen(p.b), height: showLen(p.h) },
    ]);
  const updateObstacle = (id: string, patch: Partial<UiObstacle>) => setObstacles((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  const removeObstacle = (id: string) => setObstacles((prev) => prev.filter((o) => o.id !== id));

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 2500);
  };
  const copyText = async (text: string, okMsg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      flash(okMsg);
    } catch {
      flash('Copy is blocked in this browser — select and copy manually.');
    }
  };
  const summary = () =>
    project === 'accent'
      ? [
          'Board and batten layout (KKC Tools)',
          `Wall ${out(wallWidth)} × ${out(wallHeight)}, battens ${out(battenWidth)} wide`,
          `${a.count} battens, gap ${out(a.gap, true)}, ${out(a.onCenter)} on center`,
          `Marks (left edge of each batten from the left wall): ${a.positions.map((p) => out(p)).join(', ')}`,
          ...a.pieces.map((p) => `${p.label}: ${p.qty} × ${out(p.length)}`),
          `Buy: ${a.boards} boards of ${outFt(stockIn)} (${fmt(a.linearFeet, 1)} linear ft incl. waste), ${a.adhesiveTubes} adhesive, ${a.caulkTubes} caulk, ${fmt(a.paintGallons, 1)} gal paint`,
        ].join('\n')
      : [
          'Board and batten siding (KKC Tools)',
          `Wall ${out(wallWidth)} × ${out(wallHeight)}: ${sd.boards} boards, ${sd.battens} battens`,
          `Boards ${fmt(sd.boardLinearFt)} lin ft (${sd.boardPieces} pieces), battens ${fmt(sd.battenLinearFt)} lin ft (${sd.battenPieces} pieces), furring ${fmt(sd.furringLinearFt)} lin ft`,
        ].join('\n');
  const share = () => {
    const s: Shared = {
      p: project, u: 'imperial', w: wallWidth, h: wallHeight, b: battenWidth, e: edge, i: Lz(insetStr), m: mode, c: Math.floor(pnum(countStr)), g: Lz(gapStr),
      t: Lz(topStr), bb: Lz(baseStr), bx: baseExisting, rr: rows, rw: Lz(railStr), sl: metric ? 96 : stockIn, wp: pnum(wasteStr), sb: sBoard, sg: Lz(sGapStr), sbt: sBatten, se: sEnds, fs: furring,
    };
    const url = `${window.location.origin}${window.location.pathname}?b=${encode(s)}`;
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
  const stockOptions = metric ? STOCK_METRIC_MM.map((mm) => mm / MM_PER_IN) : STOCK_IMPERIAL;

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          <div className={styles.card}>
            {head('Project & units')}
            <div className={styles.segment} role="group" aria-label="Project type">
              <button type="button" aria-pressed={project === 'accent'} className={`${styles.segBtn} ${project === 'accent' ? styles.segActive : ''}`} onClick={() => setProject('accent')}>
                Interior accent wall
              </button>
              <button type="button" aria-pressed={project === 'siding'} className={`${styles.segBtn} ${project === 'siding' ? styles.segActive : ''}`} onClick={() => setProject('siding')}>
                Exterior siding
              </button>
            </div>
            <div className={styles.segment} role="group" aria-label="Units" style={{ marginTop: 10 }}>
              {(['imperial', 'metric'] as Units[]).map((u) => (
                <button key={u} type="button" aria-pressed={units === u} className={`${styles.segBtn} ${units === u ? styles.segActive : ''}`} onClick={() => switchUnits(u)}>
                  {u === 'imperial' ? 'Inches (fractions OK)' : 'Millimetres'}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            {head('Wall size', `${out(wallWidth)} × ${out(wallHeight)}`)}
            <div className={styles.fields}>
              <TextField id={ids.w} label="Wall width" value={wallW} onChange={setWallW} suffix={unitSuffix} invalid={!ok(wallW)} help={metric ? undefined : "Type 144, 12' or 11' 9 1/2"} />
              <TextField id={ids.h} label="Wall height" value={wallH} onChange={setWallH} suffix={unitSuffix} invalid={!ok(wallH)} help={project === 'accent' ? 'Floor to ceiling, or to the top of a half-wall.' : 'Height to cover with siding.'} />
            </div>
          </div>

          {project === 'accent' ? (
            <>
              <div className={styles.card}>
                {head('Battens & spacing')}
                <p className={styles.label}>Batten width (actual)</p>
                <div className={styles.pills} role="group" aria-label="Batten size">
                  {NOMINAL_BOARDS.slice(0, 5).map((nb) => pill(Math.abs(battenWidth - nb.actualWidthIn) < 0.01, `${nb.label} = ${formatFraction(nb.actualWidthIn)}`, () => pickBatten(nb.actualWidthIn), nb.id))}
                </div>
                <div className={styles.fields} style={{ marginTop: 10 }}>
                  <TextField id={ids.b} label="Or measure your batten" value={battenStr} onChange={setBattenStr} suffix={unitSuffix} invalid={!ok(battenStr)} help="MDF and primed strips are sold at real widths — measure one." />
                </div>
                <div className={styles.kindGrid} style={{ gridTemplateColumns: '1fr 1fr', marginTop: 12 }} role="group" aria-label="Spacing method">
                  <button type="button" aria-pressed={mode === 'gap'} className={`${styles.kindBtn} ${mode === 'gap' ? styles.kindActive : ''}`} onClick={() => setMode('gap')}>
                    I want a gap of about…
                  </button>
                  <button type="button" aria-pressed={mode === 'count'} className={`${styles.kindBtn} ${mode === 'count' ? styles.kindActive : ''}`} onClick={() => setMode('count')}>
                    I want this many battens
                  </button>
                </div>
                <div className={styles.fields} style={{ marginTop: 10 }}>
                  {mode === 'gap' ? (
                    <TextField id={ids.gap} label="Target gap between battens" value={gapStr} onChange={setGapStr} suffix={unitSuffix} invalid={!ok(gapStr)} help="The calculator picks the count that gets closest, then makes every gap equal." />
                  ) : (
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor={ids.count}>
                        Number of battens
                      </label>
                      <div className={styles.inputWrap}>
                        <button type="button" className={styles.pill} aria-label="One fewer batten" onClick={() => setCountStr(`${Math.max(1, Math.floor(pnum(countStr)) - 1)}`)}>
                          −
                        </button>
                        <input id={ids.count} className={styles.input} type="number" min="1" step="1" value={countStr} onChange={(e) => setCountStr(e.target.value)} />
                        <button type="button" className={styles.pill} aria-label="One more batten" onClick={() => setCountStr(`${Math.floor(pnum(countStr)) + 1}`)}>
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <p className={styles.label} style={{ marginTop: 12 }}>
                  Where does the layout start?
                </p>
                <div className={styles.pills} role="group" aria-label="Edge option">
                  {pill(edge === 'both', 'Battens at both edges', () => setEdge('both'))}
                  {pill(edge === 'none', 'Gaps at both edges', () => setEdge('none'))}
                  {pill(edge === 'inset', 'Inset from the edges', () => setEdge('inset'))}
                </div>
                {edge === 'inset' && (
                  <div className={styles.fields} style={{ marginTop: 10 }}>
                    <TextField id={ids.inset} label="Margin at each end" value={insetStr} onChange={setInsetStr} suffix={unitSuffix} invalid={!ok(insetStr)} />
                  </div>
                )}
              </div>

              <div className={styles.card}>
                {head('Rails & grid')}
                <div className={styles.fields}>
                  <TextField id={ids.top} label="Top rail height (0 = none)" value={topStr} onChange={setTopStr} suffix={unitSuffix} invalid={!ok(topStr)} />
                  <TextField id={ids.base} label="Baseboard height (0 = none)" value={baseStr} onChange={setBaseStr} suffix={unitSuffix} invalid={!ok(baseStr)} />
                </div>
                <label className={styles.help} htmlFor={ids.bx} style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', marginTop: 8 }}>
                  <input id={ids.bx} type="checkbox" checked={baseExisting} onChange={(e) => setBaseExisting(e.target.checked)} />
                  Keep the existing baseboard (don’t add it to the shopping list)
                </label>
                <p className={styles.label} style={{ marginTop: 12 }}>
                  Horizontal rails between battens (grid)
                </p>
                <div className={styles.pills} role="group" aria-label="Grid rails">
                  {[0, 1, 2, 3, 4].map((r) => pill(rows === r, r === 0 ? 'None' : `${r} row${r > 1 ? 's' : ''}`, () => setRows(r), r))}
                </div>
                {rows > 0 && (
                  <div className={styles.fields} style={{ marginTop: 10 }}>
                    <TextField id={ids.rail} label="Grid rail width" value={railStr} onChange={setRailStr} suffix={unitSuffix} invalid={!ok(railStr)} />
                  </div>
                )}
              </div>

              <details className={styles.card}>
                <summary className={styles.summary}>Outlets, switches &amp; windows ({obstacles.length})</summary>
                <p className={styles.help}>Mark them to see if a batten lands on top. Distances are from the left wall edge and from the floor.</p>
                {obstacles.map((o) => (
                  <div key={o.id} className={styles.fields} style={{ marginTop: 8, alignItems: 'end' }}>
                    <TextField id={`${o.id}-l`} label={`${o.label}: from left`} value={o.left} onChange={(x) => updateObstacle(o.id, { left: x })} suffix={unitSuffix} />
                    <TextField id={`${o.id}-w`} label="Width" value={o.width} onChange={(x) => updateObstacle(o.id, { width: x })} suffix={unitSuffix} />
                    <TextField id={`${o.id}-b`} label="From floor" value={o.bottom} onChange={(x) => updateObstacle(o.id, { bottom: x })} suffix={unitSuffix} />
                    <TextField id={`${o.id}-h`} label="Height" value={o.height} onChange={(x) => updateObstacle(o.id, { height: x })} suffix={unitSuffix} />
                    <button type="button" className={styles.removeBtn} onClick={() => removeObstacle(o.id)} aria-label={`Remove ${o.label}`}>
                      Remove
                    </button>
                  </div>
                ))}
                <div className={styles.pills} style={{ marginTop: 10 }}>
                  {OBSTACLE_PRESETS.map((p) => pill(false, `+ ${p.label}`, () => addObstacle(p), p.label))}
                </div>
              </details>
            </>
          ) : (
            <div className={styles.card}>
              {head('Boards, battens & furring')}
              <p className={styles.label}>Board width</p>
              <div className={styles.pills} role="group" aria-label="Siding board size">
                {NOMINAL_BOARDS.slice(4).map((nb) => pill(sBoard === nb.actualWidthIn, `${nb.label} = ${out(nb.actualWidthIn)}`, () => setSBoard(nb.actualWidthIn), nb.id))}
              </div>
              <p className={styles.label} style={{ marginTop: 10 }}>
                Batten width
              </p>
              <div className={styles.pills} role="group" aria-label="Siding batten size">
                {NOMINAL_BOARDS.slice(0, 3).map((nb) => pill(sBatten === nb.actualWidthIn, `${nb.label} = ${out(nb.actualWidthIn)}`, () => setSBatten(nb.actualWidthIn), nb.id))}
              </div>
              <div className={styles.fields} style={{ marginTop: 10 }}>
                <TextField id={ids.sgap} label="Gap between boards" value={sGapStr} onChange={setSGapStr} suffix={unitSuffix} invalid={!ok(sGapStr)} help="Battens must be wider than the gap." />
                <TextField id={ids.win} label="Windows (36 × 48 in)" value={windowsStr} onChange={setWindowsStr} />
                <TextField id={ids.door} label="Doors (36 × 80 in)" value={doorsStr} onChange={setDoorsStr} />
              </div>
              <label className={styles.help} htmlFor={ids.se} style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', marginTop: 8 }}>
                <input id={ids.se} type="checkbox" checked={sEnds} onChange={(e) => setSEnds(e.target.checked)} />
                Add trim battens at both wall corners
              </label>
              <p className={styles.label} style={{ marginTop: 10 }}>
                Horizontal furring (for vertical boards)
              </p>
              <div className={styles.pills} role="group" aria-label="Furring spacing">
                {[0, 16, 24].map((f) => pill(furring === f, f === 0 ? 'None' : `Every ${metric ? `${Math.round(f * MM_PER_IN)} mm` : `${f} in`}`, () => setFurring(f), f))}
              </div>
            </div>
          )}

          <div className={styles.card}>
            {head('Lumber & supplies')}
            <p className={styles.label}>Board length you buy</p>
            <div className={styles.pills} role="group" aria-label="Stock board length">
              {stockOptions.map((s) => pill(Math.abs(stockIn - s) < 0.5, metric ? `${fmt((s * MM_PER_IN) / 1000, 1)} m` : `${s / 12} ft`, () => setStockIn(s), s))}
            </div>
            <div className={styles.fields} style={{ marginTop: 10 }}>
              <TextField id={ids.waste} label="Waste" value={wasteStr} onChange={setWasteStr} suffix="%" />
              {project === 'accent' && (
                <>
                  <TextField id={ids.coats} label="Paint coats" value={coatsStr} onChange={setCoatsStr} />
                  <TextField id={ids.cov} label="Paint coverage per gallon" value={coverageStr} onChange={setCoverageStr} suffix="sq ft" help="See your can; 350–400 is common." />
                  <TextField id={ids.adh} label="Adhesive: feet per tube" value={adhesiveStr} onChange={setAdhesiveStr} suffix="ft" help="About 30 ft for a ¼ in bead from a 10 oz tube." />
                  <TextField id={ids.caulk} label="Caulk: feet per tube" value={caulkStr} onChange={setCaulkStr} suffix="ft" help="About 120 ft for a ⅛ in bead from a 10 oz tube." />
                  <TextField id={ids.nail} label="Nail every" value={nailSpaceStr} onChange={setNailSpaceStr} suffix={unitSuffix} help="2 brad nails per point; hit studs where you can." />
                </>
              )}
            </div>
          </div>

          {project === 'accent' && (
            <details className={styles.card}>
              <summary className={styles.summary}>Prices (optional)</summary>
              <div className={styles.fields}>
                {(
                  [
                    ['board', 'Per board'],
                    ['adhesive', 'Per adhesive tube'],
                    ['caulk', 'Per caulk tube'],
                    ['paint', 'Per gallon of paint'],
                  ] as [keyof typeof prices, string][]
                ).map(([k, label]) => (
                  <TextField key={k} id={`price-${k}`} label={label} value={prices[k]} onChange={(x) => setPrices((p) => ({ ...p, [k]: x }))} suffix="$" />
                ))}
              </div>
            </details>
          )}

          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              {project === 'accent' ? (
                <>
                  <strong>{a.count}</strong> battens · gap {out(a.gap)}
                </>
              ) : (
                <>
                  <strong>{sd.boards}</strong> boards · {sd.battens} battens
                </>
              )}
            </span>
            <a href="#batten-results" className={styles.mobileBarLink} tabIndex={-1}>
              Results ↓
            </a>
          </div>
        </div>

        <div className={styles.results} id="batten-results" aria-live="polite">
          {project === 'accent' ? (
            <>
              <div className={styles.hero}>
                <div className={styles.heroLabel}>Equal batten spacing</div>
                <div className={styles.heroValue}>{a.count > 0 ? out(a.gap) : '—'}</div>
                <div className={styles.heroSub}>
                  {a.count > 0 ? (
                    <>
                      gap between {a.count} battens · {out(a.onCenter)} on center
                      {!metric && ` · exact ${fmt(a.gap, 3)} in`}
                    </>
                  ) : (
                    'These sizes don’t fit — use fewer or narrower battens.'
                  )}
                </div>
              </div>

              <figure className={styles.panel} style={{ margin: 0 }}>
                <WallLayoutDiagram
                  wallWidth={wallWidth}
                  wallHeight={wallHeight}
                  battenWidth={battenWidth}
                  positions={a.positions}
                  topRail={accentIn.topRail}
                  baseboard={accentIn.baseboard}
                  railRows={rows}
                  railWidth={accentIn.railWidth}
                  obstacles={layoutObstacles}
                  clashIndexes={clashIdx}
                  gapLabel={a.count > 1 ? out(a.gap) : undefined}
                  widthLabel={out(wallWidth)}
                />
              </figure>

              {a.clashes.length > 0 && (
                <p className={styles.notice} role="status">
                  {a.clashes.map((c) => `Batten ${c.battenIndex + 1} covers the ${c.obstacle.toLowerCase()}`).join(' · ')} — try one more or one fewer batten.
                </p>
              )}

              <div className={styles.panel}>
                <h3 className={styles.panelTitle}>Compare batten counts</h3>
                <div className={styles.tableScroll}>
                  <table className={styles.sizeTable}>
                    <thead>
                      <tr>
                        <th scope="col">Battens</th>
                        <th scope="col">Gap</th>
                        <th scope="col">On center</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.options.map((o) => (
                        <tr key={o.count}>
                          <td>
                            <strong>{o.count}</strong>
                          </td>
                          <td>{out(o.gap)}</td>
                          <td>{out(o.gap + battenWidth)}</td>
                          <td>
                            {o.count === a.count ? (
                              <span>selected</span>
                            ) : (
                              <button type="button" className={styles.pill} onClick={() => { setMode('count'); setCountStr(`${o.count}`); }}>
                                Use
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {a.positions.length > 0 && (
                <div className={styles.panel}>
                  <h3 className={styles.panelTitle}>Marks from the left wall edge</h3>
                  <ol style={{ margin: 0, paddingLeft: 22, columns: 2 }}>
                    {a.positions.map((p, i) => (
                      <li key={i}>
                        {out(p)} <span className={styles.note} style={{ display: 'inline' }}>(center {out(p + battenWidth / 2)})</span>
                      </li>
                    ))}
                  </ol>
                  <p className={styles.note}>Each mark is the left edge of a batten. Tip: cut a spacer block to the gap ({out(a.gap)}) and use it between battens.</p>
                </div>
              )}

              <div className={styles.panel}>
                <h3 className={styles.panelTitle}>Shopping list</h3>
                <div className={styles.tableScroll}>
                  <table className={styles.sizeTable}>
                    <tbody>
                      {a.pieces.map((p) => (
                        <tr key={p.label}>
                          <td>{p.label}</td>
                          <td>
                            <strong>{p.qty}</strong> × {out(p.length)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <strong>Boards to buy</strong>
                        </td>
                        <td>
                          <strong>{a.boards}</strong> × {outFt(stockIn)} ({fmt(a.linearFeet, 1)} linear ft incl. waste)
                        </td>
                      </tr>
                      <tr>
                        <td>Brad nails</td>
                        <td>{fmt(a.nails)}</td>
                      </tr>
                      <tr>
                        <td>Construction adhesive</td>
                        <td>{a.adhesiveTubes} tubes</td>
                      </tr>
                      <tr>
                        <td>Caulk (both edges)</td>
                        <td>{a.caulkTubes} tubes</td>
                      </tr>
                      <tr>
                        <td>Paint ({fmt(pnum(coatsStr) || 1)} coats)</td>
                        <td>
                          {fmt(a.paintGallons, 1)} gal for {fmt(a.paintSqFt)} sq ft
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {cost > 0 && (
                  <div className={`${styles.row} ${styles.rowTotal}`}>
                    <span>Materials cost</span>
                    <strong>${fmt(cost, 2, 2)}</strong>
                  </div>
                )}
                <p className={styles.note}>Battens run between the top rail and the baseboard. Paint area includes the board edges.</p>
              </div>
            </>
          ) : (
            <>
              <div className={styles.hero}>
                <div className={styles.heroLabel}>Board and batten siding</div>
                <div className={styles.heroValue}>
                  {sd.boards} <span className={styles.heroUnit}>boards</span>
                </div>
                <div className={styles.heroSub}>
                  {sd.battens} battens · {fmt(sd.netAreaSqFt)} sq ft after openings
                </div>
              </div>
              <div className={styles.panel}>
                <h3 className={styles.panelTitle}>Materials</h3>
                <div className={styles.row}>
                  <span>Boards ({out(sBoard)} wide)</span>
                  <strong>
                    {sd.boardPieces} × {outFt(stockIn)} · {fmt(sd.boardLinearFt)} lin ft
                  </strong>
                </div>
                <div className={styles.row}>
                  <span>Battens ({out(sBatten)} wide)</span>
                  <strong>
                    {sd.battenPieces} × {outFt(stockIn)} · {fmt(sd.battenLinearFt)} lin ft
                  </strong>
                </div>
                {sd.furringRows > 0 && (
                  <div className={styles.row}>
                    <span>Furring ({sd.furringRows} rows)</span>
                    <strong>{fmt(sd.furringLinearFt)} lin ft</strong>
                  </div>
                )}
                {sBatten <= Lz(sGapStr) && <p className={styles.notice}>The batten is not wider than the gap — it won’t cover it.</p>}
                <p className={styles.note}>
                  Includes {fmt(pnum(wasteStr))}% waste. If the wall is taller than one board, boards are joined — plan the joints over a furring strip.
                </p>
              </div>
            </>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.actionBtn} onClick={() => copyText(summary(), 'Results copied.')}>
              Copy results
            </button>
            <button type="button" className={styles.actionBtn} onClick={share}>
              Copy share link
            </button>
            <button type="button" className={styles.actionBtn} onClick={() => window.print()}>
              Print layout
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
