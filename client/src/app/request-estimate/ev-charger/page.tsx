import { notFound } from 'next/navigation';
import ServiceEstimatePreview from '@/components/ServiceEstimatePreview';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import { GET_ESTIMATE_FORM_MASCOT } from '@/lib/wordpress-queries';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'EV Charger Estimate', robots: { index: false, follow: false } };

export default async function Page() {
  const hostedDemo = process.env.CK_FORMS_DEMO === 'true';
  const productionMode = process.env.CK_FORMS_PRODUCTION === 'true';
  if (process.env.NODE_ENV !== 'development' && !hostedDemo && process.env.CK_FORMS_STAGING !== 'true' && !productionMode) notFound();
  const mascot = await fetchWordPressGraphQL<{ page?: { landingPage?: { formImage?: { node?: { mediaItemUrl?: string; altText?: string } | null } | null } | null } }>(GET_ESTIMATE_FORM_MASCOT);
  const image = mascot?.page?.landingPage?.formImage?.node;
  return <ServiceEstimatePreview key="ev" kind="ev" hostedDemo={hostedDemo} productionMode={productionMode} mascotImageUrl={image?.mediaItemUrl} mascotImageAlt={image?.altText || 'CK Electric eagle mascot'} />;
}
