import React from 'react';
import type { SurfaceKind } from '@/lib/drywall-engine';
import styles from './DrywallDiagram.module.css';

/**
 * Labelled, not-to-scale SVG diagrams for the drywall calculator.
 * Pure components (no hooks) — they render on the server for the article and on
 * the client inside the calculator with live values. Colours come from CSS custom
 * properties so they follow the site's light/dark theme.
 */

type Pt = [number, number];
const pts = (p: Pt[]) => p.map(([x, y]) => `${x},${y}`).join(' ');
const v = (name: string) => `var(--dg-${name})`;
const FONT = 'system-ui, -apple-system, Segoe UI, sans-serif';

function Dim({ x1, y1, x2, y2, label, tx, ty }: { x1: number; y1: number; x2: number; y2: number; label: string; tx: number; ty: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / len) * 5;
  const ny = ((x2 - x1) / len) * 5;
  const w = Math.max(24, label.length * 6.6 + 12);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: v('dim') }} strokeWidth={1.4} />
      <line x1={x1 - nx} y1={y1 - ny} x2={x1 + nx} y2={y1 + ny} style={{ stroke: v('dim') }} strokeWidth={1.4} />
      <line x1={x2 - nx} y1={y2 - ny} x2={x2 + nx} y2={y2 + ny} style={{ stroke: v('dim') }} strokeWidth={1.4} />
      <rect x={tx - w / 2} y={ty - 10} width={w} height={19} rx={4} style={{ fill: v('label-bg'), stroke: v('dim') }} strokeWidth={1} />
      <text x={tx} y={ty + 4} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily={FONT} style={{ fill: v('dim') }}>
        {label}
      </text>
    </g>
  );
}

function Note({ x, y, children, anchor = 'start', size = 10.5 }: { x: number; y: number; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontFamily={FONT} style={{ fill: v('text') }}>
      {children}
    </text>
  );
}

const lab = (labels: Record<string, string> | undefined, sym: string) =>
  labels && labels[sym] ? `${sym} = ${labels[sym]}` : sym;

