const env = require('./isDev');

module.exports = {
  jsLoaders: (ext = 'ts') => {
    let loaders = null;
    if (ext === 'js') {
      loaders = [
        {
          loader: 'babel-loader',
        }];
    } else {
      loaders = [
        {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json',
          },
        },
      ];
    }

    if (env.isDev) {
      loaders.push('eslint-loader');
    }

    return loaders;
  },
};
