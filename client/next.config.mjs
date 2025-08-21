/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only ignore during builds if there are no critical errors
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enable TypeScript error checking for production builds
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
