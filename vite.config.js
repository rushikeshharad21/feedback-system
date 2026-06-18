import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // 🛡️ हे जोडल्यामुळे भविष्यात कोड चुकल्यास पांढऱ्या स्क्रीनऐवजी ब्राउझरवर एरर ओव्हरले दिसेल
    hmr: {
      overlay: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Forwards frontend fetch requests to Express
        changeOrigin: true,
        secure: false,
      },
    },
  },
});