import { describe, it, expect } from 'vitest';
import { TOOLS_CATALOG, CATEGORIES, CategoryId } from './tools-catalog';
import { ROUTES } from './routes';

describe('TOOLS_CATALOG single source of truth', () => {
  it('contains exactly 25 tools currently', () => {
    expect(TOOLS_CATALOG.length).toBe(25);
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
});

