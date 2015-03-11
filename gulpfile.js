var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

var chalk = require('chalk');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var dependencyTree = require('webpack-dependency-tree');

var makeConfig = require('./make-webpack-config');
var devConfig = makeConfig('dev');
var optiConfig = makeConfig('optimize');
var config = makeConfig('dist');

var DEBUG = process.env.NODE_ENV !== 'production';

gulp.task('lib', function(done) {
  return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
    .pipe(sourcemaps.init())
    .pipe(babel({experimental: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib'));
});

gulp.task('webpack-dist', function(done) {
  webpack(config, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    var jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) {
      throw new gutil.PluginError('webpack', jsonStats.errors.join('\n'));
    }
    if (jsonStats.warnings.length > 0) {
      gutil.log(chalk.yellow(jsonStats.warnings.join('\n')));
    }
    done();
  });
});

gulp.task('webpack-tree', function(done) {
  webpack(optiConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    var jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) {
      throw new gutil.PluginError('webpack', jsonStats.errors.join('\n'));
    }
    if (jsonStats.warnings.length > 0) {
      gutil.log(chalk.yellow(jsonStats.warnings.join('\n')));
    }
    gutil.log(dependencyTree.treeToString(dependencyTree.fromStats(stats), {pretty: true}));

    done();
  });
});

gulp.task('webpack-server', function() {
  new WebpackDevServer(webpack(devConfig), {
    publicPath: devConfig.output.publicPath,
    hot: true
  }).listen(3000, 'localhost', function (err, result) {
    if (err) {
      console.log(err);
    }

    console.log('Listening at localhost:3000');
  });
});
