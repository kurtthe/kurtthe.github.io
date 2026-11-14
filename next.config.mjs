/** @type {import('next').NextConfig} */
// Static export: `npm run build` writes a plain HTML/CSS/JS site to ./out
// NEXT_PUBLIC_BASE_PATH is only needed when the site lives in a sub-folder,
// e.g. https://user.github.io/repo-name/ -> NEXT_PUBLIC_BASE_PATH=/repo-name
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
