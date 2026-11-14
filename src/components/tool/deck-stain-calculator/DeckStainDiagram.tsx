import React from 'react';
import s from './DeckStainDiagram.module.css';

/* Diagrams for the deck stain tool and page. Labels repeat values shown as text elsewhere,
   so the drawings are hidden from assistive tech. */

// isometric projection: x along the deck length, y along its width, z up
const S = 15;
const CX = 150;
const CY = 70;
const C30 = Math.cos(Math.PI / 6);
const iso = (x: number, y: number, z: number): [number, number] => [CX + (x - y) * C30 * S, CY + (x + y) * 0.5 * S - z * S];
const pts = (...p: [number, number, number][]) => p.map((q) => iso(...q).join(',')).join(' ');

export function DeckDiagram({
  railing,
  stairs,
  skirting,
  labels,
}: {
  railing: boolean;
  stairs: boolean;
  skirting: boolean;
  labels: { floor: string; railing?: string; stairs?: string; skirting?: string };
}) {
  const L = 10;
  const W = 7;
  const H = 2.6;
  const RH = 1.6; // railing height above the floor
  const stairX = 6.2; // stairs come down the front (y = W) edge
  const stairW = 2.2;
  const steps = 3;
  const tread = 0.9;
  const rise = H / steps;
  const boardLines = Array.from({ length: 13 }, (_, i) => ((i + 1) * W) / 14);
  const backPosts = [0, 2.5, 5, 7.5, 10];
  const sidePosts = [0, 3.5, 7];
  return (
    <svg className={s.svg} viewBox="0 0 330 250" aria-hidden="true" focusable="false">
      {/* ground shadow */}
      <polygon className={s.shadow} points={pts([-0.5, -0.5, 0], [L + 0.6, -0.5, 0], [L + 0.6, W + 3.4, 0], [-0.5, W + 3.4, 0])} />

      {/* railing behind the floor: back edge (y = 0) and left edge (x = 0) */}
      <g className={railing ? s.railOn : s.off}>
        {backPosts.map((x) => (
          <line key={`bp${x}`} className={s.post} x1={iso(x, 0, H)[0]} y1={iso(x, 0, H)[1]} x2={iso(x, 0, H + RH)[0]} y2={iso(x, 0, H + RH)[1]} />
        ))}
        {sidePosts.map((y) => (
          <line key={`sp${y}`} className={s.post} x1={iso(0, y, H)[0]} y1={iso(0, y, H)[1]} x2={iso(0, y, H + RH)[0]} y2={iso(0, y, H + RH)[1]} />
        ))}
        {Array.from({ length: 24 }, (_, i) => (i + 0.5) * (L / 24)).map((x) => (
          <line key={`bb${x}`} className={s.baluster} x1={iso(x, 0, H + 0.12)[0]} y1={iso(x, 0, H + 0.12)[1]} x2={iso(x, 0, H + RH - 0.12)[0]} y2={iso(x, 0, H + RH - 0.12)[1]} />
        ))}
        {Array.from({ length: 16 }, (_, i) => (i + 0.5) * (W / 16)).map((y) => (
          <line key={`sb${y}`} className={s.baluster} x1={iso(0, y, H + 0.12)[0]} y1={iso(0, y, H + 0.12)[1]} x2={iso(0, y, H + RH - 0.12)[0]} y2={iso(0, y, H + RH - 0.12)[1]} />
        ))}
        <polyline className={s.rail} points={pts([0, W, H + RH], [0, 0, H + RH], [L, 0, H + RH])} />
        <polyline className={s.railThin} points={pts([0, W, H + 0.12], [0, 0, H + 0.12], [L, 0, H + 0.12])} />
      </g>

      {/* skirting (front and right faces) */}
      <polygon className={skirting ? s.skirtOn : s.skirtOff} points={pts([0, W, H], [L, W, H], [L, W, 0], [0, W, 0])} />
      <polygon className={skirting ? s.skirtSideOn : s.skirtSideOff} points={pts([L, 0, H], [L, W, H], [L, W, 0], [L, 0, 0])} />
      {!skirting &&
        [1.2, 5, 8.8].map((x) => (
          <line key={`leg${x}`} className={s.leg} x1={iso(x, W, 0)[0]} y1={iso(x, W, 0)[1]} x2={iso(x, W, H)[0]} y2={iso(x, W, H)[1]} />
        ))}

      {/* floor */}
      <polygon className={s.floor} points={pts([0, 0, H], [L, 0, H], [L, W, H], [0, W, H])} />
      {boardLines.map((y) => (
        <line key={`b${y}`} className={s.board} x1={iso(0, y, H)[0]} y1={iso(0, y, H)[1]} x2={iso(L, y, H)[0]} y2={iso(L, y, H)[1]} />
      ))}
      <polygon className={s.fascia} points={pts([0, W, H], [L, W, H], [L, W, H - 0.25], [0, W, H - 0.25])} />
      <polygon className={s.fasciaSide} points={pts([L, 0, H], [L, W, H], [L, W, H - 0.25], [L, 0, H - 0.25])} />

      {/* stairs down the front edge */}
      {Array.from({ length: steps }, (_, i) => {
        const y0 = W + i * tread;
        const zTop = H - (i + 1) * rise;
        return (
          <g key={`st${i}`} className={stairs ? s.stairOn : s.off}>
            <polygon className={s.riser} points={pts([stairX, y0, zTop + rise], [stairX + stairW, y0, zTop + rise], [stairX + stairW, y0, zTop], [stairX, y0, zTop])} />
            <polygon className={s.tread} points={pts([stairX, y0, zTop], [stairX + stairW, y0, zTop], [stairX + stairW, y0 + tread, zTop], [stairX, y0 + tread, zTop])} />
          </g>
        );
      })}
      <polygon className={stairs ? s.stringerOn : s.off} points={pts([stairX + stairW, W, H], [stairX + stairW, W + steps * tread, 0], [stairX + stairW, W, 0])} />

      {/* labels */}
      <text className={s.label} x={iso(5, 3.5, H)[0]} y={iso(5, 3.5, H)[1] + 4} textAnchor="middle">
        Floor {labels.floor}
      </text>
      {railing && labels.railing && (
        <text className={s.label} x={iso(6, 0, H + RH)[0] + 8} y={iso(6, 0, H + RH)[1] - 8}>
          Railing {labels.railing}
        </text>
      )}
      {stairs && labels.stairs && (
        <text className={s.label} x={iso(stairX + stairW, W + steps * tread, 0)[0] + 6} y={iso(stairX + stairW, W + steps * tread, 0)[1] + 2}>
          Stairs {labels.stairs}
        </text>
      )}
      {skirting && labels.skirting && (
        <text className={s.label} x={iso(1.5, W, H * 0.4)[0]} y={iso(1.5, W, H * 0.4)[1]}>
          Skirting {labels.skirting}
        </text>
      )}
    </svg>
  );
}

