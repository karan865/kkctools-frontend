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

export interface SectionSubsection {
  heading: string;
  paragraphs: string[];
}

export interface PageSection {
  heading: string;
  paragraphs: string[];
  subsections?: SectionSubsection[];
}

export interface SquareFootageContent {
  hero: {
    badge: string;
    title: string;
    description: string;
  };
  faqs: FaqItem[];
  relatedCalculators: RelatedCalculatorLink[];
}

export const SQUARE_FOOTAGE_FAQS: FaqItem[] = [
  {
    q: 'What is a sqft calculator and how does it work?',
    a: 'A sqft calculator is a specialized area calculation tool designed to measure two-dimensional surface space in square feet. It works by taking the linear dimensions of a space—most commonly length and width—converting any mixed units into decimal feet, and multiplying them together according to the appropriate geometric formula. It also accounts for practical installation needs by applying waste percentages and estimating total material cost.',
  },
  {
    q: 'How do you figure out square footage of a room?',
    a: 'To figure out square footage of a rectangular room, measure its length and width in feet using a standard tape measure or laser distance meter. Then multiply those two numbers together: Length (ft) × Width (ft) = Square Footage (sq ft). For example, a 12 ft by 15 ft room equals 180 square feet. If you measure in inches, multiply length by width and divide by 144.',
  },
  {
    q: 'How is square footage calculated for an L-shaped or irregular room?',
    a: 'To calculate square footage for an L-shaped or irregular room, split the floor plan into two or more standard rectangular sections (Section A and Section B). Calculate the square feet of each section independently by multiplying length by width, then sum the section totals together: Total Sq Ft = Area A + Area B. For spaces with recessed alcoves or closet cutouts, you can also use our calculator’s subtract toggle.',
  },
  {
    q: 'How do you calculate square feet from inches?',
    a: 'To calculate square feet from dimensions measured in inches, multiply length in inches by width in inches to get the total area in square inches, then divide by 144 (since 1 foot = 12 inches, and 12 × 12 = 144 square inches in one square foot). For instance, a countertop measuring 96 inches by 36 inches equals 3,456 square inches, which divided by 144 equals 24 square feet.',
  },
  {
    q: 'How much waste percentage should I add for flooring or tile?',
    a: 'For standard square or rectangular rooms using straight-lay tile, laminate, or hardwood planks, professional contractors recommend adding a 10% waste buffer to account for end-cuts and trimming. For diagonal layouts, herringbone patterns, complex room geometries, or rooms with multiple pillars, increase your waste allowance to 15% to 20%.',
  },
  {
    q: 'How do you convert square feet to square meters (m²)?',
    a: 'To convert square feet to square meters, multiply the square footage by 0.09290304 (or divide by 10.7639). For example, a 500 sq ft room equals 500 × 0.09290304 ≈ 46.45 square meters. Conversely, to convert square meters to square feet, multiply square meters by 10.7639.',
  },
  {
    q: 'How do I convert square feet to linear feet?',
    a: 'Square feet measures 2D surface area, while linear feet measures 1D length. To convert square feet to linear feet of material, divide the square footage by the width of the material expressed in feet: Linear Feet = Square Feet ÷ Material Width (ft). For instance, 100 sq ft of 6-inch wide (0.5 ft) flooring planks requires 100 ÷ 0.5 = 200 linear feet of boards.',
  },
  {
    q: 'How do real estate agents calculate house square footage (GLA)?',
    a: 'In US real estate, Gross Living Area (GLA) square footage follows ANSI Z765 standards. It strictly includes finished, heated, and air-conditioned above-grade spaces measured from exterior wall surfaces. Unfinished basements, garages, open porches, exterior decks, and attics with sloped ceilings under 7 feet (or below 5 feet at eaves) are excluded from official GLA listing square footage.',
  },
];

export const RELATED_CONSTRUCTION_TOOLS: RelatedCalculatorLink[] = [
  {
    label: 'Linear Foot Calculator',
    href: '/linear-foot-calculator/',
    description: 'Convert square feet to linear feet for baseboards, trim, lumber, and fencing.',
    live: true,
  },
  {
    label: 'Cubic Yard Calculator',
    href: '/cubic-yard-calculator/',
    description: 'Calculate 3D volume in cubic yards for concrete slabs, topsoil, and gravel.',
    live: true,
  },
  {
    label: 'Tile Calculator',
    href: '/tile-calculator/',
    description: 'Estimate ceramic, porcelain, and mosaic tile quantities, boxes, and grout needs.',
    live: true,
  },
  {
    label: 'Laminate Flooring Calculator',
    href: '/laminate-flooring-calculator/',
    description: 'Calculate laminate planks, cartons, underlayment rolls, and transition strips.',
    live: true,
  },
  {
    label: 'Paint Cost Calculator',
    href: '/paint-cost-calculator/',
    description: 'Estimate paint gallons, primer coverage, and coating costs based on wall square footage.',
    live: true,
  },
  {
    label: 'Paver Sand Calculator',
    href: '/paver-sand-calculator/',
    description: 'Calculate bedding sand and polymeric joint sand bags for patio pavers.',
    live: true,
  },
  {
    label: 'Sand Calculator',
    href: '/sand-calculator/',
    description: 'Calculate sand weight in tons and volume in cubic yards for masonry and base beds.',
    live: true,
  },
  {
    label: 'Fill Dirt Calculator',
    href: '/fill-dirt-calculator/',
    description: 'Determine cubic yards and tons of fill dirt required for ground leveling.',
    live: true,
  },
  {
    label: 'Asphalt Calculator',
    href: '/asphalt-calculator/',
    description: 'Estimate hot-mix asphalt tonnage and base depth for driveways and paving.',
    live: true,
  },
  {
    label: 'Cinder Block Calculator',
    href: '/cinder-block-calculator/',
    description: 'Calculate standard 8x8x16 CMU blocks, mortar bags, and core fill for masonry walls.',
    live: true,
  },
  {
    label: 'Rafter Calculator',
    href: '/rafter-calculator/',
    description: 'Calculate roof pitch, rafter length, birdsmouth cuts, and roof deck square footage.',
    live: true,
  },
];
