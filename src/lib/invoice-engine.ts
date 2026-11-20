/**
 * Invoice Generator Calculation Engine
 * Client-side calculation logic for hourly, freelance, and contractor invoices.
 *
 * Zero network dependencies. All arithmetic uses cents-safe rounding.
 */

export type LineItemType = 'hours' | 'fixed' | 'expense';

export interface InvoiceLineItem {
  id: string;
  type: LineItemType;
  date?: string;
  description: string;
  quantityOrHours: number;
  rateOrPrice: number;
  amount: number;
}

export type PaymentTerms =
  | 'due_on_receipt'
  | 'net_7'
  | 'net_14'
  | 'net_30'
  | 'net_60'
  | 'custom';

export type DiscountType = 'pct' | 'fixed';
export type RoundingMode = 'none' | 'up' | 'nearest';
export type RoundingIncrement = 0 | 6 | 15 | 30;

export interface TimesheetEntry {
  id: string;
  date: string;
  task: string;
  hours: number;
  rate: number;
}

export interface BusinessDetails {
  businessName: string;
  senderName: string;
  address: string;
  email: string;
  phone: string;
  taxId: string;
  taxIdLabel: string; // 'EIN' | 'VAT Reg No.' | 'ABN' | 'GST No.'
  paymentInstructions: string;
}

export interface ClientDetails {
  clientName: string;
  companyName: string;
  address: string;
  email: string;
  phone?: string;
}

export interface InvoiceMetadata {
  invoiceNumber: string;
  issueDate: string;
  terms: PaymentTerms;
  dueDate: string;
  poNumber?: string;
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxableSubtotal: number;
  taxAmount: number;
  shippingFee: number;
  total: number;
  depositPaid: number;
  balanceDue: number;
  isCredit: boolean;
  totalHoursWorked: number;
}

export interface InvoiceData {
  from: BusinessDetails;
  to: ClientDetails;
  meta: InvoiceMetadata;
  lines: InvoiceLineItem[];
  currency: string;
  currencySymbol: string;
  discountType: DiscountType;
  discountValue: number;
  taxRate: number;
  taxLabel: string;
  taxOnDiscounted: boolean;
  shippingFee: number;
  depositPaid: number;
  notes: string;
  lateFeeNote?: string;
}

/**
 * Cents-safe rounding helper.
 */
export function roundToCents(amount: number): number {
  if (isNaN(amount) || !isFinite(amount)) return 0;
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Parses user duration string into decimal hours.
 * Supports:
 * - "2:30" -> 2.5
 * - "2.5" -> 2.5
 * - "2h 30m" -> 2.5
 * - "45m" or "45 min" -> 0.75
 * - "3 hours" -> 3.0
 * Returns null if unparseable or negative.
 */
export function parseDuration(input: string): number | null {
  if (!input || typeof input !== 'string') return null;
  const raw = input.trim().toLowerCase();
  if (raw === '') return null;

  // Pattern 1: Colon format (e.g., "2:30", "02:45")
  if (/^\d{1,3}:\d{1,2}$/.test(raw)) {
    const parts = raw.split(':');
    const hours = parseInt(parts[0], 10);
    const mins = parseInt(parts[1], 10);
    if (mins >= 60 || mins < 0 || hours < 0) return null;
    return roundToCents(hours + mins / 60);
  }

  // Pattern 2: Decimal number (e.g., "2.5", "3", "0.75")
  if (/^\d+(\.\d+)?$/.test(raw)) {
    const val = parseFloat(raw);
    return val >= 0 ? roundToCents(val) : null;
  }

  // Pattern 3: Compound phrases like "2h 30m", "2 hrs 30 mins", "45m", "1.5 hours"
  const hourMatch = raw.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)/);
  const minMatch = raw.match(/(\d+(?:\.\d+)?)\s*(?:m|min|mins|minute|minutes)/);

  if (hourMatch || minMatch) {
    const hours = hourMatch ? parseFloat(hourMatch[1]) : 0;
    const mins = minMatch ? parseFloat(minMatch[1]) : 0;
    if (isNaN(hours) || isNaN(mins) || hours < 0 || mins < 0) return null;
    return roundToCents(hours + mins / 60);
  }

  return null;
}

