import React from 'react';
import s from './CubicSquareDiagram.module.css';

/* "Volume = area × depth" drawn as a cube spread into a thin layer. Values are also shown as
   text next to the drawing, so it is hidden from assistive tech. */
export function SpreadDiagram({ volumeLabel, areaLabel, depthLabel, toArea }: { volumeLabel: string; areaLabel: string; depthLabel: string; toArea: boolean }) {
  // cube (left)
  const cx = 62;
  const cy = 84;
  const a = 34;
  return (
    <svg className={s.svg} viewBox="0 0 340 170" aria-hidden="true" focusable="false">
      <defs>
        <marker id="cs-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path className={s.arrowHead} d="M0 0 L10 5 L0 10 Z" />
        </marker>
      </defs>
      {/* cube */}
      <polygon className={s.top} points={`${cx},${cy - a} ${cx + a * 0.87},${cy - a * 0.5} ${cx},${cy} ${cx - a * 0.87},${cy - a * 0.5}`} />
      <polygon className={s.left} points={`${cx - a * 0.87},${cy - a * 0.5} ${cx},${cy} ${cx},${cy + a} ${cx - a * 0.87},${cy + a * 0.5}`} />
      <polygon className={s.right} points={`${cx},${cy} ${cx + a * 0.87},${cy - a * 0.5} ${cx + a * 0.87},${cy + a * 0.5} ${cx},${cy + a}`} />
      <text className={s.label} x={cx} y={cy + a + 22} textAnchor="middle">
        {volumeLabel}
      </text>
      <text className={s.small} x={cx} y={cy + a + 36} textAnchor="middle">
        volume
      </text>

      {/* arrow */}
      <line className={s.arrow} x1={toArea ? 112 : 168} y1={78} x2={toArea ? 168 : 112} y2={78} markerEnd="url(#cs-arrow)" />
      <text className={s.small} x={140} y={70} textAnchor="middle">
        {toArea ? '÷ depth' : '× depth'}
      </text>

      {/* thin slab: isometric parallelogram */}
      {(() => {
        const O: [number, number] = [232, 50];
        const vx: [number, number] = [0.87 * 84, 0.5 * 84];
        const vy: [number, number] = [-0.87 * 58, 0.5 * 58];
        const P = (a: number, b: number, dz = 0): string => `${O[0] + vx[0] * a + vy[0] * b},${O[1] + vx[1] * a + vy[1] * b + dz}`;
        const h = 8;
        const cxy = [O[0] + (vx[0] + vy[0]) / 2, O[1] + (vx[1] + vy[1]) / 2];
        const right = [O[0] + vx[0], O[1] + vx[1]];
        return (
          <g>
            <polygon className={s.top} points={`${P(0, 0)} ${P(1, 0)} ${P(1, 1)} ${P(0, 1)}`} />
            <polygon className={s.left} points={`${P(0, 1)} ${P(1, 1)} ${P(1, 1, h)} ${P(0, 1, h)}`} />
            <polygon className={s.right} points={`${P(1, 0)} ${P(1, 1)} ${P(1, 1, h)} ${P(1, 0, h)}`} />
            <text className={s.label} x={cxy[0]} y={cxy[1] + 4} textAnchor="middle">
              {areaLabel}
            </text>
            <line className={s.dim} x1={right[0] + 8} y1={right[1]} x2={right[0] + 8} y2={right[1] + h} />
            <text className={s.labelAccent} x={right[0] + 13} y={right[1] + 7}>
              {depthLabel}
            </text>
            <text className={s.small} x={cxy[0]} y={cxy[1] + 62} textAnchor="middle">
              area × depth
            </text>
          </g>
        );
      })()}
    </svg>
  );
}
