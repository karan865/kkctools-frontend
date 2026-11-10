export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedCalculatorLink {
  label: string;
  href: string;
  live: boolean;
}

export const ASPHALT_PAGE_COPY = {
  h1: 'Asphalt Calculator: How Many Tons Do You Need?',
  introText:
    'Use this free online asphalt calculator to estimate how many tons and cubic yards of hot mix asphalt you need for a driveway, parking lot, road or walkway. Enter the area and compacted thickness, adjust the density if your supplier gave you a different number, and get an order quantity in seconds. Switch to Millings mode and it works as an asphalt millings calculator. The metric option and the optional binder estimate cover the same job as a bitumen calculator.',
  trustLine: 'Estimates only · Default density 145 lb/ft³ · Last updated November 10, 2026',
  toolH2: 'Asphalt Tonnage Calculator',
  toolFootnote:
    'Results are planning estimates. Confirm density, thickness and minimum load size with your asphalt plant or paving contractor before you order.',
  coverageTable: [
    { thickness: '1 in', coverage: '≈ 165.5 sq ft', tons1000: '≈ 6.04', use: 'Thin overlay or patching' },
    { thickness: '1.5 in', coverage: '≈ 110.3 sq ft', tons1000: '≈ 9.06', use: 'Overlay over sound pavement' },
    { thickness: '2 in', coverage: '≈ 82.8 sq ft', tons1000: '≈ 12.08', use: 'Overlay or light-duty driveway' },
    { thickness: '2.5 in', coverage: '≈ 66.2 sq ft', tons1000: '≈ 15.10', use: 'New driveway surface course' },
    { thickness: '3 in', coverage: '≈ 55.2 sq ft', tons1000: '≈ 18.13', use: 'New driveway or light parking' },
    { thickness: '4 in', coverage: '≈ 41.4 sq ft', tons1000: '≈ 24.17', use: 'Heavier traffic, often placed in lifts' },
  ],
  densityTable: [
    { material: 'Dense-graded hot mix (planning default)', density: '145', tonsPerCY: '1.96', kgM3: '2,323' },
    { material: 'Stone matrix asphalt (SMA) and warm mix', density: '140–145', tonsPerCY: '1.89–1.96', kgM3: '2,243–2,323' },
    { material: 'Open-graded / porous asphalt', density: '115–135', tonsPerCY: '1.55–1.82', kgM3: '1,842–2,162' },
    { material: 'Asphalt millings (RAP), compacted', density: 'about 110', tonsPerCY: 'about 1.49', kgM3: 'about 1,762' },
  ],
  thicknessTable: [
    { project: 'Residential driveway (new)', thickness: '2–3 in', notes: 'Usually placed over a compacted stone base' },
    { project: 'Overlay / resurfacing', thickness: '1.5–2 in', notes: 'Over existing pavement that is still sound' },
    { project: 'Walkway or bike path', thickness: 'About 2 in', notes: 'Light loads' },
    { project: 'Parking lot, cars only', thickness: '2–3 in', notes: 'Depends on subgrade and base' },
    { project: 'Heavy or truck traffic', thickness: '3–4 in or more', notes: 'Often placed in more than one lift' },
  ],
  faqs: [
    {
      q: 'How many tons of asphalt do I need for a driveway?',
      a: 'It depends on the area and thickness. A 20 × 40 ft driveway (800 sq ft) at 2 inches thick needs about 9.7 tons, or about 10.2 tons with 5% waste. At 3 inches thick, the same driveway needs about 14.5 tons before waste.',
    },
    {
      q: 'How much does 1 ton of asphalt cover?',
      a: 'At 145 lb/ft³, one ton covers about 83 square feet at 2 inches thick, about 55 square feet at 3 inches, and about 41 square feet at 4 inches.',
    },
    {
      q: 'How do you figure asphalt tonnage?',
      a: 'Multiply the area in square feet by the thickness in inches and by the density in lb/ft³, then divide by 24,000. For example, 800 × 2 × 145 ÷ 24,000 = 9.67 tons.',
    },
    {
      q: 'How much does a cubic yard of asphalt weigh?',
      a: 'About 3,915 lb, or 1.96 tons, at 145 lb/ft³. Compacted millings are lighter, around 1.5 tons per cubic yard.',
    },
    {
      q: 'Should I add extra for compaction and waste?',
      a: 'The 145 lb/ft³ figure describes compacted asphalt and thickness should be the compacted thickness, so compaction is already in the math. Add 5–10% for an uneven base, edge spread and spillage. The calculator uses 5% by default.',
    },
    {
      q: 'How thick should an asphalt driveway be?',
      a: 'Most new residential driveways use about 2–3 inches of compacted asphalt over a prepared stone base. Heavier vehicles may need more. Confirm with your contractor or local requirements.',
    },
    {
      q: 'How much does it cost to asphalt a driveway?',
      a: "Material cost is the tons you order times your supplier's price per ton. A contractor's installed price is higher because it also includes excavation, base, grading, equipment, trucking and labor. Compare at least three written quotes.",
    },
    {
      q: 'What is the cost of an asphalt overlay?',
      a: 'It depends on the area, the overlay thickness (commonly 1.5–2 inches), your local price per ton, and any crack or drainage repairs needed first. Enter your area and thickness to get the tonnage, then add your price per ton.',
    },
    {
      q: 'Can I use this as an asphalt millings calculator?',
      a: "Yes. Select Millings to use a default density of 110 lb/ft³. Because millings weight varies with moisture and gradation, replace it with your supplier's figure when you have one.",
    },
    {
      q: 'Is bitumen the same as asphalt?',
      a: 'Bitumen is the sticky binder. Asphalt is the finished mix of bitumen and aggregate such as stone and sand. In everyday use the two words overlap, which is why this calculator can estimate both the mix and the binder in it.',
    },
  ] as FaqItem[],
  relatedCalculators: [
    { label: 'Cubic Yard Calculator', href: '/cubic-yard-calculator/', live: true },
    { label: 'Stone Calculator', href: '/stone-calculator/', live: false },
    { label: 'Sand Calculator', href: '/sand-calculator/', live: false },
    { label: 'Fill Dirt Calculator', href: '/fill-dirt-calculator/', live: false },
    { label: 'Tons to Cubic Yards Converter', href: '/tons-to-cubic-yards/', live: false },
    { label: 'Concrete Slab Cost Calculator', href: '/concrete-slab-cost-calculator/', live: false },
  ] as RelatedCalculatorLink[],
  aboutText:
    'KKCTools calculators use standard unit conversions and commonly used planning densities. Results are estimates for planning and quoting. They are not engineering, structural or pavement design advice. Always confirm quantities, density and thickness with your asphalt supplier or paving contractor. Last updated November 10, 2026.',
};

