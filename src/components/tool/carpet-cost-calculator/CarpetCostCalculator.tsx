'use client';

import React, { useState, useMemo, useEffect, useId } from 'react';
import {
  calculateCarpetProject,
  checkQuote,
  compareFloors,
  CARPET_GRADES,
  CARPET_PADS,
  LABOUR_AND_EXTRAS,
  DEFAULT_PAD_PRICING,
  SQFT_PER_SQYD,
  CarpetGrade,
  PadType,
  RoomInput,
  StairsInput,
} from '@/lib/carpet-engine';
import CarpetDiagram from './CarpetDiagram';
import TabSlider from '@/components/tool/shared/TabSlider';
import styles from './CarpetCostCalculator.module.css';

const CARPET_TABS: { id: 'replace' | 'new'; label: string }[] = [
  { id: 'replace', label: 'Replace Carpet (Tear-Out & Install)' },
  { id: 'new', label: 'New Carpet (Bare Subfloor)' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
];

export default function CarpetCostCalculator() {
  const compId = useId();

  // Mode: Replace (default) vs New
  const [mode, setMode] = useState<'replace' | 'new'>('replace');

  // Spaces (Rooms)
  const [rooms, setRooms] = useState<RoomInput[]>([
    { id: '1', name: 'Master Bedroom', type: 'room', lengthFt: 14, widthFt: 12 },
  ]);

  // Stairs
  const [stairs, setStairs] = useState<StairsInput>({
    enabled: false,
    steps: 13,
    style: 'waterfall',
    stairWidthIn: 36,
    treadDepthIn: 10,
    riserHeightIn: 7.5,
    nosingWrapIn: 1.5,
    landingLengthFt: 0,
    landingWidthFt: 0,
  });

  // Roll & Material settings
  const [rollWidthFt, setRollWidthFt] = useState<number>(12);
  const [isCarpetTiles, setIsCarpetTiles] = useState<boolean>(false);
  const [patternWastePercent, setPatternWastePercent] = useState<number>(0);

  // Carpet Pricing
  const [selectedGrade, setSelectedGrade] = useState<CarpetGrade>('mid');
  const [priceUnit, setPriceUnit] = useState<'sqft' | 'sqyd'>('sqft');
  const [carpetPricePerSqFt, setCarpetPricePerSqFt] = useState<number>(CARPET_GRADES.mid.typical);

  // Pad Pricing
  const [selectedPad, setSelectedPad] = useState<PadType>('highDensity');
  const [padPricePerSqFt, setPadPricePerSqFt] = useState<number>(DEFAULT_PAD_PRICING.typical);

  // Labour
  const [laborRatePerSqFt, setLaborRatePerSqFt] = useState<number>(LABOUR_AND_EXTRAS.installation.typical);

  // Extras Toggles & Rates
  const [includeRemoval, setIncludeRemoval] = useState<boolean>(true);
  const [removalRatePerSqFt, setRemovalRatePerSqFt] = useState<number>(LABOUR_AND_EXTRAS.removal.typical);
  const [includeDisposal, setIncludeDisposal] = useState<boolean>(true);
  const [disposalRatePerSqFt, setDisposalRatePerSqFt] = useState<number>(LABOUR_AND_EXTRAS.disposal.typical);

  const [furnitureRoomsCount, setFurnitureRoomsCount] = useState<number>(0);
  const [furnitureRatePerRoom, setFurnitureRatePerRoom] = useState<number>(LABOUR_AND_EXTRAS.furniture.typical);

  const [replaceTackStrips, setReplaceTackStrips] = useState<boolean>(false);
  const [tackStripRatePerFt, setTackStripRatePerFt] = useState<number>(LABOUR_AND_EXTRAS.tackStrip.typical);

  const [transitionCount, setTransitionCount] = useState<number>(1);
  const [transitionRate, setTransitionRate] = useState<number>(LABOUR_AND_EXTRAS.transitions.typical);

  const [subfloorRepairSqFt, setSubfloorRepairSqFt] = useState<number>(0);
  const [subfloorRatePerSqFt, setSubfloorRatePerSqFt] = useState<number>(LABOUR_AND_EXTRAS.subfloorRepair.typical);

  const [doorsToTrimCount, setDoorsToTrimCount] = useState<number>(0);
  const [doorTrimRate, setDoorTrimRate] = useState<number>(LABOUR_AND_EXTRAS.doorTrimming.typical);

  // Tax, Region & Currency
  const [salesTaxPercent, setSalesTaxPercent] = useState<number>(0);
  const [taxMaterialsOnly, setTaxMaterialsOnly] = useState<boolean>(true);
  const [regionalMultiplier, setRegionalMultiplier] = useState<number>(1.0);
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // Quote verifier input
  const [quoteInput, setQuoteInput] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize mode switch
  const handleModeChange = (newMode: 'replace' | 'new') => {
    setMode(newMode);
    if (newMode === 'replace') {
      setIncludeRemoval(true);
      setIncludeDisposal(true);
    } else {
      setIncludeRemoval(false);
      setIncludeDisposal(false);
    }
  };

  // Grade selection helper
  const handleGradeSelect = (grade: CarpetGrade) => {
    setSelectedGrade(grade);
    setCarpetPricePerSqFt(CARPET_GRADES[grade].typical);
  };

  // Pad selection helper
  const handlePadSelect = (pad: PadType) => {
    setSelectedPad(pad);
    setPadPricePerSqFt(CARPET_PADS[pad].typical);
  };

  // Room management
  const addRoom = () => {
    const nextIdx = rooms.length + 1;
    setRooms([
      ...rooms,
      {
        id: String(Date.now()),
        name: `Room ${nextIdx}`,
        type: 'room',
        lengthFt: 12,
        widthFt: 10,
      },
    ]);
  };

  const removeRoom = (id: string) => {
    if (rooms.length <= 1) return;
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const updateRoom = (id: string, field: keyof RoomInput, value: string | number) => {
    setRooms(
      rooms.map((r) => {
        if (r.id !== id) return r;
        return { ...r, [field]: value };
      })
    );
  };

  // Calculation memo
  const result = useMemo(() => {
    return calculateCarpetProject({
      mode,
      rooms,
      stairs,
      rollWidthFt,
      patternWastePercent,
      isCarpetTiles,
      carpetPricePerSqFt,
      padPricePerSqFt,
      laborRatePerSqFt,
      includeRemoval,
      removalRatePerSqFt,
      includeDisposal,
      disposalRatePerSqFt,
      furnitureRoomsCount,
      furnitureRatePerRoom,
      replaceTackStrips,
      tackStripRatePerFt,
      transitionCount,
      transitionRate,
      subfloorRepairSqFt,
      subfloorRatePerSqFt,
      doorsToTrimCount,
      doorTrimRate,
      salesTaxPercent,
      taxMaterialsOnly,
      regionalMultiplier,
    });
  }, [
    mode,
    rooms,
    stairs,
    rollWidthFt,
    patternWastePercent,
    isCarpetTiles,
    carpetPricePerSqFt,
    padPricePerSqFt,
    laborRatePerSqFt,
    includeRemoval,
    removalRatePerSqFt,
    includeDisposal,
    disposalRatePerSqFt,
    furnitureRoomsCount,
    furnitureRatePerRoom,
    replaceTackStrips,
    tackStripRatePerFt,
    transitionCount,
    transitionRate,
    subfloorRepairSqFt,
    subfloorRatePerSqFt,
    doorsToTrimCount,
    doorTrimRate,
    salesTaxPercent,
    taxMaterialsOnly,
    regionalMultiplier,
  ]);

  // Floor alternatives comparison
  const floorComparisons = useMemo(() => {
    return compareFloors(result.totalNetSqFt);
  }, [result.totalNetSqFt]);

  // Contractor quote verification
  const quoteCheck = useMemo(() => {
    const val = parseFloat(quoteInput);
    if (!Number.isFinite(val) || val <= 0) return null;
    return checkQuote(val, result);
  }, [quoteInput, result]);

  // URL State hydration & persistence
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect */
    if (params.get('mode') === 'new') setMode('new');
    if (params.get('grade') && params.get('grade')! in CARPET_GRADES) {
      handleGradeSelect(params.get('grade') as CarpetGrade);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const copySummary = () => {
    const summary = [
      `--- KKCTools Carpet Cost Estimate ---`,
      `Project Scope: ${mode === 'replace' ? 'Carpet Replacement' : 'New Installation'}`,
      `Net Room Area: ${result.totalNetSqFt} sq ft (${result.totalNetSqYd} sq yd)`,
      `Carpet to Buy: ${result.totalBoughtSqFt} sq ft (${result.totalBoughtSqYd} sq yd) [${result.totalWastePercent}% roll waste, ${result.totalSeams} seams]`,
      `Estimated Total: ${currencySymbol}${result.grandTotal.toLocaleString()} (${currencySymbol}${result.totalLow.toLocaleString()} - ${currencySymbol}${result.totalHigh.toLocaleString()})`,
      `Installed Unit Rate: ${currencySymbol}${result.installedCostPerSqFt}/sq ft (${currencySymbol}${result.installedCostPerSqYd}/sq yd)`,
      `Materials: ${currencySymbol}${result.materialsCost.toLocaleString()}`,
      `Labour: ${currencySymbol}${result.laborCost.toLocaleString()}`,
      `Prep & Removal: ${currencySymbol}${result.prepRemovalCost.toLocaleString()}`,
      `Extras & Tax: ${currencySymbol}${(result.extrasCost + result.salesTaxAmount).toLocaleString()}`,
      `https://www.kkctools.com/carpet-cost-calculator/`,
    ].join('\n');

    navigator.clipboard.writeText(summary);
    setToastMessage('Estimate copied to clipboard!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const shareUrl = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    url.searchParams.set('grade', selectedGrade);
    url.searchParams.set('sqft', String(result.totalNetSqFt));
    navigator.clipboard.writeText(url.toString());
    setToastMessage('Share link copied to clipboard!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeExtrasCount = [
    includeRemoval,
    includeDisposal,
    replaceTackStrips,
    furnitureRoomsCount > 0,
    transitionCount > 0,
    subfloorRepairSqFt > 0,
    doorsToTrimCount > 0,
  ].filter(Boolean).length;

  return (
    <div className={styles.wrap}>
      {/* Mode Switcher */}
      <TabSlider
        tabs={CARPET_TABS}
        activeId={mode}
        onChange={(id) => handleModeChange(id as 'replace' | 'new')}
        ariaLabel="Project Scope"
      />

      <div className={styles.grid}>
        {/* LEFT COLUMN: Inputs & Options */}
        <div className={styles.inputs}>
          {/* STEP 1: Room Dimensions & Takeoff */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>1</span>
              <h2 className={styles.cardTitle}>Room Dimensions &amp; Takeoff</h2>
              <span className={styles.cardSub}>{rooms.length} space{rooms.length > 1 ? 's' : ''}</span>
            </div>

            {rooms.map((room, idx) => (
              <div key={room.id} className={styles.roomBox}>
                <div className={styles.roomBoxHeader}>
                  <input
                    type="text"
                    className={styles.roomNameInput}
                    value={room.name}
                    onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                    aria-label={`Room ${idx + 1} Name`}
                  />
                  {rooms.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeRoom(room.id)}
                      title="Remove room"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>

                <div className={styles.fields}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${compId}-len-${room.id}`}>
                      Length
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${compId}-len-${room.id}`}
                        type="number"
                        step="0.5"
                        min="1"
                        className={`${styles.input} ${styles.inputWithBadge}`}
                        value={room.lengthFt || ''}
                        onChange={(e) => updateRoom(room.id, 'lengthFt', parseFloat(e.target.value) || 0)}
                      />
                      <span className={styles.unitBadge}>ft</span>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${compId}-wid-${room.id}`}>
                      Width
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${compId}-wid-${room.id}`}
                        type="number"
                        step="0.5"
                        min="1"
                        className={`${styles.input} ${styles.inputWithBadge}`}
                        value={room.widthFt || ''}
                        onChange={(e) => updateRoom(room.id, 'widthFt', parseFloat(e.target.value) || 0)}
                      />
                      <span className={styles.unitBadge}>ft</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className={styles.addBtn} onClick={addRoom}>
              + Add Another Room or Hallway
            </button>
          </div>

          {/* STEP 2: Stairs Runner */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>2</span>
              <h2 className={styles.cardTitle}>Stairs Runner (Optional)</h2>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={stairs.enabled}
                  onChange={(e) => setStairs({ ...stairs, enabled: e.target.checked })}
                />
                <span>Include Stairs</span>
              </label>
            </div>

            {stairs.enabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className={styles.fields}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${compId}-steps`}>Number of Steps</label>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${compId}-steps`}
                        type="number"
                        min="1"
                        max="40"
                        className={`${styles.input} ${styles.inputWithBadge}`}
                        value={stairs.steps || ''}
                        onChange={(e) => setStairs({ ...stairs, steps: parseInt(e.target.value, 10) || 0 })}
                      />
                      <span className={styles.unitBadge}>steps</span>
                    </div>
                    <p className={styles.help}>US standard flight: 12–14 steps</p>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Stair Tailoring Style</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className={`${styles.segBtn} ${stairs.style === 'waterfall' ? styles.segBtnActive : ''}`}
                        onClick={() => setStairs({ ...stairs, style: 'waterfall' })}
                        style={{ flex: 1 }}
                      >
                        Waterfall
                        <span className={styles.segBtnSub}>Straight cascade</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.segBtn} ${stairs.style === 'box' ? styles.segBtnActive : ''}`}
                        onClick={() => setStairs({ ...stairs, style: 'box' })}
                        style={{ flex: 1 }}
                      >
                        Box Style
                        <span className={styles.segBtnSub}>Hand-wrapped</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.fields}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${compId}-stair-width`}>Stair Width</label>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${compId}-stair-width`}
                        type="number"
                        className={`${styles.input} ${styles.inputWithBadge}`}
                        value={stairs.stairWidthIn}
                        onChange={(e) => setStairs({ ...stairs, stairWidthIn: parseFloat(e.target.value) || 36 })}
                      />
                      <span className={styles.unitBadge}>in</span>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${compId}-tread`}>Tread Depth</label>
                    <div className={styles.inputWrap}>
                      <input
                        id={`${compId}-tread`}
                        type="number"
                        className={`${styles.input} ${styles.inputWithBadge}`}
                        value={stairs.treadDepthIn}
                        onChange={(e) => setStairs({ ...stairs, treadDepthIn: parseFloat(e.target.value) || 10 })}
                      />
                      <span className={styles.unitBadge}>in</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Carpet Grade & Roll Width */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>3</span>
              <h2 className={styles.cardTitle}>Carpet Grade &amp; Roll Width</h2>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isCarpetTiles}
                  onChange={(e) => setIsCarpetTiles(e.target.checked)}
                />
                <span>Carpet Tiles</span>
              </label>
            </div>

            {!isCarpetTiles && (
              <div className={styles.field} style={{ marginBottom: 14 }}>
                <label className={styles.label}>Roll Width</label>
                <div className={styles.segGrid}>
                  {[12, 13.5, 15].map((w) => (
                    <button
                      key={w}
                      type="button"
                      className={`${styles.segBtn} ${rollWidthFt === w ? styles.segBtnActive : ''}`}
                      onClick={() => setRollWidthFt(w)}
                    >
                      {w === 13.5 ? "13' 6\"" : `${w} ft`}
                      <span className={styles.segBtnSub}>{w === 12 ? 'Standard US' : 'Wide roll'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quality Grade Buttons */}
            <div className={styles.field} style={{ marginBottom: 14 }}>
              <label className={styles.label}>Quality Tier Preset</label>
              <div className={styles.segGrid}>
                {(['budget', 'mid', 'premium'] as CarpetGrade[]).map((g) => {
                  const info = CARPET_GRADES[g];
                  return (
                    <button
                      key={g}
                      type="button"
                      className={`${styles.segBtn} ${selectedGrade === g ? styles.segBtnActive : ''}`}
                      onClick={() => handleGradeSelect(g)}
                    >
                      {info.name.split(' (')[0]}
                      <span className={styles.segBtnSub}>
                        {currencySymbol}{priceUnit === 'sqft' ? info.typical.toFixed(2) : (info.typical * 9).toFixed(2)}/{priceUnit === 'sqft' ? 'sq ft' : 'sq yd'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editable Price Input with Sq Ft / Sq Yd Toggle */}
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${compId}-carpet-price`}>
                  Carpet Material Price
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id={`${compId}-carpet-price`}
                    type="number"
                    step="0.1"
                    min="0"
                    className={`${styles.input} ${styles.inputWithBadge}`}
                    value={
                      priceUnit === 'sqft'
                        ? carpetPricePerSqFt
                        : Math.round(carpetPricePerSqFt * SQFT_PER_SQYD * 100) / 100
                    }
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setCarpetPricePerSqFt(priceUnit === 'sqft' ? val : val / SQFT_PER_SQYD);
                    }}
                  />
                  <span className={styles.unitBadge}>
                    {currencySymbol}/{priceUnit === 'sqft' ? 'sq ft' : 'sq yd'}
                  </span>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Price Quoted In</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className={`${styles.segBtn} ${priceUnit === 'sqft' ? styles.segBtnActive : ''}`}
                    onClick={() => setPriceUnit('sqft')}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Per Sq Ft
                  </button>
                  <button
                    type="button"
                    className={`${styles.segBtn} ${priceUnit === 'sqyd' ? styles.segBtnActive : ''}`}
                    onClick={() => setPriceUnit('sqyd')}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Per Sq Yard (×9)
                  </button>
                </div>
              </div>
            </div>

            {/* Pattern match allowance */}
            <div className={styles.field} style={{ marginTop: 10 }}>
              <label className={styles.label}>Pattern Match Overage</label>
              <div className={styles.segGrid}>
                {[
                  { pct: 0, label: '0%', sub: 'Solid / Texture' },
                  { pct: 5, label: '5%', sub: 'Small geometric' },
                  { pct: 10, label: '10%', sub: 'Large repeat' },
                ].map((item) => (
                  <button
                    key={item.pct}
                    type="button"
                    className={`${styles.segBtn} ${patternWastePercent === item.pct ? styles.segBtnActive : ''}`}
                    onClick={() => setPatternWastePercent(item.pct)}
                  >
                    {item.label}
                    <span className={styles.segBtnSub}>{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 4: Cushion / Underlayment Pad */}
          {!isCarpetTiles && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>4</span>
                <h2 className={styles.cardTitle}>Cushion / Underlayment Pad</h2>
              </div>

              <div className={styles.segGrid} style={{ marginBottom: 14 }}>
                {(['standard', 'highDensity', 'luxuryMoisture'] as PadType[]).map((p) => {
                  const info = CARPET_PADS[p];
                  return (
                    <button
                      key={p}
                      type="button"
                      className={`${styles.segBtn} ${selectedPad === p ? styles.segBtnActive : ''}`}
                      onClick={() => handlePadSelect(p)}
                    >
                      {info.thickness} · {info.density}
                      <span className={styles.segBtnSub}>{currencySymbol}{info.typical.toFixed(2)}/sq ft</span>
                    </button>
                  );
                })}
              </div>

              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${compId}-pad-rate`}>
                    Pad Price
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${compId}-pad-rate`}
                      type="number"
                      step="0.05"
                      className={`${styles.input} ${styles.inputWithBadge}`}
                      value={padPricePerSqFt}
                      onChange={(e) => setPadPricePerSqFt(parseFloat(e.target.value) || 0)}
                    />
                    <span className={styles.unitBadge}>{currencySymbol}/sq ft</span>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${compId}-labor-rate`}>
                    Installation Labour
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${compId}-labor-rate`}
                      type="number"
                      step="0.1"
                      className={`${styles.input} ${styles.inputWithBadge}`}
                      value={laborRatePerSqFt}
                      onChange={(e) => setLaborRatePerSqFt(parseFloat(e.target.value) || 0)}
                    />
                    <span className={styles.unitBadge}>{currencySymbol}/sq ft</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Prep, Removal & Extras Accordion */}
          <details className={styles.accordion}>
            <summary className={styles.accordionSummary}>
              <span>5. Prep, Removal &amp; Job Extras ({activeExtrasCount} Active)</span>
              <span>▾</span>
            </summary>

            <div className={styles.accordionContent}>
              {/* Tear-off removal & disposal */}
              <div className={styles.fields}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={includeRemoval}
                    onChange={(e) => setIncludeRemoval(e.target.checked)}
                  />
                  <div>
                    <span className={styles.label}>Old Carpet &amp; Pad Removal</span>
                    <span className={styles.help}>{currencySymbol}{removalRatePerSqFt}/sq ft</span>
                    {includeRemoval && (
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        className={styles.input}
                        style={{ marginTop: 6, padding: '6px 8px', fontSize: '0.82rem' }}
                        value={removalRatePerSqFt}
                        onChange={(e) => setRemovalRatePerSqFt(parseFloat(e.target.value) || 0)}
                        title="Removal rate $/sq ft"
                      />
                    )}
                  </div>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={includeDisposal}
                    onChange={(e) => setIncludeDisposal(e.target.checked)}
                  />
                  <div>
                    <span className={styles.label}>Debris Disposal &amp; Haul</span>
                    <span className={styles.help}>{currencySymbol}{disposalRatePerSqFt}/sq ft</span>
                    {includeDisposal && (
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        className={styles.input}
                        style={{ marginTop: 6, padding: '6px 8px', fontSize: '0.82rem' }}
                        value={disposalRatePerSqFt}
                        onChange={(e) => setDisposalRatePerSqFt(parseFloat(e.target.value) || 0)}
                        title="Disposal rate $/sq ft"
                      />
                    )}
                  </div>
                </label>
              </div>

              {/* Tack strips & Transitions */}
              <div className={styles.fields}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={replaceTackStrips}
                    onChange={(e) => setReplaceTackStrips(e.target.checked)}
                  />
                  <div>
                    <span className={styles.label}>Replace Tack Strips</span>
                    <span className={styles.help}>{currencySymbol}{tackStripRatePerFt}/linear ft</span>
                    {replaceTackStrips && (
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        className={styles.input}
                        style={{ marginTop: 6, padding: '6px 8px', fontSize: '0.82rem' }}
                        value={tackStripRatePerFt}
                        onChange={(e) => setTackStripRatePerFt(parseFloat(e.target.value) || 0)}
                        title="Tack strip rate $/lin ft"
                      />
                    )}
                  </div>
                </label>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${compId}-transitions`}>
                    Transition Bars ({currencySymbol}{transitionRate} ea)
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      id={`${compId}-transitions`}
                      type="number"
                      min="0"
                      className={styles.input}
                      value={transitionCount}
                      onChange={(e) => setTransitionCount(parseInt(e.target.value, 10) || 0)}
                      placeholder="Count"
                    />
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      style={{ width: '90px' }}
                      value={transitionRate}
                      onChange={(e) => setTransitionRate(parseFloat(e.target.value) || 0)}
                      placeholder="$/ea"
                    />
                  </div>
                </div>
              </div>

              {/* Furniture moving & Subfloor repair */}
              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${compId}-furniture`}>
                    Furniture Moving ({currencySymbol}{furnitureRatePerRoom}/room)
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      id={`${compId}-furniture`}
                      type="number"
                      min="0"
                      className={styles.input}
                      value={furnitureRoomsCount}
                      onChange={(e) => setFurnitureRoomsCount(parseInt(e.target.value, 10) || 0)}
                      placeholder="Rooms"
                    />
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      style={{ width: '90px' }}
                      value={furnitureRatePerRoom}
                      onChange={(e) => setFurnitureRatePerRoom(parseFloat(e.target.value) || 0)}
                      placeholder="$/room"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${compId}-subfloor`}>
                    Subfloor Patching ({currencySymbol}{subfloorRatePerSqFt}/sq ft)
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      id={`${compId}-subfloor`}
                      type="number"
                      min="0"
                      className={styles.input}
                      value={subfloorRepairSqFt}
                      onChange={(e) => setSubfloorRepairSqFt(parseFloat(e.target.value) || 0)}
                      placeholder="Sq Ft"
                    />
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      className={styles.input}
                      style={{ width: '90px' }}
                      value={subfloorRatePerSqFt}
                      onChange={(e) => setSubfloorRatePerSqFt(parseFloat(e.target.value) || 0)}
                      placeholder="$/sq ft"
                    />
                  </div>
                </div>
              </div>

              {/* Door Trimming */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${compId}-doors`}>
                  Interior Doors to Trim / Undercut ({currencySymbol}{doorTrimRate} each)
                </label>
                <div style={{ display: 'flex', gap: 6, maxWidth: '280px' }}>
                  <input
                    id={`${compId}-doors`}
                    type="number"
                    min="0"
                    className={styles.input}
                    value={doorsToTrimCount}
                    onChange={(e) => setDoorsToTrimCount(parseInt(e.target.value, 10) || 0)}
                    placeholder="Doors"
                  />
                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    style={{ width: '100px' }}
                    value={doorTrimRate}
                    onChange={(e) => setDoorTrimRate(parseFloat(e.target.value) || 0)}
                    placeholder="$/door"
                  />
                </div>
              </div>
            </div>
          </details>

          {/* STEP 6: Region, Taxes & Currency */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>6</span>
              <h2 className={styles.cardTitle}>Region, Taxes &amp; Currency</h2>
            </div>

            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${compId}-region`}>
                  Regional Factor: {regionalMultiplier.toFixed(2)}x
                </label>
                <input
                  id={`${compId}-region`}
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.05"
                  value={regionalMultiplier}
                  onChange={(e) => setRegionalMultiplier(parseFloat(e.target.value))}
                />
                <p className={styles.help}>Rural (0.8x) · National Average (1.0x) · High Cost Metro (1.25x)</p>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${compId}-currency`}>Currency Symbol</label>
                <select
                  id={`${compId}-currency`}
                  className={styles.select}
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.symbol}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.fields} style={{ marginTop: 10 }}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${compId}-tax`}>Sales Tax</label>
                <div className={styles.inputWrap}>
                  <input
                    id={`${compId}-tax`}
                    type="number"
                    step="0.5"
                    min="0"
                    max="15"
                    className={`${styles.input} ${styles.inputWithBadge}`}
                    value={salesTaxPercent}
                    onChange={(e) => setSalesTaxPercent(parseFloat(e.target.value) || 0)}
                  />
                  <span className={styles.unitBadge}>%</span>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Tax Applied To</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className={`${styles.segBtn} ${taxMaterialsOnly ? styles.segBtnActive : ''}`}
                    onClick={() => setTaxMaterialsOnly(true)}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Materials Only
                  </button>
                  <button
                    type="button"
                    className={`${styles.segBtn} ${!taxMaterialsOnly ? styles.segBtnActive : ''}`}
                    onClick={() => setTaxMaterialsOnly(false)}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Entire Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Breakdown */}
        <div className={styles.results} aria-live="polite">
          {/* Main Hero Cost Card with Signature Cobalt Blue */}
          <div className={styles.hero}>
            <div className={styles.heroLabel}>Total Estimated Installed Cost</div>
            <div className={styles.heroValue}>
              {currencySymbol}{result.grandTotal.toLocaleString()}
            </div>
            <div className={styles.heroRange}>
              Typical Range: {currencySymbol}{Math.round(result.totalLow).toLocaleString()} – {currencySymbol}{Math.round(result.totalHigh).toLocaleString()}
            </div>

            <div className={styles.heroMetrics}>
              <div className={styles.heroMetricItem}>
                <span className={styles.heroMetricVal}>
                  {currencySymbol}{result.installedCostPerSqFt.toFixed(2)}
                </span>
                <span className={styles.heroMetricLbl}>Per Sq Ft</span>
              </div>
              <div className={styles.heroMetricItem}>
                <span className={styles.heroMetricVal}>
                  {currencySymbol}{result.installedCostPerSqYd.toFixed(2)}
                </span>
                <span className={styles.heroMetricLbl}>Per Sq Yard</span>
              </div>
              <div className={styles.heroMetricItem}>
                <span className={styles.heroMetricVal}>
                  {result.totalBoughtSqFt} sq ft
                </span>
                <span className={styles.heroMetricLbl}>Carpet to Buy</span>
              </div>
            </div>
          </div>

          {/* Area & Takeoff Breakdown Table */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Takeoff Geometry &amp; Overage</h3>
            <table className={styles.breakdownTable} style={{ marginTop: 10 }}>
              <tbody>
                <tr>
                  <td>Room Net Area</td>
                  <td><strong>{result.totalNetSqFt} sq ft ({result.totalNetSqYd} sq yd)</strong></td>
                </tr>
                <tr>
                  <td>Broadloom Carpet to Buy</td>
                  <td><strong>{result.totalBoughtSqFt} sq ft ({result.totalBoughtSqYd} sq yd)</strong></td>
                </tr>
                <tr>
                  <td>Roll Width &amp; Cuts</td>
                  <td>{isCarpetTiles ? 'Carpet Tiles (Modular)' : `${rollWidthFt} ft roll`}</td>
                </tr>
                <tr>
                  <td>Cutting Overage (Waste)</td>
                  <td>{result.totalWastePercent}% ({result.totalWasteSqFt} sq ft off-cuts)</td>
                </tr>
                <tr>
                  <td>Seams Required</td>
                  <td>{result.totalSeams} seam{result.totalSeams !== 1 ? 's' : ''} (Heat-tape ironed)</td>
                </tr>
                <tr>
                  <td>Cushion Underlayment</td>
                  <td>{result.padSqFt} sq ft ({result.padSqYd} sq yd)</td>
                </tr>
                {stairs.enabled && (
                  <tr>
                    <td>Stairs Area ({stairs.steps} steps)</td>
                    <td>{result.stairsNetSqFt} sq ft ({stairs.style === 'box' ? 'Box style' : 'Waterfall'})</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Visual Takeoff Diagram */}
          <div className={styles.card}>
            <CarpetDiagram
              layouts={result.roomRollLayouts}
              stairs={stairs}
              rollWidthFt={rollWidthFt}
            />
          </div>

          {/* Itemized Cost Breakdown Table */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Itemized Cost Breakdown</h3>
            <table className={styles.breakdownTable} style={{ marginTop: 10 }}>
              <thead>
                <tr className={styles.tableGroupRow}>
                  <th>Component</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {result.lineItems
                  .filter((item) => item.enabled && item.subtotal > 0)
                  .map((item) => (
                    <tr key={item.id} className={styles.tableSubRow}>
                      <td>
                        <strong>{item.name}</strong>
                        {item.description && <div className={styles.help}>{item.description}</div>}
                      </td>
                      <td>
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td>
                        {currencySymbol}{item.unitPrice.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {currencySymbol}{Math.round(item.subtotal).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                <tr className={styles.tableTotalRow}>
                  <td colSpan={3}>Estimated Grand Total</td>
                  <td style={{ textAlign: 'right' }}>
                    {currencySymbol}{result.grandTotal.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Contractor Quote Checker */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Verify Contractor Quote</h3>
            <div className={styles.quoteBox}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div className={styles.inputWrap} style={{ flex: 1 }}>
                  <input
                    type="number"
                    placeholder="Enter contractor quote ($)"
                    className={styles.input}
                    value={quoteInput}
                    onChange={(e) => setQuoteInput(e.target.value)}
                  />
                </div>
              </div>
              {quoteCheck && (
                <div
                  className={`${styles.quoteStatus} ${
                    quoteCheck.status === 'below'
                      ? styles.quoteStatusBelow
                      : quoteCheck.status === 'within'
                      ? styles.quoteStatusWithin
                      : styles.quoteStatusAbove
                  }`}
                >
                  <strong>
                    {quoteCheck.status === 'below'
                      ? '⚠️ Low Quote Notice'
                      : quoteCheck.status === 'within'
                      ? '✓ Fair & Competitive Quote'
                      : 'ℹ️ High Quote Notice'}
                  </strong>
                  <p style={{ margin: '4px 0 0 0' }}>{quoteCheck.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Alternative Flooring Comparison */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Carpet vs Other Flooring ({result.totalNetSqFt} sq ft)</h3>
            <table className={styles.breakdownTable} style={{ marginTop: 10 }}>
              <thead>
                <tr className={styles.tableGroupRow}>
                  <th>Flooring</th>
                  <th>Installed / sq ft</th>
                  <th>Total</th>
                  <th>Lifespan</th>
                </tr>
              </thead>
              <tbody>
                {floorComparisons.map((fl, idx) => (
                  <tr key={idx} style={idx === 0 ? { background: 'var(--accent-soft, #e0f2fe)' } : undefined}>
                    <td>
                      <strong>{fl.type}</strong>
                      <div className={styles.help}>{fl.bestFor}</div>
                    </td>
                    <td>{fl.costPerSqFtInstalled}</td>
                    <td style={{ fontWeight: 600 }}>{currencySymbol}{fl.totalCost.toLocaleString()}</td>
                    <td>{fl.lifespanYears}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionsBar}>
            <button type="button" className={styles.actionBtn} onClick={copySummary}>
              📋 Copy Summary
            </button>
            <button type="button" className={styles.actionBtn} onClick={() => window.print()}>
              🖨️ Print Takeoff
            </button>
            <button type="button" className={styles.actionBtn} onClick={shareUrl}>
              🔗 Share Link
            </button>
          </div>

          {toastMessage && <div className={styles.toast}>{toastMessage}</div>}
        </div>
      </div>
    </div>
  );
}
