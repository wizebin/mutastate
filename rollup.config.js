import babel from 'rollup-plugin-babel';
import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/index.ts',
  output: {
    format: 'umd',
    file: './dist/index.js',
    name: 'mutastate',
    sourcemap: true,
  },
  external: [
    'clone',
    'bluebird',
    'react',
    'lodash.clone'
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      outputToFilesystem: true,
    }),
    babel({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      exclude: 'node_modules/**'
    }),
  ],
};
