import { GET_BLOG_PAGE, GET_BLOGS, BlogsData } from '@/lib/wordpress-queries';
import type { BlogPageData } from '@/lib/wordpress-types';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import { Metadata } from 'next';
import { buildMetadata, SITE_URL } from '@/lib/seo-utils';
import BlogPageContent from '@/components/BlogPageContent';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const pageDataResponse = await fetchWordPressGraphQL<BlogPageData>(GET_BLOG_PAGE);
    const pageData = pageDataResponse?.page;

    return buildMetadata(pageData?.seo as any, {
      title: pageData?.title || 'Blog | CK Electric - Puget Sound',
      description: 'Electrical tips, industry insights, and project highlights from CK Electric professionals serving Puget Sound.',
      keywords: 'electrical blog, electrical tips, electrical safety, electrical projects, Puget Sound electrical contractor',
      url: `${SITE_URL}/blog`,
      image: pageData?.featuredImage?.node?.mediaItemUrl,
    });
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
