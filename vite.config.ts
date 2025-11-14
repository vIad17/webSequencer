import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  console.log(`🚀 Vite запущен в режиме: ${mode}`);
  console.log(`API MODE: ${env.VITE_API_MODE}`);

  return {
    base: '/webSequencer/',
    plugins: [react(), tsconfigPaths(), svgr()],
    define: {
      'process.env': env
    },
    server: {
      port: 5172
    }
  };
});
