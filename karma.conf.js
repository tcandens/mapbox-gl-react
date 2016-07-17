const path = require('path');

module.exports = (config) => {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['mocha'],
    files: [
      'tests.context.js',
    ],
    client: {
      captureConsole: true,
      mocha: {
        bail: false,
      },
    },
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
        extensions: ['', '.js', '.jsx'],
      },
      module: {
        preLoaders: [
          {
            test: /\.jsx?$/,
            loaders: ['babel'],
            include: path.join(__dirname, 'src'),
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
            loader: 'null',
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
    logLevel: config.LOG_ERROR,
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
