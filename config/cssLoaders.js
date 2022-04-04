// eslint-disable-next-line import/no-extraneous-dependencies
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  cssLoaders: (extra) => {
    const loaders = [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: false,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              [
                'autoprefixer',
                {
                  // Options
                },
                'css-mqpacker',
                {
                  // Options
                },
                'cssnano',
                {
                  preset: [
                    'default', {
                      discardComments: {
                        removeAll: true,
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      },
    ];

    if (extra) {
      loaders.push(extra);
    }

    return loaders;
  },
};
