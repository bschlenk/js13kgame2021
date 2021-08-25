import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { minifyHtml } from 'vite-plugin-html';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [
    viteSingleFile(),
    // Also minifies CSS
    minifyHtml(),
  ],
  build: {
    // Unnecessary for the modern browsers we target, reducing size of prelude
    polyfillModulePreload: false,
    // Speeds up build to not calculate
    brotliSize: false,
    terserOptions: {
      mangle: {
        properties: {
          builtins: false,
          reserved: [],
        },
      },
    },
  },
});
