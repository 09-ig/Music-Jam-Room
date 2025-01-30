/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ytimg.com", "img.youtube.com"],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

