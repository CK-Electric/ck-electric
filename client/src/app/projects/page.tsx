import { GET_ALL_PROJECTS, GET_PROJECTS_PAGE, ProjectsPageData } from '@/lib/wordpress-queries';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import Link from 'next/link';
import { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import ProjectCard from '@/components/ProjectCard';

interface ProjectNode {
  id: string;
  title: string;
  slug: string;
  featuredImage: {
    node: {
      id: string;
      mediaItemUrl: string;
      altText?: string;
    };
  };
  projectFields: {
    shortDescription: string;
    tags: {
      nodes: {
        name: string;
      }[];
    };
    specifications: {
      coverageArea: string;
    };
  };
}

interface ProjectsResponse {
  projects: {
    nodes: ProjectNode[];
  };
}

// Helper function to strip HTML tags and decode entities
function stripHtml(html: string | undefined): string {
  if (!html) return '';
  
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  const decoded = text
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
    .replace(/&nbsp;/g, ' ');
  
  // Clean up extra whitespace
  return decoded.replace(/\s+/g, ' ').trim();
}

// Generate metadata for the projects page - SSR
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch projects page data from WordPress
    const pageDataResponse = await fetchWordPressGraphQL<ProjectsPageData>(
      GET_PROJECTS_PAGE
    );
    
    // Fetch projects data
    const projectsDataResponse = await fetchWordPressGraphQL<ProjectsResponse>(
      GET_ALL_PROJECTS
    );

    const pageData = pageDataResponse?.page;
    const projects = projectsDataResponse?.projects?.nodes || [];
    const projectCount = projects.length;

    // Clean the content for metadata
    const cleanContent = stripHtml(pageData?.content);

    return {
      title: pageData?.title || `Our Projects - ${projectCount} Industrial Electrical Projects`,
      description: pageData?.seo?.metaDesc || (projectCount > 0
        ? `Browse our portfolio of ${projectCount} completed industrial electrical projects. See our work in lighting, electrical installations, and more.`
        : 'Discover our industrial electrical projects and solutions. From lighting installations to electrical systems, we deliver quality work.'),
      keywords: pageData?.seo?.metaKeywords || 'industrial electrical projects, electrical installations, lighting projects, commercial electrical',
      openGraph: {
        title: pageData?.title || 'Our Projects - Industrial Electrical Solutions',
        description: pageData?.seo?.opengraphDescription || 'Browse our portfolio of completed industrial electrical projects',
        type: 'website',
        url: '/projects',
        images: pageData?.featuredImage?.node?.mediaItemUrl ? [
          {
            url: pageData.featuredImage.node.mediaItemUrl,
            width: 1200,
            height: 630,
            alt: 'Industrial Electrical Projects',
          },
        ] : [],
      },
    };
  } catch (error) {
    console.error('Error generating projects metadata:', error);
    return {
      title: 'Our Projects',
      description: 'Browse our industrial electrical projects and solutions.',
    };
  }
}

// Page component - SSR
export default async function ProjectsPage() {
  try {
    // Fetch projects page data from WordPress
    const pageDataResponse = await fetchWordPressGraphQL<ProjectsPageData>(
      GET_PROJECTS_PAGE
    );
    
    // Fetch projects data
    const data = await fetchWordPressGraphQL<ProjectsResponse>(
      GET_ALL_PROJECTS
    );

    const pageData = pageDataResponse?.page;
    const projects = data?.projects?.nodes || [];

    // Clean the content for display
    const cleanContent = stripHtml(pageData?.content);

    if (projects.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {pageData?.title || "Our Projects"}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                {cleanContent || "Discover our latest work and see how we've helped clients achieve their goals"}
              </p>
              
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Found</h3>
                <p className="text-gray-600">Check back soon for our latest projects!</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <HeroSection
          title={pageData?.title || "Our Projects"}
          subtitle={cleanContent || "Discover our latest work and see how we've helped clients achieve their goals with professional electrical solutions across Puget Sound."}
          primaryButtonText={pageData?.ctaButtonsHero?.primaryCtaText || "Request a free estimate"}
          primaryButtonHref={pageData?.ctaButtonsHero?.primaryCtaLink || "#estimate"}
          secondaryButtonText={pageData?.ctaButtonsHero?.secondaryCtaText || "Call us now"}
          secondaryButtonHref={pageData?.ctaButtonsHero?.secondaryCtaLink || "#contact"}
          backgroundImage={pageData?.featuredImage?.node?.mediaItemUrl || "https://images.unsplash.com/photo-1603796826034-2a34491c3b2e?w=1920&h=1080&fit=crop"}
        />
        
        <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects
              .map((project) => {
                const tags = project.projectFields?.tags?.nodes || [];
                const isFeatured = tags.some(tag => tag.name.toLowerCase() === 'featured');
                
                return {
                  ...project,
                  isFeatured,
                  displayTags: tags.length > 0 ? tags : [{ name: 'Commercial' }]
                };
              })
              .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)) // Featured projects first
              .map((project) => (
                <ProjectCard
                  key={project.id}
                  image={project.featuredImage?.node?.mediaItemUrl || 'https://images.unsplash.com/photo-1603796826034-2a34491c3b2e?w=400&h=300&fit=crop'}
                  location={project.projectFields?.specifications?.coverageArea || 'Puget Sound'}
                  projectName={project.title}
                  category={project.displayTags}
                  description={project.projectFields?.shortDescription || 'Professional electrical project completed with precision and quality workmanship.'}
                  link={`/projects/${project.slug}`}
                  isFeatured={project.isFeatured}
                />
              ))}
          </div>
        </div>
      </section>
      </>
    );
  } catch (error) {
    console.error('Error loading projects:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Projects</h2>
          <p className="text-gray-600 mb-4">There was an error loading projects. Please try again later.</p>
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
