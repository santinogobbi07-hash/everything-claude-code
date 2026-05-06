import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path is configurable so the app can be served from a sub-path
// (e.g. GitHub Pages publishes under /everything-claude-code/).
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: false
  }
});
