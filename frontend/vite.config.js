import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El frontend corre en el puerto 5173 y el backend en el 3000:
// por eso el backend debe autorizar este origen con CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
