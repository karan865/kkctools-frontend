export interface ConstructionEstimateFaqItem {
  q: string;
  a: string;
}

export const CONSTRUCTION_ESTIMATE_COPY = {
  h1: 'Free Construction Estimate Template',
  subtitle:
    'Generate detailed, accurate, and professional construction estimates right in your browser. Calculate material costs, labor hours, subcontractor fees, permits, and tax with zero network tracking, print directly to PDF, or export to CSV without creating an account.',
  introText:
    'Whether you are an independent general contractor, a residential remodeling specialist, a commercial builder, or a trades professional preparing bids, having a reliable construction estimate template is crucial for winning profitable projects. A clear and comprehensive estimate establishes credibility with project owners, prevents costly scope disputes, and protects your profit margins before the first hammer swings.',
  
  whatIsSection: {
    heading: 'What Is a Construction Estimate?',
    p1: 'A construction estimate is a comprehensive calculation of the projected total expenses required to complete a building, renovation, or specialty trade project according to defined architectural specifications. It translates architectural drawings, site assessments, and client requirements into concrete cost categories including raw building materials, direct skilled and general labor, heavy equipment rentals, specialized trade subcontractors, municipal building permits, and project overhead.',
    p2: 'In modern construction management, an estimate is far more than a simple ballpark price tag. It functions as the financial blueprint for project delivery, risk mitigation, and procurement planning. Accurate project cost estimating helps contractors submit competitive bids while maintaining target profit margins, helps financial lenders underwrite construction financing, and gives property owners the transparency they need to authorize capital investments with confidence.',
    p3: 'Estimating accuracy directly dictates contracting solvency. Underestimating project costs leads to cash flow shortages, cut corners, and painful out-of-pocket losses, while overestimating inflates your proposals and hands lucrative contracts to your competitors. A disciplined construction estimate format balances thorough line-item detail with realistic contingency allowances to withstand supply chain volatility and unexpected jobsite complications.',
  },

  howToUseSection: {
    heading: 'How to Use This Free Estimate Builder',
    intro: 'This interactive estimate builder allows you to assemble, customize, and export professional estimates in minutes without spreadsheets or complex software subscriptions. Follow these simple steps:',
    steps: [
      {
        title: 'Enter Project and Client Details',
        description: 'Fill in your project name, physical jobsite address, customer billing information, estimate reference code, and date. Use the validity period field to establish an expiration timeframe (typically 30 days) to protect your pricing against fluctuating wholesale material costs.',
      },
      {
        title: 'Add Your Company Branding (Optional)',
        description: 'Expand the Company Information drawer to enter your contracting business name, phone number, physical office address, email address, and contractor license or registration number. This information saves automatically in your browser for future estimates.',
      },
      {
        title: 'Populate Line Items and Scope of Work',
        description: 'Add individual cost line items for each component of the project. Assign each item to a standardized category (Materials, Labor, Equipment, Subcontractor, Permits & Fees, Overhead, or Other). Select relevant measurement units—such as square feet, linear feet, hours, days, cubic yards, or lump sums—and enter realistic unit rates.',
      },
      {
        title: 'Apply Tax Rates and Profit Markup',
        description: 'Configure your local municipal sales or value-added tax rate alongside your target overhead and profit markup percentage. The tool dynamically updates line totals, category subtotals, calculated taxes, and the final grand total in real time.',
      },
      {
        title: 'Document Scope Terms and Exclusions',
        description: 'Use the Notes & Payment Terms section to articulate payment milestones (e.g., 30% initial deposit, 40% rough-in completion, 30% final punch-list approval), project warranties, change-order protocols, and explicit site condition exclusions.',
      },
      {
        title: 'Export to PDF, CSV, or Text',
        description: 'Click "Print to PDF" to generate an impeccably styled client-facing estimate sheet formatted for standard US Letter or A4 paper. You can also export structured spreadsheet data via CSV for recordkeeping or download a plain text copy for your work records.',
      },
    ],
  },

  whatToIncludeSection: {
    heading: 'What to Include in a Construction Estimate',
    intro: 'A legally sound and professionally respected construction estimate template must incorporate explicit information to protect both the contractor and property owner from misunderstandings. Ensure your estimates consistently detail the following essential elements:',
    elements: [
      {
        name: 'Header Information & Legal Identification',
        details: 'Full contractor or business legal name, verified state contractor license number, business insurance identifier, primary telephone number, email, and physical office address alongside complete client contact information.',
      },
      {
        name: 'Defined Project Identification & Jobsite Location',
        details: 'A unique estimate reference number, issue date, estimate expiration date (validity window), and the physical street address where the construction or remodeling activity will take place.',
      },
      {
        name: 'Granular Scope of Work & Specifications',
        details: 'Clear, exhaustive itemization of every major task, architectural phase, and installation milestone. Avoid vague line items like "bathroom work"; specify exact material grades, dimensions, fixture counts, and installation protocols.',
      },
      {
        name: 'Categorized Direct Costs (Materials & Labor)',
        details: 'Segregated subtotals for raw building materials, consumable supplies, direct skilled carpenter/mason/electrician hours, and general laborer hours with transparent unit counts and hourly rates.',
      },
      {
        name: 'Indirect Costs (Equipment, Permits & Subcontractors)',
        details: 'Specialized machine rentals (excavators, scissor lifts, dumpsters), structural engineer review fees, municipal plan-check and building inspection permits, and specialized licensed trade subcontractors.',
      },
      {
        name: 'Transparent Markup, Contingencies & Local Taxes',
        details: 'Clearly articulated general contractor overhead and profit margin, project contingency reserve allowances for unforeseen structural defects, and statutory state or municipal sales taxes.',
      },
      {
        name: 'Payment Milestones & Financial Schedule',
        details: 'A structured payment schedule tied to verifiable completion stages rather than arbitrary calendar dates (such as mobilization deposit, foundation pour, mechanical rough-in inspection, and final lien waiver handover).',
      },
      {
        name: 'Terms, Conditions & Scope Exclusions',
        details: 'Explicit statements regarding what is NOT included in the price (e.g., hazardous asbestos or lead abatement, unforeseen underground bedrock, rock excavation, rot remediation behind drywall), along with change-order rate schedules and formal signature acceptance blocks.',
      },
    ],
  },

  comparisonSection: {
    heading: "Construction Estimate vs. Quote vs. Bid — What's the Difference?",
    intro: 'While many clients and inexperienced contractors use the terms "estimate", "quote", and "bid" interchangeably, they represent distinct legal, operational, and financial commitments in the construction industry.',
    tableHeaders: ['Factor', 'Estimate', 'Quote / Proposal', 'Bid / Tender'],
    rows: [
      {
        factor: 'Definition',
        estimate: 'An educated calculation of anticipated project costs based on preliminary scope or early drawings.',
        quote: 'A firm, fixed-price offer to execute defined deliverables within a specified time window.',
        bid: 'A formal competitive submission to secure a specific commercial or public tender contract.',
      },
      {
        factor: 'Legal Binding',
        estimate: 'Non-binding ballpark figure subject to revision as discovery reveals site conditions.',
        quote: 'Legally binding once signed and accepted by the client within the stated expiration timeframe.',
        bid: 'Strictly binding legal obligation; often accompanied by bid bonds and formal penalty clauses.',
      },
      {
        factor: 'Cost Adjustments',
        estimate: 'Flexible; final invoices can fluctuate higher or lower depending on actual labor and material consumption.',
        quote: 'Fixed; contractor absorbs unexpected cost increases unless formal change orders are authorized.',
        bid: 'Rigid; contract price remains locked per tender documents with liquidated damages for delays.',
      },
      {
        factor: 'When to Use',
        estimate: 'Early conceptual phases, feasibility studies, homeowner exploratory budgeting, and preliminary consultations.',
        quote: 'When project blueprints, material selections, and site surveys are finalized with zero ambiguities.',
        bid: 'Public works tenders, government solicitations, and competitive commercial subcontractor selections.',
      },
    ],
    summary: 'Using an accurate construction estimate template during early client consultations allows you to establish realistic budgets without legally trapping your contracting business into unforeseen cost spikes or site anomalies before architectural drawings are finalized.',
  },

  tipsSection: {
    heading: 'Tips for Accurate Construction Estimates',
    tips: [
      {
        title: '1. Conduct Thorough Jobsite Pre-Walks',
        body: 'Never estimate a project solely from photographs or rough telephone descriptions. Physical walkthroughs allow you to inspect structural access bottlenecks, electrical panel capacities, existing plumbing supply lines, framing plumb, and subfloor conditions that could sabotage your budget.',
      },
      {
        title: '2. Verify Current Supplier Price Sheets',
        body: 'Lumber, copper, structural steel, and petroleum-based roofing supplies experience seasonal and inflationary price shifts. Call your local building material suppliers or lumber yards to lock in volume trade pricing rather than relying on outdated retail catalog figures.',
      },
      {
        title: '3. Calculate Realistic Burdened Labor Rates',
        body: 'A common contractor error is calculating labor using raw employee take-home pay. Your true labor burden must incorporate employer payroll taxes, workers compensation insurance premiums, general liability coverage, health benefits, paid time off, and vehicle fuel allotments.',
      },
      {
        title: '4. Separate Fixed Overhead from Direct Profit',
        body: 'Overhead includes the cost of running your business (office rent, estimating software, legal council, marketing, vehicle depreciation) regardless of whether you have an active jobsite. Keep your overhead allocation distinct from your net profit margin so you know your true breakeven threshold.',
      },
      {
        title: '5. Always Include a Contingency Line Item',
        body: 'Remodeling projects frequently reveal concealed structural rot, ungrounded wiring, or obsolete plumbing once walls are opened. Budgeting a 10% to 15% contingency reserve protects both you and the client against sudden budget derailments.',
      },
      {
        title: '6. Establish a Rigorous Change-Order Workflow',
        body: 'Whenever a client requests upgraded granite, an additional electrical circuit, or altered architectural trim, draft and execute a signed change order before purchasing materials or commencing new labor tasks.',
      },
    ],
  },

  excelSection: {
    heading: 'Construction Estimate Template for Excel and Spreadsheets',
    p1: 'Many contractors still build estimates in a static Excel or xls spreadsheet template. While spreadsheets offer initial familiarity, they introduce severe operational vulnerabilities that compromise contracting efficiency.',
    p2: 'Spreadsheets are vulnerable to broken formulas, accidental cell overwrites, duplicate file versions on shared work drives, and complex mobile formatting hurdles. When estimators enter formulas in jobsite trucks on tablet screens, a single misplaced comma or dropped sum range can quietly understate project costs by tens of thousands of dollars.',
    p3: 'Our free online construction estimate template solves these spreadsheet headaches while delivering identical calculation power. It eliminates formula breakage through dedicated client-side validation logic, renders cleanly on smartphone and tablet screens, automatically calculates sales tax and profit margins, and prints pristine, camera-ready PDF proposals directly without requiring expensive Microsoft Office subscriptions or desktop licenses.',
  },

  typesSection: {
    heading: 'Types of Construction Estimates',
    intro: 'Different construction sectors demand distinct estimating approaches and level-of-detail requirements. Common industry categories include:',
    typesList: [
      {
        name: 'Residential Construction & Remodeling Estimates',
        desc: 'Focuses on single-family home building, kitchen renovations, bathroom additions, basement finishing, and residential roofing. Demands precise finish carpentry, cosmetic fixture selection, and clear homeowner communication.',
      },
      {
        name: 'Commercial Construction & Tenant Improvement Estimates',
        desc: 'Encompasses retail strip build-outs, corporate office interiors, industrial warehouses, and medical clinics. Requires strict compliance with ADA accessibility codes, commercial fire suppression systems, and prevailing wage labor schedules.',
      },
      {
        name: 'Specialty Trade Subcontractor Estimates',
        desc: 'Customized for specialized licensed trades such as electrical rough-ins, HVAC ductwork design, structural steel erection, plumbing installations, and concrete foundation pours where high equipment overhead and certified tradespeople dominate.',
      },
      {
        name: 'Civil & Heavy Infrastructure Estimates',
        desc: 'Focuses on earthwork excavation, municipal utilities, asphalt paving, storm water drainage, and site retaining systems where earth-moving equipment rental hours and volume cubic yards dictate project economics.',
      },
    ],
  },

  faqHeading: 'Frequently Asked Questions',
  faqItems: [
    {
      q: 'What is a construction estimate template?',
      a: 'A construction estimate template is a pre-formatted framework used by general contractors, builders, and trades professionals to calculate, itemize, and present expected costs for a building or renovation project. It organizes labor, materials, equipment rentals, subcontractor fees, overhead, tax, and profit margins into an easy-to-read document for clients.',
    },
    {
      q: 'How do I create a professional construction estimate?',
      a: 'To create a professional estimate, first define the exact scope of work. Break down the project into granular line items organized by category (materials, labor, equipment, and subcontractors). Measure project dimensions to determine material quantities, calculate realistic labor hours using fully burdened wage rates, apply your target profit markup and applicable sales taxes, and export the document with clear payment terms and expiration dates.',
    },
    {
      q: 'What should always be included in a construction estimate?',
      a: 'Every reliable construction estimate should include contractor contact details and license number, client contact information, jobsite physical address, estimate reference number and issue date, validity timeframe, categorized line items with units and unit rates, subtotal, tax rate, profit markup percentage, total cost, payment terms, and scope exclusions.',
    },
    {
      q: 'Is this construction estimate template really free to use?',
      a: 'Yes, this construction estimate builder is completely free with no hidden charges, paywalls, watermarks, or user account requirements. You can calculate line items, customize currencies, save estimates in your local browser storage, and generate clean PDF or CSV files without entering a credit card.',
    },
    {
      q: 'Can I download my construction estimate as a PDF?',
      a: 'Yes. Simply click the "Print / Save PDF" button on the estimate builder. The application activates dedicated print stylesheets that strip out interactive browser buttons, navigation menus, and screen controls, leaving a clean, beautifully formatted, presentation-ready estimate document that can be printed or saved directly as a PDF.',
    },
    {
      q: 'What is the key difference between a construction estimate and a quote?',
      a: 'An estimate provides an educated, non-binding projection of project costs that may adjust as physical site conditions are revealed or architectural blueprints evolve. A quote is a fixed, legally binding financial proposal that guarantees completion of specific deliverables at an exact price, provided the customer accepts within the stated expiration window.',
    },
    {
      q: 'How accurate should an initial construction estimate be?',
      a: 'During conceptual or early schematic design phases, rough order-of-magnitude estimates typically target an accuracy range of ±15% to ±20%. Once final architectural blueprints, mechanical drawings, engineering reviews, and supplier price quotes are locked in, a definitive estimate should target an accuracy tolerance within ±5% of actual project expenditures.',
    },
    {
      q: 'Do I need expensive construction estimating software?',
      a: 'No. While enterprise commercial developers running multi-million dollar public tenders may utilize specialized enterprise platforms, independent contractors, residential builders, and specialty trades can easily manage projects using our fast, free, browser-based construction estimate builder without monthly recurring software overhead.',
    },
  ],

  disclaimerText:
    'Disclaimer: This tool helps you create and format construction estimates. It does not provide legal, financial, or tax advice. Verify all calculations, tax rates, and local requirements independently. Material prices, labor rates, and permit fees vary by location and change over time. Always confirm current costs before submitting an estimate to a client.',
};

