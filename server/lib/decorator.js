const Router = require('koa-router');
const glob = require('glob');
const {
  resolve
} = require('path');
const _ = require('lodash');
const R = require('ramda');

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
    // 使用use这个api来调用中间件
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
  method: 'delete',
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

const decorate = (args,middleware) => {
  let [ target,key,descriptor ] = args;

  target[key] = isArray(target[key]);
  target[key].unshift(middleware);

  return descriptor;
}
// convert相当于一个装饰器
const convert = middleware => (...args) => decorate(args,middleware)


export const auth = convert (async (ctx,next)=>{
  // console.log(ctx.session.user);
  if(!ctx.session.user){
    return(
      ctx.body = {
        success:false,
        code: 401,
        error:'登录信息失效，请重新登录'
      }
    )
  }
  // 执行完成之后，调用await
  await next();
})

// 判断它是否是管理员
export const admin = roleExpected => convert (async (ctx,next)=>{
  // 先用 session 拿到 role
  const { role } = ctx.session.user;

  // 可以根据权限组来判断是否在权限组里面
  const rules = {
    admin: [1,4,5],
    superAdmin: [1,2,3,4] 
  }
//  如果没有role或者role不为admin
// 期待的管理员值(其实那边传过来的就是'admin')
  if(!role || role !== roleExpected){
    return(
      ctx.body = {
        success:false,
        code: 401,
        error:'你没有权限，来错地方了'
      }
    )
  }
  await next();
})

// 加一个字段的校验，来判断前端传递过来的字段有没有缺失

export const required = rules => convert(async (ctx,next) => {
  let errors = [];

  R.forEachObjIndexed(
    (val, key) => {
      errors = errors.concat(
        R.filter(
          name => !R.has(name, ctx.request[key])
        )(val)
      )
    }
  )(rules)
  
  //  console.log(errors);
  if(errors.length){
    ctx.body = {
      success: false,
      code : 412,
      err: `${errors.join(',')} is required`,
    }
  }
  await next();
})