'use client';

import React, { useState, useId } from 'react';
import styles from './CompostCalculator.module.css';
import { calculateCompost } from '@/lib/compost-engine';

export default function CompostCalculator() {
  const lengthId = useId();
  const widthId = useId();
  const bedsId = useId();
  const directAreaId = useId();
  const depthPresetId = useId();
  const customDepthId = useId();
  const bagSizeId = useId();
  const priceId = useId();

  const [mode, setMode] = useState<'rectangular' | 'area'>('rectangular');
  const [lengthFeet, setLengthFeet] = useState<number>(8);
  const [widthFeet, setWidthFeet] = useState<number>(4);
  const [bedsCount, setBedsCount] = useState<number>(3);
  const [directArea, setDirectArea] = useState<number>(96);

  const [depthOption, setDepthOption] = useState<string>('2');
  const [customDepth, setCustomDepth] = useState<number>(2);
  const [preferredBagSize, setPreferredBagSize] = useState<1.0 | 1.5 | 2.0>(1.0);
  const [costPerBag, setCostPerBag] = useState<string>('5.99');

  const singleArea = mode === 'rectangular' ? lengthFeet * widthFeet : directArea;
  const effectiveDepth = depthOption === 'custom' ? customDepth : parseFloat(depthOption);
  const priceNum = parseFloat(costPerBag);

  const results = calculateCompost({
    areaSqFt: singleArea,
    bedMultiplier: mode === 'rectangular' ? bedsCount : 1,
    compostDepthInches: effectiveDepth,
    preferredBagSizeCuFt: preferredBagSize,
    costPerBag: isNaN(priceNum) ? undefined : priceNum,
  });

  return (
    <div className={styles.container}>
      <div className={styles.calculatorGrid}>
        {/* Left Column: 4 Step Cards */}
        <div className={styles.leftColumn}>
          {/* Card 1: Garden Bed / Lawn Dimensions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>1</span>
              <h2 className={styles.cardTitle}>Garden Bed or Lawn Dimensions</h2>
            </div>

            <div className={styles.modeSwitch}>
              <button
                type="button"
                className={`${styles.modeBtn} ${mode === 'rectangular' ? styles.modeBtnActive : ''}`}
                onClick={() => setMode('rectangular')}
              >
                Rectangular Bed(s)
              </button>
              <button
                type="button"
                className={`${styles.modeBtn} ${mode === 'area' ? styles.modeBtnActive : ''}`}
                onClick={() => setMode('area')}
              >
                Direct Total Area (Sq Ft)
              </button>
            </div>

            {mode === 'rectangular' ? (
              <div className={styles.grid3}>
                <div className={styles.inputGroup}>
                  <label htmlFor={lengthId} className={styles.label}>
                    Bed Length (ft)
                  </label>
                  <input
                    id={lengthId}
                    type="number"
                    min="1"
                    step="any"
                    className={styles.input}
                    value={lengthFeet || ''}
                    onChange={(e) => setLengthFeet(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 8"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor={widthId} className={styles.label}>
                    Bed Width (ft)
                  </label>
                  <input
                    id={widthId}
                    type="number"
                    min="1"
                    step="any"
                    className={styles.input}
                    value={widthFeet || ''}
                    onChange={(e) => setWidthFeet(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 4"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor={bedsId} className={styles.label}>
                    Number of Beds
                  </label>
                  <input
                    id={bedsId}
                    type="number"
                    min="1"
                    step="1"
                    className={styles.input}
                    value={bedsCount}
                    onChange={(e) => setBedsCount(parseInt(e.target.value, 10) || 1)}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.inputGroup}>
                <label htmlFor={directAreaId} className={styles.label}>
                  Total Planting or Lawn Area (Sq Ft)
                </label>
                <input
                  id={directAreaId}
                  type="number"
                  min="1"
                  step="any"
                  className={styles.input}
                  value={directArea || ''}
                  onChange={(e) => setDirectArea(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 96"
                />
              </div>
            )}
            <span className={styles.helperText}>
              Total planting footprint: {results.totalAreaSqFt} sq ft
            </span>
          </div>

          {/* Card 2: Compost Application Depth */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>2</span>
              <h2 className={styles.cardTitle}>Application Type &amp; Compost Depth</h2>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={depthPresetId} className={styles.label}>
                Application Type / Recommended Depth
              </label>
              <select
                id={depthPresetId}
                className={styles.select}
                value={depthOption}
                onChange={(e) => setDepthOption(e.target.value)}
              >
                <option value="2">Annual Garden Soil Amendment (2&quot; — Till into top 6&quot;)</option>
                <option value="0.25">Lawn Top-Dressing / Aeration (1/4&quot; thin dressing)</option>
                <option value="0.5">Lawn Heavy Top-Dressing (1/2&quot; max for turf)</option>
                <option value="1">Perennial Flower Bed Mulch (1&quot; top dressing)</option>
                <option value="3">Clay / Sand Soil Renovation (3&quot; heavy blend)</option>
                <option value="8">New Raised Garden Bed Fill (8&quot; Mel&apos;s Mix depth)</option>
                <option value="12">Deep Raised Garden Bed Fill (12&quot; depth)</option>
                <option value="custom">Custom Depth (Inches)</option>
              </select>
            </div>

            {depthOption === 'custom' && (
              <div className={styles.inputGroup}>
                <label htmlFor={customDepthId} className={styles.label}>
                  Custom Compost Layer Depth (Inches)
                </label>
                <input
                  id={customDepthId}
                  type="number"
                  min="0.25"
                  step="0.25"
                  className={styles.input}
                  value={customDepth}
                  onChange={(e) => setCustomDepth(parseFloat(e.target.value) || 2)}
                />
              </div>
            )}
          </div>

          {/* Card 3: Packaging Size Preference */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>3</span>
              <h2 className={styles.cardTitle}>Preferred Bag Packaging Size</h2>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={bagSizeId} className={styles.label}>
                Select Retail Bag Packaging
              </label>
              <select
                id={bagSizeId}
                className={styles.select}
                value={preferredBagSize}
                onChange={(e) => setPreferredBagSize(parseFloat(e.target.value) as 1.0 | 1.5 | 2.0)}
              >
                <option value={1.0}>1.0 Cu Ft Bag (Standard Retail Size — ~40-50 lbs)</option>
                <option value={1.5}>1.5 Cu Ft Bag (Medium Organic Blend)</option>
                <option value={2.0}>2.0 Cu Ft Bag (Large Commercial Nursery Bag)</option>
              </select>
              <span className={styles.helperText}>
                Tip: 27 cubic feet = 1 bulk cubic yard (cheaper for projects over 1 yard)
              </span>
            </div>
          </div>

          {/* Card 4: Pricing & Budget */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>4</span>
              <h2 className={styles.cardTitle}>Cost Estimator (Optional)</h2>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={priceId} className={styles.label}>
                Cost per {preferredBagSize} Cu Ft Bag ($)
              </label>
              <input
                id={priceId}
                type="number"
                min="0"
                step="0.01"
                className={styles.input}
                value={costPerBag}
                onChange={(e) => setCostPerBag(e.target.value)}
                placeholder="e.g. 5.99"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Output Results */}
        <div className={styles.rightColumn}>
          {/* Primary Hero Card */}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>Total Compost Required</div>
            <div className={styles.heroValue}>{results.volumeCubicYards} Cu Yds</div>
            <div className={styles.heroSubtext}>
              Equivalent to {results.volumeCuFt} Cubic Feet ({results.selectedBagsCount} bags of{' '}
              {preferredBagSize} cu ft) at {results.depthInches}&quot; depth
            </div>
          </div>

          {/* Packaging Breakdown Card */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Complete Packaging &amp; Bulk Schedule</h3>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Total Garden Bed Area</span>
              <span className={styles.breakdownValue}>{results.totalAreaSqFt} sq ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Compost Layer Depth</span>
              <span className={styles.breakdownValue}>{results.depthInches} Inches</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Total Volume in Cubic Feet</span>
              <span className={styles.breakdownValue} style={{ color: '#0284C7', fontWeight: 800 }}>
                {results.volumeCuFt} ft³
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Bulk Cubic Yards to Order</span>
              <span className={styles.breakdownValue} style={{ color: '#0284C7', fontWeight: 800 }}>
                {results.volumeCubicYards} Cubic Yards
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>1.0 Cu Ft Retail Bags</span>
              <span className={styles.breakdownValue}>{results.bags10CuFt} Bags</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>1.5 Cu Ft Medium Bags</span>
              <span className={styles.breakdownValue}>{results.bags15CuFt} Bags</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>2.0 Cu Ft Nursery Bags</span>
              <span className={styles.breakdownValue}>{results.bags20CuFt} Bags</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Estimated Bulk Weight</span>
              <span className={styles.breakdownValue}>
                {results.estimatedWeightTons} Tons (~{results.estimatedWeightLbs.toLocaleString()} lbs)
              </span>
            </div>
          </div>

          {/* Pricing Summary Card */}
          {results.totalCost !== undefined && (
            <div className={styles.breakdownCard}>
              <h3 className={styles.breakdownTitle}>Estimated Compost Investment</h3>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>
                  {results.selectedBagsCount} Bags ({preferredBagSize} cu ft) @ $
                  {parseFloat(costPerBag || '0').toFixed(2)}
                </span>
                <span className={styles.costHighlight}>${results.totalCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

