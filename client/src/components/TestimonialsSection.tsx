'use client';

import { useState } from 'react';
import TestimonialCard from './TestimonialCard';
import Pagination from './Pagination';
import type { TestimonialsData } from '../lib/wordpress-types';

interface TestimonialsSectionProps {
  testimonialsData: TestimonialsData | null;
}

const TESTIMONIALS_PER_PAGE = 2;

export default function TestimonialsSection({ testimonialsData }: TestimonialsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [allExpanded, setAllExpanded] = useState(false);

  const nodes = testimonialsData?.testimonials?.nodes;
  if (!nodes || nodes.length === 0) return null;

  const paginated = nodes.slice(
    (currentPage - 1) * TESTIMONIALS_PER_PAGE,
    currentPage * TESTIMONIALS_PER_PAGE
  );
  const totalPages = Math.ceil(nodes.length / TESTIMONIALS_PER_PAGE);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-12">
        {paginated.map((testimonial, index) => {
          const firstName = testimonial.testimonialContent.firstName;
          const lastName = testimonial.testimonialContent.lastName;
          const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
          const clientName = `${firstName} ${lastName}`;
          const borderColor = index === 0 ? 'primary' : 'neutral';

          return (
            <TestimonialCard
              key={testimonial.title}
              quote={testimonial.title}
              clientName={clientName}
              clientLocation=""
              initials={initials}
              borderColor={borderColor}
              clientUrl={testimonial.testimonialContent.url}
              isExpanded={allExpanded}
              onToggleExpand={() => setAllExpanded(!allExpanded)}
            />
          );
        })}
      </div>

      {nodes.length > TESTIMONIALS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
