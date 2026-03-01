import { GET_ALL_PAGES } from '@/lib/wordpress-queries';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import Link from 'next/link';
import { Metadata } from 'next';

interface GraphQLPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

interface PagesResponse {
  pages: {
    nodes: GraphQLPage[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

// Generate metadata for the pages page - SSR
export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchWordPressGraphQL<PagesResponse>(
      GET_ALL_PAGES,
      { first: 10, after: null }
    );

    const pages = data?.pages?.nodes || [];
    const pageCount = pages.length;

    return {
      title: pageCount > 0 
        ? `Our Pages - ${pageCount} WordPress Pages`
        : 'Our Pages - WordPress Content',
      description: pageCount > 0
        ? `Browse our collection of ${pageCount} WordPress pages. Discover our content and articles.`
        : 'Browse our WordPress pages and content. Discover articles and information.',
      keywords: 'wordpress pages, content management, cms pages, articles',
      openGraph: {
        title: 'Our Pages - WordPress Content',
        description: 'Browse our collection of WordPress pages and content',
        type: 'website',
        url: '/pages',
        images: pages.length > 0 && pages[0].featuredImage?.node?.sourceUrl ? [
          {
            url: pages[0].featuredImage.node.sourceUrl,
            width: 1200,
            height: 630,
            alt: 'WordPress Pages',
          },
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Our Pages - WordPress Content',
        description: 'Browse our collection of WordPress pages and content',
        images: pages.length > 0 && pages[0].featuredImage?.node?.sourceUrl ? [pages[0].featuredImage.node.sourceUrl] : [],
      },
    };
  } catch (error) {
    console.error('Error generating pages metadata:', error);
    return {
      title: 'Our Pages',
      description: 'Browse our WordPress pages and content.',
    };
  }
}

// Page component - SSR
export default async function PagesPage() {
  try {
    const data = await fetchWordPressGraphQL<PagesResponse>(
      GET_ALL_PAGES,
      { first: 10, after: null }
    );

    const pages = data?.pages?.nodes || [];

    if (pages.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Pages
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Browse all pages from your WordPress site
              </p>
              
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pages Found</h3>
                <p className="text-gray-600">Check back soon for our latest pages!</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Pages
              </h1>
              <p className="text-lg text-gray-600">Browse all pages from your WordPress site</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {pages.map((page) => (
                <article key={page.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {page.featuredImage?.node?.sourceUrl && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={page.featuredImage.node.sourceUrl}
                        alt={page.featuredImage.node.altText || page.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(page.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link 
                        href={`/pages/${page.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {page.title}
                      </Link>
                    </h2>
                    <div 
                      className="text-gray-600 line-clamp-3 mb-4"
                      dangerouslySetInnerHTML={{ __html: page.excerpt || '' }}
                    />
                    <Link
                      href={`/pages/${page.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read More
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading pages:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Pages</h2>
          <p className="text-gray-600 mb-4">There was an error loading pages. Please try again later.</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
}
