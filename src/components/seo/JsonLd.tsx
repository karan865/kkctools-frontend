import React from 'react';
import { normalizeSchema } from './normalizeSchema';

// Escape '<' inside JSON-LD so text can never close the script tag (backslash + u003c).
const LT_ESCAPE = String.fromCharCode(92) + 'u003c';

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  /** Skip the shared template pass (only for the root-layout @graph). */
  raw?: boolean;
}

export default function JsonLd({ data, raw = false }: JsonLdProps) {
  const nodes = raw ? data : normalizeSchema(data);
  if (Array.isArray(nodes) && nodes.length === 0) return null;
  const payload = Array.isArray(nodes) && nodes.length === 1 ? nodes[0] : nodes;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, LT_ESCAPE) }}
    />
  );
}
