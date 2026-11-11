'use client';

import React, { useState, useId } from 'react';
import styles from './StoneCalculator.module.css';
import {
  STONE_PRESETS,
  USE_CASE_CHIPS,
  WASTE_PILLS,
  BAG_SIZE_OPTIONS,
  BagSizeBasis,
  LAST_VERIFIED,
} from '@/lib/stone-constants';
import {
  calculateStone,
  StoneAreaRow,
  AreaShape,
  PricingUnit,
  DensityInputUnit,
  OrderRoundingStep,
} from '@/lib/stone-engine';

export function StoneCalculator() {
  const presetSelectId = useId();
  const customDensityId = useId();
  const bagSelectId = useId();
  const roundingStepId = useId();
  const unitPriceId = useId();
  const deliveryFeeId = useId();
  const salesTaxId = useId();
  const bagPriceId = useId();

  // Multi-Area rows (default: 20x10 ft x 3 in)
  const [areas, setAreas] = useState<StoneAreaRow[]>([
    {
      id: '1',
      label: 'Main Area',
      shape: 'rectangle',
      lengthFt: 20,
      widthFt: 10,
      depthInches: 3,
    },
  ]);

  // Material & Density
  const [presetId, setPresetId] = useState<string>('crushedStone57');
  const [customDensityUnit, setCustomDensityUnit] = useState<DensityInputUnit>('tonsPerYd3');
  const [customDensityVal, setCustomDensityVal] = useState<number>(1.40);

  // Waste & Packaging
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [bagBasis, setBagBasis] = useState<BagSizeBasis>('50lb');
  const [orderRoundingStep, setOrderRoundingStep] = useState<OrderRoundingStep>(0.5);

  // Pricing (optional, collapsed)
  const [showPricing, setShowPricing] = useState<boolean>(false);
  const [pricingBasis, setPricingBasis] = useState<PricingUnit>('ton');
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [deliveryFee, setDeliveryFee] = useState<number | ''>('');
  const [salesTaxPercent, setSalesTaxPercent] = useState<number | ''>('');
  const [pricePerBag, setPricePerBag] = useState<number | ''>('');

  // Copy status
  const [copied, setCopied] = useState<boolean>(false);

  // Preset handler
  const handlePresetChange = (newPresetId: string) => {
    setPresetId(newPresetId);
  };

  // Use case chip handler
  const handleApplyUseCase = (presetKey: string, depthIn: number, wastePct: number) => {
    setPresetId(presetKey);
    setWastePercent(wastePct);
    setAreas(
      areas.map((a) => ({
        ...a,
        depthInches: depthIn,
      }))
    );
  };

  // Add / Update / Remove areas
  const handleAddArea = () => {
    if (areas.length >= 10) return;
    const newId = String(Date.now() + Math.random());
    setAreas([
      ...areas,
      {
        id: newId,
        label: `Section ${areas.length + 1}`,
        shape: 'rectangle',
        lengthFt: 10,
        widthFt: 10,
        depthInches: 3,
      },
    ]);
  };

  const handleUpdateArea = (id: string, field: keyof StoneAreaRow, val: string | number) => {
    setAreas(
      areas.map((a) => {
        if (a.id === id) {
          return { ...a, [field]: val };
        }
        return a;
      })
    );
  };

  const handleRemoveArea = (id: string) => {
    if (areas.length <= 1) return;
    setAreas(areas.filter((a) => a.id !== id));
  };

  // Load example
  const handleLoadExample = () => {
    setAreas([
      {
        id: '1',
        label: 'Patio Base',
        shape: 'rectangle',
        lengthFt: 20,
        widthFt: 10,
        depthInches: 3,
      },
    ]);
    setPresetId('crushedStone57');
    setWastePercent(10);
    setBagBasis('50lb');
    setOrderRoundingStep(0.5);
    setShowPricing(true);
    setPricingBasis('ton');
    setUnitPrice(60);
    setDeliveryFee(65);
    setSalesTaxPercent('');
    setPricePerBag('');
  };

  // Run calculation
  const result = calculateStone({
    areas,
    presetId,
    customDensityUnit,
    customDensityValue: customDensityVal,
    wastePercent,
    bagBasis,
    orderRoundingStep,
    pricing:
      typeof unitPrice === 'number' && unitPrice > 0
        ? {
            basis: pricingBasis,
            price: unitPrice,
            deliveryFee: typeof deliveryFee === 'number' ? deliveryFee : 0,
            salesTaxPercent: typeof salesTaxPercent === 'number' ? salesTaxPercent : 0,
            pricePerBag: typeof pricePerBag === 'number' ? pricePerBag : undefined,
          }
        : undefined,
  });

  const handleReset = () => {
    setAreas([
      {
        id: '1',
        label: 'Main Area',
        shape: 'rectangle',
        lengthFt: 20,
        widthFt: 10,
        depthInches: 3,
      },
    ]);
    setPresetId('crushedStone57');
    setWastePercent(10);
    setBagBasis('50lb');
    setOrderRoundingStep(0.5);
    setShowPricing(false);
    setPricingBasis('ton');
    setUnitPrice('');
    setDeliveryFee('');
    setSalesTaxPercent('');
    setPricePerBag('');
  };

  const handleCopySummary = () => {
    const p = STONE_PRESETS[presetId] || STONE_PRESETS.crushedStone57;
    const lines: string[] = [
      '=== Stone & Aggregate Calculation Summary (kkctools.com) ===',
      `Material: ${presetId === 'custom' ? 'Custom Aggregate' : p.name}`,
      `Density Rating: ${result.densityTonsPerYd3} tons/yd³ (~${result.densityLbPerCuFt} lbs/cu ft)`,
      `Waste Allowance: ${wastePercent}%`,
      '',
      'Measured Sections:',
    ];

    for (const a of areas) {
      if (a.shape === 'circle') {
        lines.push(`  • [Circle] ${a.label || 'Zone'}: Dia ${a.diameterFt} ft × ${a.depthInches}" depth`);
      } else if (a.shape === 'direct') {
        lines.push(`  • [Direct Area] ${a.label || 'Zone'}: ${a.areaSqFt} sq ft × ${a.depthInches}" depth`);
      } else {
        lines.push(`  • [Rectangle] ${a.label || 'Zone'}: ${a.lengthFt} ft × ${a.widthFt} ft × ${a.depthInches}" depth`);
      }
    }

    lines.push('');
    lines.push('--- QUANTITY REQUIREMENTS ---');
    lines.push(`Net Area: ${result.netAreaSqFt} sq ft | Net Volume: ${result.netVolumeCuFt} cu ft`);
    lines.push(`Gross Volume (+${wastePercent}% waste): ${result.grossVolumeCuFt} cu ft (${result.volumeCuYards} cubic yards)`);
    lines.push(`Total Weight: ${result.totalWeightTons} US short tons (${result.totalWeightPounds.toLocaleString()} lbs)`);
    lines.push(`Suggested Order Quantity: ${result.suggestedTons} tons (${result.suggestedYards} yd³)`);
    lines.push(`Equivalent in ${bagBasis} Bags: ${result.bagsCount} bags`);

    if (result.materialCost > 0) {
      lines.push('');
      lines.push('--- ESTIMATED COST ---');
      lines.push(`Material Cost (${pricingBasis === 'ton' ? `${result.suggestedTons} tons` : `${result.suggestedYards} yd³`}): $${result.materialCost.toFixed(2)}`);
      if (result.deliveryFee > 0) lines.push(`Delivery Fee: $${result.deliveryFee.toFixed(2)}`);
      if (result.salesTaxAmount > 0) lines.push(`Sales Tax: $${result.salesTaxAmount.toFixed(2)}`);
      lines.push(`Total Delivered Cost: $${result.totalDeliveredCost.toFixed(2)}`);
      if (result.bulkWiseSavings > 0) {
        lines.push(`Estimated Bulk vs Bag Savings: ~$${result.bulkWiseSavings.toFixed(2)}`);
      }
    }

    lines.push('');
    lines.push('* Estimates only. Quarries bill by scale weight. Moisture increases weight. Last verified: November 2026.');

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className={styles.calculatorContainer} id="stone-calc-app">
      <div className={styles.layoutGrid}>
        {/* Left Column: Interactive Inputs */}
        <div className={styles.inputsPanel}>
          {/* Use Case Chips */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Quick Use-Case Presets</h2>
              <p className={styles.cardSubText}>
                Select a common application to auto-fill recommended material and depth.
              </p>
            </div>
            <div className={styles.pillsList}>
              {USE_CASE_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className={styles.pillBtn}
                  onClick={() => handleApplyUseCase(chip.presetId, chip.depthInches, chip.wastePercent)}
                >
                  {chip.name}
                </button>
              ))}
            </div>
          </div>

          {/* Card 1: Multi-Area Sections */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>1. Project Areas &amp; Depths</h2>
              <p className={styles.cardSubText}>
                Add up to 10 rectangular, circular, or pre-measured zones with custom depths.
              </p>
            </div>

            <button
              type="button"
              className={styles.btnExample}
              onClick={handleLoadExample}
            >
              ⚡ Load Example (20 × 10 ft × 3 in)
            </button>

            <div className={styles.areasList}>
              {areas.map((area) => (
                <div key={area.id} className={styles.areaRow}>
                  <div className={styles.areaRowHeader}>
                    <select
                      className={styles.shapeSelect}
                      value={area.shape}
                      onChange={(e) => handleUpdateArea(area.id, 'shape', e.target.value as AreaShape)}
                    >
                      <option value="rectangle">Rectangle (L × W)</option>
                      <option value="circle">Circular Bed (Diameter)</option>
                      <option value="direct">Direct Sq Ft</option>
                    </select>
                    {areas.length > 1 && (
                      <button
                        type="button"
                        className={styles.areaDeleteBtn}
                        onClick={() => handleRemoveArea(area.id)}
                        aria-label="Remove section"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className={styles.areaInputsGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Section Label</label>
                      <input
                        type="text"
                        value={area.label || ''}
                        onChange={(e) => handleUpdateArea(area.id, 'label', e.target.value)}
                        className={styles.inputField}
                        placeholder="e.g. Front Bed"
                      />
                    </div>

                    {area.shape === 'circle' ? (
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Diameter (ft)</label>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.5"
                          value={area.diameterFt || ''}
                          onChange={(e) =>
                            handleUpdateArea(area.id, 'diameterFt', Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className={styles.inputField}
                          placeholder="e.g. 10"
                        />
                      </div>
                    ) : area.shape === 'direct' ? (
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Surface Area (sq ft)</label>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="1"
                          value={area.areaSqFt || ''}
                          onChange={(e) =>
                            handleUpdateArea(area.id, 'areaSqFt', Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className={styles.inputField}
                          placeholder="e.g. 200"
                        />
                      </div>
                    ) : (
                      <>
                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>Length (ft)</label>
                          <input
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.5"
                            value={area.lengthFt || ''}
                            onChange={(e) =>
                              handleUpdateArea(area.id, 'lengthFt', Math.max(0, parseFloat(e.target.value) || 0))
                            }
                            className={styles.inputField}
                            placeholder="e.g. 20"
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>Width (ft)</label>
                          <input
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.5"
                            value={area.widthFt || ''}
                            onChange={(e) =>
                              handleUpdateArea(area.id, 'widthFt', Math.max(0, parseFloat(e.target.value) || 0))
                            }
                            className={styles.inputField}
                            placeholder="e.g. 10"
                          />
                        </div>
                      </>
                    )}

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Depth (inches)</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max="48"
                        step="0.25"
                        value={area.depthInches || ''}
                        onChange={(e) =>
                          handleUpdateArea(area.id, 'depthInches', Math.max(0, parseFloat(e.target.value) || 0))
                        }
                        className={styles.inputField}
                        placeholder="e.g. 3"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {areas.length < 10 && (
                <button
                  type="button"
                  className={styles.btnAddArea}
                  onClick={handleAddArea}
                >
                  + Add Another Area / Zone
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Material & Density */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>2. Material &amp; Bulk Density</h2>
              <p className={styles.cardSubText}>
                Density varies by moisture and quarry source. Suppliers bill by scale weight.
              </p>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={presetSelectId} className={styles.inputLabel}>
                Stone / Rock Material
              </label>
              <select
                id={presetSelectId}
                value={presetId}
                onChange={(e) => handlePresetChange(e.target.value)}
                className={styles.selectField}
              >
                {Object.values(STONE_PRESETS).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.typicalRange}
                  </option>
                ))}
              </select>
            </div>

            {presetId === 'custom' && (
              <div className={styles.areaInputsGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Density Unit</label>
                  <select
                    value={customDensityUnit}
                    onChange={(e) => setCustomDensityUnit(e.target.value as DensityInputUnit)}
                    className={styles.selectField}
                  >
                    <option value="tonsPerYd3">Tons per Cubic Yard (t/yd³)</option>
                    <option value="lbPerCuFt">Pounds per Cubic Foot (lbs/cu ft)</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor={customDensityId} className={styles.inputLabel}>
                    Custom Value
                  </label>
                  <input
                    id={customDensityId}
                    type="number"
                    inputMode="decimal"
                    step="0.05"
                    value={customDensityVal}
                    onChange={(e) => setCustomDensityVal(parseFloat(e.target.value) || 1.40)}
                    className={styles.inputField}
                  />
                </div>
              </div>
            )}

            <div className={styles.densityBadge}>
              <strong>Active Density:</strong> {result.densityTonsPerYd3} tons/cu yd (~{result.densityLbPerCuFt} lbs/cu ft)
            </div>
          </div>

          {/* Card 3: Waste & Packaging */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>3. Waste Allowance &amp; Packaging Basis</h2>
              <p className={styles.cardSubText}>
                Allow for sub-base compaction, ground settling, and border edging.
              </p>
            </div>

            <div className={styles.pillsList}>
              {WASTE_PILLS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`${styles.pillBtn} ${wastePercent === p.wastePercent ? styles.pillBtnActive : ''}`}
                  onClick={() => setWastePercent(p.wastePercent)}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className={styles.areaInputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor={bagSelectId} className={styles.inputLabel}>
                  Bag Size Selector
                </label>
                <select
                  id={bagSelectId}
                  value={bagBasis}
                  onChange={(e) => setBagBasis(e.target.value as BagSizeBasis)}
                  className={styles.selectField}
                >
                  {BAG_SIZE_OPTIONS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={roundingStepId} className={styles.inputLabel}>
                  Order Rounding Step
                </label>
                <select
                  id={roundingStepId}
                  value={orderRoundingStep}
                  onChange={(e) => setOrderRoundingStep(parseFloat(e.target.value) as OrderRoundingStep)}
                  className={styles.selectField}
                >
                  <option value={0.25}>Quarter Ton (0.25 t / yd³)</option>
                  <option value={0.5}>Half Ton (0.50 t / yd³) — Standard</option>
                  <option value={1.0}>Full Ton (1.00 t / yd³)</option>
                </select>
              </div>
            </div>

            {result.hintMessages.map((hint, idx) => (
              <div key={idx} className={styles.hintBanner}>
                {hint}
              </div>
            ))}
          </div>

          {/* Card 4: Cost & Delivery (Collapsible) */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <button
                type="button"
                className={styles.collapsibleToggle}
                onClick={() => setShowPricing(!showPricing)}
              >
                <span>{showPricing ? '▼' : '▶'} 4. Cost &amp; Delivery Calculator (Optional)</span>
              </button>
              <p className={styles.cardSubText}>
                Estimate bulk delivery invoices and compare against pre-bagged rock.
              </p>
            </div>

            {showPricing && (
              <>
                <div className={styles.pillsList}>
                  <button
                    type="button"
                    className={`${styles.pillBtn} ${pricingBasis === 'ton' ? styles.pillBtnActive : ''}`}
                    onClick={() => setPricingBasis('ton')}
                  >
                    Price per Ton ($)
                  </button>
                  <button
                    type="button"
                    className={`${styles.pillBtn} ${pricingBasis === 'cubicYard' ? styles.pillBtnActive : ''}`}
                    onClick={() => setPricingBasis('cubicYard')}
                  >
                    Price per Cubic Yard ($)
                  </button>
                </div>

                <div className={styles.areaInputsGrid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor={unitPriceId} className={styles.inputLabel}>
                      Unit Price ($/{pricingBasis === 'ton' ? 'ton' : 'yd³'})
                    </label>
                    <input
                      id={unitPriceId}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="5"
                      value={unitPrice}
                      onChange={(e) =>
                        setUnitPrice(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className={styles.inputField}
                      placeholder="e.g. 60"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor={deliveryFeeId} className={styles.inputLabel}>
                      Flat Delivery Fee ($)
                    </label>
                    <input
                      id={deliveryFeeId}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="10"
                      value={deliveryFee}
                      onChange={(e) =>
                        setDeliveryFee(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className={styles.inputField}
                      placeholder="e.g. 65"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor={salesTaxId} className={styles.inputLabel}>
                      Sales Tax (%)
                    </label>
                    <input
                      id={salesTaxId}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="15"
                      step="0.25"
                      value={salesTaxPercent}
                      onChange={(e) =>
                        setSalesTaxPercent(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className={styles.inputField}
                      placeholder="e.g. 7"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor={bagPriceId} className={styles.inputLabel}>
                      Retail Price / Bag ($)
                    </label>
                    <input
                      id={bagPriceId}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.5"
                      value={pricePerBag}
                      onChange={(e) =>
                        setPricePerBag(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className={styles.inputField}
                      placeholder="e.g. 5.00"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Results Panel */}
        <div className={styles.resultsPanel} aria-live="polite">
          {/* Hero Banner */}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>Total Weight to Order</div>
            <div className={styles.heroValue}>{result.totalWeightTons} Tons</div>
            <div className={styles.heroSub}>
              {result.volumeCuYards} Cubic Yards · {result.grossVolumeCuFt} Cu Ft (+{wastePercent}% waste)
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>
              Suggested order: <strong>{result.suggestedTons} Tons</strong> / <strong>{result.suggestedYards} yd³</strong>
            </div>
          </div>

          {/* Breakdown Specifications Card */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Volume &amp; Weight Specifications</h3>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Net Surface Area</span>
              <span className={styles.breakdownVal}>{result.netAreaSqFt} sq ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Net Volume</span>
              <span className={styles.breakdownVal}>{result.netVolumeCuFt} cu ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Gross Volume with Waste</span>
              <span className={styles.breakdownVal}>{result.grossVolumeCuFt} cu ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Cubic Yards</span>
              <span className={styles.breakdownVal}>{result.volumeCuYards} yd³</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Total Weight (Pounds)</span>
              <span className={styles.breakdownVal}>{result.totalWeightPounds.toLocaleString()} lbs</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Metric Tonnes</span>
              <span className={styles.breakdownVal}>{result.totalMetricTonnes} t ({result.totalKilograms.toLocaleString()} kg)</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Equivalent in {bagBasis} Bags</span>
              <span className={styles.breakdownVal}>{result.bagsCount} bags</span>
            </div>
          </div>

          {/* Cost Card (if pricing entered) */}
          {result.materialCost > 0 && (
            <div className={styles.costCard}>
              <div className={styles.costHeader}>
                <span className={styles.costTotalLabel}>Estimated Delivered Cost</span>
                <span className={styles.costTotalVal}>${result.totalDeliveredCost.toFixed(2)}</span>
              </div>

              <div className={styles.breakdownRow}>
                <span className={styles.breakdownKey}>
                  Material ({pricingBasis === 'ton' ? `${result.suggestedTons} tons` : `${result.suggestedYards} yd³`})
                </span>
                <span className={styles.breakdownVal}>${result.materialCost.toFixed(2)}</span>
              </div>

              {result.deliveryFee > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownKey}>Delivery Charge</span>
                  <span className={styles.breakdownVal}>${result.deliveryFee.toFixed(2)}</span>
                </div>
              )}

              {result.salesTaxAmount > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownKey}>Sales Tax</span>
                  <span className={styles.breakdownVal}>${result.salesTaxAmount.toFixed(2)}</span>
                </div>
              )}

              {result.bagPurchaseCost > 0 && (
                <div className={styles.savingsBox}>
                  <span className={styles.savingsTitle}>Bulk vs Bagged Comparison</span>
                  <div className={styles.savingsRange}>
                    Save ~${result.bulkWiseSavings.toFixed(2)} buying bulk
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {result.bagsCount} bags @ ${pricePerBag} = ${result.bagPurchaseCost.toFixed(2)} vs ${result.totalDeliveredCost.toFixed(2)} bulk delivered.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actionsCard}>
            <button
              type="button"
              className={styles.btnActionCopy}
              onClick={handleCopySummary}
            >
              {copied ? '✓ Copied Summary!' : 'Copy Calculation Summary'}
            </button>
            <button
              type="button"
              className={styles.btnActionPrint}
              onClick={handlePrint}
            >
              🖨 Print / Save
            </button>
            <button
              type="button"
              className={styles.btnActionReset}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div className={styles.stickyMobileBar}>
        <div>
          <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block' }}>TOTAL WEIGHT</span>
          <span className={styles.stickyValue}>{result.totalWeightTons} Tons</span>
        </div>
        <button
          type="button"
          onClick={handleCopySummary}
          style={{
            background: '#0284c7',
            color: '#fff',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '0.8rem',
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

export default StoneCalculator;
