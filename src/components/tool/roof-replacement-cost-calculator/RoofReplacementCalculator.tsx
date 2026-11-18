'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import styles from './RoofReplacementCalculator.module.css';
import {
  RoofPitchDiagram,
  RoofCrossSectionDiagram,
  CompareVisualBars,
} from './RoofDiagram';
import {
  ROOFING_MATERIALS,
  materialById,
  pitchFactor,
  calculateRoofReplacement,
  materialComparison,
  type RoofingMaterialId,
  type RoofingMaterialInfo,
  type RoofReplacementInput,
} from '@/lib/roof-replacement-engine';

const PITCH_PRESETS = [3, 4, 6, 8, 10, 12];

const ROOF_TABS: { id: 'quick' | 'detailed'; label: string }[] = [
  { id: 'quick', label: 'Quick Estimate' },
  { id: 'detailed', label: 'Detailed Breakdown' },
];

const REGIONAL_OPTIONS = [
  { label: 'National Average (1.0×)', value: 1.0 },
  { label: 'Low-Cost / Rural South / Midwest (0.85×)', value: 0.85 },
  { label: 'Mid-Cost / Suburban (1.00×)', value: 1.0 },
  { label: 'High-Cost / Northeast / West Coast (1.15×)', value: 1.15 },
  { label: 'Very High / Metro / Hawaii (1.30×)', value: 1.3 },
];

const MATERIAL_LIST: RoofingMaterialInfo[] = Object.values(ROOFING_MATERIALS);

function fmtCurrency(val: number): string {
  return `$${Math.round(val).toLocaleString('en-US')}`;
}

