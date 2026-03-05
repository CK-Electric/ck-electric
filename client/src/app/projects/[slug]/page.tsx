import { GET_PROJECT_BY_SLUG, GET_ALL_PROJECTS } from '@/lib/wordpress-queries';
import { fetchWordPressGraphQL } from '@/lib/wordpress-ssr';
import Link from 'next/link';
import { Metadata } from 'next';
import DetailView from '@/components/DetailView';

interface ProjectNode {
  id: string;
  title: string;
  slug: string;
  featuredImage: {
    node: {
      id: string;
      sourceUrl?: string;
      altText?: string;
    };
  };
  seo: {
    canonical?: string;
    cornerstone?: boolean;
    focuskw?: string;
    fullHead?: string;
    metaDesc?: string;
    metaKeywords?: string;
    metaRobotsNofollow?: string;
    metaRobotsNoindex?: string;
    opengraphAuthor?: string;
    opengraphDescription?: string;
    opengraphModifiedTime?: string;
    opengraphPublishedTime?: string;
    opengraphPublisher?: string;
    opengraphSiteName?: string;
    opengraphTitle?: string;
    opengraphType?: string;
    opengraphUrl?: string;
    readingTime?: number;
    title?: string;
  };
  projectFields: {
    fieldGroupName: string;
    specifications: {
      coverageArea: string;
      fieldGroupName: string;
      responseTime: string;
      warranty: string;
    };
    mainContentSection: string;
  };
}

interface ProjectsResponse {
  project: ProjectNode;
}

// Generate metadata for the project - SSR
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  console.log(`🎯 [METADATA] Generando metadata para slug: ${resolvedParams.slug}`);
  
  try {
    // Server-side GraphQL fetch
    const data = await fetchWordPressGraphQL<ProjectsResponse>(
      GET_PROJECT_BY_SLUG,
      { slug: resolvedParams.slug }
    );

    const project = data?.project;

    if (!project) {
      console.log('❌ [METADATA] Proyecto no encontrado');
      return {
        title: 'Project Not Found',
        description: 'The project you are looking for does not exist.',
      };
    }

    console.log('✅ [METADATA] Proyecto encontrado:', project.title);
    console.log('📋 [METADATA] SEO disponible:', !!project.seo);

    // SEO Data with fallbacks
    const seoTitle = project.seo?.title || project.title;
    const seoDescription = project.seo?.metaDesc || 
      project.projectFields?.mainContentSection?.substring(0, 160)?.replace(/<[^>]*>/g, '') || 
      `Read about ${project.title} project and our industrial electrical solutions.`;
    const canonicalUrl = project.seo?.canonical || `/projects/${project.slug}`;
    const ogTitle = project.seo?.opengraphTitle || seoTitle;
    const ogDescription = project.seo?.opengraphDescription || seoDescription;
    const ogUrl = project.seo?.opengraphUrl || canonicalUrl;
    const ogType = project.seo?.opengraphType || 'article';
    const metaKeywords = project.seo?.metaKeywords || '';
    const robotsIndex = project.seo?.metaRobotsNoindex || 'index';
    const robotsFollow = project.seo?.metaRobotsNofollow || 'follow';

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: metaKeywords,
      robots: {
        index: robotsIndex === 'index',
        follow: robotsFollow === 'follow',
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: (ogType as 'article' | 'website') || 'article',
        url: ogUrl,
        siteName: project.seo?.opengraphSiteName || '',
        publishedTime: project.seo?.opengraphPublishedTime || undefined,
        modifiedTime: project.seo?.opengraphModifiedTime || undefined,
        images: project.featuredImage?.node?.sourceUrl ? [
          {
            url: project.featuredImage.node.sourceUrl,
            width: 1200,
            height: 630,
            alt: project.featuredImage.node.altText || project.title,
          },
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        images: project.featuredImage?.node?.sourceUrl ? [project.featuredImage.node.sourceUrl] : [],
      },
      other: {
        'focus_keyword': project.seo?.focuskw || '',
        'est_reading_time': project.seo?.readingTime ? `${project.seo.readingTime} minute${project.seo.readingTime !== 1 ? 's' : ''}` : '',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Project',
      description: 'View our project details.',
    };
  }
}

