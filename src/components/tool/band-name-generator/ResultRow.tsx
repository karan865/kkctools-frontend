'use client';

import React, { useState } from 'react';
import CheckMenu from './CheckMenu';
import styles from './ResultRow.module.css';

interface ResultRowProps {
  index: number;
  name: string;
  isSaved: boolean;
  onToggleSave: (name: string) => void;
  onCopySuccess: (msg: string) => void;
}

export default function ResultRow({
  index,
  name,
  isSaved,
  onToggleSave,
  onCopySuccess,
}: ResultRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(name);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = name;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      onCopySuccess(`Copied "${name}" to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onCopySuccess('Failed to copy');
    }
  };

  return (
    <li
      className={styles.row}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className={styles.left}>
        <span className={styles.indexNumber} aria-hidden="true">
          {index + 1}
        </span>
        <span className={styles.bandName}>{name}</span>
      </div>

      <div className={styles.actions}>
        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`${styles.actionBtn} ${copied ? styles.copiedBtn : ''}`}
          aria-label={copied ? `Copied ${name}` : `Copy ${name}`}
          title="Copy name"
        >
          {copied ? (
            <span className={styles.copiedText}>Copied</span>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>

        {/* Save / Favorite Heart Button */}
        <button
          type="button"
          onClick={() => onToggleSave(name)}
          className={`${styles.actionBtn} ${isSaved ? styles.savedBtn : ''}`}
          aria-label={isSaved ? `Remove ${name} from saved` : `Save ${name} to favorites`}
          title={isSaved ? 'Saved to favorites' : 'Save to favorites'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Check Availability Menu Button */}
        <div className={styles.menuWrapper}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`${styles.actionBtn} ${menuOpen ? styles.activeMenuBtn : ''}`}
            aria-label={`Check availability search for ${name}`}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            title="Check name on Google, Spotify, Bandcamp"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <CheckMenu name={name} isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
      </div>
    </li>
  );
}
