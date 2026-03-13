import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DetailView from '@/components/DetailView';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import { GET_SERVICE_AREA, GET_SERVICE_AREAS, GET_LANDING_PAGE } from '@/lib/wordpress-queries';
import { buildMetadata, SITE_URL } from '@/lib/seo-utils';

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
    introduction?: string;
    content?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
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

  const [response, serviceAreasResponse, headerResponse] = await Promise.all([
    fetchWordPressGraphQL<{ serviceArea: ServiceAreaNode }>(GET_SERVICE_AREA, { id: slug }),
    fetchWordPressGraphQL<ServiceAreasListData>(GET_SERVICE_AREAS),
    fetchWordPressGraphQL<{ page: { landingPage: { headerInfo: { contactPhoneNumber: string } } } }>(GET_LANDING_PAGE),
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

  return (
    <DetailView
      title={serviceArea.servicesArea?.location || 'Service Area'}
      subtitle={serviceArea.servicesArea?.introduction || 'Professional electrical services for this area.'}
      backgroundImage={serviceArea.featuredImage?.node?.mediaItemUrl || 'https://images.unsplash.com/photo-1603796826034-5910d5b6b2e?w=1920&h=1080&fit=crop'}
      primaryButtonText={serviceArea.servicesArea?.primaryCtaText || 'Get a Free Estimate'}
      primaryButtonHref={serviceArea.servicesArea?.primaryCtaLink || '/request-estimate'}
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
    />
  );
}
