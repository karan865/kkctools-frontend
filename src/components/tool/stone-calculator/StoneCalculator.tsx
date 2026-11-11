'use client';

import React, { useState, useId } from 'react';
import styles from './StoneCalculator.module.css';
import {
  calculateStone,
  STONE_MATERIAL_PRESETS,
  StoneCalculationInput,
} from '@/lib/stone-engine';

export function StoneCalculator() {
  const [mode, setMode] = useState<'dimensions' | 'area'>('dimensions');
  const [lengthFt, setLengthFt] = useState<number>(20);
  const [widthFt, setWidthFt] = useState<number>(10);
  const [areaSqFt, setAreaSqFt] = useState<number>(200);
  const [depthInches, setDepthInches] = useState<number>(3);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('crushed-limestone-57');
  const [customDensity, setCustomDensity] = useState<number>(95);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [pricingMode, setPricingMode] = useState<'ton' | 'cubicYard'>('ton');
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [deliveryFee, setDeliveryFee] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Form IDs for accessibility
  const lengthId = useId();
  const widthId = useId();
  const areaId = useId();
  const depthId = useId();
  const presetId = useId();
  const customDensityId = useId();
  const pricingModeId = useId();
  const unitPriceId = useId();
  const deliveryFeeId = useId();

  const activePreset = STONE_MATERIAL_PRESETS.find((p) => p.id === selectedPresetId);
  const effectiveDensity = selectedPresetId === 'custom' ? customDensity : (activePreset?.densityLbFt3 || 95);

  const input: StoneCalculationInput = {
    mode,
    lengthFt,
    widthFt,
    areaSqFt,
    depthInches,
    densityLbFt3: effectiveDensity,
    wastePercent,
    pricingMode,
    unitPrice: unitPrice ? parseFloat(unitPrice) : 0,
    deliveryFee: deliveryFee ? parseFloat(deliveryFee) : 0,
  };

  const results = calculateStone(input);

  const handleCopySummary = () => {
    const summary = `--- Stone & Rock Calculation Summary ---
Project Area: ${results.netAreaSqFt} sq ft (${depthInches}" depth)
Gross Volume (+${results.wastePercent}% waste): ${results.grossVolumeCuFt} cu ft (${results.volumeCuYds} cu yds)
Material: ${selectedPresetId === 'custom' ? `Custom (${effectiveDensity} lbs/cu ft)` : activePreset?.name}
Total Weight to Order: ${results.weightUSShortTons} US Short Tons (${results.totalWeightLbs.toLocaleString()} lbs / ${results.weightMetricTonnes} tonnes)
Standard 50 lb Bags Equivalent: ${results.bags50lb} Bags
${results.totalCost > 0 ? `Estimated Delivered Cost: $${results.totalCost.toFixed(2)} (Material: $${results.materialCost.toFixed(2)}, Delivery: $${results.deliveryFee.toFixed(2)})` : ''}
Calculated via KKCTools (https://kkctools.com/stone-calculator/)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setMode('dimensions');
    setLengthFt(20);
    setWidthFt(10);
    setAreaSqFt(200);
    setDepthInches(3);
    setSelectedPresetId('crushed-limestone-57');
    setCustomDensity(95);
    setWastePercent(10);
    setPricingMode('ton');
    setUnitPrice('');
    setDeliveryFee('');
  };

  return (
    <div className={styles.container}>
      {/* LEFT COLUMN: Modular Input Cards */}
      <div className={styles.leftColumn}>
        {/* Mode Switcher */}
        <div className={styles.modeTabs} role="tablist" aria-label="Measurement Mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'dimensions'}
            className={`${styles.modeTab} ${mode === 'dimensions' ? styles.modeTabActive : ''}`}
            onClick={() => setMode('dimensions')}
          >
            Rectangular Area (L × W)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'area'}
            className={`${styles.modeTab} ${mode === 'area' ? styles.modeTabActive : ''}`}
            onClick={() => setMode('area')}
          >
            Direct Square Footage (Sq Ft)
          </button>
        </div>

        {/* Card 1: Dimensions */}
        <div className={styles.cardSection}>
          <div className={styles.cardHeader}>
            <span className={styles.stepBadge}>1</span>
            <h3 className={styles.cardTitle}>Project Dimensions &amp; Depth</h3>
          </div>

          {mode === 'dimensions' ? (
            <div className={styles.grid3}>
              <div className={styles.inputGroup}>
                <label htmlFor={lengthId} className={styles.label}>
                  Length (feet)
                </label>
                <input
                  id={lengthId}
                  type="number"
                  min="0"
                  step="0.5"
                  className={styles.input}
                  value={lengthFt || ''}
                  onChange={(e) => setLengthFt(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 20"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={widthId} className={styles.label}>
                  Width (feet)
                </label>
                <input
                  id={widthId}
                  type="number"
                  min="0"
                  step="0.5"
                  className={styles.input}
                  value={widthFt || ''}
                  onChange={(e) => setWidthFt(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 10"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={depthId} className={styles.label}>
                  Depth (inches)
                </label>
                <input
                  id={depthId}
                  type="number"
                  min="0.5"
                  step="0.25"
                  className={styles.input}
                  value={depthInches || ''}
                  onChange={(e) => setDepthInches(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 3"
                />
                <span className={styles.helperText}>Standard depth: 2&quot; to 3&quot;</span>
              </div>
            </div>
          ) : (
            <div className={styles.grid2}>
              <div className={styles.inputGroup}>
                <label htmlFor={areaId} className={styles.label}>
                  Total Area (Square Feet)
                </label>
                <input
                  id={areaId}
                  type="number"
                  min="0"
                  step="1"
                  className={styles.input}
                  value={areaSqFt || ''}
                  onChange={(e) => setAreaSqFt(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 200"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={depthId} className={styles.label}>
                  Depth (inches)
                </label>
                <input
                  id={depthId}
                  type="number"
                  min="0.5"
                  step="0.25"
                  className={styles.input}
                  value={depthInches || ''}
                  onChange={(e) => setDepthInches(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 3"
                />
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Material & Density Preset */}
        <div className={styles.cardSection}>
          <div className={styles.cardHeader}>
            <span className={styles.stepBadge}>2</span>
            <h3 className={styles.cardTitle}>Material &amp; Density Preset</h3>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor={presetId} className={styles.label}>
              Select Aggregate / Rock Type
            </label>
            <select
              id={presetId}
              className={styles.select}
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
            >
              {STONE_MATERIAL_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              <option value="custom">Custom Density (Enter your own lbs/cu ft)</option>
            </select>
            {activePreset && selectedPresetId !== 'custom' && (
              <span className={styles.helperText}>
                {activePreset.description} • ~{activePreset.tonsPerYd3.toFixed(2)} tons per cu yd
              </span>
            )}
          </div>

          {selectedPresetId === 'custom' && (
            <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
              <label htmlFor={customDensityId} className={styles.label}>
                Custom Material Density (lbs per cu ft)
              </label>
              <input
                id={customDensityId}
                type="number"
                min="10"
                max="250"
                step="1"
                className={styles.input}
                value={customDensity || ''}
                onChange={(e) => setCustomDensity(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 100"
              />
            </div>
          )}
        </div>

        {/* Card 3: Waste & Ground Settling Allowance */}
        <div className={styles.cardSection}>
          <div className={styles.cardHeader}>
            <span className={styles.stepBadge}>3</span>
            <h3 className={styles.cardTitle}>Waste &amp; Settling Buffer</h3>
          </div>

          <div className={styles.pillGrid}>
            {[
              { label: 'Exact (0%)', val: 0 },
              { label: 'Flower Beds (5%)', val: 5 },
              { label: 'Driveways (10%)', val: 10 },
              { label: 'Slopes / Ruts (15%)', val: 15 },
            ].map((pill) => (
              <button
                key={pill.val}
                type="button"
                className={`${styles.pillButton} ${wastePercent === pill.val ? styles.pillButtonActive : ''}`}
                onClick={() => setWastePercent(pill.val)}
              >
                {pill.label}
              </button>
            ))}
          </div>
          <span className={styles.helperText} style={{ display: 'block', marginTop: '8px' }}>
            Quarries recommend 5% to 10% extra for subsoil compaction and irregular trench edges.
          </span>
        </div>

        {/* Card 4: Pricing & Delivery (Optional) */}
        <div className={styles.cardSection}>
          <div className={styles.cardHeader}>
            <span className={styles.stepBadge}>4</span>
            <h3 className={styles.cardTitle}>Pricing &amp; Delivery (Optional)</h3>
          </div>

          <div className={styles.grid3}>
            <div className={styles.inputGroup}>
              <label htmlFor={pricingModeId} className={styles.label}>
                Pricing Mode
              </label>
              <select
                id={pricingModeId}
                className={styles.select}
                value={pricingMode}
                onChange={(e) => setPricingMode(e.target.value as 'ton' | 'cubicYard')}
              >
                <option value="ton">Price per US Ton ($)</option>
                <option value="cubicYard">Price per Cu Yard ($)</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={unitPriceId} className={styles.label}>
                Unit Price ($)
              </label>
              <input
                id={unitPriceId}
                type="number"
                min="0"
                step="1"
                className={styles.input}
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="e.g. 65"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={deliveryFeeId} className={styles.label}>
                Dump Delivery Fee ($)
              </label>
              <input
                id={deliveryFeeId}
                type="number"
                min="0"
                step="5"
                className={styles.input}
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                placeholder="e.g. 75"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.btnPrimary} onClick={handleCopySummary}>
            {copied ? '✓ Calculation Copied!' : '📋 Copy Calculation Summary'}
          </button>
          <button type="button" className={styles.btnSecondary} onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Output Cards */}
      <div className={styles.rightColumn}>
        {/* Hero Result Banner */}
        <div className={styles.heroCard}>
          <div className={styles.heroLabel}>Total Weight to Order</div>
          <div className={styles.heroValue}>{results.weightUSShortTons} Tons</div>
          <div className={styles.heroSubtext}>
            Equivalent to {results.volumeCuYds} Cubic Yards ({results.grossVolumeCuFt} Cu Ft with +{results.wastePercent}% buffer)
          </div>
        </div>

        {/* Detailed Breakdown Card */}
        <div className={styles.outputDetailsCard}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Net Surface Area</span>
            <span className={styles.detailValue}>{results.netAreaSqFt} sq ft</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Layer Thickness</span>
            <span className={styles.detailValue}>{results.depthInches} inches ({results.depthFt.toFixed(2)} ft)</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Bulk Volume to Order</span>
            <span className={`${styles.detailValue} ${styles.highlightValue}`}>{results.volumeCuYds} Cu Yds</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Total Weight (Pounds)</span>
            <span className={styles.detailValue}>{results.totalWeightLbs.toLocaleString()} lbs</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Weight in Metric Tonnes</span>
            <span className={styles.detailValue}>{results.weightMetricTonnes} Tonnes</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Standard 50 lb Bags Equivalent</span>
            <span className={`${styles.detailValue} ${styles.highlightValue}`}>{results.bags50lb} Bags</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Material Density Applied</span>
            <span className={styles.detailValue}>{effectiveDensity} lbs / cu ft</span>
          </div>
        </div>

        {/* Material Cost Breakdown Card (if prices entered) */}
        {results.totalCost > 0 && (
          <div className={styles.costCard}>
            <div className={styles.costTitle}>Project Cost Estimate</div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>
                Stone Material ({pricingMode === 'ton' ? `${results.weightUSShortTons} tons` : `${results.volumeCuYds} yds`})
              </span>
              <span className={styles.detailValue}>${results.materialCost.toFixed(2)}</span>
            </div>

            {results.deliveryFee > 0 && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Dump Truck Delivery</span>
                <span className={styles.detailValue}>${results.deliveryFee.toFixed(2)}</span>
              </div>
            )}

            <div className={styles.costTotalRow}>
              <span className={styles.costTotalLabel}>Total Delivered Cost</span>
              <span className={styles.costTotalValue}>${results.totalCost.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoneCalculator;
