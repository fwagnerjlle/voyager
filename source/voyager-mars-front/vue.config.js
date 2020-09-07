'use strict';

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  transpileDependencies: [
    'vuetify',
    '@adonisjs/websocket-client/index',
  ],
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'test') {
      config.devtool('#eval');
      config.module.rule('js')
        .test(/\.js$/)
        .use('istanbul-instrumenter-loader')
        .loader('istanbul-instrumenter-loader')
        .before('babel-loader')
        .options({
          esModules: true,
        });
    }
  },
};
