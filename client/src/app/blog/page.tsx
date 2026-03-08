import { GET_BLOG_PAGE, BlogPageData, GET_BLOGS, BlogsData } from '@/lib/wordpress-queries';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import { Metadata } from 'next';
import BlogPageContent from '@/components/BlogPageContent';

// Generate metadata for the blog page - SSR
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch blog page data from WordPress
    const pageDataResponse = await fetchWordPressGraphQL<BlogPageData>(
      GET_BLOG_PAGE
    );

    const pageData = pageDataResponse?.page;

    const ogImage = (pageData?.seo as any)?.opengraphImage?.mediaItemUrl;
    return {
      title: pageData?.title || 'Blog | CK Electric - Puget Sound',
      description: pageData?.seo?.metaDesc || 'Electrical tips, industry insights, and project highlights from CK Electric professionals serving Puget Sound.',
      keywords: pageData?.seo?.metaKeywords || 'electrical blog, electrical tips, electrical safety, electrical projects, Puget Sound electrical contractor',
      openGraph: {
        title: pageData?.title || 'Blog | CK Electric - Puget Sound',
        description: pageData?.seo?.metaDesc || '',
        type: 'website',
        images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: 'CK Electric Blog' }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch (error) {
    console.error('Error generating blog metadata:', error);
    return {
      title: 'Blog | CK Electric - Puget Sound',
      description: 'Electrical tips, industry insights, and project highlights from CK Electric professionals serving Puget Sound.',
    };
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category || 'All Topics';

  try {
    // Fetch blog page data from WordPress
    const pageDataResponse = await fetchWordPressGraphQL<BlogPageData>(
      GET_BLOG_PAGE
    );

    // Fetch blogs data from WordPress
    const blogsDataResponse = await fetchWordPressGraphQL<BlogsData>(
      GET_BLOGS
    );


    // Transform WordPress blog data to match BlogPageContent expected format
    const blogPosts = blogsDataResponse?.blogs?.nodes?.map((blog: any, index: any) => {
      const date = new Date(blog.date);
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      const category = blog.blogEntry.categories?.nodes?.[0]?.name || 'General';
      const readTime = `${blog.seo.readingTime} Min Read`;
      
      return {
        id: index + 1,
        image: blog.featuredImage?.node?.mediaItemUrl,
        category: category,
        date: formattedDate,
        readTime: readTime,
        title: blog.title,
        description: blog.blogEntry.shortDescription,
        link: `/blog/${blog.slug}`
      };
    }) || [];

    return <BlogPageContent blogPosts={blogPosts} blogPageData={pageDataResponse?.page} activeCategory={activeCategory} />;
  } catch (error) {
    console.error('Error loading blog page:', error);
    return <BlogPageContent blogPosts={[]} blogPageData={undefined} activeCategory={activeCategory} />;
  }
}
