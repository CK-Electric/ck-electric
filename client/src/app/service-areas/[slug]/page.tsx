import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DetailView from '@/components/DetailView';
import Button from '@/components/Button';
import HomeAwardSection from '@/components/HomeAwardSection';
import HomeTestimonialsSection from '@/components/HomeTestimonialsSection';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import { GET_SERVICE_AREA, GET_SERVICE_AREAS, GET_LANDING_PAGE, GET_TESTIMONIALS } from '@/lib/wordpress-queries';
import { buildMetadata, SITE_URL } from '@/lib/seo-utils';
import type { TestimonialsData } from '@/lib/wordpress-types';

interface ServiceAreaNode {
  id: string;
  slug: string;
  seo?: {
    metaDesc?: string;
    metaKeywords?: string;
    focuskw?: string;
    canonical?: string;
    opengraphTitle?: string;
    opengraphSiteName?: string;
    title?: string;
  };
  servicesArea: {
    location: string;
    pageTitle?: string;
    introduction?: string;
    content?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    introSection?: {
      title?: string;
      subtitle?: string;
      introContent?: string;
      introImage?: { node?: { mediaItemUrl?: string } };
    };
    whyCk?: {
      title?: string;
      subtitle?: string;
      reason1?: { title?: string; subtitle?: string };
      reason2?: { title?: string; subtitle?: string };
      reason3?: { title?: string; subtitle?: string };
      reason4?: { title?: string; subtitle?: string };
      reason5?: { title?: string; subtitle?: string };
      reason6?: { title?: string; subtitle?: string };
    };
    electricProblems?: {
      title?: string;
      content?: string;
      problem1?: { title?: string; subtitle?: string; problemImage?: { node?: { mediaItemUrl?: string } } };
      problem2?: { title?: string; subtitle?: string; problemImage?: { node?: { mediaItemUrl?: string } } };
      problem3?: { title?: string; subtitle?: string; problemImage?: { node?: { mediaItemUrl?: string } } };
      problem4?: { title?: string; subtitle?: string; problemImage?: { node?: { mediaItemUrl?: string } } };
    };
  };
  featuredImage?: {
    node?: {
      mediaItemUrl?: string;
    };
  };
}

