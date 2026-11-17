import { describe, it, expect } from 'vitest';
import { TOOLS_CATALOG, CATEGORIES, CategoryId } from './tools-catalog';
import { ROUTES } from './routes';

describe('TOOLS_CATALOG single source of truth', () => {
  it('contains exactly 29 tools currently', () => {
    expect(TOOLS_CATALOG.length).toBe(38);
  });

  it('ensures every tool has a valid existing route in ROUTES', () => {
    const routePaths = Object.values(ROUTES).map((r) => r.path);
    TOOLS_CATALOG.forEach((tool) => {
      expect(routePaths).toContain(tool.slug);
    });
  });

  it('ensures every tool is mapped to an existing category', () => {
    const categoryIds = Object.keys(CATEGORIES) as CategoryId[];
    TOOLS_CATALOG.forEach((tool) => {
      expect(categoryIds).toContain(tool.category);
    });
  });

  it('ensures descriptions are concise and within bounds', () => {
    TOOLS_CATALOG.forEach((tool) => {
      expect(tool.description.length).toBeLessThanOrEqual(110);
      expect(tool.name.length).toBeGreaterThan(3);
      expect(tool.keywords.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('ensures newer tools appear first and older tools appear last', () => {
    // Top tool is the newest addition
    expect(TOOLS_CATALOG[0].slug).toBe('/roof-replacement-cost-calculator/');
    expect(TOOLS_CATALOG[0].added).toBe('2026-11-17');

    // Date monotonicity: earlier items must have equal or newer added dates than later items
    for (let i = 0; i < TOOLS_CATALOG.length - 1; i++) {
      expect(TOOLS_CATALOG[i].added >= TOOLS_CATALOG[i + 1].added).toBe(true);
    }

    // Oldest tools from Phase 0/1 are at the end
    const lastTool = TOOLS_CATALOG[TOOLS_CATALOG.length - 1];
    expect(lastTool.added).toBe('2026-11-08');
  });
});

