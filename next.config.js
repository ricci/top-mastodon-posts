/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
        output: 'export',
        images: {
            unoptimized: true,
        },
        async rewrites() {
            return [
                {
                    source: '/academic-crimes/:who',
                    destination: '/by/:who'
                }
            ];
        }
};

module.exports = nextConfig;
