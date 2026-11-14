import React from 'react';
import styles from './PipeDiagram.module.css';

/** SVG diagrams for the pipe / tube volume calculator. Pure (no hooks); colours follow the theme. */

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
  const w = Math.max(24, label.length * 6.2 + 12);
  return (
    <g>
      <rect x={x - w / 2} y={y - 10} width={w} height={19} rx={5} style={{ fill: v('label-bg'), stroke: v(color) }} strokeWidth={1.1} />
      <Txt x={x} y={y + 4} anchor="middle" size={10.5} weight={700} color={color}>
        {label}
      </Txt>
    </g>
  );
}
/** Dimension line with end ticks (no SVG markers, so ids never repeat on the page). */
function Dim({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / len) * 5;
  const ny = ((x2 - x1) / len) * 5;
  return (
    <g style={{ stroke: v('dim') }} strokeWidth={1.3}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line x1={x1 - nx} y1={y1 - ny} x2={x1 + nx} y2={y1 + ny} />
      <line x1={x2 - nx} y1={y2 - ny} x2={x2 + nx} y2={y2 + ny} />
    </g>
  );
}

/** Live cross-section: round (OD, ID, wall) or rectangular (W, H, wall). Inner area is shown as liquid. */
export function CrossSectionDiagram({
  shape,
  od,
  id,
  width,
  height,
  wall,
  labels = {},
}: {
  shape: 'round' | 'rect';
  od?: number;
  id?: number;
  width?: number;
  height?: number;
  wall?: number;
  labels?: Partial<Record<'od' | 'id' | 'wall' | 'w' | 'h', string>>;
}) {
  const cx = 130, cy = 110, R = 82;
  if (shape === 'rect') {
    const W = width && width > 0 ? width : 4;
    const H = height && height > 0 ? height : 2;
    const t = wall && wall > 0 ? wall : 0.25;
    const k = Math.min(200 / W, 150 / H);
    const w = W * k, h = H * k, tk = Math.max(2, Math.min(t * k, Math.min(w, h) / 2 - 2));
    const x0 = cx - w / 2, y0 = cy - h / 2;
    return (
      <Svg label={`Rectangular tube cross-section: outside ${labels.w || 'W'} by ${labels.h || 'H'}, wall ${labels.wall || 't'}`} viewBox="0 0 340 230">
          <rect x={x0} y={y0} width={w} height={h} style={{ fill: v('metal'), stroke: v('edge') }} strokeWidth={1.4} />
        <rect x={x0 + tk} y={y0 + tk} width={Math.max(0, w - 2 * tk)} height={Math.max(0, h - 2 * tk)} style={{ fill: v('water'), stroke: v('edge') }} strokeWidth={1} />
        <Dim x1={x0} y1={y0 + h + 16} x2={x0 + w} y2={y0 + h + 16} />
        <Tag x={cx} y={y0 + h + 16} label={`W ${labels.w || ''}`.trim()} />
        <Dim x1={x0 + w + 16} y1={y0} x2={x0 + w + 16} y2={y0 + h} />
        <Tag x={x0 + w + 46} y={cy} label={`H ${labels.h || ''}`.trim()} />
        <Tag x={x0 + 40} y={y0 - 12} label={`wall ${labels.wall || 't'}`} color="accent" />
      </Svg>
    );
  }
  const OD = od && od > 0 ? od : 0;
  const ID = id && id > 0 ? id : 1;
  const r = OD > ID ? (R * ID) / OD : R * 0.82;
  return (
    <Svg label={`Round pipe cross-section: outside diameter ${labels.od || 'OD'}, inside diameter ${labels.id || 'ID'}${labels.wall ? `, wall ${labels.wall}` : ''}`} viewBox="0 0 340 230">
      <circle cx={cx} cy={cy} r={R} style={{ fill: OD > 0 ? v('metal') : v('metal-2'), stroke: v('edge'), strokeDasharray: OD > 0 ? undefined : '5 4' }} strokeWidth={1.4} />
      <circle cx={cx} cy={cy} r={r} style={{ fill: v('water'), stroke: v('edge') }} strokeWidth={1.2} />
      <Dim x1={cx - r} y1={cy} x2={cx + r} y2={cy} />
      <Tag x={cx} y={cy - 14} label={`ID ${labels.id || ''}`.trim()} />
      <Dim x1={cx - R} y1={cy + R + 14} x2={cx + R} y2={cy + R + 14} />
      <Tag x={cx} y={cy + R + 14} label={OD > 0 ? `OD ${labels.od || ''}`.trim() : 'OD not given'} />
      {OD > 0 && <Tag x={cx + R + 50} y={cy - 46} label={`wall ${labels.wall || ''}`.trim()} color="accent" />}
      <Txt x={232} y={150} size={10.5}>
        Blue = liquid inside
      </Txt>
      <Txt x={232} y={166} size={10.5}>
        Grey = tube wall
      </Txt>
    </Svg>
  );
}

/** ID vs OD vs nominal size. */
export function SizesDiagram() {
  const cx = 110, cy = 105;
  return (
    <Svg label="Pipe sizes: the outside diameter is fixed for each nominal size, the wall gets thicker for heavier schedules or types, so the inside diameter shrinks. The nominal size matches neither exactly." viewBox="0 0 340 220">
      <circle cx={cx} cy={cy} r={78} style={{ fill: v('metal'), stroke: v('edge') }} strokeWidth={1.4} />
      <circle cx={cx} cy={cy} r={62} style={{ fill: v('water'), stroke: v('edge') }} strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={70} style={{ fill: 'none', stroke: v('accent'), strokeDasharray: '5 4' }} strokeWidth={1.4} />
      <Dim x1={cx - 62} y1={cy} x2={cx + 62} y2={cy} />
      <Tag x={cx} y={cy - 14} label="ID" />
      <Txt x={205} y={58} size={11} weight={700}>
        OD — fixed per size
      </Txt>
      <Txt x={205} y={76} size={10.5}>
        (what fittings fit)
      </Txt>
      <Txt x={205} y={104} size={11} weight={700} color="dim">
        ID — what holds water
      </Txt>
      <Txt x={205} y={122} size={10.5}>
        shrinks as the wall thickens
      </Txt>
      <Txt x={205} y={150} size={11} weight={700} color="accent">
        Nominal — just a name
      </Txt>
      <Txt x={205} y={168} size={10.5}>
        {'1 in Sch 40: OD 1.315 in, ID 1.049 in'}
      </Txt>
    </Svg>
  );
}

/** A length of pipe with its liquid: capacity = inside area × length. */
export function CapacityDiagram() {
  return (
    <Svg label="A length of pipe filled with liquid. Capacity equals the inside cross-section area times the length." viewBox="0 0 340 170">
      <rect x={40} y={50} width={250} height={56} rx={4} style={{ fill: v('metal'), stroke: v('edge') }} strokeWidth={1.4} />
      <rect x={40} y={58} width={250} height={40} style={{ fill: v('water') }} />
      <ellipse cx={40} cy={78} rx={14} ry={28} style={{ fill: v('metal-2'), stroke: v('edge') }} strokeWidth={1.4} />
      <ellipse cx={40} cy={78} rx={10} ry={20} style={{ fill: v('water-2') }} />
      <Dim x1={40} y1={126} x2={290} y2={126} />
      <Tag x={165} y={126} label="Length L" />
      <Tag x={60} y={30} label="π × (ID ÷ 2)²" />
      <Txt x={170} y={158} anchor="middle" size={11} weight={700}>
        Capacity = π × (ID ÷ 2)² × L
      </Txt>
    </Svg>
  );
}
