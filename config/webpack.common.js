const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require('webpack-merge');
const PATHS = require('./paths');
const FL = require('./filename');
const DP = require('./isDev');
const OPT = require('./optimization');
// eslint-disable-next-line import/extensions
const devServ = require('./webpack.devServer.js');

const demoM = [];

if (DP.isProd) {
  demoM.push('./index.js');
} else {
  demoM.push('webpack/hot/dev-server');
  demoM.push('./index.js');
}

let pubPath;
if (DP.isAbsPath) pubPath = PATHS.public;

module.exports = merge(devServ, {
  target: 'web',
  // devtool: DP.isDev ? 'eval-cheap-module-source-map' : 'source-map', //  (карта для браузеров)
  // devtool: false,
  devtool: DP.isDev ? 'eval-cheap-module-source-map' : false,

  entry: demoM,

  context: PATHS.src, // корень исходников
  mode: DP.isDev ? 'development' : 'production',
  output: {
    filename: FL.filename('js'),
    path: PATHS.dist, // каталог в который будет выгружаться сборка.
    publicPath: pubPath,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
    alias: {
      '@plugins': path.join(PATHS.src, 'plugins'),
      '@styles': path.join(PATHS.src, PATHS.assets, 'styles'),
      '@typescript': path.join(PATHS.src, PATHS.assets, 'ts'),
      '@img': path.join(PATHS.src, 'images'),
      '@pag': path.join(PATHS.src, 'pages'),
      '@com': path.join(PATHS.src, 'components'),
      '@': PATHS.src,
      comp: PATHS.components,
    },
  },

  optimization: OPT.optimization(), // минификация и оптимизация файлов на выходе  (если это Продакшен)
});
