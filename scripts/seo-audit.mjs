#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT_DIR = process.cwd();
const OUT_DIR = path.join(ROOT_DIR, 'out');
const REPORT_FILE = path.join(ROOT_DIR, 'docs', 'seo-audit-report.md');
const isStrict = process.argv.includes('--strict');

if (!fs.existsSync(OUT_DIR)) {
  console.error('❌ out/ directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

// Find all HTML files
function getHtmlFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = path.join(base, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getHtmlFiles(full, rel));
    } else if (entry.name.endsWith('.html')) {
      files.push({ rel: rel.replace(/\\/g, '/'), full });
    }
  }
  return files;
}

const htmlFiles = getHtmlFiles(OUT_DIR);
console.log(`Auditing ${htmlFiles.length} HTML files in out/...`);

const minWordCounts = {
  '/': 350,
  '/tools/': 150,
  '/band-name-generator/': 1000,
  '/construction-estimate-template/': 1500,
  '/band-name-generator/kpop/': 600,
  '/band-name-generator/metal/': 600,
  '/band-name-generator/heavy-metal/': 600,
  '/band-name-generator/rock/': 600,
  '/band-name-generator/random/': 600,
  '/band-name-generator/boy-band/': 600,
  '/band-name-generator/punk/': 600,
  '/band-name-generator/pop/': 600,
  '/guides/': 120,
  '/guides/how-to-choose-a-band-name/': 1000,
  '/guides/band-name-ideas-by-genre/': 1000,
  '/guides/how-to-check-if-a-band-name-is-taken/': 1000,
  '/about/': 250,
  '/contact/': 100,
};

let errors = [];
let warnings = [];
let auditSummary = [];

const titles = new Map();
const descriptions = new Map();
const genreTexts = new Map();
const internalLinks = new Map(); // toUrl -> count

for (const file of htmlFiles) {
  const html = fs.readFileSync(file.full, 'utf8');
  const $ = cheerio.load(html);
  
  let routePath = '/' + file.rel.replace(/index\.html$/, '').replace(/\.html$/, '');
  if (!routePath.endsWith('/') && !routePath.includes('.')) routePath += '/';
  if (routePath === '//') routePath = '/';

  const is404 = file.rel.includes('404') || file.rel.includes('_not-found');
  const pageErrors = [];
  const minRequired = minWordCounts[routePath];

  // Check strict placeholders
  if (isStrict) {
    if (html.includes('TODO(owner)') || html.includes('YourSiteName') || html.includes('example.com')) {
      pageErrors.push('Contains unfulfilled owner placeholder (TODO(owner), YourSiteName, or example.com)');
    }
  }

  // 1. html lang
  const lang = $('html').attr('lang');
  if (lang !== 'en') pageErrors.push(`HTML lang attribute is "${lang}", expected "en"`);

  // 2. Viewport
  if (!$('meta[name="viewport"]').length) pageErrors.push('Missing viewport meta');

  // 3. Title
  const title = $('title').text().trim();
  if (!title) {
    pageErrors.push('Missing <title>');
  } else {
    if (title.length > 65) pageErrors.push(`Title too long (${title.length} > 65): "${title}"`);
    if (titles.has(title) && !is404) {
      pageErrors.push(`Duplicate title found (also on ${titles.get(title)})`);
    } else {
      titles.set(title, routePath);
    }
  }

  // 4. Meta description
  const desc = $('meta[name="description"]').attr('content') || '';
  if (!is404) {
    if (!desc) {
      pageErrors.push('Missing meta description');
    } else {
      if (desc.length < 70 || desc.length > 160) {
        pageErrors.push(`Meta description length ${desc.length} outside [70, 160] chars`);
      }
      if (descriptions.has(desc)) {
        pageErrors.push(`Duplicate description found (also on ${descriptions.get(desc)})`);
      } else {
        descriptions.set(desc, routePath);
      }
    }
  }

  // 5. Headings
  const h1Count = $('h1').length;
  if (h1Count !== 1) pageErrors.push(`Expected exactly 1 <h1>, found ${h1Count}`);
  const h2Count = $('h2').length;
  if (!is404 && h2Count < 2 && minRequired && minRequired >= 150) {
    pageErrors.push(`Expected at least 2 <h2> on content page, found ${h2Count}`);
  }

  // 6. Robots / 404
  const robotsMeta = $('meta[name="robots"]').attr('content') || '';
  if (is404) {
    if (!robotsMeta.includes('noindex')) pageErrors.push('404 page must have meta robots "noindex"');
  } else {
    if (robotsMeta.includes('noindex')) pageErrors.push('Indexable page has "noindex"');
  }

  // 7. Canonical
  const canonical = $('link[rel="canonical"]').attr('href');
  if (!canonical && !is404) {
    pageErrors.push('Missing canonical link');
  }

  // 8. OpenGraph & Twitter
  if (!is404) {
    if (!$('meta[property="og:title"]').length) pageErrors.push('Missing og:title');
    if (!$('meta[property="og:description"]').length) pageErrors.push('Missing og:description');
    if (!$('meta[name="twitter:card"]').length) pageErrors.push('Missing twitter:card');
  }

  // 9. Images alt
  $('img').each((i, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined) pageErrors.push(`Image without alt attribute: ${$(el).attr('src')}`);
  });

  // 10. JSON-LD validation
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const data = JSON.parse($(el).html());
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (!item['@context'] || !item['@type']) {
          pageErrors.push('JSON-LD missing @context or @type');
        }
      }
    } catch (e) {
      pageErrors.push(`Invalid JSON-LD syntax: ${e.message}`);
    }
  });

  // 11. Word count in <main>
  const mainText = $('main').text().replace(/\s+/g, ' ').trim();
  const wordCount = mainText ? mainText.split(' ').length : 0;
  if (minRequired && wordCount < minRequired) {
    pageErrors.push(`Main content word count ${wordCount} < required ${minRequired}`);
  }

  // Record genre text for shingle similarity check
  if (routePath.startsWith('/band-name-generator/') && routePath !== '/band-name-generator/') {
    genreTexts.set(routePath, mainText);
  }

  // Collect internal links
  $('a[href]').each((i, el) => {
    const href = $(el).attr('href');
    if (href && (href.startsWith('/') || href.startsWith('http://localhost') || href.startsWith('https://example.com') || href.startsWith('https://www.kkctools.com') || href.startsWith('https://kkctools.com'))) {
      const parsedPath = href.replace(/^https?:\/\/[^\/]+/, '').split('?')[0].split('#')[0];
      if (parsedPath) {
        internalLinks.set(parsedPath, (internalLinks.get(parsedPath) || 0) + 1);
      }
    }
  });

  if (pageErrors.length > 0) {
    errors.push({ route: routePath, issues: pageErrors });
  }

  auditSummary.push({
    route: routePath,
    title: title.slice(0, 40),
    words: wordCount,
    h1: $('h1').text().trim().slice(0, 30),
    status: pageErrors.length === 0 ? 'PASS' : 'FAIL',
  });
}

