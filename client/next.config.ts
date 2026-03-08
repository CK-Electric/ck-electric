import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce legacy JavaScript for modern browsers
  experimental: {
    optimizePackageImports: ['@mui/icons-material', '@mui/material'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
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
    // Increase image quality for better compression
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    // In dev, Next.js image optimization proxies requests server-side, which
    // can't reach DevKinsta's `testing2.local` hostname. Disable in dev so
    // <Image> falls back to serving the src URL directly (same as plain <img>).
    unoptimized: process.env.NODE_ENV === 'development',
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Optimize CSS loading
  poweredByHeader: false,
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
      // Preload critical resources
      {
        source: '/_next/static/css/(.*).css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Optimize bundle splitting
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 20,
        },
        mui: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          name: 'mui',
          chunks: 'all',
          priority: 30,
        },
      };
    }
    return config;
  },
  // Empty turbopack config to silence Next.js 16 warning
  turbopack: {},
};

export default nextConfig;
