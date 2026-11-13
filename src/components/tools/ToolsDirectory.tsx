'use client';

import React, { useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');

  const categories = Object.values(CATEGORIES);

  const displayedTools: CatalogTool[] =
    selectedCategory === 'all'
      ? TOOLS_CATALOG
      : TOOLS_CATALOG.filter((tool) => tool.category === selectedCategory);

  return (
    <div className={styles.directoryWrapper}>
      {/* Search Header */}
      <div className={styles.searchHeader}>
        <div className={styles.searchBoxWrapper}>
          <ToolSearch mode="inline" placeholder="Search all 22 tools by material, trade or keyword..." />
        </div>

        {/* Filter Pills */}
        <div className={styles.filterBar}>
          <button
            type="button"
            className={`${styles.filterPill} ${selectedCategory === 'all' ? styles.filterActive : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Tools ({TOOLS_CATALOG.length})
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
