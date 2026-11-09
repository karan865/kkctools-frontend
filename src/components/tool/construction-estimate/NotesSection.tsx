'use client';

import React from 'react';
import styles from './ConstructionEstimate.module.css';

interface NotesSectionProps {
  notes: string;
  onChange: (notes: string) => void;
}

export default function NotesSection({ notes, onChange }: NotesSectionProps) {
  return (
    <div className={styles.sectionCard}>
      <h3 className={styles.sectionTitle}>Notes, Payment Schedule &amp; Warranties</h3>
      <p className={styles.sectionSubtitle}>
        Define project milestone terms, warranty coverage, deposit requirements, and scope exclusions.
      </p>
      <div className={styles.formGroupFull}>
        <label htmlFor="estimate-notes" className={styles.srOnly}>
          Estimate Notes &amp; Payment Terms
        </label>
        <textarea
          id="estimate-notes"
          rows={4}
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. 30% deposit upon contract signature, 40% upon rough-in inspection pass, 30% upon final completion. 1-year workmanship warranty included. Pricing valid for 30 calendar days."
          className={styles.textarea}
        />
      </div>
    </div>
  );
}

