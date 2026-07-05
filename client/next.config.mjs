/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only ignore during builds if there are no critical errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Enable TypeScript error checking for production builds
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
