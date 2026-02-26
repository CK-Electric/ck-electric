import React from 'react';
import Button from './Button';

interface ServicesHeroProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  backgroundImage: string;
  tagline?: string;
}

export default function ServicesHero({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  backgroundImage,
  tagline
}: ServicesHeroProps) {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          alt="Services background" 
          className="w-full h-full object-cover" 
          src={backgroundImage}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/60 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 md:py-24">
        {tagline && (
          <p className="text-primary-500 text-sm font-bold uppercase tracking-widest mb-6">
            {tagline}
          </p>
        )}
        <h1 className="text-display-1 text-neutral-50 mb-8 leading-tight">{title}</h1>
        <p className="max-w-4xl mx-auto text-display-4 text-neutral-50 leading-relaxed mb-12">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            label={primaryButtonText}
            variant="primary"
            href={primaryButtonHref}
          />
          <Button
            label={secondaryButtonText}
            variant="secondary"
            href={secondaryButtonHref}
          />
        </div>
      </div>
    </section>
  );
}
