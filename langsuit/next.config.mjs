/** @type {import('next').NextConfig} */
const nextConfig = {
    api: {
        bodyParser: {
          sizeLimit: '500kb',
        },
      },
};

export default nextConfig;
