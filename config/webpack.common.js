const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require('webpack-merge');
const paths = require('./paths');
const fileName = require('./filename');
const env = require('./isDev');
const optimization = require('./optimization');
// eslint-disable-next-line import/extensions
const devServer = require('./webpack.devServer.js');

const points = [];

if (env.isProd) {
  points.push('./index.js');
} else {
  points.push('webpack/hot/dev-server');
  points.push('./index.js');
}

let pubPath;
if (env.isAbsPath) pubPath = paths.public;

module.exports = merge(devServer, {
  target: 'web',
  // devtool: DP.isDev ? 'eval-cheap-module-source-map' : 'source-map', //  (карта для браузеров)
  // devtool: false,
  devtool: env.isDev ? 'eval-cheap-module-source-map' : false,

  entry: points,

  context: paths.src, // корень исходников
  mode: env.isDev ? 'development' : 'production',
  output: {
    filename: fileName.filename('js'),
    path: paths.dist, // каталог в который будет выгружаться сборка.
    publicPath: pubPath,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
    alias: {
      '@plugins': path.join(paths.src, 'plugins'),
      '@styles': path.join(paths.src, paths.assets, 'styles'),
      '@typescript': path.join(paths.src, paths.assets, 'ts'),
      '@img': path.join(paths.src, 'images'),
      '@pag': path.join(paths.src, 'pages'),
      '@com': path.join(paths.src, 'components'),
      '@': paths.src,
      comp: paths.components,
    },
  },

  optimization: optimization.optimization(), // минификация и оптимизация файлов на выходе  (если это Продакшен)
});