// Page component - SSR
export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  console.log(`🖼️ [PAGE] Renderizando página para slug: ${resolvedParams.slug}`);
  
  try {
    // Server-side GraphQL fetch
    const data = await fetchWordPressGraphQL<ProjectsResponse>(
      GET_PROJECT_BY_SLUG,
      { slug: resolvedParams.slug }
    );

    const project = data?.project;

    if (!project) {
      console.log('❌ [PAGE] Proyecto no encontrado');
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
            <Link
              href="/projects"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      );
    }

    console.log('✅ [PAGE] Proyecto encontrado:', project.title);
    console.log('🏗️ [PAGE] Fields disponibles:', !!project.projectFields);
    console.log('🖼️ [PAGE] Imagen:', !!project.featuredImage?.node?.sourceUrl);
    console.log('📝 [PAGE] Content length:', project.projectFields?.mainContentSection?.length || 0);
    
    // Fetch all projects for related section
    const allProjectsResponse = await fetchWordPressGraphQL(GET_ALL_PROJECTS);
    const allProjects = (allProjectsResponse as any)?.projects?.nodes || [];
    
    // Filter out current project and get related projects
    const relatedProjects = allProjects
      .filter((p: any) => p.slug !== resolvedParams.slug)
      .slice(0, 3) // Take first 3 related projects
      .map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.projectFields?.mainContentSection ? 
          p.projectFields.mainContentSection.replace(/<[^>]*>/g, '').substring(0, 150) + '...' :
          'Professional electrical project completed with precision and quality.',
        image: p.featuredImage?.node?.mediaItemUrl || 'https://images.unsplash.com/photo-1603796826034-2a34491c3b2e?w=400&h=300&fit=crop',
        link: `/projects/${p.slug}`,
        category: p.projectFields?.specifications?.coverageArea || 'Project',
        readTime: '5 min read'
      }));
    
    // Logging específico de specifications
    if (project.projectFields?.specifications) {
      console.log('📋 [PAGE] Specifications completas:', project.projectFields.specifications);
      console.log('📍 [PAGE] Coverage Area:', project.projectFields.specifications.coverageArea);
      console.log('⏰ [PAGE] Response Time:', project.projectFields.specifications.responseTime);
      console.log('🛡️ [PAGE] Warranty:', project.projectFields.specifications.warranty);
    } else {
      console.log('❌ [PAGE] No specifications encontradas');
    }

    return (
      <DetailView
        // Hero Section Props
        title={project.title}
        subtitle={`Professional electrical project completed in ${project.projectFields?.specifications?.coverageArea || 'Puget Sound'} with precision and quality workmanship.`}
        backgroundImage={project.featuredImage?.node?.sourceUrl || 'https://images.unsplash.com/photo-1603796826034-2a34491c3b2e?w=1920&h=1080&fit=crop'}
        emailPlaceholder="Enter your email for project details"
        primaryButtonText="View Project Details"
        primaryButtonHref="#details"
        
        // Content Section Props
        contentTitle="Project Overview"
        content={project.projectFields?.mainContentSection || `This project showcases our commitment to excellence in electrical services. From initial consultation to final completion, we ensure every aspect meets the highest standards of quality and safety.`}
        
        // Sidebar Specifications Props
        specifications={[
          {
            label: 'Location',
            value: project.projectFields?.specifications?.coverageArea || 'Puget Sound'
          },
          {
            label: 'Duration',
            value: project.projectFields?.specifications?.responseTime || '2-4 weeks'
          },
          {
            label: 'Warranty',
            value: project.projectFields?.specifications?.warranty || '5 Years'
          }
        ]}
        ctaText="Get a Free Estimate"
        ctaHref="/request-estimate"
        
        // Related Section Props
        relatedTitle="Related Projects"
        relatedSectionType="projects"
        relatedItems={relatedProjects}
      />
    );
  } catch (error) {
    console.error('Error loading project:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Project</h2>
          <p className="text-gray-600 mb-4">There was an error loading this project. Please try again later.</p>
          <Link
            href="/projects"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }
}
