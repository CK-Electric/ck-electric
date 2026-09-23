import HomeHeroSection from './HomeHeroSection';
import HomeStatsSection from './HomeStatsSection';
import HomeAwardSection from './HomeAwardSection';
import HomeAboutSection from './HomeAboutSection';
import HomeServicesSection from './HomeServicesSection';
import HomeServiceAreasSection from './HomeServiceAreasSection';
import HomeOwnersSection from './HomeOwnersSection';
import HomeProjectsSection from './HomeProjectsSection';
import HomeClientsSection from './HomeClientsSection';
import HomeTestimonialsSection from './HomeTestimonialsSection';
import CtaBox from './CtaBox';
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
      <HomeAwardSection />
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
