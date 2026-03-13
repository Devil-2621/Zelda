// @ts-nocheck
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration for WebContainer compatibility
 * 
 * Key requirement: server.host = true for port forwarding to work
 */
export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000,
    /**
     * REQUIRED: Enable host binding for WebContainer
     * Without this, the preview won't be accessible in the browser
     */
    host: true,
  },
  
  // Optional: Configure build options
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
