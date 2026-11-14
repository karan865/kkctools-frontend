'use client';

import React, { useState, useMemo } from 'react';
import {
  calcMaterial,
  LengthUnit,
  AreaUnit,
  DensityUnit,
  ShapeType,
  SectionInput,
  MaterialCalcInput,
  MaterialCalcResult,
} from '@/lib/area-depth-engine';
import styles from './AsphaltCalculator.module.css';

type MaterialType = 'hotmix' | 'millings';
type UnitSystem = 'imperial' | 'metric';
type DensityPresetKey = 'hotmix_std' | 'open_graded' | 'millings' | 'custom';

interface SectionState {
  id: string;
  shape: ShapeType;
  length: string;
  lengthUnit: LengthUnit;
  width: string;
  widthUnit: LengthUnit;
  diameter: string;
  diameterUnit: LengthUnit;
  base: string;
  baseUnit: LengthUnit;
  height: string;
  heightUnit: LengthUnit;
  area: string;
  areaUnit: AreaUnit;
}

const DEFAULT_SECTION: SectionState = {
  id: '1',
  shape: 'rectangle',
  length: '40',
  lengthUnit: 'ft',
  width: '20',
  widthUnit: 'ft',
  diameter: '20',
  diameterUnit: 'ft',
  base: '30',
  baseUnit: 'ft',
  height: '20',
  heightUnit: 'ft',
  area: '800',
  areaUnit: 'sqft',
};

