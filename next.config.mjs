/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/invoicing",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
