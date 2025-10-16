import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Allow overriding base for GitHub Pages via env
  const base = process.env.VITE_BASE || '/';
  return {
    base,
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173
    }
  };
});
