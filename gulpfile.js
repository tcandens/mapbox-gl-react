const gulp = require('gulp');
const path = require('path');
const gutil = require('gulp-util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');
const Karma = require('karma');

gulp.task('examples', () => {
  const config = Object.assign({}, webpackConfig, {
    devtool: 'eval',
    entry: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      './examples/index.jsx',
    ],
  });
  new WebpackDevServer(webpack(config), {
    publicPath: '/__build__/',
    contentBase: './examples',
    hot: true,
    stats: {
      colors: true,
    },
  }).listen(3000, () => {
    gutil.log('Examples served at localhost:3000');
  });
});

gulp.task('test', (done) => {
  new Karma.Server({
    configFile: path.join(__dirname, 'karma.conf.js'),
    autoWatch: false,
    singleRun: true,
  }, () => {
    done();
  }).start();
});

gulp.task('tdd', (done) => {
  new Karma.Server({
    configFile: path.join(__dirname, 'karma.conf.js'),
    reporters: ['mocha'],
  }, done).start();
});

gulp.task('default', ['examples']);
