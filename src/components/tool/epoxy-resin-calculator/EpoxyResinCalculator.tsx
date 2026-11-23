'use client';

import React, { useState, useEffect, useMemo, useId } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import EpoxyInputGuide from './EpoxyInputGuide';
import styles from './EpoxyResinCalculator.module.css';
import {
  rectVolumeIn3,
  circleVolumeIn3,
  cylinderVolumeIn3,
  boxVolumeIn3,
  applyAllowances,
  mixSplit,
  pourPlan,
  kitPlan,
  STANDARD_KITS,
  IN3_PER_FL_OZ,
} from '@/lib/epoxy-engine';

type TabType = 'coating' | 'deep' | 'mold' | 'known';
type UnitType = 'in' | 'cm';

const TABS: TabItem<TabType>[] = [
  { id: 'coating', label: 'Coating (Table / Art)' },
  { id: 'deep', label: 'Deep Pour / River' },
  { id: 'mold', label: 'Silicone Mold & Casting' },
  { id: 'known', label: 'Known Volume & Mix' },
];

export default function EpoxyResinCalculator() {
  const fieldId = useId();
  const [tab, setTab] = useState<TabType>('coating');
  const [unit, setUnit] = useState<UnitType>('in');

  // Input states
  const [shape, setShape] = useState<'rectangle' | 'circle' | 'cylinder' | 'box'>('rectangle');
  const [length, setLength] = useState<number>(48);
  const [width, setWidth] = useState<number>(24);
  const [thickness, setThickness] = useState<number>(0.125); // 1/8 in
  const [edgePct, setEdgePct] = useState<number>(0);
  const [wastePct, setWastePct] = useState<number>(10);

  // Mix ratio
  const [ratioA, setRatioA] = useState<number>(1);
  const [ratioB, setRatioB] = useState<number>(1);
  const [mixMode, setMixMode] = useState<'volume' | 'weight'>('volume');
  const [densityA, setDensityA] = useState<number>(1.15); // typical example g/mL
  const [densityB, setDensityB] = useState<number>(0.98); // typical example g/mL

  // Deep pour tab specific
  const [maxLayerDepth, setMaxLayerDepth] = useState<number>(0.5);

  // Known volume tab specific
  const [knownFlOz, setKnownFlOz] = useState<number>(80);

  // Focus tracking for input guide
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // URL tab syncing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') as TabType;
        if (tabParam && ['coating', 'deep', 'mold', 'known'].includes(tabParam)) {
          setTab(tabParam);
        }
      };
      const timer = setTimeout(syncFromUrl, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTabChange = (newTab: TabType) => {
    setTab(newTab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab);
      window.history.replaceState({}, '', url.toString());
    }
    // Set appropriate default dimensions per tab
    if (newTab === 'deep') {
      setThickness(1.5);
      setMaxLayerDepth(0.5);
    } else if (newTab === 'mold') {
      setShape('cylinder');
      setLength(4); // diameter
      setWidth(6); // height
      setThickness(0);
    } else if (newTab === 'coating') {
      setShape('rectangle');
      setLength(48);
      setWidth(24);
      setThickness(0.125);
    }
  };

  // Unit conversion helpers for input/output
  // In metric mode, dimensions are cm. 1 in = 2.54 cm.
  const toInches = (val: number) => (unit === 'cm' ? val / 2.54 : val);

  // Calculate base volume in cubic inches
  const baseIn3 = useMemo(() => {
    if (tab === 'known') {
      return knownFlOz * IN3_PER_FL_OZ;
    }

    const lIn = toInches(length);
    const wIn = toInches(width);
    const tIn = toInches(thickness);

    if (tab === 'mold') {
      if (shape === 'cylinder') {
        return cylinderVolumeIn3(lIn, wIn); // lIn is diameter, wIn is height
      }
      return boxVolumeIn3(lIn, wIn, tIn);
    }

    if (shape === 'circle') {
      return circleVolumeIn3(lIn, tIn); // lIn is diameter
    }

    return rectVolumeIn3(lIn, wIn, tIn);
  }, [tab, shape, length, width, thickness, knownFlOz, unit]);

  // Apply allowances
  const allowances = useMemo(() => {
    return applyAllowances(baseIn3, edgePct, wastePct);
  }, [baseIn3, edgePct, wastePct]);

  // Mix split (Resin A vs Hardener B)
  const split = useMemo(() => {
    return mixSplit(
      allowances.totalIn3,
      ratioA,
      ratioB,
      mixMode,
      mixMode === 'weight' ? densityA : undefined,
      mixMode === 'weight' ? densityB : undefined
    );
  }, [allowances.totalIn3, ratioA, ratioB, mixMode, densityA, densityB]);

  // Pour plan for deep pours
  const pourPlanData = useMemo(() => {
    if (tab !== 'deep') return null;
    const depthIn = toInches(thickness);
    const maxLayerIn = toInches(maxLayerDepth);
    return pourPlan(depthIn, maxLayerIn, allowances.totalIn3, ratioA, ratioB);
  }, [tab, thickness, maxLayerDepth, allowances.totalIn3, ratioA, ratioB, unit]);

  // Kit plan
  const kitPlanData = useMemo(() => {
    return kitPlan(allowances.totalIn3, STANDARD_KITS);
  }, [allowances.totalIn3]);

  // Square foot coverage rate calculation
  const sqFtCoverage = useMemo(() => {
    if (thickness <= 0) return 0;
    const tIn = toInches(thickness);
    // 1 US Gallon = 231 in³. At thickness tIn: Sq Ft = (231 / tIn) / 144
    return (231 / tIn) / 144;
  }, [thickness, unit]);

  const copyResults = () => {
    const text = `Epoxy Calculation Results:\nTotal Mixed: ${split.totalVolume.flOz.toFixed(1)} fl oz (${split.totalVolume.usGal.toFixed(2)} US gal / ${split.totalVolume.ml.toFixed(0)} mL)\nPart A (Resin): ${split.volumeA.flOz.toFixed(1)} fl oz\nPart B (Hardener): ${split.volumeB.flOz.toFixed(1)} fl oz (Ratio ${ratioA}:${ratioB})\nCalculated at KKCTools.com`;
    navigator.clipboard.writeText(text);
    alert('Results copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.tabWrapper}>
          <TabSlider
            tabs={TABS}
            activeId={tab}
            onChange={handleTabChange}
            ariaLabel="Epoxy resin calculation modes"
          />
        </div>

        {/* Visual Input Guide Diagram */}
        <EpoxyInputGuide
          tab={tab}
          unit={unit}
          length={length}
          width={width}
          thickness={thickness}
          edgePct={edgePct}
          wastePct={wastePct}
          ratioA={ratioA}
          ratioB={ratioB}
          mixMode={mixMode}
          maxLayerDepth={maxLayerDepth}
          shape={shape}
          focusedField={focusedField}
        />

        {/* Controls Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>1. Project Dimensions & Shape</h2>
          <div className={styles.unitToggle} role="group" aria-label="Unit system">
            <button
              type="button"
              className={`${styles.unitBtn} ${unit === 'in' ? styles.unitBtnActive : ''}`}
              onClick={() => setUnit('in')}
            >
              Inches (in)
            </button>
            <button
              type="button"
              className={`${styles.unitBtn} ${unit === 'cm' ? styles.unitBtnActive : ''}`}
              onClick={() => setUnit('cm')}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {tab === 'known' ? (
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f0`} className={styles.label}>Known Total Volume (fl oz)</label>
              <input id={`${fieldId}-f0`}
                type="number"
                min="1"
                step="0.5"
                className={styles.input}
                value={knownFlOz}
                onChange={(e) => setKnownFlOz(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>
          </div>
        ) : tab === 'mold' ? (
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f1`} className={styles.label}>Mold Shape</label>
              <select id={`${fieldId}-f1`}
                className={styles.select}
                value={shape}
                onChange={(e) => setShape(e.target.value as 'cylinder' | 'box')}
              >
                <option value="cylinder">Cylindrical Mold (Diameter × Height)</option>
                <option value="box">Rectangular Box Mold (L × W × H)</option>
              </select>
            </div>
            {shape === 'cylinder' ? (
              <>
                <div className={styles.field}>
                  <label htmlFor={`${fieldId}-f2`} className={styles.label}>
                    <span>1 Diameter ({unit})</span>
                  </label>
                  <input id={`${fieldId}-f2`}
                    type="number"
                    min="0.1"
                    step="0.1"
                    className={styles.input}
                    value={length}
                    onFocus={() => setFocusedField('length')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setLength(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor={`${fieldId}-f3`} className={styles.label}>
                    <span>2 Mold Depth / Height ({unit})</span>
                  </label>
                  <input id={`${fieldId}-f3`}
                    type="number"
                    min="0.1"
                    step="0.1"
                    className={styles.input}
                    value={width}
                    onFocus={() => setFocusedField('width')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setWidth(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={styles.field}>
                  <label htmlFor={`${fieldId}-f4`} className={styles.label}>1 Length ({unit})</label>
                  <input id={`${fieldId}-f4`}
                    type="number"
                    min="0.1"
                    step="0.1"
                    className={styles.input}
                    value={length}
                    onFocus={() => setFocusedField('length')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setLength(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor={`${fieldId}-f5`} className={styles.label}>2 Width ({unit})</label>
                  <input id={`${fieldId}-f5`}
                    type="number"
                    min="0.1"
                    step="0.1"
                    className={styles.input}
                    value={width}
                    onFocus={() => setFocusedField('width')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setWidth(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor={`${fieldId}-f6`} className={styles.label}>3 Mold Height ({unit})</label>
                  <input id={`${fieldId}-f6`}
                    type="number"
                    min="0.1"
                    step="0.1"
                    className={styles.input}
                    value={thickness}
                    onFocus={() => setFocusedField('thickness')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setThickness(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Quick Coat Presets for Coating tab */}
            {tab === 'coating' && (
              <div className={styles.presetsRow}>
                <span className={styles.labelSub}>Thickness Presets:</span>
                <button
                  type="button"
                  className={styles.presetChip}
                  onClick={() => setThickness(unit === 'in' ? 0.125 : 0.32)}
                >
                  Standard Flood Coat (1/8&quot; · 3.2 mm)
                </button>
                <button
                  type="button"
                  className={styles.presetChip}
                  onClick={() => setThickness(unit === 'in' ? 0.0625 : 0.16)}
                >
                  Thin Seal Coat (1/16&quot; · 1.6 mm)
                </button>
                <button
                  type="button"
                  className={styles.presetChip}
                  onClick={() => setThickness(unit === 'in' ? 0.25 : 0.64)}
                >
                  Heavy Bar Top (1/4&quot; · 6.4 mm)
                </button>
              </div>
            )}

            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={`${fieldId}-f7`} className={styles.label}>Surface Shape</label>
                <select id={`${fieldId}-f7`}
                  className={styles.select}
                  value={shape}
                  onChange={(e) => setShape(e.target.value as 'rectangle' | 'circle')}
                >
                  <option value="rectangle">Rectangle (Table / Counter / Art Board)</option>
                  <option value="circle">Round / Circle (Diameter)</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor={`${fieldId}-f8`} className={styles.label}>
                  <span>1 {shape === 'circle' ? 'Diameter' : 'Length'} ({unit})</span>
                </label>
                <input id={`${fieldId}-f8`}
                  type="number"
                  min="0.1"
                  step="0.5"
                  className={styles.input}
                  value={length}
                  onFocus={() => setFocusedField('length')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setLength(Math.max(0, parseFloat(e.target.value) || 0))}
                />
              </div>

              {shape === 'rectangle' && (
                <div className={styles.field}>
                  <label htmlFor={`${fieldId}-f9`} className={styles.label}>
                    <span>2 Width ({unit})</span>
                  </label>
                  <input id={`${fieldId}-f9`}
                    type="number"
                    min="0.1"
                    step="0.5"
                    className={styles.input}
                    value={width}
                    onFocus={() => setFocusedField('width')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setWidth(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor={`${fieldId}-f10`} className={styles.label}>
                  <span>3 Pour / Coat Thickness ({unit})</span>
                </label>
                <input id={`${fieldId}-f10`}
                  type="number"
                  min="0.01"
                  step={unit === 'in' ? '0.0625' : '0.1'}
                  className={styles.input}
                  value={thickness}
                  onFocus={() => setFocusedField('thickness')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setThickness(Math.max(0, parseFloat(e.target.value) || 0))}
                />
              </div>
            </div>
          </>
        )}

        {/* Deep Pour: Max layer depth input */}
        {tab === 'deep' && (
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f11`} className={styles.label}>
                <span>7 Max Depth per Layer ({unit})</span>
                <span className={styles.labelSub}>from your product label</span>
              </label>
              <input id={`${fieldId}-f11`}
                type="number"
                min="0.1"
                step="0.25"
                className={styles.input}
                value={maxLayerDepth}
                onChange={(e) => setMaxLayerDepth(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              />
            </div>
          </div>
        )}

        {/* Allowances and Mix Ratio */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>2. Mix Ratio & Allowances</h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f12`} className={styles.label}>
              <span>4 Edge Drip Allowance (%)</span>
              <span className={styles.labelSub}>for self-leveling edges</span>
            </label>
            <input id={`${fieldId}-f12`}
              type="number"
              min="0"
              max="50"
              step="1"
              className={styles.input}
              value={edgePct}
              onChange={(e) => setEdgePct(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f13`} className={styles.label}>
              <span>5 Waste Allowance (%)</span>
              <span className={styles.labelSub}>cup clinging & mixing loss</span>
            </label>
            <input id={`${fieldId}-f13`}
              type="number"
              min="0"
              max="50"
              step="1"
              className={styles.input}
              value={wastePct}
              onChange={(e) => setWastePct(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f14`} className={styles.label}>
              <span>6 Mix Mode</span>
            </label>
            <select id={`${fieldId}-f14`}
              className={styles.select}
              value={mixMode}
              onChange={(e) => setMixMode(e.target.value as 'volume' | 'weight')}
            >
              <option value="volume">By Volume (Fluid Ounces / mL)</option>
              <option value="weight">By Weight (Grams / Ounces)</option>
            </select>
          </div>

          {mixMode === 'weight' && (
            <>
              <div className={styles.field}>
                <label htmlFor={`${fieldId}-f15`} className={styles.label}>
                  <span>Density A (g/mL)</span>
                  <span className={styles.labelSub}>example; enter your data sheet value</span>
                </label>
                <input id={`${fieldId}-f15`}
                  type="number"
                  min="0.5"
                  max="2.5"
                  step="0.01"
                  className={styles.input}
                  value={densityA}
                  onChange={(e) => setDensityA(Math.max(0.1, parseFloat(e.target.value) || 1.15))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor={`${fieldId}-f16`} className={styles.label}>
                  <span>Density B (g/mL)</span>
                  <span className={styles.labelSub}>example; enter your data sheet value</span>
                </label>
                <input id={`${fieldId}-f16`}
                  type="number"
                  min="0.5"
                  max="2.5"
                  step="0.01"
                  className={styles.input}
                  value={densityB}
                  onChange={(e) => setDensityB(Math.max(0.1, parseFloat(e.target.value) || 0.98))}
                />
              </div>
            </>
          )}

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f17`} className={styles.label}>
              <span>Part A : Part B Ratio</span>
              <span className={styles.labelSub}>example: check bottle label</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input id={`${fieldId}-f17`}
                type="number"
                min="1"
                step="1"
                className={styles.input}
                value={ratioA}
                onChange={(e) => setRatioA(Math.max(1, parseFloat(e.target.value) || 1))}
              />
              <span style={{ fontWeight: 700 }}>:</span>
              <input
                type="number"
                min="1"
                step="1"
                className={styles.input}
                value={ratioB}
                onChange={(e) => setRatioB(Math.max(1, parseFloat(e.target.value) || 1))}
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className={styles.resultsBand}>
          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>Total Mixed Epoxy Required</div>
            <div className={styles.heroValue}>
              {split.totalVolume.flOz.toFixed(1)} fl oz
            </div>
            <div className={styles.heroSub}>
              {split.totalVolume.usGal.toFixed(2)} US gal · {split.totalVolume.ml.toFixed(0)} mL ({split.totalVolume.liters.toFixed(2)} L)
            </div>
          </div>

          {/* Plain English Result Sentence */}
          <div className={styles.sentence}>
            A {length} × {width} {unit} surface at {thickness} {unit} thickness needs about{' '}
            <strong>{Math.round(split.totalVolume.flOz)} fl oz</strong> of mixed epoxy with {wastePct}% waste:
            roughly <strong>{Math.round(split.volumeA.flOz)} fl oz</strong> of resin and{' '}
            <strong>{Math.round(split.volumeB.flOz)} fl oz</strong> of hardener at a {ratioA}:{ratioB} ratio.
          </div>

          {/* A/B Breakdown Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Fluid Ounces</th>
                  <th>Milliliters (mL)</th>
                  {mixMode === 'weight' && <th>Grams (g)</th>}
                  {mixMode === 'weight' && <th>Ounces (wt oz)</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Part A (Resin)</strong></td>
                  <td>{split.volumeA.flOz.toFixed(1)} fl oz</td>
                  <td>{split.volumeA.ml.toFixed(0)} mL</td>
                  {mixMode === 'weight' && <td>{split.weightA_g ? split.weightA_g.toFixed(0) : '—'} g</td>}
                  {mixMode === 'weight' && <td>{split.weightA_oz ? split.weightA_oz.toFixed(1) : '—'} oz</td>}
                </tr>
                <tr>
                  <td><strong>Part B (Hardener)</strong></td>
                  <td>{split.volumeB.flOz.toFixed(1)} fl oz</td>
                  <td>{split.volumeB.ml.toFixed(0)} mL</td>
                  {mixMode === 'weight' && <td>{split.weightB_g ? split.weightB_g.toFixed(0) : '—'} g</td>}
                  {mixMode === 'weight' && <td>{split.weightB_oz ? split.weightB_oz.toFixed(1) : '—'} oz</td>}
                </tr>
                <tr>
                  <td><strong>Total Mixed</strong></td>
                  <td><strong>{split.totalVolume.flOz.toFixed(1)} fl oz</strong></td>
                  <td><strong>{split.totalVolume.ml.toFixed(0)} mL</strong></td>
                  {mixMode === 'weight' && <td><strong>{split.totalWeight_g ? split.totalWeight_g.toFixed(0) : '—'} g</strong></td>}
                  {mixMode === 'weight' && <td><strong>{split.totalWeight_oz ? split.totalWeight_oz.toFixed(1) : '—'} oz</strong></td>}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pour Plan if Deep Pour tab */}
          {tab === 'deep' && pourPlanData && (
            <div className={styles.kitBox}>
              <div className={styles.kitTitle}>Deep Pour Schedule ({pourPlanData.poursCount} Layer{pourPlanData.poursCount > 1 ? 's' : ''})</div>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: 'var(--ink)' }}>
                To prevent exothermic thermal runaway, divide the {thickness} {unit} depth into {pourPlanData.poursCount} separate pours of {pourPlanData.depthPerPourInches.toFixed(2)} {unit} each.
              </p>
              <ul className={styles.kitList}>
                {Array.from({ length: pourPlanData.poursCount }).map((_, i) => (
                  <li key={i}>
                    <strong>Pour #{i + 1}:</strong> {pourPlanData.volumePerPour.flOz.toFixed(1)} fl oz total ({pourPlanData.partAPerPour.flOz.toFixed(1)} fl oz Resin + {pourPlanData.partBPerPour.flOz.toFixed(1)} fl oz Hardener)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Kit Recommendation */}
          {kitPlanData.items.length > 0 && (
            <div className={styles.kitBox}>
              <div className={styles.kitTitle}>Recommended Kit Purchase</div>
              <ul className={styles.kitList}>
                {kitPlanData.items.map((it, idx) => (
                  <li key={idx}>
                    • {it.count} × {it.kit.name}
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                Estimated leftover: {kitPlanData.leftoverFlOz.toFixed(1)} fl oz ({kitPlanData.leftoverIn3.toFixed(1)} in³).
              </p>
            </div>
          )}

          {/* Coverage Rate */}
          {sqFtCoverage > 0 && tab === 'coating' && (
            <p style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', margin: '8px 0 0 0' }}>
              Coverage reference: 1 US gallon covers approximately {sqFtCoverage.toFixed(1)} sq ft at {thickness} {unit} thickness.
            </p>
          )}

          {/* Actions */}
          <div className={styles.actionBar}>
            <button type="button" className={styles.actionBtn} onClick={copyResults}>
              Copy Summary
            </button>
            <button type="button" className={styles.actionBtnSecondary} onClick={handlePrint}>
              Print Shopping List
            </button>
          </div>

          {/* Safety Notice */}
          <div className={styles.safetyNotice}>
            <div className={styles.safetyTitle}>Safety &amp; Exotherm Precaution</div>
            Work in a well-ventilated space, wear chemical-resistant nitrile gloves and safety glasses, and follow your product&apos;s Safety Data Sheet (SDS). Epoxy reactions generate exothermic heat—never exceed your resin manufacturer&apos;s stated maximum depth per pour.
          </div>
        </div>
      </div>
    </>
  );
}
