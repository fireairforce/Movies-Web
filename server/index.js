const Koa = require('koa');
const ejs = require('ejs');
const pug = require('pug');
const app = new Koa();

const { htmlTpl,ejsTpl,pugTpl } = require('./tpl');

app.use(async (ctx,next) => {
     // 设置渲染的返回头
     ctx.type = 'text/html;charset = utf-8'; 
     ctx.body = pug.render(pugTpl, {
         you:"zoomdong",
         me:"fireairforce"
     })
    //  ctx.body = ejs.render(ejsTpl,{
    //      you:'zoomdong',
    //      me:'fireairforce'
    //  }); 
})

app.listen(4456);
