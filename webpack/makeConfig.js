'use strict';
const Visualizer = require('webpack-visualizer-plugin');
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');

const DEFAULTS = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  baseDir: path.join(__dirname, '..'),
};

function makePlugins(options) {
  const isDevelopment = options.isDevelopment;

  let plugins = [
    new Visualizer({
      filename: './statistics.html'
    }),
  ];

  if (!isDevelopment) {
    plugins = plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        output: {
          comments: false,
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ]);
  }

  return plugins;
}

function makeConfig(options) {
  if (!options) options = {};
  _.defaults(options, DEFAULTS);

  const isDevelopment = options.isDevelopment;

  return {
    devtool: isDevelopment ? 'cheap-eval-source-map' : 'source-map',
    entry: {
      sc2: path.join(options.baseDir, 'src/browser.js')
    },
    output: {
      path: path.join(options.baseDir, 'dist'),
      filename: '[name].min.js',
    },
    plugins: makePlugins(options),
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        }
      ],
    },
  };
}

if (!module.parent) {
  console.log(makeConfig({
    isDevelopment: process.env.NODE_ENV !== 'production',
  }));
}

module.exports = makeConfig;
exports.DEFAULTS = DEFAULTS;
