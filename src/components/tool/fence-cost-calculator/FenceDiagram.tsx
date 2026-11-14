import React from 'react';
import s from './FenceDiagram.module.css';
import type { Kind } from '@/lib/fence-cost-engine';

/* Plan and elevation drawings for the fence cost tool and page. Values are repeated as text
   elsewhere on the page, so the drawings are hidden from assistive tech. */

interface PlanRun {
  lengthFt: number;
  walkGates: number;
  doubleGates: number;
  label: string;
}

/** Top-down plan: connected runs turn 90° clockwise (up, right, down, left…); separate runs are drawn side by side. */
export function FencePlan({ runs, connected, closed, spacingFt, walkW, dblW }: { runs: PlanRun[]; connected: boolean; closed: boolean; spacingFt: number; walkW: number; dblW: number }) {
  const valid = runs.filter((r) => r.lengthFt > 0).slice(0, 8);
  if (valid.length === 0) return null;
  const dirs: [number, number][] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  // build segments in feet
  type Seg = { x1: number; y1: number; x2: number; y2: number; run: PlanRun; dir: [number, number] };
  const segs: Seg[] = [];
  let x = 0;
  let y = 0;
  valid.forEach((r, i) => {
    if (connected) {
      const d = dirs[i % 4];
      const x2 = x + d[0] * r.lengthFt;
      const y2 = y + d[1] * r.lengthFt;
      segs.push({ x1: x, y1: y, x2, y2, run: r, dir: d });
      x = x2;
      y = y2;
    } else {
      const gap = 12;
      const ox = segs.length ? Math.max(...segs.map((q) => Math.max(q.x1, q.x2))) + gap : 0;
      segs.push({ x1: ox, y1: 0, x2: ox, y2: -r.lengthFt, run: r, dir: [0, -1] });
    }
  });
  const xs = segs.flatMap((q) => [q.x1, q.x2]);
  const ys = segs.flatMap((q) => [q.y1, q.y2]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const W = 320;
  const H = 210;
  const pad = 34;
  const k = Math.min((W - pad * 2) / Math.max(1, maxX - minX), (H - pad * 2) / Math.max(1, maxY - minY));
  const X = (v: number) => pad + (v - minX) * k + ((W - pad * 2) - (maxX - minX) * k) / 2;
  const Y = (v: number) => pad + (v - minY) * k + ((H - pad * 2) - (maxY - minY) * k) / 2;

  const out: React.ReactNode[] = [];
  segs.forEach((q, si) => {
    const len = q.run.lengthFt;
    const gates: { w: number; dbl: boolean }[] = [
      ...Array.from({ length: q.run.walkGates }, () => ({ w: walkW, dbl: false })),
      ...Array.from({ length: q.run.doubleGates }, () => ({ w: dblW, dbl: true })),
    ];
    const opening = Math.min(len, gates.reduce((a, g) => a + g.w, 0));
    const pieces = gates.length + 1;
    const piece = (len - opening) / pieces;
    let t = 0; // feet along the run
    const at = (ft: number): [number, number] => [X(q.x1 + q.dir[0] * ft), Y(q.y1 + q.dir[1] * ft)];
    for (let p = 0; p < pieces; p++) {
      const a = at(t);
      const b = at(t + piece);
      out.push(<line key={`f${si}-${p}`} className={s.fence} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />);
      // posts along the piece
      const sections = piece > 0 ? Math.ceil(piece / spacingFt - 1e-9) : 0;
      for (let i = 0; i <= sections; i++) {
        const pt = at(t + (sections ? (piece * i) / sections : 0));
        const terminal = i === 0 || i === sections;
        out.push(<circle key={`p${si}-${p}-${i}`} className={terminal ? s.postBig : s.post} cx={pt[0]} cy={pt[1]} r={terminal ? 3.6 : 2.2} />);
      }
      t += piece;
      if (p < gates.length) {
        const g = gates[p];
        const g1 = at(t);
        const g2 = at(t + g.w);
        const len2 = Math.hypot(g2[0] - g1[0], g2[1] - g1[1]);
        // swing arc drawn to the outside (left of travel direction)
        const nx = q.dir[1];
        const ny = -q.dir[0];
        const leaf = g.dbl ? len2 / 2 : len2;
        out.push(<line key={`gl${si}-${p}`} className={s.gateLeaf} x1={g1[0]} y1={g1[1]} x2={g1[0] + nx * leaf} y2={g1[1] + ny * leaf} />);
        out.push(<path key={`ga${si}-${p}`} className={s.swing} d={`M${g1[0] + nx * leaf} ${g1[1] + ny * leaf} A${leaf} ${leaf} 0 0 ${q.dir[0] + q.dir[1] > 0 ? 0 : 1} ${g1[0] + (g2[0] - g1[0]) * (g.dbl ? 0.5 : 1)} ${g1[1] + (g2[1] - g1[1]) * (g.dbl ? 0.5 : 1)}`} />);
        if (g.dbl) out.push(<line key={`gr${si}-${p}`} className={s.gateLeaf} x1={g2[0]} y1={g2[1]} x2={g2[0] + nx * leaf} y2={g2[1] + ny * leaf} />);
        t += g.w;
      }
    }
    // length label at the midpoint, pushed outward
    const mid = at(gates.length ? Math.min(len * 0.82, len - 2) : len / 2);
    const nx = q.dir[1];
    const ny = -q.dir[0];
    out.push(
      <text key={`t${si}`} className={s.label} x={mid[0] + nx * 16} y={mid[1] + ny * 14 + 4} textAnchor={nx < 0 ? 'end' : nx > 0 ? 'start' : 'middle'}>
        {q.run.label}
      </text>,
    );
  });
  if (connected && closed && segs.length > 2) {
    const first = segs[0];
    const last = segs[segs.length - 1];
    out.push(<line key="close" className={s.closeLine} x1={X(last.x2)} y1={Y(last.y2)} x2={X(first.x1)} y2={Y(first.y1)} />);
  }
  return (
    <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <rect className={s.yard} x={4} y={4} width={W - 8} height={H - 8} rx={12} />
      {out}
    </svg>
  );
}

/** Front view of one fence section for the chosen style, with the post set in concrete below ground. */
export function FenceElevation({ kind, picketGap, heightLabel, spacingLabel, holeLabel, depthLabel, patternId = 'fence-chain-pattern' }: { kind: Kind; picketGap: boolean; heightLabel: string; spacingLabel: string; holeLabel: string; depthLabel: string; patternId?: string }) {
  const ground = 132;
  const top = 26;
  const l = 54;
  const r = 266;
  const postW = kind === 'fabric' ? 7 : 14;
  const infill: React.ReactNode[] = [];
  if (kind === 'pickets') {
    const pw = picketGap ? 10 : 15;
    const x0 = l + postW / 2;
    const x1 = r - postW / 2;
    const count = Math.max(1, Math.round((x1 - x0) / (picketGap ? 17 : 15.5)));
    const step = (x1 - x0 - pw) / Math.max(1, count - 1);
    for (let i = 0; i < count; i++) {
      const x = x0 + i * step;
      infill.push(<path key={i} className={s.picket} d={`M${x} ${ground - 4} V${top + 8} L${x + pw / 2} ${top} L${x + pw} ${top + 8} V${ground - 4} Z`} />);
    }
    infill.push(<rect key="r1" className={s.rail} x={l} y={top + 18} width={r - l} height={7} />);
    infill.push(<rect key="r2" className={s.rail} x={l} y={ground - 22} width={r - l} height={7} />);
  } else if (kind === 'panels') {
    infill.push(<rect key="panel" className={s.panel} x={l} y={top + 4} width={r - l} height={ground - top - 8} rx={2} />);
    for (let x = l + 16; x < r - 8; x += 16) infill.push(<line key={x} className={s.panelLine} x1={x} y1={top + 10} x2={x} y2={ground - 10} />);
    infill.push(<rect key="cap" className={s.rail} x={l} y={top + 4} width={r - l} height={8} />);
  } else {
    // chain link diamonds
    const id = patternId;
    infill.push(
      <defs key="defs">
        <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="12" height="12" fill="none" className={s.chainCell} />
        </pattern>
      </defs>,
    );
    infill.push(<rect key="mesh" x={l} y={top + 4} width={r - l} height={ground - top - 6} fill={`url(#${id})`} />);
    infill.push(<rect key="toprail" className={s.metalRail} x={l} y={top} width={r - l} height={5} rx={2.5} />);
  }
  return (
    <svg className={s.svg} viewBox="0 0 372 230" aria-hidden="true" focusable="false">
      <rect className={s.soil} x={0} y={ground} width={372} height={98} />
      {infill}
      {[l, r].map((x) => (
        <g key={x}>
          <ellipse className={s.concrete} cx={x} cy={ground + 34} rx={22} ry={34} />
          <rect className={kind === 'fabric' ? s.postMetal : s.postWood} x={x - postW / 2} y={top - 8} width={postW} height={ground - top + 74} rx={kind === 'fabric' ? 3.5 : 1.5} />
        </g>
      ))}
      <rect className={s.grass} x={0} y={ground - 2} width={372} height={4} />
      {/* dimensions */}
      <line className={s.dim} x1={300} y1={top} x2={300} y2={ground} />
      <line className={s.dim} x1={294} y1={top} x2={306} y2={top} />
      <line className={s.dim} x1={294} y1={ground} x2={306} y2={ground} />
      <text className={s.label} x={308} y={(top + ground) / 2 + 4}>
        {heightLabel}
      </text>
      <line className={s.dim} x1={l} y1={14} x2={r} y2={14} />
      <text className={s.label} x={(l + r) / 2} y={10} textAnchor="middle">
        {spacingLabel}
      </text>
      <line className={s.dimAccent} x1={r + 30} y1={ground} x2={r + 30} y2={ground + 74} />
      <text className={s.labelAccent} x={r + 34} y={ground + 42}>
        {depthLabel}
      </text>
      <line className={s.dimAccent} x1={l - 22} y1={ground + 84} x2={l + 22} y2={ground + 84} />
      <text className={s.labelAccent} x={l + 28} y={ground + 88}>
        {holeLabel}
      </text>
    </svg>
  );
}
