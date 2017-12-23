import { readFileSync } from 'fs';
import babel from 'rollup-plugin-babel';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: [
    'minimatch',
    'slugify',
    'date-fns',
    'path',
    'deep-equal'
  ],
  output: [
    {
      format: 'es',
      file: pkg.module
    },
    {
      format: 'cjs',
      file: pkg.main
    }
  ]
};