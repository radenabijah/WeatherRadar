import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      
    },
  },
  resolve: {
    alias: {
      '@': '/src', 
    },
  },
  define: {
    'process.env': {},
  },
});
