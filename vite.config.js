import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

/* Renombra el HTML de la versión para pendrive, así no se confunde con el index.html. */
const nombrePendrive = {
  name: 'nombre-pendrive',
  enforce: 'post',
  generateBundle(_, bundle) {
    if (bundle['index.html']) bundle['index.html'].fileName = 'a-moverse.html';
  }
};

export default defineConfig(({ mode }) => ({
  // Rutas relativas: sirve igual en GitHub Pages (en cualquier nombre de repo) y abriendo el archivo desde el pendrive.
  base: './',
  plugins: mode === 'pendrive' ? [viteSingleFile(), nombrePendrive] : [],
  build: {
    outDir: mode === 'pendrive' ? 'dist-pendrive' : 'dist',
    emptyOutDir: true
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js']
  }
}));
