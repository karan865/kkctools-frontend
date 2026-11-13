import React from 'react';
import type { ItemKind } from '@/lib/rebar-engine';
import styles from './RebarDiagram.module.css';

/**
 * Labelled, not-to-scale SVG diagrams for the rebar calculator. Pure components
 * (no hooks) so they render on the server and inside the client calculator.
 * Colours are CSS custom properties that follow the light/dark theme.
 */

const v = (name: string) => `var(--dg-${name})`;
const FONT = 'system-ui, -apple-system, Segoe UI, sans-serif';

function Dim({ x1, y1, x2, y2, label, tx, ty }: { x1: number; y1: number; x2: number; y2: number; label: string; tx: number; ty: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / len) * 5;
  const ny = ((x2 - x1) / len) * 5;
  const w = Math.max(24, label.length * 6.6 + 12);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: v('dim') }} strokeWidth={1.4} />
      <line x1={x1 - nx} y1={y1 - ny} x2={x1 + nx} y2={y1 + ny} style={{ stroke: v('dim') }} strokeWidth={1.4} />
      <line x1={x2 - nx} y1={y2 - ny} x2={x2 + nx} y2={y2 + ny} style={{ stroke: v('dim') }} strokeWidth={1.4} />
      <rect x={tx - w / 2} y={ty - 10} width={w} height={19} rx={4} style={{ fill: v('label-bg'), stroke: v('dim') }} strokeWidth={1} />
      <text x={tx} y={ty + 4} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily={FONT} style={{ fill: v('dim') }}>
        {label}
      </text>
    </g>
  );
}

function Note({ x, y, children, anchor = 'start', size = 10.5 }: { x: number; y: number; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontFamily={FONT} style={{ fill: v('text') }}>
      {children}
    </text>
  );
}

function Bar({ x1, y1, x2, y2, w = 2.6 }: { x1: number; y1: number; x2: number; y2: number; w?: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: v('bar') }} strokeWidth={w} strokeLinecap="round" />;
}

function Svg({ label, children, viewBox = '0 0 340 210', className }: { label: string; children: React.ReactNode; viewBox?: string; className?: string }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={`${styles.svg} ${className || ''}`}>
      {children}
    </svg>
  );
}

const lab = (labels: Record<string, string> | undefined, sym: string) => (labels && labels[sym] ? `${sym} = ${labels[sym]}` : sym);

// ---------------------------------------------------------------------------
// One diagram per item kind, with live labels
// ---------------------------------------------------------------------------

