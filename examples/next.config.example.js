/**
 * Example Next.js configuration for WebContainer compatibility
 * 
 * This configuration disables SWC (native Rust compiler) and uses Babel instead,
 * which is required for Next.js to run in WebContainer (browser-based Node.js runtime)
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Disable SWC transforms - use Babel instead
   * This is REQUIRED for WebContainer compatibility since SWC is a native binary
   */
  experimental: {
    forceSwcTransforms: false,
  },

  /**
   * Optional: Additional WebContainer-friendly configurations
   */
  
  // Disable image optimization if needed (uses native dependencies in some cases)
  // images: {
  //   unoptimized: true,
  // },

  // Output standalone for easier deployment
  // output: 'standalone',
};

module.exports = nextConfig;
