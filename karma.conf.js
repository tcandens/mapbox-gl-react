const path = require('path');

module.exports = (config) => {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['mocha'],
    files: [
      'tests.context.js',
    ],
    preprocessors: {
      'tests.context.js': ['webpack', 'sourcemap'],
    },
    webpack: {
      devtool: 'inline-source-map',
      babel: {
        presets: ['es2015', 'react', 'stage-0'],
      },
      isparta: {
        embedSource: true,
        noAutoWrap: true,
        babel: {
          presets: ['es2015', 'react', 'stage-0'],
        },
      },
      resolve: {
        alias: {
          'mapbox-gl/css': path.join(__dirname, 'node_modules/mapbox-gl/dist/mapbox-gl.css'),
          'mapbox-gl/js': path.join(__dirname, 'node_modules/mapbox-gl/dist/mapbox-gl-dev.js'),
        },
        extensions: ['', '.js', '.jsx'],
      },
      module: {
        preLoaders: [
          {
            test: /\.jsx?$/,
            loaders: ['babel'],
            exclude: /node_modules/,
          },
          {
            test: /\.jsx?$/,
            loaders: ['isparta'],
            exclude: /\/node_modules\//,
            include: path.resolve('src'),
          },
          {
            test: /\.json$/,
            loader: 'json',
          },
          {
            test: /\.css$/,
            loaders: ['style', 'css'],
          },
        ],
      },
      externals: {
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
      },
      node: {
        fs: 'empty',
      },
    },
    webpackServer: {
      quiet: true,
    },
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text', subdir: 'text' },
      ],
    },
  });
};
