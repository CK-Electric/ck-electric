'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface BlogCategoryFilterProps {
  categories: string[];
  activeCategory?: string;
}

export default function BlogCategoryFilter({
  categories,
  activeCategory = 'All Topics',
}: BlogCategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleCategoryChange(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All Topics') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

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
          onClick={() => handleCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
