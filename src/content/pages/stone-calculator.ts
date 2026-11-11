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

export const STONE_FAQS: FaqItem[] = [
  {
    q: 'How many cubic yards are in a ton of rock?',
    a: 'One US short ton of rock contains approximately 0.65 to 0.78 cubic yards, depending on the mineral density and gradation. For standard #57 crushed stone and pea gravel (density ~1.40 tons/yd³), 1 ton equals 0.71 cubic yards. For dense crusher run (~1.50 tons/yd³), 1 ton equals 0.67 cubic yards. For smooth river rock (~1.35 tons/yd³), 1 ton equals 0.74 cubic yards. Lightweight lava rock (~0.61 tons/yd³) yields roughly 1.64 cubic yards per ton. Conversely, 1 cubic yard of common crushed rock weighs between 1.35 and 1.50 tons.',
  },
  {
    q: 'How do I calculate how much rock I need?',
    a: 'To calculate how much rock you need: (1) Measure your project length and width in feet, and determine desired depth in inches. (2) Multiply Area (sq ft) × Depth (in) ÷ 12 to find cubic feet. (3) Divide cubic feet by 27 to convert to cubic yards. (4) Add 5% to 10% for grade variations and settling. (5) Multiply gross cubic yards by the stone material density rating (typically 1.35 to 1.50 tons per cubic yard) to determine total short tons to order.',
  },
  {
    q: 'How many square feet does 1 ton of rock cover?',
    a: 'One ton of typical crushed stone or river rock covers approximately 105 to 120 square feet at a 2-inch depth, 70 to 80 square feet at a 3-inch depth, and 52 to 60 square feet at a 4-inch depth. Because coverage depends on stone density, heavier materials like crusher run cover slightly less (~54 sq ft at 4"), while lighter river rock covers slightly more (~60 sq ft at 4").',
  },
  {
    q: 'How many 50 lb bags of stone make a cubic yard?',
    a: 'It takes approximately 54 to 56 bags (50 lb each) of stone to equal one cubic yard of typical crushed rock or gravel. Since one cubic yard of standard aggregate weighs between 2,700 and 2,800 pounds, divide total weight by 50 to find bag count: 2,700 ÷ 50 = 54 bags, or 2,800 ÷ 50 = 56 bags.',
  },
  {
    q: 'What is the difference between #57 stone and river rock?',
    a: '#57 stone is machine-crushed, angular limestone or granite with sharp edges (roughly 1/2" to 1" in size) that lock loosely together while maintaining large open drainage voids, making it the industry standard for French drains, concrete aggregate, and sub-bases. River rock consists of naturally water-smoothed, rounded pebbles and cobbles (1" to 3"+), making it comfortable for walkways and visually attractive for decorative landscape beds, but unsuitable for driveways because round stones roll under vehicle tires.',
  },
  {
    q: 'Is #57 stone or crusher run better for a driveway?',
    a: 'Crusher run (also called dense-graded aggregate or ABC stone) is superior for driveway foundations because it contains a blend of 3/4-inch crushed stone down to fine stone dust. When compacted, the stone dust fills all voids, creating a hard, cement-like interlocking base that resists rutting. #57 clean stone is commonly used as a clean decorative top dressing or for drainage courses, but lacks the binding fines needed for a firm, compacted roadway base.',
  },
  {
    q: "Why is my supplier's weight different from the calculator's result?",
    a: 'Quarries and aggregate supply yards bill by certified platform scale tickets, measuring actual gross weight on delivery trucks. Rainwater or high quarry stockpile moisture can increase material weight by 5% to 10% without adding usable volume. Additionally, natural mineral density variations from different quarry ledges mean actual scale weights may vary slightly from theoretical dry volume estimates.',
  },
  {
    q: 'Can I put landscape rock directly on dirt?',
    a: 'We strongly advise against placing landscape rock directly onto raw soil. Over time, rainfall and foot traffic will cause heavy stones to sink into the mud while soil washes up into the rocks. Weeds will also rapidly take root. Always install a heavy-duty, professional-grade non-woven geotextile landscape fabric between the subgrade dirt and your stone layer to block weeds, allow water drainage, and keep your rock clean for years.',
  },
];

export const RELATED_STONE_TOOLS: RelatedCalculatorLink[] = [
  {
    label: 'Cubic Yard Calculator',
    href: '/cubic-yard-calculator/',
    description: 'Calculate volume in cubic yards and cubic feet for concrete slabs, mulch, and earthwork.',
    live: true,
  },
  {
    label: 'Tons to Cubic Yards Converter',
    href: '/tons-to-cubic-yards/',
    description: 'Convert short tons to cubic yards and vice-versa across all major bulk landscape materials.',
    live: true,
  },
  {
    label: 'Sand Calculator',
    href: '/sand-calculator/',
    description: 'Estimate mason sand, concrete sand, and bedding sand tons and bags for paver patios.',
    live: true,
  },
  {
    label: 'Fill Dirt Calculator',
    href: '/fill-dirt-calculator/',
    description: 'Calculate clean fill dirt, topsoil, and backfill volume and weight for leveling and grading.',
    live: true,
  },
  {
    label: 'Square Footage Calculator',
    href: '/square-footage-calculator/',
    description: 'Measure irregular landscape garden beds, multi-zone yards, and surface square footage.',
    live: true,
  },
];

