/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.clerk.dev'],
  },
  env: {
    NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/-123.361940,48.408510',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
