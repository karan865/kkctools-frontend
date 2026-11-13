import { SITE_URL, ORG_ID } from '@/config/site';

export interface WebApplicationSchemaOptions {
  name: string;
  path: string;
  description: string;
  applicationCategory?: string;
}

export function buildWebApplicationSchema({
  name,
  path,
  description,
  applicationCategory = 'UtilitiesApplication',
}: WebApplicationSchemaOptions) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${cleanPath}`;

  // Remaining shared fields (@id, operatingSystem, dateModified, …) are filled in by
  // normalizeSchema() inside <JsonLd>, so every tool page gets the same template.
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url: canonicalUrl,
    applicationCategory,
    publisher: { '@id': ORG_ID },
    description,
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const cleanPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
      const url = `${SITE_URL}${cleanPath}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: url,
      };
    }),
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

