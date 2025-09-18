import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { componentTagger } from "lovable-tagger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/Meteor-Madness/' : '/',
  
  server: {
    host: "::",
    port: 8080,
  },
  
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    outDir: '../dist', // Build to parent directory
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three'],
          ui: ['@radix-ui/react-tabs', '@radix-ui/react-card']
        }
      }
    }
  }
}));