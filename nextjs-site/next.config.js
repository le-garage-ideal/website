const { i18n } = require('./next-i18next.config')
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  compiler: {
    removeConsole: false,
  },
  i18n,
  images: {
    domains: ["127.0.0.1"],
  },
}

module.exports = nextConfig
