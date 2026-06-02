import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import swup from '@swup/astro';

export default defineConfig({
  site: 'https://kulineria.id',
  integrations: [
    react(),
    swup({
      theme: false,             // custom animation via JS hooks
      animationClass: false,    // tidak pakai CSS timing detection
      containers: ['main'],
      cache: false,
      preload: true,
      accessibility: true,
      smoothScrolling: false,
      updateHead: true,
      globalInstance: true,
      loadOnIdle: false,
      animateHistoryBrowsing: true,
    }),
  ],
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
