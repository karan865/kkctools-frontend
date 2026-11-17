'use client';

import React, { useState } from 'react';
import styles from './UnitPriceDiagram.module.css';
import { UnitPriceItemOutput, formatUnitLabel, AnyUnit } from '@/lib/unit-price-engine';

interface UnitPriceDiagramProps {
  items: UnitPriceItemOutput[];
  outputUnit: AnyUnit;
  currencySymbol?: string;
  mode?: 'compare' | 'shrinkflation';
  shrinkflationData?: {
    oldPrice: number;
    oldSize: number;
    newPrice: number;
    newSize: number;
    unitPriceIncreasePercent: number;
    unitLabel: string;
  };
}

export default function UnitPriceDiagram({
  items,
  outputUnit,
  currencySymbol = '$',
  mode = 'compare',
  shrinkflationData,
}: UnitPriceDiagramProps) {
  const [viewMode, setViewMode] = useState<'unitPrice' | 'yieldPerDollar'>('unitPrice');

  // SVG Geometry Constants
  const svgW = 560;
  const svgH = 260;

  // Colors
  const colBest = '#10b981'; // Emerald for cheapest/best deal
  const colHigher = '#3b82f6'; // Bright blue for secondary options
  const colExpensive = '#64748b'; // Slate neutral for high unit price

  if (mode === 'shrinkflation' && shrinkflationData) {
    const { oldPrice, oldSize, newPrice, newSize, unitPriceIncreasePercent, unitLabel } =
      shrinkflationData;
    const maxS = Math.max(oldSize, newSize, 1);
    const hOld = Math.min(140, Math.max(20, (oldSize / maxS) * 140));
    const hNew = Math.min(140, Math.max(20, (newSize / maxS) * 140));
    const groundY = 210;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h3 className={styles.title}>Visual Shrinkflation Analysis</h3>
            <p className={styles.subtitle}>
              Compare physical package downsizing vs effective hidden price inflation
            </p>
          </div>
        </div>

        <div className={styles.svgWrap}>
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className={styles.svg}
            role="img"
            aria-label="Visual shrinkflation diagram"
          >
            {/* Baseline */}
            <line x1="30" y1={groundY} x2="530" y2={groundY} stroke="#94a3b8" strokeWidth="2" />

            {/* Old Box */}
            <g transform="translate(110, 0)">
              <rect
                x="0"
                y={groundY - hOld}
                width="110"
                height={hOld}
                fill="#3b82f6"
                rx="6"
              />
              <text x="55" y={groundY - hOld - 12} fill="#1e3a8a" fontSize="13" fontWeight="700" textAnchor="middle">
                Original Pack
              </text>
              <text x="55" y={groundY - hOld / 2} fill="#ffffff" fontSize="14" fontWeight="800" textAnchor="middle">
                {oldSize} {unitLabel}
              </text>
              <text x="55" y={groundY + 22} fill="#475569" fontSize="12" fontWeight="700" textAnchor="middle">
                {currencySymbol}{oldPrice.toFixed(2)}
              </text>
            </g>

            {/* Shrink Arrow */}
            <g transform="translate(255, 120)">
              <path d="M 0 0 L 40 0 M 32 -7 L 40 0 L 32 7" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" />
              <text x="20" y="-12" fill="#dc2626" fontSize="11" fontWeight="800" textAnchor="middle">
                DOWNSIZED
              </text>
            </g>

            {/* New Box */}
            <g transform="translate(330, 0)">
              <rect
                x="0"
                y={groundY - hNew}
                width="110"
                height={hNew}
                fill="#f59e0b"
                rx="6"
              />
              <text x="55" y={groundY - hNew - 12} fill="#92400e" fontSize="13" fontWeight="700" textAnchor="middle">
                New Pack
              </text>
              <text x="55" y={groundY - hNew / 2} fill="#ffffff" fontSize="14" fontWeight="800" textAnchor="middle">
                {newSize} {unitLabel}
              </text>
              <text x="55" y={groundY + 22} fill="#475569" fontSize="12" fontWeight="700" textAnchor="middle">
                {currencySymbol}{newPrice.toFixed(2)}
              </text>
            </g>

            {/* Callout Badge Top Right */}
            {unitPriceIncreasePercent > 0 && (
              <g transform="translate(380, 25)">
                <rect x="0" y="0" width="150" height="40" rx="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
                <text x="75" y="16" fill="#991b1b" fontSize="10" fontWeight="700" textAnchor="middle">
                  HIDDEN INFLATION
                </text>
                <text x="75" y="32" fill="#dc2626" fontSize="13" fontWeight="800" textAnchor="middle">
                  +{unitPriceIncreasePercent.toFixed(1)}% per {unitLabel}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }

  // COMPARE MODE
  const validItems = items.filter((it) => it.unitPrice > 0);
  const maxUnitPrice = Math.max(...validItems.map((it) => it.unitPrice), 1);
  const maxBarWidth = 280;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Unit Price Value Comparison</h3>
          <p className={styles.subtitle}>
            {viewMode === 'unitPrice'
              ? `Price per ${formatUnitLabel(outputUnit)} across all options (shorter bar = cheaper)`
              : `Quantity received per ${currencySymbol}1.00 spent (longer bar = better deal)`}
          </p>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.tabBtn} ${viewMode === 'unitPrice' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('unitPrice')}
          >
            Price per Unit
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${viewMode === 'yieldPerDollar' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('yieldPerDollar')}
          >
            Yield per {currencySymbol}1
          </button>
        </div>
      </div>

      <div className={styles.svgWrap}>
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className={styles.svg}
          role="img"
          aria-label="Unit price comparison diagram"
        >
          {/* Background grid */}
          <line x1="160" y1="20" x2="160" y2="235" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="280" y1="20" x2="280" y2="235" stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1="400" y1="20" x2="400" y2="235" stroke="#e2e8f0" strokeDasharray="3 3" />

          {validItems.slice(0, 5).map((item, idx) => {
            const barH = 26;
            const y = 35 + idx * 40;

            if (viewMode === 'unitPrice') {
              // Shorter bar is cheaper
              const barW = Math.max(16, (item.unitPrice / maxUnitPrice) * maxBarWidth);
              const barColor = item.isCheapest ? colBest : idx === 1 ? colHigher : colExpensive;

              return (
                <g key={item.id}>
                  {/* Option Label */}
                  <text
                    x="150"
                    y={y + 17}
                    fill="#1e293b"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="end"
                  >
                    {item.label}
                  </text>

                  {/* Horizontal Bar */}
                  <rect
                    x="160"
                    y={y}
                    width={barW}
                    height={barH}
                    fill={barColor}
                    rx="4"
                  />

                  {/* Unit price label */}
                  <text
                    x={168 + barW}
                    y={y + 17}
                    fill="#0f172a"
                    fontSize="12"
                    fontWeight="800"
                  >
                    {currencySymbol}{item.unitPrice.toFixed(2)}/{formatUnitLabel(outputUnit)}
                  </text>

                  {/* Best Value Badge */}
                  {item.isCheapest && (
                    <g transform={`translate(${170 + barW + 90}, ${y + 2})`}>
                      <rect x="0" y="0" width="80" height="22" rx="4" fill="#dcfce7" stroke="#16a34a" />
                      <text x="40" y="15" fill="#15803d" fontSize="9" fontWeight="800" textAnchor="middle">
                        ★ BEST DEAL
                      </text>
                    </g>
                  )}

                  {!item.isCheapest && item.percentMoreThanCheapest > 0 && (
                    <text
                      x={170 + barW + 95}
                      y={y + 17}
                      fill="#64748b"
                      fontSize="10"
                      fontWeight="600"
                    >
                      +{item.percentMoreThanCheapest.toFixed(0)}% more
                    </text>
                  )}
                </g>
              );
            } else {
              // Yield per $1 (higher is better)
              const yieldVal = item.effectivePrice > 0 ? (item.totalBaseQuantity / item.effectivePrice) : 0;
              const maxYield = Math.max(
                ...validItems.map((it) => (it.effectivePrice > 0 ? it.totalBaseQuantity / it.effectivePrice : 1)),
                1
              );
              const barW = Math.max(16, (yieldVal / maxYield) * maxBarWidth);
              const barColor = item.isCheapest ? colBest : colHigher;

              return (
                <g key={item.id}>
                  <text x="150" y={y + 17} fill="#1e293b" fontSize="11" fontWeight="700" textAnchor="end">
                    {item.label}
                  </text>
                  <rect x="160" y={y} width={barW} height={barH} fill={barColor} rx="4" />
                  <text x={168 + barW} y={y + 17} fill="#0f172a" fontSize="11" fontWeight="800">
                    {item.isCheapest ? 'Most Product / $' : ''}
                  </text>
                </g>
              );
            }
          })}
        </svg>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: colBest }} />
          <span>Cheapest Unit Price (Best Value)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: colHigher }} />
          <span>Alternative Option</span>
        </div>
      </div>
    </div>
  );
}
