const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.prod.website-files.com'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = withNextIntl(nextConfig);
