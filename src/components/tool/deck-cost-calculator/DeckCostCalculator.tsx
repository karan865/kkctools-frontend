'use client';

import React, { useState, useMemo } from 'react';
import styles from './DeckCostCalculator.module.css';
import { DeckDiagram } from './DeckDiagram';
import {
  calculateDeckCost,
  compareMaterials,
  checkQuote,
  PROJECT_MODES,
  HEIGHT_BANDS,
  DECK_MATERIALS,
  DECK_PATTERNS,
  RAILING_TYPES,
  FASTENERS,
  DEFAULT_FRAMING,
  type ProjectMode,
  type HeightBand,
  type DeckMaterialId,
  type DeckPattern,
  type RailingType,
  type FastenerType,
  type DeckCostInput,
} from '@/lib/deck-cost-engine';

const CURRENCIES = [
  { symbol: '$', code: 'USD', label: 'USD ($)' },
  { symbol: 'C$', code: 'CAD', label: 'CAD (C$)' },
  { symbol: '£', code: 'GBP', label: 'GBP (£)' },
  { symbol: '€', code: 'EUR', label: 'EUR (€)' },
  { symbol: 'A$', code: 'AUD', label: 'AUD (A$)' },
];

export default function DeckCostCalculator() {
  // Step 1: Mode & Geometry
  const [mode, setMode] = useState<ProjectMode>('new');
  const [lengthFt, setLengthFt] = useState<number>(16);
  const [widthFt, setWidthFt] = useState<number>(12);
  const [heightBand, setHeightBand] = useState<HeightBand>('low'); // 2-4 ft
  const [isAttached, setIsAttached] = useState<boolean>(true);
  const [houseEdge, setHouseEdge] = useState<'length' | 'width'>('length');

  // Step 2: Decking
  const [materialId, setMaterialId] = useState<DeckMaterialId>('pt_pine');
  const [boardWidthIn, setBoardWidthIn] = useState<number>(5.5);
  const [boardLengthFt, setBoardLengthFt] = useState<8 | 12 | 16 | 20>(16);
  const [pattern, setPattern] = useState<DeckPattern>('straight');
  const [pictureFrame, setPictureFrame] = useState<boolean>(false);
  const [customDeckingRate, setCustomDeckingRate] = useState<string>('');

  // Step 3: Framing
  const [joistSpacingIn, setJoistSpacingIn] = useState<12 | 16 | 24>(16);
  const [joistSize, setJoistSize] = useState<'2x6' | '2x8' | '2x10' | '2x12'>('2x8');
  const [postSize, setPostSize] = useState<'4x4' | '6x6'>('6x6');
  const [footingDepthIn, setFootingDepthIn] = useState<number>(42);

  // Step 4: Railing & Stairs
  const [includeRailing, setIncludeRailing] = useState<boolean>(true);
  const [railingType, setRailingType] = useState<RailingType>('wood');
  const [includeStairs, setIncludeStairs] = useState<boolean>(true);
  const [stairWidthFt, setStairWidthFt] = useState<number>(4);
  const [stairRisers, setStairRisers] = useState<string>('');

  // Step 5: Fasteners & Installation
  const [fastenerType, setFastenerType] = useState<FastenerType>('face_screws');
  const [isDIY, setIsDIY] = useState<boolean>(false);
  const [customLaborRate, setCustomLaborRate] = useState<string>('');

  // Step 6: Location & Contingency
  const [regionIndex, setRegionIndex] = useState<number>(1.0);
  const [contingencyPct, setContingencyPct] = useState<number>(10);
  const [currency, setCurrency] = useState<string>('$');

  // Contractor Quote Verifier
  const [contractorQuote, setContractorQuote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Active Material Info
  const activeMaterial = DECK_MATERIALS[materialId] || DECK_MATERIALS.pt_pine;

  // Build input object
  const input: DeckCostInput = useMemo(() => {
    return {
      mode,
      sections: [
        {
          name: 'Main Deck',
          lengthFt: Math.max(0, lengthFt || 0),
          widthFt: Math.max(0, widthFt || 0),
          isAttached,
          houseEdge: isAttached ? houseEdge : 'none',
        },
      ],
      heightBand,
      materialId,
      boardWidthIn: Math.max(3, boardWidthIn || 5.5),
      boardLengthFt,
      gapIn: activeMaterial.recommendedGapIn,
      pattern,
      pictureFrame,
      framing: {
        ...DEFAULT_FRAMING,
        joistSpacingIn,
        joistSize,
        postSize,
        footingDepthIn: Math.max(12, footingDepthIn || 42),
      },
      railing: {
        include: includeRailing,
        type: railingType,
      },
      stairs: {
        include: includeStairs,
        risers: stairRisers ? parseInt(stairRisers, 10) : undefined,
        widthFt: Math.max(3, stairWidthFt || 4),
        hasLanding: false,
      },
      fastenerType,
      isDIY,
      customDeckingPricePerSqFt: customDeckingRate ? parseFloat(customDeckingRate) : undefined,
      customLaborPricePerSqFt: customLaborRate ? parseFloat(customLaborRate) : undefined,
      regionIndex,
      contingencyPct,
      currencySymbol: currency,
    };
  }, [
    mode,
    lengthFt,
    widthFt,
    heightBand,
    isAttached,
    houseEdge,
    materialId,
    boardWidthIn,
    boardLengthFt,
    activeMaterial.recommendedGapIn,
    pattern,
    pictureFrame,
    joistSpacingIn,
    joistSize,
    postSize,
    footingDepthIn,
    includeRailing,
    railingType,
    includeStairs,
    stairRisers,
    stairWidthFt,
    fastenerType,
    isDIY,
    customDeckingRate,
    customLaborRate,
    regionIndex,
    contingencyPct,
    currency,
  ]);

  // Run calculation
  const result = useMemo(() => calculateDeckCost(input), [input]);
  const materialComparisons = useMemo(() => compareMaterials(input), [input]);
  const quoteCheck = useMemo(
    () => checkQuote(contractorQuote ? parseFloat(contractorQuote) : 0, result),
    [contractorQuote, result]
  );

  const fmtCurr = (amount: number) => {
    return `${currency}${Math.round(amount).toLocaleString('en-US')}`;
  };

  const fmtDec = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  const handleCopySummary = () => {
    const text = `Deck Estimate Summary (${input.sections[0].lengthFt}' × ${input.sections[0].widthFt}'):
Total Area: ${result.totalAreaSqFt} sq ft
Material: ${activeMaterial.label}
Mode: ${PROJECT_MODES.find((m) => m.id === mode)?.label}
Total Installed Cost: ${fmtCurr(result.grandTotal)} (${fmtDec(result.costPerSqFt)}/sq ft)
Estimated Range: ${fmtCurr(result.lowEstimate)} – ${fmtCurr(result.highEstimate)}
Materials Total: ${fmtCurr(result.materialsTotal)}
Labor Total: ${fmtCurr(result.laborTotal)}
DIY Estimated Total: ${fmtCurr(result.diyTotal)} (Savings: ${fmtCurr(result.diySavings)})
Calculated with KKCTools Deck Cost Calculator`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {/* Left Input Column */}
        <div className={styles.inputCol}>
          {/* Step 1: Project Mode & Dimensions */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>1</span>
              <h2 className={styles.cardTitle}>Project Type &amp; Dimensions</h2>
            </div>
            <p className={styles.subText}>Select whether you are building new, resurfacing old boards, or tearing out an existing deck.</p>

            <label className={styles.label}>Project Scope</label>
            <div className={styles.segGroup}>
              {PROJECT_MODES.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  className={`${styles.segBtn} ${mode === pm.id ? styles.segBtnActive : ''}`}
                  onClick={() => setMode(pm.id)}
                >
                  {pm.label}
                </button>
              ))}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Length (along house)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="number"
                    min="4"
                    max="80"
                    step="1"
                    className={`${styles.input} ${styles.inputWithBadge}`}
                    value={lengthFt}
                    onChange={(e) => setLengthFt(parseFloat(e.target.value) || 0)}
                  />
                  <span className={styles.unitBadge}>ft</span>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Width (projection)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="number"
                    min="4"
                    max="60"
                    step="1"
                    className={`${styles.input} ${styles.inputWithBadge}`}
                    value={widthFt}
                    onChange={(e) => setWidthFt(parseFloat(e.target.value) || 0)}
                  />
                  <span className={styles.unitBadge}>ft</span>
                </div>
              </div>
            </div>

            <label className={styles.label}>Elevation Above Grade</label>
            <div className={styles.segGroup}>
              {(Object.keys(HEIGHT_BANDS) as HeightBand[]).map((hb) => {
                const info = HEIGHT_BANDS[hb];
                return (
                  <button
                    key={hb}
                    type="button"
                    className={`${styles.segBtn} ${heightBand === hb ? styles.segBtnActive : ''}`}
                    onClick={() => setHeightBand(hb)}
                  >
                    <span>{info.label.split(' ')[0]}</span>
                    <span className={styles.segSub}>{info.rangeFt}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.formRow}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isAttached}
                  onChange={(e) => setIsAttached(e.target.checked)}
                />
                Attached to house with ledger board (saves 1 row of beam &amp; footings)
              </label>
            </div>

            {isAttached && (
              <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
                <label className={styles.label}>House Attachment Side</label>
                <select
                  className={styles.select}
                  value={houseEdge}
                  onChange={(e) => setHouseEdge(e.target.value as 'length' | 'width')}
                >
                  <option value="length">Along Length ({lengthFt} ft side)</option>
                  <option value="width">Along Width ({widthFt} ft side)</option>
                </select>
              </div>
            )}
          </div>

          {/* Step 2: Decking Material & Board Selection */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>2</span>
              <h2 className={styles.cardTitle}>Decking Material &amp; Layout</h2>
            </div>
            <p className={styles.subText}>Compare pressure-treated lumber against low-maintenance composite or PVC decking.</p>

            <label className={styles.label}>Decking Material Tier</label>
            <div className={styles.segGroup}>
              {(Object.keys(DECK_MATERIALS) as DeckMaterialId[]).map((mId) => {
                const info = DECK_MATERIALS[mId];
                return (
                  <button
                    key={mId}
                    type="button"
                    className={`${styles.segBtn} ${materialId === mId ? styles.segBtnActive : ''}`}
                    onClick={() => setMaterialId(mId)}
                  >
                    <span>{info.label}</span>
                    <span className={styles.segSub}>{fmtDec(info.materialCostPerSqFt.typical)}/sq ft</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Board Width</label>
                <select
                  className={styles.select}
                  value={boardWidthIn}
                  onChange={(e) => setBoardWidthIn(parseFloat(e.target.value))}
                >
                  <option value={5.5}>5.5 in (Nominal 6&quot; standard)</option>
                  <option value={3.5}>3.5 in (Nominal 4&quot; narrow)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Stock Board Length</label>
                <select
                  className={styles.select}
                  value={boardLengthFt}
                  onChange={(e) => setBoardLengthFt(parseInt(e.target.value, 10) as 8 | 12 | 16 | 20)}
                >
                  <option value={12}>12 ft boards</option>
                  <option value={16}>16 ft boards (standard)</option>
                  <option value={20}>20 ft boards</option>
                </select>
              </div>
            </div>

            <label className={styles.label}>Deck Board Pattern</label>
            <div className={styles.segGroup}>
              {(Object.keys(DECK_PATTERNS) as DeckPattern[]).map((p) => {
                const pInfo = DECK_PATTERNS[p];
                return (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.segBtn} ${pattern === p ? styles.segBtnActive : ''}`}
                    onClick={() => setPattern(p)}
                  >
                    <span>{pInfo.label}</span>
                    <span className={styles.segSub}>{pInfo.defaultWastePct}% waste</span>
                  </button>
                );
              })}
            </div>

            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={pictureFrame}
                onChange={(e) => setPictureFrame(e.target.checked)}
              />
              Add picture-frame border (+perimeter trim boards)
            </label>
          </div>

          {/* Step 3: Substructure & Framing (Accordion) */}
          {mode !== 'resurface' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>3</span>
                <h2 className={styles.cardTitle}>Substructure &amp; Framing Spec</h2>
              </div>
              <p className={styles.subText}>Engineered joists, posts, and frost-depth concrete pier footings.</p>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Joist Spacing</label>
                  <select
                    className={styles.select}
                    value={joistSpacingIn}
                    onChange={(e) => setJoistSpacingIn(parseInt(e.target.value, 10) as 12 | 16 | 24)}
                  >
                    <option value={12}>12 in o.c. (Required for diagonal &amp; composite)</option>
                    <option value={16}>16 in o.c. (Standard residential wood)</option>
                    <option value={24}>24 in o.c. (Heavy commercial only)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Joist Lumber Size</label>
                  <select
                    className={styles.select}
                    value={joistSize}
                    onChange={(e) => setJoistSize(e.target.value as '2x6' | '2x8' | '2x10' | '2x12')}
                  >
                    <option value="2x8">2×8 Pressure-Treated</option>
                    <option value="2x10">2×10 Pressure-Treated (longer span)</option>
                    <option value="2x12">2×12 Pressure-Treated</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Post Size</label>
                  <select
                    className={styles.select}
                    value={postSize}
                    onChange={(e) => setPostSize(e.target.value as '4x4' | '6x6')}
                  >
                    <option value="6x6">6×6 Posts (IRC Code standard)</option>
                    <option value="4x4">4×4 Posts (low ground decks only)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Footing Depth (Frost Line)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="number"
                      min="12"
                      max="72"
                      className={`${styles.input} ${styles.inputWithBadge}`}
                      value={footingDepthIn}
                      onChange={(e) => setFootingDepthIn(parseFloat(e.target.value) || 0)}
                    />
                    <span className={styles.unitBadge}>in</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Railing & Stairs */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>4</span>
              <h2 className={styles.cardTitle}>Railing &amp; Stairs</h2>
            </div>
            <p className={styles.subText}>IRC R312 code requires 36&quot; guardrails on decks elevated over 30 inches.</p>

            <div className={styles.formRow}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={includeRailing}
                  onChange={(e) => setIncludeRailing(e.target.checked)}
                />
                Include Railing System along exposed edges
              </label>
            </div>

            {includeRailing && (
              <div style={{ marginTop: '0.75rem' }}>
                <label className={styles.label}>Railing Material &amp; Style</label>
                <div className={styles.segGroup}>
                  {(Object.keys(RAILING_TYPES) as RailingType[]).map((rId) => {
                    const rInfo = RAILING_TYPES[rId];
                    return (
                      <button
                        key={rId}
                        type="button"
                        className={`${styles.segBtn} ${railingType === rId ? styles.segBtnActive : ''}`}
                        onClick={() => setRailingType(rId)}
                      >
                        <span>{rInfo.label.split(' ')[0]}</span>
                        <span className={styles.segSub}>{fmtCurr(rInfo.installedCostPerLf.typical)}/LF</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.formRow} style={{ marginTop: '0.75rem' }}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={includeStairs}
                  onChange={(e) => setIncludeStairs(e.target.checked)}
                />
                Include Flight of Steps / Stairs
              </label>
            </div>

            {includeStairs && (
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Stair Width</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      className={`${styles.input} ${styles.inputWithBadge}`}
                      value={stairWidthFt}
                      onChange={(e) => setStairWidthFt(parseFloat(e.target.value) || 0)}
                    />
                    <span className={styles.unitBadge}>ft</span>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Number of Risers (Blank = Auto)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      placeholder={`Auto: ${result.stairs.riserCount}`}
                      className={`${styles.input} ${styles.inputWithBadge}`}
                      value={stairRisers}
                      onChange={(e) => setStairRisers(e.target.value)}
                    />
                    <span className={styles.unitBadge}>steps</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 5: Fasteners & DIY Toggle */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>5</span>
              <h2 className={styles.cardTitle}>Fasteners &amp; Installation Method</h2>
            </div>
            <p className={styles.subText}>Choose fastener aesthetic and compare DIY installation against professional contractors.</p>

            <label className={styles.label}>Fastener System</label>
            <div className={styles.segGroup}>
              {(Object.keys(FASTENERS) as FastenerType[]).map((fId) => {
                const fInfo = FASTENERS[fId];
                return (
                  <button
                    key={fId}
                    type="button"
                    className={`${styles.segBtn} ${fastenerType === fId ? styles.segBtnActive : ''}`}
                    onClick={() => setFastenerType(fId)}
                  >
                    <span>{fInfo.label}</span>
                    <span className={styles.segSub}>{fmtCurr(fInfo.costPerBox)} / box</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.formRow} style={{ marginTop: '0.75rem' }}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isDIY}
                  onChange={(e) => setIsDIY(e.target.checked)}
                />
                <strong>DIY Self-Build (0 Contractor Labor, adds tool rental allowance)</strong>
              </label>
            </div>

            {/* Price Overrides Accordion */}
            <details className={styles.accordion}>
              <summary className={styles.accordionSummary}>
                Custom Price Overrides ($/sq ft rate adjustments)
              </summary>
              <div className={styles.accordionBody}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Custom Decking Rate</label>
                    <div className={styles.inputWrap}>
                      <input
                        type="number"
                        placeholder={`Default: ${activeMaterial.materialCostPerSqFt.typical}`}
                        className={`${styles.input} ${styles.inputWithBadge}`}
                        value={customDeckingRate}
                        onChange={(e) => setCustomDeckingRate(e.target.value)}
                      />
                      <span className={styles.unitBadge}>$/sq ft</span>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Custom Labor Rate</label>
                    <div className={styles.inputWrap}>
                      <input
                        type="number"
                        placeholder={`Default: ${activeMaterial.laborCostPerSqFt.typical}`}
                        className={`${styles.input} ${styles.inputWithBadge}`}
                        value={customLaborRate}
                        onChange={(e) => setCustomLaborRate(e.target.value)}
                      />
                      <span className={styles.unitBadge}>$/sq ft</span>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Step 6: Region, Contingency & Currency */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>6</span>
              <h2 className={styles.cardTitle}>Region, Contingency &amp; Currency</h2>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Regional Cost Multiplier</label>
                <select
                  className={styles.select}
                  value={regionIndex}
                  onChange={(e) => setRegionIndex(parseFloat(e.target.value))}
                >
                  <option value={0.85}>Rural / Low Cost Area (0.85×)</option>
                  <option value={1.0}>National US Average (1.00×)</option>
                  <option value={1.15}>Suburban / High Cost Area (1.15×)</option>
                  <option value={1.3}>Metro NYC / SF / Hawaii (1.30×)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Contingency Buffer</label>
                <div className={styles.inputWrap}>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    className={`${styles.input} ${styles.inputWithBadge}`}
                    value={contingencyPct}
                    onChange={(e) => setContingencyPct(parseFloat(e.target.value) || 0)}
                  />
                  <span className={styles.unitBadge}>%</span>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Currency</label>
                <select
                  className={styles.select}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.symbol}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Results Column */}
        <div className={styles.resultCol}>
          {/* Radiant Cobalt Blue Hero Banner */}
          <div className={styles.hero}>
            <div className={styles.heroHead}>
              <span className={styles.heroLabel}>Total Estimated Installed Cost</span>
              {isDIY && <span className={styles.diyPill}>DIY Self-Build</span>}
            </div>

            <div className={styles.heroValue}>{fmtCurr(result.grandTotal)}</div>
            <div className={styles.heroRange}>
              Typical Market Range: {fmtCurr(result.lowEstimate)} – {fmtCurr(result.highEstimate)}
            </div>

            <div className={styles.heroMetrics}>
              <div className={styles.metricBlock}>
                <span className={styles.metricVal}>{fmtDec(result.costPerSqFt)}</span>
                <span className={styles.metricSub}>Installed / sq ft</span>
              </div>
              <div className={styles.metricBlock}>
                <span className={styles.metricVal}>{fmtCurr(result.materialsTotal)}</span>
                <span className={styles.metricSub}>Materials &amp; Lumber</span>
              </div>
              <div className={styles.metricBlock}>
                <span className={styles.metricVal}>{isDIY ? 'DIY ($0)' : fmtCurr(result.laborTotal)}</span>
                <span className={styles.metricSub}>{isDIY ? 'Zero Labor' : 'Pro Framing Labor'}</span>
              </div>
            </div>
          </div>

          {/* DIY vs Contractor Savings Banner */}
          {!isDIY && result.diySavings > 0 && (
            <div className={styles.card} style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#065f46', fontSize: '0.9375rem' }}>DIY Potential Savings:</strong>
                  <div style={{ fontSize: '0.8125rem', color: '#047857' }}>
                    Materials only: {fmtCurr(result.diyTotal)}
                  </div>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46' }}>
                  Save {fmtCurr(result.diySavings)}
                </div>
              </div>
            </div>
          )}

          {/* Interactive SVG Diagram */}
          <DeckDiagram input={input} result={result} />

          {/* Itemized Cost Breakdown Table */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.cardTitle} style={{ marginBottom: '0.75rem' }}>
              Itemized Cost Breakdown
            </h3>
            <div className={styles.tableWrap}>
              <table className={styles.breakdownTable}>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Details</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {result.lineItems.map((line) => (
                    <tr key={line.id}>
                      <td>
                        <strong>{line.label}</strong>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.75rem' }}>{line.description}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmtCurr(line.totalCost)}</td>
                    </tr>
                  ))}
                  <tr className={styles.tableTotalRow}>
                    <td colSpan={2}>Grand Total ({result.totalAreaSqFt} sq ft)</td>
                    <td style={{ textAlign: 'right' }}>{fmtCurr(result.grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bill of Materials (BOM) Table */}
          <div className={styles.breakdownCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 className={styles.cardTitle}>Bill of Materials (BOM)</h3>
              <span className={styles.tagBadge}>Print Ready</span>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.breakdownTable}>
                <thead>
                  <tr>
                    <th>Material Item</th>
                    <th>Qty</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {result.bom.map((b, idx) => (
                    <tr key={`bom-${idx}`}>
                      <td>
                        <strong>{b.item}</strong>
                        {b.note && <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{b.note}</div>}
                      </td>
                      <td>
                        {b.quantity} {b.unit}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmtCurr(b.totalCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contractor Quote Verifier */}
          <div className={`${styles.quoteCard} ${styles[`quoteStatus${quoteCheck.status.charAt(0).toUpperCase() + quoteCheck.status.slice(1)}`]}`}>
            <h3 className={styles.cardTitle}>Contractor Quote Verifier</h3>
            <p className={styles.subText}>Have a bid from a local builder? Check whether it falls in fair market range.</p>

            <div className={styles.inputWrap}>
              <input
                type="number"
                placeholder="Enter contractor estimate total ($)"
                className={styles.input}
                value={contractorQuote}
                onChange={(e) => setContractorQuote(e.target.value)}
              />
            </div>

            {contractorQuote && (
              <div
                className={`${styles.quoteAlert} ${
                  quoteCheck.status === 'fair'
                    ? styles.alertFair
                    : quoteCheck.status === 'low'
                    ? styles.alertLow
                    : styles.alertHigh
                }`}
              >
                <strong>{quoteCheck.headline}</strong>
                <p style={{ margin: '0.25rem 0 0 0' }}>{quoteCheck.explanation}</p>
              </div>
            )}
          </div>

          {/* Lifetime Material Comparison */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.cardTitle} style={{ marginBottom: '0.75rem' }}>
              Wood vs. Composite 25-Year Cost
            </h3>
            <div className={styles.tableWrap}>
              <table className={styles.breakdownTable}>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Upfront</th>
                    <th>25-Yr Maint.</th>
                    <th style={{ textAlign: 'right' }}>Cost / Year</th>
                  </tr>
                </thead>
                <tbody>
                  {materialComparisons.slice(0, 4).map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.label}</strong>
                      </td>
                      <td>{fmtCurr(c.upfrontCost)}</td>
                      <td>{fmtCurr(c.annualMaintenance * 25)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#0369a1' }}>
                        {fmtCurr(c.costPerYearOfService)}/yr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.btnRow}>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              onClick={handleCopySummary}
            >
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy Estimate Summary'}
            </button>
            <button type="button" className={styles.actionBtn} onClick={handlePrint}>
              🖨️ Print BOM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
