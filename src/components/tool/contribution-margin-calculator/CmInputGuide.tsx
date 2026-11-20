'use client';

import React, { useState } from 'react';
import styles from './CmInputGuide.module.css';

export type CmFieldId =
  | 'sellingPrice'
  | 'variableCost'
  | 'fixedCosts'
  | 'unitsSold'
  | 'targetProfit';

interface CmInputGuideProps {
  mode: 'single' | 'mix' | 'whatif';
  activeField?: CmFieldId | null;
  sellingPrice: number;
  variableCost: number;
  fixedCosts: number;
  unitsSold: number;
  targetProfit: number;
  cmPerUnit: number;
  cmRatio: number | null;
  breakEvenUnits: number | null;
  breakEvenSales: number | null;
}

export default function CmInputGuide({
  mode,
  activeField,
  sellingPrice,
  variableCost,
  fixedCosts,
  unitsSold,
  targetProfit,
  cmPerUnit,
  cmRatio,
  breakEvenUnits,
  breakEvenSales,
}: CmInputGuideProps) {
  const [collapsed, setCollapsed] = useState(false);

  const priceSafe = Math.max(0.01, sellingPrice);
  const vcSafe = Math.max(0, variableCost);
  const vcPct = Math.min(100, Math.max(0, (vcSafe / priceSafe) * 100));

  // SVG coordinate dimensions
  const barWidth = 320;
  const vcWidth = Math.round((vcPct / 100) * barWidth);
  const cmWidth = barWidth - vcWidth;

  const isPriceActive = activeField === 'sellingPrice';
  const isVcActive = activeField === 'variableCost';
  const isFixedActive = activeField === 'fixedCosts';
  const isUnitsActive = activeField === 'unitsSold';
  const isTargetActive = activeField === 'targetProfit';

  return (
    <div className={styles.guideContainer}>
      <div className={styles.guideHeader}>
        <div className={styles.guideTitleGroup}>
          <span className={styles.guideBadge}>CVP Diagram</span>
          <span className={styles.guideTitle}>
            {mode === 'single'
              ? 'Contribution Margin & Fixed Overhead Absorption Model'
              : mode === 'mix'
                ? 'Weighted Sales-Mix Contribution & Break-Even Allocation'
                : 'Sensitivity Analysis: Price, Cost & Volume Impact'}
          </span>
        </div>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
        >
          {collapsed ? 'Show Diagram ▲' : 'Hide Diagram ▼'}
        </button>
      </div>

      {!collapsed && (
        <div className={styles.diagramWrap}>
          {mode === 'single' ? (
            <svg
              className={styles.svgDiagram}
              viewBox="0 0 740 220"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {/* Background gradient definitions */}
              <defs>
                <linearGradient id="cmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
                <linearGradient id="vcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
                <linearGradient id="boxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
              </defs>

              {/* LEFT SIDE: Unit Selling Price Bar (340px width) */}
              <g transform="translate(20, 20)">
                <text x="0" y="15" fill="#1e293b" fontSize="13" fontWeight="700">
                  Unit Price Stack: ${sellingPrice.toFixed(2)}
                </text>

                {/* Outer frame */}
                <rect
                  x="0"
                  y="25"
                  width={barWidth}
                  height="42"
                  rx="6"
                  fill="none"
                  stroke={isPriceActive ? '#0d9488' : '#cbd5e1'}
                  strokeWidth={isPriceActive ? '2.5' : '1.5'}
                />

                {/* Variable cost bar */}
                <rect
                  x="0"
                  y="25"
                  width={vcWidth}
                  height="42"
                  rx="6"
                  fill="url(#vcGrad)"
                  stroke={isVcActive ? '#b91c1c' : 'none'}
                  strokeWidth="2"
                  opacity={isVcActive ? 1 : 0.9}
                />

                {/* Contribution margin bar */}
                <rect
                  x={vcWidth}
                  y="25"
                  width={cmWidth}
                  height="42"
                  rx="6"
                  fill="url(#cmGrad)"
                  stroke={isPriceActive || isVcActive ? '#047857' : 'none'}
                  strokeWidth="2"
                  opacity={0.95}
                />

                {/* Bar Labels */}
                {vcWidth > 45 && (
                  <text
                    x={vcWidth / 2}
                    y="50"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="700"
                  >
                    VC: ${variableCost.toFixed(0)} ({vcPct.toFixed(0)}%)
                  </text>
                )}
                {cmWidth > 45 && (
                  <text
                    x={vcWidth + cmWidth / 2}
                    y="50"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="700"
                  >
                    CM: ${cmPerUnit.toFixed(0)} ({cmRatio !== null ? `${(cmRatio * 100).toFixed(0)}%` : '0%'})
                  </text>
                )}

                {/* Equation Ribbon */}
                <rect x="0" y="80" width={barWidth} height="30" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
                <text x={barWidth / 2} y="100" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="600">
                  CM = ${sellingPrice.toFixed(2)} − ${variableCost.toFixed(2)} = ${cmPerUnit.toFixed(2)}/unit
                </text>

                {/* Arrow to Fixed Costs */}
                <path
                  d={`M ${vcWidth + cmWidth / 2} 115 L ${vcWidth + cmWidth / 2} 150 L 370 150`}
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <circle cx="370" cy="150" r="3" fill="#0d9488" />
                <text x="170" y="165" fill="#0d9488" fontSize="10" fontWeight="700">
                  Each unit chips in ${cmPerUnit.toFixed(2)} toward fixed costs →
                </text>
              </g>

              {/* RIGHT SIDE: Fixed Costs Absorption Box */}
              <g transform="translate(400, 20)">
                <text x="0" y="15" fill="#1e293b" fontSize="13" fontWeight="700">
                  Fixed Costs Bucket: ${fixedCosts.toLocaleString()}
                </text>

                {/* Fixed Costs Container Box */}
                <rect
                  x="0"
                  y="25"
                  width="310"
                  height="120"
                  rx="8"
                  fill="url(#boxGrad)"
                  stroke={isFixedActive ? '#0d9488' : '#94a3b8'}
                  strokeWidth={isFixedActive ? '2.5' : '1.5'}
                />

                {/* Stacked CM slices representation */}
                <g opacity="0.85">
                  <rect x="15" y="105" width="280" height="15" rx="3" fill="#0d9488" />
                  <rect x="15" y="85" width="280" height="15" rx="3" fill="#0d9488" />
                  <rect x="15" y="65" width="280" height="15" rx="3" fill="#0d9488" />
                  <text x="155" y="76" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                    CM Slice Stack: ${cmPerUnit.toFixed(2)} / unit
                  </text>
                </g>

                {/* Break-even text in bucket */}
                <text x="155" y="45" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">
                  {breakEvenUnits !== null
                    ? `${Math.ceil(breakEvenUnits).toLocaleString()} units needed to break even`
                    : 'Unattainable (negative CM)'}
                </text>
                <text x="155" y="132" textAnchor="middle" fill="#475569" fontSize="10">
                  Break-Even Sales Revenue: {breakEvenSales !== null ? `$${Math.round(breakEvenSales).toLocaleString()}` : '—'}
                </text>

                {/* Target profit extension on top (if active) */}
                {targetProfit > 0 && (
                  <g>
                    <rect
                      x="40"
                      y="155"
                      width="230"
                      height="32"
                      rx="6"
                      fill="#ecfdf5"
                      stroke={isTargetActive ? '#059669' : '#10b981'}
                      strokeWidth={isTargetActive ? '2' : '1'}
                    />
                    <text x="155" y="175" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="700">
                      Target Profit +${targetProfit.toLocaleString()} ({Math.ceil((fixedCosts + targetProfit) / (cmPerUnit || 1)).toLocaleString()} units)
                    </text>
                  </g>
                )}
              </g>

              {/* BOTTOM STATUS BAR: Current units vs Break-even */}
              <g transform="translate(20, 195)">
                <rect x="0" y="0" width="700" height="22" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
                <text x="15" y="15" fill="#334155" fontSize="11" fontWeight="600">
                  Current Volume: <tspan fill={isUnitsActive ? '#0d9488' : '#0f172a'} fontWeight="700">{unitsSold.toLocaleString()} units</tspan>
                </text>
                <text x="350" y="15" textAnchor="middle" fill="#334155" fontSize="11">
                  Margin of Safety: <tspan fill="#059669" fontWeight="700">
                    {breakEvenUnits !== null
                      ? `${(unitsSold - breakEvenUnits).toFixed(0)} units (${(((unitsSold - breakEvenUnits) / (unitsSold || 1)) * 100).toFixed(1)}%)`
                      : '—'}
                  </tspan>
                </text>
                <text x="685" y="15" textAnchor="end" fill="#334155" fontSize="11">
                  Status: <tspan fill={unitsSold >= (breakEvenUnits || 0) ? '#059669' : '#dc2626'} fontWeight="700">
                    {unitsSold >= (breakEvenUnits || 0) ? 'Operating in Profit' : 'Operating at Loss'}
                  </tspan>
                </text>
              </g>
            </svg>
          ) : mode === 'mix' ? (
            <svg
              className={styles.svgDiagram}
              viewBox="0 0 740 180"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <g transform="translate(20, 20)">
                <text x="0" y="15" fill="#1e293b" fontSize="13" fontWeight="700">
                  Multi-Product Sales Mix Allocation
                </text>
                <text x="0" y="35" fill="#64748b" fontSize="11">
                  Products with higher contribution margins absorb fixed costs faster.
                </text>

                {/* Multi-product stacked bar */}
                <g transform="translate(0, 50)">
                  <rect x="0" y="0" width="450" height="38" rx="6" fill="#0d9488" />
                  <rect x="450" y="0" width="250" height="38" rx="6" fill="#0284c7" />
                  <text x="225" y="24" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
                    Product A: High-Margin Core (60%–70% of Sales)
                  </text>
                  <text x="575" y="24" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
                    Product B: Volume Tier
                  </text>
                </g>

                {/* Bottom explanation */}
                <g transform="translate(0, 110)">
                  <rect x="0" y="0" width="700" height="40" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
                  <text x="350" y="25" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="600">
                    Weighted CM determines company-wide break-even. Changing sales mix shifts break-even without altering prices.
                  </text>
                </g>
              </g>
            </svg>
          ) : (
            <svg
              className={styles.svgDiagram}
              viewBox="0 0 740 180"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <g transform="translate(20, 20)">
                <text x="0" y="15" fill="#1e293b" fontSize="13" fontWeight="700">
                  CVP What-If Simulation Matrix
                </text>
                <text x="0" y="35" fill="#64748b" fontSize="11">
                  Adjust selling price, variable costs, fixed overhead, and unit volume to see immediate profit leverage.
                </text>

                <g transform="translate(0, 55)">
                  <rect x="0" y="0" width="220" height="60" rx="6" fill="#f0fdf4" stroke="#86efac" />
                  <text x="110" y="26" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="700">
                    Price Increase (+5%)
                  </text>
                  <text x="110" y="44" textAnchor="middle" fill="#15803d" fontSize="10">
                    100% flows directly to CM
                  </text>

                  <rect x="240" y="0" width="220" height="60" rx="6" fill="#fef2f2" stroke="#fca5a5" />
                  <text x="350" y="26" textAnchor="middle" fill="#991b1b" fontSize="11" fontWeight="700">
                    Cost Reduction (−5%)
                  </text>
                  <text x="350" y="44" textAnchor="middle" fill="#b91c1c" fontSize="10">
                    Expands margin per unit
                  </text>

                  <rect x="480" y="0" width="220" height="60" rx="6" fill="#f0f9ff" stroke="#bae6fd" />
                  <text x="590" y="26" textAnchor="middle" fill="#075985" fontSize="11" fontWeight="700">
                    Volume Increase (+10%)
                  </text>
                  <text x="590" y="44" textAnchor="middle" fill="#0369a1" fontSize="10">
                    Multiplies total CM
                  </text>
                </g>
              </g>
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
