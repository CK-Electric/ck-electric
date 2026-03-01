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
  query NewQuery {
    projects {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        projectFields {
          specifications {
            coverageArea
            projectType
            clientType
            completionDate
            projectValue
            technologies
            challenges
            solutions
          }
        }
      }
    }
  }
`;

export const GET_PROJECTS_PAGE = `
  query NewQuery {
    page(id: "cG9zdDoyMzQ=") {
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

export const GET_BLOG_PAGE = `
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
