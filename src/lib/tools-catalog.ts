import { IconName } from '@/components/icons/Icons';

export type CategoryId =
  | 'concrete'
  | 'gravel'
  | 'earthwork'
  | 'framing'
  | 'finishes'
  | 'business';

export interface CatalogCategory {
  id: CategoryId;
  name: string;
  headline: string;
  blurb: string;
  order: number;
}

export interface CatalogTool {
  slug: string;
  name: string;
  category: CategoryId;
  description: string;
  tags: [string, string?];
  icon: IconName;
  keywords: string[];
  added: string;
  isNew?: boolean;
  isUpdated?: boolean;
  featured?: boolean;
}

export const CATEGORIES: Record<CategoryId, CatalogCategory> = {
  concrete: {
    id: 'concrete',
    name: 'Concrete & Masonry',
    headline: 'Concrete, Block & Brick Calculators',
    blurb: 'Slabs, footings, post holes, CMU walls, and brick courses with precise bag counts.',
    order: 1,
  },
  gravel: {
    id: 'gravel',
    name: 'Gravel, Sand & Pavers',
    headline: 'Gravel, Sand & Patio Calculators',
    blurb: 'Crushed stone, bedding sand, polymeric sand, and compacted paver base for hardscaping.',
    order: 2,
  },
  earthwork: {
    id: 'earthwork',
    name: 'Earthwork & Paving',
    headline: 'Asphalt, Soil & Grading Calculators',
    blurb: 'Hot mix asphalt, fill dirt, garden compost, lawn mowing costs and tons-to-cubic-yards math.',
    order: 3,
  },
  framing: {
    id: 'framing',
    name: 'Framing, Roofing & Measuring',
    headline: 'Framing, Rafter & Area Calculators',
    blurb: 'Wall studs, roof rafters, square footage, and linear-to-square foot conversions.',
    order: 4,
  },
  finishes: {
    id: 'finishes',
    name: 'Floors, Paint & Stain',
    headline: 'Tile, Flooring & Coating Calculators',
    blurb: 'Drywall sheets and mud, ceramic tiles, laminate planks, paint gallons and fence stain.',
    order: 5,
  },
  business: {
    id: 'business',
    name: 'Business & Creative',
    headline: 'Estimates, Directories & Creative Tools',
    blurb: 'Professional contractor estimate sheets, band naming utilities, and tool suggestions.',
    order: 6,
  },
};

