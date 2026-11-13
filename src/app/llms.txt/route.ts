import { INDEXABLE_ROUTES, type RouteDefinition } from '@/lib/routes';
import { SITE_NAME, SITE_URL, OWNER_EMAIL, SITE_DESCRIPTION } from '@/config/site';

// Generated at build time from the same route list as sitemap.xml, so it can never
// list a page that does not exist or miss one that does.
export const dynamic = 'force-static';

function line(r: RouteDefinition) {
  return `- [${r.title}](${SITE_URL}${r.path}): ${r.description}`;
}

export function GET() {
  const by = (types: RouteDefinition['type'][]) => INDEXABLE_ROUTES.filter((r) => types.includes(r.type));
  const tools = by(['tool']);
  const calculators = tools.filter((r) => !r.path.startsWith('/band-name-generator'));
  const generators = [...tools.filter((r) => r.path.startsWith('/band-name-generator')), ...by(['genre'])];
  const guides = by(['guide']);
  const site = by(['home', 'tool-index', 'guide-index', 'trust', 'legal']);

  const body = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    'All calculators run client-side in the browser. Results are planning estimates; each page shows its formula and default values.',
    '',
    '## Construction & Landscaping Calculators',
    '',
    ...calculators.map(line),
    '',
    '## Name Generators',
    '',
    ...generators.map(line),
    '',
    '## Guides',
    '',
    ...guides.map(line),
    '',
    '## Site',
    '',
    ...site.map(line),
    `- [Contact email](mailto:${OWNER_EMAIL}): Corrections, bug reports and tool suggestions.`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
