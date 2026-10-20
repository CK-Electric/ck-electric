import { notFound } from 'next/navigation';
import ServiceEstimatePreview from '@/components/ServiceEstimatePreview';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'EV Charger Estimate', robots: { index: false, follow: false } };

export default function Page() {
  const hostedDemo = process.env.CK_FORMS_DEMO === 'true';
  if (process.env.NODE_ENV !== 'development' && !hostedDemo) notFound();
  return <ServiceEstimatePreview key="ev" kind="ev" hostedDemo={hostedDemo} />;
}
