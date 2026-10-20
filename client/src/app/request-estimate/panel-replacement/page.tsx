import { notFound } from 'next/navigation';
import ServiceEstimatePreview from '@/components/ServiceEstimatePreview';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Panel Replacement Estimate', robots: { index: false, follow: false } };

export default function Page() {
  const hostedDemo = process.env.CK_FORMS_DEMO === 'true';
  if (process.env.NODE_ENV !== 'development' && !hostedDemo) notFound();
  return <ServiceEstimatePreview key="panel" kind="panel" hostedDemo={hostedDemo} />;
}
