/**
 * Vite Configuration File
 *
 * Build configuration for the VoltForge energy management platform.
 * Configures React support, Tailwind CSS integration, and path aliases
 * for clean imports throughout the application.
 *
 * Configuration includes:
 * - React plugin for JSX transformation and Fast Refresh
 * - Tailwind CSS plugin for utility-first styling
 * - Path alias for clean @/ imports from src directory
 * - Base path configuration for GitHub Pages deployment
 * - Build output to docs folder for GitHub Pages
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Base path for GitHub Pages deployment
  base: "/voltforge-platform/",

  // Plugin configuration for React and Tailwind CSS
  plugins: [react(), tailwindcss()],

  // Build configuration
  build: {
    // Output to docs folder for GitHub Pages
    outDir: "docs",
  },

  // Module resolution configuration
  resolve: {
    // Path aliases for cleaner imports
    alias: {
      "@": "/src",
    },
  },
});
