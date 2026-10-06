import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: '/',
  plugins: [react()],
  publicDir: false,
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
  },
});
