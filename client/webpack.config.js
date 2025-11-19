const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { presets } = require('./babel.config.js')
const config = require('./config/config.js')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build')
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: './build',
    hot: true
  },
  watchOptions: {
    poll: 1000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      title: config.htmlMetadata.title,
      favicon: config.htmlMetadata.icon
    }),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          config.env.mode === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|svg)$/i,
        type: 'asset/resource'
      }
    ]
  }
}
