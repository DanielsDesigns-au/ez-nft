/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    externals: {
        FileReader: "FileReader",
    },
};

module.exports = nextConfig;
