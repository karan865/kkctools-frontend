'use client';

import React, { useState, useRef, useId } from 'react';
import styles from './TextInputPanel.module.css';

export interface TextInputPanelProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  sampleText?: string;
  rows?: number;
  showMonospaceToggle?: boolean;
  showFileInput?: boolean;
  showClearButton?: boolean;
  showPasteButton?: boolean;
  showSampleButton?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  ariaDescribedBy?: string;
  className?: string;
}

export default function TextInputPanel({
  value,
  onChange,
  label = 'Enter or paste your text',
  placeholder = 'Type or paste text here to analyze...',
  sampleText = 'Dr. Smith arrived at 3.30 p.m. on Monday. He paid $4.50 for coffee! Was it worth it? J. K. Rowling wrote it... and then she left. Visit example.com/a.b for more.',
  rows = 8,
  showMonospaceToggle = true,
  showFileInput = true,
  showClearButton = true,
  showPasteButton = true,
  showSampleButton = true,
  onFocus,
  onBlur,
  ariaDescribedBy,
  className = '',
}: TextInputPanelProps) {
  const generatedId = useId();
  const inputId = `${generatedId}-textarea`;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMonospace, setIsMonospace] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          onChange(clipText.replace(/\r\n?/g, '\n'));
          showFeedback('Pasted from clipboard');
        }
      } else {
        showFeedback('Press Ctrl + V to paste');
      }
    } catch {
      showFeedback('Clipboard access blocked by browser');
    }
  };

  const handleClear = () => {
    onChange('');
    showFeedback('Cleared');
  };

  const handleSample = () => {
    onChange(sampleText);
    showFeedback('Sample loaded');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onChange(content.replace(/\r\n?/g, '\n')); // textareas use LF, so offsets match
        showFeedback(`Loaded ${file.name}`);
      }
    };
    reader.readAsText(file);
    // Reset file input so re-selecting the same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showFeedback = (msg: string) => {
    setCopiedStatus(msg);
    setTimeout(() => setCopiedStatus(null), 2500);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {/* Header bar with Label and Actions */}
      <div className={styles.headerBar}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>

        <div className={styles.actionsGroup}>
          {showPasteButton && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={handlePaste}
              title="Paste text from clipboard"
            >
              📋 Paste
            </button>
          )}

          {showSampleButton && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={handleSample}
              title="Insert illustrative sample text"
            >
              💡 Sample
            </button>
          )}

          {showFileInput && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                aria-label="Upload local text file"
              />
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => fileInputRef.current?.click()}
                title="Load local text or markdown file"
              >
                📁 Open .txt
              </button>
            </>
          )}

          {showClearButton && value.length > 0 && (
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.clearBtn}`}
              onClick={handleClear}
              title="Clear all text"
            >
              ✕ Clear
            </button>
          )}

          {showMonospaceToggle && (
            <button
              type="button"
              className={`${styles.actionBtn} ${isMonospace ? styles.activeToggle : ''}`}
              onClick={() => setIsMonospace((prev) => !prev)}
              title="Toggle monospace font for code or markdown"
              aria-pressed={isMonospace}
            >
              {isMonospace ? 'abc Sans' : '101 Mono'}
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className={styles.textareaContainer}>
        <textarea
          id={inputId}
          className={`${styles.textarea} ${isMonospace ? styles.monospace : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-describedby={ariaDescribedBy}
          spellCheck="true"
        />
      </div>

      {/* Footer bar with Privacy Notice and Status Feedback */}
      <div className={styles.footerBar}>
        <div className={styles.privacyBadge}>
          <span className={styles.lockIcon} aria-hidden="true">🔒</span>
          <span>Your text stays in this browser. Nothing is uploaded or stored.</span>
        </div>

        {copiedStatus && (
          <div className={styles.feedbackMsg} role="status" aria-live="polite">
            {copiedStatus}
          </div>
        )}
      </div>
    </div>
  );
}
