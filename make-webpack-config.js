var webpack = require('webpack');
var path = require('path');

function resolve(filePath) {
  return path.resolve(__dirname, filePath);
}

module.exports = function(build, grep) {
  var bowerPath = path.resolve(__dirname, 'bower_components');
  var npmPath = path.resolve(__dirname, 'node_modules');

  var autoprefixerConfig = {
    browsers: ['Firefox > 27', 'Chrome > 20', 'Explorer > 9', 'Safari > 6', 'Opera > 11.5', 'iOS > 6.1'],
  };
  var sassConfig = {
    outputStyle: 'compressed',
    includePaths: [bowerPath, npmPath],
  };
  var jsxExcludes = [/node_modules/, /bower_components/];

  var config = {
    resolve: {
      extensions: ['', '.js', '.jsx'],
      root: [path.resolve(__dirname, 'bower_components')],
    },
    plugins: [
      new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
      ),
    ],
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: 'style!css!autoprefixer?' + JSON.stringify(autoprefixerConfig) + '!sass?' + JSON.stringify(sassConfig),
        },
        {
          test: /\.css$/,
          loader: 'style!css!autoprefixer?' + JSON.stringify(autoprefixerConfig),
        },
        { test: /\.png$/, loader: 'file' },
        { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=application/font-woff' },
        { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=application/font-woff' },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=application/octet-stream' },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=image/svg+xml' },
        { test: /\.json$/, loader: 'json' },
      ],
    },
  };

  switch (build) {
  case 'test':
    config.devtool = 'inline-source-map';
    config.cache = true;
    config.output = {
      path: resolve('./dist/'),
      filename: 'test.js',
      publicPath: '/dist/',
    };
    config.module.loaders.push({
      test: /\.jsx?$/,
      loaders: ['babel-loader?stage=0'],
      exclude: jsxExcludes,
    });
    config.plugins.push(
      new webpack.DefinePlugin({
        // This allows to dynamically define what test files we want to run
        // See karma.conf.js
        GREP: grep || '/\\.spec\\.jsx?$/',
      }),
      new webpack.ProvidePlugin({
        expect: 'expect',
      })
    );
    break;
  case 'dev':
    // This is not as dirty as it looks. It just generates source maps without being crazy slow.
    // Source map lines will be slightly offset, use config.devtool = 'source-map'; to generate cleaner source maps.
    config.devtool = 'eval';

    config.cache = true;
    config.entry = [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './example/index.jsx',
    ];
    config.output = {
      path: resolve('./dist/'),
      filename: 'test.js',
      publicPath: '/dist/',
    };
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    );
    config.module.loaders.push({
      test: /\.jsx?$/,
      loaders: ['react-hot-loader', 'babel-loader?stage=0', 'eslint-loader'],
      exclude: jsxExcludes,
    });
    break;
  case 'dist':
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin()
    );
  case 'optimize':
    config.entry = './src/index';
    config.output = {
      path: resolve('./dist/'),
      filename: 'index.js',
      publicPath: '/dist/',
      libraryTarget: 'amd',
    };
    config.plugins.push(
      new webpack.optimize.DedupePlugin()
    );
    config.module.loaders.push({
      test: /\.jsx?$/,
      loaders: ['babel-loader?stage=0'],
      exclude: jsxExcludes,
    });
    break;
  }

  return config;
};
