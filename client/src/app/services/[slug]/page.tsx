import { Metadata } from 'next';
import DetailView from '@/components/DetailView';
import { fetchWordPressGraphQL } from '@/lib/wordpress-graphql';
import { GET_SERVICE_BY_SLUG } from '@/lib/wordpress-queries';
import { ServiceDetailResponse } from '@/lib/wordpress-types';

// Helper function to strip HTML tags
function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

// Generate metadata for service detail pages - SSR
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const response = await fetchWordPressGraphQL<ServiceDetailResponse>(GET_SERVICE_BY_SLUG, { slug });
    const service = response.data?.service;

    return {
      title: service?.title || 'Service | CK Electric',
      description: service?.seo?.metaDesc || 'Professional electrical services across Puget Sound.',
      keywords: service?.seo?.metaKeywords || 'electrical services, CK Electric, Puget Sound',
    };
  } catch (error) {
    console.error('Error generating service metadata:', error);
    return {
      title: 'Service | CK Electric',
      description: 'Professional electrical services across Puget Sound.',
    };
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const response = await fetchWordPressGraphQL<ServiceDetailResponse>(GET_SERVICE_BY_SLUG, { slug });
    const service = response.data?.service;

    if (!service) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Not Found</h2>
            <a href="/services" className="text-blue-600 hover:text-blue-700">Back to Services</a>
          </div>
        </div>
      );
    }

    // Extract specifications
    const specifications = [
      {
        label: 'Tags',
        value: service.servicesFields.heroSection.tags?.nodes?.map(tag => tag.name).join(', ') || 'Electrical Services'
      },
      {
        label: 'Response Time',
        value: service.servicesFields.specifications.responseTime || 'Under 24 Hours'
      },
      {
        label: 'Warranty',
        value: service.servicesFields.specifications.warranty || 'Lifetime Workmanship'
      },
      {
        label: 'Coverage Area',
        value: service.servicesFields.specifications.coverageArea || 'Greater Puget Sound Area'
      }
    ];

    return (
      <DetailView
        title={service.title}
        subtitle={stripHtml(service.servicesFields.smallDescription)}
        contentTitle="Service Details"
        content={service.servicesFields.mainContentSection || 'Professional electrical services with quality workmanship and attention to detail.'}
        specifications={specifications}
        primaryButtonText={service.servicesFields.heroSection.primaryCatText || "Get a Free Estimate"}
        primaryButtonHref={service.servicesFields.heroSection.primaryCtaLink || "/request-estimate"}
        backgroundImage={service.featuredImage?.node?.sourceUrl || "https://images.unsplash.com/photo-1621905492509-7d1729c5be18?w=1920&h=1080&fit=crop"}
        showCtaBox={true}
        ctaBoxTitle="Ready to get started?"
        ctaBoxPrimaryButtonText={service.servicesFields.heroSection.primaryCatText || "Get a Free Estimate"}
        ctaBoxPrimaryButtonHref={service.servicesFields.heroSection.primaryCtaLink || "/request-estimate"}
        ctaBoxSecondaryButtonText={service.servicesFields.heroSection.secondaryCtaText || "Call Us Now"}
        ctaBoxSecondaryButtonHref={service.servicesFields.heroSection.secondaryCtaLink || "/contact"}
      />
    );
  } catch (error) {
    console.error('Error loading service:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Service</h2>
          <p className="text-gray-600 mb-4">There was an error loading this service. Please try again later.</p>
          <a href="/services" className="text-blue-600 hover:text-blue-700">Back to Services</a>
        </div>
      </div>
    );
  }
}
