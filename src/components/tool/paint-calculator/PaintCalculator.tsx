'use client';

import React, { useState, useId } from 'react';
import styles from './PaintCalculator.module.css';
import {
  SURFACE_TEXTURES,
  calculatePaint,
} from '@/lib/paint-engine';

export function PaintCalculator() {
  const lengthInputId = useId();
  const widthInputId = useId();
  const heightInputId = useId();
  const directAreaInputId = useId();
  const doorsInputId = useId();
  const windowsInputId = useId();
  const customDeductId = useId();
  const textureSelectId = useId();
  const pricePaintId = useId();
  const pricePrimerId = useId();
  const suppliesInputId = useId();

  // Mode: 'room' | 'direct'
  const [mode, setMode] = useState<'room' | 'direct'>('room');

  // Room inputs
  const [roomLength, setRoomLength] = useState<number>(14);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [ceilingHeight, setCeilingHeight] = useState<number>(8);
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(false);
  const [doorsCount, setDoorsCount] = useState<number>(1);
  const [windowsCount, setWindowsCount] = useState<number>(2);
  const [customDeduction, setCustomDeduction] = useState<number>(0);

  // Direct area mode
  const [directArea, setDirectArea] = useState<number>(400);

  // Texture & coats
  const [texturePresetId, setTexturePresetId] = useState<string>('smooth');
  const [customCoverage, setCustomCoverage] = useState<number>(380);
  const [coats, setCoats] = useState<number>(2);
  const [includePrimer, setIncludePrimer] = useState<boolean>(false);

  // Cost inputs
  const [pricePerGallon, setPricePerGallon] = useState<string>('45');
  const [pricePerPrimer, setPricePerPrimer] = useState<string>('25');
  const [suppliesCost, setSuppliesCost] = useState<string>('25');

  // Copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Calculation
  const result = calculatePaint({
    mode,
    roomLengthFeet: roomLength,
    roomWidthFeet: roomWidth,
    ceilingHeightFeet: ceilingHeight,
    includeCeiling,
    doorsCount,
    windowsCount,
    customDeductionsSqFt: customDeduction,
    directWallAreaSqFt: directArea,
    texturePresetId,
    customCoverageSqFt: customCoverage,
    coats,
    includePrimer,
    pricePerGallon: parseFloat(pricePerGallon) || 0,
    pricePerPrimerGallon: parseFloat(pricePerPrimer) || 0,
    suppliesCost: parseFloat(suppliesCost) || 0,
  });

  const handleReset = () => {
    setMode('room');
    setRoomLength(14);
    setRoomWidth(12);
    setCeilingHeight(8);
    setIncludeCeiling(false);
    setDoorsCount(1);
    setWindowsCount(2);
    setCustomDeduction(0);
    setDirectArea(400);
    setTexturePresetId('smooth');
    setCustomCoverage(380);
    setCoats(2);
    setIncludePrimer(false);
    setPricePerGallon('45');
    setPricePerPrimer('25');
    setSuppliesCost('25');
  };

  const handleCopySummary = () => {
    const summary = `--- Paint Coverage & Cost Estimate (kkctools.com) ---
Mode: ${mode === 'room' ? `Room (${roomLength}ft L x ${roomWidth}ft W x ${ceilingHeight}ft H)` : `Direct Area (${directArea} sq ft)`}
${mode === 'room' ? `Gross Wall Area: ${result.grossWallAreaSqFt} sq ft\nDeductions: ${result.openingsDeductionSqFt} sq ft (${doorsCount} doors, ${windowsCount} windows)\n` : ''}Net Paintable Wall Area: ${result.netWallAreaSqFt} sq ft
${includeCeiling ? `Ceiling Area: ${result.ceilingAreaSqFt} sq ft\n` : ''}Number of Coats: ${coats} coat${coats > 1 ? 's' : ''}
Surface Texture: ${texturePresetId === 'custom' ? `Custom (${customCoverage} sq ft/gal)` : SURFACE_TEXTURES[texturePresetId]?.name}

Results:
• Paint Volume Required: ${result.containerSummary} (Exact: ${result.exactPaintGallons} gal for ${coats} coats)
${result.hasFiveGallonPailOption ? `• Contractor Bulk Option: ${result.fiveGallonPails} five-gallon pail(s) + ${result.singleGallonsWithPails} one-gallon can(s)\n` : ''}${includePrimer ? `• Primer Needed: ~${result.exactPrimerGallons} gallons (Buy ${result.recommendedPrimerGallons} gal)\n` : ''}• Total Surface Area Covered: ${result.totalCoatAreaSqFt} sq ft total
${result.totalDiyCost > 0 ? `• Estimated DIY Materials Cost: $${result.totalDiyCost.toFixed(2)} (Paint: $${result.paintCost.toFixed(2)}${includePrimer ? `, Primer: $${result.primerCost.toFixed(2)}` : ''}, Supplies: $${result.suppliesCost.toFixed(2)})\n• Pro Contractor Cost Range: $${result.proEstimatedCostLow} – $${result.proEstimatedCostHigh}` : ''}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={styles.calculatorCard}>
      {/* Mode Switch Tabs */}
      <div className={styles.modeTabs} role="tablist" aria-label="Calculation Mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'room'}
          className={`${styles.modeTab} ${mode === 'room' ? styles.activeTab : ''}`}
          onClick={() => setMode('room')}
        >
          Room by Dimensions (L × W × H)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'direct'}
          className={`${styles.modeTab} ${mode === 'direct' ? styles.activeTab : ''}`}
          onClick={() => setMode('direct')}
        >
          Direct Wall Area (Sq Ft)
        </button>
      </div>

      <div className={styles.twoColumnGrid}>
        {/* Left Column: Inputs in Distinct Bordered Cards */}
        <div className={styles.inputColumn}>
          {mode === 'room' ? (
            <>
              {/* Card 1: Room Dimensions */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionNumber}>1</span>
                  <span className={styles.sectionTitle}>Room Dimensions</span>
                </div>
                <div className={styles.inputRowThree}>
                  <div className={styles.inputGroup}>
                    <label htmlFor={lengthInputId} className={styles.inputLabel}>
                      Length <span>(feet)</span>
                    </label>
                    <input
                      id={lengthInputId}
                      type="number"
                      min="0"
                      step="0.5"
                      value={roomLength || ''}
                      onChange={(e) => setRoomLength(parseFloat(e.target.value) || 0)}
                      className={styles.textInput}
                      placeholder="14"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor={widthInputId} className={styles.inputLabel}>
                      Width <span>(feet)</span>
                    </label>
                    <input
                      id={widthInputId}
                      type="number"
                      min="0"
                      step="0.5"
                      value={roomWidth || ''}
                      onChange={(e) => setRoomWidth(parseFloat(e.target.value) || 0)}
                      className={styles.textInput}
                      placeholder="12"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor={heightInputId} className={styles.inputLabel}>
                      Height <span>(feet)</span>
                    </label>
                    <input
                      id={heightInputId}
                      type="number"
                      min="0"
                      step="0.5"
                      value={ceilingHeight || ''}
                      onChange={(e) => setCeilingHeight(parseFloat(e.target.value) || 0)}
                      className={styles.textInput}
                      placeholder="8"
                    />
                  </div>
                </div>

                {/* Include Ceiling Toggle Card */}
                <label className={styles.toggleRow}>
                  <input
                    type="checkbox"
                    checked={includeCeiling}
                    onChange={(e) => setIncludeCeiling(e.target.checked)}
                    className={styles.toggleCheckbox}
                  />
                  <div className={styles.toggleText}>
                    <span className={styles.toggleTitle}>Include Ceiling in Paint Area</span>
                    <span className={styles.toggleSub}>
                      Adds {roomLength * roomWidth} sq ft (Length × Width) to coverage
                    </span>
                  </div>
                </label>
              </div>

              {/* Card 2: Openings to Deduct */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionNumber}>2</span>
                  <span className={styles.sectionTitle}>Openings to Deduct</span>
                </div>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor={doorsInputId} className={styles.inputLabel}>
                      Doors Count <span>(-21 sq ft ea)</span>
                    </label>
                    <input
                      id={doorsInputId}
                      type="number"
                      min="0"
                      value={doorsCount}
                      onChange={(e) => setDoorsCount(parseInt(e.target.value, 10) || 0)}
                      className={styles.textInput}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor={windowsInputId} className={styles.inputLabel}>
                      Windows Count <span>(-15 sq ft ea)</span>
                    </label>
                    <input
                      id={windowsInputId}
                      type="number"
                      min="0"
                      value={windowsCount}
                      onChange={(e) => setWindowsCount(parseInt(e.target.value, 10) || 0)}
                      className={styles.textInput}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor={customDeductId} className={styles.inputLabel}>
                    Custom Deductions <span>(sq ft — fireplaces, archways)</span>
                  </label>
                  <input
                    id={customDeductId}
                    type="number"
                    min="0"
                    value={customDeduction || ''}
                    onChange={(e) => setCustomDeduction(parseFloat(e.target.value) || 0)}
                    className={styles.textInput}
                    placeholder="e.g. 40"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Direct Area Mode Card */
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNumber}>1</span>
                <span className={styles.sectionTitle}>Direct Wall Area</span>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={directAreaInputId} className={styles.inputLabel}>
                  Total Net Wall Surface Area <span>(sq ft)</span>
                </label>
                <input
                  id={directAreaInputId}
                  type="number"
                  min="0"
                  step="10"
                  value={directArea || ''}
                  onChange={(e) => setDirectArea(parseFloat(e.target.value) || 0)}
                  className={styles.textInput}
                  placeholder="e.g. 500"
                />
              </div>
            </div>
          )}

          {/* Card 3: Paint Coats & Texture */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>{mode === 'room' ? '3' : '2'}</span>
              <span className={styles.sectionTitle}>Paint Coats &amp; Wall Texture</span>
            </div>

            {/* Number of Coats */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Number of Paint Coats</label>
              <div className={styles.pillGroup}>
                {[1, 2, 3].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCoats(c)}
                    className={`${styles.pillButton} ${coats === c ? styles.pillActive : ''}`}
                  >
                    {c === 1 ? '1 Coat (Touch-up)' : c === 2 ? '2 Coats (Recommended)' : '3 Coats (Dark to Light)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Surface Texture Dropdown */}
            <div className={styles.inputGroup}>
              <label htmlFor={textureSelectId} className={styles.inputLabel}>
                Wall Surface Texture &amp; Porosity
              </label>
              <select
                id={textureSelectId}
                value={texturePresetId}
                onChange={(e) => setTexturePresetId(e.target.value)}
                className={styles.selectInput}
              >
                {Object.values(SURFACE_TEXTURES).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.coverageSqFtPerGal} sq ft/gal
                  </option>
                ))}
                <option value="custom">Custom Coverage Rate...</option>
              </select>
            </div>

            {texturePresetId === 'custom' && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Custom Coverage Rate (sq ft per gallon)</label>
                <input
                  type="number"
                  min="50"
                  max="600"
                  value={customCoverage}
                  onChange={(e) => setCustomCoverage(parseFloat(e.target.value) || 380)}
                  className={styles.textInput}
                />
              </div>
            )}

            {/* Primer Coat Toggle */}
            <label className={styles.toggleRow}>
              <input
                type="checkbox"
                checked={includePrimer}
                onChange={(e) => setIncludePrimer(e.target.checked)}
                className={styles.toggleCheckbox}
              />
              <div className={styles.toggleText}>
                <span className={styles.toggleTitle}>Include 1 Dedicated Primer Coat</span>
                <span className={styles.toggleSub}>
                  Recommended for unpainted drywall, stain repairs, or dark-to-light colors
                </span>
              </div>
            </label>
          </div>

          {/* Card 4: Cost Estimator (Optional) */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>{mode === 'room' ? '4' : '3'}</span>
              <span className={styles.sectionTitle}>Budget &amp; Cost Estimator (Optional)</span>
            </div>
            <div className={styles.inputRowThree}>
              <div className={styles.inputGroup}>
                <label htmlFor={pricePaintId} className={styles.inputLabel}>
                  Paint <span>($/gal)</span>
                </label>
                <input
                  id={pricePaintId}
                  type="number"
                  step="1"
                  min="0"
                  value={pricePerGallon}
                  onChange={(e) => setPricePerGallon(e.target.value)}
                  className={styles.textInput}
                  placeholder="45"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={pricePrimerId} className={styles.inputLabel}>
                  Primer <span>($/gal)</span>
                </label>
                <input
                  id={pricePrimerId}
                  type="number"
                  step="1"
                  min="0"
                  value={pricePerPrimer}
                  onChange={(e) => setPricePerPrimer(e.target.value)}
                  className={styles.textInput}
                  placeholder="25"
                  disabled={!includePrimer}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={suppliesInputId} className={styles.inputLabel}>
                  Supplies <span>($ tape, tray)</span>
                </label>
                <input
                  id={suppliesInputId}
                  type="number"
                  step="5"
                  min="0"
                  value={suppliesCost}
                  onChange={(e) => setSuppliesCost(e.target.value)}
                  className={styles.textInput}
                  placeholder="25"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Summary Cards */}
        <div className={styles.resultsColumn}>
          {/* Hero Banner */}
          <div className={styles.heroResultCard}>
            <div className={styles.heroLabel}>Total Paint to Purchase</div>
            <div className={styles.heroBigNumber}>
              {result.containerSummary}
            </div>
            <div className={styles.heroSubtext}>
              Exact Volume: {result.exactPaintGallons} Gallons for {coats} coat{coats > 1 ? 's' : ''} ({result.totalCoatAreaSqFt} sq ft total)
            </div>
          </div>

          {/* Secondary Specifications Card */}
          <div className={styles.secondaryResultsCard}>
            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Net Paintable Wall Area</span>
              <span className={styles.outputValue}>
                {result.netWallAreaSqFt} sq ft{' '}
                {result.openingsDeductionSqFt > 0 && (
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>
                    (-{result.openingsDeductionSqFt} sq ft openings)
                  </span>
                )}
              </span>
            </div>

            {includeCeiling && (
              <div className={styles.outputRow}>
                <span className={styles.outputLabel}>Ceiling Area</span>
                <span className={styles.outputValue}>{result.ceilingAreaSqFt} sq ft</span>
              </div>
            )}

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Total Area per Single Coat</span>
              <span className={styles.outputValue}>{result.singleCoatAreaSqFt} sq ft</span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Coverage Spread Rate</span>
              <span className={styles.outputValue}>
                {texturePresetId === 'custom' ? customCoverage : SURFACE_TEXTURES[texturePresetId]?.coverageSqFtPerGal} sq ft / gal
              </span>
            </div>

            {/* Primer info if enabled */}
            {includePrimer && (
              <div className={styles.outputRow}>
                <span className={styles.outputLabel}>Dedicated Primer Needed</span>
                <span className={styles.outputValue} style={{ color: '#0369A1' }}>
                  {result.recommendedPrimerGallons} Gallon{result.recommendedPrimerGallons > 1 ? 's' : ''}{' '}
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>
                    (Exact: {result.exactPrimerGallons} gal)
                  </span>
                </span>
              </div>
            )}

            {/* Contractor 5-gal bucket tip */}
            {result.hasFiveGallonPailOption && (
              <div className={styles.outputRow}>
                <span className={styles.outputLabel}>Bulk Packaging Option</span>
                <span className={styles.outputValue}>
                  {result.fiveGallonPails} × 5-Gal Pail{result.fiveGallonPails > 1 ? 's' : ''}
                  {result.singleGallonsWithPails > 0 ? ` + ${result.singleGallonsWithPails} Single Gallon(s)` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Pricing & Cost Estimate Card */}
          {result.totalDiyCost > 0 && (
            <div className={styles.costSection}>
              <div className={styles.outputRow}>
                <span className={styles.outputLabel}>
                  Paint ({result.recommendedGallons} gal @ ${pricePerGallon}):
                </span>
                <span className={styles.outputValue}>${result.paintCost.toFixed(2)}</span>
              </div>

              {includePrimer && result.primerCost > 0 && (
                <div className={styles.outputRow}>
                  <span className={styles.outputLabel}>
                    Primer ({result.recommendedPrimerGallons} gal @ ${pricePerPrimer}):
                  </span>
                  <span className={styles.outputValue}>${result.primerCost.toFixed(2)}</span>
                </div>
              )}

              {result.suppliesCost > 0 && (
                <div className={styles.outputRow}>
                  <span className={styles.outputLabel}>Supplies &amp; Tape:</span>
                  <span className={styles.outputValue}>${result.suppliesCost.toFixed(2)}</span>
                </div>
              )}

              <div className={styles.costTotalRow}>
                <span>Total Estimated DIY Cost:</span>
                <span>${result.totalDiyCost.toFixed(2)}</span>
              </div>

              <div className={styles.savingsBox}>
                <div className={styles.savingsTitle}>💡 Professional Painter Benchmark</div>
                Contractor quote for this space: <strong>${result.proEstimatedCostLow} – ${result.proEstimatedCostHigh}</strong>. Doing it yourself saves approximately <strong>${Math.max(0, result.proEstimatedCostLow - result.totalDiyCost)} – ${Math.max(0, result.proEstimatedCostHigh - result.totalDiyCost)}</strong>!
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actionRow}>
            <button
              type="button"
              onClick={handleCopySummary}
              className={styles.copyButton}
            >
              {copied ? '✓ Calculation Copied!' : '📋 Copy Calculation Summary'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetButton}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
