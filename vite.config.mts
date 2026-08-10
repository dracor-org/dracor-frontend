import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd());

  // TODO: Make sure PROXY_PATH is configured without trailing '/' everywhere
  const proxyPath = env.PROXY_PATH || '/exist/restxq/v1';

  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'build',
      // Workaround for Vite 8 lightningcss rejecting IE-era CSS hacks used in
      // yasgui. Can probably be removed once yasgui is replaced.
      cssMinify: 'esbuild',
    },
    server: {
      open: true,
      proxy: {
        '/api/v1': {
          target: 'http://localhost:8080/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/v1/, proxyPath),
        },
        '/api/v0': {
          target: 'http://localhost:8080/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/v0/, '/exist/restxq/v0'),
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      css: true,
      reporters: ['verbose'],
      coverage: {
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*'],
        exclude: ['**/*.test.tsx', '**/*.test.ts'],
      },
    },
  };
});
