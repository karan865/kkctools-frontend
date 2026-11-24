'use client';

import React from 'react';
import styles from './ReadingTimeInputGuide.module.css';

interface ReadingTimeInputGuideProps {
  focusedField: string | null;
  activeTab: 'wordsToTime' | 'speechLength' | 'pasteText' | 'practiceTimer' | 'measurePace';
  words?: number;
  minutes?: number;
  silentTime?: string;
  aloudTime?: string;
  presentationTime?: string;
  slowTime?: string;
  pauseBuffer?: number;
}

export default function ReadingTimeInputGuide({
  focusedField,
  activeTab,
  words = 1000,
  minutes = 5,
  silentTime = '4:12',
  aloudTime = '5:28',
  presentationTime = '7:42',
  slowTime = '9:05',
  pauseBuffer = 0,
}: ReadingTimeInputGuideProps) {
  const isSpeech = activeTab === 'speechLength';
  const isTimer = activeTab === 'practiceTimer';
  const isMeasure = activeTab === 'measurePace';

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.summaryBadge}>
        <span className={styles.icon}>⏱️</span>
        <span>
          {isSpeech
            ? 'Speech Guide: Minutes Target → Words Needed at 4 Speaking Speeds'
            : isTimer
            ? 'Rehearsal Guide: Pace Ring & Stopwatch Timing'
            : isMeasure
            ? 'Calibration Guide: Read Sample Passage to Gauge Your WPM'
            : 'Visual Guide: Word Count Routed Through 4 Standard Paces'}
        </span>
      </div>

      <div className={styles.diagramCard}>
        <svg
          viewBox="0 0 680 180"
          className={styles.svg}
          role="img"
          aria-labelledby="reading-guide-title reading-guide-desc"
        >
          <title id="reading-guide-title">Reading &amp; Speaking Time Flow Diagram</title>
          <desc id="reading-guide-desc">
            Visual breakdown mapping word counts to silent reading, reading aloud, presentation, and slow speech rates with buffer adjustments.
          </desc>

          <rect x="10" y="10" width="660" height="160" rx="12" className={styles.cardBg} />

          {!isSpeech && !isTimer && !isMeasure && (
            <>
              {/* Left Document Node (Word Count) */}
              <g>
                <rect
                  x="30"
                  y="30"
                  width="130"
                  height="120"
                  rx="8"
                  className={focusedField === 'words' ? styles.docOutlineActive : styles.docOutline}
                />
                <circle cx="45" cy="45" r="9" className={styles.calloutCircle} />
                <text x="45" y="45" className={styles.calloutText}>1</text>
                <text x="62" y="48" className={styles.textPrimary}>Script / Text</text>
                
                <text x="95" y="85" textAnchor="middle" className={styles.textAccent}>{words.toLocaleString('en-US')}</text>
                <text x="95" y="100" textAnchor="middle" className={styles.textSecondary}>Words</text>
                
                {pauseBuffer > 0 && (
                  <g>
                    <rect x="42" y="115" width="106" height="22" rx="4" className={styles.badgeBg} />
                    <text x="95" y="129" textAnchor="middle" className={styles.textSecondary}>
                      +{pauseBuffer}% buffer
                    </text>
                  </g>
                )}
              </g>

              {/* Connecting Dashed Arrows */}
              <path d="M 160 55 L 210 50" className={styles.arrow} />
              <path d="M 160 75 L 210 80" className={styles.arrow} />
              <path d="M 160 105 L 210 110" className={styles.arrow} />
              <path d="M 160 125 L 210 140" className={styles.arrow} />

              {/* Lane 1: Silent Reading */}
              <g>
                <rect
                  x="215"
                  y="24"
                  width="210"
                  height="30"
                  rx="6"
                  className={focusedField === 'silent' ? styles.laneBgActive : styles.laneBg}
                />
                <circle cx="228" cy="39" r="7" className={styles.calloutCircle} />
                <text x="228" y="39" className={styles.calloutText}>2</text>
                <text x="242" y="42" className={styles.textPrimary}>Silent Reading (238 wpm)</text>
                <text x="410" y="42" textAnchor="end" className={styles.textAccent}>{silentTime}</text>
              </g>

              {/* Lane 2: Reading Aloud */}
              <g>
                <rect
                  x="215"
                  y="58"
                  width="210"
                  height="30"
                  rx="6"
                  className={focusedField === 'aloud' ? styles.laneBgActive : styles.laneBg}
                />
                <circle cx="228" cy="73" r="7" className={styles.calloutCircle} />
                <text x="228" y="73" className={styles.calloutText}>3</text>
                <text x="242" y="76" className={styles.textPrimary}>Reading Aloud (183 wpm)</text>
                <text x="410" y="76" textAnchor="end" className={styles.textAccent}>{aloudTime}</text>
              </g>

              {/* Lane 3: Presentation */}
              <g>
                <rect
                  x="215"
                  y="92"
                  width="210"
                  height="30"
                  rx="6"
                  className={focusedField === 'presentation' ? styles.laneBgActive : styles.laneBg}
                />
                <circle cx="228" cy="107" r="7" className={styles.calloutCircle} />
                <text x="228" y="107" className={styles.calloutText}>4</text>
                <text x="242" y="110" className={styles.textPrimary}>Presentation (130 wpm)</text>
                <text x="410" y="110" textAnchor="end" className={styles.textAccent}>{presentationTime}</text>
              </g>

              {/* Lane 4: Slow Speech */}
              <g>
                <rect
                  x="215"
                  y="126"
                  width="210"
                  height="30"
                  rx="6"
                  className={focusedField === 'slow' ? styles.laneBgActive : styles.laneBg}
                />
                <circle cx="228" cy="141" r="7" className={styles.calloutCircle} />
                <text x="228" y="141" className={styles.calloutText}>5</text>
                <text x="242" y="144" className={styles.textPrimary}>Slow / Formal (110 wpm)</text>
                <text x="410" y="144" textAnchor="end" className={styles.textAccent}>{slowTime}</text>
              </g>

              {/* Right Summary Card */}
              <g>
                <rect x="445" y="24" width="205" height="132" rx="8" className={styles.docOutline} />
                <circle cx="462" cy="42" r="7" className={styles.calloutCircle} />
                <text x="462" y="42" className={styles.calloutText}>6</text>
                <text x="475" y="45" className={styles.textPrimary}>Speaker Planning</text>
                
                <text x="460" y="72" className={styles.textSecondary}>• Presentation: {presentationTime}</text>
                <text x="460" y="92" className={styles.textSecondary}>• Aloud pace: {aloudTime}</text>
                <text x="460" y="112" className={styles.textSecondary}>• Silent read: {silentTime}</text>
                <text x="460" y="132" className={styles.textSecondary}>• Pause buffer: {pauseBuffer}%</text>
              </g>
            </>
          )}

          {isSpeech && (
            <>
              {/* Minutes Node */}
              <g>
                <rect x="50" y="35" width="160" height="110" rx="8" className={styles.docOutlineActive} />
                <circle cx="68" cy="50" r="9" className={styles.calloutCircle} />
                <text x="68" y="50" className={styles.calloutText}>1</text>
                <text x="85" y="54" className={styles.textPrimary}>Speech Duration</text>
                <text x="130" y="92" textAnchor="middle" className={styles.textAccent}>{minutes} Min</text>
                <text x="130" y="112" textAnchor="middle" className={styles.textSecondary}>Target Allotment</text>
              </g>

              <path d="M 210 90 L 260 90" className={styles.arrow} />

              {/* Words Yield Cards */}
              <g>
                <rect x="270" y="28" width="180" height="52" rx="6" className={styles.laneBgActive} />
                <text x="285" y="48" className={styles.textPrimary}>Presentation (130 wpm)</text>
                <text x="285" y="68" className={styles.textAccent}>{minutes * 130} words</text>
              </g>

              <g>
                <rect x="270" y="96" width="180" height="52" rx="6" className={styles.laneBg} />
                <text x="285" y="116" className={styles.textPrimary}>Slow Pace (110 wpm)</text>
                <text x="285" y="136" className={styles.textAccent}>{minutes * 110} words</text>
              </g>

              <g>
                <rect x="465" y="28" width="180" height="52" rx="6" className={styles.laneBg} />
                <text x="480" y="48" className={styles.textPrimary}>Conversational (150 wpm)</text>
                <text x="480" y="68" className={styles.textAccent}>{minutes * 150} words</text>
              </g>

              <g>
                <rect x="465" y="96" width="180" height="52" rx="6" className={styles.laneBg} />
                <text x="480" y="116" className={styles.textPrimary}>Reading Aloud (183 wpm)</text>
                <text x="480" y="136" className={styles.textAccent}>{minutes * 183} words</text>
              </g>
            </>
          )}

          {isTimer && (
            <>
              {/* Timer Dial View */}
              <g>
                <circle cx="160" cy="90" r="55" fill="none" stroke="var(--line)" strokeWidth="8" />
                <circle
                  cx="160"
                  cy="90"
                  r="55"
                  fill="none"
                  stroke="var(--cat-writing)"
                  strokeWidth="8"
                  strokeDasharray="220 345"
                  transform="rotate(-90 160 90)"
                />
                <text x="160" y="85" textAnchor="middle" className={styles.textAccent}>Rehearse</text>
                <text x="160" y="105" textAnchor="middle" className={styles.textSecondary}>Space = Pause</text>
              </g>

              <g>
                <rect x="250" y="35" width="380" height="110" rx="8" className={styles.docOutline} />
                <text x="275" y="65" className={styles.textPrimary}>Practice Timer Protocol</text>
                <text x="275" y="88" className={styles.textSecondary}>• Deliver aloud at natural pacing with intentional pauses</text>
                <text x="275" y="108" className={styles.textSecondary}>• Press Spacebar to pause for slides or questions</text>
                <text x="275" y="128" className={styles.textSecondary}>• Overrun alert triggers if delivery exceeds scheduled window</text>
              </g>
            </>
          )}

          {isMeasure && (
            <>
              <g>
                <rect x="40" y="35" width="220" height="110" rx="8" className={styles.docOutlineActive} />
                <text x="58" y="65" className={styles.textPrimary}>Measure Personal WPM</text>
                <text x="58" y="88" className={styles.textSecondary}>1. Click &quot;Start Reading&quot;</text>
                <text x="58" y="108" className={styles.textSecondary}>2. Read sample at your normal tempo</text>
                <text x="58" y="128" className={styles.textSecondary}>3. Click &quot;I&apos;m Done&quot; to calibrate</text>
              </g>
              <g>
                <rect x="280" y="35" width="360" height="110" rx="8" className={styles.docOutline} />
                <text x="305" y="65" className={styles.textPrimary}>Why Personal Speed Beats Benchmarks</text>
                <text x="305" y="88" className={styles.textSecondary}>Average rates (238 reading, 130 speaking) are broad statistical medians.</text>
                <text x="305" y="108" className={styles.textSecondary}>Your own measured pace tailors every page estimate to your exact delivery style.</text>
              </g>
            </>
          )}
        </svg>
      </div>

      <details className={styles.mobileDetails}>
        <summary>Reading &amp; Speaking Time Guide Breakdown</summary>
        <ul className={styles.mobileList}>
          <li><strong>1. Word Count:</strong> Script or document length.</li>
          <li><strong>2. Silent Reading (238 wpm):</strong> Non-fiction skimming &amp; comprehension speed.</li>
          <li><strong>3. Reading Aloud (183 wpm):</strong> Clear, spoken narration tempo.</li>
          <li><strong>4. Presentation (130 wpm):</strong> Public speaking with emphasis &amp; eye contact.</li>
          <li><strong>5. Slow / Formal (110 wpm):</strong> Academic keynote or complex instruction tempo.</li>
          <li><strong>6. Buffer:</strong> Pause percentage and slide transition allowances.</li>
        </ul>
      </details>
    </div>
  );
}
