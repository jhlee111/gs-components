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
    },
  },
});
