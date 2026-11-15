import React from 'react';
import s from '../shared/AreaDepthDiagram.module.css';
import { StepFrame, type CalcStep } from '../shared/AreaDepthDiagram';

const BOARD = { fill: '#D4A97C', dark: '#8A6440' };

/** Pieces laid end to end along a tape: each row is "length × quantity". */
export function PiecesDiagram({ rows, totalLabel, steps }: { rows: { feet: number; label: string; qty: number }[]; totalLabel: string; steps: CalcStep[] }) {
  const shown = rows.filter((r) => r.feet > 0 && r.qty > 0).slice(0, 4);
  const maxFt = Math.max(...shown.map((r) => r.feet), 1);
  const maxW = 220;
  const art = () => (
    <g>
      {shown.map((r, i) => {
        const y = 46 + i * 46;
        const bw = Math.max((r.feet / maxFt) * maxW, 18);
        return (
          <g key={i}>
            <rect x={30} y={y} width={bw} height={20} rx={2} fill={BOARD.fill} stroke={BOARD.dark} />
            <path d={`M${36} ${y + 7} Q${30 + bw / 2} ${y + 3} ${24 + bw} ${y + 8}`} fill="none" stroke={BOARD.dark} strokeWidth={0.6} opacity={0.6} />
            <text className={s.label} x={30} y={y - 4}>
              {r.label}
            </text>
            <text className={s.labelAccent} x={38 + bw} y={y + 15}>
              × {r.qty}
            </text>
          </g>
        );
      })}
      {/* tape with all pieces end to end */}
      {(() => {
        const y = 46 + shown.length * 46 + 20;
        const total = shown.reduce((a, r) => a + r.feet * r.qty, 0) || 1;
        let x = 30;
        const segs: React.ReactNode[] = [];
        shown.forEach((r, i) => {
          for (let q = 0; q < Math.min(r.qty, 30); q++) {
            const sw = (r.feet / total) * 270;
            segs.push(<rect key={`${i}-${q}`} x={x} y={y} width={Math.max(sw, 0.8)} height={20} fill={i % 2 ? '#C89B6D' : BOARD.fill} stroke={BOARD.dark} strokeWidth={0.5} />);
            x += sw;
          }
        });
        return (
          <g>
            <text className={s.small} x={30} y={y - 6}>
              all pieces end to end
            </text>
            {segs}
            <rect x={30} y={y + 24} width={270} height={12} rx={2} fill="#FACC15" stroke="#A16207" />
            {Array.from({ length: 11 }, (_, t) => (
              <line key={t} x1={30 + t * 27} y1={y + 24} x2={30 + t * 27} y2={y + (t % 5 === 0 ? 36 : 30)} stroke="#713F12" strokeWidth={0.8} />
            ))}
            <text className={s.label} x={165} y={y + 54} textAnchor="middle">
              {totalLabel}
            </text>
          </g>
        );
      })()}
    </g>
  );
  return <StepFrame art={art} steps={steps} artTop={10} />;
}

/** An area turned into a long strip of a given width (or a strip turned into an area). */
export function StripDiagram({ toLinear, areaLabel, widthLabel, lengthLabel, steps }: { toLinear: boolean; areaLabel: string; widthLabel: string; lengthLabel: string; steps: CalcStep[] }) {
  const art = () => (
    <g>
      {/* the area */}
      <rect x={24} y={44} width={110} height={110} fill="#BFDBFE" stroke="#1D4ED8" strokeWidth={1.4} />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={24} y1={44 + i * 18.3} x2={134} y2={44 + i * 18.3} stroke="#1D4ED8" strokeWidth={0.6} strokeDasharray="3 2" />
      ))}
      <text className={s.label} x={79} y={176} textAnchor="middle">
        {areaLabel}
      </text>
      <text className={s.small} x={79} y={190} textAnchor="middle">
        area
      </text>
      {/* arrow */}
      <path d={toLinear ? 'M132 95 H170 M162 88 L171 95 L162 102' : 'M170 95 H132 M140 88 L131 95 L140 102'} fill="none" className={s.dimAccent} />
      <text className={s.labelAccent} x={151} y={80} textAnchor="middle">
        {toLinear ? '÷ width' : '× width'}
      </text>
      {/* the strip, folded in rows to fit */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={186} y={44 + i * 17} width={118} height={11} fill="#93C5FD" stroke="#1D4ED8" strokeWidth={1} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={i % 2 === 0 ? `M304 ${49.5 + i * 17} q9 8.5 0 17` : `M186 ${49.5 + i * 17} q-9 8.5 0 17`} fill="none" stroke="#1D4ED8" strokeWidth={1} />
      ))}
      <line className={s.dimAccent} x1={180} y1={44} x2={180} y2={55} />
      <text className={s.labelAccent} x={176} y={40} textAnchor="end">
        {widthLabel}
      </text>
      <text className={s.label} x={245} y={176} textAnchor="middle">
        {lengthLabel}
      </text>
      <text className={s.small} x={245} y={190} textAnchor="middle">
        one long strip (shown folded)
      </text>
    </g>
  );
  return <StepFrame art={art} steps={steps} artTop={20} />;
}
