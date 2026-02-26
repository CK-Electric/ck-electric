import React from 'react';
import { ArrowRightAlt } from '@mui/icons-material';
import Button from './Button';

interface ProjectCardProps {
  image: string;
  location: string;
  projectName: string;
  category: string;
  description: string;
  link: string;
}

export default function ProjectCard({
  image,
  location,
  projectName,
  category,
  description,
  link
}: ProjectCardProps) {
  return (
    <a href={link} className="block group">
      <article className="flex flex-col h-full bg-white transition-all">
        <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden mb-6 relative border border-neutral-200">
          <img 
            alt="Project image" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            src={image}
          />
          <span className="absolute top-4 left-4 bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
            {category}
          </span>
        </div>
        
        <div className="p-2">
          <div className="flex items-center gap-4 text-xs text-neutral-400 font-bold uppercase tracking-tighter mb-3">
            <span>{location}</span>
          </div>
          
          <h3 className="text-display-5 text-neutral-950 group-hover:text-primary-500 transition-colors mb-3">
            {projectName}
          </h3>
          
          <p className="text-neutral-600 text-sm leading-relaxed mb-6 flex-grow">
            {description}
          </p>
          
          <Button
            label="View Project"
            icon={<ArrowRightAlt />}
            variant="tertiary"
            href={link}
          />
        </div>
      </article>
    </a>
  );
}
