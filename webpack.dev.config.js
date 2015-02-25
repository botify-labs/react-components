var webpack = require('webpack');
var path = require('path');

var browsers = ['Firefox > 27', 'Chrome > 20', 'Explorer > 9', 'Safari > 6', 'Opera > 11.5', 'iOS > 6.1'];

var config = {
  // This is not as dirty as it looks. It just generates source maps without being crazy slow.
  // Source map lines will be slightly offset, use config.devtool = 'source-map'; to generate cleaner source maps.
  devtool: 'eval',
  cache: true,
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/test'
  ],
  output: {
    path: __dirname + '/dist/',
    filename: 'test.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
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
        loaders: ['react-hot-loader', 'babel-loader?experimental'],
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