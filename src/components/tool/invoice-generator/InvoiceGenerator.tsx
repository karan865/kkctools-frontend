'use client';

import React, { useState, useId, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ToolShell from '@/components/tool/shared/ToolShell';
import TabSlider from '@/components/tool/shared/TabSlider';
import InvoiceInputGuide from './InvoiceInputGuide';
import { safeStorage } from '@/lib/storage';
import {
  InvoiceLineItem,
  PaymentTerms,
  DiscountType,
  RoundingIncrement,
  RoundingMode,
  BusinessDetails,
  ClientDetails,
  InvoiceData,
  calculateInvoiceTotals,
  calculateDueDate,
  formatInvoiceCsv,
  formatInvoiceText,
  parseDuration,
  roundHours,
  INVOICE_PRESETS,
} from '@/lib/invoice-engine';
import styles from './InvoiceGenerator.module.css';

const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
];

const STORAGE_KEY_PROFILE = 'kkctools_invoice_profile_v1';
const STORAGE_KEY_LAST_NUM = 'kkctools_invoice_last_num_v1';

export default function InvoiceGenerator() {
  const uid = useId();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active Tab: invoice, timesheet, details
  const tabParam = searchParams.get('tab');
  const activeTab: 'invoice' | 'timesheet' | 'details' =
    tabParam === 'timesheet' || tabParam === 'details' ? tabParam : 'invoice';

  const handleTabChange = (newTab: string) => {
    const target = newTab as 'invoice' | 'timesheet' | 'details';
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', target);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Currency & Settings
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const currencySymbol = useMemo(() => {
    return CURRENCY_OPTIONS.find((c) => c.code === currencyCode)?.symbol || '$';
  }, [currencyCode]);

  // Business Details (From)
  const [fromDetails, setFromDetails] = useState<BusinessDetails>(() => {
    const base: BusinessDetails = {
      businessName: 'Acme Creative Studio',
      senderName: 'Alex Morgan',
      address: '742 Evergreen Terrace, Springfield, OR 97477',
      email: 'alex@acmecreative.com',
      phone: '(555) 234-5678',
      taxId: 'XX-XXXXXXX',
      taxIdLabel: 'EIN',
      paymentInstructions: 'Direct Deposit / ACH:\nBank: First National Bank\nRouting: 021000021\nAccount: 987654321\nZelle / PayPal: billing@acmecreative.com',
    };
    if (typeof window !== 'undefined') {
      try {
        const saved = safeStorage.getItem(STORAGE_KEY_PROFILE);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object' && parsed.businessName) {
            return { ...base, ...parsed };
          }
        }
      } catch {
        // Ignore
      }
    }
    return base;
  });

  // Client Details (To)
  const [toDetails, setToDetails] = useState<ClientDetails>({
    clientName: 'Jordan Taylor',
    companyName: 'Apex Innovations Inc.',
    address: '100 North Main Blvd, Suite 400, Seattle, WA 98101',
    email: 'accounts@apexinnovations.com',
    phone: '(555) 987-6543',
  });

  // Metadata
  const [invoiceNumber, setInvoiceNumber] = useState<string>('INV-2026-001');
  const [issueDate, setIssueDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [terms, setTerms] = useState<PaymentTerms>('net_30');
  const [dueDate, setDueDate] = useState<string>(() => calculateDueDate(new Date().toISOString().split('T')[0], 'net_30'));
  const [poNumber, setPoNumber] = useState<string>('');

  // Handle terms change to update due date automatically
  const handleTermsChange = (newTerms: PaymentTerms) => {
    setTerms(newTerms);
    setDueDate(calculateDueDate(issueDate, newTerms));
  };

  const handleIssueDateChange = (newDate: string) => {
    setIssueDate(newDate);
    setDueDate(calculateDueDate(newDate, terms));
  };

  // Line items
  const [lines, setLines] = useState<InvoiceLineItem[]>(() => [
    { id: '1', type: 'hours', date: '2026-11-16', description: 'Brand strategy & UX wireframing session', quantityOrHours: 6.5, rateOrPrice: 85, amount: 552.5 },
    { id: '2', type: 'hours', date: '2026-11-18', description: 'Interactive React component development', quantityOrHours: 8.0, rateOrPrice: 85, amount: 680.0 },
    { id: '3', type: 'expense', date: '2026-11-19', description: 'Commercial font and vector asset licensing', quantityOrHours: 1, rateOrPrice: 65, amount: 65.0 },
  ]);

  // Adjustments & Totals
  const [discountType, setDiscountType] = useState<DiscountType>('pct');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [taxLabel, setTaxLabel] = useState<string>('Sales Tax');
  const [taxOnDiscounted, setTaxOnDiscounted] = useState<boolean>(true);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [depositPaid, setDepositPaid] = useState<number>(0);
  const [notes, setNotes] = useState<string>('Thank you for partnering with us! Please include invoice # on your remittance advice.');

  // Logo upload (client-side data URL only)
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLogoDataUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Timesheet state
  const [timesheetEntries, setTimesheetEntries] = useState<{ id: string; date: string; task: string; rawDuration: string; rate: number }[]>([
    { id: 't1', date: '2026-11-16', task: 'Client intake & discovery workshop', rawDuration: '2:30', rate: 75 },
    { id: 't2', date: '2026-11-17', task: 'Architecture blueprint drafting', rawDuration: '1:45', rate: 75 },
    { id: 't3', date: '2026-11-18', task: 'API integration testing & review', rawDuration: '3:10', rate: 75 },
  ]);
  const [roundingIncrement, setRoundingIncrement] = useState<RoundingIncrement>(15);
  const [roundingMode, setRoundingMode] = useState<RoundingMode>('up');

  // Toast / feedback message
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Calculate totals
  const totals = useMemo(() => {
    return calculateInvoiceTotals({
      lines,
      discountType,
      discountValue,
      taxRate,
      taxOnDiscounted,
      shippingFee,
      depositPaid,
    });
  }, [lines, discountType, discountValue, taxRate, taxOnDiscounted, shippingFee, depositPaid]);

  // Timesheet total hours
  const timesheetTotalHours = useMemo(() => {
    let sum = 0;
    for (const t of timesheetEntries) {
      const dec = parseDuration(t.rawDuration) || 0;
      const rounded = roundHours(dec, roundingIncrement, roundingMode);
      sum += rounded;
    }
    return sum;
  }, [timesheetEntries, roundingIncrement, roundingMode]);

  // Preset template loader
  const handleApplyPreset = (presetKey: string) => {
    const p = INVOICE_PRESETS[presetKey];
    if (p) {
      setLines(p.lines);
      setNotes(p.notes);
      showToast(`Loaded ${p.label} preset.`);
    }
  };

  // Line item helpers
  const handleAddLine = (type: 'hours' | 'fixed' | 'expense' = 'hours') => {
    const newLine: InvoiceLineItem = {
      id: String(Date.now()),
      type,
      date: new Date().toISOString().split('T')[0],
      description: type === 'hours' ? 'Hourly service task' : type === 'expense' ? 'Reimbursable expense' : 'Fixed-fee deliverable',
      quantityOrHours: type === 'hours' ? 1.0 : 1,
      rateOrPrice: type === 'hours' ? 75 : 100,
      amount: type === 'hours' ? 75 : 100,
    };
    setLines([...lines, newLine]);
  };

  const handleUpdateLine = (id: string, updates: Partial<InvoiceLineItem>) => {
    setLines((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...updates };
        const amount = Math.round((updated.quantityOrHours * updated.rateOrPrice + Number.EPSILON) * 100) / 100;
        return { ...updated, amount };
      })
    );
  };

  const handleDeleteLine = (id: string) => {
    setLines((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDuplicateLine = (id: string) => {
    const item = lines.find((i) => i.id === id);
    if (!item) return;
    const duplicated: InvoiceLineItem = {
      ...item,
      id: String(Date.now()),
      description: `${item.description} (Copy)`,
    };
    setLines([...lines, duplicated]);
  };

  // Import timesheet to invoice
  const handleImportTimesheet = () => {
    const importedLines: InvoiceLineItem[] = timesheetEntries.map((entry, idx) => {
      const dec = parseDuration(entry.rawDuration) || 0;
      const rounded = roundHours(dec, roundingIncrement, roundingMode);
      const amount = Math.round((rounded * entry.rate + Number.EPSILON) * 100) / 100;
      return {
        id: `ts-${Date.now()}-${idx}`,
        type: 'hours',
        date: entry.date,
        description: `${entry.task} (${entry.rawDuration} logged → ${rounded.toFixed(2)}h billable)`,
        quantityOrHours: rounded,
        rateOrPrice: entry.rate,
        amount,
      };
    });

    setLines((prev) => [...prev, ...importedLines]);
    handleTabChange('invoice');
    showToast(`Added ${importedLines.length} timesheet entries to invoice!`);
  };

  // Save profile locally
  const handleSaveProfile = () => {
    try {
      safeStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(fromDetails));
      showToast('Profile saved in this browser!');
    } catch {
      showToast('Could not save to localStorage.');
    }
  };

  const handleClearSavedData = () => {
    if (confirm('Clear your saved business details from this browser?')) {
      try {
        safeStorage.removeItem(STORAGE_KEY_PROFILE);
        safeStorage.removeItem(STORAGE_KEY_LAST_NUM);
        showToast('Saved data cleared.');
      } catch {
        // Ignore
      }
    }
  };

  // Print invoice (window.print)
  const handlePrint = () => {
    window.print();
  };

  // Export CSV
  const handleExportCsv = () => {
    const invoicePayload: InvoiceData = {
      from: fromDetails,
      to: toDetails,
      meta: { invoiceNumber, issueDate, terms, dueDate, poNumber },
      lines,
      currency: currencyCode,
      currencySymbol,
      discountType,
      discountValue,
      taxRate,
      taxLabel,
      taxOnDiscounted,
      shippingFee,
      depositPaid,
      notes,
    };
    const csvContent = formatInvoiceCsv(invoicePayload, totals);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoiceNumber || 'invoice'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded CSV.');
  };

  // Copy Plain Text
  const handleCopyText = async () => {
    const invoicePayload: InvoiceData = {
      from: fromDetails,
      to: toDetails,
      meta: { invoiceNumber, issueDate, terms, dueDate, poNumber },
      lines,
      currency: currencyCode,
      currencySymbol,
      discountType,
      discountValue,
      taxRate,
      taxLabel,
      taxOnDiscounted,
      shippingFee,
      depositPaid,
      notes,
    };
    const text = formatInvoiceText(invoicePayload, totals);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied invoice text to clipboard!');
    } catch {
      showToast('Clipboard access unavailable.');
    }
  };

  return (
    <ToolShell
      features={[
        'Hours & h:mm entry',
        'Print or save as PDF',
        'Saved only on this device',
        'Tax, discount & deposit',
      ]}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-invoice,
          #printable-invoice * {
            visibility: visible !important;
          }
          #printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }
        }
      ` }} />
      <div className={styles.wrapper}>
        {/* Privacy First Callout */}
        <div className={styles.privacyBanner}>
          <svg className={styles.privacyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <div>
            <strong>100% Client-Side Privacy:</strong> Nothing you enter into this invoice generator is ever transmitted to a server or external database. All computations, timesheet rounding, and optional logo attachments run locally in your web browser.
          </div>
        </div>

        {/* Tab Navigation */}
        <TabSlider
          tabs={[
            { id: 'invoice', label: '1. Invoice Builder' },
            { id: 'timesheet', label: '2. Timesheet Helper' },
            { id: 'details', label: '3. My Saved Profile' },
          ]}
          activeId={activeTab}
          onChange={handleTabChange}
          ariaLabel="Invoice generator workspace modes"
        />

        {/* Dynamic BLUF Summary Banner */}
        <div className={styles.summaryBanner}>
          <span>
            <strong>Summary:</strong> Invoice <strong>#{invoiceNumber}</strong> contains <strong>{lines.length} items</strong> totalling{' '}
            <strong>{currencySymbol}{totals.total.toFixed(2)}</strong> ({totals.totalHoursWorked.toFixed(2)} billable hours).{' '}
            {totals.depositPaid > 0 ? (
              <span>
                After {currencySymbol}{totals.depositPaid.toFixed(2)} deposit, the remaining <strong>balance due is {currencySymbol}{totals.balanceDue.toFixed(2)}</strong>.
              </span>
            ) : (
              <span>The <strong>balance due is {currencySymbol}{totals.balanceDue.toFixed(2)}</strong>.</span>
            )}
          </span>
        </div>

        {/* Interactive Visual Guide */}
        <InvoiceInputGuide
          activeTab={activeTab}
          invoiceNumber={invoiceNumber}
          senderName={fromDetails.businessName || fromDetails.senderName}
          clientName={toDetails.companyName || toDetails.clientName}
          itemCount={lines.length}
          totalHours={totals.totalHoursWorked}
          subtotal={totals.subtotal}
          balanceDue={totals.balanceDue}
          currencySymbol={currencySymbol}
          roundingIncrement={roundingIncrement}
          roundingMode={roundingMode}
        />

        {/* Action Bar (Top Controls) */}
        <div className={styles.topBar}>
          <div className={styles.controlsGroup}>
            <button type="button" onClick={handlePrint} className={`${styles.btn} ${styles.btnPrimary}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Print / Save as PDF</span>
            </button>
            <button type="button" onClick={handleExportCsv} className={`${styles.btn} ${styles.btnSecondary}`}>
              CSV
            </button>
            <button type="button" onClick={handleCopyText} className={`${styles.btn} ${styles.btnSecondary}`}>
              Copy Text
            </button>
          </div>

          <div className={styles.controlsGroup}>
            <label htmlFor={`${uid}-preset`} className={styles.label} style={{ margin: 0 }}>Preset:</label>
            <select
              id={`${uid}-preset`}
              onChange={(e) => e.target.value && handleApplyPreset(e.target.value)}
              className={styles.select}
              defaultValue=""
            >
              <option value="" disabled>Load sample preset...</option>
              <option value="freelance">Freelance General</option>
              <option value="writer">Freelance Writer</option>
              <option value="translator">Translator</option>
              <option value="contractor">Independent Contractor</option>
            </select>

            <label htmlFor={`${uid}-curr`} className={styles.label} style={{ margin: 0 }}>Currency:</label>
            <select
              id={`${uid}-curr`}
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              className={styles.select}
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Toast alert */}
        {toastMsg && (
          <div style={{ background: '#1e293b', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', fontSize: '0.875rem' }}>
            {toastMsg}
          </div>
        )}

        {/* TAB 1: INVOICE BUILDER */}
        {activeTab === 'invoice' && (
          <div className={styles.editorGrid}>
            {/* Left Column: Form Controls */}
            <div className={styles.card}>
              {/* Section 1: Business (From) */}
              <div className={styles.cardSection}>
                <div className={styles.sectionTitle}>
                  <span>1. From (Your Business)</span>
                  {logoDataUrl ? (
                    <button type="button" onClick={() => setLogoDataUrl(null)} className={styles.iconBtn} style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                      Remove Logo
                    </button>
                  ) : (
                    <label style={{ fontSize: '0.75rem', color: '#0b5ea4', cursor: 'pointer', fontWeight: 600 }}>
                      + Add Logo
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-from-biz`} className={styles.label}>Business / Brand Name</label>
                    <input
                      id={`${uid}-from-biz`}
                      className={styles.input}
                      value={fromDetails.businessName}
                      onChange={(e) => setFromDetails({ ...fromDetails, businessName: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-from-name`} className={styles.label}>Your Name</label>
                    <input
                      id={`${uid}-from-name`}
                      className={styles.input}
                      value={fromDetails.senderName}
                      onChange={(e) => setFromDetails({ ...fromDetails, senderName: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-from-addr`} className={styles.label}>Address</label>
                  <input
                    id={`${uid}-from-addr`}
                    className={styles.input}
                    value={fromDetails.address}
                    onChange={(e) => setFromDetails({ ...fromDetails, address: e.target.value })}
                  />
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-from-email`} className={styles.label}>Email</label>
                    <input
                      id={`${uid}-from-email`}
                      className={styles.input}
                      value={fromDetails.email}
                      onChange={(e) => setFromDetails({ ...fromDetails, email: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-from-tax`} className={styles.label}>
                      {fromDetails.taxIdLabel || 'Tax ID (EIN / VAT / ABN)'}
                    </label>
                    <input
                      id={`${uid}-from-tax`}
                      className={styles.input}
                      value={fromDetails.taxId}
                      onChange={(e) => setFromDetails({ ...fromDetails, taxId: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Bill To (Client) */}
              <div className={styles.cardSection}>
                <div className={styles.sectionTitle}>
                  <span>2. Bill To (Client)</span>
                </div>
                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-to-comp`} className={styles.label}>Company Name</label>
                    <input
                      id={`${uid}-to-comp`}
                      className={styles.input}
                      value={toDetails.companyName}
                      onChange={(e) => setToDetails({ ...toDetails, companyName: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-to-name`} className={styles.label}>Contact Name</label>
                    <input
                      id={`${uid}-to-name`}
                      className={styles.input}
                      value={toDetails.clientName}
                      onChange={(e) => setToDetails({ ...toDetails, clientName: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-to-addr`} className={styles.label}>Address</label>
                  <input
                    id={`${uid}-to-addr`}
                    className={styles.input}
                    value={toDetails.address}
                    onChange={(e) => setToDetails({ ...toDetails, address: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-to-email`} className={styles.label}>Email</label>
                  <input
                    id={`${uid}-to-email`}
                    className={styles.input}
                    value={toDetails.email}
                    onChange={(e) => setToDetails({ ...toDetails, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 3: Metadata & Dates */}
              <div className={styles.cardSection}>
                <div className={styles.sectionTitle}>
                  <span>3. Invoice Meta &amp; Terms</span>
                </div>
                <div className={styles.formGrid3}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-inv-num`} className={styles.label}>Invoice #</label>
                    <input
                      id={`${uid}-inv-num`}
                      className={styles.input}
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-issue-date`} className={styles.label}>Issue Date</label>
                    <input
                      id={`${uid}-issue-date`}
                      type="date"
                      className={styles.input}
                      value={issueDate}
                      onChange={(e) => handleIssueDateChange(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-terms`} className={styles.label}>Terms</label>
                    <select
                      id={`${uid}-terms`}
                      value={terms}
                      onChange={(e) => handleTermsChange(e.target.value as PaymentTerms)}
                      className={styles.select}
                    >
                      <option value="due_on_receipt">Due on Receipt</option>
                      <option value="net_7">Net 7 Days</option>
                      <option value="net_14">Net 14 Days</option>
                      <option value="net_30">Net 30 Days</option>
                      <option value="net_60">Net 60 Days</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-due-date`} className={styles.label}>Due Date (Auto)</label>
                    <input
                      id={`${uid}-due-date`}
                      type="date"
                      className={styles.input}
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-po-ref`} className={styles.label}>PO / Reference #</label>
                    <input
                      id={`${uid}-po-ref`}
                      className={styles.input}
                      placeholder="e.g. PO-2026-99"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Line Items */}
              <div className={styles.cardSection}>
                <div className={styles.sectionTitle}>
                  <span>4. Line Items ({lines.length})</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" onClick={() => handleAddLine('hours')} className={styles.btnSecondary} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                      + Hours
                    </button>
                    <button type="button" onClick={() => handleAddLine('fixed')} className={styles.btnSecondary} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                      + Fixed
                    </button>
                    <button type="button" onClick={() => handleAddLine('expense')} className={styles.btnSecondary} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                      + Expense
                    </button>
                  </div>
                </div>

                <div className={styles.linesContainer}>
                  {lines.map((line) => (
                    <div key={line.id} className={styles.lineRow}>
                      <div className={styles.lineTopRow}>
                        <select
                          value={line.type}
                          onChange={(e) => handleUpdateLine(line.id, { type: e.target.value as 'hours' | 'fixed' | 'expense' })}
                          className={styles.select}
                          style={{ padding: '4px 6px', fontSize: '0.75rem' }}
                        >
                          <option value="hours">Hours</option>
                          <option value="fixed">Fixed</option>
                          <option value="expense">Expense</option>
                        </select>
                        <input
                          className={styles.input}
                          placeholder="Task or service description..."
                          value={line.description}
                          onChange={(e) => handleUpdateLine(line.id, { description: e.target.value })}
                        />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => handleDuplicateLine(line.id)}
                            className={styles.iconBtn}
                            title="Duplicate line"
                            aria-label="Duplicate line"
                          >
                            ⧉
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLine(line.id)}
                            className={styles.iconBtn}
                            title="Delete line"
                            aria-label="Delete line"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className={styles.lineBottomRow}>
                        <div>
                          <label className={styles.label} style={{ fontSize: '0.7rem' }}>Date</label>
                          <input
                            type="date"
                            className={styles.input}
                            value={line.date || ''}
                            onChange={(e) => handleUpdateLine(line.id, { date: e.target.value })}
                            style={{ padding: '4px 6px' }}
                          />
                        </div>
                        <div>
                          <label className={styles.label} style={{ fontSize: '0.7rem' }}>
                            {line.type === 'hours' ? 'Hours' : 'Qty'}
                          </label>
                          <input
                            type="number"
                            step="0.25"
                            className={styles.input}
                            value={line.quantityOrHours || ''}
                            onChange={(e) => handleUpdateLine(line.id, { quantityOrHours: parseFloat(e.target.value) || 0 })}
                            style={{ padding: '4px 6px' }}
                          />
                        </div>
                        <div>
                          <label className={styles.label} style={{ fontSize: '0.7rem' }}>
                            {line.type === 'hours' ? 'Rate ($/h)' : 'Price ($)'}
                          </label>
                          <input
                            type="number"
                            step="5"
                            className={styles.input}
                            value={line.rateOrPrice || ''}
                            onChange={(e) => handleUpdateLine(line.id, { rateOrPrice: parseFloat(e.target.value) || 0 })}
                            style={{ padding: '4px 6px' }}
                          />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className={styles.label} style={{ fontSize: '0.7rem', display: 'block' }}>Amount</span>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                            {currencySymbol}{line.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Totals, Discounts & Taxes */}
              <div className={styles.cardSection}>
                <div className={styles.sectionTitle}>
                  <span>5. Discounts, Taxes &amp; Deposit</span>
                </div>
                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label htmlFor={`${uid}-disc`} className={styles.label}>Discount</label>
                      <button
                        type="button"
                        onClick={() => setDiscountType(discountType === 'pct' ? 'fixed' : 'pct')}
                        style={{ background: 'none', border: 'none', color: '#0b5ea4', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Switch to {discountType === 'pct' ? 'Fixed ($)' : 'Percentage (%)'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        id={`${uid}-disc`}
                        type="number"
                        step={discountType === 'pct' ? '1' : '10'}
                        className={styles.input}
                        value={discountValue || ''}
                        onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                      />
                      <span style={{ marginLeft: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                        {discountType === 'pct' ? '%' : currencySymbol}
                      </span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-tax-rate`} className={styles.label}>
                      Tax Rate (%): {taxLabel}
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        id={`${uid}-tax-rate`}
                        type="number"
                        step="0.5"
                        className={styles.input}
                        value={taxRate || ''}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      />
                      <select
                        value={taxLabel}
                        onChange={(e) => setTaxLabel(e.target.value)}
                        className={styles.select}
                      >
                        <option value="Sales Tax">Sales Tax</option>
                        <option value="VAT">VAT</option>
                        <option value="GST">GST</option>
                        <option value="HST">HST</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-shipping`} className={styles.label}>Shipping / Other Fee</label>
                    <input
                      id={`${uid}-shipping`}
                      type="number"
                      step="5"
                      className={styles.input}
                      value={shippingFee || ''}
                      onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor={`${uid}-deposit`} className={styles.label}>Amount Paid / Deposit</label>
                    <input
                      id={`${uid}-deposit`}
                      type="number"
                      step="50"
                      className={styles.input}
                      value={depositPaid || ''}
                      onChange={(e) => setDepositPaid(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#475569', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={taxOnDiscounted}
                      onChange={(e) => setTaxOnDiscounted(e.target.checked)}
                    />
                    <span>Apply tax on discounted subtotal (standard accounting practice)</span>
                  </label>
                </div>
              </div>

              {/* Section 6: Notes & Payment Instructions */}
              <div className={styles.cardSection}>
                <div className={styles.sectionTitle}>
                  <span>6. Notes &amp; Payment Instructions</span>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-notes`} className={styles.label}>Customer Notes / Terms</label>
                  <textarea
                    id={`${uid}-notes`}
                    rows={2}
                    className={styles.textarea}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor={`${uid}-pay-instr`} className={styles.label}>Payment Instructions (Bank / Wire / Links)</label>
                  <textarea
                    id={`${uid}-pay-instr`}
                    rows={3}
                    className={styles.textarea}
                    value={fromDetails.paymentInstructions}
                    onChange={(e) => setFromDetails({ ...fromDetails, paymentInstructions: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Live Printable Sheet Preview */}
            <div id="printable-invoice" className={styles.previewSheet}>
              {/* Header */}
              <div className={styles.previewHeader}>
                <div>
                  {logoDataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoDataUrl} alt="Business logo" className={styles.logoImage} />
                  )}
                  <div className={styles.previewBusinessName}>
                    {fromDetails.businessName || fromDetails.senderName}
                  </div>
                  {fromDetails.senderName && fromDetails.businessName && (
                    <div style={{ color: '#475569', fontSize: '0.875rem' }}>{fromDetails.senderName}</div>
                  )}
                  {fromDetails.address && (
                    <div style={{ color: '#475569', fontSize: '0.8125rem', whiteSpace: 'pre-line' }}>{fromDetails.address}</div>
                  )}
                  {fromDetails.email && (
                    <div style={{ color: '#475569', fontSize: '0.8125rem' }}>{fromDetails.email}</div>
                  )}
                  {fromDetails.taxId && (
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                      {fromDetails.taxIdLabel || 'Tax ID'}: {fromDetails.taxId}
                    </div>
                  )}
                </div>

                <div className={styles.previewInvoiceBadge}>
                  <h2 className={styles.previewInvoiceTitle}>INVOICE</h2>
                  <div className={styles.previewInvoiceNumber}>#{invoiceNumber}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '4px' }}>
                    <strong>Date:</strong> {issueDate}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#0f172a', fontWeight: 600 }}>
                    <strong>Due:</strong> {dueDate}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Terms: {terms.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  {poNumber && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      PO / Ref: {poNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Billed To Block */}
              <div className={styles.previewMetaGrid}>
                <div className={styles.previewToBlock}>
                  <span className={styles.previewBlockTitle}>Billed To</span>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>
                    {toDetails.companyName || toDetails.clientName}
                  </div>
                  {toDetails.clientName && toDetails.companyName && (
                    <div style={{ color: '#475569' }}>Attn: {toDetails.clientName}</div>
                  )}
                  {toDetails.address && (
                    <div style={{ color: '#475569', whiteSpace: 'pre-line' }}>{toDetails.address}</div>
                  )}
                  {toDetails.email && (
                    <div style={{ color: '#475569' }}>{toDetails.email}</div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    <th style={{ width: '90px' }}>Date</th>
                    <th>Description</th>
                    <th style={{ width: '80px', textAlign: 'right' }}>Hours/Qty</th>
                    <th style={{ width: '90px', textAlign: 'right' }}>Rate</th>
                    <th style={{ width: '100px', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line) => (
                    <tr key={line.id}>
                      <td style={{ color: '#64748b', fontSize: '0.8125rem' }}>{line.date || '—'}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{line.description}</div>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                          {line.type}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>{line.quantityOrHours}</td>
                      <td style={{ textAlign: 'right' }}>{currencySymbol}{line.rateOrPrice.toFixed(2)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{currencySymbol}{line.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Summary */}
              <div className={styles.previewTotalsWrap}>
                <div className={styles.previewTotalsTable}>
                  <div className={styles.previewTotalsRow}>
                    <span>Subtotal:</span>
                    <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>

                  {totals.discountAmount > 0 && (
                    <div className={styles.previewTotalsRow} style={{ color: '#16a34a' }}>
                      <span>Discount {discountType === 'pct' ? `(${discountValue}%)` : ''}:</span>
                      <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {(totals.taxAmount > 0 || taxRate > 0) && (
                    <div className={styles.previewTotalsRow}>
                      <span>{taxLabel} ({taxRate}%):</span>
                      <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {totals.shippingFee > 0 && (
                    <div className={styles.previewTotalsRow}>
                      <span>Shipping / Other:</span>
                      <span>{currencySymbol}{totals.shippingFee.toFixed(2)}</span>
                    </div>
                  )}

                  <div className={styles.previewTotalsRow} style={{ fontWeight: 700, color: '#0f172a' }}>
                    <span>Total:</span>
                    <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                  </div>

                  {totals.depositPaid > 0 && (
                    <div className={styles.previewTotalsRow} style={{ color: '#0284c7' }}>
                      <span>Paid / Deposit:</span>
                      <span>-{currencySymbol}{totals.depositPaid.toFixed(2)}</span>
                    </div>
                  )}

                  <div className={styles.previewTotalsRowBold}>
                    <span>{totals.isCredit ? 'Credit Balance:' : 'Balance Due:'}</span>
                    <span>{currencySymbol}{Math.abs(totals.balanceDue).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer: Notes & Remittance */}
              <div className={styles.previewFooter}>
                {notes && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>Notes</div>
                    <div>{notes}</div>
                  </div>
                )}
                {fromDetails.paymentInstructions && (
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>Payment Instructions</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{fromDetails.paymentInstructions}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TIMESHEET HELPER */}
        {activeTab === 'timesheet' && (
          <div className={styles.card}>
            <div className={styles.sectionTitle}>
              <span>Contractor Timesheet &amp; Hourly Conversion</span>
              <button
                type="button"
                onClick={handleImportTimesheet}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                + Import All to Invoice Lines
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-2, #475569)', marginBottom: '16px' }}>
              Log your individual tasks with either colon format (e.g. <code>2:30</code>) or decimal hours (<code>2.5</code>). Choose an increment to round fractional minutes according to professional billing standards.
            </p>

            <div className={styles.formGrid2} style={{ marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-round-inc`} className={styles.label}>Billing Rounding Increment</label>
                <select
                  id={`${uid}-round-inc`}
                  value={roundingIncrement}
                  onChange={(e) => setRoundingIncrement(parseInt(e.target.value, 10) as RoundingIncrement)}
                  className={styles.select}
                >
                  <option value={0}>Exact minutes (no rounding)</option>
                  <option value={6}>6 minutes (0.1h tenth-of-an-hour / legal billing)</option>
                  <option value={15}>15 minutes (0.25 h)</option>
                  <option value={30}>30 minutes (0.5h half-hour)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-round-mode`} className={styles.label}>Rounding Mode</label>
                <select
                  id={`${uid}-round-mode`}
                  value={roundingMode}
                  onChange={(e) => setRoundingMode(e.target.value as RoundingMode)}
                  className={styles.select}
                >
                  <option value="up">Round Up (Always bill up to next bracket)</option>
                  <option value="nearest">Round to Nearest Bracket</option>
                  <option value="none">None (Exact)</option>
                </select>
              </div>
            </div>

            <div className={styles.linesContainer}>
              {timesheetEntries.map((entry, idx) => {
                const dec = parseDuration(entry.rawDuration) || 0;
                const rounded = roundHours(dec, roundingIncrement, roundingMode);
                const amt = Math.round((rounded * entry.rate + Number.EPSILON) * 100) / 100;

                return (
                  <div key={entry.id} className={styles.lineRow} style={{ background: '#ffffff' }}>
                    <div className={styles.lineTopRow}>
                      <input
                        type="date"
                        className={styles.input}
                        value={entry.date}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTimesheetEntries((prev) => prev.map((t, i) => (i === idx ? { ...t, date: val } : t)));
                        }}
                      />
                      <input
                        className={styles.input}
                        placeholder="Task description..."
                        value={entry.task}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTimesheetEntries((prev) => prev.map((t, i) => (i === idx ? { ...t, task: val } : t)));
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setTimesheetEntries((prev) => prev.filter((_, i) => i !== idx))}
                        className={styles.iconBtn}
                        aria-label="Remove timesheet row"
                      >
                        ✕
                      </button>
                    </div>

                    <div className={styles.lineBottomRow}>
                      <div>
                        <label className={styles.label} style={{ fontSize: '0.7rem' }}>Time Logged (h:mm or dec)</label>
                        <input
                          className={styles.input}
                          placeholder="e.g. 2:30"
                          value={entry.rawDuration}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTimesheetEntries((prev) => prev.map((t, i) => (i === idx ? { ...t, rawDuration: val } : t)));
                          }}
                        />
                      </div>
                      <div>
                        <label className={styles.label} style={{ fontSize: '0.7rem' }}>Billable Hours</label>
                        <div style={{ padding: '8px 10px', background: '#f0fdf4', borderRadius: '6px', fontWeight: 700, color: '#166534' }}>
                          {rounded.toFixed(2)}h
                        </div>
                      </div>
                      <div>
                        <label className={styles.label} style={{ fontSize: '0.7rem' }}>Hourly Rate ($/h)</label>
                        <input
                          type="number"
                          className={styles.input}
                          value={entry.rate || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setTimesheetEntries((prev) => prev.map((t, i) => (i === idx ? { ...t, rate: val } : t)));
                          }}
                        />
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={styles.label} style={{ fontSize: '0.7rem', display: 'block' }}>Line Value</span>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                          {currencySymbol}{amt.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setTimesheetEntries([
                    ...timesheetEntries,
                    { id: `t-${Date.now()}`, date: new Date().toISOString().split('T')[0], task: '', rawDuration: '1:00', rate: 75 },
                  ]);
                }}
                className={styles.btnSecondary}
              >
                + Add Time Entry
              </button>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b', marginRight: '8px' }}>
                  Total Timesheet Hours: <strong>{timesheetTotalHours.toFixed(2)}h</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SAVED DETAILS (LOCAL PROFILE) */}
        {activeTab === 'details' && (
          <div className={styles.card}>
            <div className={styles.sectionTitle}>
              <span>My Business Profile (Stored Only in This Browser)</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-2, #475569)', marginBottom: '16px' }}>
              Save your standard business name, address, tax identification, and banking instructions here so you never have to retype them. Data is persisted exclusively in your personal browser&apos;s localStorage and is never uploaded anywhere.
            </p>

            <div className={styles.formGrid2}>
              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-save-biz`} className={styles.label}>Business / Trading Name</label>
                <input
                  id={`${uid}-save-biz`}
                  className={styles.input}
                  value={fromDetails.businessName}
                  onChange={(e) => setFromDetails({ ...fromDetails, businessName: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-save-name`} className={styles.label}>Your Name</label>
                <input
                  id={`${uid}-save-name`}
                  className={styles.input}
                  value={fromDetails.senderName}
                  onChange={(e) => setFromDetails({ ...fromDetails, senderName: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`${uid}-save-addr`} className={styles.label}>Business Address</label>
              <input
                id={`${uid}-save-addr`}
                className={styles.input}
                value={fromDetails.address}
                onChange={(e) => setFromDetails({ ...fromDetails, address: e.target.value })}
              />
            </div>

            <div className={styles.formGrid2}>
              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-save-email`} className={styles.label}>Email</label>
                <input
                  id={`${uid}-save-email`}
                  className={styles.input}
                  value={fromDetails.email}
                  onChange={(e) => setFromDetails({ ...fromDetails, email: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-save-phone`} className={styles.label}>Phone</label>
                <input
                  id={`${uid}-save-phone`}
                  className={styles.input}
                  value={fromDetails.phone}
                  onChange={(e) => setFromDetails({ ...fromDetails, phone: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.formGrid2}>
              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-save-taxid`} className={styles.label}>Tax Registration / Identification Number</label>
                <input
                  id={`${uid}-save-taxid`}
                  className={styles.input}
                  value={fromDetails.taxId}
                  onChange={(e) => setFromDetails({ ...fromDetails, taxId: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor={`${uid}-save-taxlbl`} className={styles.label}>Tax Label</label>
                <select
                  id={`${uid}-save-taxlbl`}
                  value={fromDetails.taxIdLabel}
                  onChange={(e) => setFromDetails({ ...fromDetails, taxIdLabel: e.target.value })}
                  className={styles.select}
                >
                  <option value="EIN">EIN (US Federal Employer ID)</option>
                  <option value="SSN">SSN (US Sole Proprietor)</option>
                  <option value="VAT Reg No.">VAT Reg No. (UK / EU)</option>
                  <option value="ABN">ABN (Australia Business Number)</option>
                  <option value="GST No.">GST No. (Canada / India / NZ)</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`${uid}-save-pay`} className={styles.label}>Default Payment &amp; Remittance Instructions</label>
              <textarea
                id={`${uid}-save-pay`}
                rows={4}
                className={styles.textarea}
                value={fromDetails.paymentInstructions}
                onChange={(e) => setFromDetails({ ...fromDetails, paymentInstructions: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={handleSaveProfile}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Save Profile in This Browser
              </button>
              <button
                type="button"
                onClick={handleClearSavedData}
                className={`${styles.btn} ${styles.btnDanger}`}
              >
                Clear Saved Data
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