/**
 * Rounds decimal hours according to professional billing increments (6, 15, 30 min).
 */
export function roundHours(
  hours: number,
  incrementMin: RoundingIncrement,
  mode: RoundingMode
): number {
  if (isNaN(hours) || hours <= 0 || incrementMin === 0 || mode === 'none') {
    return roundToCents(Math.max(0, hours));
  }

  const incrementFraction = incrementMin / 60; // e.g., 0.25 for 15 min, 0.1 for 6 min

  if (mode === 'up') {
    return roundToCents(Math.ceil((hours - 0.000001) / incrementFraction) * incrementFraction);
  }

  if (mode === 'nearest') {
    return roundToCents(Math.round(hours / incrementFraction) * incrementFraction);
  }

  return roundToCents(hours);
}

/**
 * Calculates a single line item amount.
 */
export function calculateLineAmount(
  type: LineItemType,
  quantityOrHours: number,
  rateOrPrice: number
): number {
  if (isNaN(quantityOrHours) || isNaN(rateOrPrice) || quantityOrHours <= 0 || rateOrPrice <= 0) {
    return 0;
  }
  return roundToCents(quantityOrHours * rateOrPrice);
}

export interface InvoiceTotalsCalculationParams {
  lines: InvoiceLineItem[];
  discountType: DiscountType;
  discountValue: number;
  taxRate: number;
  taxOnDiscounted: boolean;
  shippingFee: number;
  depositPaid: number;
}

/**
 * Calculates full invoice financial totals.
 */
export function calculateInvoiceTotals(
  params: InvoiceTotalsCalculationParams
): InvoiceTotals {
  const {
    lines,
    discountType,
    discountValue,
    taxRate,
    taxOnDiscounted,
    shippingFee,
    depositPaid,
  } = params;

  let subtotal = 0;
  let totalHoursWorked = 0;

  for (const line of lines) {
    const lineAmt = calculateLineAmount(line.type, line.quantityOrHours, line.rateOrPrice);
    subtotal += lineAmt;
    if (line.type === 'hours') {
      totalHoursWorked += Math.max(0, line.quantityOrHours || 0);
    }
  }
  subtotal = roundToCents(subtotal);
  totalHoursWorked = roundToCents(totalHoursWorked);

  // Discount (capped at subtotal)
  let discountAmount = 0;
  if (discountValue > 0) {
    if (discountType === 'pct') {
      discountAmount = roundToCents((subtotal * Math.min(100, discountValue)) / 100);
    } else {
      discountAmount = roundToCents(Math.min(subtotal, discountValue));
    }
  }

  // Tax calculation
  const taxableSubtotal = taxOnDiscounted
    ? Math.max(0, roundToCents(subtotal - discountAmount))
    : subtotal;

  const validTaxRate = Math.max(0, taxRate || 0);
  const taxAmount = roundToCents((taxableSubtotal * validTaxRate) / 100);

  const validShipping = Math.max(0, shippingFee || 0);
  const total = roundToCents(subtotal - discountAmount + taxAmount + validShipping);

  const validDeposit = Math.max(0, depositPaid || 0);
  const balanceDue = roundToCents(total - validDeposit);

  return {
    subtotal,
    discountAmount,
    taxableSubtotal,
    taxAmount,
    shippingFee: validShipping,
    total,
    depositPaid: validDeposit,
    balanceDue,
    isCredit: balanceDue < 0,
    totalHoursWorked,
  };
}

/**
 * Calculates invoice due date based on issue date and payment terms.
 */
