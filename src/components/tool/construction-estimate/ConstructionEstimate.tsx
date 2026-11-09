'use client';

import React, { useState, useEffect } from 'react';
import { CompanyInfo as CompanyInfoType, Currency, EstimateData, LineItem, ProjectInfo as ProjectInfoType } from './types';
import { STARTER_ESTIMATE } from './constants';
import { calculateEstimateTotals } from './calculations';
import { formatAsCSV, formatAsTXT } from './formatter';
import { safeStorage } from '@/lib/storage';
import CurrencySelector from './CurrencySelector';
import ProjectInfo from './ProjectInfo';
import CompanyInfo from './CompanyInfo';
import LineItems from './LineItems';
import TotalsPanel from './TotalsPanel';
import NotesSection from './NotesSection';
import ActionBar from './ActionBar';
import SavedEstimates from './SavedEstimates';
import styles from './ConstructionEstimate.module.css';

const STORAGE_SAVED_ESTIMATES = 'saved_construction_estimates';
const STORAGE_COMPANY_INFO = 'saved_contractor_company_info';

interface ConstructionEstimateProps {
  starterEstimate?: EstimateData;
}

export default function ConstructionEstimate({ starterEstimate }: ConstructionEstimateProps) {
  const initialData = starterEstimate || STARTER_ESTIMATE;
  const [estimate, setEstimate] = useState<EstimateData>(initialData);
  const [savedList, setSavedList] = useState<EstimateData[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved estimates & company info from localStorage on mount
  useEffect(() => {
    const list = safeStorage.getJSON<EstimateData[]>(STORAGE_SAVED_ESTIMATES, []);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedList(list);

    const savedCompany = safeStorage.getJSON<CompanyInfoType | null>(STORAGE_COMPANY_INFO, null);
    if (savedCompany && savedCompany.companyName) {
      setEstimate((prev) => ({
        ...prev,
        companyInfo: savedCompany,
      }));
    }
  }, []);

  const totals = calculateEstimateTotals(
    estimate.lineItems,
    estimate.taxRate,
    estimate.markupRate
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCurrencyChange = (currency: Currency) => {
    setEstimate((prev) => ({ ...prev, currency, updatedAt: new Date().toISOString() }));
  };

  const handleProjectInfoChange = (projectInfo: ProjectInfoType) => {
    setEstimate((prev) => ({ ...prev, projectInfo, updatedAt: new Date().toISOString() }));
  };

  const handleCompanyInfoChange = (companyInfo: CompanyInfoType) => {
    setEstimate((prev) => ({ ...prev, companyInfo, updatedAt: new Date().toISOString() }));
    safeStorage.setJSON(STORAGE_COMPANY_INFO, companyInfo);
  };

  const handleUpdateLineItem = (updated: LineItem) => {
    setEstimate((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => (item.id === updated.id ? updated : item)),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleRemoveLineItem = (id: string) => {
    setEstimate((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddLineItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      description: '',
      category: 'materials',
      quantity: 1,
      unit: 'each',
      unitPrice: 0,
      total: 0,
    };
    setEstimate((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleTaxRateChange = (taxRate: number) => {
    setEstimate((prev) => ({ ...prev, taxRate, updatedAt: new Date().toISOString() }));
  };

  const handleMarkupRateChange = (markupRate: number) => {
    setEstimate((prev) => ({ ...prev, markupRate, updatedAt: new Date().toISOString() }));
  };

  const handleNotesChange = (notes: string) => {
    setEstimate((prev) => ({ ...prev, notes, updatedAt: new Date().toISOString() }));
  };

  // Actions
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const triggerBlobDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getCleanFilename = (ext: string) => {
    const base = estimate.projectInfo.projectName
      ? estimate.projectInfo.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
      : 'construction-estimate';
    return `${base}-${estimate.projectInfo.estimateNumber || 'export'}.${ext}`;
  };

  const handleDownloadCSV = () => {
    const csv = formatAsCSV(estimate, totals);
    triggerBlobDownload(csv, getCleanFilename('csv'), 'text/csv;charset=utf-8;');
    showToast('Spreadsheet CSV downloaded successfully!');
  };

  const handleDownloadTXT = () => {
    const txt = formatAsTXT(estimate, totals);
    triggerBlobDownload(txt, getCleanFilename('txt'), 'text/plain;charset=utf-8;');
    showToast('Formatted estimate TXT downloaded successfully!');
  };

  const handleSave = () => {
    const currentId = estimate.id || `estimate-${Date.now()}`;
    const toSave: EstimateData = {
      ...estimate,
      id: currentId,
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = savedList.findIndex((item) => item.id === currentId);
    let updatedList: EstimateData[];
    if (existingIndex >= 0) {
      updatedList = [...savedList];
      updatedList[existingIndex] = toSave;
    } else {
      updatedList = [toSave, ...savedList].slice(0, 20); // retain up to 20 saved estimates
    }

    setSavedList(updatedList);
    safeStorage.setJSON(STORAGE_SAVED_ESTIMATES, updatedList);
    showToast('Estimate saved privately to browser storage!');
  };

  const handleLoad = (loaded: EstimateData) => {
    setEstimate(loaded);
    showToast(`Loaded estimate: ${loaded.projectInfo.projectName || 'Project'}`);
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedList.filter((item) => item.id !== id);
    setSavedList(updated);
    safeStorage.setJSON(STORAGE_SAVED_ESTIMATES, updated);
    showToast('Saved estimate deleted.');
  };

  const handleNew = () => {
    if (
      estimate.lineItems.length > 0 &&
      !window.confirm('Start a new estimate? Unsaved changes in your current form will be reset.')
    ) {
      return;
    }

    const fresh: EstimateData = {
      id: `estimate-${Date.now()}`,
      projectInfo: {
        projectName: '',
        clientName: '',
        projectAddress: '',
        date: new Date().toISOString().split('T')[0],
        estimateNumber: `EST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        validDays: 30,
      },
      companyInfo: estimate.companyInfo, // keep company info intact
      lineItems: [
        {
          id: `item-${Date.now()}`,
          description: '',
          category: 'materials',
          quantity: 1,
          unit: 'each',
          unitPrice: 0,
          total: 0,
        },
      ],
      taxRate: 0,
      markupRate: 0,
      currency: estimate.currency,
      notes: 'Payment terms: 50% deposit upon contract signing, 50% upon final completion.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEstimate(fresh);
    showToast('Started new blank estimate.');
  };

  return (
    <div className={styles.container}>
      {/* Top Utility Bar */}
      <div className={styles.topControlBar}>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot} />
          <span>Interactive Builder · 100% Client-Side</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {toastMessage && <div className={styles.toastNotification}>{toastMessage}</div>}
          <CurrencySelector value={estimate.currency} onChange={handleCurrencyChange} />
        </div>
      </div>

      {/* Project & Client Info */}
      <ProjectInfo data={estimate.projectInfo} onChange={handleProjectInfoChange} />

      {/* Contractor Company Info (Collapsible) */}
      <CompanyInfo data={estimate.companyInfo} onChange={handleCompanyInfoChange} />

      {/* Line Items Table */}
      <LineItems
        items={estimate.lineItems}
        currency={estimate.currency}
        onUpdateItem={handleUpdateLineItem}
        onRemoveItem={handleRemoveLineItem}
        onAddItem={handleAddLineItem}
      />

      {/* Totals & Calculations Panel */}
      <TotalsPanel
        totals={totals}
        taxRate={estimate.taxRate}
        markupRate={estimate.markupRate}
        currency={estimate.currency}
        onTaxRateChange={handleTaxRateChange}
        onMarkupRateChange={handleMarkupRateChange}
      />

      {/* Notes & Payment Terms */}
      <NotesSection notes={estimate.notes} onChange={handleNotesChange} />

      {/* Sticky Action Bar */}
      <ActionBar
        onPrint={handlePrint}
        onDownloadCSV={handleDownloadCSV}
        onDownloadTXT={handleDownloadTXT}
        onSave={handleSave}
        onNew={handleNew}
      />
      <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', textAlign: 'center', marginTop: 'var(--space-2)', lineHeight: 1.5, marginBottom: 0 }}>
        ⚡ 100% Client-Side Estimator · Instant Auto-Calculation · Zero Server Uploads · No Sign-up Required
      </p>

      {/* Saved Estimates Drawer */}
      <SavedEstimates
        savedList={savedList}
        onLoad={handleLoad}
        onDelete={handleDeleteSaved}
      />
    </div>
  );
}