export function ItemDiagram({ kind, labels, className }: { kind: ItemKind; labels?: Record<string, string>; className?: string }) {
  const L = (s: string) => lab(labels, s);

  if (kind === 'slab') {
    const x0 = 70, x1 = 296, y0 = 26, y1 = 162, c = 12;
    const cols = 7, rows = 5;
    const xs = Array.from({ length: cols }, (_, i) => x0 + c + (i * (x1 - x0 - 2 * c)) / (cols - 1));
    const ys = Array.from({ length: rows }, (_, i) => y0 + c + (i * (y1 - y0 - 2 * c)) / (rows - 1));
    return (
      <Svg label="Slab seen from above: bars both ways at spacing S, kept a cover distance c in from every edge" viewBox="0 0 340 236" className={className}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} style={{ fill: v('concrete'), stroke: v('edge') }} strokeWidth={1.4} />
        <rect x={x0 + c} y={y0 + c} width={x1 - x0 - 2 * c} height={y1 - y0 - 2 * c} style={{ fill: 'none', stroke: v('faint'), strokeDasharray: '3 3' }} strokeWidth={1} />
        {xs.map((x) => (
          <Bar key={`v${x}`} x1={x} y1={y0 + c} x2={x} y2={y1 - c} />
        ))}
        {ys.map((y) => (
          <Bar key={`h${y}`} x1={x0 + c} y1={y} x2={x1 - c} y2={y} />
        ))}
        <Dim x1={xs[2]} y1={14} x2={xs[3]} y2={14} label={L('S')} tx={xs[3] + 44} ty={14} />
        <Dim x1={x0 + c} y1={y1 + 14} x2={x0} y2={y1 + 14} label={L('c')} tx={x0 - 2} ty={y1 + 32} />
        <Dim x1={x0} y1={214} x2={x1} y2={214} label={L('L')} tx={(x0 + x1) / 2 + 30} ty={224} />
        <Dim x1={52} y1={y0} x2={52} y2={y1} label={L('W')} tx={44} ty={(y0 + y1) / 2} />
      </Svg>
    );
  }

  if (kind === 'footing') {
    const x0 = 30, x1 = 310, y0 = 70, y1 = 130, c = 9;
    const cross = Array.from({ length: 11 }, (_, i) => x0 + c + (i * (x1 - x0 - 2 * c)) / 10);
    return (
      <Svg label="Strip footing seen from above: long bars along length L, optional cross bars at spacing S across width W" className={className}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} style={{ fill: v('concrete'), stroke: v('edge') }} strokeWidth={1.4} />
        {cross.map((x) => (
          <line key={x} x1={x} y1={y0 + c} x2={x} y2={y1 - c} style={{ stroke: v('bar-2') }} strokeWidth={1.8} strokeDasharray="1 0" opacity={0.75} />
        ))}
        <Bar x1={x0 + c} y1={y0 + 20} x2={x1 - c} y2={y0 + 20} w={3} />
        <Bar x1={x0 + c} y1={y1 - 20} x2={x1 - c} y2={y1 - 20} w={3} />
        <Note x={x0 + 4} y={y0 - 34} size={10}>
          {labels && labels.N ? `${labels.N} long bars` : 'N long bars'} · lighter cross bars are optional
        </Note>
        <Dim x1={cross[4]} y1={y0 - 14} x2={cross[5]} y2={y0 - 14} label={L('S')} tx={cross[5] + 44} ty={y0 - 14} />
        <Dim x1={x0} y1={158} x2={x1} y2={158} label={L('L')} tx={170} ty={176} />
        <Dim x1={x1 + 0} y1={y0} x2={x1 + 0} y2={y1} label={L('W')} tx={x1 - 30} ty={y1 + 14} />
      </Svg>
    );
  }

  if (kind === 'wall') {
    const x0 = 70, x1 = 250, y0 = 26, y1 = 166, c = 10;
    const cols = 7, rows = 5;
    const xs = Array.from({ length: cols }, (_, i) => x0 + c + (i * (x1 - x0 - 2 * c)) / (cols - 1));
    const ys = Array.from({ length: rows }, (_, i) => y0 + c + (i * (y1 - y0 - 2 * c)) / (rows - 1));
    return (
      <Svg label="Wall elevation: vertical bars at spacing Sv and horizontal bars at spacing Sh, length L and height H" className={className}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} style={{ fill: v('concrete-2'), stroke: v('edge') }} strokeWidth={1.4} />
        {xs.map((x) => (
          <Bar key={`v${x}`} x1={x} y1={y0 + c} x2={x} y2={y1 - c} />
        ))}
        {ys.map((y) => (
          <Bar key={`h${y}`} x1={x0 + c} y1={y} x2={x1 - c} y2={y} w={2.2} />
        ))}
        <Dim x1={xs[3]} y1={14} x2={xs[4]} y2={14} label={L('Sv')} tx={xs[4] + 46} ty={14} />
        <Dim x1={x1 + 14} y1={ys[1]} x2={x1 + 14} y2={ys[2]} label={L('Sh')} tx={x1 + 45} ty={ys[2] + 20} />
        <Dim x1={x0} y1={184} x2={x1} y2={184} label={L('L')} tx={(x0 + x1) / 2} ty={198} />
        <Dim x1={52} y1={y0} x2={52} y2={y1} label={L('H')} tx={44} ty={(y0 + y1) / 2} />
      </Svg>
    );
  }

  // bar list
  const ys = [70, 86, 102, 118];
  return (
    <Svg label="Straight bars: N bars, each of length L" className={className}>
      {ys.map((y) => (
        <g key={y}>
          <Bar x1={40} y1={y} x2={300} y2={y} w={5} />
          {Array.from({ length: 26 }, (_, i) => (
            <line key={i} x1={44 + i * 10} y1={y - 3} x2={47 + i * 10} y2={y + 3} style={{ stroke: v('bar-2') }} strokeWidth={1} />
          ))}
        </g>
      ))}
      <rect x={124} y={30} width={92} height={24} rx={6} style={{ fill: v('label-bg'), stroke: v('dim') }} strokeWidth={1.2} />
      <text x={170} y={46} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily={FONT} style={{ fill: v('dim') }}>
        {labels && labels.N ? `N = ${labels.N} bars` : 'N bars'}
      </text>
      <Dim x1={40} y1={148} x2={300} y2={148} label={L('L')} tx={170} ty={166} />
      <Note x={170} y={194} anchor="middle" size={10}>
        weight = N × L × weight per foot (or metre) of the bar size
      </Note>
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Lap splice
// ---------------------------------------------------------------------------

export function LapDiagram({ lapLabel = '40 × d', className }: { lapLabel?: string; className?: string }) {
  return (
    <Svg label={`Two bars overlapped by a lap of ${lapLabel} and tied together`} viewBox="0 0 340 150" className={className}>
      <Bar x1={20} y1={62} x2={210} y2={62} w={5} />
      <Bar x1={130} y1={78} x2={320} y2={78} w={5} />
      {[140, 165, 190, 200].map((x) => (
        <line key={x} x1={x} y1={56} x2={x} y2={84} style={{ stroke: v('chair') }} strokeWidth={1.6} />
      ))}
      <line x1={130} y1={40} x2={130} y2={96} style={{ stroke: v('dim') }} strokeWidth={0.8} strokeDasharray="2 3" />
      <line x1={210} y1={40} x2={210} y2={96} style={{ stroke: v('dim') }} strokeWidth={0.8} strokeDasharray="2 3" />
      <Dim x1={130} y1={110} x2={210} y2={110} label={`lap = ${lapLabel}`} tx={170} ty={128} />
      <Note x={20} y={40} size={10}>
        bar 1 ends here →
      </Note>
      <Note x={320} y={106} anchor="end" size={10}>
        ← bar 2 starts
      </Note>
      <Note x={170} y={24} anchor="middle" size={10}>
        tie wire at the overlap
      </Note>
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Slab section: cover and chairs
// ---------------------------------------------------------------------------

export function CoverDiagram({ coverLabel = '3 in', className }: { coverLabel?: string; className?: string }) {
  const y0 = 62, y1 = 122;
  const soil = Array.from({ length: 22 }, (_, i) => 22 + i * 14);
  return (
    <Svg label={`Slab cross-section: bars held up on chairs, edge cover ${coverLabel}`} viewBox="0 0 340 190" className={className}>
      <rect x={14} y={y1} width={312} height={44} style={{ fill: v('soil') }} />
      {soil.map((x) => (
        <line key={x} x1={x} y1={y1 + 30} x2={x + 7} y2={y1 + 22} style={{ stroke: v('soil-line') }} strokeWidth={1} />
      ))}
      <rect x={40} y={y0} width={260} height={y1 - y0} style={{ fill: v('concrete'), stroke: v('edge') }} strokeWidth={1.4} />
      <Bar x1={76} y1={y0 + 34} x2={300 - 36} y2={y0 + 34} w={3} />
      {[100, 150, 200, 250].map((x) => (
        <g key={x}>
          <circle cx={x} cy={y0 + 28} r={3.6} style={{ fill: v('bar') }} />
          <path d={`M ${x - 8} ${y1} L ${x} ${y0 + 38} L ${x + 8} ${y1}`} style={{ fill: 'none', stroke: v('chair') }} strokeWidth={1.4} />
        </g>
      ))}
      <Dim x1={40} y1={y0 - 16} x2={76} y2={y0 - 16} label={`c = ${coverLabel}`} tx={98} ty={y0 - 32} />
      <Note x={170} y={y1 + 58} anchor="middle" size={10}>
        chairs hold the bars up so concrete surrounds them
      </Note>
      <Note x={306} y={y0 + 10} size={10} anchor="end">
        slab
      </Note>
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Bar sizes to scale (#3–#8)
// ---------------------------------------------------------------------------

export function BarSizesDiagram({ className }: { className?: string }) {
  const sizes = [3, 4, 5, 6, 7, 8];
  const scale = 36; // px per inch
  return (
    <Svg label="US rebar sizes #3 to #8 drawn to scale; the bar number is the diameter in eighths of an inch" viewBox="0 0 340 150" className={className}>
      {sizes.map((n, i) => {
        const r = (n / 8 / 2) * scale;
        const cx = 30 + i * 56;
        return (
          <g key={n}>
            <circle cx={cx} cy={64} r={r} style={{ fill: v('bar'), stroke: v('edge') }} strokeWidth={0.8} />
            <text x={cx} y={112} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily={FONT} style={{ fill: v('text') }}>
              #{n}
            </text>
            <Note x={cx} y={128} anchor="middle" size={10}>
              {n}/8 in
            </Note>
          </g>
        );
      })}
    </Svg>
  );
}
