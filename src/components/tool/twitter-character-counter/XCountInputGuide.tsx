import React from 'react';
import styles from './XCountInputGuide.module.css';

interface XCountInputGuideProps {
  activeTab: 'xpost' | 'instagram' | 'thread' | 'other';
  xWeighted?: number;
  charsLeft?: number;
  hashtagsCount?: number;
  mentionsCount?: number;
  threadCount?: number;
  focusedField?: string | null;
}

export default function XCountInputGuide({
  activeTab,
  xWeighted = 16,
  charsLeft = 264,
  hashtagsCount = 0,
  mentionsCount = 0,
  threadCount = 1,
  focusedField,
}: XCountInputGuideProps) {
  const isPostFocused = focusedField === 'post';

  const renderContent = () => (
    <svg
      className={styles.svg}
      viewBox="0 0 640 160"
      role="img"
      aria-label="Visual guide to X weighted character counting, Instagram limits, and thread splitting"
    >
      <title>X Weighted Counting &amp; Social Media Rules Guide</title>
      <desc>
        Explains how X weights text: letters and spaces count as 1, all emoji count as 2, and any web URL counts as 23.
      </desc>

      {/* Card Background */}
      <rect className={styles.cardBg} x="4" y="4" width="632" height="152" rx="10" />

      {activeTab === 'instagram' ? (
        // Instagram Tab
        <g transform="translate(18, 14)">
          <text className={styles.calloutText} x="15" y="18">
            <tspan className={styles.calloutNum}>1 Caption: </tspan>
            Max 2,200 characters (Meta Graph API)
          </text>
          <text className={styles.calloutText} x="260" y="18">
            <tspan className={styles.calloutNum}>2 Hashtags: </tspan>
            Max 30 hashtags per post
          </text>
          <text className={styles.calloutText} x="460" y="18">
            <tspan className={styles.calloutNum}>3 Mentions: </tspan>
            Max 20 @ accounts
          </text>

          {/* Caption Box */}
          <g transform="translate(15, 34)">
            <rect className={isPostFocused ? styles.segmentBoxActive : styles.segmentBox} width="220" height="52" />
            <text className={styles.segTitle} x="12" y="24">
              Caption Preview
            </text>
            <text className={styles.segMeta} x="12" y="42">
              Cut marker &quot;...more&quot; at ≈ 125 chars
            </text>
          </g>

          {/* Hashtag Box */}
          <g transform="translate(250, 34)">
            <rect className={styles.segmentBox} width="180" height="52" />
            <text className={styles.segTitle} x="12" y="24">
              Hashtags: {hashtagsCount} / 30
            </text>
            <text className={styles.segMeta} x="12" y="42">
              {30 - hashtagsCount} remaining tags
            </text>
          </g>

          {/* Mentions Box */}
          <g transform="translate(445, 34)">
            <rect className={styles.badgeBg} width="165" height="52" rx="6" />
            <text className={styles.badgeTitle} x="12" y="24">
              Accounts: {mentionsCount} / 20
            </text>
            <text className={styles.badgeVal} x="12" y="42">
              {20 - mentionsCount} tags left
            </text>
          </g>

          <text className={styles.calloutText} x="15" y="125">
            Rule: Caption counts in standard Unicode characters with spaces. The &quot;...more&quot; fold occurs around 125 characters.
          </text>
        </g>
      ) : activeTab === 'thread' ? (
        // Thread Tab
        <g transform="translate(18, 14)">
          <text className={styles.calloutText} x="15" y="18">
            <tspan className={styles.calloutNum}>1 Split Rules: </tspan>
            Sentences, then words
          </text>
          <text className={styles.calloutText} x="280" y="18">
            <tspan className={styles.calloutNum}>2 Numbering: </tspan>
            Adds &quot; 1/n&quot;
          </text>
          <text className={styles.calloutText} x="480" y="18">
            <tspan className={styles.calloutNum}>3 Total Posts: </tspan>
            {threadCount} {threadCount === 1 ? 'post' : 'posts'}
          </text>

          {/* Post 1 Card */}
          <g transform="translate(15, 34)">
            <rect className={styles.segmentBox} width="185" height="52" />
            <text className={styles.segTitle} x="12" y="24">
              Post 1/{Math.max(2, threadCount)}
            </text>
            <text className={styles.segMeta} x="12" y="42">
              ≤ 280 weighted characters
            </text>
          </g>

          {/* Post 2 Card */}
          <g transform="translate(215, 34)">
            <rect className={styles.segmentBox} width="185" height="52" />
            <text className={styles.segTitle} x="12" y="24">
              Post 2/{Math.max(2, threadCount)}
            </text>
            <text className={styles.segMeta} x="12" y="42">
              Suffix included in limit
            </text>
          </g>

          {/* Post 3 Badge */}
          <g transform="translate(415, 34)">
            <rect className={styles.badgeBg} width="195" height="52" rx="6" />
            <text className={styles.badgeTitle} x="12" y="24">
              Ready to Share
            </text>
            <text className={styles.badgeVal} x="12" y="42">
              Copy button per post
            </text>
          </g>

          <text className={styles.calloutText} x="15" y="125">
            Invariants: No post exceeds 280 weighted characters; URLs and emoji are never split mid-symbol.
          </text>
        </g>
      ) : activeTab === 'other' ? (
        // Other Platforms Tab
        <g transform="translate(18, 14)">
          <text className={styles.calloutText} x="15" y="18">
            <tspan className={styles.calloutNum}>1 Threads: </tspan>
            500 chars (Verified Meta)
          </text>
          <text className={styles.calloutText} x="200" y="18">
            <tspan className={styles.calloutNum}>2 LinkedIn: </tspan>
            3,000 chars (Verified)
          </text>
          <text className={styles.calloutText} x="380" y="18">
            <tspan className={styles.calloutNum}>3 YouTube: </tspan>
            100 title · 5,000 desc
          </text>

          <g transform="translate(15, 34)">
            <rect className={styles.segmentBox} width="170" height="52" />
            <text className={styles.segTitle} x="12" y="24">
              Threads (500)
            </text>
            <text className={styles.segMeta} x="12" y="42">
              Checked 2026-11-22
            </text>
          </g>

          <g transform="translate(195, 34)">
            <rect className={styles.segmentBox} width="170" height="52" />
            <text className={styles.segTitle} x="12" y="24">
              LinkedIn (3,000)
            </text>
            <text className={styles.segMeta} x="12" y="42">
              Checked 2026-11-22
            </text>
          </g>

          <g transform="translate(375, 34)">
            <rect className={styles.badgeBg} width="235" height="52" rx="6" />
            <text className={styles.badgeTitle} x="12" y="24">
              YouTube Title &amp; Desc
            </text>
            <text className={styles.badgeVal} x="12" y="42">
              100 title / 5,000 description
            </text>
          </g>

          <text className={styles.calloutText} x="15" y="125">
            Verified developer documentation limits. Unverified presets carry an explicit warning banner.
          </text>
        </g>
      ) : (
        // Default Tab: X Post
        <g transform="translate(18, 14)">
          {/* Callouts */}
          <text className={styles.calloutText} x="15" y="18">
            <tspan className={styles.calloutNum}>1 Letters/Spaces: </tspan>
            Weight = 1
          </text>
          <text className={styles.calloutText} x="230" y="18">
            <tspan className={styles.calloutNum}>2 Emoji: </tspan>
            All Emoji Weight = 2
          </text>
          <text className={styles.calloutText} x="420" y="18">
            <tspan className={styles.calloutNum}>3 Any Web Link: </tspan>
            Fixed Weight = 23
          </text>

          {/* Segment 1: Hello, world! */}
          <g transform="translate(15, 34)">
            <rect className={isPostFocused ? styles.segmentBoxActive : styles.segmentBox} width="175" height="52" />
            <text className={styles.segTitle} x="12" y="24">
              &quot;Hello, world! &quot;
            </text>
            <text className={styles.segMeta} x="12" y="42">
              14 chars × weight 1 = 14
            </text>
          </g>

          {/* Segment 2: Emoji 👋 */}
          <g transform="translate(200, 34)">
            <rect className={styles.segmentBox} width="105" height="52" />
            <text className={styles.segTitle} x="12" y="24">
              👋 (Emoji)
            </text>
            <text className={styles.segMeta} x="12" y="42">
              Weight = 2
            </text>
          </g>

          {/* Segment 3: URL */}
          <g transform="translate(315, 34)">
            <rect className={styles.segmentBox} width="165" height="52" />
            <text className={styles.segTitle} x="12" y="24">
              https://example...
            </text>
            <text className={styles.segMeta} x="12" y="42">
              Fixed Weight = 23
            </text>
          </g>

          {/* Total Badge */}
          <g transform="translate(490, 32)">
            <rect className={styles.badgeBg} width="125" height="56" rx="8" />
            <text className={styles.badgeTitle} x="62" y="20" textAnchor="middle">
              Total Weight
            </text>
            <text className={styles.badgeVal} x="62" y="42" textAnchor="middle">
              {xWeighted} / 280 ({charsLeft >= 0 ? `${charsLeft} left` : `${Math.abs(charsLeft)} over`})
            </text>
          </g>

          <text className={styles.calloutText} x="15" y="125">
            Worked example: &quot;Hello, world! 👋&quot; counts as 16 weighted characters (14 letters/spaces + 2 for the emoji).
          </text>
        </g>
      )}
    </svg>
  );

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.summaryBadge}>
        <span className={styles.icon}>🐦</span>
        <span>Interactive Diagram: How X weights characters, links, and emoji</span>
      </div>

      <div className={`${styles.diagramCard} ${styles.desktopOnly}`}>{renderContent()}</div>

      <details className={`${styles.diagramCard} ${styles.mobileDetails}`}>
        <summary>View X-weighting breakdown diagram</summary>
        <div style={{ marginTop: '12px' }}>{renderContent()}</div>
      </details>
    </div>
  );
}
