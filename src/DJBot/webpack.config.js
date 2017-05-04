var path = require('path');



module.exports = {
  cache: true,
  entry: [
    './ReactJS/index.js'
  ],
  output: {
    path: path.join(__dirname, 'static', 'scripts'),
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  plugins: []
};
