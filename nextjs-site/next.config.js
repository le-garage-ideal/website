const IMAGE_DOMAIN = Array.from(process.env.NEXT_PUBLIC_STRAPI_BASE_IMG_URL.matchAll(/\/\/([\w\d\.\-_]*)/gi))[0][1];

/** @type {import('next').NextConfig} */

const path = require('path')

const nextConfig = {
  compiler: {
    removeConsole: false,
  },
  images: {
    domains: [IMAGE_DOMAIN],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

module.exports = nextConfig
