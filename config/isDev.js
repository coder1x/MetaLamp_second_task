

module.exports = {
  isDev: process.env.NODE_ENV === 'development',
  isProd: !this.isDev
};