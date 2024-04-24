/// <reference types="vite" />
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import svgr from 'vite-plugin-svgr';

export default defineConfig(() => ({
  plugins: [react(), tsconfigPaths(), svgr()],
  test: {
    exclude: []
  }
}));
