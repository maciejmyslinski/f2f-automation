/* eslint-disable import/no-extraneous-dependencies */
const npsUtils = require('nps-utils');

const { series, rimraf } = npsUtils;

module.exports = {
  scripts: {
    build: {
      description: 'delete the build directory and run all builds',
      default: series(
        rimraf('build'),
        'rollup --config',
        'pbcopy < build/index.js'
      ),
    },
    prettier: {
      description: 'run prettier on files',
      default: 'prettier-eslint "src/**/*.js" --write --list-different',
    },
  },
};
