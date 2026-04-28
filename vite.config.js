import { defineConfig } from 'vite';
import tidewave from 'tidewave/vite-plugin';

export default defineConfig({
  plugins: [tidewave()],
  build: {
    lib: {
      entry: {
        'gs-webcomponents': 'src/index.js',
        'gs-birthday-picker': 'src/gs-birthday-picker/gs-birthday-picker.js',
        'gs-num-pad': 'src/gs-num-pad/gs-num-pad.js',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['lit', 'lit/decorators.js', /^lit\//],
      // Vite/Rollup extracts src/shared/theme.js (used by every component)
      // into a hashed chunk file in dist/. Consumers always import via the
      // package's `exports` map, never by raw filename, so the unstable
      // chunk hash is invisible to them. Trade: ~785 bytes saved per
      // consumer that loads more than one component.
    },
  },
});
