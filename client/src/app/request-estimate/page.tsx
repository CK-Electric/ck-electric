import { Metadata } from 'next';
import RequestEstimateForm from '@/components/RequestEstimateForm';
import { fetchWordPressGraphQL } from '@/lib/wordpress-graphql';
import { GET_PAGE_BY_SLUG } from '@/lib/wordpress-queries';

// Generate metadata for the request estimate page - SSR
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Request a Free Estimate | CK Electric - Puget Sound',
    description: 'Request a free estimate for electrical services from CK Electric. Professional electrical contractors serving Tacoma to Skagit Valley.',
    keywords: 'free electrical estimate, electrical services quote, CK Electric estimate, electrical contractor Tacoma, electrical services Puget Sound',
  };
}

export default async function RequestEstimatePage() {
  // For now, use static data for estimate page
  // In the future, you can create an estimate page in WordPress and uncomment the fetch logic
  const pageData = null;

  return <RequestEstimateForm pageData={pageData} />;
}
