import { defineConfig } from 'vite';

export default defineConfig({
  // Ensures all relative paths work correctly in the production build
  base: './', 

  server: {
    port: 3000,
    
    // CRITICAL FIX 1: Handles your client-side routing (for your app.js hash router)
    // Sends all unmatched routes (like /admin, /programs) back to index.html
    historyApiFallback: true, 

    // CRITICAL FIX 2: Tells the dev server where to find static assets (like your /pages folder)
    // This serves the entire project root as static content.
    fs: {
      strict: false,
    },
  },
  
  build: {
    outDir: 'dist',
    // Ensures Vercel's environment variables are securely exposed
    envPrefix: 'VITE_', 
  }
});