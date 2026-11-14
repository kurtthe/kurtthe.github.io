/** Prefixes public files with the base path, so the site also works from a GitHub Pages sub-folder. */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
