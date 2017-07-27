const webpack = require('webpack');
const Merge = require('webpack-merge');
const WrapperPlugin = require('wrapper-webpack-plugin');
const commonConfig = require('./webpack.config');

module.exports = Merge(commonConfig, {
  devtool: false,
  target: 'node',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new WrapperPlugin({
      test: /^rpi.js$/,
      header: '#!/usr/bin/env node\n'
    })
  ]
});
