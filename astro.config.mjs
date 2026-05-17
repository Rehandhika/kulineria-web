import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://kulineria.id',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'maplibre': ['maplibre-gl'],
            'gsap': ['gsap', 'gsap/ScrollTrigger'],
            'react-vendor': ['react', 'react-dom'],
            'state': ['zustand', 'nanostores', '@nanostores/react'],
            'minisearch': ['minisearch'],
          },
        },
      },
    },
  },
});
