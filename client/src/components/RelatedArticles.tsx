import React from 'react';
import { ArrowRightAlt } from '@mui/icons-material';
import BlogCard from './BlogCard';

interface RelatedArticle {
  id: number;
  image: string;
  category: string;
  readTime: string;
  title: string;
  description: string;
  link: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  title?: string;
  seeAllLink?: string;
}

export default function RelatedArticles({ 
  articles, 
  title = "Other Articles",
  seeAllLink = "#" 
}: RelatedArticlesProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-primary-50/30">
      <div className="flex justify-between items-end mb-12 border-b-2 border-primary-500 pb-6">
        <h2 className="text-display-3 font-black text-neutral-950">{title}</h2>
        <a 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-500 hover:text-neutral-950 transition-colors" 
          href={seeAllLink}
        >
          See All
          <ArrowRightAlt className="h-4 w-4" />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {articles.map((article) => (
          <BlogCard
            key={article.id}
            image={article.image}
            category={article.category}
            date={article.readTime} // Using readTime as date since BlogCard expects date
            readTime={article.readTime}
            title={article.title}
            description={article.description}
            link={article.link}
          />
        ))}
      </div>
    </section>
  );
}
