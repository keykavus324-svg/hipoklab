import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// BASE ortam değişkeni GitHub Pages gibi alt dizinde yayınlanan ortamlar için
// kullanılır (ör. BASE=/hipoklab/). Yerel geliştirmede kök yol (/) kullanılır.
export default defineConfig({
  base: process.env.BASE || '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: true,
  },
});
