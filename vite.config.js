import { defineConfig } from "vite";
import path from 'path';

export default defineConfig({
  base: "/Ayuntamiento/", // Ruta base para GitHub Pages
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        pistas: path.resolve(__dirname, 'pistas.html'),
        equipogobierno: path.resolve(__dirname, 'equipogobierno.html'),
        servicios: path.resolve(__dirname, 'servicios.html'),
        // Agrega más archivos si es necesario
      },
    },
  },
});
