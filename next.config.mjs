/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["cloudinary"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com', // for potential avatar images
      },
    ],
  },
  // Add redirects if needed for API compatibility
  async redirects() {
    return [
      // Ensure API routes are properly handled
    ];
  },
};

export default nextConfig
