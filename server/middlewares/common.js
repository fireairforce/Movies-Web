// 解析post数据体的body-parser

import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import session from 'koa-session';

export const addBodyParser = app => {
  app.use(bodyParser());
}

export const addLogger = app => {
  app.use(logger());
}
// session的具体用法
export const addSession = app => {
  app.keys = ['zoomdong-test']
  const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: false,
    signed: true,
    rolling: false
  }
  app.use(session(CONFIG,app));
}