/** Front view of one railing bay: posts, top and bottom rails, balusters, height and gap. */
export function RailingDiagram({ heightLabel, gapLabel, countLabel }: { heightLabel: string; gapLabel: string; countLabel?: string }) {
  const left = 30;
  const right = 290;
  const top = 26;
  const bottom = 176;
  const pitch = 18;
  const bal: number[] = [];
  for (let x = left + 26; x < right - 14; x += pitch) bal.push(x);
  return (
    <svg className={s.svg} viewBox="0 0 384 210" aria-hidden="true" focusable="false">
      <rect className={s.deckLine} x={10} y={bottom + 4} width={306} height={10} />
      {bal.map((x) => (
        <rect key={x} className={s.balusterFront} x={x - 4} y={top + 12} width={8} height={bottom - top - 22} />
      ))}
      <rect className={s.railFront} x={left} y={top} width={right - left} height={12} rx={1.5} />
      <rect className={s.railFront} x={left} y={bottom - 14} width={right - left} height={10} rx={1.5} />
      <rect className={s.postFront} x={left - 10} y={top - 12} width={20} height={bottom - top + 16} rx={2} />
      <rect className={s.postFront} x={right - 10} y={top - 12} width={20} height={bottom - top + 16} rx={2} />
      {/* height dimension */}
      <line className={s.dim} x1={330} y1={top} x2={330} y2={bottom + 4} />
      <line className={s.dim} x1={324} y1={top} x2={336} y2={top} />
      <line className={s.dim} x1={324} y1={bottom + 4} x2={336} y2={bottom + 4} />
      <text className={s.label} x={338} y={(top + bottom) / 2 + 4}>
        {heightLabel}
      </text>
      {/* gap dimension between two balusters */}
      <line className={s.dimAccent} x1={bal[3] + 4} y1={110} x2={bal[4] - 4} y2={110} />
      <text className={s.labelAccent} x={(bal[3] + bal[4]) / 2} y={102} textAnchor="middle">
        {gapLabel}
      </text>
      <text className={s.labelSmall} x={left} y={top - 16}>
        post
      </text>
      <text className={s.labelSmall} x={left + 30} y={top + 9}>
        top rail
      </text>
      <text className={s.labelSmall} x={bal[8] + 8} y={140}>
        baluster
      </text>
      {countLabel && (
        <text className={s.labelSmall} x={170} y={206} textAnchor="middle">
          {countLabel}
        </text>
      )}
    </svg>
  );
}
