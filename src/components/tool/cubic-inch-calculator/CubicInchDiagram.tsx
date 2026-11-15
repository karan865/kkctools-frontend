import React from 'react';
import s from './CubicInchDiagram.module.css';
import type { Shape } from '@/lib/cubic-inch-engine';

/* Shape drawings with the user's dimensions. The numbers are also in the results, so the drawing is hidden from assistive tech. */
export function ShapeDiagram({ shape, a, b, c, d }: { shape: Shape; a: string; b?: string; c?: string; d?: string }) {
  return (
    <svg className={s.svg} viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      {shape === 'box' && (
        <g>
          {/* isometric box: front face, top, side */}
          <polygon className={s.top} points="70,70 180,70 230,40 120,40" />
          <polygon className={s.front} points="70,70 180,70 180,160 70,160" />
          <polygon className={s.side} points="180,70 230,40 230,130 180,160" />
          <line className={s.dim} x1={70} y1={176} x2={180} y2={176} />
          <text className={s.label} x={125} y={192} textAnchor="middle">
            L {a}
          </text>
          <line className={s.dim} x1={196} y1={168} x2={246} y2={138} />
          <text className={s.label} x={250} y={160}>
            W {b}
          </text>
          <line className={s.dim} x1={54} y1={70} x2={54} y2={160} />
          <text className={s.label} x={48} y={119} textAnchor="end">
            H {c}
          </text>
        </g>
      )}
      {(shape === 'cylinder' || shape === 'tube') && (
        <g>
          <path className={s.front} d="M90 50 V150 A60 16 0 0 0 210 150 V50" />
          <ellipse className={s.top} cx={150} cy={50} rx={60} ry={16} />
          {shape === 'tube' && <ellipse className={s.hole} cx={150} cy={50} rx={40} ry={10.5} />}
          <path className={s.edge} d="M90 150 A60 16 0 0 0 210 150" />
          <line className={s.dim} x1={90} y1={22} x2={210} y2={22} />
          <text className={s.label} x={150} y={16} textAnchor="middle">
            {shape === 'tube' ? `OD ${a}` : `D ${a}`}
          </text>
          {shape === 'tube' && (
            <>
              <line className={s.dimAccent} x1={110} y1={50} x2={190} y2={50} />
              <text className={s.labelAccent} x={150} y={84} textAnchor="middle">
                ID {d}
              </text>
            </>
          )}
          <line className={s.dim} x1={228} y1={50} x2={228} y2={150} />
          <text className={s.label} x={234} y={104}>
            L {b}
          </text>
        </g>
      )}
      {shape === 'sphere' && (
        <g>
          <circle className={s.front} cx={160} cy={100} r={66} />
          <ellipse className={s.edge} cx={160} cy={100} rx={66} ry={18} />
          <ellipse className={s.shine} cx={136} cy={76} rx={16} ry={10} />
          <line className={s.dimAccent} x1={94} y1={100} x2={226} y2={100} />
          <text className={s.labelAccent} x={160} y={94} textAnchor="middle">
            D {a}
          </text>
        </g>
      )}
    </svg>
  );
}

/* Cutaway of one cylinder: bore is the cylinder diameter, stroke is how far the piston travels from TDC to BDC. */
export function CylinderDiagram({ bore, stroke, cylinders, ratio }: { bore: string; stroke: string; cylinders: number; ratio: number }) {
  // drawn bore width varies a little with the bore/stroke ratio so oversquare and undersquare look different
  const r = Math.min(Math.max(ratio || 1, 0.75), 1.3);
  const bw = 96 * r;
  const cx = 118;
  const x0 = cx - bw / 2;
  const tdc = 52; // piston crown at top dead centre
  const st = 66; // drawn stroke
  return (
    <svg className={s.svg} viewBox="0 0 320 236" aria-hidden="true" focusable="false">
      {/* cylinder walls and head */}
      <rect className={s.head} x={x0 - 14} y={20} width={bw + 28} height={16} rx={3} />
      <rect className={s.wall} x={x0 - 14} y={36} width={14} height={140} />
      <rect className={s.wall} x={x0 + bw} y={36} width={14} height={140} />
      {/* swept volume */}
      <rect className={s.swept} x={x0} y={tdc} width={bw} height={st} />
      {/* piston at BDC (solid) and ghost at TDC */}
      <rect className={s.ghost} x={x0 + 2} y={tdc} width={bw - 4} height={30} rx={3} />
      <rect className={s.piston} x={x0 + 2} y={tdc + st} width={bw - 4} height={30} rx={3} />
      <line className={s.ring} x1={x0 + 2} y1={tdc + st + 8} x2={x0 + bw - 2} y2={tdc + st + 8} />
      <line className={s.ring} x1={x0 + 2} y1={tdc + st + 14} x2={x0 + bw - 2} y2={tdc + st + 14} />
      {/* rod and crank */}
      <line className={s.rod} x1={cx} y1={tdc + st + 22} x2={cx + 14} y2={204} />
      <circle className={s.crank} cx={cx} cy={208} r={20} />
      <circle className={s.pin} cx={cx + 14} cy={204} r={4} />
      {/* bore */}
      <line className={s.dimAccent} x1={x0} y1={tdc + 30} x2={x0 + bw} y2={tdc + 30} />
      <text className={s.labelAccent} x={cx} y={tdc + 26} textAnchor="middle">
        bore {bore}
      </text>
      {/* stroke */}
      <line className={s.dim} x1={x0 + bw + 26} y1={tdc} x2={x0 + bw + 26} y2={tdc + st} />
      <line className={s.tick} x1={x0 + bw + 20} y1={tdc} x2={x0 + bw + 32} y2={tdc} />
      <line className={s.tick} x1={x0 + bw + 20} y1={tdc + st} x2={x0 + bw + 32} y2={tdc + st} />
      <text className={s.label} x={x0 + bw + 38} y={tdc + 4}>
        TDC
      </text>
      <text className={s.label} x={x0 + bw + 38} y={tdc + st + 4}>
        BDC
      </text>
      <text className={s.labelAccent} x={x0 + bw + 38} y={tdc + st / 2 + 4}>
        stroke {stroke}
      </text>
      <text className={s.small} x={x0 + bw + 38} y={tdc + st + 34}>
        shaded = swept volume
      </text>
      <text className={s.small} x={x0 + bw + 38} y={tdc + st + 48}>
        × {cylinders} cylinder{cylinders === 1 ? '' : 's'}
      </text>
    </svg>
  );
}

export function CompareBars({ rows, format }: { rows: { label: string; value: number; tone: 'a' | 'b' }[]; format: (n: number) => string }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className={s.compare}>
      {rows.map((r) => (
        <div key={r.label} className={s.barRow}>
          <span className={s.barName}>{r.label}</span>
          <span className={s.track}>
            <span className={`${s.fill} ${s[r.tone]}`} style={{ width: `${Math.max((r.value / max) * 100, 1.5)}%` }} />
          </span>
          <strong className={s.barValue}>{format(r.value)}</strong>
        </div>
      ))}
    </div>
  );
}
