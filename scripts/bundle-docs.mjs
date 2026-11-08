#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const OUT_DIR = path.join(ROOT_DIR, 'out');
const EVIDENCE_DIR = path.join(DOCS_DIR, 'evidence');
const OUTPUT_FILE = path.join(DOCS_DIR, '_BUNDLE_FOR_REVIEW.md');

const DOC_FILES = [
  '00-PROJECT-STATUS.md',
  '01-FEATURES.md',
  '02-SEO.md',
  '03-PAGES-AND-DESIGN.md',
  '04-KEYWORDS.md',
  '05-DEPLOY-AND-LAUNCH.md',
  '06-CHANGELOG.md',
  'seo-audit-report.md',
];

let bundle = `# COMPLETE PROJECT REVIEW BUNDLE\nGenerated on: ${new Date().toISOString()}\n\n`;

for (const fileName of DOC_FILES) {
  const filePath = path.join(DOCS_DIR, fileName);
  bundle += `\n\n<!-- ========================================================= -->\n`;
  bundle += `<!-- FILE: docs/${fileName} -->\n`;
  bundle += `<!-- ========================================================= -->\n\n`;
  if (fs.existsSync(filePath)) {
    bundle += fs.readFileSync(filePath, 'utf8') + '\n';
  } else {
    bundle += `*File docs/${fileName} not yet created.*\n`;
  }
}

// 1. Route list from out/
bundle += `\n\n<!-- ========================================================= -->\n`;
bundle += `<!-- SECTION: Exported Routes (from out/) -->\n`;
bundle += `<!-- ========================================================= -->\n\n`;

function getHtmlFiles(dir, base = '') {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = path.join(base, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getHtmlFiles(full, rel));
    } else if (entry.name.endsWith('.html')) {
      files.push(rel.replace(/\\/g, '/'));
    }
  }
  return files;
}

const routes = getHtmlFiles(OUT_DIR);
if (routes.length > 0) {
  bundle += '```\n' + routes.join('\n') + '\n```\n';
} else {
  bundle += '*out/ directory not yet built.*\n';
}

// 2. Dependencies from package.json
bundle += `\n\n<!-- ========================================================= -->\n`;
bundle += `<!-- SECTION: package.json Dependencies -->\n`;
bundle += `<!-- ========================================================= -->\n\n`;

try {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
  bundle += '```json\n' + JSON.stringify({
    dependencies: pkg.dependencies,
    devDependencies: pkg.devDependencies,
  }, null, 2) + '\n```\n';
} catch (e) {
  bundle += `*Error reading package.json: ${e.message}*\n`;
}

// 3. Git log
bundle += `\n\n<!-- ========================================================= -->\n`;
bundle += `<!-- SECTION: Recent Git Commits -->\n`;
bundle += `<!-- ========================================================= -->\n\n`;

try {
  const gitLog = execSync('git log -n 20 --oneline', { encoding: 'utf8', cwd: ROOT_DIR });
  bundle += '```\n' + gitLog.trim() + '\n```\n';
} catch {
  bundle += '*Git not initialized or no commits yet.*\n';
}

// 4. Evidence files
bundle += `\n\n<!-- ========================================================= -->\n`;
bundle += `<!-- SECTION: Evidence Outputs (docs/evidence/) -->\n`;
bundle += `<!-- ========================================================= -->\n\n`;

if (fs.existsSync(EVIDENCE_DIR)) {
  const evidenceFiles = fs.readdirSync(EVIDENCE_DIR).filter(f => f.endsWith('.txt') || f.endsWith('.log'));
  for (const ef of evidenceFiles) {
    bundle += `### Evidence: ${ef}\n\n\`\`\`\n`;
    bundle += fs.readFileSync(path.join(EVIDENCE_DIR, ef), 'utf8') + '\n```\n\n';
  }
} else {
  bundle += '*No evidence files recorded yet.*\n';
}

fs.writeFileSync(OUTPUT_FILE, bundle, 'utf8');
console.log(`✅ Documentation bundle generated at: docs/_BUNDLE_FOR_REVIEW.md`);
