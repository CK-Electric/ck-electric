import React from 'react';
import Image from 'next/image';
import { ArrowRightAlt } from '@mui/icons-material';
import Button from './Button';

interface ProjectCardProps {
  image: string;
  location: string;
  projectName: string;
  category: { name: string }[] | string[];
  description: string;
  link: string;
  isFeatured?: boolean;
}

export default function ProjectCard({
  image,
  location,
  projectName,
  category,
  description,
  link,
  isFeatured = false
}: ProjectCardProps) {
  return (
    <article className="flex flex-col h-full bg-white transition-all group cursor-pointer hover:shadow-lg">
      <a href={link} className="block group">
        <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden mb-6 relative border border-neutral-200">
          <Image
            alt="Project image"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            src={image}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {isFeatured && (
              <span className="bg-yellow-400 text-neutral-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
                Featured
              </span>
            )}
            {Array.isArray(category) && category
              .filter(tag => {
                const tagName = typeof tag === 'string' ? tag : tag.name;
                return tagName.toLowerCase() !== 'featured';
              })
              .map((tag, index) => (
              <span 
                key={index}
                className="bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded"
              >
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
          </div>
        </div>
        
        <div className="p-2">
          <div className="flex items-center gap-4 text-xs text-neutral-600 font-bold uppercase tracking-tighter mb-3">
            <span>{location}</span>
          </div>
          
          <h2 className="text-base-bold text-neutral-950 group-hover:text-primary-500 transition-colors mb-3">
            {projectName}
          </h2>
          
          <p className="text-neutral-600 text-sm leading-relaxed mb-6 flex-grow">
            {description}
          </p>
          
          <Button
            label="View Project"
            icon={<ArrowRightAlt />}
            variant="tertiary"
          />
        </div>
      </a>
    </article>
  );
}
