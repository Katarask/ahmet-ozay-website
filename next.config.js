const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.prod.website-files.com'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = withNextIntl(nextConfig);
