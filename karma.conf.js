var webpack = require('webpack');
var makeWebpackConfig = require('./make-webpack-config');
var argv = require('yargs').argv;

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    // singleRun: true,
    frameworks: ['mocha'],
    files: [
      'test/entry.js'
    ],
    autoWatch: true,
    preprocessors: {
      'test/entry.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots'],
    webpack: makeWebpackConfig('test', argv.grep)
  });
};
