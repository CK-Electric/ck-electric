export const GET_ALL_POSTS = `
  query GetAllPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        id
        title
        slug
        content
        excerpt
        date
        modified
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      excerpt
      date
      modified
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
      seo {
        canonical
        cornerstone
        focuskw
        fullHead
        metaDesc
        metaKeywords
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
        opengraphModifiedTime
        opengraphPublishedTime
        opengraphPublisher
        opengraphSiteName
        opengraphTitle
        opengraphType
        opengraphUrl
        readingTime
        title
      }
    }
  }
`;

export const GET_ALL_PAGES = `
  query GetAllPages($first: Int, $after: String) {
    pages(first: $first, after: $after) {
      nodes {
        id
        title
        slug
        content
        excerpt
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: SLUG) {
      id
      title
      content
      excerpt
      date
      modified
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const GET_ALL_CATEGORIES = `
  query GetAllCategories {
    categories {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

export const NEW_QUERY = `
  query NewQuery {
    posts {
      nodes {
        heroSection {
          subtitle
          title
        }
        id
      }
    }
  }
`;

export const GET_ALL_PROJECTS = `
  query GetAllProjects {
    projects {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            id
            sourceUrl
            altText
          }
        }
        projectFields {
          fieldGroupName
          specifications {
            coverageArea
            fieldGroupName
            responseTime
            warranty
          }
          mainContentSection
        }
      }
    }
  }
`;

export const GET_PROJECT_BY_SLUG = `
  query GetProjectBySlug($slug: ID!) {
    project(id: $slug, idType: SLUG) {
      id
      title
      slug
      content
      featuredImage {
        node {
          id
          sourceUrl
          altText
        }
      }
      seo {
        canonical
        cornerstone
        focuskw
        fullHead
        metaDesc
        metaKeywords
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
        opengraphModifiedTime
        opengraphPublishedTime
        opengraphPublisher
        opengraphSiteName
        opengraphTitle
        opengraphType
        opengraphUrl
        readingTime
        title
      }
      projectFields {
        fieldGroupName
        specifications {
          coverageArea
          fieldGroupName
          responseTime
          warranty
        }
        mainContentSection
      }
    }
  }
`;

export const GET_LANDING_PAGE = `
  query NewQuery {
    page(id: "cG9zdDoxMjI=") {
      landingPage {
        fieldGroupName
        heroSubtitle
        heroTitle
        tag
        headerInfo {
          contactEmail
          contactPhoneNumber
          fieldGroupName
          serviceArea
          slogan
          companyLogo {
            node {
              link
              mediaItemUrl
              description
              altText
            }
          }
        }
        aboutUs {
          description
          fieldGroupName
          subtitle
          title
        }
        heroItems {
          feature1 {
            description1
            fieldGroupName
            title1
          }
          item2 {
            description
            fieldGroupName
            title
          }
        }
        heroFooter {
          feature1 {
            fieldGroupName
            subtitle
            title
          }
          feature2 {
            fieldGroupName
            subtitle
            title
          }
          feature3 {
            fieldGroupName
            subtitle
            title
          }
          title {
            fieldGroupName
            subtitle
            title
          }
        }
      }
      featuredImage {
        cursor
        node {
          altText
          description
        }
      }
    }
  }
`;

export const GET_OWNERS = `
  query NewQuery {
    matt: owner(id: "cG9zdDoyMTc=") {
      featuredImage {
        node {
          mediaItemUrl
        }
      }
      owners {
        email
        fullName
        phoneNumber
        position
      }
      seo {
        metaDesc
        metaKeywords
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
        canonical
      }
    }
    rob: owner(id: "cG9zdDoyMTU=") {
      featuredImage {
        node {
          mediaItemUrl
        }
      }
      owners {
        email
        fullName
        phoneNumber
        position
      }
      seo {
        metaDesc
        metaKeywords
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
        canonical
      }
    }
  }
`;

// TypeScript interfaces for Landing Page data
export interface CompanyLogo {
  node: {
    link: string;
    mediaItemUrl: string;
    description: string | null;
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

export interface AboutUs {
  description: string;
  fieldGroupName: string;
  subtitle: string;
  title: string;
}

export interface HeroFeature {
  description1?: string;
  description?: string;
  fieldGroupName: string;
  title1?: string;
  title?: string;
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

export interface HeroFooterTitle {
  fieldGroupName: string;
  subtitle: string;
  title: string;
}

export interface HeroFooter {
  feature1: HeroFooterFeature;
  feature2: HeroFooterFeature;
  feature3: HeroFooterFeature;
  title: HeroFooterTitle;
}

export interface LandingPage {
  fieldGroupName: string;
  heroSubtitle: string;
  heroTitle: string;
  tag: string;
  headerInfo: HeaderInfo;
  aboutUs: AboutUs;
  heroItems: HeroItems;
  heroFooter: HeroFooter;
}

export interface FeaturedImageNode {
  altText: string;
  description: string | null;
}

export interface FeaturedImage {
  cursor: string;
  node: FeaturedImageNode;
}

export interface LandingPageData {
  page: {
    landingPage: LandingPage;
    featuredImage: FeaturedImage;
  };
}

// TypeScript interfaces for Owners
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
  startCursor: string;
}

export interface OwnerSeo {
  metaDesc: string;
  metaKeywords: string;
  metaRobotsNofollow: string;
  metaRobotsNoindex: string;
  opengraphAuthor: string;
  opengraphDescription: string;
  title: string;
  opengraphUrl: string;
}

export interface OwnersData {
  matt: {
    featuredImage: {
      node: {
        mediaItemUrl: string;
      };
    };
    owners: OwnerInfo;
    seo: OwnerSeo;
  };
  rob: {
    featuredImage: {
      node: {
        mediaItemUrl: string;
      };
    };
    owners: OwnerInfo;
    seo: OwnerSeo;
  };
}
