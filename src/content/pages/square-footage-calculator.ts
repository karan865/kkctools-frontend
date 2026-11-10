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

export interface SquareFootageContent {
  hero: {
    badge: string;
    title: string;
    description: string;
  };
  sections: PageSection[];
  faqs: FaqItem[];
  relatedCalculators: RelatedCalculatorLink[];
}

export const squareFootagePageContent: SquareFootageContent = {
  hero: {
    badge: 'Measurement & Area Estimator',
    title: 'Square Footage Calculator (SqFt Calculator)',
    description:
      'Use this free sqft calculator to accurately calculate the square footage of any room, home, flooring, or landscaping project. Whether you are measuring a single rectangular bedroom, calculating total square footage for an entire multi-room house, or determining material needs for odd circular and triangular spaces, our tool provides instant square feet calculations, unit conversions, and cost estimates.',
  },
  sections: [
    {
      heading: 'How to Use the Square Footage Calculator',
      paragraphs: [
        'Our square footage calculator is designed to handle everything from simple DIY home improvement tasks to complex architectural estimates with multi-room layouts and odd geometric shapes.',
        '1. Select Your Mode: Choose Single Area for quick one-off measurements, Multiple Rooms to sum up living areas and bedrooms for an entire house, or Odd Shapes for triangles, circles, semi-circles, trapezoids, and L-shaped spaces.',
        '2. Choose Your Measurement Units: Enter dimensions in feet, inches, feet and inches (e.g. 10 ft 6 in), yards, meters, or centimeters. The tool automatically converts mixed units to decimal feet.',
        '3. Input Dimensions: Enter the length and width of the space. For odd shapes, enter base, height, or radius as prompted.',
        '4. Apply a Waste Factor (Recommended): Standard flooring, tile, carpet, and turf installations require cutting and trimming. Select 10% for standard layouts or 15% for diagonal, herringbone patterns, or irregular perimeters.',
        '5. Add Material Cost (Optional): Enter the price per square foot or square meter to see your total project material budget with and without waste.',
        '6. Review and Copy Results: Get your total area in square feet (sq ft), square meters (m²), square yards (sq yd), and square inches (sq in), plus total perimeter linear footage for trim and baseboards.',
      ],
    },
    {
      heading: 'What Is Square Footage and Why Does It Matter?',
      paragraphs: [
        'Square footage (abbreviated as sq ft or ft²) is the standard imperial unit of measurement used primarily in the United States, Canada, and the United Kingdom to measure two-dimensional surface area. One square foot is defined as the area enclosed within a square whose sides each measure exactly one linear foot (12 inches).',
        'In residential construction, real estate, and home remodeling, square footage is the universal metric used to determine property valuations and home listing prices, estimate flooring materials (hardwood, laminate, vinyl plank, tile, and carpet), calculate paint and primer coverage, and plan concrete slabs, patios, and landscaping turf.',
      ],
    },
    {
      heading: 'How to Calculate Square Feet (Formulas by Shape)',
      paragraphs: [
        'When calculating square feet manually, the mathematical formula depends on the geometric shape of the space. Below are the standard mathematical formulas for all common room geometries.',
      ],
      subsections: [
        {
          heading: '1. Rectangular or Square Spaces',
          paragraphs: [
            'The vast majority of rooms, walls, and patios are rectangles or squares.',
            'Formula: Square Footage = Length (feet) × Width (feet)',
            'Worked Example: A rectangular master bedroom measuring 20 feet long by 12 feet wide has an area of 20 × 12 = 240 sq ft.',
          ],
        },
        {
          heading: '2. How to Work Out Square Feet of an L-Shaped Room',
          paragraphs: [
            'Irregular L-shaped living rooms or open floor plans should be split into two separate rectangular boxes (Section A and Section B) using this square foot calculator method.',
            'Step 1: Measure Section A (e.g., 10 ft × 12 ft = 120 sq ft).',
            'Step 2: Measure Section B (e.g., 8 ft × 14 ft = 112 sq ft).',
            'Step 3: Sum the two areas together: 120 + 112 = 232 sq ft total.',
            'Wondering how to figure out square footage for rooms with closet alcoves? Simply measure the closet separately and add it to the main room.',
          ],
        },
        {
          heading: '3. Triangular Areas and Gable Roofs',
          paragraphs: [
            'For triangular spaces, attic gables, or angled patio corners:',
            'Formula: Square Footage = (Base in feet × Height in feet) / 2',
            'Worked Example: A triangular patio corner with an 18-foot base and a 10-foot height equals (18 × 10) / 2 = 90 sq ft.',
          ],
        },
        {
          heading: '4. Circular and Semi-Circular Spaces (Patios & Fire Pits)',
          paragraphs: [
            'For round areas such as circular patios, above-ground pools, or fire pit surrounds:',
            'Formula: Square Footage = π × Radius²',
            'Tip: The radius is half of the total diameter across the circle. For a 14-foot round patio (radius = 7 ft), the square footage is 3.14159 × 7² = 3.14159 × 49 ≈ 153.94 sq ft. For a semi-circle, simply divide this result by 2 (76.97 sq ft).',
          ],
        },
        {
          heading: '5. Trapezoid Spaces (Slanted Walls & Yards)',
          paragraphs: [
            'For trapezoid spaces with two parallel walls of unequal lengths:',
            'Formula: Square Footage = ((Base 1 + Base 2) / 2) × Height',
            'Worked Example: A yard with parallel sides of 14 ft and 20 ft separated by a perpendicular depth of 12 ft equals ((14 + 20) / 2) × 12 = 17 × 12 = 204 sq ft.',
          ],
        },
      ],
    },
    {
      heading: 'How to Calculate Square Footage for Multiple Rooms (Full House)',
      paragraphs: [
        'When planning flooring or painting for an entire house, calculating room by room prevents costly ordering errors. In our tool, click "+ Add Room" to record each space separately.',
        'Practical Multi-Room Example for Luxury Vinyl Plank (LVP) Flooring:',
        '• Living Room: 18 ft × 14 ft = 252 sq ft',
        '• Master Bedroom: 15 ft × 13 ft = 195 sq ft',
        '• Guest Bedroom: 12 ft × 11 ft = 132 sq ft',
        '• Hallway: 3.5 ft × 16 ft = 56 sq ft',
        'Net Total Area = 252 + 195 + 132 + 56 = 635 sq ft.',
        'With a 10% Waste Factor: 635 × 1.10 = 698.5 sq ft (order 700 sq ft).',
        'At an estimated material cost of $3.25 per sq ft: 700 × $3.25 = $2,275.00 total material budget.',
      ],
    },
    {
      heading: 'Quick Area and Unit Conversion Reference',
      paragraphs: [
        'Use this quick reference guide to convert between square feet and other imperial or metric area measurements:',
        '• 1 Square Foot = 144 Square Inches',
        '• 1 Square Yard = 9 Square Feet (Multiply sq yd by 9 to get sq ft; divide sq ft by 9 to get sq yd)',
        '• 1 Square Meter = 10.7639 Square Feet (Multiply m² by 10.764 to get sq ft; multiply sq ft by 0.0929 to get m²)',
        '• 1 Acre = 43,560 Square Feet',
        '• 1 Square Mile = 27,878,400 Square Feet (640 Acres)',
      ],
    },
  ],
  faqs: [
    {
      q: 'How do you figure out square footage of a room?',
      a: 'To figure out square footage of a rectangular room, measure the length and width of the room in feet using a tape measure, then multiply the two numbers together: Length (ft) × Width (ft) = Square Footage (sq ft). For example, a 12 ft by 15 ft room equals 180 square feet.',
    },
    {
      q: 'How do you figure square footage if measurements are in inches?',
      a: 'If your measurements are in inches, multiply Length (inches) × Width (inches) to get total square inches. Then divide that result by 144 (since there are 144 square inches in one square foot). For example, a countertop measuring 96 inches by 36 inches = 3,456 sq inches ÷ 144 = 24 square feet.',
    },
    {
      q: 'How is square footage calculated for an L-shaped or irregular room?',
      a: 'To calculate the square footage of an L-shaped room, divide the space into two separate rectangular sections (Section A and Section B). Measure the length and width of each section to find their individual areas, then add the two areas together: Total Sq Ft = Area A + Area B.',
    },
    {
      q: 'How much waste percentage should I add for flooring or tile?',
      a: 'For standard rectangular rooms with straight tile, laminate, or hardwood planks, add a 10% waste factor. For rooms with diagonal layouts, herringbone patterns, or many curved cuts, add a 15% to 20% waste allowance.',
    },
    {
      q: 'How do you convert square feet to square meters (sq ft to sq meters)?',
      a: 'To convert square feet to square meters, multiply the square footage by 0.092903 (or divide by 10.764). For instance, a 500 sq ft apartment is approximately 46.45 square meters.',
    },
    {
      q: 'How do I convert square feet to linear feet?',
      a: 'To convert square feet to linear feet, you must know the width of the material: Linear Feet = Square Feet / Material Width in Feet. For example, if you have 100 square feet of flooring made from 6-inch (0.5 ft) wide planks, you need 100 / 0.5 = 200 linear feet. Use our companion Linear Foot Calculator for instant conversions.',
    },
    {
      q: 'How do real estate agents calculate house square footage?',
      a: 'In US residential real estate, Gross Living Area (GLA) square footage only includes finished, heated, and air-conditioned above-grade living spaces. Unfinished basements, garages, open decks, and attics with ceiling heights below 7 feet are generally excluded from official listing square footage.',
    },
  ],
  relatedCalculators: [
    {
      label: 'Linear Foot Calculator',
      href: '/linear-foot-calculator/',
      live: true,
    },
    {
      label: 'Cubic Yard Calculator',
      href: '/cubic-yard-calculator/',
      live: true,
    },
    {
      label: 'Asphalt Calculator',
      href: '/asphalt-calculator/',
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

