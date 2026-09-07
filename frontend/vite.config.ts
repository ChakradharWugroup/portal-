import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    react(),
    basicSsl()
  ],
  server: {
    port: 3004,
    host: '0.0.0.0',
    https: true,
    proxy: {
      '/ai-api': {
        target: process.env.VITE_AI_URL || 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ai-api/, '/api')
      },
      '/django-api': {
        target: process.env.VITE_DJANGO_URL || 'http://127.0.0.1:8005',
        changeOrigin: false,
        secure: false,
        rewrite: (path) => path.replace(/^\/django-api/, '/api')
      }
    }
  },
});
