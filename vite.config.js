import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { componentTagger } from "lovable-tagger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/Meteoric-Madness/' : '/',
  
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
  
  // Optimized build configuration for better performance
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'esnext',
    minify: 'terser',
    
    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : []
      }
    },
    
    rollupOptions: {
      output: {
        // Optimized manual chunks for better caching and loading
        manualChunks: {
          // Core React ecosystem
          'react-vendor': ['react', 'react-dom'],
          
          // Router for page navigation
          'react-router': ['react-router-dom'],
          
          // UI components and styling
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-slot', 
            '@radix-ui/react-tabs',
            '@radix-ui/react-progress',
            'class-variance-authority',
            'clsx',
            'tailwind-merge'
          ],
          
          // Animation libraries (GSAP is heavy)
          'animation': ['gsap'],
          
          // 3D libraries (Three.js ecosystem)
          'three-vendor': ['three'],
          
          // Icons (Lucide can be large)
          'icons': ['lucide-react'],
          
          // Utilities and smaller libs
          'utils': ['react-hot-toast']
        },
        
        // Generate descriptive chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace(/\.\w+$/, '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        
        // Optimize asset naming - FIXED: Removed unused 'ext' variable
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|svg|gif|webp|ico)$/.test(assetInfo.name)) {
            return `img/[name]-[hash][extname]`;
          }
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    
    // Increase chunk size warning limit (but still keep chunks optimized)
    chunkSizeWarningLimit: 600
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'gsap',
      'lucide-react'
    ],
    exclude: ['three'] // Three.js is better handled as a separate chunk
  }
}));