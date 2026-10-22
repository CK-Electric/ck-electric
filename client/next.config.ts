import type { NextConfig } from "next";

const personalMirror = /^https:\/\/github\.com\/erikaaquino\/ck-electric2(?:\.git)?$/.test(process.env.REPOSITORY_URL || '');

const stagingForms = process.env.CK_ENABLE_STAGING_FORMS === 'true' && process.env.SITE_NAME === 'ck-electric-forms-staging';
const productionForms = process.env.CK_ENABLE_PRODUCTION_FORMS === 'true' &&
  process.env.CONTEXT === 'production' && process.env.URL === 'https://ckelectricllp.com' && !stagingForms;
const localFormDemo = process.env.NODE_ENV === 'development' && process.env.CK_ENABLE_LOCAL_FORM_DEMO === 'true';

const nextConfig: NextConfig = {
  // The production forms require the exact company production deploy context and domain.
  env: {
    CK_FORMS_DEMO: localFormDemo || (personalMirror && !stagingForms && !productionForms) ? 'true' : 'false',
    CK_FORMS_STAGING: stagingForms ? 'true' : 'false',
    CK_FORMS_PRODUCTION: productionForms ? 'true' : 'false',
  },
  images: {
    remotePatterns: [
      // Production WordPress on Kinsta
      {
        protocol: 'https',
        hostname: '*.kinsta.cloud',
      },
      // Google image proxy (used in some WP setups)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // Stock images fallback
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Local DevKinsta development
      {
        protocol: 'http',
        hostname: 'testing2.local',
      },
      {
        protocol: 'https',
        hostname: 'testing2.local',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // In dev, Next.js image optimization proxies requests server-side, which
    // can't reach DevKinsta's `testing2.local` hostname. Disable in dev so
    // <Image> falls back to serving the src URL directly (same as plain <img>).
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
