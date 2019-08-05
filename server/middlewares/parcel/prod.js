//  在开发环境下对前端资源进行打包
// prod 只提供静态的访问功能
// dev 提供了动态的修改功能而已

const views = require('koa-views');
const serve = require('koa-static');

const {
  resolve
} = require('path');
const r = path => resolve(__dirname, path)


export const prod = async app => {
  // 使用中间件
  app.use(serve(r('../../../dist')));
  // 提供视图层
  app.use(views(r('../../../dist')), {
    extension: 'html'
  })

  app.use(async (ctx) => {
    await ctx.render('index.html')
  })
}