/**
 * "How this calculator works" content for every calculator page (SEO audit 2026-11-14, M5).
 *
 * Rules:
 * - Formulas and defaults must match the engine in src/lib/ (they are the same numbers the code uses).
 * - Only link sources that were checked to exist (2026-11-14). Where a default is a typical trade value with
 *   no single public source, say so plainly instead of inventing a citation.
 */

export interface MethodSource {
  label: string;
  url?: string;
  note?: string;
}

export interface CalculationMethod {
  formula: string[];
  defaults: { label: string; value: string }[];
  sources: MethodSource[];
}

const NIST: MethodSource = {
  label: 'NIST Special Publication 811, Guide for the Use of the International System of Units',
  url: 'https://www.nist.gov/pml/special-publication-811',
  note: 'unit conversion factors (1 yd³ = 27 ft³, 1 ft = 0.3048 m, 1 lb = 0.45359237 kg)',
};
const TYPICAL_DENSITY: MethodSource = {
  label: 'Typical loose (bulk) material weights used in the trade',
  note: 'no single published standard; quarry and supplier figures vary by about 10–20%, so enter your supplier’s weight when you have it',
};
const QUIKRETE: MethodSource = {
  label: 'QUIKRETE Concrete Mix (No. 1101) product data sheet',
  url: 'https://www.quikrete.com/pdfs/data_sheet-concrete%20mix%201101.pdf',
  note: 'bag yields: 40 lb = 0.30 ft³, 60 lb = 0.45 ft³, 80 lb = 0.60 ft³',
};

