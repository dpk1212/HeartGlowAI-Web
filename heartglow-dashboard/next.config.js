/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/dashboard',
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: '/dashboard',
    // Add a build timestamp to bust cache on new deployments
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().getTime().toString(),
  },
  // Disable source maps in production to reduce bundle size
  productionBrowserSourceMaps: false,
  // Make sure we're handling paths correctly for the static export
  assetPrefix: '/dashboard/',
}

module.exports = nextConfig 