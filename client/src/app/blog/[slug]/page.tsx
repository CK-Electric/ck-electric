import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import BlogArticle from '@/components/BlogArticle';
import CtaBox from '@/components/CtaBox';
import RelatedArticles from '@/components/RelatedArticles';
import { GET_BLOG_BY_SLUG, BlogDetailData, GET_BLOGS, BlogsData } from '@/lib/wordpress-queries';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import { buildMetadata, SITE_URL } from '@/lib/seo-utils';
import { renderRichTextSSR } from '@/lib/render-rich-text';

export async function generateStaticParams() {
  const data = await fetchWordPressGraphQL<BlogsData>(GET_BLOGS);
  return (data?.blogs?.nodes || []).map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await fetchWordPressGraphQL<BlogDetailData>(GET_BLOG_BY_SLUG, { slug });
    const blogData = response?.blog;

    if (!blogData) {
      return { title: 'Article Not Found' };
    }

    return buildMetadata(blogData.seo as any, {
      title: blogData.title,
      description: 'Electrical tips, industry insights, and project highlights from CK Electric professionals serving Puget Sound.',
      keywords: 'electrical blog, electrical tips, electrical safety, Puget Sound electrical contractor',
      url: `${SITE_URL}/blog/${slug}`,
      image: blogData.featuredImage?.node?.mediaItemUrl,
      type: 'article',
      publishedTime: blogData.date,
    });
  } catch {
    return {
      title: 'Blog | CK Electric',
      description: 'Electrical tips, industry insights, and project highlights from CK Electric.',
    };
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [response, allBlogsData] = await Promise.all([
    fetchWordPressGraphQL<BlogDetailData>(GET_BLOG_BY_SLUG, { slug }),
    fetchWordPressGraphQL<BlogsData>(GET_BLOGS),
  ]);

  const blogData = response?.blog;

  if (!blogData) {
    notFound();
  }

  const formattedDate = new Date(blogData.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const categories = blogData.blogEntry.categories.nodes.map((cat) => cat.name);
  const authorName = `${blogData.blogEntry.authorFirstName} ${blogData.blogEntry.authorLastName}`;
  const authorInitials = `${blogData.blogEntry.authorFirstName.charAt(0)}${blogData.blogEntry.authorLastName.charAt(0)}`;
  const readingTime = `${blogData.seo.readingTime} min read`;

  const heroImage =
    blogData.featuredImage?.node?.mediaItemUrl || '';

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: blogData.title },
  ];

  const articleContent = renderRichTextSSR(blogData.content);

  // Fetch real related articles from same category
  const currentCategories = categories.map((c) => c.toLowerCase());
  const relatedArticles = (allBlogsData?.blogs?.nodes || [])
    .filter((b) => b.slug !== slug)
    .filter((b) =>
      b.blogEntry?.categories?.nodes?.some((c) =>
        currentCategories.includes(c.name.toLowerCase())
      )
    )
    .slice(0, 3)
    .map((blog, i) => ({
      id: i + 1,
      image: blog.featuredImage?.node?.mediaItemUrl || '',
      category: blog.blogEntry?.categories?.nodes?.[0]?.name || 'General',
      readTime: `${blog.seo?.readingTime || 5} min read`,
      title: blog.title,
      description: blog.blogEntry?.shortDescription || '',
      link: `/blog/${blog.slug}`,
    }));

  const ctaSection = blogData.blogEntry.ctaSection;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blogData.title,
    description: blogData.seo?.metaDesc || '',
    image: heroImage,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CK Electric',
      url: 'https://ck-electric.com',
    },
    datePublished: blogData.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ck-electric.com/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <article>
        <BlogArticle
          title={blogData.title}
          content={articleContent}
          author={{ name: authorName, initials: authorInitials }}
          publishedDate={formattedDate}
          readingTime={readingTime}
          categories={categories}
          heroImage={heroImage}
        />
      </article>

      <CtaBox
        title={ctaSection?.ctaText || 'Ready to start your electrical project?'}
        primaryButtonText={ctaSection?.primaryCtaText || 'Get a Free Estimate'}
        primaryButtonHref={ctaSection?.primaryCtaLink || '/request-estimate'}
        secondaryButtonText={ctaSection?.secondaryCtaText || 'Call Now'}
        secondaryButtonHref={ctaSection?.secondaryCtaLink || 'tel:2062956363'}
      />

      {relatedArticles.length > 0 && <RelatedArticles articles={relatedArticles} />}
    </>
  );
}
