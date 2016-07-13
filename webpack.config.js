const webpack = require('webpack');
const path = require('path');

const config = {
  devtool: 'eval',
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    alias: {
      'mapbox-gl/css': path.join(__dirname, 'node_modules/mapbox-gl/dist/mapbox-gl.css'),
      'mapbox-gl/js': path.join(__dirname, 'node_modules/mapbox-gl/dist/mapbox-gl-dev.js'),
    },
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/,
      },
      {
        test: /\.sass$/,
        loaders: ['style', 'css', 'sass'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
};

module.exports = config;
