import React from 'react';
import BlogShareButtons from './BlogShareButtons';

interface BlogArticleProps {
  title: string;
  content: React.ReactNode;
  author: {
    name: string;
    initials: string;
  };
  publishedDate: string;
  readingTime: string;
  categories: string[];
  heroImage: string;
}

export default function BlogArticle({
  title,
  content,
  author,
  publishedDate,
  readingTime,
  categories,
  heroImage
}: BlogArticleProps) {
  return (
    <article className="max-w-4xl mx-auto text-center mb-12">
      <div className="flex justify-center gap-2 mb-6">
        {categories.map((category) => (
          <span 
            key={category}
            className="bg-primary-500/10 text-primary-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter"
          >
            {category}
          </span>
        ))}
      </div>
      
      <h1 className="text-display-2 text-neutral-950 mb-8 leading-tight">{title}</h1>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 border-y border-primary-500/20 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-950 flex items-center justify-center text-primary-500 font-bold text-sm">
            {author.initials}
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase text-primary-500">Written By</p>
            <p className="font-bold text-sm text-neutral-950">{author.name}</p>
          </div>
        </div>
        
        <div className="hidden md:block w-px h-8 bg-primary-500/20"></div>
        
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase text-primary-500">Published</p>
          <p className="font-bold text-sm text-neutral-950">{publishedDate}</p>
        </div>
        
        <div className="hidden md:block w-px h-8 bg-primary-500/20"></div>
        
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase text-primary-500">Reading Time</p>
          <p className="font-bold text-sm text-neutral-950">{readingTime}</p>
        </div>
      </div>
      
      {/* Hero Image */}
      <div className="w-full h-[500px] rounded-lg overflow-hidden mb-16 shadow-2xl">
        <img 
          alt="Article hero image" 
          className="w-full h-full object-cover" 
          src={heroImage}
        />
      </div>
      
      {/* Article Content */}
      <div className="max-w-3xl mx-auto">
        <BlogShareButtons />
        
        {content}
      </div>
    </article>
  );
}
