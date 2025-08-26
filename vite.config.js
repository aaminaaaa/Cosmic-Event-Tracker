import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Import the PostCSS plugins directly using ES Module syntax
// This is the dedicated PostCSS plugin for Tailwind CSS
import tailwindcss from '@tailwindcss/postcss'; 
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        // Call the imported plugins as functions
        tailwindcss(), 
        autoprefixer(),
      ],
    },
  },
});
