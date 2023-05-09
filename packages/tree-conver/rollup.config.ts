import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/node/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      name: 'treeConver',
      file: 'dist/tree-conver.min.js',
      format: 'iife'
    }
  ],
  plugins: [typescript(), terser()]
};
