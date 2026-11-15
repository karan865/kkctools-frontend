import React from 'react';
import s from './FloorDiagram.module.css';
import type { Method } from '@/lib/floor-refinish-engine';

/* Cross-section of two floor boards (layers exaggerated) showing how deep each method cuts.
   Everything it says is also in the text around it, so it is hidden from assistive tech. */
export function BoardSection({ method, engineered, stained, idPrefix = 'fr' }: { method: Method; engineered: boolean; stained: boolean; idPrefix?: string }) {
  const x0 = 24;
  const x1 = 214;
  const seam = 119;
  const top = 46; // top of the finish
  const coatH = 6;
  const finishBottom = top + coatH * 3;
  const stainBottom = finishBottom + 6;
  const woodTop = stainBottom;
  const wearBottom = woodTop + 22; // engineered wear layer
  const bottom = 156;
  const cut = method === 'recoat' ? top + 3 : woodTop + 6;
  const grain = `${idPrefix}-grain`;
  const ply = `${idPrefix}-ply`;
  const removed = `${idPrefix}-removed`;
  const lx = 232; // label column
  return (
    <svg className={s.svg} viewBox="0 0 372 196" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={grain} width="40" height="10" patternUnits="userSpaceOnUse">
          <rect width="40" height="10" className={s.wood} />
          <path d="M0 5 Q10 2 20 5 T40 5" className={s.grainLine} />
        </pattern>
        <pattern id={ply} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" className={s.ply} />
          <path d="M0 6 H12" className={s.plyLine} />
        </pattern>
        <pattern id={removed} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" className={s.removedBg} />
          <path d="M0 0 V6" className={s.removedLine} />
        </pattern>
      </defs>

      {/* wood body */}
      {engineered ? (
        <>
          <rect x={x0} y={woodTop} width={x1 - x0} height={wearBottom - woodTop} fill={`url(#${grain})`} />
          <rect x={x0} y={wearBottom} width={x1 - x0} height={bottom - wearBottom} fill={`url(#${ply})`} />
          <line className={s.edge} x1={x0} y1={wearBottom} x2={x1} y2={wearBottom} />
        </>
      ) : (
        <rect x={x0} y={woodTop} width={x1 - x0} height={bottom - woodTop} fill={`url(#${grain})`} />
      )}
      {/* stain + finish coats */}
      {stained && <rect className={s.stain} x={x0} y={finishBottom} width={x1 - x0} height={stainBottom - finishBottom} />}
      {[0, 1, 2].map((i) => (
        <rect key={i} className={s.coat} x={x0} y={top + i * coatH} width={x1 - x0} height={coatH} style={{ opacity: 0.55 + i * 0.12 }} />
      ))}
      {/* what the method takes off */}
      <rect x={x0} y={top - 1} width={x1 - x0} height={cut - top + 1} fill={`url(#${removed})`} />
      <line className={s.cut} x1={x0 - 8} y1={cut} x2={x1 + 8} y2={cut} />
      {/* boards: outline, seam and tongue */}
      <rect className={s.board} x={x0} y={top} width={x1 - x0} height={bottom - top} />
      <line className={s.edge} x1={seam} y1={top} x2={seam} y2={bottom} />
      <path className={s.edge} d={`M${seam} ${bottom - 52} h6 v14 h-6`} />

      {/* labels */}
      <text className={s.labelAccent} x={x0} y={top - 14}>
        {method === 'recoat' ? 'Screening scuffs the top coat only' : 'Sanding removes all finish + a skin of wood'}
      </text>
      <line className={s.leader} x1={x1 + 2} y1={top + coatH * 1.5} x2={lx - 4} y2={top + coatH * 1.5} />
      <text className={s.label} x={lx} y={top + coatH * 1.5 + 4}>
        Finish coats
      </text>
      {stained && (
        <>
          <line className={s.leader} x1={x1 + 2} y1={(finishBottom + stainBottom) / 2} x2={lx - 4} y2={top + 28} />
          <text className={s.label} x={lx} y={top + 32}>
            Stain
          </text>
        </>
      )}
      {engineered ? (
        <>
          <line className={s.leader} x1={x1 + 2} y1={(woodTop + wearBottom) / 2} x2={lx - 4} y2={(woodTop + wearBottom) / 2 + 10} />
          <text className={s.label} x={lx} y={(woodTop + wearBottom) / 2 + 14}>
            Hardwood wear layer
          </text>
          <text className={s.small} x={lx} y={(woodTop + wearBottom) / 2 + 27}>
            all you can ever sand
          </text>
          <line className={s.leader} x1={x1 + 2} y1={(wearBottom + bottom) / 2 + 10} x2={lx - 4} y2={(wearBottom + bottom) / 2 + 10} />
          <text className={s.label} x={lx} y={(wearBottom + bottom) / 2 + 14}>
            Plywood core
          </text>
        </>
      ) : (
        <>
          <line className={s.leader} x1={x1 + 2} y1={(woodTop + bottom) / 2 + 8} x2={lx - 4} y2={(woodTop + bottom) / 2 + 8} />
          <text className={s.label} x={lx} y={(woodTop + bottom) / 2 + 12}>
            Solid hardwood
          </text>
          <text className={s.small} x={lx} y={(woodTop + bottom) / 2 + 25}>
            down to the tongue
          </text>
        </>
      )}
      <text className={s.small} x={x0} y={bottom + 22}>
        Layers not to scale
      </text>
    </svg>
  );
}

