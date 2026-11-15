import React from "react";
import s from "./AreaDepthDiagram.module.css";
import { StepsList, type CalcStep } from "./AreaDepthDiagram";

interface Props {
  /** paver size labels */
  paverL: string;
  paverW: string;
  /** paver length ÷ width (drawing only) */
  ratio: number;
  joint: string;
  depth: string;
  steps: CalcStep[];
}

/**
 * Top view of a few pavers with the joints between them, plus a cross-section showing the joint depth,
 * and the calculation steps on the right. Decorative for assistive tech (all values are in the results).
 */
export default function PaverJointDiagram({
  paverL,
  paverW,
  ratio,
  joint,
  depth,
  steps,
}: Props) {
  const r = Math.min(
    Math.max(Number.isFinite(ratio) && ratio > 0 ? ratio : 1.5, 0.5),
    2.5,
  );
  const ph = Math.min(46, 62 / r); // paver drawn width (y), capped so the side view fits
  const pw = ph * r; // paver drawn length (x), keeps the real proportion
  const g = 6; // drawn joint (exaggerated)
  const x0 = 40;
  const y0 = 34;
  const cols = pw < 40 ? 5 : 3;
  const rows = 3;
  const pavers: React.ReactNode[] = [];
  for (let i = 0; i < rows; i++)
    for (let j = 0; j <= cols; j++) {
      const off = i % 2 ? (pw + g) / 2 : 0; // running bond
      const x = x0 + j * (pw + g) - off;
      if (x + pw < x0 - 1) continue;
      const cx = Math.max(x, x0);
      const w = Math.min(x + pw, x0 + cols * (pw + g) - g) - cx;
      if (w <= 2) continue;
      pavers.push(
        <rect
          key={`${i}-${j}`}
          x={cx}
          y={y0 + i * (ph + g)}
          width={w}
          height={ph}
          rx={2}
          fill="#C2703D"
          stroke="#7A4221"
          strokeWidth={1}
        />,
      );
    }
  const gridW = cols * (pw + g) - g;
  const gridH = rows * (ph + g) - g;
  // cross-section below the top view
  const csY = y0 + gridH + 34;
  const csH = 34;
  const shown = steps.slice(0, 4);
  const sy0 = Math.max(
    14,
    (270 - shown.length * 46 - (shown.length - 1) * 18) / 2,
  );
  const art = (
    <>
      {/* joints (sand) background */}
      <rect x={x0} y={y0} width={gridW} height={gridH} fill="#E9C97F" />
      {pavers}
      {/* paver dims on the first full paver */}
      <line className={s.dim} x1={x0} y1={y0 - 10} x2={x0 + pw} y2={y0 - 10} />
      <text className={s.label} x={x0 + pw / 2} y={y0 - 15} textAnchor="middle">
        {paverL}
      </text>
      <line className={s.dim} x1={x0 - 10} y1={y0} x2={x0 - 10} y2={y0 + ph} />
      <text
        className={s.label}
        x={x0 - 14}
        y={y0 + ph / 2 + 4}
        textAnchor="end"
      >
        {paverW}
      </text>
      {/* joint callout */}
      <line
        className={s.dimAccent}
        x1={x0 + pw}
        y1={y0 + ph / 2}
        x2={x0 + pw + g}
        y2={y0 + ph / 2}
      />
      <path
        className={s.dim}
        d={`M${x0 + pw + g / 2} ${y0 + 2} L${x0 + pw + g / 2 + 18} ${y0 - 12}`}
      />
      <text className={s.labelAccent} x={x0 + pw + g / 2 + 22} y={y0 - 12}>
        joint {joint}
      </text>

      {/* cross-section: two pavers with a joint filled to depth */}
      <rect
        x={x0}
        y={csY}
        width={gridW / 2 - g / 2}
        height={csH}
        fill="#C2703D"
        stroke="#7A4221"
      />
      <rect
        x={x0 + gridW / 2 + g / 2}
        y={csY}
        width={gridW / 2 - g / 2}
        height={csH}
        fill="#C2703D"
        stroke="#7A4221"
      />
      <rect
        x={x0 + gridW / 2 - g / 2}
        y={csY + 3}
        width={g}
        height={csH - 3}
        fill="#E9C97F"
        stroke="#A87F2C"
        strokeWidth={0.8}
      />
      <rect
        x={x0}
        y={csY + csH}
        width={gridW}
        height={10}
        fill="#D4A84F"
        opacity={0.6}
      />
      <line
        className={s.dim}
        x1={x0 + gridW + 10}
        y1={csY + 3}
        x2={x0 + gridW + 10}
        y2={csY + csH}
      />
      <text className={s.labelAccent} x={x0 + gridW + 16} y={csY + csH / 2 + 4}>
        depth {depth}
      </text>
      <text className={s.small} x={x0} y={csY + csH + 26}>
        side view · joints drawn wider than real
      </text>
    </>
  );
  return (
    <>
      <svg
        className={`${s.svg} ${s.wide}`}
        viewBox="0 0 560 290"
        aria-hidden="true"
        focusable="false"
      >
        {art}
        <StepsList steps={shown} x={318} y0={sy0} width={234} />
      </svg>
      <svg
        className={`${s.svg} ${s.stacked}`}
        viewBox={`0 0 330 ${300 + shown.length * 64}`}
        aria-hidden="true"
        focusable="false"
      >
        {art}
        <StepsList steps={shown} x={14} y0={300} width={306} />
      </svg>
    </>
  );
}
