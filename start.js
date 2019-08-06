// 来注册一下
require('babel-core/register')();
require('babel-polyfill');
require('./server/index');

console.log('env: ', process.env.NODE_ENV);