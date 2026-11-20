import React from 'react';
import type { IconName } from '@/components/icons/Icons';
import s from './ToolArt.module.css';

/**
 * Small illustrations that show what each tool works out (a slab with its dimensions, a rebar grid,
 * a wire cross-section…). Pure inline SVG, decorative only (the card title carries the meaning).
 * Colours come from the card's category variables, so they follow the category and the theme.
 */

const k = (...names: string[]) => names.map((n) => s[n]).join(' ');

/** Dimension line with end ticks and a label. */
function Dim({ x1, y1, x2, y2, label, lx, ly, anchor = 'middle' }: { x1: number; y1: number; x2: number; y2: number; label: string; lx: number; ly: number; anchor?: 'start' | 'middle' | 'end' }) {
  const vertical = Math.abs(x2 - x1) < Math.abs(y2 - y1);
  const t = 3;
  return (
    <g>
      <line className={s.dim} x1={x1} y1={y1} x2={x2} y2={y2} />
      {vertical ? (
        <>
          <line className={s.dim} x1={x1 - t} y1={y1} x2={x1 + t} y2={y1} />
          <line className={s.dim} x1={x2 - t} y1={y2} x2={x2 + t} y2={y2} />
        </>
      ) : (
        <>
          <line className={s.dim} x1={x1} y1={y1 - t} x2={x1} y2={y1 + t} />
          <line className={s.dim} x1={x2} y1={y2 - t} x2={x2} y2={y2 + t} />
        </>
      )}
      <text className={s.tx} x={lx} y={ly} textAnchor={anchor}>
        {label}
      </text>
    </g>
  );
}

