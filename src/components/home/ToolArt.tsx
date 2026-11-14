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
