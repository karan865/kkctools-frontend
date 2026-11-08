import React from 'react';
import JsonLd from '@/components/seo/JsonLd';
import styles from './Faq.module.css';

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqProps {
  items: FaqItem[];
  title?: string;
  withSchema?: boolean;
}

export default function Faq({ items, title = 'Frequently Asked Questions', withSchema = true }: FaqProps) {
  const schemaData = withSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      }
    : null;

  return (
    <div className={styles.faqWrapper}>
      {schemaData && <JsonLd data={schemaData} />}
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.list}>
        {items.map((item, idx) => (
          <details key={idx} className={styles.details}>
            <summary className={styles.summary}>
              <span className={styles.questionText}>{item.q}</span>
              <span className={styles.chevron} aria-hidden="true">
                ▾
              </span>
            </summary>
            <div className={styles.answer}>
              <p>{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

