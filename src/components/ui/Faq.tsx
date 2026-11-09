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
              <svg
                className={styles.chevron}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
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

