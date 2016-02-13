var path = require('path');
var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

module.exports = {
  entry: [
    './demo/index.js'
  ],
  output: {
      publicPath: '/',
      filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.join(__dirname, 'demo'),
          path.join(__dirname, 'src')
        ],
        loader: 'babel-loader',
        query: {
          presets: ["stage-0", "react", "es2015"],
          plugins: ["dev"]
        }
      }
    ]
  },
  debug: true
};
