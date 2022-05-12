const path = require('path');
const env = require('./isDev');
const paths = require('./paths');

module.exports = {
  filename(ext) {
    let dir = '';

    if (ext === 'css') {
      dir = 'assets/css/';
    } else if (ext === 'js') {
      dir = 'assets/js/';
    }

    if (env.isDev) {
      return `${dir}[name].${ext}`;
    }
    return `${dir}[name].[contenthash].${ext}`;
  },
};
