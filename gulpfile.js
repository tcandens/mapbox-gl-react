const gulp = require('gulp');
const path = require('path');
const gutil = require('gulp-util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');
const Karma = require('karma');
const merge = require('webpack-merge');
const babel = require('gulp-babel');
const env = require('gulp-env');
const del = require('del');

gulp.task('examples', () => {
  const config = merge(webpackConfig, {
    devtool: 'cheap-module-eval-source-map',
    output: {
      path: '/__build__',
      publicPath: '/__build__/',
    },
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
    historyApiFallback: true,
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

gulp.task('build:es', ['clean:es'], () => {
  env({
    BABEL_ENV: 'es',
  });

  return gulp.src('src/**/*')
    .pipe(babel())
    .pipe(gulp.dest('es'));
});

gulp.task('build:cjs', ['clean:cjs'], () => {
  env({
    BABEL_ENV: 'commonjs',
  });

  return gulp.src('src/**/*')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('clean:cjs', () => del('lib'));
gulp.task('clean:es', () => del('es'));

gulp.task('clean', ['clean:cjs']);
gulp.task('build', ['build:cjs']);

gulp.task('default', ['examples']);
