'use client';

import React, { useState } from 'react';
import { CompanyInfo as CompanyInfoType } from './types';
import styles from './ConstructionEstimate.module.css';

interface CompanyInfoProps {
  data: CompanyInfoType;
  onChange: (data: CompanyInfoType) => void;
}

export default function CompanyInfo({ data, onChange }: CompanyInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field: keyof CompanyInfoType, val: string) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  return (
    <div className={styles.sectionCard}>
      <button
        type="button"
        className={styles.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.accordionTitleBlock}>
          <h3 className={styles.sectionTitle}>
            Contractor &amp; Business Information{' '}
            <span className={styles.optionalBadge}>(Optional Letterhead)</span>
          </h3>
          <p className={styles.sectionSubtitle}>
            {data.companyName
              ? `${data.companyName} • ${data.licenseNumber || 'License on file'}`
              : 'Add your business name, license, and phone to print on proposal header'}
          </p>
        </div>
        <span className={styles.accordionChevron}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={styles.accordionBody}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="company-name" className={styles.label}>
                Company / Business Name
              </label>
              <input
                id="company-name"
                type="text"
                className={styles.input}
                placeholder="e.g. Pinnacle Builders LLC"
                value={data.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="company-license" className={styles.label}>
                Contractor License / Registration #
              </label>
              <input
                id="company-license"
                type="text"
                className={styles.input}
                placeholder="e.g. General Contractor #98721"
                value={data.licenseNumber}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="company-phone" className={styles.label}>
                Phone Number
              </label>
              <input
                id="company-phone"
                type="tel"
                className={styles.input}
                placeholder="e.g. (555) 987-6543"
                value={data.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="company-email" className={styles.label}>
                Email Address
              </label>
              <input
                id="company-email"
                type="email"
                className={styles.input}
                placeholder="e.g. contact@pinnaclebuilders.example"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label htmlFor="company-address" className={styles.label}>
                Physical Business Address
              </label>
              <input
                id="company-address"
                type="text"
                className={styles.input}
                placeholder="e.g. 500 Enterprise Way, Suite 200, Seattle, WA"
                value={data.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

