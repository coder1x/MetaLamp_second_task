// eslint-disable-next-line import/no-extraneous-dependencies
const TerserPlugin = require('terser-webpack-plugin');
const DP = require('./isDev');

module.exports = {
  optimization: () => {
    const config = {
      runtimeChunk: 'single',
      splitChunks: { // создаються файлы vendors
        chunks: 'all', // создаёт отдельные вендор файлы в которые кидает весь лишний код, при этом наш бандел файл перестаёт много весить.
      },
    };

    if (DP.isProd) { // минимизируем код если собираем в продакшен
      config.minimizer = [
        new TerserPlugin({
          parallel: true,
        }),
      ];
    }
    return config;
  },
};
