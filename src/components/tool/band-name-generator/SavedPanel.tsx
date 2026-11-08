'use client';

import React, { useState } from 'react';
import styles from './SavedPanel.module.css';

interface SavedPanelProps {
  savedNames: string[];
  onRemove: (name: string) => void;
  onClearAll: () => void;
  onCopySuccess: (msg: string) => void;
}

export default function SavedPanel({
  savedNames,
  onRemove,
  onClearAll,
  onCopySuccess,
}: SavedPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (savedNames.length === 0) return null;

  const handleCopyAll = async () => {
    const text = savedNames.join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      onCopySuccess(`Copied ${savedNames.length} saved names to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onCopySuccess('Failed to copy saved names');
    }
  };

  const handleDownloadTxt = () => {
    const text = `# Saved Band Names\nExported from Band Name Generator\nDate: ${new Date().toLocaleDateString()}\n\n${savedNames.join('\n')}\n`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `band-names-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onCopySuccess('Downloaded saved names as .txt file');
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.headerBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.title}>
          ❤️ Saved Favorites ({savedNames.length})
        </span>
        <span className={styles.arrow} aria-hidden="true">
          {isOpen ? '▴' : '▾'}
        </span>
      </button>

      {isOpen && (
        <div className={styles.body}>
          <div className={styles.toolbar}>
            <button
              type="button"
              onClick={handleCopyAll}
              className={styles.toolBtn}
            >
              {copied ? '✓ Copied' : '⧉ Copy all'}
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className={styles.toolBtn}
            >
              ⬇ Download .txt
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className={styles.clearBtn}
            >
              Clear all
            </button>
          </div>

          <ul className={styles.list}>
            {savedNames.map((name) => (
              <li key={name} className={styles.item}>
                <span className={styles.name}>{name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(name)}
                  className={styles.removeBtn}
                  aria-label={`Remove ${name} from saved`}
                  title="Remove from saved"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