function Svg({ label, children, viewBox = '0 0 340 210', className }: { label: string; children: React.ReactNode; viewBox?: string; className?: string }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={`${styles.svg} ${className || ''}`}>
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Surface diagrams (one per surface kind)
// ---------------------------------------------------------------------------

interface SurfaceDiagramProps {
  kind: SurfaceKind;
  /** symbol → formatted value, e.g. { L: '12 ft', H: '8 ft' } */
  labels?: Record<string, string>;
  showWalls?: boolean;
  showCeiling?: boolean;
  doors?: number;
  windows?: number;
  ceilingArea?: boolean;
  className?: string;
}

export function SurfaceDiagram({
  kind,
  labels,
  showWalls = true,
  showCeiling = true,
  doors = 0,
  windows = 0,
  ceilingArea = false,
  className,
}: SurfaceDiagramProps) {
  const L = (s: string) => lab(labels, s);

  if (kind === 'room') {
    // Cut-away room: floor, left wall and back wall; ceiling drawn as a translucent lid.
    const A: Pt = [70, 172];
    const B: Pt = [236, 172];
    const C: Pt = [296, 132];
    const D: Pt = [130, 132];
    const up = 88;
    const lift = (p: Pt): Pt => [p[0], p[1] - up];
    const wallStyle = showWalls
      ? { fill: v('wall'), stroke: v('edge') }
      : { fill: 'none', stroke: v('faint'), strokeDasharray: '4 4' };
    const wallStyle2 = showWalls
      ? { fill: v('wall-2'), stroke: v('edge') }
      : { fill: 'none', stroke: v('faint'), strokeDasharray: '4 4' };
    return (
      <Svg label="Room: length L, width W and wall height H. Walls and ceiling are covered with drywall." className={className}>
        <polygon points={pts([A, B, C, D])} style={{ fill: v('floor'), stroke: v('edge') }} strokeWidth={1.3} />
        <polygon points={pts([A, D, lift(D), lift(A)])} style={wallStyle2} strokeWidth={1.3} />
        <polygon points={pts([D, C, lift(C), lift(D)])} style={wallStyle} strokeWidth={1.3} />
        {showWalls && doors > 0 && (
          <g>
            <rect x={170} y={90} width={30} height={42} style={{ fill: v('open'), stroke: v('edge'), strokeDasharray: '3 3' }} strokeWidth={1.2} />
            <Note x={185} y={115} anchor="middle" size={9.5}>
              {doors > 1 ? `${doors} doors` : 'door'}
            </Note>
          </g>
        )}
        {showWalls && windows > 0 && (
          <g>
            <rect x={222} y={92} width={50} height={24} style={{ fill: v('open'), stroke: v('edge'), strokeDasharray: '3 3' }} strokeWidth={1.2} />
            <Note x={247} y={108} anchor="middle" size={9.5}>
              {windows > 1 ? `${windows} windows` : 'window'}
            </Note>
          </g>
        )}
        {showCeiling && (
          <g>
            <polygon
              points={pts([lift(A), lift(B), lift(C), lift(D)])}
              style={{ fill: v('ceiling'), stroke: v('hi-edge'), strokeDasharray: '5 3' }}
              strokeWidth={1.3}
              opacity={0.85}
            />
            <Note x={182} y={70} anchor="middle" size={10}>
              ceiling
            </Note>
          </g>
        )}
        <Dim x1={A[0]} y1={186} x2={B[0]} y2={186} label={L('L')} tx={153} ty={198} />
        <Dim x1={246} y1={178} x2={306} y2={138} label={L('W')} tx={296} ty={164} />
        <Dim x1={54} y1={lift(A)[1]} x2={54} y2={A[1]} label={L('H')} tx={44} ty={128} />
      </Svg>
    );
  }

  if (kind === 'wall') {
    const x0 = 64;
    const x1 = 300;
    const y0 = 28;
    const y1 = 160;
    const studs: number[] = [];
    for (let x = x0; x <= x1 + 0.1; x += 23.6) studs.push(x);
    return (
      <Svg label="Single wall: length L and height H, with doors and windows subtracted" className={className}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} style={{ fill: v('wall'), stroke: v('edge') }} strokeWidth={1.4} />
        {studs.map((x) => (
          <line key={x} x1={x} y1={y0} x2={x} y2={y1} style={{ stroke: v('stud-edge') }} strokeWidth={1} strokeDasharray="2 4" opacity={0.7} />
        ))}
        <line x1={x0} y1={(y0 + y1) / 2} x2={x1} y2={(y0 + y1) / 2} style={{ stroke: v('tape') }} strokeWidth={2} strokeDasharray="8 4" />
        <Note x={x1 - 4} y={(y0 + y1) / 2 - 5} anchor="end" size={9.5}>
          sheet seam (taped)
        </Note>
        {doors > 0 && (
          <g>
            <rect x={96} y={78} width={42} height={82} style={{ fill: v('open'), stroke: v('edge'), strokeDasharray: '3 3' }} strokeWidth={1.2} />
            <Note x={117} y={124} anchor="middle" size={9.5}>
              {doors > 1 ? `${doors} doors` : 'door'}
            </Note>
          </g>
        )}
        {windows > 0 && (
          <g>
            <rect x={196} y={52} width={66} height={44} style={{ fill: v('open'), stroke: v('edge'), strokeDasharray: '3 3' }} strokeWidth={1.2} />
            <Note x={229} y={78} anchor="middle" size={9.5}>
              {windows > 1 ? `${windows} windows` : 'window'}
            </Note>
          </g>
        )}
        <Dim x1={x0} y1={176} x2={x1} y2={176} label={L('L')} tx={(x0 + x1) / 2} ty={192} />
        <Dim x1={46} y1={y0} x2={46} y2={y1} label={L('H')} tx={46} ty={94} />
      </Svg>
    );
  }

  if (kind === 'ceiling') {
    const x0 = 70;
    const x1 = 300;
    const y0 = 26;
    const y1 = 156;
    const joists: number[] = [];
    for (let x = x0 + 23; x < x1; x += 23) joists.push(x);
    const seams = [y0 + (y1 - y0) / 3, y0 + (2 * (y1 - y0)) / 3];
    return (
      <Svg label="Ceiling seen from below: length L and width W; sheets run across the joists" className={className}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} style={{ fill: v('ceiling'), stroke: v('hi-edge') }} strokeWidth={1.4} />
        {joists.map((x) => (
          <line key={x} x1={x} y1={y0} x2={x} y2={y1} style={{ stroke: v('stud-edge') }} strokeWidth={1} strokeDasharray="2 4" opacity={0.8} />
        ))}
        {seams.map((y) => (
          <line key={y} x1={x0} y1={y} x2={x1} y2={y} style={{ stroke: v('tape') }} strokeWidth={2} strokeDasharray="8 4" />
        ))}
        <Note x={(x0 + x1) / 2} y={y0 + 24} anchor="middle" size={10}>
          sheets run across the joists (dotted)
        </Note>
        <Dim x1={x0} y1={172} x2={x1} y2={172} label={L('L')} tx={(x0 + x1) / 2} ty={190} />
        <Dim x1={52} y1={y0} x2={52} y2={y1} label={L('W')} tx={46} ty={92} />
      </Svg>
    );
  }

  if (kind === 'gable') {
    const left: Pt = [60, 118];
    const right: Pt = [290, 118];
    const peak: Pt = [175, 34];
    return (
      <Svg label="Gable end: triangle with base B and rise R above the top of the wall" className={className}>
        <rect x={left[0]} y={118} width={right[0] - left[0]} height={56} style={{ fill: 'none', stroke: v('faint'), strokeDasharray: '4 4' }} strokeWidth={1.2} />
        <Note x={175} y={150} anchor="middle" size={9.5}>
          wall below — add it as a Single wall
        </Note>
        <polygon points={pts([left, peak, right])} style={{ fill: v('hi'), stroke: v('hi-edge') }} strokeWidth={1.5} />
        <line x1={peak[0]} y1={peak[1]} x2={peak[0]} y2={118} style={{ stroke: v('dim') }} strokeWidth={1} strokeDasharray="3 3" />
        <Dim x1={183} y1={peak[1]} x2={183} y2={118} label={L('R')} tx={226} ty={86} />
        <Dim x1={left[0]} y1={188} x2={right[0]} y2={188} label={L('B')} tx={175} ty={198} />
        <line x1={left[0]} y1={118} x2={left[0]} y2={192} style={{ stroke: v('dim') }} strokeWidth={0.8} strokeDasharray="2 3" />
        <line x1={right[0]} y1={118} x2={right[0]} y2={192} style={{ stroke: v('dim') }} strokeWidth={0.8} strokeDasharray="2 3" />
      </Svg>
    );
  }

  // known area
  const x0 = 80;
  const x1 = 260;
  const y0 = 34;
  const y1 = 160;
  return (
    <Svg label="Known area entered directly" className={className}>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} style={{ fill: ceilingArea ? v('ceiling') : v('wall'), stroke: ceilingArea ? v('hi-edge') : v('edge') }} strokeWidth={1.4} />
      {[1, 2, 3].map((i) => (
        <line key={i} x1={x0 + ((x1 - x0) * i) / 4} y1={y0} x2={x0 + ((x1 - x0) * i) / 4} y2={y1} style={{ stroke: v('faint') }} strokeWidth={0.8} strokeDasharray="3 4" />
      ))}
      <rect x={110} y={82} width={120} height={30} rx={6} style={{ fill: v('label-bg'), stroke: v('dim') }} strokeWidth={1.2} />
      <text x={170} y={102} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily={FONT} style={{ fill: v('dim') }}>
        {L('A')}
      </text>
      <Note x={170} y={184} anchor="middle">
        {ceilingArea ? 'ceiling area' : 'wall area'} — from plans or another calculator
      </Note>
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Sheet hung across framing, with screw pattern
// ---------------------------------------------------------------------------

