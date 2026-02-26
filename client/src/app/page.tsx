import { Metadata } from 'next';
import HomePage from '@/components/HomePage';

// Generate metadata for the home page - SSR
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'CK Electric | Premier Electrical Contractor Puget Sound',
    description: 'Talk directly with licensed electricians. No call centers, no middlemen. Fast response and industrial-grade quality for every project in Tacoma to Skagit Valley.',
    keywords: 'electrical contractor, licensed electrician, commercial electrical, residential electrical, EV charger installation, panel upgrades, Puget Sound',
    openGraph: {
      title: 'CK Electric | Premier Electrical Contractor Puget Sound',
      description: 'Talk directly with licensed electricians. No call centers, no middlemen. Fast response and industrial-grade quality for every project.',
      type: 'website',
      url: '/',
      images: [
        {
          url: '/images/og-home.jpg',
          width: 1200,
          height: 630,
          alt: 'CK Electric - Premier Electrical Contractor',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CK Electric | Premier Electrical Contractor Puget Sound',
      description: 'Talk directly with licensed electricians. No call centers, no middlemen. Fast response and industrial-grade quality.',
      images: ['/images/og-home.jpg'],
    },
  };
}

export default function Home() {
  return <HomePage />;
}
