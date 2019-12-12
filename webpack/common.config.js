const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (mode) => {
  const config = {
    entry: {
      app: [path.resolve(__dirname, '../src/index.js')],
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/',
      sourceMapFilename: '[file].map',
      libraryTarget: 'umd',
      library: '@webex/message-composer',
    },
    devtool: mode === 'development' ? 'cheap-module-source-map' : 'source-map',
    module: {
      rules: [
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          loader: 'file-loader',
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          loader: 'file-loader',
        },
        {
          test: /\.scss$/,
          use: [
            mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, // creates style nodes from JS strings
            'css-loader', // translates CSS into CommonJS
            'resolve-url-loader', // resolves sass urls properly
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sourceMapContents: false,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    node: {
      fs: 'empty',
    },
    plugins: [
      new Dotenv({
        path: path.resolve(__dirname, '../.env'),
      }),
      new CleanWebpackPlugin(['./dist/**/*'], {
        root: path.resolve(__dirname, '..'),
      }),
    ],
  };

  return config;
};
