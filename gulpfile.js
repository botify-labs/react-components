var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var shell = require('gulp-shell');
var bump = require('gulp-bump');
var eslint = require('gulp-eslint');

var fs = require('fs');
var chalk = require('chalk');
var del = require('del');
var strftime = require('strftime');
var argv = require('yargs').argv;

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var dependencyTree = require('webpack-dependency-tree');

var makeConfig = require('./make-webpack-config');
var devConfig = makeConfig('dev');
var optiConfig = makeConfig('optimize');
var config = makeConfig('dist');

gulp.task('lib', ['clean:lib'], function(done) {
  return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
    .pipe(sourcemaps.init())
    .pipe(babel({experimental: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib'));
});

gulp.task('styles', ['clean:lib'], function(done) {
  return gulp.src('src/**/*.scss')
    .pipe(gulp.dest('lib'));
});

gulp.task('dist', ['clean:dist'], function(done) {
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

gulp.task('clean:lib', function(done) {
  del(['lib/'], done);
});

gulp.task('clean:dist', function(done) {
  del(['dist/'], done);
});

gulp.task('bump-version', function() {
  return gulp.src(['package.json', 'bower.json'])
    .pipe(bump(argv))
    .pipe(gulp.dest('./'));
});

gulp.task('release', ['lib', 'styles', 'dist', 'bump-version'], function() {
  return gulp.src('')
    .pipe(shell([
      'git add -u', // Add modified files (package.json, bower.json, ...)
      'git add -A lib/ dist/', // Add all changes in lib/ and dist
      'git commit -a -m "Release <%= pkg.version %>"',
      'git tag -a <%= pkg.version %> -m "Release <%= date %> <%= pkg.version %>"',
      'git push origin HEAD',
      'git push origin <%= pkg.version %>'
    ], {
      templateData: {
        pkg: require('./package.json'),
        date: strftime('%Y/%m/%d', new Date())
      }
    }));
});

gulp.task('dep-tree', function(done) {
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

gulp.task('stats', function(done) {
  webpack(optiConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    var jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) {
      throw new gutil.PluginError('webpack', jsonStats.errors.join('\n'));
    }
    fs.writeFile('stats.json', JSON.stringify(jsonStats), done);
  });
});

gulp.task('server', function() {
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

gulp.task('lint', function() {
  var exclude = ['!node_modules/**', '!bower_components/**', '!lib/**', '!dist/**'];
  return gulp.src(exclude.concat(['**/*.js', '**/*.jsx']))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});
