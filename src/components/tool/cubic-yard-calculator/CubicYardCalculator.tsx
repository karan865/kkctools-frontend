'use client';

import React, { useState, useMemo } from 'react';
import {
  calcVolume,
  VolumeLengthUnit,
  VolumeUnit,
  VolumeDensityUnit,
  VolumeSectionInput,
  VolumeCalcInput,
  VolumeCalcResult,
} from '@/lib/volume-engine';
import styles from './CubicYardCalculator.module.css';

type MaterialType = 'concrete' | 'other';
type UnitSystem = 'imperial' | 'metric';
type SectionType = 'slab' | 'footing' | 'wall' | 'column' | 'box' | 'volume';

interface SectionState {
  id: string;
  type: SectionType;
  label: string;
  qty: string;
  // Dimensions
  length: string;
  lengthUnit: VolumeLengthUnit;
  width: string;
  widthUnit: VolumeLengthUnit;
  depth: string;
  depthUnit: VolumeLengthUnit;
  diameter: string;
  diameterUnit: VolumeLengthUnit;
  height: string;
  heightUnit: VolumeLengthUnit;
  volume: string;
  volumeUnit: VolumeUnit;
}

const DEFAULT_SECTION: SectionState = {
  id: '1',
  type: 'slab',
  label: 'Patio',
  qty: '1',
  length: '10',
  lengthUnit: 'ft',
  width: '12',
  widthUnit: 'ft',
  depth: '4',
  depthUnit: 'in',
  diameter: '12',
  diameterUnit: 'in',
  height: '4',
  heightUnit: 'ft',
  volume: '100',
  volumeUnit: 'ft3',
};

