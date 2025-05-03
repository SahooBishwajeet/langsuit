/** @type {import('next').NextConfig} */
import { config } from "dotenv"; // Load environment variables from .env file
config();

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Content-Range",
            value: "bytes : 0-9/*",
          },
          {
            key: "X-RateLimit-Limit",
            value: "100",
          },
        ],
      },
    ];
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL, // Expose the variable to the client side if needed
  },
  serverRuntimeConfig: {
    bodyParser: {
      sizeLimit: "500kb",
    },
  },
};

export default nextConfig;
