/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "via.placeholder.com", "i.ibb.co", "imgbb.com", "ibb.co"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ibb.co'
      },
      {
        protocol: 'https',
        hostname: '**.imgbb.com'
      },
      {
        protocol: 'https',
        hostname: '**.i.ibb.co'
      }
    ]
  }
};

export default nextConfig;
