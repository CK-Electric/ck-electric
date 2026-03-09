import React from 'react';
import Image from 'next/image';
import { ArrowRightAlt } from '@mui/icons-material';

interface BlogCardProps {
  image: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  description: string;
  link: string;
}

export default function BlogCard({
  image,
  category,
  date,
  readTime,
  title,
  description,
  link
}: BlogCardProps) {
  return (
    <a href={link} className="block group">
      <article className="flex flex-col h-full bg-white transition-all hover:shadow-lg">
        <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden mb-6 relative border border-neutral-200">
          <Image
            alt="Blog post image"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            src={image}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className="absolute top-4 left-4 bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
            {category}
          </span>
        </div>
        
        <div className="p-2">
          <div className="flex items-center gap-4 text-xs text-neutral-600 font-bold uppercase tracking-tighter mb-3">
          <span>{date}</span>
          <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
          <span>{readTime}</span>
        </div>
        
        <h2 className="text-base-bold text-neutral-950 group-hover:text-primary-500 transition-colors mb-3">
          {title}
        </h2>
        
        <p className="text-neutral-600 text-sm leading-relaxed mb-6 flex-grow">
          {description}
        </p>
        
        <span className="inline-flex items-center gap-1 text-small-upper tracking-widest text-neutral-950 group-hover:text-primary-500 transition-colors font-bold uppercase">
          Read More <ArrowRightAlt className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
      </article>
    </a>
  );
}