/* Top-down plan of the rooms (to scale with each other) with plank direction and an optional staircase. */
export function RoomsPlan({ rooms, unit, areaLabel, steps, idPrefix = 'fr' }: { rooms: { l: number; w: number; area: string }[]; unit: string; areaLabel: string; steps: number; idPrefix?: string }) {
  const shown = rooms.filter((r) => r.l > 0 && r.w > 0).slice(0, 6);
  const gap = 10;
  const stairsW = steps > 0 ? 56 : 0;
  const maxW = 330 - stairsW - gap * Math.max(shown.length - 1, 0);
  const maxH = 120;
  const sumL = shown.reduce((a, r) => a + r.l, 0) || 1;
  const maxWd = Math.max(...shown.map((r) => r.w), 1);
  const k = Math.min(maxW / sumL, maxH / maxWd);
  const planks = `${idPrefix}-planks`;
  const top = 30;
  const xs = shown.map((_, i) => 16 + shown.slice(0, i).reduce((a, r) => a + r.l * k + gap, 0));
  const stairsX = 16 + shown.reduce((a, r) => a + r.l * k + gap, 0);
  return (
    <svg className={s.svg} viewBox="0 0 360 200" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={planks} width="48" height="8" patternUnits="userSpaceOnUse">
          <rect width="48" height="8" className={s.plank} />
          <path d="M0 8 H48 M30 0 V8" className={s.plankLine} />
        </pattern>
      </defs>
      {shown.map((r, i) => {
        const w = r.l * k;
        const h = r.w * k;
        const rx = xs[i];
        return (
          <g key={i}>
            <rect className={s.room} x={rx} y={top} width={w} height={h} fill={`url(#${planks})`} />
            {w >= 44 && h >= 26 && (
              <text className={s.label} x={rx + w / 2} y={top + h / 2 + 4} textAnchor="middle">
                {r.area}
              </text>
            )}
            {w >= 44 && (
              <text className={s.small} x={rx + w / 2} y={top + h + 14} textAnchor="middle">
                {`${+r.l.toFixed(2)} × ${+r.w.toFixed(2)} ${unit}`}
              </text>
            )}
          </g>
        );
      })}
      {steps > 0 && (
        <g>
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} className={s.tread} x={stairsX + 4} y={top + i * 16} width={44} height={14} rx={1} />
          ))}
          <text className={s.small} x={stairsX + 26} y={top + 6 * 16 + 14} textAnchor="middle">
            {steps} step{steps === 1 ? '' : 's'}
          </text>
        </g>
      )}
      <text className={s.labelAccent} x={16} y={top - 12}>
        {areaLabel}
      </text>
      {rooms.filter((r) => r.l > 0 && r.w > 0).length > shown.length && (
        <text className={s.small} x={16} y={192}>
          First 6 rooms shown
        </text>
      )}
    </svg>
  );
}

export interface Bar {
  label: string;
  amount: number;
  sub?: string;
  active?: boolean;
  tone: 'recoat' | 'sand' | 'dustless' | 'diy' | 'replace';
}
/* Horizontal bars comparing the options for the same floor. */
export function OptionBars({ bars, format }: { bars: Bar[]; format: (n: number) => string }) {
  const max = Math.max(...bars.map((b) => b.amount), 1);
  return (
    <div className={s.compare}>
      {bars.map((b) => (
        <div key={b.label} className={`${s.barRow} ${b.active ? s.barActive : ''}`}>
          <span className={s.barName}>
            {b.label}
            {b.sub && <span className={s.barSub}>{b.sub}</span>}
          </span>
          <span className={s.track}>
            <span className={`${s.fill} ${s[b.tone]}`} style={{ width: `${Math.max((b.amount / max) * 100, 1.5)}%` }} />
          </span>
          <strong className={s.barValue}>{format(b.amount)}</strong>
        </div>
      ))}
    </div>
  );
}
