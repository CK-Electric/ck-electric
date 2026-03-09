import React from 'react';
import Image from 'next/image';
import Button from './Button';

interface BlogHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export default function BlogHero({
  title,
  subtitle,
  backgroundImage,
  primaryButtonText = 'Request Estimate',
  primaryButtonHref = '/request-estimate',
  secondaryButtonText = 'Call Us Now',
  secondaryButtonHref = 'tel:2062956363',
}: BlogHeroProps) {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          alt="Electrician at work"
          className="object-cover"
          src={backgroundImage}
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/60 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 md:py-24">
        <h1 className="text-display-2 text-primary-500 mb-6 italic drop-shadow-lg">{title}</h1>
        <p className="max-w-4xl mx-auto text-medium text-neutral-50 leading-relaxed mb-10">
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
