import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/index.js',
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
