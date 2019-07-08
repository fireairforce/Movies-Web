const Koa = require('koa');
const app = new Koa();

const { normal } = require('./tpl')
app.use(async (ctx,next) => {
     // 设置渲染的返回头
     ctx.type = 'text/html;charset = utf-8'; 
     ctx.body = normal; 
    
})

app.listen(4455);
