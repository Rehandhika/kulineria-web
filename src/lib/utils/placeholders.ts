import type { RegionId } from '@/types/food';

const REGION_COLORS: Record<RegionId, string> = {
  sumatera: '#A0522D',
  jawa: '#8B6914',
  kalimantan: '#8B5E3C',
  sulawesi: '#B8860B',
  'bali-ntt': '#CD853F',
  'maluku-papua': '#6B3A2A',
};

const REGION_COLORS_SECONDARY: Record<RegionId, string> = {
  sumatera: '#8B4513',
  jawa: '#6B4E10',
  kalimantan: '#6B3A1E',
  sulawesi: '#9A7208',
  'bali-ntt': '#B06A28',
  'maluku-papua': '#4A2818',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

export function generateFoodPlaceholder(name: string, region: RegionId): string {
  const color = REGION_COLORS[region] || '#A0522D';
  const color2 = REGION_COLORS_SECONDARY[region] || '#6B3A2A';
  const initials = getInitials(name);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.12)"/>
    </pattern>
  </defs>
  <rect width="400" height="300" fill="url(#bg)"/>
  <rect width="400" height="300" fill="url(#dots)"/>
  <text x="200" y="150" text-anchor="middle" dominant-baseline="central"
        font-family="system-ui,-apple-system,sans-serif" font-size="72" font-weight="800"
        fill="rgba(255,255,255,0.2)" letter-spacing="4">${initials}</text>
</svg>`;

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}
