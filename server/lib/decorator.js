const Router = require('koa-router');
const glob = require('glob');
const {
  resolve
} = require('path');
const _ = require('lodash');

// 通过lodash这个库来判断是不是数组，如果是数组就返回，不是数组就封装成数组
const isArray = c => _.isArray(c) ? c : [c]

// Symbol一旦被创建就不能被修改，并且值也不能改变
const symbolPrefix = Symbol('prefix');
const routerMap = new Map();

export class Route {
  constructor(app, apiPath) {
    this.app = app;
    this.apiPath = apiPath;
    this.router = new Router();
  }
  // 然后对routes文件夹下面的文件进行一个加载
  init() {
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)
    // 枚举一下这个集合
    for (let [conf, controller] of routerMap) {
      // 首先拿到里面所有的 controllers
      const controllers = isArray(controller);
      const prefixPath = conf.target[symbolPrefix];
      // 如果存在prefixPath就对路由进行一层拼接
        if (prefixPath) {
          prefixPath = normalizePath(prefixPath);
          }
        const routerPath = prefixPath + conf.path;
        this.router[conf.method](routerPath, ...controllers);
      // 使用完成之后封装一下所有请求的方法
    }
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }
}

// startsWith是字符串的一个判断方法
const normalizePath = path => path.startsWith('/') ? path : `/${path}`

// 使用router完成对路由的装饰
const router = conf => (target, key) => {
  conf.path = normalizePath(conf.path)
  routerMap.set({
    target: target,
    ...conf
    // 把method 和　path 平铺开
  }, target[key])
}

export const controller = path => target => (target.prototype[symbolPrefix] = path)

export const get = path => router({
  method: 'get',
  path: path
})
export const post = path => router({
  method: 'post',
  path: path
})
export const put = path => router({
  method: 'put',
  path: path
})

export const del = path => router({
  method: 'del',
  path: path
})

// router上面可以装饰use来使用中间件
export const use = path => router({
  method: 'use',
  path: path
})

export const all = path => router({
  method: 'all',
  path: path
})