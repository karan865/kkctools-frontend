import React from 'react';
import styles from './PasswordInputGuide.module.css';

interface PasswordInputGuideProps {
  tab: 'password' | 'pin' | 'wifi' | 'bulk';
  length: number;
  entropyBits: number;
  excludeLookAlikes: boolean;
  requireEach: boolean;
  bulkCount: number;
  focusedField: string | null;
}

export default function PasswordInputGuide({
  tab,
  length,
  entropyBits,
  excludeLookAlikes,
  requireEach,
  bulkCount,
  focusedField,
}: PasswordInputGuideProps) {
  const renderDiagram = () => {
    if (tab === 'pin') {
      const boxCount = Math.min(length, 12);
      const startX = 30;
      const boxW = 30;
      const gap = 8;
      return (
        <svg
          className={styles.svg}
          viewBox="0 0 560 120"
          role="img"
          aria-labelledby="pin-guide-title pin-guide-desc"
        >
          <title id="pin-guide-title">PIN Structure Diagram</title>
          <desc id="pin-guide-desc">
            Masked {length}-digit numeric PIN diagram showing {entropyBits.toFixed(1)} bits of entropy.
          </desc>
          <text className={styles.label} x="30" y="24">
            1 PIN Length ({length} digits)
          </text>
          {Array.from({ length: boxCount }).map((_, idx) => (
            <g key={idx}>
              <rect
                className={focusedField === 'pinLength' ? styles.boxAccent : styles.box}
                x={startX + idx * (boxW + gap)}
                y={36}
                width={boxW}
                height={34}
                rx={6}
              />
              <text
                className={styles.label}
                x={startX + idx * (boxW + gap) + boxW / 2}
                y={57}
                textAnchor="middle"
              >
                •
              </text>
            </g>
          ))}
          <text className={styles.subLabel} x="30" y="96">
            Digits 0–9 only · Avoid 1234 or birth years
          </text>
          <rect className={styles.badgeBg} x="415" y="40" width="120" height="26" rx="13" />
          <text className={styles.badgeText} x="475" y="57" textAnchor="middle">
            ≈ {entropyBits.toFixed(1)} bits
          </text>
        </svg>
      );
    }

    if (tab === 'wifi') {
      return (
        <svg
          className={styles.svg}
          viewBox="0 0 560 120"
          role="img"
          aria-labelledby="wifi-guide-title wifi-guide-desc"
        >
          <title id="wifi-guide-title">Wi-Fi Passphrase Diagram</title>
          <desc id="wifi-guide-desc">
            WPA2 Wi-Fi passphrase diagram supporting 8 to 63 printable ASCII characters.
          </desc>
          <rect className={styles.boxAccent} x="24" y="24" width="64" height="54" rx="10" />
          <path
            d="M42 56 A18 18 0 0 1 70 56 M48 62 A10 10 0 0 1 64 62"
            fill="none"
            stroke="var(--cat-developer)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="56" cy="68" r="2.5" fill="var(--cat-developer)" />
          <text className={styles.label} x="104" y="40">
            1 WPA2 Length: {length} chars (8–63 allowed)
          </text>
          <text className={styles.subLabel} x="104" y="60">
            2 Printable ASCII · Look-alikes {excludeLookAlikes ? 'excluded' : 'allowed'}
          </text>
          <text className={styles.subLabel} x="104" y="80">
            Sample mask: ••••-••••-••••-•••• (never displays real output)
          </text>
          <rect className={styles.badgeBg} x="415" y="34" width="120" height="26" rx="13" />
          <text className={styles.badgeText} x="475" y="51" textAnchor="middle">
            ≈ {entropyBits.toFixed(1)} bits
          </text>
        </svg>
      );
    }

    if (tab === 'bulk') {
      return (
        <svg
          className={styles.svg}
          viewBox="0 0 560 120"
          role="img"
          aria-labelledby="bulk-guide-title bulk-guide-desc"
        >
          <title id="bulk-guide-title">Bulk Password Batch Diagram</title>
          <desc id="bulk-guide-desc">
            Stack of {bulkCount} independent Web Crypto passwords of length {length}.
          </desc>
          {[0, 1, 2].map((row) => (
            <g key={row}>
              <rect
                className={row === 0 ? styles.boxAccent : styles.box}
                x={28 + row * 6}
                y={22 + row * 16}
                width={310}
                height={26}
                rx={6}
              />
              <text className={styles.subLabel} x={42 + row * 6} y={39 + row * 16}>
                #{row + 1} ••••••••••••••••
              </text>
            </g>
          ))}
          <text className={styles.label} x="365" y="42">
            1 Batch: × {bulkCount} passwords
          </text>
          <text className={styles.subLabel} x="365" y="62">
            2 Each {length} chars · Independent CSPRNG draws
          </text>
          <rect className={styles.badgeBg} x="365" y="76" width="140" height="26" rx="13" />
          <text className={styles.badgeText} x="435" y="93" textAnchor="middle">
            ≈ {entropyBits.toFixed(1)} bits each
          </text>
        </svg>
      );
    }

    // Default Password tab: masked 16-box sample pattern (never real output)
    const sampleChars = ['A', 'a', '9', '#', '•', '•', '•', '•', '•', '•', '•', '•'];
    return (
      <svg
        className={styles.svg}
        viewBox="0 0 560 132"
        role="img"
        aria-labelledby="pw-guide-title pw-guide-desc"
      >
        <title id="pw-guide-title">Password Structure and Rules Diagram</title>
        <desc id="pw-guide-desc">
          Masked sample layout showing length {length}, character sets, look-alike exclusion, and {entropyBits.toFixed(1)} bits.
        </desc>

        <text className={styles.label} x="20" y="22">
          1 Length ({length})
        </text>
        <rect className={styles.badgeBg} x="415" y="8" width="125" height="24" rx="12" />
        <text className={styles.badgeText} x="477" y="24" textAnchor="middle">
          ≈ {entropyBits.toFixed(1)} bits
        </text>

        {sampleChars.map((ch, idx) => (
          <g key={idx}>
            <rect
              className={
                idx < 4 && focusedField === 'sets'
                  ? styles.boxAccent
                  : idx >= 10 && excludeLookAlikes
                    ? styles.boxStrike
                    : styles.box
              }
              x={20 + idx * 43}
              y={34}
              width={36}
              height={34}
              rx={6}
            />
            <text className={styles.label} x={38 + idx * 43} y={55} textAnchor="middle">
              {ch}
            </text>
          </g>
        ))}

        <text className={styles.subLabel} x="20" y="90">
          2 Sets: A–Z · a–z · 0–9 · symbols
        </text>
        <text className={styles.subLabel} x="240" y="90">
          3 Exclude look-alikes (O 0 I l 1): {excludeLookAlikes ? 'ON' : 'OFF'}
        </text>
        <text className={styles.subLabel} x="20" y="112">
          4 At least one of each: {requireEach ? 'ON (uniform redraw)' : 'OFF'} · Masked preview only
        </text>
      </svg>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.desktopOnly}>{renderDiagram()}</div>
      <details className={styles.mobileDetails}>
        <summary className={styles.mobileSummary}>
          Visual guide ({length} chars · ≈ {entropyBits.toFixed(1)} bits)
        </summary>
        {renderDiagram()}
      </details>
    </div>
  );
}
