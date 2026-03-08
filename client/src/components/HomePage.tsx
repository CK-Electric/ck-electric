import dynamic from 'next/dynamic';
import CtaBox from './CtaBox';

// Load above-the-fold content immediately
import HomeHeroSection from './HomeHeroSection';
import HomeAboutSection from './HomeAboutSection';
import HomeServicesSection from './HomeServicesSection';

// Load below-the-fold content dynamically for better performance
const HomeStatsSection = dynamic(() => import('./HomeStatsSection'), {
  loading: () => <div className="py-32 bg-neutral-50 animate-pulse" />
});
const HomeServiceAreasSection = dynamic(() => import('./HomeServiceAreasSection'), {
  loading: () => <div className="py-20 bg-white animate-pulse" />
});
const HomeOwnersSection = dynamic(() => import('./HomeOwnersSection'), {
  loading: () => <div className="py-32 bg-neutral-50 animate-pulse" />
});
const HomeProjectsSection = dynamic(() => import('./HomeProjectsSection'), {
  loading: () => <div className="py-32 bg-white animate-pulse" />
});
const HomeClientsSection = dynamic(() => import('./HomeClientsSection'), {
  loading: () => <div className="py-24 bg-white animate-pulse" />
});
const HomeTestimonialsSection = dynamic(() => import('./HomeTestimonialsSection'), {
  loading: () => <div className="py-32 bg-neutral-50 animate-pulse" />
});
import type {
  LandingPageData,
  OwnersData,
  TestimonialsData,
  ClientsData,
  ServicesResponse,
  ProjectsResponse,
} from '../lib/wordpress-types';

interface HomePageProps {
  landingPageData: LandingPageData | null;
  ownersData: OwnersData | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serviceAreasData: any;
  testimonialsData: TestimonialsData | null;
  clientsData: ClientsData | null;
  servicesData: ServicesResponse | null;
  projectsData: ProjectsResponse | null;
  contactPhone: string;
}

export default function HomePage({
  landingPageData,
  ownersData,
  serviceAreasData,
  testimonialsData,
  clientsData,
  servicesData,
  projectsData,
  contactPhone,
}: HomePageProps) {
  return (
    <div className="bg-primary-50">
      <HomeHeroSection landingPageData={landingPageData} />
      <HomeStatsSection landingPageData={landingPageData} />
      <HomeAboutSection landingPageData={landingPageData} />
      <HomeServicesSection servicesData={servicesData} />
      <HomeServiceAreasSection serviceAreasData={serviceAreasData} contactPhone={contactPhone} />
      <HomeOwnersSection ownersData={ownersData} />
      <HomeProjectsSection projectsData={projectsData} />
      <HomeClientsSection clientsData={clientsData} />
      <HomeTestimonialsSection testimonialsData={testimonialsData} />
      <CtaBox
        title="Ready to start your electrical project?"
        primaryButtonText="Get a Free Estimate"
        primaryButtonHref="/request-estimate"
        secondaryButtonText="Call Us Now"
        secondaryButtonHref={`tel:${contactPhone}`}
      />
    </div>
  );
}