export function SheetLayoutDiagram({
  framingLabel = '16 in o.c.',
  screwLabel = '16 in',
  sheetLengthLabel = '8 ft',
  sheetWidthLabel = '4 ft',
  wide = false,
  ceiling = false,
  className,
}: {
  framingLabel?: string;
  screwLabel?: string;
  sheetLengthLabel?: string;
  sheetWidthLabel?: string;
  /** 24 in / 600 mm framing */
  wide?: boolean;
  /** ceiling spacing (12 in) instead of wall spacing */
  ceiling?: boolean;
  className?: string;
}) {
  // 30 px per foot: an 8 ft sheet is 240 px long and 120 px tall.
  const x0 = 60;
  const y0 = 46;
  const sheetW = 240;
  const sheetH = 120;
  const bay = wide ? 60 : 40; // 24 in or 16 in
  const studs: number[] = [];
  for (let x = x0; x <= x0 + sheetW + 0.1; x += bay) studs.push(x);
  const screwGap = ceiling || wide ? 30 : 40; // 12 in or 16 in
  const rows: number[] = [];
  for (let y = 0; y <= sheetH + 0.1; y += screwGap) rows.push(y);
  const inset = 4;
  return (
    <Svg
      label={`One drywall sheet hung across framing at ${framingLabel}, screws every ${screwLabel} along each stud`}
      className={className}
    >
      {studs.map((x) => (
        <rect key={x} x={x - 4} y={22} width={8} height={168} style={{ fill: v('stud'), stroke: v('stud-edge') }} strokeWidth={1} />
      ))}
      <rect x={x0} y={y0} width={sheetW} height={sheetH} style={{ fill: v('wall'), stroke: v('edge') }} strokeWidth={1.5} opacity={0.92} />
      {studs.map((x) =>
        rows.map((ry) => {
          const y = y0 + Math.min(sheetH - inset, Math.max(inset, ry));
          return <circle key={`${x}-${ry}`} cx={x} cy={y} r={2.6} style={{ fill: v('screw') }} />;
        }),
      )}
      <Dim x1={x0} y1={14} x2={x0 + bay} y2={14} label={framingLabel} tx={x0 + bay + 44} ty={14} />
      <Dim x1={x0 + sheetW + 14} y1={y0} x2={x0 + sheetW + 14} y2={y0 + screwGap} label={screwLabel} tx={x0 + sheetW + 14} ty={y0 + screwGap + 22} />
      <Dim x1={x0} y1={y0 + sheetH + 18} x2={x0 + sheetW} y2={y0 + sheetH + 18} label={sheetLengthLabel} tx={x0 + sheetW / 2} ty={y0 + sheetH + 32} />
      <Dim x1={42} y1={y0} x2={42} y2={y0 + sheetH} label={sheetWidthLabel} tx={30} ty={y0 + sheetH / 2} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Taped joint cross-section — why compound needs three coats
// ---------------------------------------------------------------------------

export function JointFinishDiagram({ className }: { className?: string }) {
  // Vertical scale is exaggerated so the three coats are visible.
  const cx = 170;
  const top = 132;
  const t = 18;
  const dip = 8;
  const leftBoard: Pt[] = [[14, top], [cx - 50, top], [cx - 1, top + dip], [cx - 1, top + t], [14, top + t]];
  const rightBoard: Pt[] = [[cx + 1, top + dip], [cx + 50, top], [326, top], [326, top + t], [cx + 1, top + t]];
  const coat = (half: number, peak: number) => `M ${cx - half} ${top} Q ${cx} ${peak} ${cx + half} ${top} Z`;
  const marker = (n: number, x: number, yTo: number) => (
    <g key={n}>
      <line x1={x} y1={96} x2={x} y2={yTo} style={{ stroke: v('dim') }} strokeWidth={1} />
      <circle cx={x} cy={90} r={8} style={{ fill: v('label-bg'), stroke: v('dim') }} strokeWidth={1.3} />
      <text x={x} y={94} textAnchor="middle" fontSize={10.5} fontWeight={700} fontFamily={FONT} style={{ fill: v('dim') }}>
        {n}
      </text>
    </g>
  );
  return (
    <Svg label="Cross-section of a taped drywall joint: tape bedded in the first coat, then a wider fill coat and a wider finish coat" viewBox="0 0 340 200" className={className}>
      {/* legend */}
      {[
        '1  Paper tape bedded in the first coat',
        '2  Fill coat, a few inches wider',
        '3  Finish coat, feathered wider again',
      ].map((txt, i) => (
        <Note key={txt} x={18} y={20 + i * 17} size={10.5}>
          {txt}
        </Note>
      ))}
      <rect x={cx - 22} y={top + t} width={44} height={36} style={{ fill: v('stud'), stroke: v('stud-edge') }} strokeWidth={1} />
      <Note x={cx} y={top + t + 22} anchor="middle" size={9.5}>
        stud
      </Note>
      <polygon points={pts(leftBoard)} style={{ fill: v('wall-2'), stroke: v('edge') }} strokeWidth={1.3} />
      <polygon points={pts(rightBoard)} style={{ fill: v('wall-2'), stroke: v('edge') }} strokeWidth={1.3} />
      <path d={coat(140, 112)} style={{ fill: v('coat3'), stroke: v('faint') }} strokeWidth={1} />
      <path d={coat(92, 116)} style={{ fill: v('coat2'), stroke: v('faint') }} strokeWidth={1} />
      <path d={coat(50, 122)} style={{ fill: v('coat1'), stroke: v('faint') }} strokeWidth={1} />
      <polygon points={pts([[cx - 50, top], [cx, top + dip], [cx + 50, top]])} style={{ fill: v('coat1') }} />
      <line x1={cx - 28} y1={top + 3} x2={cx + 28} y2={top + 3} style={{ stroke: v('tape') }} strokeWidth={3.5} strokeLinecap="round" />
      {marker(1, cx, top + 1)}
      {marker(2, cx - 70, top - 6)}
      {marker(3, cx - 118, top - 2)}
      <Note x={18} y={top + t + 16} size={9.5}>
        tapered sheet edges
      </Note>
      <Note x={322} y={top + t + 16} anchor="end" size={9.5}>
        not to scale
      </Note>
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Common sheet sizes drawn to the same scale
// ---------------------------------------------------------------------------

export function SheetSizesDiagram({ className }: { className?: string }) {
  const sizes = [8, 10, 12, 16];
  const scale = 9.5; // px per foot
  const base = 172;
  return (
    <Svg label="Common drywall sheet sizes to the same scale: 4×8, 4×10, 4×12 and 4×16 feet" viewBox="0 0 340 200" className={className}>
      <line x1={14} y1={base} x2={326} y2={base} style={{ stroke: v('faint') }} strokeWidth={1} />
      {sizes.map((len, i) => {
        const x = 30 + i * 78;
        const h = len * scale;
        return (
          <g key={len}>
            <rect x={x} y={base - h} width={4 * scale} height={h} style={{ fill: v('wall-2'), stroke: v('edge') }} strokeWidth={1.3} />
            <text x={x + 2 * scale} y={base + 14} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily={FONT} style={{ fill: v('text') }}>
              4×{len} ft
            </text>
            <Note x={x + 2 * scale} y={base + 26} anchor="middle" size={10}>
              {4 * len} sq ft
            </Note>
          </g>
        );
      })}
    </Svg>
  );
}
