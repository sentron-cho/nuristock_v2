import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: [
      // { find: '@src', replacement: resolve(__dirname, 'src') },
      { find: '@features', replacement: resolve(__dirname, 'src/features') },
      { find: '@styles', replacement: resolve(__dirname, 'src/styles') },
    ],
  },
  plugins: [react(), tsconfigPaths()],
  // resolve: {
  //   alias: {
  //     '@features': path.resolve(__dirname, 'src/features'),
  //     '@components': path.resolve(__dirname, 'src/components'),
  //     '@utils': path.resolve(__dirname, 'src/utils'),
  //   },
  // },
});
