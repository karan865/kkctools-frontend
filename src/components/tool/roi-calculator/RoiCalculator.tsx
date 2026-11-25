'use client';

import React, { useState, useId, useEffect } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import Link from 'next/link';
import {
  calculateRoi,
  calculateMarketingRoi,
  calculateProjectRoi,
  compareInvestments,
  calculateTargetValue,
  CompareOptionInput,
} from '@/lib/roi-engine';
import { RoiInputGuide } from './RoiInputGuide';
import styles from './RoiCalculator.module.css';

type TabMode = 'roi' | 'compare' | 'marketing' | 'project' | 'target';

interface Currency {
  symbol: string;
  code: string;
}

const CURRENCIES: Currency[] = [
  { symbol: '$', code: 'USD' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: '₹', code: 'INR' },
  { symbol: 'C$', code: 'CAD' },
  { symbol: 'A$', code: 'AUD' },
];

export function RoiCalculator() {
  const [tab, setTab] = useState<TabMode>('roi');

  // Open the tab named in ?tab= (shareable links)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const t = new URLSearchParams(window.location.search).get('tab');
        if (t && (['roi', 'compare', 'marketing', 'project', 'target'] as string[]).includes(t)) setTab(t as typeof tab);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  const [currSymbol, setCurrSymbol] = useState<string>('$');

  // ROI Tab State (Spec defaults: $10,000 cost · $15,000 final · 3 years)
  const [cost, setCost] = useState<string>('10000');
  const [finalValue, setFinalValue] = useState<string>('15000');
  const [years, setYears] = useState<string>('3');
  const [income, setIncome] = useState<string>('0');
  const [expenses, setExpenses] = useState<string>('0');
  const [inflation, setInflation] = useState<string>('0');

  // Marketing Tab State (Spec defaults: $20,000 rev · $5,000 cost · 40% margin)
  const [mktRevenue, setMktRevenue] = useState<string>('20000');
  const [mktAdCost, setMktAdCost] = useState<string>('5000');
  const [mktMargin, setMktMargin] = useState<string>('40');

  // Project Tab State (Spec defaults: $12,000 cost · $4,000 annual saving · 5 years)
  const [projCost, setProjCost] = useState<string>('12000');
  const [projBenefit, setProjBenefit] = useState<string>('4000');
  const [projLifespan, setProjLifespan] = useState<string>('5');

  // Target Tab State
  const [targetCost, setTargetCost] = useState<string>('10000');
  const [targetRoi, setTargetRoi] = useState<string>('50');

  // Compare Tab State (2 to 4 options)
  const [compareRows, setCompareRows] = useState<CompareOptionInput[]>([
    { name: 'Stock Index', cost: 10000, finalValue: 15000, years: 3 },
    { name: 'Rental Property', cost: 100000, finalValue: 160000, years: 5 },
    { name: 'High-Yield Note', cost: 20000, finalValue: 24000, years: 2 },
  ]);

  // Accessible IDs
  const idCost = useId();
  const idFinal = useId();
  const idYears = useId();
  const idIncome = useId();
  const idExpenses = useId();
  const idInflation = useId();

  const idMktRev = useId();
  const idMktCost = useId();
  const idMktMargin = useId();

  const idProjCost = useId();
  const idProjBen = useId();
  const idProjLife = useId();

  const idTargetCost = useId();
  const idTargetRoi = useId();

  // Calculations
  const numCost = parseFloat(cost) || 0;
  const numFinal = parseFloat(finalValue) || 0;
  const numYears = parseFloat(years) || 1;
  const numIncome = parseFloat(income) || 0;
  const numExpenses = parseFloat(expenses) || 0;
  const numInflation = parseFloat(inflation) || 0;

  const basicRes = calculateRoi({
    cost: numCost,
    finalValue: numFinal,
    years: numYears,
    income: numIncome,
    expenses: numExpenses,
    inflationPct: numInflation,
  });

  const numMktRev = parseFloat(mktRevenue) || 0;
  const numMktCost = parseFloat(mktAdCost) || 0;
  const numMktMargin = parseFloat(mktMargin) || 0;
  const mktRes = calculateMarketingRoi({
    revenue: numMktRev,
    adCost: numMktCost,
    grossMarginPct: numMktMargin,
  });

  const numProjCost = parseFloat(projCost) || 0;
  const numProjBen = parseFloat(projBenefit) || 0;
  const numProjLife = parseFloat(projLifespan) || 1;
  const projRes = calculateProjectRoi({
    cost: numProjCost,
    annualBenefit: numProjBen,
    projectLifeYears: numProjLife,
  });

  const numTargetCost = parseFloat(targetCost) || 0;
  const numTargetRoi = parseFloat(targetRoi) || 0;
  const requiredTargetFinal = calculateTargetValue(numTargetCost, numTargetRoi);

  const compareAnalysis = compareInvestments(compareRows);

  const handleUpdateCompareRow = (index: number, field: keyof CompareOptionInput, value: string) => {
    const updated = [...compareRows];
    if (field === 'name') {
      updated[index] = { ...updated[index], name: value };
    } else {
      updated[index] = { ...updated[index], [field]: parseFloat(value) || 0 };
    }
    setCompareRows(updated);
  };

  const handleAddCompareRow = () => {
    if (compareRows.length < 4) {
      setCompareRows([
        ...compareRows,
        { name: `Option ${compareRows.length + 1}`, cost: 10000, finalValue: 13000, years: 2 },
      ]);
    }
  };

  const handleRemoveCompareRow = (index: number) => {
    if (compareRows.length > 2) {
      setCompareRows(compareRows.filter((_, i) => i !== index));
    }
  };

  return (
    <div className={styles.container}>
      {/* Visual Input Guide Diagram */}
      <RoiInputGuide activeTab={tab} />

      {/* Tabs */}
      <TabSlider
        tabs={[{ id: 'roi', label: 'ROI & Annualized' }, { id: 'compare', label: 'Compare Options' }, { id: 'marketing', label: 'Marketing ROI & ROAS' }, { id: 'project', label: 'Project & Equipment ROI' }, { id: 'target', label: 'Target ROI Solver' }]}
        activeId={tab}
        onChange={(id) => {
          setTab(id as typeof tab);
          try {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', id);
            window.history.replaceState({}, '', url.toString());
          } catch {
            /* ignore */
          }
        }}
        ariaLabel="ROI Modes"
      />

      {/* Inputs Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            {tab === 'roi' && 'Calculate Return on Investment & Annualized ROI'}
            {tab === 'compare' && 'Compare Up to 4 Investment Options'}
            {tab === 'marketing' && 'Campaign Marketing ROI, Margin & ROAS'}
            {tab === 'project' && 'Equipment & Capital Project ROI (Payback Period)'}
            {tab === 'target' && 'Find Value Needed for Target ROI %'}
          </h2>
          <div className={styles.presetsRow}>
            <span className={styles.presetLabel}>Currency:</span>
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                className={`${styles.presetBtn} ${currSymbol === c.symbol ? styles.tabBtnActive : ''}`}
                onClick={() => setCurrSymbol(c.symbol)}
              >
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </div>

        {tab === 'roi' && (
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={idCost} className={styles.label}>
                Initial Amount Invested (Cost)
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.prefix}>{currSymbol}</span>
                <input
                  id={idCost}
                  type="number"
                  min="0"
                  step="any"
                  className={styles.input}
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
              <span className={styles.helperText}>Total purchase price, initial capital, or cost basis.</span>
            </div>

            <div className={styles.field}>
              <label htmlFor={idFinal} className={styles.label}>
                Final Value / Total Returned
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.prefix}>{currSymbol}</span>
                <input
                  id={idFinal}
                  type="number"
                  min="0"
                  step="any"
                  className={styles.input}
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                />
              </div>
              <span className={styles.helperText}>Ending valuation, sale price, or liquidation value.</span>
            </div>

            <div className={styles.field}>
              <label htmlFor={idYears} className={styles.label}>
                Investment Length (Years)
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={idYears}
                  type="number"
                  min="0.01"
                  step="any"
                  className={styles.input}
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
                <span className={styles.suffix}>years</span>
              </div>
              <span className={styles.helperText}>Holding period duration used to compute annualized ROI.</span>
            </div>

            <div className={styles.field}>
              <label htmlFor={idIncome} className={styles.label}>
                Additional Income (Dividends/Rent)
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.prefix}>{currSymbol}</span>
                <input
                  id={idIncome}
                  type="number"
                  min="0"
                  step="any"
                  className={styles.input}
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>
              <span className={styles.helperText}>Optional dividends, interest, or cash distributions.</span>
            </div>

            <div className={styles.field}>
              <label htmlFor={idExpenses} className={styles.label}>
                Expenses / Fees
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.prefix}>{currSymbol}</span>
                <input
                  id={idExpenses}
                  type="number"
                  min="0"
                  step="any"
                  className={styles.input}
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                />
              </div>
              <span className={styles.helperText}>Maintenance, management fees, or commissions paid.</span>
            </div>

            <div className={styles.field}>
              <label htmlFor={idInflation} className={styles.label}>
                Annual Inflation Rate (Optional)
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={idInflation}
                  type="number"
                  step="0.1"
                  className={styles.input}
                  value={inflation}
                  onChange={(e) => setInflation(e.target.value)}
                />
                <span className={styles.suffix}>%</span>
              </div>
              <span className={styles.helperText}>Compute real purchasing power return via Fisher relation.</span>
            </div>
          </div>
        )}

        {tab === 'compare' && (
          <div>
            <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Option Name</th>
                    <th>Cost ({currSymbol})</th>
                    <th>Final Value ({currSymbol})</th>
                    <th>Holding Period (Years)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          className={styles.input}
                          style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '0.4rem 0.6rem' }}
                          value={row.name}
                          onChange={(e) => handleUpdateCompareRow(idx, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className={styles.input}
                          style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '0.4rem 0.6rem' }}
                          value={row.cost}
                          onChange={(e) => handleUpdateCompareRow(idx, 'cost', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className={styles.input}
                          style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '0.4rem 0.6rem' }}
                          value={row.finalValue}
                          onChange={(e) => handleUpdateCompareRow(idx, 'finalValue', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0.1"
                          step="any"
                          className={styles.input}
                          style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '0.4rem 0.6rem' }}
                          value={row.years}
                          onChange={(e) => handleUpdateCompareRow(idx, 'years', e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.presetBtn}
                          disabled={compareRows.length <= 2}
                          onClick={() => handleRemoveCompareRow(idx)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {compareRows.length < 4 && (
              <button type="button" className={styles.actionBtn} onClick={handleAddCompareRow}>
                + Add Another Option (Up to 4)
              </button>
            )}
          </div>
        )}

        {tab === 'marketing' && (
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={idMktRev} className={styles.label}>
                Gross Campaign Revenue
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.prefix}>{currSymbol}</span>
                <input
                  id={idMktRev}
                  type="number"
                  min="0"
                  step="any"
                  className={styles.input}
                  value={mktRevenue}
                  onChange={(e) => setMktRevenue(e.target.value)}
                />
              </div>
              <span className={styles.helperText}>Total top-line sales attributed to advertising campaign.</span>
            </div>

            <div className={styles.field}>
              <label htmlFor={idMktCost} className={styles.label}>
                Ad Spend / Campaign Cost
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.prefix}>{currSymbol}</span>
                <input
                  id={idMktCost}
                  type="number"
                  min="0"
                  step="any"
                  className={styles.input}
                  value={mktAdCost}
                  onChange={(e) => setMktAdCost(e.target.value)}
                />
              </div>
              <span className={styles.helperText}>Direct advertising spend and marketing production costs.</span>
            </div>

            <div className={styles.field}>
              <label htmlFor={idMktMargin} className={styles.label}>
                Product Gross Margin
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={idMktMargin}
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  className={styles.input}
                  value={mktMargin}
                  onChange={(e) => setMktMargin(e.target.value)}
                />
                <span className={styles.suffix}>%</span>
              </div>
              <span className={styles.helperText}>Gross profit percentage on goods before advertising expenses.</span>
            </div>
          </div>
        )}

        {tab === 'project' && (
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={idProjCost} className={styles.label}>
                Equipment / Project Cost
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.prefix}>{currSymbol}</span>
                <input
                  id={idProjCost}
                  type="number"
                  min="0"
                  step="any"
                  className={styles.input}
                  value={projCost}
                  onChange={(e) => setProjCost(e.target.value)}
                />
              </div>
              <span className={styles.helperText}>Capital investment outlay for machinery or automation.</span>
            </div>

            <div className={styles.field}>
              <label htmlFor={idProjBen} className={styles.label}>
                Annual Cash Benefit / Savings
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.prefix}>{currSymbol}</span>
                <input
                  id={idProjBen}
                  type="number"
                  min="0"
                  step="any"
                  className={styles.input}
                  value={projBenefit}
                  onChange={(e) => setProjBenefit(e.target.value)}
                />
              </div>
              <span className={styles.helperText}>Net annual labor savings, energy cuts, or incremental revenue.</span>
            </div>

            <div className={styles.field}>
              <label htmlFor={idProjLife} className={styles.label}>
                Project Lifespan (Years)
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={idProjLife}
                  type="number"
                  min="1"
                  step="1"
                  className={styles.input}
                  value={projLifespan}
                  onChange={(e) => setProjLifespan(e.target.value)}
                />
                <span className={styles.suffix}>years</span>
              </div>
              <span className={styles.helperText}>Expected operational lifespan of the asset.</span>
            </div>
          </div>
        )}

        {tab === 'target' && (
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={idTargetCost} className={styles.label}>
                Initial Amount Invested
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.prefix}>{currSymbol}</span>
                <input
                  id={idTargetCost}
                  type="number"
                  min="0"
                  step="any"
                  className={styles.input}
                  value={targetCost}
                  onChange={(e) => setTargetCost(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor={idTargetRoi} className={styles.label}>
                Desired Target ROI
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={idTargetRoi}
                  type="number"
                  step="any"
                  className={styles.input}
                  value={targetRoi}
                  onChange={(e) => setTargetRoi(e.target.value)}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Result Section */}
      {tab === 'roi' && basicRes && (
        <>
          <div className={styles.heroResult}>
            <div className={styles.heroBadge}>
              Total ROI · Return on Investment
            </div>
            <div className={styles.heroMainValue}>
              {basicRes.roiPct >= 0 ? `+${basicRes.roiPct.toFixed(2)}%` : `${basicRes.roiPct.toFixed(2)}%`}
            </div>
            <div className={styles.heroSubValue}>
              Net Gain: {currSymbol}{basicRes.netGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              · Annualized ROI: {basicRes.annualizedRoiPct !== null ? `${basicRes.annualizedRoiPct.toFixed(2)}%/yr` : 'N/A'}
            </div>
            <div className={styles.heroSentence}>
              Turning {currSymbol}{numCost.toLocaleString()} into {currSymbol}{numFinal.toLocaleString()} is a {basicRes.roiPct.toFixed(2)}% return on investment, or {basicRes.annualizedRoiPct?.toFixed(2)}% a year over {numYears} year(s).
            </div>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Net Profit / Gain</span>
              <span className={styles.metricValue}>
                {currSymbol}{basicRes.netGain.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className={styles.metricDetail}>Total return minus cost</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Annualized ROI</span>
              <span className={styles.metricValue}>
                {basicRes.annualizedRoiPct !== null ? `${basicRes.annualizedRoiPct.toFixed(2)}%` : 'N/A'}
              </span>
              <span className={styles.metricDetail}>Compound annual growth rate</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Total Return Ratio</span>
              <span className={styles.metricValue}>
                {basicRes.totalReturnRatio.toFixed(2)}x
              </span>
              <span className={styles.metricDetail}>Multiple on invested capital</span>
            </div>
            {basicRes.realRoiPct !== null && (
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Real ROI (Inflation-Adjusted)</span>
                <span className={styles.metricValue}>
                  {basicRes.realRoiPct.toFixed(2)}%
                </span>
                <span className={styles.metricDetail}>At {numInflation}% annual inflation</span>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'compare' && (
        <div>
          {compareAnalysis.hasMismatchedDurations && (
            <div className={styles.warningBox}>
              <strong>Holding Periods Differ:</strong> Compare investments by <strong>Annualized ROI</strong> rather
              than cumulative ROI. A 50% return over 3 years (14.47%/yr) outperforms a 60% return over 5 years (9.86%/yr).
            </div>
          )}

          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Option Name</th>
                  <th>Invested Cost</th>
                  <th>Final Value</th>
                  <th>Holding Period</th>
                  <th>Net Profit</th>
                  <th>Total ROI</th>
                  <th>Annualized ROI</th>
                </tr>
              </thead>
              <tbody>
                {compareAnalysis.options.map((opt) => (
                  <tr key={opt.name}>
                    <td>
                      <span className={`${styles.rankBadge} ${opt.rank === 1 ? styles.rankFirst : ''}`}>
                        {opt.rank}
                      </span>
                    </td>
                    <td><strong>{opt.name}</strong></td>
                    <td>{currSymbol}{opt.cost.toLocaleString()}</td>
                    <td>{currSymbol}{opt.finalValue.toLocaleString()}</td>
                    <td>{opt.years} yr{opt.years === 1 ? '' : 's'}</td>
                    <td style={{ color: opt.netGain >= 0 ? '#0D9488' : '#DC2626', fontWeight: 600 }}>
                      {currSymbol}{opt.netGain.toLocaleString()}
                    </td>
                    <td>{opt.roiPct >= 0 ? `+${opt.roiPct.toFixed(2)}%` : `${opt.roiPct.toFixed(2)}%`}</td>
                    <td>
                      <strong style={{ color: opt.rank === 1 ? '#0D9488' : 'inherit' }}>
                        {opt.annualizedRoiPct !== null ? `${opt.annualizedRoiPct.toFixed(2)}%/yr` : 'N/A'}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'marketing' && mktRes && (
        <>
          <div className={styles.heroResult}>
            <div className={styles.heroBadge}>
              Marketing ROI on Gross Margin
            </div>
            <div className={styles.heroMainValue}>
              {mktRes.roiOnMarginPct >= 0 ? `+${mktRes.roiOnMarginPct.toFixed(2)}%` : `${mktRes.roiOnMarginPct.toFixed(2)}%`}
            </div>
            <div className={styles.heroSubValue}>
              Net Profit on Campaign: {currSymbol}{mktRes.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              {' · '}ROAS: {mktRes.roas.toFixed(2)}x
            </div>
            <div className={styles.heroSentence}>
              Generating {currSymbol}{numMktRev.toLocaleString()} revenue from {currSymbol}{numMktCost.toLocaleString()} ad spend at a {numMktMargin}% gross margin yields a true business ROI on margin of {mktRes.roiOnMarginPct.toFixed(2)}% (Revenue ROI is {mktRes.roiOnRevenuePct.toFixed(2)}%).
            </div>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>ROAS (Return on Ad Spend)</span>
              <span className={styles.metricValue}>{mktRes.roas.toFixed(2)}x</span>
              <span className={styles.metricDetail}>Revenue ÷ Ad Spend</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Gross Margin Profit</span>
              <span className={styles.metricValue}>
                {currSymbol}{mktRes.grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className={styles.metricDetail}>{numMktMargin}% of attributed revenue</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Net Campaign Profit</span>
              <span className={styles.metricValue}>
                {currSymbol}{mktRes.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className={styles.metricDetail}>Gross profit minus ad cost</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Top-Line Revenue ROI</span>
              <span className={styles.metricValue}>{mktRes.roiOnRevenuePct.toFixed(2)}%</span>
              <span className={styles.metricDetail}>Ignores cost of goods sold</span>
            </div>
          </div>
        </>
      )}

      {tab === 'project' && projRes && (
        <>
          <div className={styles.heroResult}>
            <div className={styles.heroBadge}>
              Capital Equipment & Project ROI
            </div>
            <div className={styles.heroMainValue}>
              {projRes.roiPct >= 0 ? `+${projRes.roiPct.toFixed(2)}%` : `${projRes.roiPct.toFixed(2)}%`}
            </div>
            <div className={styles.heroSubValue}>
              Payback Period: {projRes.paybackYears !== null ? `${projRes.paybackYears.toFixed(2)} years` : 'N/A'}{' '}
              · Cumulative Net Profit: {currSymbol}{projRes.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className={styles.heroSentence}>
              Investing {currSymbol}{numProjCost.toLocaleString()} with {currSymbol}{numProjBen.toLocaleString()}/year in savings achieves payback in {projRes.paybackYears?.toFixed(1)} years and delivers a {numProjLife}-year cumulative ROI of {projRes.roiPct.toFixed(1)}%.
            </div>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Payback Period</span>
              <span className={styles.metricValue}>
                {projRes.paybackYears !== null ? `${projRes.paybackYears.toFixed(2)} yrs` : 'N/A'}
              </span>
              <span className={styles.metricDetail}>Time to break even</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Total Lifetime Savings</span>
              <span className={styles.metricValue}>
                {currSymbol}{projRes.totalBenefits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className={styles.metricDetail}>Over {numProjLife} operational years</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Net Capital Profit</span>
              <span className={styles.metricValue}>
                {currSymbol}{projRes.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className={styles.metricDetail}>Total savings minus cost</span>
            </div>
          </div>
        </>
      )}

      {tab === 'target' && (
        <div className={styles.heroResult}>
          <div className={styles.heroBadge}>
            Required Ending Valuation
          </div>
          <div className={styles.heroMainValue}>
            {currSymbol}{requiredTargetFinal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={styles.heroSubValue}>
            Target Net Profit: {currSymbol}{(requiredTargetFinal - numTargetCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className={styles.heroSentence}>
            To achieve a {numTargetRoi}% return on investment on an initial outlay of {currSymbol}{numTargetCost.toLocaleString()}, the investment must reach an ending value of {currSymbol}{requiredTargetFinal.toLocaleString()}.
          </div>
        </div>
      )}

      {/* Cross link for cash flows */}
      <p className={styles.bandNote}>
        Note: Simple and annualized ROI assume a single starting cost and a single exit value. For multi-period uneven cash
        flows, examine Net Present Value and Internal Rate of Return in our{' '}
        <Link href="/present-value-calculator/">
          Present Value & NPV Calculator
        </Link>.
      </p>

      {/* Action Buttons */}
      <div className={styles.actionsRow}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => {
            setCost('10000');
            setFinalValue('15000');
            setYears('3');
            setIncome('0');
            setExpenses('0');
            setInflation('0');
            setMktRevenue('20000');
            setMktAdCost('5000');
            setMktMargin('40');
            setProjCost('12000');
            setProjBenefit('4000');
            setProjLifespan('5');
            setTargetCost('10000');
            setTargetRoi('50');
          }}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
