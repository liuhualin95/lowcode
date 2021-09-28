const path = require('path');
module.exports = {
  productionSourceMap: false,
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  devServer: {
    host: '0.0.0.0',
    port: '8081',
    disableHostCheck: true,
    hot: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
};
