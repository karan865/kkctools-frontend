'use client';

import React, { useState, useId, useRef } from 'react';
import styles from './LinearFootCalculator.module.css';
import {
  LengthUnit,
  WidthUnit,
  ConversionDirection,
  LinearPieceRow,
  calculateLinearFeet,
  calculateSqFtLinearFt,
} from '@/lib/linear-foot-engine';

export default function LinearFootCalculator() {
  const baseId = useId();
  const idCounter = useRef(3);

  // 2 Modes: Mode 1 = Linear Feet (Sum pieces), Mode 2 = Sq Ft <-> Linear Ft
  const [activeTab, setActiveTab] = useState<'linear' | 'convert'>('linear');

  // Mode 1: Linear Feet state
  // Default rows: 12 ft x 4, and 8 ft 6 in x 2
  const [rows, setRows] = useState<LinearPieceRow[]>([
    { id: '1', length: 12, unit: 'ft', quantity: 4 },
    { id: '2', length: 8, inchesPart: 6, unit: 'ft-in', quantity: 2 },
  ]);
  const [wastePercent, setWastePercent] = useState<number>(0);
  const [pricePerFoot, setPricePerFoot] = useState<number | undefined>(undefined);

  // Mode 2: Sq Ft <-> Linear Ft state
  // Default example: 200 sq ft, width 5 in
  const [conversionDirection, setConversionDirection] = useState<ConversionDirection>('sqft-to-linear');
  const [convertValue, setConvertValue] = useState<number>(200);
  const [widthValue, setWidthValue] = useState<number>(5);
  const [widthUnit, setWidthUnit] = useState<WidthUnit>('in');
  const [convertWastePercent, setConvertWastePercent] = useState<number>(0);

  // UX toggles
  const [showMath, setShowMath] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<string>('Copy Summary');

  // Mode 1 Handlers
  const addRow = () => {
    if (rows.length >= 20) return;
    const newId = `row-${idCounter.current++}`;
    setRows([
      ...rows,
      {
        id: newId,
        length: 10,
        unit: 'ft',
        quantity: 1,
      },
    ]);
  };

  const duplicateRow = (row: LinearPieceRow) => {
    if (rows.length >= 20) return;
    const newId = `row-${idCounter.current++}`;
    setRows([
      ...rows,
      {
        ...row,
        id: newId,
      },
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, updates: Partial<LinearPieceRow>) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const handleReset = () => {
    if (activeTab === 'linear') {
      idCounter.current = 3;
      setRows([
        { id: '1', length: 12, unit: 'ft', quantity: 4 },
        { id: '2', length: 8, inchesPart: 6, unit: 'ft-in', quantity: 2 },
      ]);
      setWastePercent(0);
      setPricePerFoot(undefined);
    } else {
      setConversionDirection('sqft-to-linear');
      setConvertValue(200);
      setWidthValue(5);
      setWidthUnit('in');
      setConvertWastePercent(0);
    }
  };

  // Calculations
  const linearResult = calculateLinearFeet({
    rows,
    wastePercent,
    pricePerLinearFoot: pricePerFoot,
  });

  const convertResult = calculateSqFtLinearFt({
    direction: conversionDirection,
    value: convertValue,
    widthValue,
    widthUnit,
    wastePercent: convertWastePercent,
  });

  const handleCopy = () => {
    let text = '';
    if (activeTab === 'linear') {
      text = `Linear Feet Calculation Summary:
- Total Linear Feet: ${linearResult.totalLinearFeetWithWaste.toFixed(2)} ft ${wastePercent > 0 ? `(${linearResult.rawLinearFeet.toFixed(2)} ft without waste)` : ''}
- Total Pieces: ${linearResult.totalPieces} pcs
- Equivalent Length: ${linearResult.totalInchesWithWaste.toFixed(0)} inches · ${linearResult.totalYardsWithWaste.toFixed(2)} yards · ${linearResult.totalMetersWithWaste.toFixed(2)} meters
${linearResult.estimatedCost ? `- Estimated Material Cost: $${linearResult.estimatedCost.toFixed(2)}` : ''}
Calculated at kkctools.com/linear-foot-calculator/`;
    } else {
      if (convertResult) {
        text = `Square Feet <-> Linear Feet Conversion:
- Direction: ${conversionDirection === 'sqft-to-linear' ? 'Sq Ft to Linear Feet' : 'Linear Feet to Sq Ft'}
- Input Value: ${convertValue} ${conversionDirection === 'sqft-to-linear' ? 'sq ft' : 'linear ft'}
- Material Width: ${widthValue} ${widthUnit} (${convertResult.widthInFeet.toFixed(3)} ft)
- Result: ${convertResult.convertedValueWithWaste.toFixed(2)} ${conversionDirection === 'sqft-to-linear' ? 'linear ft' : 'sq ft'}
- Conversion Rate: 1 Linear Foot = ${convertResult.sqFtPerLinearFoot.toFixed(2)} sq ft · 1 Sq Ft = ${convertResult.linearFtPerSqFt.toFixed(2)} linear ft
Calculated at kkctools.com/linear-foot-calculator/`;
      }
    }

    navigator.clipboard.writeText(text);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Summary'), 2000);
  };

  return (
    <div className={styles.calculatorContainer} aria-label="Linear Foot Calculator">
      {/* Mode navigation tabs */}
      <div className={styles.modeHeader}>
        <div className={styles.modeTabs} role="tablist" aria-label="Calculator Modes">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'linear'}
            className={`${styles.modeTab} ${activeTab === 'linear' ? styles.modeTabActive : ''}`}
            onClick={() => setActiveTab('linear')}
          >
            1. Linear Feet (Add Pieces)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'convert'}
            className={`${styles.modeTab} ${activeTab === 'convert' ? styles.modeTabActive : ''}`}
            onClick={() => setActiveTab('convert')}
          >
            2. Sq Ft ↔ Linear Ft
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* INPUTS COLUMN */}
        <div className={styles.formCol}>
          {/* TAB 1: LINEAR FEET */}
          {activeTab === 'linear' && (
            <>
              <div className={styles.rowsContainer}>
                {rows.map((row, idx) => (
                  <div key={row.id} className={styles.rowItem}>
                    <div className={styles.rowHeader}>
                      <span>Piece #{idx + 1}</span>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={styles.smallActionBtn}
                          onClick={() => duplicateRow(row)}
                          title="Duplicate Piece"
                        >
                          Duplicate
                        </button>
                        {rows.length > 1 && (
                          <button
                            type="button"
                            className={styles.smallDeleteBtn}
                            onClick={() => removeRow(row.id)}
                            aria-label={`Remove Piece ${idx + 1}`}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={styles.rowInputs}>
                      <div className={styles.fieldGroup} style={{ flex: 1.2 }}>
                        <label htmlFor={`${baseId}-len-${row.id}`}>
                          {row.unit === 'ft-in' ? 'Feet' : 'Length'}
                        </label>
                        <input
                          id={`${baseId}-len-${row.id}`}
                          type="number"
                          min="0.01"
                          step="any"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={row.length || ''}
                          onChange={(e) =>
                            updateRow(row.id, { length: parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>

                      {row.unit === 'ft-in' && (
                        <div className={styles.fieldGroup} style={{ flex: 1 }}>
                          <label htmlFor={`${baseId}-in-${row.id}`}>Inches</label>
                          <input
                            id={`${baseId}-in-${row.id}`}
                            type="number"
                            min="0"
                            max="11.99"
                            step="any"
                            inputMode="decimal"
                            className={styles.inputField}
                            value={row.inchesPart || ''}
                            onChange={(e) =>
                              updateRow(row.id, { inchesPart: parseFloat(e.target.value) || 0 })
                            }
                          />
                        </div>
                      )}

                      <div className={styles.fieldGroup} style={{ flex: 1.2 }}>
                        <label htmlFor={`${baseId}-unit-${row.id}`}>Unit</label>
                        <select
                          id={`${baseId}-unit-${row.id}`}
                          className={styles.selectField}
                          value={row.unit}
                          onChange={(e) =>
                            updateRow(row.id, { unit: e.target.value as LengthUnit })
                          }
                        >
                          <option value="ft">Feet (ft)</option>
                          <option value="in">Inches (in)</option>
                          <option value="ft-in">Feet &amp; Inches</option>
                          <option value="yd">Yards (yd)</option>
                          <option value="m">Meters (m)</option>
                          <option value="cm">Centimeters (cm)</option>
                        </select>
                      </div>

                      <div className={styles.fieldGroup} style={{ flex: 0.9 }}>
                        <label htmlFor={`${baseId}-qty-${row.id}`}>Quantity</label>
                        <input
                          id={`${baseId}-qty-${row.id}`}
                          type="number"
                          min="1"
                          max="10000"
                          step="1"
                          className={styles.inputField}
                          value={row.quantity || ''}
                          onChange={(e) =>
                            updateRow(row.id, {
                              quantity: Math.max(1, parseInt(e.target.value, 10) || 1),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {rows.length < 20 && (
                  <button type="button" className={styles.addBtn} onClick={addRow}>
                    + Add Another Length (Max 20)
                  </button>
                )}
              </div>

              {/* Options: Waste % and Price/LF */}
              <div className={styles.optionsCard}>
                <div className={styles.rowInputs}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-waste`}>Waste Allowance (%)</label>
                    <input
                      id={`${baseId}-waste`}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      className={styles.inputField}
                      value={wastePercent}
                      onChange={(e) => setWastePercent(parseFloat(e.target.value) || 0)}
                    />
                    <div className={styles.chipGroup}>
                      <button
                        type="button"
                        className={`${styles.chip} ${wastePercent === 0 ? styles.chipActive : ''}`}
                        onClick={() => setWastePercent(0)}
                      >
                        0%
                      </button>
                      <button
                        type="button"
                        className={`${styles.chip} ${wastePercent === 5 ? styles.chipActive : ''}`}
                        onClick={() => setWastePercent(5)}
                      >
                        5%
                      </button>
                      <button
                        type="button"
                        className={`${styles.chip} ${wastePercent === 10 ? styles.chipActive : ''}`}
                        onClick={() => setWastePercent(10)}
                      >
                        10%
                      </button>
                      <button
                        type="button"
                        className={`${styles.chip} ${wastePercent === 15 ? styles.chipActive : ''}`}
                        onClick={() => setWastePercent(15)}
                      >
                        15%
                      </button>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-price`}>Price per Linear Foot ($ optional)</label>
                    <input
                      id={`${baseId}-price`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 2.50"
                      className={styles.inputField}
                      value={pricePerFoot ?? ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setPricePerFoot(isNaN(val) ? undefined : val);
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: SQ FT <-> LINEAR FT */}
          {activeTab === 'convert' && (
            <div className={styles.optionsCard}>
              <div className={styles.fieldGroup}>
                <label htmlFor={`${baseId}-dir`}>Conversion Direction</label>
                <select
                  id={`${baseId}-dir`}
                  className={styles.selectField}
                  value={conversionDirection}
                  onChange={(e) =>
                    setConversionDirection(e.target.value as ConversionDirection)
                  }
                >
                  <option value="sqft-to-linear">Square Feet → Linear Feet</option>
                  <option value="linear-to-sqft">Linear Feet → Square Feet</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={`${baseId}-conv-val`}>
                  {conversionDirection === 'sqft-to-linear'
                    ? 'Total Area (Square Feet)'
                    : 'Total Length (Linear Feet)'}
                </label>
                <input
                  id={`${baseId}-conv-val`}
                  type="number"
                  min="0.1"
                  step="any"
                  inputMode="decimal"
                  className={styles.inputField}
                  value={convertValue || ''}
                  onChange={(e) => setConvertValue(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className={styles.rowInputs}>
                <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
                  <label htmlFor={`${baseId}-w-val`}>Material Width (Required)</label>
                  <input
                    id={`${baseId}-w-val`}
                    type="number"
                    min="0.01"
                    step="any"
                    inputMode="decimal"
                    placeholder="Enter board/plank width"
                    className={styles.inputField}
                    value={widthValue || ''}
                    onChange={(e) => setWidthValue(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className={styles.fieldGroup} style={{ flex: 1 }}>
                  <label htmlFor={`${baseId}-w-unit`}>Width Unit</label>
                  <select
                    id={`${baseId}-w-unit`}
                    className={styles.selectField}
                    value={widthUnit}
                    onChange={(e) => setWidthUnit(e.target.value as WidthUnit)}
                  >
                    <option value="in">Inches (in)</option>
                    <option value="ft">Feet (ft)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="mm">Millimeters (mm)</option>
                    <option value="m">Meters (m)</option>
                  </select>
                </div>
              </div>

              {conversionDirection === 'sqft-to-linear' && (
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-conv-waste`}>Waste Allowance (%)</label>
                  <input
                    id={`${baseId}-conv-waste`}
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    className={styles.inputField}
                    value={convertWastePercent}
                    onChange={(e) =>
                      setConvertWastePercent(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              )}
            </div>
          )}

          <div className={styles.inlineNotice}>
            💡 <strong>Measuring Tip:</strong> Always use the actual finished width of boards (e.g. a standard 1×6 nominal board is actually 5.5 inches wide).
          </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className={styles.resultCol} aria-live="polite">
          {activeTab === 'linear' && (
            <>
              <div className={styles.primaryResultCard}>
                <div className={styles.resultTitle}>Total Linear Feet</div>
                <div className={styles.resultHero}>
                  {linearResult.totalLinearFeetWithWaste.toFixed(2)} ft
                </div>
                <div className={styles.resultSubHero}>
                  {linearResult.totalPieces} pieces included
                </div>
                {wastePercent > 0 && (
                  <div className={styles.rawSubLine}>
                    Without {wastePercent}% waste: {linearResult.rawLinearFeet.toFixed(2)} ft
                  </div>
                )}
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <div className={styles.metricVal}>
                    {linearResult.estimatedCost !== undefined
                      ? `$${linearResult.estimatedCost.toFixed(2)}`
                      : '—'}
                  </div>
                  <div className={styles.metricLbl}>
                    {pricePerFoot ? `@ $${pricePerFoot.toFixed(2)}/ft` : 'Enter $/LF for Cost'}
                  </div>
                </div>

                <div className={styles.metricItem}>
                  <div className={styles.metricVal}>
                    {linearResult.totalInchesWithWaste.toFixed(0)} in
                  </div>
                  <div className={styles.metricLbl}>Total Inches</div>
                </div>

                <div className={styles.metricItem}>
                  <div className={styles.metricVal}>
                    {linearResult.totalYardsWithWaste.toFixed(2)} yd
                  </div>
                  <div className={styles.metricLbl}>Total Yards</div>
                </div>

                <div className={styles.metricItem}>
                  <div className={styles.metricVal}>
                    {linearResult.totalMetersWithWaste.toFixed(2)} m
                  </div>
                  <div className={styles.metricLbl}>Total Meters</div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'convert' && (
            <>
              {convertResult ? (
                <>
                  <div className={styles.primaryResultCard}>
                    <div className={styles.resultTitle}>
                      {conversionDirection === 'sqft-to-linear'
                        ? 'Required Linear Feet'
                        : 'Covered Square Feet'}
                    </div>
                    <div className={styles.resultHero}>
                      {convertResult.convertedValueWithWaste.toFixed(2)}{' '}
                      {conversionDirection === 'sqft-to-linear' ? 'ft' : 'sq ft'}
                    </div>
                    {conversionDirection === 'sqft-to-linear' && convertWastePercent > 0 && (
                      <div className={styles.rawSubLine}>
                        Without extra:{' '}
                        {convertResult.convertedValueRaw.toFixed(2)} linear ft
                      </div>
                    )}
                  </div>

                  <div className={styles.metricsGrid}>
                    <div className={styles.metricItem}>
                      <div className={styles.metricVal}>
                        {convertResult.sqFtPerLinearFoot.toFixed(2)} sq ft
                      </div>
                      <div className={styles.metricLbl}>Per Linear Foot</div>
                    </div>

                    <div className={styles.metricItem}>
                      <div className={styles.metricVal}>
                        {convertResult.linearFtPerSqFt.toFixed(2)} LF
                      </div>
                      <div className={styles.metricLbl}>Per Square Foot</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.primaryResultCard}>
                  <div className={styles.resultTitle}>Awaiting Width</div>
                  <div className={styles.resultHero} style={{ fontSize: '1.5rem' }}>
                    Enter Material Width
                  </div>
                  <div className={styles.rawSubLine}>
                    Area cannot convert to length without knowing material width.
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Row */}
          <div className={styles.actionRow}>
            <button type="button" className={styles.actionBtn} onClick={handleCopy}>
              📋 {copyStatus}
            </button>
            <button type="button" className={styles.actionBtn} onClick={() => window.print()}>
              🖨️ Print
            </button>
            <button type="button" className={styles.actionBtn} onClick={handleReset}>
              ↺ Reset
            </button>
          </div>

          {/* Show Step-by-Step Math */}
          <button
            type="button"
            className={styles.mathToggle}
            onClick={() => setShowMath(!showMath)}
            aria-expanded={showMath}
          >
            {showMath ? '▲ Hide Step-by-Step Math' : '▼ Show Step-by-Step Math'}
          </button>

          {showMath && (
            <div className={styles.mathDrawer}>
              {(activeTab === 'linear'
                ? linearResult.mathSteps
                : convertResult?.mathSteps || []
              ).map((st, i) => (
                <div key={i} className={styles.mathRow}>
                  <span className={styles.mathStepName}>{st.step}</span>
                  <span className={styles.mathFormula}>{st.formula}</span>
                  <span className={styles.mathResult}>= {st.result}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

