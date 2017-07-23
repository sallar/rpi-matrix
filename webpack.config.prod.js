const webpack = require('webpack');
const Merge = require('webpack-merge');
const commonConfig = require('./webpack.config');

module.exports = Merge(commonConfig, {
  devtool: false,
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
});
