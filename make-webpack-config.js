module.exports = function(build) {
  var webpack = require('webpack');
  var path = require('path');

  var bower_path = path.resolve(__dirname, 'bower_components');
  var npm_path = path.resolve(__dirname, 'node_modules');

  var browsers = ['Firefox > 27', 'Chrome > 20', 'Explorer > 9', 'Safari > 6', 'Opera > 11.5', 'iOS > 6.1'];
  var autoprefixer_config = JSON.stringify({browsers: browsers});
  var jsx_excludes = [/node_modules/, /bower_components/];

  var config = {
    resolve: {
      extensions: ['', '.js', '.jsx'],
      root: [path.resolve(__dirname, 'bower_components')]
    },
    plugins: [
      new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
      )
    ],
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: 'style!css!autoprefixer?' + autoprefixer_config + '!sass?outputStyle=expanded&' +
            'includePaths[]=' + bower_path + '&' + 'includePaths[]=' + npm_path
        },
        {
          test: /\.css$/,
          loader: 'style!css!autoprefixer?' + autoprefixer_config
        },
        { test: /\.png$/,                         loader: 'file' },
        { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=10000&minetype=application/font-woff' },
        { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url?limit=10000&minetype=application/font-woff' },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,     loader: 'url?limit=10000&minetype=application/octet-stream' },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,     loader: 'file' },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,     loader: 'url?limit=10000&minetype=image/svg+xml' },
        { test: /\.json$/,                        loader: 'json' }
      ]
    }
  };

  switch (build) {
  case 'dev':
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
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    );
    config.module.loaders.push({
      test: /\.jsx?$/,
      loaders: ['react-hot-loader', 'babel-loader?experimental'],
      exclude: jsx_excludes
    });
    break;
  case 'dist':
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin()
    );
  case 'optimize':
    config.entry = './src/index';
    config.output = {
      path: __dirname + '/dist/',
      filename: 'index.js',
      publicPath: '/dist/',
      libraryTarget: 'amd'
    };
    config.plugins.push(
      new webpack.optimize.DedupePlugin()
    );
    config.module.loaders.push({
      test: /\.jsx?$/,
      loaders: ['babel-loader?experimental'],
      exclude: jsx_excludes
    });
    break;
  }

  return config;
};
