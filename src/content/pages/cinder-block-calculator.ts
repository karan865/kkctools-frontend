export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedCalculatorLink {
  label: string;
  href: string;
  live: boolean;
}

export interface SectionSubsection {
  heading: string;
  paragraphs: string[];
}

export interface PageSection {
  heading: string;
  paragraphs: string[];
  subsections?: SectionSubsection[];
}

export interface CinderBlockContent {
  hero: {
    badge: string;
    title: string;
    description: string;
  };
  sections: PageSection[];
  faqs: FaqItem[];
  relatedCalculators: RelatedCalculatorLink[];
}

export const cinderBlockPageContent: CinderBlockContent = {
  hero: {
    badge: 'Masonry & Concrete Estimator',
    title: 'Cinder Block Calculator (CMU Concrete Block Wall Estimator)',
    description:
      'Use this free cinder block calculator and concrete block calculator to estimate how many concrete blocks, mortar bags, and core-fill concrete you need for any wall, foundation, or retaining wall project. Whether you are building an 8x8x16 standard CMU perimeter fence, a raised garden bed, or a structural basement wall, our calculator automatically factors in door and window openings, mortar joint thickness, cut wastage, and delivery weight.',
  },
  sections: [
    {
      heading: 'How to Use the Cinder Block Calculator',
      paragraphs: [
        'Our CMU block calculator provides contractors, masons, and DIY homeowners with an instant, accurate material takeoff in seconds:',
        '1. Enter Wall Dimensions: Measure and enter your total wall length and wall height in feet. For multi-sided perimeter walls, add all straight wall lengths together.',
        '2. Select Block Dimensions: The standard US residential building block is 8" × 8" × 16" Standard CMU. If you are building an interior partition (4" × 8" × 16") or a heavy foundation wall (10" or 12" CMU), select the appropriate size from the dropdown menu.',
        '3. Subtract Doors and Windows: If your wall features garage doors, entry doors, or windows, enter their quantities and dimensions so you do not over-order blocks.',
        '4. Set Mortar Joint Size: Standard US masonry joints are 3/8" (0.375"), which is pre-selected by default.',
        '5. Add a Waste Allowance (%): Masonry construction requires cutting blocks at corners, edges, and openings. We recommend 10% for straight walls and 15% for stepped retaining walls or walls with many corners.',
        '6. Optional Core Fill Concrete: For structural walls requiring steel rebar and concrete grout in the hollow cores, select your grouting frequency (solid fill, 32" OC, or 48" OC) to see total cubic yards and concrete bags needed.',
        '7. Review and Copy Material Takeoff: Instantly view your total block count, number of 80 lb mortar bags, core fill concrete volume, and estimated material delivery weight in pounds and tons.',
      ],
    },
    {
      heading: 'Standard Cinder Block Dimensions & CMU Sizes Chart',
      paragraphs: [
        'In the construction industry, Concrete Masonry Units (CMUs) are identified by their nominal dimensions, which include the block plus the standard 3/8-inch mortar joint. The actual manufactured dimensions are always 3/8 inch smaller in each dimension to allow space for the mortar bed.',
        'Below is the official US masonry standard reference chart for common CMU block sizes and wall coverages:',
      ],
      subsections: [
        {
          heading: 'CMU Dimensions Reference Table',
          paragraphs: [
            '• 4" × 8" × 16" CMU: Actual size is 3-5/8" × 7-5/8" × 15-5/8". Used for interior non-load bearing partition walls and masonry veneer.',
            '• 6" × 8" × 16" CMU: Actual size is 5-5/8" × 7-5/8" × 15-5/8". Used for low landscape retaining walls and residential garage stem walls.',
            '• 8" × 8" × 16" Standard CMU: Actual size is 7-5/8" × 7-5/8" × 15-5/8". The universal standard block for residential homes, commercial walls, and foundation stem walls.',
            '• 10" × 8" × 16" CMU: Actual size is 9-5/8" × 7-5/8" × 15-5/8". Designed for deep basement walls and heavy earth-retention structures.',
            '• 12" × 8" × 16" Extra Heavy CMU: Actual size is 11-5/8" × 7-5/8" × 15-5/8". Used for high-load multi-story commercial foundations and highway blast walls.',
            'Key Takeaway: All standard CMU blocks share the same face dimensions (8 inches high by 16 inches long). This means regardless of block thickness (4", 6", 8", 10", or 12"), you always need exactly 1.125 blocks per square foot of wall surface area.',
          ],
        },
      ],
    },
    {
      heading: 'How to Calculate Blocks for a Wall: The Exact Mathematical Formula',
      paragraphs: [
        'Calculating concrete blocks manually involves three simple mathematical steps:',
        'Step 1 (Net Wall Area): Gross Wall Area = Wall Length (ft) × Wall Height (ft). Then subtract the total square footage of all doors and windows: Net Area = Gross Area - Openings Area.',
        'Step 2 (Net Block Count): Because a standard nominal 8" × 16" block face covers 0.8889 square feet (128 sq in ÷ 144), multiply your net wall square footage by 1.125: Net Blocks = Net Wall Area × 1.125.',
        'Step 3 (Waste Buffer): Multiply your net blocks by 1.10 to add a 10% cutting and breakage buffer: Total Order = CEIL(Net Blocks × 1.10).',
      ],
    },
    {
      heading: 'Practical Worked Example: Building a 30 ft × 8 ft Garage Wall',
      paragraphs: [
        'Suppose you are building a freestanding concrete block garage wall that is 30 feet long and 8 feet tall. It has one standard 3 ft × 7 ft exterior door (21 sq ft) and one 4 ft × 3 ft window (12 sq ft):',
        '1. Gross Wall Area: 30 ft × 8 ft = 240 sq ft',
        '2. Subtract Openings: 240 - 21 (door) - 12 (window) = 207 sq ft net area',
        '3. Net Block Count: 207 sq ft × 1.125 blocks/sq ft = 232.88 blocks',
        '4. Add 10% Waste Buffer: 232.88 × 1.10 = 256.16 -> 257 blocks to order',
        '5. Mortar Required: 257 blocks ÷ 33 blocks per 80 lb bag = 7.8 bags -> 8 bags (80 lb each)',
        '6. Estimated Delivery Weight: 257 blocks × 36 lbs = 9,252 lbs (4.63 tons)',
      ],
    },
    {
      heading: 'Concrete Core Fill (Cell Grouting) & Rebar Spacing Guide',
      paragraphs: [
        'In structural concrete block construction, steel rebar is placed vertically and horizontally inside the hollow block cores and encapsulated with concrete grout.',
        '• Non-Structural Garden Walls: Typically left hollow (0 cubic yards of concrete fill).',
        '• Light Earth-Retention Walls: Vertical rebar placed every 32" or 48" on center. Only the cores containing rebar are filled with concrete grout.',
        '• Structural Basement & High Retaining Walls: Solid-grouted (every core filled). For standard 8-inch CMU, every 100 blocks require approximately 0.81 cubic yards of concrete fill.',
        '• Pro Tip: If ordering ready-mix concrete for continuous wall footings or large core-filling pours, calculate your volume using our Cubic Yard Calculator.',
      ],
    },
  ],
  faqs: [
    {
      q: 'How many cinder blocks do I need per square foot of wall?',
      a: 'For standard 8x8x16 inch CMU cinder blocks with a 3/8-inch mortar joint, you need exactly 1.125 blocks per square foot of wall area (or 112.5 blocks per 100 square feet). To account for cutting and corner waste, builders typically multiply by 1.10 (adding a 10% waste factor), which equals approximately 1.24 blocks per square foot.',
    },
    {
      q: 'What is the actual vs nominal size of an 8x8x16 cinder block?',
      a: 'The nominal size of a standard block is 8 inches deep by 8 inches high by 16 inches long. The actual manufactured size is 7-5/8 inches deep by 7-5/8 inches high by 15-5/8 inches long. The missing 3/8 inch accommodates the standard mortar joint, making the installed block exactly 8x8x16 inches on center.',
    },
    {
      q: 'How many bags of mortar do I need for 100 cinder blocks?',
      a: 'As a standard rule of thumb in masonry construction, one 80 lb bag of Type S or Type N masonry mortar lays approximately 30 to 35 standard 8x8x16 cinder blocks. Therefore, for every 100 blocks, you need approximately 3 to 3.5 bags (80 lb each). If using 60 lb bags, plan on 4 to 5 bags per 100 blocks.',
    },
    {
      q: 'How much concrete do I need to fill cinder block cores?',
      a: 'A standard two-core 8x8x16 cinder block has an internal hollow core volume of approximately 0.22 cubic feet. If every core is filled with concrete grout, 100 blocks require approximately 0.81 cubic yards of concrete. If only reinforced cores with rebar are filled (e.g., every 32 inches or 48 inches on center), the required core fill volume drops to roughly 0.25 to 0.40 cubic yards per 100 blocks.',
    },
    {
      q: 'What is the difference between a cinder block and a concrete block?',
      a: 'Historically, cinder blocks were manufactured using coal cinders and ash as an aggregate, making them lighter and less load-bearing. Modern blocks are Concrete Masonry Units (CMUs), manufactured using Portland cement, water, and crushed stone or gravel. While the terms are used interchangeably today, modern commercial and residential construction exclusively uses CMU concrete blocks for structural strength.',
    },
    {
      q: 'How much does a standard 8x8x16 cinder block weigh?',
      a: 'A standard hollow 8x8x16 inch concrete masonry unit weighs between 34 and 40 pounds (15.4 to 18.1 kg), depending on whether lightweight or normal-weight aggregate is used in manufacturing. Solid blocks or heavy-weight blocks can weigh upwards of 50 to 55 pounds.',
    },
    {
      q: 'How many cinder blocks fit on a standard pallet?',
      a: 'A standard manufacturer pallet holds between 90 and 108 units of 8x8x16 cinder blocks, with a total pallet weight between 3,500 and 4,000 pounds. Pallets require a forklift or boom truck for delivery unloading.',
    },
  ],
  relatedCalculators: [
    {
      label: 'Cubic Yard Calculator',
      href: '/cubic-yard-calculator/',
      live: true,
    },
    {
      label: 'Square Footage Calculator',
      href: '/square-footage-calculator/',
      live: true,
    },
    {
      label: 'Linear Foot Calculator',
      href: '/linear-foot-calculator/',
      live: true,
    },
    {
      label: 'Sand Calculator',
      href: '/sand-calculator/',
      live: true,
    },
    {
      label: 'Fill Dirt Calculator',
      href: '/fill-dirt-calculator/',
      live: true,
    },
    {
      label: 'Rafter Calculator',
      href: '/rafter-calculator/',
      live: true,
    },
    {
      label: 'Construction Estimate Template',
      href: '/construction-estimate-template/',
      live: true,
    },
  ],
};

