import React from 'react';
import s from '../shared/AreaDepthDiagram.module.css';
import { StepFrame, type CalcStep } from '../shared/AreaDepthDiagram';

interface Props {
  lengthFt: number;
  widthFt: number;
  tileLIn: number;
  tileWIn: number;
  groutIn: number;
  /** grid | running-bond | diagonal | herringbone | custom */
  pattern: string;
  areaLabel?: string;
  steps: CalcStep[];
}

const TILE = '#E7E5E4';
const TILE_EDGE = '#A8A29E';
const GROUT = '#78716C';

/** Top view of the area covered in tiles (with grout lines) in the chosen layout; edge tiles are cut. */
export default function TileDiagram({ lengthFt, widthFt, tileLIn, tileWIn, groutIn, pattern, areaLabel, steps }: Props) {
  const L = lengthFt > 0 ? lengthFt : 10;
  const W = widthFt > 0 ? widthFt : 10;
  const k = Math.min(230 / L, 160 / W);
  const w = L * k;
  const h = W * k;
  const x0 = 64 + (230 - w) / 2;
  const y0 = 46 + (160 - h) / 2;
  // tile size in px (kept visible; flagged if drawn larger than real)
  const tlTrue = (tileLIn / 12) * k;
  const twTrue = (tileWIn / 12) * k;
  const tl = Math.max(tlTrue, 14);
  const tw = Math.max(twTrue, tileWIn < tileLIn ? 8 : 14);
  const g = 1.6;
  const clamped = tl > tlTrue + 0.5 || tw > twTrue + 0.5;
  const art = (suffix: string) => {
    const clip = `tile-c${suffix}`;
    const tiles: React.ReactNode[] = [];
    const rows = Math.ceil((h * 1.6) / tw) + 6;
    const cols = Math.ceil((w * 1.6) / tl) + 6;
    if (pattern === 'herringbone') {
      for (let r = -rows; r < rows; r++)
        for (let c = -cols; c < cols; c++) {
          const bx = x0 + c * tl + r * tw;
          const by = y0 + r * tw - c * tw;
          tiles.push(<rect key={`a${r}-${c}`} x={bx} y={by} width={tl - g} height={tw - g} fill={TILE} stroke={TILE_EDGE} strokeWidth={0.4} />);
          tiles.push(<rect key={`b${r}-${c}`} x={bx + tl - tw} y={by - tl + tw} width={tw - g} height={tl - g} fill="#D6D3D1" stroke={TILE_EDGE} strokeWidth={0.4} />);
        }
    } else {
      for (let r = -rows; r < rows; r++) {
        const off = pattern === 'running-bond' && r % 2 !== 0 ? tl / 2 : 0;
        for (let c = -cols; c < cols; c++) tiles.push(<rect key={`${r}-${c}`} x={x0 + c * tl + off} y={y0 + r * tw} width={tl - g} height={tw - g} fill={TILE} stroke={TILE_EDGE} strokeWidth={0.4} />);
      }
    }
    const rot = pattern === 'diagonal' ? `rotate(45 ${x0 + w / 2} ${y0 + h / 2})` : undefined;
    return (
      <g>
        <defs>
          <clipPath id={clip}>
            <rect x={x0} y={y0} width={w} height={h} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clip})`}>
          <rect x={x0} y={y0} width={w} height={h} fill={GROUT} />
          <g transform={rot}>{tiles}</g>
          {/* cut tiles along the right and bottom edges */}
          <rect x={x0 + w - tl * 0.5} y={y0} width={tl * 0.5} height={h} fill="var(--brand-orange)" opacity={0.16} />
          <rect x={x0} y={y0 + h - tw * 0.5} width={w} height={tw * 0.5} fill="var(--brand-orange)" opacity={0.16} />
        </g>
        <rect x={x0} y={y0} width={w} height={h} fill="none" stroke="var(--ink-2)" strokeWidth={2.4} />
        {/* one tile highlighted */}
        {pattern !== 'diagonal' && pattern !== 'herringbone' && (
          <g>
            <rect x={x0} y={y0} width={tl - g} height={tw - g} fill="none" stroke="var(--brand-orange)" strokeWidth={2} />
            <path className={s.dim} d={`M${x0 + tl / 2} ${y0} L${x0 + tl / 2 + 12} ${y0 - 14}`} />
          </g>
        )}
        <text className={s.labelAccent} x={x0 + tl / 2 + 14} y={y0 - 16}>
          tile {tileLIn} × {tileWIn} in · grout {groutIn} in
        </text>
        <line className={s.dim} x1={x0} y1={y0 + h + 14} x2={x0 + w} y2={y0 + h + 14} />
        <text className={s.label} x={x0 + w / 2} y={y0 + h + 30} textAnchor="middle">
          {areaLabel ?? `${lengthFt} ft`}
        </text>
        {!areaLabel && (
          <>
            <line className={s.dim} x1={x0 - 12} y1={y0} x2={x0 - 12} y2={y0 + h} />
            <text className={s.label} x={x0 - 16} y={y0 + h / 2 + 4} textAnchor="end">
              {widthFt} ft
            </text>
          </>
        )}
        <text className={s.small} x={20} y={262}>
          orange edge = cut tiles{clamped ? ' · tiles drawn larger than real' : ''}
        </text>
      </g>
    );
  };
  return <StepFrame art={art} steps={steps} artTop={Math.max(0, Math.floor(y0 - 30))} />;
}
