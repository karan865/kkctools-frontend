import React from 'react';
import s from '../shared/AreaDepthDiagram.module.css';
import { StepFrame, type CalcStep } from '../shared/AreaDepthDiagram';
import type { ShapeType } from '@/lib/square-footage-engine';

const FILL = '#BFDBFE';
const EDGE = '#1D4ED8';

interface ShapeProps {
  shape: ShapeType;
  /** raw numbers as entered */
  length: number;
  width: number;
  radius: number;
  base2: number;
  length2: number;
  width2: number;
  unit: string;
  steps: CalcStep[];
}

/** The chosen shape seen from above with every dimension the formula uses. */
export function ShapeAreaDiagram({ shape, length, width, radius, base2, length2, width2, unit, steps }: ShapeProps) {
  const u = (v: number) => `${+v.toFixed(2)} ${unit}`;
  const cx = 165;
  const cy = 130;
  const art = (suffix: string) => {
    const hid = `sq-h${suffix}`;
    let body: React.ReactNode;
    if (shape === 'circle' || shape === 'semicircle') {
      const R = 80;
      body =
        shape === 'circle' ? (
          <g>
            <circle cx={cx} cy={cy} r={R} fill={FILL} stroke={EDGE} strokeWidth={2} />
            <line className={s.dimAccent} x1={cx} y1={cy} x2={cx + R} y2={cy} />
            <circle cx={cx} cy={cy} r={2.5} fill={EDGE} />
            <text className={s.labelAccent} x={cx + R / 2} y={cy - 8} textAnchor="middle">
              r = {u(radius || length / 2)}
            </text>
          </g>
        ) : (
          <g>
            <path d={`M${cx - R} ${cy + 30} A${R} ${R} 0 0 1 ${cx + R} ${cy + 30} Z`} fill={FILL} stroke={EDGE} strokeWidth={2} />
            <line className={s.dimAccent} x1={cx} y1={cy + 30} x2={cx + R} y2={cy + 30} />
            <text className={s.labelAccent} x={cx + R / 2} y={cy + 24} textAnchor="middle">
              r = {u(radius || length / 2)}
            </text>
          </g>
        );
    } else if (shape === 'triangle') {
      const b = 220;
      const h = 150;
      body = (
        <g>
          <polygon points={`${cx - b / 2},${cy + h / 2} ${cx + b / 2},${cy + h / 2} ${cx - 20},${cy - h / 2}`} fill={FILL} stroke={EDGE} strokeWidth={2} />
          <line className={s.dimAccent} x1={cx - 20} y1={cy - h / 2} x2={cx - 20} y2={cy + h / 2} strokeDasharray="5 4" />
          <text className={s.labelAccent} x={cx - 14} y={cy + 4}>
            height {u(width)}
          </text>
          <line className={s.dim} x1={cx - b / 2} y1={cy + h / 2 + 14} x2={cx + b / 2} y2={cy + h / 2 + 14} />
          <text className={s.label} x={cx} y={cy + h / 2 + 30} textAnchor="middle">
            base {u(length)}
          </text>
        </g>
      );
    } else if (shape === 'trapezoid') {
      const b1 = 230;
      const b2 = Math.max(40, Math.min(230, (base2 / Math.max(length, 0.0001)) * b1)) || 120;
      const h = 130;
      body = (
        <g>
          <polygon points={`${cx - b1 / 2},${cy + h / 2} ${cx + b1 / 2},${cy + h / 2} ${cx + b2 / 2},${cy - h / 2} ${cx - b2 / 2},${cy - h / 2}`} fill={FILL} stroke={EDGE} strokeWidth={2} />
          <text className={s.label} x={cx} y={cy - h / 2 - 8} textAnchor="middle">
            base 2 = {u(base2)}
          </text>
          <text className={s.label} x={cx} y={cy + h / 2 + 18} textAnchor="middle">
            base 1 = {u(length)}
          </text>
          <line className={s.dimAccent} x1={cx} y1={cy - h / 2} x2={cx} y2={cy + h / 2} strokeDasharray="5 4" />
          <text className={s.labelAccent} x={cx + 6} y={cy + 4}>
            height {u(width)}
          </text>
        </g>
      );
    } else if (shape === 'l-shape') {
      // part A on the left (full height), part B attached at the bottom right
      const tot = (length || 1) + (length2 || 1);
      const k = Math.min(250 / tot, 160 / Math.max(width || 1, width2 || 1));
      const aw = (length || 1) * k;
      const ah = (width || 1) * k;
      const bw = (length2 || 1) * k;
      const bh = (width2 || 1) * k;
      const x0 = cx - (aw + bw) / 2;
      const yb = cy + Math.max(ah, bh) / 2;
      body = (
        <g>
          <rect x={x0} y={yb - ah} width={aw} height={ah} fill={FILL} stroke={EDGE} strokeWidth={2} />
          <rect x={x0 + aw} y={yb - bh} width={bw} height={bh} fill="#DDD6FE" stroke="#6D28D9" strokeWidth={2} />
          <text className={s.onTop} x={x0 + aw / 2} y={yb - ah / 2 + 4} textAnchor="middle">
            A
          </text>
          <text className={s.onTop} x={x0 + aw + bw / 2} y={yb - bh / 2 + 4} textAnchor="middle">
            B
          </text>
          <text className={s.label} x={x0 + aw / 2} y={yb + 18} textAnchor="middle">
            {u(length)}
          </text>
          <text className={s.label} x={x0 - 6} y={yb - ah / 2 + 4} textAnchor="end">
            {u(width)}
          </text>
          <text className={s.label} x={x0 + aw + bw / 2} y={yb + 18} textAnchor="middle">
            {u(length2)}
          </text>
          <text className={s.label} x={x0 + aw + bw + 6} y={yb - bh / 2 + 4}>
            {u(width2)}
          </text>
        </g>
      );
    } else {
      const k = Math.min(180 / (length || 1), 150 / (width || 1));
      const w = (length || 1) * k;
      const h = (width || 1) * k;
      const rcx = cx + 30;
      body = (
        <g>
          <defs>
            <pattern id={hid} width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill={FILL} />
              <path d="M16 0 V16 H0" fill="none" stroke="#93C5FD" strokeWidth={1} />
            </pattern>
          </defs>
          <rect x={rcx - w / 2} y={cy - h / 2} width={w} height={h} fill={`url(#${hid})`} stroke={EDGE} strokeWidth={2} />
          <text className={s.onTop} x={rcx} y={cy + 5} textAnchor="middle">
            {u(length)} × {u(width)}
          </text>
          <line className={s.dim} x1={rcx - w / 2} y1={cy + h / 2 + 14} x2={rcx + w / 2} y2={cy + h / 2 + 14} />
          <text className={s.label} x={rcx} y={cy + h / 2 + 30} textAnchor="middle">
            length {u(length)}
          </text>
          <line className={s.dim} x1={rcx - w / 2 - 12} y1={cy - h / 2} x2={rcx - w / 2 - 12} y2={cy + h / 2} />
          <text className={s.label} x={rcx - w / 2 - 16} y={cy + 4} textAnchor="end">
            width {u(width)}
          </text>
        </g>
      );
    }
    return body;
  };
  return <StepFrame art={art} steps={steps} artTop={20} />;
}

