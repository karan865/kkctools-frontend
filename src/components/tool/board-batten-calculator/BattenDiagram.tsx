import React from 'react';
import styles from './BattenDiagram.module.css';

/** SVG diagrams for the board and batten calculator. Pure (no hooks); colours follow the theme. */

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
function HDim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} style={{ stroke: v('dim') }} strokeWidth={1.2} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} style={{ stroke: v('dim') }} strokeWidth={1.2} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} style={{ stroke: v('dim') }} strokeWidth={1.2} />
      <Tag x={(x1 + x2) / 2} y={y} label={label} />
    </g>
  );
}

export interface LayoutObstacle {
  label: string;
  left: number;
  width: number;
  bottom: number;
  height: number;
}

/** Live wall elevation: battens at their real positions (to scale), rails, grid rows and obstacles. */
export function WallLayoutDiagram({
  wallWidth,
  wallHeight,
  battenWidth,
  positions,
  topRail = 0,
  baseboard = 0,
  railRows = 0,
  railWidth = 0,
  obstacles = [],
  clashIndexes = [],
  gapLabel,
  widthLabel,
}: {
  wallWidth: number;
  wallHeight: number;
  battenWidth: number;
  positions: number[];
  topRail?: number;
  baseboard?: number;
  railRows?: number;
  railWidth?: number;
  obstacles?: LayoutObstacle[];
  clashIndexes?: number[];
  gapLabel?: string;
  widthLabel?: string;
}) {
  const VW = 340;
  const maxW = 300, maxH = 180;
  const ok = wallWidth > 0 && wallHeight > 0;
  const k = ok ? Math.min(maxW / wallWidth, maxH / wallHeight) : 1;
  const w = ok ? wallWidth * k : maxW;
  const h = ok ? wallHeight * k : maxH;
  const x0 = (VW - w) / 2;
  const y0 = 14;
  const X = (inches: number) => x0 + inches * k;
  const Y = (fromFloor: number) => y0 + h - fromFloor * k; // inches measured up from the floor
  const clearBottom = baseboard;
  const clearTop = wallHeight - topRail;
  const clear = Math.max(0, clearTop - clearBottom);
  const rows = Math.max(0, Math.floor(railRows));
  const rowGap = rows > 0 ? (clear - rows * railWidth) / (rows + 1) : 0;
  const total = h + y0 + 54;
  const summary = `${positions.length} battens on a wall drawn to scale${gapLabel ? `, ${gapLabel} between battens` : ''}`;

  return (
    <Svg label={summary} viewBox={`0 0 ${VW} ${total}`}>
      <rect x={x0} y={y0} width={w} height={h} style={{ fill: v('wall'), stroke: v('wall-edge') }} strokeWidth={1.3} />
      {obstacles.map((o, i) => (
        <g key={`o${i}`}>
          <rect x={X(o.left)} y={Y(o.bottom + o.height)} width={Math.max(1, o.width * k)} height={Math.max(1, o.height * k)} style={{ fill: v('obstacle'), stroke: v('clash') }} strokeWidth={1} strokeDasharray="3 2" />
        </g>
      ))}
      {topRail > 0 && <rect x={x0} y={Y(wallHeight)} width={w} height={topRail * k} style={{ fill: v('rail'), stroke: v('batten-edge') }} strokeWidth={1} />}
      {baseboard > 0 && <rect x={x0} y={Y(baseboard)} width={w} height={baseboard * k} style={{ fill: v('rail'), stroke: v('batten-edge') }} strokeWidth={1} />}
      {rows > 0 &&
        Array.from({ length: rows }, (_, r) => {
          const bottom = clearBottom + (r + 1) * rowGap + r * railWidth;
          return <rect key={`r${r}`} x={x0} y={Y(bottom + railWidth)} width={w} height={Math.max(1, railWidth * k)} style={{ fill: v('rail'), stroke: v('batten-edge') }} strokeWidth={0.8} />;
        })}
      {positions.map((p, i) => (
        <rect
          key={`b${i}`}
          x={X(p)}
          y={Y(clearTop)}
          width={Math.max(1.2, battenWidth * k)}
          height={clear * k}
          style={{ fill: v('batten'), stroke: clashIndexes.includes(i) ? v('clash') : v('batten-edge') }}
          strokeWidth={clashIndexes.includes(i) ? 2 : 1}
        />
      ))}
      {positions.length >= 2 && gapLabel && <HDim x1={X(positions[0] + battenWidth)} x2={X(positions[1])} y={Y(clearBottom + clear * 0.5)} label={gapLabel} />}
      {widthLabel && <HDim x1={x0} x2={x0 + w} y={y0 + h + 18} label={widthLabel} />}
      <Txt x={VW / 2} y={y0 + h + 44} anchor="middle" size={10}>
        Drawn to scale · red outline = batten over an outlet, switch or window
      </Txt>
    </Svg>
  );
}

