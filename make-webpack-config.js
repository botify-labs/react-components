var webpack = require('webpack');
var path = require('path');

var browsers = ['Firefox > 27', 'Chrome > 20', 'Explorer > 9', 'Safari > 6', 'Opera > 11.5', 'iOS > 6.1'];

var config = {
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: [path.resolve(__dirname, 'bower_components')]
  },
  module: {
    noParse: [/datatables-plugins\/.*\.js$/],
    loaders: [
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

var JSX_EXCLUDES = [/node_modules/, /bower_components/];

module.exports = function(dev) {
  if (dev) {
    // This is not as dirty as it looks. It just generates source maps without being crazy slow.
    // Source map lines will be slightly offset, use config.devtool = 'source-map'; to generate cleaner source maps.
    config.devtool = 'eval';

    config.cache = true;
    config.entry = [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './src/test'
    ];
    config.output = {
      path: __dirname + '/dist/',
      filename: 'test.js',
      publicPath: '/dist/'
    };
    config.plugins = [
      new webpack.HotModuleReplacementPlugin(),
    ];
    config.module.loaders.push({
      test: /\.jsx?$/,
      loaders: ['jsx-loader', 'babel-loader?experimental'],
      exclude: JSX_EXCLUDES
    });
  } else {
    config.entry = './src/index';
    config.output = {
      path: __dirname + '/dist/',
      filename: 'index.js',
      publicPath: '/dist/',
      libraryTarget: 'amd'
    };
    config.module.loaders.push({
      test: /\.jsx?$/,
      loaders: ['jsx-loader', 'babel-loader?experimental'],
      exclude: JSX_EXCLUDES
    });
  }

  return config;
};