function fmtDec(val: number, decimals = 2): string {
  return (Math.round(val * 100) / 100).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function RoofReplacementCalculator() {
  const uid = useId();

  // Mode: Quick vs Detailed
  const [mode, setMode] = useState<'quick' | 'detailed'>('quick');

  // Core Inputs
  const [footprintSqFt, setFootprintSqFt] = useState<number>(2000);
  const [pitchRise, setPitchRise] = useState<number>(6);
  const [materialId, setMaterialId] = useState<RoofingMaterialId>('architectural');
  const [existingLayers, setExistingLayers] = useState<number>(1);

  // Detailed Inputs
  const [stories, setStories] = useState<'1' | '1.5' | '2' | '3'>('1');
  const [complexity, setComplexity] = useState<'simple' | 'hip' | 'complex'>('hip');
  const [overhangInches, setOverhangInches] = useState<number>(12);
  const [deckingPercent, setDeckingPercent] = useState<number>(10);
  const [underlaymentType, setUnderlaymentType] = useState<'synthetic' | 'felt15' | 'felt30'>('synthetic');
  const [includeIceWater, setIncludeIceWater] = useState<boolean>(true);
  const [includeDripEdge, setIncludeDripEdge] = useState<boolean>(true);
  const [includeRidgeVent, setIncludeRidgeVent] = useState<boolean>(true);
  const [pipeBootsCount, setPipeBootsCount] = useState<number>(3);
  const [chimneyCount, setChimneyCount] = useState<number>(1);
  const [includeGutters, setIncludeGutters] = useState<boolean>(false);
  const [permitFee, setPermitFee] = useState<number>(350);
  const [dumpsterCost, setDumpsterCost] = useState<number>(450);
  const [regionMultiplier, setRegionMultiplier] = useState<number>(1.0);
  const [contingencyPercent, setContingencyPercent] = useState<number>(10);

  // Custom price overrides
  const [customMaterialCost, setCustomMaterialCost] = useState<string>('');
  const [customLaborCost, setCustomLaborCost] = useState<string>('');
  const [customTearOffCost, setCustomTearOffCost] = useState<string>('');

  // Diagram tab: pitch vs cross-section
  const [diagramTab, setDiagramTab] = useState<'pitch' | 'layers'>('pitch');

  // Contractor Quote input
  const [contractorQuote, setContractorQuote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // URL state synchronization on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    const sq = p.get('sq');
    const pi = p.get('pitch');
    const mat = p.get('mat');
    const lay = p.get('layers');
    const st = p.get('stories');
    const comp = p.get('comp');

    /* eslint-disable react-hooks/set-state-in-effect */
    if (sq && !isNaN(Number(sq))) setFootprintSqFt(Math.max(100, Number(sq)));
    if (pi && !isNaN(Number(pi))) setPitchRise(Math.max(1, Number(pi)));
    if (mat && ROOFING_MATERIALS[mat as RoofingMaterialId]) setMaterialId(mat as RoofingMaterialId);
    if (lay !== null && !isNaN(Number(lay))) setExistingLayers(Math.max(0, Math.min(3, Number(lay))));
    if (st && (st === '1' || st === '1.5' || st === '2' || st === '3')) setStories(st);
    if (comp && (comp === 'simple' || comp === 'hip' || comp === 'complex')) setComplexity(comp);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Compute Engine Result
  const engineInput: RoofReplacementInput = useMemo(() => {
    return {
      mode,
      footprintSqFt: Math.max(100, footprintSqFt || 0),
      pitchRise: Math.max(1, pitchRise || 1),
      materialId,
      existingLayers: Math.max(0, existingLayers),
      stories,
      complexity,
      overhangInches: Math.max(0, overhangInches),
      deckingReplacePercent: Math.max(0, deckingPercent),
      underlaymentType,
      includeIceAndWater: includeIceWater,
      includeDripEdge,
      includeRidgeVent,
      pipeBootsCount: Math.max(0, pipeBootsCount),
      chimneyCount: Math.max(0, chimneyCount),
      includeGutters,
      permitFee: Math.max(0, permitFee),
      customDumpsterPrice: Math.max(0, dumpsterCost),
      regionMultiplier: Math.max(0.5, regionMultiplier),
      contingencyPercent: Math.max(0, contingencyPercent),
      customMaterialPerSquare: customMaterialCost ? Number(customMaterialCost) : undefined,
      customLaborPerSquare: customLaborCost ? Number(customLaborCost) : undefined,
      customTearOffPerSquare: customTearOffCost ? Number(customTearOffCost) : undefined,
    };
  }, [
    mode,
    footprintSqFt,
    pitchRise,
    materialId,
    existingLayers,
    stories,
    complexity,
    overhangInches,
    deckingPercent,
    underlaymentType,
    includeIceWater,
    includeDripEdge,
    includeRidgeVent,
    pipeBootsCount,
    chimneyCount,
    includeGutters,
    permitFee,
    dumpsterCost,
    regionMultiplier,
    contingencyPercent,
    customMaterialCost,
    customLaborCost,
    customTearOffCost,
  ]);

  const result = useMemo(() => calculateRoofReplacement(engineInput), [engineInput]);

  const pFactor = useMemo(() => pitchFactor(pitchRise), [pitchRise]);

  // Quote Check
  const quoteAnalysis = useMemo(() => {
    const q = Number(contractorQuote);
    if (!q || isNaN(q) || q <= 0) return null;
    return result.quoteCheck(q);
  }, [contractorQuote, result]);

  // Material Comparison matrix for current roof footprint
  const comparisonMatrix = useMemo(() => {
    return materialComparison(footprintSqFt, pitchRise, existingLayers);
  }, [footprintSqFt, pitchRise, existingLayers]);

  // Repair vs Overlay vs Replace options
  const repairOption = result.compareOptions.find((c) => c.type === 'repair');
  const overlayOption = result.compareOptions.find((c) => c.type === 'overlay');
  const replaceOption = result.compareOptions.find((c) => c.type === 'replacement');

  // Share URL handler
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams();
    p.set('sq', String(footprintSqFt));
    p.set('pitch', String(pitchRise));
    p.set('mat', materialId);
    p.set('layers', String(existingLayers));
    p.set('stories', String(stories));
    p.set('comp', complexity);
    const url = `${window.location.origin}${window.location.pathname}?${p.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleCopySummary = () => {
    const currentMat = materialById(materialId);
    const summary = `Roof Replacement Estimate (KKCTools)
Total: ${fmtCurrency(result.total)} (Range: ${fmtCurrency(result.low)} – ${fmtCurrency(result.high)})
Size: ${fmtDec(result.roofAreaSqFt, 0)} sq ft (${fmtDec(result.totalSquares, 1)} squares)
Cost / Square: ${fmtCurrency(result.costPerSquare)} | Cost / Sq Ft: $${fmtDec(result.costPerSqFt)}
Material: ${currentMat.label}
Tear-Off: ${existingLayers} layer(s) | Pitch: ${pitchRise}/12`;
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const currentMat = materialById(materialId);

  return (
    <div className={styles.wrap}>
      {/* Mode Switcher */}
      <TabSlider
        tabs={ROOF_TABS}
        activeId={mode}
        onChange={(id) => setMode(id as 'quick' | 'detailed')}
        ariaLabel="Calculation Mode"
      />

      <div className={styles.grid}>
        {/* INPUTS COLUMN */}
        <div className={styles.inputs}>
          {/* STEP 1: Roof Size & Pitch */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>1</span>
              <h2 className={styles.cardTitle}>Roof Dimensions & Pitch</h2>
            </div>

            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${uid}-footprint`}>
                  Home Footprint / Ground Area
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id={`${uid}-footprint`}
                    type="number"
                    min={200}
                    max={20000}
                    step={50}
                    value={footprintSqFt}
                    onChange={(e) => setFootprintSqFt(Number(e.target.value))}
                    className={`${styles.input} ${styles.inputWithBadge}`}
                  />
                  <span className={styles.unitBadge}>sq ft</span>
                </div>
                <p className={styles.help}>Ground footprint of the heated space + garage.</p>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${uid}-pitch`}>
                  Roof Pitch (Rise / 12&quot;)
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id={`${uid}-pitch`}
                    type="number"
                    min={1}
                    max={24}
                    step={1}
                    value={pitchRise}
                    onChange={(e) => setPitchRise(Number(e.target.value))}
                    className={`${styles.input} ${styles.inputWithBadge}`}
                  />
                  <span className={styles.unitBadge}>/ 12</span>
                </div>
              </div>
            </div>

            {/* Pitch preset buttons */}
            <label className={styles.label}>Common Roof Pitches:</label>
            <div className={styles.pitchGrid}>
              {PITCH_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`${styles.pitchBtn} ${pitchRise === p ? styles.pitchBtnActive : ''}`}
                  onClick={() => setPitchRise(p)}
                >
                  {p}/12
                </button>
              ))}
            </div>

            {/* Diagram switcher */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <button
                  type="button"
                  className={`${styles.segBtn} ${diagramTab === 'pitch' ? styles.segBtnActive : ''}`}
                  onClick={() => setDiagramTab('pitch')}
                >
                  Pitch Geometry ({pitchRise}/12)
                </button>
                <button
                  type="button"
                  className={`${styles.segBtn} ${diagramTab === 'layers' ? styles.segBtnActive : ''}`}
                  onClick={() => setDiagramTab('layers')}
                >
                  Roof Layers Cross-Section
                </button>
              </div>

              {diagramTab === 'pitch' ? (
                <RoofPitchDiagram rise={pitchRise} pitchFactor={pFactor} />
              ) : (
                <RoofCrossSectionDiagram />
              )}
            </div>
          </div>

          {/* STEP 2: Roofing Material & Tear-Off */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>2</span>
              <h2 className={styles.cardTitle}>Roofing Material & Tear-Off</h2>
            </div>

            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${uid}-material`}>
                  Roofing Material
                </label>
                <select
                  id={`${uid}-material`}
                  value={materialId}
                  onChange={(e) => setMaterialId(e.target.value as RoofingMaterialId)}
                  className={styles.select}
                >
                  {MATERIAL_LIST.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} (${m.installedRange[0]}–${m.installedRange[1]}/sq, ~{m.typicalLifespan} yrs)
                    </option>
                  ))}
                </select>
                <p className={styles.help}>{currentMat.note}</p>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Existing Shingle Layers to Tear Off</label>
                <div className={styles.segGrid}>
                  {[0, 1, 2].map((layers) => (
                    <button
                      key={layers}
                      type="button"
                      className={`${styles.segBtn} ${existingLayers === layers ? styles.segBtnActive : ''}`}
                      onClick={() => setExistingLayers(layers)}
                    >
                      {layers === 0 ? '0 (New)' : layers === 1 ? '1 Layer' : '2 Layers'}
                    </button>
                  ))}
                </div>
                <p className={styles.help}>
                  {existingLayers === 2
                    ? '2 existing layers require double tear-off labor. IRC R908.3.1.1 prohibits adding an overlay.'
                    : existingLayers === 1
                      ? '1 existing layer to be stripped down to deck.'
                      : 'No existing roof to remove (new build or already stripped).'}
                </p>
              </div>
            </div>

            {existingLayers >= 2 && (
              <div className={styles.warningBanner} role="alert">
                <strong>Building Code Note (IRC R908.3.1.1):</strong> Most municipal building codes strictly prohibit a
                second overlay roof over 2 existing layers. A full tear-off down to the roof deck is legally required.
              </div>
            )}
          </div>

          {/* DETAILED OPTIONS ACCORDION */}
          {mode === 'detailed' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>3</span>
                <h2 className={styles.cardTitle}>Structure, Complexity & Add-Ons</h2>
              </div>

              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label}>Stories / Roof Height</label>
                  <div className={styles.segGrid}>
                    {(['1', '1.5', '2', '3'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={`${styles.segBtn} ${stories === st ? styles.segBtnActive : ''}`}
                        onClick={() => setStories(st)}
                      >
                        {st} {st === '1' ? 'Story' : 'Stories'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Roof Complexity</label>
                  <div className={styles.segGrid}>
                    {(['simple', 'hip', 'complex'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`${styles.segBtn} ${complexity === c ? styles.segBtnActive : ''}`}
                        onClick={() => setComplexity(c)}
                      >
                        {c === 'simple' ? 'Simple Gable' : c === 'hip' ? 'Hip / Valley' : 'Complex / Dormers'}
                      </button>
                    ))}
                  </div>
                  <p className={styles.help}>
                    {complexity === 'simple'
                      ? 'Simple gable or shed roof (no valleys, 2 planes)'
                      : complexity === 'hip'
                        ? 'Standard hip roof with 1-2 valleys'
                        : 'Multiple valleys, dormers, steep facets, turrets'}
                  </p>
                </div>
              </div>

              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${uid}-decking`}>
                    Decking Replacement (% of sheets)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${uid}-decking`}
                      type="number"
                      min={0}
                      max={100}
                      step={5}
                      value={deckingPercent}
                      onChange={(e) => setDeckingPercent(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithBadge}`}
                    />
                    <span className={styles.unitBadge}>%</span>
                  </div>
                  <p className={styles.help}>Typical older roofs need 10%–20% of rotted plywood sheets replaced.</p>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${uid}-overhang`}>
                    Eave &amp; Rake Overhang
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${uid}-overhang`}
                      type="number"
                      min={0}
                      max={36}
                      step={2}
                      value={overhangInches}
                      onChange={(e) => setOverhangInches(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithBadge}`}
                    />
                    <span className={styles.unitBadge}>in</span>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${uid}-region`}>
                    Region Cost Index
                  </label>
                  <select
                    id={`${uid}-region`}
                    value={regionMultiplier}
                    onChange={(e) => setRegionMultiplier(Number(e.target.value))}
                    className={styles.select}
                  >
                    {REGIONAL_OPTIONS.map((r) => (
                      <option key={r.label} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className={styles.label}>Roofing Components & Accessories:</label>
              <div className={styles.checkboxGrid}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={includeIceWater}
                    onChange={(e) => setIncludeIceWater(e.target.checked)}
                  />
                  <span>Ice & Water Shield (Eaves & Valleys)</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={includeDripEdge}
                    onChange={(e) => setIncludeDripEdge(e.target.checked)}
                  />
                  <span>Drip Edge Metal Flashing</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={includeRidgeVent}
                    onChange={(e) => setIncludeRidgeVent(e.target.checked)}
                  />
                  <span>Continuous Ridge Ventilation</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={includeGutters}
                    onChange={(e) => setIncludeGutters(e.target.checked)}
                  />
                  <span>Replace Gutters ($12/lin ft)</span>
                </label>
              </div>

              <div className={styles.fields} style={{ marginTop: 14 }}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${uid}-underlay`}>
                    Underlayment Type
                  </label>
                  <select
                    id={`${uid}-underlay`}
                    value={underlaymentType}
                    onChange={(e) => setUnderlaymentType(e.target.value as 'synthetic' | 'felt15' | 'felt30')}
                    className={styles.select}
                  >
                    <option value="synthetic">Synthetic (Long-lasting, Tear-resistant)</option>
                    <option value="felt15">15# Asphalt Felt (Economy)</option>
                    <option value="felt30">30# Heavy Asphalt Felt</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${uid}-penetr`}>
                    Pipe Boots / Penetrations
                  </label>
                  <input
                    id={`${uid}-penetr`}
                    type="number"
                    min={0}
                    max={20}
                    value={pipeBootsCount}
                    onChange={(e) => setPipeBootsCount(Number(e.target.value))}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${uid}-chimney`}>
                    Chimneys / Skylights
                  </label>
                  <input
                    id={`${uid}-chimney`}
                    type="number"
                    min={0}
                    max={10}
                    value={chimneyCount}
                    onChange={(e) => setChimneyCount(Number(e.target.value))}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${uid}-dumpster`}>
                    Dumpster Rental ($)
                  </label>
                  <input
                    id={`${uid}-dumpster`}
                    type="number"
                    min={0}
                    step={25}
                    value={dumpsterCost}
                    onChange={(e) => setDumpsterCost(Number(e.target.value))}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${uid}-permit`}>
                    Building Permit ($)
                  </label>
                  <input
                    id={`${uid}-permit`}
                    type="number"
                    min={0}
                    step={25}
                    value={permitFee}
                    onChange={(e) => setPermitFee(Number(e.target.value))}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${uid}-contingency`}>
                    Contingency Buffer (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${uid}-contingency`}
                      type="number"
                      min={0}
                      max={30}
                      step={5}
                      value={contingencyPercent}
                      onChange={(e) => setContingencyPercent(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithBadge}`}
                    />
                    <span className={styles.unitBadge}>%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOM PRICE OVERRIDES ACCORDION */}
          <details className={styles.accordion}>
            <summary className={styles.accordionSummary}>
              <span>Edit Custom Prices (Optional)</span>
              <span>▾</span>
            </summary>
            <div className={styles.accordionContent}>
              <p className={styles.help}>
                Customize unit pricing to match your specific supplier quote or regional subcontractor rates:
              </p>
              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${uid}-cmat`}>
                    Material Cost ($/square)
                  </label>
                  <input
                    id={`${uid}-cmat`}
                    type="number"
                    placeholder={`Default: $${currentMat.defaultMaterialPerSquare}`}
                    value={customMaterialCost}
                    onChange={(e) => setCustomMaterialCost(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${uid}-clab`}>
                    Labor Cost ($/square)
                  </label>
                  <input
                    id={`${uid}-clab`}
                    type="number"
                    placeholder={`Default: $${currentMat.defaultLaborPerSquare}`}
                    value={customLaborCost}
                    onChange={(e) => setCustomLaborCost(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${uid}-ctear`}>
                    Tear-Off ($/sq/layer)
                  </label>
                  <input
                    id={`${uid}-ctear`}
                    type="number"
                    placeholder="Default: $125/sq"
                    value={customTearOffCost}
                    onChange={(e) => setCustomTearOffCost(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* RESULTS COLUMN */}
        <div className={styles.results}>
          {/* Hero Banner */}
          <div className={styles.hero} aria-live="polite">
            <div className={styles.heroLabel}>Estimated Replacement Cost</div>
            <div className={styles.heroValue}>{fmtCurrency(result.total)}</div>
            <div className={styles.heroRange}>
              Typical Range: {fmtCurrency(result.low)} – {fmtCurrency(result.high)}
            </div>

            <div className={styles.heroMetrics}>
              <div className={styles.heroMetricItem}>
                <span className={styles.heroMetricVal}>{fmtCurrency(result.costPerSquare)}</span>
                <span className={styles.heroMetricLbl}>Per Square</span>
              </div>
              <div className={styles.heroMetricItem}>
                <span className={styles.heroMetricVal}>${fmtDec(result.costPerSqFt)}</span>
                <span className={styles.heroMetricLbl}>Per Sq Ft</span>
              </div>
              <div className={styles.heroMetricItem}>
                <span className={styles.heroMetricVal}>{fmtCurrency(result.laborPerSquareVal)}</span>
                <span className={styles.heroMetricLbl}>Labor / Sq</span>
              </div>
            </div>
          </div>

          {/* Area & Geometry Summary */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Roof Dimensions Breakdown</h3>
            <table className={styles.breakdownTable}>
              <tbody>
                <tr>
                  <td>Home Footprint Area</td>
                  <td>{fmtDec(footprintSqFt, 0)} sq ft</td>
                </tr>
                <tr>
                  <td>Pitch Multiplier ({pitchRise}/12)</td>
                  <td>{pFactor.toFixed(3)}×</td>
                </tr>
                <tr>
                  <td>Overhang & Rake Addition</td>
                  <td>+{overhangInches}&quot; eaves</td>
                </tr>
                <tr>
                  <td>True Sloped Roof Area</td>
                  <td>
                    <strong>{fmtDec(result.roofAreaSqFt, 0)} sq ft</strong>
                  </td>
                </tr>
                <tr>
                  <td>Roofing Squares (1 sq = 100 sq ft)</td>
                  <td>
                    <strong>{fmtDec(result.totalSquares, 1)} squares</strong>
                  </td>
                </tr>
                <tr>
                  <td>Shingle Bundles (3 bundles / sq)</td>
                  <td>{result.shingleBundles} bundles</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Detailed Line-Items Breakdown */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Itemized Cost Breakdown</h3>
            <table className={styles.breakdownTable}>
              <tbody>
                {result.lineItems.map((item) => (
                  <tr key={item.id} className={styles.tableSubRow}>
                    <td>
                      {item.label} ({item.quantity} {item.unit})
                    </td>
                    <td>{fmtCurrency(item.totalCost)}</td>
                  </tr>
                ))}

                {/* Contingency */}
                {result.contingencyAmount > 0 && (
                  <tr className={styles.tableSubRow}>
                    <td>Contingency Buffer ({contingencyPercent}%)</td>
                    <td>{fmtCurrency(result.contingencyAmount)}</td>
                  </tr>
                )}

                {/* TOTAL */}
                <tr className={styles.tableTotalRow}>
                  <td>Total Estimated Cost</td>
                  <td>{fmtCurrency(result.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3-WAY COMPARISON CARDS */}
          {repairOption && overlayOption && replaceOption && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Repair vs Overlay vs Full Replacement</h3>
              <p className={styles.help}>Compare all 3 options for your specific roof size:</p>

              <CompareVisualBars
                repairTotal={repairOption.totalCost}
                overlayTotal={overlayOption.totalCost}
                overlayAllowed={overlayOption.isPermitted}
                replaceTotal={replaceOption.totalCost}
                formatMoney={fmtCurrency}
              />

              <div className={styles.compareGrid}>
                {/* Option 1: Spot Repair */}
                <div className={styles.compareCard}>
                  <h4 className={styles.compareCardTitle}>1. Spot Repair</h4>
                  <div className={styles.comparePrice}>{fmtCurrency(repairOption.totalCost)}</div>
                  <p className={styles.compareDesc}>{repairOption.description}</p>
                  <p className={styles.help}>Best when roof is &lt; 15 yrs old and damage is isolated.</p>
                </div>

                {/* Option 2: Overlay */}
                <div className={styles.compareCard}>
                  <h4 className={styles.compareCardTitle}>2. Reroof / Overlay</h4>
                  <div className={styles.comparePrice}>
                    {overlayOption.isPermitted ? fmtCurrency(overlayOption.totalCost) : 'N/A'}
                  </div>
                  <p className={styles.compareDesc}>{overlayOption.description}</p>
                  {!overlayOption.isPermitted && (
                    <span className={styles.badgeDisabled}>Prohibited by Code (≥ 2 layers)</span>
                  )}
                  {overlayOption.isPermitted && (
                    <p className={styles.help}>Saves tear-off cost, but hides underlying rot.</p>
                  )}
                </div>

                {/* Option 3: Full Replacement */}
                <div className={`${styles.compareCard} ${styles.compareCardActive}`}>
                  <h4 className={styles.compareCardTitle}>3. Full Replacement</h4>
                  <div className={styles.comparePrice}>{fmtCurrency(replaceOption.totalCost)}</div>
                  <p className={styles.compareDesc}>{replaceOption.description}</p>
                  <p className={styles.help}>Includes complete tear-off, deck inspection, and warranty.</p>
                </div>
              </div>
            </div>
          )}

          {/* CONTRACTOR QUOTE CHECKER */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Check a Contractor Quote</h3>
            <p className={styles.help}>
              Got a written quote from a roofer? Enter the total bid below to check if it falls within the expected
              regional range.
            </p>
            <div className={styles.quoteBox}>
              <div className={styles.inputWrap}>
                <input
                  type="number"
                  placeholder="Enter total quote (e.g. 11500)"
                  value={contractorQuote}
                  onChange={(e) => setContractorQuote(e.target.value)}
                  className={`${styles.input} ${styles.inputWithBadge}`}
                />
                <span className={styles.unitBadge}>USD $</span>
              </div>

              {quoteAnalysis && quoteAnalysis.status !== 'n/a' && (
                <div
                  className={`${styles.quoteFeedback} ${quoteAnalysis.status === 'within'
                      ? styles.quoteFair
                      : quoteAnalysis.status === 'above'
                        ? styles.quoteHigh
                        : styles.quoteLow
                    }`}
                  role="status"
                >
                  <strong>
                    {quoteAnalysis.status === 'within'
                      ? '✓ Fair Market Quote'
                      : quoteAnalysis.status === 'above'
                        ? '▲ Above Average Quote'
                        : '▼ Below Average Quote'}
                  </strong>
                  <p style={{ margin: '6px 0 0' }}>
                    {quoteAnalysis.status === 'within'
                      ? `Quote of ${fmtCurrency(Number(contractorQuote))} is within the expected range (${fmtCurrency(
                        result.low
                      )} – ${fmtCurrency(result.high)}).`
                      : quoteAnalysis.status === 'above'
                        ? `Quote of ${fmtCurrency(Number(contractorQuote))} is ${fmtCurrency(
                          Math.abs(quoteAnalysis.diffAmount)
                        )} (${Math.abs(quoteAnalysis.diffPercent)}%) above the typical estimate of ${fmtCurrency(
                          result.total
                        )}. Ask for an itemized breakdown of decking, flashing, and labor.`
                        : `Quote of ${fmtCurrency(Number(contractorQuote))} is ${fmtCurrency(
                          Math.abs(quoteAnalysis.diffAmount)
                        )} (${Math.abs(quoteAnalysis.diffPercent)}%) below the typical estimate of ${fmtCurrency(
                          result.total
                        )}. Ensure insurance, permits, ice & water shield, and full tear-off are included.`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* MATERIAL COMPARISON MATRIX */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Material Comparison for Your Roof Size</h3>
            <p className={styles.help}>
              Calculated for your home footprint ({fmtDec(footprintSqFt, 0)} sq ft, ~{fmtDec(result.totalSquares, 1)}{' '}
              squares):
            </p>
            <div className={styles.matrixWrap}>
              <table className={styles.matrixTable}>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Cost / Sq</th>
                    <th>Total Cost</th>
                    <th>Life</th>
                    <th>Cost/Yr</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonMatrix.map((cm) => (
                    <tr key={cm.id} className={cm.id === materialId ? styles.matrixRowActive : ''}>
                      <td>
                        <strong>{cm.label}</strong>
                      </td>
                      <td>{fmtCurrency(cm.costPerSquare)}</td>
                      <td>{fmtCurrency(cm.totalCost)}</td>
                      <td>{cm.lifespanYears} yrs</td>
                      <td>${fmtDec(cm.costPerYear, 0)}/yr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className={styles.actionBar}>
            <button type="button" className={styles.actionBtn} onClick={handleShare}>
              🔗 Share Estimate
            </button>
            <button type="button" className={styles.actionBtn} onClick={handleCopySummary}>
              📋 Copy Summary
            </button>
            <button type="button" className={styles.actionBtn} onClick={handlePrint}>
              🖨️ Print / PDF
            </button>
            {copied && <span className={styles.toast}>✓ Copied to clipboard!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
