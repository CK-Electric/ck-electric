import React from 'react';
import Button from './Button';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  hideCTA?: boolean;
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  hideCTA = false
}: HeroSectionProps) {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {backgroundImage && (
          <img 
            alt="Professional electrical work" 
            className="w-full h-full object-cover" 
            src={backgroundImage}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/60 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 md:py-24">
        <h2 className="text-display-2 text-primary-500 mb-6 italic drop-shadow-lg">{title}</h2>
        <p className="max-w-4xl mx-auto text-medium text-neutral-50 leading-relaxed mb-12">
          {subtitle}
        </p>
        {!hideCTA && primaryButtonText && primaryButtonHref && secondaryButtonText && secondaryButtonHref && (
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
        )}
      </div>
    </section>
  );
}