/** Several rooms side by side; subtracted areas (closets, islands) are hatched red. */
export function RoomsAreaDiagram({ rooms, steps }: { rooms: { name: string; sqft: number; subtract: boolean }[]; steps: CalcStep[] }) {
  const shown = rooms.slice(0, 5);
  const max = Math.max(...shown.map((r) => r.sqft), 1);
  const art = (suffix: string) => {
    const hid = `sq-sub${suffix}`;
    let x = 22;
    return (
      <g>
        <defs>
          <pattern id={hid} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="#FEE2E2" />
            <path d="M0 0 V8" stroke="#B91C1C" strokeWidth={2} />
          </pattern>
        </defs>
        {shown.map((r, i) => {
          const side = Math.max(Math.sqrt(r.sqft / max) * 110, 26);
          const rx = x;
          x += side + 10;
          return (
            <g key={i}>
              <rect x={rx} y={190 - side} width={side} height={side} fill={r.subtract ? `url(#${hid})` : FILL} stroke={r.subtract ? '#B91C1C' : EDGE} strokeWidth={1.6} />
              <text className={s.label} x={rx + side / 2} y={190 - side / 2 + 4} textAnchor="middle">
                {r.subtract ? '−' : '+'}
              </text>
              <text className={s.small} x={rx + side / 2} y={206} textAnchor="middle">
                {r.name.length > 10 ? `${r.name.slice(0, 9)}…` : r.name}
              </text>
              <text className={s.small} x={rx + side / 2} y={220} textAnchor="middle">
                {`${+r.sqft.toFixed(1)} ft²`}
              </text>
            </g>
          );
        })}
        <text className={s.small} x={22} y={250}>
          {rooms.length > shown.length ? `first ${shown.length} of ${rooms.length} areas · ` : ''}blue = added · red = subtracted
        </text>
      </g>
    );
  };
  return <StepFrame art={art} steps={steps} artTop={40} />;
}
