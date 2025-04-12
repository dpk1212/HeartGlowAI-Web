/** @type {import('next').NextConfig} */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  basePath: basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    // Add a build timestamp to bust cache on new deployments
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().getTime().toString(),
  },
  // Disable source maps in production to reduce bundle size
  productionBrowserSourceMaps: false,
  exportPathMap: async function (defaultPathMap) {
    return {
      ...defaultPathMap,
      '/': { page: '/' },
      '/login': { page: '/login' },
      '/dashboard': { page: '/dashboard' },
      '/create': { page: '/create' },
      '/connections': { page: '/connections' },
      '/connections/add': { page: '/connections/add' },
    };
  },
}

module.exports = nextConfig 