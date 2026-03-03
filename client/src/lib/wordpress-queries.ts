export const NEW_QUERY = `
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

export const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: SLUG) {
      id
      title
      slug
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      seo {
        metaDesc
        metaKeywords
        opengraphDescription
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
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        seo {
          metaDesc
          metaKeywords
          opengraphDescription
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

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
        metaDesc
        metaKeywords
        opengraphDescription
        opengraphTitle
      }
    }
  }
`;

export const GET_LANDING_PAGE = `
  query NewQuery {
    page(id: "cG9zdDoxMjI=") {
      title
      content
      featuredImage {
        node {
          mediaItemUrl
        }
      }
      ctaButtonsHero {
        primaryCtaLink
        primaryCtaText
        secondaryCtaLink
        secondaryCtaText
      }
      landingPage {
        headerInfo {
          companyLogo {
            node {
              mediaItemUrl
              altText
            }
          }
          contactEmail
          contactPhoneNumber
          fieldGroupName
          serviceArea
          slogan
        }
        heroItems {
          feature1 {
            title1
            description1
          }
          item2 {
            title
            description
          }
        }
        heroFooter {
          feature1 {
            subtitle
            title
          }
          feature2 {
            subtitle
            title
          }
          feature3 {
            subtitle
            title
          }
        }
        aboutUs {
          description
          subtitle
          title
          itemsList {
            item1
            item2
            item3
          }
        }
        tag
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
      }
    }
  }
`;

export const GET_ALL_PROJECTS = `
  query MyQuery3 {
    projects {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            id
            mediaItemUrl
            altText
          }
        }
        projectFields {
          shortDescription
          tags {
            nodes {
              name
            }
          }
          specifications {
            coverageArea
          }
        }
      }
    }
  }
`;

export const GET_PROJECTS_PAGE = `
  query NewQuery {
    page(id: "cG9zdDoyNDk=") {
      featuredImage {
        node {
          mediaItemUrl
        }
      }
      seo {
        metaDesc
        metaKeywords
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
        opengraphUrl
      }
      id
    }
  }
`;

export const GET_BLOG_PAGE = `
  query GetBlogPage($id: ID!) {
    page(id: $id) {
      featuredImage {
        node {
          mediaItemUrl
        }
      }
      seo {
        metaDesc
        metaKeywords
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
      }
      ctaButtonsHero {
        primaryCtaLink
        primaryCtaText
        secondaryCtaLink
        secondaryCtaText
      }
      title
      content
    }
  }
`;

export const GET_SERVICES_PAGE = `
  query NewQuery {
    page(id: "cG9zdDoyNDM=") {
      featuredImage {
        node {
          mediaItemUrl
        }
      }
      seo {
        metaDesc
        metaKeywords
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
      }
      ctaButtonsHero {
        primaryCtaLink
        primaryCtaText
        secondaryCtaLink
        secondaryCtaText
      }
      title
      content
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
        opengraphUrl
      }
      id
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
        opengraphUrl
      }
      id
    }
  }
`;

export const GET_ALL_SERVICES = `
  query GetAllServices {
    services {
      nodes {
        id
        title
        slug
        content
        servicesFields {
          heroSection {
            primaryCatText
            primaryCtaLink
            secondaryCtaLink
            secondaryCtaText
            tags {
              nodes {
                name
              }
            }
            phoneNumber
          }
          smallDescription
          specifications {
            coverageArea
            responseTime
            type
            warranty
          }
        }
        seo {
          metaDesc
          metaKeywords
          opengraphDescription
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_SERVICE_BY_SLUG = `
  query GetServiceBySlug($slug: ID!) {
    service(id: $slug, idType: SLUG) {
      title
      slug
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
        readingTime
      }
      servicesFields {
        specifications {
          coverageArea
          responseTime
          warranty
        }
        heroSection {
          primaryCatText
          primaryCtaLink
          secondaryCtaLink
          secondaryCtaText
          tags {
            nodes {
              name
            }
          }
          phoneNumber
        }
        mainContentSection
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
    services {
      nodes {
        servicesFields {
          heroSection {
            fieldGroupName
          }
          smallDescription
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

export const GET_HEADER_DATA = `
  query GetHeaderData {
    page(id: "cG9zdDoxMjI=") {
      landingPage {
        headerInfo {
          companyLogo {
            node {
              mediaItemUrl
              altText
            }
          }
          contactEmail
          contactPhoneNumber
          fieldGroupName
          serviceArea
          slogan
        }
      }
    }
  }
`;

export const GET_FOOTER_SERVICES = `
  query GetFooterServices {
    services(first: 6) {
      nodes {
        title
        slug
        servicesFields {
          heroSection {
            primaryCatText
          }
        }
      }
    }
  }
`;

export const GET_CONTACT_PAGE = `
  query GetContactPage {
    page(id: "cG9zdDoyNTQ=") {
      content
      title
      seo {
        metaDesc
        metaKeywords
      }
      contactInformation {
        businessHours
        facebookLink
        extraInfo {
          subtitle
          title
        }
        forwardedTo {
          mattEmail
          robEmail
        }
        googleMapsRating {
          locationLink
          rating
        }
        mattPhoneNumber
        principalEmail
        robPhoneNumber
        location
      }
      slug
    }
  }
`;

export const GET_SERVICE_AREAS = `
  query GetServiceAreas {
    serviceAreas {
      nodes {
        servicesArea {
          location
          introduction
        }
        featuredImage {
          node {
            mediaItemUrl
          }
        }
        slug
        id
      }
    }
  }
`;

export const GET_SERVICE_AREA = `
  query GetServiceArea($id: ID!) {
    serviceArea(id: $id, idType: SLUG) {
      featuredImage {
        node {
          mediaItemUrl
        }
      }
      content
      seo {
        metaDesc
        metaKeywords
        focuskw
        cornerstone
        canonical
        opengraphTitle
        opengraphSiteName
        title
      }
      servicesArea {
        content
        introduction
        location
        primaryCtaLink
        primaryCtaText
        secondaryCtaLink
        secondaryCtaText
      }
    }
  }
`;

export const GET_TESTIMONIALS = `
  query testimonials {
    testimonials {
      nodes {
        testimonialContent {
          firstName
          lastName
          location
          clientProfileImage {
            node {
              altText
              mediaItemUrl
            }
          }
        }
        title
      }
    }
  }
`;

// Re-export types from wordpress-types for convenience
export type { 
  BlogPageData, 
  ProjectsPageData,
  ServicesPageData,
  LandingPageData,
  OwnersData,
  TestimonialsData
} from './wordpress-types';
