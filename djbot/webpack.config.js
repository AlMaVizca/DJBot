var path = require('path');



module.exports = {
  cache: true,
  entry: [
    './static/scripts/src/main.js'
  ],
  output: {
    path: path.join(__dirname, 'static', 'scripts', 'build'),
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  plugins: []
};
