'use client';

import React, { useState, useId } from 'react';
import styles from './LaminateCalculator.module.css';
import {
  LAMINATE_CONSTANTS,
  WASTE_PATTERNS,
  BOX_COVERAGE_CHIPS,
  LAST_VERIFIED,
} from '@/lib/laminate-constants';
import {
  calculateLaminate,
  calculatePlankCoverage,
  LaminateAreaItem,
  PricingBasis,
} from '@/lib/laminate-engine';

export function LaminateCalculator() {
  const directAreaId = useId();
  const boxCoverageId = useId();
  const plankWidthId = useId();
  const plankLengthId = useId();
  const planksCountId = useId();
  const priceBasisId = useId();
  const unitPriceId = useId();
  const underlaymentPriceId = useId();
  const moldingPriceId = useId();
  const salesTaxId = useId();

  // Mode: 'dimensions' | 'direct'
  const [mode, setMode] = useState<'dimensions' | 'direct'>('dimensions');
  const [directArea, setDirectArea] = useState<number | ''>('');

  // Areas list (default empty for clean state)
  const [areas, setAreas] = useState<LaminateAreaItem[]>([
    { id: '1', label: 'Room 1', lengthFt: 0, widthFt: 0, mode: 'add' },
  ]);

  // Box coverage
  const [boxCoverage, setBoxCoverage] = useState<number>(LAMINATE_CONSTANTS.defaultBoxCoverageSqFt);
  const [showPlankHelper, setShowPlankHelper] = useState<boolean>(false);
  const [plankWidth, setPlankWidth] = useState<number>(7.5);
  const [plankLength, setPlankLength] = useState<number>(47.25);
  const [planksPerBox, setPlanksPerBox] = useState<number>(9);

  // Pattern & Waste
  const [patternId, setPatternId] = useState<string>('straight');
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [attachedPad, setAttachedPad] = useState<boolean>(false);

  // Pricing (optional, collapsed by default)
  const [showPricing, setShowPricing] = useState<boolean>(false);
  const [pricingBasis, setPricingBasis] = useState<PricingBasis>('perBox');
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [underlaymentPrice, setUnderlaymentPrice] = useState<number>(LAMINATE_CONSTANTS.defaultUnderlaymentPricePerRoll);
  const [moldingMode, setMoldingMode] = useState<'perimeter' | 'allowance'>('allowance');
  const [moldingAllowance, setMoldingAllowance] = useState<number>(45);
  const [salesTaxPercent, setSalesTaxPercent] = useState<number>(0);

  // Copy status
  const [copied, setCopied] = useState<boolean>(false);

  // Load example 18x14 ft button
  const handleLoadExample = () => {
    setMode('dimensions');
    setAreas([{ id: '1', label: 'Living Room', lengthFt: 18, widthFt: 14, mode: 'add' }]);
    setBoxCoverage(20);
    setPatternId('straight');
    setWastePercent(10);
    setAttachedPad(false);
    setShowPricing(true);
    setPricingBasis('perBox');
    setUnitPrice(38);
    setUnderlaymentPrice(40);
    setMoldingMode('allowance');
    setMoldingAllowance(45);
    setSalesTaxPercent(0);
  };

  // Add / Remove areas
  const handleAddArea = (type: 'add' | 'subtract') => {
    if (areas.length >= LAMINATE_CONSTANTS.maxAreas) return;
    const newId = String(Date.now() + Math.random());
    const defaultLabel =
      type === 'subtract'
        ? `Island / Built-in`
        : `Room ${areas.length + 1}`;

    setAreas([
      ...areas,
      {
        id: newId,
        label: defaultLabel,
        lengthFt: 0,
        widthFt: 0,
        mode: type,
      },
    ]);
  };

  const handleUpdateArea = (id: string, field: keyof LaminateAreaItem, val: string | number) => {
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
    if (areas.length <= 1) {
      setAreas([{ id: '1', label: 'Room 1', lengthFt: 0, widthFt: 0, mode: 'add' }]);
      return;
    }
    setAreas(areas.filter((a) => a.id !== id));
  };

  const handlePatternChange = (patId: string) => {
    setPatternId(patId);
    const p = WASTE_PATTERNS.find((x) => x.id === patId);
    if (p && patId !== 'custom') {
      setWastePercent(p.wastePercent);
    }
  };

  const handleApplyPlankHelper = () => {
    const calculated = calculatePlankCoverage(plankWidth, plankLength, planksPerBox);
    if (calculated > 0) {
      setBoxCoverage(calculated);
      setShowPlankHelper(false);
    }
  };

  // Run calculation engine
  const result = calculateLaminate({
    areas: mode === 'dimensions' ? areas : undefined,
    directSqFt: mode === 'direct' && typeof directArea === 'number' ? directArea : undefined,
    boxCoverageSqFt: boxCoverage,
    wastePercent,
    attachedPad,
    pricing:
      typeof unitPrice === 'number' && unitPrice > 0
        ? {
            basis: pricingBasis,
            price: unitPrice,
            underlaymentPerRoll: underlaymentPrice,
            molding: {
              allowance: moldingMode === 'allowance' ? moldingAllowance : undefined,
              usePerimeter: moldingMode === 'perimeter',
              perLinearFt: LAMINATE_CONSTANTS.defaultMoldingPricePerLinearFt,
            },
            salesTaxPercent,
          }
        : undefined,
  });

  const handleReset = () => {
    setMode('dimensions');
    setDirectArea('');
    setAreas([{ id: '1', label: 'Room 1', lengthFt: 0, widthFt: 0, mode: 'add' }]);
    setBoxCoverage(LAMINATE_CONSTANTS.defaultBoxCoverageSqFt);
    setShowPlankHelper(false);
    setPatternId('straight');
    setWastePercent(10);
    setAttachedPad(false);
    setShowPricing(false);
    setPricingBasis('perBox');
    setUnitPrice('');
    setUnderlaymentPrice(LAMINATE_CONSTANTS.defaultUnderlaymentPricePerRoll);
    setMoldingMode('allowance');
    setMoldingAllowance(45);
    setSalesTaxPercent(0);
  };

  const handleCopySummary = () => {
    const lines: string[] = [
      '=== Laminate Flooring Calculation Summary (kkctools.com) ===',
      `Mode: ${mode === 'dimensions' ? 'Room Dimensions Takeoff' : 'Direct Square Footage'}`,
    ];

    if (mode === 'dimensions') {
      for (const a of areas) {
        if (a.lengthFt > 0 && a.widthFt > 0) {
          lines.push(
            `  • [${a.mode === 'subtract' ? 'DEDUCT' : 'ADD'}] ${a.label || 'Area'}: ${a.lengthFt} ft × ${a.widthFt} ft = ${(a.lengthFt * a.widthFt).toFixed(1)} sq ft`
          );
        }
      }
    }

    lines.push(`Net Surface Area: ${result.netAreaSqFt} sq ft`);
    lines.push(`Gross Area (+${wastePercent}% waste): ${result.grossAreaSqFt} sq ft`);
    lines.push(`Box Packaging: ${boxCoverage} sq ft per carton`);
    lines.push(`Underlayment: ${attachedPad ? 'Pre-attached pad on planks' : `${result.underlaymentRolls} roll(s) (100 sq ft rolls)`}`);
    lines.push(`Approximate Perimeter: ${result.perimeterLinearFt} linear ft (${result.moldingPieces} molding pieces)`);
    lines.push('');
    lines.push('--- ORDER REQUIREMENTS ---');
    lines.push(`Total Cartons to Buy: ${result.boxesNeeded} boxes`);
    lines.push(`Total Square Feet Purchased: ${result.purchasedAreaSqFt} sq ft`);
    lines.push(`Surplus Allowance: ${result.surplusSqFt} sq ft (keep for future repairs)`);

    if (result.flooringCost > 0) {
      lines.push('');
      lines.push('--- COST & SAVINGS ESTIMATE ---');
      lines.push(`Flooring Material: $${result.flooringCost.toFixed(2)}`);
      if (!attachedPad && result.underlaymentCost > 0) {
        lines.push(`Underlayment: $${result.underlaymentCost.toFixed(2)}`);
      }
      if (result.moldingCost > 0) {
        lines.push(`Moldings / Transitions: $${result.moldingCost.toFixed(2)}`);
      }
      if (result.salesTaxAmount > 0) {
        lines.push(`Sales Tax: $${result.salesTaxAmount.toFixed(2)}`);
      }
      lines.push(`Total Estimated DIY Cost: $${result.totalDiyCost.toFixed(2)}`);
      lines.push(`Professional Labor Benchmark: $${result.proLaborLow} – $${result.proLaborHigh} ($2–$5/sq ft)`);
    }

    lines.push('');
    lines.push('* Estimates only. Always confirm square footage printed on your carton. Last verified: November 2026.');

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
    <div className={styles.calculatorContainer} id="laminate-calc-app">
      <div className={styles.layoutGrid}>
        {/* Left Column: Interactive Inputs */}
        <div className={styles.inputsPanel}>
          {/* Mode Switcher */}
          <div className={styles.modeSwitcherRow}>
            <button
              type="button"
              className={`${styles.modeButton} ${mode === 'dimensions' ? styles.modeButtonActive : ''}`}
              onClick={() => setMode('dimensions')}
            >
              Room by Dimensions
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${mode === 'direct' ? styles.modeButtonActive : ''}`}
              onClick={() => setMode('direct')}
            >
              Direct Square Footage
            </button>
          </div>

          {/* Card 1: Rooms & Areas */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>1. Room Dimensions &amp; Deductions</h2>
              <p className={styles.cardSubText}>
                Enter room lengths and widths, or deduct built-ins like kitchen islands and hearths.
              </p>
            </div>

            <button
              type="button"
              className={styles.btnExample}
              onClick={handleLoadExample}
            >
              ⚡ Load Example (18 × 14 ft Room)
            </button>

            {mode === 'direct' ? (
              <div className={styles.inputGroup}>
                <label htmlFor={directAreaId} className={styles.inputLabel}>
                  Total Measured Net Surface Area (sq ft)
                </label>
                <input
                  id={directAreaId}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="10000"
                  step="0.5"
                  value={directArea}
                  onChange={(e) =>
                    setDirectArea(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))
                  }
                  className={styles.inputField}
                  placeholder="e.g. 252"
                />
              </div>
            ) : (
              <div className={styles.areasList}>
                {areas.map((area) => (
                  <div key={area.id} className={styles.areaRow}>
                    <div className={styles.areaRowHeader}>
                      <span className={area.mode === 'subtract' ? styles.areaBadgeSub : styles.areaBadgeAdd}>
                        {area.mode === 'subtract' ? '− Deduct Area' : '+ Room Area'}
                      </span>
                      {areas.length > 1 && (
                        <button
                          type="button"
                          className={styles.areaDeleteBtn}
                          onClick={() => handleRemoveArea(area.id)}
                          aria-label={`Remove ${area.label || 'area'}`}
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>
                    <div className={styles.areaInputsGrid}>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Room / Section Label</label>
                        <input aria-label="Room / Section Label"
                          type="text"
                          value={area.label || ''}
                          onChange={(e) => handleUpdateArea(area.id, 'label', e.target.value)}
                          className={styles.inputField}
                          placeholder="e.g. Master Bedroom"
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Length (ft)</label>
                        <input aria-label="Length (ft)"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          max={LAMINATE_CONSTANTS.maxDimensionFt}
                          step="0.25"
                          value={area.lengthFt === 0 ? '' : area.lengthFt}
                          onChange={(e) =>
                            handleUpdateArea(area.id, 'lengthFt', Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className={styles.inputField}
                          placeholder="e.g. 18"
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Width (ft)</label>
                        <input aria-label="Width (ft)"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          max={LAMINATE_CONSTANTS.maxDimensionFt}
                          step="0.25"
                          value={area.widthFt === 0 ? '' : area.widthFt}
                          onChange={(e) =>
                            handleUpdateArea(area.id, 'widthFt', Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className={styles.inputField}
                          placeholder="e.g. 14"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {areas.length < LAMINATE_CONSTANTS.maxAreas && (
                  <div className={styles.areaActionsRow}>
                    <button
                      type="button"
                      className={styles.btnAddArea}
                      onClick={() => handleAddArea('add')}
                    >
                      + Add Another Room
                    </button>
                    <button
                      type="button"
                      className={styles.btnSubArea}
                      onClick={() => handleAddArea('subtract')}
                    >
                      − Subtract an Area (Island, Hearth, Closet)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 2: Box Coverage */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>2. Box Coverage (Sq Ft per Carton)</h2>
              <p className={styles.cardSubText}>
                Use the sq ft printed on your carton — it varies by brand and plank width (commonly ~17–27 sq ft).
              </p>
            </div>

            <div className={styles.pillsList}>
              {BOX_COVERAGE_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className={`${styles.pillBtn} ${boxCoverage === chip ? styles.pillBtnActive : ''}`}
                  onClick={() => setBoxCoverage(chip)}
                >
                  {chip} sq ft
                </button>
              ))}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={boxCoverageId} className={styles.inputLabel}>
                Carton Coverage (sq ft)
              </label>
              <input
                id={boxCoverageId}
                type="number"
                inputMode="decimal"
                min="5"
                max="50"
                step="0.05"
                value={boxCoverage}
                onChange={(e) => setBoxCoverage(Math.max(1, parseFloat(e.target.value) || 20))}
                className={styles.inputField}
              />
            </div>

            {/* Collapsible plank size helper */}
            <div>
              <button
                type="button"
                className={styles.collapsibleToggle}
                onClick={() => setShowPlankHelper(!showPlankHelper)}
              >
                <span>{showPlankHelper ? '▼' : '▶'} Calculate from individual plank dimensions</span>
              </button>

              {showPlankHelper && (
                <div className={styles.helperBox} style={{ marginTop: '0.5rem' }}>
                  <div className={styles.areaInputsGrid}>
                    <div className={styles.inputGroup}>
                      <label htmlFor={plankWidthId} className={styles.inputLabel}>Plank Width (in)</label>
                      <input
                        id={plankWidthId}
                        type="number"
                        inputMode="decimal"
                        step="0.25"
                        value={plankWidth}
                        onChange={(e) => setPlankWidth(parseFloat(e.target.value) || 0)}
                        className={styles.inputField}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor={plankLengthId} className={styles.inputLabel}>Plank Length (in)</label>
                      <input
                        id={plankLengthId}
                        type="number"
                        inputMode="decimal"
                        step="0.25"
                        value={plankLength}
                        onChange={(e) => setPlankLength(parseFloat(e.target.value) || 0)}
                        className={styles.inputField}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor={planksCountId} className={styles.inputLabel}>Planks in Box</label>
                      <input
                        id={planksCountId}
                        type="number"
                        inputMode="numeric"
                        value={planksPerBox}
                        onChange={(e) => setPlanksPerBox(parseInt(e.target.value, 10) || 0)}
                        className={styles.inputField}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.btnExample}
                    onClick={handleApplyPlankHelper}
                  >
                    Apply Carton Yield ({calculatePlankCoverage(plankWidth, plankLength, planksPerBox)} sq ft)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Layout & Waste Factor */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>3. Layout Pattern &amp; Waste Factor</h2>
              <p className={styles.cardSubText}>
                Staggered cuts along walls and obstacles generate scrap planks.
              </p>
            </div>

            <div className={styles.pillsList}>
              {WASTE_PATTERNS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`${styles.pillBtn} ${patternId === p.id ? styles.pillBtnActive : ''}`}
                  onClick={() => handlePatternChange(p.id)}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {patternId === 'custom' && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Custom Waste % (0% to 30%)</label>
                <input aria-label="Custom Waste % (0% to 30%)"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="30"
                  value={wastePercent}
                  onChange={(e) =>
                    setWastePercent(Math.min(30, Math.max(0, parseFloat(e.target.value) || 0)))
                  }
                  className={styles.inputField}
                />
              </div>
            )}

            <label className={styles.checkboxLabel} style={{ marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                checked={attachedPad}
                onChange={(e) => setAttachedPad(e.target.checked)}
              />
              <span>My planks have attached underlayment (pad)</span>
            </label>
          </div>

          {/* Card 4: Pricing & Project Budget (Optional) */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <button
                type="button"
                className={styles.collapsibleToggle}
                onClick={() => setShowPricing(!showPricing)}
                style={{ fontSize: '1rem', fontWeight: 700 }}
              >
                <span>{showPricing ? '▼' : '▶'} 4. Project Pricing &amp; Budget (Optional)</span>
              </button>
              <p className={styles.cardSubText}>
                Estimate materials total, moldings, underlayment rolls, and sales tax.
              </p>
            </div>

            {showPricing && (
              <>
                <div className={styles.modeSwitcherRow}>
                  <button
                    type="button"
                    className={`${styles.modeButton} ${pricingBasis === 'perBox' ? styles.modeButtonActive : ''}`}
                    onClick={() => setPricingBasis('perBox')}
                  >
                    Price per Box ($)
                  </button>
                  <button
                    type="button"
                    className={`${styles.modeButton} ${pricingBasis === 'perSqFt' ? styles.modeButtonActive : ''}`}
                    onClick={() => setPricingBasis('perSqFt')}
                  >
                    Price per Sq Ft ($)
                  </button>
                </div>

                <div className={styles.areaInputsGrid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor={unitPriceId} className={styles.inputLabel}>
                      {pricingBasis === 'perBox' ? 'Carton Price ($)' : 'Price per Sq Ft ($)'}
                    </label>
                    <input
                      id={unitPriceId}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.25"
                      value={unitPrice}
                      onChange={(e) =>
                        setUnitPrice(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className={styles.inputField}
                      placeholder={pricingBasis === 'perBox' ? 'e.g. 38' : 'e.g. 1.90'}
                    />
                  </div>

                  {!attachedPad && (
                    <div className={styles.inputGroup}>
                      <label htmlFor={underlaymentPriceId} className={styles.inputLabel}>
                        Underlayment ($/100 sq ft roll)
                      </label>
                      <input
                        id={underlaymentPriceId}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="5"
                        value={underlaymentPrice}
                        onChange={(e) => setUnderlaymentPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={styles.inputField}
                      />
                    </div>
                  )}

                  <div className={styles.inputGroup}>
                    <label htmlFor={moldingPriceId} className={styles.inputLabel}>
                      Molding Allowance ($)
                    </label>
                    <input
                      id={moldingPriceId}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="5"
                      value={moldingAllowance}
                      onChange={(e) => setMoldingAllowance(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={styles.inputField}
                    />
                  </div>
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
                    value={salesTaxPercent === 0 ? '' : salesTaxPercent}
                    onChange={(e) =>
                      setSalesTaxPercent(Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className={styles.inputField}
                    placeholder="e.g. 7"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Output Calculation Cards */}
        <div className={styles.resultsPanel} aria-live="polite">
          {/* Primary Hero Banner */}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>Total Boxes to Purchase</div>
            <div className={styles.heroValue}>{result.boxesNeeded}</div>
            <div className={styles.heroSub}>
              Covers {result.purchasedAreaSqFt} sq ft ({result.surplusSqFt} sq ft extra surplus)
            </div>
          </div>

          {/* Specifications Card */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Quantity &amp; Area Specifications</h3>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Net Floor Area</span>
              <span className={styles.breakdownVal}>{result.netAreaSqFt} sq ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Gross Area (+{wastePercent}% waste)</span>
              <span className={styles.breakdownVal}>{result.grossAreaSqFt} sq ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Carton Coverage</span>
              <span className={styles.breakdownVal}>{boxCoverage} sq ft / box</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Purchased Surface</span>
              <span className={styles.breakdownVal}>{result.purchasedAreaSqFt} sq ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Surplus / Attic Stock</span>
              <span className={styles.breakdownVal}>+{result.surplusSqFt} sq ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Underlayment Rolls (100 sq ft)</span>
              <span className={styles.breakdownVal}>
                {attachedPad ? 'Not needed (planks have attached pad)' : `${result.underlaymentRolls} roll(s)`}
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Perimeter Baseboard / Trim</span>
              <span className={styles.breakdownVal}>
                ~{result.perimeterLinearFt} ft ({result.moldingPieces} pcs @ 7.8 ft)
              </span>
            </div>

            <div className={styles.orderTips}>
              <strong>Installation Tip:</strong> Check that all cartons share the same dye lot / batch number. Acclimate sealed cartons in the installation room for at least 48 hours prior to laying planks.
            </div>
          </div>

          {/* Cost Card (if pricing entered) */}
          {result.flooringCost > 0 && (
            <div className={styles.costCard}>
              <div className={styles.costHeader}>
                <span className={styles.costTotalLabel}>Estimated DIY Materials Cost</span>
                <span className={styles.costTotalVal}>${result.totalDiyCost.toFixed(2)}</span>
              </div>

              <div className={styles.breakdownRow}>
                <span className={styles.breakdownKey}>Laminate Flooring ({result.boxesNeeded} boxes)</span>
                <span className={styles.breakdownVal}>${result.flooringCost.toFixed(2)}</span>
              </div>

              {!attachedPad && result.underlaymentCost > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownKey}>Underlayment ({result.underlaymentRolls} rolls)</span>
                  <span className={styles.breakdownVal}>${result.underlaymentCost.toFixed(2)}</span>
                </div>
              )}

              {result.moldingCost > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownKey}>Moldings &amp; Transitions</span>
                  <span className={styles.breakdownVal}>${result.moldingCost.toFixed(2)}</span>
                </div>
              )}

              {result.salesTaxAmount > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownKey}>Sales Tax ({salesTaxPercent}%)</span>
                  <span className={styles.breakdownVal}>${result.salesTaxAmount.toFixed(2)}</span>
                </div>
              )}

              <div className={styles.benchmarkBox}>
                <span className={styles.benchmarkTitle}>Professional Labor Benchmark</span>
                <div className={styles.benchmarkRange}>
                  ${result.proLaborLow.toLocaleString()} – ${result.proLaborHigh.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Mid-range contractor labor ($2.00 – $5.00/sq ft). DIYing saves this entire labor cost.
                </div>
              </div>
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

      {/* Sticky Mobile Bar */}
      <div className={styles.stickyMobileBar}>
        <div>
          <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block' }}>TOTAL BOXES</span>
          <span className={styles.stickyValue}>{result.boxesNeeded} Cartons</span>
        </div>
        <button
          type="button"
          onClick={handleCopySummary}
          style={{
            background: '#0369A1',
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

export default LaminateCalculator;
