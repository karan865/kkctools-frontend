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

export const LAMINATE_FAQS: FaqItem[] = [
  {
    q: 'How do I calculate how much laminate flooring I need?',
    a: 'To calculate how much laminate flooring you need: (1) Measure each room length and width in feet, multiply them to find square footage (Length × Width), and deduct permanent built-ins like kitchen islands or fireplaces. (2) Add a 10% waste factor for straight lay (or 12% to 20% for diagonal, herringbone, or complex rooms). (3) Divide your total gross square footage by the square footage per box printed on your chosen carton (commonly 17 to 27 sq ft/box), and round up to the nearest whole box.',
  },
  {
    q: 'How many boxes of laminate flooring do I need for a 12x12 room?',
    a: 'A 12 ft by 12 ft room has a net surface area of 144 square feet. Adding a standard 10% waste factor brings the gross area to 158.4 square feet (144 × 1.10). At the typical retail packaging rate of 20 square feet per box, divide 158.4 by 20 = 7.92. Rounding up to the next full carton means you need exactly 8 boxes (providing 160 square feet total, with 1.6 sq ft of spare planks).',
  },
  {
    q: 'How many square feet in a box of laminate flooring?',
    a: 'Most retail cartons contain between 17 and 27 square feet of planks. If you are asking how many square feet in a box of laminate flooring, the exact coverage is determined by plank width, length, and the count of pieces per box—not by plank thickness. For example, a carton with nine 7.5" × 47.25" planks covers 22.15 sq ft, while eight 8" × 48" planks cover 21.26 sq ft. Always look for the exact "Sq. Ft. per Carton" printed on your specific manufacturer box.',
  },
  {
    q: 'How much extra laminate flooring should I buy for waste?',
    a: 'For a standard rectangular room with straight parallel rows, add a 10% waste factor (published guidelines recommend 5% to 10%). For rooms with numerous doorways, closets, and non-square walls, budget 12%. For diagonal 45° installations, plan for 15% waste. If installing a complex herringbone or chevron interlocking pattern, allow 20% extra due to triangular perimeter cutoff scrap.',
  },
  {
    q: 'Do I need underlayment under laminate flooring?',
    a: 'It depends on your specific product and subfloor. If your laminate planks come with a pre-attached acoustic pad, you do not need—and should not install—a separate foam underlayment (doing so can cause plank bounce and void your locking mechanism warranty). However, when installing over a concrete slab or crawlspace, a 6-mil polyethylene moisture/vapor barrier is virtually always required underneath.',
  },
  {
    q: 'How much does it cost to install laminate flooring?',
    a: 'Laminate flooring material generally costs $1.00 to $4.00 per square foot. Professional contractor installation labor in the mid-range typically runs $2.00 to $5.00 per square foot for basic rooms (with full industry ranges spanning $1.50 to $8.00 depending on subfloor prep and transitions). In total, turnkey installed projects average $3.00 to $12.00 per square foot. DIY installers save the entire labor charge, paying only for planks, underlayment, and moldings.',
  },
  {
    q: 'How big should the expansion gap be?',
    a: 'Laminate is a floating floor that expands and contracts with changes in seasonal indoor temperature and humidity. Always leave a 1/4-inch to 1/2-inch perimeter expansion gap (3/8-inch is most common) against all exterior and interior walls, pipes, and fixed cabinetry. This perimeter gap is completely concealed by baseboards or quarter-round shoe molding after installation.',
  },
  {
    q: 'Can I use this laminate flooring calculator for more than one room?',
    a: 'Yes. Our laminate flooring calculator supports multi-room takeoffs with up to 12 individual areas. You can use "+ Add another room" to include connected living rooms, hallways, and bedrooms, and use "− Subtract an area" to deduct kitchen islands, floor registers, stair openings, and hearths from your net order.',
  },
];

export const RELATED_LAMINATE_TOOLS: RelatedCalculatorLink[] = [
  {
    label: 'Square Footage Calculator',
    href: '/square-footage-calculator/',
    description: 'Calculate multi-room square feet, irregular room dimensions, and overall floor surface areas.',
    live: true,
  },
  {
    label: 'Linear Foot Calculator',
    href: '/linear-foot-calculator/',
    description: 'Measure perimeters for quarter-round shoe molding, baseboard trim, and transition strips.',
    live: true,
  },
  {
    label: 'Paint Cost Calculator',
    href: '/paint-cost-calculator/',
    description: 'Estimate primer and interior wall/ceiling paint when coordinating room trim after flooring.',
    live: true,
  },
  {
    label: 'Tile Calculator',
    href: '/tile-calculator/',
    description: 'Calculate ceramic and porcelain tile boxes, pattern waste, and mortar for kitchens and bathrooms.',
    live: true,
  },
  {
    label: 'Construction Estimate Template',
    href: '/construction-estimate-template/',
    description: 'Create itemized contractor bids, remodeling scopes, client labor invoices, and material quotes.',
    live: true,
  },
];