export default function CubicYardCalculator() {
  const [material, setMaterial] = useState<MaterialType>('concrete');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [sections, setSections] = useState<SectionState[]>([DEFAULT_SECTION]);

  // Waste %: Concrete 10%, Other 5%
  const [wastePct, setWastePct] = useState<string>('10');
  const [userEditedWaste, setUserEditedWaste] = useState<boolean>(false);

  // Advanced Density Options
  const [densityPreset, setDensityPreset] = useState<'normal_concrete' | 'custom' | 'none'>('normal_concrete');
  const [densityValue, setDensityValue] = useState<string>('150');
  const [densityUnit, setDensityUnit] = useState<VolumeDensityUnit>('lb/ft3');

  // Copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Material Toggle handler
  const handleMaterialChange = (newMat: MaterialType) => {
    setMaterial(newMat);
    if (!userEditedWaste) {
      setWastePct(newMat === 'concrete' ? '10' : '5');
    }
    if (newMat === 'concrete') {
      setDensityPreset('normal_concrete');
      setDensityValue('150');
      setDensityUnit('lb/ft3');
    } else {
      setDensityPreset('none');
      setDensityValue('');
    }
  };

  // Unit System Toggle handler
  const handleUnitSystemChange = (sys: UnitSystem) => {
    setUnitSystem(sys);
    if (sys === 'metric') {
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          lengthUnit: 'm',
          widthUnit: 'm',
          depthUnit: 'mm',
          diameterUnit: 'mm',
          heightUnit: 'm',
          volumeUnit: 'm3',
        }))
      );
    } else {
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          lengthUnit: 'ft',
          widthUnit: 'ft',
          depthUnit: 'in',
          diameterUnit: 'in',
          heightUnit: 'ft',
          volumeUnit: 'ft3',
        }))
      );
    }
  };

  // Section manipulation
  const addSection = () => {
    if (sections.length >= 10) return;
    const newId = String(Date.now());
    const lengthU = unitSystem === 'metric' ? 'm' : 'ft';
    const depthU = unitSystem === 'metric' ? 'mm' : 'in';
    setSections([
      ...sections,
      {
        ...DEFAULT_SECTION,
        id: newId,
        type: 'slab',
        label: `Section ${sections.length + 1}`,
        length: '10',
        width: '10',
        depth: unitSystem === 'metric' ? '100' : '4',
        lengthUnit: lengthU,
        widthUnit: lengthU,
        depthUnit: depthU,
        diameterUnit: depthU,
        heightUnit: lengthU,
        volumeUnit: unitSystem === 'metric' ? 'm3' : 'ft3',
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

  // Reset tool
  const handleReset = () => {
    setMaterial('concrete');
    setUnitSystem('imperial');
    setSections([DEFAULT_SECTION]);
    setWastePct('10');
    setUserEditedWaste(false);
    setDensityPreset('normal_concrete');
    setDensityValue('150');
    setDensityUnit('lb/ft3');
    setCopied(false);
  };

  // Calculation Engine evaluation
  const calcOutput = useMemo(() => {
    const parsedSections: VolumeSectionInput[] = sections.map((s) => {
      const q = parseInt(s.qty, 10) || 1;
      const lbl = s.label.trim() || undefined;

      switch (s.type) {
        case 'footing':
          return {
            shape: 'rectangle',
            length: parseFloat(s.length) || 0,
            lengthUnit: s.lengthUnit,
            width: parseFloat(s.width) || 0,
            widthUnit: s.widthUnit,
            depth: parseFloat(s.depth) || 0,
            depthUnit: s.depthUnit,
            qty: q,
            label: lbl,
          };
        case 'wall':
          return {
            shape: 'rectangle',
            length: parseFloat(s.length) || 0,
            lengthUnit: s.lengthUnit,
            width: parseFloat(s.height) || 0,
            widthUnit: s.heightUnit,
            depth: parseFloat(s.depth) || 0,
            depthUnit: s.depthUnit,
            qty: q,
            label: lbl,
          };
        case 'column':
          return {
            shape: 'circle',
            diameter: parseFloat(s.diameter) || 0,
            diameterUnit: s.diameterUnit,
            depth: parseFloat(s.height) || 0,
            depthUnit: s.heightUnit,
            qty: q,
            label: lbl,
          };
        case 'volume':
          return {
            shape: 'volume',
            volume: parseFloat(s.volume) || 0,
            volumeUnit: s.volumeUnit,
            qty: q,
            label: lbl,
          };
        case 'box':
        case 'slab':
        default:
          return {
            shape: 'rectangle',
            length: parseFloat(s.length) || 0,
            lengthUnit: s.lengthUnit,
            width: parseFloat(s.width) || 0,
            widthUnit: s.widthUnit,
            depth: parseFloat(s.depth) || 0,
            depthUnit: s.depthUnit,
            qty: q,
            label: lbl,
          };
      }
    });

    const input: VolumeCalcInput = {
      material,
      wastePct: parseFloat(wastePct) || 0,
      sections: parsedSections,
      density: densityValue ? parseFloat(densityValue) : undefined,
      densityUnit,
    };

    return calcVolume(input);
  }, [material, wastePct, sections, densityValue, densityUnit]);

  const handleCopyResults = () => {
    if (!calcOutput.ok) return;
    const r = calcOutput;
    const summary = [
      `Cubic Yard Calculator Estimate (KKCTools)`,
      `---------------------------------------`,
      `Order with ${wastePct}% waste: ${r.order.yd3.toFixed(2)} cu yd (${r.order.m3.toFixed(2)} m³ · ${r.order.ft3.toFixed(1)} ft³)`,
      r.suggestedOrderYd3 ? `Ready-mix order (rounded ¼ yd³): ${r.suggestedOrderYd3.toFixed(2)} yd³` : null,
      `Exact volume: ${r.exact.yd3.toFixed(2)} yd³ (${r.exact.ft3.toFixed(1)} ft³)`,
      r.weightOrder ? `Estimated weight: ${Math.round(r.weightOrder.pounds).toLocaleString()} lb (${r.weightOrder.tons.toFixed(2)} US tons)` : null,
      r.bags
        ? `Bags needed (with waste): 80 lb: ${r.bags.find((b) => b.sizeLb === 80)?.bags} | 60 lb: ${r.bags.find((b) => b.sizeLb === 60)?.bags} | 50 lb: ${r.bags.find((b) => b.sizeLb === 50)?.bags} | 40 lb: ${r.bags.find((b) => b.sizeLb === 40)?.bags}`
        : null,
      r.breakdown.length > 1
        ? `Sections: ` + r.breakdown.map((b) => `${b.label}: ${b.yd3.toFixed(2)} yd³`).join(' | ')
        : null,
      `https://kkctools.com/cubic-yard-calculator/`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isResValid = calcOutput.ok;
  const res = isResValid ? (calcOutput as VolumeCalcResult) : null;

  return (
    <div className={styles.toolCard}>
      {/* Top Toggle Controls */}
      <div className={styles.toggleRow}>
        <div className={styles.segmentedControl} role="radiogroup" aria-label="Material Type">
          <button
            type="button"
            className={`${styles.segmentBtn} ${material === 'concrete' ? styles.segmentBtnActive : ''}`}
            onClick={() => handleMaterialChange('concrete')}
            aria-checked={material === 'concrete'}
          >
            Concrete
          </button>
          <button
            type="button"
            className={`${styles.segmentBtn} ${material === 'other' ? styles.segmentBtnActive : ''}`}
            onClick={() => handleMaterialChange('other')}
            aria-checked={material === 'other'}
          >
            Other (soil, mulch, gravel)
          </button>
        </div>

        <div className={styles.segmentedControl} role="radiogroup" aria-label="Unit System">
          <button
            type="button"
            className={`${styles.segmentBtn} ${unitSystem === 'imperial' ? styles.segmentBtnActive : ''}`}
            onClick={() => handleUnitSystemChange('imperial')}
            aria-checked={unitSystem === 'imperial'}
          >
            Imperial (ft / in)
          </button>
          <button
            type="button"
            className={`${styles.segmentBtn} ${unitSystem === 'metric' ? styles.segmentBtnActive : ''}`}
            onClick={() => handleUnitSystemChange('metric')}
            aria-checked={unitSystem === 'metric'}
          >
            Metric (m / mm)
          </button>
        </div>
      </div>

      <div className={styles.toolLayout} style={{ marginTop: 'var(--space-5)' }}>
        {/* Left Column: Inputs */}
        <div className={styles.inputsCol}>
          <div>
            <div className={styles.sectionsHeader}>
              <span className={styles.sectionTitle}>
                Project Sections {sections.length > 1 ? `(${sections.length})` : ''}
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
                  <input
                    type="text"
                    value={sec.label}
                    maxLength={30}
                    onChange={(e) => updateSection(sec.id, { label: e.target.value })}
                    className={styles.sectionLabelInput}
                    placeholder={`Section ${idx + 1}`}
                    aria-label={`Label for section ${idx + 1}`}
                  />

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                      className={styles.unitSelect}
                      style={{ width: '150px' }}
                      value={sec.type}
                      onChange={(e) => updateSection(sec.id, { type: e.target.value as SectionType })}
                      aria-label={`Type for section ${idx + 1}`}
                    >
                      <option value="slab">Slab / patio / driveway</option>
                      <option value="footing">Footing / trench</option>
                      <option value="wall">Wall</option>
                      <option value="column">Column / round hole</option>
                      <option value="box">Box (custom)</option>
                      <option value="volume">Known volume</option>
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

                {/* Section Specific Inputs */}
                {sec.type === 'slab' && (
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
                          placeholder="10"
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.lengthUnit}
                          onChange={(e) => updateSection(sec.id, { lengthUnit: e.target.value as VolumeLengthUnit })}
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
                          placeholder="12"
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.widthUnit}
                          onChange={(e) => updateSection(sec.id, { widthUnit: e.target.value as VolumeLengthUnit })}
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
                      <label className={styles.fieldLabel}>Thickness</label>
                      <div className={styles.inputUnitRow}>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={sec.depth}
                          onChange={(e) => updateSection(sec.id, { depth: e.target.value })}
                          className={styles.inputField}
                          placeholder="4"
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.depthUnit}
                          onChange={(e) => updateSection(sec.id, { depthUnit: e.target.value as VolumeLengthUnit })}
                        >
                          <option value="in">in</option>
                          <option value="ft">ft</option>
                          <option value="cm">cm</option>
                          <option value="mm">mm</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup} style={{ maxWidth: '90px' }}>
                      <label className={styles.fieldLabel}>Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        step="1"
                        value={sec.qty}
                        onChange={(e) => updateSection(sec.id, { qty: e.target.value })}
                        className={styles.inputField}
                        placeholder="1"
                      />
                    </div>
                  </div>
                )}

                {sec.type === 'footing' && (
                  <div className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Total Length (Run)</label>
                      <div className={styles.inputUnitRow}>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={sec.length}
                          onChange={(e) => updateSection(sec.id, { length: e.target.value })}
                          className={styles.inputField}
                          placeholder="100"
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.lengthUnit}
                          onChange={(e) => updateSection(sec.id, { lengthUnit: e.target.value as VolumeLengthUnit })}
                        >
                          <option value="ft">ft</option>
                          <option value="m">m</option>
                          <option value="yd">yd</option>
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
                          placeholder="16"
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.widthUnit}
                          onChange={(e) => updateSection(sec.id, { widthUnit: e.target.value as VolumeLengthUnit })}
                        >
                          <option value="in">in</option>
                          <option value="ft">ft</option>
                          <option value="cm">cm</option>
                          <option value="mm">mm</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Depth</label>
                      <div className={styles.inputUnitRow}>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={sec.depth}
                          onChange={(e) => updateSection(sec.id, { depth: e.target.value })}
                          className={styles.inputField}
                          placeholder="8"
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.depthUnit}
                          onChange={(e) => updateSection(sec.id, { depthUnit: e.target.value as VolumeLengthUnit })}
                        >
                          <option value="in">in</option>
                          <option value="ft">ft</option>
                          <option value="cm">cm</option>
                          <option value="mm">mm</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup} style={{ maxWidth: '90px' }}>
                      <label className={styles.fieldLabel}>Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        step="1"
                        value={sec.qty}
                        onChange={(e) => updateSection(sec.id, { qty: e.target.value })}
                        className={styles.inputField}
                      />
                    </div>
                  </div>
                )}

                {sec.type === 'wall' && (
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
                          placeholder="20"
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.lengthUnit}
                          onChange={(e) => updateSection(sec.id, { lengthUnit: e.target.value as VolumeLengthUnit })}
                        >
                          <option value="ft">ft</option>
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
                          placeholder="4"
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.heightUnit}
                          onChange={(e) => updateSection(sec.id, { heightUnit: e.target.value as VolumeLengthUnit })}
                        >
                          <option value="ft">ft</option>
                          <option value="m">m</option>
                          <option value="in">in</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Thickness</label>
                      <div className={styles.inputUnitRow}>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={sec.depth}
                          onChange={(e) => updateSection(sec.id, { depth: e.target.value })}
                          className={styles.inputField}
                          placeholder="8"
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.depthUnit}
                          onChange={(e) => updateSection(sec.id, { depthUnit: e.target.value as VolumeLengthUnit })}
                        >
                          <option value="in">in</option>
                          <option value="cm">cm</option>
                          <option value="mm">mm</option>
                          <option value="ft">ft</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup} style={{ maxWidth: '90px' }}>
                      <label className={styles.fieldLabel}>Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        step="1"
                        value={sec.qty}
                        onChange={(e) => updateSection(sec.id, { qty: e.target.value })}
                        className={styles.inputField}
                      />
                    </div>
                  </div>
                )}

                {sec.type === 'column' && (
                  <div className={styles.formGrid}>
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
                          placeholder="12"
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.diameterUnit}
                          onChange={(e) => updateSection(sec.id, { diameterUnit: e.target.value as VolumeLengthUnit })}
                        >
                          <option value="in">in</option>
                          <option value="ft">ft</option>
                          <option value="cm">cm</option>
                          <option value="mm">mm</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Height / Depth</label>
                      <div className={styles.inputUnitRow}>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={sec.height}
                          onChange={(e) => updateSection(sec.id, { height: e.target.value })}
                          className={styles.inputField}
                          placeholder="4"
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.heightUnit}
                          onChange={(e) => updateSection(sec.id, { heightUnit: e.target.value as VolumeLengthUnit })}
                        >
                          <option value="ft">ft</option>
                          <option value="in">in</option>
                          <option value="m">m</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup} style={{ maxWidth: '90px' }}>
                      <label className={styles.fieldLabel}>Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        step="1"
                        value={sec.qty}
                        onChange={(e) => updateSection(sec.id, { qty: e.target.value })}
                        className={styles.inputField}
                        placeholder="4"
                      />
                    </div>
                  </div>
                )}

                {sec.type === 'box' && (
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
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.lengthUnit}
                          onChange={(e) => updateSection(sec.id, { lengthUnit: e.target.value as VolumeLengthUnit })}
                        >
                          <option value="ft">ft</option>
                          <option value="in">in</option>
                          <option value="yd">yd</option>
                          <option value="m">m</option>
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
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.widthUnit}
                          onChange={(e) => updateSection(sec.id, { widthUnit: e.target.value as VolumeLengthUnit })}
                        >
                          <option value="ft">ft</option>
                          <option value="in">in</option>
                          <option value="yd">yd</option>
                          <option value="m">m</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Depth</label>
                      <div className={styles.inputUnitRow}>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={sec.depth}
                          onChange={(e) => updateSection(sec.id, { depth: e.target.value })}
                          className={styles.inputField}
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.depthUnit}
                          onChange={(e) => updateSection(sec.id, { depthUnit: e.target.value as VolumeLengthUnit })}
                        >
                          <option value="in">in</option>
                          <option value="ft">ft</option>
                          <option value="cm">cm</option>
                          <option value="mm">mm</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup} style={{ maxWidth: '90px' }}>
                      <label className={styles.fieldLabel}>Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        step="1"
                        value={sec.qty}
                        onChange={(e) => updateSection(sec.id, { qty: e.target.value })}
                        className={styles.inputField}
                      />
                    </div>
                  </div>
                )}

                {sec.type === 'volume' && (
                  <div className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Known Volume</label>
                      <div className={styles.inputUnitRow}>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={sec.volume}
                          onChange={(e) => updateSection(sec.id, { volume: e.target.value })}
                          className={styles.inputField}
                          placeholder="27"
                        />
                        <select
                          className={styles.unitSelect}
                          value={sec.volumeUnit}
                          onChange={(e) => updateSection(sec.id, { volumeUnit: e.target.value as VolumeUnit })}
                        >
                          <option value="ft3">ft³</option>
                          <option value="yd3">yd³</option>
                          <option value="m3">m³</option>
                          <option value="in3">in³</option>
                          <option value="l">L</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup} style={{ maxWidth: '90px' }}>
                      <label className={styles.fieldLabel}>Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        step="1"
                        value={sec.qty}
                        onChange={(e) => updateSection(sec.id, { qty: e.target.value })}
                        className={styles.inputField}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Waste / Overage % */}
          <div className={styles.fieldGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className={styles.fieldLabel}>Waste / Overage Percentage</label>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }} title="Extra for uneven subgrade, spillage and over-excavation.">
                (?) Subgrade spread
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
                onChange={(e) => {
                  setWastePct(e.target.value);
                  setUserEditedWaste(true);
                }}
                className={styles.inputField}
                placeholder="10"
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--ink-2)', paddingRight: '4px' }}>%</span>
            </div>
            <div className={styles.chipsRow}>
              {['0', '5', '10', '15'].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`${styles.chip} ${wastePct === val ? styles.chipActive : ''}`}
                  onClick={() => {
                    setWastePct(val);
                    setUserEditedWaste(true);
                  }}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Density (Collapsed) */}
          <details className={styles.advancedDetails}>
            <summary className={styles.advancedSummary}>
              <span>Advanced Options (Material Density &amp; Weight)</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>▼</span>
            </summary>

            <div className={styles.advancedContent}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Density Preset</label>
                <select
                  className={styles.unitSelect}
                  style={{ width: '100%', height: '42px' }}
                  value={densityPreset}
                  onChange={(e) => {
                    const val = e.target.value as 'normal_concrete' | 'custom' | 'none';
                    setDensityPreset(val);
                    if (val === 'normal_concrete') {
                      setDensityValue('150');
                      setDensityUnit('lb/ft3');
                    } else if (val === 'none') {
                      setDensityValue('');
                    }
                  }}
                >
                  <option value="normal_concrete">Normal concrete (150 lb/ft³)</option>
                  <option value="custom">Custom Density</option>
                  <option value="none">None (volume only)</option>
                </select>
              </div>

              {densityPreset !== 'none' && (
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
                      placeholder="150"
                    />
                    <select
                      className={styles.unitSelect}
                      value={densityUnit}
                      onChange={(e) => {
                        setDensityUnit(e.target.value as VolumeDensityUnit);
                        setDensityPreset('custom');
                      }}
                    >
                      <option value="lb/ft3">lb/ft³</option>
                      <option value="kg/m3">kg/m³</option>
                      <option value="lb/yd3">lb/yd³</option>
                      <option value="tons/yd3">tons/yd³</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </details>

          {/* Action Buttons */}
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
                    Order about {res.order.yd3.toFixed(2)} cubic yards
                  </div>
                  <p className={styles.heroOrderSub}>
                    {res.exact.yd3.toFixed(2)} yd³ exact + {wastePct}% waste factor
                  </p>
                  {material === 'concrete' && (
                    <div className={styles.suggestedOrder}>
                      Ready-mix order (rounded to ¼ yd³): <strong>{res.suggestedOrderYd3.toFixed(2)} yd³</strong>
                    </div>
                  )}
                </div>

                {/* Practical Guidance Callout (Concrete only) */}
                {material === 'concrete' && res.guidance && (
                  <div className={styles.guidanceBox}>
                    {res.guidance === 'bags' && 'At this size, bagged mix is usually the practical choice.'}
                    {res.guidance === 'compare' &&
                      'Compare bagged mix and ready-mix. Ask suppliers about minimum loads and short-load fees.'}
                    {res.guidance === 'ready-mix' &&
                      'At this size, ready-mix delivery is usually the practical choice. A full truck commonly holds around 8–10 yd³.'}
                  </div>
                )}

                {/* Volume Comparison Table */}
                <table className={styles.resultsTable}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeader}>Volume Unit</th>
                      <th className={styles.tableHeader}>Exact</th>
                      <th className={styles.tableHeader}>With Waste</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unitSystem === 'metric' ? (
                      <>
                        <tr>
                          <td>Cubic Meters (m³)</td>
                          <td className={styles.resultValueHighlight}>{res.exact.m3.toFixed(2)}</td>
                          <td className={styles.resultValueHighlight}>{res.order.m3.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Cubic Yards (yd³)</td>
                          <td>{res.exact.yd3.toFixed(2)}</td>
                          <td>{res.order.yd3.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Cubic Feet (ft³)</td>
                          <td>{res.exact.ft3.toFixed(1)}</td>
                          <td>{res.order.ft3.toFixed(1)}</td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr>
                          <td>Cubic Yards (yd³)</td>
                          <td className={styles.resultValueHighlight}>{res.exact.yd3.toFixed(2)}</td>
                          <td className={styles.resultValueHighlight}>{res.order.yd3.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Cubic Feet (ft³)</td>
                          <td>{res.exact.ft3.toFixed(1)}</td>
                          <td>{res.order.ft3.toFixed(1)}</td>
                        </tr>
                        <tr>
                          <td>Cubic Meters (m³)</td>
                          <td>{res.exact.m3.toFixed(2)}</td>
                          <td>{res.order.m3.toFixed(2)}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>

                {/* Concrete Bags Breakdown (Concrete only) */}
                {material === 'concrete' && res.bags && (
                  <div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ink)' }}>
                      Pre-mixed Concrete Bags Needed:
                    </span>
                    <div className={styles.bagsGrid}>
                      {res.bags.map((b) => (
                        <div key={b.sizeLb} className={styles.bagCard}>
                          <span className={styles.bagCount}>{b.bags}</span>
                          <span className={styles.bagLabel}>{b.sizeLb} lb bags ({b.yieldFt3} ft³ yield)</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px', marginBottom: 0 }}>
                      *Typical yields — check the yield printed on your bag.
                    </p>
                  </div>
                )}

                {/* Weight Breakdown (Shown for concrete or when density is set) */}
                {res.weightOrder && (
                  <table className={styles.resultsTable} style={{ marginTop: 'var(--space-2)' }}>
                    <thead>
                      <tr>
                        <th className={styles.tableHeader}>Weight Unit</th>
                        <th className={styles.tableHeader}>Exact</th>
                        <th className={styles.tableHeader}>With Waste</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Pounds (lb)</td>
                        <td>{Math.round(res.weightExact?.pounds || 0).toLocaleString()}</td>
                        <td>{Math.round(res.weightOrder.pounds).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>US Short Tons</td>
                        <td>{res.weightExact?.tons.toFixed(2)}</td>
                        <td>{res.weightOrder.tons.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Metric Tonnes</td>
                        <td>{res.weightExact?.tonnes.toFixed(2)}</td>
                        <td>{res.weightOrder.tonnes.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {/* Per-Section Breakdown (when >= 2 sections) */}
                {res.breakdown.length >= 2 && (
                  <div className={styles.breakdownList}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ink)' }}>
                      Section Breakdown:
                    </span>
                    {res.breakdown.map((b, i) => (
                      <div key={i} className={styles.breakdownItem}>
                        <span>{b.label}:</span>
                        <strong>
                          {b.yd3.toFixed(2)} yd³ ({b.ft3.toFixed(1)} ft³)
                        </strong>
                      </div>
                    ))}
                  </div>
                )}

                {/* Calculation Steps Accordion */}
                <details className={styles.advancedDetails} style={{ marginTop: 'var(--space-2)' }}>
                  <summary className={styles.advancedSummary} style={{ fontSize: '0.85rem' }}>
                    <span>Show calculation steps</span>
                    <span>▾</span>
                  </summary>
                  <div className={styles.calcSteps} style={{ marginTop: '8px' }}>
                    <ol>
                      {res.breakdown.map((b, i) => (
                        <li key={i}>
                          {b.label}: {b.ft3.toFixed(1)} ft³ ({b.yd3.toFixed(2)} yd³)
                        </li>
                      ))}
                      <li>Total exact volume: {res.exact.ft3.toFixed(1)} ft³ ÷ 27 = {res.exact.yd3.toFixed(2)} yd³</li>
                      <li>
                        Order volume (+{wastePct}% waste): {res.order.ft3.toFixed(1)} ft³ ÷ 27 ={' '}
                        <strong>{res.order.yd3.toFixed(2)} yd³</strong>
                      </li>
                      {material === 'concrete' && (
                        <li>
                          80 lb bags: {res.order.ft3.toFixed(1)} ft³ ÷ 0.60 ft³/bag ={' '}
                          {(res.order.ft3 / 0.6).toFixed(1)} →{' '}
                          <strong>{res.bags?.find((b) => b.sizeLb === 80)?.bags} bags</strong>
                        </li>
                      )}
                      {res.weightOrder && (
                        <li>
                          Weight: {res.order.ft3.toFixed(1)} ft³ × {res.densityLbFt3?.toFixed(0)} lb/ft³ ={' '}
                          {Math.round(res.weightOrder.pounds).toLocaleString()} lb ({res.weightOrder.tons.toFixed(2)} tons)
                        </li>
                      )}
                    </ol>
                  </div>
                </details>

                <p className={styles.resultsFootnote}>
                  Estimate only. Does not include price, delivery, rebar, forms or base material.
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

