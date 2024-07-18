import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts({
    insertTypesEntry: true,
  })],
  build: {
    lib: {
      name: 'ChessLib',
      fileName: 'chess-lib',
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'umd']
    }
  },
  resolve: {
    alias: {
      src: resolve('src/')
    }
  },
});
