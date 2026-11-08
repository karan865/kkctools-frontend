import React from 'react';
import Link from 'next/link';
import { SITE_URL } from '@/config/site';
import JsonLd from '@/components/seo/JsonLd';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaList = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.name,
      item: `${SITE_URL}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  ];

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: schemaList,
  };

  return (
    <nav aria-label="Breadcrumbs" className={styles.nav}>
      <JsonLd data={jsonLdData} />
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className={styles.item}>
              <span className={styles.separator} aria-hidden="true">
                ›
              </span>
              {isLast ? (
                <span className={styles.current} aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className={styles.link}>
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

