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
  // Cache control will need to be handled at the server level since headers aren't compatible with export
}

module.exports = nextConfig 