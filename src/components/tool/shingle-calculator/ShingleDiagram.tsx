import React from 'react';
import type { SectionShape } from '@/lib/shingle-engine';
import styles from './ShingleDiagram.module.css';

/**
 * SVG diagrams for the shingle roof calculator. Pure (no hooks): render on the server and in the client tool.
 * Colours follow the light/dark theme through CSS custom properties.
 */

const v = (name: string) => `var(--dg-${name})`;
const FONT = 'system-ui, -apple-system, Segoe UI, sans-serif';

function Svg({ label, children, viewBox }: { label: string; children: React.ReactNode; viewBox: string }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={styles.svg}>
      {children}
    </svg>
  );
}
function Txt({ x, y, children, anchor = 'start', size = 11, weight = 400, color = 'text' }: { x: number; y: number; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; color?: string }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fontFamily={FONT} style={{ fill: v(color) }}>
      {children}
    </text>
  );
}
function Tag({ x, y, label, color = 'dim' }: { x: number; y: number; label: string; color?: string }) {
  const w = Math.max(26, label.length * 6.3 + 12);
  return (
    <g>
      <rect x={x - w / 2} y={y - 10} width={w} height={19} rx={5} style={{ fill: v('label-bg'), stroke: v(color) }} strokeWidth={1.2} />
      <Txt x={x} y={y + 4} anchor="middle" size={10.5} weight={700} color={color}>
        {label}
      </Txt>
    </g>
  );
}
const Line = ({ x1, y1, x2, y2, color, w = 3.2, dash }: { x1: number; y1: number; x2: number; y2: number; color: string; w?: number; dash?: string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: v(color) }} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} />
);

