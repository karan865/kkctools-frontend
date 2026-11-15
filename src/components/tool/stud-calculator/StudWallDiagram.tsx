import React from 'react';
import s from '../shared/AreaDepthDiagram.module.css';
import { StepFrame, type CalcStep } from '../shared/AreaDepthDiagram';

interface Props {
  lengthFt: number;
  heightFt: number;
  spacingIn: number;
  doors: number;
  windows: number;
  doublePlate: boolean;
  lengthLabel: string;
  steps: CalcStep[];
}

const WOOD = '#E2B97F';
const EDGE = '#8A6440';
const EXTRA = '#C2410C';

/** Wall framing elevation: plates, studs at the chosen spacing, and framed door/window openings. */
export default function StudWallDiagram({ lengthFt, heightFt, spacingIn, doors, windows, doublePlate, lengthLabel, steps }: Props) {
  const L = lengthFt > 0 ? lengthFt : 12;
  const H = heightFt > 0 ? heightFt : 8;
  const k = Math.min(262 / L, 150 / H);
  const w = L * k;
  const h = H * k;
  const x0 = 46 + (262 - w) / 2;
  const y0 = 48 + (150 - h);
  const plate = 4;
  const studW = Math.max(1.5 / 12 * k, 2.2);
  const sp = (spacingIn / 12) * k;
  // openings (drawn: door 3 × 6.8 ft, window 3 × 4 ft with a 3 ft sill), at most one of each to keep it readable
  type Op = { x: number; w: number; top: number; bottom: number; kind: 'door' | 'window' };
  const ops: Op[] = [];
  const ow = 3 * k;
  if (doors > 0 && w > ow * 2.2) ops.push({ x: x0 + w * 0.2, w: ow, top: y0 + h - 6.8 * k, bottom: y0 + h - plate, kind: 'door' });
  if (windows > 0 && w > ow * 3.5) ops.push({ x: x0 + w * 0.62, w: ow, top: y0 + h - 7 * k, bottom: y0 + h - 3 * k, kind: 'window' });
  const inOpening = (x: number) => ops.some((o) => x > o.x - studW * 2 && x < o.x + o.w + studW);
  const studs: React.ReactNode[] = [];
  const topY = y0 + plate * (doublePlate ? 2 : 1);
  const botY = y0 + h - plate;
  if (sp >= 3) {
    for (let x = x0; x <= x0 + w - studW + 0.01; x += sp) {
      if (!inOpening(x)) studs.push(<rect key={x} x={x} y={topY} width={studW} height={botY - topY} fill={WOOD} stroke={EDGE} strokeWidth={0.5} />);
    }
  }
  // end stud and extra corner studs
  studs.push(<rect key="end" x={x0 + w - studW} y={topY} width={studW} height={botY - topY} fill={WOOD} stroke={EDGE} strokeWidth={0.5} />);
  studs.push(<rect key="c1" x={x0 + studW} y={topY} width={studW} height={botY - topY} fill={EXTRA} opacity={0.85} />);
  studs.push(<rect key="c2" x={x0 + w - studW * 2} y={topY} width={studW} height={botY - topY} fill={EXTRA} opacity={0.85} />);
  const framing = ops.map((o, i) => (
    <g key={i}>
      {/* king studs (full height) and jack studs (to the header) */}
      <rect x={o.x - studW * 2} y={topY} width={studW} height={botY - topY} fill={EXTRA} opacity={0.85} />
      <rect x={o.x + o.w + studW} y={topY} width={studW} height={botY - topY} fill={EXTRA} opacity={0.85} />
      <rect x={o.x - studW} y={o.top} width={studW} height={botY - o.top} fill={EXTRA} opacity={0.6} />
      <rect x={o.x + o.w} y={o.top} width={studW} height={botY - o.top} fill={EXTRA} opacity={0.6} />
      {/* header */}
      <rect x={o.x - studW} y={o.top - 7} width={o.w + studW * 2} height={7} fill="#B45309" stroke={EDGE} strokeWidth={0.6} />
      {/* cripples above the header */}
      {Array.from({ length: Math.max(0, Math.floor(o.w / Math.max(sp, 8))) }, (_, c) => (
        <rect key={c} x={o.x + (c + 0.5) * (o.w / Math.max(1, Math.floor(o.w / Math.max(sp, 8))))} y={topY} width={studW} height={o.top - 7 - topY} fill={WOOD} stroke={EDGE} strokeWidth={0.5} />
      ))}
      {o.kind === 'window' && (
        <>
          <rect x={o.x} y={o.bottom} width={o.w} height={4} fill="#B45309" />
          {Array.from({ length: Math.max(0, Math.floor(o.w / Math.max(sp, 8))) }, (_, c) => (
            <rect key={`b${c}`} x={o.x + (c + 0.5) * (o.w / Math.max(1, Math.floor(o.w / Math.max(sp, 8))))} y={o.bottom + 4} width={studW} height={botY - o.bottom - 4} fill={WOOD} stroke={EDGE} strokeWidth={0.5} />
          ))}
        </>
      )}
      <text className={s.small} x={o.x + o.w / 2} y={(o.top + o.bottom) / 2 + 4} textAnchor="middle">
        {o.kind}
      </text>
    </g>
  ));
  const art = () => (
    <g>
      {/* plates */}
      <rect x={x0} y={y0 + h - plate} width={w} height={plate} fill="#B45309" stroke={EDGE} strokeWidth={0.6} />
      <rect x={x0} y={y0} width={w} height={plate} fill="#B45309" stroke={EDGE} strokeWidth={0.6} />
      {doublePlate && <rect x={x0} y={y0 + plate} width={w} height={plate} fill="#C2722E" stroke={EDGE} strokeWidth={0.6} />}
      {studs}
      {framing}
      {/* spacing callout between the first two field studs */}
      {sp >= 3 && (
        <g>
          <line className={s.dimAccent} x1={x0 + sp} y1={y0 - 10} x2={x0 + sp * 2} y2={y0 - 10} />
          <text className={s.labelAccent} x={x0 + sp * 2 + 6} y={y0 - 6}>
            {spacingIn} in on centre
          </text>
        </g>
      )}
      <line className={s.dim} x1={x0} y1={y0 + h + 12} x2={x0 + w} y2={y0 + h + 12} />
      <text className={s.label} x={x0 + w / 2} y={y0 + h + 28} textAnchor="middle">
        {lengthLabel}
      </text>
      <line className={s.dim} x1={x0 - 10} y1={y0} x2={x0 - 10} y2={y0 + h} />
      <text className={s.label} x={x0 - 14} y={y0 + h / 2 + 4} textAnchor="end">
        {+H.toFixed(2)} ft
      </text>
      <g transform={`translate(20, ${y0 + h + 42})`}>
        <rect width={10} height={10} fill={WOOD} stroke={EDGE} />
        <text className={s.small} x={14} y={9}>
          field stud
        </text>
        <rect x={76} width={10} height={10} fill={EXTRA} />
        <text className={s.small} x={90} y={9}>
          extra stud
        </text>
        <rect x={150} width={10} height={10} fill="#B45309" />
        <text className={s.small} x={164} y={9}>
          plate / header
        </text>
      </g>
    </g>
  );
  return <StepFrame art={art} steps={steps} artTop={Math.max(0, Math.floor(y0 - 26))} />;
}
