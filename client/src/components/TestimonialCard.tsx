import React from 'react';
import { Star } from '@mui/icons-material';
import Button from './Button';

interface TestimonialCardProps {
  quote: string;
  clientName: string;
  clientTitle?: string;
  clientLocation: string;
  initials: string;
  borderColor?: 'primary' | 'neutral';
  clientUrl?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export default function TestimonialCard({
  quote,
  clientName,
  clientTitle,
  clientLocation,
  initials,
  borderColor = 'primary',
  clientUrl,
  isExpanded = false,
  onToggleExpand
}: TestimonialCardProps) {
  const borderClass = borderColor === 'primary' ? 'border-primary-500' : 'border-neutral-600';
  
  const maxChars = 150;
  const shouldTruncate = quote.length > maxChars;
  const displayQuote = isExpanded ? quote : quote.slice(0, maxChars);
  const needsReadMore = shouldTruncate && !isExpanded;

  return (
    <div className={`relative p-12 bg-white shadow-xl border-t-8 ${borderClass}`}>
      <span className="text-primary-500 text-7xl absolute top-6 right-6 opacity-30">"</span>
      
      {/* 5 Star Rating */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="text-warning-500 text-xl" />
        ))}
      </div>
      
      {/* Quote with max height and read more */}
      <div className="relative">
        <p 
          className={`text-base italic text-neutral-700 leading-relaxed mb-4 relative z-10 ${
            !isExpanded ? 'max-h-32 overflow-hidden' : ''
          }`}
        >
          {displayQuote}
          {needsReadMore && (
            <>
              <span className="text-primary-500 font-normal not-italic">...</span>
              <button
                onClick={() => onToggleExpand?.()}
                className="text-primary-500 text-sm font-bold hover:text-primary-600 transition-colors ml-1 underline"
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </button>
            </>
          )}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neutral-950 rounded-full flex items-center justify-center font-black text-primary-500">
          <span>{initials}</span>
        </div>
        <div>
          <p className="text-neutral-950 font-black uppercase text-xs tracking-widest">{clientName}</p>
          <p className="text-primary-500 text-[10px] font-bold uppercase">
            {clientTitle && `${clientTitle}, `}{clientLocation}
          </p>
          {clientUrl && (
            <a 
              href={clientUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 text-[10px] font-bold uppercase hover:text-primary-600 transition-colors"
            >
              View in Google Maps →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
