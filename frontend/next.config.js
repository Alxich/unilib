/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos", "lh3.googleusercontent.com", "www.youtube.com"],
  },
};

module.exports = nextConfig;
