'use client';

import React, { useState, useId } from 'react';
import styles from './TonsYardsConverter.module.css';
import {
  convertTonsToCubicYards,
  MATERIAL_DENSITIES,
  ConversionDirection,
} from '@/lib/tons-yards-engine';

export default function TonsYardsConverter() {
  const amountId = useId();
  const materialId_input = useId();
  const customDensityId = useId();
  const priceId = useId();

  const [direction, setDirection] = useState<ConversionDirection>('tons-to-yards');
  const [amount, setAmount] = useState<number>(12);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('crushed-stone');
  const [customDensity, setCustomDensity] = useState<number>(1.4);
  const [unitPrice, setUnitPrice] = useState<string>('60.00');

  const priceNum = parseFloat(unitPrice);

  const results = convertTonsToCubicYards({
    direction,
    amount,
    materialId: selectedMaterial,
    customDensityTonsPerYard: selectedMaterial === 'custom' ? customDensity : undefined,
    unitPrice: isNaN(priceNum) ? undefined : priceNum,
  });

  const selectedPreset = MATERIAL_DENSITIES.find((m) => m.id === selectedMaterial);
  const currentDensity =
    selectedMaterial === 'custom'
      ? customDensity
      : selectedPreset
        ? selectedPreset.densityTonsPerYard
        : 1.4;

  return (
    <div className={styles.container}>
      <div className={styles.calculatorGrid}>
        {/* Left Column: 3 Step Cards */}
        <div className={styles.leftColumn}>
          {/* Card 1: Conversion Direction & Quantity */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>1</span>
              <h2 className={styles.cardTitle}>Conversion Direction &amp; Quantity</h2>
            </div>

            <div className={styles.directionToggle}>
              <button
                type="button"
                className={`${styles.dirBtn} ${direction === 'tons-to-yards' ? styles.dirBtnActive : ''}`}
                onClick={() => setDirection('tons-to-yards')}
              >
                Tons ➔ Cubic Yards
              </button>
              <button
                type="button"
                className={`${styles.dirBtn} ${direction === 'yards-to-tons' ? styles.dirBtnActive : ''}`}
                onClick={() => setDirection('yards-to-tons')}
              >
                Cubic Yards ➔ Tons
              </button>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={amountId} className={styles.label}>
                {direction === 'tons-to-yards'
                  ? 'Weight in US Short Tons (2,000 lbs each)'
                  : 'Volume in Cubic Yards (27 cu ft each)'}
              </label>
              <input
                id={amountId}
                type="number"
                min="0.1"
                step="any"
                className={styles.input}
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 12"
              />
            </div>
          </div>

          {/* Card 2: Material Density Preset */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>2</span>
              <h2 className={styles.cardTitle}>Material Density Preset</h2>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={materialId_input} className={styles.label}>
                Select Aggregate or Soil Material
              </label>
              <select
                id={materialId_input}
                className={styles.select}
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                {MATERIAL_DENSITIES.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name} ({mat.densityTonsPerYard.toFixed(2)} tons/yd³ / ~{mat.lbsPerCuFt} lbs/ft³)
                  </option>
                ))}
                <option value="custom">Custom Density (Enter your own)</option>
              </select>
              <span className={styles.helperText}>
                Active bulk density: {currentDensity.toFixed(2)} tons/yd³ ({(currentDensity * (2000 / 27)).toFixed(1)} lbs/cu ft)
              </span>
            </div>

            {selectedMaterial === 'custom' && (
              <div className={styles.inputGroup}>
                <label htmlFor={customDensityId} className={styles.label}>
                  Custom Density (Tons per Cubic Yard)
                </label>
                <input
                  id={customDensityId}
                  type="number"
                  min="0.1"
                  step="0.05"
                  className={styles.input}
                  value={customDensity}
                  onChange={(e) => setCustomDensity(parseFloat(e.target.value) || 1.4)}
                />
              </div>
            )}
          </div>

          {/* Card 3: Pricing (Optional) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>3</span>
              <h2 className={styles.cardTitle}>Cost Estimator (Optional)</h2>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={priceId} className={styles.label}>
                Cost per {direction === 'tons-to-yards' ? 'Ton' : 'Cubic Yard'} ($)
              </label>
              <input
                id={priceId}
                type="number"
                min="0"
                step="0.01"
                className={styles.input}
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="e.g. 60.00"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Results Display */}
        <div className={styles.rightColumn}>
          {/* Primary Hero Card */}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>
              {direction === 'tons-to-yards' ? 'Converted Volume' : 'Converted Weight'}
            </div>
            <div className={styles.heroValue}>
              {direction === 'tons-to-yards'
                ? `${results.volumeCubicYards} Cu Yds`
                : `${results.weightShortTons} Tons`}
            </div>
            <div className={styles.heroSubtext}>
              {direction === 'tons-to-yards'
                ? `Equivalent to ${results.volumeCubicFeet} Cubic Feet (from ${results.weightShortTons} tons of ${
                    selectedPreset?.name || 'material'
                  })`
                : `Equivalent to ${results.weightPounds.toLocaleString()} lbs (from ${results.volumeCubicYards} cu yds of ${
                    selectedPreset?.name || 'material'
                  })`}
            </div>
          </div>

          {/* Complete Conversion Matrix Card */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Complete Unit Conversion Matrix</h3>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Volume in Cubic Yards</span>
              <span className={styles.breakdownValue} style={{ color: '#0284C7', fontWeight: 800 }}>
                {results.volumeCubicYards} yd³
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Volume in Cubic Feet</span>
              <span className={styles.breakdownValue}>{results.volumeCubicFeet} ft³</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Volume in Cubic Meters</span>
              <span className={styles.breakdownValue}>{results.volumeCubicMeters} m³</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Weight in US Short Tons</span>
              <span className={styles.breakdownValue}>{results.weightShortTons} Tons</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Weight in Total Pounds</span>
              <span className={styles.breakdownValue}>{results.weightPounds.toLocaleString()} lbs</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Weight in Metric Tonnes</span>
              <span className={styles.breakdownValue}>{results.weightMetricTonnes} Tonnes</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Retail 50 lb Bags Equivalent</span>
              <span className={styles.breakdownValue}>{results.bags50LbCount} Bags</span>
            </div>
          </div>

          {/* Pricing Summary Card */}
          {results.totalCost !== undefined && (
            <div className={styles.breakdownCard}>
              <h3 className={styles.breakdownTitle}>Total Material Cost</h3>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>
                  {amount} {direction === 'tons-to-yards' ? 'Tons' : 'Cu Yds'} @ $
                  {parseFloat(unitPrice || '0').toFixed(2)}
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

