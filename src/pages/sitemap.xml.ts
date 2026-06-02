import type { APIRoute } from 'astro';
import { getAllFoods } from '../lib/data/loaders';

const SITE_URL = 'https://kulineria.id';

const BUILD_DATE = '2026-05-17';

const routes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/jelajahi', priority: '0.6', changefreq: 'weekly' },
  { path: '/kuis', priority: '0.5', changefreq: 'monthly' },
  { path: '/tentang', priority: '0.4', changefreq: 'monthly' },
];

const foods = getAllFoods();
const foodRoutes = foods.map(food => ({
  path: `/hidangan/${food.id}`,
  priority: '0.8',
  changefreq: 'weekly',
}));

const allRoutes = [...routes, ...foodRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

export const GET: APIRoute = () =>
  new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
