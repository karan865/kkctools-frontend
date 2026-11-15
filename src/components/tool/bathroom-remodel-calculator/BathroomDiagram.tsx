import React from 'react';
import s from './BathroomDiagram.module.css';
import type { Bathing } from '@/lib/bathroom-remodel-engine';

/* Top-down plan of the bathroom with the chosen fixtures. Sizes are shown as text elsewhere,
   so the drawing is hidden from assistive tech. */
export function BathroomPlan({ bathing, lengthLabel, widthLabel, ratio }: { bathing: Bathing; lengthLabel: string; widthLabel: string; ratio: number }) {
  // fit the room (length along x) into the drawing area
  const maxW = 260;
  const maxH = 160;
  const r = Math.min(Math.max(ratio, 0.4), 2.6); // length ÷ width
  const W = r >= maxW / maxH ? maxW : maxH * r;
  const H = W / r;
  const x0 = 40 + (maxW - W) / 2;
  const y0 = 28 + (maxH - H) / 2;
  const tileId = 'bath-tile';
  const showTub = bathing === 'combo' || bathing === 'tub' || bathing === 'both';
  const showShower = bathing === 'shower' || bathing === 'both';
  const tubW = Math.min(W * 0.42, 70);
  const tubH = Math.min(H * 0.42, 32);
  return (
    <svg className={s.svg} viewBox="0 0 340 220" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={tileId} width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" className={s.tileBg} />
          <path d="M14 0 V14 H0" className={s.grout} />
        </pattern>
      </defs>
      <rect x={x0} y={y0} width={W} height={H} fill={`url(#${tileId})`} className={s.room} />
      {/* door swing on the bottom wall */}
      <path className={s.door} d={`M${x0 + W - 34} ${y0 + H} A26 26 0 0 0 ${x0 + W - 8} ${y0 + H - 26}`} />
      <line className={s.doorLeaf} x1={x0 + W - 8} y1={y0 + H} x2={x0 + W - 8} y2={y0 + H - 26} />
      {/* vanity along the top wall */}
      <rect className={s.vanity} x={x0 + W * 0.36} y={y0 + 2} width={Math.min(W * 0.34, 64)} height={16} rx={2} />
      <ellipse className={s.basin} cx={x0 + W * 0.36 + Math.min(W * 0.34, 64) / 2} cy={y0 + 10} rx={8} ry={5} />
      {/* toilet */}
      <rect className={s.fixture} x={x0 + 6} y={y0 + H * 0.38} width={10} height={20} rx={2} />
      <ellipse className={s.fixture} cx={x0 + 25} cy={y0 + H * 0.38 + 10} rx={10} ry={8} />
      {/* tub and/or shower on the right */}
      {showTub && <rect className={s.tub} x={x0 + W - tubW - 3} y={y0 + 3} width={tubW} height={tubH} rx={10} />}
      {showShower && (
        <g>
          <rect className={s.shower} x={x0 + W - 40} y={y0 + (showTub ? tubH + 8 : 3)} width={37} height={Math.min(37, H - (showTub ? tubH + 11 : 6) - 30)} rx={2} />
          <circle className={s.drain} cx={x0 + W - 21.5} cy={y0 + (showTub ? tubH + 8 : 3) + Math.min(37, H - (showTub ? tubH + 11 : 6) - 30) / 2} r={2.5} />
        </g>
      )}
      {/* dimensions */}
      <line className={s.dim} x1={x0} y1={y0 + H + 16} x2={x0 + W} y2={y0 + H + 16} />
      <text className={s.label} x={x0 + W / 2} y={y0 + H + 30} textAnchor="middle">
        {lengthLabel}
      </text>
      <line className={s.dim} x1={x0 - 14} y1={y0} x2={x0 - 14} y2={y0 + H} />
      <text className={s.label} x={x0 - 18} y={y0 + H / 2 + 4} textAnchor="end">
        {widthLabel}
      </text>
    </svg>
  );
}

export interface Seg {
  label: string;
  amount: number;
  tone: 'a' | 'b' | 'c' | 'd';
}
export function SpendBar({ segments, format }: { segments: Seg[]; format: (n: number) => string }) {
  const total = segments.reduce((a, x) => a + x.amount, 0);
  const shown = segments.filter((x) => x.amount > 0);
  if (total <= 0) return null;
  return (
    <div className={s.costBar}>
      <div className={s.bar} aria-hidden="true">
        {shown.map((x) => (
          <span key={x.label} className={`${s.seg} ${s[x.tone]}`} style={{ width: `${(x.amount / total) * 100}%` }} />
        ))}
      </div>
      <ul className={s.legend}>
        {shown.map((x) => (
          <li key={x.label}>
            <span className={`${s.swatch} ${s[x.tone]}`} aria-hidden="true" />
            {x.label} <strong>{format(x.amount)}</strong> <span className={s.pct}>({Math.round((x.amount / total) * 100)}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