/** The three edge options side by side. */
export function EdgeModesDiagram() {
  const panel = (x: number, title: string, mode: 'both' | 'none' | 'inset') => {
    const w = 96, h = 90, y = 26, b = 7, n = 4;
    const W = w;
    let pos: number[] = [];
    if (mode === 'both') {
      const g = (W - n * b) / (n - 1);
      pos = Array.from({ length: n }, (_, i) => i * (b + g));
    } else if (mode === 'none') {
      const g = (W - n * b) / (n + 1);
      pos = Array.from({ length: n }, (_, i) => g + i * (b + g));
    } else {
      const m = 10, g = (W - 2 * m - n * b) / (n - 1);
      pos = Array.from({ length: n }, (_, i) => m + i * (b + g));
    }
    return (
      <g key={mode}>
        <rect x={x} y={y} width={w} height={h} style={{ fill: v('wall'), stroke: v('wall-edge') }} strokeWidth={1.2} />
        {pos.map((p, i) => (
          <rect key={i} x={x + p} y={y} width={b} height={h} style={{ fill: v('batten'), stroke: v('batten-edge') }} strokeWidth={1} />
        ))}
        <Txt x={x + w / 2} y={y + h + 18} anchor="middle" size={10.5} weight={700}>
          {title}
        </Txt>
        <Txt x={x + w / 2} y={y + h + 32} anchor="middle" size={9.5}>
          {mode === 'both' ? 'gaps = battens − 1' : mode === 'none' ? 'gaps = battens + 1' : 'set margin at each end'}
        </Txt>
      </g>
    );
  };
  return (
    <Svg label="Three ways to start the layout: battens at both wall edges, gaps at both edges, or battens inset by a margin" viewBox="0 0 340 160">
      {panel(10, 'Battens at edges', 'both')}
      {panel(122, 'Gaps at edges', 'none')}
      {panel(234, 'Inset margin', 'inset')}
    </Svg>
  );
}

/** Nominal vs actual: a 1×4 is really ¾ × 3½ in. */
export function NominalDiagram() {
  const k = 34;
  return (
    <Svg label="A nominal 1 by 4 board measures about three quarters by three and a half inches after drying and planing" viewBox="0 0 340 170">
      <rect x={40} y={40} width={4 * k} height={1 * k} style={{ fill: 'none', stroke: v('wall-edge'), strokeDasharray: '5 4' }} strokeWidth={1.3} />
      <rect x={40 + 0.25 * k} y={40 + 0.125 * k} width={3.5 * k} height={0.75 * k} style={{ fill: v('wood'), stroke: v('wood-2') }} strokeWidth={1.5} />
      <Txt x={40} y={30} size={10.5}>
        Nominal 1 × 4 (dashed)
      </Txt>
      <HDim x1={40 + 0.25 * k} x2={40 + 3.75 * k} y={100} label="3½ in actual" />
      <Tag x={40 + 4 * k + 50} y={40 + 0.5 * k} label="¾ in thick" />
      <Txt x={40} y={140} size={10.5}>
        {'1×2 = 1½ in · 1×3 = 2½ in · 1×4 = 3½ in · 1×6 = 5½ in · 1×8 = 7¼ in'}
      </Txt>
    </Svg>
  );
}

/** Exterior siding from above: wide boards with gaps, battens over the gaps, furring behind. */
export function SidingDiagram() {
  const y = 70;
  return (
    <Svg label="Exterior board and batten siding seen from above: wide boards with small gaps, a narrow batten over each gap, and horizontal furring strips behind on the wall" viewBox="0 0 340 150">
      <rect x={14} y={y + 26} width={312} height={14} style={{ fill: v('wall'), stroke: v('wall-edge') }} strokeWidth={1} />
      <Txt x={18} y={y + 56} size={10}>
        Wall sheathing
      </Txt>
      <rect x={14} y={y + 16} width={312} height={9} style={{ fill: v('furring') }} />
      <Txt x={250} y={y + 56} size={10}>
        Furring strip
      </Txt>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={18 + i * 78} y={y} width={72} height={15} style={{ fill: v('wood'), stroke: v('wood-2') }} strokeWidth={1.2} />
      ))}
      {[1, 2, 3].map((i) => (
        <rect key={`b${i}`} x={18 + i * 78 - 14} y={y - 14} width={22} height={13} style={{ fill: v('wood-2'), stroke: v('batten-edge') }} strokeWidth={1.2} />
      ))}
      <Tag x={96} y={y - 30} label="Batten covers the gap" />
      <Tag x={244} y={y + 8} label="Wide board" />
    </Svg>
  );
}
