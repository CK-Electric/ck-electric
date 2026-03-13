import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import HeroSection from '@/components/HeroSection';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import { GET_CONTACT_PAGE } from '@/lib/wordpress-queries';
import { buildMetadata, SITE_URL } from '@/lib/seo-utils';

function stripHtml(html: string | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&#8217;/g, "'").replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

interface ContactPageData {
  page: {
    title: string;
    content: string;
    featuredImage?: {
      node: {
        mediaItemUrl: string;
      };
    };
    seo: {
      metaDesc: string;
      metaKeywords: string;
    };
    contactInformation: {
      businessHours: string;
      facebookLink: string;
      location: string;
      mattPhoneNumber: string;
      principalEmail: string;
      robPhoneNumber: string;
      extraInfo: { subtitle: string; title: string };
      forwardedTo: { mattEmail: string; robEmail: string };
      googleMapsRating: { locationLink: string; rating: string };
    };
    slug: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchWordPressGraphQL<ContactPageData>(GET_CONTACT_PAGE);
  const page = data?.page;

  return buildMetadata(page?.seo as any, {
    title: page?.title || 'Contact Us | CK Electric',
    description: 'Contact CK Electric for expert commercial and residential electrical services across Puget Sound. Licensed, bonded, and ready to help.',
    keywords: 'contact electrician, hire electrician Puget Sound, CK Electric contact',
    url: `${SITE_URL}/contact`,
    image: page?.featuredImage?.node?.mediaItemUrl,
  });
}

export default async function ContactPage() {
  const data = await fetchWordPressGraphQL<ContactPageData>(GET_CONTACT_PAGE);
  const page = data?.page;
  return (
    <>
      <HeroSection
        title={page?.title || "Get in Touch"}
        subtitle={stripHtml(page?.content) || "Ready to start your electrical project? Contact our team for expert service and competitive pricing across Puget Sound."}
        hideCTA={true}
        backgroundImage={page?.featuredImage?.node?.mediaItemUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop"}
      />
      <ContactForm pageData={page ?? null} />
    </>
  );
}
