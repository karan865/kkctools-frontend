import React from 'react';
import type { ShapeId } from '@/lib/concrete-engine';

/**
 * Labelled, not-to-scale SVG diagrams for each concrete shape.
 * Pure component (no hooks) so it renders on the server for the article
 * and on the client inside the calculator with live values.
 */

const C = {
  top: '#E2E8F0',
  front: '#CBD5E1',
  side: '#94A3B8',
  edge: '#475569',
  dim: '#075985',
  soil: '#F3E8D8',
  soilLine: '#D6C3A5',
  wood: '#D97706',
  woodDark: '#B45309',
  text: '#0F172A',
};

type Pt = [number, number];
const pts = (p: Pt[]) => p.map(([x, y]) => `${x},${y}`).join(' ');

function Box({ x, y, w, h, dx, dy }: { x: number; y: number; w: number; h: number; dx: number; dy: number }) {
  return (
    <g stroke={C.edge} strokeWidth={1.4} strokeLinejoin="round">
      <polygon points={pts([[x, y], [x + dx, y - dy], [x + w + dx, y - dy], [x + w, y]])} fill={C.top} />
      <polygon points={pts([[x + w, y], [x + w + dx, y - dy], [x + w + dx, y + h - dy], [x + w, y + h]])} fill={C.side} />
      <rect x={x} y={y} width={w} height={h} fill={C.front} />
    </g>
  );
}

/** Dimension line with end ticks and a boxed label at (tx, ty). */
function Dim({ x1, y1, x2, y2, label, tx, ty }: { x1: number; y1: number; x2: number; y2: number; label: string; tx: number; ty: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / len) * 5;
  const ny = ((x2 - x1) / len) * 5;
  const wBox = Math.max(22, label.length * 6.6 + 10);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.dim} strokeWidth={1.4} />
      <line x1={x1 - nx} y1={y1 - ny} x2={x1 + nx} y2={y1 + ny} stroke={C.dim} strokeWidth={1.4} />
      <line x1={x2 - nx} y1={y2 - ny} x2={x2 + nx} y2={y2 + ny} stroke={C.dim} strokeWidth={1.4} />
      <rect x={tx - wBox / 2} y={ty - 10} width={wBox} height={19} rx={4} fill="#FFFFFF" stroke={C.dim} strokeWidth={1} />
      <text x={tx} y={ty + 4} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={C.dim} fontFamily="system-ui, sans-serif">
        {label}
      </text>
    </g>
  );
}

