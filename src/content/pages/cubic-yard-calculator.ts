export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedCalculatorLink {
  label: string;
  href: string;
  live: boolean;
}

export const CUBIC_YARD_PAGE_COPY = {
  h1: 'Cubic Yard Calculator: How Many Yards Do You Need?',
  introText:
    'Use this free cubic yard calculator to find the volume of a slab, footing, wall, column or any box-shaped space in cubic yards. For concrete, it also shows how many 40, 50, 60 and 80 lb bags you need and what the pour weighs. Add a section for each part of your project and they are totaled for you, so it works as a concrete calculator in yards and as a general yardage calculator for soil, mulch and gravel.',
  quickAnswer: 'cubic yards = length (ft) × width (ft) × depth (ft) ÷ 27. One cubic yard is 27 cubic feet.',
  trustLine: 'Estimates only · 1 cubic yard = 27 ft³ · Last updated November 10, 2026',
  toolH2: 'Cubic Yard and Concrete Volume Calculator',
  toolFootnote:
    'Results are planning estimates. Check your bag label for its yield and ask your ready-mix supplier about minimum loads before you order.',
  shapeTable: [
    { shape: 'Slab, patio or driveway', formula: 'length × width × thickness ÷ 27', example: '10 × 12 ft, 4 in thick → 1.48 yd³' },
    { shape: 'Footing or trench', formula: 'run length × width × depth ÷ 27', example: '100 ft, 16 in wide, 8 in deep → 3.29 yd³' },
    { shape: 'Wall', formula: 'length × height × thickness ÷ 27', example: '20 ft long, 4 ft high, 8 in thick → 1.98 yd³' },
    { shape: 'Round column, pier or post hole', formula: 'π × (diameter ÷ 2)² × height ÷ 27', example: '4 columns, 12 in across, 4 ft tall → 0.47 yd³' },
  ],
  conversionTable: [
    { unit: 'Cubic feet', value: '27 ft³' },
    { unit: 'Cubic inches', value: '46,656 in³' },
    { unit: 'Cubic meters', value: '0.7646 m³' },
    { unit: 'Liters', value: 'about 764.6 L' },
    { unit: 'US gallons', value: 'about 202 gal' },
  ],
  bagTable: [
    { size: '40 lb', yield: '0.30 ft³ (0.011 yd³)', bagsPerYard: '90' },
    { size: '50 lb', yield: '0.375 ft³ (0.014 yd³)', bagsPerYard: '72' },
    { size: '60 lb', yield: '0.45 ft³ (0.017 yd³)', bagsPerYard: '60' },
    { size: '80 lb', yield: '0.60 ft³ (0.022 yd³)', bagsPerYard: '45' },
  ],
  commonSlabTable: [
    { size: '10 × 10 ft', d4: '1.23 yd³', d6: '1.85 yd³' },
    { size: '12 × 12 ft', d4: '1.78 yd³', d6: '2.67 yd³' },
    { size: '10 × 20 ft', d4: '2.47 yd³', d6: '3.70 yd³' },
    { size: '20 × 20 ft', d4: '4.94 yd³', d6: '7.41 yd³' },
    { size: '24 × 24 ft', d4: '7.11 yd³', d6: '10.67 yd³' },
  ],
  faqs: [
    {
      q: 'How do you calculate cubic yards?',
      a: 'Multiply length × width × depth in feet to get cubic feet, then divide by 27. For a slab you can use length (ft) × width (ft) × thickness (in) ÷ 324.',
    },
    {
      q: 'How many cubic yards is a 10 × 10 slab that is 4 inches thick?',
      a: 'About 1.23 cubic yards, or about 1.36 yd³ with 10% waste added.',
    },
    {
      q: 'How many bags of concrete make a yard?',
      a: 'About 45 bags of 80 lb mix, 60 bags of 60 lb mix, 72 bags of 50 lb mix, or 90 bags of 40 lb mix, based on typical yields.',
    },
    {
      q: 'How much does a cubic yard of concrete weigh?',
      a: 'About 4,050 lb, or roughly 2 tons, for normal-weight concrete at 150 lb/ft³.',
    },
    {
      q: 'How many cubic feet are in a cubic yard, and how do I convert?',
      a: 'There are 27 cubic feet in a cubic yard. Divide cubic feet by 27 to get cubic yards. For example, 100 ft³ ÷ 27 = 3.70 yd³.',
    },
    {
      q: 'How do I calculate concrete yards for a footing?',
      a: 'Multiply the total footing length by its width and depth (all in feet), then divide by 27. A 100 ft run that is 16 in wide and 8 in deep needs about 3.29 yd³. Ask your building department or an engineer for the required footing size.',
    },
    {
      q: 'How much extra concrete should I order?',
      a: 'Most people add 5–10% for uneven subgrade, spillage and over-excavation. The calculator uses 10% for concrete by default, and you can change it.',
    },
    {
      q: 'Is it cheaper to use bags or ready-mix?',
      a: 'For small jobs, bags are usually easier. As the volume grows, ready-mix usually becomes the better choice, because 45 bags per yard means a lot of lifting and mixing. Compare current local prices, delivery fees and short-load fees before you decide.',
    },
    {
      q: 'How many square feet does a cubic yard of concrete cover?',
      a: 'About 81 square feet at 4 inches thick and about 54 square feet at 6 inches thick.',
    },
    {
      q: 'Can I use this calculator for soil, mulch or gravel?',
      a: "Yes. Switch Material to Other to get cubic yards without bag counts. To find the weight, enter your material's density in the advanced options.",
    },
  ] as FaqItem[],
  relatedCalculators: [
    { label: 'Asphalt Calculator', href: '/asphalt-calculator/', live: true },
    { label: 'Concrete Slab Cost Calculator', href: '/concrete-slab-cost-calculator/', live: false },
    { label: 'Fill Dirt Calculator', href: '/fill-dirt-calculator/', live: true },
    { label: 'Sand Calculator', href: '/sand-calculator/', live: true },
    { label: 'Stone Calculator', href: '/stone-calculator/', live: true },
    { label: 'Tons to Cubic Yards Converter', href: '/tons-to-cubic-yards/', live: true },
  ] as RelatedCalculatorLink[],
  aboutText:
    'KKCTools calculators use standard unit conversions and commonly used planning figures. Results are estimates for planning and ordering. They are not engineering, structural or building-code advice. Always confirm quantities, bag yields, footing sizes and delivery terms with your supplier, building department or a qualified professional. Last updated November 10, 2026.',
};

