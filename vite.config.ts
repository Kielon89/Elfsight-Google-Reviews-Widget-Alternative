import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/widget.ts',
            name: 'GoogleReviewsWidget',
            fileName: (format) => `widget.${format}.js`
        },
        rollupOptions: {
            output: {
                // Ensure ease of use by bundling everything into one file if possible, 
                // but Vite lib mode usually spits out es and umd/iife.
                // We probably only care about ES modules for modern web.
            }
        }
    }
});
