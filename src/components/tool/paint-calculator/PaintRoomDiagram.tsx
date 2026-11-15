import React from 'react';
import s from '../shared/AreaDepthDiagram.module.css';
import { StepFrame, type CalcStep } from '../shared/AreaDepthDiagram';

interface Props {
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  doors: number;
  windows: number;
  ceiling: boolean;
  /** direct-area mode: no room sizes, just the totals */
  direct?: { wallSqFt: number; ceilingSqFt: number };
  steps: CalcStep[];
}

/**
 * The room plan (with the perimeter traced around it) and the four walls unrolled into one strip:
 * perimeter × height, with the doors and windows cut out — exactly what gets painted.
 */
export default function PaintRoomDiagram({ lengthFt, widthFt, heightFt, doors, windows, ceiling, direct, steps }: Props) {
  const L = lengthFt > 0 ? lengthFt : 12;
  const W = widthFt > 0 ? widthFt : 10;
  const H = heightFt > 0 ? heightFt : 8;
  const P = 2 * (L + W);
  // plan
  const pk = Math.min(110 / L, 62 / W);
  const pw = L * pk;
  const ph = W * pk;
  const px = 24;
  const py = 34;
  // strip (unrolled walls)
  const sk = Math.min(255 / P, 70 / H);
  const sw = P * sk;
  const sh = H * sk;
  const sx = 24;
  const sy = 150;
  const wallEdges = [L, W, L, W].reduce<number[]>((a, v) => [...a, (a[a.length - 1] ?? 0) + v], []);
  const doorW = 3 * sk;
  const doorH = Math.min(7 * sk, sh - 2);
  const winW = 3 * sk;
  const winH = Math.min(5 * sk, sh * 0.55);
  const openings: React.ReactNode[] = [];
  let ox = sx + 6;
  for (let i = 0; i < Math.min(doors, 4); i++) {
    openings.push(<rect key={`d${i}`} x={ox} y={sy + sh - doorH} width={doorW} height={doorH} fill="var(--surface)" stroke="var(--ink-2)" strokeWidth={1.2} />);
    ox += doorW + 10;
  }
  for (let i = 0; i < Math.min(windows, 6); i++) {
    openings.push(
      <g key={`w${i}`}>
        <rect x={ox} y={sy + sh * 0.18} width={winW} height={winH} fill="var(--surface)" stroke="var(--ink-2)" strokeWidth={1.2} />
        <path d={`M${ox + winW / 2} ${sy + sh * 0.18} v${winH}`} stroke="var(--line-strong)" />
      </g>,
    );
    ox += winW + 10;
  }
  const art = () => (
    <g>
      {direct ? (
        <text className={s.label} x={24} y={60}>
          Total wall area entered: {direct.wallSqFt} ft²{ceiling ? ` · ceiling ${direct.ceilingSqFt} ft²` : ''}
        </text>
      ) : (
        <g>
          {/* plan with perimeter arrows */}
          <rect x={px} y={py} width={pw} height={ph} fill={ceiling ? '#DBEAFE' : 'var(--surface-2)'} stroke="var(--ink-2)" strokeWidth={2} />
          {ceiling && (
            <text className={s.small} x={px + pw / 2} y={py + ph / 2 + 4} textAnchor="middle">
              ceiling
            </text>
          )}
          <rect x={px - 6} y={py - 6} width={pw + 12} height={ph + 12} fill="none" stroke="var(--brand-orange)" strokeWidth={1.4} strokeDasharray="5 4" />
          <text className={s.small} x={px + pw / 2} y={py - 12} textAnchor="middle">
            {L} ft
          </text>
          <text className={s.small} x={px + pw + 12} y={py + ph / 2 + 4}>
            {W} ft
          </text>
          <text className={s.labelAccent} x={px + pw + 50} y={py + 14}>
            perimeter = 2 × ({L} + {W})
          </text>
          <text className={s.labelAccent} x={px + pw + 50} y={py + 30}>
            = {P} ft
          </text>
          <text className={s.small} x={px + pw + 50} y={py + 52}>
            unroll the 4 walls ↓
          </text>
        </g>
      )}
      {/* unrolled walls */}
      <rect x={sx} y={sy} width={sw} height={sh} fill="#93C5FD" stroke="#1D4ED8" strokeWidth={1.4} />
      {!direct &&
        wallEdges.slice(0, 3).map((e, i) => <line key={i} x1={sx + e * sk} y1={sy} x2={sx + e * sk} y2={sy + sh} stroke="#1D4ED8" strokeDasharray="3 3" />)}
      {openings}
      <line className={s.dim} x1={sx} y1={sy + sh + 12} x2={sx + sw} y2={sy + sh + 12} />
      <text className={s.label} x={sx + sw / 2} y={sy + sh + 28} textAnchor="middle">
        {direct ? 'all walls' : `${P} ft (all 4 walls)`}
      </text>
      {!direct && (
        <>
          <line className={s.dim} x1={sx + sw + 10} y1={sy} x2={sx + sw + 10} y2={sy + sh} />
          <text className={s.label} x={sx + sw + 14} y={sy + sh / 2 + 4}>
            {H} ft
          </text>
        </>
      )}
      <text className={s.small} x={sx} y={sy - 8}>
        white = not painted: {doors} door{doors === 1 ? '' : 's'} (21 ft²) · {windows} window{windows === 1 ? '' : 's'} (15 ft²)
      </text>
    </g>
  );
  return <StepFrame art={art} steps={steps} artTop={10} />;
}
