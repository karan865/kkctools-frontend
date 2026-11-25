import React from 'react';
import styles from './UuidInputGuide.module.css';

interface UuidInputGuideProps {
  tab: 'v4' | 'v7' | 'v5' | 'validate' | 'nil';
  count: number;
  sampleUuid?: string;
}

export default function UuidInputGuide({
  tab,
  count,
  sampleUuid = '017f22e2-79b0-7cc3-98c4-dc0c0c07398f',
}: UuidInputGuideProps) {
  const parts =
    tab === 'v4'
      ? ['550e8400', 'e29b', '41d4', 'a716', '446655440000']
      : sampleUuid.split('-').length === 5
        ? sampleUuid.split('-')
        : ['017f22e2', '79b0', '7cc3', '98c4', 'dc0c0c07398f'];

  const renderDiagram = () => {
    if (tab === 'v5') {
      return (
        <svg
          className={styles.svg}
          viewBox="0 0 560 120"
          role="img"
          aria-labelledby="uuid-v5-title uuid-v5-desc"
        >
          <title id="uuid-v5-title">UUID v5 Name-Based Pipeline</title>
          <desc id="uuid-v5-desc">
            Namespace UUID plus UTF-8 name hashed via SHA-1, truncated to 128 bits with version 5 and variant bits set.
          </desc>
          <rect className={styles.box} x="16" y="30" width="136" height="36" rx="8" />
          <text className={styles.label} x="84" y="52" textAnchor="middle">Namespace + Name</text>
          <text className={styles.subLabel} x="162" y="52">→</text>
          <rect className={styles.boxAccent} x="180" y="30" width="118" height="36" rx="8" />
          <text className={styles.label} x="239" y="52" textAnchor="middle">SHA-1 (160 bit)</text>
          <text className={styles.subLabel} x="308" y="52">→</text>
          <rect className={styles.box} x="326" y="30" width="214" height="36" rx="8" />
          <text className={styles.label} x="433" y="52" textAnchor="middle">First 128 bits (ver 5)</text>
          <text className={styles.subLabel} x="16" y="96">
            Same namespace + same name always produces the exact same deterministic UUID (RFC 9562).
          </text>
        </svg>
      );
    }

    const widths = [104, 62, 62, 62, 138];
    const xs = [16, 132, 206, 280, 354];

    return (
      <svg
        className={styles.svg}
        viewBox="0 0 560 132"
        role="img"
        aria-labelledby="uuid-guide-title uuid-guide-desc"
      >
        <title id="uuid-guide-title">UUID Anatomy Diagram (8-4-4-4-12)</title>
        <desc id="uuid-guide-desc">
          Five hyphen-separated hexadecimal segments totaling 32 hex digits (36 characters, 128 bits).
        </desc>

        <text className={styles.subLabel} x="16" y="20">
          {tab === 'v7'
            ? 'RFC 9562 v7 sample: 48-bit Unix ms timestamp + 12-bit counter + 62-bit random'
            : '1 32 hex digits = 128 bits · 4 Hyphens (36 characters total)'}
        </text>

        <rect className={styles.badgeBg} x="415" y="6" width="128" height="22" rx="11" />
        <text className={styles.badgeText} x="479" y="21" textAnchor="middle">
          {tab === 'v7' ? 'Time-ordered v7' : tab === 'nil' ? 'Nil / Max' : `122 random bits · ×${count}`}
        </text>

        {parts.map((part, idx) => (
          <g key={idx}>
            <rect
              className={
                (tab === 'v7' && idx <= 1) || (tab === 'v4' && (idx === 2 || idx === 3))
                  ? styles.boxAccent
                  : styles.box
              }
              x={xs[idx]}
              y={34}
              width={widths[idx]}
              height={34}
              rx={7}
            />
            <text
              className={styles.label}
              x={xs[idx] + widths[idx] / 2}
              y={55}
              textAnchor="middle"
            >
              {part}
            </text>
            {idx < 4 && (
              <text className={styles.label} x={xs[idx] + widths[idx] + 6} y={55} textAnchor="middle">
                -
              </text>
            )}
          </g>
        ))}

        <text className={styles.subLabel} x="16" y="88">
          {tab === 'v7' ? '5 Timestamp (ms since 1970)' : '8 hex (time/rand)'}
        </text>
        <text className={styles.subLabel} x="206" y="88">
          {tab === 'v7' ? 'Ver 7 + 6 Counter' : '2 Version (M)'}
        </text>
        <text className={styles.subLabel} x="310" y="88">
          3 Variant (8, 9, a, b)
        </text>
        <text className={styles.subLabel} x="16" y="112">
          7 How many: {count} · 8 Format &amp; encoding options below
        </text>
      </svg>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.desktopOnly}>{renderDiagram()}</div>
      <details className={styles.mobileDetails}>
        <summary className={styles.mobileSummary}>
          UUID anatomy (8-4-4-4-12 · 128 bits)
        </summary>
        {renderDiagram()}
      </details>
    </div>
  );
}
