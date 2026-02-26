import { NEW_QUERY } from '@/lib/wordpress-queries';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import Link from 'next/link';
import { Metadata } from 'next';

interface NewQueryResponse {
  posts: {
    nodes: Array<{
      id: string;
      title: string;
      slug: string;
      content?: string;
      excerpt?: string;
      date?: string;
      featuredImage?: {
        node: {
          sourceUrl: string;
          altText: string;
        };
      };
      heroSection?: {
        title: string;
        subtitle: string;
      };
    }>;
  };
}

// Generate metadata for the posts page - SSR
export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchWordPressGraphQL<NewQueryResponse>(
      NEW_QUERY
    );

    const posts = data?.posts?.nodes || [];
    const postCount = posts.length;

    return {
      title: postCount > 0 
        ? `Our Posts - ${postCount} Articles`
        : 'Our Posts - Blog Articles',
      description: postCount > 0
        ? `Browse our collection of ${postCount} blog posts and articles. Discover insights and updates.`
        : 'Browse our blog posts and articles. Discover insights and updates from our team.',
      keywords: 'blog posts, articles, insights, updates, news',
      openGraph: {
        title: 'Our Posts - Blog Articles',
        description: 'Browse our collection of blog posts and articles',
        type: 'website',
        url: '/posts',
        images: posts.length > 0 && posts[0].featuredImage?.node?.sourceUrl ? [
          {
            url: posts[0].featuredImage.node.sourceUrl,
            width: 1200,
            height: 630,
            alt: 'Blog Posts',
          },
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Our Posts - Blog Articles',
        description: 'Browse our collection of blog posts and articles',
        images: posts.length > 0 && posts[0].featuredImage?.node?.sourceUrl ? [posts[0].featuredImage.node.sourceUrl] : [],
      },
    };
  } catch (error) {
    console.error('Error generating posts metadata:', error);
    return {
      title: 'Our Posts',
      description: 'Browse our blog posts and articles.',
    };
  }
}

// Page component - SSR
export default async function PostsPage() {
  try {
    const data = await fetchWordPressGraphQL<NewQueryResponse>(
      NEW_QUERY
    );

    const posts = data?.posts?.nodes || [];

    if (posts.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Posts
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Browse posts with hero sections
              </p>
              
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Found</h3>
                <p className="text-gray-600">Check back soon for our latest posts!</p>
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
                Posts
              </h1>
              <p className="text-lg text-gray-600">Browse posts with hero sections</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {post.featuredImage?.node?.sourceUrl && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.featuredImage.node.altText || post.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {post.date && (
                      <div className="text-sm text-gray-500 mb-2">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    
                    {post.heroSection && (
                      <div className="mb-3">
                        <p className="text-sm text-blue-600 font-medium">{post.heroSection.title}</p>
                        {post.heroSection.subtitle && (
                          <p className="text-sm text-gray-600">{post.heroSection.subtitle}</p>
                        )}
                      </div>
                    )}
                    
                    {post.excerpt && (
                      <div 
                        className="text-gray-600 line-clamp-3 mb-4"
                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                      />
                    )}
                    
                    <Link
                      href={`/posts/${post.slug}`}
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
    console.error('Error loading posts:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Posts</h2>
          <p className="text-gray-600 mb-4">There was an error loading posts. Please try again later.</p>
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
