'use client';

import React, { useMemo, useState } from 'react';
import ToolCard from '@/components/home/ToolCard';
import ToolSearch from '@/components/home/ToolSearch';
import {
  TOOLS_CATALOG,
  CATEGORIES,
  CategoryId,
  CatalogTool,
} from '@/lib/tools-catalog';
import styles from './ToolsDirectory.module.css';

export default function ToolsDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all' | 'new'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'az' | 'category'>('newest');

  const categories = Object.values(CATEGORIES);
  const newToolsCount = useMemo(() => TOOLS_CATALOG.filter((t) => t.isNew).length, []);

  const displayedTools: CatalogTool[] = useMemo(() => {
    let list: CatalogTool[];
    if (selectedCategory === 'all') {
      list = [...TOOLS_CATALOG];
    } else if (selectedCategory === 'new') {
      list = TOOLS_CATALOG.filter((tool) => tool.isNew || tool.isUpdated);
    } else {
      list = TOOLS_CATALOG.filter((tool) => tool.category === selectedCategory);
    }

    if (sortBy === 'az') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'category') {
      return list.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    }
    // 'newest' (default): new tools start first, older tools last
    return list.sort((a, b) => {
      const dateCmp = b.added.localeCompare(a.added);
      if (dateCmp !== 0) return dateCmp;
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [selectedCategory, sortBy]);

  return (
    <div className={styles.directoryWrapper}>
      {/* Search Header */}
      <div className={styles.searchHeader}>
        <div className={styles.searchBoxWrapper}>
          <ToolSearch mode="inline" placeholder={`Search all ${TOOLS_CATALOG.length} tools by material, trade or keyword...`} />
        </div>

        {/* Filter Pills & Sort Row */}
        <div className={styles.controlsRow}>
          <div className={styles.filterBar}>
            <button
              type="button"
              className={`${styles.filterPill} ${selectedCategory === 'all' ? styles.filterActive : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Tools ({TOOLS_CATALOG.length})
            </button>
            <button
              type="button"
              className={`${styles.filterPill} ${styles.newPill} ${selectedCategory === 'new' ? styles.filterActive : ''}`}
              onClick={() => setSelectedCategory('new')}
            >
              ✨ New Tools ({newToolsCount})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.filterPill} ${selectedCategory === cat.id ? styles.filterActive : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className={styles.sortWrap}>
            <label htmlFor="tools-sort-select" className={styles.sortLabel}>
              Sort by:
            </label>
            <select
              id="tools-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'az' | 'category')}
              className={styles.sortSelect}
            >
              <option value="newest">Newest First</option>
              <option value="az">Name (A–Z)</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        <p className={styles.countNote}>
          Showing {displayedTools.length} tool{displayedTools.length !== 1 ? 's' : ''}
          {selectedCategory === 'new' ? ' (recently added)' : ''} · {sortBy === 'newest' ? 'Newest additions first' : sortBy === 'az' ? 'Alphabetical' : 'By category'}
        </p>
      </div>

      {/* Tools Grid */}
      <div className={styles.toolsGrid}>
        {displayedTools.map((tool) => (
          <ToolCard
            key={tool.slug}
            slug={tool.slug}
            name={tool.name}
            category={tool.category}
            description={tool.description}
            tags={tool.tags}
            icon={tool.icon}
            isNew={tool.isNew}
            isUpdated={tool.isUpdated}
          />
        ))}
      </div>
    </div>
  );
}
