import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'gs-webcomponents': 'src/index.js',
        'gs-birthday-picker': 'src/gs-birthday-picker/gs-birthday-picker.js',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['lit', 'lit/decorators.js', /^lit\//],
    },
  },
});
