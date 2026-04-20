import React from 'react';
import Image from 'next/image';
import Button from './Button';
import RelatedArticles from './RelatedArticles';
import CtaBox from './CtaBox';
import { renderRichText } from '../lib/render-rich-text';

interface Specification {
  label: string;
  value: string;
}

interface RelatedItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  link: string;
  category?: string;
  readTime?: string;
}

interface DetailViewProps {
  // Hero Section Props
  title: string;
  subtitle: string;
  backgroundImage: string;
  emailPlaceholder?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;

  // Content Section Props
  contentTitle: string;
  content: string;

  // Sidebar Props
  specifications: Specification[];
  ctaText?: string;
  ctaHref?: string;

  // CtaBox Props
  showCtaBox?: boolean;
  ctaBoxTitle?: string;
  ctaBoxPrimaryButtonText?: string;
  ctaBoxPrimaryButtonHref?: string;
  ctaBoxSecondaryButtonText?: string;
  ctaBoxSecondaryButtonHref?: string;

  // Related Section Props
  relatedTitle?: string;
  relatedItems?: RelatedItem[];
  relatedSectionType?: 'services' | 'projects' | 'areas';

  // Gallery Props
  projectImages?: string[];

  // Slot rendered between hero and content sections
  afterHeroSlot?: React.ReactNode;

  // Slot rendered before related articles
  testimonialsSlot?: React.ReactNode;
}

