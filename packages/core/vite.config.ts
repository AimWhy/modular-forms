import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    build: {
      target: 'es2020',
      outDir: 'dist',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      minify: false,
    },
  };
});
