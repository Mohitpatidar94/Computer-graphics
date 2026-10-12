import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Computer-graphics/' : '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/katex/')) return 'katex';
          if (id.includes('/node_modules/framer-motion/')) return 'motion';
        },
      },
    },
  },
  test: { environment: 'node' },
}));
