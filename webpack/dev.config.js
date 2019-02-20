const path = require('path');

const glob = require('glob');
const merge = require('webpack-merge');
const WriteFilePlugin = require('write-file-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const common = require('./common.config.js');

module.exports = merge(common, {
  devtool: 'source-map',
  devServer: {
    stats: 'minimal',
    // Make all 404 routes load index.html
    historyApiFallback: true,
    // uncomment the next line to server via https; when you need to use the
    // ssh/hosts hack in README.md to pretend to be web.ciscospark.com
    // https: true,
    disableHostCheck: true,
    port: 4000
  },
  mode: 'development',
  resolve: {
    symlinks: false,
    alias:
      process.env.SDK_DIR &&
      glob
        .sync('**/package.json', {
          cwd: path.resolve(process.env.SDK_DIR, './packages/node_modules')
        })
        .map((p) => path.dirname(p))
        .reduce((alias, packageName) => {
          // Substitute ./node_modules with a locally built sdk
          alias[`${packageName}`] = path.resolve(process.env.SDK_DIR, `./packages/node_modules/${packageName}`);

          return alias;
        }, {})
  },
  plugins: [
    new Dotenv({
      path: '.env',
      systemvars: true
    }),
    new WriteFilePlugin()
  ],
  watch: true
});
