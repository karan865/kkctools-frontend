'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import ToolShell from '@/components/tool/shared/ToolShell';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import CmInputGuide, { CmFieldId } from './CmInputGuide';
import styles from './ContributionMarginCalculator.module.css';
import {
  calculateSingleProductCvp,
  calculateSalesMixCvp,
  calculateWhatIfScenario,
  ProductMixItemInput,
} from '@/lib/contribution-margin-engine';

type CmTab = 'single' | 'mix' | 'whatif';

const TABS: TabItem<CmTab>[] = [
  { id: 'single', label: 'Single Product & Break-Even' },
  { id: 'mix', label: 'Multi-Product Sales Mix' },
  { id: 'whatif', label: 'What-If Sensitivity Matrix' },
];

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function ContributionMarginCalculatorInner() {
  const [activeTab, setActiveTab] = useState<CmTab>('single');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as CmTab;
      if (tabParam === 'mix' || tabParam === 'whatif') {
        const timer = setTimeout(() => setActiveTab(tabParam), 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleTabChange = (tabId: CmTab) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const [activeField, setActiveField] = useState<CmFieldId | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  // Tab 1 (Single Product) Inputs
  const [price, setPrice] = useState<number>(50);
  const [variableCost, setVariableCost] = useState<number>(30);
  const [fixedCosts, setFixedCosts] = useState<number>(20000);
  const [unitsSold, setUnitsSold] = useState<number>(1500);
  const [targetProfit, setTargetProfit] = useState<number>(15000);
  const [isTargetAfterTax, setIsTargetAfterTax] = useState<boolean>(false);
  const [taxRatePercent, setTaxRatePercent] = useState<number>(21);
  const [monthlyVolume, setMonthlyVolume] = useState<number>(250);

  // Tab 2 (Sales Mix) Inputs
  const [mixFixedCosts, setMixFixedCosts] = useState<number>(90000);
  const [mixProducts, setMixProducts] = useState<ProductMixItemInput[]>([
    { id: '1', name: 'Premium Service', sellingPrice: 100, variableCostPerUnit: 40, mixPercent: 70 },
    { id: '2', name: 'Standard Package', sellingPrice: 50, variableCostPerUnit: 40, mixPercent: 30 },
  ]);

  // Tab 3 (What-If Sliders)
  const [priceDeltaPct, setPriceDeltaPct] = useState<number>(0);
  const [vcDeltaPct, setVcDeltaPct] = useState<number>(0);
  const [fixedDeltaPct, setFixedDeltaPct] = useState<number>(0);
  const [volumeDeltaPct, setVolumeDeltaPct] = useState<number>(0);

  // Single Product Calculation
  const singleResult = useMemo(() => {
    return calculateSingleProductCvp({
      sellingPrice: price,
      variableCostPerUnit: variableCost,
      fixedCosts: fixedCosts,
      unitsSold: unitsSold,
      targetProfit: targetProfit,
      isTargetAfterTax: isTargetAfterTax,
      taxRatePercent: taxRatePercent,
      monthlyUnitVolume: monthlyVolume,
    });
  }, [price, variableCost, fixedCosts, unitsSold, targetProfit, isTargetAfterTax, taxRatePercent, monthlyVolume]);

  // Sales Mix Calculation
  const mixResult = useMemo(() => {
    return calculateSalesMixCvp(mixProducts, mixFixedCosts);
  }, [mixProducts, mixFixedCosts]);

  // What-If Calculation
  const whatIfResult = useMemo(() => {
    return calculateWhatIfScenario({
      base: {
        sellingPrice: price,
        variableCostPerUnit: variableCost,
        fixedCosts: fixedCosts,
        unitsSold: unitsSold,
      },
      priceChangePct: priceDeltaPct,
      variableCostChangePct: vcDeltaPct,
      fixedCostChangePct: fixedDeltaPct,
      volumeChangePct: volumeDeltaPct,
    });
  }, [price, variableCost, fixedCosts, unitsSold, priceDeltaPct, vcDeltaPct, fixedDeltaPct, volumeDeltaPct]);

  const handleCopySummary = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    let summaryText = '';
    if (activeTab === 'single') {
      summaryText = [
        'KKC Tools — Contribution Margin & Break-Even Analysis',
        `Selling Price: $${price.toFixed(2)} | Variable Cost: $${variableCost.toFixed(2)}`,
        `Contribution Margin: $${singleResult.cmPerUnit.toFixed(2)} (${singleResult.cmRatio !== null ? `${(singleResult.cmRatio * 100).toFixed(1)}%` : '0%'} ratio)`,
        `Fixed Operating Costs: $${fixedCosts.toLocaleString()}`,
        `Break-Even Point: ${singleResult.breakEvenUnits !== null ? `${Math.ceil(singleResult.breakEvenUnits).toLocaleString()} units ($${Math.round(singleResult.breakEvenSales || 0).toLocaleString()})` : 'N/A'}`,
        `Current Volume: ${unitsSold.toLocaleString()} units | Net Operating Income: $${Math.round(singleResult.operatingIncome).toLocaleString()}`,
        `Margin of Safety: ${singleResult.marginOfSafetyUnits !== null ? `${Math.round(singleResult.marginOfSafetyUnits).toLocaleString()} units (${(singleResult.marginOfSafetyRatio! * 100).toFixed(1)}%)` : 'N/A'}`,
        `Degree of Operating Leverage (DOL): ${singleResult.dol !== null ? singleResult.dol.toFixed(2) : 'N/A'}`,
      ].join('\n');
    } else if (activeTab === 'mix') {
      summaryText = [
        'KKC Tools — Multi-Product Sales Mix Break-Even Analysis',
        `Fixed Operating Overhead: $${mixFixedCosts.toLocaleString()}`,
        `Weighted Contribution Margin: $${mixResult.weightedCmPerUnit.toFixed(2)}/unit (Weighted CM Ratio: ${(mixResult.weightedCmRatio * 100).toFixed(1)}%)`,
        `Company-Wide Break-Even: ${mixResult.breakEvenTotalUnits !== null ? `${Math.ceil(mixResult.breakEvenTotalUnits).toLocaleString()} units ($${Math.round(mixResult.breakEvenTotalSales || 0).toLocaleString()})` : 'N/A'}`,
        ...mixResult.products.map(
          (p) =>
            `- ${p.name}: ${p.mixPercent.toFixed(1)}% mix, CM $${p.cmPerUnit.toFixed(2)} (${(p.cmRatio * 100).toFixed(1)}%), BE: ${p.breakEvenUnits ? Math.ceil(p.breakEvenUnits).toLocaleString() : '—'} units ($${p.breakEvenSales ? Math.round(p.breakEvenSales).toLocaleString() : '—'})`
        ),
      ].join('\n');
    } else {
      summaryText = [
        'KKC Tools — CVP What-If Simulation',
        `Adjustments: Price ${priceDeltaPct > 0 ? `+${priceDeltaPct}` : priceDeltaPct}%, VC ${vcDeltaPct > 0 ? `+${vcDeltaPct}` : vcDeltaPct}%, Fixed ${fixedDeltaPct > 0 ? `+${fixedDeltaPct}` : fixedDeltaPct}%, Volume ${volumeDeltaPct > 0 ? `+${volumeDeltaPct}` : volumeDeltaPct}%`,
        `Simulated Operating Income: $${Math.round(whatIfResult.operatingIncome).toLocaleString()} (${whatIfResult.incomeChangeFromBase >= 0 ? `+$${Math.round(whatIfResult.incomeChangeFromBase).toLocaleString()}` : `-$${Math.round(Math.abs(whatIfResult.incomeChangeFromBase)).toLocaleString()}`})`,
        `Simulated Break-Even: ${whatIfResult.breakEvenUnits !== null ? `${Math.ceil(whatIfResult.breakEvenUnits).toLocaleString()} units` : 'N/A'}`,
      ].join('\n');
    }

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  // Mix product handlers
  const handleAddMixProduct = () => {
    const newId = String(Date.now());
    setMixProducts([
      ...mixProducts,
      { id: newId, name: `Product ${mixProducts.length + 1}`, sellingPrice: 60, variableCostPerUnit: 35, mixPercent: 0 },
    ]);
  };

  const handleRemoveMixProduct = (id: string) => {
    if (mixProducts.length <= 1) return;
    setMixProducts(mixProducts.filter((p) => p.id !== id));
  };

  const handleUpdateMixProduct = (id: string, field: keyof ProductMixItemInput, val: string | number) => {
    setMixProducts(
      mixProducts.map((p) => {
        if (p.id !== id) return p;
        return { ...p, [field]: val };
      })
    );
  };

  // CVP Chart Data Points
  const maxChartUnits = Math.max(
    100,
    singleResult.breakEvenUnits ? Math.max(singleResult.breakEvenUnits * 1.8, unitsSold * 1.3) : unitsSold * 1.8
  );
  const maxChartDollars = Math.max(
    1000,
    singleResult.breakEvenSales ? Math.max(singleResult.breakEvenSales * 1.8, singleResult.totalRevenue * 1.3) : singleResult.totalRevenue * 1.8
  );

  const chartW = 420;
  const chartH = 220;
  const padL = 45;
  const padR = 20;
  const padT = 20;
  const padB = 35;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const toX = (u: number) => padL + (u / maxChartUnits) * plotW;
  const toY = (d: number) => padT + plotH - (d / maxChartDollars) * plotH;

  const beX = singleResult.breakEvenUnits ? toX(singleResult.breakEvenUnits) : null;
  const beY = singleResult.breakEvenSales ? toY(singleResult.breakEvenSales) : null;
  const curX = toX(unitsSold);

  return (
    <ToolShell
      features={[
        'Break-even in units & $',
        'Margin of safety',
        'Sales-mix mode',
        'Step-by-step working',
      ]}
    >
      <div className={styles.container}>
        {/* Tab Selection */}
        <div className={styles.tabWrapper}>
          <TabSlider tabs={TABS} activeId={activeTab} onChange={handleTabChange} ariaLabel="Contribution margin calculator modes" />
        </div>

        {/* Input Guide Diagram */}
        <CmInputGuide
          mode={activeTab}
          activeField={activeField}
          sellingPrice={price}
          variableCost={variableCost}
          fixedCosts={fixedCosts}
          unitsSold={unitsSold}
          targetProfit={targetProfit}
          cmPerUnit={singleResult.cmPerUnit}
          cmRatio={singleResult.cmRatio}
          breakEvenUnits={singleResult.breakEvenUnits}
          breakEvenSales={singleResult.breakEvenSales}
        />

        {/* High-Contrast Light Mint Summary Banner */}
        <div className={styles.summaryBanner} role="status">
          {activeTab === 'single' ? (
            <>
              Each unit sold for <span className={styles.summaryHighlight}>${price.toFixed(2)}</span> with{' '}
              <span className={styles.summaryHighlight}>${variableCost.toFixed(2)}</span> of variable cost contributes{' '}
              <span className={styles.summaryHighlight}>${singleResult.cmPerUnit.toFixed(2)}</span> (a{' '}
              <span className={styles.summaryHighlight}>
                {singleResult.cmRatio !== null ? `${(singleResult.cmRatio * 100).toFixed(1)}%` : '0%'}
              </span>{' '}
              contribution margin ratio). With <span className={styles.summaryHighlight}>${fixedCosts.toLocaleString()}</span> of
              fixed costs you break even at{' '}
              <span className={styles.summaryHighlight}>
                {singleResult.breakEvenUnits !== null ? `${Math.ceil(singleResult.breakEvenUnits).toLocaleString()} units` : '—'}
              </span>{' '}
              (
              <span className={styles.summaryHighlight}>
                {singleResult.breakEvenSales !== null ? `$${Math.round(singleResult.breakEvenSales).toLocaleString()}` : '—'}
              </span>{' '}
              of sales).
            </>
          ) : activeTab === 'mix' ? (
            <>
              Across {mixResult.products.length} products, your weighted contribution margin is{' '}
              <span className={styles.summaryHighlight}>${mixResult.weightedCmPerUnit.toFixed(2)} per unit</span> (a{' '}
              <span className={styles.summaryHighlight}>{(mixResult.weightedCmRatio * 100).toFixed(1)}%</span> weighted ratio).
              To absorb <span className={styles.summaryHighlight}>${mixFixedCosts.toLocaleString()}</span> in fixed costs, you need{' '}
              <span className={styles.summaryHighlight}>
                {mixResult.breakEvenTotalUnits !== null ? `${Math.ceil(mixResult.breakEvenTotalUnits).toLocaleString()} total units` : '—'}
              </span>{' '}
              (
              <span className={styles.summaryHighlight}>
                {mixResult.breakEvenTotalSales !== null ? `$${Math.round(mixResult.breakEvenTotalSales).toLocaleString()}` : '—'}
              </span>{' '}
              in combined revenue).
            </>
          ) : (
            <>
              What-If Simulation: Adjusting prices, variable costs, overhead, or volume shifts your net operating profit by{' '}
              <span className={styles.summaryHighlight}>
                {whatIfResult.incomeChangeFromBase >= 0
                  ? `+$${Math.round(whatIfResult.incomeChangeFromBase).toLocaleString()}`
                  : `-$${Math.round(Math.abs(whatIfResult.incomeChangeFromBase)).toLocaleString()}`}
              </span>{' '}
              to{' '}
              <span className={styles.summaryHighlight}>
                ${Math.round(whatIfResult.operatingIncome).toLocaleString()}
              </span>{' '}
              with a revised break-even point of{' '}
              <span className={styles.summaryHighlight}>
                {whatIfResult.breakEvenUnits !== null ? `${Math.ceil(whatIfResult.breakEvenUnits).toLocaleString()} units` : '—'}
              </span>.
            </>
          )}
        </div>

        {/* Main Grid */}
        <div className={styles.grid}>
          {/* LEFT: Inputs Card */}
          <div className={styles.formCard}>
            {activeTab === 'single' ? (
              <>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Single Product &amp; Cost Inputs</h3>
                  <span className={styles.cardSubtitle}>CVP Model Parameters</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="cm-price" className={styles.fieldLabel}>
                    <span>1. Selling Price per Unit</span>
                    <span className={styles.fieldHint}>Retail / Invoice price</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="cm-price"
                      type="number"
                      step="0.01"
                      min="0"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={price || ''}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('sellingPrice')}
                      onBlur={() => setActiveField(null)}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="cm-vc" className={styles.fieldLabel}>
                    <span>2. Variable Cost per Unit</span>
                    <span className={styles.fieldHint}>Materials, direct labor, commission</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="cm-vc"
                      type="number"
                      step="0.01"
                      min="0"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={variableCost || ''}
                      onChange={(e) => setVariableCost(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('variableCost')}
                      onBlur={() => setActiveField(null)}
                    />
                  </div>
                  <div className={styles.helperText}>
                    Cost incurred strictly when a unit is produced and sold.
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="cm-fixed" className={styles.fieldLabel}>
                    <span>3. Fixed Operating Overhead</span>
                    <span className={styles.fieldHint}>Rent, insurance, salaries, software</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="cm-fixed"
                      type="number"
                      step="100"
                      min="0"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={fixedCosts || ''}
                      onChange={(e) => setFixedCosts(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('fixedCosts')}
                      onBlur={() => setActiveField(null)}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="cm-units" className={styles.fieldLabel}>
                    <span>4. Current / Planned Units Sold</span>
                    <span className={styles.fieldHint}>Production volume for period</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="cm-units"
                      type="number"
                      step="10"
                      min="0"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={unitsSold || ''}
                      onChange={(e) => setUnitsSold(parseInt(e.target.value, 10) || 0)}
                      onFocus={() => setActiveField('unitsSold')}
                      onBlur={() => setActiveField(null)}
                    />
                    <span className={styles.inputSuffix}>units</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="cm-target" className={styles.fieldLabel}>
                    <span>5. Target Profit Goal</span>
                    <span className={styles.fieldHint}>Desired net operating income</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="cm-target"
                      type="number"
                      step="500"
                      min="0"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={targetProfit || ''}
                      onChange={(e) => setTargetProfit(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('targetProfit')}
                      onBlur={() => setActiveField(null)}
                    />
                  </div>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={isTargetAfterTax}
                      onChange={(e) => setIsTargetAfterTax(e.target.checked)}
                    />
                    <span>Target is After-Tax Profit (requires tax rate gross-up)</span>
                  </label>

                  {isTargetAfterTax && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <label htmlFor="cm-tax" className={styles.fieldLabel}>
                        <span>Corporate / Income Tax Rate</span>
                      </label>
                      <div className={styles.inputWrapper}>
                        <input
                          id="cm-tax"
                          type="number"
                          step="1"
                          min="0"
                          max="90"
                          className={`${styles.input} ${styles.inputWithSuffix}`}
                          value={taxRatePercent}
                          onChange={(e) => setTaxRatePercent(parseFloat(e.target.value) || 0)}
                        />
                        <span className={styles.inputSuffix}>%</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="cm-monthly" className={styles.fieldLabel}>
                    <span>Monthly Run-Rate Volume (Optional)</span>
                    <span className={styles.fieldHint}>For time-to-break-even</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="cm-monthly"
                      type="number"
                      step="10"
                      min="0"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={monthlyVolume || ''}
                      onChange={(e) => setMonthlyVolume(parseInt(e.target.value, 10) || 0)}
                    />
                    <span className={styles.inputSuffix}>units/mo</span>
                  </div>
                </div>
              </>
            ) : activeTab === 'mix' ? (
              <>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Multi-Product Sales Mix</h3>
                  <span className={styles.cardSubtitle}>Weighted CVP Portfolio</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="mix-fixed" className={styles.fieldLabel}>
                    <span>Total Company Fixed Costs</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="mix-fixed"
                      type="number"
                      step="500"
                      min="0"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={mixFixedCosts || ''}
                      onChange={(e) => setMixFixedCosts(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                  <table className={styles.mixTable}>
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Price ($)</th>
                        <th>VC ($)</th>
                        <th>Mix %</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mixProducts.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <input
                              type="text"
                              className={`${styles.mixInput} ${styles.mixInputText}`}
                              value={p.name}
                              onChange={(e) => handleUpdateMixProduct(p.id, 'name', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className={styles.mixInput}
                              value={p.sellingPrice}
                              onChange={(e) => handleUpdateMixProduct(p.id, 'sellingPrice', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className={styles.mixInput}
                              value={p.variableCostPerUnit}
                              onChange={(e) => handleUpdateMixProduct(p.id, 'variableCostPerUnit', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="1"
                              className={styles.mixInput}
                              value={p.mixPercent ?? 0}
                              onChange={(e) => handleUpdateMixProduct(p.id, 'mixPercent', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {mixProducts.length > 1 && (
                              <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => handleRemoveMixProduct(p.id)}
                                aria-label={`Remove ${p.name}`}
                              >
                                ✕
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button type="button" className={styles.addBtn} onClick={handleAddMixProduct}>
                  + Add Product to Mix
                </button>
              </>
            ) : (
              <>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>What-If Sensitivity Sliders</h3>
                  <span className={styles.cardSubtitle}>Test Pricing &amp; Cost Levers</span>
                </div>

                <div className={styles.sliderGroup}>
                  <div className={styles.sliderHeader}>
                    <span>Selling Price Change</span>
                    <span className={styles.sliderValue}>
                      {priceDeltaPct > 0 ? `+${priceDeltaPct}%` : `${priceDeltaPct}%`} ($
                      {((price * (100 + priceDeltaPct)) / 100).toFixed(2)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    step="1"
                    className={styles.sliderInput}
                    value={priceDeltaPct}
                    onChange={(e) => setPriceDeltaPct(parseInt(e.target.value, 10))}
                  />
                  <div className={styles.sliderRangeLabels}>
                    <span>−25% Discount</span>
                    <span>0% Base</span>
                    <span>+25% Premium</span>
                  </div>
                </div>

                <div className={styles.sliderGroup}>
                  <div className={styles.sliderHeader}>
                    <span>Variable Cost Change</span>
                    <span className={styles.sliderValue}>
                      {vcDeltaPct > 0 ? `+${vcDeltaPct}%` : `${vcDeltaPct}%`} ($
                      {((variableCost * (100 + vcDeltaPct)) / 100).toFixed(2)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    step="1"
                    className={styles.sliderInput}
                    value={vcDeltaPct}
                    onChange={(e) => setVcDeltaPct(parseInt(e.target.value, 10))}
                  />
                  <div className={styles.sliderRangeLabels}>
                    <span>−25% Supply savings</span>
                    <span>0% Base</span>
                    <span>+25% Inflation</span>
                  </div>
                </div>

                <div className={styles.sliderGroup}>
                  <div className={styles.sliderHeader}>
                    <span>Fixed Costs Change</span>
                    <span className={styles.sliderValue}>
                      {fixedDeltaPct > 0 ? `+${fixedDeltaPct}%` : `${fixedDeltaPct}%`} ($
                      {Math.round((fixedCosts * (100 + fixedDeltaPct)) / 100).toLocaleString()})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    step="1"
                    className={styles.sliderInput}
                    value={fixedDeltaPct}
                    onChange={(e) => setFixedDeltaPct(parseInt(e.target.value, 10))}
                  />
                  <div className={styles.sliderRangeLabels}>
                    <span>−25% Lean ops</span>
                    <span>0% Base</span>
                    <span>+25% Expansion</span>
                  </div>
                </div>

                <div className={styles.sliderGroup}>
                  <div className={styles.sliderHeader}>
                    <span>Sales Volume Change</span>
                    <span className={styles.sliderValue}>
                      {volumeDeltaPct > 0 ? `+${volumeDeltaPct}%` : `${volumeDeltaPct}%`} (
                      {Math.round((unitsSold * (100 + volumeDeltaPct)) / 100).toLocaleString()} units)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="1"
                    className={styles.sliderInput}
                    value={volumeDeltaPct}
                    onChange={(e) => setVolumeDeltaPct(parseInt(e.target.value, 10))}
                  />
                  <div className={styles.sliderRangeLabels}>
                    <span>−30% Downturn</span>
                    <span>0% Base</span>
                    <span>+30% Surge</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => {
                    setPriceDeltaPct(0);
                    setVcDeltaPct(0);
                    setFixedDeltaPct(0);
                    setVolumeDeltaPct(0);
                  }}
                  style={{ marginTop: '0.5rem' }}
                >
                  Reset Sliders to 0%
                </button>
              </>
            )}
          </div>

          {/* RIGHT: Results & Dashboard Card */}
          <div className={styles.resultsCard}>
            {activeTab === 'single' ? (
              <>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Break-Even &amp; CVP Dashboard</h3>
                  <span className={styles.cardSubtitle}>Live Financial Engine</span>
                </div>

                {/* Primary Metric Highlights */}
                <div className={styles.metricsGrid}>
                  <div className={`${styles.metricCard} ${styles.metricCardPrimary}`}>
                    <div className={styles.metricLabel}>Contribution Margin / Unit</div>
                    <div className={`${styles.metricValue} ${styles.metricValuePrimary}`}>
                      ${singleResult.cmPerUnit.toFixed(2)}
                    </div>
                    <div className={styles.metricSubtext}>
                      {singleResult.cmRatio !== null ? `${(singleResult.cmRatio * 100).toFixed(1)}% CM Ratio` : '—'}
                    </div>
                  </div>

                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Break-Even Point</div>
                    <div className={styles.metricValue}>
                      {singleResult.breakEvenUnits !== null
                        ? `${Math.ceil(singleResult.breakEvenUnits).toLocaleString()} units`
                        : 'Loss-making'}
                    </div>
                    <div className={styles.metricSubtext}>
                      {singleResult.breakEvenSales !== null ? `$${Math.round(singleResult.breakEvenSales).toLocaleString()} Sales` : '—'}
                    </div>
                  </div>

                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Operating Income (Profit)</div>
                    <div
                      className={styles.metricValue}
                      style={{ color: singleResult.isOperatingProfit ? '#047857' : '#dc2626' }}
                    >
                      {singleResult.operatingIncome >= 0
                        ? `$${Math.round(singleResult.operatingIncome).toLocaleString()}`
                        : `-$${Math.round(Math.abs(singleResult.operatingIncome)).toLocaleString()}`}
                    </div>
                    <div className={styles.metricSubtext}>
                      At current {unitsSold.toLocaleString()} units sold
                    </div>
                  </div>

                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Margin of Safety</div>
                    <div className={styles.metricValue}>
                      {singleResult.marginOfSafetyUnits !== null
                        ? `${Math.round(singleResult.marginOfSafetyUnits).toLocaleString()} units`
                        : '—'}
                    </div>
                    <div className={styles.metricSubtext}>
                      {singleResult.marginOfSafetyRatio !== null
                        ? `${(singleResult.marginOfSafetyRatio * 100).toFixed(1)}% buffer (${fmt(singleResult.marginOfSafetySales)})`
                        : '—'}
                    </div>
                  </div>
                </div>

                {/* Inline CVP Chart */}
                <div className={styles.chartContainer}>
                  <div className={styles.chartTitle}>CVP (Cost-Volume-Profit) Break-Even Chart</div>
                  <svg
                    className={styles.cvpSvg}
                    viewBox={`0 0 ${chartW} ${chartH}`}
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                  >
                    {/* Grid lines */}
                    <line x1={padL} y1={padT} x2={padL} y2={chartH - padB} stroke="#cbd5e1" strokeWidth="1" />
                    <line x1={padL} y1={chartH - padB} x2={chartW - padR} y2={chartH - padB} stroke="#cbd5e1" strokeWidth="1" />

                    {/* Fixed cost line */}
                    <line
                      x1={padL}
                      y1={toY(fixedCosts)}
                      x2={chartW - padR}
                      y2={toY(fixedCosts)}
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    <text x={chartW - padR} y={toY(fixedCosts) - 4} textAnchor="end" fill="#64748b" fontSize="9">
                      Fixed Costs: ${fixedCosts.toLocaleString()}
                    </text>

                    {/* Shaded Loss & Profit Areas */}
                    {beX !== null && beY !== null && (
                      <>
                        {/* Loss area polygon */}
                        <polygon
                          points={`${padL},${toY(0)} ${padL},${toY(fixedCosts)} ${beX},${beY}`}
                          fill="#fca5a5"
                          opacity="0.3"
                        />
                        {/* Profit area polygon */}
                        <polygon
                          points={`${beX},${beY} ${chartW - padR},${toY(maxChartUnits * price)} ${chartW - padR},${toY(fixedCosts + maxChartUnits * variableCost)}`}
                          fill="#86efac"
                          opacity="0.35"
                        />
                      </>
                    )}

                    {/* Total Cost line */}
                    <line
                      x1={padL}
                      y1={toY(fixedCosts)}
                      x2={chartW - padR}
                      y2={toY(fixedCosts + maxChartUnits * variableCost)}
                      stroke="#ef4444"
                      strokeWidth="2.5"
                    />

                    {/* Total Revenue line */}
                    <line
                      x1={padL}
                      y1={toY(0)}
                      x2={chartW - padR}
                      y2={toY(maxChartUnits * price)}
                      stroke="#0d9488"
                      strokeWidth="2.5"
                    />

                    {/* Break-even point circle */}
                    {beX !== null && beY !== null && (
                      <g>
                        <circle cx={beX} cy={beY} r="5" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
                        <line x1={beX} y1={beY} x2={beX} y2={chartH - padB} stroke="#0f172a" strokeWidth="1" strokeDasharray="2 2" />
                        <line x1={padL} y1={beY} x2={beX} y2={beY} stroke="#0f172a" strokeWidth="1" strokeDasharray="2 2" />
                        <text x={beX + 6} y={beY - 6} fill="#0f172a" fontSize="10" fontWeight="700">
                          Break-Even ({Math.ceil(singleResult.breakEvenUnits!).toLocaleString()} units)
                        </text>
                      </g>
                    )}

                    {/* Current Volume Marker */}
                    <line x1={curX} y1={padT} x2={curX} y2={chartH - padB} stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x={curX} y={chartH - padB + 14} textAnchor="middle" fill="#2563eb" fontSize="9" fontWeight="700">
                      Current ({unitsSold.toLocaleString()})
                    </text>

                    {/* Axis Labels */}
                    <text x={chartW / 2} y={chartH - 6} textAnchor="middle" fill="#64748b" fontSize="10">
                      Units Sold
                    </text>
                    <text x={padL - 6} y={padT + 10} textAnchor="end" fill="#64748b" fontSize="9">
                      $
                    </text>
                  </svg>
                </div>

                {/* Contribution-Format Income Statement Table */}
                <div className={styles.tableWrap}>
                  <table className={styles.statementTable}>
                    <thead>
                      <tr>
                        <th>Contribution Income Statement</th>
                        <th>Total ($)</th>
                        <th>Per Unit ($)</th>
                        <th>% of Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Sales Revenue</strong></td>
                        <td>${singleResult.statement.salesRevenue.total.toLocaleString()}</td>
                        <td>${singleResult.statement.salesRevenue.perUnit.toFixed(2)}</td>
                        <td>100.0%</td>
                      </tr>
                      <tr>
                        <td>Less: Variable Costs</td>
                        <td>${singleResult.statement.variableCosts.total.toLocaleString()}</td>
                        <td>${singleResult.statement.variableCosts.perUnit.toFixed(2)}</td>
                        <td>{(singleResult.statement.variableCosts.percentage * 100).toFixed(1)}%</td>
                      </tr>
                      <tr className={styles.tableRowHighlight}>
                        <td><strong>= Contribution Margin</strong></td>
                        <td><strong>${singleResult.statement.contributionMargin.total.toLocaleString()}</strong></td>
                        <td><strong>${singleResult.statement.contributionMargin.perUnit.toFixed(2)}</strong></td>
                        <td><strong>{(singleResult.statement.contributionMargin.percentage * 100).toFixed(1)}%</strong></td>
                      </tr>
                      <tr>
                        <td>Less: Fixed Operating Costs</td>
                        <td>${singleResult.statement.fixedCosts.total.toLocaleString()}</td>
                        <td>{singleResult.statement.fixedCosts.perUnit ? `$${singleResult.statement.fixedCosts.perUnit.toFixed(2)}` : '—'}</td>
                        <td>{singleResult.statement.fixedCosts.percentage ? `${(singleResult.statement.fixedCosts.percentage * 100).toFixed(1)}%` : '—'}</td>
                      </tr>
                      <tr className={singleResult.isOperatingProfit ? styles.tableRowHighlight : styles.tableRowLoss}>
                        <td><strong>= {singleResult.statement.operatingIncome.label}</strong></td>
                        <td>
                          <strong>
                            {singleResult.statement.operatingIncome.total >= 0
                              ? `$${singleResult.statement.operatingIncome.total.toLocaleString()}`
                              : `-$${Math.abs(singleResult.statement.operatingIncome.total).toLocaleString()}`}
                          </strong>
                        </td>
                        <td>
                          {singleResult.statement.operatingIncome.perUnit !== null
                            ? `$${singleResult.statement.operatingIncome.perUnit.toFixed(2)}`
                            : '—'}
                        </td>
                        <td>
                          {singleResult.statement.operatingIncome.percentage !== null
                            ? `${(singleResult.statement.operatingIncome.percentage * 100).toFixed(1)}%`
                            : '—'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Leverage & Target Profit Card */}
                <div className={styles.leverageCard}>
                  <div className={styles.leverageTitle}>Operating Leverage &amp; Target Goal</div>
                  <p className={styles.leverageText}>
                    <strong>DOL (Degree of Operating Leverage):</strong>{' '}
                    {singleResult.dol !== null ? singleResult.dol.toFixed(2) : 'N/A'}. {singleResult.dolExplanation}
                  </p>
                  {singleResult.targetUnits !== null && (
                    <p className={styles.leverageText} style={{ marginTop: '0.4rem' }}>
                      <strong>Target Profit Volume:</strong> To achieve{' '}
                      {isTargetAfterTax ? `an after-tax profit of $${targetProfit.toLocaleString()}` : `a pre-tax profit of $${targetProfit.toLocaleString()}`},
                      you must sell <strong>{Math.ceil(singleResult.targetUnits).toLocaleString()} units</strong> (
                      <strong>${Math.round(singleResult.targetSales || 0).toLocaleString()}</strong> in gross sales).
                    </p>
                  )}
                  {singleResult.timeToBreakEvenMonths !== null && (
                    <p className={styles.leverageText} style={{ marginTop: '0.4rem' }}>
                      <strong>Run-Rate Pace:</strong> At your current {monthlyVolume} units/month pace, you reach break-even in{' '}
                      <strong>{singleResult.timeToBreakEvenMonths.toFixed(1)} months</strong>.
                    </p>
                  )}
                </div>

                {/* Collapsible Step-by-Step Exam Working */}
                <div className={styles.stepsSection}>
                  <button
                    type="button"
                    className={styles.stepsToggle}
                    onClick={() => setShowSteps(!showSteps)}
                  >
                    <span>{showSteps ? 'Hide Step-by-Step Working ▲' : 'Show Step-by-Step Working (Exam Style) ▼'}</span>
                  </button>

                  {showSteps && (
                    <div className={styles.stepsList}>
                      {singleResult.steps.map((st) => (
                        <div key={st.step} className={styles.stepItem}>
                          <div className={styles.stepHeader}>
                            <span className={styles.stepTitle}>Step {st.step}: {st.title}</span>
                          </div>
                          <div className={styles.stepFormula}>{st.formula}</div>
                          <div>Calculation: {st.calculation}</div>
                          <div className={styles.stepCalc}>Result: {st.result}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === 'mix' ? (
              <>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Sales Mix Break-Even Allocation</h3>
                  <span className={styles.cardSubtitle}>Portfolio Breakdown</span>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={`${styles.metricCard} ${styles.metricCardPrimary}`}>
                    <div className={styles.metricLabel}>Weighted CM per Unit</div>
                    <div className={`${styles.metricValue} ${styles.metricValuePrimary}`}>
                      ${mixResult.weightedCmPerUnit.toFixed(2)}
                    </div>
                    <div className={styles.metricSubtext}>
                      {(mixResult.weightedCmRatio * 100).toFixed(1)}% Weighted CM Ratio
                    </div>
                  </div>

                  <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Total Portfolio Break-Even</div>
                    <div className={styles.metricValue}>
                      {mixResult.breakEvenTotalUnits !== null
                        ? `${Math.ceil(mixResult.breakEvenTotalUnits).toLocaleString()} units`
                        : 'Loss-making'}
                    </div>
                    <div className={styles.metricSubtext}>
                      {mixResult.breakEvenTotalSales !== null
                        ? `$${Math.round(mixResult.breakEvenTotalSales).toLocaleString()} total sales`
                        : '—'}
                    </div>
                  </div>
                </div>

                <div className={styles.tableWrap}>
                  <table className={styles.mixTable}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Mix %</th>
                        <th>CM/Unit</th>
                        <th>CM Ratio</th>
                        <th>Break-Even Units</th>
                        <th>Break-Even Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mixResult.products.map((p) => (
                        <tr key={p.id}>
                          <td><strong>{p.name}</strong></td>
                          <td>{p.mixPercent.toFixed(1)}%</td>
                          <td>${p.cmPerUnit.toFixed(2)}</td>
                          <td>{(p.cmRatio * 100).toFixed(1)}%</td>
                          <td>{p.breakEvenUnits !== null ? Math.ceil(p.breakEvenUnits).toLocaleString() : '—'}</td>
                          <td>{p.breakEvenSales !== null ? `$${Math.round(p.breakEvenSales).toLocaleString()}` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.leverageCard}>
                  <div className={styles.leverageTitle}>Strategic Portfolio Insight</div>
                  <p className={styles.leverageText}>
                    Because Product margins differ, company break-even is not a simple arithmetic average. Shifting 10% of sales
                    volume toward your highest-margin product expands the weighted CM, lowering the total unit volume required to
                    cover your ${mixFixedCosts.toLocaleString()} fixed overhead.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>What-If Comparison Matrix</h3>
                  <span className={styles.cardSubtitle}>Base vs Simulated Reality</span>
                </div>

                <div className={styles.tableWrap}>
                  <table className={styles.statementTable}>
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Base Value</th>
                        <th>Simulated Value</th>
                        <th>Impact / Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Selling Price</td>
                        <td>${price.toFixed(2)}</td>
                        <td>${whatIfResult.sellingPrice.toFixed(2)}</td>
                        <td>{priceDeltaPct > 0 ? `+${priceDeltaPct}%` : `${priceDeltaPct}%`}</td>
                      </tr>
                      <tr>
                        <td>Variable Cost / Unit</td>
                        <td>${variableCost.toFixed(2)}</td>
                        <td>${whatIfResult.variableCostPerUnit.toFixed(2)}</td>
                        <td>{vcDeltaPct > 0 ? `+${vcDeltaPct}%` : `${vcDeltaPct}%`}</td>
                      </tr>
                      <tr>
                        <td>Contribution Margin / Unit</td>
                        <td>${singleResult.cmPerUnit.toFixed(2)}</td>
                        <td>${whatIfResult.cmPerUnit.toFixed(2)}</td>
                        <td>
                          {whatIfResult.cmPerUnit >= singleResult.cmPerUnit ? '+' : ''}
                          ${(whatIfResult.cmPerUnit - singleResult.cmPerUnit).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Fixed Costs</td>
                        <td>${fixedCosts.toLocaleString()}</td>
                        <td>${whatIfResult.fixedCosts.toLocaleString()}</td>
                        <td>{fixedDeltaPct > 0 ? `+${fixedDeltaPct}%` : `${fixedDeltaPct}%`}</td>
                      </tr>
                      <tr>
                        <td>Units Sold</td>
                        <td>{unitsSold.toLocaleString()}</td>
                        <td>{whatIfResult.unitsSold.toLocaleString()}</td>
                        <td>{volumeDeltaPct > 0 ? `+${volumeDeltaPct}%` : `${volumeDeltaPct}%`}</td>
                      </tr>
                      <tr>
                        <td>Break-Even Units</td>
                        <td>{singleResult.breakEvenUnits ? Math.ceil(singleResult.breakEvenUnits).toLocaleString() : '—'}</td>
                        <td>{whatIfResult.breakEvenUnits ? Math.ceil(whatIfResult.breakEvenUnits).toLocaleString() : '—'}</td>
                        <td>
                          {singleResult.breakEvenUnits && whatIfResult.breakEvenUnits
                            ? `${(whatIfResult.breakEvenUnits - singleResult.breakEvenUnits).toFixed(0)} units`
                            : '—'}
                        </td>
                      </tr>
                      <tr className={whatIfResult.operatingIncome >= singleResult.operatingIncome ? styles.tableRowHighlight : styles.tableRowLoss}>
                        <td><strong>Net Operating Income</strong></td>
                        <td><strong>${singleResult.operatingIncome.toLocaleString()}</strong></td>
                        <td><strong>${whatIfResult.operatingIncome.toLocaleString()}</strong></td>
                        <td>
                          <strong>
                            {whatIfResult.incomeChangeFromBase >= 0 ? '+' : ''}
                            ${whatIfResult.incomeChangeFromBase.toLocaleString()} (
                            {whatIfResult.incomeChangePctFromBase !== null
                              ? `${whatIfResult.incomeChangePctFromBase > 0 ? '+' : ''}${whatIfResult.incomeChangePctFromBase.toFixed(1)}%`
                              : '—'}
                            )
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className={styles.leverageCard}>
                  <div className={styles.leverageTitle}>Sensitivity Takeaway</div>
                  <p className={styles.leverageText}>
                    Price increases exert the greatest leverage because every incremental dollar of price drops directly to
                    contribution margin without incurring additional variable costs. Conversely, volume expansion multiplies
                    existing contribution margin across more units.
                  </p>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className={styles.actionsBar}>
              <button type="button" className={styles.actionBtn} onClick={handleCopySummary}>
                {copiedToast ? '✓ Copied to Clipboard!' : '📋 Copy Summary'}
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
              >
                🖨️ Print CVP Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

export default function ContributionMarginCalculator() {
  return (
    <Suspense fallback={<div>Loading Contribution Margin Calculator...</div>}>
      <ContributionMarginCalculatorInner />
    </Suspense>
  );
}
