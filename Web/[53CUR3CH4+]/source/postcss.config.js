const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const normalize = require('postcss-normalize');
const nesting = require('postcss-nesting');
const presetEnv = require('postcss-preset-env');

module.exports = {
    plugins: [normalize, nesting, presetEnv, autoprefixer, cssnano]
};
