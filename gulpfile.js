var gulp = require('gulp');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var makeConfig = require('./make-webpack-config');
var devConfig = makeConfig('dev');
var config = makeConfig('dist');

var DEBUG = process.env.NODE_ENV !== 'production';

gulp.task('webpack', function(done) {
  webpack(config, done);
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

gulp.task('dev', ['webpack-server']);

gulp.task('default', ['webpack']);