/** Roof plan from above with eaves, rakes, ridge and hips coloured; labels can carry live lengths. */
export function RoofPlanDiagram({ shape, labels = {} }: { shape: SectionShape; labels?: Partial<Record<'eaves' | 'rakes' | 'ridge' | 'hips' | 'L' | 'W', string>> }) {
  const x0 = 50, x1 = 290, y0 = 34, y1 = 170, mid = (y0 + y1) / 2;
  const lab = (k: 'eaves' | 'rakes' | 'ridge' | 'hips', name: string) => (labels[k] ? `${name} ${labels[k]}` : name);
  const L = labels.L ? `L = ${labels.L}` : 'L';
  const W = labels.W ? `W = ${labels.W}` : 'W';

  if (shape === 'area') {
    return (
      <Svg label="Measured roof area: enter the sloped area of each roof face directly" viewBox="0 0 340 220">
        {[0, 1, 2].map((i) => (
          <polygon key={i} points={`${60 + i * 80},170 ${110 + i * 80},60 ${160 + i * 80},170`} style={{ fill: i === 1 ? v('roof-2') : v('roof'), stroke: v('edge') }} strokeWidth={1.4} />
        ))}
        <Tag x={170} y={196} label="Add the sloped area of each roof face" />
      </Svg>
    );
  }
  if (shape === 'shed') {
    return (
      <Svg label="Shed roof from above: one sloping plane with an eave on the low side and rakes at both ends" viewBox="0 0 340 220">
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} style={{ fill: v('roof'), stroke: v('edge') }} strokeWidth={1.4} />
        <Line x1={x0} y1={y1} x2={x1} y2={y1} color="eave" />
        <Line x1={x0} y1={y0} x2={x0} y2={y1} color="rake" />
        <Line x1={x1} y1={y0} x2={x1} y2={y1} color="rake" />
        <Txt x={170} y={mid} anchor="middle" size={11}>
          slopes down ↓
        </Txt>
        <Tag x={170} y={y1 + 20} label={lab('eaves', 'Eave')} color="eave" />
        <Tag x={x0 - 2} y={mid} label="Rake" color="rake" />
        <Tag x={170} y={y0 - 14} label={L} />
      </Svg>
    );
  }
  if (shape === 'gable') {
    return (
      <Svg label="Gable roof from above: two planes meeting at a ridge, eaves along both long sides and rakes up the gable ends" viewBox="0 0 340 220">
        <rect x={x0} y={y0} width={x1 - x0} height={mid - y0} style={{ fill: v('roof'), stroke: v('edge') }} strokeWidth={1.4} />
        <rect x={x0} y={mid} width={x1 - x0} height={y1 - mid} style={{ fill: v('roof-2'), stroke: v('edge') }} strokeWidth={1.4} />
        <Line x1={x0} y1={y0} x2={x1} y2={y0} color="eave" />
        <Line x1={x0} y1={y1} x2={x1} y2={y1} color="eave" />
        <Line x1={x0} y1={y0} x2={x0} y2={y1} color="rake" />
        <Line x1={x1} y1={y0} x2={x1} y2={y1} color="rake" />
        <Line x1={x0} y1={mid} x2={x1} y2={mid} color="ridge" w={4} />
        <Tag x={170} y={mid} label={lab('ridge', 'Ridge')} color="ridge" />
        <Tag x={170} y={y1 + 20} label={lab('eaves', 'Eaves (both sides)')} color="eave" />
        <Tag x={x1 - 40} y={y0 - 14} label={lab('rakes', 'Rakes (4)')} color="rake" />
        <Tag x={x0 + 30} y={y0 - 14} label={L} />
        <Tag x={28} y={mid + 30} label={W} />
      </Svg>
    );
  }
  // hip
  const inset = (y1 - y0) / 2;
  const r0 = x0 + inset, r1 = x1 - inset;
  return (
    <Svg label="Hip roof from above: four planes, eaves on every side, a short ridge on top and four hips running down to the corners" viewBox="0 0 340 220">
      <polygon points={`${x0},${y0} ${x1},${y0} ${r1},${mid} ${r0},${mid}`} style={{ fill: v('roof'), stroke: v('edge') }} strokeWidth={1.2} />
      <polygon points={`${x0},${y1} ${x1},${y1} ${r1},${mid} ${r0},${mid}`} style={{ fill: v('roof-2'), stroke: v('edge') }} strokeWidth={1.2} />
      <polygon points={`${x0},${y0} ${r0},${mid} ${x0},${y1}`} style={{ fill: v('roof-2'), stroke: v('edge') }} strokeWidth={1.2} />
      <polygon points={`${x1},${y0} ${r1},${mid} ${x1},${y1}`} style={{ fill: v('roof'), stroke: v('edge') }} strokeWidth={1.2} />
      <Line x1={x0} y1={y0} x2={x1} y2={y0} color="eave" />
      <Line x1={x0} y1={y1} x2={x1} y2={y1} color="eave" />
      <Line x1={x0} y1={y0} x2={x0} y2={y1} color="eave" />
      <Line x1={x1} y1={y0} x2={x1} y2={y1} color="eave" />
      <Line x1={r0} y1={mid} x2={r1} y2={mid} color="ridge" w={4} />
      {[
        [x0, y0, r0, mid],
        [x0, y1, r0, mid],
        [x1, y0, r1, mid],
        [x1, y1, r1, mid],
      ].map(([a, b, c, d], i) => (
        <Line key={i} x1={a} y1={b} x2={c} y2={d} color="hip" />
      ))}
      <Tag x={170} y={mid - 16} label={lab('ridge', 'Ridge')} color="ridge" />
      <Tag x={r1 + 6} y={mid + 34} label={lab('hips', 'Hips (4)')} color="hip" />
      <Tag x={170} y={y1 + 20} label={lab('eaves', 'Eaves (all round)')} color="eave" />
      <Tag x={x0 + 30} y={y0 - 14} label={L} />
      <Tag x={28} y={mid} label={W} />
    </Svg>
  );
}

