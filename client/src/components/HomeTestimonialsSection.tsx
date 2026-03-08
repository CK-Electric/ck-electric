import TestimonialsSection from './TestimonialsSection';
import type { TestimonialsData } from '../lib/wordpress-types';

interface Props {
  testimonialsData: TestimonialsData | null;
}

export default function HomeTestimonialsSection({ testimonialsData }: Props) {
  return (
    <section className="py-32 bg-neutral-50" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-24">
          <h2 className="text-primary-800 font-black text-xs tracking-[0.4em] uppercase mb-4 md:text-sm lg:text-base">Client Feedback</h2>
          <h3 className="testimonials-title text-neutral-950 text-lg md:text-2xl lg:text-3xl">What They Say</h3>
        </div>
        <TestimonialsSection testimonialsData={testimonialsData} />
      </div>
    </section>
  );
}
