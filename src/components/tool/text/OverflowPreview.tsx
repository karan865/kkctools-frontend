import React from 'react';
import styles from './OverflowPreview.module.css';

/** Shows the text with everything past the limit marked. Renders nothing while the text fits. */
export default function OverflowPreview({ text, start }: { text: string; start: number }) {
  if (start < 0) return null;
  // Long texts: show only the part around the cut.
  const from = Math.max(0, start - 400);
  const to = Math.min(text.length, start + 2000);
  return (
    <div className={styles.box}>
      <div className={styles.title}>Past the limit (highlighted)</div>
      <div className={styles.text}>
        {from > 0 && '… '}
        {text.slice(from, start)}
        <mark className={styles.over}>{text.slice(start, to)}</mark>
        {to < text.length && ' …'}
      </div>
    </div>
  );
}
