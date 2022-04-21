// в зависемости от типа файла CSS или JS ложим в соответсвующий каталог в деректории dist/assets/
const path = require('path');
const env = require('./isDev');
const paths = require('./paths');

module.exports = {
  filename(ext) {
    let dir = '';

    if (ext === 'css') {
      dir = path.join('.', paths.assets, 'css/');
    } else if (ext === 'js') {
      dir = path.join('.', paths.assets, 'js/');
    }

    return env.isDev ? `${dir}[name].${ext}` : `${dir}[name].[hash].${ext}`;
  },
};
