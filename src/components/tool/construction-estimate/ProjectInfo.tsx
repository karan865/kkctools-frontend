'use client';

import React from 'react';
import { ProjectInfo as ProjectInfoType } from './types';
import styles from './ConstructionEstimate.module.css';

interface ProjectInfoProps {
  data: ProjectInfoType;
  onChange: (data: ProjectInfoType) => void;
}

export default function ProjectInfo({ data, onChange }: ProjectInfoProps) {
  const handleChange = (field: keyof ProjectInfoType, val: string | number) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  return (
    <div className={styles.sectionCard}>
      <h2 className={styles.sectionTitle}>Project &amp; Client Details</h2>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="project-name" className={styles.label}>
            Project Name <span className={styles.required}>*</span>
          </label>
          <input
            id="project-name"
            type="text"
            className={styles.input}
            placeholder="e.g. Master Bathroom Remodel"
            value={data.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="client-name" className={styles.label}>
            Client Name <span className={styles.required}>*</span>
          </label>
          <input
            id="client-name"
            type="text"
            className={styles.input}
            placeholder="e.g. Robert &amp; Linda Davis"
            value={data.clientName}
            onChange={(e) => handleChange('clientName', e.target.value)}
          />
        </div>

        <div className={styles.formGroupFull}>
          <label htmlFor="project-address" className={styles.label}>
            Jobsite / Project Address
          </label>
          <input
            id="project-address"
            type="text"
            className={styles.input}
            placeholder="e.g. 1248 Oakridge Drive, Dallas, TX 75201"
            value={data.projectAddress}
            onChange={(e) => handleChange('projectAddress', e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="estimate-number" className={styles.label}>
            Estimate Reference #
          </label>
          <input
            id="estimate-number"
            type="text"
            className={styles.input}
            placeholder="e.g. EST-2026-104"
            value={data.estimateNumber}
            onChange={(e) => handleChange('estimateNumber', e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="estimate-date" className={styles.label}>
            Estimate Date
          </label>
          <input
            id="estimate-date"
            type="date"
            className={styles.input}
            value={data.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="valid-days" className={styles.label}>
            Estimate Validity (Days)
          </label>
          <input
            id="valid-days"
            type="number"
            min="1"
            max="365"
            className={styles.input}
            value={data.validDays || 30}
            onChange={(e) => handleChange('validDays', parseInt(e.target.value, 10) || 30)}
          />
        </div>
      </div>
    </div>
  );
}

