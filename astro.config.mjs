import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'maplibre': ['maplibre-gl'],
            'gsap': ['gsap', 'gsap/ScrollTrigger', 'gsap/Flip'],
            'react-vendor': ['react', 'react-dom'],
            'zustand': ['zustand'],
            'nanostores': ['nanostores', '@nanostores/react'],
            'minisearch': ['minisearch'],
          },
        },
      },
    },
  },
});