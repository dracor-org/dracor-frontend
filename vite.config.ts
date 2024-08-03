import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  // TODO: Make sure PROXY_PATH is configured without trailing '/' everywhere
  const proxyPath = env.PROXY_PATH || '/exist/restxq/v1';

  return {
    base: '/',
    plugins: [react()],
    build: {
      outDir: 'build',
    },
    server: {
      open: true,
      proxy: {
        '/api/v1': {
          target: 'http://localhost:8080/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/v1/, proxyPath)
        },
        '/api/v0': {
          target: 'http://localhost:8080/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/v0/, '/exist/restxq/v0')
        },
      },
    }
  };
});
