import Image from 'next/image';
import { Verified, Timer } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import type { LandingPageData } from '../lib/wordpress-types';

const EstimateForm = dynamic(() => import('./EstimateForm'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
});

interface Props {
  landingPageData: LandingPageData | null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function HomeHeroSection({ landingPageData }: Props) {
  const lp = landingPageData?.page;
  const heroTitle = lp?.title || 'Leaders in quality electrical services';
  const heroSubtitle = stripHtml(
    lp?.content || 'Talk directly with a licensed electrician. No call centers, no middlemen. Fast response and industrial-grade quality for every project.'
  );
  const tag = lp?.landingPage.tag || 'Direct Access to Licensed Experts';
  const feature1Title = lp?.landingPage.heroItems.feature1.title1 || 'LICENSED & BONDED';
  const feature1Description = lp?.landingPage.heroItems.feature1.description1 || 'Full Compliance Guaranteed';
  const feature2Title = lp?.landingPage.heroItems.item2.title || 'FAST RESPONSE';
  const feature2Description = lp?.landingPage.heroItems.item2.description || 'Same-day Estimates Available';
  const formImageUrl = lp?.landingPage.formImage?.node?.mediaItemUrl;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100 via-primary-100/60 to-transparent z-10"></div>
        <Image
          alt="Professional electrician working on electrical panel"
          className="object-cover opacity-40 mix-blend-multiply"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe1RGeqlhyzdm30jYOPD9HCL5yeYkmqTmDP8YHhPde388fuAjj5yUNgcTMi5wM5p-7m2FjEg7REBZKjBYIIvHLiGnl5CoamJanmWrHX-oxIky2gOJ3r8iHWB16MULUGKtMv9knWBq-2s317u7chblbTbQLI2B9Aul3ej42k6uQ8nyfpU7rDA-cqo8o3aeOLx-NqgKY9Nhv2LV0X2lnvNaSfC3CSGeMqLSAmLiZcsyCLXHoXptBMGQpy_UGpCZh1llDd_AnSjUmc6Q"
          fill
          priority
          sizes="100vw"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-positive-100 border border-positive-200 rounded-full text-small-upper text-positive-700 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-positive-500 animate-pulse" aria-hidden="true"></span>
            {tag}
          </div>

          <h1 className="hero-title text-neutral-950 leading-[0.9] mb-8 tracking-tighter font-bold">
            {heroTitle.split(' ').map((word, index) =>
              index === 0 ? (
                <span key={index}>
                  <span className="text-primary-500 italic underline decoration-primary-400">{word}</span>
                  <span> </span>
                </span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h1>

          <p className="text-base text-neutral-700 mb-10 leading-relaxed max-w-xl">
            {heroSubtitle}
          </p>

          <div className="flex flex-wrap flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 border-l-4 border-primary-500">
              <Verified className="text-primary-500 text-4xl" aria-hidden="true" />
              <div>
                <p className="text-neutral-950 text-base-upper mb-1">{feature1Title}</p>
                <p className="text-neutral-700/70 text-small mt-1">{feature1Description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 border-l-4 border-primary-500">
              <Timer className="text-primary-500 text-4xl" aria-hidden="true" />
              <div>
                <p className="text-neutral-950 text-base-upper mb-1">{feature2Title}</p>
                <p className="text-neutral-700/70 text-small mt-1">{feature2Description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative z-10 bg-white p-10 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-display-3 text-neutral-950">Get a Free Estimate</h2>
                <p className="text-neutral-700 text-small">Professional service within 24 hours.</p>
              </div>
              {formImageUrl && (
                <Image
                  src={formImageUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-16 h-16 object-contain flex-shrink-0"
                  width={64}
                  height={64}
                  sizes="64px"
                  quality={60}
                  loading="lazy"
                />
              )}
            </div>
            <EstimateForm />
          </div>
        </div>
      </div>
    </section>
  );
}
