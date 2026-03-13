import { Metadata } from 'next';
import RequestEstimateForm from '@/components/RequestEstimateForm';
import HeroSection from '@/components/HeroSection';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import { GET_REQUEST_ESTIMATE_PAGE } from '@/lib/wordpress-queries';
import type { RequestEstimatePageData } from '@/lib/wordpress-types';
import { buildMetadata, SITE_URL } from '@/lib/seo-utils';

function stripHtml(html: string | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export async function generateMetadata(): Promise<Metadata> {
  const response = await fetchWordPressGraphQL<RequestEstimatePageData>(GET_REQUEST_ESTIMATE_PAGE);
  const page = response?.page;

  return buildMetadata(page?.seo, {
    title: page?.title || 'Request a Free Estimate | CK Electric',
    description: 'Request a free estimate for electrical services from CK Electric. Professional electrical contractors serving Tacoma to Skagit Valley.',
    keywords: 'free electrical estimate, electrical services quote, CK Electric estimate, electrical contractor Tacoma, electrical services Puget Sound',
    url: `${SITE_URL}/request-estimate`,
    image: page?.featuredImage?.node?.mediaItemUrl,
  });
}

export default async function RequestEstimatePage() {
  const response = await fetchWordPressGraphQL<RequestEstimatePageData>(GET_REQUEST_ESTIMATE_PAGE);
  const page = response?.page;
  return (
    <>
      <HeroSection
        title={page?.title || "Request a Free Estimate for electrical services"}
        subtitle={stripHtml(page?.content) || "We specialize in Commercial TIs, Panel Upgrades, and EV Chargers throughout Tacoma and nearby areas. If you're searching for a trusted contractor offering fair pricing and professional results, our team is ready to help."}
        hideCTA={true}
        backgroundImage={page?.featuredImage?.node?.mediaItemUrl || "https://images.unsplash.com/photo-1603796826034-2a34491c3b2e?w=1920&h=1080&fit=crop"}
      />
      <RequestEstimateForm pageData={response} />
    </>
  );
}
