import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Allow both NEXT_PUBLIC_ and VITE_ prefixes
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  
  // Debug: Log what we're loading from .env
  console.log('=== SUPABASE CLIENT DEBUG ===');
  console.log('VITE_SUPABASE_URL:', env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY:', env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
  console.log('================================');
  
  return {
    server: {
      host: "::",
      port: 8080,
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..']
      }
    },
    plugins: [
      react({
        // Enable TypeScript with SWC
        tsDecorators: true
      }),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    define: {
      // Map NEXT_PUBLIC_ variables to VITE_ variables
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
      // Also expose them with NEXT_PUBLIC_ prefix for backward compatibility
      'import.meta.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || ''),
      'import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    },
    // Allow both VITE_ and NEXT_PUBLIC_ prefixes
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    build: {
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor libraries into separate chunks
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs'],
            'query-vendor': ['@tanstack/react-query'],
            'animation-vendor': ['framer-motion'],
            'supabase-vendor': ['@supabase/supabase-js'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'chart-vendor': ['recharts'],
            'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          },
        },
      },
      // Enable source maps for better debugging in production
      sourcemap: true,
      // Optimize build performance
      target: 'esnext',
      minify: 'esbuild',
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'framer-motion',
        '@supabase/supabase-js',
      ],
      esbuildOptions: {
        target: 'esnext',
        // Add support for JSX/TSX in dependencies
        loader: {
          '.js': 'jsx',
          '.ts': 'tsx'
        }
      }
    },
  };
});
