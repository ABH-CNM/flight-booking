var path = require('path');

module.exports = {
  entry: './components/app.jsx',
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};