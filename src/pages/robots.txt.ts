import type { APIRoute } from 'astro';

const robots = `User-agent: *
Allow: /
Disallow: /_astro/

Sitemap: https:
`;

export const GET: APIRoute = () =>
  new Response(robots, {
    headers: { 'Content-Type': 'text/plain' },
  });