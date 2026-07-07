/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  eslint: {
    // ESLint runs separately in CI — don't fail the build on lint warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // We catch type errors locally; don't double-fail on Vercel
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
