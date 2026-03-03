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

    return {
      title: pageData?.title || 'Blog | CK Electric - Puget Sound',
      description: pageData?.seo?.metaDesc || 'Electrical tips, industry insights, and project highlights from CK Electric professionals serving Puget Sound.',
      keywords: pageData?.seo?.metaKeywords || 'electrical blog, electrical tips, electrical safety, electrical projects, Puget Sound electrical contractor',
    };
  } catch (error) {
    console.error('Error generating blog metadata:', error);
    return {
      title: 'Blog | CK Electric - Puget Sound',
      description: 'Electrical tips, industry insights, and project highlights from CK Electric professionals serving Puget Sound.',
    };
  }
}

export default async function BlogPage() {
  try {
    // Fetch blog page data from WordPress
    const pageDataResponse = await fetchWordPressGraphQL<BlogPageData>(
      GET_BLOG_PAGE
    );

    // Fetch blogs data from WordPress
    const blogsDataResponse = await fetchWordPressGraphQL<BlogsData>(
      GET_BLOGS
    );

    console.log('🔍 BlogPage - WordPress Response:', pageDataResponse);
    console.log('🔍 Blogs Data - WordPress Response:', blogsDataResponse);

    // Transform WordPress blog data to match BlogPageContent expected format
    const blogPosts = blogsDataResponse?.blogs?.nodes?.map((blog, index) => {
      const date = new Date(blog.date);
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      const category = blog.blogEntry.categories.nodes[0]?.name || 'General';
      const readTime = `${blog.seo.readingTime} Min Read`;
      
      return {
        id: index + 1,
        image: blog.blogEntry.featuredImage.node.mediaItemUrl,
        category: category,
        date: formattedDate,
        readTime: readTime,
        title: blog.seo.title,
        description: blog.blogEntry.shortDescription,
        link: `/blog/${blog.seo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`
      };
    }) || [];

    return <BlogPageContent blogPosts={blogPosts} blogPageData={pageDataResponse?.page} />;
  } catch (error) {
    console.error('Error loading blog page:', error);
    return <BlogPageContent blogPosts={[]} blogPageData={undefined} />;
  }
}
