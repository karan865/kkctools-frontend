import React from 'react';
import s from '../shared/AreaDepthDiagram.module.css';
import { StepFrame, type CalcStep } from '../shared/AreaDepthDiagram';
import type { PicketStyle } from '@/lib/fence-stain-engine';

interface Props {
  style: PicketStyle;
  lengthLabel: string;
  heightLabel: string;
  bothSides: boolean;
  coats: number;
  steps: CalcStep[];
}

const WOOD = { board: '#C68A4E', boardDark: '#8A5A2B', stained: '#8B4A22', rail: '#A86F3A' };

/** One fence section in the chosen picket style, with the stained side(s) and the steps. */
export default function FenceStainDiagram({ style, lengthLabel, heightLabel, bothSides, coats, steps }: Props) {
  const x0 = 60;
  const y0 = 70;
  const w = 220;
  const h = 130;
  const boards: React.ReactNode[] = [];
  const b = (x: number, bw: number, key: string, fill = WOOD.stained, y = y0, bh = h) => (
    <rect key={key} x={x} y={y} width={bw} height={bh} fill={fill} stroke={WOOD.boardDark} strokeWidth={0.8} />
  );
  if (style === 'split-rail') {
    // posts with 3 horizontal rails
    for (let i = 0; i <= 2; i++) boards.push(b(x0 + i * (w / 2) - 6, 12, `p${i}`, WOOD.boardDark, y0 - 6, h + 6));
    for (let r = 0; r < 3; r++) boards.push(<rect key={`r${r}`} x={x0} y={y0 + 18 + r * 40} width={w} height={12} rx={5} fill={WOOD.stained} stroke={WOOD.boardDark} strokeWidth={0.8} />);
  } else {
    const n = 12;
    const bw = w / n;
    // rails behind
    boards.push(<rect key="r1" x={x0} y={y0 + 20} width={w} height={8} fill={WOOD.rail} />);
    boards.push(<rect key="r2" x={x0} y={y0 + h - 30} width={w} height={8} fill={WOOD.rail} />);
    for (let i = 0; i < n; i++) {
      const x = x0 + i * bw;
      if (style === 'spaced-picket') boards.push(b(x + bw * 0.18, bw * 0.64, `b${i}`));
      else if (style === 'board-on-board' || style === 'shadowbox') {
        const front = i % 2 === 0;
        const bx = front ? x - bw * (style === 'board-on-board' ? 0.12 : 0) : x;
        boards.push(b(bx, bw * (style === 'board-on-board' ? 1.24 : 1), `b${i}`, front ? WOOD.stained : '#6E3A1A'));
      } else boards.push(b(x, bw, `b${i}`));
    }
  }
  const art = () => (
    <g>
      {/* second side shown as a ghost behind */}
      {bothSides && (
        <g opacity={0.45}>
          <rect x={x0 + 16} y={y0 - 12} width={w} height={h} fill={WOOD.stained} stroke={WOOD.boardDark} />
          <text className={s.small} x={x0 + w + 20} y={y0 - 2}>
            side 2
          </text>
        </g>
      )}
      {boards}
      <text className={s.small} x={x0} y={y0 - 22}>
        {bothSides ? 'both sides stained' : 'one side stained'} · {coats} coat{coats > 1 ? 's' : ''}
      </text>
      {/* brush */}
      <g transform={`translate(${x0 + w - 30}, ${y0 + h * 0.45}) rotate(-35)`}>
        <rect x={-6} y={-30} width={12} height={22} rx={2} fill="#E7C27D" stroke="#8A5A2B" />
        <rect x={-4} y={-8} width={8} height={6} fill="#94A3B8" />
        <rect x={-2} y={-2} width={4} height={26} rx={2} fill="#7C3AED" />
      </g>
      {/* dimensions */}
      <line className={s.dim} x1={x0} y1={y0 + h + 14} x2={x0 + w} y2={y0 + h + 14} />
      <text className={s.label} x={x0 + w / 2} y={y0 + h + 30} textAnchor="middle">
        {lengthLabel}
      </text>
      <line className={s.dim} x1={x0 - 12} y1={y0} x2={x0 - 12} y2={y0 + h} />
      <text className={s.label} x={x0 - 16} y={y0 + h / 2 + 4} textAnchor="end">
        {heightLabel}
      </text>
    </g>
  );
  return <StepFrame art={art} steps={steps} artTop={30} />;
}
