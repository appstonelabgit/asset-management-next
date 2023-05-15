/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '*.192.168.29.98',
                port: '3333',
            },
        ],
    },
};

module.exports = nextConfig;
