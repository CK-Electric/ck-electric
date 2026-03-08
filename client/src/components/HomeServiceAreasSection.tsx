import { LocationOn } from '@mui/icons-material';
import ServiceCard from './ServiceCard';

interface ServiceArea {
  id: string;
  slug: string;
  servicesArea: { location: string; introduction?: string };
  featuredImage?: { node?: { mediaItemUrl?: string } };
}

interface Props {
  serviceAreasData: { serviceAreas?: { nodes: ServiceArea[] } } | null;
  contactPhone: string;
}

export default function HomeServiceAreasSection({ serviceAreasData, contactPhone }: Props) {
  const serviceAreas = serviceAreasData?.serviceAreas?.nodes || [];

  return (
    <section className="py-20 bg-white" id="service-areas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary-800 font-black text-xs tracking-[0.4em] uppercase mb-4">SERVICE AREAS</h2>
          <h3 className="text-display-2 text-neutral-950 text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Serving the Entire Puget Sound Region
          </h3>
          <p className="text-neutral-700 text-lg max-w-3xl mx-auto mb-8">
            From Tacoma to Skagit Valley, we provide professional electrical services to homes and businesses across the greater Seattle area.
          </p>
          <p className="text-sm text-neutral-600 max-w-4xl mx-auto">
            Service areas include: Bellevue, Bothell, Burien, Carnation, Edmonds, Everett, Federal Way, Gold Bar, Issaquah, Kenmore, Kent, Kirkland, Lake Forest Park, Lake Stevens, Lynnwood, Marysville, Medina, Mercer Island, Mill Creek, Mt. Lake Terrace, Mukilteo, Newcastle, North Bend, Redmond, Renton, Sammamish, Seattle, Snohomish, Tacoma, Tukwila, Woodinville
          </p>
        </div>

        {serviceAreas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceAreas.map((area) => (
              <ServiceCard
                key={area.id}
                icon={<LocationOn className="text-4xl" />}
                title={area.servicesArea.location}
                description={area.servicesArea.introduction || 'Professional electrical services for this area.'}
                link={`/service-areas/${area.slug}`}
                service={{
                  id: area.id,
                  title: area.servicesArea?.location || 'Service Area',
                  slug: area.slug,
                  content: area.servicesArea?.introduction || '',
                  featuredImage: {
                    node: {
                      sourceUrl: area.featuredImage?.node?.mediaItemUrl || '',
                      altText: area.servicesArea?.location || 'Service area',
                    },
                  },
                  servicesFields: {
                    heroSection: {
                      primaryCatText: 'Learn More',
                      primaryCtaLink: `/service-areas/${area.slug}`,
                      secondaryCtaLink: '/request-estimate',
                      secondaryCtaText: 'Get Estimate',
                      tags: { nodes: [] },
                      phoneNumber: contactPhone,
                    },
                    smallDescription: area.servicesArea?.introduction || 'Professional electrical services',
                    specifications: {
                      coverageArea: area.servicesArea?.location || 'Puget Sound',
                      responseTime: 'Fast Response',
                      type: ['Professional Services'],
                      warranty: 'Quality Guaranteed',
                    },
                  },
                  seo: {
                    metaDesc: area.servicesArea?.introduction || 'Professional electrical services for this area.',
                    metaKeywords: 'electrical services, contractor, puget sound',
                    opengraphDescription: area.servicesArea?.introduction || 'Professional electrical services for this area.',
                  },
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