export const TOOLS_CATALOG: CatalogTool[] = [
  // 1. Concrete & Masonry
  {
    slug: '/concrete-calculator/',
    name: 'Concrete Calculator',
    category: 'concrete',
    description: 'Slabs, footings, Sonotubes & post holes — cubic yards, m³ and bag counts.',
    tags: ['yd³ · m³', 'Bags'],
    icon: 'slab',
    keywords: ['concrete', 'cement', 'slab', 'footing', 'post hole', 'sonotube', 'quikrete', 'sakrete', 'bags'],
    added: '2026-11-13',
    isNew: true,
    featured: true,
  },
  {
    slug: '/cubic-yard-calculator/',
    name: 'Cubic Yard Calculator',
    category: 'concrete',
    description: 'Cubic yards of soil, gravel, mulch or concrete from length, width & depth.',
    tags: ['Volume', 'Weight'],
    icon: 'cube',
    keywords: ['cubic yard', 'yardage', 'volume', 'gravel', 'mulch', 'soil', 'dirt', 'converter'],
    added: '2026-11-10',
    featured: true,
  },
  {
    slug: '/cinder-block-calculator/',
    name: 'Cinder Block Calculator',
    category: 'concrete',
    description: 'Blocks, mortar bags and concrete core-fill for CMU walls minus openings.',
    tags: ['CMU', 'Mortar'],
    icon: 'blockWall',
    keywords: ['cinder block', 'cmu', 'concrete block', 'rebar', 'mortar', 'masonry', 'foundation wall'],
    added: '2026-11-11',
  },
  {
    slug: '/brick-calculator/',
    name: 'Brick Calculator',
    category: 'concrete',
    description: 'Bricks, mortar bags & pallets for any wall size, joint width and brick type.',
    tags: ['Bricks', 'Mortar'],
    icon: 'brickWall',
    keywords: ['brick', 'mortar', 'masonry', 'brick wall', 'pallets', 'modular brick', 'standard brick'],
    added: '2026-11-11',
  },

  {
    slug: '/rebar-calculator/',
    name: 'Rebar Calculator',
    category: 'concrete',
    description: 'Reinforcement steel for slabs, footings & walls — bars, laps and weight in lb or kg.',
    tags: ['#3–#11 · mm', 'Weight'],
    icon: 'rebar',
    keywords: ['rebar', 'reinforcement steel', 'reinforcing bar', 'steel bars', 'rebar weight', 'slab rebar', 'footing rebar', 'tmt bar'],
    added: '2026-11-14',
    isNew: true,
  },

  // 2. Gravel, Sand & Pavers
  {
    slug: '/stone-calculator/',
    name: 'Stone & Gravel Calculator',
    category: 'gravel',
    description: 'Crushed stone, gravel and river rock in tons, cubic yards and 50 lb bags.',
    tags: ['Tons', 'Yards'],
    icon: 'stonePile',
    keywords: ['stone', 'gravel', 'crushed rock', 'aggregate', 'river rock', 'tons', 'drainage'],
    added: '2026-11-11',
    featured: true,
  },
  {
    slug: '/sand-calculator/',
    name: 'Sand Calculator',
    category: 'gravel',
    description: 'Sand for bedding, fill and sandboxes in cubic yards, tons and 50 lb bags.',
    tags: ['Tons', 'Bags'],
    icon: 'sandDunes',
    keywords: ['sand', 'play sand', 'masonry sand', 'bedding sand', 'sandbox', 'fill sand', 'tons'],
    added: '2026-11-10',
  },
  {
    slug: '/paver-base-calculator/',
    name: 'Paver Base Calculator',
    category: 'gravel',
    description: 'Crushed-stone base under patios & driveways with compaction allowance.',
    tags: ['Base', 'Compaction'],
    icon: 'layeredBase',
    keywords: ['paver base', 'crushed stone', 'road base', 'subbase', 'patio base', 'driveway base', 'compaction'],
    added: '2026-11-11',
  },
  {
    slug: '/paver-sand-calculator/',
    name: 'Paver Sand Calculator',
    category: 'gravel',
    description: 'Bedding sand layer and polymeric joint sand for patio pavers & walkways.',
    tags: ['Bedding', 'Joints'],
    icon: 'paverGrid',
    keywords: ['paver sand', 'bedding sand', 'polymeric sand', 'patio pavers', 'grout sand', 'joint sand'],
    added: '2026-11-11',
  },

  // 3. Earthwork & Paving
  {
    slug: '/asphalt-calculator/',
    name: 'Asphalt Calculator',
    category: 'earthwork',
    description: 'Asphalt tons, cubic yards, millings & total cost for driveways and paths.',
    tags: ['Tons', 'Cost'],
    icon: 'road',
    keywords: ['asphalt', 'blacktop', 'driveway', 'paving', 'millings', 'bitumen', 'tons'],
    added: '2026-11-10',
    featured: true,
  },
  {
    slug: '/fill-dirt-calculator/',
    name: 'Fill Dirt Calculator',
    category: 'earthwork',
    description: 'Fill dirt and topsoil for holes, grading, raising lawn & truckloads.',
    tags: ['Yards', 'Truckloads'],
    icon: 'shovel',
    keywords: ['fill dirt', 'topsoil', 'grading', 'lawn leveling', 'subsoil', 'truckload', 'tri-axle'],
    added: '2026-11-10',
  },
  {
    slug: '/compost-calculator/',
    name: 'Compost Calculator',
    category: 'earthwork',
    description: 'Compost for raised garden beds, lawns & topdressing in yards & bags.',
    tags: ['Beds', 'Bags'],
    icon: 'leaf',
    keywords: ['compost', 'garden bed', 'raised bed', 'organic matter', 'topdressing', 'soil amend', 'bags'],
    added: '2026-11-11',
  },
  {
    slug: '/lawn-mowing-cost-calculator/',
    name: 'Lawn Mowing Cost Calculator',
    category: 'earthwork',
    description: 'Lawn mowing price per visit, month & season — homeowner cost or what pros should charge.',
    tags: ['Per visit', 'Per acre'],
    icon: 'mower',
    keywords: ['lawn mowing', 'lawn care', 'grass cutting', 'mowing price', 'lawn service', 'how much to charge', 'per acre'],
    added: '2026-11-14',
    isNew: true,
  },
  {
    slug: '/tons-to-cubic-yards/',
    name: 'Tons to Cubic Yards Converter',
    category: 'earthwork',
    description: 'Convert tons ↔ cubic yards for gravel, sand, topsoil, dirt & asphalt.',
    tags: ['Converter', 'Density'],
    icon: 'scale',
    keywords: ['tons to yards', 'tons to cubic yards', 'cubic yards to tons', 'weight volume converter', 'material density'],
    added: '2026-11-11',
  },

  // 4. Framing, Roofing & Measuring
  {
    slug: '/rafter-calculator/',
    name: 'Rafter Calculator',
    category: 'framing',
    description: 'Rafter length, pitch, birdsmouth cuts & ridge height with pitch chart.',
    tags: ['Pitch', 'Cuts'],
    icon: 'roofTruss',
    keywords: ['rafter', 'roof pitch', 'roofing', 'birdsmouth cut', 'rafter length', 'ridge height', 'carpentry'],
    added: '2026-11-10',
    isUpdated: true,
  },
  {
    slug: '/stud-calculator/',
    name: 'Stud Framing Calculator',
    category: 'framing',
    description: 'Wall studs, top/bottom plates & corner posts for 16" or 24" OC framing.',
    tags: ['Framing', 'Lumber'],
    icon: 'studWall',
    keywords: ['studs', 'framing', 'lumber', 'wall framing', '2x4', '2x6', 'plates', 'headers'],
    added: '2026-11-11',
  },
  {
    slug: '/linear-foot-calculator/',
    name: 'Linear Foot Calculator',
    category: 'framing',
    description: 'Add mixed lengths in ft, in, yd & m, or convert square feet ↔ linear feet.',
    tags: ['Lengths', 'Cost'],
    icon: 'ruler',
    keywords: ['linear foot', 'linear feet', 'sq ft to linear ft', 'perimeter', 'board feet', 'trim', 'molding'],
    added: '2026-11-10',
  },
  {
    slug: '/square-footage-calculator/',
    name: 'Square Footage Calculator',
    category: 'framing',
    description: 'Area of multiple rooms, irregular shapes & waste allowance in sq ft & m².',
    tags: ['Area', 'Rooms'],
    icon: 'squareArea',
    keywords: ['square footage', 'sq ft', 'area', 'room size', 'flooring sq ft', 'carpet area', 'square meters'],
    added: '2026-11-11',
    featured: true,
  },

  // 5. Floors, Paint & Stain
  {
    slug: '/drywall-calculator/',
    name: 'Drywall Calculator',
    category: 'finishes',
    description: 'Sheetrock sheets, joint compound, tape & screws for rooms, walls and ceilings.',
    tags: ['Sheets', 'Mud & Tape'],
    icon: 'drywall',
    keywords: ['drywall', 'sheetrock', 'plasterboard', 'gypsum board', 'joint compound', 'drywall mud', 'drywall screws', 'drywall tape'],
    added: '2026-11-14',
    isNew: true,
    featured: true,
  },
  {
    slug: '/tile-calculator/',
    name: 'Tile Calculator',
    category: 'finishes',
    description: 'Tiles, boxes & grout needed for floors, showers & backsplashes with waste.',
    tags: ['Tiles', 'Boxes'],
    icon: 'tileGrid',
    keywords: ['tile', 'ceramic tile', 'porcelain', 'subway tile', 'grout', 'tile boxes', 'sq ft'],
    added: '2026-11-11',
  },
  {
    slug: '/laminate-flooring-calculator/',
    name: 'Laminate Flooring Calculator',
    category: 'finishes',
    description: 'Boxes of laminate or vinyl planks for rooms, with waste factor & costs.',
    tags: ['Boxes', 'Cost'],
    icon: 'floorPlanks',
    keywords: ['laminate flooring', 'vinyl plank', 'lvp', 'flooring boxes', 'underlayment', 'sq ft'],
    added: '2026-11-11',
  },
  {
    slug: '/paint-cost-calculator/',
    name: 'Paint Cost Calculator',
    category: 'finishes',
    description: 'Gallons of paint, primer & total costs for interior walls and ceilings.',
    tags: ['Gallons', 'Cost'],
    icon: 'paintRoller',
    keywords: ['paint', 'paint cost', 'gallons', 'primer', 'room paint', 'wall area', 'coverage'],
    added: '2026-11-11',
  },
  {
    slug: '/fence-stain-calculator/',
    name: 'Fence Stain Calculator',
    category: 'finishes',
    description: 'Gallons of stain for privacy, picket & board-on-board wood fences.',
    tags: ['Gallons', 'Coats'],
    icon: 'fence',
    keywords: ['fence stain', 'wood stain', 'privacy fence', 'picket fence', 'gallons', 'coats', 'sealer'],
    added: '2026-11-11',
  },

  // 6. Business & Creative
  {
    slug: '/construction-estimate-template/',
    name: 'Construction Estimate Template',
    category: 'business',
    description: 'Build contractor estimates with labour, materials, markup & print PDF.',
    tags: ['PDF / CSV', 'Billing'],
    icon: 'clipboard',
    keywords: ['estimate template', 'contractor invoice', 'bid template', 'construction proposal', 'quote builder', 'pdf'],
    added: '2026-11-09',
    featured: true,
  },
  {
    slug: '/band-name-generator/',
    name: 'Band Name Generator',
    category: 'business',
    description: 'Original music band & group naming ideas by genre, style & keywords.',
    tags: ['Music', 'Ideas'],
    icon: 'guitar',
    keywords: ['band name', 'band name generator', 'music name', 'rock band names', 'creative generator', 'dj names'],
    added: '2026-11-08',
    featured: true,
  },
];

export function getToolsByCategory(categoryId: CategoryId): CatalogTool[] {
  return TOOLS_CATALOG.filter((tool) => tool.category === categoryId);
}

export function getNewAndUpdatedTools(): CatalogTool[] {
  return TOOLS_CATALOG.filter((tool) => tool.isNew || tool.isUpdated);
}

export function getFeaturedTools(): CatalogTool[] {
  return TOOLS_CATALOG.filter((tool) => tool.featured);
}

