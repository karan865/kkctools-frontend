import React from 'react';
import styles from './StrengthInputGuide.module.css';

interface StrengthInputGuideProps {
  tab: 'check' | 'breakdown' | 'scenarios';
}

export default function StrengthInputGuide({ tab }: StrengthInputGuideProps) {
  const renderDiagram = () => {
    if (tab === 'scenarios') {
      const dials = [
        { label: 'Online throttled', rate: '100 / hr' },
        { label: 'Online unthrottled', rate: '10 / sec' },
        { label: 'Offline slow hash', rate: '10,000 / sec' },
        { label: 'Offline fast hash', rate: '100B / sec' },
      ];
      return (
        <svg
          className={styles.svg}
          viewBox="0 0 560 120"
          role="img"
          aria-labelledby="scen-guide-title scen-guide-desc"
        >
          <title id="scen-guide-title">Attack Scenario Rate Dials</title>
          <desc id="scen-guide-desc">
            Four attack speed assumptions ranging from 100 guesses per hour to 100 billion guesses per second.
          </desc>
          {dials.map((d, idx) => (
            <g key={d.label}>
              <rect
                className={styles.boxNeutral}
                x={16 + idx * 134}
                y={22}
                width={124}
                height={74}
                rx={10}
              />
              <text className={styles.subLabel} x={78 + idx * 134} y={46} textAnchor="middle">
                {d.label}
              </text>
              <text className={styles.label} x={78 + idx * 134} y={72} textAnchor="middle">
                {d.rate}
              </text>
            </g>
          ))}
        </svg>
      );
    }

    return (
      <svg
        className={styles.svg}
        viewBox="0 0 560 132"
        role="img"
        aria-labelledby="str-guide-title str-guide-desc"
      >
        <title id="str-guide-title">Sample Pattern Breakdown Diagram</title>
        <desc id="str-guide-desc">
          Static example Summer2026! split into dictionary word, year, and single symbol segments.
        </desc>

        <text className={styles.subLabel} x="20" y="20">
          Sample pattern only (never shows your input):
        </text>

        {/* Segment 1: Summer */}
        <rect className={styles.boxWarn} x="20" y="30" width="150" height="38" rx="8" />
        <text className={styles.label} x="95" y="53" textAnchor="middle">
          Summer
        </text>
        <text className={styles.subLabel} x="95" y="84" textAnchor="middle">
          1 Common word + cap
        </text>
        {tab === 'breakdown' && (
          <text className={styles.subLabel} x="95" y="102" textAnchor="middle">
            ~156 guesses
          </text>
        )}

        {/* Segment 2: 2026 */}
        <rect className={styles.boxMid} x="184" y="30" width="110" height="38" rx="8" />
        <text className={styles.label} x="239" y="53" textAnchor="middle">
          2026
        </text>
        <text className={styles.subLabel} x="239" y="84" textAnchor="middle">
          2 Year (1900–2099)
        </text>
        {tab === 'breakdown' && (
          <text className={styles.subLabel} x="239" y="102" textAnchor="middle">
            ~200 guesses
          </text>
        )}

        {/* Segment 3: ! */}
        <rect className={styles.boxNeutral} x="308" y="30" width="56" height="38" rx="8" />
        <text className={styles.label} x="336" y="53" textAnchor="middle">
          !
        </text>
        <text className={styles.subLabel} x="336" y="84" textAnchor="middle">
          3 Symbol
        </text>
        {tab === 'breakdown' && (
          <text className={styles.subLabel} x="336" y="102" textAnchor="middle">
            32 guesses
          </text>
        )}

        {/* Callout 4 */}
        <rect className={styles.badgeBg} x="384" y="34" width="156" height="30" rx="15" />
        <text className={styles.badgeText} x="462" y="53" textAnchor="middle">
          4 Time depends on attack
        </text>
        <text className={styles.subLabel} x="20" y="122">
          1 Words people use are guessed first · 2 Years are short lists · 3 One symbol adds little
        </text>
      </svg>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.desktopOnly}>{renderDiagram()}</div>
      <details className={styles.mobileDetails}>
        <summary className={styles.mobileSummary}>
          How patterns are split (example: Summer2026!)
        </summary>
        {renderDiagram()}
      </details>
    </div>
  );
}
