/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    nextConfig,
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://gpt4v-image-captioner.vercel.app/:path*',
          },
        ]
      },
  };