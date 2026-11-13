import { SITE_NAME, SITE_URL, ORG_ID, WEBSITE_ID, DEFAULT_OG_IMAGE_URL } from '@/config/site';
import { INDEXABLE_ROUTES } from '@/lib/routes';

/**
 * One shared schema template for every page.
 *
 * Pages still hand-write their JSON-LD objects; this pass makes them consistent and
 * connects them into one graph:
 *  - WebSite / Organization are referenced by @id (defined once in the root layout)
 *  - a bare duplicate Organization (e.g. on /about/) is dropped
 *  - WebApplication gets @id, the same OS / category / browser fields, and dateModified
 *  - each WebApplication / Article gets a WebPage node that ties app, breadcrumb and site together
 *  - BreadcrumbList gets an @id and the same parent label ("Tools") everywhere
 *  - Article gets full ISO dates, an image, and author / publisher references
 */

type Node = Record<string, unknown>;

const ORG_REF = { '@id': ORG_ID };
const TOOLS_URL = `${SITE_URL}/tools/`;

function routeFor(url: string) {
  const path = url.replace(SITE_URL, '') || '/';
  return INDEXABLE_ROUTES.find((r) => r.path === path);
}

function isoDate(value: unknown): unknown {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00+00:00`;
  }
  return value;
}

function isSiteOrg(value: unknown): boolean {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as Node)['@type'] === 'Organization' &&
    (value as Node).name === SITE_NAME
  );
}

function webPageFor(url: string, name: unknown, mainEntityId: string, dateModified: unknown): Node {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    inLanguage: 'en-US',
    isPartOf: { '@id': WEBSITE_ID },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    mainEntity: { '@id': mainEntityId },
    ...(dateModified ? { dateModified } : {}),
  };
}

function normalizeNode(input: Node): Node[] {
  const node: Node = { ...input };
  const type = node['@type'];

  // The site Organization lives in the root layout; never repeat it on a page.
  if (isSiteOrg(node) && !node['@id']) return [];

  if (isSiteOrg(node.publisher)) node.publisher = ORG_REF;
  if (isSiteOrg(node.author)) node.author = ORG_REF;

  if (type === 'WebApplication' && typeof node.url === 'string') {
    const url = node.url;
    const route = routeFor(url);
    const dateModified = node.dateModified ?? (route ? isoDate(route.updated) : undefined);
    const app: Node = {
      ...node,
      '@id': `${url}#app`,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      isAccessibleForFree: true,
      inLanguage: 'en-US',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: ORG_REF,
      description: node.description ?? route?.description,
      ...(dateModified ? { dateModified } : {}),
    };
    return [app, webPageFor(url, node.name, `${url}#app`, dateModified)];
  }

  if (type === 'Article') {
    const page = node.mainEntityOfPage;
    const url =
      typeof page === 'string'
        ? page
        : page && typeof page === 'object'
          ? String((page as Node)['@id'] ?? (page as Node).url ?? '')
          : String(node.url ?? '');
    const cleanUrl = url.replace(/#.*$/, '');
    const dateModified = isoDate(node.dateModified);
    const article: Node = {
      ...node,
      '@id': `${cleanUrl}#article`,
      datePublished: isoDate(node.datePublished),
      dateModified,
      image: node.image ?? [DEFAULT_OG_IMAGE_URL],
      author: node.author ?? ORG_REF,
      publisher: ORG_REF,
      isPartOf: { '@id': WEBSITE_ID },
      mainEntityOfPage: { '@id': `${cleanUrl}#webpage` },
      inLanguage: 'en-US',
    };
    return [article, webPageFor(cleanUrl, node.headline, `${cleanUrl}#article`, dateModified)];
  }

  if (type === 'BreadcrumbList' && Array.isArray(node.itemListElement)) {
    const items = (node.itemListElement as Node[]).map((item) =>
      item.item === TOOLS_URL ? { ...item, name: 'Tools' } : item
    );
    const last = items[items.length - 1];
    return [
      {
        ...node,
        ...(last && typeof last.item === 'string' ? { '@id': `${last.item}#breadcrumb` } : {}),
        itemListElement: items,
      },
    ];
  }

  return [node];
}

export function normalizeSchema(data: Node | Node[]): Node[] {
  const list = Array.isArray(data) ? data : [data];
  return list.flatMap((n) => (n && typeof n === 'object' ? normalizeNode(n) : []));
}
