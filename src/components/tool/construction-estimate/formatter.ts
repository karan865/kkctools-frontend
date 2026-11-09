import { EstimateData, EstimateTotals } from './types';
import { formatCurrency } from './calculations';
import { CATEGORIES } from './constants';

function escapeCsvField(field: string | number): string {
  const str = String(field ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function formatAsCSV(estimate: EstimateData, totals: EstimateTotals): string {
  const rows: string[] = [];

  // Metadata / Project Header
  rows.push(['ESTIMATE INFORMATION'].join(','));
  rows.push(['Project Name', escapeCsvField(estimate.projectInfo.projectName)].join(','));
  rows.push(['Client Name', escapeCsvField(estimate.projectInfo.clientName)].join(','));
  rows.push(['Jobsite Address', escapeCsvField(estimate.projectInfo.projectAddress)].join(','));
  rows.push(['Estimate Number', escapeCsvField(estimate.projectInfo.estimateNumber)].join(','));
  rows.push(['Date', escapeCsvField(estimate.projectInfo.date)].join(','));
  rows.push(['Valid For (Days)', escapeCsvField(estimate.projectInfo.validDays)].join(','));
  rows.push(['Currency', escapeCsvField(estimate.currency)].join(','));
  rows.push('');

  if (estimate.companyInfo.companyName) {
    rows.push(['CONTRACTOR INFORMATION'].join(','));
    rows.push(['Company', escapeCsvField(estimate.companyInfo.companyName)].join(','));
    rows.push(['License #', escapeCsvField(estimate.companyInfo.licenseNumber)].join(','));
    rows.push(['Phone', escapeCsvField(estimate.companyInfo.phone)].join(','));
    rows.push(['Email', escapeCsvField(estimate.companyInfo.email)].join(','));
    rows.push(['Address', escapeCsvField(estimate.companyInfo.address)].join(','));
    rows.push('');
  }

  // Line items table
  rows.push(['Category', 'Description', 'Quantity', 'Unit', 'Unit Price', 'Line Total'].join(','));
  for (const item of estimate.lineItems) {
    const catLabel = CATEGORIES.find((c) => c.value === item.category)?.label || item.category;
    rows.push(
      [
        escapeCsvField(catLabel),
        escapeCsvField(item.description),
        escapeCsvField(item.quantity),
        escapeCsvField(item.unit),
        escapeCsvField(item.unitPrice.toFixed(2)),
        escapeCsvField(item.total.toFixed(2)),
      ].join(',')
    );
  }
  rows.push('');

  // Financial summary
  rows.push(['SUMMARY & TOTALS'].join(','));
  rows.push(['Subtotal', '', '', '', '', escapeCsvField(totals.subtotal.toFixed(2))].join(','));
  rows.push([
    `Tax (${estimate.taxRate}%)`,
    '',
    '',
    '',
    '',
    escapeCsvField(totals.taxAmount.toFixed(2)),
  ].join(','));
  rows.push([
    `Markup / Overhead (${estimate.markupRate}%)`,
    '',
    '',
    '',
    '',
    escapeCsvField(totals.markupAmount.toFixed(2)),
  ].join(','));
  rows.push(['GRAND TOTAL', '', '', '', '', escapeCsvField(totals.grandTotal.toFixed(2))].join(','));

  if (estimate.notes) {
    rows.push('');
    rows.push(['NOTES & TERMS'].join(','));
    rows.push([escapeCsvField(estimate.notes)].join(','));
  }

  return rows.join('\r\n');
}

export function formatAsTXT(estimate: EstimateData, totals: EstimateTotals): string {
  const lines: string[] = [];
  const divider = '='.repeat(68);
  const thinDivider = '-'.repeat(68);

  lines.push(divider);
  lines.push('                   CONSTRUCTION ESTIMATE');
  lines.push(divider);

  if (estimate.companyInfo.companyName) {
    lines.push(`CONTRACTOR: ${estimate.companyInfo.companyName}`);
    if (estimate.companyInfo.licenseNumber) lines.push(`License: ${estimate.companyInfo.licenseNumber}`);
    if (estimate.companyInfo.phone) lines.push(`Phone: ${estimate.companyInfo.phone}`);
    if (estimate.companyInfo.email) lines.push(`Email: ${estimate.companyInfo.email}`);
    if (estimate.companyInfo.address) lines.push(`Address: ${estimate.companyInfo.address}`);
    lines.push(thinDivider);
  }

  lines.push(`PROJECT: ${estimate.projectInfo.projectName || 'Untitled Project'}`);
  lines.push(`CLIENT:  ${estimate.projectInfo.clientName || 'Valued Client'}`);
  lines.push(`ADDRESS: ${estimate.projectInfo.projectAddress || 'Not specified'}`);
  lines.push(`ESTIMATE #: ${estimate.projectInfo.estimateNumber || 'N/A'}`);
  lines.push(`DATE:    ${estimate.projectInfo.date || new Date().toISOString().split('T')[0]}`);
  lines.push(`VALIDITY: ${estimate.projectInfo.validDays} days from issue date`);
  lines.push(divider);

  lines.push(
    `${'DESCRIPTION'.padEnd(30)} ${'QTY / UNIT'.padEnd(14)} ${'UNIT RATE'.padStart(10)} ${'TOTAL'.padStart(10)}`
  );
  lines.push(thinDivider);

  for (const item of estimate.lineItems) {
    const desc = item.description.length > 28 ? item.description.slice(0, 27) + '…' : item.description;
    const qtyUnit = `${item.quantity} ${item.unit}`.slice(0, 13);
    const unitRate = formatCurrency(item.unitPrice, estimate.currency);
    const itemTotal = formatCurrency(item.total, estimate.currency);

    lines.push(
      `${desc.padEnd(30)} ${qtyUnit.padEnd(14)} ${unitRate.padStart(10)} ${itemTotal.padStart(10)}`
    );
  }

  lines.push(thinDivider);

  // Category subtotals
  lines.push('CATEGORY BREAKDOWN:');
  for (const cat of CATEGORIES) {
    const catTotal = totals.categorySubtotals[cat.value];
    if (catTotal > 0) {
      lines.push(`  - ${cat.label.padEnd(20)}: ${formatCurrency(catTotal, estimate.currency)}`);
    }
  }

  lines.push(thinDivider);
  lines.push(`${'Subtotal:'.padStart(54)} ${formatCurrency(totals.subtotal, estimate.currency).padStart(13)}`);
  if (estimate.taxRate > 0) {
    lines.push(
      `${`Tax (${estimate.taxRate}%):`.padStart(54)} ${formatCurrency(totals.taxAmount, estimate.currency).padStart(13)}`
    );
  }
  if (estimate.markupRate > 0) {
    lines.push(
      `${`Markup (${estimate.markupRate}%):`.padStart(54)} ${formatCurrency(totals.markupAmount, estimate.currency).padStart(13)}`
    );
  }
  lines.push(divider);
  lines.push(
    `${'GRAND TOTAL:'.padStart(54)} ${formatCurrency(totals.grandTotal, estimate.currency).padStart(13)}`
  );
  lines.push(divider);

  if (estimate.notes) {
    lines.push('NOTES, WARRANTIES & PAYMENT TERMS:');
    lines.push(estimate.notes);
    lines.push(thinDivider);
  }

  lines.push('Thank you for your business. Acceptance of this estimate authorizes');
  lines.push('work to begin according to the terms specified above.');

  return lines.join('\n');
}

