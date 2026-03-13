import { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import { buildMetadata, SITE_URL, SITE_DEFAULT_DESCRIPTION, SITE_DEFAULT_KEYWORDS } from '@/lib/seo-utils';
import {
  GET_LANDING_PAGE,
  GET_OWNERS,
  GET_SERVICE_AREAS,
  GET_TESTIMONIALS,
  GET_CLIENTS,
  GET_ALL_SERVICES,
  GET_ALL_PROJECTS,
} from '@/lib/wordpress-queries';
import type {
  LandingPageData,
  OwnersData,
  TestimonialsData,
  ClientsData,
  ServicesResponse,
  ProjectsResponse,
} from '@/lib/wordpress-types';

export async function generateMetadata(): Promise<Metadata> {
  const landingPage = await fetchWordPressGraphQL<LandingPageData>(GET_LANDING_PAGE);
  const page = landingPage?.page;

  return buildMetadata(page?.seo, {
    title: 'CK Electric | Premier Electrical Contractor Puget Sound',
    description: SITE_DEFAULT_DESCRIPTION,
    keywords: SITE_DEFAULT_KEYWORDS,
    url: SITE_URL,
    image: page?.featuredImage?.node?.mediaItemUrl,
  });
}

export default async function Home() {
  const [
    landingPageData,
    ownersData,
    serviceAreasData,
    testimonialsData,
    clientsData,
    servicesData,
    projectsData,
  ] = await Promise.all([
    fetchWordPressGraphQL<LandingPageData>(GET_LANDING_PAGE),
    fetchWordPressGraphQL<OwnersData>(GET_OWNERS),
    fetchWordPressGraphQL<{ serviceAreas: { nodes: unknown[] } }>(GET_SERVICE_AREAS),
    fetchWordPressGraphQL<TestimonialsData>(GET_TESTIMONIALS),
    fetchWordPressGraphQL<ClientsData>(GET_CLIENTS),
    fetchWordPressGraphQL<ServicesResponse>(GET_ALL_SERVICES),
    fetchWordPressGraphQL<ProjectsResponse>(GET_ALL_PROJECTS),
  ]);

  const contactPhone =
    landingPageData?.page?.landingPage?.headerInfo?.contactPhoneNumber || '2062956363';

  return (
    <HomePage
      landingPageData={landingPageData}
      ownersData={ownersData}
      serviceAreasData={serviceAreasData}
      testimonialsData={testimonialsData}
      clientsData={clientsData}
      servicesData={servicesData}
      projectsData={projectsData}
      contactPhone={contactPhone}
    />
  );
}
