const Koa = require('koa');
// const ejs = require('ejs');
// const pug = require('pug');
// const { htmlTpl,ejsTpl,pugTpl } = require('./tpl');
const app = new Koa();
const views = require('koa-views');
const {
    resolve
} = require('path');
const mongoose = require('mongoose');
const { connect,initSchemas } = require('./database/init'); 
 
(async () => {
  await connect();
  initSchemas();
  const Movie = mongoose.model('Movie');
  const movies = await Movie.find({});
  console.log('movies: ', movies);
})();

app.use(views(resolve(__dirname, './views'), {
    extension: 'pug'
}))

app.use(async (ctx, next) => {
    await ctx.render('index', {
        you: 'zoomdong',
        me: 'fireairforce'
    })
})

app.listen(4456);