export default function DetailView({
  title,
  subtitle,
  backgroundImage,
  emailPlaceholder = "Enter your email for a free consult",
  primaryButtonText,
  primaryButtonHref = "#",
  secondaryButtonText,
  secondaryButtonHref = "#",
  contentTitle,
  content,
  specifications,
  ctaText = "REQUEST ESTIMATE",
  ctaHref = "#",
  showCtaBox = false,
  ctaBoxTitle = "Ready to get started?",
  ctaBoxPrimaryButtonText = "Get a Free Estimate",
  ctaBoxPrimaryButtonHref = "/request-estimate",
  ctaBoxSecondaryButtonText = "Call Us Now",
  ctaBoxSecondaryButtonHref = "/contact",
  relatedTitle = "Related",
  relatedItems = [],
  relatedSectionType = 'services',
  projectImages = [],
  afterHeroSlot,
  testimonialsSlot,
}: DetailViewProps) {

  
  const getRelatedSectionTitle = () => {
    switch (relatedSectionType) {
      case 'services':
        return 'Other Services';
      case 'projects':
        return 'Related Projects';
      case 'areas':
        return 'Service Areas';
      default:
        return relatedTitle;
    }
  };

  // Convert RelatedItems to RelatedArticle format for RelatedArticles component
  const relatedArticles = relatedItems.map(item => ({
    id: parseInt(item.id),
    title: item.title,
    description: item.description,
    image: item.image || 'https://images.unsplash.com/photo-1621905492509-7d1729c5be18?w=400&h=300&fit=crop',
    link: item.link,
    category: item.category || 'Service',
    readTime: item.readTime || '5 min read'
  }));

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full px-2 md:px-4 lg:px-10 py-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="@container">
            <div 
              className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-2xl items-start justify-center px-8 md:px-16 relative overflow-hidden group shadow-2xl"
              style={{
                backgroundImage: `linear-gradient(rgba(22, 16, 3, 0.7) 0%, rgba(22, 16, 3, 0.4) 100%), url('${backgroundImage}')`
              }}
            >
              <div className="absolute inset-0 bg-primary-500/10 mix-blend-overlay"></div>
              <div className="relative z-10 flex flex-col gap-4 max-w-2xl">
                <h1 className="text-neutral-50 text-display-3 md:text-display-2 leading-tight tracking-tight">
                  {title}
                </h1>
                <p className="text-neutral-200 text-medium font-normal max-w-lg">
                  {subtitle}
                </p>
                {(primaryButtonText || secondaryButtonText) && (
                  <div className="flex flex-wrap gap-4 mt-2">
                    {primaryButtonText && (
                      <Button label={primaryButtonText} variant="primary" href={primaryButtonHref} />
                    )}
                    {secondaryButtonText && (
                      <Button label={secondaryButtonText} variant="secondary" href={secondaryButtonHref} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {afterHeroSlot}

      {/* Content Section */}
      <section className="px-2 md:px-4 lg:px-10 py-12">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-neutral-950 text-display-3 font-black leading-tight tracking-tight">
                {contentTitle}
              </h2>
              <div className="w-20 h-1.5 bg-primary-500 rounded-full"></div>
            </div>
            <div className="space-y-4 text-neutral-600 text-base leading-relaxed">
              {renderRichText(content)}
            </div>
            {showCtaBox && (
              <CtaBox
                title={ctaBoxTitle}
                primaryButtonText={ctaBoxPrimaryButtonText}
                primaryButtonHref={ctaBoxPrimaryButtonHref}
                secondaryButtonText={ctaBoxSecondaryButtonText}
                secondaryButtonHref={ctaBoxSecondaryButtonHref}
              />
            )}
          </div>
          
          <aside className="lg:col-span-1">
            <div className="bg-neutral-50 rounded-2xl p-8 border border-primary-500/20 shadow-sm sticky top-24">
              <h3 className="text-neutral-950 text-base-bold mb-6 flex items-center gap-2">
                <span className="text-primary-500">⚡</span>
                Specifications
              </h3>
              <div className="space-y-6">
                {specifications.map((spec, index) => (
                  <div 
                    key={index}
                    className={`flex flex-col gap-1 pb-4 ${index < specifications.length - 1 ? 'border-b border-primary-500/10' : ''}`}
                  >
                    <p className="text-primary-800 text-small-upper font-bold uppercase tracking-widest">
                      {spec.label}
                    </p>
                    <p className="text-neutral-950 font-semibold">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
              <Button
                label={ctaText}
                variant="primary"
                href={ctaHref || "/request-estimate"}
                className="mt-8 w-full"
              />
            </div>
          </aside>
        </div>
      </section>

      {/* Project Gallery */}
      {projectImages.length > 0 && (
        <section className="bg-neutral-950 py-20 px-2 md:px-4 lg:px-10">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col gap-3 mb-10">
              <p className="text-primary-500 text-small-upper font-bold uppercase tracking-widest">Project Gallery</p>
              <h2 className="text-neutral-50 text-display-3 font-black leading-tight tracking-tight">
                Project in Detail
              </h2>
              <div className="w-20 h-1.5 bg-primary-500 rounded-full"></div>
            </div>

            {/* Desktop editorial grid */}
            <div className="hidden md:grid grid-cols-12 gap-4 auto-rows-[280px]">
              <div className="col-span-7 row-span-2 relative overflow-hidden rounded-2xl">
                <Image
                  src={projectImages[0]}
                  alt="Project photo 1"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 58vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent pointer-events-none" />
              </div>
              {projectImages[1] && (
                <div className="col-span-5 row-span-1 relative overflow-hidden rounded-2xl">
                  <Image
                    src={projectImages[1]}
                    alt="Project photo 2"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent pointer-events-none" />
                </div>
              )}
              {projectImages[2] && (
                <div className="col-span-5 row-span-1 relative overflow-hidden rounded-2xl">
                  <Image
                    src={projectImages[2]}
                    alt="Project photo 3"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent pointer-events-none" />
                </div>
              )}
            </div>

            {/* Mobile scroll-snap carousel */}
            <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-2 px-2 scrollbar-hide">
              {projectImages.map((img, i) => (
                <div
                  key={i}
                  className="snap-center flex-none w-[85vw] h-[240px] relative overflow-hidden rounded-2xl"
                >
                  <Image
                    src={img}
                    alt={`Project photo ${i + 1}`}
                    className="object-cover"
                    fill
                    loading="lazy"
                    sizes="85vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Carousel dots (mobile) */}
            <div className="md:hidden flex justify-center gap-2 mt-5">
              {projectImages.map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all ${i === 0 ? 'w-6 h-1.5 bg-primary-500' : 'w-1.5 h-1.5 bg-neutral-600'}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonialsSlot}

      {/* Related Section using RelatedArticles component */}
      {relatedItems.length > 0 && (
        <RelatedArticles
          articles={relatedArticles}
          title={getRelatedSectionTitle()}
        />
      )}
    </>
  );
}
