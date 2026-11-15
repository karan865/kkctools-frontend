import React from 'react';
import s from './AreaDepthDiagram.module.css';
import { StepFrame, type CalcStep } from './AreaDepthDiagram';

export interface WallOpening {
  type: 'door' | 'window' | 'custom';
  widthFt: number;
  heightFt: number;
  count?: number;
}

interface Props {
  lengthFt: number;
  heightFt: number;
  lengthLabel: string;
  heightLabel: string;
  openings?: WallOpening[];
  /** what the wall is made of / covered with */
  fill: 'block' | 'brick' | 'paint';
  /** unit size incl. mortar, in inches (block / brick) */
  unitLengthIn?: number;
  unitHeightIn?: number;
  unitLabel?: string;
  /** e.g. "× 2 walls" */
  note?: string;
  steps: CalcStep[];
  idPrefix: string;
}

const FILL = {
  block: { unit: '#B9B4AC', unitDark: '#6E675C', mortar: '#F3F0EA' },
  brick: { unit: '#B5523B', unitDark: '#7F3424', mortar: '#E9DFD3' },
  paint: { unit: '#93C5FD', unitDark: '#3B82F6', mortar: '#DBEAFE' },
};

/** Wall elevation drawn to scale with doors/windows cut out and the units shown, plus the steps. */
export default function WallDiagram({ lengthFt, heightFt, lengthLabel, heightLabel, openings = [], fill, unitLengthIn = 16, unitHeightIn = 8, unitLabel, note, steps, idPrefix }: Props) {
  const L = lengthFt > 0 ? lengthFt : 10;
  const H = heightFt > 0 ? heightFt : 8;
  const k = Math.min(250 / L, 160 / H); // px per foot
  const w = L * k;
  const h = H * k;
  const x0 = 56 + (250 - w) / 2;
  const y0 = 46 + (160 - h);
  const c = FILL[fill];
  // unit size in px, kept readable (clamped) — then flagged as not to scale
  const uwTrue = (unitLengthIn / 12) * k;
  const uhTrue = (unitHeightIn / 12) * k;
  const uw = Math.max(uwTrue, fill === 'brick' ? 14 : 18);
  const uh = Math.max(uhTrue, fill === 'brick' ? 5 : 8);
  const clamped = fill !== 'paint' && (uw > uwTrue + 0.5 || uh > uhTrue + 0.5);

  // lay out openings left to right, drawn to scale, skipping any that do not fit
  const list: WallOpening[] = [];
  for (const o of openings) for (let i = 0; i < Math.min(o.count ?? 1, 4); i++) if (o.widthFt > 0 && o.heightFt > 0) list.push(o);
  const gapPx = 10;
  const totalW = list.reduce((a, o) => a + o.widthFt * k, 0) + gapPx * (list.length + 1);
  const placed: { x: number; y: number; w: number; h: number; o: WallOpening }[] = [];
  if (totalW <= w) {
    let x = x0 + (w - totalW) / 2 + gapPx;
    for (const o of list) {
      const ow = o.widthFt * k;
      const oh = Math.min(o.heightFt * k, h - 6);
      const y = o.type === 'door' ? y0 + h - oh : y0 + Math.max(6, (h - oh) * 0.35);
      placed.push({ x, y, w: ow, h: oh, o });
      x += ow + gapPx;
    }
  }

  const art = (suffix: string) => {
    const pid = `${idPrefix}-units${suffix}`;
    return (
      <g>
        <defs>
          <pattern id={pid} width={uw} height={uh * 2} patternUnits="userSpaceOnUse" x={x0} y={y0 + h}>
            <rect width={uw} height={uh * 2} fill={c.mortar} />
            {fill === 'paint' ? (
              <rect width={uw} height={uh * 2} fill={c.unit} opacity={0.75} />
            ) : (
              <>
                <rect x={0.8} y={0.8} width={uw - 1.6} height={uh - 1.6} rx={1} fill={c.unit} stroke={c.unitDark} strokeWidth={0.9} />
                <rect x={-uw / 2 + 0.8} y={uh + 0.8} width={uw - 1.6} height={uh - 1.6} rx={1} fill={c.unit} stroke={c.unitDark} strokeWidth={0.9} />
                <rect x={uw / 2 + 0.8} y={uh + 0.8} width={uw - 1.6} height={uh - 1.6} rx={1} fill={c.unit} stroke={c.unitDark} strokeWidth={0.9} />
              </>
            )}
          </pattern>
        </defs>
        <rect x={x0} y={y0} width={w} height={h} fill={`url(#${pid})`} stroke="var(--ink-2)" strokeWidth={1.6} />
        {placed.map((p, i) => (
          <g key={i}>
            <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="var(--surface)" stroke="var(--ink-2)" strokeWidth={1.4} />
            {p.o.type === 'window' && <path d={`M${p.x + p.w / 2} ${p.y} V${p.y + p.h} M${p.x} ${p.y + p.h / 2} H${p.x + p.w}`} stroke="var(--line-strong)" strokeWidth={1} />}
            {p.o.type === 'door' && <circle cx={p.x + p.w - 5} cy={p.y + p.h * 0.55} r={1.6} fill="var(--ink-2)" />}
            {p.w > 26 && (
              <text className={s.small} x={p.x + p.w / 2} y={p.y + p.h / 2 + 4} textAnchor="middle">
                {`${p.o.widthFt}×${p.o.heightFt}`}
              </text>
            )}
          </g>
        ))}
        {/* highlight one unit with its size */}
        {fill !== 'paint' && unitLabel && (
          <g>
            <rect x={x0 + 1} y={y0 + h - uh + 0.5} width={uw - 1.5} height={uh - 1.5} fill="none" stroke="var(--brand-orange)" strokeWidth={2} />
            <path className={s.dim} d={`M${x0 + uw / 2} ${y0 + h - uh} L${x0 + uw / 2 + 10} ${y0 - 14}`} />
            <text className={s.labelAccent} x={x0 + uw / 2 + 14} y={y0 - 16}>
              {unitLabel}
            </text>
          </g>
        )}
        {/* dimensions */}
        <line className={s.dim} x1={x0} y1={y0 + h + 14} x2={x0 + w} y2={y0 + h + 14} />
        <text className={s.label} x={x0 + w / 2} y={y0 + h + 30} textAnchor="middle">
          {lengthLabel}
        </text>
        <line className={s.dim} x1={x0 - 12} y1={y0} x2={x0 - 12} y2={y0 + h} />
        <text className={s.label} x={x0 - 16} y={y0 + h / 2 + 4} textAnchor="end">
          {heightLabel}
        </text>
        <text className={s.small} x={20} y={262}>
          {[note, clamped ? 'units drawn larger than real' : '', list.length > placed.length ? 'openings not drawn (too many to fit)' : ''].filter(Boolean).join(' · ')}
        </text>
      </g>
    );
  };
  return <StepFrame art={art} steps={steps} artTop={Math.max(0, Math.floor(y0 - 34))} />;
}
