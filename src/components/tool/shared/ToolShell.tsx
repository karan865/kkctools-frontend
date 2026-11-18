import React from 'react';
import styles from './ToolShell.module.css';

interface ToolShellProps {
  features: string[]; // 3–4 short, TRUE statements about this tool (rules in §4)
  children: React.ReactNode;
  showTrust?: boolean; // default true
}

export default function ToolShell({
  features,
  children,
  showTrust = true,
}: ToolShellProps) {
  return (
    <div className={styles.band}>
      {children}
      <ul className={styles.featureRow} aria-label="Calculator features">
        {features.map((f) => (
          <li key={f} className={styles.featurePill}>
            {f}
          </li>
        ))}
      </ul>
      {showTrust && (
        <p className={styles.trustPill}>
          <span className={styles.trustDot} aria-hidden="true" />
          100% free · No sign-up · Runs in your browser, nothing is uploaded
        </p>
      )}
    </div>
  );
}
