var makeWebpackConfig = require('./make-webpack-config');
var argv = require('yargs').argv;

module.exports = function(config) {
  config.set({
    browsers: argv.chrome ? ['ChromeWithExtension'] : ['PhantomJS'],
    frameworks: ['mocha'],
    files: [
      'test/entry.js'
    ],
    singleRun: !argv.watch,
    autoWatch: argv.watch,
    preprocessors: {
      'test/entry.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots'],
    webpack: makeWebpackConfig('test', argv.grep),
    customLaunchers: {
      ChromeWithExtension: {
        base: 'Chrome',
        flags: argv.extension && ['--load-extension=' + argv.extension]
      }
    }
  });
};
