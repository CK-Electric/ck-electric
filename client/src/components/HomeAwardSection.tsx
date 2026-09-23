import Image from 'next/image';
import { ArrowForward, Star, WorkspacePremium } from '@mui/icons-material';
import Button from './Button';

interface HomeAwardSectionProps {
  title?: string;
  issuer?: string;
  recognitionDate?: string;
  description?: string;
  imageUrl?: string;
  verificationUrl?: string;
}

export default function HomeAwardSection({
  title = 'Ranked #1 Electrician in Kirkland',
  issuer = 'BusinessRate',
  recognitionDate = 'June 2026',
  description = 'This recognition reflects the confidence our customers place in our work. Thank you to every homeowner and business that trusted CK Electric with their project.',
  imageUrl = '/award-businessrate-june-2026.png',
  verificationUrl = '#testimonials',
}: HomeAwardSectionProps) {
  return (
    <section
      id="recognition"
      className="relative overflow-hidden bg-primary-50 py-16 md:py-24"
      aria-labelledby="award-title"
    >
      <div
        className="absolute -right-24 top-12 h-64 w-64 rotate-12 border-[32px] border-primary-200/60"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden bg-neutral-950 shadow-2xl lg:grid-cols-12">
          <div className="relative flex min-h-[340px] items-center justify-center bg-primary-500 px-8 py-10 lg:col-span-5 lg:min-h-[500px] lg:px-12">
            <div
              className="absolute inset-5 border border-primary-900/30"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-16 -left-16 h-48 w-48 rotate-45 bg-primary-300/60"
              aria-hidden="true"
            />

            <Image
              src={imageUrl}
              alt="BusinessRate Ranked #1 Electrician in Kirkland award presented to CK Electric, June 2026"
              width={3000}
              height={3755}
              sizes="(max-width: 1024px) 220px, 320px"
              className="relative z-10 h-auto max-h-[410px] w-auto max-w-full object-contain shadow-2xl"
            />
          </div>

          <div className="relative flex flex-col justify-center px-6 py-12 sm:px-10 lg:col-span-7 lg:px-16 lg:py-14">
            <WorkspacePremium
              className="absolute right-8 top-8 text-primary-500/20"
              sx={{ fontSize: 120 }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-3 border border-primary-500/40 bg-primary-950 px-4 py-2 text-primary-300">
                <Star className="text-primary-500" fontSize="small" aria-hidden="true" />
                <span className="text-small-upper tracking-widest">
                  {issuer} · {recognitionDate}
                </span>
              </div>

              <p className="mb-3 text-base-upper text-primary-500">
                Community recognition
              </p>
              <h2
                id="award-title"
                className="about-title mb-5 max-w-2xl leading-tight text-white"
              >
                {title}
              </h2>
              <p className="mb-8 max-w-2xl text-base leading-relaxed text-neutral-200">
                {description}
              </p>

              <Button
                label="See What Customers Say"
                variant="primary"
                href={verificationUrl}
                icon={<ArrowForward fontSize="small" />}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
