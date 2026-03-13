import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DetailView from '@/components/DetailView';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import { GET_SERVICE_BY_SLUG, GET_ALL_SERVICES } from '@/lib/wordpress-queries';
import { ServiceDetailResponse, ServicesResponse } from '@/lib/wordpress-types';
import { buildMetadata, SITE_URL } from '@/lib/seo-utils';

function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export async function generateStaticParams() {
  const data = await fetchWordPressGraphQL<ServicesResponse>(GET_ALL_SERVICES);
  return (data?.services?.nodes || []).map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await fetchWordPressGraphQL<ServiceDetailResponse>(GET_SERVICE_BY_SLUG, { slug });
    const service = response?.service;

    if (!service) {
      return { title: 'Service Not Found' };
    }

    const title = service.seo?.focuskw
      ? `${service.title} in Puget Sound`
      : service.title;

    return buildMetadata(service.seo as any, {
      title,
      description: `Professional ${service.title} services across Puget Sound. Licensed electricians serving Seattle, Tacoma, Bellevue, and surrounding areas.`,
      keywords: `${service.title}, electrical services, licensed electrician, Puget Sound`,
      url: `${SITE_URL}/services/${slug}`,
      image: service.featuredImage?.node?.sourceUrl,
    });
  } catch {
    return {
      title: 'Service | CK Electric',
      description: 'Professional electrical services across Puget Sound.',
    };
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const response = await fetchWordPressGraphQL<ServiceDetailResponse>(GET_SERVICE_BY_SLUG, { slug });
  const service = response?.service;

  if (!service) {
    notFound();
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.seo?.metaDesc || stripHtml(service.servicesFields?.smallDescription),
    provider: {
      '@type': 'ElectricalContractor',
      '@id': 'https://ck-electric.com/#business',
      name: 'CK Electric',
    },
    areaServed: {
      '@type': 'State',
      name: 'Washington',
    },
    serviceType: service.title,
  };

  const specifications = [
    {
      label: 'Tags',
      value: service.servicesFields.heroSection.tags?.nodes?.map((tag) => tag.name).join(', ') || 'Electrical Services',
    },
    {
      label: 'Response Time',
      value: service.servicesFields.specifications.responseTime || 'Under 24 Hours',
    },
    {
      label: 'Warranty',
      value: service.servicesFields.specifications.warranty || 'Lifetime Workmanship',
    },
    {
      label: 'Coverage Area',
      value: service.servicesFields.specifications.coverageArea || 'Greater Puget Sound Area',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <DetailView
        title={service.title}
        subtitle={stripHtml(service.servicesFields.smallDescription)}
        contentTitle="Service Details"
        content={service.servicesFields.mainContentSection || 'Professional electrical services with quality workmanship and attention to detail.'}
        specifications={specifications}
        primaryButtonText={service.servicesFields.heroSection.primaryCatText || 'Get a Free Estimate'}
        primaryButtonHref={service.servicesFields.heroSection.primaryCtaLink || '/request-estimate'}
        ctaText={service.servicesFields.heroSection.primaryCatText || 'Get a Free Estimate'}
        ctaHref={service.servicesFields.heroSection.primaryCtaLink || '/request-estimate'}
        backgroundImage={service.featuredImage?.node?.sourceUrl || 'https://images.unsplash.com/photo-1621905492509-7d1729c5be18?w=1920&h=1080&fit=crop'}
        showCtaBox={true}
        ctaBoxTitle="Ready to get started?"
        ctaBoxPrimaryButtonText={service.servicesFields.heroSection.primaryCatText || 'Get a Free Estimate'}
        ctaBoxPrimaryButtonHref={service.servicesFields.heroSection.primaryCtaLink || '/request-estimate'}
        ctaBoxSecondaryButtonText={service.servicesFields.heroSection.secondaryCtaText || 'Contact Us'}
        ctaBoxSecondaryButtonHref={service.servicesFields.heroSection.secondaryCtaLink || '/contact'}
      />
    </>
  );
}
