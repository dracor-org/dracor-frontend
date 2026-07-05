import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd());

  // TODO: Make sure PROXY_PATH is configured without trailing '/' everywhere
  const proxyPath = env.PROXY_PATH || '/exist/restxq/v1';

  return {
    base: '/',
    plugins: [react()],
    build: {
      outDir: 'build',
      // This is a workaround to Vite 8 using lightningcss and rejecting IE-era
      // CSS hacks used in yasgui. It can probably be remove once we replace
      // yasgui with a modern solution.
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
