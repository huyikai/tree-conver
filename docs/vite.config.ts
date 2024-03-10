import { URL, fileURLToPath } from 'node:url';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: '/tree-conver/',
    server: {
      open: '/tree-conver/'
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./../docs', import.meta.url))
      }
    },
    plugins: [
      AutoImport({
        /* options */
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        imports: ['vue'],
        // Generate automatically imported TS claim file
        dts: 'types/auto-imports.d.ts'
      }),
      Components({
        /* options */
        dts: 'types/components.d.ts',
        dirs: ['.vitepress']
      })
    ]
  };
});
