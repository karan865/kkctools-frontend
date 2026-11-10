'use client';

import React, { useState, useId } from 'react';
import styles from './LaminateCalculator.module.css';
import {
  LAMINATE_PRESETS,
  calculateLaminateFlooring,
} from '@/lib/laminate-engine';

export function LaminateCalculator() {
  const lengthInputId = useId();
  const widthInputId = useId();
  const directAreaInputId = useId();
  const gradeSelectId = useId();
  const customBoxCoverageId = useId();
  const priceBoxId = useId();
  const moldingsAllowanceId = useId();

  // Mode: 'room' | 'direct'
  const [mode, setMode] = useState<'room' | 'direct'>('room');

  // Room inputs
  const [roomLength, setRoomLength] = useState<number>(18);
  const [roomWidth, setRoomWidth] = useState<number>(14);
  const [directArea, setDirectArea] = useState<number>(250);

  // Box coverage & grade
  const [gradePresetId, setGradePresetId] = useState<string>('waterproof');
  const [customBoxSqFt, setCustomBoxSqFt] = useState<number>(20.0);

  // Pattern / Waste
  const [wastePercent, setWastePercent] = useState<number>(10);

  // Pricing & Add-ons
  const [pricePerBox, setPricePerBox] = useState<string>('38');
  const [includeUnderlayment, setIncludeUnderlayment] = useState<boolean>(true);
  const [moldingsAllowance, setMoldingsAllowance] = useState<string>('45');

  // Copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Perform Calculation
  const result = calculateLaminateFlooring({
    mode,
    roomLengthFeet: roomLength,
    roomWidthFeet: roomWidth,
    directAreaSqFt: directArea,
    gradePresetId,
    customSqFtPerBox: customBoxSqFt,
    wastePercentage: wastePercent,
    pricePerBox: parseFloat(pricePerBox) || 0,
    includeUnderlayment,
    moldingsAllowance: parseFloat(moldingsAllowance) || 0,
  });

  const handleReset = () => {
    setMode('room');
    setRoomLength(18);
    setRoomWidth(14);
    setDirectArea(250);
    setGradePresetId('waterproof');
    setCustomBoxSqFt(20.0);
    setWastePercent(10);
    setPricePerBox('38');
    setIncludeUnderlayment(true);
    setMoldingsAllowance('45');
  };

  const handleCopySummary = () => {
    const summary = `--- Laminate Flooring Estimate (kkctools.com) ---
Mode: ${mode === 'room' ? `Room (${roomLength}ft L x ${roomWidth}ft W)` : `Direct Area (${directArea} sq ft)`}
Net Floor Area: ${result.netAreaSqFt} sq ft
Gross Area (+${wastePercent}% waste): ${result.grossAreaSqFt} sq ft
Perimeter Length: ${result.perimeterLinearFeet} linear ft (for baseboards & shoe molding)
Box Yield: ${result.sqFtPerBox} sq ft per box

Results:
• Total Boxes to Order: ${result.boxesNeeded} boxes (Provides ${result.totalPurchasedSqFt} sq ft)
• Extra / Surplus Safety Coverage: +${result.surplusSqFt} sq ft
• Underlayment Rolls Needed (100 sq ft rolls): ${result.underlaymentRolls} roll(s)
${result.totalDiyCost > 0 ? `• Estimated DIY Materials Cost: $${result.totalDiyCost.toFixed(2)} (Flooring: $${result.flooringMaterialCost.toFixed(2)}${includeUnderlayment ? `, Underlayment: $${result.underlaymentCost.toFixed(2)}` : ''}, Moldings: $${result.moldingsCost.toFixed(2)})\n• Pro Contractor Labor Range: $${result.proEstimatedCostLow} – $${result.proEstimatedCostHigh}` : ''}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={styles.calculatorCard}>
      {/* Mode Switch Tabs */}
      <div className={styles.modeTabs} role="tablist" aria-label="Measurement Mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'room'}
          className={`${styles.modeTab} ${mode === 'room' ? styles.activeTab : ''}`}
          onClick={() => setMode('room')}
        >
          Room by Dimensions (L × W)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'direct'}
          className={`${styles.modeTab} ${mode === 'direct' ? styles.activeTab : ''}`}
          onClick={() => setMode('direct')}
        >
          Direct Square Footage (Sq Ft)
        </button>
      </div>

      <div className={styles.twoColumnGrid}>
        {/* Left Column: Well-arranged Input Cards */}
        <div className={styles.inputColumn}>
          {/* Card 1: Area Dimensions */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>1</span>
              <span className={styles.sectionTitle}>
                {mode === 'room' ? 'Room Dimensions' : 'Total Square Footage'}
              </span>
            </div>

            {mode === 'room' ? (
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor={lengthInputId} className={styles.inputLabel}>
                    Room Length <span>(feet)</span>
                  </label>
                  <input
                    id={lengthInputId}
                    type="number"
                    min="0"
                    step="0.5"
                    value={roomLength || ''}
                    onChange={(e) => setRoomLength(parseFloat(e.target.value) || 0)}
                    className={styles.textInput}
                    placeholder="18"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor={widthInputId} className={styles.inputLabel}>
                    Room Width <span>(feet)</span>
                  </label>
                  <input
                    id={widthInputId}
                    type="number"
                    min="0"
                    step="0.5"
                    value={roomWidth || ''}
                    onChange={(e) => setRoomWidth(parseFloat(e.target.value) || 0)}
                    className={styles.textInput}
                    placeholder="14"
                  />
                </div>
              </div>
            ) : (
              <div className={styles.inputGroup}>
                <label htmlFor={directAreaInputId} className={styles.inputLabel}>
                  Total Net Floor Surface Area <span>(sq ft)</span>
                </label>
                <input
                  id={directAreaInputId}
                  type="number"
                  min="0"
                  step="5"
                  value={directArea || ''}
                  onChange={(e) => setDirectArea(parseFloat(e.target.value) || 0)}
                  className={styles.textInput}
                  placeholder="250"
                />
              </div>
            )}
          </div>

          {/* Card 2: Packaging & Grade Selection */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <span className={styles.sectionTitle}>Box Packaging &amp; Coverage</span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={gradeSelectId} className={styles.inputLabel}>
                Laminate Type &amp; Typical Coverage
              </label>
              <select
                id={gradeSelectId}
                value={gradePresetId}
                onChange={(e) => setGradePresetId(e.target.value)}
                className={styles.selectInput}
              >
                {Object.values(LAMINATE_PRESETS).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.description}
                  </option>
                ))}
                <option value="custom">Custom Box Coverage (Enter Sq Ft)...</option>
              </select>
            </div>

            {gradePresetId === 'custom' && (
              <div className={styles.inputGroup}>
                <label htmlFor={customBoxCoverageId} className={styles.inputLabel}>
                  Square Feet per Box <span>(From carton packaging)</span>
                </label>
                <input
                  id={customBoxCoverageId}
                  type="number"
                  step="0.1"
                  min="1"
                  value={customBoxSqFt}
                  onChange={(e) => setCustomBoxSqFt(parseFloat(e.target.value) || 20.0)}
                  className={styles.textInput}
                />
              </div>
            )}
          </div>

          {/* Card 3: Layout Pattern & Waste Margin */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <span className={styles.sectionTitle}>Layout Pattern &amp; Waste Factor</span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                Installation Pattern <span>(Accounts for cuts &amp; end-row trim)</span>
              </label>
              <div className={styles.pillGroup}>
                {[
                  { label: 'Straight Run (10%)', val: 10 },
                  { label: 'Random Staggered (12%)', val: 12 },
                  { label: 'Diagonal 45° (15%)', val: 15 },
                  { label: 'Herringbone (18%)', val: 18 },
                  { label: 'Complex / Multiple Angles (20%)', val: 20 },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setWastePercent(p.val)}
                    className={`${styles.pillButton} ${wastePercent === p.val ? styles.pillActive : ''}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Pricing & Material Add-ons */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <span className={styles.sectionTitle}>Pricing &amp; Add-ons (Optional)</span>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor={priceBoxId} className={styles.inputLabel}>
                  Price per Box <span>($ / box)</span>
                </label>
                <input
                  id={priceBoxId}
                  type="number"
                  step="1"
                  min="0"
                  value={pricePerBox}
                  onChange={(e) => setPricePerBox(e.target.value)}
                  className={styles.textInput}
                  placeholder="38"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={moldingsAllowanceId} className={styles.inputLabel}>
                  Moldings &amp; Trims <span>($ allowance)</span>
                </label>
                <input
                  id={moldingsAllowanceId}
                  type="number"
                  step="5"
                  min="0"
                  value={moldingsAllowance}
                  onChange={(e) => setMoldingsAllowance(e.target.value)}
                  className={styles.textInput}
                  placeholder="45"
                />
              </div>
            </div>

            {/* Toggle Underlayment Roll Calculation */}
            <label className={styles.toggleRow}>
              <input
                type="checkbox"
                checked={includeUnderlayment}
                onChange={(e) => setIncludeUnderlayment(e.target.checked)}
                className={styles.toggleCheckbox}
              />
              <div className={styles.toggleText}>
                <span className={styles.toggleTitle}>Include Acoustic Underlayment Rolls</span>
                <span className={styles.toggleSub}>
                  Adds standard 100 sq ft foam/moisture barrier rolls (~$40/roll)
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Output Results */}
        <div className={styles.resultsColumn}>
          {/* Hero Result Banner */}
          <div className={styles.heroResultCard}>
            <div className={styles.heroLabel}>Total Boxes to Order</div>
            <div className={styles.heroBigNumber}>
              {result.boxesNeeded}
              <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#E0F2FE' }}>boxes</span>
            </div>
            <div className={styles.heroSubtext}>
              Provides {result.totalPurchasedSqFt} sq ft (Covers {result.grossAreaSqFt} sq ft with {wastePercent}% waste)
            </div>
          </div>

          {/* Secondary Specifications Card */}
          <div className={styles.secondaryResultsCard}>
            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Net Room Floor Area</span>
              <span className={styles.outputValue}>{result.netAreaSqFt} sq ft</span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Gross Area to Buy (+Waste)</span>
              <span className={styles.outputValue}>{result.grossAreaSqFt} sq ft</span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Box Coverage Yield</span>
              <span className={styles.outputValue}>{result.sqFtPerBox} sq ft / box</span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Extra / Surplus Flooring</span>
              <span className={styles.outputValue}>
                +{result.surplusSqFt} sq ft{' '}
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>
                  (for future repairs)
                </span>
              </span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Underlayment Rolls (100 sq ft rolls)</span>
              <span className={styles.outputValue}>
                {result.underlaymentRolls} Roll{result.underlaymentRolls > 1 ? 's' : ''}
              </span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Perimeter for Baseboards &amp; Moldings</span>
              <span className={styles.outputValue}>{result.perimeterLinearFeet} linear ft</span>
            </div>
          </div>

          {/* Pricing & Cost Estimate Card */}
          {result.totalDiyCost > 0 && (
            <div className={styles.costSection}>
              <div className={styles.outputRow}>
                <span className={styles.outputLabel}>
                  Flooring ({result.boxesNeeded} boxes @ ${pricePerBox}):
                </span>
                <span className={styles.outputValue}>${result.flooringMaterialCost.toFixed(2)}</span>
              </div>

              {includeUnderlayment && result.underlaymentCost > 0 && (
                <div className={styles.outputRow}>
                  <span className={styles.outputLabel}>
                    Underlayment ({result.underlaymentRolls} rolls @ $40):
                  </span>
                  <span className={styles.outputValue}>${result.underlaymentCost.toFixed(2)}</span>
                </div>
              )}

              {result.moldingsCost > 0 && (
                <div className={styles.outputRow}>
                  <span className={styles.outputLabel}>Perimeter Moldings &amp; Trims:</span>
                  <span className={styles.outputValue}>${result.moldingsCost.toFixed(2)}</span>
                </div>
              )}

              <div className={styles.costTotalRow}>
                <span>Total Estimated DIY Cost:</span>
                <span>${result.totalDiyCost.toFixed(2)}</span>
              </div>

              <div className={styles.savingsBox}>
                <div className={styles.savingsTitle}>💡 Professional Flooring Installer Benchmark</div>
                Contractor labor quote for this room: <strong>${result.proEstimatedCostLow} – ${result.proEstimatedCostHigh}</strong>. Doing it yourself saves approximately <strong>${Math.max(0, result.proEstimatedCostLow - result.totalDiyCost)} – ${Math.max(0, result.proEstimatedCostHigh - result.totalDiyCost)}</strong>!
              </div>
            </div>
          )}

          {/* Action Row */}
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

