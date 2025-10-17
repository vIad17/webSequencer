/// <reference types="vite" />
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import svgr from 'vite-plugin-svgr';

export default defineConfig(() => ({
  base: '/webSequencer',
  plugins: [react(), tsconfigPaths(), svgr()],
  test: {
    exclude: []
  },
  server: {
    port: 5172
  }
}));