export default function AsphaltCalculator() {
  const [material, setMaterial] = useState<MaterialType>('hotmix');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [sections, setSections] = useState<SectionState[]>([DEFAULT_SECTION]);

  // Dimensions & main controls
  const [thickness, setThickness] = useState<string>('2');
  const [thicknessUnit, setThicknessUnit] = useState<LengthUnit>('in');
  const [wastePct, setWastePct] = useState<string>('5');
  const [pricePerTon, setPricePerTon] = useState<string>('');

  // Advanced controls
  const [densityPreset, setDensityPreset] = useState<DensityPresetKey>('hotmix_std');
  const [densityValue, setDensityValue] = useState<string>('145');
  const [densityUnit, setDensityUnit] = useState<DensityUnit>('lb/ft3');
  const [truckCapacity, setTruckCapacity] = useState<string>('');
  const [showBinder, setShowBinder] = useState<boolean>(false);
  const [binderPct, setBinderPct] = useState<string>('5');

  // Copy status
  const [copied, setCopied] = useState<boolean>(false);

  // Material Toggle handler
  const handleMaterialChange = (newMat: MaterialType) => {
    setMaterial(newMat);
    if (newMat === 'millings') {
      setDensityPreset('millings');
      setDensityValue('110');
      setDensityUnit('lb/ft3');
      setThickness('3');
    } else {
      setDensityPreset('hotmix_std');
      setDensityValue('145');
      setDensityUnit('lb/ft3');
      setThickness('2');
    }
  };

  // Unit System Toggle handler
  const handleUnitSystemChange = (sys: UnitSystem) => {
    setUnitSystem(sys);
    if (sys === 'metric') {
      setThicknessUnit('mm');
      setThickness((prev) => {
        const val = parseFloat(prev);
        return isNaN(val) ? '50' : (val * 25.4).toFixed(0);
      });
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          lengthUnit: 'm',
          widthUnit: 'm',
          diameterUnit: 'm',
          baseUnit: 'm',
          heightUnit: 'm',
          areaUnit: 'sqm',
        }))
      );
    } else {
      setThicknessUnit('in');
      setThickness((prev) => {
        const val = parseFloat(prev);
        return isNaN(val) ? '2' : (val / 25.4).toFixed(1).replace(/\.0$/, '');
      });
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          lengthUnit: 'ft',
          widthUnit: 'ft',
          diameterUnit: 'ft',
          baseUnit: 'ft',
          heightUnit: 'ft',
          areaUnit: 'sqft',
        }))
      );
    }
  };

  // Density preset handler
  const handleDensityPresetChange = (preset: DensityPresetKey) => {
    setDensityPreset(preset);
    if (preset === 'hotmix_std') {
      setDensityValue('145');
      setDensityUnit('lb/ft3');
    } else if (preset === 'open_graded') {
      setDensityValue('125');
      setDensityUnit('lb/ft3');
    } else if (preset === 'millings') {
      setDensityValue('110');
      setDensityUnit('lb/ft3');
    }
  };

  // Section manipulation
  const addSection = () => {
    if (sections.length >= 10) return;
    const newId = String(Date.now());
    const lengthU = unitSystem === 'metric' ? 'm' : 'ft';
    const areaU = unitSystem === 'metric' ? 'sqm' : 'sqft';
    setSections([
      ...sections,
      {
        ...DEFAULT_SECTION,
        id: newId,
        length: '20',
        width: '10',
        lengthUnit: lengthU,
        widthUnit: lengthU,
        diameterUnit: lengthU,
        baseUnit: lengthU,
        heightUnit: lengthU,
        areaUnit: areaU,
      },
    ]);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, updates: Partial<SectionState>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  // Reset tool to defaults
  const handleReset = () => {
    setMaterial('hotmix');
    setUnitSystem('imperial');
    setSections([DEFAULT_SECTION]);
    setThickness('2');
    setThicknessUnit('in');
    setWastePct('5');
    setPricePerTon('');
    setDensityPreset('hotmix_std');
    setDensityValue('145');
    setDensityUnit('lb/ft3');
    setTruckCapacity('');
    setShowBinder(false);
    setBinderPct('5');
    setCopied(false);
  };

  // Parse engine input
  const calcOutput = useMemo(() => {
    const parsedSections: SectionInput[] = sections.map((s) => {
      switch (s.shape) {
        case 'circle':
          return {
            shape: 'circle',
            diameter: parseFloat(s.diameter) || 0,
            diameterUnit: s.diameterUnit,
          };
        case 'triangle':
          return {
            shape: 'triangle',
            base: parseFloat(s.base) || 0,
            baseUnit: s.baseUnit,
            height: parseFloat(s.height) || 0,
            heightUnit: s.heightUnit,
          };
        case 'area':
          return {
            shape: 'area',
            area: parseFloat(s.area) || 0,
            areaUnit: s.areaUnit,
          };
        case 'rectangle':
        default:
          return {
            shape: 'rectangle',
            length: parseFloat(s.length) || 0,
            lengthUnit: s.lengthUnit,
            width: parseFloat(s.width) || 0,
            widthUnit: s.widthUnit,
          };
      }
    });

    const input: MaterialCalcInput = {
      sections: parsedSections,
      thickness: parseFloat(thickness) || 0,
      thicknessUnit,
      density: parseFloat(densityValue) || 0,
      densityUnit,
      wastePct: parseFloat(wastePct) || 0,
      pricePerTon: pricePerTon ? parseFloat(pricePerTon) : 0,
      truckCapacityTons: truckCapacity ? parseFloat(truckCapacity) : 0,
      binderPct: showBinder && binderPct ? parseFloat(binderPct) : 0,
    };

    return calcMaterial(input);
  }, [
    sections,
    thickness,
    thicknessUnit,
    densityValue,
    densityUnit,
    wastePct,
    pricePerTon,
    truckCapacity,
    showBinder,
    binderPct,
  ]);

  const handleCopyResults = () => {
    if (!calcOutput.ok) return;
    const r = calcOutput;
    const summary = [
      `Asphalt Calculator Estimate (KKCTools)`,
      `---------------------------------------`,
      `Order with ${wastePct}% waste: ${r.order.tons.toFixed(2)} US tons (${r.order.tonnes.toFixed(2)} tonnes)`,
      `Suggested order (rounded): ${r.suggestedOrderTons} tons`,
      `Exact weight: ${r.exact.tons.toFixed(2)} tons (${Math.round(r.exact.pounds).toLocaleString()} lb)`,
      `Volume: ${r.order.cubicYards.toFixed(2)} cu yd (${r.order.cubicMeters.toFixed(2)} m³)`,
      `Total area: ${r.areaSqFt.toFixed(1)} sq ft (${r.areaSqM.toFixed(1)} m²)`,
      `Thickness: ${r.thicknessIn.toFixed(1)} in (${thickness} ${thicknessUnit})`,
      r.materialCost ? `Estimated material cost: $${r.materialCost.toFixed(2)}` : null,
      r.truckloads ? `Estimated truckloads: ${r.truckloads.toFixed(2)} loads` : null,
      r.binderTons ? `Estimated bitumen binder: ${r.binderTons.toFixed(2)} tons` : null,
      `https://kkctools.com/asphalt-calculator/`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isResValid = calcOutput.ok;
  const res = isResValid ? (calcOutput as MaterialCalcResult) : null;

  return (
    <div className={styles.toolCard}>
      {/* Top Toggle Controls */}
      <div className={styles.toggleRow}>
        <div className={styles.segmentedControl} role="radiogroup" aria-label="Material Type">
          <button
            type="button"
            className={`${styles.segmentBtn} ${material === 'hotmix' ? styles.segmentBtnActive : ''}`}
            onClick={() => handleMaterialChange('hotmix')}
            aria-pressed={material === 'hotmix'}
          >
            Hot mix asphalt
          </button>
          <button
            type="button"
            className={`${styles.segmentBtn} ${material === 'millings' ? styles.segmentBtnActive : ''}`}
            onClick={() => handleMaterialChange('millings')}
            aria-pressed={material === 'millings'}
          >
            Millings (RAP)
          </button>
        </div>

        <div className={styles.segmentedControl} role="radiogroup" aria-label="Unit System">
          <button
            type="button"
            className={`${styles.segmentBtn} ${unitSystem === 'imperial' ? styles.segmentBtnActive : ''}`}
            onClick={() => handleUnitSystemChange('imperial')}
            aria-pressed={unitSystem === 'imperial'}
          >
            Imperial (ft / in)
          </button>
          <button
            type="button"
            className={`${styles.segmentBtn} ${unitSystem === 'metric' ? styles.segmentBtnActive : ''}`}
            onClick={() => handleUnitSystemChange('metric')}
            aria-pressed={unitSystem === 'metric'}
          >
            Metric (m / mm)
          </button>
        </div>
      </div>

      <div className={styles.toolLayout} style={{ marginTop: 'var(--space-5)' }}>
        {/* Left Column: Inputs */}
        <div className={styles.inputsCol}>
          {/* Section(s) Manager */}
          <div>
            <div className={styles.sectionsHeader}>
              <span className={styles.sectionTitle}>
                Paving Area {sections.length > 1 ? `(${sections.length} Sections)` : ''}
              </span>
              {sections.length < 10 && (
                <button type="button" onClick={addSection} className={styles.addSectionBtn}>
                  + Add section
                </button>
              )}
            </div>

            {sections.map((sec, idx) => (
              <div key={sec.id} className={styles.sectionBlock}>
                <div className={styles.sectionBlockTop}>
                  <span className={styles.sectionIndexLabel}>Section {idx + 1}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                      className={styles.unitSelect}
                      style={{ width: '110px' }}
                      value={sec.shape}
                      onChange={(e) => updateSection(sec.id, { shape: e.target.value as ShapeType })}
                      aria-label={`Shape for section ${idx + 1}`}
                    >
                      <option value="rectangle">Rectangle</option>
                      <option value="circle">Circle</option>
                      <option value="triangle">Triangle</option>
                      <option value="area">Known area</option>
                    </select>

                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(sec.id)}
                        className={styles.removeSectionBtn}
                        aria-label={`Remove section ${idx + 1}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Shape Dimension Inputs */}
                {sec.shape === 'rectangle' && (
                  <div className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Length</label>
                      <div className={styles.inputUnitRow}>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={sec.length}
                          onChange={(e) => updateSection(sec.id, { length: e.target.value })}
                          className={styles.inputField}
                          placeholder="40"
                        />
                        <select aria-label="Length unit"
                          className={styles.unitSelect}
                          value={sec.lengthUnit}
                          onChange={(e) => updateSection(sec.id, { lengthUnit: e.target.value as LengthUnit })}
                        >
                          <option value="ft">ft</option>
                          <option value="in">in</option>
                          <option value="yd">yd</option>
                          <option value="m">m</option>
                          <option value="cm">cm</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Width</label>
                      <div className={styles.inputUnitRow}>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={sec.width}
                          onChange={(e) => updateSection(sec.id, { width: e.target.value })}
                          className={styles.inputField}
                          placeholder="20"
                        />
                        <select aria-label="Width unit"
                          className={styles.unitSelect}
                          value={sec.widthUnit}
                          onChange={(e) => updateSection(sec.id, { widthUnit: e.target.value as LengthUnit })}
                        >
                          <option value="ft">ft</option>
                          <option value="in">in</option>
                          <option value="yd">yd</option>
                          <option value="m">m</option>
                          <option value="cm">cm</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {sec.shape === 'circle' && (
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Diameter</label>
                    <div className={styles.inputUnitRow}>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="any"
                        value={sec.diameter}
                        onChange={(e) => updateSection(sec.id, { diameter: e.target.value })}
                        className={styles.inputField}
                        placeholder="20"
                      />
                      <select aria-label="Diameter unit"
                        className={styles.unitSelect}
                        value={sec.diameterUnit}
                        onChange={(e) => updateSection(sec.id, { diameterUnit: e.target.value as LengthUnit })}
                      >
                        <option value="ft">ft</option>
                        <option value="in">in</option>
                        <option value="yd">yd</option>
                        <option value="m">m</option>
                      </select>
                    </div>
                  </div>
                )}

                {sec.shape === 'triangle' && (
                  <div className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Base</label>
                      <div className={styles.inputUnitRow}>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={sec.base}
                          onChange={(e) => updateSection(sec.id, { base: e.target.value })}
                          className={styles.inputField}
                          placeholder="30"
                        />
                        <select aria-label="Base unit"
                          className={styles.unitSelect}
                          value={sec.baseUnit}
                          onChange={(e) => updateSection(sec.id, { baseUnit: e.target.value as LengthUnit })}
                        >
                          <option value="ft">ft</option>
                          <option value="in">in</option>
                          <option value="yd">yd</option>
                          <option value="m">m</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Height</label>
                      <div className={styles.inputUnitRow}>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={sec.height}
                          onChange={(e) => updateSection(sec.id, { height: e.target.value })}
                          className={styles.inputField}
                          placeholder="20"
                        />
                        <select aria-label="Height unit"
                          className={styles.unitSelect}
                          value={sec.heightUnit}
                          onChange={(e) => updateSection(sec.id, { heightUnit: e.target.value as LengthUnit })}
                        >
                          <option value="ft">ft</option>
                          <option value="in">in</option>
                          <option value="yd">yd</option>
                          <option value="m">m</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {sec.shape === 'area' && (
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Total Known Area</label>
                    <div className={styles.inputUnitRow}>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="any"
                        value={sec.area}
                        onChange={(e) => updateSection(sec.id, { area: e.target.value })}
                        className={styles.inputField}
                        placeholder="800"
                      />
                      <select aria-label="Area unit"
                        className={styles.unitSelect}
                        value={sec.areaUnit}
                        onChange={(e) => updateSection(sec.id, { areaUnit: e.target.value as AreaUnit })}
                      >
                        <option value="sqft">sq ft</option>
                        <option value="sqyd">sq yd</option>
                        <option value="sqm">sq m</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Thickness & Quick Chips */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Compacted Thickness</label>
            <div className={styles.inputUnitRow}>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                max="24"
                step="any"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className={styles.inputField}
                placeholder="2"
              />
              <select aria-label="Thickness unit"
                className={styles.unitSelect}
                value={thicknessUnit}
                onChange={(e) => setThicknessUnit(e.target.value as LengthUnit)}
              >
                <option value="in">in</option>
                <option value="cm">cm</option>
                <option value="mm">mm</option>
                <option value="ft">ft</option>
              </select>
            </div>
            {unitSystem === 'imperial' && (
              <div className={styles.chipsRow}>
                {['1.5', '2', '2.5', '3', '4'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`${styles.chip} ${thickness === val && thicknessUnit === 'in' ? styles.chipActive : ''}`}
                    onClick={() => {
                      setThickness(val);
                      setThicknessUnit('in');
                    }}
                  >
                    {val} in
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Waste / Overage % */}
          <div className={styles.fieldGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className={styles.fieldLabel}>Waste / Overage Percentage</label>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }} title="Covers uneven base, edge spread and spillage.">
                (?) Base spread
              </span>
            </div>
            <div className={styles.inputUnitRow}>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                max="50"
                step="any"
                value={wastePct}
                onChange={(e) => setWastePct(e.target.value)}
                className={styles.inputField}
                placeholder="5"
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--ink-2)', paddingRight: '4px' }}>%</span>
            </div>
            <div className={styles.chipsRow}>
              {['0', '5', '10'].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`${styles.chip} ${wastePct === val ? styles.chipActive : ''}`}
                  onClick={() => setWastePct(val)}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* Optional Price Per Ton */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Price Per Ton (USD, Optional)</label>
            <div className={styles.inputUnitRow}>
              <span style={{ fontSize: '0.9rem', color: 'var(--muted)', paddingLeft: '4px' }}>$</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={pricePerTon}
                onChange={(e) => setPricePerTon(e.target.value)}
                className={styles.inputField}
                placeholder="e.g. 100"
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)', paddingRight: '4px' }}>/ ton</span>
            </div>
          </div>

          {/* Advanced Collapsible Details */}
          <details className={styles.advancedDetails}>
            <summary className={styles.advancedSummary}>
              <span>Advanced Options (Density, Truckloads &amp; Binder)</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>▼</span>
            </summary>

            <div className={styles.advancedContent}>
              {/* Density Preset & Value */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Density Preset</label>
                <select aria-label="Density Preset"
                  className={styles.unitSelect}
                  style={{ width: '100%', height: '42px' }}
                  value={densityPreset}
                  onChange={(e) => handleDensityPresetChange(e.target.value as DensityPresetKey)}
                >
                  <option value="hotmix_std">Hot mix (standard) — 145 lb/ft³</option>
                  <option value="open_graded">Open-graded / porous — 125 lb/ft³</option>
                  <option value="millings">Millings (RAP) — 110 lb/ft³</option>
                  <option value="custom">Custom Density</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Density Value</label>
                <div className={styles.inputUnitRow}>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={densityValue}
                    onChange={(e) => {
                      setDensityValue(e.target.value);
                      setDensityPreset('custom');
                    }}
                    className={styles.inputField}
                  />
                  <select aria-label="Density unit"
                    className={styles.unitSelect}
                    value={densityUnit}
                    onChange={(e) => {
                      setDensityUnit(e.target.value as DensityUnit);
                      setDensityPreset('custom');
                    }}
                  >
                    <option value="lb/ft3">lb/ft³</option>
                    <option value="kg/m3">kg/m³</option>
                    <option value="tons/yd3">tons/yd³</option>
                    <option value="lb/yd3">lb/yd³</option>
                  </select>
                </div>
              </div>

              {/* Truck Capacity */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Truck Capacity (US Tons, Optional)</label>
                <input aria-label="Truck Capacity (US Tons, Optional)"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={truckCapacity}
                  onChange={(e) => setTruckCapacity(e.target.value)}
                  className={styles.inputField}
                  placeholder="e.g. 20 (tri-axle)"
                />
              </div>

              {/* Bitumen Binder Estimate */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={showBinder}
                    onChange={(e) => setShowBinder(e.target.checked)}
                  />
                  <strong>Show bitumen (binder) estimate</strong>
                </label>

                {showBinder && (
                  <div className={styles.fieldGroup} style={{ paddingLeft: '24px' }}>
                    <label className={styles.fieldLabel}>Binder Content Percentage (Typical 4–6%)</label>
                    <div className={styles.inputUnitRow}>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="1"
                        max="15"
                        step="any"
                        value={binderPct}
                        onChange={(e) => setBinderPct(e.target.value)}
                        className={styles.inputField}
                      />
                      <span style={{ fontSize: '0.9rem', color: 'var(--ink-2)', paddingRight: '4px' }}>%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </details>

          {/* Action Buttons: Reset & Copy */}
          <div className={styles.btnRow}>
            <button type="button" onClick={handleReset} className={styles.actionBtn}>
              ↺ Reset
            </button>
            <button
              type="button"
              onClick={handleCopyResults}
              disabled={!isResValid}
              className={`${styles.actionBtn} ${copied ? styles.copiedBtn : ''}`}
            >
              {copied ? '✓ Copied!' : '📋 Copy Results'}
            </button>
          </div>
        </div>

        {/* Right Column: Live Results */}
        <div className={styles.resultsCol} aria-live="polite">
          <div className={styles.resultsCard}>
            {isResValid && res ? (
              <>
                {/* Hero Order Banner */}
                <div className={styles.heroOrderBox}>
                  <div className={styles.heroOrderHeadline}>
                    Order about {res.order.tons.toFixed(2)} tons
                  </div>
                  <p className={styles.heroOrderSub}>
                    {res.exact.tons.toFixed(2)} tons exact + {wastePct}% waste factor
                  </p>
                  <div className={styles.suggestedOrder}>
                    Suggested order (rounded to 0.5 ton): <strong>{res.suggestedOrderTons.toFixed(1)} tons</strong>
                  </div>
                </div>

                {/* Primary Comparison Table */}
                <table className={styles.resultsTable}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeader}>Quantity</th>
                      <th className={styles.tableHeader}>Exact</th>
                      <th className={styles.tableHeader}>With Waste</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>US Short Tons</td>
                      <td className={styles.resultValueHighlight}>{res.exact.tons.toFixed(2)}</td>
                      <td className={styles.resultValueHighlight}>{res.order.tons.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Metric Tonnes</td>
                      <td>{res.exact.tonnes.toFixed(2)}</td>
                      <td>{res.order.tonnes.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Pounds (lb)</td>
                      <td>{Math.round(res.exact.pounds).toLocaleString()}</td>
                      <td>{Math.round(res.order.pounds).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Cubic Yards (yd³)</td>
                      <td>{res.exact.cubicYards.toFixed(2)}</td>
                      <td>{res.order.cubicYards.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Cubic Feet (ft³)</td>
                      <td>{res.exact.cubicFeet.toFixed(1)}</td>
                      <td>{res.order.cubicFeet.toFixed(1)}</td>
                    </tr>
                    <tr>
                      <td>Cubic Meters (m³)</td>
                      <td>{res.exact.cubicMeters.toFixed(2)}</td>
                      <td>{res.order.cubicMeters.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Secondary Metrics */}
                <div className={styles.infoRowsList}>
                  <div className={styles.infoRowItem}>
                    <span className={styles.infoRowLabel}>Total Area:</span>
                    <span className={styles.infoRowValue}>
                      {res.areaSqFt.toFixed(1)} sq ft · {res.areaSqYd.toFixed(1)} sq yd · {res.areaSqM.toFixed(1)} m²
                    </span>
                  </div>
                  <div className={styles.infoRowItem}>
                    <span className={styles.infoRowLabel}>Coverage per Ton:</span>
                    <span className={styles.infoRowValue}>
                      ≈ {res.coverageSqFtPerTon.toFixed(1)} sq ft / ton
                    </span>
                  </div>
                  <div className={styles.infoRowItem}>
                    <span className={styles.infoRowLabel}>Compacted Density:</span>
                    <span className={styles.infoRowValue}>
                      {res.densityLbFt3.toFixed(1)} lb/ft³ ({res.densityTonsPerYd3.toFixed(2)} tons/yd³)
                    </span>
                  </div>
                  {res.materialCost !== undefined && (
                    <div className={styles.infoRowItem}>
                      <span className={styles.infoRowLabel}>Estimated Material Cost:</span>
                      <span className={styles.infoRowValue} style={{ color: 'var(--success)' }}>
                        ${res.materialCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  {res.truckloads !== undefined && (
                    <div className={styles.infoRowItem}>
                      <span className={styles.infoRowLabel}>Approx. Truckloads:</span>
                      <span className={styles.infoRowValue}>
                        ≈ {res.truckloads.toFixed(2)} loads ({truckCapacity}t truck)
                      </span>
                    </div>
                  )}
                  {res.binderTons !== undefined && (
                    <div className={styles.infoRowItem}>
                      <span className={styles.infoRowLabel}>Bitumen Binder ({binderPct}%):</span>
                      <span className={styles.infoRowValue}>
                        ≈ {res.binderTons.toFixed(2)} tons binder
                      </span>
                    </div>
                  )}
                </div>

                {/* Calculation Steps Accordion */}
                <details className={styles.advancedDetails} style={{ marginTop: 'var(--space-2)' }}>
                  <summary className={styles.advancedSummary} style={{ fontSize: '0.85rem' }}>
                    <span>Show calculation steps</span>
                    <span>▾</span>
                  </summary>
                  <div className={styles.calcSteps} style={{ marginTop: '8px' }}>
                    <ol>
                      <li>Area = {res.areaSqFt.toFixed(1)} sq ft</li>
                      <li>
                        Volume = {res.areaSqFt.toFixed(1)} × {res.thicknessIn.toFixed(1)} in ÷ 12 ={' '}
                        {res.exact.cubicFeet.toFixed(1)} ft³ ({res.exact.cubicYards.toFixed(2)} yd³)
                      </li>
                      <li>
                        Weight = {res.exact.cubicFeet.toFixed(1)} × {res.densityLbFt3.toFixed(1)} ={' '}
                        {Math.round(res.exact.pounds).toLocaleString()} lb
                      </li>
                      <li>
                        Tons = {Math.round(res.exact.pounds).toLocaleString()} ÷ 2,000 = {res.exact.tons.toFixed(2)} tons
                      </li>
                      <li>
                        Order = {res.exact.tons.toFixed(2)} × (1 + {wastePct}%) ={' '}
                        <strong>{res.order.tons.toFixed(2)} tons</strong>
                      </li>
                      {res.materialCost !== undefined && (
                        <li>
                          Cost = {res.order.tons.toFixed(2)} × ${pricePerTon} = ${res.materialCost.toFixed(2)}
                        </li>
                      )}
                    </ol>
                  </div>
                </details>

                <p className={styles.resultsFootnote}>
                  Estimate only. Includes asphalt mix only — tack coat, base stone, sealer and labor are not included.
                </p>
              </>
            ) : (
              <div className={styles.errorAlert}>
                <strong>Please verify inputs:</strong>
                <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                  {!calcOutput.ok && calcOutput.errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

