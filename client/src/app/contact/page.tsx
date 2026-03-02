import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { fetchWordPressGraphQL } from '@/lib/wordpress-graphql';
import { GET_PAGE_BY_SLUG } from '@/lib/wordpress-queries';

// Generate metadata for the contact page - SSR
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact | CK Electric - Puget Sound',
    description: 'Get in touch with CK Electric for professional electrical services across Puget Sound. Call us or fill out our contact form.',
    keywords: 'contact electrician, electrical contractor contact, CK Electric phone, electrical services Tacoma',
  };
}

export default async function ContactPage() {
  // For now, use static data for contact page
  // In the future, you can create a contact page in WordPress and uncomment the fetch logic
  const pageData = null;

  return <ContactForm pageData={pageData} />;
}
