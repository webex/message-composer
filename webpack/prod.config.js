const path = require('path');

const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./common.config.js');

const mode = 'production';

module.exports = merge(common(mode), {
  mode,
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
  },
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM',
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
  ],
});
