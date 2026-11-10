'use client';

import React, { useState, useId } from 'react';
import {
  BlockPresetKey,
  BLOCK_PRESETS,
  CoreFillFrequency,
  OpeningItem,
  calculateCinderBlocks,
} from '@/lib/cinder-block-engine';
import styles from './CinderBlockCalculator.module.css';

type ActiveTab = 'dimensions' | 'openings' | 'corefill';

export default function CinderBlockCalculator() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dimensions');

  // Wall Dimensions
  const [wallLength, setWallLength] = useState<string>('30');
  const [wallHeight, setWallHeight] = useState<string>('8');
  const [presetKey, setPresetKey] = useState<BlockPresetKey>('standard_8');
  const [wastePercent, setWastePercent] = useState<number>(10);

  // Custom block inputs
  const [customLength, setCustomLength] = useState<string>('16');
  const [customHeight, setCustomHeight] = useState<string>('8');
  const [customDepth] = useState<string>('8');

  // Openings
  const [openings, setOpenings] = useState<OpeningItem[]>([
    { id: '1', name: 'Standard Door (3x7)', widthFeet: 3, heightFeet: 7, count: 1 },
  ]);

  // Core Fill
  const [coreFill, setCoreFill] = useState<CoreFillFrequency>('none');

  // Pricing
  const [costPerBlock, setCostPerBlock] = useState<string>('2.25');
  const [costPerMortar, setCostPerMortar] = useState<string>('12.50');

  const [copied, setCopied] = useState<boolean>(false);
  const idPrefix = useId();

  const handleAddOpening = () => {
    const newId = String(Date.now());
    setOpenings([
      ...openings,
      {
        id: newId,
        name: `Window ${openings.length + 1}`,
        widthFeet: 4,
        heightFeet: 3,
        count: 1,
      },
    ]);
  };

  const handleRemoveOpening = (id: string) => {
    setOpenings(openings.filter((o) => o.id !== id));
  };

  const handleUpdateOpening = (id: string, updates: Partial<OpeningItem>) => {
    setOpenings(openings.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const handleReset = () => {
    setWallLength('30');
    setWallHeight('8');
    setPresetKey('standard_8');
    setWastePercent(10);
    setOpenings([{ id: '1', name: 'Standard Door (3x7)', widthFeet: 3, heightFeet: 7, count: 1 }]);
    setCoreFill('none');
    setCostPerBlock('2.25');
    setCostPerMortar('12.50');
    setCopied(false);
  };

  const result = calculateCinderBlocks({
    wallLengthFeet: parseFloat(wallLength) || 0,
    wallHeightFeet: parseFloat(wallHeight) || 0,
    presetKey,
    customNominalLengthInches: parseFloat(customLength) || 16,
    customNominalHeightInches: parseFloat(customHeight) || 8,
    customNominalDepthInches: parseFloat(customDepth) || 8,
    openings,
    wastePercent,
    coreFillFrequency: coreFill,
    costPerBlock: parseFloat(costPerBlock) || 0,
    costPerMortarBag: parseFloat(costPerMortar) || 0,
  });

  const handleCopy = () => {
    const summary = `Cinder Block (CMU) Wall Takeoff Summary:
• Total Blocks to Order: ${result.totalBlocksWithWaste.toLocaleString()} blocks (Net: ${result.netBlocks.toLocaleString()} + ${wastePercent}% waste)
• Mortar Bags (80 lb): ${result.mortarBags80lb.toLocaleString()} bags
• Net Wall Area: ${result.netWallAreaSqFt.toLocaleString()} sq ft (Gross: ${result.grossWallAreaSqFt.toLocaleString()} sq ft)
• Wall Courses (Rows): ${result.coursesCount} courses (${result.blocksPerCourse} blocks per row)
• Total Dry Weight: ~${result.totalWeightLbs.toLocaleString()} lbs (${result.totalWeightTons} tons)
${result.coreFillCuYds > 0 ? `• Concrete Core Fill Volume: ${result.coreFillCuYds} cu yd (${result.coreFillConcreteBags80lb} bags)` : ''}
${result.totalEstimatedCost > 0 ? `• Total Material Budget: $${result.totalEstimatedCost.toLocaleString()}` : ''}

Calculated with KKCTools Cinder Block Calculator (https://kkctools.com/cinder-block-calculator/)`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className={styles.calculatorContainer}>
      {/* Navigation Tabs */}
      <div className={styles.tabList} role="tablist" aria-label="Cinder Block Calculator Mode">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'dimensions'}
          className={`${styles.tabButton} ${activeTab === 'dimensions' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('dimensions')}
        >
          Wall Dimensions &amp; Blocks
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'openings'}
          className={`${styles.tabButton} ${activeTab === 'openings' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('openings')}
        >
          Doors &amp; Windows Cutouts ({openings.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'corefill'}
          className={`${styles.tabButton} ${activeTab === 'corefill' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('corefill')}
        >
          Core Fill Grout Concrete
        </button>
      </div>

      <div className={styles.layoutGrid}>
        {/* Left Inputs Panel */}
        <div className={styles.inputsPanel}>
          {activeTab === 'dimensions' && (
            <div className={styles.fieldCard}>
              <div className={styles.cardTitle}>Wall Measurements</div>
              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${idPrefix}-wall-len`} className={styles.label}>
                    Wall Length (feet)
                  </label>
                  <input
                    id={`${idPrefix}-wall-len`}
                    type="number"
                    min="0"
                    step="any"
                    className={styles.inputField}
                    value={wallLength}
                    onChange={(e) => setWallLength(e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${idPrefix}-wall-ht`} className={styles.label}>
                    Wall Height (feet)
                  </label>
                  <input
                    id={`${idPrefix}-wall-ht`}
                    type="number"
                    min="0"
                    step="any"
                    className={styles.inputField}
                    value={wallHeight}
                    onChange={(e) => setWallHeight(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={`${idPrefix}-block-preset`} className={styles.label}>
                  Block Dimensions Preset
                </label>
                <select
                  id={`${idPrefix}-block-preset`}
                  className={styles.selectField}
                  value={presetKey}
                  onChange={(e) => setPresetKey(e.target.value as BlockPresetKey)}
                >
                  {Object.values(BLOCK_PRESETS).map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <span className={styles.unitNotice}>
                  Standard 8x8x16 nominal block covers 0.889 sq ft (1.125 blocks/sq ft)
                </span>
              </div>

              {presetKey === 'custom' && (
                <div className={styles.inputRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Block Length (in)</label>
                    <input
                      type="number"
                      min="1"
                      className={styles.inputField}
                      value={customLength}
                      onChange={(e) => setCustomLength(e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Block Height (in)</label>
                    <input
                      type="number"
                      min="1"
                      className={styles.inputField}
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Waste Allowance Buffer (%)</label>
                <div className={styles.chipGroup}>
                  {[0, 5, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={`${styles.chip} ${wastePercent === pct ? styles.chipSelected : ''}`}
                      onClick={() => setWastePercent(pct)}
                    >
                      {pct === 10 ? '10% (Standard)' : pct === 15 ? '15% (Stepped/Corners)' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'openings' && (
            <div className={styles.fieldCard}>
              <div className={styles.cardTitle}>Deduct Doors and Windows</div>
              <p className={styles.unitNotice} style={{ margin: 0 }}>
                Subtract openings so you do not buy extra blocks for doors or window cavities.
              </p>

              {openings.map((op) => (
                <div key={op.id} className={styles.openingItem}>
                  <div style={{ flex: 2 }}>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={op.name}
                      onChange={(e) => handleUpdateOpening(op.id, { name: e.target.value })}
                      aria-label="Opening Description"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="number"
                      placeholder="W (ft)"
                      min="0"
                      step="any"
                      className={styles.inputField}
                      value={op.widthFeet || ''}
                      onChange={(e) =>
                        handleUpdateOpening(op.id, { widthFeet: parseFloat(e.target.value) || 0 })
                      }
                      aria-label="Opening Width in feet"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="number"
                      placeholder="H (ft)"
                      min="0"
                      step="any"
                      className={styles.inputField}
                      value={op.heightFeet || ''}
                      onChange={(e) =>
                        handleUpdateOpening(op.id, { heightFeet: parseFloat(e.target.value) || 0 })
                      }
                      aria-label="Opening Height in feet"
                    />
                  </div>
                  <div style={{ flex: 0.8 }}>
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      className={styles.inputField}
                      value={op.count || ''}
                      onChange={(e) =>
                        handleUpdateOpening(op.id, { count: parseInt(e.target.value, 10) || 1 })
                      }
                      aria-label="Quantity of openings"
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveOpening(op.id)}
                    aria-label="Remove opening"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button type="button" className={styles.addButton} onClick={handleAddOpening}>
                + Add Another Opening (Door/Window)
              </button>
            </div>
          )}

          {activeTab === 'corefill' && (
            <div className={styles.fieldCard}>
              <div className={styles.cardTitle}>Core Fill Grout &amp; Rebar Grouting</div>
              <p className={styles.unitNotice} style={{ margin: 0 }}>
                Hollow cores are filled with concrete grout to reinforce retaining walls and foundations.
              </p>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Grouting Frequency</label>
                <div className={styles.chipGroup}>
                  {[
                    { key: 'none', label: 'No Fill (Hollow Wall)' },
                    { key: 'all', label: 'Solid Fill (Every Core)' },
                    { key: 'every_32', label: 'Fill Every 32" (Rebar Cells)' },
                    { key: 'every_48', label: 'Fill Every 48" (Rebar Cells)' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={`${styles.chip} ${coreFill === item.key ? styles.chipSelected : ''}`}
                      onClick={() => setCoreFill(item.key as CoreFillFrequency)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pricing Controls */}
          <div className={styles.fieldCard}>
            <div className={styles.cardTitle}>Material Costs (Optional Budgeting)</div>
            <div className={styles.inputRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor={`${idPrefix}-price-block`} className={styles.label}>
                  Cost per Block ($)
                </label>
                <input
                  id={`${idPrefix}-price-block`}
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 2.25"
                  className={styles.inputField}
                  value={costPerBlock}
                  onChange={(e) => setCostPerBlock(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor={`${idPrefix}-price-mortar`} className={styles.label}>
                  Cost per 80 lb Mortar Bag ($)
                </label>
                <input
                  id={`${idPrefix}-price-mortar`}
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 12.50"
                  className={styles.inputField}
                  value={costPerMortar}
                  onChange={(e) => setCostPerMortar(e.target.value)}
                />
              </div>
            </div>

            <button type="button" className={styles.resetButton} onClick={handleReset}>
              ↺ Reset All Fields
            </button>
          </div>
        </div>

        {/* Right Results Panel */}
        <div className={styles.resultsPanel}>
          <div className={styles.primaryResultCard}>
            <div className={styles.primaryResultLabel}>Total Cinder Blocks to Order</div>
            <div className={styles.primaryResultValue}>
              {result.totalBlocksWithWaste.toLocaleString()}{' '}
              <span style={{ fontSize: '1.25rem' }}>Blocks</span>
            </div>
            <div className={styles.primaryResultSub}>
              Net Blocks: <strong>{result.netBlocks.toLocaleString()}</strong> · +{wastePercent}% Waste Buffer
            </div>
          </div>

          <div className={styles.breakdownCard}>
            <div className={styles.breakdownTitle}>Masonry Material Takeoff</div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Net Wall Surface Area</span>
              <span className={styles.breakdownValue}>{result.netWallAreaSqFt} sq ft</span>
            </div>
            {result.openingsAreaSqFt > 0 && (
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Openings Deducted</span>
                <span className={styles.breakdownValue}>-{result.openingsAreaSqFt} sq ft</span>
              </div>
            )}
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>80 lb Mortar Bags</span>
              <span className={styles.breakdownValue}>
                {result.mortarBags80lb} Bags (~33 blocks/bag)
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>60 lb Mortar Bags (Alt)</span>
              <span className={styles.breakdownValue}>{result.mortarBags60lb} Bags</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Wall Layout</span>
              <span className={styles.breakdownValue}>
                {result.coursesCount} Courses × {result.blocksPerCourse} Blocks/row
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Total Block Weight</span>
              <span className={styles.breakdownValue}>
                ~{result.totalWeightLbs.toLocaleString()} lbs ({result.totalWeightTons} Tons)
              </span>
            </div>
          </div>

          {result.coreFillCuYds > 0 && (
            <div className={styles.breakdownCard}>
              <div className={styles.breakdownTitle}>Concrete Core Fill Volume</div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Core Concrete (Ready-Mix)</span>
                <span className={styles.breakdownValue}>{result.coreFillCuYds} Cubic Yards</span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>80 lb Concrete Mix Bags</span>
                <span className={styles.breakdownValue}>
                  {result.coreFillConcreteBags80lb} Bags (for DIY pour)
                </span>
              </div>
            </div>
          )}

          {result.totalEstimatedCost > 0 && (
            <div className={styles.breakdownCard}>
              <div className={styles.breakdownTitle}>Estimated Material Budget</div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Blocks Cost</span>
                <span className={styles.breakdownValue}>${result.estimatedBlockCost.toLocaleString()}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Mortar Cost</span>
                <span className={styles.breakdownValue}>${result.estimatedMortarCost.toLocaleString()}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Total Estimated</span>
                <span className={styles.breakdownValue} style={{ color: 'var(--color-primary, #0284c7)' }}>
                  ${result.totalEstimatedCost.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <button type="button" className={styles.copyButton} onClick={handleCopy}>
            📋 Copy Calculation Summary
          </button>
          {copied && <div className={styles.copiedMessage}>✓ Copied to clipboard!</div>}
        </div>
      </div>
    </div>
  );
}
