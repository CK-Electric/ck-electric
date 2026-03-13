import { GET_ALL_PROJECTS, GET_PROJECTS_PAGE } from '@/lib/wordpress-queries';
import type { ProjectsPageData } from '@/lib/wordpress-types';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import { Metadata } from 'next';
import { buildMetadata, SITE_URL } from '@/lib/seo-utils';
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

function stripHtml(html: string | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
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

export async function generateMetadata(): Promise<Metadata> {
  const [pageData, projectsData] = await Promise.all([
    fetchWordPressGraphQL<ProjectsPageData>(GET_PROJECTS_PAGE),
    fetchWordPressGraphQL<ProjectsResponse>(GET_ALL_PROJECTS),
  ]);

  const page = pageData?.page;
  const projectCount = projectsData?.projects?.nodes?.length || 0;
  const fallbackDesc = projectCount > 0
    ? `Browse ${projectCount} completed electrical projects by CK Electric across Puget Sound.`
    : 'Discover our industrial electrical projects and solutions across Puget Sound.';

  return buildMetadata(page?.seo as any, {
    title: page?.title || 'Electrical Projects Portfolio | CK Electric',
    description: fallbackDesc,
    keywords: 'electrical projects, commercial electrical portfolio, industrial electrical, Puget Sound electrical contractor',
    url: `${SITE_URL}/projects`,
    image: page?.featuredImage?.node?.mediaItemUrl,
  });
}

export default async function ProjectsPage() {
  const [pageData, projectsData] = await Promise.all([
    fetchWordPressGraphQL<ProjectsPageData>(GET_PROJECTS_PAGE),
    fetchWordPressGraphQL<ProjectsResponse>(GET_ALL_PROJECTS),
  ]);

  const page = pageData?.page;
  const projects = projectsData?.projects?.nodes || [];
  const cleanContent = stripHtml(page?.content);

  return (
    <>
      <HeroSection
        title={page?.title || 'Our Projects'}
        subtitle={
          cleanContent ||
          "Discover our latest work and see how we've helped clients achieve their goals with professional electrical solutions across Puget Sound."
        }
        primaryButtonText={page?.ctaButtonsHero?.primaryCtaText || 'Request a free estimate'}
        primaryButtonHref={page?.ctaButtonsHero?.primaryCtaLink || '/request-estimate'}
        secondaryButtonText={page?.ctaButtonsHero?.secondaryCtaText || 'Call us now'}
        secondaryButtonHref={page?.ctaButtonsHero?.secondaryCtaLink || 'tel:2062956363'}
        backgroundImage={
          page?.featuredImage?.node?.mediaItemUrl ||
          'https://images.unsplash.com/photo-1603796826034-2a34491c3b2e?w=1920&h=1080&fit=crop'
        }
      />

      <section className="py-20 bg-neutral-50" aria-label="Project portfolio">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <p className="text-center text-neutral-600 py-12">Check back soon for our latest projects!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects
                .map((project) => {
                  const tags = project.projectFields?.tags?.nodes || [];
                  const isFeatured = tags.some((tag) => tag.name.toLowerCase() === 'featured');
                  return { ...project, isFeatured, displayTags: tags.length > 0 ? tags : [{ name: 'Commercial' }] };
                })
                .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
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
          )}
        </div>
      </section>
    </>
  );
}
