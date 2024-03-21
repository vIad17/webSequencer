/// <reference types="vite" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

import svgr from 'vite-plugin-svgr';

export default defineConfig(() => ({
  base: '',
  plugins: [react(), tsconfigPaths(), svgr()],
  test: {
    exclude: [],
  },
}));
