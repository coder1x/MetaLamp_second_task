// в зависемости от типа файла CSS или JS ложим в соответсвующий каталог в деректории dist/assets/
const path = require('path');
const DP = require('./isDev');
const PATHS = require('./paths');

module.exports = {
  filename(ext) {
    let dir = '';

    if (ext === 'css') {
      dir = path.join('.', PATHS.assets, 'css/');
    } else if (ext === 'js') {
      dir = path.join('.', PATHS.assets, 'js/');
    }

    return DP.isDev ? `${dir}[name].${ext}` : `${dir}[name].[hash].${ext}`;
  },
};
