export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedCalculatorLink {
  label: string;
  href: string;
  description: string;
  live: boolean;
}

export const TILE_FAQS: FaqItem[] = [
  {
    q: 'How do I calculate how many tiles I need?',
    a: 'To calculate how many tiles you need: (1) Find your surface area in square inches (Length in inches × Width in inches) or square feet. (2) Calculate the face area of a single tile in square inches (Tile Length × Tile Width). (3) Divide total surface area by single tile area to get base tiles. (4) Add 10% to 20% waste allowance for cuts, borders, and breakage. Grout joint width is not subtracted from the tile count because the waste factor covers minor joint differences.',
  },
  {
    q: 'How much tile do I need for my project?',
    a: 'To determine how much tile you need, calculate the net square footage of all surfaces (walls or floors) and add a pattern waste factor: 10% for straight grid, 12% for running bond, 15% for diagonal diamond, and 20% for herringbone. Then divide total gross square feet by the square footage per box printed on your chosen tile packaging.',
  },
  {
    q: 'How many 12x12 tiles do I need for a 100 square foot room?',
    a: 'A standard 12" × 12" tile covers exactly 1.0 square foot. For a 100 square foot room, you need 100 base tiles. With a standard 10% waste allowance for cuts along the walls, you should order 110 tiles (which equals 11 standard 10-tile boxes). For a diagonal pattern (15% waste), order 115 tiles; for herringbone (20% waste), order 120 tiles.',
  },
  {
    q: 'How much extra tile should I order for waste?',
    a: 'For a straight grid or stack layout, order 10% extra tile. For a staggered running bond (1/3 or 1/2 offset), plan for 12% waste. For diagonal (45° diamond) layouts, budget 15% waste because every perimeter tile must be cut at an angle. For herringbone or chevron patterns, use a 20% herringbone tile waste factor due to triangular cutoffs and directional alignment.',
  },
  {
    q: 'How many tiles are in a box?',
    a: 'Box packaging depends on tile dimensions and weight. Using a tile box calculator approach, standard 12" × 12" ceramic tiles typically come in boxes of 10 pieces (10 sq ft). Large format 12" × 24" porcelain tiles come in boxes of 7 to 8 pieces (14 to 16 sq ft). Classic 3" × 6" subway tiles are packaged in boxes of 80 to 100 pieces (10 to 12.5 sq ft), and 4" × 12" tiles usually come with 30 pieces per box (10 sq ft). Always verify the square footage printed on your specific manufacturer box.',
  },
  {
    q: 'How much does professional tile installation cost per square foot?',
    a: 'Professional tile installation cost per square foot generally ranges from $5 to $15 per square foot of net surface area for straightforward floor installations. Complex patterns like diagonal or herringbone add about a 20% labor surge ($6 to $18/sq ft). Shower walls, waterproofing membranes, and custom niche prep can increase total labor to $10 to $25 per square foot. In 2026 cost guides, total all-in costs (labor plus mid-range materials) typically run $9 to $25 per square foot.',
  },
  {
    q: 'How much grout do I need and how much thin-set mortar?',
    a: 'To calculate how much grout do I need: thin-set mortar coverage depends on tile size and trowel notch depth (small tiles up to 8" yield ~80 sq ft per 50 lb bag; medium tiles over 8" to 15" yield ~60 sq ft; large format over 15" yield ~50 sq ft with back-buttering). Grout depends on joint width, thickness, and tile face size: a 100 sq ft floor of 12" × 12" tile with 1/8" joints requires about 7.2 lb of sanded grout (1 bag), 3" × 6" subway tile needs about 17.9 lb (1 bag), and 2" × 2" mosaics require about 28.7 lb (2 bags of 25 lb).',
  },
  {
    q: 'How many 3x6 subway tiles per square foot?',
    a: 'There are exactly 8 subway tiles (3" × 6") in one square foot. In a subway tile calculator estimate: multiply your square footage by 8. For a 100 square foot backsplash or shower surround, you need 800 base tiles, or 880 tiles with a 10% grid waste factor (896 tiles at 12% running bond).',
  },
  {
    q: 'Is this tile sq ft calculator accurate?',
    a: 'Yes. This free tile sq ft calculator uses precise single-rounding geometric formulas based on net square footage, single tile face area, TCNA recommended trowel coverage depths, and standard sanded grout volume calculations. However, actual retail packaging yields vary slightly by brand, and complex cuts around plumbing or irregular walls may require extra tiles. Always review the square footage printed on your purchased boxes and obtain 2 to 3 written local contractor quotes.',
  },
  {
    q: 'How do I measure for a shower or backsplash?',
    a: 'When using this as a shower tile calculator or kitchen backsplash estimator, break the project down into individual rectangular flat surfaces. For a three-wall shower enclosure, measure each wall width multiplied by height (e.g. two 3 ft × 8 ft side walls = 48 sq ft, plus one 5 ft × 8 ft back wall = 40 sq ft, giving 88 gross sq ft). Use the "+ Subtract area" feature in our calculator to deduct un-tiled openings like recessed niches, windows, or vanity mirrors.',
  },
];

export const RELATED_TILE_TOOLS: RelatedCalculatorLink[] = [
  {
    label: 'Square Footage Calculator',
    href: '/square-footage-calculator/',
    description: 'Calculate room area, multi-room totals, irregular room geometry, and material square footage.',
    live: true,
  },
  {
    label: 'Linear Foot Calculator',
    href: '/linear-foot-calculator/',
    description: 'Calculate perimeters for baseboards, transition strips, tile edging trims, and bullnose borders.',
    live: true,
  },
  {
    label: 'Paint Cost Calculator',
    href: '/paint-cost-calculator/',
    description: 'Estimate primer and moisture-resistant ceiling paint for bathroom walls and wet-area renovations.',
    live: true,
  },
  {
    label: 'Construction Estimate Template',
    href: '/construction-estimate-template/',
    description: 'Create itemized contractor bids, remodeling estimates, and material invoices.',
    live: true,
  },
  {
    label: 'Laminate Flooring Calculator',
    href: '/laminate-flooring-calculator/',
    description: 'Calculate floating laminate planks, underlayment rolls, and waste for living areas and bedrooms.',
    live: true,
  },
];
