var webpack = require('webpack');
var path = require('path');

var browsers = ['Firefox > 27', 'Chrome > 20', 'Explorer > 9', 'Safari > 6', 'Opera > 11.5', 'iOS > 6.1'];

var config = {
  entry: './src/index',
  output: {
    path: __dirname + '/dist/',
    filename: 'index.js',
    publicPath: '/dist/',
    libraryTarget: 'amd'
  },
  target: 'web',
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    noParse: [
      // Only ignore the datatables-boostrap js file, otherwise webpack will try to parse requires
      /vendors\/datatables-bootstrap.*\.js/
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['jsx-loader', 'babel-loader?experimental'],
        exclude: [/node_modules/, /vendors/]
      },
      {
        test: /\.scss$/,
        loader: "style!css!autoprefixer?" + JSON.stringify({browsers: browsers}) + "!sass?outputStyle=expanded&" +
          "includePaths[]=" +
            (path.resolve(__dirname, "./bower_components")) + "&" +
          "includePaths[]=" +
            (path.resolve(__dirname, "./node_modules"))
      },
      {
        test: /\.css$/,
        loader: "style!css!autoprefixer?" + JSON.stringify({browsers: browsers})
      },
      { test: /\.png$/,                         loader: "file" },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,     loader: "url?limit=10000&minetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,     loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,     loader: "url?limit=10000&minetype=image/svg+xml" }
    ]
  }
};

module.exports = config;