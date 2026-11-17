'use client';

import React, { useState } from 'react';
import styles from './MarkupDiagram.module.css';
import { formatCurrency, formatPercent } from '@/lib/pricing-engine';

interface MarkupDiagramProps {
  cost: number;
  price: number;
  profit: number;
  markupPercent: number | null;
  marginPercent: number | null;
  multiplierVal: number | null;
}

export default function MarkupDiagram({
  cost,
  price,
  profit,
  markupPercent,
  marginPercent,
  multiplierVal,
}: MarkupDiagramProps) {
  const [viewMode, setViewMode] = useState<'stack' | 'chain'>('stack');

  // SVG Geometry Constants
  const svgW = 560;
  const svgH = 260;
  const groundY = 210;
  const maxBarH = 140;

  // Clamp positive values for geometric bar representation
  const safeCost = Math.max(cost, 0);
  const safeProfit = Math.max(profit, 0);
  const safePrice = Math.max(price, safeCost + safeProfit, 1);

  // Proportional Heights
  const hCost = Math.min(maxBarH, Math.max(8, (safeCost / safePrice) * maxBarH));
  const hProfit = Math.min(maxBarH, Math.max(8, (safeProfit / safePrice) * maxBarH));
  const hTotal = Math.min(maxBarH + 20, Math.max(16, hCost + (profit > 0 ? hProfit : 0)));

  const yTotal = groundY - hTotal;
  const yCost = groundY - hCost;
  const yProfit = yCost - hProfit;

  // Colors
  const colCost = '#3b82f6'; // Bright blue for cost baseline
  const colProfit = '#10b981'; // Emerald for profit markup
  const colMargin = '#8b5cf6'; // Purple for margin metric
  const colAccent = '#f59e0b'; // Amber for multiplier

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Visual Price Stack &amp; Margin Flow</h3>
          <p className={styles.subtitle}>
            {viewMode === 'stack'
              ? 'Proportional breakdown of Cost, Profit markup, and Selling Price'
              : 'Sequential 3-Tier Distribution Chain (Maker → Wholesaler → Retailer)'}
          </p>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.tabBtn} ${viewMode === 'stack' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('stack')}
          >
            Price Stack
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${viewMode === 'chain' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('chain')}
          >
            3-Tier Chain
          </button>
        </div>
      </div>

      <div className={styles.svgWrap}>
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className={styles.svg}
          role="img"
          aria-label="Visual markup and gross margin diagram"
        >
          {/* Background grid lines */}
          <line x1="30" y1="50" x2="530" y2="50" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="30" y1="100" x2="530" y2="100" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="30" y1="150" x2="530" y2="150" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />

          {/* Baseline Ground Line */}
          <line x1="30" y1={groundY} x2="530" y2={groundY} stroke="#94a3b8" strokeWidth="2" />

          {viewMode === 'stack' ? (
            /* VIEW 1: PRICE STACK (COST + PROFIT = SELLING PRICE) */
            <g>
              {/* Stacked Bar 1: Cost (Bottom) + Profit (Top) */}
              {/* Cost Rect */}
              <rect
                x="80"
                y={yCost}
                width="110"
                height={hCost}
                fill={colCost}
                rx="4"
              />
              {/* Profit Rect (Stacked on top of Cost) */}
              {profit > 0 && (
                <rect
                  x="80"
                  y={yProfit}
                  width="110"
                  height={hProfit}
                  fill={colProfit}
                  rx="4"
                />
              )}

              {/* Labels inside stacked bar if height permits */}
              <text x="135" y={yCost + Math.min(hCost / 2 + 5, 20)} fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">
                Cost: {formatCurrency(safeCost)}
              </text>
              {profit > 0 && hProfit > 20 && (
                <text x="135" y={yProfit + hProfit / 2 + 5} fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">
                  +{formatCurrency(safeProfit)}
                </text>
              )}

              {/* Stack Bar X-Axis Caption */}
              <text x="135" y={groundY + 20} fill="#334155" fontSize="12" fontWeight="700" textAnchor="middle">
                Cost + Profit Stack
              </text>

              {/* Equals Arrow */}
              <path d="M 220 135 L 245 135 M 240 128 L 247 135 L 240 142" stroke="#64748b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Bar 2: Total Selling Price */}
              <rect
                x="270"
                y={yTotal}
                width="110"
                height={hTotal}
                fill="#1e293b"
                rx="6"
              />
              <text x="325" y={yTotal + Math.min(hTotal / 2 + 5, 30)} fill="#38bdf8" fontSize="14" fontWeight="800" textAnchor="middle">
                {formatCurrency(price)}
              </text>
              <text x="325" y={groundY + 20} fill="#0f172a" fontSize="12" fontWeight="700" textAnchor="middle">
                Selling Price
              </text>

              {/* KPI Badges Column on Right */}
              <g transform="translate(415, 35)">
                {/* Markup Box */}
                <rect x="0" y="0" width="125" height="48" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                <text x="62" y="18" fill="#047857" fontSize="10" fontWeight="700" textAnchor="middle">
                  MARKUP ON COST
                </text>
                <text x="62" y="38" fill="#065f46" fontSize="15" fontWeight="800" textAnchor="middle">
                  {markupPercent !== null ? formatPercent(markupPercent) : '—'}
                </text>

                {/* Margin Box */}
                <rect x="0" y="58" width="125" height="48" rx="8" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="1.5" />
                <text x="62" y="76" fill="#6d28d9" fontSize="10" fontWeight="700" textAnchor="middle">
                  MARGIN ON REVENUE
                </text>
                <text x="62" y="96" fill="#5b21b6" fontSize="15" fontWeight="800" textAnchor="middle">
                  {marginPercent !== null ? formatPercent(marginPercent) : '—'}
                </text>

                {/* Multiplier Box */}
                <rect x="0" y="116" width="125" height="44" rx="8" fill="#fffbeb" stroke={colAccent} strokeWidth="1.5" />
                <text x="62" y="132" fill="#b45309" fontSize="10" fontWeight="700" textAnchor="middle">
                  PRICE MULTIPLIER
                </text>
                <text x="62" y="150" fill="#92400e" fontSize="14" fontWeight="800" textAnchor="middle">
                  {multiplierVal !== null ? `${multiplierVal.toFixed(2)}×` : '—'}
                </text>
              </g>
            </g>
          ) : (
            /* VIEW 2: 3-TIER DISTRIBUTION CHAIN (Maker -> Wholesale -> Retail) */
            <g>
              {/* Tier 1: Factory / Maker */}
              <g transform="translate(45, 60)">
                <rect x="0" y="0" width="130" height="110" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <rect x="0" y="0" width="130" height="28" rx="10" fill="#3b82f6" />
                <rect x="0" y="18" width="130" height="10" fill="#3b82f6" />
                <text x="65" y="18" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">
                  1. Factory / Maker
                </text>
                <text x="12" y="48" fill="#64748b" fontSize="10">Make Cost:</text>
                <text x="118" y="48" fill="#1e293b" fontSize="11" fontWeight="700" textAnchor="end">{formatCurrency(safeCost)}</text>
                <text x="12" y="68" fill="#64748b" fontSize="10">Wholesale Out:</text>
                <text x="118" y="68" fill="#2563eb" fontSize="11" fontWeight="700" textAnchor="end">{formatCurrency(safeCost * 1.5)}</text>
                <text x="65" y="94" fill="#059669" fontSize="10" fontWeight="600" textAnchor="middle">
                  (50% Standard Markup)
                </text>
              </g>

              {/* Arrow 1 */}
              <path d="M 185 115 L 210 115 M 205 109 L 212 115 L 205 121" stroke="#64748b" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Tier 2: Wholesaler / Distributor */}
              <g transform="translate(215, 60)">
                <rect x="0" y="0" width="130" height="110" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <rect x="0" y="0" width="130" height="28" rx="10" fill="#6366f1" />
                <rect x="0" y="18" width="130" height="10" fill="#6366f1" />
                <text x="65" y="18" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">
                  2. Wholesaler
                </text>
                <text x="12" y="48" fill="#64748b" fontSize="10">Buy Price:</text>
                <text x="118" y="48" fill="#1e293b" fontSize="11" fontWeight="700" textAnchor="end">{formatCurrency(safeCost * 1.5)}</text>
                <text x="12" y="68" fill="#64748b" fontSize="10">Retailer Buy:</text>
                <text x="118" y="68" fill="#4338ca" fontSize="11" fontWeight="700" textAnchor="end">{formatCurrency(safeCost * 2.25)}</text>
                <text x="65" y="94" fill="#059669" fontSize="10" fontWeight="600" textAnchor="middle">
                  (50% Wholesale Markup)
                </text>
              </g>

              {/* Arrow 2 */}
              <path d="M 355 115 L 380 115 M 375 109 L 382 115 L 375 121" stroke="#64748b" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Tier 3: Retailer to Shopper */}
              <g transform="translate(385, 60)">
                <rect x="0" y="0" width="135" height="110" rx="10" fill="#f0fdf4" stroke="#10b981" strokeWidth="2" />
                <rect x="0" y="0" width="135" height="28" rx="10" fill="#10b981" />
                <rect x="0" y="18" width="135" height="10" fill="#10b981" />
                <text x="67" y="18" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">
                  3. Retailer (Store)
                </text>
                <text x="12" y="48" fill="#64748b" fontSize="10">Wholesale In:</text>
                <text x="122" y="48" fill="#1e293b" fontSize="11" fontWeight="700" textAnchor="end">{formatCurrency(safeCost * 2.25)}</text>
                <text x="12" y="68" fill="#065f46" fontSize="10" fontWeight="700">MSRP / Price:</text>
                <text x="122" y="68" fill="#047857" fontSize="12" fontWeight="800" textAnchor="end">{formatCurrency(safeCost * 4.5)}</text>
                <text x="67" y="94" fill="#047857" fontSize="10" fontWeight="700" textAnchor="middle">
                  Keystone (100% Markup)
                </text>
              </g>

              <text x="280" y={groundY + 25} fill="#475569" fontSize="11" fontWeight="600" textAnchor="middle">
                Cumulative Multiplier from Factory to Consumer: 4.50× (Keystone Retail Chain)
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: colCost }} />
          <span>Product Cost (Wholesale / COGS)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: colProfit }} />
          <span>Gross Profit (Added Markup)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: colMargin }} />
          <span>Gross Margin (% of Selling Price)</span>
        </div>
      </div>
    </div>
  );
}
