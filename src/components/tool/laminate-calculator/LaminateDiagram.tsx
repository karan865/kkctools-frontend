import React from 'react';
import s from '../shared/AreaDepthDiagram.module.css';
import { StepFrame, type CalcStep } from '../shared/AreaDepthDiagram';

interface Props {
  lengthFt: number;
  widthFt: number;
  /** straight | complex | diagonal | herringbone | custom */
  pattern: string;
  /** plank face size in inches (drawing only) */
  plankLengthIn: number;
  plankWidthIn: number;
  boxLabel: string;
  placeholder: boolean;
  steps: CalcStep[];
}

const PLANK = ['#C89B6D', '#B98A5C', '#D4A97C', '#BF9064'];

/** Top-down room plan with planks in the chosen layout; boards cut at the walls are the waste. */
export default function LaminateDiagram({ lengthFt, widthFt, pattern, plankLengthIn, plankWidthIn, boxLabel, placeholder, steps }: Props) {
  const L = lengthFt > 0 ? lengthFt : 12;
  const W = widthFt > 0 ? widthFt : 10;
  const k = Math.min(240 / L, 170 / W);
  const w = L * k;
  const h = W * k;
  const x0 = 62 + (240 - w) / 2;
  const y0 = 40 + (170 - h) / 2;
  // planks drawn a little larger than real so they stay visible
  const pl = Math.max((plankLengthIn / 12) * k, 26);
  const pw = Math.max((plankWidthIn / 12) * k, 7);
  const art = (suffix: string) => {
    const clip = `lam-c${suffix}`;
    const rows = Math.ceil((h * 1.6) / pw) + 4;
    const cols = Math.ceil((w * 1.6) / pl) + 3;
    const planks: React.ReactNode[] = [];
    if (pattern === 'herringbone') {
      // zig-zag columns of planks at ±45° (reads as herringbone at this size)
      const len = Math.max(pl * 0.6, pw * 3);
      const colW = len * Math.SQRT1_2;
      const stepY = pw * Math.SQRT2;
      for (let c = -1; c < w / colW + 2; c++)
        for (let r = -2; r < h / stepY + 4; r++) {
          const cx = x0 + c * colW;
          const cy = y0 + r * stepY;
          const up = c % 2 === 0;
          planks.push(
            <rect
              key={`${r}-${c}`}
              x={cx}
              y={cy}
              width={len}
              height={pw}
              fill={PLANK[Math.abs(r + c * 3) % 4]}
              stroke="#8A6440"
              strokeWidth={0.5}
              transform={up ? `rotate(45 ${cx} ${cy})` : `rotate(-45 ${cx + colW} ${cy + colW})`}
            />,
          );
        }
    } else {
      const angle = pattern === 'diagonal' ? -45 : 0;
      for (let r = -rows; r < rows; r++) {
        const off = ((r * 0.37) % 1) * pl; // random-looking stagger
        for (let c = -cols; c < cols; c++) {
          planks.push(<rect key={`${r}-${c}`} x={x0 + c * pl - off} y={y0 + r * pw} width={pl} height={pw} fill={PLANK[Math.abs(r * 7 + c * 3) % 4]} stroke="#8A6440" strokeWidth={0.5} />);
        }
      }
      return (
        <g>
          <defs>
            <clipPath id={clip}>
              <rect x={x0} y={y0} width={w} height={h} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <g transform={angle ? `rotate(${angle} ${x0 + w / 2} ${y0 + h / 2})` : undefined}>{planks}</g>
          </g>
          {frame(suffix)}
        </g>
      );
    }
    return (
      <g>
        <defs>
          <clipPath id={clip}>
            <rect x={x0} y={y0} width={w} height={h} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clip})`}>
          <rect x={x0} y={y0} width={w} height={h} fill="#B98A5C" />
          {planks}
        </g>
        {frame(suffix)}
      </g>
    );
  };
  const frame = (suffix: string) => (
    <g key={`f${suffix}`}>
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke="var(--ink-2)" strokeWidth={3} />
      {/* cut pieces at the right wall = waste */}
      <rect x={x0 + w - pl * 0.35} y={y0} width={pl * 0.35} height={h} fill="var(--brand-orange)" opacity={0.18} />
      <line className={s.dim} x1={x0} y1={y0 + h + 14} x2={x0 + w} y2={y0 + h + 14} />
      <text className={s.label} x={x0 + w / 2} y={y0 + h + 30} textAnchor="middle">
        {placeholder ? 'length (example 12 ft)' : `${lengthFt} ft`}
      </text>
      <line className={s.dim} x1={x0 - 12} y1={y0} x2={x0 - 12} y2={y0 + h} />
      <text className={s.label} x={x0 - 16} y={y0 + h / 2 + 4} textAnchor="end">
        {placeholder ? '10 ft' : `${widthFt} ft`}
      </text>
      {/* box */}
      <g transform={`translate(22, ${y0 + h + 44})`}>
        <rect width={34} height={20} rx={2} fill="#C68A4E" stroke="#8A5A2B" />
        <path d="M0 6 H34" stroke="#8A5A2B" />
        <text className={s.small} x={42} y={14}>
          {boxLabel} · orange strip = cut-off ends (waste)
        </text>
      </g>
    </g>
  );
  return <StepFrame art={art} steps={steps} artTop={Math.max(0, Math.floor(y0 - 20))} />;
}
