

const PATHS = require('./paths');
const FL = require('./filename');
const DP = require('./isDev');
const OPT = require('./optimization');

const { merge } = require('webpack-merge');
const devServ = require('./webpack.devServer.js');

let demoM = [];

if (DP.isProd) {
  demoM.push('./index.ts');
} else {
  demoM.push('webpack/hot/dev-server');
  demoM.push('./index.ts');
}

let pubPath;
if (DP.isAbsPath) pubPath = PATHS.public;

module.exports = merge(devServ, {

  target: 'web',
  //devtool: DP.isDev ? 'eval-cheap-module-source-map' : 'source-map', //  (карта для браузеров) 
  //devtool: false,
  devtool: DP.isDev ? 'eval-cheap-module-source-map' : false,

  entry: demoM,

  context: PATHS.src, // корень исходников
  mode: DP.isDev ? 'development' : 'production',   // собираем проект в режиме разработки
  output: {
    filename: FL.filename('js'),
    path: PATHS.dist, // каталог в который будет выгружаться сборка.
    publicPath: pubPath,
  },


  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],  // когда мы прописываем тут расширения то при импуте в index.js их можно не прописывать 
    alias: {
      '@plugins': `${PATHS.src}\\plugins`,
      '@styles': `${PATHS.src}${PATHS.assets}styles`,
      '@typescript': `${PATHS.src}${PATHS.assets}ts`,
      '@img': `${PATHS.src}${PATHS.assets}images`,
      '@pag': `${PATHS.src}\\pages`,
      '@com': `${PATHS.src}\\components`,
      '@': PATHS.src,
      comp: PATHS.components,
    }
  },


  optimization: OPT.optimization(), // минификация и оптимизация файлов на выходе  (если это Продакшен)

});