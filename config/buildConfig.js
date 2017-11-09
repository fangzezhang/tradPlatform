var path = require('path')
var webpack = require('webpack')

var loader = require('./loader.js')
var dev = require('./dev.js')
var plugins = require('./plugins.js')


module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    // publicPath: '/dist/',
    filename: '[name]-[hash].js'
  },
  module: loader,
  resolve: {
    extensions: ['.js', '.vue', '.less', '.scss', '.css','.less'], //后缀名自动补全
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer:dev,
  performance: {
    hints: false
  },
  devtool: process.env.NODE_ENV == 'production' ? '#nosources-source-map' : '#eval-source-map',
  plugins:plugins,
};