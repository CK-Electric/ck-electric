import type { Metadata } from 'next';

export const SITE_NAME = 'CK Electric';
export const SITE_URL = 'https://ck-electric.com';
export const SITE_DEFAULT_DESCRIPTION =
  'Talk directly with licensed electricians. No call centers, no middlemen. Fast response and industrial-grade quality for every project in the Puget Sound.';
export const SITE_DEFAULT_KEYWORDS =
  'electrical contractor, licensed electrician, commercial electrical, residential electrical, EV charger installation, panel upgrades, Puget Sound';

// Full Yoast SEO WPGraphQL fields — used for type safety across all pages
export interface WpSeo {
  title?: string | null;
  metaDesc?: string | null;
  metaKeywords?: string | null;
  canonical?: string | null;
  metaRobotsNoindex?: string | null;
  metaRobotsNofollow?: string | null;
  // Open Graph
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: { mediaItemUrl: string } | null;
  opengraphUrl?: string | null;
  opengraphType?: string | null;
  opengraphSiteName?: string | null;
  opengraphPublishedTime?: string | null;
  opengraphModifiedTime?: string | null;
  // --- Fields below require Yoast SEO Premium + newer WPGraphQL Yoast plugin ---
  // Add to SEO_FIELDS in wordpress-queries.ts when the plugin supports them:
  opengraphLocale?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: { mediaItemUrl: string } | null;
  twitterCard?: string | null;
  // schema.raw: inject as <script type="application/ld+json"> in the page component
  schema?: { raw: string } | null;
}

export interface SeoFallbacks {
  title: string;
  description: string;
  /** Absolute image URL for OG/Twitter */
  image?: string;
  /** Canonical page URL */
  url?: string;
  type?: 'website' | 'article';
  keywords?: string;
  /** ISO date string — used for article publishedTime when seo.opengraphPublishedTime is empty */
  publishedTime?: string;
  /** ISO date string — used for article modifiedTime when seo.opengraphModifiedTime is empty */
  modifiedTime?: string;
}

/**
 * Builds a Next.js Metadata object from WordPress Yoast SEO data.
 * All WordPress fields take priority; fallbacks are used when fields are empty.
 * A marketer can fill in any Yoast field and it will automatically surface here.
 */
export function buildMetadata(
  seo: WpSeo | null | undefined,
  fallbacks: SeoFallbacks,
): Metadata {
  const title = seo?.title || fallbacks.title;
  const description = seo?.metaDesc || fallbacks.description;
  const keywords = seo?.metaKeywords || fallbacks.keywords;
  // Always prefer the explicitly-constructed frontend URL over Yoast's canonical,
  // which in a headless setup points to the WordPress/Kinsta backend domain.
  const canonical = fallbacks.url || seo?.canonical || undefined;

  const ogTitle = seo?.opengraphTitle || title;
  const ogDescription = seo?.opengraphDescription || description;
  const ogImage = seo?.opengraphImage?.mediaItemUrl || fallbacks.image;
  const ogUrl = fallbacks.url || seo?.opengraphUrl || seo?.canonical || undefined;
  const ogType = (seo?.opengraphType || fallbacks.type || 'website') as 'website' | 'article';
  const ogSiteName = seo?.opengraphSiteName || SITE_NAME;

  const twitterTitle = seo?.twitterTitle || ogTitle;
  const twitterDescription = seo?.twitterDescription || ogDescription;
  const twitterImage = seo?.twitterImage?.mediaItemUrl || ogImage;
  const twitterCard = (seo?.twitterCard || 'summary_large_image') as
    | 'summary_large_image'
    | 'summary';

  const robots = {
    index: seo?.metaRobotsNoindex !== 'noindex',
    follow: seo?.metaRobotsNofollow !== 'nofollow',
  };

  const publishedTime = seo?.opengraphPublishedTime || fallbacks.publishedTime;
  const modifiedTime = seo?.opengraphModifiedTime || fallbacks.modifiedTime;

  return {
    title,
    description,
    ...(keywords && { keywords }),
    robots,
    ...(canonical && { alternates: { canonical } }),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: ogType,
      siteName: ogSiteName,
      ...(ogUrl && { url: ogUrl }),
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      }),
      ...(seo?.opengraphLocale && { locale: seo.opengraphLocale }),
      ...(ogType === 'article' && publishedTime && { publishedTime }),
      ...(ogType === 'article' && modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      ...(twitterImage && { images: [twitterImage] }),
    },
  };
}
