const path = require('path');

const glob = require('glob');
const merge = require('webpack-merge');
const WriteFilePlugin = require('write-file-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const common = require('./common.config.js');

const mode = 'development';

module.exports = merge(common(mode), {
  devtool: 'source-map',
  devServer: {
    stats: 'minimal',
    // Make all 404 routes load index.html
    historyApiFallback: true,
    // uncomment the next line to server via https; when you need to use the
    // ssh/hosts hack in README.md to pretend to be web.ciscospark.com
    // https: true,
    disableHostCheck: true,
    port: 4001,
  },
  mode,
  resolve: {
    symlinks: false,
  },
  plugins: [
    new Dotenv({
      path: '.env',
      systemvars: true,
    }),
    new WriteFilePlugin(),
  ],
  watch: true,
});