interface ServiceAreasListData {
  serviceAreas: {
    nodes: Array<{
      id: string;
      slug: string;
      servicesArea: {
        location: string;
        introduction?: string;
      };
      featuredImage?: {
        node?: {
          mediaItemUrl?: string;
        };
      };
    }>;
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export async function generateStaticParams() {
  const data = await fetchWordPressGraphQL<ServiceAreasListData>(GET_SERVICE_AREAS);
  return (data?.serviceAreas?.nodes || []).map((area) => ({
    slug: area.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await fetchWordPressGraphQL<{ serviceArea: ServiceAreaNode }>(GET_SERVICE_AREA, { id: slug });
    const serviceArea = response?.serviceArea;

    if (!serviceArea) {
      return { title: 'Service Area | CK Electric' };
    }

    const locationName = serviceArea.servicesArea?.location || slug;

    return buildMetadata(serviceArea.seo as any, {
      title: `Electrical Services in ${locationName} | CK Electric`,
      description:
        serviceArea.servicesArea?.introduction ||
        `CK Electric provides professional electrical services in ${locationName}, WA. Licensed contractors for residential and commercial work.`,
      keywords: `electrician ${locationName}, electrical contractor ${locationName}, ${locationName} electrical services`,
      url: `${SITE_URL}/service-areas/${slug}`,
      image: serviceArea.featuredImage?.node?.mediaItemUrl,
    });
  } catch {
    return {
      title: 'Service Area | CK Electric',
      description: 'Professional electrical services across Puget Sound.',
    };
  }
}

export default async function ServiceAreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [response, serviceAreasResponse, headerResponse, testimonialsResponse] = await Promise.all([
    fetchWordPressGraphQL<{ serviceArea: ServiceAreaNode }>(GET_SERVICE_AREA, { id: slug }),
    fetchWordPressGraphQL<ServiceAreasListData>(GET_SERVICE_AREAS),
    fetchWordPressGraphQL<{ page: { landingPage: { headerInfo: { contactPhoneNumber: string } } } }>(GET_LANDING_PAGE),
    fetchWordPressGraphQL<TestimonialsData>(GET_TESTIMONIALS),
  ]);

  const serviceArea = response?.serviceArea;

  if (!serviceArea) {
    notFound();
  }

  const contactPhone =
    headerResponse?.page?.landingPage?.headerInfo?.contactPhoneNumber || '2062956363';
  const serviceAreas = serviceAreasResponse?.serviceAreas?.nodes || [];

  const specifications = [
    { label: 'Service Area', value: serviceArea.servicesArea?.location || 'Puget Sound' },
    { label: 'Primary Service', value: 'Professional Electrical Services' },
    { label: 'Service Coverage', value: 'Residential & Commercial' },
  ];

  const relatedItems = serviceAreas
    .filter((area) => area.servicesArea?.introduction && area.slug !== slug)
    .map((area) => ({
      id: area.id,
      title: area.servicesArea.location,
      description: stripHtml(area.servicesArea.introduction || ''),
      link: `/service-areas/${area.slug}`,
      image: area.featuredImage?.node?.mediaItemUrl || 'https://images.unsplash.com/photo-1621905492509-7d1729c5be18?w=400&h=300&fit=crop',
      category: 'Service Area',
      readTime: '3 min read',
    }));

  const introSection = serviceArea.servicesArea?.introSection;
  const whyCk = serviceArea.servicesArea?.whyCk;
  const primaryCtaText = serviceArea.servicesArea?.primaryCtaText;
  const primaryCtaLink = serviceArea.servicesArea?.primaryCtaLink;
  const secondaryCtaText = serviceArea.servicesArea?.secondaryCtaText;
  const secondaryCtaLink = serviceArea.servicesArea?.secondaryCtaLink;

  const whyCkReasons = whyCk
    ? [whyCk.reason1, whyCk.reason2, whyCk.reason3, whyCk.reason4, whyCk.reason5, whyCk.reason6].filter(
        (r): r is { title?: string; subtitle?: string } => Boolean(r?.title)
      )
    : [];

  const electricProblems = serviceArea.servicesArea?.electricProblems;
  type ProblemItem = { title?: string; subtitle?: string; problemImage?: { node?: { mediaItemUrl?: string } } };
  const problemsList: ProblemItem[] = electricProblems
    ? [electricProblems.problem1, electricProblems.problem2, electricProblems.problem3, electricProblems.problem4].filter(
        (p): p is ProblemItem => Boolean(p?.title)
      )
    : [];

  const afterHeroSlot = (
    <>
      <HomeAwardSection />

      {/* Intro Section — dark noche background */}
      {introSection?.title && (
        <section className="relative bg-neutral-950 overflow-hidden py-20 px-2 md:px-4 lg:px-10">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-[560px] h-[560px] rounded-full bg-primary-500/5 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full border border-primary-700/20 -translate-x-1/3 translate-y-1/3 pointer-events-none" />
          <div className="absolute top-1/2 left-[60%] w-[200px] h-[200px] rounded-full border border-primary-500/10 pointer-events-none" />
          <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-primary-500/50 pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-primary-600/40 pointer-events-none" />
          <div className="absolute top-3/4 left-1/2 w-1.5 h-1.5 rounded-full bg-primary-400/60 pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1200px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Text + CTAs */}
              <div className="flex flex-col gap-6">
                <p className="text-primary-500 text-small-upper tracking-widest">About This Service</p>
                <h2 className="text-neutral-50 text-display-3 leading-tight">{introSection.title}</h2>
                {introSection.subtitle && (
                  <p className="text-neutral-300 text-medium leading-relaxed">{introSection.subtitle}</p>
                )}
                {introSection.introContent && (
                  <p className="text-neutral-400 text-base leading-relaxed">{introSection.introContent}</p>
                )}
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button
                    label={primaryCtaText || 'Get a Free Estimate'}
                    variant="primary"
                    href={primaryCtaLink || '/request-estimate'}
                  />
                  {secondaryCtaText && (
                    <Button
                      label={secondaryCtaText}
                      variant="secondary"
                      href={secondaryCtaLink || '/contact'}
                    />
                  )}
                </div>
              </div>

              {/* Right: Image */}
              {introSection.introImage?.node?.mediaItemUrl && (
                <div className="relative">
                  <div className="absolute -inset-3 rounded-3xl border border-primary-500/15 pointer-events-none" />
                  <div className="absolute -bottom-4 -right-4 w-20 h-1 bg-primary-500 rounded-full" />
                  <div className="absolute -bottom-4 -right-4 w-1 h-20 bg-primary-500 rounded-full" />
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                    <Image
                      src={introSection.introImage.node.mediaItemUrl}
                      alt={introSection.title || ''}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Why CK Section */}
      {whyCk?.title && whyCkReasons.length > 0 && (
        <section className="relative bg-primary-900 overflow-hidden py-24 px-2 md:px-4 lg:px-10">
          {/* Decorative shapes */}
          <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] rounded-full border border-primary-700/30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full border border-primary-600/20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary-500/15 pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-primary-600/20 pointer-events-none" />
          <div className="absolute top-1/4 right-8 w-4 h-4 rounded-full bg-primary-400/50 pointer-events-none" />
          <div className="absolute bottom-1/4 left-16 w-3 h-3 rounded-full bg-primary-300/40 pointer-events-none" />
          <div className="absolute top-3/4 right-1/3 w-2 h-2 rounded-full bg-primary-500/60 pointer-events-none" />
          <div className="absolute top-12 right-1/4 w-24 h-0.5 bg-primary-500/20 rotate-45 pointer-events-none" />
          <div className="absolute bottom-16 left-1/4 w-16 h-0.5 bg-primary-400/30 -rotate-12 pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1200px]">
            {/* Centered header */}
            <div className="flex flex-col items-center text-center gap-4 mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/20 border border-primary-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                <p className="text-primary-300 text-small-upper tracking-widest">Why Choose Us</p>
              </span>
              <h2 className="text-neutral-50 text-display-3 max-w-2xl leading-tight">{whyCk.title}</h2>
              <div className="w-16 h-1 bg-primary-500 rounded-full" />
              {whyCk.subtitle && (
                <p className="text-primary-200 text-medium max-w-xl leading-relaxed">{whyCk.subtitle}</p>
              )}
            </div>

            {/* Reason cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {whyCkReasons.map((reason, i) => (
                <div
                  key={i}
                  className="flex gap-5 items-start bg-white/95 rounded-2xl px-6 py-5 shadow-xl shadow-primary-950/30 border border-primary-100/60"
                >
                  {/* Icon circle */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center shadow-md shadow-primary-700/40">
                    <CheckCircleRoundedIcon sx={{ fontSize: 28, color: 'var(--color-neutral-950)' }} />
                  </div>
                  {/* Text */}
                  <div className="flex flex-col gap-1 pt-1">
                    <h3 className="text-neutral-950 text-display-4 leading-snug">{reason.title}</h3>
                    {reason.subtitle && (
                      <p className="text-neutral-500 text-base leading-relaxed">{reason.subtitle}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Electric Problems Section */}
      {electricProblems?.title && problemsList.length > 0 && (
        <section className="relative bg-neutral-50 overflow-hidden py-24 px-2 md:px-4 lg:px-10">
          {/* Subtle decorative shapes */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-500/5 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full border border-primary-500/10 -translate-x-1/3 translate-y-1/3 pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-primary-500/40 pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full bg-primary-400/30 pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1200px]">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-12">
              <span className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-negative-50 border border-negative-200">
                <span className="w-1.5 h-1.5 rounded-full bg-negative-500" />
                <p className="text-negative-600 text-small-upper tracking-widest">Watch Out For</p>
              </span>
              <h2 className="text-neutral-950 text-display-3 max-w-2xl leading-tight">{electricProblems.title}</h2>
              <div className="w-16 h-1 bg-primary-500 rounded-full" />
              {electricProblems.content && (
                <p className="text-neutral-600 text-base leading-relaxed max-w-3xl">{electricProblems.content}</p>
              )}
            </div>

            {/* Problem cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {problemsList.map((problem, i) => (
                <div
                  key={i}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-md shadow-neutral-200/80 border border-neutral-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  {problem.problemImage?.node?.mediaItemUrl ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={problem.problemImage.node.mediaItemUrl}
                        alt={problem.title || ''}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 to-transparent" />
                      <span className="absolute bottom-3 left-3 w-7 h-7 rounded-full bg-negative-500 flex items-center justify-center text-white text-small-bold">
                        {i + 1}
                      </span>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full bg-negative-100 flex items-center justify-center text-negative-600 text-base-bold">
                        {i + 1}
                      </span>
                    </div>
                  )}
                  {/* Text */}
                  <div className="flex flex-col gap-2 p-5">
                    <div className="w-8 h-0.5 bg-primary-500 rounded-full" />
                    <h3 className="text-neutral-950 text-display-4 leading-snug">{problem.title}</h3>
                    {problem.subtitle && (
                      <p className="text-neutral-500 text-small leading-relaxed">{problem.subtitle}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );

  return (
    <DetailView
      title={serviceArea.servicesArea?.pageTitle || serviceArea.servicesArea?.location || 'Service Area'}
      subtitle={serviceArea.servicesArea?.introduction || 'Professional electrical services for this area.'}
      backgroundImage={serviceArea.featuredImage?.node?.mediaItemUrl || 'https://images.unsplash.com/photo-1603796826034-5910d5b6b2e?w=1920&h=1080&fit=crop'}
      primaryButtonText={serviceArea.servicesArea?.primaryCtaText || 'Get a Free Estimate'}
      primaryButtonHref={serviceArea.servicesArea?.primaryCtaLink || '/request-estimate'}
      secondaryButtonText={serviceArea.servicesArea?.secondaryCtaText || undefined}
      secondaryButtonHref={serviceArea.servicesArea?.secondaryCtaLink || undefined}
      contentTitle={`${serviceArea.servicesArea?.location} Electrical Services`}
      content={serviceArea.servicesArea?.content || '<p>Professional electrical services for this area.</p>'}
      specifications={specifications}
      ctaText={serviceArea.servicesArea?.secondaryCtaText || 'Request Service'}
      ctaHref={serviceArea.servicesArea?.secondaryCtaLink || '/request-estimate'}
      showCtaBox={true}
      ctaBoxTitle="Ready to Get Started?"
      ctaBoxPrimaryButtonText={serviceArea.servicesArea?.primaryCtaText || 'Get a Free Estimate'}
      ctaBoxPrimaryButtonHref={serviceArea.servicesArea?.primaryCtaLink || '/request-estimate'}
      ctaBoxSecondaryButtonText="Call Us Now"
      ctaBoxSecondaryButtonHref={`tel:${contactPhone}`}
      relatedTitle="Other Service Areas"
      relatedSectionType="areas"
      relatedItems={relatedItems}
      afterHeroSlot={afterHeroSlot}
      testimonialsSlot={
        testimonialsResponse?.testimonials?.nodes?.length
          ? <HomeTestimonialsSection testimonialsData={testimonialsResponse} />
          : undefined
      }
    />
  );
}
