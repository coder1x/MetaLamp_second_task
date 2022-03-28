const DP = require('./isDev');
const CL = require('./cssLoaders');
const JL = require('./jsLoaders');
const PATHS = require('./paths');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: CL.cssLoaders(),
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: DP.isDev  // минифицировать или нет в зависемости от типа зборки. 
        }
      },
      {
        test: /\.s[ac]ss$/,
        use: CL.cssLoaders('sass-loader')
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        loader: 'file-loader',
        options: {
          outputPath: path.join(PATHS.assets, 'fonts/'),
          publicPath: '/assets/fonts/',
        },
      },
      {
        test: /\.(js)$/,
        exclude: '/node_modules/',  // игнорируем эту папку. что бы не обрабатывать файлы от туда. 
        use: JL.jsLoaders('js')
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: '/node_modules/',
        use: JL.jsLoaders(),
      },
      {
        test: /\.(png|jpg|svg|gif|webp|avif)$/,
        loader: 'file-loader',
        options: {
          outputPath: path.join(PATHS.assets, 'images/'),
          publicPath: '/assets/images/',
        },
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      },
    ],
  },
};