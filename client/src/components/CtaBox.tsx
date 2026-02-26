import React from 'react';
import Button from './Button';

interface CtaBoxProps {
  title: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
}

export default function CtaBox({
  title,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref
}: CtaBoxProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="bg-neutral-950 rounded-lg p-12 md:p-20 text-center relative overflow-hidden group">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700"></div>
        
        <div className="relative z-10">
          <h2 className="text-display-2 text-neutral-50 font-bold mb-8">{title}</h2>
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
      </div>
    </section>
  );
}
