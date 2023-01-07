/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'fr'],
    defaultLocale: 'en-US',
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
