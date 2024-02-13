const IMAGE_DOMAIN = Array.from(process.env.NEXT_PUBLIC_STRAPI_BASE_IMG_URL.matchAll(/\/\/([\w\d\.\-_]*)/gi))[0][1];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  compiler: {
    removeConsole: false,
  },
  images: {
    domains: [IMAGE_DOMAIN],
  },
}

module.exports = nextConfig
