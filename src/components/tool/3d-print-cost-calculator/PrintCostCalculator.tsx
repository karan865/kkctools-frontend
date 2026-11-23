'use client';

import React, { useState, useEffect, useMemo, useId } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import PrintCostInputGuide from './PrintCostInputGuide';
import styles from './PrintCostCalculator.module.css';
import {
  calculatePrintCost,
  calculateFarmOutput,
  filamentGramsFromLength,
  filamentLengthFromGrams,
} from '@/lib/print-cost-engine';

type TabType = 'filament' | 'resin' | 'pricing' | 'farm';

const TABS: TabItem<TabType>[] = [
  { id: 'filament', label: 'Filament (FDM)' },
  { id: 'resin', label: 'Resin (SLA)' },
  { id: 'pricing', label: 'Price Quote & Markup' },
  { id: 'farm', label: 'Batch & Print Farm' },
];

export default function PrintCostCalculator() {
  const fieldId = useId();
  const [tab, setTab] = useState<TabType>('filament');

  // Material Inputs
  const [gramsUsed, setGramsUsed] = useState<number>(50);
  const [spoolPrice, setSpoolPrice] = useState<number>(20);
  const [spoolWeightGrams, setSpoolWeightGrams] = useState<number>(1000);
  const [filamentDensity, setFilamentDensity] = useState<number>(1.24); // PLA default g/cm³
  const [lengthMode, setLengthMode] = useState<boolean>(false);
  const [metersUsed, setMetersUsed] = useState<number>(16.8);

  // Resin Inputs
  const [resinMlUsed, setResinMlUsed] = useState<number>(40);
  const [bottlePrice, setBottlePrice] = useState<number>(30);
  const [bottleMl, setBottleMl] = useState<number>(1000);
  const [washCureCost, setWashCureCost] = useState<number>(0.5);

  // Time & Electricity Inputs
  const [printHours, setPrintHours] = useState<number>(3);
  const [printMinutes, setPrintMinutes] = useState<number>(0);
  const [printerWatts, setPrinterWatts] = useState<number>(120);
  const [pricePerKwh, setPricePerKwh] = useState<number>(0.15);

  // Machine Wear & Depreciation
  const [printerPrice, setPrinterPrice] = useState<number>(300);
  const [lifetimeHours, setLifetimeHours] = useState<number>(2000);
  const [maintenancePerHour, setMaintenancePerHour] = useState<number>(0);

  // Risk, Labor, Markup & Tax
  const [failurePct, setFailurePct] = useState<number>(5);
  const [laborHours, setLaborHours] = useState<number>(0.25); // 15 mins
  const [laborRatePerHour, setLaborRatePerHour] = useState<number>(20);
  const [packagingCost, setPackagingCost] = useState<number>(0);
  const [markupPct, setMarkupPct] = useState<number>(50);
  const [taxPct, setTaxPct] = useState<number>(0);

  // Batch / Farm Inputs
  const [partsPerPlate, setPartsPerPlate] = useState<number>(1);
  const [printersCount, setPrintersCount] = useState<number>(4);
  const [printsPerDay, setPrintsPerDay] = useState<number>(3);

  // Focus tracking
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // URL tab syncing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') as TabType;
        if (tabParam && ['filament', 'resin', 'pricing', 'farm'].includes(tabParam)) {
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
  };

  // Convert length to grams when lengthMode changes
  const activeGrams = useMemo(() => {
    if (!lengthMode) return gramsUsed;
    return filamentGramsFromLength(metersUsed, 1.75, filamentDensity);
  }, [lengthMode, metersUsed, gramsUsed, filamentDensity]);

  const totalDecimalHours = useMemo(() => {
    return printHours + printMinutes / 60;
  }, [printHours, printMinutes]);

  // Main cost breakdown calculation
  const costBreakdown = useMemo(() => {
    return calculatePrintCost({
      materialType: tab === 'resin' ? 'resin' : 'filament',
      filament: {
        gramsUsed: activeGrams,
        spoolPrice,
        spoolWeightGrams,
      },
      resin: {
        mlUsed: resinMlUsed,
        bottlePrice,
        bottleMl,
        washAndCureCostPerPrint: washCureCost,
      },
      electricity: {
        printerWatts,
        printHours: totalDecimalHours,
        pricePerKwh,
      },
      wear: {
        printerPurchasePrice: printerPrice,
        lifetimeHours,
        maintenancePerHour,
        printHours: totalDecimalHours,
      },
      failurePct,
      laborHours,
      laborRatePerHour,
      packagingCost,
      markupPct,
      taxPct,
      partsPerPlate,
    });
  }, [
    tab,
    activeGrams,
    spoolPrice,
    spoolWeightGrams,
    resinMlUsed,
    bottlePrice,
    bottleMl,
    washCureCost,
    printerWatts,
    totalDecimalHours,
    pricePerKwh,
    printerPrice,
    lifetimeHours,
    maintenancePerHour,
    failurePct,
    laborHours,
    laborRatePerHour,
    packagingCost,
    markupPct,
    taxPct,
    partsPerPlate,
  ]);

  // Farm output calculation
  const farmOutput = useMemo(() => {
    return calculateFarmOutput(
      printersCount,
      printsPerDay,
      partsPerPlate,
      costBreakdown.costPerPart,
      costBreakdown.pricePerPart
    );
  }, [printersCount, printsPerDay, partsPerPlate, costBreakdown.costPerPart, costBreakdown.pricePerPart]);

  const copyQuote = () => {
    const text = `3D Print Quote Summary:\nCost to Produce: $${costBreakdown.totalCost.toFixed(2)}\nQuote Price: $${costBreakdown.finalPriceToCharge.toFixed(2)} (with ${markupPct}% markup)\nMaterial: $${costBreakdown.materialCost.toFixed(2)} | Power: $${costBreakdown.electricityCost.toFixed(2)} | Machine: $${costBreakdown.wearCost.toFixed(2)} | Labor: $${costBreakdown.laborCost.toFixed(2)}\nCalculated at KKCTools.com`;
    navigator.clipboard.writeText(text);
    alert('Quote summary copied to clipboard!');
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
            ariaLabel="3D print cost calculation modes"
          />
        </div>

        {/* Input Guide Diagram */}
        <PrintCostInputGuide
          materialType={tab === 'resin' ? 'resin' : 'filament'}
          materialAmount={tab === 'resin' ? resinMlUsed : Math.round(activeGrams)}
          materialPrice={tab === 'resin' ? bottlePrice : spoolPrice}
          watts={printerWatts}
          hours={Math.round(totalDecimalHours * 10) / 10}
          kwhRate={pricePerKwh}
          wearPerHour={printerPrice / Math.max(1, lifetimeHours)}
          laborCost={laborHours * laborRatePerHour}
          failurePct={failurePct}
          markupPct={markupPct}
          focusedField={focusedField}
        />

        {/* Section 1: Material Consumables */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            1. {tab === 'resin' ? 'Resin Material Consumed' : 'Filament Consumed'}
          </h2>
          {tab !== 'resin' && (
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--cat-engineering)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}
              onClick={() => setLengthMode(!lengthMode)}
            >
              {lengthMode ? 'Switch to weight (grams)' : 'Switch to length (meters)'}
            </button>
          )}
        </div>

        {tab === 'resin' ? (
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f0`} className={styles.label}>Resin Used per Print (mL)</label>
              <input id={`${fieldId}-f0`}
                type="number"
                min="1"
                step="1"
                className={styles.input}
                value={resinMlUsed}
                onFocus={() => setFocusedField('material')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setResinMlUsed(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f1`} className={styles.label}>Bottle Price ($)</label>
              <input id={`${fieldId}-f1`}
                type="number"
                min="1"
                step="1"
                className={styles.input}
                value={bottlePrice}
                onChange={(e) => setBottlePrice(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f2`} className={styles.label}>Bottle Volume (mL)</label>
              <input id={`${fieldId}-f2`}
                type="number"
                min="100"
                step="500"
                className={styles.input}
                value={bottleMl}
                onChange={(e) => setBottleMl(Math.max(1, parseFloat(e.target.value) || 1000))}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f3`} className={styles.label}>
                <span>IPA Wash &amp; Cure Consumables ($)</span>
                <span className={styles.labelSub}>alcohol &amp; gloves/print</span>
              </label>
              <input id={`${fieldId}-f3`}
                type="number"
                min="0"
                step="0.1"
                className={styles.input}
                value={washCureCost}
                onChange={(e) => setWashCureCost(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>
          </div>
        ) : (
          <div className={styles.grid}>
            {lengthMode ? (
              <div className={styles.field}>
                <label htmlFor={`${fieldId}-f4`} className={styles.label}>
                  <span>Filament Length (m)</span>
                  <span className={styles.labelSub}>≈ {activeGrams.toFixed(1)} g</span>
                </label>
                <input id={`${fieldId}-f4`}
                  type="number"
                  min="0.1"
                  step="0.5"
                  className={styles.input}
                  value={metersUsed}
                  onFocus={() => setFocusedField('material')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setMetersUsed(Math.max(0, parseFloat(e.target.value) || 0))}
                />
              </div>
            ) : (
              <div className={styles.field}>
                <label htmlFor={`${fieldId}-f5`} className={styles.label}>
                  <span>1 Filament Weight (g)</span>
                  <span className={styles.labelSub}>from slicer</span>
                </label>
                <input id={`${fieldId}-f5`}
                  type="number"
                  min="1"
                  step="1"
                  className={styles.input}
                  value={gramsUsed}
                  onFocus={() => setFocusedField('material')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setGramsUsed(Math.max(0, parseFloat(e.target.value) || 0))}
                />
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f6`} className={styles.label}>
                <span>2 Spool Price ($)</span>
                <span className={styles.labelSub}>example: $20/spool</span>
              </label>
              <input id={`${fieldId}-f6`}
                type="number"
                min="1"
                step="1"
                className={styles.input}
                value={spoolPrice}
                onChange={(e) => setSpoolPrice(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f7`} className={styles.label}>Spool Net Weight (g)</label>
              <input id={`${fieldId}-f7`}
                type="number"
                min="250"
                step="250"
                className={styles.input}
                value={spoolWeightGrams}
                onChange={(e) => setSpoolWeightGrams(Math.max(1, parseFloat(e.target.value) || 1000))}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f8`} className={styles.label}>
                <span>Filament Density (g/cm³)</span>
                <span className={styles.labelSub}>PLA 1.24 · PETG 1.27 · ABS 1.04</span>
              </label>
              <input id={`${fieldId}-f8`}
                type="number"
                min="0.8"
                max="2.5"
                step="0.01"
                className={styles.input}
                value={filamentDensity}
                onChange={(e) => setFilamentDensity(Math.max(0.1, parseFloat(e.target.value) || 1.24))}
              />
            </div>
          </div>
        )}

        {/* Section 2: Print Time & Electricity */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>2. Print Duration &amp; Power</h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f9`} className={styles.label}>
              <span>4 Print Time</span>
              <span className={styles.labelSub}>from slicer estimate</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input id={`${fieldId}-f9`}
                type="number"
                min="0"
                className={styles.input}
                placeholder="Hours"
                value={printHours}
                onFocus={() => setFocusedField('power')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setPrintHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>h</span>
              <input
                type="number"
                min="0"
                max="59"
                className={styles.input}
                placeholder="Mins"
                value={printMinutes}
                onFocus={() => setFocusedField('power')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setPrintMinutes(Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)))}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>m</span>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f10`} className={styles.label}>
              <span>3 Average Power (Watts)</span>
              <span className={styles.labelSub}>bed + hotend avg (e.g. 120W)</span>
            </label>
            <input id={`${fieldId}-f10`}
              type="number"
              min="10"
              step="10"
              className={styles.input}
              value={printerWatts}
              onFocus={() => setFocusedField('power')}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setPrinterWatts(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f11`} className={styles.label}>
              <span>5 Electricity Rate ($/kWh)</span>
              <span className={styles.labelSub}>US avg ≈ $0.15/kWh</span>
            </label>
            <input id={`${fieldId}-f11`}
              type="number"
              min="0.01"
              step="0.01"
              className={styles.input}
              value={pricePerKwh}
              onChange={(e) => setPricePerKwh(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>
        </div>

        {/* Section 3: Machine Wear, Labor & Markup */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>3. Machine Depreciation, Labor &amp; Profit</h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f12`} className={styles.label}>
              <span>6 Machine Purchase Price ($)</span>
              <span className={styles.labelSub}>e.g. $300 printer</span>
            </label>
            <input id={`${fieldId}-f12`}
              type="number"
              min="50"
              step="50"
              className={styles.input}
              value={printerPrice}
              onChange={(e) => setPrinterPrice(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f13`} className={styles.label}>
              <span>Lifetime Service Hours</span>
              <span className={styles.labelSub}>your own estimate</span>
            </label>
            <input id={`${fieldId}-f13`}
              type="number"
              min="500"
              step="500"
              className={styles.input}
              value={lifetimeHours}
              onChange={(e) => setLifetimeHours(Math.max(1, parseFloat(e.target.value) || 1))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f14`} className={styles.label}>
              <span>8 Print Failure Rate (%)</span>
              <span className={styles.labelSub}>contingency buffer</span>
            </label>
            <input id={`${fieldId}-f14`}
              type="number"
              min="0"
              max="50"
              step="1"
              className={styles.input}
              value={failurePct}
              onChange={(e) => setFailurePct(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f15`} className={styles.label}>
              <span>7 Labor Time (Hours)</span>
              <span className={styles.labelSub}>slicing, bed prep &amp; support removal</span>
            </label>
            <input id={`${fieldId}-f15`}
              type="number"
              min="0"
              step="0.05"
              className={styles.input}
              value={laborHours}
              onChange={(e) => setLaborHours(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f16`} className={styles.label}>
              <span>Labor Hourly Rate ($/hr)</span>
              <span className={styles.labelSub}>your shop rate</span>
            </label>
            <input id={`${fieldId}-f16`}
              type="number"
              min="0"
              step="5"
              className={styles.input}
              value={laborRatePerHour}
              onChange={(e) => setLaborRatePerHour(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f17`} className={styles.label}>
              <span>9 Profit Markup (%)</span>
              <span className={styles.labelSub}>your choice</span>
            </label>
            <input id={`${fieldId}-f17`}
              type="number"
              min="0"
              step="5"
              className={styles.input}
              value={markupPct}
              onChange={(e) => setMarkupPct(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>
        </div>

        {/* Section 4: Batch / Print Farm (on 'farm' or 'pricing' tab) */}
        {(tab === 'farm' || tab === 'pricing') && (
          <>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>4. Batch Multipliers &amp; Farm Scaling</h2>
            </div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={`${fieldId}-f18`} className={styles.label}>Parts per Build Plate</label>
                <input id={`${fieldId}-f18`}
                  type="number"
                  min="1"
                  step="1"
                  className={styles.input}
                  value={partsPerPlate}
                  onChange={(e) => setPartsPerPlate(Math.max(1, parseInt(e.target.value, 10) || 1))}
                />
              </div>
              {tab === 'farm' && (
                <>
                  <div className={styles.field}>
                    <label htmlFor={`${fieldId}-f19`} className={styles.label}>Number of 3D Printers</label>
                    <input id={`${fieldId}-f19`}
                      type="number"
                      min="1"
                      step="1"
                      className={styles.input}
                      value={printersCount}
                      onChange={(e) => setPrintersCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor={`${fieldId}-f20`} className={styles.label}>Plates / Prints per Day per Machine</label>
                    <input id={`${fieldId}-f20`}
                      type="number"
                      min="1"
                      step="1"
                      className={styles.input}
                      value={printsPerDay}
                      onChange={(e) => setPrintsPerDay(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Results Panel */}
        <div className={styles.resultsBand}>
          <div className={styles.heroRow}>
            <div className={styles.heroCard}>
              <div className={styles.heroLabel}>True Production Cost</div>
              <div className={styles.heroValue}>${costBreakdown.totalCost.toFixed(2)}</div>
              <div className={styles.heroSub}>
                ${costBreakdown.totalConsumablesWithFailure.toFixed(2)} consumables + ${costBreakdown.laborCost.toFixed(2)} labor
              </div>
            </div>

            <div className={styles.heroCard}>
              <div className={styles.heroLabel}>Recommended Selling Price</div>
              <div className={styles.heroValue}>
                ${costBreakdown.finalPriceToCharge.toFixed(2)}
              </div>
              <div className={styles.heroSub}>
                +{markupPct}% markup (${costBreakdown.markupAmount.toFixed(2)} net margin)
              </div>
            </div>
          </div>

          {/* Plain English Summary Sentence */}
          <div className={styles.sentence}>
            This {activeGrams.toFixed(0)} g {tab === 'resin' ? 'resin' : 'PLA'} print costs about{' '}
            <strong>${costBreakdown.totalConsumablesWithFailure.toFixed(2)}</strong> in material, power and machine time,
            or <strong>${costBreakdown.totalCost.toFixed(2)}</strong> with {Math.round(laborHours * 60)} minutes of labor.
            At a {markupPct}% markup, charge about <strong>${costBreakdown.finalPriceToCharge.toFixed(2)}</strong>.
            {partsPerPlate > 1 && ` (or $${costBreakdown.pricePerPart.toFixed(2)} per part across ${partsPerPlate} parts).`}
          </div>

          {/* Itemized Cost Breakdown Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cost Element</th>
                  <th>Formula / Details</th>
                  <th>Amount</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Material (Filament / Resin)</strong></td>
                  <td>{tab === 'resin' ? `${resinMlUsed} mL @ $${(bottlePrice/bottleMl).toFixed(3)}/mL` : `${activeGrams.toFixed(1)} g @ $${(spoolPrice/spoolWeightGrams).toFixed(3)}/g`}</td>
                  <td>${costBreakdown.materialCost.toFixed(2)}</td>
                  <td>{costBreakdown.totalCost > 0 ? ((costBreakdown.materialCost / costBreakdown.totalCost) * 100).toFixed(1) : 0}%</td>
                </tr>
                <tr>
                  <td><strong>Electricity</strong></td>
                  <td>{((printerWatts/1000) * totalDecimalHours).toFixed(2)} kWh @ ${pricePerKwh.toFixed(2)}/kWh</td>
                  <td>${costBreakdown.electricityCost.toFixed(3)}</td>
                  <td>{costBreakdown.totalCost > 0 ? ((costBreakdown.electricityCost / costBreakdown.totalCost) * 100).toFixed(1) : 0}%</td>
                </tr>
                <tr>
                  <td><strong>Machine Wear &amp; Depreciation</strong></td>
                  <td>${(printerPrice/lifetimeHours).toFixed(2)}/hr × {totalDecimalHours.toFixed(1)} hrs</td>
                  <td>${costBreakdown.wearCost.toFixed(2)}</td>
                  <td>{costBreakdown.totalCost > 0 ? ((costBreakdown.wearCost / costBreakdown.totalCost) * 100).toFixed(1) : 0}%</td>
                </tr>
                <tr>
                  <td><strong>Failure Buffer ({failurePct}%)</strong></td>
                  <td>Compounded contingency for failed prints</td>
                  <td>${costBreakdown.failureAllowanceCost.toFixed(2)}</td>
                  <td>{costBreakdown.totalCost > 0 ? ((costBreakdown.failureAllowanceCost / costBreakdown.totalCost) * 100).toFixed(1) : 0}%</td>
                </tr>
                <tr>
                  <td><strong>Hands-on Labor</strong></td>
                  <td>{laborHours.toFixed(2)} hrs @ ${laborRatePerHour.toFixed(2)}/hr</td>
                  <td>${costBreakdown.laborCost.toFixed(2)}</td>
                  <td>{costBreakdown.totalCost > 0 ? ((costBreakdown.laborCost / costBreakdown.totalCost) * 100).toFixed(1) : 0}%</td>
                </tr>
                <tr>
                  <td><strong>Total Cost of Goods Sold (COGS)</strong></td>
                  <td>Base production threshold</td>
                  <td><strong>${costBreakdown.totalCost.toFixed(2)}</strong></td>
                  <td><strong>100.0%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Farm Scaling Output if Farm Tab */}
          {tab === 'farm' && (
            <div className={styles.heroRow} style={{ marginTop: '16px' }}>
              <div className={styles.heroCard}>
                <div className={styles.heroLabel}>Daily Farm Output ({printersCount} Printers)</div>
                <div className={styles.heroValue}>{farmOutput.partsPerDay} parts</div>
                <div className={styles.heroSub}>
                  ${farmOutput.dailyRevenue.toFixed(0)} daily gross / ${farmOutput.dailyProfit.toFixed(0)} daily profit
                </div>
              </div>
              <div className={styles.heroCard}>
                <div className={styles.heroLabel}>Monthly Potential (30 Days)</div>
                <div className={styles.heroValue}>${farmOutput.monthlyRevenue.toLocaleString()}</div>
                <div className={styles.heroSub}>
                  ${farmOutput.monthlyProfit.toLocaleString()} estimated monthly net profit
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className={styles.actionBar}>
            <button type="button" className={styles.actionBtn} onClick={copyQuote}>
              Copy Quote
            </button>
            <button type="button" className={styles.actionBtnSecondary} onClick={handlePrint}>
              Print Quote Card
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
