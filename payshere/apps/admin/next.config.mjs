/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  transpilePackages: ['@workspace/ui'],
  swcMinify: false,
  basePath: '/admin',
};

export default nextConfig;