export function calculateDueDate(
  issueDateStr: string,
  terms: PaymentTerms,
  customDays = 30
): string {
  if (!issueDateStr) {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const issue = new Date(issueDateStr);
  if (isNaN(issue.getTime())) {
    return issueDateStr;
  }

  let daysToAdd = 0;
  switch (terms) {
    case 'due_on_receipt':
      daysToAdd = 0;
      break;
    case 'net_7':
      daysToAdd = 7;
      break;
    case 'net_14':
      daysToAdd = 14;
      break;
    case 'net_30':
      daysToAdd = 30;
      break;
    case 'net_60':
      daysToAdd = 60;
      break;
    case 'custom':
      daysToAdd = Math.max(0, customDays || 0);
      break;
  }

  const due = new Date(issue.getTime());
  due.setDate(due.getDate() + daysToAdd);
  return due.toISOString().split('T')[0];
}

/**
 * Generates next sequential invoice number.
 */
export function generateNextInvoiceNumber(pattern: string, lastNum: number): string {
  const currentYear = new Date().getFullYear();
  const nextNum = Math.max(1, lastNum + 1);
  const padded = String(nextNum).padStart(3, '0');

  if (!pattern || pattern.trim() === '') {
    return `INV-${currentYear}-${padded}`;
  }

  return pattern
    .replace('{year}', String(currentYear))
    .replace('{num}', padded)
    .replace('{n}', String(nextNum));
}

/**
 * Format string as CSV safe field.
 */
function escapeCsv(val: string | number | undefined | null): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Formats invoice as exportable CSV text.
 */
export function formatInvoiceCsv(invoice: InvoiceData, totals: InvoiceTotals): string {
  const rows: string[] = [];

  rows.push(['INVOICE', escapeCsv(invoice.meta.invoiceNumber)].join(','));
  rows.push(['Issue Date', escapeCsv(invoice.meta.issueDate)].join(','));
  rows.push(['Due Date', escapeCsv(invoice.meta.dueDate)].join(','));
  rows.push(['Terms', escapeCsv(invoice.meta.terms.replace(/_/g, ' ').toUpperCase())].join(','));
  if (invoice.meta.poNumber) {
    rows.push(['PO / Reference', escapeCsv(invoice.meta.poNumber)].join(','));
  }
  rows.push('');

  rows.push(['FROM', escapeCsv(invoice.from.businessName || invoice.from.senderName)].join(','));
  if (invoice.from.address) rows.push(['Address', escapeCsv(invoice.from.address)].join(','));
  if (invoice.from.email) rows.push(['Email', escapeCsv(invoice.from.email)].join(','));
  if (invoice.from.phone) rows.push(['Phone', escapeCsv(invoice.from.phone)].join(','));
  if (invoice.from.taxId) rows.push([escapeCsv(invoice.from.taxIdLabel || 'Tax ID'), escapeCsv(invoice.from.taxId)].join(','));
  rows.push('');

  rows.push(['BILL TO', escapeCsv(invoice.to.clientName || invoice.to.companyName)].join(','));
  if (invoice.to.companyName && invoice.to.clientName) rows.push(['Company', escapeCsv(invoice.to.companyName)].join(','));
  if (invoice.to.address) rows.push(['Address', escapeCsv(invoice.to.address)].join(','));
  if (invoice.to.email) rows.push(['Email', escapeCsv(invoice.to.email)].join(','));
  rows.push('');

  rows.push(['Date', 'Description', 'Type', 'Quantity / Hours', 'Rate / Price', 'Amount'].join(','));
  for (const item of invoice.lines) {
    rows.push([
      escapeCsv(item.date || ''),
      escapeCsv(item.description),
      escapeCsv(item.type.toUpperCase()),
      escapeCsv(item.quantityOrHours),
      escapeCsv(item.rateOrPrice.toFixed(2)),
      escapeCsv(item.amount.toFixed(2)),
    ].join(','));
  }
  rows.push('');

  rows.push(['Subtotal', '', '', '', '', escapeCsv(totals.subtotal.toFixed(2))].join(','));
  if (totals.discountAmount > 0) {
    const discLabel = invoice.discountType === 'pct' ? `Discount (${invoice.discountValue}%)` : 'Discount';
    rows.push([discLabel, '', '', '', '', escapeCsv(`-${totals.discountAmount.toFixed(2)}`)].join(','));
  }
  if (totals.taxAmount > 0 || invoice.taxRate > 0) {
    rows.push([`${invoice.taxLabel || 'Tax'} (${invoice.taxRate}%)`, '', '', '', '', escapeCsv(totals.taxAmount.toFixed(2))].join(','));
  }
  if (totals.shippingFee > 0) {
    rows.push(['Shipping / Other', '', '', '', '', escapeCsv(totals.shippingFee.toFixed(2))].join(','));
  }
  rows.push(['Total', '', '', '', '', escapeCsv(totals.total.toFixed(2))].join(','));
  if (totals.depositPaid > 0) {
    rows.push(['Paid / Deposit', '', '', '', '', escapeCsv(`-${totals.depositPaid.toFixed(2)}`)].join(','));
  }
  rows.push(['Balance Due', '', '', '', '', escapeCsv(totals.balanceDue.toFixed(2))].join(','));

  if (invoice.from.paymentInstructions) {
    rows.push('');
    rows.push(['Payment Instructions', escapeCsv(invoice.from.paymentInstructions)].join(','));
  }
  if (invoice.notes) {
    rows.push(['Notes', escapeCsv(invoice.notes)].join(','));
  }

  return rows.join('\r\n');
}

/**
 * Formats invoice as clean monospace plain text.
 */
export function formatInvoiceText(invoice: InvoiceData, totals: InvoiceTotals): string {
  const divider = '='.repeat(68);
  const thin = '-'.repeat(68);
  const sym = invoice.currencySymbol || '$';

  const lines: string[] = [];
  lines.push(divider);
  lines.push(`                       INVOICE #${invoice.meta.invoiceNumber}`);
  lines.push(divider);
  lines.push(`Issue Date: ${invoice.meta.issueDate}       Due Date: ${invoice.meta.dueDate}`);
  lines.push(`Terms:      ${invoice.meta.terms.replace(/_/g, ' ').toUpperCase()}`);
  if (invoice.meta.poNumber) {
    lines.push(`PO / Ref:   ${invoice.meta.poNumber}`);
  }
  lines.push(thin);

  lines.push(`FROM:`);
  lines.push(`  ${invoice.from.businessName || invoice.from.senderName || 'Freelancer / Contractor'}`);
  if (invoice.from.address) lines.push(`  ${invoice.from.address}`);
  if (invoice.from.email) lines.push(`  Email: ${invoice.from.email}`);
  if (invoice.from.taxId) lines.push(`  ${invoice.from.taxIdLabel || 'Tax ID'}: ${invoice.from.taxId}`);
  lines.push('');

  lines.push(`BILL TO:`);
  lines.push(`  ${invoice.to.clientName || invoice.to.companyName || 'Client'}`);
  if (invoice.to.companyName && invoice.to.clientName) lines.push(`  ${invoice.to.companyName}`);
  if (invoice.to.address) lines.push(`  ${invoice.to.address}`);
  if (invoice.to.email) lines.push(`  Email: ${invoice.to.email}`);
  lines.push(thin);

  lines.push(`DESCRIPTION                            HOURS/QTY    RATE     AMOUNT`);
  lines.push(thin);

  for (const item of invoice.lines) {
    const desc = (item.description || 'Service').padEnd(36).slice(0, 36);
    const qty = String(item.quantityOrHours).padStart(8);
    const rate = `${sym}${item.rateOrPrice.toFixed(2)}`.padStart(10);
    const amt = `${sym}${item.amount.toFixed(2)}`.padStart(10);
    lines.push(`${desc} ${qty} ${rate} ${amt}`);
  }
  lines.push(thin);

  lines.push(`Subtotal:                                            ${sym}${totals.subtotal.toFixed(2)}`);
  if (totals.discountAmount > 0) {
    lines.push(`Discount:                                           -${sym}${totals.discountAmount.toFixed(2)}`);
  }
  if (totals.taxAmount > 0 || invoice.taxRate > 0) {
    lines.push(`${(invoice.taxLabel || 'Tax') + ` (${invoice.taxRate}%):`}`.padEnd(52) + `${sym}${totals.taxAmount.toFixed(2)}`);
  }
  if (totals.shippingFee > 0) {
    lines.push(`Shipping / Other:                                    ${sym}${totals.shippingFee.toFixed(2)}`);
  }
  lines.push(`Total:                                               ${sym}${totals.total.toFixed(2)}`);
  if (totals.depositPaid > 0) {
    lines.push(`Paid / Deposit:                                     -${sym}${totals.depositPaid.toFixed(2)}`);
  }
  lines.push(divider);
  lines.push(`BALANCE DUE:                                         ${sym}${totals.balanceDue.toFixed(2)}`);
  lines.push(divider);

  if (invoice.from.paymentInstructions) {
    lines.push(`PAYMENT INSTRUCTIONS:`);
    lines.push(invoice.from.paymentInstructions);
    lines.push('');
  }
  if (invoice.notes) {
    lines.push(`NOTES:`);
    lines.push(invoice.notes);
  }

  return lines.join('\n');
}

/**
 * Standard industry preset templates for quick initialization.
 */
export const INVOICE_PRESETS: Record<string, { label: string; lines: InvoiceLineItem[]; notes: string }> = {
  freelance: {
    label: 'Freelance General',
    lines: [
      { id: '1', type: 'hours', date: '2026-11-18', description: 'Product design consultation & wireframing', quantityOrHours: 4.5, rateOrPrice: 85, amount: 382.5 },
      { id: '2', type: 'hours', date: '2026-11-19', description: 'Interactive prototype development', quantityOrHours: 6.0, rateOrPrice: 85, amount: 510.0 },
      { id: '3', type: 'expense', date: '2026-11-20', description: 'Stock photography & font licensing', quantityOrHours: 1, rateOrPrice: 45, amount: 45.0 },
    ],
    notes: 'Thank you for your business! Please remit payment via bank transfer within 14 days of invoice date.',
  },
  writer: {
    label: 'Freelance Writer',
    lines: [
      { id: '1', type: 'hours', date: '2026-11-15', description: 'Long-form thought leadership article (2,000 words)', quantityOrHours: 8.0, rateOrPrice: 75, amount: 600.0 },
      { id: '2', type: 'hours', date: '2026-11-17', description: 'Subject matter expert interviews & research', quantityOrHours: 3.5, rateOrPrice: 75, amount: 262.5 },
      { id: '3', type: 'fixed', date: '2026-11-19', description: 'Revision & editorial polish round', quantityOrHours: 1, rateOrPrice: 150, amount: 150.0 },
    ],
    notes: 'All article copyrights transfer upon receipt of full payment. Net 30 payment terms.',
  },
  translator: {
    label: 'Freelance Translator',
    lines: [
      { id: '1', type: 'fixed', date: '2026-11-16', description: 'Technical document translation (Spanish to English, 3,200 words)', quantityOrHours: 3200, rateOrPrice: 0.12, amount: 384.0 },
      { id: '2', type: 'hours', date: '2026-11-18', description: 'Glossary review and terminology harmonization', quantityOrHours: 2.5, rateOrPrice: 60, amount: 150.0 },
      { id: '3', type: 'fixed', date: '2026-11-19', description: 'Certified translation seal & notarization fee', quantityOrHours: 1, rateOrPrice: 50, amount: 50.0 },
    ],
    notes: 'Certified translation copy attached. Payment due upon receipt via ACH or credit card.',
  },
  contractor: {
    label: 'Independent Contractor',
    lines: [
      { id: '1', type: 'hours', date: '2026-11-14', description: 'Senior software architecture & cloud migration', quantityOrHours: 16.0, rateOrPrice: 110, amount: 1760.0 },
      { id: '2', type: 'hours', date: '2026-11-17', description: 'Database schema optimization and indexing', quantityOrHours: 12.5, rateOrPrice: 110, amount: 1375.0 },
      { id: '3', type: 'expense', date: '2026-11-18', description: 'Dedicated staging server hosting fee', quantityOrHours: 1, rateOrPrice: 120, amount: 120.0 },
    ],
    notes: 'Services rendered under Master Services Agreement (MSA). Please wire payment per instructions below.',
  },
};
