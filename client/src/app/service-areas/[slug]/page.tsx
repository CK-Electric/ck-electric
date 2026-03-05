import { Metadata } from 'next';
import DetailView from '@/components/DetailView';
import Button from '@/components/Button';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import { GET_SERVICE_AREA, GET_SERVICE_AREAS } from '@/lib/wordpress-queries';

interface Specification {
  label: string;
  value: string;
}

interface ServiceAreaPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper function to strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export async function generateMetadata({ params }: ServiceAreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await fetchWordPressGraphQL(GET_SERVICE_AREA, { id: slug });
    const serviceArea = (response as any)?.serviceArea;

    if (!serviceArea) {
      return {
        title: 'Service Area | CK Electric',
        description: 'Professional electrical services across Puget Sound.',
      };
    }

    return {
      title: serviceArea.seo?.title || `${serviceArea.servicesArea?.location || slug} | CK Electric`,
      description: serviceArea.seo?.metaDesc || serviceArea.servicesArea?.introduction || 'Professional electrical services.',
      keywords: serviceArea.seo?.metaKeywords || '',
      openGraph: {
        title: serviceArea.seo?.opengraphTitle || serviceArea.servicesArea?.location || slug,
        description: serviceArea.seo?.metaDesc || serviceArea.servicesArea?.introduction,
        siteName: serviceArea.seo?.opengraphSiteName || 'CK Electric',
        type: 'website',
      },
    };
  } catch (error) {
    console.error('Error generating service area metadata:', error);
    return {
      title: 'Service Area | CK Electric',
      description: 'Professional electrical services across Puget Sound.',
    };
  }
}

export default async function ServiceAreaPage({ params }: ServiceAreaPageProps) {
  const { slug } = await params;
  try {
    const response = await fetchWordPressGraphQL(GET_SERVICE_AREA, { id: slug });
    const serviceArea = (response as any)?.serviceArea;

    if (!serviceArea) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-950 mb-4">Service Area Not Found</h1>
            <p className="text-neutral-600 mb-8">The service area you're looking for doesn't exist or has been removed.</p>
            <Button
              label="Back to Home"
              href="/"
              variant="secondary"
            />
          </div>
        </div>
      );
    }

    // Extract specifications from servicesArea data
    const specifications: Specification[] = [
      {
        label: "Service Area",
        value: serviceArea.servicesArea?.location || "Puget Sound"
      },
      {
        label: "Primary Service",
        value: "Professional Electrical Services"
      },
      {
        label: "Service Coverage",
        value: "Residential & Commercial"
      }
    ];

    // Fetch all service areas for related section
    const serviceAreasResponse = await fetchWordPressGraphQL(GET_SERVICE_AREAS);
    const serviceAreas = (serviceAreasResponse as any)?.serviceAreas?.nodes || [];

    return (
      <DetailView
        // Hero Section Props
        title={serviceArea.servicesArea?.location || "Service Area"}
        subtitle={serviceArea.servicesArea?.introduction || "Professional electrical services for this area."}
        backgroundImage={serviceArea.featuredImage?.node?.mediaItemUrl || "https://images.unsplash.com/photo-1603796826034-5910d5b6b2e?w=1920&h=1080&fit=crop"}
        primaryButtonText={serviceArea.servicesArea?.primaryCtaText || "Get a Free Estimate"}
        primaryButtonHref={serviceArea.servicesArea?.primaryCtaLink || "/estimate"}

        // Content Section Props
        contentTitle={`${serviceArea.servicesArea?.location} Electrical Services`}
        content={serviceArea.servicesArea?.content || '<p>Professional electrical services for this area.</p>'}

        // Sidebar Props
        specifications={specifications}
        ctaText={serviceArea.servicesArea?.secondaryCtaText || "Request Service"}
        ctaHref={serviceArea.servicesArea?.secondaryCtaLink || "/estimate"}

        // CtaBox Props
        showCtaBox={true}
        ctaBoxTitle="Ready to Get Started?"
        ctaBoxPrimaryButtonText={serviceArea.servicesArea?.primaryCtaText || "Get a Free Estimate"}
        ctaBoxPrimaryButtonHref={serviceArea.servicesArea?.primaryCtaLink || "/estimate"}
        ctaBoxSecondaryButtonText="Contact Us"
        ctaBoxSecondaryButtonHref="/contact"

        // Related Section Props - Show other service areas as related
        relatedTitle="Other Service Areas"
        relatedSectionType="areas"
        relatedItems={serviceAreas
          .filter((area: any) => area.servicesArea?.introduction && area.slug !== slug)
          .map((area: any) => ({
            id: area.id,
            title: area.servicesArea.location,
            description: stripHtml(area.servicesArea.introduction),
            link: `/service-areas/${area.slug}`,
            image: area.featuredImage?.node?.mediaItemUrl || 'https://images.unsplash.com/photo-1621905492509-7d1729c5be18?w=400&h=300&fit=crop',
            category: 'Service Area',
            readTime: '3 min read'
          }))}
      />
    );
  } catch (error) {
    console.error('Error fetching service area data:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-950 mb-4">Error Loading Service Area</h1>
          <p className="text-neutral-600 mb-8">There was an error loading the service area information.</p>
          <Button
            label="Back to Home"
            href="/"
            variant="secondary"
          />
        </div>
      </div>
    );
  }
}