// 12. Genre pages Jaccard similarity (< 0.30)
function getShingles(text, k = 5) {
  const words = text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);
  const shingles = new Set();
  for (let i = 0; i <= words.length - k; i++) {
    shingles.add(words.slice(i, i + k).join(' '));
  }
  return shingles;
}

const genreKeys = Array.from(genreTexts.keys());
for (let i = 0; i < genreKeys.length; i++) {
  for (let j = i + 1; j < genreKeys.length; j++) {
    const s1 = getShingles(genreTexts.get(genreKeys[i]));
    const s2 = getShingles(genreTexts.get(genreKeys[j]));
    let intersection = 0;
    for (const sh of s1) {
      if (s2.has(sh)) intersection++;
    }
    const union = s1.size + s2.size - intersection;
    const jaccard = union > 0 ? intersection / union : 0;
    if (jaccard >= 0.30) {
      errors.push({
        route: `${genreKeys[i]} vs ${genreKeys[j]}`,
        issues: [`Jaccard similarity too high: ${jaccard.toFixed(3)} >= 0.30`],
      });
    }
  }
}

// 13. Sitemap & robots check
const sitemapPath = path.join(OUT_DIR, 'sitemap.xml');
const robotsPath = path.join(OUT_DIR, 'robots.txt');

if (!fs.existsSync(sitemapPath)) {
  errors.push({ route: '/sitemap.xml', issues: ['sitemap.xml not found in out/'] });
} else {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemapContent.includes('<urlset') || !sitemapContent.includes('/band-name-generator/')) {
    errors.push({ route: '/sitemap.xml', issues: ['sitemap.xml missing urlset or core routes'] });
  }
}

if (!fs.existsSync(robotsPath)) {
  errors.push({ route: '/robots.txt', issues: ['robots.txt not found in out/'] });
} else {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (!robotsContent.includes('Sitemap:')) {
    errors.push({ route: '/robots.txt', issues: ['robots.txt missing Sitemap: directive'] });
  }
}

// 14. Broken link resolution and orphan check
for (const [targetPath, count] of internalLinks.entries()) {
  const cleanTarget = targetPath.replace(/\/$/, '');
  const candidate1 = path.join(OUT_DIR, cleanTarget, 'index.html');
  const candidate2 = path.join(OUT_DIR, cleanTarget + '.html');
  const candidate3 = path.join(OUT_DIR, cleanTarget);
  if (!fs.existsSync(candidate1) && !fs.existsSync(candidate2) && !fs.existsSync(candidate3)) {
    warnings.push(`Broken internal link target detected: "${targetPath}" (linked ${count} times)`);
  }
}

// Write report
let report = `# SEO Audit Report\n\nRun Date: ${new Date().toISOString()}\nStatus: ${errors.length === 0 ? 'PASSED ✅' : 'FAILED ❌'}\n\n`;
report += `| Route | Title | Words | H1 | Status |\n|---|---|---|---|---|\n`;
for (const row of auditSummary) {
  report += `| \`${row.route}\` | ${row.title} | ${row.words} | ${row.h1} | ${row.status} |\n`;
}

if (errors.length > 0) {
  report += `\n## Failures (${errors.length})\n\n`;
  for (const err of errors) {
    report += `### ${err.route}\n`;
    for (const issue of err.issues) {
      report += `- ${issue}\n`;
    }
  }
}

if (warnings.length > 0) {
  report += `\n## Warnings (${warnings.length})\n\n`;
  for (const w of warnings) {
    report += `- ${w}\n`;
  }
}

fs.mkdirSync(path.join(ROOT_DIR, 'docs'), { recursive: true });
fs.writeFileSync(REPORT_FILE, report, 'utf8');

console.log(`Report written to docs/seo-audit-report.md`);

if (errors.length > 0) {
  console.error(`\n❌ SEO Audit Failed with ${errors.length} page error(s).`);
  for (const err of errors) {
    console.error(` [${err.route}]: ${err.issues.join('; ')}`);
  }
  process.exit(1);
} else {
  console.log('✅ SEO Audit Passed with 0 errors.');
  process.exit(0);
}
