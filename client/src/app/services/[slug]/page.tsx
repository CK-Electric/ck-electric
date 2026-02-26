import { Metadata } from 'next';
import DetailView from '@/components/DetailView';

// Generate metadata for service detail pages - SSR
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Commercial Electrical Services | CK Electric',
    description: 'Professional commercial electrical solutions including tenant improvements, new construction, and system upgrades across Puget Sound.',
    keywords: 'commercial electrical, tenant improvements, business electrical, commercial wiring, CK Electric',
  };
}

export default function CommercialElectricalPage() {
  const specifications = [
    {
      label: 'Type',
      value: 'Electrical Contracting'
    },
    {
      label: 'Response Time',
      value: 'Under 24 Hours'
    },
    {
      label: 'Warranty',
      value: 'Lifetime Workmanship'
    },
    {
      label: 'Coverage Area',
      value: 'Greater Kirkland Area'
    }
  ];

  const content = (
    <>
      <p>
        At CK Electric, we pride ourselves on delivering top-tier electrical services across the Kirkland region. Our team of certified professionals ensures that every project, whether large-scale commercial upgrades or intricate residential repairs, is handled with the utmost precision and care.
      </p>
      <p>
        We utilize the latest diagnostic technology and adhere to the strictest National Electrical Code (NEC) safety standards to provide you with peace of mind and high-quality results. Our commitment to excellence has made us the trusted partner for local homeowners and business managers alike.
      </p>
      <p>
        From initial consultation to final inspection, we maintain transparent communication and project management, ensuring your electrical systems are efficient, safe, and ready for the future.
      </p>
    </>
  );

  const relatedServices = [
    {
      id: '1',
      title: 'Residential Wiring',
      description: 'Professional home wiring services including new installations, rewiring, and electrical system upgrades.',
      image: 'https://images.unsplash.com/photo-1621905492509-7d1729c5be18?w=400&h=300&fit=crop',
      link: '/services/residential-wiring'
    },
    {
      id: '2',
      title: 'Panel Upgrades',
      description: 'Modern electrical panel installations to handle today\'s power demands and improve safety.',
      image: 'https://images.unsplash.com/photo-1621905492509-7d1729c5be18?w=400&h=300&fit=crop',
      link: '/services/panel-upgrades'
    },
    {
      id: '3',
      title: 'EV Charger Installation',
      description: 'Certified installation of electric vehicle charging stations for homes and businesses.',
      image: 'https://images.unsplash.com/photo-1621905492509-7d1729c5be18?w=400&h=300&fit=crop',
      link: '/services/ev-chargers'
    }
  ];

  return (
    <DetailView
      title="Commercial Electrical Services"
      subtitle="Professional electrical solutions for commercial businesses. Reliable, efficient, and built to the highest safety standards in Kirkland."
      backgroundImage="https://images.unsplash.com/photo-1621905492509-7d1729c5be18?w=1920&h=1080&fit=crop"
      primaryButtonText="Get Started"
      primaryButtonHref="/request-estimate"
      contentTitle="Expert Commercial Electrical Solutions"
      content={content}
      specifications={specifications}
      ctaText="REQUEST ESTIMATE"
      ctaHref="/request-estimate"
      relatedItems={relatedServices}
      relatedSectionType="services"
    />
  );
}
