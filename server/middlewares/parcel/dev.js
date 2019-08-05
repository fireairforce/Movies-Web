//  在开发环境下对前端资源进行打包

const Bundler = require('parcel-bundler');
const views = require('koa-views');
const serve = require('koa-static');

const { resolve } = require('path');
const r = path => resolve(__dirname,path)
const bundler = new Bundler(r('../../../src/index.html'),{
  publicUrl:'/',
  watch:true,
})

export const dev = async app => {
  await bundler.bundle();
  // 使用中间件
  app.use(serve(r('../../../dist')));
  // 提供视图层
  app.use(views(r('../../../dist')),{
    extension: 'html'
  })

  app.use(async (ctx)=>{
    await ctx.render('index.html')
  })
}
