'use client';

import React, { useState, useId } from 'react';
import styles from './FillDirtCalculator.module.css';
import AreaDepthDiagram, { DiagramPanel, fmtNum, shapeFormula } from '../shared/AreaDepthDiagram';
import {
  UnitSystem,
  ShapeType,
  DepthType,
  SoilMaterial,
  AreaRow,
  calculateFillDirt,
} from '@/lib/fill-dirt-engine';

export default function FillDirtCalculator() {
  const baseId = useId();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('us');

  // Multi-area rows (max 10). Initial: 20x15 ft, 6 in depth (Metric: 5x4 m, 15 cm)
  const [areas, setAreas] = useState<AreaRow[]>([
    {
      id: '1',
      shape: 'rectangle',
      lengthFt: 20,
      widthFt: 15,
      lengthM: 5,
      widthM: 4,
      depthType: 'uniform',
      depthInches: 6,
      depthCm: 15,
      shallowDepthInches: 3,
      deepDepthInches: 9,
      shallowDepthCm: 8,
      deepDepthCm: 22,
    },
  ]);

  const [extraPercent, setExtraPercent] = useState<number>(10);
  const [material, setMaterial] = useState<SoilMaterial>('none');
  const [customDensityLb, setCustomDensityLb] = useState<number>(2700);
  const [truckCapacity, setTruckCapacity] = useState<number | undefined>(undefined);

  // UX toggles
  const [showMath, setShowMath] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<string>('Copy Summary');

  // Add / Remove / Update rows
  const addArea = () => {
    if (areas.length >= 10) return;
    const last = areas[areas.length - 1];
    setAreas([
      ...areas,
      {
        id: String(Date.now()),
        shape: 'rectangle',
        lengthFt: 10,
        widthFt: 10,
        lengthM: 3,
        widthM: 3,
        depthType: last.depthType,
        depthInches: last.depthInches ?? 6,
        depthCm: last.depthCm ?? 15,
        shallowDepthInches: last.shallowDepthInches ?? 3,
        deepDepthInches: last.deepDepthInches ?? 9,
        shallowDepthCm: last.shallowDepthCm ?? 8,
        deepDepthCm: last.deepDepthCm ?? 22,
      },
    ]);
  };

  const removeArea = (id: string) => {
    if (areas.length <= 1) return;
    setAreas(areas.filter((a) => a.id !== id));
  };

  const updateArea = (id: string, updates: Partial<AreaRow>) => {
    setAreas(areas.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const handleReset = () => {
    setAreas([
      {
        id: '1',
        shape: 'rectangle',
        lengthFt: 20,
        widthFt: 15,
        lengthM: 5,
        widthM: 4,
        depthType: 'uniform',
        depthInches: 6,
        depthCm: 15,
        shallowDepthInches: 3,
        deepDepthInches: 9,
        shallowDepthCm: 8,
        deepDepthCm: 22,
      },
    ]);
    setExtraPercent(10);
    setMaterial('none');
    setCustomDensityLb(2700);
    setTruckCapacity(undefined);
  };

  // Run calculation
  const result = calculateFillDirt({
    unitSystem,
    areas,
    extraSettlingPercent: extraPercent,
    material,
    customDensityLbPerYd3: customDensityLb,
    truckCapacityYd3: truckCapacity,
  });

  const handleCopy = () => {
    const text = `Fill Dirt Calculation Summary:
- Required Volume (with ${extraPercent}% extra): ${unitSystem === 'metric' ? `${result.volumeWithExtraM3.toFixed(2)} m³` : `${result.volumeWithExtraCuYd.toFixed(2)} cu yd (${result.volumeWithExtraCuFt.toFixed(2)} cu ft)`}
- Raw Volume (without extra): ${unitSystem === 'metric' ? `${result.totalRawVolumeM3.toFixed(2)} m³` : `${result.totalRawVolumeCuYd.toFixed(2)} cu yd`}
${result.weightTonsWithExtra ? `- Estimated Weight: ${result.weightTonsWithExtra.toFixed(2)} tons (${result.weightLbWithExtra?.toFixed(0)} lb)` : ''}
${result.truckloads ? `- Estimated Truckloads: ${result.truckloads} loads (${truckCapacity} yd³/truck)` : ''}
Calculated at kkctools.com/fill-dirt-calculator/`;

    navigator.clipboard.writeText(text);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Summary'), 2000);
  };

  return (
    <div className={styles.calculatorContainer} aria-label="Fill Dirt Calculator Form">
      

      <div className={styles.grid}>
        {/* INPUTS COLUMN */}
        <div className={styles.formCol}>
          <div className={styles.topBar}>
        <span className={styles.topTitle}>Fill Dirt &amp; Soil Estimator</span>
        <div className={styles.unitToggle}>
          <button
            type="button"
            className={`${styles.unitBtn} ${unitSystem === 'us' ? styles.unitBtnActive : ''}`}
            onClick={() => setUnitSystem('us')}
          >
            US (ft, in, yd³)
          </button>
          <button
            type="button"
            className={`${styles.unitBtn} ${unitSystem === 'metric' ? styles.unitBtnActive : ''}`}
            onClick={() => setUnitSystem('metric')}
          >
            Metric (m, cm, m³)
          </button>
        </div>
      </div>
          {areas.map((row, idx) => (
            <div key={row.id} className={styles.sectionBox}>
              <div className={styles.sectionHeader}>
                <span>Area #{idx + 1}</span>
                {areas.length > 1 && (
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => removeArea(row.id)}
                    aria-label={`Remove Area ${idx + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Shape selection */}
              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-shape-${row.id}`}>Shape</label>
                  <select
                    id={`${baseId}-shape-${row.id}`}
                    className={styles.selectField}
                    value={row.shape}
                    onChange={(e) => updateArea(row.id, { shape: e.target.value as ShapeType })}
                  >
                    <option value="rectangle">Rectangle (L × W)</option>
                    <option value="circle">Circle (Round Area)</option>
                    <option value="triangle">Triangle (Base × Height)</option>
                    <option value="known">Known Area (Sq Ft / m²)</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-depth-type-${row.id}`}>Depth Type</label>
                  <select
                    id={`${baseId}-depth-type-${row.id}`}
                    className={styles.selectField}
                    value={row.depthType}
                    onChange={(e) => updateArea(row.id, { depthType: e.target.value as DepthType })}
                  >
                    <option value="uniform">Uniform Depth</option>
                    <option value="sloped">Sloped (Shallow to Deep)</option>
                  </select>
                </div>
              </div>

              {/* Dimensions based on Shape */}
              {row.shape === 'rectangle' && (
                <div className={styles.inputRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-len-${row.id}`}>
                      Length ({unitSystem === 'us' ? 'ft' : 'm'})
                    </label>
                    <input
                      id={`${baseId}-len-${row.id}`}
                      type="number"
                      min="0.1"
                      step="any"
                      inputMode="decimal"
                      className={styles.inputField}
                      value={unitSystem === 'us' ? row.lengthFt ?? '' : row.lengthM ?? ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        if (unitSystem === 'us') updateArea(row.id, { lengthFt: val });
                        else updateArea(row.id, { lengthM: val });
                      }}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-wid-${row.id}`}>
                      Width ({unitSystem === 'us' ? 'ft' : 'm'})
                    </label>
                    <input
                      id={`${baseId}-wid-${row.id}`}
                      type="number"
                      min="0.1"
                      step="any"
                      inputMode="decimal"
                      className={styles.inputField}
                      value={unitSystem === 'us' ? row.widthFt ?? '' : row.widthM ?? ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        if (unitSystem === 'us') updateArea(row.id, { widthFt: val });
                        else updateArea(row.id, { widthM: val });
                      }}
                    />
                  </div>
                </div>
              )}

              {row.shape === 'circle' && (
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-dia-${row.id}`}>
                    Diameter ({unitSystem === 'us' ? 'ft' : 'm'})
                  </label>
                  <input
                    id={`${baseId}-dia-${row.id}`}
                    type="number"
                    min="0.1"
                    step="any"
                    inputMode="decimal"
                    className={styles.inputField}
                    value={unitSystem === 'us' ? row.diameterFt ?? '' : row.diameterM ?? ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (unitSystem === 'us') updateArea(row.id, { diameterFt: val });
                      else updateArea(row.id, { diameterM: val });
                    }}
                  />
                </div>
              )}

              {row.shape === 'triangle' && (
                <div className={styles.inputRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-base-${row.id}`}>
                      Base ({unitSystem === 'us' ? 'ft' : 'm'})
                    </label>
                    <input
                      id={`${baseId}-base-${row.id}`}
                      type="number"
                      min="0.1"
                      step="any"
                      inputMode="decimal"
                      className={styles.inputField}
                      value={unitSystem === 'us' ? row.baseFt ?? '' : row.baseM ?? ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        if (unitSystem === 'us') updateArea(row.id, { baseFt: val });
                        else updateArea(row.id, { baseM: val });
                      }}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-ht-${row.id}`}>
                      Height ({unitSystem === 'us' ? 'ft' : 'm'})
                    </label>
                    <input
                      id={`${baseId}-ht-${row.id}`}
                      type="number"
                      min="0.1"
                      step="any"
                      inputMode="decimal"
                      className={styles.inputField}
                      value={unitSystem === 'us' ? row.heightFt ?? '' : row.heightM ?? ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        if (unitSystem === 'us') updateArea(row.id, { heightFt: val });
                        else updateArea(row.id, { heightM: val });
                      }}
                    />
                  </div>
                </div>
              )}

              {row.shape === 'known' && (
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-known-${row.id}`}>
                    Known Area ({unitSystem === 'us' ? 'sq ft' : 'm²'})
                  </label>
                  <input
                    id={`${baseId}-known-${row.id}`}
                    type="number"
                    min="1"
                    step="any"
                    inputMode="decimal"
                    className={styles.inputField}
                    value={unitSystem === 'us' ? row.knownAreaSqFt ?? '' : row.knownAreaSqM ?? ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (unitSystem === 'us') updateArea(row.id, { knownAreaSqFt: val });
                      else updateArea(row.id, { knownAreaSqM: val });
                    }}
                  />
                </div>
              )}

              {/* Depth Inputs */}
              {row.depthType === 'uniform' ? (
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-depth-${row.id}`}>
                    Depth ({unitSystem === 'us' ? 'inches' : 'cm'})
                  </label>
                  <input
                    id={`${baseId}-depth-${row.id}`}
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    className={styles.inputField}
                    value={unitSystem === 'us' ? row.depthInches ?? '' : row.depthCm ?? ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (unitSystem === 'us') updateArea(row.id, { depthInches: val });
                      else updateArea(row.id, { depthCm: val });
                    }}
                  />
                </div>
              ) : (
                <div className={styles.inputRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-shallow-${row.id}`}>
                      Shallow End ({unitSystem === 'us' ? 'in' : 'cm'})
                    </label>
                    <input
                      id={`${baseId}-shallow-${row.id}`}
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      className={styles.inputField}
                      value={
                        unitSystem === 'us'
                          ? row.shallowDepthInches ?? ''
                          : row.shallowDepthCm ?? ''
                      }
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        if (unitSystem === 'us') updateArea(row.id, { shallowDepthInches: val });
                        else updateArea(row.id, { shallowDepthCm: val });
                      }}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-deep-${row.id}`}>
                      Deep End ({unitSystem === 'us' ? 'in' : 'cm'})
                    </label>
                    <input
                      id={`${baseId}-deep-${row.id}`}
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      className={styles.inputField}
                      value={
                        unitSystem === 'us' ? row.deepDepthInches ?? '' : row.deepDepthCm ?? ''
                      }
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        if (unitSystem === 'us') updateArea(row.id, { deepDepthInches: val });
                        else updateArea(row.id, { deepDepthCm: val });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {areas.length < 10 && (
            <button type="button" className={styles.addBtn} onClick={addArea}>
              + Add Area (Irregular / Multi-Section)
            </button>
          )}

          {/* Settling & Optional Extra Configuration */}
          <div className={styles.extraOptionsBox}>
            <span className={styles.extraTitle}>Settling, Material &amp; Truck Options</span>

            <div className={styles.inputRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor={`${baseId}-settling`}>Extra for Settling (%)</label>
                <input
                  id={`${baseId}-settling`}
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  className={styles.inputField}
                  value={extraPercent}
                  onChange={(e) => setExtraPercent(parseFloat(e.target.value) || 0)}
                />
                <div className={styles.chipGroup}>
                  <button type="button" className={`${styles.chip} ${extraPercent === 5 ? styles.chipActive : ''}`} onClick={() => setExtraPercent(5)}>5%</button>
                  <button type="button" className={`${styles.chip} ${extraPercent === 10 ? styles.chipActive : ''}`} onClick={() => setExtraPercent(10)}>10% (Default)</button>
                  <button type="button" className={`${styles.chip} ${extraPercent === 15 ? styles.chipActive : ''}`} onClick={() => setExtraPercent(15)}>15%</button>
                  <button type="button" className={`${styles.chip} ${extraPercent === 20 ? styles.chipActive : ''}`} onClick={() => setExtraPercent(20)}>20% (Deep fill)</button>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={`${baseId}-material`}>Material Weight (Optional)</label>
                <select
                  id={`${baseId}-material`}
                  className={styles.selectField}
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as SoilMaterial)}
                >
                  <option value="none">None (Volume Only)</option>
                  <option value="fill-dirt">Fill Dirt (~2,700 lb/yd³)</option>
                  <option value="topsoil">Topsoil (~2,200 lb/yd³)</option>
                  <option value="custom">Custom Density</option>
                </select>
              </div>
            </div>

            {material === 'custom' && (
              <div className={styles.fieldGroup}>
                <label htmlFor={`${baseId}-density`}>
                  Custom Density ({unitSystem === 'us' ? 'lb/yd³' : 'kg/m³'})
                </label>
                <input
                  id={`${baseId}-density`}
                  type="number"
                  min="1000"
                  max="4000"
                  className={styles.inputField}
                  value={customDensityLb}
                  onChange={(e) => setCustomDensityLb(parseFloat(e.target.value) || 2700)}
                />
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label htmlFor={`${baseId}-truck`}>
                Supplier Truck Capacity (Optional yd³ / truckload)
              </label>
              <input
                id={`${baseId}-truck`}
                type="number"
                min="1"
                step="any"
                placeholder="Leave blank or enter e.g. 5, 10, 12"
                className={styles.inputField}
                value={truckCapacity ?? ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTruckCapacity(isNaN(val) ? undefined : val);
                }}
              />
            </div>
          </div>

          <div className={styles.inlineNotice}>
            💡 <strong>Settling Tip:</strong> Loose subsoil settles naturally after tamping, rolling, and watering. A 10–20% buffer prevents having to order expensive short loads later.
          </div>

          {(() => {
            const a0 = areas[0];
            const M = unitSystem === 'metric';
            const u = M ? 'm' : 'ft';
            const v = (ft?: number, m?: number) => `${fmtNum((M ? m : ft) ?? 0, 2)} ${u}`;
            const shape = a0.shape === 'known' ? 'area' : a0.shape;
            const A = a0.shape === 'circle' ? v(a0.diameterFt, a0.diameterM) : a0.shape === 'triangle' ? v(a0.baseFt, a0.baseM) : a0.shape === 'known' ? `${fmtNum((M ? a0.knownAreaSqM : a0.knownAreaSqFt) ?? 0, 1)} ${M ? 'm²' : 'ft²'}` : v(a0.lengthFt, a0.lengthM);
            const B = a0.shape === 'triangle' ? v(a0.heightFt, a0.heightM) : v(a0.widthFt, a0.widthM);
            const ratio = a0.shape === 'triangle' ? ((M ? a0.baseM : a0.baseFt) || 1) / ((M ? a0.heightM : a0.heightFt) || 1) : ((M ? a0.lengthM : a0.lengthFt) || 1) / ((M ? a0.widthM : a0.widthFt) || 1);
            const depth =
              a0.depthType === 'uniform'
                ? M ? `${a0.depthCm ?? 0} cm` : `${a0.depthInches ?? 0} in`
                : M ? `${a0.shallowDepthCm ?? 0}–${a0.deepDepthCm ?? 0} cm` : `${a0.shallowDepthInches ?? 0}–${a0.deepDepthInches ?? 0} in`;
            const vol = (cuyd: number, m3: number) => (M ? `${fmtNum(m3, 2)} m³` : `${fmtNum(cuyd, 2)} yd³`);
            const steps = [
              { title: areas.length > 1 ? `Volume = area × depth (${areas.length} areas)` : `Volume = ${shapeFormula(shape)} × ${a0.depthType === 'uniform' ? 'depth' : 'average depth'}`, value: M ? `${fmtNum(result.totalRawVolumeM3, 2)} m³` : `${fmtNum(result.totalRawVolumeCuFt, 1)} ft³` },
              { title: M ? 'Volume' : 'Cubic yards = ft³ ÷ 27', value: vol(result.totalRawVolumeCuYd, result.totalRawVolumeM3) },
              { title: `Order = + ${extraPercent}% for settling`, value: vol(result.volumeWithExtraCuYd, result.volumeWithExtraM3) },
            ];
            if (result.weightTonsWithExtra) steps.push({ title: 'Weight = volume × density', value: M ? `${fmtNum(result.weightTonnesWithExtra ?? 0, 2)} t` : `${fmtNum(result.weightTonsWithExtra, 2)} tons` });
            return (
              <DiagramPanel caption="How it is worked out: area × depth = volume, plus extra for settling.">
                <AreaDepthDiagram idPrefix="fill" shape={shape} a={A} b={B} depth={depth} ratio={ratio} material="soil" note={areas.length > 1 ? `Area 1 of ${areas.length}` : undefined} steps={steps} />
              </DiagramPanel>
            );
          })()}
        </div>

        {/* RESULTS COLUMN */}
        <div className={styles.resultCol} aria-live="polite">
          <div className={styles.primaryResultCard}>
            <div className={styles.resultTitle}>Total Dirt to Order</div>
            <div className={styles.resultHero}>
              {unitSystem === 'metric'
                ? `${result.volumeWithExtraM3.toFixed(2)} m³`
                : `${result.volumeWithExtraCuYd.toFixed(2)} yd³`}
            </div>
            <div className={styles.resultSubHero}>
              {unitSystem === 'metric'
                ? `${(result.volumeWithExtraM3 * 35.3146667).toFixed(1)} ft³ (includes ${extraPercent}% extra)`
                : `${result.volumeWithExtraCuFt.toFixed(2)} ft³ (includes ${extraPercent}% extra)`}
            </div>
            <div className={styles.rawSubLine}>
              Without extra:{' '}
              {unitSystem === 'metric'
                ? `${result.totalRawVolumeM3.toFixed(2)} m³`
                : `${result.totalRawVolumeCuYd.toFixed(2)} yd³ (${result.totalRawVolumeCuFt.toFixed(1)} ft³)`}
            </div>
          </div>

          {/* Breakdown Metric Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <div className={styles.metricVal}>
                {result.weightTonsWithExtra
                  ? `${result.weightTonsWithExtra.toFixed(2)} Tons`
                  : '—'}
              </div>
              <div className={styles.metricLbl}>
                {material === 'none' ? 'Pick Material for Weight' : `${material} Tons`}
              </div>
            </div>

            <div className={styles.metricItem}>
              <div className={styles.metricVal}>
                {result.truckloads !== undefined ? `${result.truckloads} Loads` : '—'}
              </div>
              <div className={styles.metricLbl}>
                {truckCapacity ? `@ ${truckCapacity} yd³/truck` : 'Enter Truck Capacity'}
              </div>
            </div>

            <div className={styles.metricItem}>
              <div className={styles.metricVal}>
                {unitSystem === 'metric'
                  ? `${result.volumeWithExtraM3.toFixed(2)} m³`
                  : `${result.volumeWithExtraCuFt.toFixed(0)} ft³`}
              </div>
              <div className={styles.metricLbl}>Total Volume</div>
            </div>

            <div className={styles.metricItem}>
              <div className={styles.metricVal}>{extraPercent}%</div>
              <div className={styles.metricLbl}>Settling Allowance</div>
            </div>
          </div>

          {/* Action Buttons */}
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

          {/* Show Math Drawer */}
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
              {result.mathSteps.map((st, i) => (
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

