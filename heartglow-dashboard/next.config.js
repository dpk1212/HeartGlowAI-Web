/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Using /dashboard as the base path - this is critical for proper routing
  // This ensures all internal routes are prefixed with /dashboard
  basePath: '/dashboard',
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    // Add a build timestamp to bust cache on new deployments
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().getTime().toString(),
    // Explicitly set the base path environment variable for client-side use
    NEXT_PUBLIC_BASE_PATH: '/dashboard',
  },
  // Disable source maps in production to reduce bundle size
  productionBrowserSourceMaps: false,
  // Make sure we're handling paths correctly for the static export
  assetPrefix: '/dashboard/',

  // Add redirects to fix common path issues and enforce base path
  async redirects() {
    return [
      // Fix double dashboard prefix
      {
        source: '/dashboard/dashboard/:path*',
        destination: '/dashboard/:path*',
        permanent: true,
        basePath: false, // Match source without the basePath
      },
      // Enforce base path for login
      {
        source: '/login',
        destination: '/dashboard/login',
        permanent: true,
        basePath: false, // Match source without the basePath
      },
      // Enforce base path for create
      {
        source: '/create',
        destination: '/dashboard/create',
        permanent: true,
        basePath: false, // Match source without the basePath
      },
      // Enforce base path for connections
      {
        source: '/connections/:path*',
        destination: '/dashboard/connections/:path*',
        permanent: true,
        basePath: false, // Match source without the basePath
      },
    ]
  },
}

module.exports = nextConfig 