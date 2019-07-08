const Koa = require('koa');
const ejs = require('ejs');
const app = new Koa();

const { htmlTpl,ejsTpl } = require('./tpl');

app.use(async (ctx,next) => {
     // 设置渲染的返回头
     ctx.type = 'text/html;charset = utf-8'; 
     ctx.body = ejs.render(ejsTpl,{
         you:'zoomdong',
         me:'fireairforce'
     }); 
    
})

app.listen(4456);