const ART: Partial<Record<IconName, React.ReactNode>> = {
  /* Concrete slab with length and thickness */
  slab: (
    <>
      <polygon className={k('fl', 's2')} points="34,44 118,28 168,46 84,62" />
      <polygon className={s.f1} points="84,62 168,46 168,60 84,76" />
      <polygon className={s.f2} points="34,44 84,62 84,76 34,58" />
      {[[70, 42], [96, 38], [120, 44], [88, 50], [108, 52], [62, 48], [134, 40], [142, 48]].map(([x, y], i) => (
        <circle key={i} className={s.fm} cx={x} cy={y} r={1.6} />
      ))}
      <Dim x1={84} y1={84} x2={168} y2={68} label="10 ft" lx={136} ly={92} />
      <Dim x1={176} y1={46} x2={176} y2={60} label="4 in" lx={181} ly={56} anchor="start" />
    </>
  ),
  /* Slab with a price tag and a stack of coins */
  slabCost: (
    <>
      <polygon className={k('fl', 's2')} points="18,52 92,38 132,54 58,68" />
      <polygon className={s.f1} points="58,68 132,54 132,66 58,80" />
      <polygon className={s.f2} points="18,52 58,68 58,80 18,64" />
      <Dim x1={58} y1={88} x2={132} y2={74} label="sq ft" lx={104} ly={95} />
      <path className={s.f2} d="M140 22 H178 a4 4 0 0 1 4 4 V46 a4 4 0 0 1 -4 4 H140 L128 36 Z" />
      <circle className={s.fp} cx={138} cy={36} r={3} />
      <text className={s.txW} x={160} y={40} textAnchor="middle">
        $/yd³
      </text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <ellipse className={s.f2} cx={166} cy={86 - i * 7} rx={14} ry={4.5} />
          <ellipse className={s.fm} cx={166} cy={84 - i * 7} rx={14} ry={4.5} />
        </g>
      ))}
      <text className={s.txL} x={166} y={66} textAnchor="middle">
        $
      </text>
    </>
  ),
  /* Deck with railing and a stain can */
  deck: (
    <>
      <polygon className={s.fm} points="20,58 120,58 150,40 50,40" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} className={k('s2')} x1={23 + i * 5} y1={58 - i * 3} x2={123 + i * 5} y2={58 - i * 3} />
      ))}
      <polygon className={s.f2} points="20,58 120,58 120,64 20,64" />
      <polygon className={s.f1} points="120,58 150,40 150,46 120,64" />
      <line className={k('s2', 'thick')} x1={50} y1={40} x2={50} y2={16} />
      <line className={k('s2', 'thick')} x1={150} y1={40} x2={150} y2={16} />
      <line className={k('s2', 'thick')} x1={100} y1={40} x2={100} y2={16} />
      <line className={k('s2', 'thick')} x1={48} y1={16} x2={152} y2={16} />
      {[58, 66, 74, 82, 90, 108, 116, 124, 132, 140].map((x) => (
        <line key={x} className={s.s1} x1={x} y1={18} x2={x} y2={40} />
      ))}
      <line className={s.leg} x1={30} y1={64} x2={30} y2={84} />
      <line className={s.leg} x1={110} y1={64} x2={110} y2={84} />
      <path className={s.f2} d="M158 62 H190 V88 Q174 93 158 88 Z" />
      <ellipse className={s.f1} cx={174} cy={62} rx={16} ry={4.5} />
      <text className={s.txW} x={174} y={80} textAnchor="middle">
        gal
      </text>
    </>
  ),
  /* Fence run with a gate and a price tag */
  fenceCost: (
    <>
      <rect className={s.f2} x={10} y={40} width={124} height={5} rx={1} />
      <rect className={s.f2} x={10} y={66} width={124} height={5} rx={1} />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 12 + i * 10;
        return <path key={i} className={s.f1} d={`M${x} 86 V28 L${x + 4} 22 L${x + 8} 28 V86 Z`} />;
      })}
      <rect className={k('fn', 's2')} x={104} y={30} width={28} height={50} rx={2} strokeDasharray="3 2" />
      <line className={k('s2')} x1={104} y1={30} x2={132} y2={80} />
      <line className={s.dim} x1={6} y1={92} x2={194} y2={92} />
      <path className={s.f2} d="M146 18 H184 a4 4 0 0 1 4 4 V42 a4 4 0 0 1 -4 4 H146 L134 32 Z" />
      <circle className={s.fp} cx={144} cy={32} r={3} />
      <text className={s.txW} x={166} y={36} textAnchor="middle">
        $/ft
      </text>
      <text className={s.tx} x={152} y={72} textAnchor="middle">
        posts · gates
      </text>
    </>
  ),
  /* A cube spread into a thin layer: volume ÷ depth = area */
  cubeToArea: (
    <>
      <polygon className={k('fl', 's2')} points="40,20 64,32 40,44 16,32" />
      <polygon className={s.f1} points="16,32 40,44 40,72 16,60" />
      <polygon className={s.f2} points="40,44 64,32 64,60 40,72" />
      <text className={s.tx} x={40} y={88} textAnchor="middle">
        ft³
      </text>
      <line className={k('s2', 'thick')} x1={74} y1={46} x2={98} y2={46} />
      <polygon className={s.f2} points="98,40 108,46 98,52" />
      <polygon className={k('fl', 's2')} points="116,52 170,34 196,46 142,64" />
      <polygon className={s.f1} points="116,52 142,64 142,68 116,56" />
      <polygon className={s.f2} points="142,64 196,46 196,50 142,68" />
      <text className={s.tx} x={156} y={84} textAnchor="middle">
        ft² × depth
      </text>
    </>
  ),
  /* House with a standing-seam metal roof next to a shingle roof */
  metalRoof: (
    <>
      <polygon className={s.fm} points="14,50 62,18 110,50" />
      {[24, 34, 44, 54, 62, 70, 80, 90, 100].map((x) => (
        <line key={x} className={s.sp} x1={x} y1={50} x2={x < 62 ? 62 - (62 - x) * 0.32 : 62 + (x - 62) * 0.32} y2={x < 62 ? 18 + (62 - x) * 0.2 : 18 + (x - 62) * 0.2} strokeWidth={1.6} />
      ))}
      <rect className={s.fl} x={24} y={50} width={76} height={36} />
      <rect className={s.f2} x={54} y={64} width={16} height={22} />
      <line className={s.dim} x1={6} y1={88} x2={194} y2={88} />
      <polygon className={s.f2} points="122,60 154,38 186,60" opacity={0.85} />
      {[0, 1, 2].map((r) => (
        <line key={r} className={s.sp} x1={130 + r * 4} y1={54 - r * 6} x2={178 - r * 4} y2={54 - r * 6} strokeWidth={1.2} />
      ))}
      <rect className={s.fl} x={130} y={60} width={48} height={26} />
      <text className={s.tx} x={62} y={14} textAnchor="middle">
        metal
      </text>
      <text className={s.tx} x={154} y={32} textAnchor="middle">
        shingle
      </text>
    </>
  ),
  /* Bathroom: tiled wall, tub, vanity and a price tag */
  bath: (
    <>
      <rect className={s.fl} x={14} y={10} width={130} height={78} rx={3} />
      {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4, 5, 6, 7].map((c) => <rect key={`${r}-${c}`} className={s.fp} x={16 + c * 16} y={12 + r * 12} width={14} height={10} rx={1} />))}
      <path className={s.f1} d="M20 62 H96 V70 Q96 84 82 84 H34 Q20 84 20 70 Z" />
      <path className={k('fn', 's2', 'thick')} d="M28 62 V40 Q28 34 34 34 H38" />
      <rect className={s.f2} x={104} y={54} width={36} height={30} rx={2} />
      <ellipse className={s.fp} cx={122} cy={54} rx={12} ry={3} />
      <path className={s.f2} d="M150 20 H186 a4 4 0 0 1 4 4 V44 a4 4 0 0 1 -4 4 H150 L138 34 Z" />
      <circle className={s.fp} cx={148} cy={34} r={3} />
      <text className={s.txW} x={168} y={38} textAnchor="middle">
        $
      </text>
      <text className={s.tx} x={168} y={68} textAnchor="middle">
        low–high
      </text>
    </>
  ),
  /* One cubic yard cube */
  cube: (
    <>
      <polygon className={k('fl', 's2')} points="92,14 132,32 92,50 52,32" />
      <polygon className={s.f1} points="52,32 92,50 92,88 52,70" />
      <polygon className={s.f2} points="92,50 132,32 132,70 92,88" />
      <Dim x1={44} y1={34} x2={44} y2={72} label="3 ft" lx={38} ly={56} anchor="end" />
      <text className={s.txL} x={142} y={56}>
        1 yd³
      </text>
      <text className={s.tx} x={142} y={68}>
        = 27 ft³
      </text>
    </>
  ),
  /* CMU wall with cores */
  blockWall: (
    <>
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((col) => {
          const x = 22 + col * 34 - (row % 2 ? 17 : 0);
          const y = 14 + row * 19;
          if (x < 5 || x > 175) return null;
          return (
            <g key={`${row}-${col}`}>
              <rect className={k('fl', 's2')} x={x} y={y} width={32} height={17} rx={1.5} />
              <rect className={s.f1} x={x + 5} y={y + 4} width={9} height={9} rx={1.5} opacity={0.55} />
              <rect className={s.f1} x={x + 18} y={y + 4} width={9} height={9} rx={1.5} opacity={0.55} />
            </g>
          );
        }),
      )}
      <rect className={k('fp', 's2')} x={110} y={52} width={30} height={36} rx={1} />
      <text className={s.tx} x={125} y={73} textAnchor="middle">
        door
      </text>
    </>
  ),
  /* Running-bond brick wall */
  brickWall: (
    <>
      <rect className={s.fl} x={18} y={12} width={164} height={78} rx={3} />
      {[0, 1, 2, 3, 4, 5].map((row) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((col) => {
          const x = 20 + col * 22 - (row % 2 ? 11 : 0);
          const y = 14 + row * 12.6;
          const w = Math.min(20, 180 - x);
          const x0 = Math.max(20, x);
          if (w <= 4 || x0 >= 180) return null;
          return <rect key={`${row}-${col}`} className={(row + col) % 3 === 0 ? s.f2 : s.f1} x={x0} y={y} width={w - (x0 - x)} height={10.6} rx={1} />;
        }),
      )}
    </>
  ),
  /* Rebar grid on a slab with chairs */
  rebar: (
    <>
      <polygon className={k('fl', 's2')} points="30,30 150,30 176,74 56,74" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={`h${i}`} className={s.bar} x1={34 + i * 6.5} y1={36 + i * 9} x2={150 + i * 6.5} y2={36 + i * 9} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={`v${i}`} className={s.bar} x1={44 + i * 21} y1={33} x2={66 + i * 21} y2={71} />
      ))}
      <Dim x1={44} y1={84} x2={65} y2={84} label="12 in o.c." lx={70} ly={87} anchor="start" />
    </>
  ),
  /* Gravel pile with a dump truck */
  stonePile: (
    <>
      <path className={s.fl} d="M70 86 Q110 22 168 86 Z" />
      {[[96, 70, 5], [112, 58, 6], [128, 72, 5], [104, 80, 4], [140, 80, 5], [120, 44, 4.5], [86, 82, 4], [150, 84, 3.5], [116, 78, 3.5], [132, 58, 4]].map(([x, y, r], i) => (
        <circle key={i} className={i % 3 === 0 ? s.f2 : i % 3 === 1 ? s.f1 : s.fm} cx={x} cy={y} r={r} />
      ))}
      <rect className={s.f2} x={14} y={54} width={22} height={22} rx={3} />
      <rect className={s.fp} x={18} y={58} width={12} height={8} rx={1.5} />
      <polygon className={s.f1} points="38,50 70,50 64,76 38,76" />
      <circle className={k('f2', 'ring')} cx={26} cy={80} r={6} />
      <circle className={k('f2', 'ring')} cx={58} cy={80} r={6} />
      <line className={s.dim} x1={6} y1={88} x2={194} y2={88} />
    </>
  ),
  /* Sandbox filled with sand */
  sandDunes: (
    <>
      <polygon className={s.f2} points="30,44 160,44 176,60 46,60" />
      <polygon className={s.fl} points="34,46 158,46 170,58 46,58" />
      <path className={s.fm} d="M40 52 Q70 44 96 52 T150 50 L166 58 L46 58 Z" />
      <polygon className={s.f1} points="46,60 176,60 176,80 46,80" />
      <polygon className={s.f2} points="30,44 46,60 46,80 30,64" />
      {[[70, 54], [98, 55], [124, 53], [146, 55], [84, 56]].map(([x, y], i) => (
        <circle key={i} className={s.f1} cx={x} cy={y} r={1.2} />
      ))}
      <Dim x1={184} y1={60} x2={184} y2={80} label="6 in" lx={186} ly={92} anchor="end" />
    </>
  ),
  /* Paver section: pavers, sand, gravel base, soil */
  layeredBase: (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} className={s.f1} x={16 + i * 22} y={18} width={20} height={12} rx={1.5} />
      ))}
      <rect className={s.fm} x={16} y={31} width={130} height={8} />
      <rect className={s.fl} x={16} y={40} width={130} height={26} />
      {[[26, 48], [40, 58], [56, 50], [72, 60], [88, 47], [104, 57], [120, 50], [136, 59], [32, 61], [96, 62], [64, 45], [128, 45]].map(([x, y], i) => (
        <circle key={i} className={s.f2} cx={x} cy={y} r={i % 2 ? 2.6 : 3.4} />
      ))}
      <rect className={s.f2} x={16} y={67} width={130} height={18} opacity={0.35} />
      <text className={s.tx} x={152} y={27}>
        pavers
      </text>
      <text className={s.tx} x={152} y={38}>
        1&quot; sand
      </text>
      <text className={s.tx} x={152} y={56}>
        4&quot; base
      </text>
      <text className={s.tx} x={152} y={79}>
        soil
      </text>
    </>
  ),
  /* Pavers from above with sand-filled joints */
  paverGrid: (
    <>
      <rect className={s.fm} x={22} y={12} width={156} height={76} rx={4} />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4, 5].map((col) => {
          const x = 24 + col * 28 - (row % 2 ? 14 : 0);
          const y = 14 + row * 18.5;
          const x0 = Math.max(24, x);
          const w = Math.min(x + 26, 176) - x0;
          if (w <= 3) return null;
          return <rect key={`${row}-${col}`} className={(row * 2 + col) % 5 === 0 ? s.f1 : s.fp} x={x0} y={y} width={w} height={16.5} rx={1.5} />;
        }),
      )}
    </>
  ),
  /* Driveway with asphalt thickness */
  road: (
    <>
      <polygon className={s.f2} points="40,86 160,86 124,16 76,16" />
      <polygon className={s.f1} points="160,86 168,78 130,12 124,16" />
      {[0, 1, 2, 3].map((i) => (
        <polygon key={i} className={s.fp} points={`${98.6 - i * 0.2},${22 + i * 17} ${101.4 + i * 0.2},${22 + i * 17} ${101.8 + i * 0.4},${32 + i * 17} ${98.2 - i * 0.4},${32 + i * 17}`} />
      ))}
      <Dim x1={176} y1={70} x2={176} y2={82} label="2 in" lx={180} ly={79} anchor="start" />
      <text className={s.tx} x={20} y={30}>
        tons
      </text>
    </>
  ),
  /* Hole being filled with dirt */
  shovel: (
    <>
      <rect className={s.f1} x={10} y={40} width={180} height={4} opacity={0.6} />
      <polygon className={s.fl} points="60,44 140,44 128,84 72,84" />
      <polygon className={s.f2} points="66,62 134,62 128,84 72,84" opacity={0.85} />
      {[[80, 72], [96, 76], [112, 70], [120, 78], [90, 66]].map(([x, y], i) => (
        <circle key={i} className={s.fm} cx={x} cy={y} r={2} />
      ))}
      <path className={s.f2} d="M146 44 Q162 18 182 44 Z" />
      <line className={k('s2', 'thick')} x1={170} y1={8} x2={160} y2={34} />
      <path className={s.f1} d="M156 30 L166 34 L160 46 L152 42 Z" />
      <Dim x1={150} y1={44} x2={150} y2={84} label="depth" lx={154} ly={68} anchor="start" />
    </>
  ),
  /* Raised bed with compost and seedlings */
  leaf: (
    <>
      <polygon className={s.f2} points="30,54 150,54 172,66 52,66" />
      <polygon className={s.fm} points="36,55 148,55 164,64 52,64" />
      <polygon className={s.f1} points="52,66 172,66 172,86 52,86" />
      <polygon className={s.f2} points="30,54 52,66 52,86 30,74" opacity={0.85} />
      {[70, 100, 130].map((x, i) => (
        <g key={i}>
          <line className={k('s2', 'thick')} x1={x} y1={60} x2={x} y2={40} />
          <path className={s.f1} d={`M${x} 46 Q${x - 14} 40 ${x - 12} 28 Q${x - 2} 34 ${x} 46 Z`} />
          <path className={s.fm} d={`M${x} 42 Q${x + 14} 36 ${x + 12} 24 Q${x + 2} 30 ${x} 42 Z`} />
        </g>
      ))}
    </>
  ),
  /* Striped lawn and a mower */
  mower: (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <polygon key={i} className={i % 2 ? s.fl : s.fm} points={`${12 + i * 30},86 ${42 + i * 30},86 ${62 + i * 26},30 ${38 + i * 26},30`} />
      ))}
      <line className={k('s2', 'thick')} x1={118} y1={62} x2={150} y2={22} />
      <line className={k('s2', 'thick')} x1={144} y1={18} x2={158} y2={26} />
      <rect className={s.f1} x={92} y={56} width={36} height={16} rx={5} />
      <rect className={s.f2} x={98} y={50} width={18} height={8} rx={3} />
      <circle className={k('f2', 'ring')} cx={98} cy={74} r={5} />
      <circle className={k('f2', 'ring')} cx={124} cy={74} r={5} />
      <text className={s.txL} x={20} y={22}>
        $ / visit
      </text>
    </>
  ),
  /* Balance: tons vs cubic yards */
  scale: (
    <>
      <line className={k('s2', 'thick')} x1={100} y1={18} x2={100} y2={84} />
      <rect className={s.f2} x={80} y={82} width={40} height={6} rx={2} />
      <line className={k('s2', 'thick')} x1={40} y1={30} x2={160} y2={22} />
      <circle className={s.f1} cx={100} cy={26} r={4} />
      <line className={s.s2} x1={40} y1={30} x2={30} y2={58} />
      <line className={s.s2} x1={40} y1={30} x2={50} y2={58} />
      <line className={s.s2} x1={160} y1={22} x2={150} y2={50} />
      <line className={s.s2} x1={160} y1={22} x2={170} y2={50} />
      <path className={s.f2} d="M22 58 H58 Q56 66 40 66 Q24 66 22 58 Z" />
      <path className={s.f2} d="M142 50 H178 Q176 58 160 58 Q144 58 142 50 Z" />
      <path className={s.f1} d="M28 58 L32 44 H48 L52 58 Z" />
      <text className={s.txW} x={40} y={55} textAnchor="middle">
        TON
      </text>
      <polygon className={s.fl} points="160,30 172,36 160,42 148,36" />
      <polygon className={s.f1} points="148,36 160,42 160,50 148,44" />
      <polygon className={s.fm} points="160,42 172,36 172,44 160,50" />
      <text className={s.tx} x={160} y={72} textAnchor="middle">
        yd³
      </text>
    </>
  ),
  /* Pipe with OD / ID and water */
  pipe: (
    <>
      <rect className={s.fl} x={40} y={26} width={110} height={48} />
      <line className={s.s2} x1={40} y1={26} x2={150} y2={26} />
      <line className={s.s2} x1={40} y1={74} x2={150} y2={74} />
      <ellipse className={s.f1} cx={150} cy={50} rx={14} ry={24} />
      <ellipse className={s.fp} cx={150} cy={50} rx={9.5} ry={17} />
      <path className={s.fm} d="M140.5 54 Q150 50 159.5 54 L159 58 Q150 70 141 58 Z" />
      <ellipse className={k('fn', 's2')} cx={40} cy={50} rx={14} ry={24} strokeDasharray="3 3" />
      <Dim x1={174} y1={26} x2={174} y2={74} label="OD" lx={179} ly={54} anchor="start" />
      <Dim x1={150} y1={33} x2={150} y2={67} label="" lx={0} ly={0} />
      <text className={s.tx} x={126} y={20}>
        ID
      </text>
      <text className={s.tx} x={60} y={92}>
        gallons per foot
      </text>
    </>
  ),
  /* Gable with rafter and pitch triangle */
  roofTruss: (
    <>
      <polygon className={s.fl} points="20,80 100,22 180,80" />
      <line className={k('s2', 'thick')} x1={14} y1={84} x2={100} y2={22} />
      <line className={k('s2', 'thick')} x1={186} y1={84} x2={100} y2={22} />
      <line className={k('s2', 'thick')} x1={28} y1={80} x2={172} y2={80} />
      <line className={s.s1} x1={100} y1={22} x2={100} y2={80} />
      <line className={s.s1} x1={100} y1={80} x2={60} y2={51} />
      <line className={s.s1} x1={100} y1={80} x2={140} y2={51} />
      <polyline className={k('fn', 's1')} points="132,64 160,64 160,44" strokeWidth={2} />
      <text className={s.tx} x={146} y={72} textAnchor="middle">
        12
      </text>
      <text className={s.tx} x={164} y={57}>
        4
      </text>
      <text className={s.txL} x={20} y={24}>
        4/12
      </text>
    </>
  ),
  /* Roof plane covered in shingle courses */
  shingles: (
    <>
      <polygon className={s.fl} points="20,86 50,22 150,22 180,86" />
      {[0, 1, 2, 3, 4].map((row) => {
        const y = 26 + row * 12;
        const x0 = 48 - row * 6;
        const x1 = 152 + row * 6;
        const n = Math.floor((x1 - x0) / 14);
        return Array.from({ length: n }).map((_, i) => (
          <rect key={`${row}-${i}`} className={(row + i) % 4 === 0 ? s.f2 : s.f1} x={x0 + i * 14 + (row % 2 ? 7 : 0)} y={y} width={12.5} height={10.5} rx={1} />
        ));
      })}
      <rect className={s.f2} x={46} y={16} width={108} height={7} rx={3} />
    </>
  ),
  /* Engine cylinder: bore and stroke, plus a cubic-inch box */
  piston: (
    <>
      <rect className={s.f2} x={22} y={10} width={74} height={10} rx={2} />
      <rect className={s.fl} x={22} y={20} width={9} height={64} />
      <rect className={s.fl} x={87} y={20} width={9} height={64} />
      <rect className={s.fp} x={31} y={26} width={56} height={30} />
      <rect className={s.f1} x={33} y={50} width={52} height={20} rx={2} />
      <path className={k('fn', 's2', 'thick')} d="M59 70 L66 88" />
      <circle className={k('fn', 's2', 'thick')} cx={62} cy={90} r={7} />
      <Dim x1={31} y1={44} x2={87} y2={44} label="bore" lx={59} ly={40} anchor="middle" />
      <polygon className={k('fl', 's2')} points="128,38 158,28 182,38 152,48" />
      <polygon className={s.f1} points="128,38 152,48 152,78 128,68" />
      <polygon className={s.f2} points="152,48 182,38 182,68 152,78" />
      <text className={s.txL} x={155} y={20} textAnchor="middle">
        in³
      </text>
      <text className={s.tx} x={155} y={92} textAnchor="middle">
        ci · cc · L
      </text>
    </>
  ),
  /* Wire cross-sections by gauge */
  bolt: (
    <>
      {[
        { cx: 46, r: 13, core: 6, label: '14 AWG' },
        { cx: 100, r: 16, core: 8, label: '12 AWG' },
        { cx: 156, r: 20, core: 10.5, label: '10 AWG' },
      ].map((w) => (
        <g key={w.label}>
          <circle className={s.f1} cx={w.cx} cy={44} r={w.r} />
          <circle className={s.copper} cx={w.cx} cy={44} r={w.core} />
          <circle className={s.fp} cx={w.cx - w.core / 3} cy={44 - w.core / 3} r={w.core / 4} opacity={0.6} />
          <text className={s.tx} x={w.cx} y={82} textAnchor="middle">
            {w.label}
          </text>
        </g>
      ))}
      <path className={s.f2} d="M20 14 L12 28 H18 L14 38 L26 22 H20 Z" />
    </>
  ),
  /* Stud wall with plates and spacing */
  studWall: (
    <>
      <rect className={s.f2} x={18} y={14} width={164} height={6} rx={1} />
      <rect className={s.f2} x={18} y={21} width={164} height={5} rx={1} opacity={0.8} />
      <rect className={s.f2} x={18} y={80} width={164} height={6} rx={1} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} className={i === 4 || i === 5 ? s.fm : s.f1} x={20 + i * 22.6} y={26} width={5} height={54} />
      ))}
      <rect className={s.f2} x={104} y={36} width={46} height={6} rx={1} />
      <rect className={k('fp', 's2')} x={110} y={44} width={34} height={22} rx={1} />
      <Dim x1={22.5} y1={92} x2={45} y2={92} label='16" o.c.' lx={50} ly={95} anchor="start" />
    </>
  ),
  /* Board with a tape measure */
  ruler: (
    <>
      <rect className={s.f1} x={14} y={22} width={172} height={22} rx={2} />
      {[30, 60, 100, 140, 170].map((x, i) => (
        <path key={i} className={k('fn', 'grain')} d={`M${x - 14} ${28 + (i % 2) * 6} Q${x} ${24 + (i % 2) * 6} ${x + 14} ${30 + (i % 2) * 6}`} />
      ))}
      <rect className={k('fp', 's2')} x={14} y={56} width={172} height={18} rx={2} />
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={i} className={s.s2} x1={20 + i * 9.4} y1={56} x2={20 + i * 9.4} y2={i % 4 === 0 ? 66 : 61} />
      ))}
      <text className={s.tx} x={20} y={88}>
        0
      </text>
      <text className={s.tx} x={176} y={88} textAnchor="end">
        12 ft
      </text>
    </>
  ),
  /* L-shaped floor plan with area */
  squareArea: (
    <>
      <path className={k('fl', 's2')} d="M30 16 H130 V48 H170 V86 H30 Z" strokeWidth={2.4} />
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 12 }).map((__, c) => {
          const x = 38 + c * 11;
          const y = 24 + r * 11;
          if (x > 164 || y > 80 || (x > 126 && y < 50)) return null;
          return <circle key={`${r}-${c}`} className={s.fm} cx={x} cy={y} r={1.2} />;
        }),
      )}
      <text className={s.txL} x={78} y={60} textAnchor="middle">
        sq ft
      </text>
      <Dim x1={30} y1={8} x2={130} y2={8} label="" lx={0} ly={0} />
      <Dim x1={178} y1={48} x2={178} y2={86} label="" lx={0} ly={0} />
    </>
  ),
  /* Drywall sheets with screws and taped seams */
  drywall: (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect className={k('fp', 's2')} x={22 + i * 46} y={14} width={44} height={74} rx={1} />
          {[0, 1, 2, 3, 4].map((r) => [0, 1, 2].map((c) => <circle key={`${r}-${c}`} className={s.f2} cx={28 + i * 46 + c * 16} cy={22 + r * 15} r={1.1} />))}
        </g>
      ))}
      <rect className={s.f1} x={64} y={14} width={6} height={74} opacity={0.75} />
      <rect className={s.f1} x={110} y={14} width={6} height={74} opacity={0.75} />
      <rect className={k('fm', 's2')} x={146} y={20} width={40} height={66} rx={1} transform="rotate(8 166 53)" />
      <text className={s.tx} x={168} y={96} textAnchor="middle">
        4×8
      </text>
    </>
  ),
  /* Tile floor with one cut tile */
  tileGrid: (
    <>
      <rect className={s.f2} x={30} y={10} width={140} height={82} rx={3} opacity={0.6} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4].map((c) => {
          const cut = c === 4;
          return <rect key={`${r}-${c}`} className={(r + c) % 2 ? s.fl : s.fp} x={32 + c * 28} y={12 + r * 20} width={cut ? 14 : 26} height={18} rx={1.5} />;
        }),
      )}
      <rect className={s.f1} x={144} y={52} width={14} height={18} rx={1.5} />
      <line className={k('s2')} x1={151} y1={46} x2={151} y2={76} strokeDasharray="2 2" />
      <text className={s.tx} x={176} y={64}>
        cut
      </text>
    </>
  ),
  /* Floor half sanded: worn planks on the left, fresh finish on the right, sander in the middle */
  floorSander: (
    <>
      {[0, 1, 2, 3].map((r) => {
        const off = [0, 30, 12, 44][r];
        return [0, 1, 2, 3].map((i) => {
          const x0 = Math.max(14, 14 + i * 64 - off);
          const x1 = Math.min(186, 14 + i * 64 - off + 62);
          if (x1 - x0 < 4) return null;
          return <rect key={`${r}-${i}`} className={x0 < 92 ? s.fl : s.f1} x={x0} y={40 + r * 13} width={x1 - x0} height={12} rx={1} />;
        });
      })}
      <path className={k('fn', 's2')} d="M92 38 V94" />
      <rect className={s.f2} x={72} y={22} width={34} height={16} rx={4} />
      <circle className={s.fp} cx={89} cy={38} r={4} />
      <path className={k('fn', 's2', 'thick')} d="M100 22 L118 6 M114 6 H128" />
      <text className={s.tx} x={50} y={20} textAnchor="middle">
        before
      </text>
      <text className={s.txL} x={150} y={26} textAnchor="middle">
        $/ft²
      </text>
    </>
  ),
  /* Staggered laminate planks */
  floorPlanks: (
    <>
      {[0, 1, 2, 3, 4].map((r) => {
        const offset = [0, 40, 18, 58, 30][r];
        const xs = [-offset, 80 - offset, 160 - offset, 240 - offset];
        return xs.map((x, i) => {
          const x0 = Math.max(16, 16 + x);
          const x1 = Math.min(184, 16 + x + 78);
          if (x1 - x0 < 4) return null;
          return (
            <g key={`${r}-${i}`}>
              <rect className={(r + i) % 3 === 0 ? s.f1 : (r + i) % 3 === 1 ? s.fm : s.fl} x={x0} y={14 + r * 15} width={x1 - x0} height={13.5} rx={1} />
              <path className={k('fn', 'grain')} d={`M${x0 + 6} ${20 + r * 15} Q${(x0 + x1) / 2} ${17 + r * 15} ${x1 - 6} ${21 + r * 15}`} />
            </g>
          );
        });
      })}
    </>
  ),
  /* Carpet roll unrolled across room with seam */
  carpetRoll: (
    <>
      <polygon className={k('fl', 's2')} points="24,54 114,34 174,52 84,72" />
      <polygon className={s.f1} points="24,54 84,72 84,84 24,66" />
      <polygon className={s.f2} points="84,72 174,52 174,64 84,84" />
      <line className={k('s2', 'thick')} x1={54} y1={63} x2={144} y2={43} strokeDasharray="3 3" />
      <ellipse className={s.fm} cx={174} cy={58} rx={6} ry={12} />
      <path className={s.f1} d="M140 38 Q174 46 174 58 L174 70 Q140 58 140 46 Z" />
      <Dim x1={84} y1={92} x2={174} y2={72} label="12 ft roll" lx={132} ly={90} />
      <text className={s.tx} x={105} y={50} textAnchor="middle">seam</text>
    </>
  ),
  /* Wall half painted, roller and can */
  paintRoller: (
    <>
      <rect className={s.fl} x={14} y={12} width={116} height={78} rx={3} />
      <path className={s.f1} d="M14 12 H86 Q78 50 90 90 H14 Z" />
      <rect className={s.f2} x={84} y={22} width={34} height={14} rx={6} />
      <path className={k('fn', 's2', 'thick')} d="M118 29 H124 V46 H101 V64" />
      <rect className={s.f2} x={97} y={62} width={8} height={20} rx={2} />
      <path className={s.f2} d="M146 50 H182 V86 Q164 92 146 86 Z" />
      <ellipse className={s.f1} cx={164} cy={50} rx={18} ry={5} />
      <text className={s.txW} x={164} y={74} textAnchor="middle">
        gal
      </text>
    </>
  ),
  /* Picket fence, half stained */
  fence: (
    <>
      <rect className={s.f2} x={14} y={40} width={172} height={6} rx={1} />
      <rect className={s.f2} x={14} y={70} width={172} height={6} rx={1} />
      {Array.from({ length: 11 }).map((_, i) => {
        const x = 18 + i * 15.5;
        return <path key={i} className={i < 6 ? s.f1 : s.fl} d={`M${x} 88 V26 L${x + 5.5} 16 L${x + 11} 26 V88 Z`} />;
      })}
      <line className={s.dim} x1={110} y1={8} x2={110} y2={94} strokeDasharray="3 3" />
      <text className={s.tx} x={106} y={12} textAnchor="end">
        stained
      </text>
    </>
  ),
  /* Board and batten wall with equal gaps */
  battenWall: (
    <>
      <rect className={s.fl} x={18} y={8} width={164} height={76} rx={2} />
      <rect className={s.f2} x={18} y={8} width={164} height={7} />
      <rect className={s.f2} x={18} y={78} width={164} height={8} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} className={s.f1} x={18 + i * 31.6} y={15} width={6.4} height={63} />
      ))}
      <Dim x1={24.4} y1={50} x2={49.6} y2={50} label="" lx={0} ly={0} />
      <Dim x1={56} y1={50} x2={81.2} y2={50} label="" lx={0} ly={0} />
      <text className={s.tx} x={100} y={97} textAnchor="middle">
        equal gaps
      </text>
    </>
  ),
  /* Estimate sheet on a clipboard */
  clipboard: (
    <>
      <rect className={s.f2} x={56} y={10} width={88} height={84} rx={6} />
      <rect className={s.fp} x={62} y={18} width={76} height={70} rx={3} />
      <rect className={s.f1} x={84} y={6} width={32} height={10} rx={3} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect className={s.fm} x={68} y={28 + i * 11} width={38} height={4} rx={2} />
          <rect className={s.fm} x={116} y={28 + i * 11} width={16} height={4} rx={2} />
        </g>
      ))}
      <line className={s.s2} x1={68} y1={74} x2={132} y2={74} />
      <text className={s.tx} x={68} y={84}>
        TOTAL
      </text>
      <text className={s.txL} x={132} y={84} textAnchor="end">
        $
      </text>
      <path className={k('fn', 's1', 'thick')} d="M154 40 l6 6 l12 -14" />
      <path className={k('fn', 's1', 'thick')} d="M28 56 l6 6 l12 -14" />
    </>
  ),
  /* Guitar with notes and a name tag */
  guitar: (
    <>
      <rect className={s.f2} x={92} y={8} width={10} height={44} rx={2} transform="rotate(30 97 30)" />
      <circle className={s.f1} cx={74} cy={62} r={20} />
      <circle className={s.f1} cx={88} cy={46} r={14} />
      <circle className={s.f2} cx={78} cy={56} r={5} />
      <path className={s.f2} d="M140 22 v20 a5 4 0 1 1 -3 -3.6 v-16.4 h14 v4 h-11 Z" />
      <path className={s.fm} d="M170 40 v16 a4 3.4 0 1 1 -2.6 -3 v-13 Z" />
      <rect className={k('fp', 's2')} x={120} y={62} width={64} height={22} rx={11} />
      <text className={s.tx} x={152} y={76} textAnchor="middle">
        The ____
      </text>
    </>
  ),
  /* Percentage Change Calculator: Before vs after bar comparison with curved delta arrow */
  percent: (
    <>
      <rect className={s.f2} x={28} y={46} width={42} height={36} rx={4} />
      <rect className={s.f1} x={82} y={26} width={42} height={56} rx={4} />
      <text className={s.txW} x={49} y={68} textAnchor="middle" fontSize={10} fontWeight={800}>
        80
      </text>
      <text className={s.txW} x={103} y={58} textAnchor="middle" fontSize={10} fontWeight={800}>
        100
      </text>
      <path className={k('fn', 's2', 'thick')} d="M50 40 Q75 14, 102 20" />
      <polygon className={s.f2} points="104,14 107,24 98,22" />
      <rect className={k('fp', 's2')} x={136} y={26} width={54} height={48} rx={6} />
      <text className={s.txL} x={163} y={44} textAnchor="middle" fontSize={12} fontWeight={800} fill="#16a34a">
        +25.0%
      </text>
      <text className={s.tx} x={163} y={58} textAnchor="middle" fontSize={8} fontWeight={700}>
        Increase
      </text>
      <text className={s.tx} x={163} y={68} textAnchor="middle" fontSize={7.5} fontWeight={600}>
        Δ = +20
      </text>
      <Dim x1={28} y1={88} x2={124} y2={88} label="(New − Old) ÷ Old × 100" lx={76} ly={95} />
    </>
  ),
  /* Markup Calculator: Retail price tag with string hole, price transition & markup arrow */
  tag: (
    <>
      <path
        className={k('fl', 's2')}
        d="M 108 22 L 64 22 C 60 22 56 24 53 27 L 24 56 C 20 60 20 68 24 72 L 50 98 C 54 102 62 102 66 98 L 95 69 C 98 66 100 62 100 58 L 100 30 C 100 25 104 22 108 22 Z"
      />
      <circle className={s.fp} cx={86} cy={34} r={4.5} />
      <circle className={s.f1} cx={86} cy={34} r={2.5} />
      <path className={k('fn', 's2')} d="M86 32 C78 18 90 12 98 16" strokeDasharray="2 1.5" />
      <text className={s.tx} x={60} y={58} textAnchor="middle" fontSize={9} fontWeight={700}>
        Cost $40
      </text>
      <text className={s.tx} x={60} y={72} textAnchor="middle" fontSize={10} fontWeight={800}>
        → $60
      </text>
      <rect className={k('fp', 's2')} x={114} y={28} width={76} height={50} rx={6} />
      <text className={s.txL} x={152} y={48} textAnchor="middle" fontSize={12} fontWeight={800}>
        +50% M/U
      </text>
      <text className={s.tx} x={152} y={62} textAnchor="middle" fontSize={8.5} fontWeight={600}>
        $20 Profit
      </text>
      <text className={s.tx} x={152} y={72} textAnchor="middle" fontSize={8} fontWeight={600}>
        33.3% Margin
      </text>
      <Dim x1={24} y1={102} x2={100} y2={102} label="(Price − Cost) ÷ Cost" lx={62} ly={108} />
    </>
  ),
  /* Profit Margin Calculator: Revenue waterfall split into COGS and Gross Margin */
  margin: (
    <>
      <rect className={s.f2} x={24} y={26} width={88} height={30} rx={4} />
      <rect className={s.f1} x={112} y={26} width={64} height={30} rx={4} />
      <text className={s.txW} x={68} y={44} textAnchor="middle" fontSize={9.5} fontWeight={700}>
        COGS $60 (60%)
      </text>
      <text className={s.txW} x={144} y={44} textAnchor="middle" fontSize={9.5} fontWeight={800}>
        GP $40 (40%)
      </text>
      <rect className={k('fp', 's2')} x={56} y={64} width={88} height={22} rx={11} />
      <text className={s.txL} x={100} y={79} textAnchor="middle" fontSize={10} fontWeight={800}>
        40.0% Gross Margin
      </text>
      <Dim x1={24} y1={92} x2={176} y2={92} label="$100 Revenue = Cost of Goods + Profit" lx={100} ly={98} />
    </>
  ),
  /* Unit Price Calculator: Two retail bottles with price-per-ounce comparison and best-value rosette */
  unitPrice: (
    <>
      <rect className={s.f2} x={26} y={42} width={26} height={38} rx={4} />
      <rect className={s.fm} x={33} y={34} width={12} height={8} rx={2} />
      <text className={s.txW} x={39} y={62} textAnchor="middle" fontSize={8} fontWeight={700}>
        12 oz
      </text>
      <rect className={k('fp', 's2')} x={20} y={82} width={38} height={14} rx={2} />
      <text className={s.tx} x={39} y={92} textAnchor="middle" fontSize={8} fontWeight={700}>
        75¢ / oz
      </text>
      <rect className={s.f1} x={74} y={28} width={44} height={52} rx={6} />
      <rect className={s.fm} x={88} y={20} width={16} height={8} rx={2} />
      <path className={k('fn', 's1', 'thick')} d="M74 36 Q64 44 74 54" />
      <text className={s.txW} x={96} y={56} textAnchor="middle" fontSize={9.5} fontWeight={800}>
        32 oz
      </text>
      <rect className={k('fp', 's2')} x={72} y={82} width={48} height={14} rx={2} />
      <text className={s.txL} x={96} y={92} textAnchor="middle" fontSize={8.5} fontWeight={800}>
        58¢ / oz
      </text>
      <rect className={k('fp', 's2')} x={132} y={32} width={58} height={46} rx={8} />
      <circle className={s.f1} cx={161} cy={44} r={8} />
      <polygon className={s.fp} points="161,38 163,42 168,43 164,46 165,50 161,48 157,50 158,46 154,43 159,42" />
      <text className={s.txL} x={161} y={64} textAnchor="middle" fontSize={8} fontWeight={800}>
        BEST VALUE
      </text>
      <text className={s.tx} x={161} y={73} textAnchor="middle" fontSize={7} fontWeight={600}>
        Save 23%
      </text>
    </>
  ),
  /* Hourly to Salary: Clock face connected by transfer arrow to salary paycheck */
  wage: (
    <>
      <circle className={s.f2} cx={46} cy={48} r={24} />
      <circle className={s.fp} cx={46} cy={48} r={20} />
      <line className={k('s2', 'thick')} x1={46} y1={48} x2={46} y2={34} />
      <line className={k('s2', 'thick')} x1={46} y1={48} x2={56} y2={48} />
      <circle className={s.f1} cx={46} cy={48} r={2.5} />
      <text className={s.tx} x={46} y={80} textAnchor="middle" fontSize={8.5} fontWeight={700}>
        $25.00 / hr
      </text>
      <path className={k('fn', 's1', 'thick')} d="M74 42 C86 32, 98 32, 108 40" />
      <polygon className={s.f1} points="110,34 114,44 104,43" />
      <rect className={s.f1} x={122} y={32} width={64} height={42} rx={4} />
      <polygon className={s.fm} points="122,32 154,52 186,32" />
      <rect className={s.fp} x={132} y={24} width={44} height={14} rx={2} />
      <text className={s.txL} x={154} y={34} textAnchor="middle" fontSize={8.5} fontWeight={800}>
        $52,000 / yr
      </text>
      <Dim x1={22} y1={90} x2={186} y2={90} label="2,080 Work Hours per Year (40 hrs × 52 wks)" lx={104} ly={96} />
    </>
  ),
  /* Discount Calculator: Hanging retail sale tag with strike-through & savings badge */
  discount: (
    <>
      <path
        className={k('fl', 's2')}
        d="M 96 24 L 54 24 C 50 24 47 26 44 29 L 22 57 C 18 61 18 69 22 73 L 44 95 C 48 99 56 99 60 95 L 82 73 C 85 70 87 66 87 62 L 87 32 C 87 27 91 24 96 24 Z"
      />
      <circle className={s.fp} cx={74} cy={36} r={4.5} />
      <circle className={s.f1} cx={74} cy={36} r={2.5} />
      <text className={s.tx} x={50} y={58} textAnchor="middle" fontSize={8.5} textDecoration="line-through">
        $100.00
      </text>
      <text className={s.txL} x={50} y={74} textAnchor="middle" fontSize={11} fontWeight={800}>
        $80.00
      </text>
      <rect className={s.f1} x={108} y={26} width={76} height={30} rx={6} />
      <text className={s.txW} x={146} y={46} textAnchor="middle" fontSize={13} fontWeight={800}>
        −20% OFF
      </text>
      <rect className={k('fp', 's2')} x={114} y={64} width={64} height={22} rx={4} />
      <text className={s.tx} x={146} y={78} textAnchor="middle" fontSize={8.5} fontWeight={700}>
        You Save $20.00
      </text>
    </>
  ),
  /* Cap Rate Calculator: Commercial office building with illuminated windows, property sign & NOI yield badge */
  capRate: (
    <>
      <rect className={s.f2} x={24} y={16} width={58} height={68} rx={2} />
      <rect className={s.fm} x={36} y={10} width={34} height={6} rx={1} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}-${c}`} className={s.fp} x={30 + c * 16} y={20 + r * 11} width={10} height={7} rx={1} />
        ))
      )}
      <rect className={s.fl} x={44} y={66} width={18} height={18} rx={1} />
      <line className={s.sp} x1={53} y1={66} x2={53} y2={84} />
      <line className={s.s2} x1={92} y1={56} x2={92} y2={84} strokeWidth={2} />
      <rect className={s.f1} x={84} y={44} width={28} height={16} rx={2} />
      <text className={s.txW} x={98} y={55} textAnchor="middle" fontSize={6.5} fontWeight={700}>
        $2.4M
      </text>
      <rect className={k('fp', 's2')} x={118} y={20} width={74} height={62} rx={6} />
      <text className={s.tx} x={155} y={36} textAnchor="middle" fontSize={8.5} fontWeight={700}>
        NOI $127,560
      </text>
      <line className={s.dim} x1={126} y1={42} x2={184} y2={42} />
      <text className={s.txL} x={155} y={58} textAnchor="middle" fontSize={14} fontWeight={800} fill="#16a34a">
        5.32%
      </text>
      <text className={s.tx} x={155} y={72} textAnchor="middle" fontSize={8} fontWeight={600}>
        Cap Rate Yield
      </text>
      <Dim x1={24} y1={90} x2={192} y2={90} label="NOI ÷ Purchase Price = Capitalization Rate" lx={108} ly={96} />
    </>
  ),
  /* Rental Property: 2-story residential home with pitched roof, porch, "FOR RENT" lawn sign & cash flow tag */
  rentalProperty: (
    <>
      <polygon className={s.f1} points="18,42 56,16 94,42" />
      <rect className={s.f2} x={74} y={18} width={8} height={14} />
      <rect className={s.f2} x={24} y={42} width={64} height={42} rx={1} />
      <rect className={s.fp} x={32} y={48} width={12} height={12} rx={1} />
      <line className={s.s2} x1={38} y1={48} x2={38} y2={60} strokeWidth={0.8} />
      <line className={s.s2} x1={32} y1={54} x2={44} y2={54} strokeWidth={0.8} />
      <rect className={s.fp} x={68} y={48} width={12} height={12} rx={1} />
      <line className={s.s2} x1={74} y1={48} x2={74} y2={60} strokeWidth={0.8} />
      <line className={s.s2} x1={68} y1={54} x2={80} y2={54} strokeWidth={0.8} />
      <rect className={s.fp} x={50} y={64} width={12} height={20} rx={1} />
      <circle className={s.f2} cx={59} cy={74} r={1} />
      <line className={k('s2', 'thick')} x1={102} y1={52} x2={102} y2={84} />
      <rect className={s.f1} x={94} y={46} width={28} height={14} rx={2} />
      <text className={s.txW} x={108} y={56} textAnchor="middle" fontSize={6} fontWeight={800}>
        FOR RENT
      </text>
      <rect className={k('fp', 's2')} x={126} y={22} width={66} height={62} rx={6} />
      <text className={s.tx} x={159} y={38} textAnchor="middle" fontSize={8} fontWeight={700}>
        Net Cash Flow
      </text>
      <text className={s.txL} x={159} y={54} textAnchor="middle" fontSize={12} fontWeight={800} fill="#16a34a">
        +$243/mo
      </text>
      <line className={s.dim} x1={134} y1={60} x2={184} y2={60} />
      <text className={s.tx} x={159} y={72} textAnchor="middle" fontSize={8} fontWeight={700}>
        8.4% CoC Return
      </text>
      <Dim x1={18} y1={90} x2={192} y2={90} label="Rent − Mortgage − Expenses = Cash Flow" lx={105} ly={96} />
    </>
  ),
  /* Labor Cost: Safety hardhat, employee timecard badge & burdened wage breakdown */
  laborCost: (
    <>
      <path className={s.f1} d="M22 52 Q22 28 52 28 Q82 28 82 52 Z" />
      <path className={s.f2} d="M16 52 C16 49 88 49 88 52 C88 56 16 56 16 52 Z" />
      <path className={s.fp} d="M48 28 Q52 25 56 28 L56 50 L48 50 Z" opacity={0.6} />
      <rect className={k('fp', 's2')} x={88} y={24} width={42} height={60} rx={4} />
      <rect className={s.f2} x={103} y={20} width={12} height={4} rx={1} />
      <circle className={s.fm} cx={109} cy={38} r={7} />
      <path className={s.fm} d="M99 54 Q109 46 119 54" />
      <line className={s.dim} x1={94} y1={62} x2={124} y2={62} />
      <line className={s.dim} x1={94} y1={68} x2={124} y2={68} />
      <line className={s.dim} x1={94} y1={74} x2={116} y2={74} />
      <rect className={k('fp', 's2')} x={136} y={22} width={58} height={62} rx={6} />
      <text className={s.tx} x={165} y={36} textAnchor="middle" fontSize={8} fontWeight={700}>
        Base $30.00/hr
      </text>
      <text className={s.tx} x={165} y={48} textAnchor="middle" fontSize={7.5} fontWeight={600}>
        +22.6% Taxes/Ins
      </text>
      <line className={s.dim} x1={142} y1={54} x2={188} y2={54} />
      <text className={s.txL} x={165} y={68} textAnchor="middle" fontSize={11.5} fontWeight={800} fill="#0284c7">
        $39.86/hr
      </text>
      <text className={s.tx} x={165} y={78} textAnchor="middle" fontSize={7} fontWeight={600}>
        True Burdened Cost
      </text>
      <Dim x1={20} y1={90} x2={194} y2={90} label="Wages + FICA + Workers' Comp + Benefits" lx={107} ly={96} />
    </>
  ),
  /* Commercial Lease: Commercial storefront with striped awning, plate-glass windows & NNN badge */
  commercialLease: (
    <>
      <rect className={s.f2} x={22} y={20} width={88} height={64} rx={2} />
      <polygon className={s.f1} points="18,36 114,36 118,48 14,48" />
      {[0, 1, 2, 3, 4].map((i) => (
        <polygon key={i} className={s.fp} points={`${24 + i * 18},36 ${32 + i * 18},36 ${30 + i * 18},48 ${22 + i * 18},48`} opacity={0.65} />
      ))}
      <rect className={s.fp} x={28} y={52} width={24} height={28} rx={1} />
      <rect className={s.fl} x={56} y={50} width={20} height={34} rx={1} />
      <line className={s.s2} x1={66} y1={50} x2={66} y2={84} strokeWidth={1} />
      <rect className={s.fp} x={80} y={52} width={24} height={28} rx={1} />
      <rect className={s.f1} x={36} y={24} width={60} height={9} rx={2} />
      <text className={s.txW} x={66} y={31} textAnchor="middle" fontSize={6.5} fontWeight={800}>
        SPACE FOR LEASE
      </text>
      <rect className={k('fp', 's2')} x={118} y={20} width={74} height={64} rx={6} />
      <text className={s.tx} x={155} y={34} textAnchor="middle" fontSize={8} fontWeight={700}>
        2,300 RSF
      </text>
      <text className={s.tx} x={155} y={45} textAnchor="middle" fontSize={7.5} fontWeight={600}>
        $24/SF + $6 NNN
      </text>
      <line className={s.dim} x1={126} y1={50} x2={184} y2={50} />
      <text className={s.txL} x={155} y={64} textAnchor="middle" fontSize={11.5} fontWeight={800}>
        $6,133/mo
      </text>
      <text className={s.tx} x={155} y={76} textAnchor="middle" fontSize={7} fontWeight={600}>
        Total Monthly Rent
      </text>
      <Dim x1={18} y1={90} x2={192} y2={90} label="Base Rent + NNN Operating Expenses" lx={105} ly={96} />
    </>
  ),
  /* Airbnb Profit: A-frame vacation cabin nestled among pines with booking calendar card */
  airbnbHost: (
    <>
      <polygon className={s.f2} points="18,36 10,50 26,50" />
      <polygon className={s.f2} points="18,46 8,62 28,62" />
      <polygon className={s.f2} points="18,58 6,76 30,76" />
      <line className={k('s2', 'thick')} x1={18} y1={76} x2={18} y2={84} />
      <polygon className={s.f1} points="60,18 28,84 92,84" />
      <polygon className={s.fp} points="60,26 36,80 84,80" opacity={0.85} />
      <line className={s.s2} x1={60} y1={26} x2={60} y2={80} strokeWidth={1.2} />
      <line className={s.s2} x1={44} y1={60} x2={76} y2={60} strokeWidth={1} />
      <rect className={s.f2} x={54} y={64} width={12} height={16} rx={1} />
      <line className={k('s1', 'thick')} x1={22} y1={84} x2={98} y2={84} />
      <rect className={k('fp', 's2')} x={102} y={20} width={90} height={64} rx={6} />
      <rect className={s.f1} x={102} y={20} width={90} height={16} rx={6} />
      <text className={s.txW} x={147} y={32} textAnchor="middle" fontSize={8} fontWeight={800}>
        CALENDAR BOOKINGS
      </text>
      <text className={s.tx} x={147} y={48} textAnchor="middle" fontSize={8} fontWeight={700}>
        65% Occ · $180/nt
      </text>
      <line className={s.dim} x1={110} y1={54} x2={184} y2={54} />
      <text className={s.txL} x={147} y={68} textAnchor="middle" fontSize={11} fontWeight={800} fill="#16a34a">
        +$967/mo Net
      </text>
      <text className={s.tx} x={147} y={78} textAnchor="middle" fontSize={7} fontWeight={600}>
        15.5% Cash-on-Cash
      </text>
      <Dim x1={18} y1={90} x2={192} y2={90} label="ADR · Occupancy · Cleaning &amp; Platform Fees" lx={105} ly={96} />
    </>
  ),
  /* Freelance Rate: Workspace desk with open laptop, coffee mug & stopwatch billable rate dial */
  freelanceRate: (
    <>
      <line className={k('s2', 'thick')} x1={14} y1={84} x2={190} y2={84} />
      <polygon className={s.f2} points="24,78 76,78 82,82 18,82" />
      <polygon className={s.f1} points="26,46 74,46 76,78 24,78" />
      <rect className={s.fp} x={30} y={50} width={40} height={24} rx={1} opacity={0.9} />
      <line className={s.s2} x1={34} y1={56} x2={56} y2={56} strokeWidth={1} />
      <line className={s.s2} x1={34} y1={60} x2={64} y2={60} strokeWidth={1} />
      <line className={s.s2} x1={34} y1={64} x2={48} y2={64} strokeWidth={1} />
      <rect className={s.fm} x={88} y={64} width={12} height={16} rx={2} />
      <path className={k('fn', 's2')} d="M100 68 Q106 72 100 76" />
      <circle className={s.f2} cx={146} cy={44} r={22} />
      <circle className={s.fp} cx={146} cy={44} r={18} />
      <rect className={s.f1} x={143} y={18} width={6} height={4} rx={1} />
      <line className={k('s1', 'thick')} x1={146} y1={44} x2={146} y2={32} />
      <line className={k('s1', 'thick')} x1={146} y1={44} x2={156} y2={44} />
      <circle className={s.f2} cx={146} cy={44} r={2.5} />
      <rect className={k('fp', 's2')} x={118} y={70} width={68} height={18} rx={4} />
      <text className={s.txL} x={152} y={82} textAnchor="middle" fontSize={9.5} fontWeight={800} fill="#0284c7">
        $99.33 / hr
      </text>
      <Dim x1={20} y1={90} x2={188} y2={90} label="Goal: $70k Net · 1,260 Billable Hours" lx={104} ly={96} />
    </>
  ),
  /* Contribution Margin: Coordinate break-even chart with fixed cost line, total cost, revenue & break-even point */
  contributionMargin: (
    <>
      <line className={k('s2', 'thick')} x1={28} y1={18} x2={28} y2={82} />
      <line className={k('s2', 'thick')} x1={28} y1={82} x2={186} y2={82} />
      <line className={s.dim} x1={28} y1={60} x2={184} y2={60} strokeDasharray="3 2" />
      <text className={s.tx} x={64} y={56} textAnchor="middle" fontSize={7} fontWeight={600}>
        Fixed Costs
      </text>
      <line className={s.s2} x1={28} y1={60} x2={180} y2={30} strokeWidth={2} />
      <line className={s.s1} x1={28} y1={82} x2={180} y2={20} strokeWidth={2.4} />
      <circle className={s.fp} cx={104} cy={45} r={5} />
      <circle className={s.f1} cx={104} cy={45} r={3} />
      <rect className={k('fp', 's2')} x={118} y={16} width={68} height={46} rx={5} />
      <text className={s.tx} x={152} y={28} textAnchor="middle" fontSize={7.5} fontWeight={700}>
        Break-Even Point
      </text>
      <text className={s.txL} x={152} y={42} textAnchor="middle" fontSize={10} fontWeight={800}>
        1,000 Units
      </text>
      <text className={s.tx} x={152} y={54} textAnchor="middle" fontSize={8} fontWeight={700} fill="#16a34a">
        40.0% CM Ratio
      </text>
      <Dim x1={28} y1={90} x2={186} y2={90} label="Price − Variable Cost = Contribution Margin" lx={107} ly={96} />
    </>
  ),
  /* Commercial Mortgage: Classical bank building with columns, LTV dial meter & 10-year balloon callout */
  commercialMortgage: (
    <>
      <polygon className={s.f1} points="16,36 54,16 92,36" />
      <rect className={s.f2} x={14} y={36} width={80} height={6} rx={1} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} className={s.fp} x={22 + i * 18} y={42} width={8} height={36} rx={1} />
      ))}
      <rect className={s.f2} x={12} y={78} width={84} height={6} rx={1} />
      <rect className={k('fp', 's2')} x={108} y={18} width={80} height={66} rx={6} />
      <text className={s.tx} x={148} y={32} textAnchor="middle" fontSize={8} fontWeight={700}>
        10-Yr Term · 75% LTV
      </text>
      <line className={s.dim} x1={116} y1={38} x2={180} y2={38} />
      <text className={s.tx} x={148} y={48} textAnchor="middle" fontSize={7.5} fontWeight={600}>
        Balloon Balance
      </text>
      <text className={s.txL} x={148} y={62} textAnchor="middle" fontSize={13} fontWeight={800} fill="#0284c7">
        $1.18M
      </text>
      <text className={s.tx} x={148} y={74} textAnchor="middle" fontSize={7} fontWeight={600}>
        $10,602/mo · 1.26× DSCR
      </text>
      <Dim x1={12} y1={90} x2={190} y2={90} label="10-Year Balloon on 25-Year Amortization" lx={101} ly={96} />
    </>
  ),
  /* Equipment Loan: Hydraulic construction excavator with boom, cab, crawler tracks & financing badge */
  equipmentLoan: (
    <>
      <rect className={s.f2} x={18} y={68} width={62} height={14} rx={7} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} className={s.fp} cx={25 + i * 12} cy={75} r={3.5} />
      ))}
      <rect className={s.f1} x={24} y={42} width={42} height={26} rx={4} />
      <rect className={s.fp} x={44} y={46} width={18} height={14} rx={2} opacity={0.9} />
      <rect className={s.fm} x={20} y={48} width={8} height={18} rx={2} />
      <line className={k('s1', 'thick')} x1={60} y1={52} x2={86} y2={28} strokeWidth={5} />
      <line className={k('s2', 'thick')} x1={86} y1={28} x2={108} y2={50} strokeWidth={4} />
      <polygon className={s.f2} points="108,50 118,60 112,68 102,62" />
      <rect className={k('fp', 's2')} x={124} y={20} width={66} height={64} rx={6} />
      <text className={s.tx} x={157} y={34} textAnchor="middle" fontSize={8} fontWeight={700}>
        $75.3k Machine
      </text>
      <text className={s.tx} x={157} y={45} textAnchor="middle" fontSize={7.5} fontWeight={600}>
        60 Mo @ 8.5%
      </text>
      <line className={s.dim} x1={132} y1={50} x2={182} y2={50} />
      <text className={s.txL} x={157} y={64} textAnchor="middle" fontSize={11} fontWeight={800} fill="#0284c7">
        $1,545/mo
      </text>
      <text className={s.tx} x={157} y={76} textAnchor="middle" fontSize={7} fontWeight={600}>
        Loan vs. Lease
      </text>
      <Dim x1={18} y1={90} x2={190} y2={90} label="Equipment Loan · Finance vs Lease vs Cash" lx={104} ly={96} />
    </>
  ),
  /* Business Valuation: Enterprise valuation multiple speedometer gauge with valuation range */
  businessValuation: (
    <>
      <path className={k('fn', 's2')} d="M26 66 A36 36 0 0 1 98 66" strokeWidth={10} strokeLinecap="round" />
      <path className={k('fn', 's1')} d="M26 66 A36 36 0 0 1 74 33" strokeWidth={10} strokeLinecap="round" />
      <line className={k('s1', 'thick')} x1={62} y1={66} x2={78} y2={40} strokeWidth={2.5} />
      <circle className={s.f2} cx={62} cy={66} r={5} />
      <circle className={s.fp} cx={62} cy={66} r={2} />
      <text className={s.tx} x={28} y={78} textAnchor="middle" fontSize={7} fontWeight={700}>
        2.0×
      </text>
      <text className={s.tx} x={62} y={24} textAnchor="middle" fontSize={7} fontWeight={700}>
        3.0×
      </text>
      <text className={s.tx} x={96} y={78} textAnchor="middle" fontSize={7} fontWeight={700}>
        4.0×
      </text>
      <rect className={k('fp', 's2')} x={112} y={18} width={78} height={66} rx={6} />
      <text className={s.tx} x={151} y={32} textAnchor="middle" fontSize={8} fontWeight={700}>
        $241k SDE
      </text>
      <text className={s.tx} x={151} y={43} textAnchor="middle" fontSize={7.5} fontWeight={600}>
        2.0× – 3.0× Multiples
      </text>
      <line className={s.dim} x1={120} y1={48} x2={182} y2={48} />
      <text className={s.txL} x={151} y={62} textAnchor="middle" fontSize={10} fontWeight={800} fill="#0d9488">
        $482k – $723k
      </text>
      <text className={s.tx} x={151} y={74} textAnchor="middle" fontSize={7.5} fontWeight={600}>
        Enterprise Value
      </text>
      <Dim x1={20} y1={90} x2={190} y2={90} label="SDE &amp; EBITDA Multiples · Valuation Method" lx={105} ly={96} />
    </>
  ),
  /* Present Value: Time-value timeline discounting future cash bundles back into a present value vault */
  presentValue: (
    <>
      <rect className={s.f2} x={18} y={34} width={42} height={48} rx={4} />
      <circle className={s.fp} cx={39} cy={58} r={14} />
      <circle className={s.f1} cx={39} cy={58} r={8} />
      <line className={s.sp} x1={39} y1={46} x2={39} y2={70} strokeWidth={1.5} />
      <line className={s.sp} x1={27} y1={58} x2={51} y2={58} strokeWidth={1.5} />
      <text className={s.txW} x={39} y={30} textAnchor="middle" fontSize={7.5} fontWeight={800}>
        T₀ NOW
      </text>
      <rect className={s.f1} x={148} y={42} width={34} height={38} rx={3} />
      <rect className={s.fm} x={152} y={36} width={26} height={6} rx={1} />
      <text className={s.txW} x={165} y={62} textAnchor="middle" fontSize={7.5} fontWeight={800}>
        $10k FV
      </text>
      <text className={s.txW} x={165} y={72} textAnchor="middle" fontSize={6.5}>
        in 10 Yrs
      </text>
      <path className={k('fn', 's1', 'thick')} d="M148 48 C116 22, 80 22, 54 36" strokeDasharray="3 2" />
      <polygon className={s.f1} points="52,32 50,42 60,39" />
      <rect className={k('fp', 's2')} x={72} y={38} width={66} height={42} rx={6} />
      <text className={s.tx} x={105} y={50} textAnchor="middle" fontSize={7.5} fontWeight={600}>
        @ 6% Discount
      </text>
      <text className={s.txL} x={105} y={64} textAnchor="middle" fontSize={10.5} fontWeight={800} fill="#0284c7">
        PV: $5,584
      </text>
      <text className={s.tx} x={105} y={74} textAnchor="middle" fontSize={6.5} fontWeight={600}>
        PV = FV ÷ (1+r)ⁿ
      </text>
      <Dim x1={18} y1={90} x2={186} y2={90} label="Discounted Cash Flow (DCF) &amp; NPV Model" lx={102} ly={96} />
    </>
  ),
  /* Compound Interest: Exponential growth staircase with principal, contributions and compounding layer */
  compoundInterest: (
    <>
      <line className={k('s2', 'thick')} x1={26} y1={18} x2={26} y2={84} />
      <line className={k('s2', 'thick')} x1={26} y1={84} x2={186} y2={84} />
      <rect className={s.f2} x={36} y={66} width={18} height={18} rx={2} />
      <rect className={s.f2} x={64} y={56} width={18} height={28} rx={2} />
      <rect className={s.fm} x={64} y={50} width={18} height={6} rx={1} />
      <rect className={s.f2} x={94} y={48} width={18} height={36} rx={2} />
      <rect className={s.fm} x={94} y={38} width={18} height={10} rx={1} />
      <rect className={s.f1} x={94} y={32} width={18} height={6} rx={1} />
      <rect className={s.f2} x={126} y={44} width={18} height={40} rx={2} />
      <rect className={s.fm} x={126} y={28} width={18} height={16} rx={1} />
      <rect className={s.f1} x={126} y={16} width={18} height={12} rx={1} />
      <path className={k('fn', 's1', 'thick')} d="M30 76 Q78 72, 110 46 T174 14" />
      <circle className={s.f1} cx={174} cy={14} r={3.5} />
      <rect className={k('fp', 's2')} x={148} y={30} width={44} height={46} rx={4} />
      <text className={s.tx} x={170} y={42} textAnchor="middle" fontSize={6.5} fontWeight={700}>
        10 Yrs @ 5%
      </text>
      <text className={s.txL} x={170} y={56} textAnchor="middle" fontSize={8.5} fontWeight={800} fill="#0284c7">
        $47,526
      </text>
      <text className={s.tx} x={170} y={68} textAnchor="middle" fontSize={6.5} fontWeight={600}>
        Total FV
      </text>
      <Dim x1={26} y1={90} x2={186} y2={90} label="Principal + Monthly Contributions + Compound Interest" lx={106} ly={96} />
    </>
  ),
  /* Card Processing Fee: Countertop POS payment terminal with inserted chip card & receipt tape */
  processingFee: (
    <>
      <rect className={s.f2} x={26} y={24} width={62} height={60} rx={6} />
      <rect className={s.f1} x={36} y={10} width={42} height={20} rx={3} />
      <rect className={s.gold} x={44} y={14} width={8} height={6} rx={1} />
      <rect className={s.fp} x={32} y={32} width={50} height={20} rx={3} />
      <text className={s.txL} x={57} y={45} textAnchor="middle" fontSize={9} fontWeight={800}>
        $100.00
      </text>
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <circle key={`${r}-${c}`} className={s.fm} cx={42 + c * 15} cy={59 + r * 6} r={2} />
        ))
      )}
      <path
        className={k('fp', 's2')}
        d="M 104 18 L 180 18 L 180 78 L 174 74 L 168 78 L 162 74 L 156 78 L 150 74 L 144 78 L 138 74 L 132 78 L 126 74 L 120 78 L 114 74 L 108 78 L 104 74 Z"
      />
      <text className={s.tx} x={142} y={32} textAnchor="middle" fontSize={7.5} fontWeight={700}>
        SALE: $100.00
      </text>
      <text className={s.tx} x={142} y={44} textAnchor="middle" fontSize={7} fontWeight={600} fill="#dc2626">
        Fee (2.9%+$0.30): -$3.20
      </text>
      <line className={s.dim} x1={112} y1={50} x2={172} y2={50} />
      <text className={s.txL} x={142} y={64} textAnchor="middle" fontSize={10} fontWeight={800} fill="#16a34a">
        Net: $96.80
      </text>
      <Dim x1={26} y1={90} x2={186} y2={90} label="Interchange-Plus vs Flat Rate &amp; Gross-Up" lx={106} ly={96} />
    </>
  ),
  /* Credit Card Payoff: Credit card with EMV chip being cut by scissors & avalanche payoff progress bar */
  creditCardPayoff: (
    <>
      <rect className={s.f2} x={18} y={26} width={88} height={54} rx={6} />
      <rect className={s.gold} x={28} y={36} width={14} height={11} rx={2} />
      <line className={s.sp} x1={18} y1={54} x2={106} y2={54} strokeWidth={2} />
      <text className={s.txW} x={28} y={68} fontSize={6.5} fontWeight={700}>
        •••• 8492
      </text>
      <text className={s.txW} x={88} y={36} textAnchor="end" fontSize={6.5} fontWeight={700}>
        22% APR
      </text>
      <line className={k('s1', 'thick')} x1={54} y1={12} x2={66} y2={34} strokeWidth={2.5} />
      <line className={k('s1', 'thick')} x1={76} y1={12} x2={60} y2={34} strokeWidth={2.5} />
      <circle className={s.fp} cx={50} cy={12} r={4.5} />
      <circle className={s.fp} cx={80} cy={12} r={4.5} />
      <rect className={k('fp', 's2')} x={118} y={22} width={72} height={60} rx={6} />
      <text className={s.tx} x={154} y={36} textAnchor="middle" fontSize={8} fontWeight={700}>
        Avalanche Payoff
      </text>
      <rect className={s.fl} x={126} y={42} width={56} height={8} rx={4} />
      <rect className={s.f1} x={126} y={42} width={46} height={8} rx={4} />
      <text className={s.txL} x={154} y={62} textAnchor="middle" fontSize={10} fontWeight={800} fill="#16a34a">
        34 Mos to $0
      </text>
      <text className={s.tx} x={154} y={74} textAnchor="middle" fontSize={7} fontWeight={600}>
        Save $1,420 Interest
      </text>
      <Dim x1={18} y1={90} x2={190} y2={90} label="Fixed Payment vs Minimum · Avalanche Method" lx={104} ly={96} />
    </>
  ),
  /* Net Worth: Balance scale with assets weighing heavier than liabilities, plus net worth callout */
  netWorth: (
    <>
      <rect className={s.f2} x={97} y={22} width={6} height={58} rx={2} />
      <rect className={s.f2} x={84} y={76} width={32} height={6} rx={2} />
      <circle className={s.f1} cx={100} cy={22} r={4} />
      <line className={k('s2', 'thick')} x1={36} y1={38} x2={164} y2={26} strokeWidth={3} />
      <line className={s.dim} x1={36} y1={38} x2={24} y2={58} />
      <line className={s.dim} x1={36} y1={38} x2={62} y2={58} />
      <polygon className={s.f2} points="20,58 66,58 58,64 28,64" />
      <rect className={s.f1} x={28} y={44} width={30} height={14} rx={2} />
      <text className={s.txW} x={43} y={54} textAnchor="middle" fontSize={7} fontWeight={800}>
        Assets
      </text>
      <line className={s.dim} x1={164} y1={26} x2={148} y2={46} />
      <line className={s.dim} x1={164} y1={26} x2={184} y2={46} />
      <polygon className={s.f2} points="144,46 188,46 180,52 152,52" />
      <rect className={s.fm} x={154} y={36} width={24} height={10} rx={2} />
      <text className={s.txW} x={166} y={44} textAnchor="middle" fontSize={6.5} fontWeight={700}>
        Debt
      </text>
      <rect className={k('fp', 's2')} x={64} y={6} width={72} height={16} rx={4} />
      <text className={s.txL} x={100} y={18} textAnchor="middle" fontSize={8.5} fontWeight={800} fill="#16a34a">
        Net Worth: +$535k
      </text>
      <Dim x1={20} y1={90} x2={188} y2={90} label="Total Assets − Total Liabilities = Net Worth" lx={104} ly={96} />
    </>
  ),
  /* HELOC: Architectural house elevation with 3-part equity bracket & revolving credit arrow */
  heloc: (
    <>
      <polygon className={s.f1} points="54,18 18,44 24,44 24,80 84,80 84,44 90,44" />
      <rect className={s.fp} x={46} y={56} width={16} height={24} rx={1} />
      <rect className={s.fp} x={30} y={48} width={10} height={10} rx={1} />
      <rect className={s.fp} x={68} y={48} width={10} height={10} rx={1} />
      <rect className={k('fp', 's2')} x={102} y={18} width={88} height={64} rx={6} />
      <text className={s.tx} x={146} y={32} textAnchor="middle" fontSize={8} fontWeight={700}>
        $500k Home Value
      </text>
      <rect className={s.f2} x={108} y={38} width={42} height={12} rx={2} />
      <rect className={s.f1} x={152} y={38} width={24} height={12} rx={2} />
      <rect className={s.fl} x={178} y={38} width={8} height={12} rx={2} />
      <text className={s.txW} x={129} y={47} textAnchor="middle" fontSize={6} fontWeight={700}>
        1st Mtg
      </text>
      <text className={s.txW} x={164} y={47} textAnchor="middle" fontSize={6} fontWeight={800}>
        HELOC
      </text>
      <line className={s.dim} x1={110} y1={54} x2={182} y2={54} />
      <text className={s.txL} x={146} y={66} textAnchor="middle" fontSize={11} fontWeight={800} fill="#0284c7">
        $125k Line
      </text>
      <text className={s.tx} x={146} y={76} textAnchor="middle" fontSize={7} fontWeight={600}>
        85% CLTV Available
      </text>
      <Dim x1={18} y1={90} x2={190} y2={90} label="Draw Period (Interest-Only) → Amortized Repayment" lx={104} ly={96} />
    </>
  ),
  /* Investment Return: S&P 500 trading chart with candlesticks, trendline breakout & ROI badge */
  investmentReturn: (
    <>
      <line className={k('s2', 'thick')} x1={26} y1={18} x2={26} y2={84} />
      <line className={k('s2', 'thick')} x1={26} y1={84} x2={186} y2={84} />
      {[
        [42, 60, 72, 56, 76],
        [64, 48, 62, 44, 66],
        [88, 38, 52, 34, 56],
        [112, 44, 50, 40, 54],
        [136, 26, 40, 22, 44],
      ].map(([x, openY, closeY, highY, lowY], i) => (
        <g key={i}>
          <line className={s.dim} x1={x} y1={highY} x2={x} y2={lowY} strokeWidth={1.2} />
          <rect
            className={openY > closeY ? s.f1 : s.f2}
            x={x - 4}
            y={Math.min(openY, closeY)}
            width={8}
            height={Math.abs(openY - closeY)}
            rx={1}
          />
        </g>
      ))}
      <path className={k('fn', 's1', 'thick')} d="M30 76 Q86 68, 120 44 T178 18" strokeWidth={2.4} />
      <polygon className={s.f1} points="174,14 182,18 175,22" />
      <rect className={k('fp', 's2')} x={126} y={24} width={62} height={46} rx={5} />
      <text className={s.tx} x={157} y={36} textAnchor="middle" fontSize={7} fontWeight={700}>
        S&amp;P 500 (~10%)
      </text>
      <text className={s.txL} x={157} y={50} textAnchor="middle" fontSize={10} fontWeight={800} fill="#16a34a">
        $196,720
      </text>
      <text className={s.tx} x={157} y={62} textAnchor="middle" fontSize={7} fontWeight={700}>
        +196% Return
      </text>
      <Dim x1={26} y1={90} x2={186} y2={90} label="Compound Growth · Inflation-Adjusted · T-Bills vs Stocks" lx={106} ly={96} />
    </>
  ),
  /* Retirement Drawdown: Nest egg reservoir silo tank with fluid level gauge, inflow & 4% valve spigot */
  drawdown: (
    <>
      <rect className={s.f2} x={28} y={20} width={58} height={62} rx={8} />
      <rect className={s.f1} x={32} y={38} width={50} height={40} rx={4} />
      <line className={s.sp} x1={32} y1={46} x2={40} y2={46} strokeWidth={1.5} />
      <line className={s.sp} x1={32} y1={56} x2={44} y2={56} strokeWidth={1.5} />
      <line className={s.sp} x1={32} y1={66} x2={40} y2={66} strokeWidth={1.5} />
      <rect className={s.fm} x={14} y={26} width={14} height={6} rx={1} />
      <polygon className={s.f1} points="24,24 28,29 24,34" />
      <rect className={s.fm} x={86} y={64} width={12} height={6} rx={1} />
      <circle className={s.f1} cx={92} cy={60} r={3} />
      <circle className={s.f1} cx={102} cy={74} r={2} />
      <circle className={s.f1} cx={100} cy={82} r={1.5} />
      <rect className={k('fp', 's2')} x={112} y={20} width={76} height={62} rx={6} />
      <text className={s.tx} x={150} y={34} textAnchor="middle" fontSize={8} fontWeight={700}>
        $500k Portfolio
      </text>
      <text className={s.tx} x={150} y={45} textAnchor="middle" fontSize={7} fontWeight={600}>
        Withdraw $2,500/mo
      </text>
      <line className={s.dim} x1={120} y1={50} x2={180} y2={50} />
      <text className={s.txL} x={150} y={64} textAnchor="middle" fontSize={11.5} fontWeight={800} fill="#0284c7">
        Lasts 28.5 Yrs
      </text>
      <text className={s.tx} x={150} y={76} textAnchor="middle" fontSize={7} fontWeight={600}>
        Bengen 4% Safe Rule
      </text>
      <Dim x1={14} y1={90} x2={188} y2={90} label="Safe Withdrawal Rate &amp; Portfolio Longevity" lx={101} ly={96} />
    </>
  ),
  /* SBA Loan: Federal government Capitol / SBA dome building facade & 3-part 504 financing split */
  sbaLoan: (
    <>
      <polygon className={s.f1} points="16,36 52,18 88,36" />
      <rect className={s.f2} x={14} y={36} width={76} height={5} rx={1} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} className={s.fp} x={20 + i * 18} y={41} width={8} height={35} rx={1} />
      ))}
      <rect className={s.f2} x={12} y={76} width={80} height={6} rx={1} />
      <circle className={s.fp} cx={52} cy={28} r={3.5} />
      <rect className={k('fp', 's2')} x={98} y={18} width={92} height={64} rx={6} />
      <text className={s.tx} x={144} y={30} textAnchor="middle" fontSize={7.5} fontWeight={800}>
        SBA 504 SPLIT ($2.0M)
      </text>
      <rect className={s.f2} x={104} y={34} width={80} height={11} rx={2} />
      <text className={s.txW} x={144} y={42} textAnchor="middle" fontSize={6.5} fontWeight={700}>
        Bank 50%: $1,000,000
      </text>
      <rect className={s.f1} x={104} y={47} width={80} height={11} rx={2} />
      <text className={s.txW} x={144} y={55} textAnchor="middle" fontSize={6.5} fontWeight={700}>
        CDC 40%: $800,000
      </text>
      <rect className={s.gold} x={104} y={60} width={80} height={11} rx={2} />
      <text className={s.txW} x={144} y={68} textAnchor="middle" fontSize={6.5} fontWeight={800}>
        Down 10%: $200,000
      </text>
      <Dim x1={12} y1={90} x2={190} y2={90} label="SBA 7(a) Working Capital &amp; 504 Fixed Assets" lx={101} ly={96} />
    </>
  ),
  /* 1099 Self-Employment Tax: Form 1040-ES voucher booklet, tax pencil & FICA breakdown */
  seTax: (
    <>
      <rect className={k('fp', 's2')} x={20} y={18} width={76} height={66} rx={3} />
      <rect className={s.f1} x={20} y={18} width={76} height={12} rx={3} />
      <text className={s.txW} x={58} y={27} textAnchor="middle" fontSize={7} fontWeight={800}>
        FORM 1040-ES
      </text>
      {[
        ['Q1', 24],
        ['Q2', 38],
        ['Q3', 52],
        ['Q4', 66],
      ].map(([q, y]) => (
        <g key={q as string}>
          <rect className={s.f2} x={24} y={y as number + 10} width={14} height={10} rx={1} />
          <text className={s.txW} x={31} y={y as number + 18} textAnchor="middle" fontSize={6} fontWeight={800}>
            {q as string}
          </text>
          <line className={s.dim} x1={42} y1={y as number + 15} x2={88} y2={y as number + 15} />
        </g>
      ))}
      <rect className={k('fp', 's2')} x={106} y={18} width={82} height={66} rx={6} />
      <text className={s.tx} x={147} y={32} textAnchor="middle" fontSize={8} fontWeight={700}>
        15.3% SE Tax (FICA)
      </text>
      <text className={s.tx} x={147} y={43} textAnchor="middle" fontSize={7} fontWeight={600}>
        12.4% SS + 2.9% Med
      </text>
      <line className={s.dim} x1={114} y1={48} x2={180} y2={48} />
      <text className={s.txL} x={147} y={62} textAnchor="middle" fontSize={11} fontWeight={800} fill="#16a34a">
        $3,240 / Qtr
      </text>
      <text className={s.tx} x={147} y={74} textAnchor="middle" fontSize={7} fontWeight={600}>
        × 92.35% Schedule SE
      </text>
      <Dim x1={20} y1={90} x2={188} y2={90} label="Schedule SE Line 4a · Form 1040-ES Estimated Tax" lx={104} ly={96} />
    </>
  ),
  /* Invoice Generator: Itemized invoice sheet with folded corner, table rows & angled PAID stamp */
  invoice: (
    <>
      <polygon className={k('fp', 's2')} points="26,16 94,16 106,28 106,84 26,84" />
      <polygon className={s.f2} points="94,16 106,28 94,28" />
      <rect className={s.f1} x={32} y={22} width={26} height={6} rx={1} />
      <text className={s.tx} x={86} y={27} textAnchor="end" fontSize={7} fontWeight={800}>
        INVOICE
      </text>
      <line className={s.dim} x1={32} y1={34} x2={100} y2={34} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line className={s.dim} x1={32} y1={44 + i * 8} x2={100} y2={44 + i * 8} />
          <rect className={s.fm} x={34} y={38 + i * 8} width={38} height={3} rx={1} />
          <rect className={s.fm} x={84} y={38 + i * 8} width={14} height={3} rx={1} />
        </g>
      ))}
      <rect
        className={k('fn', 's1')}
        x={50}
        y={54}
        width={42}
        height={18}
        rx={3}
        transform="rotate(-12 71 63)"
        strokeWidth={2}
      />
      <text
        className={s.txL}
        x={71}
        y={67}
        textAnchor="middle"
        fontSize={10}
        fontWeight={800}
        transform="rotate(-12 71 63)"
        fill="#16a34a"
      >
        PAID
      </text>
      <rect className={k('fp', 's2')} x={118} y={22} width={70} height={60} rx={6} />
      <text className={s.tx} x={153} y={36} textAnchor="middle" fontSize={8} fontWeight={700}>
        Invoice #1042
      </text>
      <text className={s.tx} x={153} y={47} textAnchor="middle" fontSize={7} fontWeight={600}>
        7.5h @ $75.00/hr
      </text>
      <line className={s.dim} x1={126} y1={52} x2={180} y2={52} />
      <text className={s.txL} x={153} y={66} textAnchor="middle" fontSize={11} fontWeight={800} fill="#0284c7">
        $562.50
      </text>
      <text className={s.tx} x={153} y={76} textAnchor="middle" fontSize={7} fontWeight={600}>
        Printable PDF
      </text>
      <Dim x1={26} y1={90} x2={188} y2={90} label="Hourly &amp; Fixed-Fee · Tax · Printable PDF" lx={107} ly={96} />
    </>
  ),
  /* Deck Stain: Deck boards with wet stain coating, applicator pad & stain can */
  deckStain: (
    <>
      <polygon className={s.fm} points="14,64 126,64 150,32 38,32" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} className={k('s2')} x1={20 + i * 8} y1={64 - i * 8} x2={132 + i * 8} y2={64 - i * 8} />
      ))}
      <polygon className={s.f1} points="70,64 126,64 150,32 94,32" opacity={0.88} />
      <line className={k('s1', 'thick')} x1={70} y1={64} x2={94} y2={32} />
      <rect className={s.f2} x={152} y={38} width={34} height={40} rx={3} />
      <ellipse className={s.fp} cx={169} cy={38} rx={17} ry={4.5} />
      <path className={k('fn', 's1')} d="M152 44 Q169 22 186 44" strokeWidth={1.5} />
      <rect className={s.fl} x={156} y={50} width={26} height={18} rx={2} />
      <text className={s.tx} x={169} y={62} textAnchor="middle" fontSize={8} fontWeight={700}>
        STAIN
      </text>
      <Dim x1={14} y1={76} x2={126} y2={76} label="Coverage: 350 sq ft / gal" lx={70} ly={86} />
    </>
  ),
  /* Roof Replacement: Tear-off and replacement cross-section with deck, felt, shingles & hammer */
  roofCost: (
    <>
      <polygon className={s.fm} points="16,66 96,22 176,66" />
      <polygon className={s.f2} points="16,66 96,22 96,66" opacity={0.6} />
      {[0, 1, 2, 3].map((r) => (
        <line
          key={r}
          className={s.sp}
          x1={96 + r * 6}
          y1={66 - r * 11}
          x2={176 - r * 6}
          y2={66 - r * 11}
          strokeWidth={2.4}
        />
      ))}
      <rect className={s.f1} x={36} y={42} width={32} height={14} rx={2} />
      <line className={s.sp} x1={52} y1={42} x2={52} y2={56} strokeWidth={2} />
      <path className={k('fn', 's1', 'thick')} d="M128 24 L142 38" />
      <path className={s.f1} d="M140 22 L146 28 L142 32 L136 26 Z" />
      <rect className={k('fp', 's2')} x={118} y={54} width={68} height={26} rx={4} />
      <text className={s.tx} x={152} y={66} textAnchor="middle" fontSize={8.5} fontWeight={700}>
        28 Sq · Tear-Off
      </text>
      <text className={s.txL} x={152} y={76} textAnchor="middle" fontSize={9.5} fontWeight={800}>
        $11,400
      </text>
      <Dim x1={16} y1={86} x2={176} y2={86} label="Decking + Underlayment + Shingles" lx={96} ly={94} />
    </>
  ),
  /* All tools: grid of category colours with a magnifier */
  gridSearch: (
    <>
      {[
        ['concrete', 46, 18],
        ['gravel', 78, 18],
        ['earthwork', 110, 18],
        ['framing', 46, 50],
        ['finishes', 78, 50],
        ['business', 110, 50],
      ].map(([c, x, y]) => (
        <rect key={c as string} className={s[`cat_${c}`]} x={x as number} y={y as number} width={28} height={28} rx={7} />
      ))}
      <circle className={k('fn', 's2')} cx={150} cy={58} r={14} strokeWidth={4} />
      <line className={k('s2')} x1={160} y1={68} x2={174} y2={82} strokeWidth={6} strokeLinecap="round" />
    </>
  ),
  /* Suggest: a dashed card with a plus */
  plus: (
    <>
      <rect className={k('fn', 's2')} x={62} y={14} width={76} height={72} rx={12} strokeDasharray="5 4" />
      <circle className={s.f1} cx={100} cy={50} r={18} />
      <path className={k('fn', 'sp', 'thick')} d="M100 41 V59 M91 50 H109" />
    </>
  ),
};

export default function ToolArt({ name }: { name: IconName }) {
  const art = ART[name];
  if (!art) return null;
  return (
    <svg className={s.svg} viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      {art}
    </svg>
  );
}
