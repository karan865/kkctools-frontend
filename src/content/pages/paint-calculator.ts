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

export const PAINT_FAQS: FaqItem[] = [
  {
    q: 'How much paint do I need for a 12x12 room?',
    a: 'For a standard 12 ft by 12 ft bedroom with 8-foot ceilings, you have approximately 384 gross square feet of wall area. Deducting one standard door (21 sq ft) and two windows (30 sq ft) leaves 333 net square feet. At standard smooth drywall coverage (380 sq ft per gallon), one coat requires 0.88 gallons (buy 1 gallon). For the recommended two coats, you need 1.75 gallons, meaning you should buy 2 gallons of paint.',
  },
  {
    q: 'How many gallons of paint for 1000 sq ft?',
    a: 'When painting 1,000 square feet of actual wall surface, you need approximately 2.5 to 2.9 gallons per coat at typical coverage rates (350 to 380 sq ft/gal), which equals 5 to 6 gallons for two coats. If 1,000 sq ft represents the floor living area of a home rather than wall area, the paintable wall surface is typically 2.0 to 2.5 times the floor area (around 2,000 to 2,500 sq ft of walls), requiring roughly 10 to 14 gallons for two complete coats. Use our multi-room calculator mode for an exact room-by-room takeoff.',
  },
  {
    q: 'How much does a quart of paint cover?',
    a: 'One quart of paint covers approximately 85 to 100 square feet with a single coat, which is exactly one-quarter of a standard gallon (350 to 400 sq ft). A quart is ideal for painting an accent wall, touching up baseboards, painting an interior door (which takes about 21 sq ft per side), or coating a small powder room.',
  },
  {
    q: 'How many coats of paint do I really need?',
    a: 'Two coats are the industry standard for interior walls to ensure uniform color depth, hide underlying drywall mud or minor scuffs, and create a durable, washable finish. One coat is generally only acceptable when refreshing walls with the exact same color and brand. Three coats may be required when transitioning from a dark saturated shade (such as navy or deep red) to a pale neutral or white.',
  },
  {
    q: 'Is it cheaper to paint a room yourself or hire a professional painter?',
    a: 'Painting yourself is significantly cheaper. DIY materials for a typical 12x12 to 14x12 room (2 gallons of mid-grade paint, tape, roller covers, tray liners) cost about $115 to $190 total. In contrast, hiring a professional painting contractor typically costs $330 to $830 for a 12x12 room ($1.00 to $2.50 per square foot of paintable surface), meaning DIYers save roughly 50% to 80% by supplying their own labor.',
  },
  {
    q: 'How much paint do I need for a ceiling?',
    a: 'Ceiling square footage equals the room length multiplied by room width. For a 12 ft by 12 ft room, the ceiling area is 144 square feet. Applying two coats requires 288 square feet of paint coverage (288 ÷ 380 ≈ 0.76 gallons), meaning you should buy 1 gallon of flat ceiling paint.',
  },
  {
    q: 'How much primer do I need?',
    a: 'Most dedicated stain-blocking latex primers cover roughly 250 to 400 square feet per gallon (the calculator uses 300 sq ft/gal as a safe default). For a 14x12 room with 365 sq ft of net walls plus a 168 sq ft ceiling (533 sq ft total surface), one coat of primer requires 533 ÷ 300 = 1.78 gallons, meaning you should buy 2 gallons of primer.',
  },
  {
    q: 'Is this paint cost calculator accurate?',
    a: 'This paint cost calculator uses a typical coverage figure of 350 to 380 sq ft per gallon for smooth drywall (the range most paint can labels print) and a typical retail price range of $30 to $65 per gallon, both of which you can edit. While actual results can vary slightly depending on wall porosity, roller nap thickness, and painter application technique, the calculated quantities provide a dependable, contractor-grade buying estimate. Always check your specific paint can label and obtain 2 to 3 written local contractor quotes.',
  },
];

export const RELATED_FINISHING_TOOLS: RelatedCalculatorLink[] = [
  {
    label: 'Square Footage Calculator',
    href: '/square-footage-calculator/',
    description: 'Calculate room area, surface square feet, multi-room projects, and material budget.',
    live: true,
  },
  {
    label: 'Linear Foot Calculator',
    href: '/linear-foot-calculator/',
    description: 'Convert baseboard trim, crown molding, and chair rail perimeters into linear feet.',
    live: true,
  },
  {
    label: 'Construction Estimate Template',
    href: '/construction-estimate-template/',
    description: 'Create itemized painting contractor bids, client estimates, and labor invoices.',
    live: true,
  },
];

