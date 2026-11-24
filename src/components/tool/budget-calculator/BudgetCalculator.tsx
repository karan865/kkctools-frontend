"use client";

import React, { useState, useEffect } from "react";
import TabSlider from "@/components/tool/shared/TabSlider";
import { safeStorage } from "@/lib/storage";
import {
  calculateBudget,
  generateBudgetCsv,
  BUDGET_RULE_PRESETS,
  IncomeSource,
  ExpenseItem,
  PayFrequency,
  ExpenseCategory,
  BudgetRuleSplit,
} from "@/lib/budget-engine";
import { BudgetInputGuide } from "./BudgetInputGuide";
import styles from "./BudgetCalculator.module.css";

type TabMode = "monthly" | "compare" | "annual";

const CURRENCIES = [
  { symbol: "$", code: "USD" },
  { symbol: "€", code: "EUR" },
  { symbol: "£", code: "GBP" },
  { symbol: "₹", code: "INR" },
  { symbol: "C$", code: "CAD" },
  { symbol: "A$", code: "AUD" },
];

const BUDGET_DRAFT_KEY = "kkc-budget-draft-v1";

export function BudgetCalculator() {
  const [tab, setTab] = useState<TabMode>("monthly");

  // Open the tab named in ?tab= (shareable links)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const t = new URLSearchParams(window.location.search).get("tab");
        if (t && (["monthly", "compare", "annual"] as string[]).includes(t))
          setTab(t as typeof tab);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  const [currSymbol, setCurrSymbol] = useState<string>("$");

  // Incomes (Default: salary $5,000 monthly take-home)
  const [incomes, setIncomes] = useState<IncomeSource[]>([
    {
      id: "1",
      name: "Primary Salary / Take-Home",
      amount: 5000,
      frequency: "monthly",
    },
  ]);

  // Expenses (Spec defaults)
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: "n1", name: "Rent / Mortgage", amount: 1600, category: "needs" },
    { id: "n2", name: "Utilities & Power", amount: 200, category: "needs" },
    { id: "n3", name: "Groceries & Food", amount: 500, category: "needs" },
    { id: "n4", name: "Transportation & Fuel", amount: 250, category: "needs" },
    {
      id: "n5",
      name: "Health & Car Insurance",
      amount: 200,
      category: "needs",
    },
    { id: "w1", name: "Dining Out", amount: 300, category: "wants" },
    {
      id: "w2",
      name: "Entertainment & Hobbies",
      amount: 200,
      category: "wants",
    },
    {
      id: "w3",
      name: "Streaming & Subscriptions",
      amount: 100,
      category: "wants",
    },
    {
      id: "w4",
      name: "Personal Shopping & Clothing",
      amount: 400,
      category: "wants",
    },
    {
      id: "s1",
      name: "Emergency Fund Savings",
      amount: 500,
      category: "savings",
    },
    {
      id: "s2",
      name: "Extra Debt / Loan Paydown",
      amount: 250,
      category: "savings",
    },
  ]);

  // Rule preset
  const [selectedRuleKey, setSelectedRuleKey] = useState<string>("50/30/20");
  const [customRule, setCustomRule] = useState<BudgetRuleSplit>({
    name: "Custom Rule",
    needsPct: 50,
    wantsPct: 30,
    savingsPct: 20,
  });

  // Draft saved only in this browser (spec 15 §3.4: src/lib/storage.ts, try/catch inside safeStorage).
  const [draftLoaded, setDraftLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      const raw = safeStorage.getItem(BUDGET_DRAFT_KEY);
      if (raw) {
        try {
          const d = JSON.parse(raw);
          if (Array.isArray(d.incomes)) setIncomes(d.incomes);
          if (Array.isArray(d.expenses)) setExpenses(d.expenses);
          if (
            typeof d.selectedRuleKey === "string" &&
            (d.selectedRuleKey === "custom" ||
              BUDGET_RULE_PRESETS[d.selectedRuleKey])
          ) {
            setSelectedRuleKey(d.selectedRuleKey);
          }
          if (d.customRule && typeof d.customRule.needsPct === "number")
            setCustomRule(d.customRule);
          if (typeof d.currSymbol === "string") setCurrSymbol(d.currSymbol);
        } catch {
          /* ignore a damaged draft */
        }
      }
      setDraftLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!draftLoaded) return;
    safeStorage.setItem(
      BUDGET_DRAFT_KEY,
      JSON.stringify({
        incomes,
        expenses,
        selectedRuleKey,
        customRule,
        currSymbol,
      }),
    );
  }, [draftLoaded, incomes, expenses, selectedRuleKey, customRule, currSymbol]);

  const activeRule =
    selectedRuleKey === "custom"
      ? customRule
      : BUDGET_RULE_PRESETS[selectedRuleKey];
  const budgetRes = calculateBudget(incomes, expenses, activeRule);

  // Income Handlers
  const handleAddIncome = () => {
    setIncomes([
      ...incomes,
      {
        id: Date.now().toString(),
        name: `Income Source ${incomes.length + 1}`,
        amount: 1000,
        frequency: "biweekly",
      },
    ]);
  };

  const handleUpdateIncome = (
    id: string,
    field: keyof IncomeSource,
    value: string | number,
  ) => {
    setIncomes(
      incomes.map((inc) => (inc.id === id ? { ...inc, [field]: value } : inc)),
    );
  };

  const handleRemoveIncome = (id: string) => {
    if (incomes.length > 1) {
      setIncomes(incomes.filter((inc) => inc.id !== id));
    }
  };

  // Expense Handlers
  const handleAddExpense = (cat: ExpenseCategory = "needs") => {
    setExpenses([
      ...expenses,
      {
        id: Date.now().toString(),
        name: "New Expense Item",
        amount: 100,
        category: cat,
      },
    ]);
  };

  const handleUpdateExpense = (
    id: string,
    field: keyof ExpenseItem,
    value: string | number | boolean,
  ) => {
    setExpenses(
      expenses.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    );
  };

  const handleRemoveExpense = (id: string) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((exp) => exp.id !== id));
    }
  };

  // CSV Download Handler
  const handleDownloadCsv = () => {
    const csvContent = generateBudgetCsv(incomes, expenses, budgetRes);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Monthly_Budget_Worksheet_50_30_20.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className={styles.container}>
      {/* Visual Input Guide Diagram */}
      <BudgetInputGuide
        needsPct={budgetRes.needs.actualPct}
        wantsPct={budgetRes.wants.actualPct}
        savingsPct={budgetRes.savings.actualPct}
      />

      {/* Tabs */}
      <TabSlider
        tabs={[
          { id: "monthly", label: "Monthly Budget" },
          { id: "compare", label: "Compare Budget Rules" },
          { id: "annual", label: "Annual Overview" },
        ]}
        activeId={tab}
        onChange={(id) => {
          setTab(id as typeof tab);
          try {
            const url = new URL(window.location.href);
            url.searchParams.set("tab", id);
            window.history.replaceState({}, "", url.toString());
          } catch {
            /* ignore */
          }
        }}
        ariaLabel="Budget Calculator Modes"
      />

      {/* Inputs Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            {tab === "monthly" && "Itemize Monthly Income & Expenses"}
            {tab === "compare" && "Budget Rule Allocation Guidelines"}
            {tab === "annual" && "Annualized Cash Flow & Sinking Fund"}
          </h2>
          <div className={styles.presetsRow}>
            <span className={styles.presetLabel}>Currency:</span>
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                className={`${styles.presetBtn} ${currSymbol === c.symbol ? styles.tabBtnActive : ""}`}
                onClick={() => setCurrSymbol(c.symbol)}
              >
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Income Sources Section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
              color: "var(--ink)",
            }}
          >
            1. Income Sources (Take-Home Pay)
          </h3>
          <div style={{ overflowX: "auto", marginBottom: "0.75rem" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Source Name</th>
                  <th>Amount ({currSymbol})</th>
                  <th>Pay Frequency</th>
                  <th>Monthly Equivalent</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((inc) => (
                  <tr key={inc.id}>
                    <td>
                      <input
                        type="text"
                        className={styles.input}
                        style={{
                          border: "1px solid var(--line)",
                          borderRadius: "6px",
                          padding: "0.35rem 0.6rem",
                        }}
                        value={inc.name}
                        aria-label={`Income source ${incomes.indexOf(inc) + 1} name`}
                        onChange={(e) =>
                          handleUpdateIncome(inc.id, "name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className={styles.input}
                        style={{
                          border: "1px solid var(--line)",
                          borderRadius: "6px",
                          padding: "0.35rem 0.6rem",
                          width: "120px",
                        }}
                        value={inc.amount}
                        aria-label={`${inc.name || "Income"} amount`}
                        onChange={(e) =>
                          handleUpdateIncome(
                            inc.id,
                            "amount",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </td>
                    <td>
                      <select
                        className={styles.select}
                        style={{ width: "150px", padding: "0.35rem 0.6rem" }}
                        value={inc.frequency}
                        aria-label={`${inc.name || "Income"} pay frequency`}
                        onChange={(e) =>
                          handleUpdateIncome(
                            inc.id,
                            "frequency",
                            e.target.value as PayFrequency,
                          )
                        }
                      >
                        <option value="monthly">Monthly (12x/yr)</option>
                        <option value="biweekly">Bi-Weekly (26x/yr)</option>
                        <option value="semimonthly">
                          Semi-Monthly (24x/yr)
                        </option>
                        <option value="weekly">Weekly (52x/yr)</option>
                        <option value="yearly">Yearly / Annual (1x/yr)</option>
                      </select>
                    </td>
                    <td>
                      <strong>
                        {currSymbol}
                        {budgetRes.monthlyIncome.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.presetBtn}
                        disabled={incomes.length <= 1}
                        onClick={() => handleRemoveIncome(inc.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleAddIncome}
          >
            + Add Income Source
          </button>
        </div>

        {/* Itemized Expenses Section */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                margin: 0,
                color: "var(--ink)",
              }}
            >
              2. Itemized Expenses & Tagging
            </h3>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => handleAddExpense("needs")}
              >
                + Add Need
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => handleAddExpense("wants")}
              >
                + Add Want
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => handleAddExpense("savings")}
              >
                + Add Savings/Debt
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto", marginBottom: "0.75rem" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Expense Description</th>
                  <th>Monthly Amount ({currSymbol})</th>
                  <th>Bucket Category</th>
                  <th>Yearly Sinking Bill?</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <input
                        type="text"
                        className={styles.input}
                        style={{
                          border: "1px solid var(--line)",
                          borderRadius: "6px",
                          padding: "0.35rem 0.6rem",
                        }}
                        value={exp.name}
                        aria-label="Expense name"
                        onChange={(e) =>
                          handleUpdateExpense(exp.id, "name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className={styles.input}
                        style={{
                          border: "1px solid var(--line)",
                          borderRadius: "6px",
                          padding: "0.35rem 0.6rem",
                          width: "120px",
                        }}
                        value={exp.amount}
                        aria-label={`${exp.name || "Expense"} amount`}
                        onChange={(e) =>
                          handleUpdateExpense(
                            exp.id,
                            "amount",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </td>
                    <td>
                      <select
                        className={styles.select}
                        style={{ width: "160px", padding: "0.35rem 0.6rem" }}
                        value={exp.category}
                        aria-label={`${exp.name || "Expense"} category`}
                        onChange={(e) =>
                          handleUpdateExpense(
                            exp.id,
                            "category",
                            e.target.value as ExpenseCategory,
                          )
                        }
                      >
                        <option value="needs">Needs (Essential)</option>
                        <option value="wants">Wants (Lifestyle)</option>
                        <option value="savings">Savings / Extra Debt</option>
                      </select>
                    </td>
                    <td>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!exp.isYearlyBill}
                          onChange={(e) =>
                            handleUpdateExpense(
                              exp.id,
                              "isYearlyBill",
                              e.target.checked,
                            )
                          }
                        />
                        Annual Bill ÷ 12
                      </label>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.presetBtn}
                        disabled={expenses.length <= 1}
                        onClick={() => handleRemoveExpense(exp.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hero Result Section */}
      <div className={styles.heroResult}>
        <div className={styles.heroBadge}>
          {budgetRes.isShortfall
            ? "Monthly Shortfall"
            : "Monthly Leftover Surplus"}
        </div>
        <div className={styles.heroMainValue}>
          {budgetRes.isShortfall
            ? `−${currSymbol}${Math.abs(budgetRes.monthlyLeftover).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
            : `+${currSymbol}${budgetRes.monthlyLeftover.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
        </div>
        <div className={styles.heroSubValue}>
          Monthly Income: {currSymbol}
          {budgetRes.monthlyIncome.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
          {" · "}Monthly Expenses: {currSymbol}
          {budgetRes.monthlyExpenses.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </div>
        <div className={styles.heroSentence}>
          Out of {currSymbol}
          {budgetRes.monthlyIncome.toLocaleString()} a month, needs take{" "}
          {budgetRes.needs.actualPct}%, wants take {budgetRes.wants.actualPct}%
          and savings take {budgetRes.savings.actualPct}%, with {currSymbol}
          {budgetRes.monthlyLeftover.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}{" "}
          left over. Compared with {activeRule.name}, needs are{" "}
          {budgetRes.needs.gapAmount > 0
            ? `${currSymbol}${budgetRes.needs.gapAmount.toFixed(2)} over target`
            : `${currSymbol}${Math.abs(budgetRes.needs.gapAmount).toFixed(2)} under target`}
          .
        </div>
      </div>

      {/* 50/30/20 Allocation Summary Table */}
      <div className={styles.tableCard}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.85rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
            Allocation Breakdown: Actual vs {activeRule.name} Target
          </h3>
          <div className={styles.presetsRow}>
            <span className={styles.presetLabel}>Rule:</span>
            {Object.keys(BUDGET_RULE_PRESETS).map((k) => (
              <button
                key={k}
                type="button"
                className={`${styles.presetBtn} ${selectedRuleKey === k ? styles.tabBtnActive : ""}`}
                onClick={() => setSelectedRuleKey(k)}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Bucket Category</th>
              <th>Actual Spend</th>
              <th>Actual %</th>
              <th>Target Guideline</th>
              <th>Target %</th>
              <th>Variance Gap</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className={`${styles.categoryPill} ${styles.pillNeeds}`}>
                  Needs
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--ink-soft)",
                    marginLeft: "0.4rem",
                  }}
                >
                  Housing, food, utilities
                </span>
              </td>
              <td>
                <strong>
                  {currSymbol}
                  {budgetRes.needs.actualAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </td>
              <td>{budgetRes.needs.actualPct}%</td>
              <td>
                {currSymbol}
                {budgetRes.needs.targetAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td>{budgetRes.needs.targetPct}%</td>
              <td
                style={{
                  color: budgetRes.needs.gapAmount > 0 ? "#DC2626" : "#0D9488",
                  fontWeight: 600,
                }}
              >
                {budgetRes.needs.gapAmount > 0
                  ? `+${currSymbol}${budgetRes.needs.gapAmount.toFixed(2)} (Over)`
                  : `${currSymbol}${budgetRes.needs.gapAmount.toFixed(2)} (Under)`}
              </td>
            </tr>
            <tr>
              <td>
                <span className={`${styles.categoryPill} ${styles.pillWants}`}>
                  Wants
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--ink-soft)",
                    marginLeft: "0.4rem",
                  }}
                >
                  Dining, entertainment, shopping
                </span>
              </td>
              <td>
                <strong>
                  {currSymbol}
                  {budgetRes.wants.actualAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </td>
              <td>{budgetRes.wants.actualPct}%</td>
              <td>
                {currSymbol}
                {budgetRes.wants.targetAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td>{budgetRes.wants.targetPct}%</td>
              <td
                style={{
                  color: budgetRes.wants.gapAmount > 0 ? "#DC2626" : "#0D9488",
                  fontWeight: 600,
                }}
              >
                {budgetRes.wants.gapAmount > 0
                  ? `+${currSymbol}${budgetRes.wants.gapAmount.toFixed(2)} (Over)`
                  : `${currSymbol}${budgetRes.wants.gapAmount.toFixed(2)} (Under)`}
              </td>
            </tr>
            <tr>
              <td>
                <span
                  className={`${styles.categoryPill} ${styles.pillSavings}`}
                >
                  Savings & Debt
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--ink-soft)",
                    marginLeft: "0.4rem",
                  }}
                >
                  Emergency fund, extra loans
                </span>
              </td>
              <td>
                <strong>
                  {currSymbol}
                  {budgetRes.savings.actualAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </td>
              <td>{budgetRes.savings.actualPct}%</td>
              <td>
                {currSymbol}
                {budgetRes.savings.targetAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td>{budgetRes.savings.targetPct}%</td>
              <td
                style={{
                  color:
                    budgetRes.savings.gapAmount < 0 ? "#B45309" : "#0D9488",
                  fontWeight: 600,
                }}
              >
                {budgetRes.savings.gapAmount < 0
                  ? `${currSymbol}${budgetRes.savings.gapAmount.toFixed(2)} (Below target)`
                  : `+${currSymbol}${budgetRes.savings.gapAmount.toFixed(2)} (On track)`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {tab === "annual" && (
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Annual Take-Home Income</span>
            <span className={styles.metricValue}>
              {currSymbol}
              {budgetRes.annualIncome.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className={styles.metricDetail}>12 months net income</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Annual Projected Outlay</span>
            <span className={styles.metricValue}>
              {currSymbol}
              {budgetRes.annualExpenses.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className={styles.metricDetail}>
              Living costs & lifestyle
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              Annual Savings & Leftover
            </span>
            <span
              className={styles.metricValue}
              style={{
                color: budgetRes.annualLeftover >= 0 ? "#0D9488" : "#DC2626",
              }}
            >
              {currSymbol}
              {budgetRes.annualLeftover.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className={styles.metricDetail}>
              Net annual capital accumulation
            </span>
          </div>
        </div>
      )}

      {/* Export & Print Actions */}
      <div className={styles.actionsRow}>
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.btnPrimary}`}
          onClick={handleDownloadCsv}
        >
          Download Spreadsheet (.CSV)
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={handlePrint}
        >
          Print Budget Worksheet
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => {
            setIncomes([
              {
                id: "1",
                name: "Primary Salary",
                amount: 5000,
                frequency: "monthly",
              },
            ]);
            setExpenses([
              { id: "n1", name: "Rent", amount: 1600, category: "needs" },
              { id: "n2", name: "Utilities", amount: 200, category: "needs" },
              { id: "n3", name: "Groceries", amount: 500, category: "needs" },
              { id: "n4", name: "Transport", amount: 250, category: "needs" },
              { id: "n5", name: "Insurance", amount: 200, category: "needs" },
              { id: "w1", name: "Dining Out", amount: 300, category: "wants" },
              {
                id: "w2",
                name: "Entertainment",
                amount: 200,
                category: "wants",
              },
              {
                id: "w3",
                name: "Subscriptions",
                amount: 100,
                category: "wants",
              },
              { id: "w4", name: "Shopping", amount: 400, category: "wants" },
              {
                id: "s1",
                name: "Emergency Savings",
                amount: 500,
                category: "savings",
              },
              {
                id: "s2",
                name: "Extra Debt Payment",
                amount: 250,
                category: "savings",
              },
            ]);
            setSelectedRuleKey("50/30/20");
            safeStorage.removeItem(BUDGET_DRAFT_KEY);
          }}
        >
          Reset to Defaults (clears saved draft)
        </button>
      </div>

      <p
        style={{
          fontSize: "0.8rem",
          color: "var(--ink-soft)",
          lineHeight: 1.5,
          marginTop: "0.5rem",
        }}
      >
        <strong>Privacy Note:</strong> All budget figures, incomes, and expenses
        run 100% inside your web browser. Nothing is sent to a server. Your
        figures are saved only in this browser so they are still here next time;
        Reset clears them.
      </p>
    </div>
  );
}
