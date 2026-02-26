import React from 'react';

interface BlogCategoryFilterProps {
  categories: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function BlogCategoryFilter({
  categories,
  activeCategory = 'All Topics',
  onCategoryChange
}: BlogCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-12 justify-center">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition-all shadow-sm ${
            category === activeCategory
              ? 'bg-primary-500 text-neutral-950'
              : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
          onClick={() => onCategoryChange && onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
