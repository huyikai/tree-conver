import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/index.cjs.js',
      format: 'cjs'
    },
    {
      file: 'lib/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      name: 'treeConver',
      file: 'lib/tree-conver.min.js',
      format: 'iife'
    }
  ],
  plugins: [typescript(), terser()]
};
