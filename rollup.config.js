import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.js',
  output: {
    file: `build/index.js`,
    format: 'es',
  },
  treeshake: false,
  plugins: [
    commonjs(),
    resolve(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-external-helpers',
      ],
      presets: [
        [
          '@babel/preset-env',
          { modules: false, targets: { browsers: ['ie >= 6'] } },
        ],
      ],
    }),
    copy({
      'src/email-template.html': 'build/email-template.html',
      verbose: true,
    }),
  ],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
  },
};
