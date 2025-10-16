import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const clientHost = env.VITE_ADMIN_CLIENT_HOST || '127.0.0.1';
  const clientPort = Number(env.VITE_ADMIN_CLIENT_PORT) || 5174;
  const apiHost = env.ADMIN_API_HOST || '127.0.0.1';
  const apiPort = Number(env.ADMIN_API_PORT) || 5175;

  return {
    plugins: [react()],
    server: {
      host: clientHost,
      port: clientPort,
      strictPort: true,
      proxy: {
        '/api': {
          target: `http://${apiHost}:${apiPort}`,
          changeOrigin: false,
          secure: false
        },
        '/images': {
          target: `http://${apiHost}:${apiPort}`,
          changeOrigin: false,
          secure: false
        }
      }
    }
  };
});
