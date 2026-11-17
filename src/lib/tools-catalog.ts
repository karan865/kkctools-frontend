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
    blurb: 'Wall studs, roof rafters, shingle bundles, wire sizing, square footage, and linear-to-square foot conversions.',
    order: 4,
  },
  finishes: {
    id: 'finishes',
    name: 'Floors, Paint & Stain',
    headline: 'Tile, Flooring & Coating Calculators',
    blurb: 'Drywall sheets and mud, board and batten walls, tiles, laminate planks, paint gallons and fence stain.',
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

const RAW_TOOLS_CATALOG: CatalogTool[] = [
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
    slug: '/concrete-slab-cost-calculator/',
    name: 'Concrete Slab Cost Calculator',
    category: 'concrete',
    description: 'Slab, patio & driveway cost — price per yard and sq ft, delivery, pump, labour and DIY vs pro.',
    tags: ['$/yd³ · $/ft²', 'DIY vs pro'],
    icon: 'slabCost',
    keywords: ['concrete cost', 'slab cost', 'price per yard', 'cost per square foot', 'patio cost', 'driveway cost', 'ready mix price', 'concrete estimate', 'short load fee'],
    added: '2026-11-15',
    isNew: true,
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
  {
    slug: '/cubic-feet-to-square-feet/',
    name: 'Cubic Feet ↔ Square Feet',
    category: 'earthwork',
    description: 'Convert ft³ to ft² and back with a depth — mulch, soil, gravel, concrete; yd³, m³, cft and bags.',
    tags: ['ft³ ↔ ft²', 'cft · m³'],
    icon: 'cubeToArea',
    keywords: ['cubic feet to square feet', 'square feet to cubic feet', 'cft', 'cft to sq ft', 'volume to area', 'depth', 'coverage', 'cubic metres', 'mulch coverage'],
    added: '2026-11-15',
    isNew: true,
  },

  {
    slug: '/pipe-volume-calculator/',
    name: 'Pipe & Tube Volume Calculator',
    category: 'earthwork',
    description: 'Gallons and litres in any pipe or tube, Sch 40/80, copper & PEX sizes, plus tube weight.',
    tags: ['Gallons', 'Litres'],
    icon: 'pipe',
    keywords: ['pipe volume', 'tube volume', 'pipe capacity', 'gallons per foot', 'litres per metre', 'schedule 40', 'copper pipe', 'pex', 'hollow cylinder'],
    added: '2026-11-15',
    isNew: true,
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
    slug: '/shingle-calculator/',
    name: 'Shingle Roof Calculator',
    category: 'framing',
    description: 'Roofing squares, shingle bundles, starter, ridge cap, drip edge & underlayment by pitch.',
    tags: ['Bundles', 'Squares'],
    icon: 'shingles',
    keywords: ['shingles', 'roof shingles', 'roofing squares', 'bundles', 'roof area', 'ridge cap', 'starter strip', 'underlayment', 'pitch'],
    added: '2026-11-14',
    isNew: true,
  },
  {
    slug: '/metal-roof-cost-calculator/',
    name: 'Metal Roof Cost Calculator',
    category: 'framing',
    description: 'Standing seam, corrugated or metal shingle roof cost vs asphalt — per sq ft, per year, panels and trim.',
    tags: ['Metal vs shingle', 'Panels'],
    icon: 'metalRoof',
    keywords: ['metal roof cost', 'standing seam', 'corrugated metal roof', 'metal vs shingle', 'roof replacement', 'cost per square foot', 'metal roof panels', 'roofing square'],
    added: '2026-11-15',
    isNew: true,
  },
  {
    slug: '/deck-cost-calculator/',
    name: 'Deck Cost Calculator',
    category: 'framing',
    description: 'Full bill of materials & cost for wood or composite decks: joists, beams, footings, boards & railing.',
    tags: ['BOM Takeoff', 'Wood vs Composite'],
    icon: 'deck',
    keywords: ['deck cost calculator', 'deck estimator', 'cost to build a deck', 'composite decking cost', 'trex cost calculator', 'deck replacement cost', 'deck framing', 'deck materials'],
    added: '2026-11-17',
    isNew: true,
  },
  {
    slug: '/roof-replacement-cost-calculator/',
    name: 'Roof Replacement Cost Calculator',
    category: 'framing',
    description: 'Estimate new roof costs by square, material, pitch and tear-off layers with contractor quote check.',
    tags: ['Per Square', 'Tear-Off'],
    icon: 'roofTruss',
    keywords: ['roof replacement cost', 'roofing cost per square', 'new roof cost', 'tear off roof', 'roofing labor cost', 'shingle replacement', 'roof pitch', 'roof estimate'],
    added: '2026-11-17',
    isNew: true,
  },

  {
    slug: '/wire-gauge-calculator/',
    name: 'Wire Gauge Calculator',
    category: 'framing',
    description: 'Wire size (AWG or mm²) by amps, voltage and distance, with voltage drop and breaker size.',
    tags: ['AWG · mm²', 'Voltage drop'],
    icon: 'bolt',
    keywords: ['wire gauge', 'wire size', 'awg', 'mm2 cable', 'voltage drop', 'ampacity', 'electrical wire', '12v wire', 'breaker size'],
    added: '2026-11-15',
    isNew: true,
  },
  {
    slug: '/cubic-inch-calculator/',
    name: 'Cubic Inch Calculator',
    category: 'framing',
    description: 'Cubic inches of a box, cylinder, tube or sphere, and engine displacement from bore, stroke and cylinders.',
    tags: ['in³ · cc · L', 'Engines'],
    icon: 'piston',
    keywords: ['cubic inches', 'cubic inch calculator', 'engine displacement', 'bore and stroke', 'cc to ci', 'litres to cubic inches', 'stroker', 'overbore', 'box volume', 'cylinder volume'],
    added: '2026-11-15',
    isNew: true,
  },
  {
    slug: '/fence-cost-calculator/',
    name: 'Fence Cost Calculator',
    category: 'framing',
    description: 'Chain link, wood, vinyl & aluminium fence cost — posts, gates, concrete, removal and DIY vs pro.',
    tags: ['$/ft', 'Gates'],
    icon: 'fenceCost',
    keywords: ['fence cost', 'fence price', 'chain link', 'cyclone fence', 'vinyl fence', 'privacy fence', 'wood fence', 'fence posts', 'replace fence', 'gate'],
    added: '2026-11-15',
    isNew: true,
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
    slug: '/carpet-cost-calculator/',
    name: 'Carpet Cost Calculator',
    category: 'finishes',
    description: 'Carpet, padding, installation, stairs & removal by room size with roll layout overage.',
    tags: ['$/sq ft · $/sq yd', 'Roll layout'],
    icon: 'carpetRoll',
    keywords: [
      'carpet cost per square foot',
      'carpet replacement cost',
      'cost to carpet a room',
      'carpet installation cost',
      'carpet padding cost',
      'carpet stairs cost',
      'carpet removal cost',
      'carpet square yards',
      'carpet tiles cost',
    ],
    added: '2026-11-17',
    isNew: true,
    featured: true,
  },
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
  {
    slug: '/deck-stain-calculator/',
    name: 'Deck Stain Calculator',
    category: 'finishes',
    description: 'Gallons of stain for deck boards, railings and stairs — coats, coverage, cans to buy and cost.',
    tags: ['Gallons · L', 'Railings'],
    icon: 'deck',
    keywords: ['deck stain', 'stain calculator', 'deck sealer', 'stain coverage', 'how much stain', 'railing', 'balusters', 'deck staining cost', 'gallons'],
    added: '2026-11-15',
    isNew: true,
  },
  {
    slug: '/bathroom-remodel-cost-calculator/',
    name: 'Bathroom Remodel Cost Calculator',
    category: 'finishes',
    description: 'Half, full or primary bath — scope, finish level, editable line items, contingency and a quote checker.',
    tags: ['Low · mid · high', 'Line items'],
    icon: 'bath',
    keywords: ['bathroom remodel cost', 'bathroom renovation', 'shower remodel', 'half bath', 'master bath', 'tub to shower', 'remodel budget', 'vanity', 'contingency'],
    added: '2026-11-15',
    isNew: true,
  },
  {
    slug: '/floor-refinishing-cost-calculator/',
    name: 'Floor Refinishing Cost Calculator',
    category: 'finishes',
    description: 'Hardwood refinishing by room: recoat, full sand or dustless, stain, repairs, stairs, DIY list and quote check.',
    tags: ['Per sq ft', 'DIY vs pro'],
    icon: 'floorSander',
    keywords: ['hardwood floor refinishing cost', 'floor resurfacing', 'screen and recoat', 'sand and refinish', 'dustless refinishing', 'stain floors', 'refinish stairs', 'refinish vs replace', 'engineered hardwood'],
    added: '2026-11-15',
    isNew: true,
  },



  {
    slug: '/board-and-batten-calculator/',
    name: 'Board and Batten Calculator',
    category: 'finishes',
    description: 'Equal batten spacing, layout marks, grid rails and a lumber shopping list for accent walls.',
    tags: ['Spacing', 'Accent wall'],
    icon: 'battenWall',
    keywords: ['board and batten', 'batten spacing', 'accent wall', 'wainscoting', 'wall paneling', 'shiplap', 'siding', 'trim'],
    added: '2026-11-14',
    isNew: true,
  },

  // 6. Business & Creative
  {
    slug: '/markup-calculator/',
    name: 'Markup Calculator',
    category: 'business',
    description: 'Calculate selling price from cost and markup %, with gross margin, landed fees, and price endings.',
    tags: ['Pricing', 'Retail Math'],
    icon: 'tag',
    keywords: [
      'markup calculator',
      'figuring markup',
      'selling price',
      'retail price',
      'markup vs margin',
      'how much should i sell it for',
      'retail math',
      'average pricing',
      'keystone pricing',
    ],
    added: '2026-11-18',
    isNew: true,
    featured: true,
  },
  {
    slug: '/percentage-change-calculator/',
    name: 'Percentage Change Calculator',
    category: 'business',
    description: 'Calculate percent increase, decrease, symmetric difference, points, and copy Excel formulas.',
    tags: ['% Math', 'Excel'],
    icon: 'percent',
    keywords: ['percentage change', 'percent increase', 'percent decrease', 'percentage difference', 'percentage points', 'reverse percentage', 'excel formula', 'business math'],
    added: '2026-11-18',
    isNew: true,
    featured: true,
  },
  {
    slug: '/profit-margin-calculator/',
    name: 'Profit Margin Calculator',
    category: 'business',
    description: 'Calculate gross margin, operating margin (EBIT), net profit margin, and multi-product blended margins.',
    tags: ['Gross Margin', 'P&L Waterfall'],
    icon: 'margin',
    keywords: [
      'gross margin calculator',
      'profit margin calculator',
      'gross profit margin formula',
      'calculate profit margin',
      'net profit margin formula',
      'how to calculate net profit margin',
      'operating profit margin formula',
      'gp profit',
      'what is a good profit margin',
    ],
    added: '2026-11-18',
    isNew: true,
    featured: true,
  },
  {
    slug: '/unit-price-calculator/',
    name: 'Unit Price Calculator',
    category: 'business',
    description: 'Compare 2 to 6 product sizes by price per ounce, pound, litre or item to find the cheapest deal.',
    tags: ['Price per Ounce', 'Deals & BOGO'],
    icon: 'unitPrice',
    keywords: [
      'unit price calculator',
      'price per unit calculator',
      'price per ounce calculator',
      'calculate price per oz',
      'cost per unit',
      'price per pound',
      'cheapest unit price',
      'shrinkflation calculator',
    ],
    added: '2026-11-18',
    isNew: true,
    featured: true,
  },
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

/**
 * Single source of truth array of all tools.
 * Sorted so that newer tools appear at the start, and older tools appear at the end.
 * Primary: Date added descending (newest date first).
 * Secondary: isNew / isUpdated priority.
 */
export const TOOLS_CATALOG: CatalogTool[] = [...RAW_TOOLS_CATALOG].sort((a, b) => {
  const dateDiff = b.added.localeCompare(a.added);
  if (dateDiff !== 0) return dateDiff;
  if (a.isNew && !b.isNew) return -1;
  if (!a.isNew && b.isNew) return 1;
  return a.name.localeCompare(b.name);
});

export function getToolsByCategory(categoryId: CategoryId): CatalogTool[] {
  return TOOLS_CATALOG.filter((tool) => tool.category === categoryId);
}

export function getNewAndUpdatedTools(): CatalogTool[] {
  return TOOLS_CATALOG.filter((tool) => tool.isNew || tool.isUpdated);
}

export function getFeaturedTools(): CatalogTool[] {
  return TOOLS_CATALOG.filter((tool) => tool.featured);
}

