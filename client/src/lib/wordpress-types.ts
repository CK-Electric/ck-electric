// TypeScript interfaces for WordPress GraphQL responses

// Landing Page interfaces
export interface CompanyLogo {
  node: {
    mediaItemUrl: string;
    altText: string;
  };
}

export interface HeaderInfo {
  contactEmail: string;
  contactPhoneNumber: string;
  fieldGroupName: string;
  serviceArea: string;
  slogan: string;
  companyLogo: CompanyLogo;
}

export interface ItemsList {
  item1: string;
  item2: string;
  item3: string;
}

export interface AboutUs {
  description: string;
  fieldGroupName: string;
  subtitle: string;
  title: string;
  itemsList: ItemsList;
}

export interface HeroFeature {
  description1?: string;
  description?: string;
  fieldGroupName: string;
  title?: string;
  title1?: string;
}

export interface HeroItems {
  feature1: HeroFeature;
  item2: HeroFeature;
}

export interface HeroFooterFeature {
  fieldGroupName: string;
  subtitle: string;
  title: string;
}

export interface HeroFooter {
  feature1: HeroFooterFeature;
  feature2: HeroFooterFeature;
  feature3: HeroFooterFeature;
}

export interface CtaButtonsHero {
  primaryCtaLink: string | null;
  primaryCtaText: string | null;
  secondaryCtaLink: string | null;
  secondaryCtaText: string | null;
}

export interface LandingPage {
  fieldGroupName: string;
  headerInfo: HeaderInfo;
  heroItems: HeroItems;
  heroFooter: HeroFooter;
  aboutUs: AboutUs;
  tag: string;
}

export interface FeaturedImageNode {
  mediaItemUrl: string;
}

export interface FeaturedImage {
  node: FeaturedImageNode;
}

export interface LandingPageData {
  page: {
    title: string;
    content: string;
    featuredImage: FeaturedImage;
    ctaButtonsHero: CtaButtonsHero;
    landingPage: LandingPage;
    seo: {
      canonical: string;
      cornerstone: boolean;
      focuskw: string;
      fullHead: string;
      metaDesc: string;
      metaKeywords: string;
      metaRobotsNofollow: string;
      metaRobotsNoindex: string;
      opengraphAuthor: string;
      opengraphDescription: string;
      opengraphModifiedTime: string;
      opengraphPublishedTime: string;
      opengraphPublisher: string;
      opengraphSiteName: string;
      opengraphTitle: string;
      opengraphType: string;
      opengraphUrl: string;
      readingTime: number;
      title: string;
    };
  };
}

// Owners interfaces
export interface OwnerInfo {
  email: string | null;
  fieldGroupName: string;
  fullName: string;
  phoneNumber: string | null;
  position: string;
}

export interface OwnerNode {
  owners: OwnerInfo;
  id: string;
}

export interface OwnersPageInfo {
  seo: {
    schema: {
      raw: string;
    };
  };
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
    startCursor: string;
  };
}

export interface OwnerSeo {
  metaDesc: string;
  metaKeywords: string;
  metaRobotsNofollow: string;
  metaRobotsNoindex: string;
  opengraphAuthor: string;
  opengraphDescription: string;
  opengraphUrl: string;
}

// Blog Page interfaces
export interface BlogPageData {
  page: {
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
}

// Services Page interfaces
export interface ServicesPageData {
  page: {
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
}

// Projects Page interfaces
export interface ProjectsPageData {
  page: {
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
}

// Owners Data interfaces
export interface OwnersData {
  matt: {
    featuredImage: {
      node: {
        mediaItemUrl: string;
      };
    };
    owners: OwnerInfo;
    seo: OwnerSeo;
    id: string;
  };
  rob: {
    featuredImage: {
      node: {
        mediaItemUrl: string;
      };
    };
    owners: OwnerInfo;
    seo: OwnerSeo;
    id: string;
  };
}

// Services interfaces
export interface ServiceTag {
  name: string;
}

export interface ServiceHeroSection {
  primaryCatText: string;
  primaryCtaLink: string | null;
  secondaryCtaLink: string | null;
  secondaryCtaText: string | null;
  tags: {
    nodes: ServiceTag[];
  };
  phoneNumber: string;
  fieldGroupName?: string;
}

export interface ServiceSpecifications {
  coverageArea: string;
  responseTime: string;
  type: string[];
  warranty: string;
}

export interface ServiceFields {
  heroSection: ServiceHeroSection;
  smallDescription: string;
  specifications: ServiceSpecifications;
  mainContentSection?: string;
}

export interface ServiceNode {
  id: string;
  title: string;
  slug: string;
  content: string;
  servicesFields: ServiceFields;
  seo: {
    metaDesc: string;
    metaKeywords: string;
    opengraphDescription: string;
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

export interface ServicesResponse {
  services: {
    nodes: ServiceNode[];
  };
}

export interface ServiceDetailResponse {
  service: {
    content: string;
    title: string;
    seo: {
      canonical: string;
      cornerstone: boolean;
      focuskw: string;
      fullHead: string;
      metaDesc: string;
      metaKeywords: string;
      metaRobotsNofollow: string;
      metaRobotsNoindex: string;
      opengraphAuthor: string;
      opengraphDescription: string;
      readingTime: number;
    };
    servicesFields: ServiceFields;
    featuredImage?: {
      node: {
        sourceUrl: string;
        altText: string;
      };
    };
  };
  services: {
    nodes: ServiceNode[];
  };
}

// Projects interfaces
export interface ProjectTag {
  name: string;
}

export interface ProjectFields {
  shortDescription: string;
  tags: {
    nodes: ProjectTag[];
  };
  specifications: {
    coverageArea: string;
  };
}

export interface ProjectNode {
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
  projectFields: ProjectFields;
}

export interface ProjectsResponse {
  projects: {
    nodes: ProjectNode[];
  };
}

// Testimonials interfaces
export interface ClientProfileImage {
  node: {
    altText: string;
    mediaItemUrl: string;
  };
}

export interface TestimonialContent {
  firstName: string;
  lastName: string;
  location: string;
  clientProfileImage: ClientProfileImage;
}

export interface TestimonialNode {
  testimonialContent: TestimonialContent;
  title: string;
}

export interface TestimonialsData {
  testimonials: {
    nodes: TestimonialNode[];
  };
}
