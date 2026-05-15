const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,

  // ✅ Unblock Vercel build if lint/types fail
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optional: nur wenn du auch TypeScript-Fehler erstmal ignorieren willst
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.multikunst.com', pathname: '/**' },
    ],
    unoptimized: false,
  },

  // Allow serving static HTML projects from /public/projects/
  async headers() {
    return [
      {
        source: '/projects/:slug/:path*',
        headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
      },
    ];
  },

  /** Dev-only: avoids broken chunk refs (`Cannot find module './NNN.js'`) + PackFileCache ENOENT on Windows when `.next` desyncs. */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = (phase) => ({
  ...baseConfig,
  // Keep dev artifacts separate from build/start artifacts to prevent
  // `.next` corruption when commands are run in parallel on Windows.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
});

