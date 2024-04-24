import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env,
    },
    build: {
        minify: false,  // Disable minification
        sourcemap: true,  // Enable source maps
    },
    server: {
        host: true,
        proxy: {
            '/api': {
                target: 'https://catalog.elwazi.org',
                changeOrigin: true,
            }
        }
    },
    base: './',
});
