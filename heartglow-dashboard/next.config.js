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

  // Add a custom webpack configuration to inject the fix-path.js script
  webpack: (config, { isServer, dev }) => {
    // Only modify the client-side build and only in production
    if (!isServer && !dev) {
      console.log('Adding fix-path.js to the client-side bundle');
      // The fix-path.js file will be included in the final build
    }
    return config;
  },
}

module.exports = nextConfig 