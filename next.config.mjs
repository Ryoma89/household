/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jezixxfdmwgrllvyhjjh.supabase.co',
      },
    ],
  },
}

export default nextConfig;

