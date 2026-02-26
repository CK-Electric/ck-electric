import { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';

// Generate metadata for the services page - SSR
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Services | CK Electric - Puget Sound',
    description: 'Professional electrical services including commercial TIs, wiring, panel upgrades, EV chargers, and emergency repair across Puget Sound.',
    keywords: 'electrical services, commercial electrical, residential electrical, EV charger installation, panel upgrades, emergency repair, Puget Sound',
  };
}

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "Commercial Electrical",
      description: "Complete electrical solutions for businesses including tenant improvements, new construction, and system upgrades.",
      icon: "⚡",
      link: "/services/commercial-electrical"
    },
    {
      id: 2,
      title: "Residential Wiring",
      description: "Professional home wiring services including new installations, rewiring, and electrical system upgrades.",
      icon: "🏠",
      link: "/services/residential-wiring"
    },
    {
      id: 3,
      title: "Panel Upgrades",
      description: "Modern electrical panel installations to handle today's power demands and improve safety.",
      icon: "🔌",
      link: "/services/panel-upgrades"
    },
    {
      id: 4,
      title: "EV Charger Installation",
      description: "Certified installation of electric vehicle charging stations for homes and businesses.",
      icon: "🚗",
      link: "/services/ev-chargers"
    },
    {
      id: 5,
      title: "Emergency Repair",
      description: "24/7 emergency electrical services for residential and commercial properties.",
      icon: "🚨",
      link: "/services/emergency-repair"
    },
    {
      id: 6,
      title: "Lighting Design",
      description: "Custom lighting solutions including LED installations, landscape lighting, and smart controls.",
      icon: "💡",
      link: "/services/lighting-design"
    }
  ];

  return (
    <>
      <HeroSection
        title="Professional Electrical Services"
        subtitle="From commercial tenant improvements to residential rewiring, our licensed electricians deliver quality workmanship across Puget Sound."
        primaryButtonText="Get a Free Estimate"
        primaryButtonHref="/request-estimate"
        secondaryButtonText="Call Us Now"
        secondaryButtonHref="/contact"
        backgroundImage="https://images.unsplash.com/photo-1621905492509-7d1729c5be18?w=1920&h=1080&fit=crop"
      />
      
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display-3 text-neutral-950 mb-6">Our Services</h2>
            <p className="text-base text-neutral-600 max-w-3xl mx-auto">
              Comprehensive electrical solutions for residential and commercial clients throughout Tacoma to Skagit Valley.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                link={service.link}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