function SoilHatch({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  // short diagonal dashes on a staggered grid (no clipPath ids needed)
  const lines: React.ReactNode[] = [];
  let row = 0;
  for (let yy = y + 10; yy < y + h - 4; yy += 14, row++) {
    for (let xx = x + 6 + (row % 2) * 9; xx < x + w - 8; xx += 18) {
      lines.push(<line key={`${xx}-${yy}`} x1={xx} y1={yy + 4} x2={xx + 7} y2={yy - 3} stroke={C.soilLine} strokeWidth={1} />);
    }
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={C.soil} />
      {lines}
    </g>
  );
}

const lab = (labels: Record<string, string> | undefined, sym: string) =>
  labels && labels[sym] ? `${sym} = ${labels[sym]}` : sym;

interface ShapeDiagramProps {
  shape: ShapeId;
  /** symbol → formatted value, e.g. { L: '10 ft', T: '4 in' } */
  labels?: Record<string, string>;
  title?: string;
  className?: string;
}

export default function ShapeDiagram({ shape, labels, title, className }: ShapeDiagramProps) {
  const L = (s: string) => lab(labels, s);
  let body: React.ReactNode = null;
  let desc = '';

  switch (shape) {
    case 'slab':
      desc = 'Rectangular slab: length L, width W and thickness T';
      body = (
        <>
          <Box x={40} y={100} w={170} h={24} dx={66} dy={48} />
          <Dim x1={40} y1={140} x2={210} y2={140} label={L('L')} tx={125} ty={160} />
          <Dim x1={222} y1={130} x2={288} y2={82} label={L('W')} tx={268} ty={128} />
          <Dim x1={28} y1={100} x2={28} y2={124} label={L('T')} tx={58} ty={74} />
          <line x1={28} y1={100} x2={40} y2={84} stroke={C.dim} strokeWidth={1} strokeDasharray="3 3" />
        </>
      );
      break;

    case 'circle':
      desc = 'Round slab: diameter D and thickness T';
      body = (
        <>
          <g stroke={C.edge} strokeWidth={1.4}>
            <path d="M60 92 L60 116 A100 30 0 0 0 260 116 L260 92 Z" fill={C.side} />
            <ellipse cx={160} cy={92} rx={100} ry={30} fill={C.top} />
          </g>
          <Dim x1={60} y1={92} x2={260} y2={92} label={L('D')} tx={160} ty={80} />
          <Dim x1={276} y1={92} x2={276} y2={116} label={L('T')} tx={276} ty={145} />
        </>
      );
      break;

    case 'footing':
      desc = 'Footing in a trench below ground: length L, width W and depth D';
      body = (
        <>
          <SoilHatch x={14} y={88} w={292} h={92} />
          <line x1={14} y1={88} x2={306} y2={88} stroke={C.woodDark} strokeWidth={2} />
          <text x={120} y={80} fontSize={11} fill={C.edge} fontFamily="system-ui, sans-serif">ground level</text>
          <Box x={50} y={110} w={190} h={40} dx={40} dy={22} />
          <Dim x1={50} y1={162} x2={240} y2={162} label={L('L')} tx={145} ty={174} />
          <Dim x1={246} y1={104} x2={286} y2={82} label={L('W')} tx={276} ty={64} />
          <Dim x1={36} y1={110} x2={36} y2={150} label={L('D')} tx={36} ty={66} />
          <line x1={36} y1={110} x2={36} y2={76} stroke={C.dim} strokeWidth={1} strokeDasharray="3 3" />
        </>
      );
      break;

    case 'wall':
      desc = 'Concrete wall: length L, height H and thickness T';
      body = (
        <>
          <Box x={70} y={44} w={170} h={112} dx={24} dy={18} />
          <Dim x1={70} y1={168} x2={240} y2={168} label={L('L')} tx={155} ty={184} />
          <Dim x1={54} y1={44} x2={54} y2={156} label={L('H')} tx={54} ty={100} />
          <Dim x1={70} y1={34} x2={94} y2={16} label={L('T')} tx={132} ty={20} />
        </>
      );
      break;

    case 'squareColumn':
      desc = 'Square column: width W, depth D and height H';
      body = (
        <>
          <Box x={140} y={40} w={54} h={128} dx={32} dy={22} />
          <Dim x1={140} y1={180} x2={194} y2={180} label={L('W')} tx={122} ty={186} />
          <Dim x1={202} y1={174} x2={234} y2={152} label={L('D')} tx={262} ty={170} />
          <Dim x1={124} y1={40} x2={124} y2={168} label={L('H')} tx={86} ty={104} />
        </>
      );
      break;

    case 'roundColumn':
      desc = 'Round column or Sonotube: diameter D and height H';
      body = (
        <>
          <g stroke={C.edge} strokeWidth={1.4}>
            <path d="M126 40 L126 160 A36 11 0 0 0 198 160 L198 40 Z" fill={C.front} />
            <ellipse cx={162} cy={40} rx={36} ry={11} fill={C.top} />
          </g>
          <Dim x1={126} y1={40} x2={198} y2={40} label={L('D')} tx={240} ty={30} />
          <Dim x1={108} y1={40} x2={108} y2={160} label={L('H')} tx={70} ty={100} />
        </>
      );
      break;

    case 'postHoles':
      desc = 'Post hole cross-section: hole diameter D, hole depth H and post width P';
      body = (
        <>
          <SoilHatch x={14} y={62} w={292} h={124} />
          <line x1={14} y1={62} x2={306} y2={62} stroke={C.woodDark} strokeWidth={2} />
          <text x={22} y={56} fontSize={11} fill={C.edge} fontFamily="system-ui, sans-serif">ground level</text>
          <rect x={120} y={62} width={84} height={104} fill={C.front} stroke={C.edge} strokeWidth={1.4} />
          <rect x={150} y={18} width={24} height={148} fill={C.wood} stroke={C.woodDark} strokeWidth={1.4} />
          <Dim x1={120} y1={176} x2={204} y2={176} label={L('D')} tx={250} ty={178} />
          <Dim x1={218} y1={62} x2={218} y2={166} label={L('H')} tx={258} ty={114} />
          <Dim x1={150} y1={10} x2={174} y2={10} label={L('P')} tx={226} ty={16} />
          <text x={62} y={120} fontSize={11} fill={C.edge} fontFamily="system-ui, sans-serif">concrete</text>
          <line x1={108} y1={116} x2={134} y2={116} stroke={C.edge} strokeWidth={1} />
        </>
      );
      break;

    case 'steps': {
      desc = 'Solid steps: number of steps N, rise R, run (tread) T and width W';
      const dx = 52;
      const dy = 30;
      const profile: Pt[] = [[60, 166], [60, 134], [106, 134], [106, 102], [152, 102], [152, 70], [198, 70], [198, 166]];
      const treads: [number, number, number][] = [[60, 106, 134], [106, 152, 102], [152, 198, 70]];
      body = (
        <>
          <g stroke={C.edge} strokeWidth={1.4} strokeLinejoin="round">
            {treads.map(([a, b, y]) => (
              <polygon key={y} points={pts([[a, y], [a + dx, y - dy], [b + dx, y - dy], [b, y]])} fill={C.top} />
            ))}
            <polygon points={pts([[198, 70], [198 + dx, 70 - dy], [198 + dx, 166 - dy], [198, 166]])} fill={C.side} />
            <polygon points={pts(profile)} fill={C.front} />
          </g>
          <Dim x1={46} y1={134} x2={46} y2={166} label={L('R')} tx={46} ty={110} />
          <Dim x1={60} y1={178} x2={106} y2={178} label={L('T')} tx={142} ty={182} />
          <Dim x1={206} y1={64} x2={258} y2={34} label={L('W')} tx={270} ty={62} />
          <text x={120} y={152} fontSize={11.5} fontWeight={700} fill={C.text} fontFamily="system-ui, sans-serif">
            {labels && labels.N ? `N = ${labels.N}` : 'N steps'}
          </text>
        </>
      );
      break;
    }
  }

  return (
    <svg
      viewBox="0 0 320 196"
      role="img"
      aria-label={title || desc}
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {body}
    </svg>
  );
}

/** Top view of a slab form showing that L and W are measured inside the boards. */
export function InsideFormsDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 196"
      role="img"
      aria-label="Top view of slab forms: measure length and width on the inside faces of the form boards"
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <rect x={40} y={24} width={240} height={148} fill={C.wood} stroke={C.woodDark} strokeWidth={1.4} />
      <rect x={54} y={38} width={212} height={120} fill={C.top} stroke={C.edge} strokeWidth={1.4} />
      <Dim x1={54} y1={98} x2={266} y2={98} label="L (inside)" tx={160} ty={98} />
      <Dim x1={110} y1={38} x2={110} y2={158} label="W (inside)" tx={110} ty={128} />
      <text x={160} y={188} textAnchor="middle" fontSize={11} fill={C.edge} fontFamily="system-ui, sans-serif">
        form boards (do not include their thickness)
      </text>
    </svg>
  );
}
