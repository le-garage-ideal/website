/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  compiler: {
    removeConsole: false,
  },
}

module.exports = nextConfig
