/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos", "lh3.googleusercontent.com", "www.youtube.com"],
  },
  webpack: (config) => {
    if (!config.experiments) {
      config.experiment = {};
    }
    config.experiments.topLevelAwait = true;
    return config;
  },
};

module.exports = nextConfig;
