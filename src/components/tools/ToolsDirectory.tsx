'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/page.module.css';

interface ToolItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  badge?: string;
  badgeType?: 'popular' | 'business';
  desc: string;
  chips: string[];
  link: string;
  actionText: string;
}

const TOOLS_DATA: ToolItem[] = [
  {
    id: 'band-name-generator',
    title: 'Band Name Generator',
    category: 'Music • Branding • Creative Tools',
    icon: '🎸',
    badge: '🔥 Popular',
    badgeType: 'popular',
    desc: 'Generate original band names across rock, metal, heavy metal, K-pop, boy bands, and random styles. Features customizable starting letters, required keyword injection, local favorite saving, text exports, and instant streaming availability lookups.',
    chips: ['Rock', 'Metal', 'Heavy Metal', 'K-pop', 'Boy Band', 'Random'],
    link: '/band-name-generator/',
    actionText: 'Open tool',
  },
  {
    id: 'construction-estimate-template',
    title: 'Construction Estimate Template',
    category: 'Business • Contracting • Estimating',
    icon: '📐',
    badge: '💼 Business Ready',
    badgeType: 'business',
    desc: 'Build detailed residential and commercial construction estimates with dynamic line-item calculations, material rates, labor hours, tax percentages, and contractor profit markups. Features print-to-PDF formatting, CSV spreadsheet downloads, and private browser storage.',
    chips: ['Materials & Labor', 'Tax & Markup', 'Print to PDF', 'Download CSV'],
    link: '/construction-estimate-template/',
    actionText: 'Open tool',
  },
  {
    id: 'asphalt-calculator',
    title: 'Asphalt Calculator',
    category: 'Outdoor • Materials • Paving',
    icon: '🏗️',
    badge: '🚜 Materials',
    badgeType: 'business',
    desc: 'Calculate tons, cubic yards, and material cost of hot mix asphalt and recycled millings (RAP). Supports rectangular, circular, triangular, and custom multi-section areas, metric tonnes, waste overage, and bitumen binder breakdown.',
    chips: ['Hot Mix Asphalt', 'Millings (RAP)', 'Metric Tonnes', 'Bitumen Binder', 'Cost & Truckloads'],
    link: '/asphalt-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'cubic-yard-calculator',
    title: 'Cubic Yard Calculator',
    category: 'Materials • Concrete • Landscaping',
    icon: '🧱',
    badge: '📦 Volume',
    badgeType: 'business',
    desc: 'Calculate cubic yards, cubic feet, and cubic meters for concrete slabs, footings, walls, columns, soil, mulch, and gravel. Includes multi-section projects and 40, 50, 60, and 80 lb concrete bag count yields.',
    chips: ['Cubic Yards & Bags', 'Concrete Slabs', 'Footings & Walls', 'Soil & Mulch', 'Columns'],
    link: '/cubic-yard-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'sand-calculator',
    title: 'Sand Calculator',
    category: 'Materials • Landscaping • Masonry',
    icon: '🏖️',
    badge: '📦 Materials',
    badgeType: 'business',
    desc: 'Calculate cubic yards, tons, and bags of sand for paver bedding, polymeric joint sand, sandboxes, and site leveling. Features dry, damp, and wet densities, multi-section areas, and step-by-step math breakdowns.',
    chips: ['Sand Volume', 'Paver Sand Bedding', 'Polymeric Joint Sand', 'Sandbox Presets', 'Dry/Damp/Wet Tons'],
    link: '/sand-calculator/',
    actionText: 'Open tool',
  },
];

export default function ToolsDirectory() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS_DATA.filter((tool) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      tool.title.toLowerCase().includes(query) ||
      tool.desc.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query) ||
      tool.chips.some((chip) => chip.toLowerCase().includes(query))
    );
  });

  return (
    <div>
      {/* Interactive Search Bar matching Reference Image 3 */}
      <div className={styles.searchContainer}>
        <span className={styles.searchIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="text"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search band name, construction estimate, excel template..."
          aria-label="Search tools"
        />
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.85rem', marginTop: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>New and improved</h2>
        <p style={{ color: 'var(--ink-2)', maxWidth: '680px', fontSize: '1.0625rem' }}>
          Specialized algorithmic generators and estimators built with custom templates, dynamic calculations, and instant local exports.
        </p>
      </div>

      {filteredTools.length > 0 ? (
        <div className={styles.toolGrid}>
          {filteredTools.map((tool) => (
            <Link key={tool.id} href={tool.link} className={styles.toolCard}>
              {tool.badge && (
                <span className={tool.badgeType === 'business' ? styles.badgeBusiness : styles.badgePopular}>
                  {tool.badge}
                </span>
              )}
              <div className={styles.toolIconBox}>{tool.icon}</div>
              <span className={styles.toolCategory}>{tool.category}</span>
              <h3 className={styles.toolTitle}>{tool.title}</h3>
              <p className={styles.toolDesc}>{tool.desc}</p>
              <div className={styles.chipsRow}>
                {tool.chips.map((chip, idx) => (
                  <span key={idx} className={styles.chipItem}>
                    {chip}
                  </span>
                ))}
              </div>
              <div className={styles.openLink}>
                {tool.actionText} <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ padding: 'var(--space-6)', background: 'var(--surface)', borderRadius: 'var(--radius-l)', border: '1px dashed var(--line)', textAlign: 'center', margin: 'var(--space-5) 0' }}>
          <p style={{ fontSize: '1.125rem', color: 'var(--ink)', fontWeight: 600, margin: '0 0 var(--space-2)' }}>
            No tools matching &ldquo;{searchQuery}&rdquo;
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', margin: 0 }}>
            Have a specific tool you want us to add? Send your suggestion to our team!
          </p>
        </div>
      )}
    </div>
  );
}
