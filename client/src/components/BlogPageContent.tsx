'use client';

import React from 'react';
import BlogHero from '@/components/BlogHero';
import BlogCard from '@/components/BlogCard';
import BlogCategoryFilter from '@/components/BlogCategoryFilter';
import BlogPagination from '@/components/BlogPagination';

interface BlogPageContentProps {
  blogPosts: Array<{
    id: number;
    image: string;
    category: string;
    date: string;
    readTime: string;
    title: string;
    description: string;
    link: string;
  }>;
}

export default function BlogPageContent({ blogPosts }: BlogPageContentProps) {
  const categories = ['All Topics', 'Residential', 'Commercial', 'Electrical Safety', 'Lighting Design'];
  const [activeCategory, setActiveCategory] = React.useState('All Topics');
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = 68;
  const hasNext = currentPage < totalPages;
  const hasPrevious = currentPage > 1;

  // Filter posts based on active category
  const filteredPosts = activeCategory === 'All Topics' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <>
      <BlogHero
        title="Electrical Insights & Tips"
        subtitle="Your source for the latest trends in residential and commercial electrical solutions. From safety tips to high-end lighting design, CK Electric shares professional insights to illuminate your space."
        backgroundImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBevz4X8_qCwm5nQKKnaWVl-Vxj6iUW5VFoBc8V2CfGSXsQzGB8pOngUro1y0kXl1Y81gvhwy8vWeq8SSYpgf7oHEmIzLDaECh-QEOgGeiFImrWHxOKub4YEyOGHjmLVJe_P6d097l2hsacY2gPUZgbJfX1YEdjANsbDOG1GObiPvpyTntmbyiFCujgDFL0KCidSElT01APFrpibQru1ZkMNHt4ozYxf5RiSKLjI23KE9Jyj7feBRWdtR7n3M60ZkxVvbb4m_8fEW0"
      />
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogCategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post.id}
                image={post.image}
                category={post.category}
                date={post.date}
                readTime={post.readTime}
                title={post.title}
                description={post.description}
                link={post.link}
              />
            ))}
          </div>
          
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </>
  );
}
