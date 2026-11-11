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
  {
    id: 'fill-dirt-calculator',
    title: 'Fill Dirt Calculator',
    category: 'Materials • Excavation • Grading',
    icon: '🌱',
    badge: '📦 Materials',
    badgeType: 'business',
    desc: 'Calculate cubic yards, tons, and truckloads of fill dirt or topsoil for holes, grading, and garden beds. Features multi-area stacking, sloped depths, and customizable settling buffers.',
    chips: ['Fill Dirt Volume', 'Topsoil Estimator', 'Sloped Depths', 'Settling Buffer', 'Truckload Calculator'],
    link: '/fill-dirt-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'linear-foot-calculator',
    title: 'Linear Foot Calculator',
    category: 'Construction • Lumber • Finishing',
    icon: '📏',
    badge: '📐 Measurement',
    badgeType: 'business',
    desc: 'Calculate total linear feet from mixed units (feet, inches, yards, meters), add custom waste allowances, compute material costs, and convert between square feet and linear feet using board width.',
    chips: ['Linear Feet Sum', 'Mixed Units', 'Sq Ft ↔ Linear Ft', 'Waste % & Cost', 'Board Width'],
    link: '/linear-foot-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'rafter-calculator',
    title: 'Rafter Calculator',
    category: 'Roofing • Framing • Carpentry',
    icon: '🏠',
    badge: '📐 Geometry',
    badgeType: 'business',
    desc: 'Calculate common rafter length, roof pitch, plumb & seat cut angles, birdsmouth depth, stock lumber buy length, and total rafters needed with live cross-section diagram.',
    chips: ['Rafter Length', 'Roof Pitch Chart', 'Plumb & Seat Angles', 'Birdsmouth Notch', 'Buy Length'],
    link: '/rafter-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'square-footage-calculator',
    title: 'Square Footage Calculator',
    category: 'Measurement • Flooring • Remodeling',
    icon: '📐',
    badge: '🔥 Essential',
    badgeType: 'popular',
    desc: 'Calculate square footage for single rooms, multi-room houses, or odd geometric shapes (triangles, circles, trapezoids, L-shapes). Features waste allowances, unit conversions to sq meters, yards, and inches, plus material budgeting.',
    chips: ['SqFt Calculator', 'Multi-Room Total', 'Odd Shapes (Triangles & Circles)', 'Waste Factor %', 'Material Cost'],
    link: '/square-footage-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'cinder-block-calculator',
    title: 'Cinder Block Calculator',
    category: 'Masonry • Concrete • CMU Walls',
    icon: '🧱',
    badge: '🏗️ Structural',
    badgeType: 'business',
    desc: 'Estimate cinder blocks, mortar bags, core fill concrete volume, and delivery weight for CMU walls. Features door and window deductions, 5 block presets, and waste allowances.',
    chips: ['Cinder Block', 'CMU Wall', '8x8x16 Blocks', 'Mortar Bags', 'Core Fill Concrete'],
    link: '/cinder-block-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'brick-calculator',
    title: 'Brick Calculator',
    category: 'Masonry • Brick Walls • Veneer',
    icon: '🧱',
    badge: '🧱 Masonry',
    badgeType: 'business',
    desc: 'Calculate exact brick count, mortar bags (80 lb & 60 lb), pallets, and dry weight for single and double wythe brick walls. Supports standard modular, queen, king sizes, and opening deductions.',
    chips: ['Brick Calculator', 'Modular Bricks', 'Mortar Bags', 'Single & Double Wythe', 'Pallet Estimator'],
    link: '/brick-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'paint-cost-calculator',
    title: 'Paint Cost Calculator',
    category: 'Finishes • Walls • Remodeling',
    icon: '🎨',
    badge: '🎨 Coverage & Cost',
    badgeType: 'popular',
    desc: 'Calculate paint gallons, quarts, and total project costs for interior rooms, ceilings, and walls. Accounts for door/window deductions, smooth vs textured drywall, coats, and primer.',
    chips: ['Paint Cost Calculator', 'Gallons & Quarts', 'Room Coverage', 'Ceiling & Primer', 'DIY vs Pro Savings'],
    link: '/paint-cost-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'tile-calculator',
    title: 'Tile Calculator',
    category: 'Flooring • Bathrooms • Backsplashes',
    icon: '🔲',
    badge: '📐 Tile Estimator',
    badgeType: 'business',
    desc: 'Estimate exact tile counts, retail box quantities, square footage with pattern waste, thin-set mortar, and grout for floors, showers, and kitchen backsplashes.',
    chips: ['Tile Calculator', 'Tile Sq Ft', 'Boxes to Buy', 'Subway & 12x12', 'Grout & Mortar'],
    link: '/tile-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'laminate-flooring-calculator',
    title: 'Laminate Flooring Calculator',
    category: 'Flooring • Living Areas • DIY',
    icon: '🪵',
    badge: '🪵 Flooring',
    badgeType: 'popular',
    desc: 'Calculate exact boxes of laminate flooring, square footage with pattern waste, underlayment rolls, and perimeter molding lengths with DIY vs pro cost comparisons.',
    chips: ['Laminate Flooring', 'Boxes to Buy', 'Sq Ft Coverage', 'Underlayment Rolls', 'Waste & Moldings'],
    link: '/laminate-flooring-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'stone-calculator',
    title: 'Stone & Rock Calculator',
    category: 'Landscaping • Driveways • Aggregate',
    icon: '🪨',
    badge: '🚜 Materials',
    badgeType: 'business',
    desc: 'Calculate tons, cubic yards, and 50 lb bags for river rock, crushed limestone (#57), pea gravel, and rip rap. Includes density presets, waste settling buffer, and dump truck delivery cost estimates.',
    chips: ['Stone Calculator', 'Rock Calculator', 'River Rock', '#57 Limestone', 'Tons to Bags'],
    link: '/stone-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'stud-calculator',
    title: 'Stud & Framing Calculator',
    category: 'Framing • Carpentry • Lumber',
    icon: '🪵',
    badge: '🔨 Framing',
    badgeType: 'popular',
    desc: 'Calculate 2x4 and 2x6 field studs, 3-stud California corners, T-wall partition nailers, door/window king and jack trimmers, and top/bottom plates with lumber waste and budget estimating.',
    chips: ['Stud Calculator', 'Wall Framing', '16" vs 24" OC', 'King & Jack Studs', 'Plates Schedule'],
    link: '/stud-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'tons-to-cubic-yards',
    title: 'Tons to Cubic Yards Converter',
    category: 'Conversions • Materials • Aggregates',
    icon: '⚖️',
    badge: '🔄 Converter',
    badgeType: 'business',
    desc: 'Convert tons to cubic yards and cubic yards to tons for gravel, sand, crushed stone, topsoil, dirt, asphalt, and concrete with 12+ real-world material bulk density presets.',
    chips: ['Tons to Cubic Yards', 'Cubic Yards to Tons', 'Gravel Tons', 'Crushed Stone', 'Density Presets'],
    link: '/tons-to-cubic-yards/',
    actionText: 'Open tool',
  },
  {
    id: 'paver-sand-calculator',
    title: 'Paver Sand Calculator',
    category: 'Hardscaping • Patios • Sand',
    icon: '🏖️',
    badge: '🧱 Hardscape',
    badgeType: 'popular',
    desc: 'Calculate ASTM C33 coarse concrete bedding sand (cubic yards & tons) and polymeric joint locking sand (50 lb bags) for interlocking paver patios and walkways.',
    chips: ['Paver Sand', 'Polymeric Sand', 'Bedding Sand', 'Joint Locking Sand', 'Patio Base'],
    link: '/paver-sand-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'paver-base-calculator',
    title: 'Paver Base Calculator',
    category: 'Hardscaping • Foundations • Gravel',
    icon: '🏗️',
    badge: '🚜 Subbase',
    badgeType: 'business',
    desc: 'Calculate crushed stone paver base, crusher run, road base (#21A), and gravel tonnage with 15% to 20% mechanical plate compaction factor and pricing.',
    chips: ['Paver Base', 'Crushed Stone', 'Crusher Run', 'Compaction %', 'Base Depth'],
    link: '/paver-base-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'compost-calculator',
    title: 'Compost & Soil Volume Calculator',
    category: 'Gardening • Lawns • Organic Soil',
    icon: '🌱',
    badge: '🌿 Garden',
    badgeType: 'popular',
    desc: 'Calculate organic compost cubic yards, cubic feet, and 1 or 2 cu ft retail bags for vegetable gardens, Mel\'s Mix raised beds, and lawn top-dressing.',
    chips: ['Compost Calculator', 'Raised Beds', 'Lawn Top-Dressing', 'Mel\'s Mix', 'Bag Counts'],
    link: '/compost-calculator/',
    actionText: 'Open tool',
  },
  {
    id: 'fence-stain-calculator',
    title: 'Fence Stain Calculator',
    category: 'Painting • Wood Finishes • Outdoor',
    icon: '🎨',
    badge: '🪵 Staining',
    badgeType: 'business',
    desc: 'Calculate exact exterior wood stain gallons, 5-gallon pails, and 1-gallon cans for privacy fences, board-on-board, and shadowbox with porosity and overspray buffers.',
    chips: ['Fence Stain', 'Wood Stain', 'Board-on-Board', '5-Gal Pails', 'Coverage & Coats'],
    link: '/fence-stain-calculator/',
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
