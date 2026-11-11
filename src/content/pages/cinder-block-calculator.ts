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

export const CINDER_BLOCK_FAQS: FaqItem[] = [
  {
    q: 'How many cinder blocks do I need per square foot of wall?',
    a: 'For standard 8x8x16 concrete masonry units (actual size 7-5/8" × 7-5/8" × 15-5/8") laid with a standard 3/8-inch mortar joint, you need exactly 1.125 blocks per square foot of wall face area (or 112.5 blocks per 100 square feet). If using a 1/2-inch mortar joint, the coverage rate adjusts slightly to 1.099 blocks per square foot. Adding a typical 10% waste buffer brings your order requirement to roughly 1.24 blocks per square foot.',
  },
  {
    q: 'What is the actual size of an 8x8x16 cinder block?',
    a: 'The actual manufactured dimensions of an 8x8x16 cinder block are 7-5/8 inches wide by 7-5/8 inches high by 15-5/8 inches long (7.625" × 7.625" × 15.625"). Manufacturers undersize the physical block by exactly 3/8 inch in each direction so that when laid with a standard 3/8-inch mortar joint, each block occupies exactly 8 inches by 16 inches of modular wall elevation.',
  },
  {
    q: 'How much mortar do I need for cinder blocks?',
    a: 'When using pre-blended mortar mix (which contains sand and cement pre-mixed), plan on about 8 bags (80 lb each) per 100 blocks, based on an average yield of 13 standard 8" blocks per 80 lb bag (or about 10 bags of 60 lb mix). If mixing on-site using pure masonry cement where you add sand, one 80 lb bag of masonry cement yields about 35 blocks, requiring about 3 bags of masonry cement plus approximately 0.35 tons of masonry sand per 100 blocks. Yields vary with joint thickness, head-joint bedding, and mason technique.',
  },
  {
    q: 'How much concrete do I need to fill cinder block cores?',
    a: 'A standard hollow 8x8x16 block has two hollow cells with a total internal core volume of approximately 0.27 cubic feet. Filling 100 blocks solid (every core grouted) requires about 27 cubic feet of concrete grout, which equals exactly 1.0 cubic yard (before waste). If vertical rebar cores are filled at 32 inches on center (25% of cells), 100 blocks need approximately 0.25 cubic yards (6.75 cu ft). At 48 inches on center (16.7% of cells), 100 blocks need about 0.17 cubic yards (4.5 cu ft). Always add a 10% grout waste allowance.',
  },
  {
    q: 'What is the difference between a cinder block and a concrete block?',
    a: 'Historically, cinder blocks were manufactured using coal cinders and coal ash mixed with Portland cement, resulting in lightweight, porous, non-structural blocks. Today, the terms cinder block, concrete block, cement block, and Concrete Masonry Unit (CMU) are commonly used as synonyms by consumers, but modern construction exclusively produces CMUs made from Portland cement, water, sand, and crushed gravel or limestone to meet strict ASTM C90 structural load-bearing standards.',
  },
  {
    q: 'How much does a standard cinder block weigh?',
    a: 'A standard hollow 8x8x16 inch normal-weight CMU block typically weighs between 34 and 40 pounds (most commonly 36 lbs). Lightweight aggregate CMUs weigh between 25 and 30 pounds, while solid concrete units can weigh upwards of 50 to 55 pounds. Nominal 4" blocks weigh about 25 lbs, 6" blocks weigh about 32 lbs, 10" blocks weigh about 46 lbs, and 12" blocks weigh about 55 lbs.',
  },
  {
    q: 'How many cinder blocks are on a pallet?',
    a: 'A standard manufacturer pallet holds between 72 and 120 units of 8x8x16 blocks, with 90 blocks per pallet being the most widespread distribution standard in North America. A full pallet of 90 standard blocks weighs approximately 3,240 to 3,600 pounds (roughly 1.6 to 1.8 tons), requiring a commercial forklift or boom truck for delivery and job site staging. Always confirm pallet counts with your local building supplier.',
  },
  {
    q: 'Can I use cinder blocks for a retaining wall?',
    a: 'Low garden retaining walls (under 2 to 3 feet tall) can often be built with standard CMU blocks on a tamped gravel or concrete footing. However, taller retaining walls hold back tremendous lateral soil and hydrostatic water pressure. Taller retaining walls generally require an engineered structural design featuring a poured reinforced concrete footing, vertical rebar anchored into the footing, solid-grouted cores, drainage weep holes, and proper waterproofing backfill. Always check with your local municipal building department for permit and engineering thresholds.',
  },
];

export const RELATED_MASONRY_TOOLS: RelatedCalculatorLink[] = [
  {
    label: 'Brick Calculator',
    href: '/brick-calculator/',
    description: 'Calculate standard, modular, and queen brick quantities, mortar bags, and wall square footage.',
    live: true,
  },
  {
    label: 'Cubic Yard Calculator',
    href: '/cubic-yard-calculator/',
    description: 'Estimate concrete slab volume, footing yardage, and ready-mix truck batches.',
    live: true,
  },
  {
    label: 'Square Footage Calculator',
    href: '/square-footage-calculator/',
    description: 'Calculate room area, surface square feet, multi-room projects, and material budget.',
    live: true,
  },
  {
    label: 'Linear Foot Calculator',
    href: '/linear-foot-calculator/',
    description: 'Convert wall perimeter lengths, footing trenches, and rebar lengths into linear feet.',
    live: true,
  },
  {
    label: 'Sand Calculator',
    href: '/sand-calculator/',
    description: 'Determine masonry sand tons and cubic yards needed for mixing mortar on-site.',
    live: true,
  },
  {
    label: 'Paver Sand Calculator',
    href: '/paver-sand-calculator/',
    description: 'Estimate bedding sand and polymeric joint sand bags for interlocking patio pavers.',
    live: true,
  },
  {
    label: 'Fill Dirt Calculator',
    href: '/fill-dirt-calculator/',
    description: 'Estimate backfill soil and leveling dirt volume behind masonry retaining walls.',
    live: true,
  },
  {
    label: 'Construction Estimate Template',
    href: '/construction-estimate-template/',
    description: 'Create itemized masonry and general contractor bids with material and labor line items.',
    live: true,
  },
];