export const CALCULATION_METHODS: Record<string, CalculationMethod> = {
  'asphalt-calculator': {
    formula: [
      'Volume (ft³) = area (ft²) × thickness (in) ÷ 12',
      'Tons = volume × density (lb/ft³) ÷ 2,000, then × (1 + waste %)',
      'Cubic yards = volume ÷ 27',
    ],
    defaults: [
      { label: 'Compacted hot-mix asphalt density', value: '145 lb/ft³ (editable; millings use a lower value)' },
      { label: 'Waste', value: 'editable percentage' },
    ],
    sources: [NIST, { ...TYPICAL_DENSITY, label: 'Typical compacted hot-mix asphalt density (about 140–150 lb/ft³)' }],
  },
  'cubic-yard-calculator': {
    formula: [
      'Cubic feet = length × width × depth (all in feet); circles use π × r² × depth',
      'Cubic yards = cubic feet ÷ 27',
      'Weight = cubic yards × material density',
    ],
    defaults: [
      { label: 'Material densities', value: 'typical loose weights per material, shown in the material list and editable' },
      { label: 'Concrete bags', value: 'yields from the QUIKRETE data sheet' },
    ],
    sources: [NIST, QUIKRETE, TYPICAL_DENSITY],
  },
  'sand-calculator': {
    formula: [
      'Volume (yd³) = area × depth ÷ 27, then × (1 + waste %)',
      'Tons = yd³ × density (lb/yd³) ÷ 2,000',
      'Polymeric joint sand = joint length × joint width × joint depth',
    ],
    defaults: [
      { label: 'Sand density', value: 'dry 2,600 · damp 2,900 · wet 3,200 lb/yd³ (custom allowed)' },
      { label: 'Polymeric sand', value: '2,700 lb/yd³ (100 lb/ft³)' },
    ],
    sources: [NIST, TYPICAL_DENSITY],
  },
  'fill-dirt-calculator': {
    formula: [
      'Volume = area × depth (sloped areas use the average of the shallow and deep ends)',
      'Cubic yards = cubic feet ÷ 27, then × (1 + settling %)',
      'Tons = yd³ × density ÷ 2,000; truckloads = yd³ ÷ your truck capacity',
    ],
    defaults: [
      { label: 'Fill dirt density', value: '2,700 lb/yd³' },
      { label: 'Topsoil density', value: '2,200 lb/yd³ (custom allowed)' },
      { label: 'Settling / extra', value: 'editable 0–50%' },
    ],
    sources: [NIST, TYPICAL_DENSITY],
  },
  'linear-foot-calculator': {
    formula: [
      'Linear feet = sum of all piece lengths (converted to feet) × quantity, then × (1 + waste %)',
      'Square feet → linear feet: linear feet = square feet ÷ material width (in feet)',
    ],
    defaults: [{ label: 'Waste', value: 'editable percentage; price per linear foot optional' }],
    sources: [NIST],
  },
  'rafter-calculator': {
    formula: [
      'Rise = run × pitch ÷ 12 (pitch in inches of rise per 12 inches of run); run = half the span for a gable roof',
      'Rafter length = √(run² + rise²), plus the overhang measured along the slope',
      'Roof angle = arctan(rise ÷ run); this is the plumb-cut angle',
    ],
    defaults: [
      { label: 'Overhang', value: '0 in unless you enter one' },
      { label: 'Stock lengths', value: 'the next standard lumber length that covers the rafter' },
    ],
    sources: [
      { label: 'Right-triangle (Pythagorean) geometry', note: 'no material defaults are involved; always check member sizes and spans against your plans and local code' },
    ],
  },
  'square-footage-calculator': {
    formula: [
      'Rectangle = length × width · triangle = ½ × base × height · circle = π × r²',
      'Trapezoid = ½ × (base₁ + base₂) × height · L-shape = sum of its two rectangles',
      'Total = added areas − subtracted areas, then × (1 + waste %)',
    ],
    defaults: [
      { label: 'Metric conversion', value: '1 sq ft = 0.09290304 m² (exact)' },
      { label: 'Waste', value: '0, 5, 10, 15% or custom' },
    ],
    sources: [
      NIST,
      { label: 'ANSI Z765 (Square Footage — Method for Calculating)', note: 'the US standard for measuring house living area, summarised in the GLA section above' },
    ],
  },
  'cinder-block-calculator': {
    formula: [
      'Blocks = net wall area (in²) ÷ nominal block face (in²); an 8 × 16 in face is 128 in², so 1.125 blocks per ft²',
      'Net area = wall area − doors and windows; then × (1 + waste %)',
      'Core fill (ft³) = blocks × core volume per block × share of cores filled',
    ],
    defaults: [
      { label: 'Core volume per block', value: '4" 0.06 · 6" 0.17 · 8" 0.27 · 10" 0.38 · 12" 0.48 ft³ (typical hollow CMU)' },
      { label: 'Pre-blended mortar', value: '80 lb bag ≈ 13 blocks, 60 lb bag ≈ 9.75 blocks (typical; check your bag)' },
    ],
    sources: [
      {
        label: 'NCMA — Concrete Masonry Unit Shapes, Sizes, Properties and Specifications',
        url: 'https://ncma.org/resource/concrete-masonry-unit-shapes-sizes-properties-and-specifications/',
        note: 'nominal vs actual CMU sizes (8 × 8 × 16 nominal = 7⅝ × 7⅝ × 15⅝ in)',
      },
      { label: 'ASTM C90 (Standard Specification for Loadbearing Concrete Masonry Units)', note: 'the US product standard for hollow block' },
      NIST,
    ],
  },
  'brick-calculator': {
    formula: [
      'US: bricks per ft² = 144 ÷ ((brick length + joint) × (brick height + joint)), in inches',
      'Metric: bricks per m² = 1 ÷ ((length + joint) × (height + joint)), in metres',
      'Bricks = net wall area × bricks per unit area × wall thickness (× 2 for a double wythe / one-brick wall), then × (1 + waste %)',
    ],
    defaults: [
      { label: 'Mortar joint', value: '3/8 in (US) or 10 mm (metric)' },
      { label: 'US pre-blended mortar', value: '80 lb bag ≈ 35 modular bricks at 3/8 in, scaled for other sizes (typical; check your bag)' },
      { label: 'Metric mortar', value: 'joint volume per brick × bricks; bag count uses the yield printed on your bag' },
      { label: 'Pallet / pack size', value: '500 bricks (editable)' },
    ],
    sources: [
      {
        label: 'Brick Industry Association, Technical Note 10: Dimensioning and Estimating Brick Masonry',
        url: 'https://www.gobrick.com/media/file/10-dimensioning-and-estimating-brick-masonry.pdf',
        note: 'nominal sizes and the bricks-per-area method',
      },
      NIST,
    ],
  },
  'paint-cost-calculator': {
    formula: [
      'Wall area = room perimeter × wall height − doors − windows (+ ceiling if selected)',
      'Gallons = area × coats ÷ coverage per gallon; primer uses its own coverage',
      'Cost = gallons (split into gallons and quarts) × price + primer + sundries',
    ],
    defaults: [
      { label: 'Coverage per gallon', value: 'smooth 380 · orange peel 350 · heavy texture 300 · unprimed 250 · masonry 225 ft²' },
      { label: 'Primer coverage', value: '300 ft² per gallon' },
      { label: 'Deductions', value: 'door 21 ft², window 15 ft²' },
      { label: 'Prices', value: 'typical US retail ranges, editable' },
    ],
    sources: [
      { label: 'Coverage printed on paint can labels', note: 'most interior paints state about 350–400 ft² per gallon on smooth surfaces; use the figure on your can' },
    ],
  },
  'tile-calculator': {
    formula: [
      'Tiles = net area ÷ area of one tile (with its grout joint), then × (1 + waste %); boxes = tiles ÷ tiles per box',
      'Thin-set bags = net area ÷ coverage per 50 lb bag (set by tile size and trowel)',
      'Grout = joint volume (joint width × tile thickness × joint length) × about 100 lb/ft³ for sanded grout, +10%, in 25 lb bags',
    ],
    defaults: [
      { label: 'Thin-set coverage per 50 lb bag', value: 'tiles up to 8 in: 80 ft² · 8–15 in: 60 ft² · larger: 50 ft²' },
      { label: 'Waste', value: 'straight lay vs diagonal / herringbone presets, editable' },
    ],
    sources: [
      { label: 'Typical thin-set coverage printed on 50 lb mortar bags', note: 'coverage depends on trowel notch; follow your mortar’s data sheet' },
      NIST,
    ],
  },
  'laminate-flooring-calculator': {
    formula: [
      'Net area = sum of rooms; order area = net area × (1 + pattern waste %)',
      'Boxes = order area ÷ coverage per box (rounded up); underlayment rolls = net area ÷ roll coverage',
      'Moldings = room perimeter ÷ piece length, +10%',
    ],
    defaults: [
      { label: 'Coverage per box', value: '20 ft² (quick picks 18–24 ft²; read your box label)' },
      { label: 'Underlayment roll', value: '100 ft²' },
      { label: 'Molding piece length', value: '7.8 ft (about 94 in)' },
    ],
    sources: [{ label: 'Coverage printed on the flooring box and underlayment roll', note: 'always use the figure on your product' }],
  },
  'stone-calculator': {
    formula: [
      'Cubic yards = area × depth ÷ 27 (summed over all areas)',
      'Tons = cubic yards × tons per yd³, then × (1 + waste %)',
      'Bags = cubic feet ÷ bag size',
    ],
    defaults: [
      { label: 'Crushed stone / gravel', value: 'about 1.35–1.55 tons per yd³ by type (preset list, editable)' },
      { label: 'Mulch / light materials', value: 'much lighter (about 0.6 tons per yd³)' },
    ],
    sources: [NIST, TYPICAL_DENSITY],
  },
  'stud-calculator': {
    formula: [
      'Field studs = wall length (in) ÷ on-center spacing, rounded up, + 1 for the end stud',
      'Extras: + 2 per corner, + 2 per T-junction, + 4 per door or window (2 king + 2 jack)',
      'Plates = wall length × number of plate layers ÷ 16 ft stock boards',
    ],
    defaults: [
      { label: 'Spacing', value: '16 in or 24 in on center' },
      { label: 'Headers', value: '2 boards per rough opening' },
      { label: 'Plate stock', value: '16 ft boards' },
    ],
    sources: [
      { label: 'Common US platform-framing layout (16 or 24 in on center)', note: 'stud size, spacing and headers must follow your plans and local building code' },
    ],
  },
  'tons-to-cubic-yards': {
    formula: ['Cubic yards = tons × 2,000 ÷ density (lb/yd³)', 'Tons = cubic yards × density ÷ 2,000'],
    defaults: [
      { label: 'Crushed stone / road base', value: '2,800 lb/yd³' },
      { label: 'Topsoil', value: '2,200 lb/yd³' },
      { label: 'Compost', value: '1,300 lb/yd³ · mulch 800 lb/yd³ (all materials in the table above, editable)' },
    ],
    sources: [NIST, TYPICAL_DENSITY],
  },
  'paver-sand-calculator': {
    formula: [
      'Bedding sand (yd³) = area × bedding depth ÷ 27; tons = yd³ × 1.35',
      'Joint sand bags = area ÷ coverage per 50 lb bag (by paver style and joint width), then × (1 + buffer %)',
    ],
    defaults: [
      { label: 'Bedding depth', value: '1 in (0.75–1.25 in options)' },
      { label: 'Concrete sand density', value: '1.35 tons per yd³' },
      { label: 'Polymeric sand coverage', value: 'e.g. standard brick pavers: 85 ft² (1/8 in joint), 45 ft² (1/4 in), 25 ft² (1/2 in) per 50 lb bag' },
    ],
    sources: [
      { label: 'Polymeric sand coverage charts printed on the bag', note: 'coverage changes with joint width and paver size; follow your product' },
      NIST,
      TYPICAL_DENSITY,
    ],
  },
  'paver-base-calculator': {
    formula: [
      'Compacted volume (yd³) = area × base depth ÷ 27',
      'Loose volume to order = compacted volume × (1 + compaction %)',
      'Tons = loose yd³ × density; 0.5 ft³ bags = loose ft³ ÷ 0.5',
    ],
    defaults: [
      { label: 'Base depth', value: '4–10 in presets (walkways and patios thinner, driveways thicker)' },
      { label: 'Compaction allowance', value: '15% (0–20% options)' },
      { label: 'Base density', value: '1.40 tons per yd³ (editable)' },
    ],
    sources: [NIST, TYPICAL_DENSITY],
  },
  'compost-calculator': {
    formula: [
      'Volume (ft³) = area × depth (in) ÷ 12; cubic yards = ft³ ÷ 27',
      'Bags = ft³ ÷ bag size (1, 1.5 or 2 ft³), rounded up',
      'Weight = yd³ × density',
    ],
    defaults: [
      { label: 'Depth', value: '2 in top-dressing (editable)' },
      { label: 'Compost density', value: 'about 0.65 tons per yd³ (1,300 lb/yd³)' },
    ],
    sources: [NIST, TYPICAL_DENSITY],
  },
  'pipe-volume-calculator': {
    formula: [
      'Capacity (round) = π × (inside diameter ÷ 2)² × length; inside diameter = outside diameter − 2 × wall',
      'Tube wall volume = π ÷ 4 × (OD² − ID²) × length',
      'Rectangular tube: capacity = (W − 2t) × (H − 2t) × length; wall = (W × H − inner area) × length',
      'US gallons = cubic inches ÷ 231; litres = cubic inches × 0.016387064; imperial gallons = litres ÷ 4.54609',
      'Liquid weight = litres × density (kg/L); tube weight = wall volume × material density; fill time = litres ÷ flow rate',
    ],
    defaults: [
      { label: 'Steel & PVC Schedule 40/80', value: 'outside diameter and wall from ASME B36.10M (PVC to ASTM D1785 uses the same OD and walls for these sizes)' },
      { label: 'Copper Types K, L, M', value: 'ASTM B88: OD = nominal size + ⅛ in, wall per type' },
      { label: 'PEX', value: 'copper tube size OD, SDR 9 (wall = OD ÷ 9, at least 0.070 in) — ASTM F876' },
      { label: 'Metric PE', value: 'SDR 11 (e.g. 32 mm × 2.9 mm) — EN 12201 / ISO 4427' },
      { label: 'Liquid', value: 'water 1.0 kg/L, seawater 1.025 kg/L, or your own density' },
      { label: 'Material densities', value: 'steel 7,850 · stainless 8,000 · copper 8,940 · aluminium 2,700 · brass 8,500 · PVC 1,400 · HDPE 950 kg/m³ (typical)' },
    ],
    sources: [
      {
        label: 'Engineers Edge — Schedule 40 steel pipe dimensions (ASME B36.10M)',
        url: 'https://engineersedge.com/fluid_flow/steel-pipe-schedule-40.htm',
      },
      {
        label: 'Engineers Edge — Schedule 80 steel pipe dimensions (ASME B36.10M)',
        url: 'https://engineersedge.com/fluid_flow/steel-pipe-schedule-80.htm',
      },
      {
        label: 'The Engineering ToolBox — ASTM B88 seamless copper water tube dimensions',
        url: 'https://engineeringtoolbox.com/astm-copper-tubes-d_779.html',
      },
      { label: 'Material densities', note: 'typical handbook values; check the grade you are using' },
      NIST,
    ],
  },
  'board-and-batten-calculator': {
    formula: [
      'Battens at both edges: gap = (wall width − battens × batten width) ÷ (battens − 1)',
      'Gaps at both edges: gap = (wall width − battens × batten width) ÷ (battens + 1); inset: use wall width − 2 × margin with the both-edges formula',
      'From a target gap: battens = round((wall width − batten width) ÷ (batten width + target gap)) + 1, then every gap is made equal',
      'Mark for batten k (k = 0, 1, 2…) = start + k × (batten width + gap); on center = gap + batten width',
      'Batten length = wall height − top rail − baseboard; grid rail rows split that height into equal gaps',
      'Boards = cut list packed into the stock length (longer pieces joined), plus waste; siding boards = (wall + gap) ÷ (board + gap), rounded up; battens = boards − 1',
    ],
    defaults: [
      { label: 'Lumber widths', value: 'nominal 1×2 = 1½ in, 1×3 = 2½ in, 1×4 = 3½ in, 1×6 = 5½ in, 1×8 = 7¼ in, ¾ in thick (dry dressed sizes)' },
      { label: 'Target gap', value: '16 in to start — spacing is a style choice; compare counts in the tool' },
      { label: 'Stock length / waste', value: '8 ft boards, 10% waste' },
      { label: 'Adhesive and caulk', value: 'about 30 ft of ¼ in bead and 120 ft of ⅛ in bead per 10 oz tube (bead volume ÷ tube volume)' },
      { label: 'Paint', value: '350 sq ft per gallon, 2 coats, wall plus board edges' },
      { label: 'Nails', value: '2 brad nails every 16 in along each piece (working assumption)' },
    ],
    sources: [
      {
        label: 'American Softwood Lumber Standard, NIST Voluntary Product Standard PS 20',
        url: 'https://www.nist.gov/document/doc-ps-20-20-american-softwood-lumber-standard',
        note: 'nominal vs dry dressed lumber sizes',
      },
      {
        label: 'Southern Pine Inspection Bureau — Nominal vs actual lumber sizes',
        url: 'https://blog.spib.org/nominal-vs-actual-lumber-sizes/',
        note: 'a nominal 1×6 is ¾ in thick and 5½ in wide',
      },
      { label: 'Paint coverage', note: 'printed on the can; most interior paints list about 350–400 sq ft per gallon' },
      NIST,
    ],
  },
  'shingle-calculator': {
    formula: [
      'Slope factor = √(1 + (rise ÷ 12)²); roof area = (length + 2 × overhang) × (width + 2 × overhang) × slope factor',
      'Squares = roof area ÷ 100; bundles = squares × (1 + waste %) × bundles per square, rounded up',
      'Gable edges: eaves = 2 × length, rakes = 4 × half-width × slope factor, ridge = length. Hip: eaves all round, ridge = long − short side, hip = √(2 × run² + (run × rise ÷ 12)²)',
      'Starter bundles = (eaves + rakes) ÷ feet per bundle; ridge cap bundles = (ridge + hips) ÷ feet per bundle; drip edge pieces = (eaves + rakes) ÷ piece length — all rounded up',
      'Ice & water area = eaves × rows × 3 ft + valleys × 3 ft; underlayment rolls = (roof area − ice & water area) ÷ coverage per roll',
      'Nails = squares with waste × shingles per square × nails per shingle',
    ],
    defaults: [
      { label: 'Architectural shingles', value: '3 bundles and 64 pieces per square, 5⅝ in exposure (GAF Timberline HDZ data sheet)' },
      { label: '3-tab shingles', value: '12 × 36 in, 5 in exposure: 3 bundles and 80 shingles per square (Owens Corning Supreme)' },
      { label: 'Starter strip / ridge cap', value: '105 ft per starter bundle (OC Starter Strip Plus); 33 ft per hip & ridge bundle (OC ProEdge, 6 in exposure)' },
      { label: 'Underlayment', value: 'synthetic ≈ 1,000 sq ft, #15 felt ≈ 400 sq ft, #30 felt ≈ 200 sq ft per roll after laps; ice & water barrier 200 sq ft (36 in × 66.7 ft) per roll' },
      { label: 'Waste', value: '10% simple gable, 15% hip, 20% complex roofs — typical trade allowances, not a standard; change them to suit your roof' },
      { label: 'Nails', value: '4 per shingle (6 in high-wind areas when the wrapper calls for it)' },
    ],
    sources: [
      {
        label: 'GAF Timberline HDZ shingles specification sheet',
        url: 'https://www.gaf.com/en-us/document-library/documents/specifications/timberline-hdz-shingles-spec-sheet-resgn467hdz.pdf',
        note: 'exposure 5⅝ in, 3 bundles and 64 pieces per square',
      },
      {
        label: 'Owens Corning Supreme shingles product page',
        url: 'https://owenscorning.com/roofing/shingles/supreme',
        note: '12 × 36 in at 5 in exposure: 80 shingles and 3 bundles per 100 sq ft square',
      },
      {
        label: 'Owens Corning Starter Strip Plus product page',
        url: 'https://owenscorning.com/roofing/products/starter-strip-plus',
        note: 'about 105 lineal feet per bundle',
      },
      {
        label: 'Owens Corning ProEdge Hip & Ridge data sheet',
        url: 'https://www.owenscorning.com/en/documents/uploads/proedge-hip-and-ridge-shingle-data-sheet',
        note: '33 ft of coverage per bundle at 6 in exposure',
      },
      { label: 'Underlayment roll coverage', note: 'typical net coverage printed on roll labels; check your product' },
      NIST,
    ],
  },
  'lawn-mowing-cost-calculator': {
    formula: [
      'Acres per hour = mower width (ft) × speed (mph) × 5,280 × efficiency ÷ 43,560',
      'Mowing minutes = acres ÷ acres per hour × 60 × grass × slope × obstacle × frequency factors',
      'Minutes per visit = mowing + extras (trim, edge, blow, bagging) + setup + drive time',
      'Price per visit = the larger of the minimum charge and minutes ÷ 60 × hourly rate',
      'Visits = season weeks × 7 ÷ days between cuts (rounded); season = price per visit × visits; month = season ÷ (weeks ÷ 4.33)',
    ],
    defaults: [
      { label: 'Hourly rate', value: '$50 (presets $32 / $50 / $68), inside the $30–$68 per hour range published by Jobber and Housecall Pro in 2026' },
      { label: 'Minimum charge', value: '$35, near the low end of published per-visit prices for the smallest lawns; set your own' },
      { label: 'Drive + setup time', value: '12 + 8 minutes per visit (working assumption)' },
      { label: 'Mowers', value: '21 in push 3 mph · 36 in walk-behind 4 mph · 48 in / 60 in zero-turn 6 / 7 mph; 75–80% efficiency (working assumptions)' },
      { label: 'Condition factors', value: 'long grass ×1.25, overgrown ×1.5; some slope ×1.15, steep ×1.35; some obstacles ×1.1, many ×1.25; every 10 days ×1.1, every 2 weeks ×1.2, monthly ×1.4 (working assumptions)' },
      { label: 'Season', value: '30 weeks (about April–October)' },
    ],
    sources: [
      {
        label: 'Jobber Academy — How much to charge for lawn mowing (updated March 2026)',
        url: 'https://getjobber.com/academy/lawn-care/how-to-price-out-lawn-care-services/',
        note: '“between $30 and $65 per hour for lawn care”',
      },
      {
        label: 'Housecall Pro — How much to charge for lawn mowing (updated October 2026)',
        url: 'https://www.housecallpro.com/resources/how-much-charge-lawn-mowing/',
        note: '“$32–$68 per hour for lawn mowing”; per-visit ranges by lawn size used to check the model',
      },
      {
        label: 'Mower productivity and condition factors',
        note: 'no single published standard; the physics (width × speed) is exact, the efficiency and factors are working assumptions — change them to match your crew',
      },
      NIST,
    ],
  },
  'fence-stain-calculator': {
    formula: [
      'Area = fence length × height × sides × style multiplier (board-on-board, shadowbox, etc.)',
      'Coat 1 gallons = area ÷ coverage for your wood; coat 2 uses 1.3 × that coverage',
      'Add 10% for brush / roller or 15% for a sprayer; split into 5-gallon pails and 1-gallon cans',
    ],
    defaults: [
      { label: 'Coverage per gallon (coat 1)', value: 'rough-sawn 175 · weathered 150 · smooth-planed 225 ft²' },
      { label: 'Second coat', value: 'covers about 30% more area per gallon' },
    ],
    sources: [{ label: 'Coverage printed on stain can labels', note: 'rough and weathered wood absorbs more; use your product’s range' }],
  },
  'construction-estimate-template': {
    formula: [
      'Line total = quantity × unit price',
      'Subtotal = sum of line totals; markup = subtotal × markup %',
      'Tax = taxable amount × tax %; grand total = subtotal + markup + tax',
    ],
    defaults: [{ label: 'Markup and tax', value: 'you enter your own rates; nothing is preset for your area' }],
    sources: [{ label: 'Plain arithmetic', note: 'no outside data; check tax rules for your state or country' }],
  },
};
