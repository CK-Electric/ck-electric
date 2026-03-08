import BlogHero from '@/components/BlogHero';
import BlogCard from '@/components/BlogCard';
import BlogCategoryFilter from '@/components/BlogCategoryFilter';

// Helper function to strip HTML tags and decode entities
function stripHtml(html: string | undefined): string {
  if (!html) return '';

  const text = html.replace(/<[^>]*>/g, '');

  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface BlogPageContentProps {
  blogPosts: Array<{
    id: number;
    image: string;
    category: string;
    date: string;
    readTime: string;
    title: string;
    description: string;
    link: string;
  }>;
  blogPageData?: {
    featuredImage: {
      node: {
        mediaItemUrl: string;
      };
    };
    seo: {
      metaDesc: string;
      metaKeywords: string;
      metaRobotsNofollow: string;
      metaRobotsNoindex: string;
      opengraphAuthor: string;
      opengraphDescription: string;
    };
    ctaButtonsHero: {
      primaryCtaLink: string;
      primaryCtaText: string;
      secondaryCtaLink: string;
      secondaryCtaText: string;
    };
    title: string;
    content: string;
  };
  activeCategory?: string;
}

export default function BlogPageContent({ blogPosts, blogPageData, activeCategory = 'All Topics' }: BlogPageContentProps) {
  const categories = ['All Topics', 'Residential', 'Commercial'];

  const cleanContent = stripHtml(blogPageData?.content);

  const filteredPosts = activeCategory === 'All Topics'
    ? blogPosts
    : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <>
      <BlogHero
        title={blogPageData?.title || "Electrical Insights & Tips"}
        subtitle={cleanContent || "Your source for the latest trends in residential and commercial electrical solutions. CK Electric shares professional insights to help you make the best decisions for your home or business."}
        backgroundImage={blogPageData?.featuredImage?.node?.mediaItemUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBevz4X8_qCwm5nQKKnaWVl-Vxj6iUW5VFoBc8V2CfGSXsQzGB8pOngUro1y0kXl1Y81gvhwy8vWeq8SSYpgf7oHEmIzLDaECh-QEOgGeiFImrWHxOKub4YEyOGHjmLVJe_P6d097l2hsacY2gPUZgbJfX1YEdjANsbDOG1GObiPvpyTntmbyiFCujgDFL0KCidSElT01APFrpibQru1ZkMNHt4ozYxf5RiSKLjI23KE9Jyj7feBRWdtR7n3M60ZkxVvbb4m_8fEW0"}
        primaryButtonText={blogPageData?.ctaButtonsHero?.primaryCtaText || "Request Estimate"}
        primaryButtonHref={blogPageData?.ctaButtonsHero?.primaryCtaLink || "/request-estimate"}
        secondaryButtonText={blogPageData?.ctaButtonsHero?.secondaryCtaText || "Call Us Now"}
        secondaryButtonHref={blogPageData?.ctaButtonsHero?.secondaryCtaLink || "tel:2062956363"}
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogCategoryFilter
            categories={categories}
            activeCategory={activeCategory}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post.id}
                image={post.image}
                category={post.category}
                date={post.date}
                readTime={post.readTime}
                title={post.title}
                description={post.description}
                link={post.link}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
