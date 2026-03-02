import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { fetchWordPressGraphQL } from '@/lib/wordpress-graphql';
import { GET_PAGE_BY_SLUG, GET_CONTACT_PAGE } from '@/lib/wordpress-queries';

// Generate metadata for the contact page - SSR
export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await fetchWordPressGraphQL(GET_CONTACT_PAGE);
    const pageData = (response as any)?.data?.page;

    if (!pageData) {
      return {
        title: 'Contact CK Electric | Licensed Electricians in Puget Sound',
        description: 'Contact CK Electric for expert commercial and residential electrical services across Puget Sound. Competitive pricing and reliable service.',
      };
    }

    return {
      title: pageData.title || 'Contact CK Electric',
      description: pageData.seo?.metaDesc || 'Contact CK Electric for expert electrical services across Puget Sound.',
      keywords: pageData.seo?.metaKeywords || '',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Contact CK Electric | Licensed Electricians in Puget Sound',
      description: 'Contact CK Electric for expert commercial and residential electrical services across Puget Sound. Competitive pricing and reliable service.',
    };
  }
}

export default async function ContactPage() {
  try {
    const response = await fetchWordPressGraphQL(GET_CONTACT_PAGE);
    const pageData = (response as any)?.data?.page;

    return <ContactForm pageData={pageData} />;
  } catch (error) {
    console.error('Error fetching contact page data:', error);
    return <ContactForm pageData={null} />;
  }
}
