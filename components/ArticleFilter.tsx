'use client';

import { useState } from 'react';

interface ArticleFilterProps {
  onFilterChange: (category: string) => void;
  categories: string[];
}

export default function ArticleFilter({ onFilterChange, categories }: ArticleFilterProps) {
  const [activeFilter, setActiveFilter] = useState('Alle');

  const handleFilterClick = (category: string) => {
    setActiveFilter(category);
    onFilterChange(category);
  };

  const allCategories = ['Alle', ...categories];

  return (
    <div className="mb-8 pb-6 border-b border-light-border-primary dark:border-dark-border-primary">
      <div className="flex flex-wrap gap-3">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleFilterClick(category)}
            className={`
              px-4 py-2 text-sm font-sans transition-all
              ${activeFilter === category 
                ? 'text-light-accent-primary dark:text-dark-accent-primary border-b-2 border-light-accent-primary dark:border-dark-accent-primary font-medium' 
                : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
              }
            `}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeFilter === category ? '2px solid var(--color-accent-primary)' : 'none'
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

