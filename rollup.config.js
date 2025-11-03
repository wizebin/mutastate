import babel from 'rollup-plugin-babel';
import typescript from '@rollup/plugin-typescript';

const external = [
  'clone',
  'bluebird',
  'react',
  'lodash.clone'
];

const plugins = [
  typescript({
    tsconfig: './tsconfig.json',
    outputToFilesystem: true,
  }),
  babel({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    exclude: 'node_modules/**'
  }),
];

export default [
  // Main bundle (core, no React)
  {
    input: './src/index.ts',
    output: [
      {
        format: 'umd',
        file: './dist/index.js',
        name: 'mutastate',
        sourcemap: true,
      },
      {
        format: 'es',
        file: './dist/index.esm.js',
        sourcemap: true,
      }
    ],
    external,
    plugins,
  },
  // React bundle (includes React features)
  {
    input: './src/react.ts',
    output: [
      {
        format: 'umd',
        file: './dist/react.js',
        name: 'mutastateReact',
        sourcemap: true,
        globals: {
          react: 'React',
          'lodash.clone': 'clone'
        }
      },
      {
        format: 'es',
        file: './dist/react.esm.js',
        sourcemap: true,
      }
    ],
    external,
    plugins,
  }
];
