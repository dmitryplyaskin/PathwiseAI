import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@app': path.resolve(__dirname, './src/app'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    open: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'effector',
      'effector-react',
      'react-markdown',
      'react-syntax-highlighter',
      'remark-gfm',
    ],
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем большие библиотеки на отдельные чанки
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'mui-vendor': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          'effector-vendor': ['effector', 'effector-react'],
          'markdown-vendor': [
            'react-markdown',
            'react-syntax-highlighter',
            'remark-gfm',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Увеличиваем лимит до 1MB для предупреждений
  },
  base: '/',
});
