'use client';

import React, { useState, useId } from 'react';
import styles from './TileCalculator.module.css';
import {
  TILE_PRESETS,
  calculateTiles,
} from '@/lib/tile-engine';

export function TileCalculator() {
  const lengthInputId = useId();
  const widthInputId = useId();
  const directAreaInputId = useId();
  const presetSelectId = useId();
  const customLengthId = useId();
  const customWidthId = useId();
  const boxCountId = useId();
  const priceBoxId = useId();
  const priceSqFtId = useId();

  // Mode: 'room' | 'direct'
  const [mode, setMode] = useState<'room' | 'direct'>('room');

  // Room inputs
  const [roomLength, setRoomLength] = useState<number>(12);
  const [roomWidth, setRoomWidth] = useState<number>(10);
  const [directArea, setDirectArea] = useState<number>(120);

  // Preset & custom dimensions
  const [tilePresetId, setTilePresetId] = useState<string>('tile12x12');
  const [customLength, setCustomLength] = useState<number>(12);
  const [customWidth, setCustomWidth] = useState<number>(12);

  // Pattern / Waste
  const [wastePercent, setWastePercent] = useState<number>(10);

  // Packaging & Cost
  const [tilesPerBox, setTilesPerBox] = useState<number>(10);
  const [pricePerBox, setPricePerBox] = useState<string>('35');
  const [pricePerSqFt, setPricePerSqFt] = useState<string>('');
  const [includeMaterials, setIncludeMaterials] = useState<boolean>(true);

  // Copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Update box count automatically when preset changes
  const handlePresetChange = (newPresetId: string) => {
    setTilePresetId(newPresetId);
    if (newPresetId !== 'custom' && TILE_PRESETS[newPresetId]) {
      setTilesPerBox(TILE_PRESETS[newPresetId].defaultTilesPerBox);
    }
  };

  // Perform Calculation
  const result = calculateTiles({
    mode,
    roomLengthFeet: roomLength,
    roomWidthFeet: roomWidth,
    directAreaSqFt: directArea,
    tilePresetId,
    customLengthInches: customLength,
    customWidthInches: customWidth,
    wastePercentage: wastePercent,
    tilesPerBox,
    pricePerBox: parseFloat(pricePerBox) || 0,
    pricePerSqFt: parseFloat(pricePerSqFt) || 0,
    includeInstallationMaterials: includeMaterials,
  });

  const handleReset = () => {
    setMode('room');
    setRoomLength(12);
    setRoomWidth(10);
    setDirectArea(120);
    setTilePresetId('tile12x12');
    setCustomLength(12);
    setCustomWidth(12);
    setWastePercent(10);
    setTilesPerBox(10);
    setPricePerBox('35');
    setPricePerSqFt('');
    setIncludeMaterials(true);
  };

  const handleCopySummary = () => {
    const summary = `--- Tile Calculation Summary (kkctools.com) ---
Mode: ${mode === 'room' ? `Room (${roomLength}ft L x ${roomWidth}ft W)` : `Direct Area (${directArea} sq ft)`}
Net Area: ${result.netAreaSqFt} sq ft
Gross Area (+${wastePercent}% waste): ${result.grossAreaSqFt} sq ft
Tile Type: ${tilePresetId === 'custom' ? `Custom (${customLength}" x ${customWidth}")` : TILE_PRESETS[tilePresetId]?.name}
Coverage per Tile: ${result.singleTileAreaSqFt} sq ft (${result.tilesPerSqFt} tiles/sq ft)
Packaging: ${tilesPerBox} tiles per box

Results:
• Total Tiles Needed: ${result.totalTilesNeeded} tiles (Base: ${result.baseTilesNeeded} + Waste: ${result.wasteTiles})
• Retail Boxes to Buy: ${result.boxesNeeded} boxes (Provides ${result.totalTilesInBoxes} tiles, ${result.surplusTiles} surplus)
• Thin-Set Mortar (50 lb bags): ~${result.thinsetBags50lb} bags
• Grout (25 lb bags): ~${result.groutBags25lb} bags
${result.totalDiyCost > 0 ? `• Estimated DIY Materials Cost: $${result.totalDiyCost.toFixed(2)} (Tiles: $${result.tileMaterialCost.toFixed(2)}${includeMaterials ? `, Mortar/Grout: $${result.mortarGroutCost.toFixed(2)}` : ''})\n• Pro Contractor Cost Range: $${result.proEstimatedCostLow} – $${result.proEstimatedCostHigh}` : ''}`;

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
          Room Dimensions (L × W)
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
                {mode === 'room' ? 'Surface Dimensions' : 'Total Square Footage'}
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
                    placeholder="12"
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
                    placeholder="10"
                  />
                </div>
              </div>
            ) : (
              <div className={styles.inputGroup}>
                <label htmlFor={directAreaInputId} className={styles.inputLabel}>
                  Total Surface Area to Tile <span>(sq ft)</span>
                </label>
                <input
                  id={directAreaInputId}
                  type="number"
                  min="0"
                  step="1"
                  value={directArea || ''}
                  onChange={(e) => setDirectArea(parseFloat(e.target.value) || 0)}
                  className={styles.textInput}
                  placeholder="120"
                />
              </div>
            )}
          </div>

          {/* Card 2: Tile Size Selection */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <span className={styles.sectionTitle}>Tile Size &amp; Dimensions</span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={presetSelectId} className={styles.inputLabel}>
                Popular Tile Formats
              </label>
              <select
                id={presetSelectId}
                value={tilePresetId}
                onChange={(e) => handlePresetChange(e.target.value)}
                className={styles.selectInput}
              >
                {Object.values(TILE_PRESETS).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.description}
                  </option>
                ))}
                <option value="custom">Custom Dimensions (Enter Size)...</option>
              </select>
            </div>

            {tilePresetId === 'custom' && (
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor={customLengthId} className={styles.inputLabel}>
                    Tile Length <span>(inches)</span>
                  </label>
                  <input
                    id={customLengthId}
                    type="number"
                    step="0.25"
                    min="1"
                    value={customLength}
                    onChange={(e) => setCustomLength(parseFloat(e.target.value) || 12)}
                    className={styles.textInput}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor={customWidthId} className={styles.inputLabel}>
                    Tile Width <span>(inches)</span>
                  </label>
                  <input
                    id={customWidthId}
                    type="number"
                    step="0.25"
                    min="1"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(parseFloat(e.target.value) || 12)}
                    className={styles.textInput}
                  />
                </div>
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
                Layout Pattern <span>(Affects off-cut scrap &amp; breakage)</span>
              </label>
              <div className={styles.pillGroup}>
                {[
                  { label: 'Straight Grid (10%)', val: 10 },
                  { label: 'Offset / Running Bond (12%)', val: 12 },
                  { label: 'Diagonal 45° (15%)', val: 15 },
                  { label: 'Herringbone / Chevron (15%)', val: 15 },
                  { label: 'Heavy Cut / Complex (20%)', val: 20 },
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

          {/* Card 4: Packaging & Cost Estimator */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <span className={styles.sectionTitle}>Packaging &amp; Pricing (Optional)</span>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor={boxCountId} className={styles.inputLabel}>
                  Tiles Per Box <span>(Packaging)</span>
                </label>
                <input
                  id={boxCountId}
                  type="number"
                  min="1"
                  value={tilesPerBox}
                  onChange={(e) => setTilesPerBox(parseInt(e.target.value, 10) || 1)}
                  className={styles.textInput}
                />
              </div>

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
                  onChange={(e) => {
                    setPricePerBox(e.target.value);
                    if (e.target.value) setPricePerSqFt('');
                  }}
                  className={styles.textInput}
                  placeholder="35"
                />
              </div>
            </div>

            {/* Toggle Thin-set & Grout Material Estimate */}
            <label className={styles.toggleRow}>
              <input
                type="checkbox"
                checked={includeMaterials}
                onChange={(e) => setIncludeMaterials(e.target.checked)}
                className={styles.toggleCheckbox}
              />
              <div className={styles.toggleText}>
                <span className={styles.toggleTitle}>Include Thin-Set Mortar &amp; Grout in Cost</span>
                <span className={styles.toggleSub}>
                  Estimates standard 50 lb thin-set ($28/bag) and 25 lb grout ($20/bag)
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Output Results */}
        <div className={styles.resultsColumn}>
          {/* Hero Result Banner */}
          <div className={styles.heroResultCard}>
            <div className={styles.heroLabel}>Total Tiles to Order</div>
            <div className={styles.heroBigNumber}>
              {result.totalTilesNeeded.toLocaleString()}
              <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#E0F2FE' }}>tiles</span>
            </div>
            <div className={styles.heroSubtext}>
              Base Count: {result.baseTilesNeeded} Tiles | +{wastePercent}% Pattern Waste: +{result.wasteTiles} Tiles
            </div>
          </div>

          {/* Secondary Specifications Card */}
          <div className={styles.secondaryResultsCard}>
            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Retail Boxes to Purchase</span>
              <span className={styles.outputValue} style={{ color: '#0284C7', fontSize: '1rem' }}>
                {result.boxesNeeded} Boxes{' '}
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>
                  ({result.totalTilesInBoxes} total tiles)
                </span>
              </span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Extra / Surplus Tiles for Repairs</span>
              <span className={styles.outputValue}>
                +{result.surplusTiles} tiles{' '}
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>
                  (from box rounding)
                </span>
              </span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Net Surface Area to Tile</span>
              <span className={styles.outputValue}>{result.netAreaSqFt} sq ft</span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Gross Area to Buy (+Waste)</span>
              <span className={styles.outputValue}>{result.grossAreaSqFt} sq ft</span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Tile Face Dimensions</span>
              <span className={styles.outputValue}>
                {result.singleTileAreaSqFt} sq ft / tile ({result.tilesPerSqFt} tiles/sq ft)
              </span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Thin-Set Mortar (50 lb bags)</span>
              <span className={styles.outputValue}>~{result.thinsetBags50lb} bag{result.thinsetBags50lb > 1 ? 's' : ''}</span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Grout (25 lb bags)</span>
              <span className={styles.outputValue}>~{result.groutBags25lb} bag{result.groutBags25lb > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Pricing & Cost Estimate Card */}
          {result.totalDiyCost > 0 && (
            <div className={styles.costSection}>
              <div className={styles.outputRow}>
                <span className={styles.outputLabel}>
                  Tiles ({result.boxesNeeded} boxes @ ${pricePerBox}):
                </span>
                <span className={styles.outputValue}>${result.tileMaterialCost.toFixed(2)}</span>
              </div>

              {includeMaterials && result.mortarGroutCost > 0 && (
                <div className={styles.outputRow}>
                  <span className={styles.outputLabel}>Thin-Set Mortar &amp; Grout:</span>
                  <span className={styles.outputValue}>${result.mortarGroutCost.toFixed(2)}</span>
                </div>
              )}

              <div className={styles.costTotalRow}>
                <span>Total Estimated DIY Cost:</span>
                <span>${result.totalDiyCost.toFixed(2)}</span>
              </div>

              <div className={styles.savingsBox}>
                <div className={styles.savingsTitle}>💡 Professional Tile Installer Benchmark</div>
                Contractor labor quote for this area: <strong>${result.proEstimatedCostLow} – ${result.proEstimatedCostHigh}</strong>. Doing it yourself saves roughly <strong>${Math.max(0, result.proEstimatedCostLow - result.totalDiyCost)} – ${Math.max(0, result.proEstimatedCostHigh - result.totalDiyCost)}</strong>!
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