/** Pitch triangle: rise over a 12 in run and the slope factor. */
export function PitchDiagram({ rise = 6, factorLabel }: { rise?: number; factorLabel?: string }) {
  const run = 220;
  const h = Math.min(150, (Math.max(rise, 0.5) / 12) * run);
  const x0 = 50, yb = 180;
  return (
    <Svg label={`Roof pitch ${rise} in 12: for every 12 inches across, the roof rises ${rise} inches. The sloped length is longer than the run by the slope factor.`} viewBox="0 0 340 220">
      <polygon points={`${x0},${yb} ${x0 + run},${yb} ${x0 + run},${yb - h}`} style={{ fill: v('roof'), stroke: v('edge') }} strokeWidth={1.4} />
      <Line x1={x0} y1={yb} x2={x0 + run} y2={yb - h} color="ridge" w={3.5} />
      <Tag x={x0 + run / 2} y={yb + 18} label="Run = 12" />
      <Tag x={x0 + run + 26} y={yb - h / 2} label={`Rise = ${Math.round(rise * 100) / 100}`} />
      <Tag x={x0 + run / 2 - 20} y={yb - h / 2 - 18} label={factorLabel || 'Sloped length = run × factor'} color="ridge" />
    </Svg>
  );
}

/** Cross-section at the eave: what goes on the roof deck, bottom to top. */
export function LayersDiagram() {
  const y = (i: number) => 40 + i * 26;
  const rows = [
    { c: 'shingle-2', t: 'Ridge cap at the top' },
    { c: 'shingle', t: 'Field shingles (courses)' },
    { c: 'shingle-2', t: 'Starter strip along eaves & rakes' },
    { c: 'under', t: 'Underlayment (synthetic or felt)' },
    { c: 'ice', t: 'Ice & water barrier at eaves/valleys' },
    { c: 'eave', t: 'Drip edge on eaves & rakes' },
    { c: 'deck', t: 'Roof deck (plywood / OSB)' },
  ];
  return (
    <Svg label="Roof layers from top to bottom: ridge cap, field shingles, starter strip, underlayment, ice and water barrier, drip edge and the roof deck" viewBox="0 0 340 230">
      {rows.map((r, i) => (
        <g key={r.t}>
          <rect x={20} y={y(i) - 12} width={120 - i * 6} height={18} rx={3} style={{ fill: v(r.c) }} />
          <Txt x={150} y={y(i) + 2} size={11}>
            {r.t}
          </Txt>
        </g>
      ))}
    </Svg>
  );
}

/** One roofing square = 10 × 10 ft = 100 ft², usually 3 bundles. */
export function SquareDiagram({ bundles = 3 }: { bundles?: number }) {
  const s = 130, x0 = 30, y0 = 30;
  return (
    <Svg label={`One roofing square is 10 by 10 feet, 100 square feet, covered by about ${bundles} bundles of shingles`} viewBox="0 0 340 200">
      <rect x={x0} y={y0} width={s} height={s} style={{ fill: v('roof'), stroke: v('edge') }} strokeWidth={1.4} />
      {Array.from({ length: bundles - 1 }, (_, i) => (
        <line key={i} x1={x0} y1={y0 + ((i + 1) * s) / bundles} x2={x0 + s} y2={y0 + ((i + 1) * s) / bundles} style={{ stroke: v('edge'), strokeDasharray: '4 3' }} strokeWidth={1} />
      ))}
      {Array.from({ length: bundles }, (_, i) => (
        <Txt key={i} x={x0 + s / 2} y={y0 + ((i + 0.5) * s) / bundles + 4} anchor="middle" size={10.5} weight={700}>
          bundle {i + 1}
        </Txt>
      ))}
      <Tag x={x0 + s / 2} y={y0 + s + 18} label="10 ft" />
      <Tag x={x0 + s + 22} y={y0 + s / 2} label="10 ft" />
      <Txt x={205} y={80} size={12} weight={700}>
        1 square = 100 ft²
      </Txt>
      <Txt x={205} y={100} size={11}>
        = 9.29 m²
      </Txt>
      <Txt x={205} y={120} size={11}>
        ≈ {bundles} bundles
      </Txt>
    </Svg>
  );
}
